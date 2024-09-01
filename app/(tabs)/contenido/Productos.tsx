import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Image, SafeAreaView, Text, View, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function ScreenProductos() {
  const router = useRouter();

  const [productos, setProductos] = useState<any[]>([]);

  // Función para obtener los productos desde la API
  const fetchProductos = async () => {
    try {
      const response = await axios.post('https://api.deliverygoperu.com/productos.php', {
        token: '2342423423423', // Reemplaza con el token correcto
      });
      setProductos(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleProductPress = (name: string, id: string) => {
    router.setParams({
      data: JSON.stringify({
        nom: name,
        id: id,
      }),
    });
  };

  const handleButtonPress = (name: string, id: string) => {
    router.setParams({
      data: JSON.stringify({
        nom: name,
        id: id,
      }),
    });
    router.push('/(tabs)/contenido/producto');
  };

  const renderItem = ({ item }: { item: any }) => (
    <CardProducto
      name={item.nombre_producto}
      price={item.precio_producto}
      imageUrl={item.img_producto} 
      onProductPress={() => handleProductPress(item.nombre_producto, item.id_producto)}
      onButtonPress={() => handleButtonPress(item.nombre_producto, item.id_producto)}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={productos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_producto.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingHorizontal: 8 }}
      />
    </SafeAreaView>
  );
}

export function CardProducto({
  name,
  price,
  imageUrl,
  onProductPress,
  onButtonPress,
}: {
  name: string;
  price: string;
  imageUrl: string;
  onProductPress: () => void;
  onButtonPress: () => void;
}) {
  return (
    <View className="flex-1 p-2">
      <TouchableOpacity onPress={onProductPress} className="flex-1 p-2">
        <Image
          className="w-full h-[20vh] rounded-lg border border-gray-300"
          source={{ uri: imageUrl }} // Usa la URL de la imagen
          resizeMode="cover" // Ajusta el modo de redimensionado si es necesario
        />
        <Text className="ml-4 text-gray-700 font-semibold">{name}</Text>
        <Text style={{ color: "#F37A20" }} className="ml-4 font-semibold">{price}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#F37A20',
          padding: 10,
          borderRadius: 8,
          marginTop: 10,
        }}
        onPress={onButtonPress}
      >
        <Text style={{ fontSize: 16, color: 'white', marginLeft: 'auto', marginRight: 'auto' }}>
          Comprar ahora
        </Text>
      </TouchableOpacity>
    </View>
  );
}
