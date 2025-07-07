import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface NotificationPreferences {
  newMachinesNearby: boolean;
  machineApproved: boolean;
  favoritesUpdates: boolean;
  promotional: boolean;
}

interface NotificationContextProps {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  preferences: NotificationPreferences;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => Promise<void>;
  requestPermissions: () => Promise<boolean>;
  sendTestNotification: () => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  unreadCount: number;
  loading: boolean;
}

const NotificationContext = createContext<NotificationContextProps>({
  expoPushToken: null,
  notification: null,
  preferences: {
    newMachinesNearby: true,
    machineApproved: true,
    favoritesUpdates: true,
    promotional: false,
  },
  updatePreferences: async () => {},
  requestPermissions: async () => false,
  sendTestNotification: async () => {},
  markNotificationAsRead: async () => {},
  unreadCount: 0,
  loading: false,
});

export const NotificationProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { user } = useAuth();
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    newMachinesNearby: true,
    machineApproved: true,
    favoritesUpdates: true,
    promotional: false,
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    if (user) {
      registerForPushNotificationsAsync();
      loadNotificationPreferences();
      loadUnreadCount();
    }

    // Listen for incoming notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      setUnreadCount(prev => prev + 1);
    });

    // Listen for notification responses (when user taps notification)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const notificationId = response.notification.request.content.data?.id;
      if (notificationId) {
        markNotificationAsRead(notificationId);
      }
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [user]);

  const registerForPushNotificationsAsync = async () => {
    if (!user) return;

    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }
      
      try {
        const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
        if (!projectId) {
          throw new Error('Project ID not found');
        }
        
        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        setExpoPushToken(token);
        
        // Save token to Supabase
        await savePushTokenToSupabase(token);
      } catch (error) {
        console.error('Error getting push token:', error);
      }
    } else {
      console.log('Must use physical device for Push Notifications');
    }
  };

  const savePushTokenToSupabase = async (token: string) => {
    if (!user) return;

    try {
      const deviceType = Platform.OS;
      const deviceId = Device.osInternalBuildId || Device.modelId || 'unknown';

      // First, deactivate any existing tokens for this device
      await supabase
        .from('user_push_tokens')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .eq('device_id', deviceId);

      // Insert new token
      const { error } = await supabase
        .from('user_push_tokens')
        .insert({
          user_id: user.id,
          push_token: token,
          device_type: deviceType,
          device_id: deviceId,
          is_active: true,
        });

      if (error) {
        console.error('Error saving push token:', error);
      }
    } catch (error) {
      console.error('Error saving push token to Supabase:', error);
    }
  };

  const loadNotificationPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading notification preferences:', error);
        return;
      }

      if (data) {
        setPreferences({
          newMachinesNearby: data.new_machines_nearby,
          machineApproved: data.machine_approved,
          favoritesUpdates: data.favorites_updates,
          promotional: data.promotional,
        });
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    }
  };

  const loadUnreadCount = async () => {
    if (!user) return;

    try {
      const { count, error } = await supabase
        .from('notification_history')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .is('read_at', null);

      if (error) {
        console.error('Error loading unread count:', error);
        return;
      }

      setUnreadCount(count || 0);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const updatePreferences = async (prefs: Partial<NotificationPreferences>) => {
    if (!user) return;

    setLoading(true);
    try {
      const updatedPrefs = { ...preferences, ...prefs };
      
      const { error } = await supabase
        .from('user_notification_preferences')
        .upsert({
          user_id: user.id,
          new_machines_nearby: updatedPrefs.newMachinesNearby,
          machine_approved: updatedPrefs.machineApproved,
          favorites_updates: updatedPrefs.favoritesUpdates,
          promotional: updatedPrefs.promotional,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error updating notification preferences:', error);
        throw error;
      }

      setPreferences(updatedPrefs);
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const requestPermissions = async (): Promise<boolean> => {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  };

  const sendTestNotification = async () => {
    if (!expoPushToken) {
      console.log('No push token available');
      return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Test de notification 🔔",
          body: "Votre système de notifications fonctionne parfaitement !",
          data: { type: 'test' },
        },
        trigger: { seconds: 1 },
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notification_history')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }

      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        notification,
        preferences,
        updatePreferences,
        requestPermissions,
        sendTestNotification,
        markNotificationAsRead,
        unreadCount,
        loading,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);