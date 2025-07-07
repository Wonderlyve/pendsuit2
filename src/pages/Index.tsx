
import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import Map from '../components/Map';
import RideBooking from '../components/RideBooking';
import RideTracking from '../components/RideTracking';
import RatingModal from '../components/RatingModal';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Car, Shield, Clock } from 'lucide-react';

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface RideDetails {
  pickup?: Location;
  destination?: Location;
  vehicleType: string;
  estimate: {
    distance: number;
    duration: number;
    price: number;
  };
}

const Index = () => {
  const [pickup, setPickup] = useState<Location | undefined>();
  const [destination, setDestination] = useState<Location | undefined>();
  const [currentRide, setCurrentRide] = useState<RideDetails | null>(null);
  const [rideStatus, setRideStatus] = useState<'idle' | 'searching' | 'driver_assigned' | 'driver_arriving' | 'in_progress' | 'completed'>('idle');
  const [showRating, setShowRating] = useState(false);
  const [rideId] = useState('RIDE123456');

  // Données simulées du chauffeur
  const mockDriver = {
    id: 'DRV001',
    name: 'Jean Dupont',
    photo: 'https://ui-avatars.com/api/?name=Jean+Dupont&background=3b82f6&color=fff',
    rating: 4.8,
    vehicle: {
      make: 'Renault',
      model: 'Megane',
      color: 'Blanche',
      plate: 'AB-123-CD'
    },
    phone: '+33 1 23 45 67 89'
  };

  const handleBookRide = (rideDetails: RideDetails) => {
    setCurrentRide(rideDetails);
    setRideStatus('searching');
    
    // Simulation du processus de réservation
    setTimeout(() => setRideStatus('driver_assigned'), 3000);
    setTimeout(() => setRideStatus('driver_arriving'), 5000);
    setTimeout(() => setRideStatus('in_progress'), 15000);
    setTimeout(() => {
      setRideStatus('completed');
      setShowRating(true);
    }, 30000);
  };

  const handleCancelRide = () => {
    setCurrentRide(null);
    setRideStatus('idle');
  };

  const handleCompleteRide = () => {
    setShowRating(true);
  };

  const handleRatingSubmit = (rating: number, comment: string) => {
    console.log('Évaluation soumise:', { rating, comment });
    setCurrentRide(null);
    setRideStatus('idle');
    setShowRating(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto p-4">
        {/* En-tête avec branding */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Bienvenue sur <span className="text-yellow-500">AUTOCOP</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Votre transport sûr et fiable, disponible 24h/24
          </p>
        </div>

        {/* Fonctionnalités principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Géolocalisation précise</h3>
            <p className="text-gray-600 text-sm">Localisation en temps réel pour des trajets optimisés</p>
          </Card>
          
          <Card className="text-center p-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Sécurité garantie</h3>
            <p className="text-gray-600 text-sm">Chauffeurs vérifiés et véhicules contrôlés</p>
          </Card>
          
          <Card className="text-center p-6">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Disponible 24h/24</h3>
            <p className="text-gray-600 text-sm">Service disponible à toute heure</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Carte */}
          <div>
            <Map
              pickup={pickup}
              destination={destination}
              onPickupChange={setPickup}
              onDestinationChange={setDestination}
              driverLocation={mockDriver ? { lat: 48.8566, lng: 2.3522 } : undefined}
              showDriver={rideStatus === 'driver_arriving' || rideStatus === 'in_progress'}
            />
          </div>

          {/* Interface de réservation ou de suivi */}
          <div>
            {rideStatus === 'idle' ? (
              <RideBooking
                pickup={pickup}
                destination={destination}
                onPickupChange={setPickup}
                onDestinationChange={setDestination}
                onBookRide={handleBookRide}
              />
            ) : (
              <RideTracking
                rideId={rideId}
                status={rideStatus}
                driver={rideStatus !== 'searching' ? mockDriver : undefined}
                estimatedArrival={rideStatus === 'driver_arriving' ? 300 : undefined}
                onCancelRide={handleCancelRide}
                onCompleteRide={handleCompleteRide}
              />
            )}
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Pourquoi choisir AUTOCOP ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-500">5min</div>
              <div className="text-sm text-gray-600">Temps d'attente moyen</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-500">4.9/5</div>
              <div className="text-sm text-gray-600">Note moyenne</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-yellow-500">24/7</div>
              <div className="text-sm text-gray-600">Service disponible</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-500">100%</div>
              <div className="text-sm text-gray-600">Sécurisé</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'évaluation */}
      <RatingModal
        isOpen={showRating}
        onClose={() => setShowRating(false)}
        onSubmit={handleRatingSubmit}
        targetName={mockDriver.name}
        targetType="driver"
      />
    </div>
  );
};

export default Index;
