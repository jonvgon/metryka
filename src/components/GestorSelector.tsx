import { useState } from 'react';
import { Gestor } from '@/types/gestor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';

interface GestorSelectorProps {
  gestores: Gestor[];
  selectedGestor: Gestor | null;
  onAddGestor: (name: string) => void;
  onSelectGestor: (gestor: Gestor | null) => void;
  onDeleteGestor: (id: string) => void;
}

export function GestorSelector({
  gestores,
  selectedGestor,
  onAddGestor,
  onSelectGestor,
  onDeleteGestor,
}: GestorSelectorProps) {
  const [newGestorName, setNewGestorName] = useState('');

  const handleAddGestor = () => {
    if (newGestorName.trim()) {
      onAddGestor(newGestorName.trim());
      setNewGestorName('');
    }
  };

  const handleSelectChange = (value: string) => {
    if (value === 'none') {
      onSelectGestor(null);
    } else {
      const gestor = gestores.find(g => g.id === value);
      if (gestor) onSelectGestor(gestor);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Gestor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Nome do novo gestor"
            value={newGestorName}
            onChange={(e) => setNewGestorName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddGestor()}
          />
          <Button onClick={handleAddGestor} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Select
            value={selectedGestor?.id || 'none'}
            onValueChange={handleSelectChange}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Selecione um gestor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Selecione um gestor</SelectItem>
              {gestores.map((gestor) => (
                <SelectItem key={gestor.id} value={gestor.id}>
                  {gestor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedGestor && (
            <Button
              variant="destructive"
              size="icon"
              onClick={() => {
                onDeleteGestor(selectedGestor.id);
                onSelectGestor(null);
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
