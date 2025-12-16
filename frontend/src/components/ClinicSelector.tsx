import React, { useState } from "react";
import { Clinic } from "@/types/clinic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";

interface ClinicSelectorProps {
  clinics: Clinic[];
  selectedClinic: Clinic | null;
  onAddClinic: (
    name: string,
    metaAdsId: string | null,
    googleAdsId: string | null
  ) => void;
  onSelectClinic: (clinic: Clinic | null) => void;
  onDeleteClinic: (id: string, name: string) => void;
}

export function ClinicSelector({
  clinics,
  selectedClinic,
  onAddClinic,
  onSelectClinic,
  onDeleteClinic,
}: ClinicSelectorProps) {
  const [metaState, setMetaState] = useState(false);
  const [googleState, setGoogleState] = useState(false);
  const [googleTagInputVal, setGoogleTagInputVal] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [MetaTagInputVal, setMetaTagInputVal] = useState("");

  const handleAddClinic = (e) => {
    e.preventDefault();
    if (e.target.clinicName.value) {
      onAddClinic(
        e.target.clinicName.value,
        e.target.metaAdsId.disabled ? null : e.target.metaAdsId.value,
        e.target.googleAdsId.disabled ? null : e.target.googleAdsId.value
      );
      setClinicName("");
      setMetaTagInputVal("");
      setGoogleTagInputVal("");
    }
  };

  const handleSelectChange = (value: string) => {
    if (value === "none") {
      onSelectClinic(null);
    } else {
      const clinic = clinics.find((c) => c.id === value);
      if (clinic) onSelectClinic(clinic);
    }
  };

  const onChangeTagInput = (e) => {
    if (e.target.name == "metaAdsId") {
      setMetaTagInputVal(e.target.value.replace(/\D/g, ""));
    } else {
      setGoogleTagInputVal(e.target.value.replace(/\D/g, ""));
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Clínica</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="flex gap-2 flex-col" onSubmit={handleAddClinic}>
          <Input
            placeholder="Nome da nova clínica"
            required={true}
            value={clinicName}
            onChange={(e) => setClinicName(e.target.value)}
            name="clinicName"
          />
          <div className="flex flex-row gap-5 mb-3">
            <div className="flex flex-row gap-3 w-max">
              <Input
                placeholder="Id do Meta Ads"
                onChange={(e) => onChangeTagInput(e)}
                disabled={metaState}
                required={!metaState}
                value={MetaTagInputVal}
                name="metaAdsId"
              />
              <div className="flex flex-row-reverse w-50 items-center gap-2">
                <label htmlFor="noMeta" className="text-xs text-nowrap">
                  Sem Meta Ads
                </label>
                <Input
                  type="checkbox"
                  id="noMeta"
                  className="w-6"
                  checked={metaState}
                  onChange={(e) => {
                    setMetaState(e.target.checked);
                    setGoogleState(false);
                  }}
                />
              </div>
            </div>
            <div className="flex flex-row w-max items-center gap-3">
              <Input
                placeholder="Id do Google Ads"
                onChange={(e) => onChangeTagInput(e)}
                value={googleTagInputVal}
                disabled={googleState}
                required={!googleState}
                name="googleAdsId"
              />
              <div className="flex flex-row-reverse items-center gap-2">
                <label htmlFor="noGoogle" className="text-xs text-nowrap">
                  Sem Google Ads
                </label>
                <Input
                  type="checkbox"
                  id="noGoogle"
                  className="w-6"
                  checked={googleState}
                  onChange={(e) => {
                    setGoogleState(e.target.checked);
                    setMetaState(false);
                  }}
                />
              </div>
            </div>
          </div>
          <Button type="submit">Adicionar clínica</Button>
        </form>

        <div className="flex gap-2">
          <Select
            value={selectedClinic?.id || "none"}
            onValueChange={handleSelectChange}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Selecione uma clínica" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Selecione uma clínica</SelectItem>
              {clinics.map((clinic) => (
                <SelectItem key={clinic.id} value={clinic.id}>
                  {clinic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedClinic && (
            <Button
              variant="destructive"
              size="icon"
              onClick={() => {
                onDeleteClinic(selectedClinic.id, selectedClinic.name);
                onSelectClinic(null);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
