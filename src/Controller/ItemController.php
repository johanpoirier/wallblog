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
    $items = $this->repository->findPaginated($request->query->get('nb'), $request->query->get('start'));
    return $this->json($items);
  }

  /**
   * @param string $id
   * @return Response
   */
  public function get(string $id): Response
  {
    $item = $this->repository->findById($id);

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
  public function add(Request $request): Response
  {
    $item = null;
    $items = json_decode($request->getContent(), true);
    foreach ($items as $picture) {
      if (!\in_array($this->pictureService->getExtension($picture['filename']), self::ALLOWED_EXT)) {
        continue;
      }

      $img = $picture['data'];
      $img = str_replace('data:image/png;base64,', '', $img);
      $img = str_replace('data:image/jpeg;base64,', '', $img);
      $img = str_replace(' ', '+', $img);
      $data = base64_decode($img);

      if (file_put_contents($this->uploadDir . $picture['filename'], $data)) {
        $item = $this->pictureService->add($picture['filename'], $picture['description']);
      } else {
        //$app['monolog']->addDebug("[session " . $request->getSession()->getId() . "] problem during pic upload");
      }
    }

    if ($item) {
      return $this->json($item);
    }

    return new Response('problem during picture upload', 500);
  }

  /**
   * @param string $id
   * @return Response
   */
  public function delete(string $id): Response
  {
    $this->repository->delete($id);

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
}
