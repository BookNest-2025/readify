<?php

include "../app/config/db.php";
session_start();
header("Content-Type: application/json");

$response = ["success" => false, "message" => "", "error" => "", "redirect" => ""];

try {
    if (! isset($_SESSION["email"]) || ! isset($_SESSION["user_type"])) {
        $response["redirect"] = "login.html";
        throw new Exception("Please login to view cart items.");
    }

    try {
        $stmtCustomer = $pdo->prepare("SELECT customer_id FROM customers WHERE email = :email");
        $stmtCustomer->execute(["email" => $_SESSION['email']]);
        $customer = $stmtCustomer->fetch();

        if (! $customer) {
            throw new Exception("Customer not found.");
        }

        $customer_id = $customer['customer_id'];

        $stmtCart = $pdo->prepare("SELECT * FROM cart where customer_id = :customer_id");
        $stmtCart->execute(["customer_id" => $customer_id]);
        $cart_items = $stmtCart->fetchAll();

        if (empty($cart_items)) {
            $response["success"] = true;
            throw new Exception("Please add items to cart before view.");
        }

        $stmt = $pdo->prepare("SELECT image,title,stock,price FROM books WHERE book_id = :book_id");
        foreach ($cart_items as &$cart) {
            $stmt->execute(["book_id" => $cart["book_id"]]);
            $book               = $stmt->fetch();
            $response['data'][] = ["cart_id" => $cart["cart_id"], "title" => $book["title"], "stock" => $book["stock"], "image" => $book["image"], "price" => $book["price"], "quantity" => $cart["quantity"]];
        }

        $response['success'] = true;

    } catch (PDOException $e) {
        $response["error"] = "Error Fetching cart data.<br>Please try again.";

    }

} catch (Exception $e) {
    $response["error"] = $e->getMessage();
}

echo json_encode($response);
