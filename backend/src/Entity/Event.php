<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\EventRepository")
 */
class Event
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
   * @ORM\OneToMany(targetEntity="App\Entity\EventImage", mappedBy="event", orphanRemoval=true)
   */
  private $eventImages;

  public function __construct()
  {
    $this->eventImages = new ArrayCollection();
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

  /**
   * @return Collection|EventImage[]
   */
  public function getEventImages(): Collection
  {
    return $this->eventImages;
  }

  public function addEventImage(EventImage $eventImage): self
  {
    if (!$this->eventImages->contains($eventImage)) {
      $this->eventImages[] = $eventImage;
      $eventImage->setEvent($this);
    }

    return $this;
  }

  public function removeEventImage(EventImage $eventImage): self
  {
    if ($this->eventImages->contains($eventImage)) {
      $this->eventImages->removeElement($eventImage);
      // set the owning side to null (unless already changed)
      if ($eventImage->getEvent() === $this) {
        $eventImage->setEvent(null);
      }
    }

    return $this;
  }
}
