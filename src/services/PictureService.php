<?php

namespace services;

/**
 * Description of PictureService
 *
 * @author dst17
 */
class PictureService {

    private static $db;
    private static $table_name = "life__item";
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

    public function getById($id) {
        $sql = "SELECT * FROM " . self::$table_name . " WHERE id = ?";
        return self::$db->fetchAssoc($sql, array($id));
    }

    public function add($file_name, $description = null, $date = null) {
        $item["file"] = $file_name;
        $item["description"] = $description;
        if (!$date) {
            $exif_data = exif_read_data(self::$dir . "/" . $file_name);
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
        $item["date"] = $date;
        self::$db->insert(self::$table_name, $item);
        $this->resize(self::$dir . "/" . $file_name, 1024);
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

}

?>