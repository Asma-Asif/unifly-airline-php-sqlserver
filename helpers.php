<?php
function getDB() {
    $serverName = "localhost\SQLEXPRESS";
    $database   = "UniflyAirline";
    
    $connectionInfo = array(
        "Database" => $database,
        "TrustServerCertificate" => true
    );
    
    $conn = sqlsrv_connect($serverName, $connectionInfo);
    
    if (!$conn) {
        header('Content-Type: application/json');
        echo json_encode([
            "success" => false,
            "message" => "Database connection failed."
        ]);
        exit;
    }
    
    return $conn;
}
?>