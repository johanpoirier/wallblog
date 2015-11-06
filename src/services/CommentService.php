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
    private static $logger;

    public function __construct($db, $app_logger, $config) {
        self::$db = $db;
        self::$logger = $app_logger;
        self::$table_name = $config["prefix"] . "__comment";
    }

    public function get($id) {
        $sql = "SELECT * FROM " . self::$table_name . " WHERE id = ?";
        return self::$db->fetchAssoc($sql, array((int) $id));
    }

    public function getLast($nb) {
        $sql = "SELECT * FROM " . self::$table_name . " ORDER BY date DESC LIMIT ".$nb;
        return self::$db->fetchAll($sql);
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
