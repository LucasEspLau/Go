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
        const body = {
          token: "2342423423423",
          id_lugar,
        };

        const response = await fetch('https://api.deliverygoperu.com/establecimiento_productos.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Establecimientos fetched on mount:', data);
          setEstablecimientos(data); // Set establishments
        } else {
          console.error('Error fetching all establishments:', response.status);
          setError('Error al cargar los establecimientos. Intente de nuevo más tarde.');
        }
      } catch (error) {
        console.error('Error fetching all establishments:', error);
        setError('Error de conexión. Verifique su internet.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllEstablecimientos();
  }, [id_lugar]);

  const fetchEstablecimientos = async () => {
    if (searchQuery.trim() === '') {
      // If the search is empty, return the original establishments
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const body = {
        token: "2342423423423",
        buscar: searchQuery, // Use 'buscar' instead of 'nombre'
        id_lugar,
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
          setEstablecimientos([]); // Clear the list if no results found
        } else {
          setEstablecimientos(data);
        }
      } else {
        console.error('Error in the request:', response.status);
        const errorText = await response.text(); // Get the response text
        console.error('Error details:', errorText); // Log error details
        setError('No se pudo obtener establecimientos. Intente de nuevo.');
      }
    } catch (error) {
      console.error('Error while fetching data:', error);
      setError('Error de conexión. Verifique su internet.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchEstablecimientos();
  };

  const renderEstablecimiento = ({ item }: { item: Establecimiento }) => (
    <View style={styles.establecimientoItem}>
      <Image source={{ uri: item.logo_establecimiento }} style={styles.establecimientoImage} />
      <Text>{item.nombre_establecimiento}</Text>
      <Text>{`Horario: ${item.horario_inicio || 'No disponible'} - ${item.horario_fin || 'No disponible'}`}</Text>
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
      <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
        <Text style={styles.searchButtonText}>Buscar</Text>
      </TouchableOpacity>
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
          ListEmptyComponent={<Text style={styles.emptyListText}>No hay resultados para "{searchQuery}"</Text>} // Empty state message
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
  searchButton: {
    backgroundColor: '#007BFF', // Change this to your desired color
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  emptyListText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },
});
