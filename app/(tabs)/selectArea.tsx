import { FlatList, ScrollView, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router"; // Hook de Expo Router
import { useEffect, useState } from "react";
import { useEstablecimientosXArea, useLocationStore } from "@/store";
import * as Location from 'expo-location';
import { establecimientos } from "@/util/data";

const lista = [
  { id: 1, nombre: "Area A" },
  { id: 2, nombre: "Area B" },
  { id: 3, nombre: "Area C" },
  { id: 4, nombre: "Area D" }
];

export default function SelectArea() {
  const router = useRouter(); // Obtén el hook de enrutamiento
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const { setEstablecimientosXArea } = useEstablecimientosXArea();
  const [hasPermission, setHasPermission] = useState(false);

  const handlePress = (id: number) => {
    const filterEstablecimiento = establecimientos.filter(
      (establecimiento) => establecimiento.area === id
    );

    // Si deseas hacer algo con los establecimientos filtrados, puedes usar un store
    setEstablecimientosXArea({ listaEstablecimientos: filterEstablecimiento });
    router.push(`/mapArea?id=${id}`); // Navega a 'mapArea' pasando el id como parámetro
  };

  useEffect(() => {
    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setHasPermission(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync();
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude!,
        longitude: location.coords?.longitude!,
      });
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: `${address[0].name}, ${address[0].region}`,
      });
    }
    requestLocation();
  }, []);

  const renderItem = ({ item }: { item: { id: number; nombre: string } }) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => handlePress(item.id)} // Agrega la función de manejo de evento onPress
      style={{ padding: 10, borderWidth: 1,minHeight:150, borderColor: "gray", flex: 1 }}
      className="m-2 items-center justify-center rounded-xl"
    >
      <Text>{item.nombre}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}
        className="text-center pt-2 pb-2">
          Seleccione el Área preferencia
        </Text>

      <FlatList
        data={lista}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} // Número de columnas
        columnWrapperStyle={{ justifyContent: 'space-between' }} // Espacio entre columnas
      />
    </SafeAreaView>
  );
}
