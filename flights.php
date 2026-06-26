<?php
require_once '../config/db.php';
require_once '../includes/helpers.php';
setCORS();
header('Content-Type: application/json');

$action = $_GET['action'] ?? '';
$conn   = getDB();

if ($action === 'submit' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $pid = requireAuth();
    $b   = getBody();
    $category    = clean($b['category']    ?? 'Other');
    $subject     = clean($b['subject']     ?? '');
    $description = clean($b['description'] ?? '');
    if (!$subject || !$description) respond(false, "Subject and description required.", null, 400);
    $ticket = 'TKT-' . strtoupper(substr(md5(uniqid()), 0, 8));
    $stmt = sqlsrv_query($conn,
        "INSERT INTO Complaints (passenger_id, category, subject, description, ticket_number, status)
         VALUES (?, ?, ?, ?, ?, 'Open')",
        [$pid, $category, $subject, $description, $ticket]);
    if (!$stmt) respond(false, "Failed to submit complaint.", null, 500);
    respond(true, "Complaint submitted!", ["ticket_number" => $ticket]);
}

if ($action === 'my') {
    $pid  = requireAuth();
    $stmt = sqlsrv_query($conn,
        "SELECT ticket_number, category, subject, status, submitted_at
         FROM Complaints WHERE passenger_id = ? ORDER BY submitted_at DESC", [$pid]);
    $list = [];
    while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
        if ($row['submitted_at']) $row['submitted_at'] = $row['submitted_at']->format('Y-m-d H:i');
        $list[] = $row;
    }
    respond(true, "OK", ["complaints" => $list]);
}

if ($action === 'track') {
    $ticket = strtoupper(clean($_GET['ticket'] ?? ''));
    if (!$ticket) respond(false, "Ticket number required.", null, 400);
    $stmt = sqlsrv_query($conn,
        "SELECT ticket_number, category, subject, description, status, submitted_at
         FROM Complaints WHERE ticket_number = ?", [$ticket]);
    $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);
    if (!$row) respond(false, "Ticket not found.", null, 404);
    if ($row['submitted_at']) $row['submitted_at'] = $row['submitted_at']->format('Y-m-d H:i');
    respond(true, "OK", $row);
}

respond(false, "Invalid action.", null, 400);
?>