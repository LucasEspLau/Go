import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, Alert, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState<string>(''); 
  const [lastName, setLastName] = useState<string>(''); 
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>(''); 
  const [gender, setGender] = useState<string>(''); 
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined); 
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false); 
  const [dni, setDni] = useState<string>(''); 
  const [phone, setPhone] = useState<string>(''); 

  const [phoneError, setPhoneError] = useState<string>('');
  const [dniError, setDniError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');

  const navigation = useNavigation();

  const handleRegister = async () => {
    // Resetear errores
    setPhoneError('');
    setDniError('');
    setEmailError('');
  
    // Validaciones
    if (!firstName || !lastName || !email || !password || !gender || !dateOfBirth || !dni || !phone) {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
      return;
    }
  
    // Validar teléfono
    if (phone.length !== 9) {
      setPhoneError('El teléfono debe tener 9 dígitos.');
      return;
    }
  
    // Validar DNI
    if (dni.length !== 8) {
      setDniError('El DNI debe tener 8 dígitos.');
      return;
    }
  
    // Validar correo electrónico
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setEmailError('Ingrese un correo electrónico válido (ejemplo@dominio.com).');
      return;
    }
  
    try {
      const genderMap: { [key: string]: string } = {
        male: '1',
        female: '2',
        other: '3',
      };
  
      const formData = {
        token: '2342423423423', 
        cliente: `${firstName} ${lastName}`,
        clave: password,
        sexo: genderMap[gender] || '',
        correo: email,
        fecha_nacimiento: dateOfBirth?.toISOString().split('T')[0] || '',
        telf: phone,
        dni: dni,
      };
  
      console.log('Enviando solicitud de registro con datos:', formData);
  
      // Enviar solicitud de registro
      const response = await fetch('https://api.deliverygoperu.com/registro_usuario.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      console.log('Respuesta del servidor:', response);
  
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        console.log('Resultado del registro:', result);
  
        if (response.ok) {
          // Mostrar el código de verificación en una alerta
          const message = result.mensaje || '';
          const codeMatch = message.match(/codigo\s*=\s*(\d+)/);
          if (codeMatch) {
            const code = codeMatch[1];
            Alert.alert('Código de Verificación', `El código de verificación es: ${code}`);
          }
  
          // Enviar código de verificación por SMS
          const verificationResponse = await fetch('https://api.deliverygoperu.com/enviar_codigo_sms.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ telf: phone }), 
          });
  
          if (verificationResponse.ok) {
            navigation.navigate('verification' as never); 
          } 
        } else {
          Alert.alert('Error', result.mensaje || 'Hubo un problema al registrar.');
        }
      } else {
        const text = await response.text();
        Alert.alert('Error', `Respuesta inesperada del servidor: ${text}`);
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      Alert.alert('Error', 'No se pudo conectar al servidor.');
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
          value={firstName}
          onChangeText={setFirstName}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Apellidos"
          value={lastName}
          onChangeText={setLastName}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Correo Electrónico"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError(''); // Limpiar el error al escribir
          }}
          keyboardType="email-address"
          placeholderTextColor="#888"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
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
          onChangeText={(text) => {
            setDni(text);
            setDniError(''); // Limpiar el error al escribir
          }}
          placeholderTextColor="#888"
        />
        {dniError ? <Text style={styles.errorText}>{dniError}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          value={phone}
          onChangeText={(text) => {
            setPhone(text);
            setPhoneError(''); // Limpiar el error al escribir
          }}
          keyboardType="phone-pad"
          placeholderTextColor="#888"
        />
        {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

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
    padding: 20,
  },
  headerWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 50,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  dateText: {
    lineHeight: 50,
    color: '#333',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  genderButton: {
    flex: 1,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  genderButtonSelected: {
    backgroundColor: '#007BFF',
  },
  genderText: {
    color: '#333',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#007BFF',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
