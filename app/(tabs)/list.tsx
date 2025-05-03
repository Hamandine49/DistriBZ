import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useVendingMachines } from '@/contexts/VendingMachineContext';
import { useTheme } from '@/contexts/ThemeContext';
import FilterBar from '@/components/filters/FilterBar';
import { Star, MapPin, Navigation } from 'lucide-react-native';
import Header from '@/components/ui/Header';
import SearchBar from '@/components/search/SearchBar';
import EmptyState from '@/components/ui/EmptyState';
import ListItemSkeleton from '@/components/ui/ListItemSkeleton';

export default function ListScreen() {
  const { theme } = useTheme();
  const { filteredMachines, getVendingMachines, setFilter, loading } = useVendingMachines();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    getVendingMachines();
  }, []);

  const navigateToDetail = (id: string) => {
    router.push(`/details/${id}`);
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const handleFilterChange = (category: string) => {
    setFilter(category);
  };

  const displayedMachines = filteredMachines.filter(machine => 
    machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    machine.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Header title="Liste des distributeurs" />
        <View style={styles.searchContainer}>
          <SearchBar onSearchChange={handleSearchChange} />
        </View>
        <FilterBar onFilterChange={handleFilterChange} />
        <FlatList
          data={[1, 2, 3, 4, 5]}
          keyExtractor={(item) => item.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={() => <ListItemSkeleton />}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Liste des distributeurs" />
      
      <View style={styles.searchContainer}>
        <SearchBar onSearchChange={handleSearchChange} />
      </View>

      <FilterBar onFilterChange={handleFilterChange} />
      
      {displayedMachines.length === 0 ? (
        <EmptyState 
          message="Aucun distributeur trouvé"
          subMessage="Essayez un autre filtre ou ajoutez un nouveau distributeur"
        />
      ) : (
        <FlatList
          data={displayedMachines}
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
              <View style={styles.content}>
                <View style={styles.header}>
                  <Text style={[styles.name, { color: theme.colors.text }]}>{item.name}</Text>
                  <View style={styles.rating}>
                    <Star size={16} color={theme.colors.primary} fill={theme.colors.primary} />
                    <Text style={[styles.ratingText, { color: theme.colors.text }]}>
                      {item.rating.toFixed(1)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.categoryContainer}>
                  <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category, theme) }]}>
                    <Text style={styles.categoryText}>{item.category}</Text>
                  </View>
                </View>
                
                <View style={styles.locationContainer}>
                  <MapPin size={16} color={theme.colors.text} />
                  <Text style={[styles.address, { color: theme.colors.text }]} numberOfLines={1}>
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
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
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
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    flex: 1,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
    fontSize: 14,
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
    alignItems: 'center',
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