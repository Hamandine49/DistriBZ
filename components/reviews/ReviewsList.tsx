import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import ReviewItem from './ReviewItem';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewsListProps {
  machineId: string;
  limit?: number;
}

// Mock data for now
const mockReviews: Review[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Jean Dupont',
    userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    rating: 4.5,
    comment: 'Très bon distributeur, pain toujours frais et croustillant. Je recommande !',
    date: '2023-12-15T14:30:00Z',
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Marie Martin',
    userAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    rating: 3,
    comment: 'Produits corrects mais parfois en rupture de stock. Points positifs : emplacement pratique et prix raisonnables.',
    date: '2023-12-10T09:15:00Z',
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Pierre Durand',
    userAvatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg',
    rating: 5,
    comment: 'Parfait ! Ce distributeur est vraiment pratique, produits de qualité et jamais en panne. Un vrai plus pour le quartier.',
    date: '2023-12-05T18:45:00Z',
  },
  {
    id: '4',
    userId: 'user4',
    userName: 'Sophie Bernard',
    userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    rating: 2,
    comment: 'Déçue par la qualité des produits récemment. La machine fonctionne bien mais le contenu laisse à désirer.',
    date: '2023-11-28T11:20:00Z',
  },
];

export default function ReviewsList({ machineId, limit }: ReviewsListProps) {
  const { theme } = useTheme();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch reviews
    setTimeout(() => {
      setReviews(limit ? mockReviews.slice(0, limit) : mockReviews);
      setLoading(false);
    }, 500);
  }, [machineId, limit]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Chargement des avis...
        </Text>
      </View>
    );
  }

  if (reviews.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
          Aucun avis pour le moment
        </Text>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReviewItem review={item} />}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
  },
});