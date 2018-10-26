<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Cookie;

class SecurityController extends AbstractController
{
  /**
   * @param Request $request
   * @return JsonResponse
   */
  public function login(Request $request): JsonResponse
  {
    $user = $this->getUser();

    $securityCookie = new Cookie(
      'authenticated',
      '1',
      \time() + (int) \ini_get('session.gc_maxlifetime'),
      '/',
      null,
      false,
      false
    );

    $response = $this->json([
      'username' => $user->getUsername(),
      'roles' => $user->getRoles(),
    ]);

    $response->headers->setCookie($securityCookie);

    return $response;
  }
}
