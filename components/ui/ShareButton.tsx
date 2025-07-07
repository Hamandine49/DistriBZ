import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Share as ShareIcon } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { VendingMachine } from '@/types/vendingMachine';
import { shareVendingMachine, ShareOptions } from '@/utils/shareUtils';

interface ShareButtonProps {
  machine: VendingMachine;
  variant?: 'primary' | 'secondary' | 'icon';
  size?: 'small' | 'medium' | 'large';
  style?: any;
  shareOptions?: ShareOptions;
  onShareStart?: () => void;
  onShareComplete?: (success: boolean) => void;
}

export default function ShareButton({
  machine,
  variant = 'primary',
  size = 'medium',
  style,
  shareOptions = {},
  onShareStart,
  onShareComplete,
}: ShareButtonProps) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    setLoading(true);
    onShareStart?.();

    try {
      const success = await shareVendingMachine(machine, shareOptions);
      onShareComplete?.(success);
    } finally {
      setLoading(false);
    }
  };

  const getButtonStyle = () => {
    const baseStyle = {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      borderRadius: variant === 'icon' ? 20 : 25,
      opacity: loading ? 0.7 : 1,
    };

    const sizeStyles = {
      small: { paddingVertical: 6, paddingHorizontal: 12 },
      medium: { paddingVertical: 10, paddingHorizontal: 20 },
      large: { paddingVertical: 14, paddingHorizontal: 24 },
    };

    const variantStyles = {
      primary: { backgroundColor: theme.colors.primary },
      secondary: { backgroundColor: theme.colors.secondary },
      icon: { 
        backgroundColor: theme.colors.card + 'E6',
        width: variant === 'icon' ? 40 : undefined,
        height: variant === 'icon' ? 40 : undefined,
        paddingVertical: variant === 'icon' ? 0 : sizeStyles[size].paddingVertical,
        paddingHorizontal: variant === 'icon' ? 0 : sizeStyles[size].paddingHorizontal,
      },
    };

    return [baseStyle, sizeStyles[size], variantStyles[variant], style];
  };

  const getIconSize = () => {
    const sizes = { small: 16, medium: 20, large: 24 };
    return sizes[size];
  };

  const getTextColor = () => {
    return variant === 'icon' ? theme.colors.text : '#FFF';
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={handleShare}
      disabled={loading}
      activeOpacity={0.7}
    >
      <ShareIcon size={getIconSize()} color={getTextColor()} />
      {variant !== 'icon' && (
        <Text style={[styles.buttonText, { color: getTextColor() }]}>
          {loading ? 'Partage...' : 'Partager'}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
});