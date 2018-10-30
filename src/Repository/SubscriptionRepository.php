<?php

namespace App\Repository;

use Doctrine\DBAL\Driver\Connection;

class SubscriptionRepository
{
  private $db;
  private $tableName;

  public function __construct(Connection $db, string $prefix)
  {
    $this->db = $db;
    $this->tableName = "${prefix}__subscription";
  }

  public function add($subscriptionData)
  {
    $subscription = [
      'endpoint' => $subscriptionData['endpoint'],
      'p256dh' => $subscriptionData['keys']['p256dh'],
      'auth' => $subscriptionData['keys']['auth']
    ];
    $res = $this->db->insert($this->tableName, $subscription);

    if ($res === 1) {
      $id = $this->db->lastInsertId($this->tableName);
      return $this->findById($id);
    }

    return null;
  }

  /**
   * @return mixed
   */
  public function findAll()
  {
    return $this->db->fetchAll("SELECT * FROM $this->tableName");
  }
}
