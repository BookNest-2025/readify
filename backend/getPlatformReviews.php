<?php
// backend/getPlatformReviews.php
header('Content-Type: application/json');

include "../app/config/db.php";

try {
    // Get platform reviews from your reviews table
    $sql = "SELECT * FROM reviews ORDER BY date DESC LIMIT 20";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'reviews' => $reviews
    ]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
