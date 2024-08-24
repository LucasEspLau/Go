import { useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Establecimiento() {
  const params = useLocalSearchParams();
  console.log("Dentro de la vista")
  console.log(params)
  const descripcion = "Aquí va una descripción detallada del establecimiento.";

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View>
        <Text>Establecimiento</Text>
      </View>
    </SafeAreaView>
  );
}
