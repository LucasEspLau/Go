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
    lugar:number;
}

export type Producto ={
    id_producto: number;
    nombre_producto: string;
    precio_producto: number;
    descripcion_producto: string;
    img_producto: string;
    id_establecimiento: number;
    id_promocion: number;
    categoria: number;
    estado: number;
    estado_establecimiento: number;
    id_lugar: number;
}

export type EstablecimientoXProducto={
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
    lugar:number;
    productos: Producto[];
}

export type DetalleCarrito={
    producto:Producto;
    cantidad: number;
    comentario: string;
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
export type MetodoPago={
    id_pago: number;
    metodo_pago:string;
    porcentaje: number;
}
export type PrecioDelivery ={
    id: number,
    lugar: number,
    precio: number,
    km:number,
    maximo_km:number,
    estado:number
}

export type PrecioKm={
    id: number,
    lugar: number,
    precio_km:number,
    estado: number
}
export type CarritoKilometraje={
    costo_delivery:number | null;
    distancia_verificada:boolean | null;
    setCostoDelivery:({
        costo_delivery
    }:{
        costo_delivery:number;
    })=>void;
    setDistanciaVerificada:({
        distancia_verificada
    }:{
        distancia_verificada: boolean;
    })=>void;
}
export type Kilometraje={
    precioDelivery:PrecioDelivery | null;
    precioKm:PrecioKm | null;
    setPrecioDelivery:({
        precioDelivery,
    }:{
        precioDelivery: PrecioDelivery;
    })=> void;
    setPrecioKm:({
        precioKm,
    }:{
        precioKm: PrecioKm;
    })=> void;
}

export declare type MetodosPago={
    metodosPago: MetodoPago[]|null;
    setMetodosPago: ({
        metodosPago,
    }:{
        metodosPago: MetodoPago[];
    })=> void;
}

export declare type Promocion ={
    listaPromociones: Producto[]|null;
    setPromocion: ({
        listaPromociones,
    }:{
        listaPromociones: Producto[];
    })=> void;
}

export declare type Lugar ={
    id_lugar: number|null;
    nombre: string|null;
    img: string|null;
    estado:number|null;
    setLugar:({
        id_lugar,
        nombre,
        img,
        estado,
    }:{
        id_lugar:number;
        nombre: string;
        img:string;
        estado: number;
    })=> void;
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
export declare interface EstablecimientosXProductos{
    listaEstablecimientosXProducto: EstablecimientoXProducto[]|null;
    setEstablecimientosXProductos: ({
        listaEstablecimientosXProducto,
    }: {
        listaEstablecimientosXProducto: EstablecimientoXProducto[];
    }) => void;
}

export declare interface Carrito {
    id_establecimiento: number | null;
    listaProductos: DetalleCarrito[] | null;

    setCarrito: ({
        listaProductos,
    }: {
        listaProductos: DetalleCarrito[];
    }) => void;
    setEstablecimiento:({
        id_establecimiento,
    }: {
        id_establecimiento: number;
    }) => void;
}
