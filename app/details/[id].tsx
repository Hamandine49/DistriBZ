import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Platform, Share } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useVendingMachines } from '@/contexts/VendingMachineContext';
import { useTheme } from '@/contexts/ThemeContext';
import { MapPin, Navigation, Heart, Share as ShareIcon, Star, ArrowLeft, Clock, ChevronRight } from 'lucide-react-native';
import * as Linking from 'expo-linking';
import ReviewsList from '@/components/reviews/ReviewsList';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { getVendingMachineById, toggleFavorite, isFavorite } = useVendingMachines();
  const [machine, setMachine] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchMachine = async () => {
      try {
        if (!id) {
          setError('Identifiant manquant');
          setLoading(false);
          return;
        }

        const machineData = await getVendingMachineById(id);
        if (machineData) {
          setMachine(machineData);
          
          if (user) {
            const favoriteStatus = await isFavorite(id);
            setIsFavorited(favoriteStatus);
          }
        } else {
          setError('Distributeur non trouvé');
        }
      } catch (err) {
        setError('Erreur lors du chargement du distributeur');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMachine();
  }, [id, user]);

  const handleNavigate = () => {
    if (!machine) return;
    
    const scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
    const url = `${scheme}0,0?q=${machine.latitude},${machine.longitude}(${encodeURIComponent(machine.name)})`;
    
    Linking.openURL(url).catch(err => {
      console.error('Error opening maps:', err);
    });
  };

  const handleShare = async () => {
    if (!machine) return;
    
    try {
      const result = await Share.share({
        title: machine.name,
        message: `Découvrez ce distributeur: ${machine.name} à ${machine.address}`,
        url: `https://vendingfinder.com/details/${machine.id}`, // Replace with your app's URL scheme
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      router.push('/(auth)/login');
      return;
    }

    if (!machine) return;
    
    try {
      await toggleFavorite(machine.id);
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>Chargement...</Text>
      </View>
    );
  }

  if (error || !machine) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{error || 'Erreur inconnue'}</Text>
        <Button 
          title="Retour" 
          onPress={() => router.back()} 
          variant="secondary"
        />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: machine.imageUrl }} 
            style={styles.image} 
            resizeMode="cover"
          />
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: theme.colors.card + 'E6' }]} 
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
          
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.colors.card + 'E6' }]} 
              onPress={handleToggleFavorite}
            >
              <Heart 
                size={24} 
                color={theme.colors.primary} 
                fill={isFavorited ? theme.colors.primary : 'transparent'} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.colors.card + 'E6' }]} 
              onPress={handleShare}
            >
              <ShareIcon size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: theme.colors.text }]}>{machine.name}</Text>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(machine.category, theme) }]}>
                <Text style={styles.categoryText}>{machine.category}</Text>
              </View>
            </View>
            
            <View style={styles.ratingContainer}>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star}
                    size={16} 
                    color={theme.colors.primary} 
                    fill={star <= machine.rating ? theme.colors.primary : 'transparent'} 
                  />
                ))}
              </View>
              <Text style={[styles.ratingText, { color: theme.colors.text }]}>
                {machine.rating.toFixed(1)} ({machine.reviewCount} avis)
              </Text>
            </View>
          </View>
          
          <View style={[styles.section, styles.addressSection]}>
            <View style={styles.addressContainer}>
              <MapPin size={20} color={theme.colors.primary} />
              <Text style={[styles.address, { color: theme.colors.text }]}>{machine.address}</Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.navigateButton, { backgroundColor: theme.colors.primary }]} 
              onPress={handleNavigate}
            >
              <Navigation size={20} color="#FFF" />
              <Text style={styles.navigateButtonText}>Y aller</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.section}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Prix moyen</Text>
                <Text style={[styles.infoValue, { color: theme.colors.text }]}>{machine.averagePrice}€</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Mise à jour</Text>
                <View style={styles.updatedContainer}>
                  <Clock size={14} color={theme.colors.textSecondary} />
                  <Text style={[styles.updatedText, { color: theme.colors.textSecondary }]}>
                    Il y a 3 jours
                  </Text>
                </View>
              </View>
            </View>
          </View>
          
          {machine.description && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Description</Text>
              <Text style={[styles.description, { color: theme.colors.text }]}>
                {machine.description}
              </Text>
            </View>
          )}
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Avis</Text>
              <TouchableOpacity style={styles.viewAllButton} onPress={() => router.push(`/reviews/${machine.id}`)}>
                <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>Voir tout</Text>
                <ChevronRight size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
            
            <ReviewsList machineId={machine.id} limit={3} />
            
            <Button 
              title="Laisser un avis" 
              onPress={() => router.push(`/add-review/${machine.id}`)}
              style={styles.reviewButton}
              variant="secondary"
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
}

function getCategoryColor(category: string, theme: any) {
  const categoryColors: Record<string, string> = {
    'Pain': '#F59E0B',
    'Pizza': '#EF4444',
    'Fleurs': '#EC4899',
    'Lait': '#3B82F6',
    'Oeufs': '#10B981',
    'Produits locaux': '#8B5CF6',
    'Autre': '#6B7280',
  };

  return categoryColors[category] || theme.colors.secondary;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    position: 'relative',
    height: 250,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonsContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 16,
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  contentContainer: {
    padding: 20,
  },
  headerContainer: {
    marginBottom: 20,
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  addressSection: {
    backgroundColor: 'transparent',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginBottom: 16,
  },
  address: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginLeft: 8,
    flex: 1,
  },
  navigateButton: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigateButtonText: {
    color: '#FFF',
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
  },
  updatedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  updatedText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginLeft: 4,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    marginBottom: 12,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  reviewButton: {
    marginTop: 16,
  },
});