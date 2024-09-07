export type Establecimiento = {
    id_establecimiento: number;
    nombre_establecimiento: string;
    logo_establecimiento: string;
    descripcion_establecimiento: string;
    horario_inicio: string;
    horario_fin: string;
    tiempo_preparacion: number;
    estado: number;
    categoria: number;
    latitud:number;
    longitud:number;
    area?:number;
}

export type CategoriaEstablecimiento ={
    id_categoria_establecimiento: number;
    nombre: string;
    img: string;
    estado: number;
}

export type CategoriaProducto ={
    id_categoria_productos: number;
    nombre: string;
    img: string;
    estado: number;
}

export declare interface LocationStore {
    userLatitude: number | null;
    userLongitude: number | null;
    userAddress: string | null;
    destinationLatitude: number | null;
    destinationLongitude: number | null;
    destinationAddress: string | null;
    setUserLocation: ({
                          latitude,
                          longitude,
                          address,
                      }: {
        latitude: number;
        longitude: number;
        address: string;
    }) => void;
    setDestinationLocation: ({
                                 latitude,
                                 longitude,
                                 address,
                             }: {
        latitude: number;
        longitude: number;
        address: string;
    }) => void;
}


export declare interface CategoriasEstablecimiento {
    listaCategoriasEstablecimiento: CategoriaEstablecimiento[] | null;

    setCategoriasEstablecimiento: ({
        listaCategoriasEstablecimiento,
    }: {
        listaCategoriasEstablecimiento: CategoriaEstablecimiento[];
    }) => void;

}

export declare interface CategoriasProducto {
    listaCategoriasProducto: CategoriaProducto[] | null;

    setCategoriasProducto: ({
        listaCategoriasProducto,
    }: {
        listaCategoriasProducto: CategoriaProducto[];
    }) => void;

}

export declare interface EstablecimientosXArea{
    listaEstablecimientos: Establecimiento[]|null;
    setEstablecimientosXArea: ({
        listaEstablecimientos,
    }: {
        listaEstablecimientos: Establecimiento[];
    }) => void;
}