<?php

namespace App\Repository;

use Doctrine\DBAL\Driver\Connection;

use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Core\Exception\UsernameNotFoundException;

use \App\Entity\User;

class UserRepository implements UserProviderInterface
{
  private $db;
  private $tableName;

  public function __construct(Connection $db, string $prefix)
  {
    $this->db = $db;
    $this->tableName = "${prefix}__user";
  }

  public function loadUserByUsername($email): UserInterface
  {
    $sql = <<<SQL
SELECT *
FROM $this->tableName
WHERE email = ?;
SQL;
    $data = $this->db->fetchAssoc($sql, [$email]);

    if (!$data) {
      throw new UsernameNotFoundException("$email not found");
    }
    return $this->buildUser($data);
  }

  public function refreshUser(UserInterface $user): UserInterface
  {
    $sql = <<<SQL
SELECT *
FROM $this->tableName
WHERE id = ?;
SQL;
    $data = $this->db->fetchAssoc($sql, [$user->getId()]);

    return $this->buildUser($data);
  }

  public function supportsClass($class): bool
  {
    return true;
  }

  protected function buildUser($data): User
  {
    return new User((int) $data['id'], $data['email'], $data['password']);
  }
}
