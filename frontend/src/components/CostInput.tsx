import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CostInput(props) {
  const cplGeral =
    props.leadsMarketing > 0
      ? (props.data.valorGastoMeta + props.data.valorGastoGoogle) /
        props.leadsMarketing
      : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">
          Dados de Marketing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <div className="flex w-full justify-center mb-4">
            <div>CPL Geral</div>
          </div>

          <div>
            <div className="space-y-4">
              <div className="text-center p-6 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  Custo por Lead Geral do Período
                </p>
                <p className="text-3xl font-bold text-primary">
                  R$ {cplGeral.toFixed(2)}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-muted-foreground">Valor Gasto (Meta)</p>
                  <p className="font-semibold">
                    R$ {props.data.valorGastoMeta.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-muted-foreground">Valor Gasto (Google)</p>
                  <p className="font-semibold">
                    R$ {props.data.valorGastoGoogle.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-muted-foreground">Total Leads Marketing</p>
                  <p className="font-semibold">{props.leadsMarketing}</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Cálculo: (R$ {props.data.valorGastoMeta.toFixed(2)} + R${" "}
                {props.data.valorGastoGoogle.toFixed(2)}) ÷{" "}
                {props.leadsMarketing} = R$ {cplGeral.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
