<?php

namespace services;

use Minishlink\WebPush\WebPush;

/**
 * Description of NotificationService
 *
 * @author dst17
 */
class NotificationService {

  private $db;
  private static $table_name;
  private $logger;

  private $push;
  private $subscriptionService;
  private $pictureService;

  public function __construct($db, $app_logger, $subscriptionService, $pictureService, $config) {
    $this->db = $db;
    $this->logger = $app_logger;
    self::$table_name =  $config["prefix"] . "__notification";

    $this->subscriptionService = $subscriptionService;
    $this->pictureService = $pictureService;

    $vapidConfig = json_decode(file_get_contents(__DIR__ . '/../../config.json'), true);
    $this->push = new WebPush([ 'VAPID' => [
      'subject' => $vapidConfig['vapidEmail'],
      'publicKey' => $vapidConfig['vapidPublicKey'],
      'privateKey' => $vapidConfig['vapidPrivateKey']
    ]]);
  }

  private function create($label, $userId) {
    $notification = [
      'label' => $label,
      'userId' => $userId
    ];
    $res = $this->db->insert(self::$table_name, $notification);
    if ($res == 1) {
      $id = $this->db->lastInsertId(self::$table_name);
      return $this->get($id);
    }
    return null;
  }

  private function get($id) {
    $sql = "SELECT * FROM " . self::$table_name . " WHERE id = ?";
    return $this->db->fetchAssoc($sql, [(int) $id]);
  }

  public function notify($label, $userId) {
    $unnotifiedItemsCount = $this->pictureService->getUnnotifiedCount();
    $this->logger->addDebug("$unnotifiedItemsCount photos pas encore notifiées");
    if ($unnotifiedItemsCount == 0) {
      return null;
    }

    if ($unnotifiedItemsCount == 1) {
      $body = '1 nouvelle photo publiée !';
    } else {
      $body = "$unnotifiedItemsCount nouvelles photos publiées !";
    }

    $subscriptions = $this->subscriptionService->getAll();
    for ($i = 0; $i < sizeof($subscriptions); $i++) {
      $subscription = $subscriptions[$i];
      $this->push->sendNotification($subscription['endpoint'], $body, $subscription['p256dh'], $subscription['auth']);
    }
    $this->push->flush();

    $this->logger->addDebug($body);
    $notification = $this->create($label, $userId);
    $this->pictureService->setNotification($notification['id']);

    return $notification;
  }
}
