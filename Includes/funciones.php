<?php

function obtenerServicios(): array
{
    try {

        //Importar una conexion
        require 'database.php';

        // var_dump($db);

        //Escribir el codigo SQL
        $sql = 'select * from servicios';
        $consulta = mysqli_query($db, $sql);

        // echo "<pre>";
        // var_dump(mysqli_fetch_assoc($consulta)); //Esta es una funcion para que los resultados los convierta en un arreglo y se puedan leer
        // echo "</pre>";

        //Creando arreglo vacio
        $servicios = [];
        $i = 0;

        //Obtener los resultados
        while ($row = mysqli_fetch_assoc($consulta)) {
            // $nombre = $row['nombre'];
            // utf8_encode($nombre);

            $servicios[$i]['id'] = $row['id'];
            $servicios[$i]['nombre'] = $row['nombre'];
            $servicios[$i]['precio'] = $row['precio'];

            $i++;
            // echo "<pre>";
            // var_dump($row);
            // echo "</pre>";
        }
        return $servicios;
        echo "<pre>";
        var_dump(($servicios));
        echo "</pre>";
    } catch (\Throwable $th) {
        var_dump($th);
    }
}

obtenerServicios();