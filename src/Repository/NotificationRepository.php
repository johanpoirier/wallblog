<?php

namespace App\Repository;

use Doctrine\DBAL\Driver\Connection;

class NotificationRepository
{
  private $db;
  private $tableName;

  public function __construct(Connection $db, string $prefix)
  {
    $this->db = $db;
    $this->tableName = "${prefix}__notification";
  }

  public function add($label, $userId)
  {
    $notification = [
      'label' => $label,
      'userId' => $userId
    ];
    $res = $this->db->insert($this->tableName, $notification);

    if ($res === 1) {
      $id = $this->db->lastInsertId($this->tableName);
      return $this->findById($id);
    }

    return null;
  }

  /**
   * @param int $id
   * @return mixed
   */
  public function findById(int $id)
  {
    $sql = "SELECT * FROM  $this->tableName WHERE id = ?";
    return $this->db->fetchAssoc($sql, [$id]);
  }
}
