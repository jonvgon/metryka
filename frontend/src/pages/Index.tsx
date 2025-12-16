import { useMemo, useState, useEffect } from "react";
import {
  Clinic,
  FunnelData,
  CalculatedRates,
  CommercialInputData,
  AIAnalysisData,
} from "@/types/clinic";
import { Gestor } from "@/types/gestor";
import { GestorSelector } from "@/components/GestorSelector";
import { FunnelDataInput } from "@/components/FunnelDataInput";
import { ClinicSelector } from "@/components/ClinicSelector";
import { DateRangeSelector } from "@/components/DateRangeSelector";
import { CostInput } from "@/components/CostInput";
import { RatesComparison } from "@/components/RatesComparison";
import { FunnelVisualization } from "@/components/FunnelVisualization";
import { CommercialAnalysis } from "@/components/CommercialAnalysis";
import { CommercialInputSection } from "@/components/CommercialInputSection";
import { ExportButton } from "@/components/ExportButton";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Save, Loader2, Activity } from "lucide-react";
import { SalesResultsInput } from "@/components/SalesResultsInput";

const getDefaultDates = () => {
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  return {
    start: weekAgo.toISOString().split("T")[0],
    end: today.toISOString().split("T")[0],
  };
};

const defaultDates = getDefaultDates();

const emptyCommercialInput: CommercialInputData = {
  cplBom: null,
  leadsInteressados: null,
  comercialBom: null,
  comercialAplicouCpip: null,
  linkAtendimentosRuins: "",
  linkAtendimentosBons: "",
  proximosPassos: "",
};

const Index = () => {
  const {
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
  } = useSupabaseData();

  // useEffect(() => {
  //   const changeLogIn = async () => {
  //     const response = await fetch("/api/auth/status");
  //     const responseData = await response.json();
  //     setLoggedIn(await responseData.loggedIn);
  //   };

  //   changeLogIn();
  // }, []);

  const [selectedGestorId, setSelectedGestorId] = useState<string | null>(null);
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>(defaultDates.start);
  const [endDate, setEndDate] = useState<string>(defaultDates.end);
  const [dataVisibility, setDataVisibility] = useState<string | null>("false");
  const [selectedClinicName, setSelectedClinicName] = useState<string | null>(
    null
  );

  const emptyFunnel: FunnelData = {
    leadsMarketing: 0,
    leadsCRM: 0,
    agendamentos: 0,
    comparecimentos: 0,
    vendas: 0,
  };

  const emptySalesResults: SalesResultsData = {
    valorFechamento: 0,
    orcamentoAberto: 0,
    leadsPerdidos: 0,
    motivoPerdido: "",
  };

  const emptyCommercialInput: CommercialInputData = {
    cplBom: null,
    leadsInteressados: null,
    comercialBom: null,
    comercialAplicouCpip: null,
    linkAtendimentosRuins: "",
    linkAtendimentosBons: "",
    proximosPassos: "",
  };

  // Local state for form data
  const [funnel, setFunnel] = useState<FunnelData>({});
  const [leadsMarketing, setLeadsMarketing] = useState<number>(0);
  const [salesResults, setSalesResults] =
    useState<SalesResultsData>(emptySalesResults);
  const [costs, setCosts] = useState<{
    valorGastoGoogle: number;
    valorGastoMeta: number;
  }>({
    valorGastoGoogle: 0,
    valorGastoMeta: 0,
  });
  const [images, setImages] = useState<string[]>([]);
  const [observations, setObservations] = useState<string>("");
  const [commercialInput, setCommercialInput] =
    useState<CommercialInputData>(emptyCommercialInput);
  const selectedGestor =
    gestores.find((g) => g.id === selectedGestorId) || null;
  const selectedClinic = clinics.find((c) => c.id === selectedClinicId) || null;

  // Filter clinics by selected gestor
  const filteredClinics = selectedGestorId
    ? clinics.filter((c) => c.gestorId === selectedGestorId)
    : clinics;

  useEffect(() => {
    let googleData;
    let spendResponseData;
    let conversionResponseData;
    let logged;

    const timer = setTimeout(() => {
      const clinicAnalyses = analyses.filter((a) => {
        if (a.clinicId !== selectedClinicId) return false;
        // Check if the analysis date range overlaps with the selected range
        return a.startDate >= startDate && a.endDate <= endDate;
      });

      if (selectedClinicId) {
        setDataVisibility("loading");
      } else {
        setDataVisibility("false");
      }

      if (clinicAnalyses.length > 0) {
        const aggregatedFunnel: FunnelData = {
          leadsMarketing: clinicAnalyses.reduce(
            (sum, a) => sum + a.funnel.leadsMarketing,
            0
          ),
          leadsCRM: clinicAnalyses.reduce(
            (sum, a) => sum + a.funnel.leadsCRM,
            0
          ),
          agendamentos: clinicAnalyses.reduce(
            (sum, a) => sum + a.funnel.agendamentos,
            0
          ),
          comparecimentos: clinicAnalyses.reduce(
            (sum, a) => sum + a.funnel.comparecimentos,
            0
          ),
          vendas: clinicAnalyses.reduce((sum, a) => sum + a.funnel.vendas, 0),
        };

        const latestAnalysis = clinicAnalyses[clinicAnalyses.length - 1];

        const allImages = clinicAnalyses.flatMap((a) => a.images);

        setFunnel(aggregatedFunnel);
        setImages(allImages);
        setObservations(latestAnalysis.observations);
        setCommercialInput(
          latestAnalysis.commercialInput || emptyCommercialInput
        );
      } else {
        setFunnel(emptyFunnel);
        setImages([]);
        setObservations("");
        setCommercialInput(emptyCommercialInput);
      }

      const fetchStatus = async () => {
        const response = await fetch("/api/auth/status");
        const responseData = await response.json();
        logged = responseData.loggedIn;
        if (logged == false) {
          window.location.replace("/api/auth");
        } else {
          if (
            selectedClinicId &&
            /^20\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(startDate) &&
            /^20\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(endDate)
          ) {
            try {
              const clinicListResponse = await fetch(
                `/api/clinics?clinicName=${encodeURIComponent(
                  selectedClinicName
                )}`
              );

              const clinicIds = await clinicListResponse.json();

              if (clinicIds.GoogleAdsId) {
                const googleResponse = await fetch(
                  `/api/google/totalData?accountId=${encodeURIComponent(
                    clinicIds.GoogleAdsId
                  )}&startDate=${encodeURIComponent(
                    startDate
                  )}&endDate=${encodeURIComponent(endDate)}`
                );
                googleData = await googleResponse.json();
              }

              if (clinicIds.MetaAdsId) {
                const spendMetaResponse = await fetch(
                  `/api/meta/accountSpend?accountId=${encodeURIComponent(
                    clinicIds.MetaAdsId
                  )}&startDate=${encodeURIComponent(
                    startDate
                  )}&endDate=${encodeURIComponent(endDate)}`
                );
                const conversionResponse = await fetch(
                  `/api/meta/conversions?accountId=${encodeURIComponent(
                    clinicIds.MetaAdsId
                  )}&startDate=${encodeURIComponent(
                    startDate
                  )}&endDate=${encodeURIComponent(endDate)}`
                );
                spendResponseData = await spendMetaResponse.json();
                conversionResponseData = await conversionResponse.json();
              }

              setCosts({
                valorGastoGoogle: googleData
                  ? ((googleData.costMicros / 1000000) as number)
                  : 0,
                valorGastoMeta: (spendResponseData as number) || 0,
              });
              setLeadsMarketing(
                conversionResponseData ||
                  0 + (googleData ? googleData.allConversions : 0)
              );
              setDataVisibility(selectedClinicId);
            } catch (err) {
              console.log("Erro na Index! ", err);
            }
          }
        }
      };

      fetchStatus();
    }, 300);

    return () => clearTimeout(timer);
  }, [analyses, selectedClinicId, startDate, endDate]);

  const rates: CalculatedRates = useMemo(() => {
    return {
      taxaAgendamento: funnel.leadsCRM
        ? (funnel.agendamentos / funnel.leadsCRM) * 100
        : 0,
      taxaComparecimento: funnel.agendamentos
        ? (funnel.comparecimentos / funnel.agendamentos) * 100
        : 0,
      taxaFechamento: funnel.comparecimentos
        ? (funnel.vendas / funnel.comparecimentos) * 100
        : 0,
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

  const handleAddClinic = async (
    name: string,
    metaAdsId: string | null,
    googleAdsId: string | null
  ) => {
    if (!selectedGestorId) return;

    fetch("/api/clinics", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        metaAdsId: metaAdsId,
        googleAdsId: googleAdsId,
      }),
    });

    const newClinic = await addClinic(name, selectedGestorId);

    if (newClinic) {
      setSelectedClinicId(newClinic.id);
      setSelectedClinicName(name);
    }
  };

  const handleDeleteClinic = async (id: string, name: string) => {
    fetch(`/api/clinics?clinicName=${encodeURIComponent(name)}`, {
      method: "DELETE",
    });

    await deleteClinic(id);
    if (selectedClinicId === id) {
      setSelectedClinicId(null);
    }
  };

  const handleSelectClinic = (clinic: Clinic | null) => {
    setSelectedClinicId(clinic?.id || null);
    setSelectedClinicName(clinic?.name || null);
  };

  const handleSave = async () => {
    if (!selectedClinicId) return;
    await saveAnalysis(
      selectedClinicId,
      startDate,
      endDate,
      funnel,
      images,
      observations,
      commercialInput
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

          {dataVisibility !== "loading" && dataVisibility !== "false" && (
            <>
              <CostInput data={costs} leadsMarketing={leadsMarketing} />

              <RatesComparison rates={rates} />

              <FunnelDataInput data={funnel} onChange={setFunnel} />

              <FunnelVisualization data={funnel} />

              <SalesResultsInput
                data={salesResults}
                onChange={setSalesResults}
              />

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

          {dataVisibility == "loading" && (
            <div className="flex w-full justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
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
