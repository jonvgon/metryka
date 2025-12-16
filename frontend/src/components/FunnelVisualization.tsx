import { useRef } from 'react';
import { FunnelData } from '@/types/clinic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';

interface FunnelVisualizationProps {
  data: FunnelData;
}

export function FunnelVisualization({ data }: FunnelVisualizationProps) {
  const funnelRef = useRef<HTMLDivElement>(null);

  const stages = [
    { label: 'Leads Marketing', value: data.leadsMarketing, percent: 100 },
    {
      label: 'Leads CRM',
      value: data.leadsCRM,
      percent: data.leadsMarketing ? (data.leadsCRM / data.leadsMarketing) * 100 : 0,
    },
    {
      label: 'Agendamentos',
      value: data.agendamentos,
      percent: data.leadsCRM ? (data.agendamentos / data.leadsCRM) * 100 : 0,
    },
    {
      label: 'Comparecimentos',
      value: data.comparecimentos,
      percent: data.agendamentos ? (data.comparecimentos / data.agendamentos) * 100 : 0,
    },
    {
      label: 'Vendas',
      value: data.vendas,
      percent: data.comparecimentos ? (data.vendas / data.comparecimentos) * 100 : 0,
    },
  ];

  const handleDownload = async () => {
    if (funnelRef.current) {
      const canvas = await html2canvas(funnelRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = 'funil-comercial.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Funil de Vendas</CardTitle>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Baixar PNG
        </Button>
      </CardHeader>
      <CardContent>
        <div ref={funnelRef} className="p-6 bg-background">
          <div className="flex flex-col items-center space-y-2">
            {stages.map((stage, index) => {
              const widthPercent = 100 - index * 15;
              return (
                <div
                  key={stage.label}
                  className="relative flex items-center justify-center py-4 bg-primary text-primary-foreground rounded"
                  style={{ width: `${widthPercent}%`, minWidth: '200px' }}
                >
                  <div className="text-center">
                    <div className="font-semibold text-sm">{stage.label}</div>
                    <div className="text-lg font-bold">{stage.value}</div>
                    {index > 0 && (
                      <div className="text-xs opacity-80">
                        {stage.percent.toFixed(1)}%
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
