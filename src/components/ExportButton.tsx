import { FunnelData, CostData, CalculatedRates, METAS, Clinic } from '@/types/clinic';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import jsPDF from 'jspdf';

interface ExportButtonProps {
  clinic: Clinic | null;
  startDate: string;
  endDate: string;
  funnel: FunnelData;
  costs: CostData;
  rates: CalculatedRates;
  images: string[];
  observations: string;
}

export function ExportButton({
  clinic,
  startDate,
  endDate,
  funnel,
  costs,
  rates,
  images,
  observations,
}: ExportButtonProps) {
  const handleExport = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPos = 20;

    pdf.setFontSize(18);
    pdf.text('Relatório Comercial', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    pdf.setFontSize(12);
    pdf.text(`Clínica: ${clinic?.name || 'Não selecionada'}`, 20, yPos);
    yPos += 7;
    pdf.text(`Período: ${startDate} a ${endDate}`, 20, yPos);
    yPos += 15;

    pdf.setFontSize(14);
    pdf.text('Dados do Funil', 20, yPos);
    yPos += 8;

    pdf.setFontSize(10);
    pdf.text(`Leads Marketing: ${funnel.leadsMarketing}`, 25, yPos);
    yPos += 6;
    pdf.text(`Leads CRM: ${funnel.leadsCRM}`, 25, yPos);
    yPos += 6;
    pdf.text(`Agendamentos: ${funnel.agendamentos}`, 25, yPos);
    yPos += 6;
    pdf.text(`Comparecimentos: ${funnel.comparecimentos}`, 25, yPos);
    yPos += 6;
    pdf.text(`Vendas: ${funnel.vendas}`, 25, yPos);
    yPos += 12;

    pdf.setFontSize(14);
    pdf.text('Dados de Marketing', 20, yPos);
    yPos += 8;

    pdf.setFontSize(10);
    pdf.text(`Valor Gasto (Meta): R$ ${(costs.valorGastoMeta || 0).toFixed(2)}`, 25, yPos);
    yPos += 6;
    pdf.text(`Valor Gasto (Google): R$ ${(costs.valorGastoGoogle || 0).toFixed(2)}`, 25, yPos);
    yPos += 6;
    pdf.text(`Custo por Lead (Meta): R$ ${costs.custoLeadMeta.toFixed(2)}`, 25, yPos);
    yPos += 6;
    pdf.text(`Custo por Lead (Google): R$ ${costs.custoLeadGoogle.toFixed(2)}`, 25, yPos);
    yPos += 12;

    pdf.setFontSize(14);
    pdf.text('Comparação com Metas', 20, yPos);
    yPos += 8;

    pdf.setFontSize(10);
    const diff1 = rates.taxaAgendamento - METAS.agendamento;
    const diff2 = rates.taxaComparecimento - METAS.comparecimento;
    const diff3 = rates.taxaFechamento - METAS.fechamento;

    pdf.text(`Taxa de Agendamento: ${rates.taxaAgendamento.toFixed(1)}% (Meta: ${METAS.agendamento}%, Diferença: ${diff1 >= 0 ? '+' : ''}${diff1.toFixed(1)}%)`, 25, yPos);
    yPos += 6;
    pdf.text(`Taxa de Comparecimento: ${rates.taxaComparecimento.toFixed(1)}% (Meta: ${METAS.comparecimento}%, Diferença: ${diff2 >= 0 ? '+' : ''}${diff2.toFixed(1)}%)`, 25, yPos);
    yPos += 6;
    pdf.text(`Taxa de Fechamento: ${rates.taxaFechamento.toFixed(1)}% (Meta: ${METAS.fechamento}%, Diferença: ${diff3 >= 0 ? '+' : ''}${diff3.toFixed(1)}%)`, 25, yPos);
    yPos += 12;

    if (observations) {
      pdf.setFontSize(14);
      pdf.text('Observações do Comercial', 20, yPos);
      yPos += 8;

      pdf.setFontSize(10);
      const splitText = pdf.splitTextToSize(observations, pageWidth - 40);
      pdf.text(splitText, 25, yPos);
      yPos += splitText.length * 5 + 10;
    }

    if (images.length > 0) {
      pdf.addPage();
      yPos = 20;
      pdf.setFontSize(14);
      pdf.text('Imagens do Comercial', 20, yPos);
      yPos += 10;

      for (let i = 0; i < images.length; i++) {
        if (yPos > 250) {
          pdf.addPage();
          yPos = 20;
        }

        try {
          const img = new Image();
          img.src = images[i];
          await new Promise((resolve) => {
            img.onload = resolve;
          });

          const maxWidth = 80;
          const maxHeight = 60;
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }

          pdf.addImage(images[i], 'JPEG', 25, yPos, width, height);
          yPos += height + 10;
        } catch (error) {
          console.error('Error adding image to PDF:', error);
        }
      }
    }

    pdf.save(`relatorio-${clinic?.name || 'clinica'}-${startDate}-${endDate}.pdf`);
  };

  return (
    <Button onClick={handleExport} className="w-full sm:w-auto">
      <FileDown className="h-4 w-4 mr-2" />
      Exportar PDF
    </Button>
  );
}
