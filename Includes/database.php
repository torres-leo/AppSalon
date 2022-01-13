<?php

$db = mysqli_connect('localhost', 'root', 'root', 'appsalon');
$db->query("SET NAMES 'utf8'");
$db->set_charset("utf8");
// mysqli_set_charset($db, 'utf8');

if(!$db) {
    echo "Error en la cuenta";
}
//     else {
//     echo "Conexion Correcta";
// }