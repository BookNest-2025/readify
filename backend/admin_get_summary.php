<?php
header('Content-Type: application/json');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(403);
    exit("Forbidden");
}
session_start();
require_once '../app/config/db.php';

$response = ['success' => false, 'error' => '', 'data' => []];
$dates    = [];
for ($i = 6; $i >= 0; $i--) {
    $dates[] = date('Y-m-d', strtotime("-$i day")); // this week
}

$prevDates = [];
for ($i = 13; $i >= 7; $i--) {
    $prevDates[] = date('Y-m-d', strtotime("-$i day")); // last week
}

try {
    // looks login
    if (! isset($_SESSION["email"]) || ! isset($_SESSION["user_type"])) {
        $response["redirect"] = "login.html";
        throw new Exception("Please login to view summary.");
    }

    if ($_SESSION["user_type"] !== "admin") {
        $response["redirect"] = "login.html";
        throw new Exception("You should login as admin to view summary.");
    }

    // This week
    $stmt = $pdo->prepare("
    SELECT DATE(created_at) AS d, SUM(total) AS total
    FROM orders
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
    AND status IN ('shipped','delivered')
    GROUP BY d");
    $stmt->execute();
    $currentRows = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

    // Last week
    $prevStmt = $pdo->prepare("
    SELECT DATE(created_at) AS d, SUM(total) AS total
    FROM orders
    WHERE created_at BETWEEN DATE_SUB(CURDATE(), INTERVAL 13 DAY)                    AND DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    AND status IN ('shipped','delivered')
    GROUP BY d");
    $prevStmt->execute();
    $prevRows = $prevStmt->fetchAll(PDO::FETCH_KEY_PAIR);

    $currentSales = [];
    foreach ($dates as $d) {
        $currentSales[] = isset($currentRows[$d]) ? (float) $currentRows[$d] : 0;
    }

    $previousSales = [];
    foreach ($prevDates as $d) {
        $previousSales[] = isset($prevRows[$d]) ? (float) $prevRows[$d] : 0;
    }

    // --- genre/category sales  ---
    $colors = [
        '#1e3a8a', // blue-900
        '#2563eb', // blue-600
        '#1e40af', // blue-800
        '#3b82f6', // blue-500
        '#93c5fd', // blue-300
        '#1d4ed8', // blue-700
        '#60a5fa', // blue-400
    ];

    $genreStmt = $pdo->query("
    SELECT b.category as genre, SUM(oi.quantity) as qty
    FROM order_items oi
    JOIN books b ON oi.book_id = b.book_id
    GROUP BY b.category");

    $genres   = [];
    $totalQty = 0;
    $i        = 0;

    foreach ($genreStmt as $g) {
        $genres[] = [
            'name'  => $g['genre'],
            'qty'   => (int) $g['qty'],
            'color' => $colors[$i % count($colors)], // cycle colors if more genres than palette
        ];
        $totalQty += $g['qty'];
        $i++;
    }

// convert to percentages
    foreach ($genres as &$g) {
        $g['percent'] = $totalQty ? round($g['qty'] / $totalQty * 100, 1) : 0;
    }

    // --- ongoing orders ---
    $statusStmt = $pdo->query("
        SELECT status, COUNT(*) AS c
        FROM orders
        WHERE status IN ('placed','packed','shipped','delivered','cancelled')
        GROUP BY status
    ");
    $statusCounts = [
        ['label' => 'To Pack', 'slug' => 'to-pack', 'count' => 0],
        ['label' => 'To Ship', 'slug' => 'to-ship', 'count' => 0],
        ['label' => 'To Deliver', 'slug' => 'to-deliver', 'count' => 0],
        ['label' => 'Completed', 'slug' => 'completed', 'count' => 0],
        ['label' => 'Cancelled', 'slug' => 'cancelled', 'count' => 0],
    ];

    foreach ($statusStmt as $row) {
        switch ($row['status']) {
            case 'placed':
                $statusCounts[0]['count'] = (int) $row['c'];
                break;
            case 'packed':
                $statusCounts[1]['count'] = (int) $row['c'];
                break;
            case 'shipped':
                $statusCounts[2]['count'] = (int) $row['c'];
                break;
            case 'delivered':
                $statusCounts[3]['count'] = (int) $row['c'];
                break;
            case 'cancelled':
                $statusCounts[4]['count'] = (int) $row['c'];
                break;
        }
    }

    // --- KPIs ---
    $sumCurrent = array_sum($currentSales);
    $sumPrev    = array_sum($previousSales);
    $totalSales = $sumCurrent;
    $growth     = $sumPrev > 0
        ? round((($sumCurrent - $sumPrev) / $sumPrev) * 100, 1)
        : ($sumCurrent > 0 ? 100 : 0); // avoid ÷0

    $ordersTotal = array_sum(array_column($statusCounts, 'count'));
    $customers   = $pdo->query("SELECT COUNT(*) FROM customers")->fetchColumn();
    $booksCount  = $pdo->query("SELECT COUNT(*) FROM books")->fetchColumn();
    $outOfStock  = $pdo->query("SELECT COUNT(*) FROM books WHERE stock=0")->fetchColumn();

    $response['success'] = true;
    $response['data']    = [
        'dates'        => $dates,
        'sales'        => $currentSales,
        'prevDates'    => $prevDates,
        'prevSales'    => $previousSales,
        'weeklyGrowth' => $growth,
        'genres'       => $genres,
        'orders'       => $statusCounts,
        'kpi'          => [
            'totalSales'  => $totalSales,
            'totalOrders' => $ordersTotal,
            'customers'   => (int) $customers,
            'books'       => (int) $booksCount,
            'outStock'    => (int) $outOfStock,
        ]];

} catch (PDOException $e) {
    $response['error'] = "Database error";
} catch (Exception $e) {
    $response['error'] = $e->getMessage();
}
echo json_encode($response);
