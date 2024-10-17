import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCategoriasEstablecimiento, useLugar } from '@/store';
import { Establecimiento } from '@/util/definitions';
import { router } from 'expo-router';

export default function Search() {
  const { id_lugar } = useLugar();
  const { listaCategoriasEstablecimiento } = useCategoriasEstablecimiento();

  const [searchQuery, setSearchQuery] = useState('');
  const [establecimientos, setEstablecimientos] = useState<Establecimiento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          setEstablecimientos(data);
        } else {
          setError('Error al cargar los establecimientos.');
        }
      } catch (error) {
        setError('Error de conexión. Verifique su internet.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllEstablecimientos();
  }, [id_lugar]);

  const fetchEstablecimientos = async () => {
    if (searchQuery.trim() === '') return;

    setLoading(true);
    setError(null);

    try {
      const body = {
        token: "2342423423423",
        buscar: searchQuery,
        id_lugar,
      };

      const response = await fetch('https://api.deliverygoperu.com/productos_buscar_lugar.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        setEstablecimientos(data.length > 0 ? data : []);
      } else {
        setError('No se pudo obtener establecimientos.');
      }
    } catch (error) {
      setError('Error de conexión. Verifique su internet.');
    } finally {
      setLoading(false);
    }
  };

  const renderEstablecimiento = ({ item }: { item: Establecimiento }) => (
    <View style={styles.establecimientoItem}>
      <Image source={{ uri: item.logo_establecimiento }} style={styles.establecimientoImage} />
      <View style={styles.establecimientoInfo}>
        <Text style={styles.nombreEstablecimiento}>{item.nombre_establecimiento}</Text>
        <Text style={styles.horarioEstablecimiento}>
          {`Horario: ${item.horario_inicio || 'No disponible'} - ${item.horario_fin || 'No disponible'}`}
        </Text>
        <TouchableOpacity onPress={() => router.push(`/(tabs)/contenido/establecimiento/${item.id_establecimiento}`)}>
          <Text style={styles.establecimientoDetail}>Ver Detalles</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Barra de búsqueda con ícono de lupa */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar establecimientos..."
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            fetchEstablecimientos();
          }}
        />
      </View>

      {/* Muestra título "TUS RESULTADOS" si hay resultados */}
      {establecimientos.length > 0 && (
        <Text style={styles.resultadosTitle}>TUS RESULTADOS</Text>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#F37A20" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={establecimientos}
          renderItem={renderEstablecimiento}
          keyExtractor={(item) => item.id_establecimiento ? item.id_establecimiento.toString() : Math.random().toString()}
          contentContainerStyle={styles.establecimientoList}
          ListEmptyComponent={<Text style={styles.emptyListText}>No hay resultados para "{searchQuery}"</Text>}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
  },
  resultadosTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left', // Alinea a la izquierda
    marginLeft: 4, // Ajusta la distancia desde el borde izquierdo
    color: '#333',
  },
  establecimientoList: {
    paddingBottom: 20,
  },
  establecimientoItem: {
    flexDirection: 'row', // Alinea imagen y texto en fila
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center', // Centra verticalmente
  },
  establecimientoImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12, // Espacio entre la imagen y el texto
  },
  establecimientoInfo: {
    flex: 1, // Toma el espacio restante para el texto
  },
  nombreEstablecimiento: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  horarioEstablecimiento: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
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
