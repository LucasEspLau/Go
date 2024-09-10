import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, Alert, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons'; // Para el ícono de mostrar/ocultar contraseña

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
  const [passwordError, setPasswordError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false); // Estado para mostrar/ocultar contraseña

  const navigation = useNavigation();

  const validatePassword = (password: string): boolean => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasDigit &&
      hasSpecialChar
    );
  };

  const handleRegister = async () => {
    setPhoneError('');
    setDniError('');
    setEmailError('');
    setPasswordError('');
  
    if (!firstName || !lastName || !email || !password || !gender || !dateOfBirth || !dni || !phone) {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
      return;
    }
  
    if (phone.length !== 9) {
      setPhoneError('El teléfono debe tener 9 dígitos.');
      return;
    }
  
    if (dni.length !== 8) {
      setDniError('El DNI debe tener 8 dígitos.');
      return;
    }
  
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setEmailError('Ingrese un correo electrónico válido (ejemplo@dominio.com).');
      return;
    }
  
    if (!validatePassword(password)) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial.');
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
  
      console.log('Datos enviados:', formData);
  
      const response = await fetch('https://api.deliverygoperu.com/registro_usuario.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        console.log('Respuesta de la API:', result);
  
        if (response.ok) {
          const message = result.mensaje || '';
          const codeMatch = message.match(/codigo\s*=\s*(\d+)/);
          if (codeMatch) {
            const code = codeMatch[1];
            Alert.alert('Código de Verificación', `El código de verificación es: ${code}`);
          }
  
          const verificationResponse = await fetch('https://api.deliverygoperu.com/enviar_codigo_sms.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ telf: phone }),
          });
  
          if (verificationResponse.ok) {
            console.log('Navegando a la pantalla de verificación');
            navigation.navigate('verification' as never);
          }
        } else {
          Alert.alert('Error', result.mensaje || 'Hubo un problema al registrar.');
        }
      } else {
        const text = await response.text();
        console.log('Respuesta en bruto:', text);
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
            setEmailError(''); 
          }}
          keyboardType="email-address"
          placeholderTextColor="#888"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        {/* Campo de Contraseña */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Contraseña"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError('');
            }}
            secureTextEntry={!showPassword} 
            placeholderTextColor="#888"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color="gray"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

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
            setDniError('');
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
            setPhoneError('');
          }}
          keyboardType="phone-pad"
          placeholderTextColor="#888"
        />
        {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[styles.genderButton, gender === 'male' && styles.selectedGenderButton]}
            onPress={() => setGender('male')}
          >
            <Text style={styles.genderText}>Masculino</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.genderButton, gender === 'female' && styles.selectedGenderButton]}
            onPress={() => setGender('female')}
          >
            <Text style={styles.genderText}>Femenino</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.genderButton, gender === 'other' && styles.selectedGenderButton]}
            onPress={() => setGender('other')}
          >
            <Text style={styles.genderText}>Otro</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Registrarse</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  headerWrapper: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  headerContainer: {
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  formContainer: {
    paddingHorizontal: 16,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  dateText: {
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  genderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedGenderButton: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  genderText: {
    fontSize: 16,
    color: '#333',
  },
  registerButton: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 8,
  },
});