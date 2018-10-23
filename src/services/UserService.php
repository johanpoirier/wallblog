<?php

namespace services;

/**
 * Description of UserService
 *
 * @author dst17
 */
class UserService {

    private static $db;
    private static $table_name;
    private static $logger;
    private static $salt;

    public function __construct($db, $app_logger, $config) {
        self::$db = $db;
        self::$logger = $app_logger;
        self::$table_name =  $config['prefix'] . '__user';
        self::$salt = $config['salt'];
    }

    public function getByEmail($email) {
        $sql = 'SELECT * FROM ' . self::$table_name . ' WHERE email = ?';
        return self::$db->fetchAssoc($sql, [strtolower($email)]);
    }

    public function login($email, $password) {
        $user = $this->getByEmail($email);
        if (($user['password'] !== $this->getSaltedPassword('')) && ($user['password'] === $this->getSaltedPassword($password))) {
            return $user;
        }
        return false;
    }

    public function create($user) {
        $existingUser = $this->getByEmail($user['email']);
        if (!$existingUser) {
            $user['email'] = strtolower($user['email']);
            $user['password'] = $this->getSaltedPassword($user['password']);
            $res = self::$db->insert(self::$table_name, $user);
            self::$logger->addDebug('creating new user : ' . $user['email']);
            if ($res === 1) {
                return $this->getByEmail($user['email']);
            }
        }
        return false;
    }

    public function deleteAll() {
        $sql = 'DELETE FROM ' . self::$table_name;
        return self::$db->exec($sql);
    }

    public function count() {
        $sql = 'SELECT COUNT(*) FROM ' . self::$table_name;
        return self::$db->fetchColumn($sql);
    }

    private function getSaltedPassword($password) {
      return hash_hmac('sha256', $password, self::$salt);
    }
}
