<?php
// backend/checkAuth.php
session_start();
header('Content-Type: application/json');

// Check if user is logged in
if (isset($_SESSION["customer_id"])) {
    echo json_encode([
        'success' => true,
        'logged_in' => true,
        'customer_id' => $_SESSION["customer_id"]
    ]);
} else {
    echo json_encode([
        'success' => true,
        'logged_in' => false,
        'message' => 'Not logged in'
    ]);
}
