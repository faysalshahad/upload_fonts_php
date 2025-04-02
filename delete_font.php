<?php
require_once 'FontManager.php';
header('Content-Type: application/json');

try {
    if (empty($_POST['id'])) {
        throw new Exception('No font ID provided.');
    }
    
    $fontManager = new FontManager();
    $success = $fontManager->deleteFont($_POST['id']);
    
    echo json_encode([
        'success' => $success,
        'message' => $success ? 'Font deleted successfully.' : 'Failed to delete font.'
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>