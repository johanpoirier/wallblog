<?php

namespace services;

use Minishlink\WebPush\WebPush;

/**
 * Description of SubscriptionService
 *
 * @author dst17
 */
class SubscriptionService {

    private static $db;
    private static $table_name;
    private static $logger;
    private static $push;

    public function __construct($db, $app_logger, $config) {
        self::$db = $db;
        self::$logger = $app_logger;
        self::$table_name =  $config["prefix"] . "__subscription";

        $vapidConfig = json_decode(file_get_contents(__DIR__ . '/../../config.life.json'), true);
        self::$push = new WebPush([ 'VAPID' => [
          'subject' => $vapidConfig['private']['vapidEmail'],
          'publicKey' => $vapidConfig['public']['vapidPublicKey'],
          'privateKey' => $vapidConfig['private']['vapidPrivateKey']
        ]]);
    }

    public function create($subscriptionData) {
        $subscription = [
          'endpoint' => $subscriptionData['endpoint'],
          'p256dh' => $subscriptionData['keys']['p256dh'],
          'auth' => $subscriptionData['keys']['auth']
        ];
        $res = self::$db->insert(self::$table_name, $subscription);
        self::$logger->addDebug("creating new subscription: " . $subscription['endpoint']);
        return true;
    }

  public function getAll() {
    $sql = "SELECT * FROM " . self::$table_name;
    return self::$db->fetchAll($sql);
  }

  public function notify($item) {
    $subscriptions = self::getAll();
    for ($i = 0; $i < sizeof($subscriptions); $i++) {
      $subscription = $subscriptions[$i];
      self::$push->sendNotification($subscription['endpoint'], 'plop', $subscription['p256dh'], $subscription['auth']);
    }
  }
}
