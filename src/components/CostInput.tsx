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
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="entrada">Entrada de Dados</TabsTrigger>
            <TabsTrigger value="cpl-geral">CPL Geral</TabsTrigger>
          </TabsList>
          
          <TabsContent value="entrada" className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Valor Gasto</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valorGastoMeta">Valor Gasto (Meta)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                    <Input
                      id="valorGastoMeta"
                      type="number"
                      min="0"
                      step="0.01"
                      value={data.valorGastoMeta || ''}
                      onChange={(e) => handleChange('valorGastoMeta', e.target.value)}
                      placeholder="0,00"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valorGastoGoogle">Valor Gasto (Google)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                    <Input
                      id="valorGastoGoogle"
                      type="number"
                      min="0"
                      step="0.01"
                      value={data.valorGastoGoogle || ''}
                      onChange={(e) => handleChange('valorGastoGoogle', e.target.value)}
                      placeholder="0,00"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Custo por Lead</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="custoLeadMeta">Custo por Lead (Meta)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                    <Input
                      id="custoLeadMeta"
                      type="number"
                      min="0"
                      step="0.01"
                      value={data.custoLeadMeta || ''}
                      onChange={(e) => handleChange('custoLeadMeta', e.target.value)}
                      placeholder="0,00"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custoLeadGoogle">Custo por Lead (Google)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                    <Input
                      id="custoLeadGoogle"
                      type="number"
                      min="0"
                      step="0.01"
                      value={data.custoLeadGoogle || ''}
                      onChange={(e) => handleChange('custoLeadGoogle', e.target.value)}
                      placeholder="0,00"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="cpl-geral">
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
