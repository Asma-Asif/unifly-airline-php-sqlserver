# ✈️ Unifly Airline Booking System

A full-stack airline booking and management system built with **PHP**, **Microsoft SQL Server**, and vanilla **JavaScript**. Unifly covers the complete passenger journey — from flight search to digital boarding pass — plus a full admin panel for managing flights, bookings, passengers, and complaints.

## Features

- 🔍 **Flight Search** — search by origin, destination, date, and class
- 🎫 **Booking Flow** — meal preference, extra baggage, and pricing breakdown
- 💺 **Interactive Seat Map** — 30-row cabin layout with Business/Economy zones and real-time seat availability
- 💳 **Multiple Payment Methods** — Credit/Debit Card, JazzCash, Easypaisa
- 🪪 **Digital Boarding Pass** — auto-generated with passenger details, seat, gate, and barcode
- ⭐ **UniflyMiles Loyalty Program** — tiered rewards (Bronze → Platinum) with point redemption
- 📋 **Complaint Management** — ticket-based submission and tracking
- 🛠️ **Admin Panel** — manage flights, bookings, passengers, and complaints from a 5-tab dashboard
- 🔐 **Secure Authentication** — bcrypt password hashing, PHP sessions, separate passenger/admin login

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | PHP 8.x (REST API) |
| Database | Microsoft SQL Server |
| Server | Apache (via XAMPP) |

## Database

12 normalized tables (3NF): `Passengers`, `Staff`, `Airports`, `Aircraft`, `Flights`, `SeatMap`, `Bookings`, `Payments`, `BoardingPasses`, `LoyaltyPoints`, `Complaints`, `FlightCrew`.

## Setup

1. Clone this repo into your XAMPP `htdocs` folder:
   ```bash
   git clone https://github.com/your-username/unifly-airline-booking-system.git unifly
   ```
2. Start **Apache** in XAMPP.
3. Create the `UniflyAirline` database in SQL Server (SSMS) and run the schema/seed scripts from `/database`.
4. Update `config/db.php` with your SQL Server instance name if needed.
5. Open in your browser:
   ```
   http://localhost/unifly/index.html
   ```

## Project Structure

```
unifly/
├── api/          → PHP REST endpoints (auth, flights, booking, payment, loyalty, complaint, admin)
├── config/       → Database connection
├── includes/     → Shared helper functions
├── css/          → Stylesheet
├── js/           → Frontend logic per page
└── *.html        → 18 pages (homepage, booking flow, dashboard, admin panel, etc.)
```

## License

This project was developed for academic purposes as part of a Database-Focused System Development course.
