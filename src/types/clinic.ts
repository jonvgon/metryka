export interface Clinic {
  id: string;
  name: string;
}

export interface FunnelData {
  leadsMarketing: number;
  leadsCRM: number;
  agendamentos: number;
  comparecimentos: number;
  vendas: number;
}

export interface CostData {
  custoLeadMeta: number;
  custoLeadGoogle: number;
  valorGastoMeta: number;
  valorGastoGoogle: number;
}

export interface CommercialInputData {
  cplBom: boolean | null;
  leadsInteressados: boolean | null;
  comercialBom: boolean | null;
  comercialAplicouCpip: boolean | null;
  linkAtendimentosRuins: string;
  linkAtendimentosBons: string;
  proximosPassos: string;
}

export interface AIAnalysisData {
  diagnosticoComercial: string;
  explicacaoTecnica: string;
  recomendacoesIA: string;
}

export interface AnalysisData {
  clinicId: string;
  startDate: string;
  endDate: string;
  funnel: FunnelData;
  costs: CostData;
  images: string[];
  observations: string;
  commercialInput: CommercialInputData;
  aiAnalysis: AIAnalysisData;
}

export interface CalculatedRates {
  taxaAgendamento: number;
  taxaComparecimento: number;
  taxaFechamento: number;
}

export const METAS = {
  agendamento: 40,
  comparecimento: 40,
  fechamento: 30,
};
