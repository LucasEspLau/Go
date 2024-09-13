import { useCategoriasProducto, useLugar } from '@/store';
import { productosSample } from '@/util/data';
import { CategoriaProducto, Producto } from '@/util/definitions';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, SafeAreaView, Text, View, FlatList, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Asegúrate de tener @expo/vector-icons instalado

export default function ScreenProductos() {
  const router = useRouter(); // Obtén el hook de enrutamiento

  const { listaCategoriasProducto } = useCategoriasProducto();
  const { id_lugar } = useLugar();

  if (!listaCategoriasProducto) {
    return (<Text>Cargando</Text>);
  }

  const [categoria, setCategoria] = useState<CategoriaProducto>(listaCategoriasProducto[0]);
  const [productos, setProductos] = useState<Producto[]>(productosSample);

  const handlePressCategoria = async (item: CategoriaProducto) => {
    setCategoria(item);
  };

  const handlePress = (item: Producto) => {
    router.push(`/(tabs)/contenido/producto/${item.id_producto}`); // Asegúrate de que el tipo es compatible
  };

  const renderItem = ({ item }: { item: Producto }) => (
    <CardProducto producto={item} onPress={() => handlePress(item)} />
  );

  const renderCategoryItem = ({ item }: { item: CategoriaProducto }) => (
    <TouchableOpacity
      key={item.id_categoria_productos}
      onPress={() => handlePressCategoria(item)}
      style={styles.categoryItem}
    >
      <Image
        style={styles.categoryImage}
        source={{ uri: item.img }} // Usa la URL de la imagen
      />
      <Text>{item.nombre}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()} // Usa router.back para regresar
        >
          <MaterialIcons name="arrow-back" size={24} color="black" />
          <Text style={styles.backButtonText}>Regresa</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <FlatList
          data={listaCategoriasProducto}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id_categoria_productos.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
        />
      </ScrollView>

      <FlatList
        data={productos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_producto.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }} // Espacio entre columnas
        contentContainerStyle={{ paddingHorizontal: 8 }} // Padding horizontal
      />
    </SafeAreaView>
  );
}

export function CardProducto({ producto, onPress }: { producto: Producto; onPress: () => void }) {
  const handleAddCarrito = (item: Producto) => {
    // Implementar la lógica para añadir al carrito
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={onPress} style={styles.cardTouchable}>
        <Image
          style={styles.productImage}
          source={require('@/assets/images/logo.png')}
        />
        <Text style={styles.productName}>{producto.nombre_producto}</Text>
        <Text style={styles.productPrice}>{producto.precio_producto}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.addToCartButton}
        onPress={() => handleAddCarrito(producto)}
      >
        <Image
          source={require('@/assets/images/logo.png')} // Cambia esto a la imagen deseada para el botón
          style={styles.buttonImage}
        />
        <Text style={styles.buttonText}>Añadir Carrito</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 16,
    backgroundColor: 'white', // Fondo blanco para el header
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: 'black',
    marginLeft: 8,
  },
  scrollContainer: {
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    minHeight: 150,
    maxHeight: 150,
  },
  categoryItem: {
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  cardContainer: {
    flex: 1,
    padding: 8,
  },
  cardTouchable: {
    flex: 1,
    padding: 8,
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'gray',
  },
  productName: {
    marginLeft: 16,
    color: 'gray',
    fontWeight: 'bold',
  },
  productPrice: {
    marginLeft: 16,
    color: '#F37A20',
    fontWeight: 'bold',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F37A20',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonImage: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    marginRight: 10,
  },
});
