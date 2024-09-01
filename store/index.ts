import { CategoriaEstablecimiento, CategoriaProducto, CategoriasEstablecimiento, CategoriasProducto, LocationStore } from "@/util/definitions";
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
