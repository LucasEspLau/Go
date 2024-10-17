import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions, Image, ScrollView } from 'react-native';
import { useNavigation } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const navigation = useNavigation();

  useEffect(() => {
    // Verifica si ya hay un usuario autenticado al cargar la pantalla
    const checkSession = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        navigation.navigate('selectArea' as never); // Si ya hay usuario, navegar a la siguiente pantalla
      }
    };

    checkSession();
  }, []);

  const handleLogin = async () => {
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
        console.log('API Response:', result);

        if (response.ok) {
          if (result.status === 'success') {
            // Guarda el usuario en AsyncStorage
            await AsyncStorage.setItem('user', JSON.stringify({ email })); // Guarda el email o el identificador del usuario
            Alert.alert('Inicio de sesión exitoso', '¡Bienvenido de nuevo!');
            navigation.navigate('selectArea' as never);
          } else if (result.status === 'not_registered') {
            Alert.alert('Error', 'Usuario no registrado. Por favor, regístrate.');
          } else {
            Alert.alert('Error', result.mensaje || 'Error al iniciar sesión.');
          }
        } else {
          Alert.alert('Error', 'Respuesta no esperada del servidor.');
        }
      } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        Alert.alert('Error', 'No se pudo conectar con el servidor.');
      }
    } else {
      Alert.alert('Error', 'Por favor, ingrese su correo electrónico y contraseña.');
    }
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
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Correo Electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor="#888"
            />
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
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
    borderRadius: 8,
    marginVertical: '2%',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: '6%',
    paddingVertical: '8%',
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    fontSize: 16,
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: '2%',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
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
