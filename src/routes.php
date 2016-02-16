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

$app->get('/rssComment', function () use ($app) {
    $items = $app['comment_service']->getLast(7);
    $response = new Response();
    $response->headers->set('Content-type', 'application/rss+xml; charset=utf-8');
    return $app['twig']->render('rss-comment.twig', array("now" => date("D, d M Y H:i:s T"), "items" => $items), $response);
});

$app->post('/github', function (Request $request) use ($app) {
    $tokenFile = '/tmp/WALLBLOG';
    $githubPayload = json_decode($request->getContent(), true);
    $ret = file_put_contents($tokenFile, 'plop');
    exec("chmod g+w $tokenFile");
    $app['monolog']->addInfo("Deploy token created: $ret");
    return new Response("Deploy triggered", 200);
});
