<?php

include "../app/config/db.php";
session_start();
header("Content-Type: application/json");

$response = ["success" => false, "message" => "", "error" => "", "redirect" => ""];

try {
    if (! isset($_SESSION["email"]) || ! isset($_SESSION["user_type"])) {
        $response["redirect"] = "login.html";
        throw new Exception("Please login to change cart items.");
    }

    if (! isset($_GET["cart_id"], $_GET["operation"])) {
        throw new Exception("Missing cart_id or operation.");
    }

    $cart_id   = (int) $_GET["cart_id"];
    $operation = $_GET["operation"];

    // Fetch cart item
    $stmtCart = $pdo->prepare("
    SELECT cart.*, books.stock
    FROM cart
    JOIN books ON cart.book_id = books.book_id
    WHERE cart.cart_id = :cart_id");

    $stmtCart->execute(["cart_id" => $cart_id]);
    $cart_item = $stmtCart->fetch();

    if (! $cart_item) {
        throw new Exception("Cart item not found.");
    }

    switch ($operation) {
        case "del":
            $stmt = $pdo->prepare("DELETE FROM cart WHERE cart_id = :cart_id");
            $stmt->execute(["cart_id" => $cart_id]);
            break;

        case "add":
            $quantity = $cart_item["quantity"] + 1;
            $stock    = $cart_item["stock"];

            if ($quantity > $stock) {
                throw new Exception("Cannot add more items. Only $stock in stock.");
            }

            $stmt = $pdo->prepare("UPDATE cart SET quantity = :quantity WHERE cart_id = :cart_id");
            $stmt->execute([
                "quantity" => $quantity,
                "cart_id"  => $cart_id,
            ]);
            break;

        case "red":
            $quantity = $cart_item["quantity"];
            if ($quantity <= 1) {
                throw new Exception("Cannot reduce.<br>You already have only 1 item in the cart.");
            }
            $quantity -= 1;
            $stmt = $pdo->prepare("UPDATE cart SET quantity = :quantity WHERE cart_id = :cart_id");
            $stmt->execute([
                "quantity" => $quantity,
                "cart_id"  => $cart_id,
            ]);
            break;

        default:
            throw new Exception("Invalid operation.");
    }

    $response["message"] = "updated successfully.";
    $response["success"] = true;

} catch (PDOException $e) {
    $response["error"] = "Database error: " . $e->getMessage();
} catch (Exception $e) {
    $response["error"] = $e->getMessage();
}

echo json_encode($response);
