import { CostData } from '@/types/clinic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CostInputProps {
  data: CostData;
  onChange: (data: CostData) => void;
  leadsMarketing: number;
}

export function CostInput({ data, onChange, leadsMarketing }: CostInputProps) {
  const handleChange = (field: keyof CostData, value: string) => {
    const numValue = parseFloat(value) || 0;
    onChange({ ...data, [field]: numValue });
  };

  const cplGeral = leadsMarketing > 0 
    ? (data.valorGastoMeta + data.valorGastoGoogle) / leadsMarketing 
    : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Dados de Marketing</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="entrada" className="w-full">
          <div className="flex w-full justify-center mb-4">
            <div>CPL Geral</div>
          </div>

          <div>
            <div className="space-y-4">
              <div className="text-center p-6 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Custo por Lead Geral do Período</p>
                <p className="text-3xl font-bold text-primary">
                  R$ {cplGeral.toFixed(2)}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-muted-foreground">Valor Gasto (Meta)</p>
                  <p className="font-semibold">R$ {data.valorGastoMeta.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-muted-foreground">Valor Gasto (Google)</p>
                  <p className="font-semibold">R$ {data.valorGastoGoogle.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-muted-foreground">Total Leads Marketing</p>
                  <p className="font-semibold">{leadsMarketing}</p>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground text-center">
                Cálculo: (R$ {data.valorGastoMeta.toFixed(2)} + R$ {data.valorGastoGoogle.toFixed(2)}) ÷ {leadsMarketing} = R$ {cplGeral.toFixed(2)}
              </p>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
