import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Search, X } from 'lucide-react-native';

interface SearchBarProps {
  onSearchChange: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({ 
  onSearchChange, 
  placeholder = 'Rechercher des distributeurs...' 
}: SearchBarProps) {
  const { theme } = useTheme();
  const [searchText, setSearchText] = useState('');

  const handleClear = () => {
    setSearchText('');
    onSearchChange('');
  };

  const handleChange = (text: string) => {
    setSearchText(text);
    onSearchChange(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Search size={20} color={theme.colors.textSecondary} />
      </View>
      
      <TextInput
        style={[styles.input, { color: theme.colors.text }]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        value={searchText}
        onChangeText={handleChange}
      />
      
      {searchText.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <X size={18} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
  },
  iconContainer: {
    paddingLeft: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  clearButton: {
    paddingHorizontal: 12,
    height: '100%',
    justifyContent: 'center',
  },
});