import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function VerificationScreen() {
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [codeError, setCodeError] = useState<string>('');
  const navigation = useNavigation();

  const handleVerify = async () => {
    // Limpiar errores
    setCodeError('');

    // Validaciones
    if (!verificationCode) {
      setCodeError('Por favor, ingrese el código de verificación.');
      return;
    }

    try {
      const response = await fetch('https://api.deliverygoperu.com/validar_codigo_de_usuario.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codigo: verificationCode }), // Enviar el código ingresado
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Verificación exitosa', 'Tu cuenta ha sido verificada con éxito.');
        navigation.navigate('login' as never); // Navegar a la pantalla de inicio de sesión
      } else {
        Alert.alert('Error', result.mensaje || 'Código de verificación inválido.');
      }
    } catch (error) {
      console.error('Error al verificar:', error);
      Alert.alert('Error', 'No se pudo conectar al servidor.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Ingrese el Código de Verificación</Text>
      <TextInput
        style={styles.input}
        placeholder="Código de Verificación"
        value={verificationCode}
        onChangeText={setVerificationCode}
        keyboardType="numeric"
        placeholderTextColor="#888"
      />
      {codeError ? <Text style={styles.errorText}>{codeError}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verificar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#230A00',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginVertical: '1%',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
});
