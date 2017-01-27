<?php

namespace services;

/**
 * Description of PictureService
 *
 * @author dst17
 */
class PictureService
{

  protected $db;
  protected $table_name;
  protected $like_table_name;
  protected $logger;
  protected $dir;

  public function __construct($db, $app_logger, $config)
  {
    $this->db = $db;
    $this->logger = $app_logger;
    $this->table_name = $config["prefix"] . "__item";
    $this->like_table_name = $config["prefix"] . "__like";
    $this->dir = __DIR__ . '/../../dist/pictures';
  }

  public function get($nb, $index)
  {
    $sql = <<<SQL
SELECT item.*, count(l.id) AS likes
FROM $this->table_name item
LEFT JOIN $this->like_table_name l ON (item.id = l.itemId)
GROUP BY item.id
ORDER BY date DESC
LIMIT $index, $nb;
SQL;
    return $this->db->fetchAll($sql);
  }

  public function getByDate($date)
  {
    $sql = <<<SQL
SELECT item.*, count(l.id) AS likes
FROM $this->table_name item
LEFT JOIN $this->like_table_name l ON (item.id = l.itemId)
WHERE item.date LIKE '$date%'
GROUP BY item.id
ORDER BY date DESC;
SQL;
    return $this->db->fetchAll($sql);
  }

  public function getAll()
  {
    $sql = <<<SQL
SELECT item.*, count(l.id) AS likes
FROM $this->table_name item
LEFT JOIN $this->like_table_name l ON (item.id = l.itemId)
GROUP BY item.id
ORDER BY date DESC;
SQL;
    return $this->db->fetchAll($sql);
  }

  public function getUnnotifiedCount()
  {
    $sql = "SELECT COUNT(*) FROM " . $this->table_name . " WHERE notificationId IS NULL";
    return $this->db->fetchColumn($sql);
  }

  public function listIds()
  {
    $sql = "SELECT id FROM " . $this->table_name . " ORDER BY date DESC";
    $listIds = $this->db->fetchAll($sql);
    $res = array();
    foreach ($listIds as $value) {
      $res[] = $value['id'];
    }
    return $res;
  }

  public function getById($id)
  {
    $sql = <<<SQL
SELECT item.*, count(l.id) AS likes
FROM $this->table_name item
LEFT JOIN $this->like_table_name l ON (item.id = l.itemId)
WHERE item.id = ?
GROUP BY item.id
ORDER BY date DESC;
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

  public function count()
  {
    $sql = "SELECT COUNT(*) FROM " . $this->table_name;
    return $this->db->fetchColumn($sql);
  }

  public function add($fileName, $description = null, $date = null)
  {
    // create item
    $item["file"] = $fileName;
    $item["description"] = $description;
    if (!$date) {
      $exif_data = @exif_read_data($this->dir . "/" . $fileName);
      if ($exif_data !== false) {
        if (isset($exif_data['DateTimeOriginal'])) {
          $date = $exif_data['DateTimeOriginal'];
        }
        if (empty($date) && isset($exif_data['DateTime'])) {
          $date = $exif_data['DateTime'];
        }
        $this->logger->info("exif date of " . $fileName . " : " . $date);
      }
    }
    $this->logger->info("file date: " . $date);
    $item["date"] = ($date == null) ? date("Y-m-d H:i:s") : $date;
    $this->logger->info("item date: " . $item["date"]);

    // resize in 4 sizes
    $this->samplePicture($fileName);

    // compute ratio
    $image_info = getimagesize(sprintf('%s/%s', $this->dir, $fileName));
    $item["ratio"] = $image_info[0] / $image_info[1];
    $item["reverseRatio"] = 1 / $item["ratio"];

    return $this->insert($item);
  }

  protected function samplePicture($fileName, $force = false)
  {
    $fileNameInfo = pathinfo($fileName);

    $filePathSource = sprintf('%s/%s', $this->dir, $fileName);
    $filePath1600 = sprintf('%s/%s--%s.%s', $this->dir, $fileNameInfo['filename'], '1600', $fileNameInfo['extension']);
    $filePath1024 = sprintf('%s/%s--%s.%s', $this->dir, $fileNameInfo['filename'], '1024', $fileNameInfo['extension']);
    $filePath640 = sprintf('%s/%s--%s.%s', $this->dir, $fileNameInfo['filename'], '640', $fileNameInfo['extension']);
    $filePath320 = sprintf('%s/%s--%s.%s', $this->dir, $fileNameInfo['filename'], '320', $fileNameInfo['extension']);

    $this->resize($filePathSource, 2048);

    if ($force) {
      unlink($filePath1600);
      unlink($filePath1024);
      unlink($filePath640);
      unlink($filePath320);
    }

    if (!file_exists($filePath1600)) {
      copy($filePathSource, $filePath1600);
      $this->resize($filePath1600, 1600);
    }

    if (!file_exists($filePath1024)) {
      copy($filePathSource, $filePath1024);
      $this->resize($filePath1024, 1024);
    }

    if (!file_exists($filePath640)) {
      copy($filePathSource, $filePath640);
      $this->resize($filePath640, 640);
    }

    if (!file_exists($filePath320)) {
      copy($filePathSource, $filePath320);
      $this->resize($filePath320, 320);
    }
  }

  public function insert($item)
  {
    $res = $this->db->insert($this->table_name, $item);
    if ($res == 1) {
      $id = $this->db->lastInsertId($this->table_name);
      return $this->getById($id);
    } else {
      return null;
    }
  }

  public function update($item)
  {
    $this->logger->addDebug("updating item : " . $item['id']);
    unset($item['filename']);
    unset($item['extension']);
    unset($item['prevId']);
    unset($item['nextId']);
    unset($item['width']);
    unset($item['srcWidth']);
    unset($item['height']);
    unset($item['rendered']);
    $res = $this->db->update($this->table_name, $item, array('id' => $item['id']));
    $this->logger->addDebug("updating item result = " . $res);
    if ($res == 1) {
      return self::getById($item['id']);
    }
    return false;
  }

  public function setNotification($notificationId)
  {
    $sql = "UPDATE $this->table_name SET notificationId = $notificationId WHERE notificationId IS NULL";
    $res = $this->db->exec($sql);
    return true;
  }

  public function delete($id)
  {
    $this->logger->addDebug("deleting item : " . $id);
    $this->db->delete($this->table_name, array("id" => $id));
  }

  public function deleteAll()
  {
    $sql = "DELETE FROM " . $this->table_name;
    return $this->db->exec($sql);
  }

  public function getExtension($file_name)
  {
    $ext = explode('.', $file_name);
    $ext = array_pop($ext);
    return strtolower($ext);
  }

  public function resize($filename, $maxWidth, $quality = 85)
  {
    $image_info = getimagesize($filename);
    $image_type = $image_info[2];

    if ($image_type == IMAGETYPE_JPEG) {
      $image = imagecreatefromjpeg($filename);
    } elseif ($image_type == IMAGETYPE_PNG) {
      $image = imagecreatefrompng($filename);
    } else {
      return;
    }

    $resize_ratio = 1;
    $image_width = $new_image_width = imagesx($image);
    $image_height = $new_image_height = imagesy($image);
    if ($image_width > $maxWidth) {
      $resize_ratio = $maxWidth / $image_width;
      $new_image_width = $maxWidth;
      $new_image_height = $resize_ratio * $image_height;
    }

    if ($resize_ratio != 1) {
      $new_image = imagecreatetruecolor($new_image_width, $new_image_height);
      imagecopyresampled($new_image, $image, 0, 0, 0, 0, $new_image_width, $new_image_height, $image_width, $image_height);

      // progressive image
      imageinterlace($new_image, true);

      if ($image_type == IMAGETYPE_JPEG) {
        imagejpeg($new_image, $filename, $quality);
      } elseif ($image_type == IMAGETYPE_PNG) {
        imagepng($new_image, $filename);
      }
    }
  }

  public function rebuild($force = false)
  {
    set_time_limit(0);
    $items = self::getAll();
    for ($i = 0; $i < sizeof($items); $i++) {
      $item = $items[$i];

      if ($item['type'] == 'picture') {
        $fileName = urldecode($item['file']);
        $this->logger->addDebug("rebuilding item : $fileName");

        $this->samplePicture($fileName, $force);
        $image_info = getimagesize(sprintf('%s/%s', $this->dir, $fileName));

        $this->db->update($this->table_name, array("ratio" => $image_info[0] / $image_info[1], "reverseRatio" => $image_info[1] / $image_info[0]), array('id' => $item['id']));
      }
    }
  }

  public function getMaxId()
  {
    $sql = "SELECT MAX(id) FROM " . $this->table_name;
    return $this->db->fetchColumn($sql);
  }
}
