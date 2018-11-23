<?php

namespace App\Repository;

use Doctrine\DBAL\Driver\Connection;

class CommentRepository
{
  private $db;
  private $tableName;
  private $itemTableName;

  public function __construct(Connection $db, string $prefix)
  {
    $this->db = $db;
    $this->tableName = "${prefix}__comment";
    $this->itemTableName = "${prefix}__item";
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

  /**
   * @param $count
   * @param $index
   * @return mixed
   */
  public function findPaginated($count, $index)
  {
    $request = <<<SQL
SELECT c.id, c.text, c.author, c.date, c.idItem, i.description, i.file
FROM $this->tableName c
LEFT JOIN $this->itemTableName i ON (c.idItem = i.id)
ORDER BY c.date DESC
LIMIT $index, $count;
SQL;
    return $this->db->fetchAll($request);
  }

  /**
   * @param int $idItem
   * @return mixed
   */
  public function findByItemId(int $idItem)
  {
    $sql = "SELECT * FROM  $this->tableName WHERE idItem = ? ORDER BY date desc";
    return $this->db->fetchAll($sql, [$idItem]);
  }

  /**
   * @param $comment
   * @return mixed|null
   */
  public function add($comment)
  {
    $res = $this->db->insert($this->tableName, $comment);
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
  public function delete(int $id)
  {
    return $this->db->delete($this->tableName, ['id' => $id]);
  }
}
