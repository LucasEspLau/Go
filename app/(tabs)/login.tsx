import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // No es necesario utilizar `as never` aquí, pero si se requiere:

  const handleLogin = () => {
    // Aquí podrías agregar la lógica de autenticación, como validación y llamada a una API.
    if (email && password) {
      Alert.alert('Inicio de sesión exitoso', `Bienvenido de nuevo!`);
      // Redirigir a otra pantalla después del inicio de sesión exitoso
      navigation.navigate('home' as never);
    } else {
      Alert.alert('Error', 'Por favor, ingrese su correo electrónico y contraseña.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Iniciar Sesión" onPress={handleLogin} />
      <Text style={styles.registerText} onPress={() => navigation.navigate('register' as never)}>
        ¿No tienes una cuenta? Regístrate
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  registerText: {
    marginTop: 16,
    color: '#1e90ff',
    textDecorationLine: 'underline',
  },
});
