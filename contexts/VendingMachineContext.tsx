import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VendingMachine } from '@/types/vendingMachine';
import { useAuth } from './AuthContext';
import { useNetwork } from './NetworkContext';

// Sample data for now
const mockVendingMachines: VendingMachine[] = [
  {
    id: '1',
    name: 'Distributeur de pain Boulangerie Martin',
    address: '123 Rue de Paris, 75001 Paris',
    description: 'Distributeur de baguettes traditionnelles et pains spéciaux. Approvisionné tous les jours par la Boulangerie Martin.',
    category: 'Pain',
    averagePrice: 2.5,
    imageUrl: 'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg',
    latitude: 48.856614,
    longitude: 2.352222,
    rating: 4.5,
    reviewCount: 32,
  },
  {
    id: '2',
    name: 'Pizz\'Automat',
    address: '45 Avenue Victor Hugo, 69002 Lyon',
    description: 'Pizzas artisanales cuites sur place. 6 variétés disponibles. Paiement par carte bancaire uniquement.',
    category: 'Pizza',
    averagePrice: 12,
    imageUrl: 'https://images.pexels.com/photos/3915857/pexels-photo-3915857.jpeg',
    latitude: 45.751688,
    longitude: 4.835797,
    rating: 4.2,
    reviewCount: 18,
  },
  {
    id: '3',
    name: 'La Ferme Locale - Distributeur de lait',
    address: '78 Route des Vignes, 33000 Bordeaux',
    description: 'Lait frais non pasteurisé directement de notre ferme. Apportez votre bouteille ou achetez-en une sur place.',
    category: 'Lait',
    averagePrice: 1.8,
    imageUrl: 'https://images.pexels.com/photos/2506560/pexels-photo-2506560.jpeg',
    latitude: 44.837789,
    longitude: -0.579180,
    rating: 4.8,
    reviewCount: 45,
  },
  {
    id: '4',
    name: 'Fleurs 24/7',
    address: '15 Place du Marché, 31000 Toulouse',
    description: 'Bouquets de fleurs fraîches. Idéal pour un cadeau de dernière minute. Compositions florales renouvelées deux fois par semaine.',
    category: 'Fleurs',
    averagePrice: 15,
    imageUrl: 'https://images.pexels.com/photos/2111192/pexels-photo-2111192.jpeg',
    latitude: 43.604462,
    longitude: 1.444247,
    rating: 4.0,
    reviewCount: 12,
  },
  {
    id: '5',
    name: 'Oeufs de la Ferme Durand',
    address: '256 Chemin Rural, 59000 Lille',
    description: 'Oeufs bio de poules élevées en plein air. Approvisionnement quotidien.',
    category: 'Oeufs',
    averagePrice: 4.5,
    imageUrl: 'https://images.pexels.com/photos/6045020/pexels-photo-6045020.jpeg',
    latitude: 50.629250,
    longitude: 3.057256,
    rating: 4.7,
    reviewCount: 28,
  },
  {
    id: '6',
    name: 'Le Panier Local',
    address: '42 Rue du Commerce, 44000 Nantes',
    description: 'Produits frais locaux: légumes, fruits, miel, confitures. Les produits varient selon la saison.',
    category: 'Produits locaux',
    averagePrice: 8,
    imageUrl: 'https://images.pexels.com/photos/264537/pexels-photo-264537.jpeg',
    latitude: 47.218371,
    longitude: -1.553621,
    rating: 4.6,
    reviewCount: 37,
  },
];

interface VendingMachineContextProps {
  vendingMachines: VendingMachine[];
  filteredMachines: VendingMachine[];
  favoriteVendingMachines: VendingMachine[];
  getVendingMachines: () => Promise<VendingMachine[]>;
  getVendingMachineById: (id: string) => Promise<VendingMachine | null>;
  addVendingMachine: (machine: Omit<VendingMachine, 'id' | 'rating' | 'reviewCount' | 'imageUrl'> & { imageUri: string | null }) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  isFavorite: (id: string) => Promise<boolean>;
  getFavorites: () => Promise<void>;
  setFilter: (category: string) => void;
  loading: boolean;
}

const VendingMachineContext = createContext<VendingMachineContextProps>({
  vendingMachines: [],
  filteredMachines: [],
  favoriteVendingMachines: [],
  getVendingMachines: async () => [],
  getVendingMachineById: async () => null,
  addVendingMachine: async () => {},
  toggleFavorite: async () => {},
  isFavorite: async () => false,
  getFavorites: async () => {},
  setFilter: () => {},
  loading: false,
});

export const VendingMachineProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { user } = useAuth();
  const { isConnected, cacheVendingMachines, getCachedMachines } = useNetwork();
  const [vendingMachines, setVendingMachines] = useState<VendingMachine[]>([]);
  const [filteredMachines, setFilteredMachines] = useState<VendingMachine[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteVendingMachines, setFavoriteVendingMachines] = useState<VendingMachine[]>([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  // Load machines and apply filter
  useEffect(() => {
    if (vendingMachines.length > 0) {
      if (currentFilter === 'all') {
        setFilteredMachines(vendingMachines);
      } else {
        setFilteredMachines(
          vendingMachines.filter(machine => 
            machine.category.toLowerCase() === currentFilter.toLowerCase()
          )
        );
      }
    }
  }, [currentFilter, vendingMachines]);

  // Load favorites from storage when user changes
  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
      setFavoriteVendingMachines([]);
    }
  }, [user]);

  // Load favorites from storage
  const loadFavorites = async () => {
    if (!user) return;
    
    try {
      const storedFavorites = await AsyncStorage.getItem(`favorites-${user.id}`);
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        setFavorites(parsedFavorites);
        
        // Update favorite machines if vending machines are already loaded
        if (vendingMachines.length > 0) {
          const favoriteMachines = vendingMachines.filter(machine => 
            parsedFavorites.includes(machine.id)
          );
          setFavoriteVendingMachines(favoriteMachines);
        }
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  // Save favorites to storage
  const saveFavorites = async (newFavorites: string[]) => {
    if (!user) return;
    
    try {
      await AsyncStorage.setItem(`favorites-${user.id}`, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  // Fetch all vending machines
  const getVendingMachines = async () => {
    setLoading(true);
    try {
      if (isConnected) {
        // In a real app, fetch from Supabase
        // For now, use mock data
        setVendingMachines(mockVendingMachines);
        
        // Cache the data for offline use
        await cacheVendingMachines(mockVendingMachines);
        
        return mockVendingMachines;
      } else {
        // Load from cache when offline
        const cachedMachines = await getCachedMachines();
        setVendingMachines(cachedMachines);
        return cachedMachines;
      }
    } catch (error) {
      console.error('Error fetching vending machines:', error);
      
      // Fallback to cached data on error
      const cachedMachines = await getCachedMachines();
      setVendingMachines(cachedMachines);
      return cachedMachines;
    } finally {
      setLoading(false);
    }
  };

  // Get a specific vending machine by ID
  const getVendingMachineById = async (id: string) => {
    try {
      if (isConnected) {
        // In a real app, fetch from Supabase
        // For now, use mock data
        const machine = mockVendingMachines.find(m => m.id === id) || null;
        return machine;
      } else {
        // Search in cached data when offline
        const cachedMachines = await getCachedMachines();
        const machine = cachedMachines.find(m => m.id === id) || null;
        return machine;
      }
    } catch (error) {
      console.error('Error fetching vending machine:', error);
      return null;
    }
  };

  // Add a new vending machine
  const addVendingMachine = async (machineData: Omit<VendingMachine, 'id' | 'rating' | 'reviewCount' | 'imageUrl'> & { imageUri: string | null }) => {
    if (!isConnected) {
      throw new Error('Impossible d\'ajouter un distributeur en mode hors ligne');
    }

    setLoading(true);
    try {
      // In a real app, upload to Supabase
      // For now, add to local state with mock data
      
      // We would normally upload the image to storage and get a URL
      const imageUrl = machineData.imageUri || 'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg';
      
      const newMachine: VendingMachine = {
        id: Date.now().toString(),
        name: machineData.name,
        address: machineData.address,
        description: machineData.description,
        category: machineData.category,
        averagePrice: machineData.averagePrice,
        latitude: machineData.latitude,
        longitude: machineData.longitude,
        imageUrl: imageUrl,
        rating: 0,
        reviewCount: 0,
      };
      
      // Update state
      const updatedMachines = [newMachine, ...vendingMachines];
      setVendingMachines(updatedMachines);
      
      // Update cache
      await cacheVendingMachines(updatedMachines);
    } catch (error) {
      console.error('Error adding vending machine:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite status of a vending machine
  const toggleFavorite = async (id: string) => {
    if (!user) return;
    
    try {
      let newFavorites: string[];
      
      if (favorites.includes(id)) {
        // Remove from favorites
        newFavorites = favorites.filter(fav => fav !== id);
      } else {
        // Add to favorites
        newFavorites = [...favorites, id];
      }
      
      // Update state and storage
      setFavorites(newFavorites);
      await saveFavorites(newFavorites);
      
      // Update favorite machines
      const favoriteMachines = vendingMachines.filter(machine => 
        newFavorites.includes(machine.id)
      );
      setFavoriteVendingMachines(favoriteMachines);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Check if a vending machine is favorited
  const isFavorite = async (id: string) => {
    return favorites.includes(id);
  };

  // Get all favorite vending machines
  const getFavorites = async () => {
    if (!user) return;
    
    try {
      const favoriteMachines = vendingMachines.filter(machine => 
        favorites.includes(machine.id)
      );
      setFavoriteVendingMachines(favoriteMachines);
    } catch (error) {
      console.error('Error getting favorites:', error);
    }
  };

  // Set active filter
  const setFilter = (category: string) => {
    setCurrentFilter(category);
  };

  return (
    <VendingMachineContext.Provider
      value={{
        vendingMachines,
        filteredMachines,
        favoriteVendingMachines,
        getVendingMachines,
        getVendingMachineById,
        addVendingMachine,
        toggleFavorite,
        isFavorite,
        getFavorites,
        setFilter,
        loading,
      }}
    >
      {children}
    </VendingMachineContext.Provider>
  );
};

export const useVendingMachines = () => useContext(VendingMachineContext);