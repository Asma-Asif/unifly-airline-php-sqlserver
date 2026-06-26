// ── BOARDING PASS PAGE ──
window.onload = function () {
    const p = new URLSearchParams(window.location.search);
    const booking_ref = p.get('booking_ref') || '';
    const seat        = p.get('seat')        || '';

    if (!booking_ref) {
        document.getElementById('boarding-pass-container').innerHTML =
            '<p style="color:red;text-align:center;">No booking reference. <a href="dashboard.html">Go to dashboard</a></p>';
        return;
    }
    loadBoardingPass(booking_ref, seat);
};

function loadBoardingPass(booking_ref, seat) {
    fetch(`${API}/booking.php?action=detail&ref=${booking_ref}`, { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
        if (!data.success) {
            document.getElementById('boarding-pass-container').innerHTML =
                '<p style="color:red;text-align:center;">Could not load boarding pass.</p>';
            return;
        }
        renderBoardingPass(data.data, seat);
    })
    .catch(() => {
        document.getElementById('boarding-pass-container').innerHTML =
            '<p style="color:red;text-align:center;">Connection error.</p>';
    });
}

function renderBoardingPass(b, seat) {
    const seatNumber  = seat || b.seat_number || '—';
    const seatCol     = seatNumber.slice(-1);
    const seatType    = getSeatType(seatCol, b.class);
    const boardingTime = b.departure_time ? subtractMinutes(b.departure_time, 45) : '—';

    document.getElementById('boarding-pass-container').innerHTML = `
        <div class="bp-card">
            <div class="bp-top">
                <div><div class="bp-airline">Unifly <span>Airline</span></div></div>
                <div class="bp-type">Boarding Pass<strong>${b.class || 'Economy'}</strong></div>
            </div>
            <div class="bp-route">
                <div class="bp-city">
                    <div class="bp-code">${b.from_code}</div>
                    <div class="bp-city-name">${b.from_city}</div>
                    <div class="bp-time">${formatTime(b.departure_time)}</div>
                </div>
                <div class="bp-plane">
                    <div class="bp-plane-icon">✈</div>
                    <div class="bp-flight-num">${b.flight_number}</div>
                    <div style="font-size:0.72rem;color:#aaa;">Direct</div>
                </div>
                <div class="bp-city">
                    <div class="bp-code">${b.to_code}</div>
                    <div class="bp-city-name">${b.to_city}</div>
                    <div class="bp-time">${formatTime(b.arrival_time)}</div>
                </div>
            </div>
            <div class="bp-details">
                <div class="bp-detail">
                    <span class="d-label">Passenger</span>
                    <span class="d-value">${b.first_name} ${b.last_name}</span>
                </div>
                <div class="bp-detail">
                    <span class="d-label">Date</span>
                    <span class="d-value">${formatDate(b.departure_time)}</span>
                </div>
                <div class="bp-detail">
                    <span class="d-label">Boarding</span>
                    <span class="d-value">${boardingTime}</span>
                </div>
                <div class="bp-detail">
                    <span class="d-label">Gate</span>
                    <span class="d-value" id="gate-num">—</span>
                </div>
            </div>
            <div class="bp-seat-section">
                <div>
                    <div class="bp-seat-label">Seat</div>
                    <div class="bp-seat-big">${seatNumber}</div>
                </div>
                <div class="bp-seat-info">
                    <div class="seat-type">${seatType.type}</div>
                    <div class="seat-desc">${seatType.desc}</div>
                </div>
            </div>
            <div class="bp-barcode">
                <div class="barcode" id="barcode"></div>
                <div class="bp-ref">${b.booking_reference}</div>
                <div class="bp-status">✓ Confirmed</div>
            </div>
        </div>
    `;

    generateBarcode();
    loadGate(b.booking_reference);
}

function loadGate(booking_ref) {
    fetch(`${API}/payment.php?action=gate&ref=${booking_ref}`, { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
        if (data.success && el('gate-num'))
            el('gate-num').textContent = data.data.gate || '—';
    })
    .catch(() => {});
}

function generateBarcode() {
    const barcode = document.getElementById('barcode');
    if (!barcode) return;
    let html = '';
    for (let i = 0; i < 60; i++) {
        const height = Math.floor(Math.random() * 30) + 20;
        const width  = Math.random() > 0.5 ? 3 : 1.5;
        html += `<div class="barcode-bar" style="width:${width}px;height:${height}px;"></div>`;
    }
    barcode.innerHTML = html;
}

function getSeatType(col, cls) {
    if (cls === 'Business') return { type: 'Business Class', desc: 'Extra legroom & premium service' };
    if (col === 'A' || col === 'F') return { type: 'Window Seat', desc: 'Enjoy the view' };
    if (col === 'C' || col === 'D') return { type: 'Aisle Seat', desc: 'Easy access' };
    return { type: 'Middle Seat', desc: 'Standard seat' };
}

function formatTime(datetime) {
    if (!datetime) return '—';
    const parts = datetime.split(' ');
    return parts[1] ? parts[1].substring(0, 5) : '—';
}

function formatDate(datetime) {
    if (!datetime) return '—';
    return datetime.split(' ')[0] || '—';
}

function subtractMinutes(datetime, mins) {
    if (!datetime) return '—';
    const d = new Date(datetime.replace(' ', 'T'));
    d.setMinutes(d.getMinutes() - mins);
    return d.toTimeString().substring(0, 5);
}