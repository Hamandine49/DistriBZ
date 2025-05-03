import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Image } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Moon, Sun, LogOut, User, Award, CircleHelp as HelpCircle, Heart, MapPin, Shield, Settings, ChevronRight } from 'lucide-react-native';
import Header from '@/components/ui/Header';
import Button from '@/components/ui/Button';

export default function ProfileScreen() {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [contributionCount, setContributionCount] = useState(0);
  const [badgesCount, setBadgesCount] = useState(0);

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  const handleSignUp = () => {
    router.push('/(auth)/register');
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const MenuItem = ({ icon, title, onPress, chevron = true, badge }: any) => (
    <TouchableOpacity 
      style={[styles.menuItem, { backgroundColor: theme.colors.card }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemContent}>
        <View style={[styles.menuItemIcon, { backgroundColor: theme.colors.background }]}>
          {icon}
        </View>
        <Text style={[styles.menuItemText, { color: theme.colors.text }]}>{title}</Text>
      </View>
      
      {badge && (
        <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      
      {chevron && <ChevronRight size={20} color={theme.colors.text} />}
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Header title="Profil" />

      {user ? (
        <View style={styles.profileSection}>
          <View style={[styles.profileCard, { backgroundColor: theme.colors.card }]}>
            <View style={styles.profileHeader}>
              <View style={styles.profileImageContainer}>
                <Image 
                  source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' }} 
                  style={styles.profileImage} 
                />
                <TouchableOpacity 
                  style={[styles.editProfileButton, { backgroundColor: theme.colors.primary }]} 
                  onPress={() => {}}
                >
                  <Text style={styles.editProfileButtonText}>Éditer</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: theme.colors.text }]}>
                  {user.email?.split('@')[0] || 'Utilisateur'}
                </Text>
                <Text style={[styles.profileEmail, { color: theme.colors.textSecondary }]}>
                  {user.email}
                </Text>
              </View>
            </View>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.primary }]}>{contributionCount}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Contributions</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.primary }]}>{badgesCount}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Badges</Text>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View style={[styles.loginCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.loginTitle, { color: theme.colors.text }]}>Connectez-vous</Text>
          <Text style={[styles.loginSubtitle, { color: theme.colors.textSecondary }]}>
            Connectez-vous pour ajouter des distributeurs et accéder à vos favoris
          </Text>
          <View style={styles.loginButtons}>
            <Button 
              title="Se connecter" 
              onPress={handleLogin} 
              style={styles.loginButton}
            />
            <Button 
              title="S'inscrire" 
              onPress={handleSignUp} 
              variant="secondary"
              style={styles.signUpButton}
            />
          </View>
        </View>
      )}
      
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Paramètres</Text>
        
        <View style={styles.menuGroup}>
          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: theme.colors.card }]} 
            activeOpacity={0.7}
          >
            <View style={styles.menuItemContent}>
              <View style={[styles.menuItemIcon, { backgroundColor: theme.colors.background }]}>
                {theme.dark ? (
                  <Moon size={20} color={theme.colors.primary} />
                ) : (
                  <Sun size={20} color={theme.colors.primary} />
                )}
              </View>
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Mode sombre</Text>
            </View>
            <Switch
              value={theme.dark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: theme.colors.primary + '80' }}
              thumbColor={theme.dark ? theme.colors.primary : '#f4f3f4'}
            />
          </TouchableOpacity>

          {user && (
            <MenuItem 
              icon={<User size={20} color={theme.colors.primary} />}
              title="Informations personnelles"
              onPress={() => {}}
            />
          )}
          
          <MenuItem 
            icon={<Settings size={20} color={theme.colors.primary} />}
            title="Préférences"
            onPress={() => {}}
          />
        </View>
      </View>
      
      {user && (
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Mon activité</Text>
          
          <View style={styles.menuGroup}>
            <MenuItem 
              icon={<MapPin size={20} color={theme.colors.primary} />}
              title="Mes distributeurs"
              onPress={() => {}}
              badge={contributionCount.toString()}
            />
            
            <MenuItem 
              icon={<Heart size={20} color={theme.colors.primary} />}
              title="Favoris"
              onPress={() => router.push('/(tabs)/favorites')}
            />
            
            <MenuItem 
              icon={<Award size={20} color={theme.colors.primary} />}
              title="Badges et récompenses"
              onPress={() => {}}
              badge={badgesCount.toString()}
            />
          </View>
        </View>
      )}
      
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Support</Text>
        
        <View style={styles.menuGroup}>
          <MenuItem 
            icon={<HelpCircle size={20} color={theme.colors.primary} />}
            title="Aide et support"
            onPress={() => {}}
          />

          {user && (
            <>
              <MenuItem 
                icon={<Shield size={20} color={theme.colors.primary} />}
                title="Confidentialité"
                onPress={() => {}}
              />
              
              <MenuItem 
                icon={<LogOut size={20} color={theme.colors.error} />}
                title="Déconnexion"
                onPress={handleSignOut}
                chevron={false}
              />
            </>
          )}
        </View>
      </View>
      
      <View style={styles.versionContainer}>
        <Text style={[styles.versionText, { color: theme.colors.textSecondary }]}>
          Version 1.0.0
        </Text>
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
  profileSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  profileCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editProfileButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  editProfileButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: '80%',
    alignSelf: 'center',
  },
  loginCard: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loginTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  loginSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  loginButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  loginButton: {
    flex: 1,
    marginRight: 8,
  },
  signUpButton: {
    flex: 1,
    marginLeft: 8,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  menuGroup: {
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 1,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
});