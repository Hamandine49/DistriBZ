import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useRouter } from 'expo-router';
import { Bell, Settings, Trash2, MarkAsRead } from 'lucide-react-native';
import Header from '@/components/ui/Header';
import EmptyState from '@/components/ui/EmptyState';
import { supabase } from '@/lib/supabase';

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  data: any;
  sent_at: string;
  read_at: string | null;
}

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { markNotificationAsRead, unreadCount } = useNotifications();
  const router = useRouter();
  
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notification_history')
        .select('*')
        .eq('user_id', user.id)
        .order('sent_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error loading notifications:', error);
        return;
      }

      setNotifications(data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const handleNotificationPress = async (notification: NotificationItem) => {
    // Mark as read if unread
    if (!notification.read_at) {
      await markNotificationAsRead(notification.id);
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.id 
            ? { ...n, read_at: new Date().toISOString() }
            : n
        )
      );
    }

    // Handle navigation based on notification data
    if (notification.data?.machineId) {
      router.push(`/details/${notification.data.machineId}`);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notification_history')
        .update({ read_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .is('read_at', null);

      if (error) {
        console.error('Error marking all as read:', error);
        return;
      }

      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleClearAll = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notification_history')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing notifications:', error);
        return;
      }

      setNotifications([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const renderNotification = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        { 
          backgroundColor: theme.colors.card,
          borderLeftColor: item.read_at ? 'transparent' : theme.colors.primary,
        }
      ]}
      onPress={() => handleNotificationPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.notificationContent}>
        <Text style={[
          styles.notificationTitle, 
          { 
            color: theme.colors.text,
            fontFamily: item.read_at ? 'Inter-Medium' : 'Inter-Bold',
          }
        ]}>
          {item.title}
        </Text>
        <Text style={[
          styles.notificationBody, 
          { 
            color: theme.colors.textSecondary,
            opacity: item.read_at ? 0.8 : 1,
          }
        ]}>
          {item.body}
        </Text>
        <Text style={[styles.notificationDate, { color: theme.colors.textSecondary }]}>
          {formatDate(item.sent_at)}
        </Text>
      </View>
      {!item.read_at && (
        <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]} />
      )}
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Header title="Notifications" />
        <EmptyState
          message="Connectez-vous pour voir vos notifications"
          actionText="Se connecter"
          onAction={() => router.push('/(auth)/login')}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Notifications" />
      
      {notifications.length > 0 && (
        <View style={[styles.actionBar, { backgroundColor: theme.colors.card }]}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/notification-settings')}
          >
            <Settings size={20} color={theme.colors.primary} />
            <Text style={[styles.actionText, { color: theme.colors.primary }]}>
              Paramètres
            </Text>
          </TouchableOpacity>
          
          {unreadCount > 0 && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleMarkAllAsRead}
            >
              <MarkAsRead size={20} color={theme.colors.text} />
              <Text style={[styles.actionText, { color: theme.colors.text }]}>
                Tout marquer lu
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleClearAll}
          >
            <Trash2 size={20} color={theme.colors.error} />
            <Text style={[styles.actionText, { color: theme.colors.error }]}>
              Tout supprimer
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {notifications.length === 0 ? (
        <EmptyState
          message="Aucune notification"
          subMessage="Vous recevrez ici les notifications importantes"
          icon={<Bell size={48} color={theme.colors.primary} />}
          actionText="Configurer les notifications"
          onAction={() => router.push('/notification-settings')}
        />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.primary}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginLeft: 4,
  },
  listContent: {
    padding: 16,
  },
  notificationItem: {
    borderRadius: 12,
    marginBottom: 8,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  notificationBody: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});