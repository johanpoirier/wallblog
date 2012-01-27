<?php

use Silex\WebTestCase;
use Symfony\Component\HttpFoundation\SessionStorage\FilesystemSessionStorage;

class WallBlogTest extends WebTestCase {

    public function __construct() {
        parent::__construct();
    } 
    
    public function createApplication() {
        $app = require __DIR__ . '/../src/life.php';
        $app['debug'] = true;
        unset($app['exception_handler']);
        $app['session.storage'] = $app->share(function() {
            return new FilesystemSessionStorage(sys_get_temp_dir());
        });
        $app['session']->set('email', "johan.poirier@gmail.com");

        return $app;
    }

    public function testGetUser() {
        $client = $this->createClient();
        $client->request('GET', '/api/currentuser', array(), array());
        $this->assertTrue($client->getResponse()->isOk());
        //$jsonUser = json_decode($client->getResponse()->getContent(), true);
        //$this->assertEquals($jsonUser["nickname"], "dst17");
    }
}

?>