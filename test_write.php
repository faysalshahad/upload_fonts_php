<?php
file_put_contents('uploads/test.txt', 'test content');
echo is_writable('uploads') ? 'Writable!' : 'Not writable!';
?>