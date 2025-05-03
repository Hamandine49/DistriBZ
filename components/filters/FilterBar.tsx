import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

const categories = [
  { id: 'all', name: 'Tout', icon: '🔍' },
  { id: 'pain', name: 'Pain', icon: '🍞' },
  { id: 'pizza', name: 'Pizza', icon: '🍕' },
  { id: 'fleurs', name: 'Fleurs', icon: '💐' },
  { id: 'lait', name: 'Lait', icon: '🥛' },
  { id: 'oeufs', name: 'Oeufs', icon: '🥚' },
  { id: 'produits-locaux', name: 'Produits locaux', icon: '🧺' },
  { id: 'autre', name: 'Autre', icon: '📦' },
];

interface FilterBarProps {
  onFilterChange: (category: string) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    onFilterChange(categoryId);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              {
                backgroundColor: selectedCategory === category.id 
                  ? theme.colors.primary 
                  : theme.colors.card,
                borderColor: theme.colors.border,
              },
            ]}
            onPress={() => handleCategorySelect(category.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text
              style={[
                styles.categoryText,
                {
                  color: selectedCategory === category.id
                    ? '#FFF'
                    : theme.colors.text,
                },
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
  },
  scrollContent: {
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 6,
    borderWidth: 1,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});