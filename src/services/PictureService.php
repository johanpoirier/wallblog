<?php

namespace services;

/**
 * Description of PictureService
 *
 * @author dst17
 */
class PictureService {

    private static $db;
    private static $table_name = "wallblog__item";
    private static $logger;
    private static $dir;

    public function __construct($db, $app_logger) {
        self::$db = $db;
        self::$logger = $app_logger;
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

    public function getById($id) {
        $sql = "SELECT * FROM " . self::$table_name . " WHERE id = ?";
        return self::$db->fetchAssoc($sql, array($id));
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

        $this->resize(self::$dir . "/" . $file_name, 1024);
        $image_info = getimagesize(self::$dir . "/" . $file_name);
        $item["ratio"] = $image_info[0] / $image_info[1];
        $item["reverseRatio"] = $image_info[1] / $image_info[0];

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

    public function getExtension($file_name) {
        $ext = explode('.', $file_name);
        $ext = array_pop($ext);
        return strtolower($ext);
    }

    public function resize($filename, $maxDimension) {
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
                imagejpeg($new_image, $filename, 90);
            } elseif ($image_type == IMAGETYPE_PNG) {
                imagepng($new_image, $filename);
            }
        }
    }

    public function rebuild() {
        $items = self::getAll();
        for ($i = 0; $i < sizeof($items); $i++) {
            $item = $items[$i];
            $image_info = getimagesize(self::$dir . "/" . $item['file']);
            self::$db->update(self::$table_name, array("ratio" => $image_info[0] / $image_info[1], "reverseRatio" => $image_info[1] / $image_info[0]), array('id' => $item['id']));
        }
    }
}
?>