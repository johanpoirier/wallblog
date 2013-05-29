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

        // set user
        $user = array("email" => "darth.vader@gmail.com", "password" => "f71dbe52628a3f83a77ab494817525c6");
        $this->app['user_service']->create($user);

        // set pictures
        $item1 = array("id" => "354", "file" => "2013_05_26_3561.JPG", "description" => "Bienvenue Alice !", "date" => "2013-05-26 17:04:17", "like" => "0", "ratio" => "1.499531", "reverseRatio" => "0.666875", "type" => "picture");
        $item2 = array("id" => "334", "file" => "2013_05_19_3325.JPG", "description" => "La East side galerie", "date" => "2013-05-19 11:02:09", "like" => "0", "ratio" => "1.392515", "reverseRatio" => "0.718125", "type" => "picture");
        $this->app['picture_service']->insert($item1);
        $this->app['picture_service']->insert($item2);
    }

    public function testGetUser() {
        $client = $this->createClient();
        $client->request('GET', '/api/user');
        $this->assertTrue($client->getResponse()->isOk());
        $jsonUser = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals("darth.vader@gmail.com", $jsonUser["email"]);
    }

    public function testGetItems() {
        $client = $this->createClient();
        $client->request('GET', '/api/item');
        $this->assertTrue($client->getResponse()->isOk());
        $jsonItems = json_decode($client->getResponse()->getContent(), true);
        $this->assertCount(2, $jsonItems);
    }

    public function testGetItem354() {
        $client = $this->createClient();
        $client->request('GET', '/api/item/354');
        $this->assertTrue($client->getResponse()->isOk());
        $jsonItem = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals("Bienvenue Alice !", $jsonItem["description"]);
    }

    public function testDeleteItem334() {
        $client = $this->createClient();
        $client->request('DELETE', '/api/item/334');
        $this->assertTrue($client->getResponse()->isOk());
        $this->assertEquals("Item removed", $client->getResponse()->getContent());
    }

    public function testUpdateItem354() {
        $client = $this->createClient();
        $client->request(
            'PUT',
            '/api/item/354',
            array(),
            array(),
            array('CONTENT_TYPE' => 'application/json'),
            '{ "id": 354, "file": "2013_05_26_3561.JPG", "description": "Johan is the best" }'
        );
        $this->assertTrue($client->getResponse()->isOk());
        $jsonItem = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals("Johan is the best", $jsonItem["description"]);
    }

    public function testAddComment() {
        $client = $this->createClient();
        $client->request(
            'POST',
            '/api/item/354/comments',
            array(),
            array(),
            array('CONTENT_TYPE' => 'application/json'),
            '{ "idItem": 354, "text": "nice blog", "author": "superman" }'
        );
        $this->assertTrue($client->getResponse()->isOk());
        $jsonComment = json_decode($client->getResponse()->getContent(), true);
        $this->assertGreaterThan(0, $jsonComment["id"]);
    }

    public function tearDown() {
        $this->app['user_service']->deleteAll();
        $this->app['picture_service']->deleteAll();
        $this->app['comment_service']->deleteAll();
    }
}

?>