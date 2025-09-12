<?php
include "../app/config/db.php";
session_start();

header("Content-Type: application/json");
$response = ["isLoggedIn" => false, "category" => ""];

if (isset($_SESSION['email'])) {
    $response['isLoggedIn'] = true;
    $response['category']   = $_SESSION['user_type'];
}
echo json_encode($response);
