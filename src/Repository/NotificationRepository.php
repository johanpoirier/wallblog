<?php

namespace App\Repository;

use Doctrine\DBAL\Driver\Connection;

class NotificationRepository
{
  private $db;

  public function __construct(Connection $db, string $prefix)
  {
    $this->db = $db;
  }
}
