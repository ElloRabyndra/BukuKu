-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 01 Des 2024 pada 10.47
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bukuku`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `book`
--

CREATE TABLE `book` (
  `id_book` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `tittle` varchar(255) DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `publisher` varchar(255) DEFAULT NULL,
  `status` varchar(25) DEFAULT 'Belum Dibaca',
  `start_date` date DEFAULT '2024-01-01',
  `end_date` date DEFAULT '2024-01-01',
  `notes` text DEFAULT NULL,
  `cover_book` varchar(100) DEFAULT NULL,
  `id_categories` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `book`
--

INSERT INTO `book` (`id_book`, `id_user`, `tittle`, `author`, `publisher`, `status`, `start_date`, `end_date`, `notes`, `cover_book`, `id_categories`) VALUES
(17, 3, 'Goat Brothers', 'Colton, Larry', 'Doubleday', 'Selesai Dibaca', '2024-10-01', '2024-11-20', 'Bagus!!!', 'goatBrothers.jpg', 17),
(19, 3, 'From Mama Kitchen', 'Catharine P Smith', 'Ideals Publishing', 'Selesai Dibaca', '2024-07-25', '2024-09-27', '', 'mamaKitchen.jpg', 18),
(20, 3, 'All Around The Town', 'Clark, Mary Higgins', 'Simon & Schuster', 'Sedang Dibaca', '2024-11-13', '0000-00-00', 'Halaman 50', 'allAround.jpg', 19),
(21, 3, 'The Second Shift', 'Hochschild, Arlie', 'Avon Books', 'Belum Dibaca', '2024-01-01', '2024-01-01', NULL, 'secondShift.jpg', 20),
(22, 3, 'The Missing Person', 'Grumbach, Doris', 'Bonanza Books', 'Belum Dibaca', '2024-01-01', '2024-01-01', NULL, 'missingPerson.jpg', 17);

-- --------------------------------------------------------

--
-- Struktur dari tabel `categories`
--

CREATE TABLE `categories` (
  `id_categories` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `id_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `categories`
--

INSERT INTO `categories` (`id_categories`, `name`, `id_user`) VALUES
(17, 'General', 3),
(18, 'Cooking', 3),
(19, 'Fiction', 3),
(20, 'Social Science', 3);

-- --------------------------------------------------------

--
-- Struktur dari tabel `user`
--

CREATE TABLE `user` (
  `id_user` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `user`
--

INSERT INTO `user` (`id_user`, `username`, `password`) VALUES
(3, 'ElloRabyndra', '$2a$10$FbZQZavjuv13XeiQ5pFj9.B8xMQrOvXnOJIIAOlLMcDJ1BgykZgRa'),
(4, 'FairusPutra', '$2a$10$cBMEzFt.npu.OT0dlgLIqeqM6HBK6G8vZqGvJiRUp9Y66rFwlBIdy'),
(5, 'AbdulFattah', '$2a$10$UTGn/yHwZQv7B8yYRQXtqe3/p0.xWlTRc47Oa0vai/DHFnbIWZMNm');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `book`
--
ALTER TABLE `book`
  ADD PRIMARY KEY (`id_book`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_categories` (`id_categories`);

--
-- Indeks untuk tabel `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id_categories`),
  ADD KEY `id_user` (`id_user`);

--
-- Indeks untuk tabel `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `book`
--
ALTER TABLE `book`
  MODIFY `id_book` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT untuk tabel `categories`
--
ALTER TABLE `categories`
  MODIFY `id_categories` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT untuk tabel `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `book`
--
ALTER TABLE `book`
  ADD CONSTRAINT `book_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`),
  ADD CONSTRAINT `book_ibfk_2` FOREIGN KEY (`id_categories`) REFERENCES `categories` (`id_categories`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
