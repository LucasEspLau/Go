import { useEstablecimientosXArea, useLocationStore } from "@/store";
import { calculateRegion } from "@/util/map";
import { Link, useRouter } from "expo-router";
import { Text, View, Button } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MapArea() {
    const router = useRouter(); // Hook para manejar la navegación

    const {
        userLongitude,
        userLatitude,
        destinationLatitude,
        destinationLongitude
    } = useLocationStore();

    const { listaEstablecimientos } = useEstablecimientosXArea(); // Lista de establecimientos filtrados por área
    const region = calculateRegion({
        userLongitude,
        userLatitude,
        destinationLatitude,
        destinationLongitude
    });

    if (userLatitude === null || userLongitude === null || listaEstablecimientos === null) {
        return (
            <SafeAreaView>
                <Link href={'/(tabs)/home/'}>Ubicación de usuario no disponible.</Link>
            </SafeAreaView>
        );
    }

    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
    if (!apiKey) {
        return (<Text>API Key no está definida.</Text>);
    }

    console.log(userLatitude, userLongitude);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <MapView
                provider={PROVIDER_DEFAULT}
                className="w-full h-full"
                mapType="mutedStandard"
                showsPointsOfInterest={false}
                initialRegion={region}
                showsUserLocation={true}
                userInterfaceStyle="light"
                style={{ flex: 1 }}
            >
                {/* Mostrar los establecimientos como marcadores en el mapa */}
                {listaEstablecimientos.map((establecimiento) => (
                    <Marker
                        key={establecimiento.id_establecimiento}
                        coordinate={{
                            latitude: establecimiento.latitud,
                            longitude: establecimiento.longitud
                        }}
                        title={establecimiento.nombre_establecimiento}
                        description={establecimiento.descripcion_establecimiento}
                    />
                ))}

                {/* Agrega una ruta si tienes coordenadas de destino */}
                {destinationLatitude && destinationLongitude && (
                    <MapViewDirections
                        origin={{ latitude: userLatitude, longitude: userLongitude }}
                        destination={{ latitude: destinationLatitude, longitude: destinationLongitude }}
                        apikey={apiKey}
                        strokeWidth={3}
                        strokeColor="blue"
                    />
                )}
            </MapView>

            {/* Botón para retroceder */}
            <View style={{ position: 'absolute', top: 50, left: 20 }}>
                <Button title="Volver" onPress={() => router.back()} />
            </View>
            <View style={{ position: 'absolute', top: 50, right: 60 }}>
                <Button title="Inicio" onPress={() => router.navigate('/(tabs)/home/')} />
            </View>
        </SafeAreaView>
    );
}
