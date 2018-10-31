<?php

namespace App\Service;

use App\Repository\ItemRepository;
use Psr\Log\LoggerInterface;

class PictureService
{
  private $repository;
  private $logger;
  private $dir;

  public function __construct(ItemRepository $repository, LoggerInterface $logger)
  {
    $this->repository = $repository;
    $this->logger = $logger;
    $this->dir = __DIR__ . '/../../dist/pictures';
  }

  public function add($fileName, $description = null, $date = null)
  {
    // create item
    $item['file'] = $fileName;
    $item['description'] = $description;
    if (!$date) {
      $exifData = @exif_read_data($this->dir . '/' . $fileName);
      if ($exifData !== false) {
        if (isset($exifData['DateTimeOriginal'])) {
          $date = $exifData['DateTimeOriginal'];
        }
        if (empty($date) && isset($exifData['DateTime'])) {
          $date = $exifData['DateTime'];
        }
        $this->logger->info("exif date of $fileName: $date");
      }
    }
    $this->logger->info("file date: $date");
    $item['date'] = $date ?? date('Y-m-d H:i:s');
    $this->logger->info('item date: ' . $item['date']);

    // resize in 4 sizes
    $this->samplePicture($fileName);

    // compute ratio
    $image_info = getimagesize(sprintf('%s/%s', $this->dir, $fileName));
    $item['ratio'] = $image_info[0] / $image_info[1];
    $item['reverseRatio'] = 1 / $item['ratio'];

    return $this->repository->add($item);
  }

  protected function samplePicture($fileName, $force = false): void
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

  /**
   * @param $fileName
   * @return string
   */
  public function getExtension($fileName): string
  {
    $ext = explode('.', $fileName);
    $ext = array_pop($ext);
    return strtolower($ext);
  }

  /**
   * @param $filename
   * @param $maxWidth
   * @param int $quality
   */
  protected function resize($filename, $maxWidth, $quality = 85): void
  {
    $imageInfo = getimagesize($filename);
    $imageType = $imageInfo[2];

    if ($imageType === IMAGETYPE_JPEG) {
      $image = imagecreatefromjpeg($filename);
    } elseif ($imageType === IMAGETYPE_PNG) {
      $image = imagecreatefrompng($filename);
    } else {
      return;
    }

    $resizeRatio = 1;
    $imageWidth = $new_image_width = imagesx($image);
    $imageHeight = $new_image_height = imagesy($image);
    if ($imageWidth > $maxWidth) {
      $resizeRatio = $maxWidth / $imageWidth;
      $new_image_width = $maxWidth;
      $new_image_height = $resizeRatio * $imageHeight;
    }

    if ($resizeRatio !== 1) {
      $new_image = imagecreatetruecolor($new_image_width, $new_image_height);
      imagecopyresampled($new_image, $image, 0, 0, 0, 0, $new_image_width, $new_image_height, $imageWidth, $imageHeight);

      // progressive image
      imageinterlace($new_image, true);

      if ($imageType === IMAGETYPE_JPEG) {
        imagejpeg($new_image, $filename, $quality);
      } elseif ($imageType === IMAGETYPE_PNG) {
        imagepng($new_image, $filename);
      }
    }
  }

  /**
   * @param bool $force
   */
  public function rebuild($force = false): void
  {
    $items = $this->repository->findAll();
    foreach ($items as $item) {
      if ($item['type'] === 'picture') {
        $fileName = urldecode($item['file']);
        $this->logger->debug("rebuilding item: $fileName");

        $this->samplePicture($fileName, $force);
        $imageInfo = getimagesize(sprintf('%s/%s', $this->dir, $fileName));

        $item['ratio'] = $imageInfo[0] / $imageInfo[1];
        $item['reverseRatio'] = $imageInfo[1] / $imageInfo[0];

        $this->repository->update($item);
      }
    }
  }
}
