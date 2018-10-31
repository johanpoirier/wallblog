<?php

namespace App\Entity;

class User implements \Symfony\Component\Security\Core\User\UserInterface
{
  private $id;
  private $email;
  private $password;

  public function __construct(int $id, string $email, string $password)
  {
    $this->id = $id;
    $this->email = $email;
    $this->password = $password;
  }

  /**
   * @return int
   */
  public function getId(): int
  {
    return $this->id;
  }

  /**
   * Returns the roles granted to the user.
   *
   * @return (Role|string)[] The user roles
   */
  public function getRoles(): array
  {
    return ['ROLE_ADMIN'];
  }

  /**
   * Returns the password used to authenticate the user.
   *
   * This should be the encoded password. On authentication, a plain-text
   * password will be salted, encoded, and then compared to this value.
   *
   * @return string The password
   */
  public function getPassword(): string
  {
    return $this->password;
  }

  /**
   * @return string|null The salt
   */
  public function getSalt()
  {
    return null;
  }

  /**
   * Returns the username used to authenticate the user.
   *
   * @return string The username
   */
  public function getUsername(): string
  {
    return $this->email;
  }

  /**
   * Removes sensitive data from the user.
   *
   * This is important if, at any given point, sensitive information like
   * the plain-text password is stored on this object.
   */
  public function eraseCredentials(): void
  {

  }
}
