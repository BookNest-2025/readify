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
    $status   = $_GET['status'] ?? null;
    if (! $order_id || ! $status) {
        throw new Exception("Please provide order id & status to update status.");
    }

    $stmtOrder = $pdo->prepare("UPDATE orders SET status = :status WHERE order_id = :order_id");
    $stmtOrder->execute(["status" => $status, "order_id" => $order_id]);

    $response["success"] = true;
    $response["message"] = "Status chaged successfully.";

} catch (Exception $e) {
    $response["error"] = $e->getMessage();
}

echo json_encode($response);
