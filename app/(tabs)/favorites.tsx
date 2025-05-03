import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useVendingMachines } from '@/contexts/VendingMachineContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Heart, MapPin, Navigation } from 'lucide-react-native';
import Header from '@/components/ui/Header';
import EmptyState from '@/components/ui/EmptyState';
import { useAuth } from '@/contexts/AuthContext';

export default function FavoritesScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { favoriteVendingMachines, getFavorites, toggleFavorite } = useVendingMachines();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      getFavorites();
    }
  }, [user]);

  const navigateToDetail = (id: string) => {
    router.push(`/details/${id}`);
  };

  const handleRemoveFavorite = (id: string) => {
    toggleFavorite(id);
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Header title="Mes favoris" />
        <EmptyState
          message="Connectez-vous pour accéder à vos favoris"
          actionText="Se connecter"
          onAction={() => router.push('/(auth)/login')}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Mes favoris" />

      {favoriteVendingMachines.length === 0 ? (
        <EmptyState
          message="Aucun favori pour le moment"
          subMessage="Ajoutez des distributeurs à vos favoris pour les retrouver ici"
          icon={<Heart size={48} color={theme.colors.primary} />}
        />
      ) : (
        <FlatList
          data={favoriteVendingMachines}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: theme.colors.card }]}
              onPress={() => navigateToDetail(item.id)}
              activeOpacity={0.7}
            >
              <Image 
                source={{ uri: item.imageUrl }} 
                style={styles.image}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={[styles.favoriteButton, { backgroundColor: theme.colors.card }]}
                onPress={() => handleRemoveFavorite(item.id)}
              >
                <Heart size={20} color={theme.colors.primary} fill={theme.colors.primary} />
              </TouchableOpacity>
              <View style={styles.content}>
                <Text style={[styles.name, { color: theme.colors.text }]}>{item.name}</Text>
                <View style={styles.categoryContainer}>
                  <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category, theme) }]}>
                    <Text style={styles.categoryText}>{item.category}</Text>
                  </View>
                </View>
                <View style={styles.locationContainer}>
                  <MapPin size={16} color={theme.colors.text} />
                  <Text style={[styles.address, { color: theme.colors.text }]} numberOfLines={2}>
                    {item.address}
                  </Text>
                </View>
                <View style={styles.footer}>
                  <Text style={[styles.price, { color: theme.colors.text }]}>
                    Prix moyen: {item.averagePrice}€
                  </Text>
                  <View style={styles.navigationButton}>
                    <Navigation size={16} color={theme.colors.primary} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
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
    paddingTop: 60,
  },
  listContent: {
    padding: 16,
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    height: 150,
    width: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    padding: 16,
  },
  name: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    marginBottom: 8,
  },
  categoryContainer: {
    marginBottom: 12,
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  address: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginLeft: 6,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  navigationButton: {
    padding: 8,
  },
});