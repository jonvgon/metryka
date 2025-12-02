import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { CommercialInputData } from '@/types/clinic';

interface CommercialInputSectionProps {
  data: CommercialInputData;
  onChange: (data: CommercialInputData) => void;
}

export function CommercialInputSection({ data, onChange }: CommercialInputSectionProps) {
  const handleBooleanChange = (field: keyof CommercialInputData, value: boolean) => {
    onChange({ ...data, [field]: value });
  };

  const handleTextChange = (field: keyof CommercialInputData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const booleanFields: { key: keyof CommercialInputData; label: string }[] = [
    { key: 'cplBom', label: 'CPL bom?' },
    { key: 'leadsInteressados', label: 'Leads interessados?' },
    { key: 'comercialBom', label: 'Comercial bom?' },
    { key: 'comercialAplicouCpip', label: 'Comercial aplicou CPIP?' },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Análise Comercial - Inputs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {booleanFields.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between space-x-2 p-3 bg-muted/50 rounded-lg">
              <Label htmlFor={key} className="text-sm font-medium cursor-pointer">
                {label}
              </Label>
              <Switch
                id={key}
                checked={data[key] === true}
                onCheckedChange={(checked) => handleBooleanChange(key, checked)}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="linkAtendimentosRuins">Link Atendimentos Ruins</Label>
            <Input
              id="linkAtendimentosRuins"
              placeholder="Cole o link aqui..."
              value={data.linkAtendimentosRuins}
              onChange={(e) => handleTextChange('linkAtendimentosRuins', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkAtendimentosBons">Link Atendimentos Bons</Label>
            <Input
              id="linkAtendimentosBons"
              placeholder="Cole o link aqui..."
              value={data.linkAtendimentosBons}
              onChange={(e) => handleTextChange('linkAtendimentosBons', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="proximosPassos">Próximos Passos (preenchido por você)</Label>
          <Textarea
            id="proximosPassos"
            placeholder="Descreva os próximos passos planejados..."
            value={data.proximosPassos}
            onChange={(e) => handleTextChange('proximosPassos', e.target.value)}
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
}
