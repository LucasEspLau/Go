import { useLocationStore } from "@/store";
import { calculateRegion } from "@/util/map";
import { Text, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

export default function Mapa() {
    const {
        userLongitude,
        userLatitude,
        destinationLatitude,
        destinationLongitude
    } = useLocationStore();

    const region = calculateRegion({
        userLongitude,
        userLatitude,
        destinationLatitude,
        destinationLongitude
    });

    if (userLatitude === null || userLongitude === null) {
        return <Text>Ubicación de usuario no disponible.</Text>;
    }

    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
    if (!apiKey) {
        return <Text>API Key no está definida.</Text>;
    }

    console.log(userLatitude, userLongitude);

    const localLongitude = -122.4194; // Longitud de San Francisco
    const localLatitude = 37.7749;    // Latitud de San Francisco

    return (
        <MapView 
            provider={PROVIDER_DEFAULT} 
            className="w-full h-full"
            mapType="mutedStandard"
            showsPointsOfInterest={false}
            initialRegion={region}
            showsUserLocation={true}
            userInterfaceStyle="light"
        >
            <Marker coordinate={{latitude: localLatitude, longitude: localLongitude}}/>
            
            <MapViewDirections 
                origin={{
                    latitude: userLatitude,
                    longitude: userLongitude
                }}
                destination={{
                    latitude: localLatitude,
                    longitude: localLongitude
                }}
                apikey={apiKey as string}
                strokeColor="blue"
                strokeWidth={3}
            />
        </MapView>
    );
}
