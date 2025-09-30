import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import MapsScreen from './screens/MapsScreen';
import CalendrierScreen from './screens/CalendrierScreen';
import StatsScreen from './screens/StatsScreen';
import CompteScreen from './screens/CompteScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Maps') {
              iconName = focused ? 'map' : 'map-outline';
            } else if (route.name === 'Calendrier') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Stats') {
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
            } else if (route.name === 'Compte') {
              iconName = focused ? 'person' : 'person-outline';
            } else {
              iconName = 'help-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: 'white',
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            title: 'Accueil',
            tabBarLabel: 'Accueil',
          }}
        />
        <Tab.Screen 
          name="Maps" 
          component={MapsScreen}
          options={{
            title: 'Maps',
            tabBarLabel: 'Maps',
          }}
        />
        <Tab.Screen 
          name="Calendrier" 
          component={CalendrierScreen}
          options={{
            title: 'Calendrier',
            tabBarLabel: 'Calendrier',
          }}
        />
        <Tab.Screen 
          name="Stats" 
          component={StatsScreen}
          options={{
            title: 'Statistiques',
            tabBarLabel: 'Stats',
          }}
        />
        <Tab.Screen 
          name="Compte" 
          component={CompteScreen}
          options={{
            title: 'Mon Compte',
            tabBarLabel: 'Compte',
          }}
        />
      </Tab.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
