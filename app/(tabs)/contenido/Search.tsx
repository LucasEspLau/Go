import { useCategoriasEstablecimiento, useLugar } from '@/store';
import { CategoriaEstablecimiento, Producto } from '@/util/definitions';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, SafeAreaView, Text, View, FlatList, TouchableOpacity, ScrollView, TextInput } from 'react-native';

export default function ScreenProductos() {
  const router = useRouter();
  const { listaCategoriasEstablecimiento } = useCategoriasEstablecimiento();
  const { id_lugar } = useLugar();
  const [categorias, setCategorias] = useState<CategoriaEstablecimiento[]>(listaCategoriasEstablecimiento || []);
  const [categoria, setCategoria] = useState<CategoriaEstablecimiento | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [mejoresProductos, setMejoresProductos] = useState<Producto[]>([]); // Estado para los productos más solicitados
  const [buscar, setBuscar] = useState(''); // Nuevo estado para la búsqueda del producto
  const [loading, setLoading] = useState(false); // Estado para indicar si está cargando

  // Mostrar mensaje de carga si aún no tenemos categorías
  if (!listaCategoriasEstablecimiento) {
    return (<Text>Cargando...</Text>);
  }

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true); // Indicamos que está cargando

        // Fetch de productos más solicitados
        const responseRanking = await fetch('https://api.deliverygoperu.com/productos_ranking.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: '2342423423423',
            id_lugar: id_lugar,
          }),
        });

        if (!responseRanking.ok) {
          throw new Error('Error de red al obtener productos más solicitados');
        }

        const dataRanking = await responseRanking.json();

        if (dataRanking.status !== 'error' && Array.isArray(dataRanking) && dataRanking.length > 0) {
          setMejoresProductos(dataRanking); // Actualiza con los productos más solicitados
        }

        // Fetch de productos con búsqueda
        const responseBuscar = await fetch('https://api.deliverygoperu.com/productos_buscar_lugar.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: '2342423423423',
            id_lugar: id_lugar,
            buscar: buscar,
          }),
        });

        if (!responseBuscar.ok) {
          throw new Error('Error de red al buscar productos');
        }

        const dataBuscar = await responseBuscar.json();

        if (Array.isArray(dataBuscar) && dataBuscar.length > 0) {
          const productosExtraidos = dataBuscar.flatMap((establecimiento: any) => {
            return establecimiento && Array.isArray(establecimiento.productos) ? establecimiento.productos : [];
          });

          const productosFiltrados = productosExtraidos.filter((producto: any) => producto?.nombre_producto && producto?.precio_producto);
          setProductos(productosFiltrados); // Actualiza con los productos filtrados
        }
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    };

    fetchProductos();
  }, [id_lugar, categoria, buscar]);

  // Función para manejar la selección de categorías
  const handlePressCategoria = (item: CategoriaEstablecimiento) => {
    setCategoria(item);
  };

  // Función para manejar la selección de productos
  const handlePressProducto = (item: Producto) => {
    console.log(item)
    router.push(`/(tabs)/contenido/producto/${item.id_producto+"-"+item.id_establecimiento}`);
  };

  // Función para obtener una clave única para cada item
  const getUniqueKey = (item: Producto | CategoriaEstablecimiento) => {
    if ((item as Producto).id_producto) {
      return (item as Producto).id_producto.toString(); // Usar id_producto si es un Producto
    } else if ((item as CategoriaEstablecimiento).id_categoria_establecimiento) {
      return (item as CategoriaEstablecimiento).id_categoria_establecimiento.toString(); // Usar id_categoria_establecimiento si es una CategoriaEstablecimiento
    } else {
      return `${Math.random()}`; // Si ninguno de los ids está disponible, generar un valor único aleatorio
    }
  };

  // Renderizar cada producto
  const renderItem = ({ item }: { item: Producto }) => {
    if (!item || !item.nombre_producto) {
      return null; // Evita que se rendericen productos sin nombre
    }

    return <CardProducto item={item} onPress={() => handlePressProducto(item)} categorias={categorias} />;
  };

  // Renderizado principal
  return (
    <SafeAreaView className="bg-white flex-1">
      <TouchableOpacity
        onPress={() => router.back()}
        className="p-4 mt-4"
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Campo de búsqueda */}
      <TextInput
        value={buscar}
        onChangeText={setBuscar} // Actualiza el valor de 'buscar' a medida que el usuario escribe
        placeholder="Buscar productos..."
        className="border-2 border-gray-300 rounded-xl p-4 mx-4 my-2"
      />

      {loading ? (
        <Text className="text-center mt-4">Cargando productos...</Text>
      ) : (
        <>
          {/* Mejores productos mostrados de manera horizontal */}
          <FlatList
            data={mejoresProductos}
            renderItem={renderItem}
            keyExtractor={getUniqueKey} // Usar getUniqueKey para obtener claves únicas
            horizontal={true} // Mostrar los productos de manera horizontal
            contentContainerStyle={{ paddingHorizontal: 8 }}
            key={'mejores-productos'} // Cambia la clave para evitar conflictos
          />

          {/* Sección de productos filtrados */}
          <FlatList
            data={productos}
            renderItem={renderItem}
            keyExtractor={getUniqueKey} // Usar getUniqueKey para obtener claves únicas
            contentContainerStyle={{ paddingHorizontal: 8 }}
            key={'productos-filtrados'} // Cambia la clave para evitar conflictos
          />
        </>
      )}
    </SafeAreaView>
  );
}

// Componente que muestra la tarjeta del producto
export function CardProducto({ item, onPress, categorias }: { item: Producto; onPress: () => void; categorias: CategoriaEstablecimiento[] }) {
  const categoriaId = Number(item.categoria);
  const cat = categorias.find(c => c.id_categoria_establecimiento === categoriaId);

  return (
    <TouchableOpacity onPress={onPress} className="flex-row p-2 border-b border-gray-300">
      <Image
        className="w-[150px] h-[150px] rounded-xl" // Ajuste de tamaño
        source={{ uri: item.img_producto }} 
      />
      <View className="flex-1 ml-4 mt-2 mb-2"> 
        <Text className="text-gray-700 mb-1 font-semibold text-left">{item.nombre_producto}</Text>
        {cat ? (
          <Text className="text-gray-600 mb-1 text-left">{cat.nombre}</Text>
        ) : (
          <Text className="text-gray-600 mb-1 text-left">Categoría no disponible</Text>
        )}
        <Text className="text-gray-500 mb-1 text-left">{`Precio: S/ ${item.precio_producto}`}</Text>
      </View>
    </TouchableOpacity>
  );
}
