import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useNetwork } from '@/contexts/NetworkContext';
import { VendingMachine } from '@/types/vendingMachine';
import { MapPin, Star, Navigation } from 'lucide-react-native';

interface OfflineMapViewProps {
  onMachinePress: (machine: VendingMachine) => void;
  selectedCategory?: string;
}

export default function OfflineMapView({ onMachinePress, selectedCategory }: OfflineMapViewProps) {
  const { theme } = useTheme();
  const { cachedMachines } = useNetwork();

  const filteredMachines = selectedCategory && selectedCategory !== 'all'
    ? cachedMachines.filter(machine => 
        machine.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    : cachedMachines;

  const getCategoryColor = (category: string) => {
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
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <MapPin size={20} color={theme.colors.primary} />
        <Text style={[styles.headerText, { color: theme.colors.text }]}>
          Distributeurs en cache ({filteredMachines.length})
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredMachines.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              {selectedCategory && selectedCategory !== 'all' 
                ? 'Aucun distributeur de cette catégorie en cache'
                : 'Aucun distributeur en cache'
              }
            </Text>
          </View>
        ) : (
          filteredMachines.map((machine) => (
            <TouchableOpacity
              key={machine.id}
              style={[styles.machineCard, { backgroundColor: theme.colors.card }]}
              onPress={() => onMachinePress(machine)}
              activeOpacity={0.7}
            >
              <Image 
                source={{ uri: machine.imageUrl }} 
                style={styles.machineImage}
                resizeMode="cover"
              />
              
              <View style={styles.machineInfo}>
                <View style={styles.machineHeader}>
                  <Text style={[styles.machineName, { color: theme.colors.text }]} numberOfLines={1}>
                    {machine.name}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <Star size={14} color={theme.colors.primary} fill={theme.colors.primary} />
                    <Text style={[styles.ratingText, { color: theme.colors.text }]}>
                      {machine.rating.toFixed(1)}
                    </Text>
                  </View>
                </View>
                
                <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(machine.category) }]}>
                  <Text style={styles.categoryText}>{machine.category}</Text>
                </View>
                
                <View style={styles.locationContainer}>
                  <MapPin size={12} color={theme.colors.textSecondary} />
                  <Text style={[styles.addressText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                    {machine.address}
                  </Text>
                </View>
                
                <View style={styles.footer}>
                  <Text style={[styles.priceText, { color: theme.colors.text }]}>
                    {machine.averagePrice}€
                  </Text>
                  <View style={styles.offlineIndicator}>
                    <Text style={[styles.offlineText, { color: theme.colors.textSecondary }]}>
                      Hors ligne
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
  machineCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  machineImage: {
    height: 120,
    width: '100%',
  },
  machineInfo: {
    padding: 12,
  },
  machineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  machineName: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  ratingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 4,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginLeft: 4,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
  offlineIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  offlineText: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
  },
});