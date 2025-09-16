<?php
header('Content-Type: application/json');

include "../app/config/db.php";

try {
    if (!isset($_POST['book_id'])) {
        echo json_encode(['success' => false, 'message' => 'Book ID is required']);
        exit;
    }

    $bookId = $_POST['book_id'];

    // Get reviews for the book
    $sql = "SELECT r.*, u.name as user_name 
            FROM reviews r 
            JOIN users u ON r.user_id = u.user_id 
            WHERE r.book_id = :book_id 
            ORDER BY r.created_at DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute(['book_id' => $bookId]);
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get review statistics
    $statsSql = "SELECT 
                 COUNT(*) as total_reviews, 
                 AVG(rating) as average_rating 
                 FROM reviews 
                 WHERE book_id = :book_id";

    $statsStmt = $pdo->prepare($statsSql);
    $statsStmt->execute(['book_id' => $bookId]);
    $stats = $statsStmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'reviews' => $reviews,
        'stats' => $stats
    ]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
