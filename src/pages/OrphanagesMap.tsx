import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { StyleSheet, Text, View } from 'react-native';

import { Dimensions } from 'react-native'

import mapMarker from '../images/map-marker.png';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import api from '../services/api';

interface Orphanage {
  id: number,
  name: string,
  latitude: number,
  longitude: number
}

export default function OrphanagesMap() {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

  const navigation = useNavigation();

  function handleNavigateToOrphanageDetails(id: number) {
    navigation.navigate("OrphanageDetails", { id });
  }

  function handleNavigateToCreateOrphanage() {
    navigation.navigate("SelectMapPosition");
  }

  useFocusEffect(() => {
    api.get('orphanages').then(response => {
      setOrphanages(response.data);
    })
  })

  return (
      <View style={styles.container}>
          <MapView 
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
              latitude: -20.3878454,
              longitude: -43.5031357,
              latitudeDelta: 0.008,
              longitudeDelta: 0.008
          }}
          >
            {
              orphanages.length > 0 &&
                orphanages.map(orphanage => (
                  <Marker 
                    key={orphanage.id}
                    calloutAnchor={{
                      x: 2.7,
                      y: 0.8
                    }}
                    icon={mapMarker} 
                    coordinate={{
                      latitude: orphanage.latitude,
                      longitude: orphanage.longitude,
                  }}>
                    <Callout tooltip onPress={() => handleNavigateToOrphanageDetails(orphanage.id)}>
                        <View style={styles.calloutContainer}>
                        <Text style={styles.calloutText}>{orphanage.name}</Text>
                        </View>
                    </Callout>
                  </Marker>
                ))
                
            }
            </MapView>
          

          <View style={styles.footer}>
              <Text style={styles.footerText}>{orphanages.length} orfanatos encontrados</Text>

              <RectButton style={styles.createOrphanageButton} onPress={handleNavigateToCreateOrphanage}>
                <Feather name="plus" size={20} color="#fff" />
              </RectButton>
          </View>

          <StatusBar style="auto" />
      </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
    },
    calloutContainer: {
      width: 160,
      height: 46,
      paddingHorizontal: 16,
      backgroundColor: 'rgba(255,255,255,0.8)',
      borderRadius: 16,
      justifyContent: 'center',
    },
    calloutText: {
      fontFamily: 'Nunito_700Bold',
      color: '#0089a5',
      fontSize: 14,
    },
  
    footer: {
      position: 'absolute',
      left: 24,
      right: 24,
      bottom: 32,
  
      backgroundColor: "#fff",
      borderRadius: 20,
      height: 46,
      paddingLeft: 24,
  
      flexDirection: 'row',
      justifyContent: "space-between",
      alignItems: "center",
  
      elevation: 3
    },
    footerText: {
      fontFamily: 'Nunito_700Bold',
      color: "#8fa7b3"
    },
    createOrphanageButton: {
      width: 56,
      height: 56,
      backgroundColor: "#15c3d6",
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: "center"
    },
  });
  