<?php

namespace controllers;

use Silex\Application;
use Silex\ControllerProviderInterface;
use Silex\ControllerCollection;
use Symfony\Component\HttpFoundation\Request;

class ApiController implements ControllerProviderInterface {

    public function connect(Application $app) {
        $controllers = new ControllerCollection();

        $controllers->get('/item', function (Application $app, Request $request) {
                    $start = $request->get('start');
                    $nb = $request->get('nb');
                    if(!$start) {
                        $start = 0;
                    }
                    if(!$nb) {
                        return $app['json']->constructJsonResponse($app['picture_service']->getAll());
                    }
                    else {
                        return $app['json']->constructJsonResponse($app['picture_service']->get($nb, $start));
                    }
                });

        $controllers->get('/itemfull', function (Application $app, Request $request) {
                    $start = $request->get('start');
                    $nb = $request->get('nb');
                    $items = $app['picture_service']->get($nb, $start);
                    for ($i = 0; $i < sizeof($items); $i++) {
                        $comments = $app['comment_service']->getByItem($items[$i]['id']);
                        if (sizeof($comments) > 0) {
                            $items[$i]['comments'] = $comments;
                        }
                    }
                    return $app['json']->constructJsonResponse($items);
                });

        $controllers->get('/item/{id}', function (Application $app, $id) {
                    $item = $app['picture_service']->getById($id);
                    $item['comments'] = $app['comment_service']->getByItem($id);
                    return $app['json']->constructJsonResponse($item);
                })->assert('id', '\d+');

        $controllers->get('/item/{id}/comments', function (Application $app, $id) {
                    return $app['json']->constructJsonResponse($app['comment_service']->getByItem($id));
                })->assert('id', '\d+');

        $controllers->put('/item/{id}', function (Application $app, Request $request) {
                    $app['monolog']->addDebug($request->getContent());
                    $jsonItem = json_decode($request->getContent(), true);
                    $item = $app['picture_service']->update($jsonItem);
                    return $app['json']->constructJsonResponse($item);
                });

        $controllers->post('/item/{id}/comments', function (Application $app, Request $request) {
                    $jsonComment = json_decode($request->getContent(), true);
                    $comment = $app['comment_service']->add($jsonComment);
                    return $app['json']->constructJsonResponse($comment);
                });

        $controllers->post('/item', function (Application $app, Request $request) {
                    /*if ($request->hasSession()) {
                        $user = $app['user_service']->getByEmail($request->getSession()->get('email'));
                        if ($user) {*/
                            $upload_dir = '../web/pictures/';
                            $allowed_ext = array('jpg', 'jpeg', 'png', 'mp4');

                            if (array_key_exists('data', $_POST) && array_key_exists('filename', $_POST)) {
                                $filename = $request->get('filename');
                                $description = $request->get('description');
                                $img = $request->get('data');
                                $img = str_replace('data:image/png;base64,', '', $img);
                                $img = str_replace('data:image/jpeg;base64,', '', $img);
                                $img = str_replace(' ', '+', $img);
                                $data = base64_decode($img);
                                
                                if (!in_array($app['picture_service']->getExtension($filename), $allowed_ext)) {
                                    return $app['json']->constructJsonResponse(array('status' => 'Only ' . implode(',', $allowed_ext) . ' files are allowed!'));
                                }
                                
                                if(file_put_contents($upload_dir . $filename, $data)) {
                                    $item = $app['picture_service']->add($filename, $description);
                                    $app['monolog']->addDebug("[session " . $request->getSession()->getId() . "] " . $filename . " was succesfully uploaded");
                                    return $app['json']->constructJsonResponse($item);
                                }
                                else {
                                    $app['monolog']->addDebug("[session " . $request->getSession()->getId() . "] problem during pic upload");
                                }
                            } else {
                                $app['monolog']->addDebug("[session " . $request->getSession()->getId() . "] can't find pic to updload");
                            }
                        /*} else {
                            $app['monolog']->addDebug("[session " . $request->getSession()->getId() . "] can't upload, user " . $request->getSession()->get('email') . " not found in session");
                        }
                    } else {
                        $app['monolog']->addDebug("can't upload, no session");
                    }*/
                });

        $controllers->get('/items/count', function (Application $app) {
                    return $app['json']->constructJsonResponse($app['picture_service']->count());
                });

        $controllers->get('/items/rebuild', function (Application $app) {
                    return $app['picture_service']->rebuild();
                });

        $controllers->get('/user', function(Request $request) use($app) {
                    $user = false;
                    if ($request->hasSession()) {
                        $loggedUserEmail = $request->getSession()->get('email');
                        $user = $app['user_service']->getByEmail($loggedUserEmail);
                        $user['password'] = '';
                    }

                    if ($user) {
                        return json_encode($user);
                    } else {
                        return new Response("user not logged", 500);
                    }
                });

        return $controllers;
    }

}

?>
