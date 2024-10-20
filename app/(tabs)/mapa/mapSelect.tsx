import { useLocationStore } from "@/store";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, Region } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
export default function MapSelect() {
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [isLoadDirec,setIsLoadDirec]=useState(false);
  const {
    userLongitude,
    userLatitude,
    userAddress,
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
      console.log("USEEFECT MAPA")

      if(userLatitude && userLongitude){
        console.log("CUANDO YA SE ENTRO AL MAPA")
        setMarkerCoordinate({
          latitude: userLatitude,
          longitude: userLongitude,
        });
        setRegion({
          latitude: userLatitude,
          longitude: userLongitude,
          latitudeDelta: 0.0922, // Ajusta el zoom del mapa
          longitudeDelta: 0.0421, // Ajusta el zoom del mapa
        });
      }else{
        console.log("PRIMERA VEZ ENTRANDO AL MAPA")

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
      }


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
  console.log("PERSONA", markerCoordinate.latitude, markerCoordinate.longitude);
  console.log("DESTINO", destinationLatitude, destinationLongitude);
  
  return (
    <View className="flex-1">
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          position: "absolute",
          top: 40, // Ajusta esta propiedad para la distancia desde la parte superior
          left: 20, // Ajusta esta propiedad para la distancia desde el borde izquierdo
          backgroundColor: "white",
          borderRadius: 25, // Radio para hacer el botón circular
          padding: 10, // Ajusta el tamaño del botón
          zIndex: 1, // Asegura que el botón esté encima del mapa
          elevation: 5, // Sombra para dar efecto elevado
          pointerEvents: "box-none",  // Esto permitirá que los eventos pasen al mapa
        }}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <MapView
        provider={PROVIDER_DEFAULT}
        className="w-full h-full"
        mapType="mutedStandard"
        showsPointsOfInterest={false}
        showsUserLocation={true}
        userInterfaceStyle="light"
        region={region}  // Cambiar a region para actualizar dinámicamente
        scrollEnabled={true}
        zoomEnabled={true}
        rotateEnabled={true}
        pitchEnabled={true}
        onRegionChangeComplete={(newRegion) => {
          console.log("Map region changed", newRegion);
          //setRegion(newRegion);
        }}
      >
    {markerCoordinate.latitude !== 0 && markerCoordinate.longitude !== 0 && (
      <Marker
        coordinate={markerCoordinate}
        draggable
        onDragEnd={(e) => {
          const { latitude, longitude } = e.nativeEvent.coordinate;
          console.log("Se movió", latitude, longitude);
          setMarkerCoordinate({ latitude, longitude });

          setIsLoadDirec(true)
          // Actualizar la ubicación del usuario sin esperar a que se complete
          Location.reverseGeocodeAsync({
            latitude,
            longitude,
          }).then((addressUser) => {
            setUserLocation({
              latitude,
              longitude,
              address: `${addressUser[0]?.name || 'Dirección no encontrada'}, ${addressUser[0]?.region || ''}`,
            });
            setIsLoadDirec(false)

            /*
            setRegion((prevRegion) => ({
              latitude,
              longitude,
              latitudeDelta: prevRegion.latitudeDelta,
              longitudeDelta: prevRegion.longitudeDelta,
            }));*/
          }).catch((error) => {
            console.error("Error al obtener la dirección:", error);
            setIsLoadDirec(false)

          });
        }}
        zIndex={10}  // Prioridad de eventos
      />
    )}

        {destinationLatitude != null && destinationLongitude != null && (
          <Marker
            coordinate={{
              latitude: Number(destinationLatitude),
              longitude: Number(destinationLongitude),
            }}
            pinColor="red"
            title="Destino"
            description="Este es tu destino"
          />
        )}
      </MapView>
      <View className="absolute bottom-0 left-0 w-full min-h-[8vh] flex justify-center items-center bg-white rounded-t-3xl p-4 z-10 shadow-2xl">
        {
          isLoadDirec ?
          <ActivityIndicator size="small" color="#0000ff" />
          :
          (
            <View className="flex flex-row justify-center items-center">
              <Text className="mr-2">Ubicación:</Text>
              <TextInput
                className="text-center border border-1 p-1 min-w-[30vh] rounded-xl"
                value={userAddress+""}
                onChangeText={(direccion) => setUserLocation({latitude:userLatitude,longitude:userLongitude,address:direccion})}
                placeholder="Añadir dirección"
                />
            </View>
          )
        }
      </View>

    </View>
  );
}
