<?php

namespace services;

/**
 * Description of CommentService
 *
 * @author dst17
 */
class CommentService {

    private static $db;
    private static $table_name = "wallblog__comment";
    private static $logger;

    public function __construct($db, $app_logger) {
        self::$db = $db;
        self::$logger = $app_logger;
    }

    public function get($id) {
        $sql = "SELECT * FROM " . self::$table_name . " WHERE id = ?";
        return self::$db->fetchAssoc($sql, array((int) $id));
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
}

?>