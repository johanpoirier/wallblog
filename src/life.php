<?php

/** Bootstraping */
require_once __DIR__ . '/../vendor/Silex/silex.phar';
include __DIR__ . '/config.php';

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use services\PictureService;
use services\UserService;
use services\CommentService;

$app = new Silex\Application();
$app['debug'] = true;

$app['autoloader']->registerPrefixes(array('Twig_Extensions_'  => array(__DIR__.'/../vendor/Twig-extensions/lib')));

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
    'monolog.logfile' => __DIR__ . 'app.log',//'/../logs/app.log',
    'monolog.name' => 'app',
    'monolog.level' => 100 // Logger::DEBUG
));

$app->register(new Silex\Provider\SessionServiceProvider(), array(
    'lifetime' => 1800 // 30 min
));

$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__ . '/../views',
    'twig.class_path' => __DIR__ . '/../vendor/twig/lib',
));

$oldTwigConfiguration = isset($app['twig.configure']) ? $app['twig.configure']: function(){};
$app['twig.configure'] = $app->protect(function($twig) use ($oldTwigConfiguration) {
    $oldTwigConfiguration($twig);
    $twig->addExtension(new Twig_Extensions_Extension_Text());
});

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


/** App Definition */
$app->get('/', function () use ($app) {
    $columns = array(array(), array(), array());
    $pictures = $app['picture_service']->get(9, 0);
    $columnIndex = 0;
    foreach ($pictures as $picture) {
        //$app['monolog']->debug("picture: $picture");
        array_push($columns[$columnIndex], $picture);
        $columnIndex++;
        if ($columnIndex == 3) {
           $columnIndex = 0;
        }
    }
    return $app['twig']->render('wall.twig', array("columns" => $columns));
});

$app->get('/item/{id}', function ($id) use ($app) {
    $picture = $app['picture_service']->getById($id);
    $comments = $app['comment_service']->getByItem($id);
    return $app['twig']->render('picture.twig', array("picture" => $picture, "comments" => $comments, "currentDate" => date("\\l\\e d/m/Y à H\\hi")));
});

$app->post("/login", function(Request $request) use($app) {
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

$app->get('/rss', function () use ($app) {
    $items = $app['picture_service']->get(20, 0);
    $response = new Response();
    $response->headers->set('Content-type', 'application/rss+xml; charset=utf-8');
    return $app['twig']->render('rss.twig', array("now" => date("D, d M Y H:i:s T"), "items" => $items), $response);
});

$app->get('/api/more/{index}', function ($index) use ($app) {
    $pictures = $app['picture_service']->get(1, $index);
    return json_encode($pictures);
});

$app->get('/api/picture/{id}', function ($id) use ($app) {
    $picture = $app['picture_service']->getById($id);
    $comments = $app['comment_service']->getByItem($id);
    return $app['twig']->render('comments.twig', array("picture" => $picture, "comments" => $comments, "currentDate" => date("\\l\\e d/m/Y à H\\hi")));
});
$app->post('/api/picture/{id}/comment', function (Request $request) use ($app) {
    $app['monolog']->addDebug($request->getContent());
    $jsonComment = json_decode($request->getContent(), true);
    $comment = $app['comment_service']->add($jsonComment);
    return $app['twig']->render('comment.twig', array("comment" => $comment));
});

$app->get('/api/video', function () use ($app) {
    return $app['twig']->render('video.html');
});

$app->get('/api/currentuser', function(Request $request) use($app) {
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

$app->post('/api/upload', function (Request $request) use ($app) {
    if($request->hasSession()) {
        $user = $app['user_service']->getByEmail($request->getSession()->get('email'));
        if($user) {
            $upload_dir = '../web/pictures/';
            $allowed_ext = array('jpg', 'jpeg', 'png', 'mp4');

            if(array_key_exists('pic', $_FILES) && $_FILES['pic']['error'] == 0) {
                $pic = $_FILES['pic'];
                $description = $request->get('description');
                if(!in_array($app['picture_service']->getExtension($pic['name']), $allowed_ext)){
                    return json_encode(array('status' => 'Only ' . implode(',', $allowed_ext) . ' files are allowed!'));
                }	

                if(move_uploaded_file($pic['tmp_name'], $upload_dir.$pic['name'])) {
                    $app['picture_service']->add($pic['name'], $description);
                    return json_encode(array('status' => 'File was uploaded successfuly!'));
                }
            }
        }
    }
});

return $app;
?>