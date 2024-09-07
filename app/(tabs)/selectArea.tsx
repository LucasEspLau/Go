import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router"; // Hook de Expo Router

const lista = [
  { id: 1, nombre: "Area A" },
  { id: 2, nombre: "Area B" },
  { id: 3, nombre: "Area C" },
  { id: 4, nombre: "Area D" }
];

export default function SelectArea() {
  const router = useRouter(); // Obtén el hook de enrutamiento

  const handlePress = (id: number) => {
    router.push(`/mapArea?id=${id}`); // Navega a 'mapArea' pasando el id como parámetro
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        {lista.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            onPress={() => handlePress(item.id)} // Agrega la función de manejo de evento onPress
            style={{ padding: 10, borderWidth: 1, borderColor: "gray" }}
          >
            <Text>{item.nombre}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
