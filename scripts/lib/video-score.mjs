// VIDEO_SCORE: decide imagen / microvideo / video hero / pipeline completo. Determinista y configurable.
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const num = (v, lo, hi, name) => {
  const n = Number(v);
  if (!Number.isFinite(n) || n < lo || n > hi) throw new Error(`Campo '${name}' debe ser un número entre ${lo} y ${hi} (recibido: ${JSON.stringify(v)})`);
  return n;
};

function pick(table, key, name) {
  if (!(key in table)) throw new Error(`Valor '${key}' no válido para '${name}'. Opciones: ${Object.keys(table).join(', ')}`);
  return table[key];
}

export function tierFor(score, config) {
  const tiers = [...config.tiers].sort((a, b) => a.min - b.min);
  let t = tiers[0];
  for (const x of tiers) if (score >= x.min) t = x;
  return t;
}

/** input: ver docs/pipelines/video-score.md. Devuelve {score, tier, breakdown, reason}. */
export function computeVideoScore(input, config) {
  const W = config.weights;
  const P = config.penalties;
  const b = [];
  const add = (factor, points, why) => b.push({ factor, points: Math.round(points * 10) / 10, why });

  const dem = num(input.demonstration_need, 0, 5, 'demonstration_need');
  const atm = num(input.atmosphere_need, 0, 5, 'atmosphere_need');
  const assets = num(input.assets_available, 0, 5, 'assets_available');
  const mobileShare = num(input.mobile_share, 0, 1, 'mobile_share');
  const mobilePrio = num(input.mobile_performance_priority, 0, 5, 'mobile_performance_priority');
  const motionRisk = num(input.motion_sensitivity_risk ?? 0, 0, 5, 'motion_sensitivity_risk');
  const budgetKb = num(input.weight_budget_kb ?? 1e9, 1, 1e9, 'weight_budget_kb');
  const refs = input.references ?? { count: 0, with_video_hero: 0 };
  const refCount = num(refs.count ?? 0, 0, 1e6, 'references.count');
  const refVideo = num(refs.with_video_hero ?? 0, 0, refCount || 0, 'references.with_video_hero');

  add('demostración', (W.demonstration * dem) / 5, `necesidad de demostrar con movimiento: ${dem}/5`);
  add('atmósfera', (W.atmosphere * atm) / 5, `peso de la emoción/ambiente: ${atm}/5`);
  add('activos disponibles', (W.assets_available * assets) / 5, `calidad del material fuente/referencias: ${assets}/5`);
  add('referencias', W.references * (refCount ? refVideo / refCount : 0), `${refVideo}/${refCount} referencias usan video hero`);
  add('objetivo de conversión', pick(W.conversion_goal, input.conversion_goal, 'conversion_goal'), `objetivo: ${input.conversion_goal}`);
  add('tipo de oferta', pick(W.offer_type, input.offer_type, 'offer_type'), `oferta: ${input.offer_type}`);
  add('audiencia', pick(W.audience, input.audience, 'audience'), `audiencia: ${input.audience}`);
  add('plataforma', pick(W.platform, input.platform, 'platform'), `plataforma: ${input.platform}`);

  const mobilePenalty = P.mobile_max * mobileShare * (mobilePrio / 5);
  add('penal. rendimiento móvil', -mobilePenalty, `${Math.round(mobileShare * 100)}% tráfico móvil × prioridad de rendimiento ${mobilePrio}/5`);

  const step = P.weight_budget_kb.find((s) => budgetKb <= s.max_kb);
  add('penal. peso de página', -(step?.points ?? 0), step ? `presupuesto ${budgetKb} KB ≤ ${step.max_kb} KB` : 'presupuesto de peso holgado');

  add('penal. sensibilidad al movimiento', -(P.motion_sensitivity_max * motionRisk) / 5, `riesgo de sensibilidad al movimiento: ${motionRisk}/5`);

  const raw = b.reduce((s, x) => s + x.points, 0);
  const score = clamp(Math.round(raw), 0, 100);
  const tier = tierFor(score, config);
  const top = [...b].sort((x, y) => Math.abs(y.points) - Math.abs(x.points)).slice(0, 3);
  const reason = `VIDEO_SCORE ${score} → ${tier.label}. Factores principales: ${top.map((x) => `${x.factor} (${x.points > 0 ? '+' : ''}${x.points})`).join('; ')}.`;
  return { page: input.page ?? null, score, tier: tier.id, breakdown: b, reason };
}
