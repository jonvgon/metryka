import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { CommercialInputData } from '@/types/clinic';
import { cn } from '@/lib/utils';

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
    { key: 'comercialAplicouCpip', label: 'Aplicou CPIP?' },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Análise Comercial - Inputs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {booleanFields.map(({ key, label }) => {
            const isChecked = data[key] === true;
            return (
              <div key={key} className="space-y-2">
                <Label className="text-sm font-medium">{label}</Label>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <span className={cn(
                    "text-sm font-medium transition-colors",
                    !isChecked ? "text-red-500" : "text-muted-foreground"
                  )}>
                    Não
                  </span>
                  <Switch
                    checked={isChecked}
                    onCheckedChange={(checked) => handleBooleanChange(key, checked)}
                    className={cn(
                      "data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                    )}
                  />
                  <span className={cn(
                    "text-sm font-medium transition-colors",
                    isChecked ? "text-green-500" : "text-muted-foreground"
                  )}>
                    Sim
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="linkAtendimentosRuins">Link Atendimentos Ruins</Label>
            <Textarea
              id="linkAtendimentosRuins"
              placeholder="Cole o link aqui..."
              value={data.linkAtendimentosRuins}
              onChange={(e) => handleTextChange('linkAtendimentosRuins', e.target.value)}
              rows={3}
              className="resize-none"
            />
            {data.linkAtendimentosRuins && data.linkAtendimentosRuins.trim() && (
              <a
                href={data.linkAtendimentosRuins.trim().startsWith('http') ? data.linkAtendimentosRuins.trim() : `https://${data.linkAtendimentosRuins.trim()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline break-all"
              >
                {data.linkAtendimentosRuins.trim()}
              </a>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkAtendimentosBons">Link Atendimentos Bons</Label>
            <Textarea
              id="linkAtendimentosBons"
              placeholder="Cole o link aqui..."
              value={data.linkAtendimentosBons}
              onChange={(e) => handleTextChange('linkAtendimentosBons', e.target.value)}
              rows={3}
              className="resize-none"
            />
            {data.linkAtendimentosBons && data.linkAtendimentosBons.trim() && (
              <a
                href={data.linkAtendimentosBons.trim().startsWith('http') ? data.linkAtendimentosBons.trim() : `https://${data.linkAtendimentosBons.trim()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline break-all"
              >
                {data.linkAtendimentosBons.trim()}
              </a>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="proximosPassos">Próximos Passos</Label>
          <Textarea
            id="proximosPassos"
            placeholder="Descreva os próximos passos planejados..."
            value={data.proximosPassos}
            onChange={(e) => handleTextChange('proximosPassos', e.target.value)}
            rows={6}
          />
        </div>
      </CardContent>
    </Card>
  );
}
