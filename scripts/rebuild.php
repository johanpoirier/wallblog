#!/usr/bin/env php
<?php

/** Bootstraping */
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../src/Service/PictureService.php';

include __DIR__ . '/../__src/config.php';

$app = new Silex\Application();
$app['debug'] = true;

date_default_timezone_set('Europe/Paris');

$app->register(new Silex\Provider\DoctrineServiceProvider(), array(
  'db.options' => array(
    'driver' => 'pdo_mysql',
    'host' => $config["host"],
    'dbname' => $config["dbname"],
    'user' => $config["user"],
    'password' => $config["password"],
    'charset' => 'utf8'
  ),
  'db.dbal.class_path' => __DIR__ . '/../vendor/doctrine-dbal/lib',
  'db.common.class_path' => __DIR__ . '/../vendor/doctrine-common/lib'
));

$app->register(new Silex\Provider\MonologServiceProvider(), array(
  'monolog.class_path' => __DIR__ . '/../vendor/monolog/src',
  'monolog.logfile' => __DIR__ . '/../logs/rebuild.log',
  'monolog.name' => 'script',
  'monolog.level' => 100 // Logger::DEBUG
));

/** Services */
$pictureService = new services\PictureService($app['db'], $app['monolog'], $config);
$pictureService->rebuild(true);
