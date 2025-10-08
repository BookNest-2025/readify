<?php
header('Content-Type: application/json; charset=utf-8');
require_once '../app/config/db.php';

try {

    $book       = isset($_GET['book']) ? trim($_GET['book']) : '';
    $author     = isset($_GET['author']) ? trim($_GET['author']) : '';
    $sort       = isset($_GET['sort']) ? trim($_GET['sort']) : '';
    $categories = isset($_GET['categories']) ? $_GET['categories'] : (isset($_GET['categories[]']) ? $_GET['categories[]'] : []);

    if ($book !== '' || $author !== '' || (! empty($categories) && is_array($categories))
    ) {
        if ($book === '' && $author === '' && (empty($categories) || ! is_array($categories))) {
            $sql = "
        SELECT
            b.book_id,
            b.title,
            b.price,
            b.stock,
            b.image,
            b.description,
            b.category,
            GROUP_CONCAT(DISTINCT a.author_name ORDER BY a.author_name SEPARATOR ', ') AS authors
        FROM books b
        LEFT JOIN authors a ON a.book_id = b.book_id
        WHERE b.status = 1
        GROUP BY b.book_id
        ORDER BY b.sold DESC, b.updated_at DESC
        LIMIT 15
    ";

            $stmt  = $pdo->query($sql);
            $books = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                'success' => true,
                'data'    => $books,
            ]);
            exit;
        }

    }

    $sql = "
        SELECT
            b.book_id,
            b.title,
            b.price,
            b.stock,
            b.image,
            b.description,
            b.category,
            GROUP_CONCAT(DISTINCT a.author_name ORDER BY a.author_name SEPARATOR ', ') AS authors
        FROM books b
        LEFT JOIN authors a ON a.book_id = b.book_id
        WHERE b.status = 1
    ";

    $params = [];

    if ($book !== '') {
        $sql .= " AND b.title LIKE :book";
        $params[':book'] = '%' . $book . '%';
    }
    if ($author !== '') {
        $sql .= " AND EXISTS (SELECT 1 FROM authors ax WHERE ax.book_id = b.book_id AND ax.author_name LIKE :author)";
        $params[':author'] = '%' . $author . '%';
    }

    if (! empty($categories) && is_array($categories)) {
        $placeholders = [];
        foreach ($categories as $i => $cat) {
            $key            = ":cat" . $i;
            $placeholders[] = $key;
            $params[$key]   = $cat;
        }
        if (! empty($placeholders)) {
            $sql .= " AND b.category IN (" . implode(", ", $placeholders) . ")";
        }
    }

    $sql .= " GROUP BY b.book_id";

    if ($sort === 'price-low') {
        $sql .= " ORDER BY b.price ASC";
    } elseif ($sort === 'price-high') {
        $sql .= " ORDER BY b.price DESC";
    } elseif ($sort === 'newest') {
        $sql .= " ORDER BY b.updated_at DESC";
    } elseif ($sort === 'popular') {
        $sql .= " ORDER BY b.sold DESC, b.updated_at DESC";
    } else {
        $sql .= " ORDER BY b.updated_at DESC";
    }

    $sql .= " LIMIT 20";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $books = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response = [
        'success' => true,
        'data'    => $books,
    ];

} catch (Exception $e) {
    $response['error'] = $e->getMessage();
}

echo json_encode($response);
