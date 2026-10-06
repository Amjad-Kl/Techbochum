import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import ReportScreen from '../screens/ReportScreen';
import NavigationScreen from '../screens/NavigationScreen';
import PlaceDetailsScreen from '../screens/PlaceDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type RootStackParamList = {
  Home: undefined;
  Report: undefined;
  Navigation: undefined;
  PlaceDetails: { placeId: string };
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1A73E8',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: 'Roboto',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'TechBochum' }}
        />
        <Stack.Screen 
          name="Report" 
          component={ReportScreen} 
          options={{ title: 'Hindernis melden' }}
        />
        <Stack.Screen 
          name="Navigation" 
          component={NavigationScreen} 
          options={{ title: 'Navigation' }}
        />
        <Stack.Screen 
          name="PlaceDetails" 
          component={PlaceDetailsScreen} 
          options={{ title: 'Details' }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ title: 'Profil' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 