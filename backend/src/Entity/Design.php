<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\DesignRepository")
 */
class Design
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
  private $machine_name;

  /**
   * @ORM\Column(type="boolean")
   */
  private $disabled;

  /**
   * @ORM\ManyToMany(targetEntity="App\Entity\Shop", mappedBy="designs")
   */
  private $shops;

  /**
   * @ORM\ManyToMany(targetEntity="App\Entity\Product", mappedBy="designs")
   */
  private $products;

  /**
   * @ORM\OneToMany(targetEntity="App\Entity\Option", mappedBy="design", orphanRemoval=true)
   */
  private $options;

  /**
   * @ORM\Column(type="string", length=255, nullable=true)
   */
  private $parent;

  public function __construct()
  {
    $this->shops = new ArrayCollection();
    $this->products = new ArrayCollection();
    $this->options = new ArrayCollection();
  }

  public function getId(): ?int
  {
    return $this->id;
  }

  public function getMachineName(): ?string
  {
    return $this->machine_name;
  }

  public function setMachineName(string $machine_name): self
  {
    $this->machine_name = $machine_name;

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

  /**
   * @return Collection|Shop[]
   */
  public function getShops(): Collection
  {
    return $this->shops;
  }

  public function addShop(Shop $shop): self
  {
    if (!$this->shops->contains($shop)) {
      $this->shops[] = $shop;
      $shop->addDesign($this);
    }

    return $this;
  }

  public function removeShop(Shop $shop): self
  {
    if ($this->shops->contains($shop)) {
      $this->shops->removeElement($shop);
      $shop->removeDesign($this);
    }

    return $this;
  }

  /**
   * @return Collection|Product[]
   */
  public function getProducts(): Collection
  {
    return $this->products;
  }

  public function addProduct(Product $product): self
  {
    if (!$this->products->contains($product)) {
      $this->products[] = $product;
      $product->addDesign($this);
    }

    return $this;
  }

  public function removeProduct(Product $product): self
  {
    if ($this->products->contains($product)) {
      $this->products->removeElement($product);
      $product->removeDesign($this);
    }

    return $this;
  }

  /**
   * @return Collection|Option[]
   */
  public function getOptions(): Collection
  {
    return $this->options;
  }

  public function addOption(Option $option): self
  {
    if (!$this->options->contains($option)) {
      $this->options[] = $option;
      $option->setDesign($this);
    }

    return $this;
  }

  public function removeOption(Option $option): self
  {
    if ($this->options->contains($option)) {
      $this->options->removeElement($option);
      // set the owning side to null (unless already changed)
      if ($option->getDesign() === $this) {
        $option->setDesign(null);
      }
    }

    return $this;
  }

  public function getParent(): ?string
  {
    return $this->parent;
  }

  public function setParent(?string $parent): self
  {
    $this->parent = $parent;

    return $this;
  }
}
