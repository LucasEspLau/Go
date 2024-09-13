import { useCategoriasProducto, useLugar } from '@/store';
import { productosSample } from '@/util/data';
import { CategoriaProducto, Producto } from '@/util/definitions';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, SafeAreaView, Text, View, FlatList, Button, TouchableOpacity, ScrollView } from 'react-native';

export default function ScreenProductos() {
  const router = useRouter(); // Obtén el hook de enrutamiento

  const {listaCategoriasProducto} =useCategoriasProducto()
  const {id_lugar} =useLugar();
  if (!listaCategoriasProducto){
    return(<Text>Cargando</Text>)
  }
  const [categoria,setCategoria]=useState<CategoriaProducto>(listaCategoriasProducto[0])
  const [productos, setProductos] = useState<Producto[]>(productosSample);

/*
  useEffect(()=>{
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.deliverygoperu.com/establecimiento_categoria_lugar.php', {
          method: 'POST',
          body: JSON.stringify(
            { 
              token: '2342423423423',
              categoria:categoria.id_categoria_productos,
              id_lugar:id_lugar
            }
          ),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setProductos(data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  },[categoria])*/
/*
  // Función para obtener los productos desde la API
  const fetchProductos = async () => {
    try {
      const response = await axios.post('https://api.deliverygoperu.com/productos.php', {
        token: '2342423423423', 
      });
      setProductos(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);
*/

  const handlePressCategoria = async (item:CategoriaProducto) =>{
    setCategoria(item);
  }
  const handlePress = (item:Producto) => {


    router.push(`/(tabs)/contenido/producto/${item.id_producto}`); // Asegúrate de que el tipo es compatible
  };

  const renderItem = ({ item }:{item:any}) => (
    <CardProducto producto={item} onPress={() => handlePress(item)}/>
  );
  const renderCategoryItem = ({ item }: { item: CategoriaProducto}) => (
    <TouchableOpacity
      key={item.id_categoria_productos}
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
            data={listaCategoriasProducto}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id_categoria_productos.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
          />
      </ScrollView>
      <FlatList
        data={productos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_producto+""}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }} // Espacio entre columnas
        contentContainerStyle={{ paddingHorizontal: 8 }} // Padding horizontal
      />
    </SafeAreaView>
  );
}

export function CardProducto({ producto, onPress }: { producto: Producto; onPress: () => void }) {
  
  const handleAddCarrito = (item:Producto) => {
        
  };
  return (
    <View className="flex-1 p-2">
      <TouchableOpacity onPress={onPress} className="flex-1 p-2">
        <Image
          className="w-full h-[20vh] rounded-lg border border-gray-300"
          source={require('@/assets/images/logo.png')}
        />
        <Text className="ml-4 text-gray-700 font-semibold">{producto.nombre_producto}</Text>
        <Text style={{ color: "#F37A20" }} className="ml-4 font-semibold">{producto.precio_producto}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flexDirection: 'row', 
          alignItems: 'center', 
          backgroundColor: '#F37A20', // Color de fondo del botón
          padding: 10, 
          borderRadius: 8, // Bordes redondeados
          marginTop: 10, 
        }}
        onPress={() => handleAddCarrito(producto)}
        className='flex flex-row justify-between'
      >
        <Image
          source={require('@/assets/images/logo.png')} // Cambia esto a la imagen deseada para el botón
          style={{ width: 20, height: 20, marginLeft: 10 }}
        />
        <Text style={{ fontSize: 16, color: 'white',marginRight:10 }}>Añadir Carrito</Text>

      </TouchableOpacity>
    </View>
  );
}