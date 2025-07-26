import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

export interface VipPronoData {
  totalOdds: string;
  description: string;
  predictionText: string;
  image?: File;
}

interface VipPronoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VipPronoData) => Promise<boolean>;
}

export const VipPronoModal = ({ isOpen, onClose, onSubmit }: VipPronoModalProps) => {
  const [formData, setFormData] = useState<VipPronoData>({
    totalOdds: '',
    description: '',
    predictionText: ''
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 5MB');
        return;
      }
      
      setFormData(prev => ({ ...prev, image: file }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: undefined }));
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.totalOdds || !formData.description || !formData.predictionText) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const odds = parseFloat(formData.totalOdds);
    if (isNaN(odds) || odds <= 0) {
      toast.error('Veuillez entrer une cote valide');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await onSubmit(formData);
      if (success) {
        setFormData({
          totalOdds: '',
          description: '',
          predictionText: ''
        });
        setImagePreview(null);
        onClose();
      }
    } catch (error) {
      console.error('Error submitting VIP prono:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        totalOdds: '',
        description: '',
        predictionText: ''
      });
      setImagePreview(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span className="text-yellow-500">⭐</span>
            <span>Créer un Prono VIP</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="totalOdds">Cote totale *</Label>
            <Input
              id="totalOdds"
              type="number"
              step="0.01"
              min="1"
              placeholder="Ex: 2.50"
              value={formData.totalOdds}
              onChange={(e) => setFormData(prev => ({ ...prev, totalOdds: e.target.value }))}
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Décrivez votre pronostic..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1 min-h-[80px]"
              required
            />
          </div>

          <div>
            <Label htmlFor="predictionText">Prédiction *</Label>
            <Textarea
              id="predictionText"
              placeholder="Votre prédiction détaillée..."
              value={formData.predictionText}
              onChange={(e) => setFormData(prev => ({ ...prev, predictionText: e.target.value }))}
              className="mt-1 min-h-[80px]"
              required
            />
          </div>

          <div>
            <Label>Image (optionnelle)</Label>
            <div className="mt-1 space-y-2">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Aperçu"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removeImage}
                    className="absolute top-2 right-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">Cliquez pour ajouter une image</p>
                    <p className="text-xs text-gray-400">PNG, JPG jusqu'à 5MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600"
            >
              {isSubmitting ? 'Création...' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};