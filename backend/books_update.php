<?php
// backend/updateBooks.php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(403);
    exit("Forbidden");
}

include "../app/config/db.php";
session_start();

header("Content-Type: application/json");
$response = ["success" => false, "message" => ""];

try {
    if (! isset($_SESSION["email"]) || ! isset($_SESSION["user_type"])) {
        throw new Exception("Please login to update books.");
    }

    if ($_SESSION["user_type"] !== "admin") {
        throw new Exception("You should login as admin to update books.");
    }

    $bookId      = trim($_POST["book_id"]) ?? "";
    $title       = trim($_POST["title"]) ?? "";
    $price       = trim($_POST["price"]) ?? '0';
    $stock       = trim($_POST["stock"]) ?? '0';
    $description = trim($_POST["description"]) ?? "";
    $category    = trim($_POST["category"]) ?? "";
    $authors     = trim($_POST["author"]) ?? "";

    if (! $bookId || ! $title || ! $description || ! $category || ! $authors) {
        throw new Exception("Please fill in all required fields.");
    }

    if ($price < 0) {
        throw new Exception("Price should be 0 or greater.");
    }

    if ($stock < 0) {
        throw new Exception("Stock should be 0 or greater.");
    }

    try {
        $authorsArray = array_map('trim', explode(",", $authors));

        if (empty($authorsArray[0])) {
            throw new Exception("Please enter authors correctly<br>
            For an example: author1, author2");
        }

        $pdo->beginTransaction();

        // Update book information
        $stmt = $pdo->prepare("UPDATE books SET title = :title, price = :price, stock = :stock, description = :description, category = :category,
                              updated_at = NOW()
                              WHERE book_id = :book_id");

        $stmt->execute([
            "title"       => $title,
            "price"       => $price,
            "stock"       => $stock,
            "description" => $description,
            "category"    => $category,
            "book_id"     => $bookId,
        ]);

        // Delete existing authors
        $stmt = $pdo->prepare("DELETE FROM authors WHERE book_id = :book_id");
        $stmt->execute(["book_id" => $bookId]);

        // Insert new authors
        $stmt = $pdo->prepare("INSERT INTO authors(book_id, author_name) VALUES (:book_id, :author)");
        foreach ($authorsArray as $author) {
            $stmt->execute(["book_id" => $bookId, "author" => trim($author)]);
        }

        $pdo->commit();
        $response['success']  = true;
        $response['message']  = 'Book Updated Successfully!';
        $response['redirect'] = 'adminDashboard.html';
    } catch (PDOException $e) {
        $pdo->rollBack();
        throw new Exception("Error updating data: " . $e->getMessage());
    }
} catch (Exception $e) {
    $response["message"] = $e->getMessage();
}

echo json_encode($response);
