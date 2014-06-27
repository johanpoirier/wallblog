<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$app->post('/auth/login', function(Request $request) use($app) {
    $email = $app->escape($request->get('email'));
    $password = $request->get('password');
    $user = $app['user_service']->login($email, $password);

    if ($user) {
        $app['session']->set('email', $user['email']);
        $app['monolog']->addDebug("Login success : session " . $request->getSession()->getId());

        $response = new Response($user['id'], 200);
        $response->headers->set('Access-Control-Allow-Origin', '*');
        return $response;
    } else {
        $app['monolog']->addDebug("Login failed : user not found");
        $response = new Response("user not found", 404);
        $response->headers->set('Access-Control-Allow-Origin', '*');
        return $response;
    }
});

$app->get('/rss', function () use ($app) {
    $items = $app['picture_service']->get(20, 0);
    $response = new Response();
    $response->headers->set('Content-type', 'application/rss+xml; charset=utf-8');
    return $app['twig']->render('rss.twig', array("now" => date("D, d M Y H:i:s T"), "items" => $items), $response);
});

$app->get('/rssComment', function () use ($app) {
    $items = $app['comment_service']->getLast(7);
    $response = new Response();
    $response->headers->set('Content-type', 'application/rss+xml; charset=utf-8');
    return $app['twig']->render('rss-comment.twig', array("now" => date("D, d M Y H:i:s T"), "items" => $items), $response);
});

?>
