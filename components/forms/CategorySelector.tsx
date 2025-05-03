import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { ChevronDown } from 'lucide-react-native';

const categories = [
  { id: 'Pain', name: 'Pain', icon: '🍞' },
  { id: 'Pizza', name: 'Pizza', icon: '🍕' },
  { id: 'Fleurs', name: 'Fleurs', icon: '💐' },
  { id: 'Lait', name: 'Lait', icon: '🥛' },
  { id: 'Oeufs', name: 'Oeufs', icon: '🥚' },
  { id: 'Produits locaux', name: 'Produits locaux', icon: '🧺' },
  { id: 'Autre', name: 'Autre', icon: '📦' },
];

interface CategorySelectorProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  error?: string;
}

export default function CategorySelector({ 
  selectedCategory, 
  onSelectCategory,
  error
}: CategorySelectorProps) {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const selectedItem = categories.find(cat => cat.id === selectedCategory);

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.selectButton,
          { 
            backgroundColor: theme.colors.card,
            borderColor: error ? theme.colors.error : theme.colors.border,
          }
        ]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.selectedCategory}>
          {selectedItem ? (
            <>
              <Text style={styles.categoryIcon}>{selectedItem.icon}</Text>
              <Text style={[styles.categoryText, { color: theme.colors.text }]}>
                {selectedItem.name}
              </Text>
            </>
          ) : (
            <Text style={[styles.placeholderText, { color: theme.colors.textSecondary }]}>
              Sélectionnez une catégorie
            </Text>
          )}
        </View>
        <ChevronDown size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>

      {error && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Choisir une catégorie
            </Text>
            
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryItem,
                    selectedCategory === item.id && { 
                      backgroundColor: theme.colors.primary + '20'
                    }
                  ]}
                  onPress={() => {
                    onSelectCategory(item.id);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.categoryItemIcon}>{item.icon}</Text>
                  <Text style={[styles.categoryItemText, { color: theme.colors.text }]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.categoriesList}
            />
            
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: theme.colors.background }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.closeButtonText, { color: theme.colors.text }]}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  selectButton: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  categoryText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  placeholderText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  categoriesList: {
    marginBottom: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  categoryItemIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  categoryItemText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  closeButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
});