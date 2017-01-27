SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

USE `wallblog`;

CREATE TABLE IF NOT EXISTS `wallblog__comment` (
  `id` int(9) NOT NULL auto_increment,
  `idItem` int(9) NOT NULL,
  `text` longtext collate utf8_bin,
  `author` varchar(100) collate utf8_bin default NULL,
  `date` timestamp NULL default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `wallblog__item` (
  `id` int(9) NOT NULL auto_increment,
  `file` varchar(255) collate utf8_bin NOT NULL,
  `description` varchar(80) collate utf8_bin default NULL,
  `date` timestamp NULL default NULL,
  `ratio` decimal(10,6) NOT NULL default '1.000000',
  `reverseRatio` decimal(10,6) NOT NULL default '1.000000',
  `type` varchar(7) collate utf8_bin NOT NULL default 'picture',
  `notificationId` int(11) DEFAULT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `wallblog__like` (
  `id` int(9) NOT NULL auto_increment,
  `itemId` varchar(50) NOT NULL,
  `visitorId` int(9) NOT NULL,
  `userAgent` longtext collate utf8_bin,
  `ip` varchar(50) collate utf8_bin default NULL,
  `date` timestamp NULL default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `wallblog__user` (
  `id` int(9) NOT NULL auto_increment,
  `email` varchar(255) collate utf8_bin NOT NULL,
  `password` varchar(32) collate utf8_bin NOT NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

CREATE TABLE `wallblog__subscription` (
  `id` int(11) UNSIGNED NOT NULL auto_increment,
  `endpoint` varchar(255) COLLATE utf8_bin NOT NULL,
  `p256dh` varchar(90) COLLATE utf8_bin NOT NULL,
  `auth` varchar(30) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

CREATE TABLE `wallblog__notification` (
  `id` int(10) UNSIGNED NOT NULL auto_increment,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `label` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `userId` int(11) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

INSERT INTO `wallblog__user` (`id`, `email`, `password`) VALUES (1, 'wall@blog.fr', 'f71dbe52628a3f83a77ab494817525c6');

INSERT INTO `wallblog__item` (`id`, `file`, `description`, `date`, `ratio`, `reverseRatio`, `type`) VALUES
(2, 'hawaii-209956_1920.jpg', 'Hawaï', '2014-06-24 13:59:42', '1.500000', '0.666667', 'picture'),
(3, 'water-321847.jpg', 'plouf8', '2014-06-27 12:24:02', '1.405564', '0.711458', 'picture'),
(4, 'water-373780_1920.jpg', NULL, '2014-07-24 13:59:02', '1.000000', '1.000000', 'picture'),
(5, 'banana_tree_garden_wallpaper.jpg', 'Banana', '2014-07-26 07:56:52', '1.778646', '0.562225', 'picture'),
(6, 'colorado_sand_dune_dunes.jpg', 'Colorado', '2014-07-26 08:01:01', '1.336815', '0.748047', 'picture'),
(13, 'amsterdam-1150319_1920.jpg', '', '2015-01-12 11:10:22', '1.498829', '0.667188', 'picture'),
(12, 'abstract-1168134_1920.jpg', '', '2015-01-14 11:04:57', '1.504702', '0.664583', 'picture'),
(14, 'boats-1183373_1920.jpg', '', '2015-01-15 11:10:24', '1.498829', '0.667188', 'picture'),
(15, 'canoe-1149501_1920.jpg', '', '2015-01-17 11:10:24', '1.500000', '0.666667', 'picture'),
(16, 'climbing-1148883.jpg', '', '2015-03-13 05:25:17', '1.500375', '0.666500', 'picture'),
(17, 'cologne-1078671_1920.jpg', '', '2015-04-12 11:10:26', '1.497660', '0.667708', 'picture'),
(18, 'common-barn-owl-1165563_1920.jpg', '', '2015-04-19 11:10:27', '0.661979', '1.510622', 'picture'),
(19, 'fishing-boat-49523.jpg', '', '2015-06-01 12:01:33', '1.336815', '0.748047', 'picture'),
(20, 'ice-1160261_1920.jpg', '', '2015-09-21 11:13:47', '1.300813', '0.768750', 'picture'),
(21, 'lavendar-1153405.jpg', '', '2015-09-22 14:34:31', '0.668478', '1.495935', 'picture'),
(22, 'railroad-tracks-1081952_1920.jpg', '', '2016-02-12 11:13:49', '1.500000', '0.666667', 'picture'),
(23, 'river-1156607.jpg', '', '2016-02-13 14:54:04', '0.666500', '1.500375', 'picture'),
(24, 'road-1030923_1920.jpg', '', '2016-02-14 11:13:51', '1.500000', '0.666667', 'picture'),
(25, 'seville-1150324_1920.jpg', '', '2016-02-15 11:13:52', '1.638225', '0.610417', 'picture'),
(26, 'snowdrop-1175595_1920.jpg', '', '2016-02-16 12:03:14', '1.523810', '0.656250', 'picture'),
(27, 'summer-landscape-1176148_1920.jpg', '', '2016-02-17 19:30:14', '1.498829', '0.667188', 'picture');

INSERT INTO `wallblog__comment` (`id`, `idItem`, `text`, `author`, `date`) VALUES
(20, 2, 'SUper site', 'Yoyo', '2014-06-24 15:03:09'),
(26, 4, 'Youpi', 'plouf', '2014-06-24 15:03:09'),
(32, 2, 'Plouf', 'Yo !', '2014-06-24 15:03:09'),
(54, 6, 'Yo man !', 'yoyo', '2014-07-10 10:00:18');

INSERT INTO `wallblog__like` (`id`, `itemId`, `date`) VALUES
  (1, 22, '2016-02-14 15:03:09'),
  (2, 22, '2016-02-15 11:24:23'),
  (3, 27, '2016-03-24 08:51:42'),
  (4, 26, '2016-05-25 22:12:18');