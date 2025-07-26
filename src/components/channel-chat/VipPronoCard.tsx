import { Star, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VipProno } from '@/hooks/useVipPronos';

interface VipPronoCardProps {
  prono: VipProno;
}

export const VipPronoCard = ({ prono }: VipPronoCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
            <span className="font-semibold text-sm text-yellow-700">Prono VIP</span>
          </div>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <TrendingUp className="w-3 h-3 mr-1" />
            Cote {prono.total_odds}
          </Badge>
        </div>

        {prono.image_url && (
          <div className="mb-3">
            <img
              src={prono.image_url}
              alt="Prono VIP"
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="space-y-2">
          <div>
            <h4 className="font-medium text-gray-900 text-sm mb-1">Description</h4>
            <p className="text-sm text-gray-700">{prono.description}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 text-sm mb-1">Prédiction</h4>
            <p className="text-sm text-gray-700">{prono.prediction_text}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-yellow-200">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(prono.created_at)}
          </div>
          <span className="text-xs text-yellow-700 font-medium">
            Par {prono.creator_username}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};