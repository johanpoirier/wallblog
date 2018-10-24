<?php

namespace App\Repository;

use Doctrine\DBAL\Driver\Connection;

class LikeRepository
{
  private $db;

  public function __construct(Connection $db, string $prefix)
  {
    $this->db = $db;
  }
}
