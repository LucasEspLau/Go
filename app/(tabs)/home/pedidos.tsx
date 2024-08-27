import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Pedidos(){
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-row items-center mt-4 ml-4">
              <Link href=".." className='border border-1 rounded-full p-3' style={{backgroundColor:"white"}} >
                <Ionicons name="arrow-back" size={24} color="black" />
              </Link>
            </View>

          <View className='border border-1 mt-8 ml-4 mr-4'>
            <Text className='font-moon mb-4 text-xl'>Pedidos</Text>
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