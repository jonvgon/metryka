import { FunnelData } from '@/types/clinic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FunnelDataInputProps {
  data: FunnelData;
  onChange: (data: FunnelData) => void;
}

export function FunnelDataInput({ data, onChange }: FunnelDataInputProps) {
  const handleChange = (field: keyof FunnelData, value: string) => {
    const numValue = parseInt(value) || 0;
    onChange({ ...data, [field]: numValue });
  };

  const fields: { key: keyof FunnelData; label: string }[] = [
    { key: 'leadsMarketing', label: 'Total de Leads (Marketing)' },
    { key: 'leadsCRM', label: 'Total de Leads (CRM)' },
    { key: 'agendamentos', label: 'Total de Agendamentos' },
    { key: 'comparecimentos', label: 'Total de Comparecimentos' },
    { key: 'vendas', label: 'Total de Vendas' },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Dados do Funil</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {fields.map(({ key, label }) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key} className="text-sm">{label}</Label>
              <Input
                id={key}
                type="number"
                min="0"
                value={data[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder="0"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
