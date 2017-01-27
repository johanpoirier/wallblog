<?php

use Silex\Application;
use Silex\ControllerProviderInterface;
use Silex\ControllerCollection;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$api = $app['controllers_factory'];


/*************** Items API *****************/
$api->get('/item', function (Application $app, Request $request) {
  $start = $request->get('start');
  $nb = $request->get('nb');
  $filter = $request->get('filter');
  $getComments = $request->get('comments');

  if ($filter && sizeof($filter) > 0) {
    $items = $app['picture_service']->getByDate($filter);
  } else {
    if ($nb) {
      $start = $start ? $start : 0;
      $items = $app['picture_service']->get($nb, $start);
    } else {
      $items = $app['picture_service']->getAll();
    }
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
      if (file_exists('../web/pictures/' . $item['file'])) {
        unlink('../web/pictures/' . $item['file']);
      }
      $app['picture_service']->delete($id);
      return new Response('Item removed', 200);
    }
  } else {
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

  $item = $app['picture_service']->getById($id);
  $itemData = json_decode($request->getContent(), true);
  if (($item !== null) && ($itemData['id'] == $id)) {
    unset($itemData['comments']);
    unset($itemData['likes']);
    if ($itemData['description'] !== $item['description']) {
      if (!($request->hasSession() && $app['user_service']->getByEmail($request->getSession()->get('email')))) {
        $app['monolog']->addWarn("Can't update item $id, user " . $request->getSession()->get('email') . " not found in session");
        return;
      }
    }
    $app['picture_service']->update($itemData);
  }
  return $app['json']->constructJsonResponse($itemData);
});

$api->post('/items', function (Application $app, Request $request) {
  $jsonPictures = json_decode($request->getContent(), true);
  $item = null;

  if ($request->hasSession()) {
    $user = $app['user_service']->getByEmail($request->getSession()->get('email'));
    if ($user) {
      $upload_dir = '../dist/pictures/';
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
          } else {
            $app['monolog']->addDebug("[session " . $request->getSession()->getId() . "] problem during pic upload");
          }
        }
      }
    } else {
      $app['monolog']->addDebug("[session " . $request->getSession()->getId() . "] can't upload, user " . $request->getSession()->get('email') . " not found in session");
    }
  } else {
    $app['monolog']->addDebug("can't upload, no session");
  }

  if ($item) {
    return $app['json']->constructJsonResponse($item);
  } else {
    return new Response('problem during picture upload', 500);
  }
});


/*************** Comments API *****************/
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
  } else {
    return new Response('Operation not authorized', 401);
  }
});

$api->get('/items/count', function (Application $app) {
  return $app['json']->constructJsonResponse($app['picture_service']->count());
});

$api->get('/items/ids', function (Application $app) {
  return $app['json']->constructJsonResponse($app['picture_service']->listIds());
});

$api->get('/items/rebuild', function (Application $app) {
  $app['picture_service']->rebuild();
  return new Response('OK', 204);
});

$api->get('/items/rebuildall', function (Application $app) {
  $app['picture_service']->rebuild(true);
  return new Response('OK', 204);
});


/*************** Likes API *****************/
$api->get('/item/{id}/likes', function (Application $app, $id) {
  return $app['json']->constructJsonResponse($app['like_service']->getByItem($id));
})->assert('id', '\d+');

$api->post('/item/{id}/likes', function (Application $app, Request $request) {
  $jsonLike = json_decode($request->getContent(), true);
  $like = $app['like_service']->add($jsonLike, $request->headers->get('User-Agent'), $request->getClientIp());
  return $app['json']->constructJsonResponse($like);
});

$api->delete('/item/{id}/likes/{likeId}', function (Application $app, Request $request, $likeId) {
  $app['like_service']->delete($likeId);
  return new Response('Like removed', 200);
});


/*************** Videos API *****************/
$api->post('/videos', function (Application $app, Request $request) {
  $item = null;
  if ($request->hasSession()) {
    $user = $app['user_service']->getByEmail($request->getSession()->get('email'));
    if ($user) {
      $videos = json_decode($request->getContent(), true);
      foreach ($videos as $video) {
        $item = $app['video_service']->add($video['url'], $video['description'], $video['date']);
      }
    } else {
      $app['monolog']->addDebug("[session " . $request->getSession()->getId() . "] can't upload video, user " . $request->getSession()->get('email') . " not found in session");
    }
  }

  if ($item) {
    return $app['json']->constructJsonResponse($item);
  } else {
    return new Response('problem during video upload', 500);
  }
});


/*************** Users API *****************/
$api->get('/user', function (Request $request) use ($app) {
  $user = false;
  if ($request->hasSession()) {
    $loggedUserEmail = $request->getSession()->get('email');
    $user = $app['user_service']->getByEmail($loggedUserEmail);
    $user['password'] = '';
  }

  if ($user) {
    return json_encode($user);
  } else {
    return new Response('user not logged', 500);
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


/***************** Push API *****************/

$api->post('/push/subscribe', function (Application $app, Request $request) {
  $subscription = json_decode($request->getContent(), true);
  $subscription = $app['subscription_service']->create($subscription);
  return $app['json']->constructJsonResponse($subscription);
});

$api->post('/push/notify', function (Application $app, Request $request) {
  if ($request->hasSession()) {
    $user = $app['user_service']->getByEmail($request->getSession()->get('email'));
    if ($user) {
      $notificationData = json_decode($request->getContent(), true);
      $app['notification_service']->notify($notificationData['label'], $user['id']);
      return new Response('Notified', 200);
    }
  }
  return new Response('Operation not authorized', 401);
});


return $api;
