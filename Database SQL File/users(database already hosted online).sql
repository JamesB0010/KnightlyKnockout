-- phpMyAdmin SQL Dump
-- version 4.7.1
-- https://www.phpmyadmin.net/
--
-- Host: sql8.freemysqlhosting.net
-- Generation Time: Dec 29, 2023 at 03:09 PM
-- Server version: 5.5.62-0ubuntu0.14.04.1
-- PHP Version: 7.0.33-0ubuntu0.16.04.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sql8666464`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `Username` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `gamesPlayed` int(255) NOT NULL DEFAULT '0',
  `gamesWon` int(255) NOT NULL DEFAULT '0',
  `profilePicture` longtext
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`Username`, `Password`, `gamesPlayed`, `gamesWon`, `profilePicture`) VALUES
('Vicky', '42f749ade7f9e195bf475f37a44cafcb', 3, 2, '1702253076646--1701464068011--image_2023-12-01_205415520.png'),
('Tem', '42f749ade7f9e195bf475f37a44cafcb', 3, 0, '1702253118648--1701469326248--image_2023-12-01_222204704.png'),
('Wendy', '8515a38ff3b01fb049521bb51101a734', 2, 2, '1702679443433--smilingLamb.png'),
('', 'd41d8cd98f00b204e9800998ecf8427e', 0, 0, '1702679555256--Spooderman.jpg'),
('Batman', '42f749ade7f9e195bf475f37a44cafcb', 1, 0, '1703604623322--batman webp.png');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
