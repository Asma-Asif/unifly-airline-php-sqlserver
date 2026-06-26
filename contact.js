<?php
function setCORS() {
    header('Access-Control-Allow-Origin: http://localhost');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);
}

function respond($success, $message, $data = null, $code = 200) {
    http_response_code($code);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data'    => $data
    ]);
    exit;
}

function getBody() {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}

function clean($val) {
    return htmlspecialchars(strip_tags(trim($val)));
}

function requireAuth() {
    session_start();
    if (!isset($_SESSION['passenger_id']))
        respond(false, "Please login first.", null, 401);
    return $_SESSION['passenger_id'];
}

function requireAdminAuth() {
    session_start();
    if (!isset($_SESSION['staff_id']))
        respond(false, "Admin access required.", null, 401);
    return $_SESSION['staff_id'];
}

function generateRef() {
    return 'UF-' . strtoupper(substr(md5(uniqid()), 0, 6));
}
?>