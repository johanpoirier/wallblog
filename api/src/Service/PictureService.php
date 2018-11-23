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
    $filePathInvertedBg = sprintf('%s/%s--%s.%s', $this->dir, $fileNameInfo['filename'], 'ibg', $fileNameInfo['extension']);

    $this->resize($filePathSource, 2048);

    if ($force) {
      unlink($filePath1600);
      unlink($filePath1024);
      unlink($filePath640);
      unlink($filePath320);
      unlink($filePathInvertedBg);
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

    if (!file_exists($filePathInvertedBg)) {
      copy($filePathSource, $filePathInvertedBg);
      $this->resize($filePathInvertedBg, 320);
      $this->invertColors($filePathInvertedBg);
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

  protected function getImageType($filename)
  {
    $imageInfo = getimagesize($filename);
    return $imageInfo[2];
  }

  /**
   * @param $filename
   * @param null $imageType
   * @return resource|null
   */
  protected function loadImage($filename, $imageType = null)
  {
    if ($imageType === null) {
      $imageType = $this->getImageType($filename);
    }

    if ($imageType === IMAGETYPE_JPEG) {
      return imagecreatefromjpeg($filename);
    }
    if ($imageType === IMAGETYPE_PNG) {
      return imagecreatefrompng($filename);
    }

    return null;
  }

  /**
   * @param $newImage
   * @param $filename
   * @param null $imageType
   * @param int $quality
   */
  protected function saveImage($newImage, $filename, $imageType = null, $quality = 85)
  {
    if ($imageType === null) {
      $imageType = $this->getImageType($filename);
    }

    if ($imageType === IMAGETYPE_JPEG) {
      imagejpeg($newImage, $filename, $quality);
    } elseif ($imageType === IMAGETYPE_PNG) {
      imagepng($newImage, $filename);
    }
  }

  /**
   * @param $filename
   * @param $maxWidth
   * @param int $quality
   */
  protected function resize($filename, $maxWidth, $quality = 85): void
  {
    $imageType = $this->getImageType($filename);
    $image = $this->loadImage($filename, $imageType);

    if (!$image) {
      return;
    }

    $resizeRatio = 1;
    $imageWidth = $newImageWidth = imagesx($image);
    $imageHeight = $newImageHeight = imagesy($image);
    if ($imageWidth > $maxWidth) {
      $resizeRatio = $maxWidth / $imageWidth;
      $newImageWidth = $maxWidth;
      $newImageHeight = $resizeRatio * $imageHeight;
    }

    if ($resizeRatio !== 1) {
      $newImage = imagecreatetruecolor($newImageWidth, $newImageHeight);
      imagecopyresampled($newImage, $image, 0, 0, 0, 0, $newImageWidth, $newImageHeight, $imageWidth, $imageHeight);

      // progressive image
      imageinterlace($newImage, true);

      $this->saveImage($newImage, $filename, $imageType, $quality);
    }
  }

  protected function invertColors($filename): void
  {
    $imageType = $this->getImageType($filename);
    $image = $this->loadImage($filename, $imageType);

    if (!$image) {
      return;
    }

    imagefilter($image, IMG_FILTER_NEGATE);

    $this->saveImage($image, $filename, $imageType, 40);
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
