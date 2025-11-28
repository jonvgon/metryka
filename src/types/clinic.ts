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
}

export interface AnalysisData {
  clinicId: string;
  startDate: string;
  endDate: string;
  funnel: FunnelData;
  costs: CostData;
  images: string[];
  observations: string;
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
