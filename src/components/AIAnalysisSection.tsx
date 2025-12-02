import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AIAnalysisData, CommercialInputData, FunnelData, CostData, CalculatedRates } from '@/types/clinic';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AIAnalysisSectionProps {
  commercialInput: CommercialInputData;
  funnel: FunnelData;
  costs: CostData;
  rates: CalculatedRates;
  aiAnalysis: AIAnalysisData;
  onAIAnalysisChange: (data: AIAnalysisData) => void;
}

export function AIAnalysisSection({
  commercialInput,
  funnel,
  costs,
  rates,
  aiAnalysis,
  onAIAnalysisChange,
}: AIAnalysisSectionProps) {
  const [generating, setGenerating] = useState(false);

  const handleGenerateAnalysis = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-commercial-analysis', {
        body: {
          commercialInput,
          funnel,
          costs,
          rates,
        },
      });

      if (error) {
        console.error('Error generating analysis:', error);
        toast.error('Erro ao gerar análise. Tente novamente.');
        return;
      }

      if (data) {
        onAIAnalysisChange({
          diagnosticoComercial: data.diagnosticoComercial || '',
          explicacaoTecnica: data.explicacaoTecnica || '',
          recomendacoesIA: data.recomendacoesIA || '',
        });
        toast.success('Análise gerada com sucesso!');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Erro ao conectar com o serviço de IA.');
    } finally {
      setGenerating(false);
    }
  };

  const hasInputs = 
    commercialInput.cplBom !== null || 
    commercialInput.leadsInteressados !== null || 
    commercialInput.comercialBom !== null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Diagnóstico IA
          </CardTitle>
          <Button
            onClick={handleGenerateAnalysis}
            disabled={generating || !hasInputs}
            size="sm"
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Gerar Análise
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!hasInputs && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm bg-muted/50 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span>Preencha os campos de análise comercial acima para gerar o diagnóstico.</span>
          </div>
        )}

        {aiAnalysis.diagnosticoComercial && (
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Diagnóstico Comercial</h4>
            <div className="bg-muted/50 p-4 rounded-lg text-sm whitespace-pre-wrap">
              {aiAnalysis.diagnosticoComercial}
            </div>
          </div>
        )}

        {aiAnalysis.explicacaoTecnica && (
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Explicação Técnica</h4>
            <div className="bg-muted/50 p-4 rounded-lg text-sm whitespace-pre-wrap">
              {aiAnalysis.explicacaoTecnica}
            </div>
          </div>
        )}

        {aiAnalysis.recomendacoesIA && (
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Próximos Passos Recomendados</h4>
            <div className="bg-muted/50 p-4 rounded-lg text-sm whitespace-pre-wrap">
              {aiAnalysis.recomendacoesIA}
            </div>
          </div>
        )}

        {!aiAnalysis.diagnosticoComercial && !aiAnalysis.explicacaoTecnica && !aiAnalysis.recomendacoesIA && hasInputs && (
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Clique em "Gerar Análise" para obter o diagnóstico da IA.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
