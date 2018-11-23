<?php

namespace App\Command;

use App\Service\PictureService;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Output\OutputInterface;

class RebuildCommand extends Command
{
  private $pictureService;

  public function __construct(PictureService $pictureService)
  {
    $this->pictureService = $pictureService;

    parent::__construct();
  }

  protected function configure()
  {
    $this
      ->setName('app:rebuild')
      ->setDescription('Re-sample all pictures.')
      ->addArgument('force', InputArgument::OPTIONAL, 'Force resample');
  }

  protected function execute(InputInterface $input, OutputInterface $output)
  {
    $force = $input->getArgument('force') === 'force';
    $output->writeln('Rebuilding pictures…');
    if ($force) {
      $output->writeln(' -> forcing re-sampling existing pictures');
    }
    $this->pictureService->rebuild($force);
    $output->writeln('Done!');
  }
}
