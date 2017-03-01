-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 12, 2016 at 05:34 PM
-- Server version: 5.5.47-0ubuntu0.14.04.1
-- PHP Version: 5.5.9-1ubuntu4.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `solrdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `report`
--

CREATE TABLE IF NOT EXISTS `report` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `label` varchar(50) NOT NULL,
  `document` varchar(50) NOT NULL,
  `columns_sby` text NOT NULL,
  `column_sbx` varchar(20) NOT NULL,
  `graph_type` varchar(20) NOT NULL DEFAULT 'line',
  `data_type` varchar(20) NOT NULL DEFAULT 'json',
  `indent` enum('true','false') NOT NULL DEFAULT 'true',
  `ip_address` varchar(15) NOT NULL DEFAULT '192.168.1.145',
  `port` varchar(10) NOT NULL DEFAULT '8983',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=33 ;

--
-- Dumping data for table `report`
--

INSERT INTO `report` (`id`, `name`, `label`, `document`, `columns_sby`, `column_sbx`, `graph_type`, `data_type`, `indent`, `ip_address`, `port`) VALUES
(1, 'report line number', 'report line number', 'airline_shard1_replica1', 'cost,year,output', 'id', 'line', 'json', 'true', '192.168.1.145', '8983'),
(2, 'report line timestamp', 'report line timestamp', 'date-monitor2_shard1_replica1', 'total', 'timestamp', 'line', 'json', 'true', '192.168.1.145', '8983'),
(3, 'report line string', 'report line string', 'date-monitor2_shard1_replica1', 'total', 'name', 'line', 'json', 'true', '192.168.1.145', '8983'),
(4, 'report pie', 'report pie', 'date-monitor2_shard1_replica1', 'total', 'name', 'pie', 'json', 'true', '192.168.1.145', '8983'),
(5, 'hello', 'itsme', 'date-monitor2_shard1_replica1', 'total', 'timestamp', 'pie', 'json', 'true', '192.168.1.145', '8983'),
(6, 'report bar number', 'report bar number', 'airline_shard1_replica1', 'cost,year,output', 'id', 'bar', 'json', 'true', '192.168.1.145', '8983'),
(7, 'report bar timestamp', 'report bar timestamp', 'date-monitor2_shard1_replica1', 'total', 'timestamp', 'bar', 'json', 'true', '192.168.1.145', '8983'),
(8, 'report bar string', 'report bar string', 'date-monitor2_shard1_replica1', 'total', 'name', 'bar', 'json', 'true', '192.168.1.145', '8983');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
