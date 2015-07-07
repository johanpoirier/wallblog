<?php

namespace services;

class VideoService extends PictureService {

    public function get($nb, $index) {
        $sql = "SELECT * FROM " . $this->table_name . " WHERE type = 'video' ORDER BY date DESC" . " LIMIT " . $index . ", " . $nb;
        return $this->db->fetchAll($sql);
    }

    public function getByDate($value) {
        $sql = "SELECT * FROM " . $this->table_name . " WHERE type = 'video' AND date LIKE '" . $value . "%' ORDER BY date DESC";
        return $this->db->fetchAll($sql);
    }

    public function getAll() {
        $sql = "SELECT * FROM " . $this->table_name . " WHERE type = 'video' ORDER BY date DESC";
        return $this->db->fetchAll($sql);
    }  

    public function count() {
        $sql = "SELECT COUNT(*) FROM " . $this->table_name . " WHERE type = 'video'";
        return $this->db->fetchColumn($sql);
    }

    public function add($url, $description = null, $date = null) {
        $item["file"] = $url;
        $item["description"] = $description;
        $item["type"] = 'video';
        $item["date"] = $date . " 00:00:00" || date("Y-M-d H:i:s");

        return $this->insert($item);
    }

    public function deleteAll() {
        $sql = "DELETE FROM " . $this->table_name . " WHERE type = 'video'";
        return $this->db->exec($sql);
    }
}
