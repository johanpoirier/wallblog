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
    $data = $this->findById($user->getId());
    return $this->buildUser($data);
  }

  public function supportsClass($class): bool
  {
    return true;
  }

  /**
   * @param $data
   * @return User
   */
  public function buildUser($data): User
  {
    return new User((int) ($data['id'] ?? 0), $data['email'], $data['password']);
  }

  /**
   * @param int $id
   * @return mixed
   */
  public function findById(int $id)
  {
    $sql = <<<SQL
SELECT *
FROM $this->tableName
WHERE id = ?
SQL;
    return $this->db->fetchAssoc($sql, [$id]);
  }

  /**
   * @return int
   */
  public function count()
  {
    $sql = "SELECT COUNT(*) FROM $this->tableName";
    return (int) $this->db->fetchColumn($sql);
  }

  /**
   * @param $user
   * @return mixed|null
   */
  public function add($user)
  {
    $saltedPassword = $user['password'];
    $res = $this->db->insert($this->tableName, $user);
    if ($res === 1) {
      $id = $this->db->lastInsertId($this->tableName);
      return $this->findById($id);
    }

    return null;
  }
}
