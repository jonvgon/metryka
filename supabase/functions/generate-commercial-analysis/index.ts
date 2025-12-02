import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { commercialInput, funnel, costs, rates } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `Você é um especialista em análise comercial de clínicas odontológicas. Sua função é analisar os dados comerciais e gerar diagnósticos precisos.

REGRAS DE ANÁLISE:
1. Se o CPL está bom e o lead está demonstrando interesse: o problema NÃO é no tráfego.
2. Se o CPL está bom e os leads NÃO estão demonstrando interesse: o público do Meta Ads está ruim.
3. Se o comercial está ruim: isso está afetando a conversão da clínica.
4. Sempre gerar diagnóstico baseado exclusivamente nos dados fornecidos.

FORMATO DE RESPOSTA:
Você deve retornar um JSON com exatamente esta estrutura:
{
  "diagnosticoComercial": "Diagnóstico claro e direto baseado nos dados",
  "explicacaoTecnica": "Explicação objetiva do por que o gargalo identificado ocorre",
  "recomendacoesIA": "Recomendações práticas. Se for tráfego: ajustes de campanhas, criativos, segmentações. Se for público: otimização de segmentação. Se for comercial: análise de atendimentos, reforço do método CPIP, revisão de scripts."
}

IMPORTANTE: Responda APENAS com o JSON, sem markdown ou texto adicional.`;

    const userPrompt = `Analise os seguintes dados comerciais:

INPUTS DO USUÁRIO:
- CPL bom? ${commercialInput.cplBom === true ? 'Sim' : commercialInput.cplBom === false ? 'Não' : 'Não informado'}
- Leads interessados? ${commercialInput.leadsInteressados === true ? 'Sim' : commercialInput.leadsInteressados === false ? 'Não' : 'Não informado'}
- Comercial bom? ${commercialInput.comercialBom === true ? 'Sim' : commercialInput.comercialBom === false ? 'Não' : 'Não informado'}
- Comercial aplicou CPIP? ${commercialInput.comercialAplicouCpip === true ? 'Sim' : commercialInput.comercialAplicouCpip === false ? 'Não' : 'Não informado'}
- Link atendimentos ruins: ${commercialInput.linkAtendimentosRuins || 'Não informado'}
- Link atendimentos bons: ${commercialInput.linkAtendimentosBons || 'Não informado'}

DADOS DO FUNIL:
- Leads Marketing: ${funnel.leadsMarketing}
- Leads CRM: ${funnel.leadsCRM}
- Agendamentos: ${funnel.agendamentos}
- Comparecimentos: ${funnel.comparecimentos}
- Vendas: ${funnel.vendas}

TAXAS CALCULADAS:
- Taxa de Agendamento: ${rates.taxaAgendamento.toFixed(1)}%
- Taxa de Comparecimento: ${rates.taxaComparecimento.toFixed(1)}%
- Taxa de Fechamento: ${rates.taxaFechamento.toFixed(1)}%

CUSTOS:
- Custo por Lead Meta: R$ ${costs.custoLeadMeta}
- Custo por Lead Google: R$ ${costs.custoLeadGoogle}
- Valor Gasto Meta: R$ ${costs.valorGastoMeta}
- Valor Gasto Google: R$ ${costs.valorGastoGoogle}

Gere o diagnóstico comercial seguindo as regras estabelecidas.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Limite de requisições excedido. Tente novamente em alguns minutos.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Créditos insuficientes. Adicione créditos para continuar.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('Erro ao conectar com o serviço de IA');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Resposta vazia da IA');
    }

    // Parse the JSON response
    let analysis;
    try {
      // Clean up the response in case it has markdown code blocks
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysis = JSON.parse(cleanContent);
    } catch (e) {
      console.error('Failed to parse AI response:', content);
      analysis = {
        diagnosticoComercial: content,
        explicacaoTecnica: '',
        recomendacoesIA: '',
      };
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-commercial-analysis:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
