<?php
// backend/submitPlatformReview.php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(403);
    exit("Forbidden");
}

include "../app/config/db.php";
session_start();

header("Content-Type: application/json");
$response = ["success" => false, "message" => ""];

try {
    if (!isset($_SESSION["customer_id"])) {
        throw new Exception("Please login to submit a review.");
    }

    $rating = trim($_POST["rating"]) ?? "";
    $review = trim($_POST["review"]) ?? "";
    $customerId = trim($_POST["customer_id"]) ?? "";

    if (!$rating || !$review || !$customerId) {
        throw new Exception("Please fill in all required fields.");
    }

    if ($rating < 1 || $rating > 5) {
        throw new Exception("Rating must be between 1 and 5.");
    }

    // Check if customer has already reviewed the platform
    $checkSql = "SELECT * FROM reviews WHERE customer_id = :customer_id";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute(['customer_id' => $customerId]);

    if ($checkStmt->rowCount() > 0) {
        throw new Exception("You have already reviewed our platform.");
    }

    // Insert the platform review
    $sql = "INSERT INTO reviews (customer_id, rating, review, date) 
            VALUES (:customer_id, :rating, :review, NOW())";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        "customer_id" => $customerId,
        "rating" => $rating,
        "review" => $review
    ]);

    $response['success'] = true;
    $response['message'] = 'Thank you for reviewing our platform!';
} catch (Exception $e) {
    $response["message"] = $e->getMessage();
}

echo json_encode($response);
