<?php
require_once 'FontManager.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    if (empty($_POST['id'])) {
        throw new Exception('Group ID is required');
    }

    $fontManager = new FontManager();
    $success = $fontManager->deleteFontGroup($_POST['id']);
    
    echo json_encode([
        'success' => $success,
        'message' => $success ? 'Group deleted successfully' : 'Failed to delete group'
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>