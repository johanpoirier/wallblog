<?php

require_once __DIR__ . '/../vendor/silex/silex/src/Silex/WebTestCase.php';

use Silex\WebTestCase;
use Symfony\Component\HttpFoundation\Session\Storage\MockFileSessionStorage;

class WallBlogTest extends WebTestCase {

    public function __construct() {
        parent::__construct();
    } 
    
    public function createApplication() {
        $app = require __DIR__ . '/../src/wallblog_tests.php';
        $api = require __DIR__ . '/../src/controllers/api.php';
        $app->mount('/api', $api);
        $app['debug'] = true;
        unset($app['exception_handler']);
        $app['session.storage'] = $app->share(function() {
            return new MockFileSessionStorage(sys_get_temp_dir());
        });
        $app['session']->set('email', "darth.vader@gmail.com");

        return $app;
    }

    public function setUp() {
        parent::setUp();

        $user = array("email" => "darth.vader@gmail.com", "password" => "f71dbe52628a3f83a77ab494817525c6");
        $this->app['user_service']->create($user);
    }

    public function testGetUser() {
        $client = $this->createClient();
        $client->request('GET', '/api/user', array(), array());
        $this->assertTrue($client->getResponse()->isOk());
        $jsonUser = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals($jsonUser["email"], "darth.vader@gmail.com");
    }
	
    public function tearDown() {
        $this->app['user_service']->deleteAll();
    }
}

?>