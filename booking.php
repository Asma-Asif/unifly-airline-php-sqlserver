<?php
session_start();
require_once '../config/db.php';
require_once '../includes/helpers.php';
setCORS();
header('Content-Type: application/json');

$action = $_GET['action'] ?? '';
$conn   = getDB();

// ── REGISTER ──
if ($action === 'register' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $b = getBody();
    foreach (['first_name','last_name','email','phone','password'] as $f)
        if (empty($b[$f])) respond(false, "Field '$f' is required.", null, 400);

    $email = strtolower(clean($b['email']));
    $hash  = password_hash($b['password'], PASSWORD_BCRYPT);

    $chk = sqlsrv_query($conn,
        "SELECT passenger_id FROM Passengers WHERE email = ?", [$email]);
    if (sqlsrv_fetch_array($chk))
        respond(false, "Email already registered.", null, 409);

    $stmt = sqlsrv_query($conn,
        "INSERT INTO Passengers
         (first_name,last_name,email,phone,password_hash,nationality)
         VALUES (?,?,?,?,?,'Pakistani')",
        [clean($b['first_name']), clean($b['last_name']),
         $email, clean($b['phone']), $hash]);

    if (!$stmt) respond(false, "Registration failed.", null, 500);
    respond(true, "Registration successful! Welcome to Unifly.");
}

// ── LOGIN ──
if ($action === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $b     = getBody();
    $email = strtolower(clean($b['email'] ?? ''));
    $pass  = $b['password'] ?? '';

    if (!$email || !$pass)
        respond(false, "Email and password required.", null, 400);

    $stmt = sqlsrv_query($conn,
        "SELECT passenger_id,first_name,last_name,email,password_hash
         FROM Passengers WHERE email=? AND is_active=1", [$email]);
    $user = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);

    if (!$user || !password_verify($pass, $user['password_hash']))
        respond(false, "Invalid email or password.", null, 401);

    $_SESSION['passenger_id'] = $user['passenger_id'];
    $_SESSION['name']         = $user['first_name'].' '.$user['last_name'];

    respond(true, "Login successful!", [
        "passenger_id" => $user['passenger_id'],
        "name"         => $user['first_name'].' '.$user['last_name'],
        "email"        => $user['email']
    ]);
}

// ── LOGOUT ──
if ($action === 'logout') {
    session_destroy();
    respond(true, "Logged out successfully.");
}

// ── ME ──
if ($action === 'me') {
    $pid  = requireAuth();
    $stmt = sqlsrv_query($conn,
        "SELECT passenger_id,first_name,last_name,email,phone
         FROM Passengers WHERE passenger_id=?", [$pid]);
    $user = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);
    respond(true, "OK", $user);
}

// ── UPDATE PROFILE ──
if ($action === 'update' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $pid = requireAuth();
    $b   = getBody();

    $first_name = clean($b['first_name'] ?? '');
    $last_name  = clean($b['last_name']  ?? '');
    $phone      = clean($b['phone']      ?? '');
    $dob        = clean($b['dob']        ?? '');
    $passport   = clean($b['passport']   ?? '');

    if (!$first_name || !$last_name)
        respond(false, "First and last name are required.", null, 400);

    $stmt = sqlsrv_query($conn,
        "UPDATE Passengers
         SET first_name=?, last_name=?, phone=?,
             date_of_birth=?, passport_number=?
         WHERE passenger_id=?",
        [$first_name, $last_name, $phone,
         $dob ?: null, $passport ?: null, $pid]);

    if (!$stmt) respond(false, "Failed to update profile.", null, 500);
    respond(true, "Profile updated successfully.");
}

// ── CHANGE PASSWORD ──
if ($action === 'change_password' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $pid = requireAuth();
    $b   = getBody();

    $current = $b['current_password'] ?? '';
    $new     = $b['new_password']     ?? '';

    if (!$current || !$new)
        respond(false, "All fields are required.", null, 400);
    if (strlen($new) < 6)
        respond(false, "New password must be at least 6 characters.", null, 400);

    $stmt = sqlsrv_query($conn,
        "SELECT password_hash FROM Passengers WHERE passenger_id=?", [$pid]);
    $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);

    if (!$row || !password_verify($current, $row['password_hash']))
        respond(false, "Current password is incorrect.", null, 400);

    $new_hash = password_hash($new, PASSWORD_DEFAULT);
    sqlsrv_query($conn,
        "UPDATE Passengers SET password_hash=? WHERE passenger_id=?",
        [$new_hash, $pid]);

    respond(true, "Password changed successfully.");
}

// ── ADMIN LOGIN ──
if ($action === 'admin-login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $b     = getBody();
    $email = strtolower(clean($b['email'] ?? ''));
    $pass  = $b['password'] ?? '';

    $stmt = sqlsrv_query($conn,
        "SELECT staff_id,first_name,last_name,role,password_hash
         FROM Staff WHERE email=? AND is_active=1", [$email]);
    $staff = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);

    if (!$staff || !password_verify($pass, $staff['password_hash']))
        respond(false, "Invalid admin credentials.", null, 401);

    $_SESSION['staff_id']   = $staff['staff_id'];
    $_SESSION['staff_name'] = $staff['first_name'].' '.$staff['last_name'];
    $_SESSION['staff_role'] = $staff['role'];

    respond(true, "Admin login successful.", [
        "staff_id" => $staff['staff_id'],
        "name"     => $staff['first_name'].' '.$staff['last_name'],
        "role"     => $staff['role']
    ]);
}

respond(false, "Invalid action.", null, 400);
?>