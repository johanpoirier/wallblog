<?php

namespace services;

use Minishlink\WebPush\WebPush;

/**
 * Description of SubscriptionService
 *
 * @author dst17
 */
class SubscriptionService
{

  private static $table_name;
  private $db;
  private $logger;

  public function __construct($db, $app_logger, $config)
  {
    $this->db = $db;
    $this->logger = $app_logger;
    self::$table_name = $config["prefix"] . "__subscription";
  }

  public function create($subscriptionData)
  {
    $subscription = [
      'endpoint' => $subscriptionData['endpoint'],
      'p256dh' => $subscriptionData['keys']['p256dh'],
      'auth' => $subscriptionData['keys']['auth']
    ];
    $this->db->insert(self::$table_name, $subscription);
    return true;
  }

  public function getAll()
  {
    $sql = "SELECT * FROM " . self::$table_name;
    return $this->db->fetchAll($sql);
  }
}
