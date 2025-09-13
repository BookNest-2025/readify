<?php

include "../app/config/db.php";
session_start();
header("Content-Type: application/json");

$response = ["success" => false, "message" => "", "error" => "", "redirect" => ""];

try {
    if (! isset($_SESSION["email"]) || ! isset($_SESSION["user_type"])) {
        $response["redirect"] = "login.html";
        throw new Exception("Please login to add to cart.");
    }

    $book_id = $_GET["id"] ?? null;

    if (! $book_id) {
        throw new Exception("Book ID is required.");
    }

    try {
        $stmtCustomer = $pdo->prepare("SELECT customer_id FROM customers WHERE email = :email");
        $stmtCustomer->execute(["email" => $_SESSION['email']]);
        $customer = $stmtCustomer->fetch();

        if (! $customer) {
            throw new Exception("Customer not found.");
        }

        $customer_id = $customer['customer_id'];

        $stmtCart = $pdo->prepare("SELECT * FROM cart WHERE customer_id = :customer_id AND book_id = :book_id");
        $stmtCart->execute(["customer_id" => $customer_id, "book_id" => $book_id]);
        $cart = $stmtCart->fetch();

        if ($cart) {
            $quantity = $cart["quantity"] + 1;
            $stmt     = $pdo->prepare("UPDATE cart SET quantity = :quantity WHERE cart_id = :cart_id");
            $stmt->execute([
                "quantity" => $quantity,
                "cart_id"  => $cart["cart_id"],
            ]);
        } else {
            $stmt = $pdo->prepare("INSERT INTO cart (customer_id, book_id) VALUES (:customer_id, :book_id)");
            $stmt->execute([
                "customer_id" => $customer_id,
                "book_id"     => $book_id,
            ]);
        }

        $response["success"] = true;
        $response["message"] = "Added to the cart successfully.";
    } catch (PDOException $e) {
        $response["error"] = "Error adding to cart.";

    }
} catch (Exception $e) {
    $response["error"] = $e->getMessage();
}

echo json_encode($response);
