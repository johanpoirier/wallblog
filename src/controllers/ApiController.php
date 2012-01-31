<?php
namespace controllers;

use Silex\Application;
use Silex\ControllerProviderInterface;
use Silex\ControllerCollection;

use Symfony\Component\HttpFoundation\Request;

class ApiController implements ControllerProviderInterface
{
    public function connect(Application $app) {
        $controllers = new ControllerCollection();
       
        $controllers->get('/items', function (Application $app, Request $request) {
            $start = $request->get('start');
            $nb = $request->get('nb');
            return json_encode($app['picture_service']->get($nb, $start));
        });

        $controllers->get('/item/{id}', function (Application $app, $id) {
            return json_encode($app['picture_service']->getById($id));
        });

        $controllers->get('/item/{id}/comments', function (Application $app, $id) {
            return json_encode($app['comment_service']->getByItem($id));
        });

        $controllers->post('/item/{id}/comments', function (Application $app, Request $request) {
            $app['monolog']->addDebug($request->getContent());
            $jsonComment = json_decode($request->getContent(), true);
            $comment = $app['comment_service']->add($jsonComment);
            return json_encode($comment);
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

        $controllers->get('/items/rss', function (Application $app) {
            return json_encode($app['picture_service']->get(20, 0));
        });

        return $controllers;
    }
}
?>
