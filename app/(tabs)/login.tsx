import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions, Image, ScrollView } from 'react-native';
import { useNavigation } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    if (email && password) {
      Alert.alert('Inicio de sesión exitoso', `Bienvenido de nuevo!`);
      navigation.navigate('home' as never);
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
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#888"
          />

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
    marginBottom: 80, // Espacio entre el fondo y el logo
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
});




