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

    $status = $_GET["status"] ?? "";
    $orders = null;

    if ($_SESSION['user_type'] === 'customers') {
        $stmt = $pdo->prepare("SELECT * FROM orders o JOIN customers c ON o.customer_id = c.customer_id WHERE c.email = :email");
        $stmt->execute(["email" => $_SESSION['email']]);
        $orders = $stmt->fetchAll();
    } else {
        if (! $status) {
            $stmt = $pdo->prepare("SELECT * FROM orders ORDER BY created_at DESC");
            $stmt->execute();
            $orders = $stmt->fetchAll();
        } else {
            $stmt = $pdo->prepare("SELECT * FROM orders WHERE status = :status ORDER BY created_at DESC");
            $stmt->execute([":status" => $status]);
            $orders = $stmt->fetchAll();
        }

    }

    if (empty($orders)) {
        $response["success"] = false;
        throw new Exception($status
                ? "No orders found for status $status."
                : "No orders found."
        );

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
