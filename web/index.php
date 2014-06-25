<?php
$wallblog = require __DIR__ . '/../src/wallblog.php';

$api = require __DIR__ . '/../src/controllers/api.php';
$apiV2 = require __DIR__ . '/../src/controllers/api_v2.php';

$wallblog->mount('/api', $api);
$wallblog->mount('/api/2/', $apiV2);

$wallblog->run();
?>