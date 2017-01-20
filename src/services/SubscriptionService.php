<?php

namespace services;

use Minishlink\WebPush\WebPush;

$config = json_decode(file_get_contents(__DIR__ . '/../../config.json'), true);

// array of notifications
$serverConfig = [
  'VAPID' => [
    'subject' => $config['private']['vapidEmail'],
    'publicKey' => $config['public']['vapidPublicKey'],
    'privateKey' => $config['private']['vapidPrivateKey']
  ]
];

/**
 * Description of SubscriptionService
 *
 * @author dst17
 */
class SubscriptionService {

    private static $db;
    private static $table_name;
    private static $logger;

    public function __construct($db, $app_logger, $config) {
        self::$db = $db;
        self::$logger = $app_logger;
        self::$table_name =  $config["prefix"] . "__subscription";
        self::$push = new WebPush($serverConfig);
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
    $sql = "SELECT * FROM $this->table_name subscription";
    return $this->db->fetchAll($sql);
  }

  public notify($item) {
    $subscriptions = self::getAll();
    for ($i = 0; $i < sizeof($subscriptions); $i++) {
      $subscription = $subscriptions[$i];
      self::$push->sendNotification($subscription['endpoint'], 'plop', $subscription['p256dh'], $subscription['auth']);
    }
  }
}
