import { useCarrito } from "@/store";
import { DetalleCarrito } from "@/util/definitions";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';

export default function Carrito() {
  const { listaProductos, setCarrito } = useCarrito();

  // Función para calcular el subtotal de un producto
  const calcularSubtotal = (detalle: DetalleCarrito) => {
    return detalle.cantidad * detalle.producto.precio_producto;
  };

  // Función para calcular el total del carrito
  const calcularTotal = () => {
    return listaProductos?.reduce((total, detalle) => total + calcularSubtotal(detalle), 0) ?? 0;
  };

  const handleIncrement = (item: DetalleCarrito) => {
    const updatedList = listaProductos?.map((detalle) => 
      detalle.producto.id_producto === item.producto.id_producto 
        ? { ...detalle, cantidad: detalle.cantidad + 1 }
        : detalle
    ) ?? [];
    setCarrito({ listaProductos: updatedList });
    Toast.show({
      type: 'success',
      text1: 'Carrito',
      text2: 'Cantidad incrementada',
      position: 'bottom',
    });
  };

  const handleDecrement = (item: DetalleCarrito) => {
    const updatedList = listaProductos?.map((detalle) => 
      detalle.producto.id_producto === item.producto.id_producto 
        ? { ...detalle, cantidad: Math.max(1, detalle.cantidad - 1) }
        : detalle
    ) ?? [];
    setCarrito({ listaProductos: updatedList });
    Toast.show({
      type: 'success',
      text1: 'Carrito',
      text2: 'Cantidad decrementada',
      position: 'bottom',
    });
  };

  const handleRemove = (item: DetalleCarrito) => {
    const updatedList = listaProductos?.filter((detalle) => 
      detalle.producto.id_producto !== item.producto.id_producto
    ) ?? [];
    setCarrito({ listaProductos: updatedList });
    Toast.show({
      type: 'info',
      text1: 'Carrito',
      text2: 'Producto eliminado',
      position: 'bottom',
    });
  };

  return (
    
    <SafeAreaView className="flex-1 bg-white">
      <TouchableOpacity
        onPress={() => router.back()} // Botón para regresar a la página anterior
        className="p-4"
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
        <View className="flex flex-row justify-center items-center">
            <Text className='font-moon mt-4 mb-4 text-xl'>Carrito</Text>

        </View>
      <View className="flex-1 border border-1">
        <ScrollView>
          <View className='border border-1 mt-4 ml-4 mr-4'>
            {listaProductos?.map((detalle) => (
              <View key={detalle.producto.id_producto} className="flex-row items-center border-b border-gray-300 p-4">
                <Image
                  source={require('@/assets/images/logo.png')} // Cambia la imagen si es necesario
                  className="w-16 h-16 rounded-lg"
                />
                <View className="flex-1 ml-4">
                  <Text className="text-lg font-semibold">{detalle.producto.nombre_producto}</Text>
                  <Text className="text-gray-600">Precio: ${detalle.producto.precio_producto}</Text>
                  <Text className="text-gray-600">Cantidad: {detalle.cantidad}</Text>
                  <Text className="text-gray-600">Subtotal: ${calcularSubtotal(detalle).toFixed(2)}</Text>
                  <View className="flex-row mt-2">
                    <TouchableOpacity 
                      onPress={() => handleDecrement(detalle)}
                      className="p-2 bg-gray-200 rounded mr-2"
                    >
                      <Ionicons name="remove" size={20} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => handleIncrement(detalle)}
                      className="p-2 bg-gray-200 rounded mr-2"
                    >
                      <Ionicons name="add" size={20} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => handleRemove(detalle)}
                      className="p-2 bg-red-500 rounded"
                    >
                      <FontAwesome5 name="trash" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
            {listaProductos?.length === 0 && (
              <Text className="text-center mt-4">El carrito está vacío</Text>
            )}
          </View>
        </ScrollView>
        <View className="border-t border-gray-300 p-4">
          <Text className="text-xl font-semibold">Total: ${calcularTotal().toFixed(2)}</Text>
          <TouchableOpacity
            style={{
            backgroundColor: '#F37A20',
            padding: 10,
            borderRadius: 8,
            marginTop: 10,
            }}
            onPress={()=>alert("alerta")}
            className='flex flex-row justify-center'
        >
            <Text style={{ fontSize: 16, color: 'white', marginRight: 10}}>Pagar</Text>
        </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}


function CardProducto(){
    return(
      <Link href={"/mapa"}>
        <View className="flex flex-row p-2 border border-1">
          <Image
            className="w-[15vh] h-[15vh] rounded-3xl border border-1"
            source={require('@/assets/images/logo.png')}
          />
          <View className='flex flex-col justify-around'>
            <Text className="ml-4 text-black font-moon mb-2">Producto 1</Text>
    
            <Text className="ml-4 text-gray-700 font-semibold mb-2">Detalle producto</Text>
            <View className='flex flex-row items-center ml-4 '> 
              <FontAwesome5 name="shopping-bag" size={24} color="black" style={{ marginRight: 8 }} />
              <Text className="text-gray-700 font-semibold">Precio: $100</Text>
            </View>
          </View>
    
        </View>
      </Link>

    )
  }