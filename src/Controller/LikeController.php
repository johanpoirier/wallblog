<?php

namespace App\Controller;

use App\Repository\LikeRepository;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class LikeController extends Controller
{
  private $repository;

  public function __construct(LikeRepository $repository)
  {
    $this->repository = $repository;
  }

  /**
   * @param string $id
   * @return JsonResponse
   */
  public function getByItemId(string $id): JsonResponse
  {
    $likes = $this->repository->findByItemId($id);
    return $this->json($likes);
  }

  /**
   * @param Request $request
   * @return JsonResponse
   */
  public function add(Request $request): JsonResponse
  {
    $data = json_decode($request->getContent(), true);
    $like = [
      'itemId' => $data['itemId'],
      'visitorId' => $data['visitorId'],
      'date' => date('Y-m-d H:i:s'),
      'userAgent' => $request->headers->get('User-Agent'),
      'ip' => $request->getClientIp()
    ];

    return $this->json($this->repository->add($like));
  }

  /**
   * @param string $idLike
   * @return Response
   */
  public function delete(string $idLike): Response
  {
    $this->repository->delete((int) $idLike);

    $response = new Response();
    $response->setStatusCode(204);

    return $response;
  }
}