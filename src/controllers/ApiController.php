<?php
namespace controllers;

use Silex\Application;
use Silex\ControllerProviderInterface;
use Silex\ControllerCollection;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiController implements ControllerProviderInterface
{
    public function connect(Application $app) {
        $controllers = new ControllerCollection();
       
        $controllers->get('/items', function (Application $app, Request $request) {
            $start = $request->get('start');
            $nb = $request->get('nb');
            return encodeJsonResponse($app['picture_service']->get($nb, $start));
        });

        $controllers->get('/item/{id}', function (Application $app, $id) {
            return encodeJsonResponse($app['picture_service']->getById($id));
        });

        $controllers->get('/item/{id}/comments', function (Application $app, $id) {
            return encodeJsonResponse($app['comment_service']->getByItem($id));
        });

        $controllers->post('/item/{id}/comments', function (Application $app, Request $request) {
            $app['monolog']->addDebug($request->getContent());
            $jsonComment = json_decode($request->getContent(), true);
            $comment = $app['comment_service']->add($jsonComment);
            return encodeJsonResponse($comment);
        });

        $controllers->post('/item', function (Application $app, Request $request) {
            if($request->hasSession()) {
                $user = $app['user_service']->getByEmail($request->getSession()->get('email'));
                if($user) {
                    $upload_dir = '../web/pictures/';
                    $allowed_ext = array('jpg', 'jpeg', 'png', 'mp4');

                    if(array_key_exists('pic', $_FILES) && $_FILES['pic']['error'] == 0) {
                        $pic = $_FILES['pic'];
                        $description = $request->get('description');
                        if(!in_array($app['picture_service']->getExtension($pic['name']), $allowed_ext)){
                            return encodeJsonResponse(array('status' => 'Only ' . implode(',', $allowed_ext) . ' files are allowed!'));
                        }	

                        if(move_uploaded_file($pic['tmp_name'], $upload_dir.$pic['name'])) {
                            $app['picture_service']->add($pic['name'], $description);
                            return encodeJsonResponse(array('status' => 'File was uploaded successfuly!'));
                        }
                    }
                }
            }
        });

        $controllers->get('/items/rss', function (Application $app) {
            return encodeJsonResponse($app['picture_service']->get(20, 0));
        });

        return $controllers;
    }
    
    private function encodeJsonResponse($data) {
        return new Response(json_encode($data), 200, array('Content-type' => 'application/json'));
    }
}
?>
