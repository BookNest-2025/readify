SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Database: `readify`
CREATE DATABASE IF NOT EXISTS `readify`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;
USE `readify`;

CREATE TABLE `authors` (
  `book_id` int NOT NULL,
  `author_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `books` (
  `book_id` int NOT NULL,
  `title` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int NOT NULL,
  `image` varchar(200) NOT NULL,
  `description` varchar(500) NOT NULL,
  `category` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `cart` (
  `cart_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `book_id` int NOT NULL,
  `quantity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `customers` (
  `customer_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `address` varchar(200) NOT NULL,
  `telno` varchar(10) NOT NULL,
  `email` varchar(150) NOT NULL,
  `photo` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
          DEFAULT 'profile/profiledefault.png'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `customers`
(`customer_id`,`name`,`address`,`telno`,`email`,`photo`) VALUES
(5,'Sanira Deneth','no312, Ampe, Balapitiya','0781003580',
 'sanira.adesha@gmail.com',
 'profile/1757670482_WhatsAppImage2025-06-28at13.59.33.jpg');

CREATE TABLE `orders` (
  `order_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `order_items` (
  `item_id` int NOT NULL,
  `order_id` int NOT NULL,
  `book_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `reviews` (
  `review_id` int NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `review` varchar(500) NOT NULL,
  `customer_id` int NOT NULL,
  `rating` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `users` (
  `email` varchar(150) NOT NULL,
  `password` varchar(200) NOT NULL,
  `category` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `users` (`email`,`password`,`category`) VALUES
('admin@gmail.com',
 '$2y$10$.mkCO.VWSnYzPFGsLSK3QuWXOfgbDyfUwc4qpt8A11.DrcUdal8d.','admin'),
('sanira.adesha@gmail.com',
 '$2y$10$FfSNoX.Dt6iHfQya4PYu4eX5gFDcIsAXUnMt56jPj8PU9NSbOLWD2','customers');

-- Indexes
ALTER TABLE `authors` ADD KEY `book_id` (`book_id`);
ALTER TABLE `books`   ADD PRIMARY KEY (`book_id`);
ALTER TABLE `cart`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `book_for_cart` (`book_id`);
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customer_id`),
  ADD KEY `email` (`email`);
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `customer_orders` (`customer_id`);
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`item_id`),
  ADD KEY `order_item_order` (`order_id`),
  ADD KEY `order_item_book` (`book_id`);
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `reviews_customer` (`customer_id`);
ALTER TABLE `users`
  ADD PRIMARY KEY (`email`);

-- AUTO_INCREMENT
ALTER TABLE `books`      MODIFY `book_id`    int NOT NULL AUTO_INCREMENT;
ALTER TABLE `cart`       MODIFY `cart_id`    int NOT NULL AUTO_INCREMENT;
ALTER TABLE `customers`  MODIFY `customer_id`int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
ALTER TABLE `orders`     MODIFY `order_id`   int NOT NULL AUTO_INCREMENT;
ALTER TABLE `order_items`MODIFY `item_id`    int NOT NULL AUTO_INCREMENT;
ALTER TABLE `reviews`    MODIFY `review_id`  int NOT NULL AUTO_INCREMENT;

-- Foreign keys
ALTER TABLE `authors`
  ADD CONSTRAINT `book_id` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `cart`
  ADD CONSTRAINT `book_for_cart` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `customer_id`  FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `customers`
  ADD CONSTRAINT `email` FOREIGN KEY (`email`) REFERENCES `users` (`email`)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `orders`
  ADD CONSTRAINT `customer_orders` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`);

ALTER TABLE `order_items`
  ADD CONSTRAINT `order_item_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`),
  ADD CONSTRAINT `order_item_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`);

ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
