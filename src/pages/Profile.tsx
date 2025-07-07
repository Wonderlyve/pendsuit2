
import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Car, Bell, CreditCard, Shield, Phone, Mail, MapPin } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: 'Jean Dubois',
    email: 'jean.dubois@email.com',
    phone: '+33 1 23 45 67 89',
    address: '123 Rue de la République, Paris',
    isDriver: false,
    notifications: {
      rides: true,
      promotions: true,
      news: false
    }
  });

  const [driverInfo, setDriverInfo] = useState({
    licenseNumber: 'DRV123456789',
    vehicle: {
      make: 'Renault',
      model: 'Megane',
      year: 2020,
      color: 'Blanc',
      plate: 'AB-123-CD'
    },
    rating: 4.8,
    totalRides: 247
  });

  const handleProfileUpdate = (field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationUpdate = (field: string, value: boolean) => {
    setProfile(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Mon Profil</h1>
          <p className="text-gray-600">Gérez vos informations personnelles et préférences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Photo de profil et informations de base */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=3b82f6&color=fff&size=96`}
                    alt={profile.name}
                    className="w-full h-full rounded-full"
                  />
                </div>
                <h2 className="text-xl font-bold mb-2">{profile.name}</h2>
                <p className="text-gray-600 mb-4">{profile.email}</p>
                
                {profile.isDriver && (
                  <div className="space-y-2">
                    <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                      🚗 Chauffeur AUTOCOP
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold">Note: {driverInfo.rating}/5</div>
                      <div className="text-gray-600">{driverInfo.totalRides} courses</div>
                    </div>
                  </div>
                )}
                
                <Button className="w-full mt-4" variant="outline">
                  Changer la photo
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Informations détaillées */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations personnelles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Informations personnelles</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => handleProfileUpdate('name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleProfileUpdate('email', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={profile.address}
                    onChange={(e) => handleProfileUpdate('address', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Mode chauffeur */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Car className="w-5 h-5" />
                  <span>Mode Chauffeur</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="driver-mode" className="text-base font-medium">
                      Devenir chauffeur AUTOCOP
                    </Label>
                    <p className="text-sm text-gray-600">
                      Activez cette option pour recevoir des demandes de course
                    </p>
                  </div>
                  <Switch
                    id="driver-mode"
                    checked={profile.isDriver}
                    onCheckedChange={(checked) => handleProfileUpdate('isDriver', checked)}
                  />
                </div>

                {profile.isDriver && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h4 className="font-semibold">Informations chauffeur</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Numéro de permis</Label>
                          <Input value={driverInfo.licenseNumber} readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label>Plaque d'immatriculation</Label>
                          <Input value={driverInfo.vehicle.plate} readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label>Marque</Label>
                          <Input value={driverInfo.vehicle.make} readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label>Modèle</Label>
                          <Input value={driverInfo.vehicle.model} readOnly />
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        Modifier les informations du véhicule
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notif-rides">Demandes de course</Label>
                    <p className="text-sm text-gray-600">Recevez des notifications pour les nouvelles courses</p>
                  </div>
                  <Switch
                    id="notif-rides"
                    checked={profile.notifications.rides}
                    onCheckedChange={(checked) => handleNotificationUpdate('rides', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notif-promotions">Promotions</Label>
                    <p className="text-sm text-gray-600">Recevez des offres spéciales et réductions</p>
                  </div>
                  <Switch
                    id="notif-promotions"
                    checked={profile.notifications.promotions}
                    onCheckedChange={(checked) => handleNotificationUpdate('promotions', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notif-news">Actualités</Label>
                    <p className="text-sm text-gray-600">Recevez les dernières nouvelles d'AUTOCOP</p>
                  </div>
                  <Switch
                    id="notif-news"
                    checked={profile.notifications.news}
                    onCheckedChange={(checked) => handleNotificationUpdate('news', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex space-x-4">
              <Button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-slate-900">
                Sauvegarder les modifications
              </Button>
              <Button variant="outline" className="flex-1">
                Annuler
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
