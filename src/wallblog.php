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
        'driver' => 'pdo_mysql',
        'host' => $config["host"],
        'dbname' => $config["dbname"],
        'user' => $config["user"],
        'password' => $config["password"],
        'charset' => 'utf8'
    ),
    'db.dbal.class_path' => __DIR__ . '/../vendor/doctrine-dbal/lib',
    'db.common.class_path' => __DIR__ . '/../vendor/doctrine-common/lib'
));

$app->register(new Silex\Provider\MonologServiceProvider(), array(
    'monolog.class_path' => __DIR__ . '/../vendor/monolog/src',
    'monolog.logfile' => __DIR__ . '/../logs/app.log',
    'monolog.name' => 'app',
    'monolog.level' => 100 // Logger::DEBUG
));

$app->register(new Silex\Provider\SessionServiceProvider(), array(
    'lifetime' => 1800 // 30 min
));

/** Services */
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
$app->get('/', function() use($app) {
    return $app->redirect('/app.html');
});

$app->post('/login', function(Request $request) use($app) {
    $email = $app->escape($request->get('email'));
    $password = $request->get('password');
    $user = $app['user_service']->login($email, $password);
    
    if ($user) {
        $app['session']->set('email', $user['email']);
        $app['monolog']->addDebug("Login success : session " . $request->getSession()->getId());
        return new Response($user['id'], 200);
    } else {
        $app['monolog']->addDebug("Login failed : user not found");
        return new Response("user not found", 404);
    }
});

$app->get('/user', function(Request $request) use($app) {
    $user = false;
    if($request->hasSession()) {
        $loggedUserEmail = $request->getSession()->get('email');
        $user = $app['user_service']->getByEmail($loggedUserEmail);
        $user['password'] = '';
    }
    
    if($user) {
        return json_encode($user);
    }
    else {
        return new Response("user not logged", 500);
    }
});

return $app;
?>