export type Establecimiento = {
    id_establecimiento: number;
    nombre_establecimiento: string;
    logo_establecimiento: string;
    descripcion_establecimiento: string;
    horario_inicio: string;
    horario_fin: string;
    tiempo_preparacion: string;
    estado: number;
    categoria: number;
}
export type CategoriaEstablecimiento ={
    id_categoria_establecimiento: number;
    nombre: string;
    img: string;
    estado: number;
}