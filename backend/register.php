<?php

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(403);
    exit("Forbidden");
}

include "../app/config/db.php";
include "./includes/functions.php";
session_start();

//tells browser server is sending json format data rather than plain html or text.
header("Content-Type: application/json");

$response = ["success" => false, "error" => "", "redirect" => ""];

try {
    //checks if user already logged in or not?
    if (isset($_SESSION['email'])) {
        $response['redirect'] = 'index.html';
        throw new Exception('Already logged in. Please log out to register.');
    }

    $file      = $_FILES["profilePhoto"] ?? '';
    $fname     = $_POST["fname"] ?? '';
    $lname     = $_POST["lname"] ?? '';
    $email     = $_POST['email'] ?? '';
    $address   = $_POST['address'] ?? '';
    $tellno    = $_POST['tellno'] ?? '';
    $password  = $_POST['password'] ?? '';
    $passwordC = $_POST['passwordC'] ?? '';

    // checks any values are empty or not?
    if (! $fname || ! $lname || ! $email || ! $tellno || ! $address || ! $password || ! $passwordC) {
        throw new Exception('Please fill in all fields.');
    }

    // checks email is valid or not?
    if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Email is not valid.');
    }

    // checks paswords are equal or not?
    if ($password !== $passwordC) {
        throw new Exception('Passwords do not match.');
    }

    // checks email is already taken or not?
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);

    if ($stmt->fetch()) {
        throw new Exception('Email already taken.');
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    $name         = $fname . " " . $lname;
    $uploadDir    = "profile";
    $photo        = "";

    if (! empty($file) && $file['error'] === UPLOAD_ERR_OK && $file['size'] > 0) {
        $photo = moveFile($file, $uploadDir);
    }

    try { // Use transaction for atomic insert. all queries after will not be permenetly written until use commit.
        $pdo->beginTransaction();

        // Insert into users
        $stmt = $pdo->prepare("INSERT INTO users (email, password, category) VALUES (:email, :password, :category)");
        $stmt->execute(['email' => $email, 'password' => $passwordHash, 'category' => "customers"]);

        // Insert into specific category table
        if ($photo) {
            $stmt = $pdo->prepare("INSERT INTO customers (email, name, address, telno, photo) VALUES (:email, :name, :address, :tellno, :photo)");
            $stmt->execute(["email" => $email, "name" => $name, "address" => $address, "tellno" => $tellno, "photo" => $photo]);
        } else {
            $stmt = $pdo->prepare("INSERT INTO customers (email, name, address, telno) VALUES (:email, :name, :address, :tellno)");
            $stmt->execute(["email" => $email, "name" => $name, "address" => $address, "tellno" => $tellno]);

        }

        $pdo->commit();
        $response['success']  = true;
        $response['message']  = 'Registerd Successfully!<br>Directiong to Login page...';
        $response['redirect'] = 'login.html';
    } catch (PDOException $e) {
        // if any error occures after transaction process start, rollback them to avoid saving missing data.
        $pdo->rollBack();
        deleteUploadedFile($photo);
        throw new Exception("Registration faild! Please try again.");
    }

} catch (Exception $e) {
    $response['error'] = $e->getMessage();
}

echo json_encode($response);
