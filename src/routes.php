<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$app->get('/', function() use($app) {
    return $app->redirect('/app.html');
});

$app->get('/item/{id}', function($id) use($app) {
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
?>
