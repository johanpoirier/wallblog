<?php

namespace services;

/**
 * Description of PictureService
 *
 * @author dst17
 */
class PictureService {

    protected $db;
    protected $table_name;
    protected $logger;
    protected $dir;

    public function __construct($db, $app_logger, $config) {
        $this->db = $db;
        $this->logger = $app_logger;
        $this->table_name = $config["prefix"] . "__item";
        $this->dir = __DIR__ . '/../../web/pictures';
    }

    public function get($nb, $index) {
        $sql = "SELECT * FROM " . $this->table_name . " ORDER BY date DESC" . " LIMIT " . $index . ", " . $nb;
        return $this->db->fetchAll($sql);
    }

    public function getByDate($value) {
        $sql = "SELECT * FROM " . $this->table_name . " WHERE date LIKE '" . $value . "%' ORDER BY date DESC";
        return $this->db->fetchAll($sql);
    }

    public function getAll() {
        $sql = "SELECT * FROM " . $this->table_name . " ORDER BY date DESC";
        return $this->db->fetchAll($sql);
    }  
    
    public function listIds() {
        $sql = "SELECT id FROM " . $this->table_name . " ORDER BY date DESC";
        $listIds = $this->db->fetchAll($sql);
        $res = array();
        foreach ($listIds as $value) {
            $res[] = $value['id'];
        }
        return $res;
    }

    public function getById($id) {
        $sql = "SELECT * FROM " . $this->table_name . " WHERE id = ?";
        $picture = $this->db->fetchAssoc($sql, array($id));
        
        // previous picture
        $prev = false;
        $prevId = $id - 1;
        while(!$prev && $prevId > 0) {
            $prev = $this->db->fetchAssoc($sql, array($prevId--));
        }
        if($prev) {
            $picture['prevId'] = $prev['id'];
        }
        
        // next picture
        $next = false;
        $nextId = $id + 1;
        $maxId = $this->getMaxId();
        while(!$next && $nextId < $maxId) {
            $next = $this->db->fetchAssoc($sql, array($nextId++));
        }
        if($next) {
            $picture['nextId'] = $next['id'];
        }
        
        return $picture;
    }

    public function count() {
        $sql = "SELECT COUNT(*) FROM " . $this->table_name;
        return $this->db->fetchColumn($sql);
    }

    public function add($file_name, $description = null, $date = null) {
        $item["file"] = $file_name;
        $item["description"] = $description;
        if (!$date) {
            $exif_data = @exif_read_data($this->dir . "/" . $file_name);
            if ($exif_data !== false) {
                if (isset($exif_data['DateTimeOriginal'])) {
                    $date = $exif_data['DateTimeOriginal'];
                }
                if (empty($date) && isset($exif_data['DateTime'])) {
                    $date = $exif_data['DateTime'];
                }
                $this->logger->debug("exif date of " . $file_name . " : " . $date);
            }
        }
        $item["date"] = ($date == null) ? date("Y-M-d") : $date;

        // resize in 3 sizes
        $this->resize($this->dir . "/" . $file_name, 1600, 85);
        copy($this->dir . "/" . $file_name, $this->dir . "/m1_" . $file_name);
        $this->resize($this->dir . "/m1_" . $file_name, 1024, 75);
        copy($this->dir . "/" . $file_name, $this->dir . "/m2_" . $file_name);
        $this->resize($this->dir . "/m2_" . $file_name, 640, 75);
        
        $image_info = getimagesize($this->dir . "/" . $file_name);
        $item["ratio"] = $image_info[0] / $image_info[1];
        $item["reverseRatio"] = $image_info[1] / $image_info[0];

        return $this->insert($item);
    }

    public function insert($item) {
        $res = $this->db->insert($this->table_name, $item);
        if ($res == 1) {
            $id = $this->db->lastInsertId($this->table_name);
            return $this->getById($id);
        } else {
            return null;
        }
    }

    public function update($item) {
        $this->logger->addDebug("updating item : " . $item['id']);
        unset($item['prevId']);
        unset($item['nextId']);
        $res = $this->db->update($this->table_name, $item, array('id' => $item['id']));
        $this->logger->addDebug("updating item result = " . $res);
        if ($res == 1) {
            return self::getById($item['id']);
        }
        return false;
    }

    public function delete($id) {
        $this->logger->addDebug("deleting item : " . $id);
        $this->db->delete($this->table_name, array("id" => $id));
    }

    public function deleteAll() {
        $sql = "DELETE FROM " . $this->table_name;
        return $this->db->exec($sql);
    }

    public function getExtension($file_name) {
        $ext = explode('.', $file_name);
        $ext = array_pop($ext);
        return strtolower($ext);
    }

    public function resize($filename, $maxDimension, $quality = 90) {
        $image_info = getimagesize($filename);
        $image_type = $image_info[2];
        //$this->logger->debug("image type : " . $image_type);
        if ($image_type == IMAGETYPE_JPEG) {
            $image = imagecreatefromjpeg($filename);
        } elseif ($image_type == IMAGETYPE_PNG) {
            $image = imagecreatefrompng($filename);
        }

        $image_width = imagesx($image);
        $image_height = imagesy($image);
        $image_ratio = $image_width / $image_height;
        //$this->logger->debug("image ratio : " . $image_ratio);
        $resize_ratio = 1;
        if ($image_ratio >= 1) {
            if ($maxDimension < $image_width) {
                $resize_ratio = $maxDimension / $image_width;
                $new_image_width = $maxDimension;
                $new_image_height = $resize_ratio * $image_height;
            }
        } else {
            if ($maxDimension < $image_height) {
                $resize_ratio = $maxDimension / $image_height;
                $new_image_height = $maxDimension;
                $new_image_width = $resize_ratio * $image_width;
            }
        }
        //$this->logger->debug("resize ratio : " . $resize_ratio);
        //$this->logger->debug("new dimensions : " . $new_image_width . " x " . $new_image_height);

        if ($resize_ratio != 1) {
            $new_image = imagecreatetruecolor($new_image_width, $new_image_height);
            imagecopyresampled($new_image, $image, 0, 0, 0, 0, $new_image_width, $new_image_height, $image_width, $image_height);

            if ($image_type == IMAGETYPE_JPEG) {
                imagejpeg($new_image, $filename, $quality);
            } elseif ($image_type == IMAGETYPE_PNG) {
                imagepng($new_image, $filename);
            }
        }
    }

    public function rebuild() {
        $items = self::getAll();
        for ($i = 0; $i < sizeof($items); $i++) {
            $item = $items[$i];
            if(!file_exists($this->dir . "/m1_" . $item['file'])) {
                $this->logger->addDebug("rebuilding item : " . $item['file']);
                copy($this->dir . "/" . $item['file'], $this->dir . "/m1_" . $item['file']);
                $this->resize($this->dir . "/m1_" . $item['file'], 1024, 75);
                copy($this->dir . "/" . $item['file'], $this->dir . "/m2_" . $item['file']);
                $this->resize($this->dir . "/m2_" . $item['file'], 640, 75);
                $image_info = getimagesize($this->dir . "/" . $item['file']);
                $this->db->update($this->table_name, array("ratio" => $image_info[0] / $image_info[1], "reverseRatio" => $image_info[1] / $image_info[0]), array('id' => $item['id']));
            }
        }
    }
    
    public function getMaxId() {
        $sql = "SELECT MAX(id) FROM " . $this->table_name;
        return $this->db->fetchColumn($sql);
    }
}
