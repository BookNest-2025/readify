<?php
header('Content-Type: application/json');

include "../app/config/db.php";

$response = ["success" => false, "message" => "", "error" => "", "redirect" => ""];

try {
    $sql  = "SELECT r.date,r.review,r.rating,c.name, c.photo FROM reviews r JOIN customers c ON r.customer_id = c.customer_id ORDER BY r.date DESC LIMIT 20";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $reviews = $stmt->fetchAll();

    $response['success'] = true;
    $response['data']    = $reviews;

} catch (PDOException $e) {
    $response['error'] = "Database error.";
} catch (Exception $e) {
    $response['error'] = $e->getMessage();
}
echo json_encode($response);
