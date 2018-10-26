<?php

namespace App\Repository;

use Doctrine\DBAL\Driver\Connection;

class ItemRepository
{
  private $db;
  private $tableName;
  private $likeTableName;

  public function __construct(Connection $db, string $prefix)
  {
    $this->db = $db;
    $this->tableName = "${prefix}__item";
    $this->likeTableName = "${prefix}__like";
  }

  /**
   * @return mixed
   */
  public function findAll()
  {
    return $this->db->fetchAll('SELECT * FROM wallblog__item');
  }

  /**
   * @param $count
   * @param $index
   * @return mixed
   */
  public function findPaginated($count, $index)
  {
    $sql = <<<SQL
SELECT item.*, count(l.id) AS likes
FROM $this->tableName item
LEFT JOIN $this->likeTableName l ON (item.id = l.itemId)
GROUP BY item.id
ORDER BY date DESC
LIMIT $index, $count;
SQL;
    return $this->db->fetchAll($sql);
  }

  /**
   * @param int $id
   * @return mixed
   */
  public function findById(int $id)
  {
    $sql = <<<SQL
SELECT item.*, count(l.id) AS likes
FROM $this->tableName item
LEFT JOIN $this->likeTableName l ON (item.id = l.itemId)
WHERE item.id = ?
GROUP BY item.id;
SQL;
    $picture = $this->db->fetchAssoc($sql, [$id]);

    // previous picture
    $prev = false;
    $prevId = $id - 1;
    while (!$prev && $prevId > 0) {
      $prev = $this->db->fetchAssoc($sql, [$prevId--]);
    }
    if ($prev) {
      $picture['prevId'] = $prev['id'];
    }

    // next picture
    $next = false;
    $nextId = $id + 1;
    $maxId = $this->getMaxId();
    while (!$next && $nextId < $maxId) {
      $next = $this->db->fetchAssoc($sql, [$nextId++]);
    }
    if ($next) {
      $picture['nextId'] = $next['id'];
    }

    return $picture;
  }

  /**
   * @param $date
   * @return mixed
   */
  public function findByDate($date)
  {
    $sql = <<<SQL
SELECT item.*, count(l.id) AS likes
FROM $this->tableName item
LEFT JOIN $this->likeTableName l ON (item.id = l.itemId)
WHERE item.date LIKE '$date%'
GROUP BY item.id
ORDER BY date DESC;
SQL;
    return $this->db->fetchAll($sql);
  }

  /**
   * @param $item
   * @return mixed|null
   */
  public function add($item)
  {
    $res = $this->db->insert($this->tableName, $item);
    if ($res === 1) {
      $id = $this->db->lastInsertId($this->tableName);
      return $this->findById($id);
    }

    return null;
  }

  /**
   * @param $item
   * @return mixed|bool
   */
  public function update($item)
  {
    //$this->logger->addDebug("updating item : " . $item['id']);
    unset(
      $item['filename'],
      $item['extension'],
      $item['prevId'],
      $item['nextId'],
      $item['width'],
      $item['srcWidth'],
      $item['height'],
      $item['rendered']
    );
    $res = $this->db->update($this->tableName, $item, ['id' => $item['id']]);
    //$this->logger->addDebug("updating item result = " . $res);
    if ($res === 1) {
      return $this->findById($item['id']);
    }

    return false;
  }

  /**
   * @return int
   */
  public function getUnnotifiedCount()
  {
    $sql = "SELECT COUNT(*) FROM $this->tableName WHERE notificationId IS NULL";
    return (int)$this->db->fetchColumn($sql);
  }

  /**
   * @return array
   */
  public function listIds()
  {
    $sql = "SELECT id FROM $this->tableName ORDER BY date DESC";
    $listIds = $this->db->fetchAll($sql);
    $res = [];
    foreach ($listIds as $value) {
      $res[] = $value['id'];
    }
    return $res;
  }

  /**
   * @return int
   */
  public function count()
  {
    $sql = "SELECT COUNT(*) FROM $this->tableName";
    return (int)$this->db->fetchColumn($sql);
  }

  /**
   * @param int $id
   * @return mixed
   */
  public function delete(int $id)
  {
    return $this->db->delete($this->tableName, ['id' => $id]);
  }

  /**
   * @return int
   */
  public function deleteAll()
  {
    $sql = "DELETE FROM $this->tableName";
    return $this->db->exec($sql);
  }

  /**
   * @param $notificationId
   * @return mixed
   */
  public function setNotification($notificationId)
  {
    $sql = "UPDATE $this->tableName SET notificationId = ? WHERE notificationId IS NULL";
    return $this->db->executeQuery($sql, [$notificationId]);
  }

  /**
   * @return mixed
   */
  protected function getMaxId()
  {
    $sql = "SELECT MAX(id) FROM $this->tableName";
    return $this->db->fetchColumn($sql);
  }
}
