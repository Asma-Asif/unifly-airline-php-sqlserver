<?php
require_once '../config/db.php';
require_once '../includes/helpers.php';
setCORS();
header('Content-Type: application/json');

$action = $_GET['action'] ?? '';
$conn   = getDB();

if ($action === 'dashboard') {
    requireAdminAuth();
    $today = date('Y-m-d');
    $r1 = sqlsrv_query($conn, "SELECT COUNT(*) AS c FROM Flights WHERE CAST(departure_time AS DATE) = ?", [$today]);
    $r2 = sqlsrv_query($conn, "SELECT COUNT(*) AS c FROM Bookings WHERE status = 'Confirmed'");
    $r3 = sqlsrv_query($conn, "SELECT COUNT(*) AS c FROM Passengers WHERE is_active = 1");
    $r4 = sqlsrv_query($conn, "SELECT COUNT(*) AS c FROM Complaints WHERE status = 'Open'");
    $r5 = sqlsrv_query($conn, "SELECT SUM(amount) AS total FROM Payments WHERE MONTH(paid_at) = MONTH(GETDATE()) AND YEAR(paid_at) = YEAR(GETDATE()) AND status = 'Completed'");
    respond(true, "OK", [
        "flights_today"      => sqlsrv_fetch_array($r1, SQLSRV_FETCH_ASSOC)['c'] ?? 0,
        "active_bookings"    => sqlsrv_fetch_array($r2, SQLSRV_FETCH_ASSOC)['c'] ?? 0,
        "total_passengers"   => sqlsrv_fetch_array($r3, SQLSRV_FETCH_ASSOC)['c'] ?? 0,
        "open_complaints"    => sqlsrv_fetch_array($r4, SQLSRV_FETCH_ASSOC)['c'] ?? 0,
        "revenue_this_month" => sqlsrv_fetch_array($r5, SQLSRV_FETCH_ASSOC)['total'] ?? 0
    ]);
}

if ($action === 'flights') {
    requireAdminAuth();
    $stmt = sqlsrv_query($conn,
        "SELECT f.flight_id, f.flight_number, f.status, f.departure_time, f.arrival_time,
                f.available_economy, f.available_business,
                a1.airport_code AS from_code, a1.city AS from_city,
                a2.airport_code AS to_code, a2.city AS to_city
         FROM Flights f
         JOIN Airports a1 ON f.origin_id = a1.airport_id
         JOIN Airports a2 ON f.destination_id = a2.airport_id
         ORDER BY f.departure_time DESC");
    $flights = [];
    while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
        if ($row['departure_time']) $row['departure_time'] = $row['departure_time']->format('Y-m-d H:i');
        if ($row['arrival_time'])   $row['arrival_time']   = $row['arrival_time']->format('Y-m-d H:i');
        $flights[] = $row;
    }
    respond(true, "OK", ["flights" => $flights]);
}

if ($action === 'bookings') {
    requireAdminAuth();
    $stmt = sqlsrv_query($conn,
        "SELECT b.booking_reference, b.class, b.total_price, b.status, b.seat_number,
                f.flight_number,
                p.first_name + ' ' + p.last_name AS passenger,
                a1.city AS from_city, a2.city AS to_city
         FROM Bookings b
         JOIN Flights f ON b.flight_id = f.flight_id
         JOIN Passengers p ON b.passenger_id = p.passenger_id
         JOIN Airports a1 ON f.origin_id = a1.airport_id
         JOIN Airports a2 ON f.destination_id = a2.airport_id
         ORDER BY b.booked_at DESC");
    $list = [];
    while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) $list[] = $row;
    respond(true, "OK", ["bookings" => $list]);
}

if ($action === 'passengers') {
    requireAdminAuth();
    $stmt = sqlsrv_query($conn,
        "SELECT p.passenger_id, p.first_name, p.last_name, p.email, p.phone, p.is_active,
                p.nationality, p.created_at,
                COUNT(b.booking_id) AS total_bookings
         FROM Passengers p
         LEFT JOIN Bookings b ON p.passenger_id = b.passenger_id
         GROUP BY p.passenger_id, p.first_name, p.last_name, p.email, p.phone, p.is_active, p.nationality, p.created_at
         ORDER BY p.created_at DESC");
    $list = [];
    while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
        if ($row['created_at']) $row['created_at'] = $row['created_at']->format('Y-m-d');
        $list[] = $row;
    }
    respond(true, "OK", ["passengers" => $list]);
}

if ($action === 'complaints') {
    requireAdminAuth();
    $stmt = sqlsrv_query($conn,
        "SELECT c.ticket_number, c.category, c.subject, c.status, c.submitted_at,
                p.first_name + ' ' + p.last_name AS passenger
         FROM Complaints c
         JOIN Passengers p ON c.passenger_id = p.passenger_id
         ORDER BY c.submitted_at DESC");
    $list = [];
    while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
        if ($row['submitted_at']) $row['submitted_at'] = $row['submitted_at']->format('Y-m-d H:i');
        $list[] = $row;
    }
    respond(true, "OK", ["complaints" => $list]);
}

if ($action === 'add_flight' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    requireAdminAuth();
    $b = getBody();
    $stmt = sqlsrv_query($conn,
        "INSERT INTO Flights (flight_number, aircraft_id, origin_id, destination_id,
          departure_time, arrival_time, economy_price, business_price,
          available_economy, available_business, status)
         VALUES (?,?,?,?,?,?,?,?,100,20,'Scheduled')",
        [clean($b['flight_number']), (int)$b['aircraft_id'], (int)$b['origin_id'],
         (int)$b['destination_id'], clean($b['departure_time']), clean($b['arrival_time']),
         (int)$b['economy_price'], (int)$b['business_price']]);
    if (!$stmt) respond(false, "Failed to add flight.", null, 500);
    respond(true, "Flight added successfully!");
}

if ($action === 'update_flight_status' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    requireAdminAuth();
    $b = getBody();
    sqlsrv_query($conn, "UPDATE Flights SET status=? WHERE flight_id=?",
        [clean($b['status']), (int)$b['flight_id']]);
    respond(true, "Flight status updated.");
}

if ($action === 'toggle_passenger' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    requireAdminAuth();
    $b = getBody();
    $is_active = $b['is_active'] ? 1 : 0;
    sqlsrv_query($conn, "UPDATE Passengers SET is_active=? WHERE passenger_id=?",
        [$is_active, (int)$b['passenger_id']]);
    respond(true, "Passenger " . ($is_active ? "activated" : "deactivated") . ".");
}

if ($action === 'resolve_complaint' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    requireAdminAuth();
    $b = getBody();
    sqlsrv_query($conn,
        "UPDATE Complaints SET status='Resolved', resolved_at=GETDATE() WHERE ticket_number=?",
        [strtoupper(clean($b['ticket_number']))]);
    respond(true, "Complaint resolved.");
}

respond(false, "Invalid action.", null, 400);
?>