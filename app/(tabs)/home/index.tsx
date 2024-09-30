import { Image, StyleSheet, Platform, View, Text, TextInput, ImageProps, ImageBackground, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { Link, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { establecimientos, productosSample } from '@/util/data';
import { useCategoriasEstablecimiento, useCategoriasProducto, useEstablecimientosXProductos, useLocationStore, useLugar } from '@/store';
import { CategoriaEstablecimiento, CategoriaProducto, EstablecimientoXProducto } from '@/util/definitions';


export default function HomeScreen() {

  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(true); // Estado para el modal
  const [anuncio,setAnuncio] = useState();
  const {setUserLocation}=useLocationStore()
  const {setCategoriasEstablecimiento}=useCategoriasEstablecimiento()
  const {setCategoriasProducto}=useCategoriasProducto()
  const {setEstablecimientosXProductos}=useEstablecimientosXProductos()
  const { id_lugar } = useLugar();

  const [hasPermission, setHasPermission]= useState(false)

  
  useEffect(()=>{
    const requestLocation= async()=>{
      let {status}=await Location.requestForegroundPermissionsAsync();
      if(status!=='granted'){
        setHasPermission(false)
        return
      }

      let location=await Location.getCurrentPositionAsync();
      const address=await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude!,
        longitude: location.coords?.longitude!,
      });
      setUserLocation({
        latitude:location.coords.latitude,
        longitude:location.coords.longitude,
        address: `${address[0].name}, ${address[0].region}`,
      })
    }
    requestLocation()
  },[])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.deliverygoperu.com/categorias_establecimiento.php',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token: '2342423423423'
          })
        }); // Cambia la URL por la de tu API
        const result = await response.json();
        const listaCategoriasEstablecimiento = result as CategoriaEstablecimiento[]
        setCategoriasEstablecimiento({listaCategoriasEstablecimiento})
      } catch (error) {
        console.error('Error fetching data:', error);
      } 
      try {
        const response = await fetch('https://api.deliverygoperu.com/categorias_productos.php',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token: '2342423423423'
          })
        }); // Cambia la URL por la de tu API
        const result = await response.json();
        const listaCategoriasProducto = result as CategoriaProducto[]
        setCategoriasProducto({listaCategoriasProducto})
      } catch (error) {
        console.error('Error fetching data:', error);
      } 
      try {
        const response = await fetch('https://api.deliverygoperu.com/establecimiento_productos.php',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token: '2342423423423',
            id_lugar: id_lugar
          })
        }); // Cambia la URL por la de tu API
        const result = await response.json();
        const listaEstablecimientosXProducto = result as EstablecimientoXProducto[]
        setEstablecimientosXProductos({listaEstablecimientosXProducto})
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      try {
        const response = await fetch('https://api.deliverygoperu.com/anuncios.php',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token: '2342423423423'
          })
        }); // Cambia la URL por la de tu API
        const result = await response.json();
        setAnuncio(result)
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
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
      <View className='flex flex-col border border-1'>
        <Text className='ml-4 text-[2vh] font-moon' style={{fontWeight:'100'}}>Categorías</Text>
        <View className='flex flex-row border border-1 justify-around'>
          <IconCat img={require('@/assets/images/logo.png')} name='Establecimientos' disabled={loading} />        
          <IconCat img={require('@/assets/images/logo.png')} name='Productos' disabled={loading}/>     
        </View>
      </View>
      <IconPromo anuncio={anuncio}/>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} 
      >
        <View className='flex-1 justify-center items-center'>
          <View className='bg-white rounded-lg p-4'>
            <IconPromo anuncio={anuncio}/>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 10 }}>
              <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

export function IconCat({ img, name, disabled }: { img: ImageProps; name: string; disabled: boolean }) {
  return (
    <View className='border border-1 '>
      <Link
            href={`/contenido/${name}` as any}
            disabled={disabled}
            style={{display:'flex',justifyContent:'center',alignItems:'center'}}
            className='border border-1 rounded-lg'
          >
        <View className='border border-1 w-full flex justify-center items-center'>
          <Image className='border border-2 w-[10vh] h-[10vh] p-4' source={img} />

          <Text className='mt-2 text-center'>{name}</Text>
        </View>


      </Link>
    </View>

  );
}

export function IconPromo({anuncio}:{anuncio:any}) {
  const productoAnuncio=productosSample[0]
  return (
    <View className='p-4 h-[50vh]  rounded-lg flex justify-center items-center'>
      <ImageBackground
        className='w-[40vh] h-[40vh] border border-1 rounded-lg flex flex-col justify-between'
        source={{uri:productoAnuncio.img_producto}}
        resizeMode="cover"
      >
        
        <Text className="mt-4 ml-4 text-white font-bold bg-black w-[20vh] rounded-full p-2">
          PROMOCIÓN DEL DÍA
        </Text>
        <View className='mr-2 ml-2 bg-white'>
          <Text className='mt-2 mb-2 text-black font-moon'>
            {productoAnuncio.nombre_producto}
          </Text>
          <Text className='text-black font-moon'>
            PRECIO: S/.{productoAnuncio.precio_producto}
          </Text>
        </View>

      </ImageBackground>
    </View>
  );
}
