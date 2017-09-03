-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 03, 2017 at 10:31 AM
-- Server version: 10.1.24-MariaDB
-- PHP Version: 7.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ape_database`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `account_id` varchar(15) NOT NULL,
  `type` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`account_id`, `type`) VALUES
('111', 'Admin'),
('111', 'Teacher'),
('222', 'Teacher'),
('2223', 'Grader'),
('2224', 'Grader'),
('2225', 'Grader'),
('2226', 'Grader'),
('8899', 'Admin'),
('999999', 'System');

-- --------------------------------------------------------

--
-- Table structure for table `admin_setting`
--

CREATE TABLE `admin_setting` (
  `name` varchar(50) NOT NULL,
  `value` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `admin_setting`
--

INSERT INTO `admin_setting` (`name`, `value`) VALUES
('catGraderLimit', '3'),
('examMaxPoint', '100'),
('fallEnd', '2017-12-08'),
('fallStart', '2017-09-20'),
('pointDiffRange', '10'),
('springEnd', '2018-06-15'),
('springStart', '2018-04-02'),
('summerEnd', '2018-08-17'),
('summerStart', '2018-06-25'),
('winterEnd', '2018-03-23'),
('winterStart', '2018-01-08');

-- --------------------------------------------------------

--
-- Table structure for table `assigned_grader`
--

CREATE TABLE `assigned_grader` (
  `grader_exam_cat_id` int(11) NOT NULL,
  `exam_cat_id` int(11) NOT NULL,
  `user_id` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `assigned_grader`
--

INSERT INTO `assigned_grader` (`grader_exam_cat_id`, `exam_cat_id`, `user_id`) VALUES
(1, 3, '2223'),
(2, 4, '2224'),
(3, 5, '2225'),
(4, 6, '2226');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `cat_id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`cat_id`, `name`) VALUES
(1, 'Recursion'),
(2, 'Linked List'),
(3, 'General'),
(4, 'Data Abstraction'),
(5, 'Test Cat'),
(6, 'Test 2'),
(7, 'Data Abstraction');

-- --------------------------------------------------------

--
-- Table structure for table `category_grade`
--

CREATE TABLE `category_grade` (
  `grader_exam_cat_id` int(11) NOT NULL,
  `student_id` varchar(15) NOT NULL,
  `grade` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `category_grade`
--

INSERT INTO `category_grade` (`grader_exam_cat_id`, `student_id`, `grade`) VALUES
(1, '3333', 21),
(2, '3333', 10),
(3, '3333', 17),
(4, '3333', 5);

-- --------------------------------------------------------

--
-- Table structure for table `exam`
--

CREATE TABLE `exam` (
  `exam_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `quarter` varchar(10) NOT NULL,
  `date` date NOT NULL,
  `location` int(11) NOT NULL,
  `state` varchar(50) DEFAULT NULL,
  `passing_grade` int(11) NOT NULL,
  `duration` int(11) NOT NULL,
  `start_time` time NOT NULL,
  `cutoff` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `exam`
--

INSERT INTO `exam` (`exam_id`, `name`, `quarter`, `date`, `location`, `state`, `passing_grade`, `duration`, `start_time`, `cutoff`) VALUES
(666, 'First APE', '1', '2017-04-11', 344, NULL, 80, 4, '07:30:00', 0),
(999, '', '2', '2017-04-27', 123, '5', 60, 3, '03:00:00', 0),
(1064, '', '4', '2017-04-27', 344, 'hidden', 85, 3, '23:00:00', 6),
(1068, '', '1', '2017-04-19', 123, '4', 80, 4, '14:00:00', 2),
(1069, '', '3', '2017-04-19', 123, 'hidden', 80, 4, '14:00:00', 2),
(1070, '', '1', '2017-04-28', 344, '2', 80, 3, '20:30:00', 2),
(1071, '', '1', '2017-07-04', 123, 'hidden', 80, 4, '14:00:00', 2),
(1072, '', '1', '2017-07-04', 123, '1', 80, 4, '16:00:00', 2),
(1075, '', 'Summer', '0000-00-00', 123, 'Open', 80, 4, '12:00:00', 3),
(1076, '', 'Summer', '0000-00-00', 123, 'Open', 80, 4, '12:00:00', 1),
(1077, 'Summer 2017', 'Summer', '0000-00-00', 345, 'Open', 70, 4, '12:00:00', 1),
(1079, 'Summer 2017', 'Summer', '0000-00-00', 123, 'Open', 80, 4, '10:00:00', 3),
(1089, 'Summer 2017 3', 'Summer', '2017-08-08', 123, 'Open', 60, 2, '08:00:00', 4),
(1090, 'Summer 1', 'Summer', '2017-08-08', 344, 'Open', 70, 6, '08:00:00', 1),
(1091, 'Teacher Exam Test', 'Summer', '2017-08-08', 344, 'Open', 70, 4, '12:00:00', 1),
(1092, 'Teacher Exam Test', 'Summer', '2017-08-08', 346, 'Open', 70, 4, '12:00:00', 1),
(1093, 'Teacher test 2', 'Summer', '2017-08-16', 123, 'Open', 50, 3, '12:00:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `exam_category`
--

CREATE TABLE `exam_category` (
  `exam_cat_id` int(11) NOT NULL,
  `cat_id` int(11) NOT NULL,
  `exam_id` int(11) NOT NULL,
  `possible_grade` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `exam_category`
--

INSERT INTO `exam_category` (`exam_cat_id`, `cat_id`, `exam_id`, `possible_grade`) VALUES
(1, 1, 666, 30),
(2, 1, 999, 20),
(3, 1, 1071, 20),
(4, 2, 1071, 20),
(5, 3, 1071, 30),
(6, 4, 1071, 30),
(7, 1, 1072, 20),
(8, 2, 1072, 20),
(9, 3, 1072, 30),
(10, 4, 1072, 30);

-- --------------------------------------------------------

--
-- Table structure for table `exam_grade`
--

CREATE TABLE `exam_grade` (
  `exam_id` int(11) NOT NULL,
  `student_id` varchar(15) NOT NULL,
  `grade` int(11) NOT NULL,
  `passed` tinyint(4) NOT NULL,
  `possible_grade` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `exam_grade`
--

INSERT INTO `exam_grade` (`exam_id`, `student_id`, `grade`, `passed`, `possible_grade`) VALUES
(666, '4444', 80, 1, 100),
(1071, '3333', 90, 0, 100),
(1072, '3333', 85, 1, 100);

-- --------------------------------------------------------

--
-- Table structure for table `exam_roster`
--

CREATE TABLE `exam_roster` (
  `exam_id` int(11) NOT NULL,
  `student_id` varchar(15) NOT NULL,
  `seat_num` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `in_class_exam`
--

CREATE TABLE `in_class_exam` (
  `exam_id` int(11) NOT NULL,
  `teacher_id` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `in_class_exam`
--

INSERT INTO `in_class_exam` (`exam_id`, `teacher_id`) VALUES
(1092, '222'),
(1093, '222');

-- --------------------------------------------------------

--
-- Table structure for table `location`
--

CREATE TABLE `location` (
  `loc_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `seats` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `location`
--

INSERT INTO `location` (`loc_id`, `name`, `seats`) VALUES
(123, 'CEB 228', 50),
(344, 'CEB 220', 30),
(345, 'CEB 211', 30),
(346, 'CEB 222', 30);

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `student_id` varchar(15) NOT NULL,
  `state` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`student_id`, `state`) VALUES
('3333', 'Blocked'),
('4444', 'Blocked');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` varchar(15) NOT NULL,
  `f_name` varchar(50) NOT NULL,
  `l_name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `f_name`, `l_name`, `email`) VALUES
('111', 'Tu', 'Nguyen', 'abc@xyz.com'),
('222', 'AAAA', 'BBBB', '12Abc@xyz.c'),
('2223', 'A3AAA', 'B3BBB', '12Abc@xyz.c'),
('2224', 'AAAA', 'BBBB', '12Abc@xyz.c'),
('2225', '44AAA', 'B44', '14443Abc@xyz.c'),
('2226', '44AAA', 'B44', '14443Abc@xyz.c'),
('3333', 'A333AAA', 'B333', '1233Abc@xyz.c'),
('4444', '44AAA', 'B44', '14443Abc@xyz.c'),
('8899', 'Tu Test', 'Nguyen Test', 'abc@xyz.com'),
('999999', 'System', 'System', 'system@ape');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`account_id`,`type`);

--
-- Indexes for table `admin_setting`
--
ALTER TABLE `admin_setting`
  ADD PRIMARY KEY (`name`);

--
-- Indexes for table `assigned_grader`
--
ALTER TABLE `assigned_grader`
  ADD PRIMARY KEY (`grader_exam_cat_id`),
  ADD KEY `exam_cat_id_fk` (`exam_cat_id`),
  ADD KEY `grader_id_fk` (`user_id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`cat_id`);

--
-- Indexes for table `category_grade`
--
ALTER TABLE `category_grade`
  ADD PRIMARY KEY (`grader_exam_cat_id`,`student_id`),
  ADD KEY `assigned_exam_id_fk` (`grader_exam_cat_id`),
  ADD KEY `student_id_fk` (`student_id`);

--
-- Indexes for table `exam`
--
ALTER TABLE `exam`
  ADD PRIMARY KEY (`exam_id`),
  ADD KEY `loc_fkey` (`location`);

--
-- Indexes for table `exam_category`
--
ALTER TABLE `exam_category`
  ADD PRIMARY KEY (`exam_cat_id`),
  ADD KEY `exam_foreign_key` (`exam_id`),
  ADD KEY `examcat_category_key` (`cat_id`);

--
-- Indexes for table `exam_grade`
--
ALTER TABLE `exam_grade`
  ADD PRIMARY KEY (`exam_id`,`student_id`),
  ADD KEY `exam_id_fkey` (`exam_id`),
  ADD KEY `student_id_fkey` (`student_id`);

--
-- Indexes for table `exam_roster`
--
ALTER TABLE `exam_roster`
  ADD UNIQUE KEY `student_fkey` (`student_id`),
  ADD KEY `exam_fkey` (`exam_id`);

--
-- Indexes for table `in_class_exam`
--
ALTER TABLE `in_class_exam`
  ADD KEY `exam_fkey` (`exam_id`),
  ADD KEY `teacher_fkey` (`teacher_id`);

--
-- Indexes for table `location`
--
ALTER TABLE `location`
  ADD PRIMARY KEY (`loc_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`student_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assigned_grader`
--
ALTER TABLE `assigned_grader`
  MODIFY `grader_exam_cat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `cat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `exam`
--
ALTER TABLE `exam`
  MODIFY `exam_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1094;
--
-- AUTO_INCREMENT for table `exam_category`
--
ALTER TABLE `exam_category`
  MODIFY `exam_cat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `location`
--
ALTER TABLE `location`
  MODIFY `loc_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=347;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `account`
--
ALTER TABLE `account`
  ADD CONSTRAINT `account_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `assigned_grader`
--
ALTER TABLE `assigned_grader`
  ADD CONSTRAINT `exam_cat_id_fk` FOREIGN KEY (`exam_cat_id`) REFERENCES `exam_category` (`exam_cat_id`),
  ADD CONSTRAINT `grader_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `category_grade`
--
ALTER TABLE `category_grade`
  ADD CONSTRAINT `assigned_exam_id_fk` FOREIGN KEY (`grader_exam_cat_id`) REFERENCES `assigned_grader` (`grader_exam_cat_id`),
  ADD CONSTRAINT `student_id_fk` FOREIGN KEY (`student_id`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `exam`
--
ALTER TABLE `exam`
  ADD CONSTRAINT `loc_fkey` FOREIGN KEY (`location`) REFERENCES `location` (`loc_id`);

--
-- Constraints for table `exam_category`
--
ALTER TABLE `exam_category`
  ADD CONSTRAINT `examcat_category_key` FOREIGN KEY (`cat_id`) REFERENCES `category` (`cat_id`),
  ADD CONSTRAINT `examcat_exam_key` FOREIGN KEY (`exam_id`) REFERENCES `exam` (`exam_id`);

--
-- Constraints for table `exam_grade`
--
ALTER TABLE `exam_grade`
  ADD CONSTRAINT `exam_id_fkey` FOREIGN KEY (`exam_id`) REFERENCES `exam` (`exam_id`),
  ADD CONSTRAINT `student_fkey` FOREIGN KEY (`student_id`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `exam_roster`
--
ALTER TABLE `exam_roster`
  ADD CONSTRAINT `exam_roster_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `exam` (`exam_id`),
  ADD CONSTRAINT `exam_roster_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `in_class_exam`
--
ALTER TABLE `in_class_exam`
  ADD CONSTRAINT `exam_fkey` FOREIGN KEY (`exam_id`) REFERENCES `exam` (`exam_id`),
  ADD CONSTRAINT `teacher_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `student_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
