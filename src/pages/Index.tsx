import { useMemo, useState, useEffect } from 'react';
import { Clinic, FunnelData, CostData, CalculatedRates, CommercialInputData, AIAnalysisData } from '@/types/clinic';
import { Gestor } from '@/types/gestor';
import { GestorSelector } from '@/components/GestorSelector';
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
  const { gestores, clinics, analyses, loading, saving, addGestor, deleteGestor, addClinic, deleteClinic, saveAnalysis } = useSupabaseData();
  
  const [selectedGestorId, setSelectedGestorId] = useState<string | null>(null);
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

  const selectedGestor = gestores.find(g => g.id === selectedGestorId) || null;
  const selectedClinic = clinics.find(c => c.id === selectedClinicId) || null;
  
  // Filter clinics by selected gestor
  const filteredClinics = selectedGestorId 
    ? clinics.filter(c => c.gestorId === selectedGestorId)
    : clinics;

  // Load and aggregate analyses when clinic/dates change
  useEffect(() => {
    // Find all analyses for the clinic that overlap with the selected date range
    const clinicAnalyses = analyses.filter(a => {
      if (a.clinicId !== selectedClinicId) return false;
      // Check if the analysis date range overlaps with the selected range
      return a.startDate >= startDate && a.endDate <= endDate;
    });

    if (clinicAnalyses.length > 0) {
      // Sum the fields that should be aggregated
      const aggregatedFunnel: FunnelData = {
        leadsMarketing: clinicAnalyses.reduce((sum, a) => sum + a.funnel.leadsMarketing, 0),
        leadsCRM: clinicAnalyses.reduce((sum, a) => sum + a.funnel.leadsCRM, 0),
        agendamentos: clinicAnalyses.reduce((sum, a) => sum + a.funnel.agendamentos, 0),
        comparecimentos: clinicAnalyses.reduce((sum, a) => sum + a.funnel.comparecimentos, 0),
        vendas: clinicAnalyses.reduce((sum, a) => sum + a.funnel.vendas, 0),
      };

      // Sum valorGasto fields, but NOT custoLead fields (use the latest/last value)
      const aggregatedCosts: CostData = {
        valorGastoMeta: clinicAnalyses.reduce((sum, a) => sum + a.costs.valorGastoMeta, 0),
        valorGastoGoogle: clinicAnalyses.reduce((sum, a) => sum + a.costs.valorGastoGoogle, 0),
        // CPL não deve ser somado - usar o último valor ou o mais recente
        custoLeadMeta: clinicAnalyses[clinicAnalyses.length - 1].costs.custoLeadMeta,
        custoLeadGoogle: clinicAnalyses[clinicAnalyses.length - 1].costs.custoLeadGoogle,
      };

      // Aggregate images from all analyses
      const allImages = clinicAnalyses.flatMap(a => a.images);
      
      // Use the latest observation and commercial input
      const latestAnalysis = clinicAnalyses[clinicAnalyses.length - 1];

      setFunnel(aggregatedFunnel);
      setCosts(aggregatedCosts);
      setImages(allImages);
      setObservations(latestAnalysis.observations);
      setCommercialInput(latestAnalysis.commercialInput || emptyCommercialInput);
      setAIAnalysis(latestAnalysis.aiAnalysis || emptyAIAnalysis);
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

  const handleAddGestor = async (name: string) => {
    const newGestor = await addGestor(name);
    if (newGestor) {
      setSelectedGestorId(newGestor.id);
    }
  };

  const handleDeleteGestor = async (id: string) => {
    await deleteGestor(id);
    if (selectedGestorId === id) {
      setSelectedGestorId(null);
      setSelectedClinicId(null);
    }
  };

  const handleSelectGestor = (gestor: Gestor | null) => {
    setSelectedGestorId(gestor?.id || null);
    setSelectedClinicId(null); // Reset clinic when gestor changes
  };

  const handleAddClinic = async (name: string) => {
    if (!selectedGestorId) return;
    const newClinic = await addClinic(name, selectedGestorId);
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
            <GestorSelector
              gestores={gestores}
              selectedGestor={selectedGestor}
              onAddGestor={handleAddGestor}
              onSelectGestor={handleSelectGestor}
              onDeleteGestor={handleDeleteGestor}
            />
            <DateRangeSelector
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
          </div>

          {selectedGestor && (
            <ClinicSelector
              clinics={filteredClinics}
              selectedClinic={selectedClinic}
              onAddClinic={handleAddClinic}
              onSelectClinic={handleSelectClinic}
              onDeleteClinic={handleDeleteClinic}
            />
          )}

          {selectedClinic && (
            <>
              <FunnelDataInput
                data={funnel}
                onChange={setFunnel}
              />

              <CostInput
                data={costs}
                onChange={setCosts}
                leadsMarketing={funnel.leadsMarketing}
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

          {!selectedGestor && (
            <div className="text-center py-16 text-muted-foreground">
              <p>Selecione ou cadastre um gestor para começar.</p>
            </div>
          )}

          {selectedGestor && !selectedClinic && (
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
