-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 13, 2025 at 11:00 AM
-- Server version: 8.0.43-0ubuntu0.24.04.1
-- PHP Version: 8.3.6

START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: readify
DROP DATABASE IF EXISTS readify;
CREATE DATABASE readify;
USE readify;
--

-- --------------------------------------------------------

--
-- Table structure for table authors
--

CREATE TABLE authors (
  book_id int NOT NULL,
  author_name varchar(100) NOT NULL
);

--
-- Dumping data for table authors
--

INSERT INTO authors (book_id, author_name) VALUES
(4, 'Arkady Martine'),
(5, 'Ann Leckie'),
(6, 'James Clear'),
(7, 'Emily Henry'),
(8, 'Cal Newport'),
(9, 'Waris Dirie'),
(9, 'Catheen Miller'),
(10, 'Toni Morrison'),
(11, 'Dan Simmons'),
(12, 'Colleen Hoover'),
(13, 'Nelson Mandela'),
(14, 'J.R.R. Tolkien'),
(15, 'Carol S. Dweck'),
(15, 'Ph.D.'),
(16, 'Gabriel García Márquez'),
(17, 'Anne Frank'),
(18, 'John Green'),
(19, 'John Green'),
(20, 'Jeannette Walls'),
(21, 'F. Scott Fitzgerald'),
(22, 'Angie Thomas'),
(23, 'Ali Hazelwood'),
(24, 'Andy Weir'),
(25, 'Eckhart Tolle'),
(26, 'Nicola Yoon'),
(27, 'Cixin Liu'),
(28, 'Nora Roberts'),
(29, 'Sally Thorne'),
(30, 'Harper Lee'),
(31, 'Trevor Noah'),
(32, 'John Green');

-- --------------------------------------------------------

--
-- Table structure for table books
--

CREATE TABLE books (
  book_id int NOT NULL,
  title varchar(100) NOT NULL,
  price decimal(10,2) NOT NULL,
  stock int NOT NULL,
  image varchar(200) NOT NULL,
  description varchar(500) NOT NULL,
  category varchar(20) NOT NULL,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  sold int NOT NULL DEFAULT '0',
  status tinyint(1) NOT NULL DEFAULT '1'
) ;

--
-- Dumping data for table books
--

INSERT INTO books (book_id, title, price, stock, image, description, category, updated_at, sold, status) VALUES
(4, 'A Memory Called Empire', 1000.00, 15, 'books/1757701311_a_memory_called_empire.jpg', 'All around brilliant space opera. I absolutely love it.', 'Fiction', '2025-09-13 12:48:03', 0, 1),
(5, 'Ancillary Justice', 1000.00, 250, 'books/1757701649_ancillary_justice.jpg', 'New York times best selling series.', 'Fiction', '2025-09-12 18:27:29', 0, 1),
(6, 'Atomic Habits', 1854.00, 526, 'books/1757701847_atomic_habits.jpg', 'An easy and proven way to build good habits and break bad ones.', 'Education', '2025-09-12 18:30:47', 0, 1),
(7, 'Book Lovers', 856.00, 354, 'books/1757702004_book_lovers.jpg', 'New York times best selling author of people we meet on vacation and beach read.', 'Education', '2025-09-12 18:33:24', 0, 1),
(8, 'Deep Work', 950.00, 160, 'books/1757702153_deep_work.jpg', 'Rules for focused success in a distracted world.', 'Science', '2025-09-12 18:35:53', 0, 1),
(9, 'Desert Flower', 1260.00, 120, 'books/1757702314_desert_flower.jpg', 'The extraordinary journey of a desert nomad', 'Fiction', '2025-09-12 18:38:34', 0, 1),
(10, 'Beloved', 780.00, 180, 'books/1757702477_eloved.jpg', 'A Pulitzer Prize-winning novel about Sethe, an escaped enslaved woman haunted by the ghost of her baby daughter and the trauma of her past.', 'History', '2025-09-12 18:41:17', 0, 1),
(11, 'Hyperion', 1300.00, 50, 'books/1757702529_hyperion.jpg', 'A science fiction classic structured like Chaucer\'s Canterbury Tales, following seven pilgrims on a journey to the terrifying Shrike creature, each telling their story.', 'Science', '2025-09-12 18:42:09', 0, 1),
(12, 'It Ends with Us', 520.00, 164, 'books/1757702596_it_ends_with_us.jpg', 'A powerful contemporary novel that follows Lily Bloom as she navigates a new relationship while confronting the patterns of her parents\' troubled marriage.', 'Fiction', '2025-09-12 18:43:16', 0, 1),
(13, 'Long Walk to Freedom', 2340.00, 42, 'books/1757702668_long_walk_to_freedom.jpg', 'The autobiography of Nelson Mandela, chronicling his early life, education, 27 years in prison, and his pivotal role in dismantling apartheid in South Africa.', 'History', '2025-09-12 18:44:28', 0, 1),
(14, 'The Lord of the Rings', 1670.00, 127, 'books/1757702733_lord_of_the_rings.jpg', 'The epic high fantasy trilogy that follows the quest to destroy the One Ring and defeat the Dark Lord Sauron. This is a one-volume edition.', 'Fiction', '2025-09-12 18:45:33', 0, 1),
(15, 'Mindset', 1000.00, 249, 'books/1757702824_mindset.jpg', 'The book explores the concept of \"fixed\" vs. \"growth\" mindsets and how our beliefs about our own abilities fundamentally impact our success in all areas of life.', 'Education', '2025-09-12 18:47:04', 0, 1),
(16, 'One Hundred Years of Solitude', 1460.00, 321, 'books/1757702885_one_hundred_years_of_solitude.jpg', 'A landmark of magical realism that tells the multi-generational story of the Buendía family in the mythical town of Macondo.', 'Fiction', '2025-09-12 18:48:05', 0, 1),
(17, 'The Diary of a Young Girl', 956.00, 58, 'books/1757702938_the_diary_of_a_young_girl.jpg', 'The poignant and powerful diary written by a Jewish girl while she and her family were in hiding for two years during the Nazi occupation of the Netherlands.', 'History', '2025-09-12 18:48:58', 0, 1),
(18, 'The Fault in Our Stars', 786.00, 197, 'books/1757702996_the_fault_in_our_stars.jpg', 'A heart-wrenching yet funny young adult novel about two teenagers, Hazel and Augustus, who meet and fall in love at a cancer support group.', 'Fiction', '2025-09-12 18:49:56', 0, 1),
(19, 'The Fault in Our Stars', 786.00, 197, 'books/1757702997_the_fault_in_our_stars.jpg', 'A heart-wrenching yet funny young adult novel about two teenagers, Hazel and Augustus, who meet and fall in love at a cancer support group.', 'Fiction', '2025-09-12 18:49:57', 0, 1),
(20, 'The Glass Castle', 1620.00, 46, 'books/1757703064_the_glass_castle.jpg', 'A remarkable memoir of resilience and redemption, recounting the author\'s impoverished, nomadic, and often deeply troubled childhood.', 'Education', '2025-09-12 18:51:04', 0, 1),
(21, 'The Great Gatsby', 2150.00, 30, 'books/1757703113_the_great_gatsby.jpg', 'A classic American novel set in the Jazz Age, exploring themes of idealism, decadence, resistance to change, and the American Dream through the tragic story of Jay Gatsby.', 'Fiction', '2025-09-12 18:51:53', 0, 1),
(22, 'The Hate U Give', 1268.00, 152, 'books/1757703183_the_hate_u_give.jpg', 'A powerful and award-winning young adult novel about Starr Carter, who witnesses the police shooting of her unarmed best friend and must find her voice to fight for justice.', 'Fiction', '2025-09-12 18:53:03', 0, 1),
(23, 'The Love Hypothesis', 2340.00, 164, 'books/1757703236_the_love_hypothesis.jpg', 'A popular STEMinist romantic comedy about a Ph.D. candidate who fake-dates a famous young professor to convince her friend she\'s over her ex, only for things to get very real.', 'Fiction', '2025-09-12 18:53:56', 0, 1),
(24, 'The Martian', 1689.00, 126, 'books/1757703291_the_martian.jpg', 'A gripping science fiction novel about an astronaut who is mistakenly left behind on Mars and must use his ingenuity and engineering skills to survive and signal Earth that he is alive.', 'Science', '2025-09-12 18:54:51', 0, 1),
(25, 'The Power of Now', 1450.00, 210, 'books/1757703364_the_power_of_now.jpg', 'A groundbreaking guide to spiritual self-help that emphasizes the importance of living in the present moment to find joy and overcome pain and anxiety.', 'Education', '2025-09-12 18:56:04', 0, 1),
(26, 'The Sun Is Also a Star', 1640.00, 100, 'books/1757703432_the_sun_is_also_a_star.jpg', 'A young adult romance novel about Natasha, a pragmatic girl being deported, and Daniel, a poet, who meet and fall in love over the course of a single day in New York City.', 'Fiction', '2025-09-12 18:57:12', 0, 1),
(27, 'The Three-Body Problem', 2130.00, 20, 'books/1757703475_the_three-body_problem.jpg', 'The first book in the acclaimed Remembrance of Earth\'s Past trilogy, a science fiction epic that begins with a secret Chinese military project making contact with an alien civilization.', 'Science', '2025-09-12 18:57:55', 0, 1),
(28, 'The Witness', 1400.00, 150, 'books/1757703541_the_witness.jpg', 'A romantic suspense thriller about a woman who, after witnessing a brutal crime, enters witness protection and builds a new, isolated life, only to have her past catch up with her.', 'Fiction', '2025-09-12 18:59:01', 0, 1),
(29, 'The Hating Game', 980.00, 78, 'books/1757703589_the-hating_game.jpg', 'A hilarious and steamy romantic comedy about two rival executive assistants who engage in constant pranks and mind games, until their tension erupts into something more.', 'Fiction', '2025-09-12 18:59:49', 0, 1),
(30, 'To Kill a Mockingbird', 580.00, 50, 'books/1757703642_to_kill_a_mockingbird.jpg', 'A Pulitzer Prize-winning classic novel that explores racial inequality and moral growth through the eyes of young Scout Finch in the Depression-era South.', 'Fiction', '2025-09-12 19:00:42', 0, 1),
(31, 'Born a Crime', 2160.00, 46, 'books/1757703691_trevornoah_born_a_crime.jpg', 'The comedic and compelling memoir of \"The Daily Show\" host, recounting his childhood growing up mixed-race in South Africa during the last years of apartheid.', 'Education', '2025-09-12 19:01:31', 0, 1),
(32, 'Turtles All the Way Down', 1800.00, 180, 'books/1757703736_turtles_all_the_way_down.jpg', 'A young adult novel that follows sixteen-year-old Aza Holmes as she investigates the disappearance of a fugitive billionaire while grappling with her own intense obsessive-compulsive disorder (OCD).', 'Fiction', '2025-09-12 19:02:16', 0, 1);
-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 13, 2025 at 10:07 AM
-- Server version: 5.7.24
-- PHP Version: 7.3.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `readify`
--
DROP DATABASE readify if EXISTS;
CREATE DATABASE `readify` ;
USE `readify`;

-- --------------------------------------------------------

--
-- Table structure for table `authors`
--

CREATE TABLE `authors` (
  `book_id` int(11) NOT NULL,
  `author_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `authors`
--

INSERT INTO `authors` (`book_id`, `author_name`) VALUES
(4, 'Arkady Martine'),
(5, 'Ann Leckie'),
(6, 'James Clear'),
(7, 'Emily Henry'),
(8, 'Cal Newport'),
(9, 'Waris Dirie'),
(9, 'Catheen Miller'),
(10, 'Toni Morrison'),
(11, 'Dan Simmons'),
(12, 'Colleen Hoover'),
(13, 'Nelson Mandela'),
(14, 'J.R.R. Tolkien'),
(15, 'Carol S. Dweck'),
(15, 'Ph.D.'),
(16, 'Gabriel García Márquez'),
(17, 'Anne Frank'),
(18, 'John Green'),
(19, 'John Green'),
(20, 'Jeannette Walls'),
(21, 'F. Scott Fitzgerald'),
(22, 'Angie Thomas'),
(23, 'Ali Hazelwood'),
(24, 'Andy Weir'),
(25, 'Eckhart Tolle'),
(26, 'Nicola Yoon'),
(27, 'Cixin Liu'),
(28, 'Nora Roberts'),
(29, 'Sally Thorne'),
(30, 'Harper Lee'),
(31, 'Trevor Noah'),
(32, 'John Green');

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `book_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL,
  `image` varchar(200) NOT NULL,
  `description` varchar(500) NOT NULL,
  `category` varchar(20) NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `sold` int(11) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`book_id`, `title`, `price`, `stock`, `image`, `description`, `category`, `updated_at`, `sold`, `status`) VALUES
(4, 'A Memory Called Empire', 1000.00, 15, 'books/1757701311_a_memory_called_empire.jpg', 'All around brilliant space opera. I absolutely love it.', 'Fiction', '2025-09-13 12:48:03', 0, 1),
(5, 'Ancillary Justice', 1000.00, 250, 'books/1757701649_ancillary_justice.jpg', 'New York times best selling series.', 'Fiction', '2025-09-12 18:27:29', 0, 1),
(6, 'Atomic Habits', 1854.00, 526, 'books/1757701847_atomic_habits.jpg', 'An easy and proven way to build good habits and break bad ones.', 'Education', '2025-09-12 18:30:47', 0, 1),
(7, 'Book Lovers', 856.00, 354, 'books/1757702004_book_lovers.jpg', 'New York times best selling author of people we meet on vacation and beach read.', 'Education', '2025-09-12 18:33:24', 0, 1),
(8, 'Deep Work', 950.00, 160, 'books/1757702153_deep_work.jpg', 'Rules for focused success in a distracted world.', 'Science', '2025-09-12 18:35:53', 0, 1),
(9, 'Desert Flower', 1260.00, 120, 'books/1757702314_desert_flower.jpg', 'The extraordinary journey of a desert nomad', 'Fiction', '2025-09-12 18:38:34', 0, 1),
(10, 'Beloved', 780.00, 180, 'books/1757702477_eloved.jpg', 'A Pulitzer Prize-winning novel about Sethe, an escaped enslaved woman haunted by the ghost of her baby daughter and the trauma of her past.', 'History', '2025-09-12 18:41:17', 0, 1),
(11, 'Hyperion', 1300.00, 50, 'books/1757702529_hyperion.jpg', 'A science fiction classic structured like Chaucer\'s Canterbury Tales, following seven pilgrims on a journey to the terrifying Shrike creature, each telling their story.', 'Science', '2025-09-12 18:42:09', 0, 1),
(12, 'It Ends with Us', 520.00, 164, 'books/1757702596_it_ends_with_us.jpg', 'A powerful contemporary novel that follows Lily Bloom as she navigates a new relationship while confronting the patterns of her parents\' troubled marriage.', 'Fiction', '2025-09-12 18:43:16', 0, 1),
(13, 'Long Walk to Freedom', 2340.00, 42, 'books/1757702668_long_walk_to_freedom.jpg', 'The autobiography of Nelson Mandela, chronicling his early life, education, 27 years in prison, and his pivotal role in dismantling apartheid in South Africa.', 'History', '2025-09-12 18:44:28', 0, 1),
(14, 'The Lord of the Rings', 1670.00, 127, 'books/1757702733_lord_of_the_rings.jpg', 'The epic high fantasy trilogy that follows the quest to destroy the One Ring and defeat the Dark Lord Sauron. This is a one-volume edition.', 'Fiction', '2025-09-12 18:45:33', 0, 1),
(15, 'Mindset', 1000.00, 249, 'books/1757702824_mindset.jpg', 'The book explores the concept of \"fixed\" vs. \"growth\" mindsets and how our beliefs about our own abilities fundamentally impact our success in all areas of life.', 'Education', '2025-09-12 18:47:04', 0, 1),
(16, 'One Hundred Years of Solitude', 1460.00, 321, 'books/1757702885_one_hundred_years_of_solitude.jpg', 'A landmark of magical realism that tells the multi-generational story of the Buendía family in the mythical town of Macondo.', 'Fiction', '2025-09-12 18:48:05', 0, 1),
(17, 'The Diary of a Young Girl', 956.00, 58, 'books/1757702938_the_diary_of_a_young_girl.jpg', 'The poignant and powerful diary written by a Jewish girl while she and her family were in hiding for two years during the Nazi occupation of the Netherlands.', 'History', '2025-09-12 18:48:58', 0, 1),
(18, 'The Fault in Our Stars', 786.00, 197, 'books/1757702996_the_fault_in_our_stars.jpg', 'A heart-wrenching yet funny young adult novel about two teenagers, Hazel and Augustus, who meet and fall in love at a cancer support group.', 'Fiction', '2025-09-12 18:49:56', 0, 1),
(19, 'The Fault in Our Stars', 786.00, 197, 'books/1757702997_the_fault_in_our_stars.jpg', 'A heart-wrenching yet funny young adult novel about two teenagers, Hazel and Augustus, who meet and fall in love at a cancer support group.', 'Fiction', '2025-09-12 18:49:57', 0, 1),
(20, 'The Glass Castle', 1620.00, 46, 'books/1757703064_the_glass_castle.jpg', 'A remarkable memoir of resilience and redemption, recounting the author\'s impoverished, nomadic, and often deeply troubled childhood.', 'Education', '2025-09-12 18:51:04', 0, 1),
(21, 'The Great Gatsby', 2150.00, 30, 'books/1757703113_the_great_gatsby.jpg', 'A classic American novel set in the Jazz Age, exploring themes of idealism, decadence, resistance to change, and the American Dream through the tragic story of Jay Gatsby.', 'Fiction', '2025-09-12 18:51:53', 0, 1),
(22, 'The Hate U Give', 1268.00, 152, 'books/1757703183_the_hate_u_give.jpg', 'A powerful and award-winning young adult novel about Starr Carter, who witnesses the police shooting of her unarmed best friend and must find her voice to fight for justice.', 'Fiction', '2025-09-12 18:53:03', 0, 1),
(23, 'The Love Hypothesis', 2340.00, 164, 'books/1757703236_the_love_hypothesis.jpg', 'A popular STEMinist romantic comedy about a Ph.D. candidate who fake-dates a famous young professor to convince her friend she\'s over her ex, only for things to get very real.', 'Fiction', '2025-09-12 18:53:56', 0, 1),
(24, 'The Martian', 1689.00, 126, 'books/1757703291_the_martian.jpg', 'A gripping science fiction novel about an astronaut who is mistakenly left behind on Mars and must use his ingenuity and engineering skills to survive and signal Earth that he is alive.', 'Science', '2025-09-12 18:54:51', 0, 1),
(25, 'The Power of Now', 1450.00, 210, 'books/1757703364_the_power_of_now.jpg', 'A groundbreaking guide to spiritual self-help that emphasizes the importance of living in the present moment to find joy and overcome pain and anxiety.', 'Education', '2025-09-12 18:56:04', 0, 1),
(26, 'The Sun Is Also a Star', 1640.00, 100, 'books/1757703432_the_sun_is_also_a_star.jpg', 'A young adult romance novel about Natasha, a pragmatic girl being deported, and Daniel, a poet, who meet and fall in love over the course of a single day in New York City.', 'Fiction', '2025-09-12 18:57:12', 0, 1),
(27, 'The Three-Body Problem', 2130.00, 20, 'books/1757703475_the_three-body_problem.jpg', 'The first book in the acclaimed Remembrance of Earth\'s Past trilogy, a science fiction epic that begins with a secret Chinese military project making contact with an alien civilization.', 'Science', '2025-09-12 18:57:55', 0, 1),
(28, 'The Witness', 1400.00, 150, 'books/1757703541_the_witness.jpg', 'A romantic suspense thriller about a woman who, after witnessing a brutal crime, enters witness protection and builds a new, isolated life, only to have her past catch up with her.', 'Fiction', '2025-09-12 18:59:01', 0, 1),
(29, 'The Hating Game', 980.00, 78, 'books/1757703589_the-hating_game.jpg', 'A hilarious and steamy romantic comedy about two rival executive assistants who engage in constant pranks and mind games, until their tension erupts into something more.', 'Fiction', '2025-09-12 18:59:49', 0, 1),
(30, 'To Kill a Mockingbird', 580.00, 50, 'books/1757703642_to_kill_a_mockingbird.jpg', 'A Pulitzer Prize-winning classic novel that explores racial inequality and moral growth through the eyes of young Scout Finch in the Depression-era South.', 'Fiction', '2025-09-12 19:00:42', 0, 1),
(31, 'Born a Crime', 2160.00, 46, 'books/1757703691_trevornoah_born_a_crime.jpg', 'The comedic and compelling memoir of \"The Daily Show\" host, recounting his childhood growing up mixed-race in South Africa during the last years of apartheid.', 'Education', '2025-09-12 19:01:31', 0, 1),
(32, 'Turtles All the Way Down', 1800.00, 180, 'books/1757703736_turtles_all_the_way_down.jpg', 'A young adult novel that follows sixteen-year-old Aza Holmes as she investigates the disappearance of a fugitive billionaire while grappling with her own intense obsessive-compulsive disorder (OCD).', 'Fiction', '2025-09-12 19:02:16', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `cart_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `customer_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `address` varchar(200) NOT NULL,
  `telno` varchar(10) NOT NULL,
  `email` varchar(150) NOT NULL,
  `photo` varchar(200) NOT NULL DEFAULT 'profile/profiledefault.png'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`customer_id`, `name`, `address`, `telno`, `email`, `photo`) VALUES
(5, 'Sanira Deneth', 'no312, Ampe, Balapitiya', '0781003580', 'sanira.adesha@gmail.com', 'profile/1757670482_WhatsAppImage2025-06-28at13.59.33.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `item_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `review` varchar(500) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `rating` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `email` varchar(150) NOT NULL,
  `password` varchar(200) NOT NULL,
  `category` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`email`, `password`, `category`) VALUES
('admin@gmail.com', '$2y$10$.mkCO.VWSnYzPFGsLSK3QuWXOfgbDyfUwc4qpt8A11.DrcUdal8d.', 'admin'),
('sanira.adesha@gmail.com', '$2y$10$FfSNoX.Dt6iHfQya4PYu4eX5gFDcIsAXUnMt56jPj8PU9NSbOLWD2', 'customers');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `authors`
--
ALTER TABLE `authors`
  ADD KEY `book_id` (`book_id`);

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`book_id`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `customer_id` (`customer_id
-- --------------------------------------------------------

--
-- Table structure for table cart
--

CREATE TABLE cart (
  cart_id int NOT NULL,
  customer_id int NOT NULL,
  book_id int NOT NULL,
  quantity int NOT NULL DEFAULT '1'
) ;

--
-- Dumping data for table cart
--

INSERT INTO cart (cart_id, customer_id, book_id, quantity) VALUES
(28, 5, 4, 2);

-- --------------------------------------------------------

--
-- Table structure for table customers
--

CREATE TABLE customers (
  customer_id int NOT NULL,
  name varchar(100) NOT NULL,
  address varchar(200) NOT NULL,
  telno varchar(10) NOT NULL,
  email varchar(150) NOT NULL,
  photo varchar(200) NOT NULL DEFAULT 'profile/profiledefault.png'
) ;

--
-- Dumping data for table customers
--

INSERT INTO customers (customer_id, name, address, telno, email, photo) VALUES
(5, 'Sanira Deneth', 'no312, Ampe, Balapitiya', '0781003580', 'sanira.adesha@gmail.com', 'profile/1757670482_WhatsAppImage2025-06-28at13.59.33.jpg');

-- --------------------------------------------------------

--
-- Table structure for table orders
--

CREATE TABLE orders (
  order_id int NOT NULL,
  customer_id int NOT NULL,
  total decimal(10,2) NOT NULL,
  status int NOT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table order_items
--

CREATE TABLE order_items (
  item_id int NOT NULL,
  order_id int NOT NULL,
  book_id int NOT NULL,
  quantity int NOT NULL,
  price decimal(10,2) NOT NULL
)  ;

-- --------------------------------------------------------

--
-- Table structure for table reviews
--

CREATE TABLE reviews (
  review_id int NOT NULL,
  date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  review varchar(500) NOT NULL,
  customer_id int NOT NULL,
  rating decimal(10,2) NOT NULL
)  ;

-- --------------------------------------------------------

--
-- Table structure for table users
--

CREATE TABLE users (
  email varchar(150) NOT NULL,
  password varchar(200) NOT NULL,
  category varchar(10) NOT NULL
)  ;

--
-- Dumping data for table users
--

INSERT INTO users (email, password, category) VALUES
('admin@gmail.com', '$2y$10$.mkCO.VWSnYzPFGsLSK3QuWXOfgbDyfUwc4qpt8A11.DrcUdal8d.', 'admin'),
('sanira.adesha@gmail.com', '$2y$10$FfSNoX.Dt6iHfQya4PYu4eX5gFDcIsAXUnMt56jPj8PU9NSbOLWD2', 'customers');

--
-- Indexes for dumped tables
--

--
-- Indexes for table authors
--
ALTER TABLE authors
  ADD KEY book_id (book_id);

--
-- Indexes for table books
--
ALTER TABLE books
  ADD PRIMARY KEY (book_id);

--
-- Indexes for table cart
--
ALTER TABLE cart
  ADD PRIMARY KEY (cart_id),
  ADD KEY customer_id (customer_id),
  ADD KEY book_for_cart (book_id);

--
-- Indexes for table customers
--
ALTER TABLE customers
  ADD PRIMARY KEY (customer_id),
  ADD KEY fk_customers_user (email);

--
-- Indexes for table orders
--
ALTER TABLE orders
  ADD PRIMARY KEY (order_id),
  ADD KEY customer_orders (customer_id);

--
-- Indexes for table order_items
--
ALTER TABLE order_items
  ADD PRIMARY KEY (item_id),
  ADD KEY order_item_order (order_id),
  ADD KEY order_item_book (book_id);

--
-- Indexes for table reviews
--
ALTER TABLE reviews
  ADD PRIMARY KEY (review_id),
  ADD KEY reviews_customer (customer_id);

--
-- Indexes for table users
--
ALTER TABLE users
  ADD PRIMARY KEY (email);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table books
--
ALTER TABLE books
  MODIFY book_id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table cart
--
ALTER TABLE cart
  MODIFY cart_id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table customers
--
ALTER TABLE customers
  MODIFY customer_id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table orders
--
ALTER TABLE orders
  MODIFY order_id int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table order_items
--
ALTER TABLE order_items
  MODIFY item_id int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table reviews
--
ALTER TABLE reviews
  MODIFY review_id int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table authors
--
ALTER TABLE authors
  ADD CONSTRAINT book_id FOREIGN KEY (book_id) REFERENCES books (book_id) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table cart
--
ALTER TABLE cart
  ADD CONSTRAINT book_for_cart FOREIGN KEY (book_id) REFERENCES books (book_id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT customer_id FOREIGN KEY (customer_id) REFERENCES customers (customer_id) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table customers
--
ALTER TABLE customers
  ADD CONSTRAINT email FOREIGN KEY (email) REFERENCES users (email) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT fk_customers_user FOREIGN KEY (email) REFERENCES users (email) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table orders
--
ALTER TABLE orders
  ADD CONSTRAINT customer_orders FOREIGN KEY (customer_id) REFERENCES customers (customer_id);

--
-- Constraints for table order_items
--
ALTER TABLE order_items
  ADD CONSTRAINT order_item_book FOREIGN KEY (book_id) REFERENCES books (book_id),
  ADD CONSTRAINT order_item_order FOREIGN KEY (order_id) REFERENCES orders (order_id);

--
-- Constraints for table reviews
--
ALTER TABLE reviews
  ADD CONSTRAINT reviews_customer FOREIGN KEY (customer_id) REFERENCES customers (customer_id);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;