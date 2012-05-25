<?php

namespace controllers;

use Silex\Application;
use Silex\ControllerProviderInterface;
use Silex\ControllerCollection;
use Symfony\Component\HttpFoundation\Request;

class ApiController implements ControllerProviderInterface {

    public function connect(Application $app) {
        $controllers = new ControllerCollection();

        $controllers->get('/items', function (Application $app, Request $request) {
                    $start = $request->get('start');
                    $nb = $request->get('nb');
                    return $app['json']->constructJsonResponse($app['picture_service']->get($nb, $start));
                });

        $controllers->get('/itemsfull', function (Application $app, Request $request) {
                    $start = $request->get('start');
                    $nb = $request->get('nb');
                    $items = $app['picture_service']->get($nb, $start);
                    for ($i = 0; $i < sizeof($items); $i++) {
                        $comments = $app['comment_service']->getByItem($items[$i]['id']);
                        if(sizeof($comments) > 0) {
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

        $controllers->post('/item/{id}/comments', function (Application $app, Request $request) {
                    $app['monolog']->addDebug($request->getContent());
                    $jsonComment = json_decode($request->getContent(), true);
                    $comment = $app['comment_service']->add($jsonComment);
                    return $app['json']->constructJsonResponse($comment);
                });

        $controllers->post('/item', function (Application $app, Request $request) {
                    if ($request->hasSession()) {
                        $user = $app['user_service']->getByEmail($request->getSession()->get('email'));
                        if ($user) {
                            $upload_dir = '../web/pictures/';
                            $allowed_ext = array('jpg', 'jpeg', 'png', 'mp4');

                            if (array_key_exists('pic', $_FILES) && $_FILES['pic']['error'] == 0) {
                                $pic = $_FILES['pic'];
                                $description = $request->get('description');
                                if (!in_array($app['picture_service']->getExtension($pic['name']), $allowed_ext)) {
                                    return $app['json']->constructJsonResponse(array('status' => 'Only ' . implode(',', $allowed_ext) . ' files are allowed!'));
                                }

                                if (move_uploaded_file($pic['tmp_name'], $upload_dir . $pic['name'])) {
                                    $app['picture_service']->add($pic['name'], $description);
                                    return $app['json']->constructJsonResponse(array('status' => 'File was uploaded successfuly!'));
                                } else {
                                    $app['monolog']->addDebug("[session " . $request->getSession()->getId() . "] problem during pic upload");
                                }
                            } else {
                                $app['monolog']->addDebug("[session " . $request->getSession()->getId() . "] can't find pic to updload");
                            }
                        } else {
                            $app['monolog']->addDebug("[session " . $request->getSession()->getId() . "] can't upload, user " . $request->getSession()->get('email') . " not found in session");
                        }
                    } else {
                        $app['monolog']->addDebug("can't upload, no session");
                    }
                });

        $controllers->get('/items/rss', function (Application $app) {
                    return $app['json']->constructJsonResponse($app['picture_service']->get(20, 0));
                });

        $controllers->get('/items/count', function (Application $app) {
                    return $app['json']->constructJsonResponse($app['picture_service']->count());
                });

        return $controllers;
    }

}

?>
