import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ImageBackground } from 'react-native';
import { useNavigation } from 'expo-router';

export default function MainScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleRegister = () => {

    Alert.alert('Registro exitoso', `Bienvenido, ${username}!`);
    navigation.navigate('register' as never);

  };

  return (
    <ImageBackground 
      source={require('../../assets/images/mainbg.png')}
    style={styles.container}
    resizeMode='stretch'
    >
      <Text style={styles.customFontText}>
        Welcome to Home Screen
      </Text>
      <Button title='Ir Registro' onPress={handleRegister}></Button>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  customFontText: {
    fontFamily: 'MoonGet', // Nombre de la fuente personalizada
    fontSize: 24,
    color: '#333',
  },
});