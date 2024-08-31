import { establecimientos } from '@/util/data';
import { Establecimiento } from '@/util/definitions';
import { router, useNavigation, useRouter } from 'expo-router';
import { Image, SafeAreaView, Text, View, FlatList, TouchableOpacity } from 'react-native';

export default function ScreenEstablecimientos() {

    const router = useRouter(); // Obtén el hook de enrutamiento

  
  const handlePress = (name: string,id:number) => {
    const ruta = `/establecimiento/${id}`;
    router.setParams({data:JSON.stringify({
      nom:"lucas"
    })})
    router.push(`/(tabs)/contenido/establecimiento/${id}`); // Asegúrate de que el tipo es compatible
  };

  const renderItem = ({ item }: { item: Establecimiento }) => (
    <CardEstablecimiento name={item.nombre_establecimiento} onPress={() => handlePress(item.nombre_establecimiento,item.id_establecimiento)} />
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={establecimientos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_establecimiento+""}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }} // Espacio entre columnas
        contentContainerStyle={{ paddingHorizontal: 8 }} // Padding horizontal
      />
    </SafeAreaView>
  );
}

export function CardEstablecimiento({ name, onPress }: { name: string; onPress: () => void }) {
    return (
      <TouchableOpacity onPress={onPress} className="flex-1 p-2">
        <View className="flex-1">
          <Image
            className="w-full h-[20vh] rounded-lg border border-gray-300"
            source={require('@/assets/images/logo.png')}
          />
          <Text className="ml-4 text-gray-700 font-semibold">{name}</Text>
        </View>
      </TouchableOpacity>
    );
  }