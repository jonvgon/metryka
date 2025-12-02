import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CommercialInputData } from '@/types/clinic';
import { cn } from '@/lib/utils';

interface CommercialInputSectionProps {
  data: CommercialInputData;
  onChange: (data: CommercialInputData) => void;
}

export function CommercialInputSection({ data, onChange }: CommercialInputSectionProps) {
  const handleBooleanChange = (field: keyof CommercialInputData, value: boolean | null) => {
    onChange({ ...data, [field]: value });
  };

  const handleTextChange = (field: keyof CommercialInputData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const booleanFields: { key: keyof CommercialInputData; label: string }[] = [
    { key: 'cplBom', label: 'CPL bom?' },
    { key: 'leadsInteressados', label: 'Leads interessados?' },
    { key: 'comercialBom', label: 'Comercial bom?' },
    { key: 'comercialAplicouCpip', label: 'Aplicou CPIP?' },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Análise Comercial - Inputs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {booleanFields.map(({ key, label }) => (
            <div key={key} className="space-y-2">
              <Label className="text-sm font-medium">{label}</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={cn(
                    "flex-1 transition-colors",
                    data[key] === true 
                      ? "bg-green-600 text-white border-green-600 hover:bg-green-700 hover:text-white" 
                      : "hover:bg-green-100 hover:text-green-700 hover:border-green-300"
                  )}
                  onClick={() => handleBooleanChange(key, true)}
                >
                  Sim
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={cn(
                    "flex-1 transition-colors",
                    data[key] === false 
                      ? "bg-red-600 text-white border-red-600 hover:bg-red-700 hover:text-white" 
                      : "hover:bg-red-100 hover:text-red-700 hover:border-red-300"
                  )}
                  onClick={() => handleBooleanChange(key, false)}
                >
                  Não
                </Button>
              </div>
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
          <Label htmlFor="proximosPassos">Próximos Passos</Label>
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
