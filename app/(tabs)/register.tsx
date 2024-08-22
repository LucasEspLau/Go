import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, Alert, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

// Obtener las dimensiones de la pantalla
const { width } = Dimensions.get('window');

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [dni, setDni] = useState('');
  const [phone, setPhone] = useState('');
  const navigation = useNavigation();

  const handleRegister = () => {
    if (username && email && password && gender && dateOfBirth && dni && phone) {
      Alert.alert('Registro exitoso', `Bienvenido, ${username}!`);
      navigation.navigate('login' as never); // Adjust the route name as needed
    } else {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Registro</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nombres"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Correo Electrónico"
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
        <TextInput
          style={styles.input}
          placeholder="Fecha de Nacimiento"
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
        />
        <TextInput
          style={styles.input}
          placeholder="DNI"
          value={dni}
          onChangeText={setDni}
        />
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <Picker
          selectedValue={gender}
          style={styles.picker}
          onValueChange={(itemValue) => setGender(itemValue)}
        >
          <Picker.Item label="Selecciona tu género" value="" />
          <Picker.Item label="Masculino" value="male" />
          <Picker.Item label="Femenino" value="female" />
          <Picker.Item label="Otro" value="other" />
        </Picker>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Regístrate</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('login' as never)}>
          <Text style={styles.link}>¿Ya tienes una cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  headerWrapper: {
    width: width * 1.1, // Usa un porcentaje del ancho de la pantalla
    height: width * 0.45, // Ajusta la altura con base en el ancho para mantener una proporción más pequeña
    backgroundColor: 'rgba(46,39,34,1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    marginBottom: 24,
  },
  logo: {
    width: 200, // Aumenta el ancho del logo
    height: 140, // Disminuye la altura del logo para hacerlo más pequeño
  },
  headerContainer: {
    width: width * 1.0,
    height: 70,
    alignItems: 'center',
    marginBottom: 30,
    borderRadius: 50,
  },
  headerText: {
    fontFamily: 'sans-serif',
    fontSize: 40,
    color: '#230A00',
  },
  formContainer: {
    width: '100%',
    maxWidth: 350,
    borderRadius: 30,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 40,
    elevation: 5,
    marginTop: -40, // Mueve el formulario más arriba
    marginBottom: 40, // Asegura que no se superponga con el logo
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
  picker: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 8,
  },
  button: {
    width: '100%',
    backgroundColor: '#FA4A0C',
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 16,
  },
  buttonText: {
    color: '#F6F6F9',
    fontFamily: 'Abel',
    fontSize: 24,
  },
  link: {
    color: '#FA4A0C',
    fontFamily: 'Abel',
    fontSize: 17,
    textDecorationLine: 'underline',
  },
});
