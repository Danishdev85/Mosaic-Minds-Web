-- =====================================================
-- Mosaic Minds Database Schema
-- =====================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS session_notes;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS therapist_availability;
DROP TABLE IF EXISTS therapists;
DROP TABLE IF EXISTS specialties;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS contact_messages;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- ADMINS
-- =====================================================

CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SPECIALTIES (e.g. Anxiety, Couples Therapy, Child Psychology)
-- =====================================================

CREATE TABLE specialties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- THERAPISTS (have real login accounts, unlike Vitalis doctors)
-- =====================================================

CREATE TABLE therapists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    specialty_id INT NOT NULL,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    title VARCHAR(120),
    bio TEXT,
    years_experience INT DEFAULT 0,
    session_fee DECIMAL(10, 2) DEFAULT 0.00,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_therapist_specialty FOREIGN KEY (specialty_id) REFERENCES specialties (id) ON DELETE CASCADE
);

-- =====================================================
-- THERAPIST AVAILABILITY (weekly working hours)
-- =====================================================

CREATE TABLE therapist_availability (
    id INT AUTO_INCREMENT PRIMARY KEY,
    therapist_id INT NOT NULL,
    day_of_week ENUM(
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
    ) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_availability_therapist FOREIGN KEY (therapist_id) REFERENCES therapists (id) ON DELETE CASCADE
);

-- =====================================================
-- APPOINTMENTS (guest booking, includes video room reference)
-- =====================================================

CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    therapist_id INT NOT NULL,
    client_name VARCHAR(120) NOT NULL,
    client_email VARCHAR(150) NOT NULL,
    client_phone VARCHAR(30) NOT NULL,
    appointment_date DATE NOT NULL,
    time_slot TIME NOT NULL,
    reason TEXT,
    confirmation_code VARCHAR(20) UNIQUE NOT NULL,
    video_room_name VARCHAR(150),
    video_room_url VARCHAR(255),
    status ENUM(
        'pending', 'confirmed', 'completed', 'cancelled'
    ) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_appointment_therapist FOREIGN KEY (therapist_id) REFERENCES therapists (id) ON DELETE CASCADE
);

-- =====================================================
-- SESSION NOTES (private, therapist-only)
-- =====================================================

CREATE TABLE session_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL,
    therapist_id INT NOT NULL,
    notes TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notes_appointment FOREIGN KEY (appointment_id) REFERENCES appointments (id) ON DELETE CASCADE,
    CONSTRAINT fk_notes_therapist FOREIGN KEY (therapist_id) REFERENCES therapists (id) ON DELETE CASCADE
);

-- =====================================================
-- CONTACT MESSAGES
-- =====================================================

CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL,
    subject VARCHAR(200),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- DEFAULT SPECIALTIES
-- =====================================================

INSERT INTO specialties (name, description) VALUES
('Anxiety & Stress', 'Support for anxiety disorders, chronic stress, and panic'),
('Depression', 'Support for depressive disorders and mood concerns'),
('Couples Therapy', 'Relationship counseling for couples'),
('Child Psychology', 'Mental health support for children and adolescents'),
('Trauma & PTSD', 'Trauma-informed care and PTSD treatment'),
('Addiction Counseling', 'Support for substance use and behavioral addictions'),
('Family Therapy', 'Whole-family counseling and mediation'),
('Grief Counseling', 'Support through loss and bereavement');