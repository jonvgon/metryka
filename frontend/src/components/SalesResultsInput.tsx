import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SalesResultsData } from '@/types/clinic';

interface SalesResultsInputProps {
  data: SalesResultsData;
  onChange: (data: SalesResultsData) => void;
}

export function SalesResultsInput({ data, onChange }: SalesResultsInputProps) {
  const handleChange = (field: keyof SalesResultsData, value: string) => {
    if (field === 'motivoPerdido') {
      onChange({ ...data, [field]: value });
    } else {
      const numValue = parseFloat(value) || 0;
      onChange({ ...data, [field]: numValue });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Resultados de Vendas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="valorFechamento" className="text-sm">Valor de Fechamento (R$)</Label>
            <Input
              id="valorFechamento"
              type="number"
              min="0"
              step="0.01"
              value={data.valorFechamento || ''}
              onChange={(e) => handleChange('valorFechamento', e.target.value)}
              placeholder="0,00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="orcamentoAberto" className="text-sm">Orçamento em Aberto (R$)</Label>
            <Input
              id="orcamentoAberto"
              type="number"
              min="0"
              step="0.01"
              value={data.orcamentoAberto || ''}
              onChange={(e) => handleChange('orcamentoAberto', e.target.value)}
              placeholder="0,00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="leadsPerdidos" className="text-sm">Leads Perdidos</Label>
            <Input
              id="leadsPerdidos"
              type="number"
              min="0"
              value={data.leadsPerdidos || ''}
              onChange={(e) => handleChange('leadsPerdidos', e.target.value)}
              placeholder="0"
            />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Label htmlFor="motivoPerdido" className="text-sm">Motivo do Perdido</Label>
          <Textarea
            id="motivoPerdido"
            value={data.motivoPerdido}
            onChange={(e) => handleChange('motivoPerdido', e.target.value)}
            placeholder="Descreva os motivos pelos quais os leads foram perdidos..."
            rows={3}
            className="resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
}
