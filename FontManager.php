<?php
class FontManager {
    private $dbFile = 'fonts.db';
    // private $uploadDir = 'uploads/';
    private $uploadDir = __DIR__ . '/uploads/';

    public function __construct() {
        if (!file_exists($this->dbFile)) {
            $this->initializeDatabase();
        }
        if (!file_exists($this->uploadDir)) {
            mkdir($this->uploadDir, 0777, true);
        }
    }

    private function initializeDatabase() {
        $pdo = $this->getPDO();
        $pdo->exec("CREATE TABLE fonts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            file_path TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        $pdo->exec("CREATE TABLE font_groups (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            font_ids TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");
    }

    private function getPDO() {
        return new PDO("sqlite:" . $this->dbFile);
    }

    public function uploadFont($file) {
        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new Exception("Upload error: " . $file['error']);
        }

        $fileExt = pathinfo($file['name'], PATHINFO_EXTENSION);
        if (strtolower($fileExt) !== 'ttf') {
            throw new Exception("Only TTF files are allowed.");
        }

        $fontName = pathinfo($file['name'], PATHINFO_FILENAME);
        $targetPath = $this->uploadDir . uniqid() . '_' . $file['name'];

        if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
            throw new Exception("Failed to move uploaded file.");
        }

        $pdo = $this->getPDO();
        $stmt = $pdo->prepare("INSERT INTO fonts (name, file_path) VALUES (?, ?)");
        $stmt->execute([$fontName, $targetPath]);

        return [
            'id' => $pdo->lastInsertId(),
            'name' => $fontName,
            'file_path' => $targetPath
        ];
    }

    public function deleteFont($id) {
        $pdo = $this->getPDO();
        
        // Get file path first
        $stmt = $pdo->prepare("SELECT file_path FROM fonts WHERE id = ?");
        $stmt->execute([$id]);
        $font = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($font) {
            // Delete from database
            $stmt = $pdo->prepare("DELETE FROM fonts WHERE id = ?");
            $stmt->execute([$id]);
            
            // Delete file
            if (file_exists($font['file_path'])) {
                unlink($font['file_path']);
            }
            
            return true;
        }
        
        return false;
    }

    public function getAllFonts() {
        $pdo = $this->getPDO();
        $stmt = $pdo->query("SELECT id, name FROM fonts ORDER BY name");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function createFontGroup($name, $fontIds) {
        if (count($fontIds) < 2) {
            throw new Exception("At least two fonts are required to create a group.");
        }

        $pdo = $this->getPDO();
        $stmt = $pdo->prepare("INSERT INTO font_groups (name, font_ids) VALUES (?, ?)");
        $fontIdsStr = implode(',', $fontIds);
        $stmt->execute([$name, $fontIdsStr]);

        return $pdo->lastInsertId();
    }

    public function deleteFontGroup($id) {
        $pdo = $this->getPDO();
        $stmt = $pdo->prepare("DELETE FROM font_groups WHERE id = ?");
        return $stmt->execute([$id]);
    }

    public function getAllFontGroups() {
        $pdo = $this->getPDO();
        $stmt = $pdo->query("
            SELECT 
                fg.id, 
                fg.name, 
                fg.font_ids,
                GROUP_CONCAT(f.name, ', ') AS fonts,
                COUNT(f.id) AS count
            FROM font_groups fg
            LEFT JOIN fonts f ON f.id IN (SELECT value FROM json_each('[' || replace(fg.font_ids, ',', ',') || ']'))
            GROUP BY fg.id
            ORDER BY fg.created_at DESC
        ");
        
        $groups = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // For SQLite versions that don't support json_each
        if (empty($groups) || empty($groups[0]['fonts'])) {
            $groups = $pdo->query("SELECT id, name, font_ids FROM font_groups ORDER BY created_at DESC")->fetchAll(PDO::FETCH_ASSOC);
            foreach ($groups as &$group) {
                $fontIds = explode(',', $group['font_ids']);
                $group['count'] = count($fontIds);
                
                $fontNames = [];
                foreach ($fontIds as $id) {
                    $stmt = $pdo->prepare("SELECT name FROM fonts WHERE id = ?");
                    $stmt->execute([$id]);
                    $font = $stmt->fetch(PDO::FETCH_ASSOC);
                    if ($font) {
                        $fontNames[] = $font['name'];
                    }
                }
                
                $group['fonts'] = implode(', ', $fontNames);
            }
        }
        
        return $groups;
    }
    public function updateFontGroup($groupId, $name, $fontIds) {
        if (count($fontIds) < 2) {
            throw new Exception("At least two fonts are required to update a group.");
        }
    
        $pdo = $this->getPDO();
        $stmt = $pdo->prepare("UPDATE font_groups SET name = ?, font_ids = ? WHERE id = ?");
        $fontIdsStr = implode(',', $fontIds);
        return $stmt->execute([$name, $fontIdsStr, $groupId]);
    }
}
?>