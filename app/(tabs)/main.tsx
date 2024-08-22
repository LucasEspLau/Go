import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function MainScreen() {
  const router = useRouter();

  const handleRegister = () => {
    router.push('/register'); // Navega a la pantalla de registro
  };

  const handleLogin = () => {
    router.push('/login'); // Navega a la pantalla de inicio de sesión
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../../assets/images/mainbg.jpg')}
        style={styles.backgroundImage}
      >
        <Text style={styles.mainText}>
          Todo lo que necesitas, a un toque de distancia.
        </Text>
        <Text style={styles.subText}>
          ¡REGÍSTRATE HOY!
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Regístrate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Inicia Sesión</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(245, 245, 245, 1)',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: {
    width: 309,
    color: 'white',
    fontFamily: 'Inter',
    fontWeight: '800',
    fontSize: 48,
    textAlign: 'left',
    position: 'absolute',
    top: 78,
    left: 17,
  },
  subText: {
    width: 282,
    color: 'white',
    fontFamily: 'Inter',
    fontWeight: '800',
    fontSize: 20,
    textAlign: 'left',
    position: 'absolute',
    top: 328,
    left: 20,
  },
  buttonContainer: {
    position: 'absolute',
    top: 480, // Ajusta esta posición para mover los botones más arriba
    left: 0, // Centra horizontalmente al utilizar alignItems: 'center'
    right: 0, // Centra horizontalmente al utilizar alignItems: 'center'
    alignItems: 'center', // Centra los botones en el eje horizontal
  },
  registerButton: {
    width: 303,
    height: 63,
    backgroundColor: 'rgba(255, 127, 66, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 30,
  },
  registerButtonText: {
    color: 'white',
    fontFamily: 'Inter',
    fontWeight: '800',
    fontSize: 20,
  },
  loginButton: {
    width: 303,
    height: 63,
    backgroundColor: 'rgba(23, 21, 21, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  loginButtonText: {
    color: 'white',
    fontFamily: 'Inter',
    fontWeight: '800',
    fontSize: 20,
  },
});
