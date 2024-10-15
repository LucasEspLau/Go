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
import { Link, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { establecimientos, productosSample } from "@/util/data";
import {
  useCategoriasEstablecimiento,
  useCategoriasProducto,
  useEstablecimientosXProductos,
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
  const [hasPermission, setHasPermission] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);


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

      <View
        className="h-[8vh] mb-2"
        >
        <TouchableOpacity
          onPress={() => {
            console.log("Navegando a Search...");
            navigation.navigate("Search" as never); // Asegúrate de que el nombre de la pantalla sea correcto
          }}
          style={{
            backgroundColor: "#E7E8EA",
            borderRadius: 30,
            flex: 1,
          }}
        >
          <TextInput
            placeholder="Buscar productos o ubicación"
            editable={false} // No editable para que actúe solo como un botón

            style={{
              backgroundColor: "transparent", // Hacer el fondo transparente
              borderRadius: 30,
              padding: 10,
              flex: 1,
            }}
          />
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
         
          <IconCat
            img={require("@/assets/images/logo.png")}
            name="Establecimientos"
            disabled={loading}
          />
          <IconCat
            img={require("@/assets/images/logo.png")}
            name="Productos"
            disabled={loading}
          />
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
    <View className="border border-1 ">
      <Link
        href={`/contenido/${name}` as any}
        disabled={disabled}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        className="border border-1 rounded-lg"
      >
        <View className="border border-1 w-full flex justify-center items-center">
          <Image
            className="border border-2 w-[10vh] h-[10vh] p-4"
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
  );
}
