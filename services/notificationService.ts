import { supabase } from '@/lib/supabase';

export interface SendNotificationParams {
  userIds: string[];
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: string;
  badge?: number;
}

export interface NotificationTemplate {
  type: 'new_machine_nearby' | 'machine_approved' | 'favorite_updated' | 'promotional';
  title: string;
  body: string;
  data?: Record<string, any>;
}

export class NotificationService {
  private static readonly EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

  /**
   * Send push notifications to multiple users
   */
  static async sendNotifications(params: SendNotificationParams): Promise<boolean> {
    try {
      // Get active push tokens for the specified users
      const { data: tokens, error: tokensError } = await supabase
        .from('user_push_tokens')
        .select('push_token, user_id')
        .in('user_id', params.userIds)
        .eq('is_active', true);

      if (tokensError) {
        console.error('Error fetching push tokens:', tokensError);
        return false;
      }

      if (!tokens || tokens.length === 0) {
        console.log('No active push tokens found for users');
        return false;
      }

      // Prepare push notification messages
      const messages = tokens.map(token => ({
        to: token.push_token,
        title: params.title,
        body: params.body,
        data: params.data || {},
        sound: params.sound || 'default',
        badge: params.badge,
        priority: 'high',
        channelId: 'default',
      }));

      // Send notifications via Expo Push API
      const response = await fetch(this.EXPO_PUSH_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messages),
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error('Error sending push notifications:', result);
        return false;
      }

      // Save notification history
      await this.saveNotificationHistory(params);

      console.log('Push notifications sent successfully:', result);
      return true;
    } catch (error) {
      console.error('Error in sendNotifications:', error);
      return false;
    }
  }

  /**
   * Send notification to users near a location
   */
  static async sendLocationBasedNotification(
    latitude: number,
    longitude: number,
    radiusKm: number,
    notification: NotificationTemplate
  ): Promise<boolean> {
    try {
      // This would require a more complex query to find users within radius
      // For now, we'll send to all users with location-based preferences enabled
      const { data: preferences, error } = await supabase
        .from('user_notification_preferences')
        .select('user_id')
        .eq('new_machines_nearby', true);

      if (error || !preferences) {
        console.error('Error fetching user preferences:', error);
        return false;
      }

      const userIds = preferences.map(p => p.user_id);
      
      return await this.sendNotifications({
        userIds,
        title: notification.title,
        body: notification.body,
        data: notification.data,
      });
    } catch (error) {
      console.error('Error in sendLocationBasedNotification:', error);
      return false;
    }
  }

  /**
   * Send notification when a vending machine is approved
   */
  static async sendMachineApprovedNotification(
    userId: string,
    machineName: string,
    machineId: string
  ): Promise<boolean> {
    const notification: NotificationTemplate = {
      type: 'machine_approved',
      title: '✅ Distributeur approuvé !',
      body: `Votre distributeur "${machineName}" a été approuvé et est maintenant visible par tous.`,
      data: {
        type: 'machine_approved',
        machineId,
        machineName,
      },
    };

    return await this.sendNotifications({
      userIds: [userId],
      title: notification.title,
      body: notification.body,
      data: notification.data,
    });
  }

  /**
   * Send notification for new machine nearby
   */
  static async sendNewMachineNearbyNotification(
    latitude: number,
    longitude: number,
    machineName: string,
    machineId: string,
    category: string
  ): Promise<boolean> {
    const categoryEmoji = this.getCategoryEmoji(category);
    
    const notification: NotificationTemplate = {
      type: 'new_machine_nearby',
      title: `${categoryEmoji} Nouveau distributeur près de vous !`,
      body: `"${machineName}" vient d'être ajouté dans votre zone.`,
      data: {
        type: 'new_machine_nearby',
        machineId,
        machineName,
        category,
        latitude,
        longitude,
      },
    };

    return await this.sendLocationBasedNotification(
      latitude,
      longitude,
      5, // 5km radius
      notification
    );
  }

  /**
   * Send promotional notification
   */
  static async sendPromotionalNotification(
    title: string,
    body: string,
    data?: Record<string, any>
  ): Promise<boolean> {
    try {
      const { data: preferences, error } = await supabase
        .from('user_notification_preferences')
        .select('user_id')
        .eq('promotional', true);

      if (error || !preferences) {
        console.error('Error fetching promotional preferences:', error);
        return false;
      }

      const userIds = preferences.map(p => p.user_id);
      
      return await this.sendNotifications({
        userIds,
        title,
        body,
        data: { type: 'promotional', ...data },
      });
    } catch (error) {
      console.error('Error in sendPromotionalNotification:', error);
      return false;
    }
  }

  /**
   * Save notification to history
   */
  private static async saveNotificationHistory(params: SendNotificationParams): Promise<void> {
    try {
      const notifications = params.userIds.map(userId => ({
        user_id: userId,
        title: params.title,
        body: params.body,
        data: params.data || {},
        sent_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from('notification_history')
        .insert(notifications);

      if (error) {
        console.error('Error saving notification history:', error);
      }
    } catch (error) {
      console.error('Error in saveNotificationHistory:', error);
    }
  }

  /**
   * Get emoji for category
   */
  private static getCategoryEmoji(category: string): string {
    const categoryEmojis: Record<string, string> = {
      'Pain': '🍞',
      'Pizza': '🍕',
      'Fleurs': '💐',
      'Lait': '🥛',
      'Oeufs': '🥚',
      'Produits locaux': '🧺',
      'Autre': '🏪',
    };
    
    return categoryEmojis[category] || '🏪';
  }
}