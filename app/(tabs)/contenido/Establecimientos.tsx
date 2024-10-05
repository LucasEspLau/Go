import { useCategoriasEstablecimiento, useLugar } from '@/store';
import { CategoriaEstablecimiento, Establecimiento } from '@/util/definitions';
import { Ionicons } from '@expo/vector-icons';
import { router, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, SafeAreaView, Text, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';

export default function ScreenEstablecimientos() {
  const router = useRouter();
  const { listaCategoriasEstablecimiento } = useCategoriasEstablecimiento();
  const { id_lugar } = useLugar();

  if (!listaCategoriasEstablecimiento) {
    return (<Text>Cargando</Text>);
  }
  const [categorias, setCategorias] = useState<CategoriaEstablecimiento[]>(listaCategoriasEstablecimiento);

  const [categoria, setCategoria] = useState<CategoriaEstablecimiento>(listaCategoriasEstablecimiento[0]);
  const [establecimientos, setEstablecimientos] = useState<Establecimiento[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.deliverygoperu.com/establecimiento_categoria_lugar.php', {
          method: 'POST',
          body: JSON.stringify({
            token: '2342423423423',
            categoria: categoria.id_categoria_establecimiento,
            id_lugar: id_lugar,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setEstablecimientos(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [categoria]);

  const handlePressCategoria = async (item: CategoriaEstablecimiento) => {
    setCategoria(item);
  };

  const handlePress = (item: Establecimiento) => {
    router.push(`/(tabs)/contenido/establecimiento/${item.id_establecimiento}`);
  };

  const renderItem = ({ item }: { item: Establecimiento }) => (
    <CardEstablecimiento item={item} onPress={() => handlePress(item)} categorias={categorias}/>
  );

  const renderCategoryItem = ({ item }: { item: CategoriaEstablecimiento }) => (
    <TouchableOpacity
      key={item.id_categoria_establecimiento}
      onPress={() => handlePressCategoria(item)}
      className='border-2 border-gray rounded-xl p-2 ml-2 mr-2 items-center'
    >
      <Image
        className="w-[80px] h-[80px] rounded-xl"
        source={{ uri: item.img }} // Usa la URL de la imagen
      />
      <Text>{item.nombre}</Text>
    </TouchableOpacity>
  );
  
  const filteredEstablecimientos = establecimientos.filter(item => 
    item.horario_inicio && item.horario_fin && item.nombre_establecimiento && item.descripcion_establecimiento
  );
  return (
    
    <SafeAreaView className="flex-1 bg-white">
      <TouchableOpacity
        onPress={() => router.back()} // Botón para regresar a la página anterior
        className="p-4"
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
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
      {filteredEstablecimientos.length > 0 ? ( // Verifica si hay establecimientos filtrados
      <FlatList
        data={filteredEstablecimientos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_establecimiento + ""}
        numColumns={1} // Cambiado a 1 para una columna
        contentContainerStyle={{ paddingHorizontal: 8 }} // Padding horizontal
      />
    ) : (
      <Text className="text-center mt-4">No hay establecimientos disponibles.</Text> // Mensaje cuando no hay establecimientos
    )}

    </SafeAreaView>
  );
}

export function CardEstablecimiento({ item, onPress, categorias }: { item: Establecimiento; onPress: () => void; categorias: CategoriaEstablecimiento[] }) {
  // Convierte el id de la categoría a número
  const categoriaId = Number(item.categoria);

  // Busca la categoría correspondiente
  const cat = categorias.find(c => c.id_categoria_establecimiento === categoriaId);

  return (
    <TouchableOpacity onPress={onPress} className="flex-row p-2 border-b border-gray-300">
      <Image
        className="w-[15vh] h-full rounded-xl" // Ajusta el tamaño de la imagen
        source={{ uri: item.logo_establecimiento }} 
      />
      <View className="flex-1 ml-4 mt-2 mb-2"> 
        <Text className="text-gray-700 mb-1 font-semibold text-left">{item.nombre_establecimiento}</Text>
        {cat ? (
          <Text className="text-gray-600 mb-1 text-left">{cat.nombre}</Text> // Mostrar el nombre de la categoría
        ) : (
          <Text className="text-gray-600 mb-1 text-left">Categoría no disponible</Text> // Mensaje en caso de que la categoría no exista
        )}
        <Text className="text-gray-500 mb-1 text-left">{`Horario: ${item.horario_inicio} - ${item.horario_fin}`}</Text>
      </View>
    </TouchableOpacity>
  );
}
