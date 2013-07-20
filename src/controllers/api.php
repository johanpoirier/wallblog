<?php

use Silex\Application;
use Silex\ControllerProviderInterface;
use Silex\ControllerCollection;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$api = $app['controllers_factory'];

$api->get('/item', function (Application $app, Request $request) {
	$start = $request->get('start');
	$nb = $request->get('nb');
    $filter = $request->get('filter');
	$getComments = $request->get('comments');

	if (!$start) {
		$start = 0;
	}
	if (!$nb) {
        if($filter) {
            $items = $app['picture_service']->getByDate($filter);
        }
        else {
            $items = $app['picture_service']->getAll();
        }
	} else {
		$items = $app['picture_service']->get($nb, $start);
	}

	if ($getComments) {
		for ($i = 0; $i < sizeof($items); $i++) {
			$comments = $app['comment_service']->getByItem($items[$i]['id']);
			if (sizeof($comments) > 0) {
				$items[$i]['comments'] = $comments;
			}
		}
	}
	return $app['json']->constructJsonResponse($items);
});

$api->get('/item/{id}', function (Application $app, $id) {
	$item = $app['picture_service']->getById($id);
	$item['comments'] = $app['comment_service']->getByItem($id);
	return $app['json']->constructJsonResponse($item);
})->assert('id', '\d+');

$api->delete('/item/{id}', function (Application $app, Request $request, $id) {
	if ($request->hasSession()) {
		$user = $app['user_service']->getByEmail($request->getSession()->get('email'));
		if ($user) {
			$item = $app['picture_service']->getById($id);
			if(file_exists('../web/pictures/' . $item['file'])) {
                unlink('../web/pictures/' . $item['file']);
            }
			$app['picture_service']->delete($id);
			return new Response('Item removed', 200);
		}
	}
	else {
		return new Response('Operation not authorized', 401);
	}
});

$api->get('/item/{id}/comments', function (Application $app, $id) {
	return $app['json']->constructJsonResponse($app['comment_service']->getByItem($id));
})->assert('id', '\d+');

$api->post('/item/{id}/comments', function (Application $app, Request $request) {
	$jsonComment = json_decode($request->getContent(), true);
	$comment = $app['comment_service']->add($jsonComment);
	return $app['json']->constructJsonResponse($comment);
});

$api->delete('/item/{id}/comments/{idComment}', function (Application $app, Request $request, $idComment) {
	if ($request->hasSession()) {
		$user = $app['user_service']->getByEmail($request->getSession()->get('email'));
		if ($user) {
			$app['comment_service']->delete($idComment);
			return new Response('Comment removed', 200);
		}
	}
	else {
		return new Response('Operation not authorized', 401);
	}
});

$api->post('/item', function (Application $app, Request $request) {
	if ($request->hasSession()) {
		$user = $app['user_service']->getByEmail($request->getSession()->get('email'));
		if ($user) {
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

				if (file_put_contents($upload_dir . $filename, $data)) {
					$item = $app['picture_service']->add($filename, $description);
					$app['monolog']->addDebug("[session " . $request->getSession()->getId() . "] " . $filename . " was succesfully uploaded");
					return $app['json']->constructJsonResponse($item);
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

$api->put('/item/{id}', function (Application $app, Request $request, $id) {
    $app['monolog']->addDebug("put item $id : " . $request->getContent());
    if ($request->hasSession()) {
        $user = $app['user_service']->getByEmail($request->getSession()->get('email'));
        if ($user) {
            $item = json_decode($request->getContent(), true);
            if($item['id'] == $id) {
                unset($item['comments']);
                unset($item['like']);
                $app['picture_service']->update($item);
            }
        }
        else {
            $app['monolog']->addInfo("user not found in session");
        }
    }
    else {
        $app['monolog']->addInfo("no session found");
    }
    return $app['json']->constructJsonResponse($item);
});

$api->post('/items', function (Application $app, Request $request) {
	$jsonPictures = json_decode($request->getContent(), true);
    $item = null;

	if ($request->hasSession()) {
		$user = $app['user_service']->getByEmail($request->getSession()->get('email'));
		if ($user) {
			$upload_dir = '../web/pictures/';
			$allowed_ext = array('jpg', 'jpeg', 'png', 'mp4');

			foreach ($jsonPictures as $picture) {
				if (in_array($app['picture_service']->getExtension($picture['filename']), $allowed_ext)) {
					$img = $picture['data'];
					$img = str_replace('data:image/png;base64,', '', $img);
					$img = str_replace('data:image/jpeg;base64,', '', $img);
					$img = str_replace(' ', '+', $img);
					$data = base64_decode($img);

					if (file_put_contents($upload_dir . $picture['filename'], $data)) {
						$item = $app['picture_service']->add($picture['filename'], $picture['description']);
					}
					else {
						$app['monolog']->addDebug("[session " . $request->getSession()->getId() . "] problem during pic upload");
					}
				}
			}
		}
		else {
			$app['monolog']->addDebug("[session " . $request->getSession()->getId() . "] can't upload, user " . $request->getSession()->get('email') . " not found in session");
		}
	}
	else {
		$app['monolog']->addDebug("can't upload, no session");
	}

    if($item) {
        return $app['json']->constructJsonResponse($item);
    }
    else {
        return new Response("problem during picture upload", 500);
    }
});

$api->get('/items/count', function (Application $app) {
	return $app['json']->constructJsonResponse($app['picture_service']->count());
});

$api->get('/items/ids', function (Application $app) {
	return $app['json']->constructJsonResponse($app['picture_service']->listIds());
});

$api->get('/items/rebuild', function (Application $app) {
	return $app['picture_service']->rebuild();
});

$api->get('/user', function(Request $request) use($app) {
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

$api->post('/user', function (Application $app, Request $request) {
	$user = json_decode($request->getContent(), true);
	$user = $app['user_service']->create($user);
	return $app['json']->constructJsonResponse($user);
});

$api->get('/users/count', function (Application $app) {
	return $app['json']->constructJsonResponse($app['user_service']->count());
});

return $api;
?>