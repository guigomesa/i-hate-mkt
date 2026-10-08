const IHM_POOLS = {
  source: ["redtube.com", "xvideos.com", "tibia.com"],
  medium: [
    "pombo-correio",
    "sinal-de-fumaca",
    "carro-de-som",
    "fax",
    "orkut",
    "fotolog",
    "msn",
    "mirc",
    "telegrama",
    "panfleto-no-semaforo",
    "boca-a-boca-da-tia",
    "corrente-de-whatsapp",
    "outdoor-na-br-116",
    "anuncio-no-classificados"
  ],
  campaign: [
    "Estagiário de Marketing Fica Sozinho com o Pixel do Facebook",
    "Gerente de Tráfego Pago Descobre o ROI Escondido",
    "Ela Pediu um Lead Qualificado e Recebeu 3 Bots",
    "CMO Flagrado Fazendo Teste A/B Sem Significância Estatística",
    "Social Media Atrevida Posta Story Sem Aprovação do Cliente",
    "Funil Completo: do Topo ao Fundo em 5 Minutos",
    "Remarketing Agressivo: Ele Não Parava de Me Seguir",
    "Três Estagiários e um Briefing Incompleto",
    "Copywriter Sussurra CTAs no Seu Ouvido",
    "Dupla Conversão no Escritório Vazio",
    "Ela Abriu o Excel e Viu o CAC de Verdade",
    "Diretor de Arte Aumenta a Logo Sem Pedir Permissão",
    "Growth Hacker Faz Opt-in Sem Consentimento",
    "Tráfego Direto Sem Proteção",
    "Primeira Vez Configurando o GTM e Ela Ficou Nervosa",
    "Atribuição Last Click Bem na Frente do Chefe",
    "Bounce Rate 100%: Ele Entrou e Saiu Rapidinho",
    "Brainstorm Selvagem na Sala de Reunião 3",
    "Cliente Aprova Peça na Sexta às 18h e Some",
    "Planner Abre a Planilha de Mídia Sem Pudor",
    "Webinar ao Vivo Sem Censura com 4 Pessoas Assistindo",
    "A Última Noite dos Cookies de Terceiros",
    "Lead Frio Esquentado com Nutrição Intensa",
    "Dashboard Proibido que o Diretor Não Pode Ver",
    "Engajamento Orgânico Caseiro Gravado no Celular",
    "Ele Prometeu Viralizar e Entregou 12 Likes",
    "Agência e Cliente Trocam Feedback a Noite Toda",
    "Hunt de Leads em Venore Sem Bless",
    "Exiva no Lead Que Sumiu do CRM",
    "Utevo Lux no Fundo do Funil",
    "Premium Account Comprada com a Verba de Mídia",
    "Ferumbras Aprova o Planejamento de Q4"
  ],
  term: [
    "como desligar o pixel sem ninguem perceber",
    "roi negativo e normal",
    "pixel do facebook nao dispara socorro",
    "comprar seguidor barato e seguro",
    "como explicar cpa de 400 reais",
    "exura vita",
    "taxa de rejeicao 100 por cento e bom",
    "como fingir que entendo de analytics",
    "persona do cliente ideal mora com a mae",
    "reuniao que podia ser email"
  ],
  id: ["69", "171", "24", "666", "1337", "8008"],
  platform: ["deep-web", "orkut", "bbs", "cliente-do-tibia", "fliperama"],
  format: ["gif-de-bom-dia", "powerpoint-com-transicao", "clipart", "wordart", "papel-de-pao"],
  tactic: ["remarketing-insistente", "spam-com-carinho", "cold-call-as-3-da-manha", "ligacao-no-domingo"]
};

const IHM_PARAMS = {
  utm_source: "source",
  mtm_source: "source",
  pk_source: "source",
  utm_medium: "medium",
  mtm_medium: "medium",
  pk_medium: "medium",
  mtm_placement: "medium",
  utm_campaign: "campaign",
  mtm_campaign: "campaign",
  mtm_cpn: "campaign",
  matomo_campaign: "campaign",
  pk_campaign: "campaign",
  pk_cpn: "campaign",
  piwik_campaign: "campaign",
  utm_content: "campaign",
  mtm_content: "campaign",
  pk_content: "campaign",
  mtm_group: "campaign",
  utm_term: "term",
  mtm_kwd: "term",
  mtm_keyword: "term",
  matomo_kwd: "term",
  pk_kwd: "term",
  pk_keyword: "term",
  piwik_kwd: "term",
  utm_id: "id",
  mtm_cid: "id",
  pk_cid: "id",
  utm_source_platform: "platform",
  utm_creative_format: "format",
  utm_marketing_tactic: "tactic"
};

const IHM_REMOVE = new Set([
  "gclid",
  "gclsrc",
  "gbraid",
  "wbraid",
  "dclid",
  "gad_source",
  "gad_campaignid",
  "srsltid",
  "_gl",
  "fbclid",
  "igshid",
  "msclkid",
  "ttclid",
  "li_fat_id",
  "twclid",
  "yclid",
  "epik",
  "sccid",
  "mc_cid",
  "mc_eid",
  "_hsenc",
  "_hsmi",
  "mkt_tok",
  "s_kwcid",
  "ef_id",
  "_kx",
  "oly_anon_id",
  "oly_enc_id",
  "vero_id",
  "vero_conv",
  "wickedid"
]);

const IHM_REMOVE_PREFIXES = ["hsa_"];

function ihmShouldRemove(key) {
  return IHM_REMOVE.has(key) || IHM_REMOVE_PREFIXES.some((prefix) => key.startsWith(prefix));
}

function ihmDecodeKey(rawKey) {
  try {
    return decodeURIComponent(rawKey.replace(/\+/g, " ")).toLowerCase();
  } catch {
    return null;
  }
}

function ihmRewrite(href, pick) {
  const url = new URL(href);
  if (url.search.length < 2) return null;
  let changed = false;
  const parts = url.search.slice(1).split("&").flatMap((part) => {
    const eq = part.indexOf("=");
    const rawKey = eq === -1 ? part : part.slice(0, eq);
    const key = ihmDecodeKey(rawKey);
    if (key === null) return [part];
    if (ihmShouldRemove(key)) {
      changed = true;
      return [];
    }
    const pool = IHM_PARAMS[key];
    if (!pool) return [part];
    changed = true;
    return [rawKey + "=" + encodeURIComponent(pick(IHM_POOLS[pool]))];
  });
  if (!changed) return null;
  url.search = parts.length ? "?" + parts.join("&") : "";
  return url.href;
}
