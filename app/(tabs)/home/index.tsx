import {
  Image,
  StyleSheet,
  Platform,
  View,
  Text,
  TextInput,
  ImageProps,
  ImageBackground,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import { Link, router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { establecimientos, productosSample } from "@/util/data";
import {
  useCategoriasEstablecimiento,
  useCategoriasProducto,
  useEstablecimientosXProductos,
  useKilometraje,
  useLocationStore,
  useLugar,
  useMetodosPago,
  usePromocion,
} from "@/store";
import {
  CategoriaEstablecimiento,
  CategoriaProducto,
  EstablecimientoXProducto,
  MetodoPago,
  PrecioDelivery,
  PrecioKm,
  Producto,
} from "@/util/definitions";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(true);
  const [anuncio, setAnuncio] = useState<Producto>();
  const { setUserLocation } = useLocationStore();
  const { setCategoriasEstablecimiento } = useCategoriasEstablecimiento();
  const { setCategoriasProducto } = useCategoriasProducto();
  const { setEstablecimientosXProductos } = useEstablecimientosXProductos();
  const { listaPromociones,setPromocion } = usePromocion();
  const { setMetodosPago } = useMetodosPago();
  const { id_lugar } = useLugar();
  const {setPrecioDelivery,setPrecioKm}=useKilometraje();
  const [hasPermission, setHasPermission] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleNavigation = () => {
    console.log("Navegando a Search...");
    router.push("/(tabs)/contenido/Search");
  };

  useEffect(() => {
    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermission(false);
        return;
      }
/*
      let location = await Location.getCurrentPositionAsync();
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude!,
        longitude: location.coords?.longitude!,
      });
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: `${address[0].name}, ${address[0].region}`,
      });*/
    };
    requestLocation();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.deliverygoperu.com/categorias_establecimiento.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: "2342423423423",
            }),
          }
        );
        const result = await response.json();
        const listaCategoriasEstablecimiento =
          result as CategoriaEstablecimiento[];
        setCategoriasEstablecimiento({ listaCategoriasEstablecimiento });
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      try {
        const response = await fetch(
          "https://api.deliverygoperu.com/categorias_productos.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: "2342423423423",
            }),
          }
        );
        const result = await response.json();
        const listaCategoriasProducto = result as CategoriaProducto[];
        setCategoriasProducto({ listaCategoriasProducto });
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      try {
        const response = await fetch(
          "https://api.deliverygoperu.com/establecimiento_productos.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: "2342423423423",
              id_lugar: id_lugar,
            }),
          }
        );
        const result = await response.json();
        const listaEstablecimientosXProducto =
          result as EstablecimientoXProducto[];
        setEstablecimientosXProductos({ listaEstablecimientosXProducto });
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      try {
        const response = await fetch(
          "https://api.deliverygoperu.com/anuncios.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: "2342423423423",
            }),
          }
        );
        const result = await response.json();
        setAnuncio(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } 

      try {
        const response = await fetch(
          "https://api.deliverygoperu.com/metodo_pago.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: "2342423423423",
            }),
          }
        );
        const result = await response.json();
        const metodosPago=result as MetodoPago[]
        setMetodosPago({metodosPago});
      } catch (error) {
        console.error("Error fetching data:", error);
      } 
      
      try {
        const response = await fetch(
          "https://api.deliverygoperu.com/productos_promocion.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: "2342423423423",
              id_lugar:id_lugar
            }),
          }
        );
        const result = await response.json();
        const listaPromociones =result as Producto[];
        setPromocion({listaPromociones});
      } catch (error) {
        console.error("Error fetching data:", error);
      } 
      
      try {
        const response = await fetch(
          "https://api.deliverygoperu.com/precio_delivery.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: "2342423423423",
              id_lugar:id_lugar
            }),
          }
        );
        const result = await response.json();
        const precioDelivery =result as PrecioDelivery;
        setPrecioDelivery({precioDelivery});
      } catch (error) {
        console.error("Error fetching data:", error);
      } 
      try {
        const response = await fetch(
          "https://api.deliverygoperu.com/precio_km.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: "2342423423423",
              id_lugar:id_lugar
            }),
          }
        );
        const result = await response.json();
        const precioKm =result as PrecioKm;
        setPrecioKm({precioKm});
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleNext = () => {
    if (listaPromociones && listaPromociones.length > 0) {
      // Si estás en el último elemento, vuelve al primero
      if (currentIndex === listaPromociones.length - 1) {
        setCurrentIndex(0);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  const handlePrev = () => {
    if (listaPromociones && listaPromociones.length > 0) {
      // Si estás en el primer elemento, salta al último
      if (currentIndex === 0) {
        setCurrentIndex(listaPromociones.length - 1);
      } else {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row min-h-[8vh] items-center justify-between">
        <Text className="ml-4 text-[6vh] font-moon">Inicio</Text>
        <Image
          className="w-[10vh] h-[10vh] mr-4"
          source={require("@/assets/images/logo.png")}
        />
      </View>

     
      <View >
      <TouchableOpacity
        onPress={handleNavigation}
        activeOpacity={0.7}
        style={{
          
          backgroundColor: "#E7E8EA",
          borderRadius: 30,
          marginTop: 20,
          marginBottom:20,
          paddingVertical: 15,  // Aumenta el padding vertical
          paddingHorizontal: 20, // Espaciado horizontal dentro del botón
          width: '80%',         // Ocupa todo el ancho disponible
          maxWidth: 400,        // Establece un ancho máximo para que no se expanda demasiado
          alignSelf: 'center',  // Centra el botón horizontalmente
        }}
      >
        <Text
          style={{
            color: "#000",
            fontSize: 15,
            textAlign: 'left',
            
          }}
        >
          Busca tus productos favoritos
        </Text>
      </TouchableOpacity>
    </View>

    <View className="flex flex-col border border-1">
  <Text
    className="ml-4 text-[2vh] font-moon"
    style={{ fontWeight: "100" }}
  >
    Categorías
  </Text>
  <View className="flex flex-row border border-1 justify-around">
  <View className="flex flex-col border border-1 justify-center items-center mt-3 mb-3 w-[150px] h-[120px]">
    <IconCat
      img={require("@/assets/images/agenciaa.png")}
      name="Establecimientos"
      disabled={loading}
    />
  </View>
  <View className="flex flex-col border border-1 justify-center items-center mt-3 mb-3 w-[150px] h-[120px]">
    <IconCat
      img={require("@/assets/images/hamburguesa.png")}
      name="Productos"
      disabled={loading}
    />
  </View>
</View>


</View>





      {
        !listaPromociones || listaPromociones.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <View className="flex-1 bg-white">
            <View className="flex flex-row items-center justify-center mt-4">
              {/* Botón de retroceder */}
              <TouchableOpacity
                onPress={handlePrev}
                style={{
                  backgroundColor: "#E7E8EA",
                  padding: 10,
                  paddingVertical:20,
                  borderRadius: 30,
                  marginLeft: 20,
                  marginRight: -20,
                  zIndex:20
                }}
              >
                <Text style={{ fontSize: 20 }}>{"<"}</Text>
              </TouchableOpacity>

              {/* Mostrar la promoción actual */}
              <IconPromo 
                anuncio={listaPromociones[currentIndex]} 
              />

              {/* Botón de avanzar */}
              <TouchableOpacity
                onPress={handleNext}
                style={{
                  backgroundColor: "#E7E8EA",
                  padding: 10,
                  paddingVertical:20,
                  borderRadius: 30,
                  marginLeft: -20,
                  marginRight: 20,
                  zIndex:20
                }}
              >
                <Text style={{ fontSize: 20 }}>{">"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      }



      {/*
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {listaPromociones?.map((promo: Producto, index: number) => (
          <IconPromo key={index} anuncio={promo} />
        ))}
      </ScrollView>   
      */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center">
          <View className="bg-white rounded-lg p-4 w-[90%] h-[60%]">
            {anuncio ? (
              // Mostrar el contenido del anuncio si está disponible
              <>
                <IconPromo anuncio={anuncio} />
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{ marginTop: 10 }}
                >
                  <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                    Cerrar
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              // Contenedor que centra el ActivityIndicator
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            )}
          </View>
        </View>
      </Modal>



      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

export function IconCat({
  img,
  name,
  disabled,
}: {
  img: ImageProps;
  name: string;
  disabled: boolean;
}) {
  return (
    <View className="">
  <Link
    href={`/contenido/${name}` as any}
    disabled={disabled}
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
    className="rounded-lg"
  >
    <View className="w-full flex justify-center items-center">
      <Image
        className="w-[10vh] h-[10vh] p-4"
        source={img}
      />
      <Text className="mt-2 text-center">{name}</Text>
    </View>
  </Link>
</View>
  );
}

export function IconPromo({ anuncio }: { anuncio: Producto }) {
  const productoAnuncio = productosSample[0];
  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
    <View className="p-4 z-10 h-[50vh] rounded-lg flex justify-center items-center">
      <ImageBackground
        className="w-[40vh] h-[40vh] border border-1 rounded-lg flex flex-col justify-between"
        source={{ uri: anuncio.img_producto }}
        resizeMode="cover"
      >
        <Text className="mt-4 ml-4 text-white font-bold bg-black w-[20vh] rounded-full p-2">
          PROMOCIÓN DEL DÍA
        </Text>
        <View className="mr-2 ml-2 bg-white">
          <Text className="mt-2 mb-2 text-black font-moon">
            {anuncio.nombre_producto}
          </Text>
          <Text className="text-black font-moon">
            PRECIO: S/.{anuncio.precio_producto}
          </Text>
        </View>
      </ImageBackground>
    </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  formContainer: {
    paddingHorizontal: 20,
  },
});