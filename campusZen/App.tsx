import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

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
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: 'white',
        }}
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
