import { FlatList, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { useRouter } from "expo-router"; // Hook de Expo Router
import { useEffect, useState } from "react";
import { useLugar } from "@/store";
import { Lugar } from "@/util/definitions";

export default function SelectArea() {
  const router = useRouter(); // Obtén el hook de enrutamiento
  const [lista, setLista] = useState<Lugar[]>([]);
  const { setLugar } = useLugar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.deliverygoperu.com/lugares.php', {
          method: 'POST',
          body: JSON.stringify({ token: '2342423423423' }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setLista(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handlePress = (lugar: Lugar) => {
    
    setLugar({
      id_lugar:lugar.id_lugar??0,
      nombre:lugar.nombre??'',
      img:lugar.img??'',
      estado:lugar.estado??0
    }); // Asignar el lugar seleccionado
    router.push(`/(tabs)/home`);
  };

  const renderItem = ({ item }: { item: Lugar }) => (
    <TouchableOpacity
      key={item.id_lugar}
      onPress={() => handlePress(item)} // Agrega la función de manejo de evento onPress
      style={{ padding: 10, borderWidth: 1, minHeight: 150, borderColor: "gray", flex: 1 }}
      className="m-2 items-center justify-center rounded-xl"
    >
      <Text>{item.nombre}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <Text style={{ fontSize: 20, fontWeight: 'bold' }} className="text-center pt-2 pb-2">
        Seleccione el Área de preferencia
      </Text>

      <FlatList
        data={lista}
        renderItem={renderItem}
        keyExtractor={(item) => (item.id_lugar ? item.id_lugar.toString() : `key-${item.nombre}`)}
        numColumns={2} // Número de columnas
        columnWrapperStyle={{ justifyContent: 'space-between' }} // Espacio entre columnas
      />

    </SafeAreaView>
  );
}
