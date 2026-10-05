// Validador de creative/manifest.json (sin dependencias). Devuelve {errors, warnings}.
import { tierFor } from './video-score.mjs';

const TYPES = ['image', 'microvideo', 'hero-video', 'full-pipeline'];
const STATUS = ['planned', 'generating', 'review', 'approved', 'rejected'];
const OUT_STATE = ['draft', 'approved', 'rejected'];
const OUT_KIND = ['video', 'image', 'poster', 'caption'];
const DRAFT_DIR = 'creative/generated-drafts/';

export function emptyManifest(project = 'PROJECT_SLUG') {
  return { schema_version: 1, project, pages: [] };
}

export function validateManifest(m, config) {
  const errors = [];
  const warnings = [];
  const err = (p, msg) => errors.push(`${p}: ${msg}`);
  const warn = (p, msg) => warnings.push(`${p}: ${msg}`);

  if (!m || typeof m !== 'object') return { errors: ['manifest no es un objeto JSON'], warnings };
  if (m.schema_version !== 1) err('schema_version', 'debe ser 1');
  if (typeof m.project !== 'string' || !m.project) err('project', 'requerido');
  if (!Array.isArray(m.pages)) {
    err('pages', 'debe ser un array');
    return { errors, warnings };
  }

  const seen = new Set();
  m.pages.forEach((pg, i) => {
    const at = `pages[${i}]${pg?.page ? `(${pg.page})` : ''}`;
    if (typeof pg?.page !== 'string' || !pg.page) return err(at, "'page' requerido");
    if (seen.has(pg.page)) err(at, 'página duplicada');
    seen.add(pg.page);

    if (!TYPES.includes(pg.type)) err(at, `type inválido (${TYPES.join('|')})`);
    if (typeof pg.score !== 'number' || pg.score < 0 || pg.score > 100) err(at, 'score debe ser 0-100');
    if (typeof pg.reason !== 'string' || pg.reason.length < 10) err(at, "'reason' requerido (registra por qué se eligió ese tipo)");
    if (!STATUS.includes(pg.status)) err(at, `status inválido (${STATUS.join('|')})`);

    if (config && typeof pg.score === 'number' && TYPES.includes(pg.type)) {
      const expected = tierFor(pg.score, config).id;
      if (expected !== pg.type && !pg.override_reason) err(at, `type '${pg.type}' no coincide con score ${pg.score} (esperado '${expected}'). Añade 'override_reason' si es deliberado.`);
    }

    const isVideo = pg.type && pg.type !== 'image';
    // En 'planned' aún no hay activos: poster/fallback se exigen al generar outputs, revisar o aprobar.
    const needsAssets = isVideo && (pg.status !== 'planned' || (pg.outputs ?? []).length > 0);
    if (isVideo) {
      if (needsAssets && !pg.poster) err(at, 'los videos requieren poster');
      if (needsAssets && !pg.fallback) err(at, 'los videos requieren fallback estático');
      if (pg.audio === true && !(pg.captions?.length > 0)) err(at, 'video con audio requiere captions');
    }
    if (!Array.isArray(pg.references)) warn(at, "sin 'references' (la referencia es el contrato visual)");
    if (!pg.constraints?.preserve?.length) warn(at, "sin 'constraints.preserve' (qué NO puede cambiar: producto, forma, colores, logo…)");

    (pg.outputs ?? []).forEach((o, j) => {
      const oa = `${at}.outputs[${j}]`;
      if (!o.path) return err(oa, 'path requerido');
      if (!OUT_KIND.includes(o.kind)) err(oa, `kind inválido (${OUT_KIND.join('|')})`);
      if (!OUT_STATE.includes(o.state)) err(oa, `state inválido (${OUT_STATE.join('|')})`);
      if (o.state === 'approved' && o.path.startsWith(DRAFT_DIR)) err(oa, `un output aprobado no puede vivir en ${DRAFT_DIR}`);
      if (o.state === 'draft' && !o.path.startsWith(DRAFT_DIR)) warn(oa, `los borradores deberían estar en ${DRAFT_DIR}`);
      if (o.kind === 'video') {
        if (config && !config.aspects.includes(o.aspect)) err(oa, `aspect inválido (${config.aspects.join('|')})`);
        const budget = config?.budgets?.[pg.type];
        if (budget) {
          const sink = o.state === 'approved' ? err : warn;
          if (typeof o.duration_s !== 'number') sink(oa, 'duration_s requerido');
          else if (o.duration_s > budget.max_seconds) sink(oa, `duración ${o.duration_s}s excede ${budget.max_seconds}s de ${pg.type}`);
          if (typeof o.bytes !== 'number') sink(oa, 'bytes requerido');
          else if (o.bytes > budget.max_bytes) sink(oa, `peso ${o.bytes} B excede ${budget.max_bytes} B de ${pg.type}`);
        }
      }
    });

    if (pg.status === 'approved') {
      if (!pg.approval?.by || !pg.approval?.at) err(at, "status 'approved' requiere approval.by y approval.at (aprobación humana)");
      if ((pg.outputs ?? []).some((o) => o.state !== 'approved' && o.state !== 'rejected')) err(at, "status 'approved' con outputs aún en 'draft'");
    }
  });

  return { errors, warnings };
}
