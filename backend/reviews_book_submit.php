<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(403);
    exit("Forbidden");
}

include "../app/config/db.php";
session_start();

header("Content-Type: application/json");
$response = ["success" => false, "message" => ""];

try {
    if (! isset($_SESSION["email"])) {
        throw new Exception("Please login to add a review.");
    }

    $rating  = trim($_POST["rating"]) ?? "";
    $review  = trim($_POST["review"]) ?? "";
    $book_id = trim($_POST["book_id"]) ?? "";

    $stmtCustomer = $pdo->prepare("SELECT * FROM customers WHERE email = :email");
    $stmtCustomer->execute(["email" => $_SESSION['email']]);
    $customer_id = $stmtCustomer->fetch()['customer_id'];

    if (! $rating || ! $review || ! $book_id) {
        throw new Exception("Please fill in all required fields.");
    }

    if ($rating < 1 || $rating > 5) {
        throw new Exception("Rating must be between 1 and 5.");
    }

    $checkSql  = "SELECT * FROM book_reviews WHERE customer_id = :customer_id AND book_id = :book_id";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute(['customer_id' => $customer_id, 'book_id' => $book_id]);

    if ($checkStmt->rowCount() > 0) {
        throw new Exception("You have already reviewed on that book.");
    }

    $sql = "INSERT INTO book_reviews (customer_id, rating, review, book_id)
            VALUES (:customer_id, :rating, :review, :book_id)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        "customer_id" => $customer_id,
        "rating"      => $rating,
        "review"      => $review,
        "book_id"     => $book_id,
    ]);

    $response['success'] = true;
    $response['message'] = 'Thank you for reviewing our platform!';

} catch (PDOException $e) {
    $response["error"] = "Database error: ";
} catch (Exception $e) {
    $response["error"] = $e->getMessage();
}

echo json_encode($response);
