/*
  # Initial Schema Setup

  1. New Tables
    - `distributeurs` (vending machines)
      - `id` (uuid, primary key)
      - `name` (text)
      - `address` (text)
      - `latitude` (float8)
      - `longitude` (float8)
      - `category` (text)
      - `average_price` (numeric)
      - `description` (text)
      - `image_url` (text)
      - `rating` (float4)
      - `review_count` (int)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `user_id` (uuid, references auth.users)

    - `favorites` (user favorites)
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `distributeur_id` (uuid, references distributeurs)
      - `created_at` (timestamptz)

    - `reviews` (user reviews)
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `distributeur_id` (uuid, references distributeurs)
      - `rating` (int)
      - `comment` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for public access where needed
*/

-- Distributeurs table
CREATE TABLE distributeurs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  latitude float8 NOT NULL,
  longitude float8 NOT NULL,
  category text NOT NULL,
  average_price numeric,
  description text,
  image_url text,
  rating float4 DEFAULT 0,
  review_count int DEFAULT 0,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Favorites table
CREATE TABLE favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  distributeur_id uuid REFERENCES distributeurs NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, distributeur_id)
);

-- Reviews table
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  distributeur_id uuid REFERENCES distributeurs NOT NULL,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE distributeurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies for distributeurs
CREATE POLICY "Public can view distributeurs"
  ON distributeurs
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert distributeurs"
  ON distributeurs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own distributeurs"
  ON distributeurs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own distributeurs"
  ON distributeurs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for favorites
CREATE POLICY "Users can view their own favorites"
  ON favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for reviews
CREATE POLICY "Public can view reviews"
  ON reviews
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON reviews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX distributeurs_category_idx ON distributeurs(category);
CREATE INDEX distributeurs_location_idx ON distributeurs USING gist (
  ll_to_earth(latitude, longitude)
);
CREATE INDEX favorites_user_id_idx ON favorites(user_id);
CREATE INDEX reviews_distributeur_id_idx ON reviews(distributeur_id);