<?php
require_once 'FontManager.php';
$fontManager = new FontManager();
$fonts = $fontManager->getAllFonts();
$fontGroups = $fontManager->getAllFontGroups();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Font Group Management System</title>
    <link rel="stylesheet" href="css/style.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <style>
        .drop-area {
            border: 2px dashed #ccc;
            padding: 30px;
            text-align: center;
            cursor: pointer;
            margin-bottom: 20px;
        }
        .drop-area.dragover {
            border-color: #666;
            background-color: #f0f0f0;
        }
        .error {
            color: red;
            display: none;
        }
        .font-group-row {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            gap: 10px;
        }
        .remove-row {
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 50%;
            width: 25px;
            height: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }
        .checkmark {
            color: green;
            font-weight: bold;
        }
        .btn-warning {
            background-color: #ffc107;
            color: #212529;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Font Upload Section -->
        <div class="section">
            <h2>Upload Font</h2>
            <div id="drop-area" class="drop-area">
                <p>Click to upload or drag and drop</p>
                <p>Only TTF File Allowed</p>
                <input type="file" id="font-upload" accept=".ttf" style="display: none;">
            </div>
            <div id="upload-status"></div>
        </div>

        <!-- Uploaded Fonts List -->
        <div class="section">
            <h2>Our Fonts</h2>
            <p>Browse a list of fonts to build your font group.</p>
            <table id="fonts-table" class="font-table">
                <thead>
                    <tr>
                        <th>FONT NAME</th>
                        <th>PREVIEW</th>
                        <th>ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($fonts as $font): ?>
                    <tr data-id="<?= htmlspecialchars($font['id']) ?>">
                        <td><?= htmlspecialchars($font['name']) ?></td>
                        <td style="font-family: '<?= htmlspecialchars($font['name']) ?>'">Example Style</td>
                        <td><button class="delete-font btn btn-sm btn-danger" data-id="<?= htmlspecialchars($font['id']) ?>">Delete</button></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>

        <!-- Create/Edit Font Group -->
        <div class="section">
            <h2 id="group-form-title">Create Font Group</h2>
            <p id="group-validation" class="error">You have to select at least two fonts</p>
            <div class="form-group">
                <label for="group-title">Group Title</label>
                <input type="text" id="group-title" placeholder="Enter group title" class="form-control">
            </div>
            <div id="font-group-rows">
                <div class="font-group-row" data-row="1">
                    <span>1</span>
                    <span>Font Name</span>
                    <select class="font-select form-control">
                        <option value="">Select a Font</option>
                        <?php foreach ($fonts as $font): ?>
                        <option value="<?= htmlspecialchars($font['id']) ?>"><?= htmlspecialchars($font['name']) ?></option>
                        <?php endforeach; ?>
                    </select>
                    <span class="checkmark">✓</span>
                </div>
            </div>
            <button id="add-row" class="btn btn-primary">Add Row</button>
            <button id="create-group" class="btn btn-success">Create</button>
            <button id="cancel-edit" class="btn btn-secondary" style="display: none;">Cancel</button>
        </div>

        <!-- Font Groups List -->
        <div class="section">
            <h2>Our Font Groups</h2>
            <p>List of all available font groups:</p>
            <table id="font-groups-table" class="font-table">
                <thead>
                    <tr>
                        <th>NAME</th>
                        <th>FONTS</th>
                        <th>COUNT</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($fontGroups as $group): ?>
                    <tr data-id="<?= htmlspecialchars($group['id']) ?>" data-font-ids="<?= htmlspecialchars($group['font_ids']) ?>">
                        <td><?= htmlspecialchars($group['name']) ?></td>
                        <td><?= htmlspecialchars($group['fonts']) ?></td>
                        <td><?= htmlspecialchars($group['count']) ?></td>
                        <td>
                            <button class="edit-group btn btn-sm btn-info" data-id="<?= htmlspecialchars($group['id']) ?>">Edit</button>
                            <button class="delete-group btn btn-sm btn-danger" data-id="<?= htmlspecialchars($group['id']) ?>">Delete</button>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>

    <script src="js/script.js"></script>
</body>
</html>