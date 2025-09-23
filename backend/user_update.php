<?php

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(403);
    exit("Forbidden");
}

include "../app/config/db.php";
include "./includes/functions.php";
session_start();

header("Content-Type: application/json");

$response = ["success" => false, "error" => "", "redirect" => ""];

try {
    if (! isset($_SESSION['email'])) {
        $response['redirect'] = 'index.html';
        throw new Exception('Log in first to update profile');
    }

    $file    = $_FILES["profilePhoto"] ?? null;
    $name    = $_POST["name"] ?? '';
    $address = $_POST['address'] ?? '';
    $telno   = $_POST['telno'] ?? '';

    if (! $name || ! $telno || ! $address) {
        throw new Exception('Please fill in all fields.');
    }

    $stmt = $pdo->prepare("SELECT * FROM customers WHERE email = :email");
    $stmt->execute(['email' => $_SESSION['email']]);
    $customer = $stmt->fetch();

    if (! $customer) {
        throw new Exception("User not found.");
    }

    $photoOld  = $customer['photo'];
    $photo     = $photoOld;
    $uploadDir = "profile";

    if (! empty($file) && $file['error'] === UPLOAD_ERR_OK && $file['size'] > 0) {
        $photo = moveFile($file, $uploadDir);
    }

    $stmt = $pdo->prepare("
        UPDATE customers
        SET name = :name, address = :address, telno = :telno, photo = :photo
        WHERE email = :email
    ");

    $stmt->execute([
        "name"    => $name,
        "address" => $address,
        "telno"   => $telno,
        "photo"   => $photo,
        "email"   => $_SESSION['email'],
    ]);

    if ($photo !== $photoOld) {
        deleteUploadedFile($photoOld);
    }

    $response['success']  = true;
    $response['message']  = 'Profile updated successfully!<br>Redirecting to Profile';
    $response['redirect'] = 'profile.html';

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    if (! empty($file) && $photo !== $photoOld) {
        deleteUploadedFile($photo);
    }
    $response['error'] = $e->getMessage();
}

echo json_encode($response);
