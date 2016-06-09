<?php

/** Bootstraping */
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/services/JSonService.php';
require_once __DIR__ . '/services/UserService.php';
require_once __DIR__ . '/services/PictureService.php';
require_once __DIR__ . '/services/CommentService.php';
require_once __DIR__ . '/services/LikeService.php';

include __DIR__ . '/config.php';

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$app = new Silex\Application();
$app['debug'] = true;

date_default_timezone_set("Europe/Paris");

/** Extensions */
$app->register(new Silex\Provider\DoctrineServiceProvider(), array(
    'db.options' => array(
        'driver'    => 'pdo_sqlite',
        'path'      => __DIR__.'/../tests/app.db',
        'charset' => 'utf8'
    ),
    'db.dbal.class_path' => __DIR__ . '/../vendor/doctrine-dbal/lib',
    'db.common.class_path' => __DIR__ . '/../vendor/doctrine-common/lib'
));

$app->register(new Silex\Provider\MonologServiceProvider(), array(
    'monolog.logfile' => __DIR__ . '/../tests/app.log',
    'monolog.name' => 'app',
    'monolog.level' => 100 // Logger::DEBUG
));

$app->register(new Silex\Provider\SessionServiceProvider(), array(
    'lifetime' => 1800 // 30 min
));

$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/../views',
    'twig.class_path' => __DIR__ . '/../vendor/twig/lib'
));

/** Services */
$app['picture_service'] = $app->share(function() use ($app, $config) {
    return new services\PictureService($app['db'], $app['monolog'], $config);
});
$app['user_service'] = $app->share(function() use ($app, $config) {
    return new services\UserService($app['db'], $app['monolog'], $config);
});
$app['comment_service'] = $app->share(function() use ($app, $config) {
    return new services\CommentService($app['db'], $app['monolog'], $config);
});
$app['like_service'] = $app->share(function() use ($app, $config) {
    return new services\LikeService($app['db'], $app['monolog'], $config);
});
$app['json'] = $app->share(function() {
    return new services\JSonService();
});

/** Routes */
require __DIR__.'/routes.php';

return $app;
