import { useCarrito, useCategoriasProducto, useEstablecimientosXProductos, useLocationStore, useLugar } from '@/store';
import { productosSample } from '@/util/data';
import { CategoriaProducto, DetalleCarrito, EstablecimientoXProducto, Producto } from '@/util/definitions';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FontAwesome5, Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { Image, SafeAreaView, Text, View, FlatList, Button, TouchableOpacity, ScrollView, Alert, Modal, TextInput } from 'react-native';
import Toast from 'react-native-toast-message';

export default function ScreenProductos() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [cantidad, setCantidad] = useState<number>(1);
  const [comentario, setComentario] = useState<string>('');


  const router = useRouter(); // Obtén el hook de enrutamiento

  const {listaCategoriasProducto} =useCategoriasProducto()
  const { listaProductos, setCarrito,setEstablecimiento } = useCarrito();
  const { listaEstablecimientosXProducto } = useEstablecimientosXProductos();
  const {setDestinationLocation} = useLocationStore();

  const {id_lugar} =useLugar();
  if (!listaCategoriasProducto){
    return(<Text>Cargando</Text>)
  }
  
  if (!listaEstablecimientosXProducto) {
    return <Text>Cargando</Text>;
  }
  const [categoria,setCategoria]=useState<CategoriaProducto>(listaCategoriasProducto[0])
  const [productos, setProductos] = useState<Producto[]>();

  /*
  const [productoAReemplazar, setProductoAReemplazar] = useState<Producto | null>(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  useEffect(() => {
    if (mostrarConfirmacion) {
      Alert.alert(
        "Confirmar",
        "¿Deseas reemplazar el carrito con productos de este nuevo establecimiento?",
        [
          {
            text: "Cancelar",
            onPress: () => setMostrarConfirmacion(false),
            style: "cancel"
          },
          {
            text: "Reemplazar",
            onPress: () => {
              const nuevoDetalle: DetalleCarrito = {
                producto: productoAReemplazar!,
                cantidad: 1,
              };

              setCarrito({ listaProductos: [nuevoDetalle] });
              Toast.show({
                type: 'success',
                text1: 'Carrito',
                text2: 'Carrito reemplazado y producto añadido',
                position: 'bottom',
              });
              setMostrarConfirmacion(false);
            }
          }
        ]
      );
    }
  }, [mostrarConfirmacion]);

  */
  useEffect(()=>{
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.deliverygoperu.com/productos_categorias_lugar.php', {
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
        if (data[0].status === "error") {
          setProductos([]);
        } else {
          setProductos(data); // Asumiendo que el resto de los datos son los productos
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  },[categoria])
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

  const handlePressCategoria = (item:CategoriaProducto) =>{
    setCategoria(item);
  }
  
  const handlePress = (item:Producto) => {


    router.push(`/(tabs)/contenido/producto/${item.id_producto+"-"+item.id_establecimiento}`); // Asegúrate de que el tipo es compatible
  };
  
  const handleAddCarrito = () => {
    if (selectedProducto) {
      const productosEnCarrito = listaProductos ?? [];

      // Verificamos si ya hay productos en el carrito de otro establecimiento
      // Verificamos si ya hay productos en el carrito de otro establecimiento
      if (productosEnCarrito.length > 0 && productosEnCarrito[0].producto.id_establecimiento !== selectedProducto.id_establecimiento) {
        // Preguntar al usuario si desea reemplazar el carrito
        Alert.alert(
          "Reemplazar Carrito",
          "El producto seleccionado pertenece a un establecimiento diferente. ¿Deseas reemplazar el carrito actual?",
          [
            {
              text: "Cancelar",
              onPress: () => {},
              style: "cancel"
            },
            {
              text: "Reemplazar",
              onPress: () => {
                const nuevoDetalle: DetalleCarrito = {
                  producto: selectedProducto,
                  cantidad: cantidad,
                  comentario: comentario,
                };
                const estElegido=listaEstablecimientosXProducto[selectedProducto.id_establecimiento]
                console.log(estElegido);
                setEstablecimiento({id_establecimiento:selectedProducto.id_establecimiento})
                setDestinationLocation({latitude:estElegido?.latitud,longitude:estElegido?.longitud,address:""})
                // Reemplazar el carrito
                setCarrito({
                  listaProductos: [nuevoDetalle],
                });

                Toast.show({
                  type: 'success',
                  text1: 'Carrito',
                  text2: 'Carrito reemplazado y producto añadido',
                  position: 'bottom',
                });
                setModalVisible(false);
                setCantidad(1);
                setComentario('');
              }
            }
          ]
        );
        return;
      }

      // Si ya está en el carrito, mostramos una alerta
      const yaEnCarrito = productosEnCarrito.some(
        (detalle) => detalle.producto.id_producto === selectedProducto.id_producto
      );

      if (yaEnCarrito) {
        Toast.show({
          type: 'info',
          text1: 'Carrito',
          text2: 'El producto ya está en el carrito.',
          position: 'bottom',
        });
      } else {
        const nuevoDetalle: DetalleCarrito = {
          producto: selectedProducto,
          cantidad: cantidad,
          comentario: comentario,
        };
        const estElegido=listaEstablecimientosXProducto[selectedProducto.id_establecimiento]
        console.log(estElegido);
        setEstablecimiento({id_establecimiento:selectedProducto.id_establecimiento})

        setDestinationLocation({latitude:estElegido?.latitud,longitude:estElegido?.longitud,address:""})
        setCarrito({
          listaProductos: [...productosEnCarrito, nuevoDetalle],
        });

        Toast.show({
          type: 'success',
          text1: 'Carrito',
          text2: 'Producto añadido al carrito',
          position: 'bottom',
        });
      }

      setModalVisible(false);
      setCantidad(1);
      setComentario('');
    }
  };
  const openModal = (producto: Producto) => {
    setSelectedProducto(producto);
    setModalVisible(true);
  };


  const renderItem = ({ item }:{item:Producto}) => (
    <CardProducto producto={item} onPress={() => handlePress(item)} onAddCarrito={() => openModal(item)} listaEstablecimientos={listaEstablecimientosXProducto}/>
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
      <TouchableOpacity
        onPress={() => router.back()} // Botón para regresar a la página anterior
        className="p-4 mt-4"
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

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
      {
        productos && productos.length > 0 ? (
        <FlatList
          data={productos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_producto.toString()}
          numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }} // Espacio entre columnas
            contentContainerStyle={{ paddingHorizontal: 8 }} // Padding horizontal
        />
      ) : (
        <Text className="text-center mt-4">No hay productos disponibles.</Text>
        )
      }

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-center items-center bg-opacity-50">
          <View className="bg-white p-4 rounded-lg w-4/5">
            <Text className="font-bold text-lg mb-4">Selecciona cantidad y añade comentario</Text>
            
            <Text className="font-semibold mb-2">Cantidad:</Text>
            <TextInput
              className="border border-gray-300 p-2 rounded-md mb-4"
              keyboardType="numeric"
              value={cantidad.toString()}
              onChangeText={(value) => setCantidad(Number(value))}
            />
            
            <Text className="font-semibold mb-2">Comentario:</Text>
            <TextInput
              className="border border-gray-300 p-2 rounded-md mb-4"
              multiline
              value={comentario}
              onChangeText={setComentario}
            />
            
            <View className="flex-row justify-end">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="bg-gray-400 p-2 rounded-md mr-2"
              >
                <Text className="text-white">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddCarrito}
                className="bg-green-500 p-2 rounded-md"
              >
                <Text className="text-white">Añadir al Carrito</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export function CardProducto({ producto, onPress, onAddCarrito,listaEstablecimientos }: { producto: Producto; onPress: () => void; onAddCarrito: () => void;listaEstablecimientos:EstablecimientoXProducto[] }) {
  
  const estableProd: EstablecimientoXProducto = listaEstablecimientos.find(
    (estable) => estable.id_establecimiento.toString() === producto.id_establecimiento.toString()
  )!;

  return (
    <View className="flex-1 p-2">
      <TouchableOpacity onPress={onPress} className="flex-1 p-2 justify-around">
        <Image
          className="w-full h-[20vh] rounded-lg border border-gray-300"
          source={require('@/assets/images/logo.png')}
        />
        <Text className="text-gray-700 font-semibold" style={{fontSize:18}}>{producto.nombre_producto}</Text>
        <Text style={{ color: "#F37A20",fontSize:18 }} className="font-semibold">S/. {producto.precio_producto}</Text>
        <View className='flex flex-row mt-2 mb-2 items-center justify-left'>
          <Image
            className="w-[4vh] h-[4vh] rounded-lg border border-gray-300"
            source={{uri:estableProd.logo_establecimiento}}
          />
          <Text className="text-gray-700 font-semibold ml-2" style={{ fontSize: 16, }} >{estableProd.nombre_establecimiento}</Text>
        </View>

      </TouchableOpacity>
      
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#F37A20',
          padding: 10,
          borderRadius: 8,
          marginTop: 10,
        }}
        onPress={onAddCarrito}
        className='flex flex-row justify-between'
      >
      <SimpleLineIcons name="handbag" size={24} color="black" />
        <Text style={{ fontSize: 16, color: 'white', marginRight: 10 }}>Añadir Carrito</Text>
      </TouchableOpacity>
    </View>
  );
}
