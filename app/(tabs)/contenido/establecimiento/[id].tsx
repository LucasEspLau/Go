import { Link, useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useEstablecimientosXProductos } from '@/store';
import { useEffect, useState } from 'react';
import { EstablecimientoXProducto, Producto } from '@/util/definitions';

export default function Establecimiento() {
  const { listaEstablecimientosXProducto } = useEstablecimientosXProductos();
  const params = useLocalSearchParams();

  if (!listaEstablecimientosXProducto) {
    return <Text>Cargando</Text>;
  }

  const estable = listaEstablecimientosXProducto.find(est => est.id_establecimiento.toString() === params.id);
  const [establecimientoData, setEstablecimientoData] = useState<EstablecimientoXProducto | undefined>(undefined);

  useEffect(() => {
    if (estable) {
      setEstablecimientoData(estable);
    }
  }, [estable]);

  if (!establecimientoData) {
    return <Text>No se encontró el establecimiento.</Text>;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
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

        <View className='border border-1 mt-8 ml-4 mr-4'>
          <Text className='font-moon mb-4 text-xl'>Productos</Text>
          {establecimientoData.productos.map(producto => (
            <CardProducto key={producto.id_producto} producto={producto} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function CardProducto({ producto }: { producto: Producto }) {
  return (
    <View className="flex flex-row p-2 border border-1">
      <Image
        className="w-[15vh] h-[15vh] rounded-3xl border border-1"
        source={{ uri: producto.img_producto }} // Usar la imagen del producto
      />
      <View className='flex flex-col justify-around'>
        <Text className="ml-4 text-black font-moon mb-2">{producto.nombre_producto}</Text>
        <Text className="ml-4 text-gray-700 font-semibold mb-2">{producto.descripcion_producto}</Text>
        <View className='flex flex-row items-center ml-4'>
          <FontAwesome5 name="shopping-bag" size={24} color="black" style={{ marginRight: 8 }} />
          <Text className="text-gray-700 font-semibold">Precio: ${producto.precio_producto}</Text>
        </View>
      </View>
    </View>
  );
}
