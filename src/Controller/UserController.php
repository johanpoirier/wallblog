<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserController extends Controller
{
  private $repository;
  private $passwordEncoder;

  public function __construct(UserRepository $repository, UserPasswordEncoderInterface $passwordEncoder)
  {
    $this->repository = $repository;
    $this->passwordEncoder = $passwordEncoder;
  }

  /**
   * @param string $id
   * @return Response
   */
  public function get(string $id): Response
  {
    $user = $this->repository->findById($id);

    if(!$user) {
      return new Response('User not found', 404);
    }

    $user['password'] = '';
    return $this->json($user);
  }

  /**
   * @param Request $request
   * @return JsonResponse
   */
  public function add(Request $request): JsonResponse
  {
    $userData = json_decode($request->getContent(), true);
    $plainPassword = $userData['password'];

    $userEntity = $this->repository->buildUser($userData);
    $userData['password'] = $this->passwordEncoder->encodePassword($userEntity, $plainPassword);

    $user = $this->repository->add($userData);

    return $this->json($user);
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
}