import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCategoriasEstablecimiento, useLugar } from '@/store';
import { Establecimiento } from '@/util/definitions';

export default function Search() {
  const { id_lugar } = useLugar();
  const { listaCategoriasEstablecimiento } = useCategoriasEstablecimiento();

  const [searchQuery, setSearchQuery] = useState('');
  const [establecimientos, setEstablecimientos] = useState<Establecimiento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch all establishments on component mount
  
  useEffect(() => {
    const fetchAllEstablecimientos = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://api.deliverygoperu.com/establecimiento_categoria.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id_lugar }),
          
        });
        
  
        if (response.ok) {
          const data = await response.json();
          console.log('Establecimientos fetched on mount:', data);
          setEstablecimientos(data); // Establece los establecimientos
        } else {
          console.error('Error fetching all establishments:', response.status);
        }
      } catch (error) {
        console.error('Error fetching all establishments:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAllEstablecimientos();
  }, [id_lugar]);
  

  useEffect(() => {
    const fetchEstablecimientos = async () => {
      if (searchQuery.trim() === '') {
        setEstablecimientos([]); // Clear the list if the search query is empty
        return;
      }

      setLoading(true);
      setError(null);

      const categoriaId = listaCategoriasEstablecimiento && listaCategoriasEstablecimiento.length > 0 
        ? listaCategoriasEstablecimiento[0].id_categoria_establecimiento 
        : null;

      if (!categoriaId) {
        setError('No hay categorías disponibles.');
        setLoading(false);
        return;
      }

      try {
        const body = {
          token: "2342423423423",
          categoria: categoriaId,
          id_lugar,
          nombre: searchQuery
        };

        console.log('Fetching establishments with parameters:', body); // Log the parameters

        const response = await fetch('https://api.deliverygoperu.com/productos_buscar_lugar.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Response data:', data); // Log the response data
          if (data.length === 0) {
            setError('No se encontraron establecimientos.');
          } else {
            setEstablecimientos(data);
          }
        } else {
          console.error('Error in the request:', response.status);
          const errorText = await response.text(); // Get the response text
          console.error('Error details:', errorText); // Log error details
          setError('No se pudo obtener establecimientos.');
        }
      } catch (error) {
        console.error('Error while fetching data:', error);
        setError('Error de conexión.');
      } finally {
        setLoading(false);
      }
    };

    fetchEstablecimientos();
  }, [searchQuery, id_lugar, listaCategoriasEstablecimiento]);
  

  const renderEstablecimiento = ({ item }: { item: Establecimiento }) => (
    <View style={styles.establecimientoItem}>
      <Image source={{ uri: item.logo_establecimiento }} style={styles.establecimientoImage} />
      <Text>{item.nombre_establecimiento}</Text>
      <Text>{`Horario: ${item.horario_inicio} - ${item.horario_fin}`}</Text>
      <TouchableOpacity onPress={() => router.push(`/(tabs)/contenido/establecimiento/${item.id_establecimiento}`)}>
        <Text style={styles.establecimientoDetail}>Ver Detalles</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar establecimientos..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={establecimientos}
          renderItem={renderEstablecimiento}
          keyExtractor={(item) => item.id_establecimiento ? item.id_establecimiento.toString() : Math.random().toString()}
          contentContainerStyle={styles.establecimientoList}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 4,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  establecimientoList: {
    paddingBottom: 20,
  },
  establecimientoItem: {
    marginBottom: 16,
    alignItems: 'center',
  },
  establecimientoImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  establecimientoDetail: {
    color: '#F37A20',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
});
