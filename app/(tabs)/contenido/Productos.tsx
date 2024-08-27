import { useRouter } from 'expo-router';
import { Image, SafeAreaView, Text, View, FlatList, Button, TouchableOpacity } from 'react-native';

export default function ScreenProductos() {
  const router = useRouter(); // Obtén el hook de enrutamiento

  // Datos de ejemplo
  const productos = [
    { id: '1', name: 'Producto 1' },
    { id: '2', name: 'Producto 2' },
    { id: '3', name: 'Producto 3' },
    { id: '4', name: 'Producto 4' },
    { id: '5', name: 'Producto 5' },
    { id: '6', name: 'Producto 6' },
    { id: '6', name: 'Producto 6' },
    { id: '6', name: 'Producto 6' },

    // Agrega más productos según sea necesario
  ];
  const handlePress = (name: string,id:string) => {
    router.setParams({data:JSON.stringify({
      nom:"lucas"
    })})
    router.push('/(tabs)/contenido/producto'); // Asegúrate de que el tipo es compatible
  };

  const renderItem = ({ item }:{item:any}) => (
    <CardProducto name={item.name} onPress={() => handlePress(item.name,item.id)} />
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={productos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }} // Espacio entre columnas
        contentContainerStyle={{ paddingHorizontal: 8 }} // Padding horizontal
      />
    </SafeAreaView>
  );
}

export function CardProducto({ name, onPress }: { name: string; onPress: () => void }) {
  return (
    <View className="flex-1 p-2">
      <TouchableOpacity onPress={onPress} className="flex-1 p-2">
        <Image
          className="w-full h-[20vh] rounded-lg border border-gray-300"
          source={require('@/assets/images/logo.png')}
        />
        <Text className="ml-4 text-gray-700 font-semibold">{name}</Text>
        <Text style={{ color: "#F37A20" }} className="ml-4 font-semibold">100</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flexDirection: 'row', 
          alignItems: 'center', 
          backgroundColor: '#F37A20', // Color de fondo del botón
          padding: 10, 
          borderRadius: 8, // Bordes redondeados
          marginTop: 10, 
        }}
        onPress={() => console.log('Button pressed')}
        className='flex flex-row justify-between'
      >
        <Image
          source={require('@/assets/images/logo.png')} // Cambia esto a la imagen deseada para el botón
          style={{ width: 20, height: 20, marginLeft: 10 }}
        />
        <Text style={{ fontSize: 16, color: 'white',marginRight:10 }}>Button Text</Text>

      </TouchableOpacity>
    </View>
  );
}
