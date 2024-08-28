import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, Alert, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
  const [username, setUsername] = useState<string>(''); // specify string type
  const [email, setEmail] = useState<string>(''); // specify string type
  const [password, setPassword] = useState<string>(''); // specify string type
  const [gender, setGender] = useState<string>(''); // specify string type
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined); // specify Date type or undefined
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false); // specify boolean type
  const [dni, setDni] = useState<string>(''); // specify string type
  const [phone, setPhone] = useState<string>(''); // specify string type
  const navigation = useNavigation();

  const handleRegister = () => {
    if (username && email && password && gender && dateOfBirth && dni && phone) {
      Alert.alert('Registro exitoso', `Bienvenido, ${username}!`);
      navigation.navigate('login' as never);
    } else {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
    }
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(false);
    if (currentDate) {
      setDateOfBirth(currentDate);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>¡Crea tu cuenta!</Text>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nombres"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#888"
        />
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
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            {dateOfBirth ? dateOfBirth.toDateString() : 'Selecciona tu fecha de nacimiento'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dateOfBirth || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="DNI"
          value={dni}
          onChangeText={setDni}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>Género</Text>
        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[
              styles.genderButton,
              gender === 'male' && styles.genderButtonSelected,
            ]}
            onPress={() => setGender('male')}
          >
            <Text style={styles.genderText}>Masculino</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.genderButton,
              gender === 'female' && styles.genderButtonSelected,
            ]}
            onPress={() => setGender('female')}
          >
            <Text style={styles.genderText}>Femenino</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.genderButton,
              gender === 'other' && styles.genderButtonSelected,
            ]}
            onPress={() => setGender('other')}
          >
            <Text style={styles.genderText}>Otro</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Regístrate</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('login' as never)}>
          <Text style={styles.link}>¿Ya tienes una cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerWrapper: {
    width: width,
    height: height * 0.15, // Reducir altura del fondo
    backgroundColor: 'rgba(46,39,34,1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: '5%',
  },
  logo: {
    width: width * 0.5, // Reducir el ancho del logo
    height: height * 0.10, // Reducir la altura del logo
    resizeMode: 'contain',
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: '8%',
  },
  headerText: {
    fontFamily: 'sans-serif-condensed',
    fontSize: 32,
    color: '#230A00',
    fontWeight: 'bold',
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: '6%',
    paddingVertical: '8%',
    alignItems: 'center',
    backgroundColor: 'transparent', // Hacer el fondo transparente
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
  dateText: {
    color: '#888',
    fontSize: 16,
    lineHeight: 40,
  },
  label: {
    width: '100%',
    fontSize: 18,
    color: '#888',
    marginBottom: '2%',
    textAlign: 'left',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: '6%',
  },
  genderButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: '3%',
    marginHorizontal: '2%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f5f5f5',
  },
  genderButtonSelected: {
    backgroundColor: '#FA4A0C',
    borderColor: '#FA4A0C',
  },
  genderText: {
    color: '#333',
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
