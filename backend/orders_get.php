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
    if (! isset($_SESSION["email"]) || ! isset($_SESSION["user_type"])) {
        $response["redirect"] = "login.html";
        throw new Exception("Please login to view orders.");
    }

    $order_id = $_GET["order_id"] ?? null;
    if (! $order_id) {

        throw new Exception("Order ID not provided.");
    }

    $stmtOrder = $pdo->prepare("SELECT * FROM orders WHERE order_id = :order_id");
    $stmtOrder->execute(["order_id" => $order_id]);
    $order = $stmtOrder->fetch();
    if (! $order) {
        throw new Exception("Order not found.");
    }

    if ($_SESSION["user_type"] === "admin") {
        $stmtCustomer = $pdo->prepare("SELECT * FROM customers WHERE customer_id = :customer_id");
        $stmtCustomer->execute(["customer_id" => $order["customer_id"]]);
        $customer = $stmtCustomer->fetch();
    } else {
        $stmtCustomer = $pdo->prepare("SELECT * FROM customers WHERE email = :email");
        $stmtCustomer->execute(["email" => $_SESSION["email"]]);
        $customer = $stmtCustomer->fetch();
        if ($customer["customer_id"] !== $order["customer_id"]) {
            $response["redirect"] = "profile.html";
            throw new Exception("You can not view others orders.");
        }

    }

    $stmtOrderItems = $pdo->prepare("SELECT * FROM order_items o JOIN books b ON o.book_id = b.book_id WHERE order_id = :order_id");
    $stmtOrderItems->execute(["order_id" => $order_id]);
    $orderItems = $stmtOrderItems->fetchAll();

    $response["success"] = true;
    $response["data"]    = [
        "order"       => $order,
        "customer"    => $customer,
        "order_items" => $orderItems,
    ];

} catch (Exception $e) {
    $response["error"] = $e->getMessage();
}

echo json_encode($response);
