import { Link, useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function Establecimiento() {
  const params = useLocalSearchParams();
  console.log("Dentro de la vista")
  console.log(params)

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ImageBackground
        className="h-[60vh] border border-1 rounded-3xl flex flex-col justify-between mr-4"
        source={require('@/assets/images/logo.png')}
        resizeMode="cover"
      >
        <View className="flex-row items-center mt-4 ml-4">
          <Link href={".."} className='border border-1 rounded-full p-3' style={{backgroundColor:"white"}} >
            <Ionicons name="arrow-back" size={24} color="black" />
          </Link>
        </View>
        <View className="flex flex-col mt-4 ml-4">

          <Text className="text-white font-moon mt-2 mb-2 text-xl">Nombre del establecimiento</Text>
          <Text className="text-white mt-2 mb-2 font-bold text-lg">Costo de envio</Text>
          <Text className="mb-4 mt-4 text-black font-bold bg-white w-[20vh] rounded-full p-2 border border-1">
            Horario de apertura
          </Text>
        </View>
        
      </ImageBackground>

      <View className='border border-1 mt-8 ml-4 mr-4'>
        <Text className='font-moon mb-4 text-xl'>Establecimiento</Text>
        <ScrollView>
          <CardProducto/>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function CardProducto(){
  return(
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
  )
}