/*
  # Add Push Notifications Support

  1. New Tables
    - `user_push_tokens`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `push_token` (text, unique)
      - `device_type` (text)
      - `device_id` (text)
      - `is_active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `user_notification_preferences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `new_machines_nearby` (boolean)
      - `machine_approved` (boolean)
      - `favorites_updates` (boolean)
      - `promotional` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `notification_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `body` (text)
      - `data` (jsonb)
      - `sent_at` (timestamptz)
      - `read_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- User push tokens table
CREATE TABLE IF NOT EXISTS user_push_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  push_token text UNIQUE NOT NULL,
  device_type text NOT NULL,
  device_id text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User notification preferences table
CREATE TABLE IF NOT EXISTS user_notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL UNIQUE,
  new_machines_nearby boolean DEFAULT true,
  machine_approved boolean DEFAULT true,
  favorites_updates boolean DEFAULT true,
  promotional boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notification history table
CREATE TABLE IF NOT EXISTS notification_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  data jsonb,
  sent_at timestamptz DEFAULT now(),
  read_at timestamptz
);

-- Enable Row Level Security
ALTER TABLE user_push_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_history ENABLE ROW LEVEL SECURITY;

-- Policies for user_push_tokens
CREATE POLICY "Users can view their own push tokens"
  ON user_push_tokens
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own push tokens"
  ON user_push_tokens
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own push tokens"
  ON user_push_tokens
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own push tokens"
  ON user_push_tokens
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for user_notification_preferences
CREATE POLICY "Users can view their own notification preferences"
  ON user_notification_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification preferences"
  ON user_notification_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification preferences"
  ON user_notification_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for notification_history
CREATE POLICY "Users can view their own notification history"
  ON notification_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification history"
  ON notification_history
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX user_push_tokens_user_id_idx ON user_push_tokens(user_id);
CREATE INDEX user_push_tokens_active_idx ON user_push_tokens(is_active);
CREATE INDEX notification_preferences_user_id_idx ON user_notification_preferences(user_id);
CREATE INDEX notification_history_user_id_idx ON notification_history(user_id);
CREATE INDEX notification_history_read_idx ON notification_history(read_at);

-- Function to automatically create notification preferences for new users
CREATE OR REPLACE FUNCTION create_default_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_notification_preferences (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create default preferences when a user signs up
CREATE TRIGGER create_user_notification_preferences
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_notification_preferences();