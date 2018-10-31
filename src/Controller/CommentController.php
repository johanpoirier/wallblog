<?php

namespace App\Controller;

use App\Repository\CommentRepository;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class CommentController extends Controller
{
  private $repository;

  public function __construct(CommentRepository $repository)
  {
    $this->repository = $repository;
  }

  /**
   * @param string $id
   * @return JsonResponse
   */
  public function getByItemId(string $id): JsonResponse
  {
    $comments = $this->repository->findByItemId($id);
    return $this->json($comments);
  }

  /**
   * @param Request $request
   * @return JsonResponse
   */
  public function add(Request $request): JsonResponse
  {
    $jsonComment = json_decode($request->getContent(), true);
    $jsonComment['date'] = date('Y-m-d H:i:s');
    $comment = $this->json($this->repository->add($jsonComment));
    return $this->json($comment);
  }

  /**
   * @param string $idComment
   * @return Response
   */
  public function delete(string $idComment): Response
  {
    $this->repository->delete((int) $idComment);

    $response = new Response();
    $response->setStatusCode(204);

    return $response;
  }
}