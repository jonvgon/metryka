import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';

interface CommercialAnalysisProps {
  images: string[];
  observations: string;
  onImagesChange: (images: string[]) => void;
  onObservationsChange: (observations: string) => void;
}

export function CommercialAnalysis({
  images,
  observations,
  onImagesChange,
  onObservationsChange,
}: CommercialAnalysisProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onImagesChange([...images, base64]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Análise do Comercial</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Imagens (prints, conversas, etc.)</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="h-24 w-24 flex-col gap-2"
            >
              <Upload className="h-6 w-6" />
              <span className="text-xs">Upload</span>
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {images.length > 0 && (
          <div className="space-y-3">
            <Label>Imagens Enviadas</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    alt={`Imagem ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Label htmlFor="observations">Observações do Comercial</Label>
          <Textarea
            id="observations"
            placeholder="Digite suas observações sobre o período..."
            value={observations}
            onChange={(e) => onObservationsChange(e.target.value)}
            rows={6}
          />
        </div>
      </CardContent>
    </Card>
  );
}
