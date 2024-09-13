import { useCategoriasEstablecimiento, useLugar } from '@/store';
import { establecimientos } from '@/util/data';
import { CategoriaEstablecimiento, Establecimiento } from '@/util/definitions';
import { router, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, SafeAreaView, Text, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';

export default function ScreenEstablecimientos() {
  const router = useRouter(); // Obtén el hook de enrutamiento
  const {listaCategoriasEstablecimiento} =useCategoriasEstablecimiento()
  const {id_lugar} =useLugar();
  if (!listaCategoriasEstablecimiento){
    return(<Text>Cargando</Text>)
  }
  const [categoria,setCategoria]=useState<CategoriaEstablecimiento>(listaCategoriasEstablecimiento[0])
  const [establecimientos,setEstablecimientos]=useState<Establecimiento[]>()
  useEffect(()=>{
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.deliverygoperu.com/establecimiento_categoria_lugar.php', {
          method: 'POST',
          body: JSON.stringify(
            { 
              token: '2342423423423',
              categoria:categoria.id_categoria_establecimiento,
              id_lugar:id_lugar
            }
          ),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setEstablecimientos(data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  },[categoria])

  const handlePressCategoria = async (item:CategoriaEstablecimiento) =>{
    setCategoria(item);
  }
  const handlePress = (item:Establecimiento) => {
    router.push(`/(tabs)/contenido/establecimiento/${item.id_establecimiento}`); // Asegúrate de que el tipo es compatible
  };

  const renderItem = ({ item }: { item: Establecimiento }) => (
    <CardEstablecimiento item={item} onPress={() => handlePress(item)} />
  );

  const renderCategoryItem = ({ item }: { item: CategoriaEstablecimiento}) => (
    <TouchableOpacity
      key={item.id_categoria_establecimiento}
      onPress={() =>handlePressCategoria(item)}
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
      <ScrollView className='border-2 border-black min-h-[150px] max-h-[150px]'>
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