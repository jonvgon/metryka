import { useState } from 'react';
import { Clinic } from '@/types/clinic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';

interface ClinicSelectorProps {
  clinics: Clinic[];
  selectedClinic: Clinic | null;
  onAddClinic: (name: string) => void;
  onSelectClinic: (clinic: Clinic | null) => void;
  onDeleteClinic: (id: string) => void;
}

export function ClinicSelector({
  clinics,
  selectedClinic,
  onAddClinic,
  onSelectClinic,
  onDeleteClinic,
}: ClinicSelectorProps) {
  const [newClinicName, setNewClinicName] = useState('');

  const handleAddClinic = () => {
    if (newClinicName.trim()) {
      onAddClinic(newClinicName.trim());
      setNewClinicName('');
    }
  };

  const handleSelectChange = (value: string) => {
    if (value === 'none') {
      onSelectClinic(null);
    } else {
      const clinic = clinics.find(c => c.id === value);
      if (clinic) onSelectClinic(clinic);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Clínica</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Nome da nova clínica"
            value={newClinicName}
            onChange={(e) => setNewClinicName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddClinic()}
          />
          <Button onClick={handleAddClinic} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Select
            value={selectedClinic?.id || 'none'}
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
                onDeleteClinic(selectedClinic.id);
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
