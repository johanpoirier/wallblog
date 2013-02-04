SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS `wallblog__comment` (
  `id` int(9) NOT NULL auto_increment,
  `idItem` int(9) NOT NULL,
  `text` longtext collate utf8_bin,
  `author` varchar(100) collate utf8_bin default NULL,
  `date` timestamp NULL default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `wallblog__item` (
  `id` int(9) NOT NULL auto_increment,
  `file` varchar(255) collate utf8_bin NOT NULL,
  `description` varchar(80) collate utf8_bin default NULL,
  `date` timestamp NULL default NULL,
  `ratio` decimal(10,6) NOT NULL default '1.000000',
  `reverseRatio` decimal(10,6) NOT NULL default '1.000000',
  `like` int(6) NOT NULL default '0',
  `type` varchar(7) collate utf8_bin NOT NULL default 'picture',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `wallblog__user` (
  `id` int(9) NOT NULL auto_increment,
  `email` varchar(255) collate utf8_bin NOT NULL,
  `password` varchar(32) collate utf8_bin NOT NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;
