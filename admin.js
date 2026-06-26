/* ── RESET & VARIABLES ── */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --green:  #006400;
    --gold:   #C8A951;
    --dark:   #0a0a0a;
    --white:  #ffffff;
    --grey:   #f5f5f5;
    --text:   #333333;
}

body {
    font-family: 'Segoe UI', sans-serif;
    color: var(--text);
    background: var(--white);
}

a { text-decoration: none; color: inherit; }
ul { list-style: none; }

/* ── ANNOUNCEMENT BAR ── */
.announcement-bar {
    background: var(--green);
    color: var(--white);
    text-align: center;
    padding: 10px 20px;
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
}
.announcement-bar a { color: var(--gold); font-weight: 600; text-decoration: underline; }
.announcement-bar button { background: none; border: none; color: var(--white); cursor: pointer; font-size: 16px; margin-left: 20px; }

/* ── NAVBAR ── */
.navbar { background: var(--dark); padding: 15px 0; position: sticky; top: 0; z-index: 100; }
.nav-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; align-items: center; justify-content: space-between; }
.logo-text { font-size: 28px; font-weight: 700; color: var(--white); }
.logo-sub { font-size: 14px; color: var(--gold); margin-left: 4px; }
.nav-links { display: flex; gap: 30px; }
.nav-links a { color: var(--white); font-size: 15px; transition: color 0.3s; }
.nav-links a:hover { color: var(--gold); }
.nav-buttons { display: flex; gap: 10px; }
.btn-login { padding: 8px 20px; border: 1px solid var(--white); color: var(--white); border-radius: 5px; font-size: 14px; transition: all 0.3s; }
.btn-login:hover { background: var(--white); color: var(--dark); }
.btn-register { padding: 8px 20px; background: var(--green); color: var(--white); border-radius: 5px; font-size: 14px; transition: all 0.3s; }
.btn-register:hover { background: var(--gold); }

/* ── DROPDOWN ── */
.dropdown { position: relative; }
.dropdown-menu { display: none; position: absolute; top: 100%; left: 0; background: var(--dark); min-width: 180px; border-radius: 5px; padding: 10px 0; z-index: 200; box-shadow: 0 5px 20px rgba(0,0,0,0.3); }
.dropdown-menu li { list-style: none; }
.dropdown-menu li a { display: block; padding: 10px 20px; color: var(--white); font-size: 14px; transition: background 0.2s; }
.dropdown-menu li a:hover { background: var(--green); }
.dropdown:hover .dropdown-menu { display: block; }

/* ── HERO ── */
.hero {
    background: linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)),
                url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80&auto=format') center/cover no-repeat;
    height: 580px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}
.hero-content h1 { font-size: 62px; font-weight: 800; color: var(--white); line-height: 1.15; margin-bottom: 18px; }
.hero-content p { font-size: 19px; color: var(--white); opacity: 0.9; }

/* ── SEARCH BOX ── */
.search-section { background: var(--grey); padding: 50px 20px; }
.search-box { max-width: 1000px; margin: 0 auto; background: var(--white); padding: 40px; border-radius: 12px; box-shadow: 0 5px 25px rgba(0,0,0,0.1); }
.search-tabs { display: flex; gap: 5px; margin-bottom: 20px; }
.search-tab { padding: 8px 20px; border: 1px solid #ddd; border-radius: 5px; background: var(--white); cursor: pointer; font-size: 14px; transition: all 0.3s; }
.search-tab.active { background: var(--green); color: var(--white); border-color: var(--green); }
.search-row { display: flex; gap: 15px; flex-wrap: wrap; margin-bottom: 25px; }
.search-field { flex: 1; min-width: 150px; display: flex; flex-direction: column; gap: 8px; }
.search-field label { font-size: 13px; font-weight: 600; color: var(--text); }
.search-field input, .search-field select { padding: 12px 15px; border: 1px solid #ddd; border-radius: 5px; font-size: 15px; outline: none; transition: border 0.3s; }
.search-field input:focus, .search-field select:focus { border-color: var(--green); }
.btn-search { width: 100%; padding: 15px; background: var(--green); color: var(--white); border: none; border-radius: 5px; font-size: 18px; font-weight: 600; cursor: pointer; transition: background 0.3s; }
.btn-search:hover { background: var(--gold); }

/* ── SERVICES ── */
.services-section { padding: 70px 20px; background: var(--white); }
.services-container { max-width: 1200px; margin: 0 auto; text-align: center; }
.services-container h2 { font-size: 34px; color: var(--dark); margin-bottom: 10px; }
.section-sub { color: #888; font-size: 15px; margin-bottom: 45px; }
.services-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.service-card { background: var(--grey); border-radius: 12px; padding: 35px 20px; text-align: center; transition: transform 0.3s; }
.service-card:hover { transform: translateY(-6px); box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
.service-icon { font-size: 42px; margin-bottom: 16px; }
.service-card h3 { font-size: 17px; color: var(--dark); margin-bottom: 10px; }
.service-card p { font-size: 13px; color: #888; margin-bottom: 16px; line-height: 1.7; }
.service-card a { color: var(--green); font-size: 13px; font-weight: 600; text-decoration: underline; }

/* ── NEWS ── */
.news-section { padding: 70px 20px; background: var(--grey); }
.news-container { max-width: 1200px; margin: 0 auto; }
.news-container h2 { font-size: 34px; color: var(--dark); margin-bottom: 30px; }
.news-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.news-card { background: var(--white); border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); transition: transform 0.3s; }
.news-card:hover { transform: translateY(-5px); }
.news-img { height: 200px; }
.news-body { padding: 22px; }
.news-body h3 { font-size: 16px; color: var(--dark); margin-bottom: 10px; }
.news-body p { font-size: 13px; color: #888; line-height: 1.7; margin-bottom: 15px; }
.news-link { color: var(--green); font-size: 13px; font-weight: 600; text-decoration: underline; }

/* ── NEWSLETTER ── */
.newsletter-section { padding: 70px 20px; background: var(--white); }
.newsletter-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
.newsletter-left { background: linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80') center/cover; border-radius: 12px; padding: 45px; color: var(--white); }
.newsletter-left h2 { font-size: 24px; margin-bottom: 20px; }
.newsletter-form { display: flex; flex-direction: column; gap: 10px; }
.newsletter-form input, .newsletter-form select { padding: 12px 15px; border-radius: 5px; border: none; font-size: 14px; outline: none; }
.newsletter-form button { padding: 12px; background: var(--green); color: var(--white); border: none; border-radius: 5px; font-size: 15px; font-weight: 600; cursor: pointer; }
.newsletter-form button:hover { background: var(--gold); }
.newsletter-right { background: var(--green); border-radius: 12px; padding: 45px; color: var(--white); }
.newsletter-right h2 { font-size: 24px; margin-bottom: 10px; }
.newsletter-right p { font-size: 14px; opacity: 0.9; margin-bottom: 25px; }
.app-buttons { display: flex; flex-direction: column; gap: 10px; }
.app-btn { display: block; padding: 12px 20px; background: var(--dark); color: var(--white); border-radius: 8px; font-size: 14px; font-weight: 600; text-align: center; transition: background 0.3s; }
.app-btn:hover { background: var(--gold); }

/* ── WAVE ── */
.wave-divider { line-height: 0; overflow: hidden; }
.wave-divider svg { width: 100%; height: 80px; display: block; }

/* ── FOOTER ── */
.footer { background: var(--dark); color: var(--white); padding: 50px 20px 0; }
.footer-container { max-width: 1200px; margin: 0 auto; display: flex; gap: 40px; flex-wrap: wrap; justify-content: space-between; padding-bottom: 40px; }
.footer-logo { margin-bottom: 10px; }
.footer-col h3 { font-size: 18px; color: var(--gold); margin-bottom: 15px; }
.footer-col p { font-size: 14px; opacity: 0.8; line-height: 1.8; }
.footer-col ul li { margin-bottom: 8px; }
.footer-col ul li a { font-size: 14px; opacity: 0.8; transition: opacity 0.3s; }
.footer-col ul li a:hover { opacity: 1; color: var(--gold); }
.footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); text-align: center; padding: 20px; font-size: 13px; opacity: 0.6; }

/* ── AUTH ── */
.auth-section { min-height: 80vh; background: var(--grey); display: flex; align-items: center; justify-content: center; padding: 40px 20px; }
.auth-box { background: var(--white); padding: 50px 40px; border-radius: 12px; box-shadow: 0 5px 25px rgba(0,0,0,0.1); width: 100%; max-width: 450px; }
.auth-box h2 { font-size: 28px; color: var(--dark); margin-bottom: 8px; text-align: center; }
.auth-sub { text-align: center; color: #888; font-size: 14px; margin-bottom: 30px; }
.auth-field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
.auth-field label { font-size: 13px; font-weight: 600; color: var(--text); }
.auth-field input, .auth-field select, .auth-field textarea { padding: 12px 15px; border: 1px solid #ddd; border-radius: 5px; font-size: 15px; outline: none; transition: border 0.3s; width: 100%; font-family: 'Segoe UI', sans-serif; box-sizing: border-box; }
.auth-field input:focus, .auth-field select:focus, .auth-field textarea:focus { border-color: var(--green); }
.auth-field textarea { resize: vertical; }
.btn-auth { width: 100%; padding: 14px; background: var(--green); color: var(--white); border: none; border-radius: 5px; font-size: 17px; font-weight: 600; cursor: pointer; transition: background 0.3s; margin-bottom: 20px; }
.btn-auth:hover { background: var(--gold); }
.auth-switch { text-align: center; font-size: 14px; color: #888; }
.auth-switch a { color: var(--green); font-weight: 600; }

/* ── FLIGHTS ── */
.results-section { background: var(--grey); min-height: 50vh; padding: 40px 20px; }
.results-container { max-width: 900px; margin: 0 auto; }
.results-count { font-size: 16px; color: var(--text); margin-bottom: 20px; font-weight: 600; }
.loading { text-align: center; color: #888; font-size: 16px; padding: 40px; }
.no-results { text-align: center; color: #888; font-size: 16px; padding: 40px; }
.flight-card { background: var(--white); border-radius: 10px; padding: 25px; margin-bottom: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); transition: transform 0.2s; }
.flight-card:hover { transform: translateY(-2px); }
.flight-route { display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; }
.flight-city { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.city-code { font-size: 28px; font-weight: 700; color: var(--dark); }
.city-name { font-size: 13px; color: #888; }
.flight-time { font-size: 16px; font-weight: 600; color: var(--green); }
.flight-middle { display: flex; flex-direction: column; align-items: center; gap: 5px; flex: 1; padding: 0 20px; }
.duration { font-size: 13px; color: #888; }
.flight-line { font-size: 24px; color: var(--gold); }
.flight-num { font-size: 12px; color: #888; }
.flight-info { display: flex; gap: 20px; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
.aircraft, .seats { font-size: 13px; color: #888; background: var(--grey); padding: 4px 10px; border-radius: 20px; }
.flight-footer { display: flex; align-items: center; justify-content: space-between; }
.flight-price { display: flex; align-items: baseline; gap: 5px; }
.price-label { font-size: 14px; color: #888; }
.price-amount { font-size: 28px; font-weight: 700; color: var(--green); }
.btn-book { padding: 12px 30px; background: var(--green); color: var(--white); border: none; border-radius: 5px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background 0.3s; }
.btn-book:hover { background: var(--gold); }

/* ── BOOKING ── */
.booking-section { background: var(--grey); min-height: 80vh; padding: 40px 20px; }
.booking-container { max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.booking-card { background: var(--white); border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
.booking-card h2 { font-size: 20px; color: var(--dark); margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid var(--grey); }
.summary-route { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.summary-city { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.summary-middle { font-size: 24px; color: var(--gold); }
.summary-details p { font-size: 14px; color: var(--text); margin-bottom: 8px; }
.price-summary { background: var(--grey); border-radius: 8px; padding: 15px; margin: 20px 0; }
.price-row { display: flex; justify-content: space-between; font-size: 14px; color: var(--text); padding: 6px 0; }
.price-row.total { border-top: 1px solid #ddd; margin-top: 8px; padding-top: 10px; font-size: 18px; font-weight: 700; color: var(--green); }

/* ── DASHBOARD ── */
.dashboard-section { background: var(--grey); min-height: 80vh; padding: 40px 20px; }
.dashboard-container { max-width: 1000px; margin: 0 auto; }
.dash-welcome { margin-bottom: 30px; }
.dash-welcome h1 { font-size: 28px; color: var(--dark); margin-bottom: 5px; }
.dash-welcome p { color: #888; font-size: 15px; }
.dash-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
.stat-card { background: var(--white); border-radius: 10px; padding: 20px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.08); display: flex; flex-direction: column; gap: 8px; }
.stat-number { font-size: 32px; font-weight: 700; color: var(--green); }
.stat-label { font-size: 13px; color: #888; }
.dash-card { background: var(--white); border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); margin-bottom: 20px; }
.dash-card h2 { font-size: 20px; color: var(--dark); margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid var(--grey); }
.booking-item { display: flex; align-items: center; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #eee; }
.booking-item:last-child { border-bottom: none; }
.booking-route { display: flex; align-items: center; font-size: 22px; font-weight: 700; }
.booking-info p { font-size: 13px; color: #888; margin-bottom: 3px; }
.booking-info p strong { color: var(--dark); }
.booking-status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 5px; }
.booking-status.confirmed { background: #EAF3DE; color: #27500A; }
.booking-status.cancelled { background: #FCEBEB; color: #791F1F; }
.booking-status.completed { background: #E1F5EE; color: #085041; }
.booking-price { font-size: 16px; font-weight: 700; color: var(--green); margin-bottom: 5px; }
.btn-cancel { padding: 6px 15px; background: #FCEBEB; color: #791F1F; border: none; border-radius: 5px; font-size: 12px; cursor: pointer; transition: all 0.3s; }
.btn-cancel:hover { background: #791F1F; color: white; }
.btn-boarding { display: block; width: 100%; padding: 8px 12px; background: #1b6ca8; color: #fff; border: none; border-radius: 8px; font-size: 0.82rem; font-weight: 700; cursor: pointer; margin-bottom: 6px; transition: background 0.2s; }
.btn-boarding:hover { background: #155a8a; }

/* ── ADMIN ── */
.admin-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.admin-table th { background: var(--dark); color: var(--white); padding: 12px 15px; text-align: left; font-weight: 600; }
.admin-table td { padding: 12px 15px; border-bottom: 1px solid #eee; color: var(--text); }
.admin-table tr:hover { background: var(--grey); }

/* ── CONTACT ── */
.contact-section { background: var(--grey); min-height: 80vh; padding: 40px 20px; }
.contact-container { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
.contact-info { background: var(--white); border-radius: 10px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
.contact-info h2 { font-size: 24px; color: var(--dark); margin-bottom: 10px; }
.contact-info > p { color: #888; font-size: 14px; margin-bottom: 30px; }
.contact-item { display: flex; align-items: flex-start; gap: 15px; margin-bottom: 25px; }
.contact-icon { font-size: 24px; }
.contact-item strong { display: block; font-size: 14px; color: var(--dark); margin-bottom: 4px; }
.contact-item p { font-size: 14px; color: #888; }
.contact-form { background: var(--white); border-radius: 10px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
.contact-form h2 { font-size: 24px; color: var(--dark); margin-bottom: 10px; }
.track-section { margin-top: 30px; padding-top: 20px; border-top: 2px solid var(--grey); }
.track-section h3 { font-size: 16px; color: var(--dark); margin-bottom: 15px; }
.track-row { display: flex; gap: 10px; margin-bottom: 15px; }
.track-row input { flex: 1; padding: 10px 15px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px; outline: none; }
.track-row button { padding: 10px 20px; background: var(--green); color: var(--white); border: none; border-radius: 5px; font-size: 14px; cursor: pointer; }
.track-row button:hover { background: var(--gold); }
.track-card { background: var(--grey); border-radius: 8px; padding: 15px; }
.track-row-info { font-size: 13px; color: var(--text); padding: 5px 0; border-bottom: 1px solid #ddd; }
.track-row-info:last-child { border-bottom: none; }