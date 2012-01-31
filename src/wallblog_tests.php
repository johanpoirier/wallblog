<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use services\PictureService;
use services\UserService;
use services\CommentService;

/** Bootstraping */
require_once __DIR__ . '/../vendor/Silex/silex.phar';
include __DIR__ . '/config.php';

$app = new Silex\Application();
$app['debug'] = true;

/** Autoloading */
$app['autoloader']->registerNamespace( 'services', __DIR__ . '/.' );
$app['autoloader']->registerNamespace( 'controllers', __DIR__ . '/.' );

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
    'monolog.class_path' => __DIR__ . '/../vendor/monolog/src',
    'monolog.logfile' => __DIR__ . '/../tests/app.log',
    'monolog.name' => 'app',
    'monolog.level' => 100 // Logger::DEBUG
));

$app->register(new Silex\Provider\SessionServiceProvider(), array(
    'lifetime' => 1800 // 30 min
));

/** Services */
$app['autoloader']->registerNamespace('services', __DIR__);
$app['picture_service'] = $app->share(function() use ($app) {
    return new PictureService($app['db'], $app['monolog']);
});
$app['user_service'] = $app->share(function() use ($app) {
    return new UserService($app['db'], $app['monolog']);
});
$app['comment_service'] = $app->share(function() use ($app) {
    return new CommentService($app['db'], $app['monolog']);
});

/** Routes */
require __DIR__.'/routes.php';

return $app;
?>