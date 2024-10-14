import { useLocationStore } from "@/store";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, Region } from "react-native-maps";
import * as Location from "expo-location";

export default function MapSelect() {
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const {
    userLongitude,
    userLatitude,
    destinationLongitude,
    destinationLatitude,
    setUserLocation
  } = useLocationStore();

  // Estado para manejar la posición del marcador
  const [markerCoordinate, setMarkerCoordinate] = useState({
    latitude: userLatitude || 0,  // Asigna un valor por defecto en lugar de null
    longitude: userLongitude || 0,  // Asigna un valor por defecto en lugar de null
  });

  // Estado para la región del mapa
  const [region, setRegion] = useState<Region>({
    latitude: markerCoordinate.latitude,
    longitude: markerCoordinate.longitude,
    latitudeDelta: 0.0922, // Ajusta el zoom del mapa
    longitudeDelta: 0.0421, // Ajusta el zoom del mapa
  });

  useEffect(() => {
    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermission(false);
        setIsLoading(false); // Termina la carga si no se concede permiso
        return;
      }
      let location = await Location.getCurrentPositionAsync();
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: `${address[0].name}, ${address[0].region}`,
      });

      // Establecer la ubicación del marcador y actualizar la región del mapa
      setMarkerCoordinate({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922, // Ajusta el zoom del mapa
        longitudeDelta: 0.0421, // Ajusta el zoom del mapa
      });

      setIsLoading(false); // Termina la carga cuando se obtiene la ubicación
    };

    requestLocation();
  }, []);

  // Si está cargando, mostrar el indicador de carga
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando ubicación...</Text>
      </View>
    );
  }

  // Si no se puede obtener la ubicación del usuario
  if (userLatitude === null || userLongitude === null) {
    return <Text>Ubicación de usuario no disponible en selected.</Text>;
  }

  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
  if (!apiKey) {
    return <Text>API Key no está definida.</Text>;
  }
  console.log("PERSONA",markerCoordinate.latitude,markerCoordinate.longitude)

  console.log("DESTINO",destinationLatitude,destinationLongitude)
  return (
    <MapView 
      provider={PROVIDER_DEFAULT} 
      className="w-full h-full"
      mapType="mutedStandard"
      showsPointsOfInterest={false}
      showsUserLocation={true}
      userInterfaceStyle="light"
      region={region} // Establecer la región del mapa
      onRegionChangeComplete={(newRegion) => {
        setRegion(newRegion); // Actualiza la región cuando se mueve el mapa
      }}
    >
      {markerCoordinate.latitude !== 0 && markerCoordinate.longitude !== 0 && (
        <Marker 
          coordinate={markerCoordinate}
          draggable // Hacer que el marcador sea arrastrable
          onDragEnd={(e) => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            setMarkerCoordinate({ latitude, longitude });
            setUserLocation({ latitude, longitude, address: "" });
            // Actualiza la región al arrastrar el marcador
            setRegion((prevRegion) => ({
              latitude,
              longitude,
              latitudeDelta: prevRegion.latitudeDelta,
              longitudeDelta: prevRegion.longitudeDelta,
            }));
          }}
        />
      )}
        {destinationLatitude !== undefined && destinationLongitude !== undefined  && (
        <Marker 
            coordinate={{ 
            latitude: Number(destinationLatitude), 
            longitude: Number(destinationLongitude) 
            }}
            pinColor="red" 
            title="Destino"
            description="Este es tu destino"
        />
        )}


    </MapView>
  );
}
