<?php

use Silex\Application;
use Silex\ControllerProviderInterface;
use Silex\ControllerCollection;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$api2 = $app['controllers_factory'];

$api2->get('/items', function (Application $app, Request $request) {
	$offset = $request->get('offset');
	$limit = $request->get('limit');
    $filter = $request->get('filter');
	$getComments = $request->get('comments');
	$response = array("items" => []);

	if (!$offset) {
		$offset = 0;
	}
	if (!$limit) {
        if($filter) {
            $items = $app['picture_service']->getByDate($filter);
        }
        else {
            $items = $app['picture_service']->getAll();
        }
	} else {
		$items = $app['picture_service']->get($limit, $offset);
	}

	if ($getComments) {
		for ($i = 0; $i < sizeof($items); $i++) {
			$comments = $app['comment_service']->getByItem($items[$i]['id']);
			foreach ($comments as $comment) {
                $items[$i]['comments'][] = $comment["id"];
                unset($comment["idItem"]);
                $response["comments"][] = $comment;
			}
		}
	}

	$response["items"] = $items;
	$response["meta"] = array("total" => $app['picture_service']->count());

	return $app['json']->constructJsonResponse($response);
});

$api2->get('/items/{id}', function (Application $app, $id) {
    $item = $app['picture_service']->getById($id);

    $comments = $app['comment_service']->getByItem($id);
    foreach ($comments as $comment) {
        $item['comments'][] = $comment["id"];
        unset($comment["idItem"]);
        $response["comments"][] = $comment;
    }

    $response["item"] = $item;

	return $app['json']->constructJsonResponse($response);
})->assert('id', '\d+');

$api2->delete('/items/{id}', function (Application $app, Request $request, $id) {
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

$api2->get('/items/{id}/comments', function (Application $app, $id) {
	return $app['json']->constructJsonResponse($app['comment_service']->getByItem($id));
})->assert('id', '\d+');

$api2->post('/comments', function (Application $app, Request $request) {
	$jsonComment = json_decode($request->getContent(), true);
	$comment = $app['comment_service']->add($jsonComment["comment"]);
	return $app['json']->constructJsonResponse(array("comment" => $comment));
});

$api2->delete('/comments/{idComment}', function (Application $app, Request $request, $idComment) {
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

$api2->post('/items', function (Application $app, Request $request) {
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

$api2->put('/items/{id}', function (Application $app, Request $request, $id) {
    $app['monolog']->addDebug("put item $id : " . $request->getContent());
    if ($request->hasSession()) {
        $user = $app['user_service']->getByEmail($request->getSession()->get('email'));
        if ($user) {
            $itemRoot = json_decode($request->getContent(), true);
            $itemRoot['item']['id'] = $id;
            $item = $itemRoot["item"];
            unset($item['like']);
            $app['picture_service']->update($item);
        }
        else {
            $app['monolog']->addInfo("user not found in session");
        }
    }
    else {
        $app['monolog']->addInfo("no session found");
    }
    return $app['json']->constructJsonResponse($itemRoot);
});

$api2->post('/items', function (Application $app, Request $request) {
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

$api2->get('/items/ids', function (Application $app) {
	return $app['json']->constructJsonResponse($app['picture_service']->listIds());
});

$api2->get('/items/rebuild', function (Application $app) {
	$app['picture_service']->rebuild();
    return new Response("ok", 200);
});

$api2->get('/user', function(Request $request) use($app) {
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

$api2->post('/user', function (Application $app, Request $request) {
	$user = json_decode($request->getContent(), true);
	$user = $app['user_service']->create($user);
	return $app['json']->constructJsonResponse($user);
});

$api2->get('/users/count', function (Application $app) {
	return $app['json']->constructJsonResponse($app['user_service']->count());
});

return $api2;
?>