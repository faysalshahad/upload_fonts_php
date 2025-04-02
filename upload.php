<?php
require_once 'FontManager.php';

// Important headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Create uploads directory if it doesn't exist
if (!file_exists('uploads')) {
    mkdir('uploads', 0755, true);
}

try {
    // Verify file upload
    if (!isset($_FILES['font']) || !is_uploaded_file($_FILES['font']['tmp_name'])) {
        throw new Exception('No file uploaded or upload failed');
    }

    // Check for upload errors
    if ($_FILES['font']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('Upload error: ' . $_FILES['font']['error']);
    }

    // Verify file type
    $fileExt = strtolower(pathinfo($_FILES['font']['name'], PATHINFO_EXTENSION));
    if ($fileExt !== 'ttf') {
        throw new Exception('Only .ttf files are allowed');
    }

    // Verify file size (max 10MB)
    if ($_FILES['font']['size'] > 10 * 1024 * 1024) {
        throw new Exception('File too large. Maximum size is 10MB');
    }

    // Process upload
    $fontManager = new FontManager();
    $result = $fontManager->uploadFont($_FILES['font']);
    
    // Successful response
    echo json_encode([
        'success' => true,
        'data' => [
            'id' => $result['id'],
            'name' => $result['name']
        ]
    ]);
    
} catch (Exception $e) {
    // Error response
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>