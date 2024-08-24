import { Image, StyleSheet, Platform, View, Text, TextInput, ImageProps, ImageBackground, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StatusBar } from 'expo-status-bar';
import { Link, useNavigation } from 'expo-router';


export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className='flex-row min-h-[8vh] items-center justify-between'>
        <Text className='ml-4 text-[6vh] font-moon'>Inicio</Text>
        <Image className='w-[10vh] h-[10vh] mr-4' source={require('@/assets/images/logo.png')} style={{ alignSelf: 'center' }} />
      </View>
      <View className='flex justify-center items-center mt-4 mb-4'>
        <TextInput
          className='flex items-center w-[90%] p-2 rounded-full'  // Añadir la clase rounded-lg
          placeholder='Ubicacion'
          style={{ backgroundColor: "#E7E8EA" }}
        />
      </View>
      <View className='flex flex-col mb-4 border border-1'>
        <Text className='ml-4 text-[2vh] font-moon' style={{fontWeight:'100'}}>Categorías</Text>
        <View className='flex flex-row border border-1 justify-center'>
          <IconCat img={require('@/assets/images/logo.png')} name='Establecimientos'/>        
          <IconCat img={require('@/assets/images/logo.png')} name='Productos'/>        
          <IconCat img={require('@/assets/images/logo.png')} name='Establecimientos'/>        
        </View>
      </View>
      <IconPromo/>
          
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}


export function IconCat({img,name}:{img:ImageProps,name:string}){

  return (
    
    <View className='flex flex-col border border-1 justify-center items-center m-2 max-w-[15vh]'>
      <Image className='w-[10vh] h-[10vh] border border-1' source={img} />
      <Link href={`/(contenido)/${name}`as any} >
        <Text>{name}</Text>
      </Link>
      

    </View>
  );
}
export function IconPromo() {
  return (
    <View className='p-4 h-[50vh] border border-1 rounded-lg flex justify-center items-center'>
      <ImageBackground
        className='w-[40vh] h-[40vh] border border-1 rounded-lg flex flex-col justify-between'
        source={require('@/assets/images/logo.png')}
        resizeMode="cover"
      >
        
        <Text className="mt-4 ml-4 text-white font-bold bg-black w-[20vh] rounded-full p-2">
          PROMOCIÓN DEL DÍA
        </Text>
        <View className='m-4'>
          <Text className='mt-2 mb-2 text-white font-moon'>
            NOMBRE DE LA PROMO
          </Text>
          <Text className='text-white'>
            NOMBRE DE LA PROMO
          </Text>
        </View>

      </ImageBackground>
    </View>
  );
}
