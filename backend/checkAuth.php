<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION["email"])) {
    echo json_encode([
        'success'     => true,
        'logged_in'   => true,
        'customer_id' => $_SESSION["customer_id"],
    ]);
} else {
    echo json_encode([
        'success'   => true,
        'logged_in' => false,
        'message'   => 'Not logged in',
    ]);
}
