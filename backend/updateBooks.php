<?php
// backend/updateBooks.php
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

// Get form data
$bookId = $conn->real_escape_string($_POST['book_id']);
$title = $conn->real_escape_string($_POST['title']);
$authors = $conn->real_escape_string($_POST['author']);
$price = $conn->real_escape_string($_POST['price']);
$stock = $conn->real_escape_string($_POST['stock']);
$sold = $conn->real_escape_string($_POST['sold']);
$category = $conn->real_escape_string($_POST['category']);
$description = $conn->real_escape_string($_POST['description']);
$status = $conn->real_escape_string($_POST['status']);

// Validate required fields
if (empty($bookId) || empty($title) || empty($authors)) {
    echo json_encode(['success' => false, 'message' => 'Title and Author are required']);
    exit;
}

// Start transaction
$conn->begin_transaction();

try {
    // Update book information
    $sql = "UPDATE books SET 
            title = '$title', 
            price = '$price', 
            stock = '$stock', 
            sold = '$sold', 
            description = '$description', 
            category = '$category', 
            status = '$status', 
            updated_at = NOW() 
            WHERE book_id = '$bookId'";

    if (!$conn->query($sql)) {
        throw new Exception("Error updating book: " . $conn->error);
    }

    // Delete existing authors
    $sql = "DELETE FROM authors WHERE book_id = '$bookId'";
    if (!$conn->query($sql)) {
        throw new Exception("Error deleting authors: " . $conn->error);
    }

    // Insert new authors
    $authorNames = array_map('trim', explode(',', $authors));
    foreach ($authorNames as $authorName) {
        if (!empty($authorName)) {
            $authorName = $conn->real_escape_string($authorName);
            $sql = "INSERT INTO authors (book_id, author_name) VALUES ('$bookId', '$authorName')";
            if (!$conn->query($sql)) {
                throw new Exception("Error inserting author: " . $conn->error);
            }
        }
    }

    // Commit transaction
    $conn->commit();

    echo json_encode(['success' => true, 'message' => 'Book updated successfully']);
} catch (Exception $e) {
    // Rollback transaction on error
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

$conn->close();
