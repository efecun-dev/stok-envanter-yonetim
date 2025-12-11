-- ===============================
--  INVENTO FULL DATABASE BACKUP
--  Created: 2025-12-11T22:50:34.968Z
-- ===============================

--
-- TABLE: hareketler
--

CREATE TABLE `hareketler` (
  `id` int NOT NULL AUTO_INCREMENT,
  `urun_id` int NOT NULL,
  `hareket_turu` enum('giris','cikis','transfer','duzenleme') DEFAULT NULL,
  `irsaliye_fatura_no` varchar(255) DEFAULT NULL,
  `eski_stok` int DEFAULT NULL,
  `miktar` int DEFAULT NULL,
  `yetkili_id` int DEFAULT NULL,
  `aciklama` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_urun_id` (`urun_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Bu tabloda veri yok.

--
-- TABLE: kategoriler
--

CREATE TABLE `kategoriler` (
  `id` int NOT NULL AUTO_INCREMENT,
  `kategori_adi` varchar(255) NOT NULL,
  `aciklama` text,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Bu tabloda veri yok.

--
-- TABLE: raporlar
--

CREATE TABLE `raporlar` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `ad` varchar(255) NOT NULL,
  `sablon_turu` enum('monthly_inventory','profitability','critical_stock','trend','supplier','custom') NOT NULL DEFAULT 'custom',
  `format` enum('pdf','excel','csv') NOT NULL DEFAULT 'pdf',
  `tarih_baslangic` date DEFAULT NULL,
  `tarih_bitis` date DEFAULT NULL,
  `filtre_ozeti` varchar(255) DEFAULT NULL,
  `filtre_json` json DEFAULT NULL,
  `dosya_yolu` varchar(500) DEFAULT NULL,
  `boyut_bytes` int unsigned DEFAULT '0',
  `olusturan_id` int unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tarih` (`tarih_baslangic`,`tarih_bitis`),
  KEY `idx_olusturan` (`olusturan_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Bu tabloda veri yok.

--
-- TABLE: units
--

CREATE TABLE `units` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ad` varchar(50) NOT NULL,
  `kod` varchar(10) NOT NULL,
  `kategori` varchar(30) NOT NULL,
  `aciklama` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- DATA (42 rows)
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (1, 'Adet', 'adet', 'miktar', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (2, 'Paket', 'pkt', 'miktar', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (3, 'Kutu', 'ktu', 'miktar', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (4, 'Çuval', 'cuv', 'miktar', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (5, 'Düzine', 'dz', 'miktar', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (6, 'Karton', 'krt', 'miktar', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (7, 'Palet', 'plt', 'miktar', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (8, 'Teneke', 'tnk', 'miktar', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (9, 'Bidon', 'bdn', 'miktar', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (10, 'Rulo', 'rulo', 'miktar', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (11, 'Torba', 'trb', 'miktar', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (12, 'Kilogram', 'kg', 'agirlik', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (13, 'Gram', 'g', 'agirlik', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (14, 'Miligram', 'mg', 'agirlik', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (15, 'Ton', 'ton', 'agirlik', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (16, 'Kental', 'knt', 'agirlik', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (17, 'Libre', 'lb', 'agirlik', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (18, 'Ons', 'oz', 'agirlik', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (19, 'Litre', 'lt', 'hacim', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (20, 'Mililitre', 'ml', 'hacim', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (21, 'Santilitre', 'cl', 'hacim', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (22, 'Metreküp', 'm3', 'hacim', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (23, 'Galon', 'gal', 'hacim', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (24, 'Barril', 'bbl', 'hacim', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (25, 'Santimetre', 'cm', 'uzunluk', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (26, 'Metre', 'm', 'uzunluk', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (27, 'Kilometre', 'km', 'uzunluk', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (28, 'Milimetre', 'mm', 'uzunluk', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (29, 'İnç', 'inch', 'uzunluk', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (30, 'Foot', 'ft', 'uzunluk', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (31, 'Yard', 'yd', 'uzunluk', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (32, 'Metrekare', 'm2', 'alan', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (33, 'Santimetrekare', 'cm2', 'alan', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (34, 'Kilometrekare', 'km2', 'alan', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (35, 'Hektar', 'ha', 'alan', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (36, 'Akr', 'ac', 'alan', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (37, 'Kilowatt-saat', 'kWh', 'enerji', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (38, 'Joule', 'J', 'enerji', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (39, 'Kalori', 'cal', 'enerji', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (40, 'Saat', 'h', 'zaman', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (41, 'Dakika', 'min', 'zaman', NULL);
INSERT INTO `units` (`id`, `ad`, `kod`, `kategori`, `aciklama`) VALUES (42, 'Saniye', 's', 'zaman', NULL);

--
-- TABLE: urunler
--

CREATE TABLE `urunler` (
  `id` int NOT NULL AUTO_INCREMENT,
  `urun_adi` varchar(255) NOT NULL,
  `kategori_id` int NOT NULL,
  `barkod` bigint DEFAULT NULL,
  `sku` varchar(255) DEFAULT NULL,
  `aciklama` text,
  `resim_url` varchar(255) DEFAULT NULL,
  `mevcut_stok` int DEFAULT NULL,
  `min_stok` int DEFAULT NULL,
  `max_stok` int DEFAULT NULL,
  `birim_id` int DEFAULT NULL,
  `alis_fiyati` float DEFAULT NULL,
  `satis_fiyati` float DEFAULT NULL,
  `kdv` int DEFAULT NULL,
  `tedarikci` varchar(255) DEFAULT NULL,
  `raf_konumu` varchar(255) DEFAULT NULL,
  `garanti` bigint DEFAULT NULL,
  `son_kullanma_tarihi` date DEFAULT NULL,
  `urun_link` text,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Bu tabloda veri yok.

--
-- TABLE: users
--

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ad_soyad` text NOT NULL,
  `email` text NOT NULL,
  `sifre_hash` text NOT NULL,
  `avatar_url` text,
  `telefon` varchar(10) DEFAULT NULL,
  `son_giris_tarihi` timestamp NULL DEFAULT NULL,
  `olusturulma_tarihi` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `guncellenme_tarihi` timestamp NULL DEFAULT NULL,
  `role` enum('admin','staff') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Bu tabloda veri yok.

