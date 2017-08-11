-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 13, 2017 at 11:14 PM
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
  `id` varchar(15) NOT NULL,
  `type` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`id`, `type`) VALUES
('123456', 'Admin'),
('987654', 'Teacher'),
('999999', 'Grader');

-- --------------------------------------------------------

--
-- Table structure for table `assigned_grader`
--

CREATE TABLE `assigned_grader` (
  `assigned_exam_id` int(11) NOT NULL,
  `exam_cat_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `assigned_grader`
--

INSERT INTO `assigned_grader` (`assigned_exam_id`, `exam_cat_id`, `user_id`) VALUES
(1, 3, 1),
(2, 3, 1),
(3, 4, 1),
(4, 4, 1),
(5, 5, 1),
(6, 5, 1),
(7, 6, 1),
(8, 6, 1),
(9, 7, 1),
(10, 7, 1),
(11, 8, 1),
(12, 8, 1),
(13, 9, 1),
(14, 9, 1),
(15, 10, 1),
(16, 10, 1);

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`) VALUES
(1, 'Recursion'),
(2, 'Linked List'),
(3, 'General'),
(4, 'Data Abstraction');

-- --------------------------------------------------------

--
-- Table structure for table `category_grade`
--

CREATE TABLE `category_grade` (
  `exam_cat_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `grade` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `exam`
--

CREATE TABLE `exam` (
  `id` int(11) NOT NULL,
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

INSERT INTO `exam` (`id`, `quarter`, `date`, `location`, `state`, `passing_grade`, `duration`, `start_time`, `cutoff`) VALUES
(666, '1', '2017-04-11', 344, '3', 80, 4, '07:30:00', 0),
(999, '2', '2017-04-27', 123, '5', 60, 3, '03:00:00', 0),
(1064, '4', '2017-04-27', 344, 'hidden', 85, 3, '23:00:00', 6),
(1068, '1', '2017-04-19', 123, '4', 80, 4, '14:00:00', 2),
(1069, '3', '2017-04-19', 123, 'hidden', 80, 4, '14:00:00', 2),
(1070, '1', '2017-04-28', 344, '2', 80, 3, '20:30:00', 2),
(1071, '1', '2017-07-04', 123, 'hidden', 80, 4, '14:00:00', 2),
(1072, '1', '2017-07-04', 123, '1', 80, 4, '16:00:00', 2);

-- --------------------------------------------------------

--
-- Table structure for table `exam_category`
--

CREATE TABLE `exam_category` (
  `exam_cat_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `exam_id` int(11) NOT NULL,
  `possible` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `exam_category`
--

INSERT INTO `exam_category` (`exam_cat_id`, `category_id`, `exam_id`, `possible`) VALUES
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
  `student_id` int(11) NOT NULL,
  `grade` int(11) NOT NULL,
  `passed` tinyint(4) NOT NULL,
  `possible` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `exam_roster`
--

CREATE TABLE `exam_roster` (
  `exam_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `seat_num` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `exam_roster`
--

INSERT INTO `exam_roster` (`exam_id`, `student_id`, `seat_num`) VALUES
(666, 692364, 4);

-- --------------------------------------------------------

--
-- Table structure for table `grader_old`
--

CREATE TABLE `grader_old` (
  `EWU_ID` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `f_name` varchar(50) NOT NULL,
  `l_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `grader_old`
--

INSERT INTO `grader_old` (`EWU_ID`, `email`, `f_name`, `l_name`) VALUES
(1, 'ssteiner@ewu.edu', 'Stu', 'Steiner'),
(4321, 'jman@theJ.com', 'Joseph', 'Joestar'),
(111113, 'dtappan@ewu.edu', 'Dan', 'Tappan'),
(111114, 'ytian@ewu.edu', 'Tony', 'Tian'),
(111115, 'tcapaul@ewu.edu', 'Tom', 'Capaul'),
(111116, 'cpeters@ewu.edu', 'Chris', 'Peters');

-- --------------------------------------------------------

--
-- Table structure for table `in_class_exam`
--

CREATE TABLE `in_class_exam` (
  `exam_id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `location`
--

CREATE TABLE `location` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `seats` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `location`
--

INSERT INTO `location` (`id`, `name`, `seats`) VALUES
(123, 'CEB 228', 50),
(344, 'CEB 220', 30);

-- --------------------------------------------------------

--
-- Table structure for table `quarter_old`
--

CREATE TABLE `quarter_old` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `quarter_old`
--

INSERT INTO `quarter_old` (`id`, `name`) VALUES
(1, 'Fall'),
(2, 'Winter'),
(3, 'Spring'),
(4, 'Summer');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `id` int(15) NOT NULL,
  `state` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `student_old`
--

CREATE TABLE `student_old` (
  `EWU_ID` int(11) NOT NULL,
  `l_name` varchar(50) NOT NULL,
  `f_name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `student_old`
--

INSERT INTO `student_old` (`EWU_ID`, `l_name`, `f_name`, `email`, `state`) VALUES
(7589, 'Blah', 'HiJHi', 'Blah@blah.com', 'Blocked'),
(123456, 'Test', 'Testy', 'Test@test.com', 'Blocked'),
(324823, 'Nguyen', 'Tu', 'abc@xyz.com', 'ready'),
(543234, 'Girtz', 'Ben', 'BGirtz@gmail.com', 'Blocked'),
(691171, 'Jones', 'Justyn', 'JustynJones@eagles.ewu.edu', 'Passed'),
(692364, 'Sampilo', 'Jordan', 'jsampilo@eagles.ewu.edu', 'state?'),
(987654, 'Bolena', 'Pavan', 'PavanBolena@Idontknow.com', 'Passed'),
(4322464, 'Girtz', 'Caitlyn', 'CaitlynGirtz@Idontcare.com', 'Blocked'),
(5678456, 'Jones', 'Collyn', 'CJones@hotmail.com', 'Blocked');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_old`
--

CREATE TABLE `teacher_old` (
  `EWU_ID` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `f_name` varchar(50) NOT NULL,
  `l_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `teacher_old`
--

INSERT INTO `teacher_old` (`EWU_ID`, `email`, `f_name`, `l_name`) VALUES
(12345, 'JTest@test.com', 'joe', 'james'),
(666666, 'teacher@ewu.edu', 'F_Name', 'L_Name');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(15) NOT NULL,
  `f_name` varchar(50) NOT NULL,
  `l_name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`id`,`type`);

--
-- Indexes for table `assigned_grader`
--
ALTER TABLE `assigned_grader`
  ADD PRIMARY KEY (`assigned_exam_id`),
  ADD KEY `exam_cat_id_fk` (`exam_cat_id`),
  ADD KEY `grader_id_fk` (`user_id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `category_grade`
--
ALTER TABLE `category_grade`
  ADD KEY `assigned_exam_id_fk` (`exam_cat_id`),
  ADD KEY `student_id_fk` (`student_id`);

--
-- Indexes for table `exam`
--
ALTER TABLE `exam`
  ADD PRIMARY KEY (`id`),
  ADD KEY `loc_fkey` (`location`);

--
-- Indexes for table `exam_category`
--
ALTER TABLE `exam_category`
  ADD PRIMARY KEY (`exam_cat_id`),
  ADD KEY `exam_foreign_key` (`exam_id`),
  ADD KEY `examcat_category_key` (`category_id`);

--
-- Indexes for table `exam_grade`
--
ALTER TABLE `exam_grade`
  ADD KEY `exam_id_fkey` (`exam_id`),
  ADD KEY `student_id_fkey` (`student_id`);

--
-- Indexes for table `exam_roster`
--
ALTER TABLE `exam_roster`
  ADD KEY `student_fkey` (`student_id`),
  ADD KEY `exam_key` (`exam_id`);

--
-- Indexes for table `grader_old`
--
ALTER TABLE `grader_old`
  ADD PRIMARY KEY (`EWU_ID`);

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
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quarter_old`
--
ALTER TABLE `quarter_old`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `student_old`
--
ALTER TABLE `student_old`
  ADD PRIMARY KEY (`EWU_ID`);

--
-- Indexes for table `teacher_old`
--
ALTER TABLE `teacher_old`
  ADD PRIMARY KEY (`EWU_ID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assigned_grader`
--
ALTER TABLE `assigned_grader`
  MODIFY `assigned_exam_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `exam`
--
ALTER TABLE `exam`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1073;
--
-- AUTO_INCREMENT for table `exam_category`
--
ALTER TABLE `exam_category`
  MODIFY `exam_cat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `grader_old`
--
ALTER TABLE `grader_old`
  MODIFY `EWU_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111117;
--
-- AUTO_INCREMENT for table `location`
--
ALTER TABLE `location`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=345;
--
-- AUTO_INCREMENT for table `quarter_old`
--
ALTER TABLE `quarter_old`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `teacher_old`
--
ALTER TABLE `teacher_old`
  MODIFY `EWU_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=666667;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `assigned_grader`
--
ALTER TABLE `assigned_grader`
  ADD CONSTRAINT `exam_cat_id_fk` FOREIGN KEY (`exam_cat_id`) REFERENCES `exam_category` (`exam_cat_id`),
  ADD CONSTRAINT `grader_id_fk` FOREIGN KEY (`user_id`) REFERENCES `grader_old` (`EWU_ID`);

--
-- Constraints for table `category_grade`
--
ALTER TABLE `category_grade`
  ADD CONSTRAINT `assigned_exam_id_fk` FOREIGN KEY (`exam_cat_id`) REFERENCES `assigned_grader` (`assigned_exam_id`),
  ADD CONSTRAINT `student_id_fk` FOREIGN KEY (`student_id`) REFERENCES `student_old` (`EWU_ID`);

--
-- Constraints for table `exam`
--
ALTER TABLE `exam`
  ADD CONSTRAINT `loc_fkey` FOREIGN KEY (`location`) REFERENCES `location` (`id`);

--
-- Constraints for table `exam_category`
--
ALTER TABLE `exam_category`
  ADD CONSTRAINT `examcat_category_key` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  ADD CONSTRAINT `examcat_exam_key` FOREIGN KEY (`exam_id`) REFERENCES `exam` (`id`);

--
-- Constraints for table `exam_grade`
--
ALTER TABLE `exam_grade`
  ADD CONSTRAINT `exam_id_fkey` FOREIGN KEY (`exam_id`) REFERENCES `exam` (`id`),
  ADD CONSTRAINT `student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `student_old` (`EWU_ID`);

--
-- Constraints for table `exam_roster`
--
ALTER TABLE `exam_roster`
  ADD CONSTRAINT `exam_key` FOREIGN KEY (`exam_id`) REFERENCES `exam` (`id`),
  ADD CONSTRAINT `student_fkey` FOREIGN KEY (`student_id`) REFERENCES `student_old` (`EWU_ID`);

--
-- Constraints for table `in_class_exam`
--
ALTER TABLE `in_class_exam`
  ADD CONSTRAINT `exam_fkey` FOREIGN KEY (`exam_id`) REFERENCES `exam` (`id`),
  ADD CONSTRAINT `teacher_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teacher_old` (`EWU_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
