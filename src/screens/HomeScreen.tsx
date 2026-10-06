import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [region, setRegion] = useState({
    latitude: 51.4818,  // Bochum Zentrum
    longitude: 7.2162,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [obstacles, setObstacles] = useState([
    // Beispiel-Hindernisse
    {
      id: '1',
      coordinate: { latitude: 51.4818, longitude: 7.2162 },
      title: 'Defekter Aufzug',
      type: 'obstacle'
    },
    {
      id: '2',
      coordinate: { latitude: 51.4820, longitude: 7.2165 },
      title: 'Barrierefreies Café',
      type: 'accessible'
    }
  ]);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        setRegion({
          ...region,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => console.log(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        showsUserLocation
        showsMyLocationButton
      >
        {obstacles.map(marker => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            pinColor={marker.type === 'obstacle' ? '#EA4335' : '#34A853'}
            onPress={() => navigation.navigate('PlaceDetails', { placeId: marker.id })}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default HomeScreen; 