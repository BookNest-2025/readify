<?php
// backend/updateBookStatus.php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(403);
    exit("Forbidden");
}

include "../app/config/db.php";
session_start();

header("Content-Type: application/json");
$response = ["success" => false, "message" => ""];

try {
    if (!isset($_SESSION["email"]) || !isset($_SESSION["user_type"])) {
        throw new Exception("Please login to update book status.");
    }

    if ($_SESSION["user_type"] !== "admin") {
        throw new Exception("You should login as admin to update book status.");
    }

    $bookId = trim($_POST["book_id"]) ?? "";
    $status = trim($_POST["status"]) ?? "0";

    if (!$bookId) {
        throw new Exception("Book ID is required.");
    }

    // Update book status
    $stmt = $pdo->prepare("UPDATE books SET status = :status, updated_at = NOW() WHERE book_id = :book_id");
    $stmt->execute([
        "status" => $status,
        "book_id" => $bookId
    ]);

    if ($stmt->rowCount() > 0) {
        $response['success'] = true;
        $response['message'] = $status == 1 ? 'Book activated successfully!' : 'Book deactivated successfully!';
    } else {
        throw new Exception("No changes made. Book may not exist.");
    }
} catch (Exception $e) {
    $response["message"] = $e->getMessage();
}

echo json_encode($response);
