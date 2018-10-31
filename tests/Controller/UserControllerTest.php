<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class UserControllerTest extends WebTestCase
{
//  protected function setUp()
//  {
//    self::bootKernel();
//    $container = self::$container;
//
//    $user = ['email' => 'darth.vader@gmail.com', 'password' => 'toto'];
//    $container->get(UserRepository::class)->add($user);
//  }

  public function testGetUser() {
    $client = static::createClient();

    $client->request('GET', '/api/user/186');

    $response = $client->getResponse();
    $this->assertEquals(200, $response->getStatusCode());

    $jsonUser = json_decode($response->getContent(), true);
    var_dump($jsonUser);
    $this->assertEquals('darth.vader@gmail.com', $jsonUser['email']);
  }
}
