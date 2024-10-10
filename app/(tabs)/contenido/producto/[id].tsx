import { Link, useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView, Image, ImageBackground, TouchableOpacity, Alert, FlatList, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useCarrito, useEstablecimientosXProductos } from '@/store';
import { DetalleCarrito, EstablecimientoXProducto, Producto } from '@/util/definitions';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

export default function ProductoScreen() {
  const { listaEstablecimientosXProducto } = useEstablecimientosXProductos();
  const { listaProductos, setCarrito } = useCarrito();


  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [cantidad, setCantidad] = useState<number>(1);
  const [comentario, setComentario] = useState<string>('');


  if (!listaEstablecimientosXProducto) {
    return <Text>Cargando</Text>;
  }
  const params = useLocalSearchParams();
  console.log("Dentro de la vista producto")
  console.log(params.id)
  const dataId=params.id as string;
  const [idProducto, idEstablecimiento] = dataId.split('-');
  console.log("ID Producto:", idProducto); // Debería mostrar "36"
  console.log("ID Establecimiento:", idEstablecimiento); // Debería mostrar "1"
  const estable = listaEstablecimientosXProducto.find(est => est.id_establecimiento.toString() === idEstablecimiento) as EstablecimientoXProducto;
  const producto= estable.productos.find((pro:Producto)=> pro.id_establecimiento.toString() === idEstablecimiento);
  console.log("ESTABLE",estable)
  console.log("PRODUCTO",producto)

  if(!estable){
    return <Text>Cargando</Text>
  }
  if(!producto){
    return <Text>Cargando</Text>

  }
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

  const renderHeader = () => (
    <View>
        <View className="flex-row items-center justify-between ">
          <Link href={".."} className='border border-1 rounded-full p-3' style={{ backgroundColor: "white" }}>
            <Ionicons name="arrow-back" size={24} color="black" />

          </Link>
          <Image
              className="w-[5vh] h-[5vh] rounded-xl"
              source={{ uri: estable.logo_establecimiento }}
            />
          <Link href={".."} className='border border-1 rounded-full p-3' style={{ backgroundColor: "white",opacity:0 }}>
            <Ionicons name="arrow-back" size={24} color="black" />

          </Link>
        </View>
        <View className='flex justify-center items-center'>
          <Image
            className="w-[30vh] h-[30vh] rounded-3xl border border-1 mb-2"
            source={{ uri: producto.img_producto }}
          />

          
        </View>

        <View className="flex flex-col mt-4 ml-4 mr-4">
          <Text className="font-moon mt-2 mb-2 text-xl">{producto.nombre_producto}</Text>
          <Text style={{ color: "#F37A20",fontSize:18 }} className="font-moon font-semibold">Precio: S/. {producto.precio_producto}</Text>

          <Text className="mt-2 mb-2 font-bold text-lg">{producto.descripcion_producto}</Text>

        </View>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F37A20',
            padding: 10,
            borderRadius: 8,
            marginTop: 10,
          }}
          onPress={()=>openModal(producto)}
          className='flex flex-row justify-between ml-4 mr-4 mb-2'
        >
          <SimpleLineIcons name="handbag" size={24} color="black" />
          <Text style={{ fontSize: 16, color: 'white', marginRight: 10 }}>Añadir Carrito</Text>
        </TouchableOpacity>
        <View>
          <Text style={{ fontSize: 18}} className='font-moon m-2'>
            Productos
          </Text>
        </View>
    </View>

  );
  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={estable.productos}
        renderItem={({ item }) => <CardProducto producto={item} onAddCarrito={() => openModal(item)} />}
        keyExtractor={(item) => item.id_producto.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 10 }}
        ListHeaderComponent={renderHeader} // Usar renderHeader aquí
      />
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

function CardProducto({ producto, onAddCarrito }: { producto: Producto, onAddCarrito: () => void }) {
  return (
    <View className="flex flex-col p-2 border border-1 w-[48%] justify-around">
      <Image
        className="w-full h-[20vh] rounded-3xl border border-1 mb-2"
        source={{ uri: producto.img_producto }}
      />
      <Text className="text-black font-moon mb-1">{producto.nombre_producto}</Text>
      <Text className="text-gray-700 font-semibold mb-1">{producto.descripcion_producto}</Text>
      <View className='flex-row items-center'>
        <FontAwesome5 name="shopping-bag" size={18} color="black" style={{ marginRight: 4 }} />
        <Text className="font-semibold" style={{ color: "#F37A20" }}>Precio: ${producto.precio_producto}</Text>
      </View>
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
