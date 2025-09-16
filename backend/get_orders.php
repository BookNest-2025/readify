<?php
include "../app/config/db.php";
session_start();

header("Content-Type: application/json");

$response = [
    "success"  => false,
    "message"  => "",
    "error"    => "",
    "redirect" => "",
    "data"     => [],
];

try {
    if (! isset($_SESSION["email"]) || ! isset($_SESSION["user_type"])) {
        $response["redirect"] = "login.html";
        throw new Exception("Please login to view orders.");
    }

    if ($_SESSION["user_type"] !== "admin") {
        $response["redirect"] = "login.html";
        throw new Exception("You should login as admin to view orders.");
    }

    $status = $_GET["status"] ?? "";

    $stmt = $pdo->prepare("SELECT * FROM orders WHERE status = :status");
    $stmt->execute([":status" => $status]);
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($orders)) {
        $response["success"] = false;
        $response["message"] = "No orders found for status '$status'.";
    } else {
        foreach ($orders as &$order) {
            $stmt2 = $pdo->prepare("SELECT name FROM customers WHERE customer_id = :id");
            $stmt2->execute([":id" => $order['customer_id']]);
            $order['customer_name'] = $stmt2->fetchColumn() ?? "Unknown";
        }

        $response["success"] = true;
        $response["data"]    = $orders;
    }

} catch (Exception $e) {
    if (empty($response["error"])) {
        $response["error"] = $e->getMessage() ?: "Error getting orders.";
    }
}

echo json_encode($response);
