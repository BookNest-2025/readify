<?php

function moveFile($file, $uploadDir)
{
    $dir = "../public/uploads/" . $uploadDir;
    if (! is_dir($dir)) {
        mkdir($dir, 0777, true);
    }

    $filename = time() . "_" . str_replace(' ', '', basename($file['name']));

    $targetFile = $dir . "/" . $filename;

    $allowed = ['jpg', 'png', 'jpeg'];
    $ext     = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

    if (! in_array($ext, $allowed)) {
        throw new Exception("Invalid file type. Allowed: jpg, png, jpeg.");
    }

    if ($file['size'] > 5 * 1024 * 1024) {
        throw new Exception("File too large. Max size 5MB.");
    }

    if (move_uploaded_file($file['tmp_name'], $targetFile)) {
        $response["message"] = "File uploaded successfully!";
    } else {
        throw new Exception("Error upload File." . $dir);
    }

    return $uploadDir . "/" . $filename;
}

function deleteUploadedFile($photo)
{
    if (file_exists("../public/uploads/" . $photo)) {
        unlink("../public/uploads/" . $photo);
    }
}
