<?php

namespace services;

class LikeService {

    private static $db;
    private static $table_name;
    private static $item_table_name;
    private static $logger;

    public function __construct($db, $app_logger, $config) {
        self::$db = $db;
        self::$logger = $app_logger;
        self::$table_name = $config["prefix"] . "__like";
        self::$item_table_name = $config["prefix"] . "__item";
    }

    public function get($id) {
        $sql = "SELECT * FROM " . self::$table_name . " WHERE id = ?";
        return self::$db->fetchAssoc($sql, [(int) $id]);
    }

    public function getLatest() {
        $likesTable = self::$table_name;
        $itemsTable = self::$item_table_name;
        $request = <<<SQL
SELECT l.*, i.description, i.file
FROM $likesTable l LEFT JOIN $itemsTable i ON (l.itemId = i.id)
ORDER BY l.id DESC LIMIT 20;
SQL;
        return self::$db->fetchAll($request);
    }
    
    public function getByItem($itemId) {
        $sql = "SELECT * FROM " . self::$table_name . " WHERE itemId = ? ORDER BY date desc";
        return self::$db->fetchAll($sql, [ $itemId ]);
    }
    
    public function add($data, $ua, $ip) {
        $like = [
            'itemId' => $data['itemId'],
            'visitorId' => $data['visitorId'],
            'date' => date("Y-m-d H:i:s"),
            'userAgent' => $ua,
            'ip' => $ip
        ];
        $res = self::$db->insert(self::$table_name, $like);
        if ($res == 1) {
            $id = self::$db->lastInsertId(self::$table_name);
            return $this->get($id);
        } else {
            return null;
        }
    }
    
    public function delete($id) {
        self::$db->delete(self::$table_name, ["id" => $id]);
    }

    public function deleteAll() {
        $sql = "DELETE FROM " . self::$table_name;
        return self::$db->exec($sql);
    }
}
