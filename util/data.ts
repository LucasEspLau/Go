import { Establecimiento } from "./definitions";

export const establecimientos: Establecimiento[] = [
    {
        id_establecimiento: 1,
        nombre_establecimiento: "Nombre del Establecimiento 1",
        logo_establecimiento: "logo1.png",
        descripcion_establecimiento: "Descripción del Establecimiento 1",
        horario_inicio: "08:00:00",
        horario_fin: "22:00:00",
        tiempo_preparacion: "15",
        estado: 1,
        categoria: 1
    },
    {
        id_establecimiento: 2,
        nombre_establecimiento: "Nombre del Establecimiento 2",
        logo_establecimiento: "logo2.png",
        descripcion_establecimiento: "Descripción del Establecimiento 2",
        horario_inicio: "09:00:00",
        horario_fin: "23:00:00",
        tiempo_preparacion: "20",
        estado: 1,
        categoria: 1
    },
    {
        id_establecimiento: 3,
        nombre_establecimiento: "Nombre del Establecimiento 3",
        logo_establecimiento: "logo3.png",
        descripcion_establecimiento: "Descripción del Establecimiento 3",
        horario_inicio: "10:00:00",
        horario_fin: "21:00:00",
        tiempo_preparacion: "25",
        estado: 1,
        categoria: 1
    },
    {
        id_establecimiento: 4,
        nombre_establecimiento: "Nombre del Establecimiento 4",
        logo_establecimiento: "logo4.png",
        descripcion_establecimiento: "Descripción del Establecimiento 4",
        horario_inicio: "07:00:00",
        horario_fin: "20:00:00",
        tiempo_preparacion: "30",
        estado: 1,
        categoria: 1
    },
    {
        id_establecimiento: 5,
        nombre_establecimiento: "Nombre del Establecimiento 5",
        logo_establecimiento: "logo5.png",
        descripcion_establecimiento: "Descripción del Establecimiento 5",
        horario_inicio: "11:00:00",
        horario_fin: "22:00:00",
        tiempo_preparacion: "10",
        estado: 1,
        categoria: 1
    }
];

export const categoria_establecimiento =[
    {
        id_categoria_establecimiento: 1,
        nombre: "Comida Rápida",
        img:"img1.png",
        estado:1
    }
]