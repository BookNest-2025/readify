<?php
include "../app/config/db.php";
session_start();
header("Content-Type: application/json");

$response = ["success" => false, "message" => "", "error" => "", "redirect" => ""];

try {
    if (! isset($_SESSION["email"]) || ! isset($_SESSION["user_type"])) {
        $response["redirect"] = "login.html";
        throw new Exception("Please login to place order.");
    }

    $stmtCustomer = $pdo->prepare("SELECT customer_id FROM customers WHERE email = :email");
    $stmtCustomer->execute(["email" => $_SESSION['email']]);
    $customer = $stmtCustomer->fetch(PDO::FETCH_ASSOC);

    if (! $customer) {
        throw new Exception("Customer not found.");
    }
    $customer_id = $customer['customer_id'];

    $stmtCart = $pdo->prepare("SELECT * FROM cart WHERE customer_id = :customer_id");
    $stmtCart->execute(["customer_id" => $customer_id]);
    $cart_items = $stmtCart->fetchAll(PDO::FETCH_ASSOC);

    if (empty($cart_items)) {
        throw new Exception("Please add items to cart before placing order.");
    }

    $total = 0;
    foreach ($cart_items as $item) {
        $priceStmt = $pdo->prepare("SELECT price FROM books WHERE book_id = :book_id");
        $priceStmt->execute(["book_id" => $item['book_id']]);
        $priceRow = $priceStmt->fetch(PDO::FETCH_ASSOC);
        $total += $priceRow['price'] * $item['quantity'];
    }

    $pdo->beginTransaction();

    $stmtOrders = $pdo->prepare(
        "INSERT INTO orders (customer_id, total, created_at)
         VALUES (:customer_id, :total, NOW())"
    );
    $stmtOrders->execute(["customer_id" => $customer_id, "total" => $total]);
    $orderId = $pdo->lastInsertId();

    $stmtItem = $pdo->prepare(
        "INSERT INTO order_items (order_id, book_id, quantity, price)
         VALUES (:order_id, :book_id, :quantity, :price)"
    );

    $stmtDeleteCart = $pdo->prepare("DELETE FROM cart WHERE cart_id = :cart_id");

    foreach ($cart_items as $cart) {
        $book_id  = $cart['book_id'];
        $quantity = $cart['quantity'];

        $priceStmt = $pdo->prepare("SELECT price, stock, sold FROM books WHERE book_id = :book_id FOR UPDATE");
        $priceStmt->execute(["book_id" => $book_id]);
        $bookRow = $priceStmt->fetch(PDO::FETCH_ASSOC);

        if (! $bookRow) {
            throw new Exception("Book not found (ID: $book_id).");
        }

        if ($bookRow['stock'] < $quantity) {
            throw new Exception("Not enough stock for book ID $book_id.");
        }

        $price = $bookRow['price'];

        $stmtItem->execute([
            "order_id" => $orderId,
            "book_id"  => $book_id,
            "quantity" => $quantity,
            "price"    => $price,
        ]);

        $updateBook = $pdo->prepare(
            "UPDATE books
         SET stock = stock - :quantity, sold = sold + :quantity
         WHERE book_id = :book_id"
        );
        $updateBook->execute([
            "quantity" => $quantity,
            "book_id"  => $book_id,
        ]);

        $stmtDeleteCart->execute(["cart_id" => $cart["cart_id"]]);
    }

    $pdo->commit();
    $response["success"]  = true;
    $response["message"]  = "Order placed successfully.<br>Directing to Homepage...";
    $response["redirect"] = "index.html";
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    $response["error"] = $e->getMessage();
}

echo json_encode($response);
