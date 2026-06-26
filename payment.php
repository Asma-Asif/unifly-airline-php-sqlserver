<?php
require_once '../config/db.php';
require_once '../includes/helpers.php';
setCORS();
header('Content-Type: application/json');

$action = $_GET['action'] ?? '';
$conn   = getDB();

if ($action === 'history') {
    $pid  = requireAuth();
    $stmt = sqlsrv_query($conn,
        "SELECT points, transaction_type, description, created_at
         FROM LoyaltyPoints WHERE passenger_id = ? ORDER BY created_at DESC", [$pid]);
    $history = []; $earned = 0; $redeemed = 0;
    while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
        if ($row['created_at']) $row['created_at'] = $row['created_at']->format('Y-m-d H:i');
        if ($row['transaction_type'] === 'Earn') $earned += $row['points'];
        else $redeemed += $row['points'];
        $history[] = $row;
    }
    respond(true, "OK", ["history" => $history, "earned" => $earned, "redeemed" => $redeemed, "balance" => $earned - $redeemed]);
}

if ($action === 'total') {
    $pid  = requireAuth();
    $stmt = sqlsrv_query($conn,
        "SELECT SUM(CASE WHEN transaction_type='Earn' THEN points ELSE 0 END) AS earned,
                SUM(CASE WHEN transaction_type='Redeem' THEN points ELSE 0 END) AS redeemed
         FROM LoyaltyPoints WHERE passenger_id = ?", [$pid]);
    $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);
    $balance = ($row['earned'] ?? 0) - ($row['redeemed'] ?? 0);
    respond(true, "OK", ["total_points" => $balance]);
}

if ($action === 'redeem' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $pid = requireAuth();
    $b   = getBody();
    $reward = clean($b['reward'] ?? '');
    $cost   = (int)($b['cost']   ?? 0);
    if (!$reward || $cost <= 0) respond(false, "Invalid reward.", null, 400);
    $stmt = sqlsrv_query($conn,
        "SELECT SUM(CASE WHEN transaction_type='Earn' THEN points ELSE 0 END) -
                SUM(CASE WHEN transaction_type='Redeem' THEN points ELSE 0 END) AS balance
         FROM LoyaltyPoints WHERE passenger_id = ?", [$pid]);
    $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);
    $balance = $row['balance'] ?? 0;
    if ($balance < $cost) respond(false, "Insufficient miles.", null, 400);
    $descriptions = [
        'baggage_10kg' => 'Redeemed: Extra Baggage 10kg',
        'seat_upgrade' => 'Redeemed: Business Class Upgrade',
        'premium_meal' => 'Redeemed: Premium Meal',
        'free_flight'  => 'Redeemed: Free Domestic Flight'
    ];
    sqlsrv_query($conn,
        "INSERT INTO LoyaltyPoints (passenger_id, points, transaction_type, description)
         VALUES (?, ?, 'Redeem', ?)",
        [$pid, $cost, $descriptions[$reward] ?? 'Reward Redeemed']);
    respond(true, "Reward redeemed!", ["new_balance" => $balance - $cost]);
}

respond(false, "Invalid action.", null, 400);
?>