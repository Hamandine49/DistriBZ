import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform, Image } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useVendingMachines } from '@/contexts/VendingMachineContext';
import { Camera, X, Upload, Map } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import CategorySelector from '@/components/forms/CategorySelector';
import { router } from 'expo-router';
import Header from '@/components/ui/Header';
import Button from '@/components/ui/Button';

export default function AddScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { addVendingMachine } = useVendingMachines();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [averagePrice, setAveragePrice] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('We need camera roll permissions to add photos');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      alert('We need camera permissions to take photos');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      alert('We need location permissions to add the vending machine position');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    // Get address from coordinates
    try {
      const [addressData] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (addressData) {
        const formattedAddress = [
          addressData.street,
          addressData.city,
          addressData.postalCode,
          addressData.country
        ].filter(Boolean).join(', ');
        
        setAddress(formattedAddress);
      }
    } catch (error) {
      console.log('Error getting address:', error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = 'Le nom est requis';
    if (!address.trim()) newErrors.address = 'L\'adresse est requise';
    if (!category) newErrors.category = 'La catégorie est requise';
    if (!image) newErrors.image = 'Une photo est requise';
    if (!location) newErrors.location = 'La localisation est requise';
    
    if (averagePrice && isNaN(Number(averagePrice))) {
      newErrors.averagePrice = 'Le prix doit être un nombre';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!user) {
      router.push('/(auth)/login');
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      await addVendingMachine({
        name,
        address,
        description,
        category,
        averagePrice: Number(averagePrice) || 0,
        imageUri: image,
        latitude: location!.latitude,
        longitude: location!.longitude,
      });
      
      // Reset form
      setName('');
      setAddress('');
      setDescription('');
      setCategory('');
      setAveragePrice('');
      setImage(null);
      setLocation(null);
      
      // Navigate to map with new machine
      router.push('/(tabs)/');
    } catch (error) {
      console.error('Error adding vending machine:', error);
      alert('Une erreur est survenue lors de l\'ajout du distributeur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Header title="Ajouter un distributeur" />
      
      <View style={styles.formContainer}>
        {!user && (
          <View style={[styles.warningBox, { backgroundColor: theme.colors.warning + '30' }]}>
            <Text style={[styles.warningText, { color: theme.colors.warning }]}>
              Connectez-vous pour ajouter un distributeur
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={[styles.loginLink, { color: theme.colors.primary }]}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.imageSection}>
          {image ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image }} style={styles.imagePreview} />
              <TouchableOpacity 
                style={[styles.removeImageButton, { backgroundColor: theme.colors.error }]} 
                onPress={() => setImage(null)}
              >
                <X size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.imagePlaceholder, { borderColor: theme.colors.border }]}>
              <Text style={[styles.imagePlaceholderText, { color: theme.colors.text }]}>
                Ajoutez une photo
              </Text>
              <Upload size={32} color={theme.colors.text} />
            </View>
          )}
          
          <View style={styles.imageButtonsContainer}>
            <TouchableOpacity 
              style={[styles.imageButton, { backgroundColor: theme.colors.primary }]} 
              onPress={takePhoto}
            >
              <Camera size={24} color="#fff" />
              <Text style={styles.imageButtonText}>Prendre photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.imageButton, { backgroundColor: theme.colors.secondary }]} 
              onPress={pickImage}
            >
              <Upload size={24} color="#fff" />
              <Text style={styles.imageButtonText}>Choisir image</Text>
            </TouchableOpacity>
          </View>
          
          {errors.image && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.image}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Nom du distributeur *</Text>
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                borderColor: errors.name ? theme.colors.error : theme.colors.border 
              }
            ]}
            value={name}
            onChangeText={setName}
            placeholder="Ex: Distributeur de pain Boulangerie Martin"
            placeholderTextColor={theme.colors.text + '80'}
          />
          {errors.name && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.name}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Catégorie *</Text>
          <CategorySelector 
            selectedCategory={category} 
            onSelectCategory={setCategory}
            error={errors.category}
          />
          {errors.category && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.category}</Text>}
        </View>

        <View style={styles.locationContainer}>
          <View style={styles.locationHeader}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Adresse *</Text>
            <TouchableOpacity 
              style={[styles.locationButton, { backgroundColor: theme.colors.primary }]}
              onPress={getCurrentLocation}
            >
              <Map size={16} color="#fff" />
              <Text style={styles.locationButtonText}>Position actuelle</Text>
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                borderColor: errors.address ? theme.colors.error : theme.colors.border 
              }
            ]}
            value={address}
            onChangeText={setAddress}
            placeholder="Adresse complète"
            placeholderTextColor={theme.colors.text + '80'}
            multiline
          />
          {errors.address && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.address}</Text>}
          {errors.location && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.location}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Prix moyen (€)</Text>
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                borderColor: errors.averagePrice ? theme.colors.error : theme.colors.border 
              }
            ]}
            value={averagePrice}
            onChangeText={setAveragePrice}
            placeholder="Ex: 3.50"
            placeholderTextColor={theme.colors.text + '80'}
            keyboardType="numeric"
          />
          {errors.averagePrice && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.averagePrice}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Description</Text>
          <TextInput
            style={[
              styles.textArea, 
              { 
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                borderColor: theme.colors.border 
              }
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder="Informations supplémentaires..."
            placeholderTextColor={theme.colors.text + '80'}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        <Button 
          title="Ajouter ce distributeur"
          onPress={handleSubmit}
          loading={loading}
          disabled={!user || loading}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 60,
    paddingBottom: 40,
  },
  formContainer: {
    padding: 16,
  },
  warningBox: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  warningText: {
    fontFamily: 'Inter-Medium',
    flex: 1,
  },
  loginLink: {
    fontFamily: 'Inter-Bold',
    textDecorationLine: 'underline',
  },
  imageSection: {
    marginBottom: 24,
  },
  imagePlaceholder: {
    height: 200,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  imagePlaceholderText: {
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
  },
  imageButtonText: {
    color: '#fff',
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  imagePreviewContainer: {
    position: 'relative',
    height: 200,
    marginBottom: 12,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontFamily: 'Inter-Regular',
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontFamily: 'Inter-Regular',
    minHeight: 100,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 4,
  },
  locationContainer: {
    marginBottom: 24,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  locationButtonText: {
    color: '#fff',
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginLeft: 4,
  },
  submitButton: {
    marginTop: 8,
  },
});