-- GameScope: Video Game Regional Sales Analytics
CREATE DATABASE IF NOT EXISTS gamescope;
USE gamescope;

CREATE TABLE platforms (
  platform_id INT AUTO_INCREMENT PRIMARY KEY,
  platform_name VARCHAR(50) NOT NULL UNIQUE,
  manufacturer VARCHAR(80)
);
CREATE TABLE genres (
  genre_id INT AUTO_INCREMENT PRIMARY KEY,
  genre_name VARCHAR(60) NOT NULL UNIQUE
);
CREATE TABLE publishers (
  publisher_id INT AUTO_INCREMENT PRIMARY KEY,
  publisher_name VARCHAR(120) NOT NULL UNIQUE
);
CREATE TABLE games (
  game_id INT AUTO_INCREMENT PRIMARY KEY,
  game_name VARCHAR(150) NOT NULL,
  platform_id INT,
  genre_id INT,
  publisher_id INT,
  release_year SMALLINT,
  global_sales DECIMAL(8,2) NOT NULL DEFAULT 0,
  CONSTRAINT fk_game_platform FOREIGN KEY (platform_id) REFERENCES platforms(platform_id),
  CONSTRAINT fk_game_genre FOREIGN KEY (genre_id) REFERENCES genres(genre_id),
  CONSTRAINT fk_game_publisher FOREIGN KEY (publisher_id) REFERENCES publishers(publisher_id)
);
CREATE TABLE regional_sales (
  sales_id INT AUTO_INCREMENT PRIMARY KEY,
  game_id INT NOT NULL,
  region_name VARCHAR(40) NOT NULL,
  sales_millions DECIMAL(8,2) NOT NULL DEFAULT 0,
  CONSTRAINT fk_sales_game FOREIGN KEY (game_id) REFERENCES games(game_id),
  CONSTRAINT uq_game_region UNIQUE (game_id, region_name)
);

-- Reports
SELECT region_name, SUM(sales_millions) AS total_sales
FROM regional_sales GROUP BY region_name ORDER BY total_sales DESC;

SELECT game_name, global_sales
FROM games ORDER BY global_sales DESC LIMIT 10;

SELECT ge.genre_name, SUM(g.global_sales) AS total_sales
FROM games g JOIN genres ge ON g.genre_id = ge.genre_id
GROUP BY ge.genre_name ORDER BY total_sales DESC;

SELECT p.platform_name, SUM(g.global_sales) AS total_sales
FROM games g JOIN platforms p ON g.platform_id = p.platform_id
GROUP BY p.platform_name ORDER BY total_sales DESC;
