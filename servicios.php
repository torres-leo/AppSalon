<?php

require 'Includes/funciones.php';

$servicios = obtenerServicios();

echo json_encode($servicios);