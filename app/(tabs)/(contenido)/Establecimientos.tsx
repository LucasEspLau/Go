import { router, useNavigation, useRouter } from 'expo-router';
import { Image, SafeAreaView, Text, View, FlatList, TouchableOpacity } from 'react-native';

export default function ScreenEstablecimientos() {

    const router = useRouter(); // Obtén el hook de enrutamiento

    const establecimientos = [
    { id: '1', name: 'Establecimiento 1' },
    { id: '2', name: 'Establecimiento 2' },
    { id: '3', name: 'Establecimiento 3' },
    { id: '4', name: 'Establecimiento 4' },
    { id: '5', name: 'Establecimiento 5' },
    { id: '6', name: 'Establecimiento 6' },
    { id: '7', name: 'Establecimiento 7' },
    { id: '8', name: 'Establecimiento 8' },
    // Agrega más establecimientos según sea necesario
  ];
  const handlePress = (name: string,id:string) => {
    const ruta = `/(establecimiento)/${id}?edad=hola`;
    router.setParams({nom:name,id:100})
    router.push({ pathname: ruta } as any); // Asegúrate de que el tipo es compatible
  };

  const renderItem = ({ item }: { item: any }) => (
    <CardEstablecimiento name={item.name} onPress={() => handlePress(item.name,item.id)} />
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={establecimientos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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