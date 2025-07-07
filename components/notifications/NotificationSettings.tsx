import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Bell, BellOff, TestTube, MapPin, Heart, Award, Megaphone } from 'lucide-react-native';
import Button from '@/components/ui/Button';

export default function NotificationSettings() {
  const { theme } = useTheme();
  const { 
    preferences, 
    updatePreferences, 
    requestPermissions, 
    sendTestNotification,
    expoPushToken,
    loading 
  } = useNotifications();
  const [updating, setUpdating] = useState<string | null>(null);

  const handlePermissionRequest = async () => {
    const granted = await requestPermissions();
    if (granted) {
      Alert.alert(
        'Notifications activées',
        'Vous recevrez maintenant des notifications pour les événements sélectionnés.'
      );
    } else {
      Alert.alert(
        'Permissions refusées',
        'Vous pouvez activer les notifications dans les paramètres de votre appareil.'
      );
    }
  };

  const handlePreferenceChange = async (key: keyof typeof preferences, value: boolean) => {
    setUpdating(key);
    try {
      await updatePreferences({ [key]: value });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour les préférences');
    } finally {
      setUpdating(null);
    }
  };

  const handleTestNotification = async () => {
    try {
      await sendTestNotification();
      Alert.alert(
        'Notification envoyée',
        'Vous devriez recevoir une notification de test dans quelques secondes.'
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'envoyer la notification de test');
    }
  };

  const PreferenceItem = ({ 
    icon, 
    title, 
    description, 
    value, 
    onValueChange, 
    prefKey 
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    prefKey: string;
  }) => (
    <View style={[styles.preferenceItem, { backgroundColor: theme.colors.card }]}>
      <View style={styles.preferenceContent}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.background }]}>
          {icon}
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.preferenceTitle, { color: theme.colors.text }]}>
            {title}
          </Text>
          <Text style={[styles.preferenceDescription, { color: theme.colors.textSecondary }]}>
            {description}
          </Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#767577', true: theme.colors.primary + '80' }}
        thumbColor={value ? theme.colors.primary : '#f4f3f4'}
        disabled={updating === prefKey}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          {expoPushToken ? (
            <Bell size={24} color={theme.colors.primary} />
          ) : (
            <BellOff size={24} color={theme.colors.textSecondary} />
          )}
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Notifications Push
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
            {expoPushToken 
              ? 'Notifications activées sur cet appareil'
              : 'Notifications désactivées'
            }
          </Text>
        </View>
      </View>

      {!expoPushToken && (
        <View style={[styles.permissionCard, { backgroundColor: theme.colors.warning + '20' }]}>
          <Text style={[styles.permissionText, { color: theme.colors.text }]}>
            Activez les notifications pour être informé des nouveaux distributeurs près de chez vous
          </Text>
          <Button
            title="Activer les notifications"
            onPress={handlePermissionRequest}
            style={styles.permissionButton}
          />
        </View>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
          Préférences de notification
        </Text>

        <PreferenceItem
          icon={<MapPin size={20} color={theme.colors.primary} />}
          title="Nouveaux distributeurs à proximité"
          description="Recevez une notification quand un nouveau distributeur est ajouté près de votre position"
          value={preferences.newMachinesNearby}
          onValueChange={(value) => handlePreferenceChange('newMachinesNearby', value)}
          prefKey="newMachinesNearby"
        />

        <PreferenceItem
          icon={<Award size={20} color={theme.colors.success} />}
          title="Distributeur approuvé"
          description="Soyez notifié quand un distributeur que vous avez ajouté est approuvé"
          value={preferences.machineApproved}
          onValueChange={(value) => handlePreferenceChange('machineApproved', value)}
          prefKey="machineApproved"
        />

        <PreferenceItem
          icon={<Heart size={20} color={theme.colors.error} />}
          title="Mises à jour des favoris"
          description="Recevez des notifications sur les changements de vos distributeurs favoris"
          value={preferences.favoritesUpdates}
          onValueChange={(value) => handlePreferenceChange('favoritesUpdates', value)}
          prefKey="favoritesUpdates"
        />

        <PreferenceItem
          icon={<Megaphone size={20} color={theme.colors.secondary} />}
          title="Offres promotionnelles"
          description="Recevez des notifications sur les offres spéciales et nouveautés"
          value={preferences.promotional}
          onValueChange={(value) => handlePreferenceChange('promotional', value)}
          prefKey="promotional"
        />
      </View>

      {expoPushToken && (
        <View style={styles.testSection}>
          <Button
            title="Envoyer une notification de test"
            onPress={handleTestNotification}
            variant="secondary"
            icon={<TestTube size={20} color="#FFF" />}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerIcon: {
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  permissionCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  permissionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionButton: {
    alignSelf: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  preferenceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  preferenceTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 4,
  },
  preferenceDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    lineHeight: 16,
  },
  testSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
});