<?php

// src/Controller/FileUploadController.php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class FileUploadController extends BaseController
{
  /**
   * @Route("/api/{uuid}/{license}/upload", name="upload", methods={"POST"})
   */
  public function new($uuid, $license, Request $request)
  {
    try {
      $this->checkLicense($uuid, $license);

      $file = $request->files->get('file');
      if (
        !in_array($file->guessExtension(), [
          'webm',
          'mp4',
          'png',
          'svg',
          'jpg',
          'jpeg',
          'gif',
          'webp'
        ])
      ) {
        throw new Exception('unsupported file format');
      }
      $originalFilename = pathinfo(
        $file->getClientOriginalName(),
        PATHINFO_FILENAME
      );
      $safeFilename = transliterator_transliterate(
        'Any-Latin; Latin-ASCII; [^A-Za-z0-9_] remove; Lower()',
        $originalFilename
      );
      $newFilename =
        $safeFilename . '-' . uniqid() . '.' . $file->guessExtension();
      try {
        $file->move('uploads', $newFilename);
      } catch (FileException $e) {
        // ... handle exception if something happens during file upload
      }

      return new JsonResponse(
        [
          'status' => 'ok',
          'filename' => $newFilename
        ],
        Response::HTTP_CREATED
      );
    } catch (\InvalidArgumentException $e) {
      if (strpos($e->getMessage(), 'file does not exist or is not readable')) {
        $error = 'file upload failed';
      } else {
        $error = $e->getMessage();
      }
      return new JsonResponse(['error' => $error], Response::HTTP_NOT_FOUND);
    } catch (Exception $e) {
      return new JsonResponse(
        ['error' => $e->getMessage()],
        Response::HTTP_NOT_FOUND
      );
    }
  }
}

?>
