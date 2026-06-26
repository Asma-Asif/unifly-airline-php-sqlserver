<?php
require_once '../config/db.php';
require_once '../includes/helpers.php';
setCORS();
header('Content-Type: application/json');

$action = $_GET['action'] ?? '';
$conn   = getDB();

// ── SEARCH FLIGHTS ──
if ($action === 'search') {
    $from  = strtoupper(clean($_GET['from']  ?? ''));
    $to    = strtoupper(clean($_GET['to']    ?? ''));
    $date  = clean($_GET['date']   ?? '');
    $class = clean($_GET['class']  ?? 'Economy');

    if (!$from || !$to || !$date)
        respond(false, "from, to and date are required.", null, 400);

    $priceCol = $class === 'Business' ? 'f.business_price' : 'f.economy_price';
    $seatsCol = $class === 'Business' ? 'f.available_business' : 'f.available_economy';

    $stmt = sqlsrv_query($conn,
        "SELECT
            f.flight_id, f.flight_number,
            f.departure_time, f.arrival_time,
            f.status, $priceCol AS price,
            $seatsCol AS available_seats,
            ac.model AS aircraft_model,
            orig.airport_code AS from_code,
            orig.city AS from_city,
            dest.airport_code AS to_code,
            dest.city AS to_city,
            DATEDIFF(MINUTE, f.departure_time, f.arrival_time) AS duration_mins
         FROM Flights f
         JOIN Airports orig ON f.origin_id      = orig.airport_id
         JOIN Airports dest ON f.destination_id = dest.airport_id
         JOIN Aircraft ac   ON f.aircraft_id    = ac.aircraft_id
         WHERE orig.airport_code = ?
           AND dest.airport_code = ?
           AND CAST(f.departure_time AS DATE) = ?
           AND f.status NOT IN ('Cancelled','Completed')
         ORDER BY f.departure_time",
        [$from, $to, $date]);

    if (!$stmt) respond(false, "Search failed.", null, 500);

    $flights = [];
    while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
        if ($row['departure_time'])
            $row['departure_time'] = $row['departure_time']->format('Y-m-d H:i');
        if ($row['arrival_time'])
            $row['arrival_time'] = $row['arrival_time']->format('Y-m-d H:i');
        $h = intdiv($row['duration_mins'], 60);
        $m = $row['duration_mins'] % 60;
        $row['duration'] = "{$h}h {$m}m";
        $flights[] = $row;
    }
    respond(true, count($flights)." flight(s) found.", ["flights" => $flights]);
}

// ── FLIGHT DETAIL ──
if ($action === 'detail') {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) respond(false, "Flight ID required.", null, 400);

    $stmt = sqlsrv_query($conn,
        "SELECT
            f.flight_id, f.flight_number,
            f.departure_time, f.arrival_time,
            f.economy_price, f.business_price,
            f.available_economy, f.available_business,
            f.status,
            orig.airport_code AS from_code, orig.city AS from_city,
            dest.airport_code AS to_code,   dest.city AS to_city,
            ac.model
         FROM Flights f
         JOIN Airports orig ON f.origin_id      = orig.airport_id
         JOIN Airports dest ON f.destination_id = dest.airport_id
         JOIN Aircraft ac   ON f.aircraft_id    = ac.aircraft_id
         WHERE f.flight_id = ?", [$id]);

    $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);
    if (!$row) respond(false, "Flight not found.", null, 404);

    if ($row['departure_time'])
        $row['departure_time'] = $row['departure_time']->format('Y-m-d H:i');
    if ($row['arrival_time'])
        $row['arrival_time'] = $row['arrival_time']->format('Y-m-d H:i');

    respond(true, "OK", $row);
}

// ── ALL AIRPORTS ──
if ($action === 'airports') {
    $stmt = sqlsrv_query($conn,
        "SELECT airport_code, airport_name, city, country
         FROM Airports WHERE is_active=1
         ORDER BY country, city");
    $airports = [];
    while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC))
        $airports[] = $row;
    respond(true, "OK", $airports);
}

// ── FLIGHT STATUS ──
if ($action === 'status') {
    $flight_number = strtoupper(clean($_GET['flight_number'] ?? ''));
    $from          = strtoupper(clean($_GET['from']          ?? ''));
    $to            = strtoupper(clean($_GET['to']            ?? ''));
    $date          = clean($_GET['date'] ?? '');

    $where  = "WHERE 1=1";
    $params = [];

    if ($flight_number) { $where .= " AND f.flight_number = ?"; $params[] = $flight_number; }
    if ($from)          { $where .= " AND a1.airport_code = ?"; $params[] = $from; }
    if ($to)            { $where .= " AND a2.airport_code = ?"; $params[] = $to; }
    if ($date)          { $where .= " AND CAST(f.departure_time AS DATE) = ?"; $params[] = $date; }

    $stmt = sqlsrv_query($conn,
        "SELECT f.flight_id, f.flight_number, f.status,
                f.departure_time, f.arrival_time,
                f.economy_price, f.business_price,
                f.available_economy, f.available_business,
                a1.airport_code AS from_code, a1.city AS from_city,
                a2.airport_code AS to_code,   a2.city AS to_city,
                ac.model AS aircraft_model
         FROM Flights f
         JOIN Airports a1 ON f.origin_id      = a1.airport_id
         JOIN Airports a2 ON f.destination_id = a2.airport_id
         JOIN Aircraft ac ON f.aircraft_id    = ac.aircraft_id
         $where
         ORDER BY f.departure_time ASC",
        $params ?: null);

    $flights = [];
    while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
        if ($row['departure_time'])
            $row['departure_time'] = $row['departure_time']->format('Y-m-d H:i');
        if ($row['arrival_time'])
            $row['arrival_time'] = $row['arrival_time']->format('Y-m-d H:i');
        if ($row['departure_time'] && $row['arrival_time']) {
            $dep  = new DateTime($row['departure_time']);
            $arr  = new DateTime($row['arrival_time']);
            $diff = $dep->diff($arr);
            $row['duration'] = $diff->h . 'h ' . $diff->i . 'm';
        }
        $flights[] = $row;
    }
    respond(true, "OK", ["flights" => $flights]);
}

respond(false, "Invalid action.", null, 400);
?>