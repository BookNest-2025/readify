<?php
// backend/submitReview.php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(403);
    exit("Forbidden");
}

include "../app/config/db.php";
session_start();

header("Content-Type: application/json");
$response = ["success" => false, "message" => ""];

try {
    if (!isset($_SESSION["user_id"])) {
        throw new Exception("Please login to submit a review.");
    }

    $bookId = trim($_POST["book_id"]) ?? "";
    $rating = trim($_POST["rating"]) ?? "";
    $title = trim($_POST["title"]) ?? "";
    $content = trim($_POST["content"]) ?? "";

    if (!$bookId || !$rating || !$title || !$content) {
        throw new Exception("Please fill in all required fields.");
    }

    if ($rating < 1 || $rating > 5) {
        throw new Exception("Rating must be between 1 and 5.");
    }

    $userId = $_SESSION["user_id"];

    // Check if user has already reviewed this book
    $checkSql = "SELECT * FROM reviews WHERE user_id = :user_id AND book_id = :book_id";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute(['user_id' => $userId, 'book_id' => $bookId]);

    if ($checkStmt->rowCount() > 0) {
        throw new Exception("You have already reviewed this book.");
    }

    // Insert the review
    $sql = "INSERT INTO reviews (book_id, user_id, rating, title, content, created_at) 
            VALUES (:book_id, :user_id, :rating, :title, :content, NOW())";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        "book_id" => $bookId,
        "user_id" => $userId,
        "rating" => $rating,
        "title" => $title,
        "content" => $content
    ]);

    $response['success'] = true;
    $response['message'] = 'Review submitted successfully!';
} catch (Exception $e) {
    $response["message"] = $e->getMessage();
}

echo json_encode($response);
