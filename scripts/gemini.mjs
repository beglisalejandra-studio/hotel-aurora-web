#!/usr/bin/env node
// Cliente local auditable de Google AI Studio (Gemini API, REST oficial). Sin dependencias.
//   node scripts/gemini.mjs tasks
//   node scripts/gemini.mjs models
//   node scripts/gemini.mjs selftest
//   node scripts/gemini.mjs run --task <tarea> --input <archivo> --out <archivo>
//        [--model <id>] [--max-output-tokens 4096] [--client-data | --synthetic]
// Variables: GEMINI_API_KEY (secreto; nunca se imprime) · GEMINI_MODEL · GEMINI_TIER=free|paid · GEMINI_API_BASE (tests)
// Códigos de salida: 0 ok · 1 error de API/validación · 2 sin clave/entrada · 3 bloqueado por la puerta de privacidad
import fs from 'node:fs';
import path from 'node:path';
import { TASKS, validateAgainstSchema } from './lib/gemini-tasks.mjs';
import { findSecrets } from './lib/guard-rules.mjs';
import { readJson, resolveAsset, writeFileEnsured } from './lib/util.mjs';

const versions = readJson(resolveAsset('config', 'versions.json'), {});
const argv = process.argv.slice(2);
const cmd = argv[0];
const opt = (n, d) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
const flag = (n) => argv.includes(n);

const base = (process.env.GEMINI_API_BASE || versions.gemini?.apiBase || 'https://generativelanguage.googleapis.com/v1beta').replace(/\/$/, '');
const model = opt('--model') || process.env.GEMINI_MODEL || versions.gemini?.defaultModel;
const tier = process.env.GEMINI_TIER === 'paid' ? 'paid' : 'free';

function apiKey() {
  const a = process.env.GEMINI_API_KEY;
  const b = process.env.GOOGLE_API_KEY;
  if (a && b) console.error('⚠ GEMINI_API_KEY y GOOGLE_API_KEY definidas: usando GEMINI_API_KEY. Deja solo una.');
  return a || b || null;
}

const die = (code, msg) => {
  console.error(msg);
  process.exit(code);
};

/** Llamada con reintentos SOLO en 429/5xx (máx. 3) y backoff. La clave va en cabecera, nunca en la URL. */
async function api(method, url, body, key, { retries = 3 } = {}) {
  for (let attempt = 0; ; attempt++) {
    let res;
    try {
      res = await fetch(url, {
        method,
        headers: { 'x-goog-api-key': key, ...(body ? { 'Content-Type': 'application/json' } : {}) },
        body: body ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(120000),
      });
    } catch (e) {
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 500 * 2 ** attempt));
        continue;
      }
      throw new Error(`sin conexión con la API (${e?.cause?.code || e.message}). ¿Política de red del entorno?`);
    }
    if ((res.status === 429 || res.status >= 500) && attempt < retries) {
      const ra = Number(res.headers.get('retry-after'));
      await new Promise((r) => setTimeout(r, (Number.isFinite(ra) && ra > 0 ? ra * 1000 : 500 * 2 ** attempt)));
      continue;
    }
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch { /* cuerpo no JSON */ }
    if (!res.ok) {
      const msg = json?.error?.message ?? text.slice(0, 200);
      const hint = res.status === 400 || res.status === 401 || res.status === 403 ? ' → clave inválida/revocada o sin permiso: genera una nueva en https://aistudio.google.com/apikey' : res.status === 404 ? ' → modelo inexistente: `node scripts/gemini.mjs models`' : res.status === 429 ? ' → cuota/límite alcanzado' : '';
      throw new Error(`HTTP ${res.status}: ${msg}${hint}`);
    }
    return json;
  }
}

async function listModels(key) {
  const out = [];
  let token = '';
  do {
    const j = await api('GET', `${base}/models?pageSize=100${token ? `&pageToken=${encodeURIComponent(token)}` : ''}`, null, key);
    out.push(...(j.models ?? []));
    token = j.nextPageToken ?? '';
  } while (token && out.length < 500);
  return out;
}

async function runTask({ task, inputText, key, maxTokens }) {
  const def = TASKS[task];
  const body = {
    systemInstruction: { parts: [{ text: def.system }] },
    contents: [{ role: 'user', parts: [{ text: `<datos>\n${inputText}\n</datos>` }] }],
    generationConfig: { temperature: 0.2, maxOutputTokens: maxTokens, responseMimeType: 'application/json', responseSchema: def.schema },
  };
  const j = await api('POST', `${base}/models/${encodeURIComponent(model)}:generateContent`, body, key);
  if (j.promptFeedback?.blockReason) throw new Error(`la API bloqueó el prompt: ${j.promptFeedback.blockReason}`);
  const cand = j.candidates?.[0];
  if (!cand) throw new Error('respuesta sin candidatos');
  if (cand.finishReason && !['STOP', 'FINISH_REASON_UNSPECIFIED'].includes(cand.finishReason)) {
    throw new Error(`generación incompleta (finishReason=${cand.finishReason}); sube --max-output-tokens o reduce la entrada`);
  }
  const text = (cand.content?.parts ?? []).map((p) => p.text ?? '').join('');
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('la respuesta no es JSON válido; no se "arregla" en silencio');
  }
  const errs = validateAgainstSchema(parsed, def.schema);
  if (errs.length) throw new Error(`la respuesta incumple el esquema de '${task}':\n  - ${errs.slice(0, 6).join('\n  - ')}`);
  return { result: parsed, usage: j.usageMetadata ?? null, model };
}

// ---------------------------------------------------------------------------------------------
async function main() {
  if (!cmd || ['-h', '--help', 'help'].includes(cmd)) {
    console.log(fs.readFileSync(new URL(import.meta.url), 'utf8').split('\n').slice(1, 9).map((l) => l.replace(/^\/\/ ?/, '')).join('\n'));
    return;
  }
  if (cmd === 'tasks') {
    for (const [k, v] of Object.entries(TASKS)) console.log(`${k.padEnd(20)} ${v.system.split('.')[0]}.`);
    return;
  }
  const key = apiKey();
  if (!key) die(2, 'BLOCKED: sin clave. Crea GEMINI_API_KEY en https://aistudio.google.com/apikey y guárdala como secreto del entorno (nunca en el chat ni en el repo).');

  if (cmd === 'models') {
    const ms = (await listModels(key)).filter((m) => (m.supportedGenerationMethods ?? []).includes('generateContent'));
    console.log(`${ms.length} modelos con generateContent (configurado: ${model}${ms.some((m) => m.name === `models/${model}`) ? ' ✓' : ' ✗ NO disponible'})`);
    for (const m of ms) console.log(`  ${m.name.replace(/^models\//, '')}${m.displayName ? `  — ${m.displayName}` : ''}`);
    return;
  }

  if (cmd === 'selftest') {
    const synthetic = 'Academia ficticia de cocina "Sabor Demo". Audiencia: adultos que quieren aprender cocina casera. Objetivo: inscripciones al curso de 4 semanas. Oferta: clases presenciales. (Texto SINTÉTICO de prueba; no es un cliente real.)';
    const r = await runTask({ task: 'brief-analysis', inputText: synthetic, key, maxTokens: 2048 });
    console.log(`✓ selftest ok · modelo ${r.model} · tier ${tier} · tokens ${r.usage?.totalTokenCount ?? '?'} · propuesta: ${r.result.proposition.slice(0, 90)}`);
    return;
  }

  if (cmd === 'run') {
    const task = opt('--task');
    const input = opt('--input');
    const out = opt('--out');
    if (!TASKS[task]) die(2, `Tarea desconocida '${task}'. Disponibles: ${Object.keys(TASKS).join(', ')}`);
    if (!input || !fs.existsSync(input)) die(2, `--input requerido y debe existir (${input ?? 'sin valor'})`);
    const inputText = fs.readFileSync(input, 'utf8');

    const secrets = findSecrets(inputText);
    if (secrets.length) die(3, `BLOQUEADO: la entrada contiene lo que parece un secreto (${secrets.join(', ')}). No se envía a ninguna API. Quítalo y rota esa credencial.`);

    // Puerta de privacidad: dentro de un proyecto (PROJECT.md) se asume dato de cliente salvo --synthetic.
    const inProject = fs.existsSync('PROJECT.md');
    const clientData = flag('--client-data') || (inProject && !flag('--synthetic'));
    if (clientData && tier !== 'paid') {
      die(3, 'BLOQUEADO por privacidad: en el plan GRATUITO Google puede usar el contenido para mejorar sus productos, y esta entrada se considera dato de cliente.\n' +
        '  → Activa facturación (plan de pago) y exporta GEMINI_TIER=paid; o usa --synthetic si los datos NO son reales; o analiza con Claude sin enviar nada a Gemini.');
    }
    const maxTokens = Number(opt('--max-output-tokens', 4096));
    const r = await runTask({ task, inputText, key, maxTokens });
    if (out) writeFileEnsured(out, JSON.stringify(r.result, null, 2) + '\n');
    else console.log(JSON.stringify(r.result, null, 2));
    console.error(`✓ ${task} · modelo ${r.model} · tier ${tier}${clientData ? ' · datos de cliente' : ''} · tokens in/out ${r.usage?.promptTokenCount ?? '?'}/${r.usage?.candidatesTokenCount ?? '?'}${out ? ` → ${out}` : ''}`);
    return;
  }
  die(2, `Comando desconocido '${cmd}'. Usa: tasks | models | selftest | run`);
}

main().catch((e) => die(1, `✗ ${e.message}`));
