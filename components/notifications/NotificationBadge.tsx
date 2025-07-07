import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useNotifications } from '@/contexts/NotificationContext';

interface NotificationBadgeProps {
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

export default function NotificationBadge({ size = 'medium', style }: NotificationBadgeProps) {
  const { theme } = useTheme();
  const { unreadCount } = useNotifications();

  if (unreadCount === 0) return null;

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: 16, height: 16, fontSize: 10 };
      case 'large':
        return { width: 24, height: 24, fontSize: 14 };
      default:
        return { width: 20, height: 20, fontSize: 12 };
    }
  };

  const sizeStyles = getSizeStyles();
  const displayCount = unreadCount > 99 ? '99+' : unreadCount.toString();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: theme.colors.error,
          width: sizeStyles.width,
          height: sizeStyles.height,
          borderRadius: sizeStyles.width / 2,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          {
            fontSize: sizeStyles.fontSize,
            color: '#FFF',
          },
        ]}
      >
        {displayCount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 10,
  },
  badgeText: {
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
});