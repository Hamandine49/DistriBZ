import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CategoryMarkerProps {
  category: string;
}

export default function CategoryMarker({ category }: CategoryMarkerProps) {
  return (
    <View style={[styles.markerContainer, { backgroundColor: getCategoryColor(category) }]}>
      <Text style={styles.markerIcon}>{getCategoryIcon(category)}</Text>
    </View>
  );
}

function getCategoryColor(category: string): string {
  const categoryColors: Record<string, string> = {
    'Pain': '#F59E0B',
    'Pizza': '#EF4444',
    'Fleurs': '#EC4899',
    'Lait': '#3B82F6',
    'Oeufs': '#10B981',
    'Produits locaux': '#8B5CF6',
    'Autre': '#6B7280',
  };

  return categoryColors[category] || '#6B7280';
}

function getCategoryIcon(category: string): string {
  const categoryIcons: Record<string, string> = {
    'Pain': '🍞',
    'Pizza': '🍕',
    'Fleurs': '💐',
    'Lait': '🥛',
    'Oeufs': '🥚',
    'Produits locaux': '🧺',
    'Autre': '📦',
  };

  return categoryIcons[category] || '📍';
}

const styles = StyleSheet.create({
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerIcon: {
    fontSize: 18,
  },
});