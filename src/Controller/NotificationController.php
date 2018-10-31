<?php

namespace App\Controller;

use App\Repository\SubscriptionRepository;
use App\Service\NotificationService;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class NotificationController extends Controller
{
  private $subscriptionRepository;
  private $notificationService;

  public function __construct(SubscriptionRepository $subscriptionRepository, NotificationService $notificationService)
  {
    $this->subscriptionRepository = $subscriptionRepository;
    $this->notificationService = $notificationService;
  }

  /**
   * @param Request $request
   * @return JsonResponse
   */
  public function subscribe(Request $request): JsonResponse
  {
    $subscription = json_decode($request->getContent(), true);
    $subscription = $this->subscriptionRepository->add($subscription);
    return $this->json($subscription);
  }

  /**
   * @param Request $request
   * @return Response
   */
  public function notify(Request $request): Response
  {
    $user = $this->getUser();
    if (!$user) {
      return new Response('No you can’t.', 401);
    }

    $notificationData = json_decode($request->getContent(), true);
    $this->notificationService->notify($notificationData['label'], $user->getId());
    return new Response('Notified', 200);
  }
}
