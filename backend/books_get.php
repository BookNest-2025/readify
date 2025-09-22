<?php

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(403);
    exit("Forbidden");
}

include "../app/config/db.php";

header("Content-Type: application/json");

$response = ["success" => false, "error" => "", "books" => []];

try {

    if (isset($_GET['param'])) {
        $param = $_GET['param'];
        $stmt  = null;
        if ($param === "new-arrived") {
            $stmt = $pdo->prepare("SELECT * FROM books WHERE status = 1 ORDER BY updated_at DESC LIMIT 12");
        }
        if ($param === "populer") {
            $stmt = $pdo->prepare("SELECT * FROM books WHERE status = 1 ORDER BY sold DESC LIMIT 12");
        }
        if (! $stmt) {
            throw new Exception("Please enter which book type neded with params.");
        }
        $stmt->execute();
        $results = $stmt->fetchAll();

        foreach ($results as &$result) {
            $stmtAuthor = $pdo->prepare("SELECT author_name FROM authors WHERE book_id = :book_id");
            $stmtAuthor->execute(["book_id" => $result['book_id']]);
            $authors = $stmtAuthor->fetchAll();
            foreach ($authors as $author) {
                $result['authors'][] = $author['author_name'];
            }
        }
        unset($result);

        $response = [
            'success' => true,
            'books'   => $results,
        ];
    }

    if (isset($_GET['id'])) {
        $id   = $_GET['id'];
        $book = "";
        try {
            $stmt = $pdo->prepare("SELECT * FROM books WHERE book_id = :id");
            $stmt->execute(["id" => $id]);
            $book = $stmt->fetch();
        } catch (PDOException $e) {
            $response["error"] = "Book ID can not find";
        }
        $stmtAuthor = $pdo->prepare("SELECT author_name FROM authors WHERE book_id = :id");
        $stmtAuthor->execute(['id' => $id]);
        $authors = $stmtAuthor->fetchAll();
        foreach ($authors as $author) {
            $book['authors'][] = $author['author_name'];
        }
        $response = [
            'success' => true,
            'books'   => $book,
        ];

    }

} catch (Exception $e) {
    $response['error'] = $e->getMessage();

}

echo json_encode($response);
