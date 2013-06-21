<?php

namespace services;

/**
 * Description of PictureService
 *
 * @author dst17
 */
class PictureService {

    private static $db;
    private static $table_name;
    private static $logger;
    private static $dir;

    public function __construct($db, $app_logger, $config) {
        self::$db = $db;
        self::$logger = $app_logger;
        self::$table_name = $config["prefix"] . "__item";
        self::$dir = __DIR__ . '/../../web/pictures';
    }

    public function get($nb, $index) {
        $sql = "SELECT * FROM " . self::$table_name . " ORDER BY date DESC" . " LIMIT " . $index . ", " . $nb;
        return self::$db->fetchAll($sql);
    }

    public function getAll() {
        $sql = "SELECT * FROM " . self::$table_name . " ORDER BY date DESC";
        return self::$db->fetchAll($sql);
    }  
    
    public function listIds() {
        $sql = "SELECT id FROM " . self::$table_name . " ORDER BY date DESC";
        $listIds = self::$db->fetchAll($sql);
        $res = array();
        foreach ($listIds as $value) {
            $res[] = $value['id'];
        }
        return $res;
    }

    public function getById($id) {
        $sql = "SELECT * FROM " . self::$table_name . " WHERE id = ?";
        $picture = self::$db->fetchAssoc($sql, array($id));
        
        // previous picture
        $prev = false;
        $prevId = $id - 1;
        while(!$prev && $prevId > 0) {
            $prev = self::$db->fetchAssoc($sql, array($prevId--));
        }
        if($prev) {
            $picture['prevId'] = $prev['id'];
        }
        
        // next picture
        $next = false;
        $nextId = $id + 1;
        $maxId = $this->getMaxId();
        while(!$next && $nextId < $maxId) {
            $next = self::$db->fetchAssoc($sql, array($nextId++));
        }
        if($next) {
            $picture['nextId'] = $next['id'];
        }
        
        return $picture;
    }

    public function count() {
        $sql = "SELECT COUNT(*) FROM " . self::$table_name;
        return self::$db->fetchColumn($sql);
    }

    public function add($file_name, $description = null, $date = null) {
        $item["file"] = $file_name;
        $item["description"] = $description;
        if (!$date) {
            $exif_data = @exif_read_data(self::$dir . "/" . $file_name);
            if ($exif_data !== false) {
                if (isset($exif_data['DateTimeOriginal'])) {
                    $date = $exif_data['DateTimeOriginal'];
                }
                if (empty($date) && isset($exif_data['DateTime'])) {
                    $date = $exif_data['DateTime'];
                }
                self::$logger->debug("exif date of " . $file_name . " : " . $date);
            }
        }
        $item["date"] = ($date == null) ? date("Y-M-d") : $date;

        // resize in 2 sizes
        $this->resize(self::$dir . "/" . $file_name, 1600, 85);
        copy(self::$dir . "/" . $file_name, self::$dir . "/m_" . $file_name);
        $this->resize(self::$dir . "/m_" . $file_name, 640, 75);
        
        $image_info = getimagesize(self::$dir . "/" . $file_name);
        $item["ratio"] = $image_info[0] / $image_info[1];
        $item["reverseRatio"] = $image_info[1] / $image_info[0];

        return $this->insert($item);
    }

    public function insert($item) {
        $res = self::$db->insert(self::$table_name, $item);
        if ($res == 1) {
            $id = self::$db->lastInsertId(self::$table_name);
            return $this->getById($id);
        } else {
            return null;
        }
    }

    public function update($item) {
        self::$logger->addDebug("updating item : " . $item['id']);
        unset($item['prevId']);
        unset($item['nextId']);
        $res = self::$db->update(self::$table_name, $item, array('id' => $item['id']));
        self::$logger->addDebug("updating item result = " . $res);
        if ($res == 1) {
            return self::getById($item['id']);
        }
        return false;
    }

    public function delete($id) {
        self::$logger->addDebug("deleting item : " . $id);
        self::$db->delete(self::$table_name, array("id" => $id));
    }

    public function deleteAll() {
        $sql = "DELETE FROM " . self::$table_name;
        return self::$db->exec($sql);
    }

    public function getExtension($file_name) {
        $ext = explode('.', $file_name);
        $ext = array_pop($ext);
        return strtolower($ext);
    }

    public function resize($filename, $maxDimension, $quality = 90) {
        $image_info = getimagesize($filename);
        $image_type = $image_info[2];
        //self::$logger->debug("image type : " . $image_type);
        if ($image_type == IMAGETYPE_JPEG) {
            $image = imagecreatefromjpeg($filename);
        } elseif ($image_type == IMAGETYPE_PNG) {
            $image = imagecreatefrompng($filename);
        }

        $image_width = imagesx($image);
        $image_height = imagesy($image);
        $image_ratio = $image_width / $image_height;
        //self::$logger->debug("image ratio : " . $image_ratio);
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
        //self::$logger->debug("resize ratio : " . $resize_ratio);
        //self::$logger->debug("new dimensions : " . $new_image_width . " x " . $new_image_height);

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
            if(!file_exists(self::$dir . "/m_" . $item['file'])) {
                self::$logger->addDebug("rebuilding item : " . $item['file']);
                copy(self::$dir . "/" . $item['file'], self::$dir . "/m_" . $item['file']);
                $this->resize(self::$dir . "/m_" . $item['file'], 640, 75);
                $image_info = getimagesize(self::$dir . "/" . $item['file']);
                self::$db->update(self::$table_name, array("ratio" => $image_info[0] / $image_info[1], "reverseRatio" => $image_info[1] / $image_info[0]), array('id' => $item['id']));
            }
        }
    }
    
    public function getMaxId() {
        $sql = "SELECT MAX(id) FROM " . self::$table_name;
        return self::$db->fetchColumn($sql);
    }
}
?>