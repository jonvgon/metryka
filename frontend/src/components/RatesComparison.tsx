import { CalculatedRates, METAS } from '@/types/clinic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RatesComparisonProps {
  rates: CalculatedRates;
}

export function RatesComparison({ rates }: RatesComparisonProps) {
  const comparisons = [
    {
      label: 'Taxa de Agendamento',
      meta: METAS.agendamento,
      result: rates.taxaAgendamento,
    },
    {
      label: 'Taxa de Comparecimento',
      meta: METAS.comparecimento,
      result: rates.taxaComparecimento,
    },
    {
      label: 'Taxa de Fechamento',
      meta: METAS.fechamento,
      result: rates.taxaFechamento,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Comparação com Metas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {comparisons.map(({ label, meta, result }) => {
            const diff = result - meta;
            const isAboveMeta = diff >= 0;

            return (
              <div key={label} className="p-4 rounded-lg border bg-secondary/30">
                <h4 className="font-medium text-sm mb-3">{label}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Meta:</span>
                    <span className="font-medium">{meta}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Resultado:</span>
                    <span className="font-medium">{result.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-muted-foreground">Diferença:</span>
                    <span className={`font-semibold ${isAboveMeta ? 'text-success' : 'text-destructive'}`}>
                      {diff > 0 ? '+' : ''}{diff.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
