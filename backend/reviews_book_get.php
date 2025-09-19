<?php
header('Content-Type: application/json');
include "../app/config/db.php";

$response = ["success" => false, "message" => "", "error" => "", "redirect" => ""];

try {
    $limit    = isset($_GET["limit"]) ? (int) $_GET["limit"] : 3;
    $order_by = $_GET["order_by"] ?? "rating";
    $book_id  = $_GET["book_id"] ?? "";

    if (! $book_id) {
        throw new Exception("Book ID is required.");
    }

    $validColumns = ["date", "rating"];
    if (! in_array($order_by, $validColumns, true)) {
        throw new Exception("Invalid order_by parameter.");
    }

    $sql = "SELECT r.date, r.review, r.rating, c.name, c.photo
            FROM book_reviews r
            JOIN customers c ON r.customer_id = c.customer_id
            WHERE r.book_id = :book_id
            ORDER BY r.$order_by DESC
            LIMIT :limit";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':book_id', $book_id);
    $stmt->execute();

    $reviews = $stmt->fetchAll();

    $response['success'] = true;
    $response['data']    = $reviews;

} catch (PDOException $e) {
    $response['error'] = "Database error.";
} catch (Exception $e) {
    $response['error'] = $e->getMessage();
}

echo json_encode($response);
