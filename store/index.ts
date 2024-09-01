import { LocationStore } from "@/util/definitions";
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