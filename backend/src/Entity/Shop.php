<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ShopRepository")
 */
class Shop
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
  private $name;

  /**
   * @ORM\Column(type="string", length=255, nullable=true)
   */
  private $logo;

  /**
   * @ORM\Column(type="string", length=255)
   */
  private $uuid;

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

  /**
   * @ORM\Column(type="boolean")
   */
  private $root;

  /**
   * @ORM\ManyToMany(targetEntity="App\Entity\Category")
   */
  private $categories;

  /**
   * @ORM\ManyToMany(targetEntity="App\Entity\Design", inversedBy="shops")
   */
  private $designs;

  /**
   * @ORM\Column(type="string", length=255, nullable=true)
   */
  private $email;

  /**
   * @ORM\Column(type="string", length=255, nullable=true)
   */
  private $address;

  /**
   * @ORM\Column(type="string", length=255, nullable=true)
   */
  private $phone;

  /**
   * @ORM\Column(type="string", length=255, nullable=true)
   */
  private $owner_first_name;

  /**
   * @ORM\Column(type="string", length=255, nullable=true)
   */
  private $owner_last_name;

  /**
   * @ORM\Column(type="string", length=255, nullable=true)
   */
  private $owner_phone;

  /**
   * @ORM\Column(type="string", length=255, nullable=true)
   */
  private $payment_frequency;

  /**
   * @ORM\Column(type="string", length=255, nullable=true)
   */
  private $pin;

  /**
   * @ORM\Column(type="date", nullable=true)
   */
  private $subscription_date;

  public function __construct()
  {
    $this->categories = new ArrayCollection();
    $this->designs = new ArrayCollection();
  }

  public function getId(): ?int
  {
    return $this->id;
  }

  public function getName(): ?string
  {
    return $this->name;
  }

  public function setName(string $name): self
  {
    $this->name = $name;

    return $this;
  }

  public function getLogo(): ?string
  {
    return $this->logo;
  }

  public function setLogo(string $logo): self
  {
    $this->logo = $logo;

    return $this;
  }

  public function getUuid(): ?string
  {
    return $this->uuid;
  }

  public function setUuid(string $uuid): self
  {
    $this->uuid = $uuid;

    return $this;
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

  public function getRoot(): ?bool
  {
    return $this->root;
  }

  public function setRoot(bool $root): self
  {
    $this->root = $root;

    return $this;
  }

  /**
   * @return Collection|Category[]
   */
  public function getCategories(): Collection
  {
    return $this->categories;
  }

  public function addCategory(Category $category): self
  {
    if (!$this->categories->contains($category)) {
      $this->categories[] = $category;
    }

    return $this;
  }

  public function removeCategory(Category $category): self
  {
    if ($this->categories->contains($category)) {
      $this->categories->removeElement($category);
    }

    return $this;
  }

  /**
   * @return Collection|Design[]
   */
  public function getDesigns(): Collection
  {
    return $this->designs;
  }

  public function addDesign(Design $design): self
  {
    if (!$this->designs->contains($design)) {
      $this->designs[] = $design;
    }

    return $this;
  }

  public function removeDesign(Design $design): self
  {
    if ($this->designs->contains($design)) {
      $this->designs->removeElement($design);
    }

    return $this;
  }

  public function getEmail(): ?string
  {
    return $this->email;
  }

  public function setEmail(?string $email): self
  {
    $this->email = $email;

    return $this;
  }

  public function getAddress(): ?string
  {
    return $this->address;
  }

  public function setAddress(?string $address): self
  {
    $this->address = $address;

    return $this;
  }

  public function getPhone(): ?string
  {
    return $this->phone;
  }

  public function setPhone(?string $phone): self
  {
    $this->phone = $phone;

    return $this;
  }

  public function getOwnerFirstName(): ?string
  {
    return $this->owner_first_name;
  }

  public function setOwnerFirstName(?string $owner_first_name): self
  {
    $this->owner_first_name = $owner_first_name;

    return $this;
  }

  public function getOwnerLastName(): ?string
  {
    return $this->owner_last_name;
  }

  public function setOwnerLastName(?string $owner_last_name): self
  {
    $this->owner_last_name = $owner_last_name;

    return $this;
  }

  public function getOwnerPhone(): ?string
  {
    return $this->owner_phone;
  }

  public function setOwnerPhone(?string $owner_phone): self
  {
    $this->owner_phone = $owner_phone;

    return $this;
  }

  public function getPaymentFrequency(): ?string
  {
    return $this->payment_frequency;
  }

  public function setPaymentFrequency(?string $payment_frequency): self
  {
    $this->payment_frequency = $payment_frequency;

    return $this;
  }

  public function getPin(): ?string
  {
    return $this->pin;
  }

  public function setPin(?string $pin): self
  {
    $this->pin = $pin;

    return $this;
  }

  public function getSubscriptionDate(): ?\DateTimeInterface
  {
    return $this->subscription_date;
  }

  public function setSubscriptionDate(
    ?\DateTimeInterface $subscription_date
  ): self {
    $this->subscription_date = $subscription_date;

    return $this;
  }
}
