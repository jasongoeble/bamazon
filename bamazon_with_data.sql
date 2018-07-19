/*
 Navicat MySQL Data Transfer

 Source Server         : homework
 Source Server Type    : MySQL
 Source Server Version : 80011
 Source Host           : localhost:3306
 Source Schema         : bamazon

 Target Server Type    : MySQL
 Target Server Version : 80011
 File Encoding         : 65001

 Date: 19/07/2018 16:10:44
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for departments
-- ----------------------------
DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
  `department_id` int(11) NOT NULL AUTO_INCREMENT,
  `department_name` varchar(45) DEFAULT NULL,
  `over_head_costs` decimal(50,2) unsigned DEFAULT '0.00',
  PRIMARY KEY (`department_id`),
  UNIQUE KEY `department_id_UNIQUE` (`department_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of departments
-- ----------------------------
BEGIN;
INSERT INTO `departments` VALUES (1, 'manufacturing', 250.00);
INSERT INTO `departments` VALUES (2, 'service', 150.00);
COMMIT;

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `item_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `product_name` varchar(45) DEFAULT NULL,
  `department_name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `price` decimal(50,2) unsigned DEFAULT NULL,
  `stock_quantity` int(11) unsigned DEFAULT NULL,
  `product_sales` decimal(50,2) unsigned DEFAULT '0.00',
  PRIMARY KEY (`item_id`),
  UNIQUE KEY `item_id_UNIQUE` (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of products
-- ----------------------------
BEGIN;
INSERT INTO `products` VALUES (1, 'gizmo', 'manufacturing', 10.00, 985, 150.00);
INSERT INTO `products` VALUES (2, 'gadget', 'manufacturing', 5.00, 1008, 10.00);
INSERT INTO `products` VALUES (3, 'widget', 'manufacturing', 25.00, 1000, 0.00);
INSERT INTO `products` VALUES (4, 'thing-a-ma-jig', 'manufacturing', 50.00, 1020, 0.00);
INSERT INTO `products` VALUES (5, 'wrench', 'manufacturing', 15.00, 1000, 0.00);
INSERT INTO `products` VALUES (6, 'screw driver', 'manufacturing', 10.00, 1000, 0.00);
INSERT INTO `products` VALUES (7, 'cabinet install', 'service', 100.00, 1000000, 0.00);
INSERT INTO `products` VALUES (8, 'vanity install', 'service', 100.00, 1000000, 0.00);
INSERT INTO `products` VALUES (9, 'home theater install', 'service', 100.00, 1000000, 0.00);
INSERT INTO `products` VALUES (10, 'consulting', 'service', 80.00, 1000000, 0.00);
INSERT INTO `products` VALUES (12, 'new widget', 'manufacturing', 300.00, 50, 0.00);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
