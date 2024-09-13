import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions, Image, ScrollView } from 'react-native';
import { useNavigation } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons'; // Importa los íconos de Expo

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar la visibilidad de la contraseña
  const navigation = useNavigation();

  const handleLogin = async () => {
    navigation.navigate('selectArea' as never);

    /*
    if (email && password) {
      try {
        const response = await fetch('https://api.deliverygoperu.com/login.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            usuario: email,
            clave: password,
          }),
        });

        const result = await response.json();

        console.log('API Response:', result); // Imprime la respuesta de la API en la consola

        if (response.ok) {
          if (result.status === 'success') {
            Alert.alert('Inicio de sesión exitoso', '¡Bienvenido de nuevo!');
            navigation.navigate('selectArea' as never);
          } else {
            Alert.alert('Error', result.mensaje || 'Error al iniciar sesión.');
          }
        } else {
          Alert.alert('Error', 'Respuesta no esperada del servidor.');
        }
      } catch (error) {
        console.error('Error al conectar con el servidor:', error); // Imprime el error en la consola
        Alert.alert('Error', 'No se pudo conectar con el servidor.');
      }
    } else {
      Alert.alert('Error', 'Por favor, ingrese su correo electrónico y contraseña.');
    }*/
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={24} color="#FA4A0C" />
        <Text style={styles.backButtonText}>Regresar</Text>
      </TouchableOpacity>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>INICIAR SESIÓN</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Correo Electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="#888"
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#888"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialIcons 
                name={showPassword ? 'visibility-off' : 'visibility'} 
                size={24} 
                color="#888" 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('register' as never)}>
            <Text style={styles.link}>¿No tienes una cuenta? Regístrate</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerWrapper: {
    width: width,
    height: height * 0.30,
    backgroundColor: 'rgba(46,39,34,1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    paddingVertical: '5%',
    overflow: 'hidden',
    marginBottom: 0, // Espacio entre el fondo y el logo
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: '8%',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  headerText: {
    fontFamily: 'sans-serif-condensed',
    fontSize: 32,
    color: '#230A00',
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: '6%',
    paddingVertical: '8%',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  input: {
    width: '100%',
    padding: '3%',
    marginVertical: '2%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    marginVertical: '2%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
  },
  button: {
    width: '100%',
    backgroundColor: '#FA4A0C',
    borderRadius: 30,
    paddingVertical: '3.5%',
    alignItems: 'center',
    marginVertical: '4%',
  },
  buttonText: {
    color: '#F6F6F9',
    fontFamily: 'Abel',
    fontSize: 22,
  },
  link: {
    color: '#FA4A0C',
    fontFamily: 'Abel',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: "5%",
    marginHorizontal: "6%",
  },
  backButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#FA4A0C",
  },
});
