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

    // Fetch order with customer info
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

    if ($_SESSION["user_type"] !== "customers" && $_SESSION["user_type"] !== "admin") {
        throw new Exception("Invalid user type.");
    }

    if ($_SESSION["user_type"] === "customers") {
        if ($order['email'] !== $_SESSION['email']) {
            throw new Exception("You are not allowed to update someone else's order.");
        }
        if (strtolower($status) !== 'cancelled') {
            throw new Exception("Customers can only set status to 'cancelled'.");
        }
        if (strtolower($order['status']) !== 'pending') {
            throw new Exception("This order can no longer be cancelled.");
        }
    }

    $pdo->beginTransaction();

    $stmtUpdate = $pdo->prepare("UPDATE orders SET status = :status WHERE order_id = :order_id");
    $stmtUpdate->execute([
        ":status"   => $status,
        ":order_id" => $order_id,
    ]);

    if ($stmtUpdate->rowCount() === 0) {
        throw new Exception("No order updated. Check the order ID or status.");
    }

    // If cancelling order, restore stock
    if (strtolower($status) === 'cancelled' && strtolower($order['status']) !== 'cancelled') {

        $stmtItems = $pdo->prepare("
            SELECT book_id, quantity FROM order_items WHERE order_id = :order_id
        ");
        $stmtItems->execute([":order_id" => $order_id]);
        $items = $stmtItems->fetchAll();

        // Prepare statements once (better performance and safety)
        $stmtUpdateStock = $pdo->prepare("
            UPDATE books
            SET stock = stock + :quantity,
                sold  = GREATEST(sold - :quantity, 0)
            WHERE book_id = :book_id
        ");

        $stmtGetStock   = $pdo->prepare("SELECT stock FROM books WHERE book_id = :book_id");
        $stmtReactivate = $pdo->prepare("UPDATE books SET status = 1 WHERE book_id = :book_id");

        foreach ($items as $item) {
            $stmtUpdateStock->execute([
                ":quantity" => $item["quantity"],
                ":book_id"  => $item["book_id"],
            ]);

            // Check stock after update
            $stmtGetStock->execute([":book_id" => $item["book_id"]]);
            $book = $stmtGetStock->fetch();

            // Reactivate book if stock > 0
            if ($book && intval($book["stock"]) > 0) {
                $stmtReactivate->execute([":book_id" => $item["book_id"]]);
            }
        }
    }

    $pdo->commit();

    $response["success"] = true;
    $response["message"] = "Order status updated successfully.";

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    $response["error"] = $e->getMessage();
}

echo json_encode($response);
