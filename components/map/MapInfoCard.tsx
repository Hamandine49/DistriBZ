import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Star, MapPin, X, ChevronRight } from 'lucide-react-native';
import { VendingMachine } from '@/types/vendingMachine';

interface MapInfoCardProps {
  machine: VendingMachine;
  onClose: () => void;
  onPress: () => void;
}

export default function MapInfoCard({ machine, onClose, onPress }: MapInfoCardProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.card }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <TouchableOpacity
        style={[styles.closeButton, { backgroundColor: theme.colors.background }]}
        onPress={onClose}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <X size={16} color={theme.colors.text} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Image source={{ uri: machine.imageUrl }} style={styles.image} />
        
        <View style={styles.info}>
          <View style={styles.header}>
            <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={1}>
              {machine.name}
            </Text>
            <View style={styles.ratingContainer}>
              <Star size={14} color={theme.colors.primary} fill={theme.colors.primary} />
              <Text style={[styles.rating, { color: theme.colors.text }]}>
                {machine.rating.toFixed(1)}
              </Text>
            </View>
          </View>
          
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(machine.category, theme) }]}>
            <Text style={styles.categoryText}>{machine.category}</Text>
          </View>
          
          <View style={styles.location}>
            <MapPin size={14} color={theme.colors.textSecondary} />
            <Text style={[styles.address, { color: theme.colors.textSecondary }]} numberOfLines={1}>
              {machine.address}
            </Text>
          </View>
        </View>
        
        <View style={styles.arrowContainer}>
          <ChevronRight size={24} color={theme.colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
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
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    padding: 12,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  rating: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 4,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  categoryText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginLeft: 4,
    flex: 1,
  },
  arrowContainer: {
    justifyContent: 'center',
    marginLeft: 8,
  },
});