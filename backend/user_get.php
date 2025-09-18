<?php

include "../app/config/db.php";
session_start();
header("Content-Type: application/json");

$response = ["success" => false, "message" => "", "error" => "", "redirect" => ""];

try {
    if (! isset($_SESSION["email"]) || ! isset($_SESSION["user_type"])) {
        $response["redirect"] = "login.html";
        throw new Exception("Please login to view user data.");
    }

    try {
        $stmtCustomer = $pdo->prepare("SELECT * FROM customers WHERE email = :email");
        $stmtCustomer->execute(["email" => $_SESSION['email']]);
        $customer = $stmtCustomer->fetch();

        if (! $customer) {
            throw new Exception("Customer not found.");
        }

        $response["data"]    = $customer;
        $response['success'] = true;

    } catch (PDOException $e) {
        $response["error"] = "Error Fetching user Data.<br>Please try again.";

    }

} catch (Exception $e) {
    $response["error"] = $e->getMessage();
}

echo json_encode($response);
