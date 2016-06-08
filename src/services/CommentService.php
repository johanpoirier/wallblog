<?php

namespace services;

/**
 * Description of CommentService
 *
 * @author dst17
 */
class CommentService {

    private static $db;
    private static $table_name;
    private static $item_table_name;
    private static $logger;

    public function __construct($db, $app_logger, $config) {
        self::$db = $db;
        self::$logger = $app_logger;
        self::$table_name = $config["prefix"] . "__comment";
        self::$item_table_name = $config["prefix"] . "__item";
    }

    public function get($id) {
        $sql = "SELECT * FROM " . self::$table_name . " WHERE id = ?";
        return self::$db->fetchAssoc($sql, array((int) $id));
    }

    public function getLast($nb) {
        $sql = "SELECT * FROM " . self::$table_name . " ORDER BY date DESC LIMIT $nb";
        return self::$db->fetchAll($sql);
    }
    
    public function getLatest() {
        $commentsTable = self::$table_name;
        $itemsTable = self::$item_table_name;
        $request = <<<SQL
SELECT c.id, c.text, c.author, c.date, c.idItem, i.description, i.file
FROM $commentsTable c LEFT JOIN $itemsTable i ON (c.idItem = i.id)
ORDER BY c.id DESC LIMIT 20;
SQL;
        return self::$db->fetchAll($request);
    }
    
    public function getByItem($idItem) {
        $sql = "SELECT * FROM " . self::$table_name . " WHERE idItem = ? ORDER BY date desc";
        return self::$db->fetchAll($sql, array($idItem));
    }
    
    public function add($comment) {
        $comment['date'] = date("Y-m-d H:i:s");
        $res = self::$db->insert(self::$table_name, $comment);
        if ($res == 1) {
            $id = self::$db->lastInsertId(self::$table_name);
            return $this->get($id);
        } else {
            return null;
        }
    }
    
    public function delete($id) {
        self::$db->delete(self::$table_name, array("id" => $id));
    }

    public function deleteAll() {
        $sql = "DELETE FROM " . self::$table_name;
        return self::$db->exec($sql);
    }
}
