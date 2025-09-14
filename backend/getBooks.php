<?php
// backend/getBooks.php
header('Content-Type: application/json');

// Use your existing database connection
include "../app/config/db.php";

try {
    // Get the search term or book ID
    if (isset($_POST['search'])) {
        $searchTerm = '%' . trim($_POST['search']) . '%';

        $sql = "SELECT b.*, GROUP_CONCAT(a.author_name SEPARATOR ', ') as authors 
                FROM books b 
                LEFT JOIN authors a ON b.book_id = a.book_id 
                WHERE b.title LIKE :search 
                GROUP BY b.book_id 
                ORDER BY b.title";

        $stmt = $pdo->prepare($sql);
        $stmt->execute(['search' => $searchTerm]);
    } elseif (isset($_POST['book_id'])) {
        $bookId = trim($_POST['book_id']);

        $sql = "SELECT b.*, GROUP_CONCAT(a.author_name SEPARATOR ', ') as authors 
                FROM books b 
                LEFT JOIN authors a ON b.book_id = a.book_id 
                WHERE b.book_id = :book_id 
                GROUP BY b.book_id";

        $stmt = $pdo->prepare($sql);
        $stmt->execute(['book_id' => $bookId]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No search term or book ID provided']);
        exit;
    }

    $books = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Process the authors into arrays
    foreach ($books as &$book) {
        $book['authors'] = $book['authors'] ? explode(', ', $book['authors']) : [];
    }

    echo json_encode([
        'success' => true,
        'data' => $books
    ]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
