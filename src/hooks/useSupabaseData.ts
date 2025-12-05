import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Clinic, FunnelData, CostData, AnalysisData, CommercialInputData, AIAnalysisData } from '@/types/clinic';
import { Gestor } from '@/types/gestor';
import { toast } from 'sonner';

const emptyCommercialInput: CommercialInputData = {
  cplBom: null,
  leadsInteressados: null,
  comercialBom: null,
  comercialAplicouCpip: null,
  linkAtendimentosRuins: '',
  linkAtendimentosBons: '',
  proximosPassos: '',
};

const emptyAIAnalysis: AIAnalysisData = {
  diagnosticoComercial: '',
  explicacaoTecnica: '',
  recomendacoesIA: '',
};

export function useSupabaseData() {
  const [gestores, setGestores] = useState<Gestor[]>([]);
  const [clinics, setClinics] = useState<(Clinic & { gestorId?: string })[]>([]);
  const [analyses, setAnalyses] = useState<AnalysisData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch gestores
  const fetchGestores = useCallback(async () => {
    const { data, error } = await supabase
      .from('gestores')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching gestores:', error);
      toast.error('Erro ao carregar gestores');
      return;
    }

    setGestores(data.map(g => ({ id: g.id, name: g.name })));
  }, []);

  // Fetch clinics
  const fetchClinics = useCallback(async () => {
    const { data, error } = await supabase
      .from('clinics')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching clinics:', error);
      toast.error('Erro ao carregar clínicas');
      return;
    }

    setClinics(data.map(c => ({ id: c.id, name: c.name, gestorId: c.gestor_id || undefined })));
  }, []);

  // Fetch analyses
  const fetchAnalyses = useCallback(async () => {
    const { data, error } = await supabase
      .from('analyses')
      .select('*');

    if (error) {
      console.error('Error fetching analyses:', error);
      toast.error('Erro ao carregar análises');
      return;
    }

    setAnalyses(data.map(a => ({
      clinicId: a.clinic_id,
      startDate: a.start_date,
      endDate: a.end_date,
      funnel: {
        leadsMarketing: a.leads_marketing,
        leadsCRM: a.leads_crm,
        agendamentos: a.agendamentos,
        comparecimentos: a.comparecimentos,
        vendas: a.vendas,
      },
      costs: {
        custoLeadMeta: Number(a.custo_lead_meta),
        custoLeadGoogle: Number(a.custo_lead_google),
        valorGastoMeta: Number(a.valor_gasto_meta),
        valorGastoGoogle: Number(a.valor_gasto_google),
      },
      images: a.images || [],
      observations: a.observations || '',
      commercialInput: {
        cplBom: a.cpl_bom,
        leadsInteressados: a.leads_interessados,
        comercialBom: a.comercial_bom,
        comercialAplicouCpip: a.comercial_aplicou_cpip,
        linkAtendimentosRuins: a.link_atendimentos_ruins || '',
        linkAtendimentosBons: a.link_atendimentos_bons || '',
        proximosPassos: a.proximos_passos || '',
      },
      aiAnalysis: {
        diagnosticoComercial: a.diagnostico_comercial || '',
        explicacaoTecnica: a.explicacao_tecnica || '',
        recomendacoesIA: a.recomendacoes_ia || '',
      },
    })));
  }, []);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchGestores(), fetchClinics(), fetchAnalyses()]);
      setLoading(false);
    };
    loadData();
  }, [fetchGestores, fetchClinics, fetchAnalyses]);

  // Add gestor
  const addGestor = async (name: string) => {
    const { data, error } = await supabase
      .from('gestores')
      .insert({ name })
      .select()
      .single();

    if (error) {
      console.error('Error adding gestor:', error);
      toast.error('Erro ao adicionar gestor');
      return null;
    }

    const newGestor: Gestor = { id: data.id, name: data.name };
    setGestores(prev => [newGestor, ...prev]);
    toast.success('Gestor adicionado com sucesso');
    return newGestor;
  };

  // Delete gestor
  const deleteGestor = async (id: string) => {
    const { error } = await supabase
      .from('gestores')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting gestor:', error);
      toast.error('Erro ao excluir gestor');
      return false;
    }

    setGestores(prev => prev.filter(g => g.id !== id));
    setClinics(prev => prev.filter(c => c.gestorId !== id));
    toast.success('Gestor excluído com sucesso');
    return true;
  };

  // Add clinic
  const addClinic = async (name: string, gestorId?: string) => {
    const { data, error } = await supabase
      .from('clinics')
      .insert({ name, gestor_id: gestorId })
      .select()
      .single();

    if (error) {
      console.error('Error adding clinic:', error);
      toast.error('Erro ao adicionar clínica');
      return null;
    }

    const newClinic = { id: data.id, name: data.name, gestorId: data.gestor_id || undefined };
    setClinics(prev => [newClinic, ...prev]);
    toast.success('Clínica adicionada com sucesso');
    return newClinic;
  };

  // Delete clinic
  const deleteClinic = async (id: string) => {
    // First delete related analyses
    await supabase.from('analyses').delete().eq('clinic_id', id);
    
    const { error } = await supabase
      .from('clinics')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting clinic:', error);
      toast.error('Erro ao excluir clínica');
      return false;
    }

    setClinics(prev => prev.filter(c => c.id !== id));
    setAnalyses(prev => prev.filter(a => a.clinicId !== id));
    toast.success('Clínica excluída com sucesso');
    return true;
  };

  // Save analysis
  const saveAnalysis = async (
    clinicId: string,
    startDate: string,
    endDate: string,
    funnel: FunnelData,
    costs: CostData,
    images: string[],
    observations: string,
    commercialInput: CommercialInputData = emptyCommercialInput,
    aiAnalysis: AIAnalysisData = emptyAIAnalysis
  ) => {
    setSaving(true);
    
    const analysisData = {
      clinic_id: clinicId,
      start_date: startDate,
      end_date: endDate,
      leads_marketing: funnel.leadsMarketing,
      leads_crm: funnel.leadsCRM,
      agendamentos: funnel.agendamentos,
      comparecimentos: funnel.comparecimentos,
      vendas: funnel.vendas,
      custo_lead_meta: costs.custoLeadMeta,
      custo_lead_google: costs.custoLeadGoogle,
      valor_gasto_meta: costs.valorGastoMeta,
      valor_gasto_google: costs.valorGastoGoogle,
      images,
      observations,
      cpl_bom: commercialInput.cplBom,
      leads_interessados: commercialInput.leadsInteressados,
      comercial_bom: commercialInput.comercialBom,
      comercial_aplicou_cpip: commercialInput.comercialAplicouCpip,
      link_atendimentos_ruins: commercialInput.linkAtendimentosRuins,
      link_atendimentos_bons: commercialInput.linkAtendimentosBons,
      proximos_passos: commercialInput.proximosPassos,
      diagnostico_comercial: aiAnalysis.diagnosticoComercial,
      explicacao_tecnica: aiAnalysis.explicacaoTecnica,
      recomendacoes_ia: aiAnalysis.recomendacoesIA,
    };

    // Check if analysis exists
    const { data: existing } = await supabase
      .from('analyses')
      .select('id')
      .eq('clinic_id', clinicId)
      .eq('start_date', startDate)
      .eq('end_date', endDate)
      .maybeSingle();

    let error;
    if (existing) {
      const result = await supabase
        .from('analyses')
        .update(analysisData)
        .eq('id', existing.id);
      error = result.error;
    } else {
      const result = await supabase
        .from('analyses')
        .insert(analysisData);
      error = result.error;
    }

    setSaving(false);

    if (error) {
      console.error('Error saving analysis:', error);
      toast.error('Erro ao salvar análise');
      return false;
    }

    // Update local state
    const newAnalysis: AnalysisData = {
      clinicId,
      startDate,
      endDate,
      funnel,
      costs,
      images,
      observations,
      commercialInput,
      aiAnalysis,
    };

    setAnalyses(prev => {
      const existingIndex = prev.findIndex(
        a => a.clinicId === clinicId && a.startDate === startDate && a.endDate === endDate
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newAnalysis;
        return updated;
      }
      return [...prev, newAnalysis];
    });

    toast.success('Análise salva com sucesso');
    return true;
  };

  return {
    gestores,
    clinics,
    analyses,
    loading,
    saving,
    addGestor,
    deleteGestor,
    addClinic,
    deleteClinic,
    saveAnalysis,
    refetch: () => Promise.all([fetchGestores(), fetchClinics(), fetchAnalyses()]),
  };
}
