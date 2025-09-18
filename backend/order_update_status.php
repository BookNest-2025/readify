<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(403);
    exit("Forbidden");
}

include "../app/config/db.php";
session_start();

header("Content-Type: application/json");
$response = ["success" => false, "message" => "", "error" => "", "redirect" => "", "data" => []];

try {
    if (empty($_SESSION["email"]) || empty($_SESSION["user_type"])) {
        $response["redirect"] = "login.html";
        throw new Exception("Please login to update order status.");
    }

    $order_id = $_GET["order_id"] ?? null;
    $status   = $_GET["status"] ?? null;

    if (! $order_id || ! $status) {
        throw new Exception("Please provide both order id and new status.");
    }

    $stmtOrder = $pdo->prepare("
        SELECT o.*, c.customer_id, c.email
        FROM orders o
        JOIN customers c ON o.customer_id = c.customer_id
        WHERE o.order_id = :order_id
    ");
    $stmtOrder->execute([":order_id" => $order_id]);
    $order = $stmtOrder->fetch();

    if (! $order) {
        throw new Exception("Order not found.");
    }

    if ($_SESSION["user_type"] === "admin") {
    } elseif ($_SESSION["user_type"] === "customers") {
        if ($order['email'] !== $_SESSION['email']) {
            throw new Exception("You are not allowed to update someone else's order.");
        }
        if (strtolower($status) !== 'cancelled') {
            throw new Exception("Customers can only set status to 'cancelled'.");
        }
        if (strtolower($order['status']) !== 'pending') {
            throw new Exception("This order can no longer be cancelled.");
        }
    } else {
        throw new Exception("Invalid user type.");
    }

    $stmtUpdate = $pdo->prepare("UPDATE orders SET status = :status WHERE order_id = :order_id");
    $stmtUpdate->execute([
        ":status"   => $status,
        ":order_id" => $order_id,
    ]);

    if ($stmtUpdate->rowCount() === 0) {
        throw new Exception("No order updated. Check the order ID or status.");
    }

    $response["success"] = true;
    $response["message"] = "Status changed successfully.";

} catch (Exception $e) {
    $response["error"] = $e->getMessage();
}

echo json_encode($response);
