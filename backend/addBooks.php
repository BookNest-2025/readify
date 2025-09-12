<?php

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(403);
    exit("Forbidden");
}

include "../app/config/db.php";
include "./includes/functions.php";
session_start();

header("Content-Type: application/json");
$response = ["success" => false, "message" => "", "error" => "", "redirect" => ""];

try {
    if (! isset($_SESSION["email"]) || ! isset($_SESSION["user_type"])) {
        $response["redirect"] = "login.html";
        throw new Exception("Please login to add books.");
    }

    if ($_SESSION["user_type"] !== "admin") {
        $response["redirect"] = "login.html";
        throw new Exception("You should login as admin to add books.");
    }

    $file        = $_FILES["poster"] ?? "";
    $title       = trim($_POST["title"]) ?? "";
    $price       = trim($_POST["price"]) ?? '0';
    $quantity    = trim($_POST["quantity"]) ?? '0';
    $description = trim($_POST["description"]) ?? "";
    $category    = trim($_POST["category"]) ?? "";
    $authors     = trim($_POST["authors"]) ?? "";

    if (! $file || ! $title || ! $description || ! $category || ! $authors) {
        throw new Exception("Please fill in all fields.");
    }

    if ($price <= 0) {
        throw new Exception("Price should be greater than 0.");
    }

    if ($quantity <= 0) {
        throw new Exception("Quantity should be greater than 0.");
    }

    $uploadDir = "books";
    $photo     = "";
    if (! empty($file) && $file['error'] === UPLOAD_ERR_OK && $file['size'] > 0) {
        $photo = moveFile($file, $uploadDir);
    }

    try {
        $authors = array_map('trim', explode(",", $authors));

        if (empty($authors[0])) {
            throw new Exception("Please enter authors correctly<br>
            For an example: author1, author2");
        }
        $pdo->beginTransaction();

        $stmt = $pdo->prepare("INSERT INTO books (title, price, image, stock, category, description) VALUES (:title, :price, :img_path, :quantity, :category, :description)");
        $stmt->execute(["title" => $title, "price" => $price, "img_path" => $photo, "quantity" => $quantity, "description" => $description, "category" => $category]);

        $bookId = $pdo->lastInsertId();

        $stmt = $pdo->prepare("INSERT INTO authors(book_id, author_name) VALUES (:bookid, :author)");
        foreach ($authors as $author) {
            $stmt->execute(["bookid" => $bookId, "author" => trim($author
            )]);
        }

        $pdo->commit();
        $response['success']  = true;
        $response['message']  = 'Book Added Successfully!.<br>Directing to Homepage...';
        $response['redirect'] = 'adminDashboard.html';
    } catch (PDOException $e) {
        deleteUploadedFile($photo);
        $pdo->rollBack();
        throw new Exception("Error saving data.");
    }

} catch (Exception $e) {
    $response["error"] = $e->getMessage();
}

echo json_encode($response);
