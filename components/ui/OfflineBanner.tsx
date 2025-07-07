import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useNetwork } from '@/contexts/NetworkContext';
import { WifiOff, RefreshCw, Clock } from 'lucide-react-native';

interface OfflineBannerProps {
  onRetry?: () => void;
}

export default function OfflineBanner({ onRetry }: OfflineBannerProps) {
  const { theme } = useTheme();
  const { isConnected, isOfflineMode, lastSyncTime, cachedMachines } = useNetwork();

  if (isConnected) return null;

  const formatLastSync = () => {
    if (!lastSyncTime) return 'Jamais synchronisé';
    
    const now = new Date();
    const diff = now.getTime() - lastSyncTime.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.warning }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <WifiOff size={20} color="#FFF" />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {isOfflineMode ? 'Mode hors ligne activé' : 'Pas de connexion'}
          </Text>
          
          {isOfflineMode ? (
            <View style={styles.infoRow}>
              <Clock size={14} color="#FFF" />
              <Text style={styles.subtitle}>
                {cachedMachines.length} distributeurs • {formatLastSync()}
              </Text>
            </View>
          ) : (
            <Text style={styles.subtitle}>
              Vérifiez votre connexion internet
            </Text>
          )}
        </View>
        
        {onRetry && (
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <RefreshCw size={18} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#FFF',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: 2,
  },
  subtitle: {
    color: '#FFF',
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    opacity: 0.9,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  retryButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});