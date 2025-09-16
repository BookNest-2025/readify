<?php

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(403);
    exit("Forbidden");
}

include "../app/config/db.php";
session_start();

header("Content-Type: application/json");
$response = ["success" => false, "message" => "", "error" => "", "redirect" => "", "data" => []];

try {
    if (! isset($_SESSION["email"]) || ! isset($_SESSION["user_type"])) {
        $response["redirect"] = "login.html";
        throw new Exception("Please login to view orders.");
    }

    if ($_SESSION["user_type"] !== "admin") {
        $response["redirect"] = "login.html";
        throw new Exception("You should login as admin to view orders.");
    }

} catch (Exception $e) {
    $response["error"] = $e->getMessage();
}

echo json_encode($response);
