import { useCategoriasEstablecimiento } from '@/store';
import { establecimientos } from '@/util/data';
import { CategoriaEstablecimiento, Establecimiento } from '@/util/definitions';
import { router, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { Image, SafeAreaView, Text, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';

export default function ScreenEstablecimientos() {

  const router = useRouter(); // Obtén el hook de enrutamiento
  const {listaCategoriasEstablecimiento} =useCategoriasEstablecimiento()

  const handlePress = (name: string,id:number) => {
    router.push(`/(tabs)/contenido/establecimiento/${id}`); // Asegúrate de que el tipo es compatible
  };

  const renderItem = ({ item }: { item: Establecimiento }) => (
    <CardEstablecimiento item={item} onPress={() => handlePress(item.nombre_establecimiento,item.id_establecimiento)} />
  );

  const renderCategoryItem = ({ item }: { item: CategoriaEstablecimiento}) => (
    <TouchableOpacity
      key={item.id_categoria_establecimiento}
      onPress={() =>alert("categoria presionada")}
      className='border-2 border-gray rounded-xl p-2 ml-2 mr-2 items-center'
    >
      <Image
        className="w-[80px] h-[80px] rounded-xl"
        source={{ uri: item.img }} // Usa la URL de la imagen
      />
      <Text>{item.nombre}</Text>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className='border-2 border-black max-h-[150px]'>
        <FlatList
            data={listaCategoriasEstablecimiento}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id_categoria_establecimiento.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
          />
      </ScrollView>
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

export function CardEstablecimiento({ item, onPress }: { item: Establecimiento; onPress: () => void }) {
    return (
      <TouchableOpacity onPress={onPress} className="flex-1 p-2">
        <View className="flex-1">
          <Image
            className="w-full h-[20vh] rounded-xl"
            source={{ uri: item.logo_establecimiento }} // Usa la URL de la imagen
          />

          <Text className="text-gray-700 font-semibold text-center mt-2 mb-2">{item.nombre_establecimiento}</Text>
        </View>
      </TouchableOpacity>
    );
  }