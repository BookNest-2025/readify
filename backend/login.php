<?php

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(403);
    exit("Forbidden");
}

include "../app/config/db.php";
session_start();

//tells browser server is sending json format data rather than plain html or text.
header("Content-Type: application/json");

$response = ["success" => false, "message" => "", "error" => "", "redirect" => ""];

try {

    // checks already login or not
    if (isset($_SESSION['email'])) {
        $response['redirect'] = 'index.html';
        throw new Exception('Already logged in.');
    }

    $email    = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    // checks all fields are filled or not
    if (! $email || ! $password) {
        throw new Exception('Please fill in all fields.');
    }

    //checks if email is a valid email or not
    if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Please enter a valid email.');
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    //checks not available user or password is not match
    if (! $user || ! password_verify($password, $user['password'])) {
        throw new Exception('Please enter a valid email & password.');
    }

    //success all
    $response["success"] = true;
    if ($user['category'] === 'customers') {
        $response["redirect"] = "index.html";
        $response["message"]  = "Login successfully!.<br>Directing to the Homepage...";

    } else {
        $response["redirect"] = "adminDashboard.html";
        $response["message"]  = "Login successfully!.<br>Directing to the Dashboard...";

    }
    $_SESSION['user_type'] = $user['category'];
    $_SESSION['email']     = $email;
} catch (Exception $e) {
    $response['error'] = $e->getMessage();
}

echo json_encode($response);
