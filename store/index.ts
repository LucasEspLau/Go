import { Carrito, CarritoKilometraje, CategoriaEstablecimiento, CategoriaProducto, CategoriasEstablecimiento, CategoriasProducto, DetalleCarrito, Establecimiento, EstablecimientosXArea, EstablecimientosXProductos, EstablecimientoXProducto, Kilometraje, LocationStore, Lugar, MetodoPago, MetodosPago, PrecioDelivery, PrecioKm, Producto, Promocion } from "@/util/definitions";
import { create } from "zustand";

export const useLocationStore = create<LocationStore>((set) => ({
    userAddress: null,
    userLongitude: null,
    userLatitude: null, // Añadir esta propiedad
    destinationLongitude: null, // Corrección de "destinationLogintude"
    destinationLatitude: null,
    destinationAddress: null,
    
    setUserLocation: ({
        latitude, longitude, address
    }: {
        latitude: number;
        longitude: number;
        address: string;
    }) => {
        set(() => ({
            userLatitude: latitude,
            userLongitude: longitude,
            userAddress: address,
        }));
    },

    setDestinationLocation: ({
        latitude, longitude, address
    }: {
        latitude: number;
        longitude: number;
        address: string;
    }) => {
        set(() => ({
            destinationLatitude: latitude,
            destinationLongitude: longitude,
            destinationAddress: address,
        }));
    },
}));

export const useCategoriasEstablecimiento=create<CategoriasEstablecimiento>((set)=>({
    listaCategoriasEstablecimiento:null,
    setCategoriasEstablecimiento: ({
        listaCategoriasEstablecimiento,

    }: {
        listaCategoriasEstablecimiento: CategoriaEstablecimiento[];

    }) => {
        set(() => ({
            listaCategoriasEstablecimiento: listaCategoriasEstablecimiento,
        }));
    }
}))

export const useCategoriasProducto=create<CategoriasProducto>((set)=>({
    listaCategoriasProducto:null,
    setCategoriasProducto: ({
        listaCategoriasProducto,

    }: {
        listaCategoriasProducto: CategoriaProducto[];

    }) => {
        set(() => ({
            listaCategoriasProducto: listaCategoriasProducto,
        }));
    }
}))

export const useEstablecimientosXArea = create<EstablecimientosXArea>((set)=>({
    listaEstablecimientos:null,
    setEstablecimientosXArea:({
        listaEstablecimientos,
    }:{
        listaEstablecimientos: Establecimiento[];
    })=>{
        set(()=>({
            listaEstablecimientos: listaEstablecimientos,
        }));
    }
}))

export const useEstablecimientosXProductos = create<EstablecimientosXProductos>((set)=>({
    listaEstablecimientosXProducto:null,
    setEstablecimientosXProductos:({
        listaEstablecimientosXProducto,
    }:{
        listaEstablecimientosXProducto: EstablecimientoXProducto[];
    })=>{
        set(()=>({
            listaEstablecimientosXProducto: listaEstablecimientosXProducto,
        }));
    }
}))

export const usePromocion=create<Promocion>((set)=>({
    listaPromociones: null,
    setPromocion:({
        listaPromociones
    }:{
        listaPromociones: Producto[]
    })=>{
        set(()=>({
            listaPromociones: listaPromociones,
        }));
    }
}))

export const useLugar=create<Lugar>((set)=>({
    id_lugar: null,
    nombre: null,
    img: null,
    estado:null,
    setLugar:({
        id_lugar,
        nombre,
        img,
        estado
    }:{
        id_lugar:number;
        nombre: string;
        img: string;
        estado: number;
    })=>{
        set(()=>({
            id_lugar: id_lugar,
            nombre: nombre,
            img: img,
            estado: estado,
        }));
    }
}))

export const useCarrito=create<Carrito>((set)=>({
    id_establecimiento: null,
    listaProductos:null,
    setCarrito:({
        listaProductos,
    }:{
        listaProductos: DetalleCarrito[];
    })=>{
        set(()=>({
            listaProductos: listaProductos,
        }));
    },
    setEstablecimiento:({
        id_establecimiento,
    }:{
        id_establecimiento: number;
    })=>{
        set(()=>({
            id_establecimiento: id_establecimiento,
        }));
    }
}))

export const useMetodosPago=create<MetodosPago>((set)=>({
    metodosPago:null,
    setMetodosPago:({
        metodosPago,
    }:{
        metodosPago: MetodoPago[];
    })=>{
        set(()=>({
            metodosPago: metodosPago,
        }));
    }
}))

export const useKilometraje=create<Kilometraje>((set)=>({
    precioDelivery: null,
    precioKm: null,
    setPrecioDelivery: ({
        precioDelivery,
    }:{
        precioDelivery: PrecioDelivery;
    })=>{
        set(()=>({
            precioDelivery: precioDelivery,
        }));
    },
    setPrecioKm: ({
        precioKm,
    }:{
        precioKm: PrecioKm;
    })=>{
        set(()=>({
            precioKm: precioKm,
        }));
    }
}))

export const useCarritoKilometraje=create<CarritoKilometraje>((set)=>({
    costo_delivery: null,
    distancia_verificada: null,
    setCostoDelivery: ({
        costo_delivery,
    }:{
        costo_delivery: number;
    })=>{
        set(()=>({
            costo_delivery: costo_delivery,
        }));
    },
    setDistanciaVerificada: ({
        distancia_verificada,
    }:{
        distancia_verificada: boolean;
    })=>{
        set(()=>({
            distancia_verificada: distancia_verificada,
        }));
    }
}))