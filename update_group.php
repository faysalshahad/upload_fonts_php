<?php
require_once 'FontManager.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    if (empty($_POST['id'])) {
        throw new Exception('Group ID is required');
    }
    
    if (empty($_POST['name'])) {
        throw new Exception('Group name is required');
    }
    
    if (empty($_POST['font_ids'])) {
        throw new Exception('At least two fonts are required');
    }
    
    $fontIds = explode(',', $_POST['font_ids']);
    if (count($fontIds) < 2) {
        throw new Exception('At least two fonts are required');
    }

    $fontManager = new FontManager();
    $success = $fontManager->updateFontGroup($_POST['id'], $_POST['name'], $fontIds);
    
    echo json_encode([
        'success' => $success,
        'message' => $success ? 'Group updated successfully' : 'Failed to update group'
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>