<?php
$wallblog = require __DIR__ . '/../src/wallblog.php';
$api = require __DIR__ . '/../src/controllers/api.php';
$wallblog->mount('/api', $api);

$wallblog->run();
