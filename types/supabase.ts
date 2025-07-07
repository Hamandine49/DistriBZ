export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      distributeurs: {
        Row: {
          id: string
          name: string
          address: string
          latitude: number
          longitude: number
          category: string
          average_price: number | null
          description: string | null
          image_url: string | null
          rating: number
          review_count: number
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          latitude: number
          longitude: number
          category: string
          average_price?: number | null
          description?: string | null
          image_url?: string | null
          rating?: number
          review_count?: number
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          latitude?: number
          longitude?: number
          category?: string
          average_price?: number | null
          description?: string | null
          image_url?: string | null
          rating?: number
          review_count?: number
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          distributeur_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          distributeur_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          distributeur_id?: string
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          distributeur_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          distributeur_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          distributeur_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
      user_push_tokens: {
        Row: {
          id: string
          user_id: string
          push_token: string
          device_type: string
          device_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          push_token: string
          device_type: string
          device_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          push_token?: string
          device_type?: string
          device_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_notification_preferences: {
        Row: {
          id: string
          user_id: string
          new_machines_nearby: boolean
          machine_approved: boolean
          favorites_updates: boolean
          promotional: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          new_machines_nearby?: boolean
          machine_approved?: boolean
          favorites_updates?: boolean
          promotional?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          new_machines_nearby?: boolean
          machine_approved?: boolean
          favorites_updates?: boolean
          promotional?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      notification_history: {
        Row: {
          id: string
          user_id: string
          title: string
          body: string
          data: Json | null
          sent_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          body: string
          data?: Json | null
          sent_at?: string
          read_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          body?: string
          data?: Json | null
          sent_at?: string
          read_at?: string | null
        }
      }
    }
  }
}