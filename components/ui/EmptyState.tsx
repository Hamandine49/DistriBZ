import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Button from './Button';

interface EmptyStateProps {
  message: string;
  subMessage?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export default function EmptyState({ 
  message, 
  subMessage, 
  actionText, 
  onAction,
  icon
}: EmptyStateProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {icon && (
        <View style={styles.iconContainer}>
          {icon}
        </View>
      )}
      
      <Text style={[styles.message, { color: theme.colors.text }]}>
        {message}
      </Text>
      
      {subMessage && (
        <Text style={[styles.subMessage, { color: theme.colors.textSecondary }]}>
          {subMessage}
        </Text>
      )}
      
      {actionText && onAction && (
        <Button 
          title={actionText}
          onPress={onAction}
          style={styles.actionButton}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  iconContainer: {
    marginBottom: 24,
  },
  message: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  subMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  actionButton: {
    width: '80%',
    marginTop: 8,
  },
});