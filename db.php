<?php
require_once '../config/db.php';
require_once '../includes/helpers.php';
setCORS();
header('Content-Type: application/json');

$action = $_GET['action'] ?? '';
$conn   = getDB();

if ($action === 'pay' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $pid = requireAuth();
    $b   = getBody();

    $booking_ref    = strtoupper(clean($b['booking_ref']    ?? ''));
    $seat           = clean($b['seat']           ?? '');
    $amount         = floatval($b['amount']      ?? 0);
    $payment_method = clean($b['payment_method'] ?? 'card');

    if (!$booking_ref) respond(false, "Booking reference required.", null, 400);
    if ($amount <= 0)  respond(false, "Invalid payment amount.", null, 400);

    $stmt = sqlsrv_query($conn,
        "SELECT booking_id, passenger_id, status
         FROM Bookings WHERE booking_reference = ?", [$booking_ref]);
    $booking = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);

    if (!$booking) respond(false, "Booking not found.", null, 404);
    if ($booking['passenger_id'] != $pid) respond(false, "Unauthorized.", null, 403);
    if ($booking['status'] === 'Cancelled') respond(false, "Booking is cancelled.", null, 400);

    $booking_id = $booking['booking_id'];

    $chk = sqlsrv_query($conn,
        "SELECT payment_id FROM Payments
         WHERE booking_id = ? AND status = 'Completed'", [$booking_id]);
    if (sqlsrv_fetch_array($chk, SQLSRV_FETCH_ASSOC))
        respond(false, "This booking has already been paid.", null, 400);

    $transaction_id = 'TXN-' . strtoupper(substr(md5(uniqid()), 0, 10));

    $ins = sqlsrv_query($conn,
        "INSERT INTO Payments
         (booking_id, amount, method, transaction_id, status)
         VALUES (?, ?, ?, ?, 'Completed')",
        [$booking_id, $amount, $payment_method, $transaction_id]);

    if (!$ins) {
        $errors = sqlsrv_errors();
        $msg = $errors ? $errors[0]['message'] : 'Payment insert failed.';
        respond(false, $msg, null, 500);
    }

    if ($seat) {
        sqlsrv_query($conn,
            "UPDATE Bookings SET seat_number = ? WHERE booking_id = ?",
            [$seat, $booking_id]);
    }

    $gate = 'G' . rand(1, 20);
    sqlsrv_query($conn,
        "INSERT INTO BoardingPasses
         (booking_id, seat_number, gate, boarding_time, status)
         SELECT ?, ?, ?,
             DATEADD(minute, -45, f.departure_time), 'Issued'
         FROM Flights f
         JOIN Bookings b ON f.flight_id = b.flight_id
         WHERE b.booking_id = ?",
        [$booking_id, $seat, $gate, $booking_id]);

    respond(true, "Payment successful!", [
        "transaction_id" => $transaction_id,
        "amount_paid"    => $amount,
        "booking_ref"    => $booking_ref
    ]);
}

if ($action === 'gate') {
    $ref = strtoupper(clean($_GET['ref'] ?? ''));
    if (!$ref) respond(false, "Booking reference required.", null, 400);

    $stmt = sqlsrv_query($conn,
        "SELECT bp.gate
         FROM BoardingPasses bp
         JOIN Bookings b ON bp.booking_id = b.booking_id
         WHERE b.booking_reference = ?", [$ref]);

    $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);
    if (!$row) respond(false, "Boarding pass not found.", null, 404);
    respond(true, "OK", ["gate" => $row['gate']]);
}

respond(false, "Invalid action.", null, 400);
?>