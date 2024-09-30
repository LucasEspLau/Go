import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Image, ImageBackground, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useCarrito, useEstablecimientosXProductos } from '@/store';
import { useEffect, useState } from 'react';
import { DetalleCarrito, EstablecimientoXProducto, Producto } from '@/util/definitions';
import Toast from 'react-native-toast-message';

export default function Establecimiento() {
  const { listaEstablecimientosXProducto } = useEstablecimientosXProductos();
  const { listaProductos, setCarrito } = useCarrito();

  const params = useLocalSearchParams();

  if (!listaEstablecimientosXProducto) {
    return <Text>Cargando</Text>;
  }
  const router = useRouter(); // Obtén el hook de enrutamiento

  const estable = listaEstablecimientosXProducto.find(est => est.id_establecimiento.toString() === params.id);
  const [establecimientoData, setEstablecimientoData] = useState<EstablecimientoXProducto | undefined>(undefined);

  useEffect(() => {
    if (estable) {
      setEstablecimientoData(estable);
    }
  }, [estable]);

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

  if (!establecimientoData) {
    return <Text>No se encontró el establecimiento.</Text>;
  }

  const handleAddCarrito = (item: Producto) => {
    const productosEnCarrito = listaProductos ?? [];

    if (productosEnCarrito.length > 0) {
      const idEstablecimientoEnCarrito = productosEnCarrito[0].producto.id_establecimiento;

      if (idEstablecimientoEnCarrito !== item.id_establecimiento) {
        Toast.show({
          type: 'error',
          text1: 'Carrito',
          text2: 'El producto no corresponde al establecimiento actual. ¿Deseas reemplazar el carrito?',
          position: 'bottom',
        });

        setProductoAReemplazar(item);
        setMostrarConfirmacion(true);
        return;
      }
    }

    const yaEnCarrito = productosEnCarrito.some(
      (detalle) => detalle.producto.id_producto === item.id_producto
    );

    if (yaEnCarrito) {
      Toast.show({
        type: 'info',
        text1: 'Carrito',
        text2: 'Ya está añadido al carrito',
        position: 'bottom',
      });
    } else {
      const nuevoDetalle: DetalleCarrito = {
        producto: item,
        cantidad: 1,
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
  };

  const renderHeader = () => (
    <>
    <ImageBackground
      className="h-[60vh] border border-1 rounded-3xl flex flex-col justify-between mr-4"
      source={{ uri: establecimientoData.logo_establecimiento }}
      resizeMode="cover"
    >
      <View className="flex-row items-center mt-4 ml-4">
        <Link href={".."} className='border border-1 rounded-full p-3' style={{ backgroundColor: "white" }}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Link>
      </View>
      <View className="flex flex-col mt-4 ml-4">
        <Text className="text-white font-moon mt-2 mb-2 text-xl">{establecimientoData.nombre_establecimiento}</Text>
        <Text className="text-white mt-2 mb-2 font-bold text-lg">Costo de envío</Text>
        <Text className="mb-4 mt-4 text-black font-bold bg-white w-[20vh] rounded-full p-2 border border-1">
          Horario de apertura: {establecimientoData.horario_inicio} - {establecimientoData.horario_fin}
        </Text>
      </View>

    </ImageBackground>
    <View>
        <Text style={{ fontSize: 18}} className='font-moon m-2'>
          Productos
        </Text>
      </View>
    </>

  );
  const totalCarrito = listaProductos?.reduce(
    (total, item) => total + item.producto.precio_producto * item.cantidad,
    0
  ) ?? 0;
  const handlePress = () => {


    router.push(`/(tabs)/home/carrito`); // Asegúrate de que el tipo es compatible
  };

  return (
    <>
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={establecimientoData.productos}
        renderItem={({ item }) => <CardProducto producto={item} onAddCarrito={() => handleAddCarrito(item)} />}
        keyExtractor={(item) => item.id_producto.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 10 }}
        ListHeaderComponent={renderHeader} // Usar renderHeader aquí
      />
    </SafeAreaView>
      <View className='h-[10vh] bg-white flex-row items-center justify-between p-4'>
        <Text className="text-black font-bold text-lg">Total Carrito:</Text>
        <Text className="text-black font-bold text-lg">${totalCarrito.toFixed(2)}</Text>
        <TouchableOpacity onPress={()=>handlePress()}
          style={{
            backgroundColor: '#F37A20',
            padding: 10,
            borderRadius: 8,
          }}
          className='flex flex-row items-center justify-between'>
          <SimpleLineIcons name="handbag" size={24}  />
          <Text style={{ fontSize: 16}} className='ml-4'>Ir Carrito</Text>

        </TouchableOpacity>
      </View>
    </>

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
        <Text className="text-gray-700 font-semibold">Precio: ${producto.precio_producto}</Text>
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
