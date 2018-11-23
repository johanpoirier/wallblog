<?php

namespace App\Controller;

use App\Repository\ItemRepository;
use App\Service\PictureService;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class ItemController extends Controller
{

  private $repository;
  private $pictureService;
  private $uploadDir;

  public const ALLOWED_EXT = ['jpg', 'jpeg', 'png'];

  public function __construct(ItemRepository $repository, PictureService $pictureService)
  {
    $this->repository = $repository;
    $this->pictureService = $pictureService;

    $this->uploadDir = '../dist/pictures/';
  }

  /**
   * @param $request
   * @param $count
   * @param $page
   * @return JsonResponse
   */
  public function getPaginated(Request $request): JsonResponse
  {
    $itemCount = $request->query->get('nb', 20);
    $itemStart = $request->query->get('start', 0);
    $dateFilter = $filter = $request->get('filter');

    if ($filter && $filter !== '') {
      $items = $this->repository->findByDate($dateFilter);
    } else {
      $items = $this->repository->findPaginated($itemCount, $itemStart);
    }

    return $this->json($items);
  }

  /**
   * @param string $id
   * @return Response
   */
  public function get(string $id): Response
  {
    $item = $this->repository->findById((int) $id);

    if (!$item) {
      $response = new Response();
      $response->setStatusCode(404);
      return $response;
    }

    return $this->json($item);
  }

  /**
   * @param Request $request
   * @return Response
   */
  public function addPictures(Request $request): Response
  {
    $items = [];

    $pictures = json_decode($request->getContent(), true);
    foreach ($pictures as $picture) {
      if (!\in_array($this->pictureService->getExtension($picture['filename']), self::ALLOWED_EXT)) {
        continue;
      }

      $img = $picture['data'];
      $img = str_replace('data:image/png;base64,', '', $img);
      $img = str_replace('data:image/jpeg;base64,', '', $img);
      $img = str_replace(' ', '+', $img);
      $data = base64_decode($img);

      if (file_put_contents($this->uploadDir . $picture['filename'], $data)) {
        $items[] = $this->pictureService->add($picture['filename'], $picture['description']);
      } else {
        //$app['monolog']->addDebug("[session " . $request->getSession()->getId() . "] problem during pic upload");
      }
    }

    if (empty($items)) {
      return new Response('Problem during picture upload', 500);
    }

    return $this->json($items);
  }

  /**
   * @param Request $request
   * @return Response
   */
  public function addVideos(Request $request): Response
  {
    $items = [];

    $videos = json_decode($request->getContent(), true);
    foreach ($videos as $video) {
      $item = [
        'file' => $video['url'],
        'description' => $video['description'],
        'type' => 'video',
        'ratio' => 1280 / 720,
        'reverseRatio' => 720 / 1280,
        'date' => ($video['date'] === null) ? date('Y-M-d H:i:s') : $video['date'] . ' 00:00:00'
      ];
      $items[] = $this->repository->add($item);
    }

    if (empty($items)) {
      return new Response('Problem during video upload', 500);
    }

    return $this->json($items);
  }

  /**
   * @param Request $request
   * @param string $id
   * @return Response
   */
  public function update(Request $request, string $id): Response
  {
    //$app['monolog']->addDebug("put item $id : " . $request->getContent());

    $item = $this->repository->findById((int) $id);
    $itemData = json_decode($request->getContent(), true);

    if (($item !== null) && ($itemData['id'] === $id)) {
      unset($itemData['comments'], $itemData['likes']);
      if ($itemData['description'] !== $item['description']) {
        $this->repository->update($itemData);
      }
    }

    return $this->get($id);
  }

  /**
   * @param string $id
   * @return Response
   */
  public function delete(string $id): Response
  {
    $this->repository->delete((int) $id);

    $response = new Response();
    $response->setStatusCode(204);

    return $response;
  }

  /**
   * @return Response
   */
  public function count(): Response
  {
    $response = new Response($this->repository->count());
    $response->setStatusCode(200);

    return $response;
  }

  /**
   * @return JsonResponse
   */
  public function ids(): JsonResponse
  {
    return $this->json($this->repository->listIds());
  }

  /**
   * @param Request $request
   * @return Response
   */
  public function rebuildAll(Request $request): Response
  {
    set_time_limit(0);

    $forceReSample = $request->query->get('force') === 'true';

    $this->pictureService->rebuild($forceReSample);

    $response = new Response();
    $response->setStatusCode(204);

    return $response;
  }
}
