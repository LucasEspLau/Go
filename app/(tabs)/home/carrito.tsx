import { useCarrito, useLocationStore, useMetodosPago } from "@/store";
import { DetalleCarrito } from "@/util/definitions";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';
import DropDownPicker  from "react-native-dropdown-picker"
import { useState } from "react";

export default function Carrito() {
  const { listaProductos, setCarrito, id_establecimiento } = useCarrito();
  const { userLatitude,userLongitude,userAddress } = useLocationStore();

  const { metodosPago } =useMetodosPago();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  // Asegurarse de que metodosPago sea un array antes de mapearlo
  const [items, setItems] = useState(
    metodosPago?.map((metodo) => ({
      label: metodo.metodo_pago,
      value: metodo.id_pago,
    })) || [] // Si es null, iniciamos con un array vacío
  );
  
  // Función para calcular el subtotal de un producto
  const calcularSubtotal = (detalle: DetalleCarrito) => {
    return detalle.cantidad * detalle.producto.precio_producto;
  };
  // Función para aplicar el porcentaje de aumento basado en el método de pago
  const aplicarAumento = (total: number) => {
    const metodoSeleccionado = metodosPago?.find(metodo => metodo.id_pago === value);
    if (metodoSeleccionado) {
      const aumento = (metodoSeleccionado.porcentaje / 100) * total; // Calculamos el aumento
      return total + aumento; // Sumamos el aumento al total
    }
    return total; // Si no hay método seleccionado, retornamos el total sin cambios
  };
  // Función para calcular el total del carrito
  const calcularTotal = () => {
    const total = listaProductos?.reduce((total, detalle) => total + calcularSubtotal(detalle), 0) ?? 0;
    return aplicarAumento(total); // Llamamos a la función que aplica el aumento
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
  const handleComentarioChange = (item: DetalleCarrito, nuevoComentario: string) => {
    const updatedList = listaProductos?.map((detalle) =>
      detalle.producto.id_producto === item.producto.id_producto
        ? { ...detalle, comentario: nuevoComentario }
        : detalle
    ) ?? [];
    setCarrito({ listaProductos: updatedList });
  };


  const fetchPago = async () => {

    const dataPagar={
      id_cliente:1,
      id_establecimiento:id_establecimiento,
      monto:calcularTotal().toFixed(2),
      monto_delivery:3,
      monto_real:listaProductos?.reduce((total, detalle) => total + calcularSubtotal(detalle), 0) ?? 0,
      direccion:userAddress,
      latitud:userLatitude,
      longitud:userLongitude,
      metodo_pago:value,
      productos: [listaProductos?.map((item) => ({
        id_producto:item.producto.id_producto,
        cantidad:item.cantidad,
        comentario:item.comentario
      }))]
    }
    console.log('Procesando pago con los siguientes datos:', dataPagar);
    console.log('Procesando pago con los siguientes datos:', dataPagar.productos[0]);
    /*
    try {
      const response = await fetch(
        "https://api.deliverygoperu.com/recibir_pedido.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataPagar),
        }
      );
      const data = await response.json();
      console.log("Data pago:", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }*/
  }

  const confirmarPago = () => {
    Alert.alert(
      "Confirmar Pago",
      "¿Estás seguro de que deseas realizar el pago?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Aceptar",
          onPress: async () => {
            await fetchPago();
            Toast.show({
              type: 'success',
              text1: 'Pago realizado con éxito',
            });
          },
        },
      ],
      { cancelable: true }
    );
  };
  return (
    
    <SafeAreaView className="flex-1 bg-white">

      <View className="flex flex-row justify-between items-center">
        <TouchableOpacity
          onPress={() => router.back()} // Botón para regresar a la página anterior
          className="p-4"
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className='font-moon mt-4 mb-2 text-xl '>Carrito</Text>

        <TouchableOpacity
          onPress={() => router.push('/(tabs)/mapa/mapSelect' as any)}
          className="p-4"
        >
          <Ionicons name="location" size={24} color="black" />
        </TouchableOpacity>
    
      </View>

      <View className="flex-1 border border-1">
        <ScrollView>
          <View className='border border-1 mt-4 ml-4 mr-4'>
            {listaProductos?.map((detalle) => (
              <View key={detalle.producto.id_producto} className="flex-row items-center border-b border-gray-300 p-4">
                <Image
                    source={{ uri: detalle.producto.img_producto }}
                    className="w-16 h-16 rounded-lg"
                  />
                <View className="flex-1 ml-4">
                  <Text className="text-lg font-semibold">{detalle.producto.nombre_producto}</Text>
                  <Text className="text-gray-600">Precio: ${detalle.producto.precio_producto}</Text>
                  <Text className="text-gray-600">Cantidad: {detalle.cantidad}</Text>
                  <Text className="text-gray-600">Subtotal: ${calcularSubtotal(detalle).toFixed(2)}</Text>
                  <TextInput
                    value={detalle.comentario}
                    onChangeText={(nuevoComentario) => handleComentarioChange(detalle, nuevoComentario)}
                    placeholder="Añadir un comentario"
                    className="border border-gray-300 rounded p-2 mt-2"
                  />
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
            {(!listaProductos || listaProductos.length === 0) && (
              <Text className="text-center mt-4">El carrito está vacío</Text>
            )}
          </View>
        </ScrollView>
        <View className="border-t border-gray-300 p-4">
          <View>
            <Text className="text-xl font-semibold">Total: ${calcularTotal().toFixed(2)}</Text>
            {
              metodosPago && metodosPago.length > 0 && (
                <DropDownPicker
                  open={open}
                  value={value}
                  items={items}
                  setOpen={setOpen}
                  setValue={setValue}
                  setItems={setItems}
                  placeholder="Seleccionar método de pago"
                  style={{ backgroundColor: "#fafafa" }}
                />
              )
            }


          </View>
          <TouchableOpacity
            style={{
              backgroundColor: '#F37A20', // Cambia el color según la condición
              padding: 10,
              borderRadius: 8,
              marginTop: 10,
            }}
            onPress={() => router.push('/(tabs)/mapa/mapSelect' as any)}
            className='flex flex-row justify-center'
          >
            <Ionicons name="location" size={24} color="white" />

            <Text style={{ fontSize: 16, color: 'white', marginRight: 10 }}>
              {!userAddress 
                ? "Seleccionar ubicación en el mapa"  // Mensaje cuando la ubicación no está seleccionada
                : userAddress // Mensaje por defecto si todo está correcto
              }
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: userLatitude && userLongitude && value && listaProductos && listaProductos.length !== 0 ? '#F37A20' : '#ccc', // Cambia el color según la condición
              padding: 10,
              borderRadius: 8,
              marginTop: 10,
            }}
            onPress={confirmarPago}
            className='flex flex-row justify-center'
            disabled={!userLatitude || !userLongitude || !value || !listaProductos || listaProductos.length === 0} // Deshabilitar si no hay ubicación o método de pago
          >
            <Text style={{ fontSize: 16, color: 'white', marginRight: 10 }}>
              {!userLatitude || !userLongitude 
                ? "Ubicación no seleccionada"  // Mensaje cuando la ubicación no está seleccionada
                : !value 
                ? "Selecciona un método de pago"  // Mensaje cuando el método de pago no está seleccionado
                : !listaProductos || listaProductos.length === 0
                ? "Carrito esta vacio"
                : "Pagar"  // Mensaje por defecto si todo está correcto

              }
            </Text>
          </TouchableOpacity>

        </View>
      </View>
      <Toast />

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