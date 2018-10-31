<?php

namespace App\Controller;

use App\Repository\CommentRepository;
use App\Repository\ItemRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

class RssController extends AbstractController
{
  private $itemRepository;
  private $commentRepository;

  public function __construct(ItemRepository $itemRepository, CommentRepository $commentRepository)
  {
    $this->itemRepository = $itemRepository;
    $this->commentRepository = $commentRepository;
  }

  /**
   * @return Response
   */
  public function getLastItems(): Response
  {
    $items = $this->itemRepository->findPaginated(20, 0);
    $response = new Response();
    $response->headers->set('Content-type', 'application/rss+xml; charset=utf-8');

    return $this->render('rss.xml.twig', [ 'now' => date('D, d M Y H:i:s T'), 'items' => $items ], $response);
  }

  /**
   * @return Response
   */
  public function getLastComments(): Response
  {
    $items = $this->commentRepository->findPaginated(20, 0);
    $response = new Response();
    $response->headers->set('Content-type', 'application/rss+xml; charset=utf-8');

    return $this->render('rss-comment.xml.twig', [ 'now' => date('D, d M Y H:i:s T'), 'items' => $items ], $response);
  }
}
