import { CostData } from '@/types/clinic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CostInputProps {
  data: CostData;
  onChange: (data: CostData) => void;
}

export function CostInput({ data, onChange }: CostInputProps) {
  const handleChange = (field: keyof CostData, value: string) => {
    const numValue = parseFloat(value) || 0;
    onChange({ ...data, [field]: numValue });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Custo por Lead</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
