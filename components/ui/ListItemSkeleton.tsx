import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  cancelAnimation, 
  withSequence 
} from 'react-native-reanimated';
import { useEffect } from 'react';

export default function ListItemSkeleton() {
  const { theme } = useTheme();
  const opacity = useSharedValue(0.5);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 500 }),
        withTiming(0.5, { duration: 500 }),
      ),
      -1,
      false
    );

    return () => {
      cancelAnimation(opacity);
    };
  }, []);

  return (
    <Animated.View 
      style={[
        styles.container, 
        { backgroundColor: theme.colors.card },
        animatedStyle
      ]}
    >
      <View style={styles.imageContainer} />
      <View style={styles.content}>
        <View style={[styles.title, { backgroundColor: theme.colors.background }]} />
        <View style={[styles.subtitle, { backgroundColor: theme.colors.background }]} />
        <View style={styles.bottomRow}>
          <View style={[styles.chip, { backgroundColor: theme.colors.background }]} />
          <View style={[styles.info, { backgroundColor: theme.colors.background }]} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    height: 150,
    backgroundColor: '#D1D1D1',
  },
  content: {
    padding: 16,
  },
  title: {
    height: 24,
    width: '70%',
    borderRadius: 4,
    marginBottom: 12,
  },
  subtitle: {
    height: 16,
    width: '90%',
    borderRadius: 4,
    marginBottom: 16,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chip: {
    height: 20,
    width: '30%',
    borderRadius: 10,
  },
  info: {
    height: 20,
    width: '40%',
    borderRadius: 4,
  },
});