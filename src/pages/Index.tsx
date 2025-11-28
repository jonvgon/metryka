import { useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Clinic, FunnelData, CostData, AnalysisData, CalculatedRates } from '@/types/clinic';
import { ClinicSelector } from '@/components/ClinicSelector';
import { DateRangeSelector } from '@/components/DateRangeSelector';
import { FunnelDataInput } from '@/components/FunnelDataInput';
import { CostInput } from '@/components/CostInput';
import { RatesComparison } from '@/components/RatesComparison';
import { FunnelVisualization } from '@/components/FunnelVisualization';
import { CommercialAnalysis } from '@/components/CommercialAnalysis';
import { ExportButton } from '@/components/ExportButton';

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
};

const Index = () => {
  const [clinics, setClinics] = useLocalStorage<Clinic[]>('clinics', []);
  const [selectedClinicId, setSelectedClinicId] = useLocalStorage<string | null>('selectedClinicId', null);
  const [analyses, setAnalyses] = useLocalStorage<AnalysisData[]>('analyses', []);
  
  const [startDate, setStartDate] = useLocalStorage<string>('startDate', defaultDates.start);
  const [endDate, setEndDate] = useLocalStorage<string>('endDate', defaultDates.end);

  const selectedClinic = clinics.find(c => c.id === selectedClinicId) || null;

  const currentAnalysis = useMemo(() => {
    return analyses.find(
      a => a.clinicId === selectedClinicId && a.startDate === startDate && a.endDate === endDate
    );
  }, [analyses, selectedClinicId, startDate, endDate]);

  const funnel = currentAnalysis?.funnel || emptyFunnel;
  const costs = currentAnalysis?.costs || emptyCosts;
  const images = currentAnalysis?.images || [];
  const observations = currentAnalysis?.observations || '';

  const updateAnalysis = (updates: Partial<AnalysisData>) => {
    if (!selectedClinicId) return;

    setAnalyses(prev => {
      const existingIndex = prev.findIndex(
        a => a.clinicId === selectedClinicId && a.startDate === startDate && a.endDate === endDate
      );

      const newAnalysis: AnalysisData = {
        clinicId: selectedClinicId,
        startDate,
        endDate,
        funnel: updates.funnel || funnel,
        costs: updates.costs || costs,
        images: updates.images || images,
        observations: updates.observations ?? observations,
      };

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newAnalysis;
        return updated;
      } else {
        return [...prev, newAnalysis];
      }
    });
  };

  const rates: CalculatedRates = useMemo(() => {
    return {
      taxaAgendamento: funnel.leadsCRM ? (funnel.agendamentos / funnel.leadsCRM) * 100 : 0,
      taxaComparecimento: funnel.agendamentos ? (funnel.comparecimentos / funnel.agendamentos) * 100 : 0,
      taxaFechamento: funnel.comparecimentos ? (funnel.vendas / funnel.comparecimentos) * 100 : 0,
    };
  }, [funnel]);

  const handleAddClinic = (name: string) => {
    const newClinic: Clinic = {
      id: Date.now().toString(),
      name,
    };
    setClinics(prev => [...prev, newClinic]);
  };

  const handleDeleteClinic = (id: string) => {
    setClinics(prev => prev.filter(c => c.id !== id));
    setAnalyses(prev => prev.filter(a => a.clinicId !== id));
    if (selectedClinicId === id) {
      setSelectedClinicId(null);
    }
  };

  const handleSelectClinic = (clinic: Clinic | null) => {
    setSelectedClinicId(clinic?.id || null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Sistema de Análise Comercial
          </h1>
          <p className="text-muted-foreground mt-1">
            Análise semanal de clínicas odontológicas
          </p>
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
                onChange={(newFunnel) => updateAnalysis({ funnel: newFunnel })}
              />

              <CostInput
                data={costs}
                onChange={(newCosts) => updateAnalysis({ costs: newCosts })}
              />

              <RatesComparison rates={rates} />

              <FunnelVisualization data={funnel} />

              <CommercialAnalysis
                images={images}
                observations={observations}
                onImagesChange={(newImages) => updateAnalysis({ images: newImages })}
                onObservationsChange={(newObs) => updateAnalysis({ observations: newObs })}
              />

              <div className="flex justify-end">
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
