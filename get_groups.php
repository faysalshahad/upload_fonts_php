<?php
require_once 'FontManager.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    $fontManager = new FontManager();
    $groups = $fontManager->getAllFontGroups();
    
    echo json_encode([
        'success' => true,
        'data' => $groups
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>