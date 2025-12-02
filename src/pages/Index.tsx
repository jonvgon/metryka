import { useMemo, useState, useEffect } from 'react';
import { Clinic, FunnelData, CostData, CalculatedRates, CommercialInputData, AIAnalysisData } from '@/types/clinic';
import { ClinicSelector } from '@/components/ClinicSelector';
import { DateRangeSelector } from '@/components/DateRangeSelector';
import { FunnelDataInput } from '@/components/FunnelDataInput';
import { CostInput } from '@/components/CostInput';
import { RatesComparison } from '@/components/RatesComparison';
import { FunnelVisualization } from '@/components/FunnelVisualization';
import { CommercialAnalysis } from '@/components/CommercialAnalysis';
import { CommercialInputSection } from '@/components/CommercialInputSection';
import { ExportButton } from '@/components/ExportButton';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Save, Loader2, Activity } from 'lucide-react';

const getDefaultDates = () => {
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  return {
    start: weekAgo.toISOString().split('T')[0],
    end: today.toISOString().split('T')[0],
  };
};

const defaultDates = getDefaultDates();

const emptyFunnel: FunnelData = {
  leadsMarketing: 0,
  leadsCRM: 0,
  agendamentos: 0,
  comparecimentos: 0,
  vendas: 0,
};

const emptyCosts: CostData = {
  custoLeadMeta: 0,
  custoLeadGoogle: 0,
  valorGastoMeta: 0,
  valorGastoGoogle: 0,
};

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

const Index = () => {
  const { clinics, analyses, loading, saving, addClinic, deleteClinic, saveAnalysis } = useSupabaseData();
  
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>(defaultDates.start);
  const [endDate, setEndDate] = useState<string>(defaultDates.end);
  
  // Local state for form data
  const [funnel, setFunnel] = useState<FunnelData>(emptyFunnel);
  const [costs, setCosts] = useState<CostData>(emptyCosts);
  const [images, setImages] = useState<string[]>([]);
  const [observations, setObservations] = useState<string>('');
  const [commercialInput, setCommercialInput] = useState<CommercialInputData>(emptyCommercialInput);
  const [aiAnalysis, setAIAnalysis] = useState<AIAnalysisData>(emptyAIAnalysis);

  const selectedClinic = clinics.find(c => c.id === selectedClinicId) || null;

  // Load existing analysis when clinic/dates change
  useEffect(() => {
    const existingAnalysis = analyses.find(
      a => a.clinicId === selectedClinicId && a.startDate === startDate && a.endDate === endDate
    );
    
    if (existingAnalysis) {
      setFunnel(existingAnalysis.funnel);
      setCosts(existingAnalysis.costs);
      setImages(existingAnalysis.images);
      setObservations(existingAnalysis.observations);
      setCommercialInput(existingAnalysis.commercialInput || emptyCommercialInput);
      setAIAnalysis(existingAnalysis.aiAnalysis || emptyAIAnalysis);
    } else {
      setFunnel(emptyFunnel);
      setCosts(emptyCosts);
      setImages([]);
      setObservations('');
      setCommercialInput(emptyCommercialInput);
      setAIAnalysis(emptyAIAnalysis);
    }
  }, [analyses, selectedClinicId, startDate, endDate]);

  const rates: CalculatedRates = useMemo(() => {
    return {
      taxaAgendamento: funnel.leadsCRM ? (funnel.agendamentos / funnel.leadsCRM) * 100 : 0,
      taxaComparecimento: funnel.agendamentos ? (funnel.comparecimentos / funnel.agendamentos) * 100 : 0,
      taxaFechamento: funnel.comparecimentos ? (funnel.vendas / funnel.comparecimentos) * 100 : 0,
    };
  }, [funnel]);

  const handleAddClinic = async (name: string) => {
    const newClinic = await addClinic(name);
    if (newClinic) {
      setSelectedClinicId(newClinic.id);
    }
  };

  const handleDeleteClinic = async (id: string) => {
    await deleteClinic(id);
    if (selectedClinicId === id) {
      setSelectedClinicId(null);
    }
  };

  const handleSelectClinic = (clinic: Clinic | null) => {
    setSelectedClinicId(clinic?.id || null);
  };

  const handleSave = async () => {
    if (!selectedClinicId) return;
    await saveAnalysis(
      selectedClinicId, 
      startDate, 
      endDate, 
      funnel, 
      costs, 
      images, 
      observations,
      commercialInput,
      aiAnalysis
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Sistema de Análise Comercial
              </h1>
              <p className="text-muted-foreground text-sm">
                Análise semanal de clínicas odontológicas
              </p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ClinicSelector
              clinics={clinics}
              selectedClinic={selectedClinic}
              onAddClinic={handleAddClinic}
              onSelectClinic={handleSelectClinic}
              onDeleteClinic={handleDeleteClinic}
            />
            <DateRangeSelector
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
          </div>

          {selectedClinic && (
            <>
              <FunnelDataInput
                data={funnel}
                onChange={setFunnel}
              />

              <CostInput
                data={costs}
                onChange={setCosts}
              />

              <RatesComparison rates={rates} />

              <FunnelVisualization data={funnel} />

              <CommercialAnalysis
                images={images}
                observations={observations}
                onImagesChange={setImages}
                onObservationsChange={setObservations}
              />

              <CommercialInputSection
                data={commercialInput}
                onChange={setCommercialInput}
              />

              <div className="flex justify-end gap-4">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Salvar
                </Button>
                <ExportButton
                  clinic={selectedClinic}
                  startDate={startDate}
                  endDate={endDate}
                  funnel={funnel}
                  costs={costs}
                  rates={rates}
                  images={images}
                  observations={observations}
                />
              </div>
            </>
          )}

          {!selectedClinic && (
            <div className="text-center py-16 text-muted-foreground">
              <p>Selecione ou cadastre uma clínica para começar a análise.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
