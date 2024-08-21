import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from 'expo-router';

export default function IndexScreen() {
  const navigation = useNavigation();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("main" as never);
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Go</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FA8148',
  },
  text: {
    fontSize: 24,
    color: 'white',
    fontFamily: 'MoonGet'
  },
});
