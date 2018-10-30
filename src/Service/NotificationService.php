<?php

namespace App\Service;

use App\Repository\ItemRepository;
use App\Repository\NotificationRepository;
use App\Repository\SubscriptionRepository;
use Psr\Log\LoggerInterface;
use Minishlink\WebPush\WebPush;

class NotificationService
{
  private $repository;
  private $subscriptionRepository;
  private $itemRepository;
  private $logger;
  private $push;

  public function __construct(NotificationRepository $repository, SubscriptionRepository $subscriptionRepository, ItemRepository $itemRepository, LoggerInterface $logger)
  {
    $this->repository = $repository;
    $this->subscriptionRepository = $subscriptionRepository;
    $this->itemRepository = $itemRepository;
    $this->logger = $logger;

    $vapidConfig = json_decode(file_get_contents(__DIR__ . '/../../config.json'), true);
    $this->push = new WebPush([ 'VAPID' => [
      'subject' => $vapidConfig['vapidEmail'],
      'publicKey' => $vapidConfig['vapidPublicKey'],
      'privateKey' => $vapidConfig['vapidPrivateKey']
    ]]);
  }

  public function notify($label, $userId) {
    $unnotifiedItemsCount = $this->itemRepository->getUnnotifiedCount();
    $this->logger->debug("$unnotifiedItemsCount photos pas encore notifiées");
    if ($unnotifiedItemsCount === 0) {
      return null;
    }

    if ($unnotifiedItemsCount === 1) {
      $body = '1 nouvelle photo publiée !';
    } else {
      $body = "$unnotifiedItemsCount nouvelles photos publiées !";
    }

    $subscriptions = $this->subscriptionRepository->findAll();
    foreach($subscriptions as $subscription) {
      $this->push->sendNotification($subscription['endpoint'], $body, $subscription['p256dh'], $subscription['auth']);
    }
    $this->push->flush();

    $this->logger->debug($body);
    $notification = $this->repository->add($label, $userId);
    $this->itemRepository->setNotification($notification['id']);

    return $notification;
  }
}
