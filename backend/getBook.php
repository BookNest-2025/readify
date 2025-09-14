<?php
// backend/getBooks.php
header('Content-Type: application/json');

// Simple database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "readify";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// Get the search term or book ID
if (isset($_POST['search'])) {
    $searchTerm = '%' . $conn->real_escape_string($_POST['search']) . '%';

    $sql = "SELECT b.*, GROUP_CONCAT(a.author_name SEPARATOR ', ') as authors 
            FROM books b 
            LEFT JOIN authors a ON b.book_id = a.book_id 
            WHERE b.title LIKE '$searchTerm' 
            GROUP BY b.book_id 
            ORDER BY b.title";
} elseif (isset($_POST['book_id'])) {
    $bookId = $conn->real_escape_string($_POST['book_id']);

    $sql = "SELECT b.*, GROUP_CONCAT(a.author_name SEPARATOR ', ') as authors 
            FROM books b 
            LEFT JOIN authors a ON b.book_id = a.book_id 
            WHERE b.book_id = '$bookId' 
            GROUP BY b.book_id";
} else {
    echo json_encode(['success' => false, 'message' => 'No search term or book ID provided']);
    exit;
}

$result = $conn->query($sql);

if (!$result) {
    echo json_encode(['success' => false, 'message' => 'Query failed: ' . $conn->error]);
    exit;
}

$books = [];
while ($row = $result->fetch_assoc()) {
    $books[] = [
        'book_id' => $row['book_id'],
        'title' => $row['title'],
        'price' => $row['price'],
        'stock' => $row['stock'],
        'sold' => $row['sold'],
        'description' => $row['description'],
        'category' => $row['category'],
        'status' => $row['status'],
        'authors' => $row['authors'] ? explode(', ', $row['authors']) : []
    ];
}

$conn->close();

echo json_encode([
    'success' => true,
    'data' => $books
]);
