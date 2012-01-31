<?php

namespace services;

/**
 * Description of UserService
 *
 * @author dst17
 */
class UserService {

    private static $db;
    private static $table_name = "wallblog__user";
    private static $logger;

    public function __construct($db, $app_logger) {
        self::$db = $db;
        self::$logger = $app_logger;
    }

    public function getByEmail($email) {
        $sql = "SELECT * FROM " . self::$table_name . " WHERE email = ?";
        return self::$db->fetchAssoc($sql, array(strtolower($email)));
    }

    public function login($email, $password) {
        $user = self::getByEmail($email);
        if (($user['password'] != md5('')) && ($user['password'] == md5($password))) {
            return $user;
        } else {
            return false;
        }
    }
<<<<<<< HEAD
    
=======

>>>>>>> e421eff5e542cc44a53b2e54e5aa8140958ebb88
    public function create($user) {
        $existingUser = self::getByEmail($user['email']);
        if (!$existingUser) {
            $user['email'] = strtolower($user['email']);
            $res = self::$db->insert(self::$table_name, $user);
            self::$logger->addDebug("creating new user : " . $user);
            if ($res == 1) {
                return self::getByEmail($user['email']);
            }
        }
        return false;
    }
<<<<<<< HEAD

=======
	
>>>>>>> e421eff5e542cc44a53b2e54e5aa8140958ebb88
    public function deleteAll() {
        $sql = "DELETE FROM " . self::$table_name;
        return self::$db->exec($sql);
    }
}

?>