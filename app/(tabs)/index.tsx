import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Platform, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { MapPin, Layers, Crosshair, Info } from 'lucide-react-native';
import { useVendingMachines } from '@/contexts/VendingMachineContext';
import { useTheme } from '@/contexts/ThemeContext';
import FilterBar from '@/components/filters/FilterBar';
import MapInfoCard from '@/components/map/MapInfoCard';
import { VendingMachine } from '@/types/vendingMachine';
import { useRouter } from 'expo-router';
import CategoryMarker from '@/components/map/CategoryMarker';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import SearchBar from '@/components/search/SearchBar';

export default function MapScreen() {
  const { theme } = useTheme();
  const { vendingMachines, getVendingMachines, filteredMachines, setFilter } = useVendingMachines();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedMachine, setSelectedMachine] = useState<VendingMachine | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 46.603354, // France center
    longitude: 1.888334,
    latitudeDelta: 10,
    longitudeDelta: 10,
  });
  const [showInfo, setShowInfo] = useState(false);
  const mapRef = useRef<MapView>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      
      if (location) {
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
    })();

    getVendingMachines();
  }, []);

  const handleMarkerPress = (machine: VendingMachine) => {
    setSelectedMachine(machine);
    setShowInfo(true);
    
    // Animate to the selected machine
    mapRef.current?.animateToRegion({
      latitude: machine.latitude,
      longitude: machine.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 1000);
  };

  const centerOnUserLocation = () => {
    if (location) {
      mapRef.current?.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  const openDetail = (id: string) => {
    router.push(`/details/${id}`);
  };

  const handleFilterChange = (category: string) => {
    setFilter(category);
    setShowInfo(false);
  };

  const getMapStyle = () => {
    return theme.dark ? require('@/constants/darkMapStyle.json') : [];
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        customMapStyle={getMapStyle()}
      >
        {filteredMachines.map((machine) => (
          <Marker
            key={machine.id}
            coordinate={{
              latitude: machine.latitude,
              longitude: machine.longitude,
            }}
            onPress={() => handleMarkerPress(machine)}
          >
            <CategoryMarker category={machine.category} />
          </Marker>
        ))}
      </MapView>

      <View style={[styles.searchContainer, { backgroundColor: theme.colors.card }]}>
        <SearchBar onSearchChange={() => {}} />
      </View>

      <View style={styles.filterContainer}>
        <FilterBar onFilterChange={handleFilterChange} />
      </View>

      {errorMsg && (
        <View style={[styles.errorContainer, { backgroundColor: theme.colors.error }]}>
          <Text style={[styles.errorText, { color: theme.colors.textOnPrimary }]}>{errorMsg}</Text>
        </View>
      )}

      <View style={styles.actionButtonsContainer}>
        <FloatingActionButton 
          icon={<Layers color={theme.colors.text} size={24} />} 
          onPress={() => {}} 
          style={{ backgroundColor: theme.colors.card }}
        />
        <FloatingActionButton 
          icon={<Crosshair color={theme.colors.text} size={24} />} 
          onPress={centerOnUserLocation} 
          style={{ backgroundColor: theme.colors.card }}
        />
        <FloatingActionButton 
          icon={<Info color={theme.colors.text} size={24} />} 
          onPress={() => setShowInfo(!showInfo)} 
          style={{ backgroundColor: theme.colors.card }}
        />
      </View>

      {showInfo && selectedMachine && (
        <MapInfoCard 
          machine={selectedMachine}
          onClose={() => setShowInfo(false)}
          onPress={() => openDetail(selectedMachine.id)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  searchContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    right: 20,
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  filterContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 130 : 110,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
  },
  errorContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 80,
    left: 20,
    right: 20,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  actionButtonsContainer: {
    position: 'absolute',
    right: 16,
    bottom: 200,
    gap: 12,
  },
});