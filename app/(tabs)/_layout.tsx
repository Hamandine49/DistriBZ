import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import TabBar from '@/components/navigation/TabBar';

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: theme.colors.card,
            borderTopColor: theme.colors.border,
          },
        ],
      }}
      tabBar={(props) => <TabBar {...props} />} // Using custom tab bar
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Carte',
          tabBarLabel: 'Carte',
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: 'Liste',
          tabBarLabel: 'Liste',
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Ajouter',
          tabBarLabel: 'Ajouter',
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoris',
          tabBarLabel: 'Favoris',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarLabel: 'Profil',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === 'ios' ? 85 : 65,
    elevation: 8,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
  },
});