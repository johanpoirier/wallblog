<?php
$wallblog = require __DIR__ . '/../src/wallblog.php';
$wallblog->mount('/api', new controllers\ApiController());

$wallblog->run();
?>