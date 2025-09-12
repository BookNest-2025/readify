<?php
header('Content-Type: application/json');

// Include database connection
require_once __DIR__ . '/../../config/db.php';

try {
    // Determine which books to fetch based on type parameter
    $type = isset($_GET['type']) ? $_GET['type'] : 'new';
    $limit = 6;

    if ($type === 'featured') {
        // For featured books
        $stmt = $pdo->prepare("
            SELECT b.book_id, b.title, b.price, b.image, 
                   GROUP_CONCAT(a.author_name SEPARATOR ', ') as authors
            FROM books b
            LEFT JOIN authors a ON b.book_id = a.book_id
            WHERE b.featured = 1
            GROUP BY b.book_id
            ORDER BY b.book_id DESC
            LIMIT :limit
        ");
    } else {
        // Default to new arrivals (most recently added)
        $stmt = $pdo->prepare("
            SELECT b.book_id, b.title, b.price, b.image, 
                   GROUP_CONCAT(a.author_name SEPARATOR ', ') as authors
            FROM books b
            LEFT JOIN authors a ON b.book_id = a.book_id
            GROUP BY b.book_id
            ORDER BY b.book_id DESC
            LIMIT :limit
        ");
    }

    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();
    $books = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Fix image paths for your structure
    foreach ($books as &$book) {
        if (!empty($book['image'])) {
            // If image doesn't have the full path, prepend the correct path
            if (strpos($book['image'], 'assets/uploads/books/') === false) {
                $book['image'] = 'assets/uploads/books/' . $book['image'];
            }
        } else {
            // Default image if none is set
            $book['image'] = 'assets/images/book_images/default.jpg';
        }
    }

    echo json_encode(['success' => true, 'books' => $books]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
