<?php

namespace services;

/**
 * Description of SubscriptionService
 *
 * @author dst17
 */
class SubscriptionService {

    private static $db;
    private static $table_name;
    private static $logger;

    public function __construct($db, $app_logger, $config) {
        self::$db = $db;
        self::$logger = $app_logger;
        self::$table_name =  $config["prefix"] . "__subscription";
    }

    public function create($subscriptionData) {
        $subscription = [
          'endpoint' => $data['endpoint'],
          'p256dh' => $data['keys']['p256dh'],
          'auth' => $data['keys']['auth']
        ];
        $res = self::$db->insert(self::$table_name, $subscription);
        self::$logger->addDebug("creating new subscription: " . $subscription);
        return true;
    }
}
