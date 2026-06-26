USE UniflyAirline;

-- ============================================================
--   UNIFLY AIRLINE - SQL Server Database Schema
--   Inspired by PIA | Built Better
--   Run this entire script in SSMS
-- ============================================================

USE master;
GO

-- Create the database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'UniflyAirline')
    CREATE DATABASE UniflyAirline;
GO

USE UniflyAirline;
GO

-- ============================================================
-- 1. AIRPORTS
-- ============================================================
CREATE TABLE Airports (
    airport_id      INT IDENTITY(1,1) PRIMARY KEY,
    airport_code    NVARCHAR(10)  NOT NULL UNIQUE,   -- e.g. KHI, LHE
    airport_name    NVARCHAR(150) NOT NULL,
    city            NVARCHAR(100) NOT NULL,
    country         NVARCHAR(100) NOT NULL,
    timezone        NVARCHAR(60)  NOT NULL DEFAULT 'Asia/Karachi',
    is_active       BIT           NOT NULL DEFAULT 1
);
GO

-- ============================================================
-- 2. AIRCRAFT
-- ============================================================
CREATE TABLE Aircraft (
    aircraft_id     INT IDENTITY(1,1) PRIMARY KEY,
    registration    NVARCHAR(20)  NOT NULL UNIQUE,   -- e.g. AP-BHO
    model           NVARCHAR(100) NOT NULL,           -- e.g. Boeing 777-ER
    total_seats     INT           NOT NULL,
    economy_seats   INT           NOT NULL,
    business_seats  INT           NOT NULL,
    first_seats     INT           NOT NULL DEFAULT 0,
    status          NVARCHAR(20)  NOT NULL DEFAULT 'Active'
                    CHECK (status IN ('Active','Maintenance','Retired'))
);
GO

-- ============================================================
-- 3. FLIGHTS
-- ============================================================
CREATE TABLE Flights (
    flight_id           INT IDENTITY(1,1) PRIMARY KEY,
    flight_number       NVARCHAR(10)   NOT NULL,          -- e.g. UF-101
    aircraft_id         INT            NOT NULL REFERENCES Aircraft(aircraft_id),
    origin_id           INT            NOT NULL REFERENCES Airports(airport_id),
    destination_id      INT            NOT NULL REFERENCES Airports(airport_id),
    departure_time      DATETIME       NOT NULL,
    arrival_time        DATETIME       NOT NULL,
    economy_price       DECIMAL(10,2)  NOT NULL,
    business_price      DECIMAL(10,2)  NOT NULL,
    first_price         DECIMAL(10,2)  NOT NULL DEFAULT 0,
    available_economy   INT            NOT NULL,
    available_business  INT            NOT NULL,
    status              NVARCHAR(20)   NOT NULL DEFAULT 'Scheduled'
                        CHECK (status IN ('Scheduled','Delayed','Cancelled','Completed','Boarding')),
    CHECK (origin_id <> destination_id)
);
GO

-- ============================================================
-- 4. PASSENGERS (Registered users)
-- ============================================================
CREATE TABLE Passengers (
    passenger_id    INT IDENTITY(1,1) PRIMARY KEY,
    first_name      NVARCHAR(100) NOT NULL,
    last_name       NVARCHAR(100) NOT NULL,
    email           NVARCHAR(200) NOT NULL UNIQUE,
    phone           NVARCHAR(20)  NOT NULL,
    password_hash   NVARCHAR(255) NOT NULL,
    passport_number NVARCHAR(30)  NULL,
    cnic            NVARCHAR(20)  NULL,
    date_of_birth   DATE          NULL,
    nationality     NVARCHAR(100) NULL DEFAULT 'Pakistani',
    gender          NVARCHAR(10)  NULL CHECK (gender IN ('Male','Female','Other')),
    is_active       BIT           NOT NULL DEFAULT 1,
    created_at      DATETIME      NOT NULL DEFAULT GETDATE()
);
GO

-- ============================================================
-- 5. BOOKINGS
-- ============================================================
CREATE TABLE Bookings (
    booking_id          INT IDENTITY(1,1) PRIMARY KEY,
    booking_reference   NVARCHAR(10)   NOT NULL UNIQUE,   -- e.g. UF-A1B2C3
    passenger_id        INT            NOT NULL REFERENCES Passengers(passenger_id),
    flight_id           INT            NOT NULL REFERENCES Flights(flight_id),
    seat_number         NVARCHAR(10)   NULL,
    class               NVARCHAR(15)   NOT NULL DEFAULT 'Economy'
                        CHECK (class IN ('Economy','Business','First')),
    meal_preference     NVARCHAR(50)   NULL,              -- Veg / Non-Veg / Halal
    extra_baggage_kg    INT            NOT NULL DEFAULT 0,
    total_price         DECIMAL(10,2)  NOT NULL,
    status              NVARCHAR(20)   NOT NULL DEFAULT 'Confirmed'
                        CHECK (status IN ('Confirmed','Cancelled','Completed','Pending')),
    booked_at           DATETIME       NOT NULL DEFAULT GETDATE(),
    cancelled_at        DATETIME       NULL
);
GO

-- ============================================================
-- 6. PAYMENTS
-- ============================================================
CREATE TABLE Payments (
    payment_id      INT IDENTITY(1,1) PRIMARY KEY,
    booking_id      INT            NOT NULL REFERENCES Bookings(booking_id),
    amount          DECIMAL(10,2)  NOT NULL,
    method          NVARCHAR(30)   NOT NULL
                    CHECK (method IN ('Card','EasyPaisa','JazzCash','Bank Transfer','Cash')),
    transaction_id  NVARCHAR(100)  NULL UNIQUE,
    status          NVARCHAR(20)   NOT NULL DEFAULT 'Pending'
                    CHECK (status IN ('Pending','Completed','Failed','Refunded')),
    paid_at         DATETIME       NULL
);
GO

-- ============================================================
-- 7. BOARDING PASSES  (Unifly exclusive — PIA is app-only)
-- ============================================================
CREATE TABLE BoardingPasses (
    pass_id         INT IDENTITY(1,1) PRIMARY KEY,
    booking_id      INT            NOT NULL REFERENCES Bookings(booking_id),
    barcode         NVARCHAR(100)  NOT NULL UNIQUE,
    gate            NVARCHAR(10)   NULL,
    boarding_time   DATETIME       NULL,
    issued_at       DATETIME       NOT NULL DEFAULT GETDATE(),
    is_used         BIT            NOT NULL DEFAULT 0
);
GO

-- ============================================================
-- 8. LOYALTY POINTS  (Unifly exclusive — UnifyMiles program)
-- ============================================================
CREATE TABLE LoyaltyPoints (
    loyalty_id      INT IDENTITY(1,1) PRIMARY KEY,
    passenger_id    INT            NOT NULL REFERENCES Passengers(passenger_id),
    booking_id      INT            NULL REFERENCES Bookings(booking_id),
    points          INT            NOT NULL,
    transaction_type NVARCHAR(10)  NOT NULL CHECK (transaction_type IN ('Earn','Redeem')),
    description     NVARCHAR(200)  NULL,
    created_at      DATETIME       NOT NULL DEFAULT GETDATE()
);
GO

-- ============================================================
-- 9. COMPLAINTS  (Unifly exclusive — tracked ticket system)
-- ============================================================
CREATE TABLE Complaints (
    complaint_id    INT IDENTITY(1,1) PRIMARY KEY,
    ticket_number   NVARCHAR(15)   NOT NULL UNIQUE,       -- e.g. UF-TKT-00123
    passenger_id    INT            NOT NULL REFERENCES Passengers(passenger_id),
    booking_id      INT            NULL REFERENCES Bookings(booking_id),
    category        NVARCHAR(50)   NOT NULL
                    CHECK (category IN ('Delay','Baggage','Refund','Staff','Website','Other')),
    subject         NVARCHAR(200)  NOT NULL,
    description     NVARCHAR(MAX)  NOT NULL,
    status          NVARCHAR(20)   NOT NULL DEFAULT 'Open'
                    CHECK (status IN ('Open','In Progress','Resolved','Closed')),
    submitted_at    DATETIME       NOT NULL DEFAULT GETDATE(),
    resolved_at     DATETIME       NULL
);
GO

-- ============================================================
-- 10. STAFF
-- ============================================================
CREATE TABLE Staff (
    staff_id        INT IDENTITY(1,1) PRIMARY KEY,
    first_name      NVARCHAR(100) NOT NULL,
    last_name       NVARCHAR(100) NOT NULL,
    email           NVARCHAR(200) NOT NULL UNIQUE,
    phone           NVARCHAR(20)  NULL,
    role            NVARCHAR(50)  NOT NULL
                    CHECK (role IN ('Pilot','Co-Pilot','Cabin Crew','Ground Staff','Admin','Engineer')),
    employee_code   NVARCHAR(20)  NOT NULL UNIQUE,
    password_hash   NVARCHAR(255) NOT NULL,
    is_active       BIT           NOT NULL DEFAULT 1,
    joined_at       DATE          NOT NULL DEFAULT GETDATE()
);
GO

-- ============================================================
-- 11. FLIGHT CREW (which staff on which flight)
-- ============================================================
CREATE TABLE FlightCrew (
    crew_id         INT IDENTITY(1,1) PRIMARY KEY,
    flight_id       INT            NOT NULL REFERENCES Flights(flight_id),
    staff_id        INT            NOT NULL REFERENCES Staff(staff_id),
    role            NVARCHAR(50)   NOT NULL,
    UNIQUE (flight_id, staff_id)
);
GO

-- ============================================================
-- 12. SEAT MAP  (Unifly exclusive — interactive seat selection)
-- ============================================================
CREATE TABLE SeatMap (
    seat_id         INT IDENTITY(1,1) PRIMARY KEY,
    flight_id       INT            NOT NULL REFERENCES Flights(flight_id),
    seat_number     NVARCHAR(10)   NOT NULL,
    class           NVARCHAR(15)   NOT NULL CHECK (class IN ('Economy','Business','First')),
    is_available    BIT            NOT NULL DEFAULT 1,
    is_window       BIT            NOT NULL DEFAULT 0,
    is_aisle        BIT            NOT NULL DEFAULT 0,
    UNIQUE (flight_id, seat_number)
);
GO

-- ============================================================
-- SAMPLE DATA
-- ============================================================

-- Airports (Pakistan + International)
INSERT INTO Airports (airport_code, airport_name, city, country) VALUES
('KHI', 'Jinnah International Airport',       'Karachi',   'Pakistan'),
('LHE', 'Allama Iqbal International Airport', 'Lahore',    'Pakistan'),
('ISB', 'Islamabad International Airport',    'Islamabad', 'Pakistan'),
('SKT', 'Sialkot International Airport',      'Sialkot',   'Pakistan'),
('PEW', 'Bacha Khan International Airport',   'Peshawar',  'Pakistan'),
('SKZ', 'Sukkur Airport',                     'Sukkur',    'Pakistan'),
('DXB', 'Dubai International Airport',        'Dubai',     'UAE'),
('LHR', 'London Heathrow Airport',            'London',    'UK'),
('JFK', 'John F. Kennedy International',      'New York',  'USA'),
('KUL', 'Kuala Lumpur International',         'Kuala Lumpur', 'Malaysia');
GO

-- Aircraft
INSERT INTO Aircraft (registration, model, total_seats, economy_seats, business_seats, first_seats, status) VALUES
('AP-UF1', 'Boeing 777-300ER',  396, 336, 52, 8,  'Active'),
('AP-UF2', 'Airbus A320neo',    180, 150, 30, 0,  'Active'),
('AP-UF3', 'Boeing 737-800',    162, 138, 24, 0,  'Active'),
('AP-UF4', 'Airbus A330-300',   280, 236, 44, 0,  'Active'),
('AP-UF5', 'ATR 72-600',         70,  70,  0, 0,  'Active');
GO

-- Staff (Admin + Pilots + Crew)
INSERT INTO Staff (first_name, last_name, email, phone, role, employee_code, password_hash) VALUES
('Ahmed',   'Khan',    'ahmed.khan@unifly.pk',    '0300-1111111', 'Admin',      'UF-ADM-001', 'hashed_password'),
('Sara',    'Malik',   'sara.malik@unifly.pk',    '0300-2222222', 'Pilot',      'UF-PLT-001', 'hashed_password'),
('Bilal',   'Ahmed',   'bilal.ahmed@unifly.pk',   '0300-3333333', 'Co-Pilot',   'UF-PLT-002', 'hashed_password'),
('Ayesha',  'Siddiqui','ayesha.s@unifly.pk',      '0300-4444444', 'Cabin Crew', 'UF-CRW-001', 'hashed_password'),
('Usman',   'Ali',     'usman.ali@unifly.pk',     '0300-5555555', 'Cabin Crew', 'UF-CRW-002', 'hashed_password'),
('Zara',    'Hassan',  'zara.hassan@unifly.pk',   '0300-6666666', 'Ground Staff','UF-GRD-001', 'hashed_password');
GO

-- Flights
INSERT INTO Flights (flight_number, aircraft_id, origin_id, destination_id, departure_time, arrival_time, economy_price, business_price, first_price, available_economy, available_business, status) VALUES
('UF-101', 2, 2, 1, '2026-05-10 08:00', '2026-05-10 10:00', 8500,  22000, 0,     148, 30, 'Scheduled'),
('UF-102', 2, 1, 2, '2026-05-10 13:00', '2026-05-10 15:00', 8500,  22000, 0,     150, 30, 'Scheduled'),
('UF-201', 3, 3, 1, '2026-05-10 09:00', '2026-05-10 11:30', 9500,  25000, 0,     136, 24, 'Scheduled'),
('UF-301', 1, 1, 7, '2026-05-11 02:00', '2026-05-11 04:30', 35000, 95000, 180000, 330, 50, 'Scheduled'),
('UF-302', 4, 3, 8, '2026-05-12 23:00', '2026-05-13 06:00', 75000, 180000, 0,    234, 42, 'Scheduled'),
('UF-401', 2, 4, 2, '2026-05-10 07:00', '2026-05-10 08:00', 6000,  16000, 0,     148, 30, 'Scheduled'),
('UF-501', 5, 6, 1, '2026-05-10 11:00', '2026-05-10 12:30', 4500,  0,     0,      70,  0, 'Scheduled');
GO

-- Sample Passengers
INSERT INTO Passengers (first_name, last_name, email, phone, password_hash, passport_number, nationality) VALUES
('Ali',     'Raza',    'ali.raza@gmail.com',    '0321-1234567', 'hashed_pw', 'AA1234567', 'Pakistani'),
('Hina',    'Baig',    'hina.baig@gmail.com',   '0331-7654321', 'hashed_pw', 'BB7654321', 'Pakistani'),
('Omar',    'Sheikh',  'omar.sheikh@gmail.com', '0311-9876543', 'hashed_pw', 'CC9876543', 'Pakistani');
GO

-- Sample Bookings
INSERT INTO Bookings (booking_reference, passenger_id, flight_id, seat_number, class, meal_preference, total_price, status) VALUES
('UF-A1B2C3', 1, 1, '14A', 'Economy',  'Halal',   8500,  'Confirmed'),
('UF-D4E5F6', 2, 4, '3A',  'Business', 'Non-Veg', 95000, 'Confirmed'),
('UF-G7H8I9', 3, 2, '22C', 'Economy',  'Veg',     8500,  'Confirmed');
GO

-- Sample Payments
INSERT INTO Payments (booking_id, amount, method, transaction_id, status, paid_at) VALUES
(1, 8500,  'JazzCash',      'TXN-JC-001', 'Completed', GETDATE()),
(2, 95000, 'Card',          'TXN-CD-002', 'Completed', GETDATE()),
(3, 8500,  'EasyPaisa',     'TXN-EP-003', 'Completed', GETDATE());
GO

-- Sample Loyalty Points
INSERT INTO LoyaltyPoints (passenger_id, booking_id, points, transaction_type, description) VALUES
(1, 1, 850,  'Earn', 'Points earned on booking UF-A1B2C3'),
(2, 2, 9500, 'Earn', 'Points earned on booking UF-D4E5F6'),
(3, 3, 850,  'Earn', 'Points earned on booking UF-G7H8I9');
GO

-- Sample Complaint
INSERT INTO Complaints (ticket_number, passenger_id, booking_id, category, subject, description, status) VALUES
('UF-TKT-00001', 1, 1, 'Delay', 'Flight delayed without notice', 'My flight UF-101 was delayed by 2 hours and I received no prior notification.', 'Open');
GO

PRINT '✅ Unifly Airline database created successfully!';
PRINT '   Tables: Airports, Aircraft, Flights, Passengers, Bookings,';
PRINT '           Payments, BoardingPasses, LoyaltyPoints, Complaints,';
PRINT '           Staff, FlightCrew, SeatMap';
PRINT '   Sample data inserted for all core tables.';
GO

-- Insert Airports
INSERT INTO Airports (airport_code, airport_name, city, country) VALUES
('LHE', 'Allama Iqbal International', 'Lahore', 'Pakistan'),
('KHI', 'Jinnah International', 'Karachi', 'Pakistan'),
('ISB', 'Benazir Bhutto International', 'Islamabad', 'Pakistan'),
('PEW', 'Bacha Khan International', 'Peshawar', 'Pakistan');

-- Insert Aircraft
INSERT INTO Aircraft (registration, model, total_seats, economy_seats, business_seats) VALUES
('AP-BHO', 'Boeing 737', 150, 126, 24),
('AP-ATR', 'ATR 72', 70, 60, 10);

-- Insert Flights
INSERT INTO Flights 
(flight_number, aircraft_id, origin_id, destination_id,
 departure_time, arrival_time, economy_price, business_price,
 available_economy, available_business, status) VALUES
('UF-101', 1, 1, 2, '2026-05-20 08:00', '2026-05-20 10:00', 12000, 28000, 100, 20, 'Scheduled'),
('UF-102', 1, 2, 1, '2026-05-20 12:00', '2026-05-20 14:00', 12000, 28000, 100, 20, 'Scheduled'),
('UF-103', 1, 1, 3, '2026-05-20 09:00', '2026-05-20 10:10', 8000,  20000, 100, 20, 'Scheduled'),
('UF-104', 2, 3, 2, '2026-05-20 15:00', '2026-05-20 16:30', 9000,  22000, 50,  10, 'Scheduled');

SELECT COLUMN_NAME, DATA_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'SeatMap'
ORDER BY ORDINAL_POSITION;

USE UniflyAirline;
SELECT * FROM Airports;

SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Airports'
ORDER BY ORDINAL_POSITION

SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Aircraft' ORDER BY ORDINAL_POSITION
SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Flights' ORDER BY ORDINAL_POSITION

SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Flights' 
ORDER BY ORDINAL_POSITION

SELECT * FROM Airports;
SELECT * FROM Flights;
SELECT * FROM Passengers;

SELECT first_name, last_name, email FROM Passengers

UPDATE Passengers 
SET password_hash = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE email = 'your_email_here'

USE master;
GO
CREATE DATABASE UniflyAirline;