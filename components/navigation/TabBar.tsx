import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { Map, List, CirclePlus as PlusCircle, Heart, User } from 'lucide-react-native';

export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 8,
          borderTopColor: theme.colors.border,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || options.title || route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const getTabIcon = () => {
          const iconSize = 24;
          const color = isFocused ? theme.colors.primary : theme.colors.textSecondary;

          switch (route.name) {
            case 'index':
              return <Map size={iconSize} color={color} />;
            case 'list':
              return <List size={iconSize} color={color} />;
            case 'add':
              return (
                <View style={[styles.addButton, { backgroundColor: theme.colors.primary }]}>
                  <PlusCircle size={iconSize + 4} color="#fff" />
                </View>
              );
            case 'favorites':
              return <Heart size={iconSize} color={color} />;
            case 'profile':
              return <User size={iconSize} color={color} />;
            default:
              return null;
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tab}
          >
            {getTabIcon()}
            {route.name !== 'add' && (
              <Text
                style={[
                  styles.label,
                  {
                    color: isFocused ? theme.colors.primary : theme.colors.textSecondary,
                    fontFamily: isFocused ? 'Inter-Medium' : 'Inter-Regular',
                  },
                ]}
              >
                {label as string}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});