<?php
include "../app/config/db.php";
session_start();
header("Content-Type: application/json");

$response = ["success" => false, "message" => "", "error" => "", "redirect" => ""];

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Invalid request method.");
    }

    if (! isset($_SESSION['email']) || ! isset($_SESSION['user_type'])) {
        $response["redirect"] = "login.html";
        throw new Exception("Please login to buy this book.");
    }

    $book_id        = $_GET['book_id'] ?? null;
    $quantity       = $_GET['quantity'] ?? 1;
    $payment_method = $_GET['payment_method'] ?? 'COD';

    if (! $book_id) {
        throw new Exception("Book ID is required.");
    }

    $stmtCustomer = $pdo->prepare("SELECT customer_id FROM customers WHERE email = :email");
    $stmtCustomer->execute(["email" => $_SESSION['email']]);
    $customer = $stmtCustomer->fetch(PDO::FETCH_ASSOC);
    if (! $customer) {
        throw new Exception("Customer not found.");
    }

    $customer_id = $customer['customer_id'];

    $stmtBook = $pdo->prepare("SELECT price, stock, sold FROM books WHERE book_id = :book_id FOR UPDATE");
    $stmtBook->execute(["book_id" => $book_id]);
    $book = $stmtBook->fetch(PDO::FETCH_ASSOC);
    if (! $book) {
        throw new Exception("Book not found.");
    }

    if ($book['stock'] < $quantity) {
        throw new Exception("Not enough stock available.");
    }

    $total = $book['price'] * $quantity;

    $pdo->beginTransaction();

    $stmtOrder = $pdo->prepare("
        INSERT INTO orders (customer_id, total, payment_method, status, created_at)
        VALUES (:customer_id, :total, :payment_method, 'pending', NOW())
    ");
    $stmtOrder->execute([
        "customer_id"    => $customer_id,
        "total"          => $total,
        "payment_method" => $payment_method,
    ]);

    $orderId = $pdo->lastInsertId();

    $stmtItem = $pdo->prepare("
        INSERT INTO order_items (order_id, book_id, quantity, price)
        VALUES (:order_id, :book_id, :quantity, :price)
    ");
    $stmtItem->execute([
        "order_id" => $orderId,
        "book_id"  => $book_id,
        "quantity" => $quantity,
        "price"    => $book['price'],
    ]);

    $stmtUpdateBook = $pdo->prepare("
        UPDATE books
        SET stock = stock - :quantity, sold = sold + :quantity
        WHERE book_id = :book_id
    ");
    $stmtUpdateBook->execute([
        "quantity" => $quantity,
        "book_id"  => $book_id,
    ]);

    $pdo->commit();

    $response["success"]  = true;
    $response["message"]  = "Book purchased successfully!";
    $response["redirect"] = "index.html";

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    $response["error"] = $e->getMessage();
}

echo json_encode($response);
