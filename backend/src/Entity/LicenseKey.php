<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ApiResource()
 * @ORM\Entity(repositoryClass="App\Repository\LicenseKeyRepository")
 */
class LicenseKey
{
  /**
   * @ORM\Id()
   * @ORM\GeneratedValue()
   * @ORM\Column(type="integer")
   */
  private $id;

  /**
   * @ORM\Column(type="string", length=255)
   */
  private $license;

  /**
   * @ORM\Column(type="boolean")
   */
  private $disabled;

  /**
   * @ORM\Column(type="date")
   */
  private $expiration_date;

  public function getId(): ?int
  {
    return $this->id;
  }

  public function getLicense(): ?string
  {
    return $this->license;
  }

  public function setLicense(string $license): self
  {
    $this->license = $license;

    return $this;
  }

  public function getDisabled(): ?bool
  {
    return $this->disabled;
  }

  public function setDisabled(bool $disabled): self
  {
    $this->disabled = $disabled;

    return $this;
  }

  public function getExpirationDate(): ?\DateTimeInterface
  {
    return $this->expiration_date;
  }

  public function setExpirationDate(\DateTimeInterface $expiration_date): self
  {
    $this->expiration_date = $expiration_date;

    return $this;
  }
}
