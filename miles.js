window.onload = function() {
    loadDashboard();
    loadBookings();
}

function loadDashboard() {
    fetch(`${API}/auth.php?action=me`, { credentials: 'include' })
    .then(r => r.json())
    .then(u => {
        if (!u.success) { window.location.href = 'login.html'; return; }
        if (el('user-name')) el('user-name').textContent = u.data.first_name + ' ' + u.data.last_name;
    });

    fetch(`${API}/booking.php?action=my`, { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
        if (!data.success) return;
        const bookings = data.data.bookings;
        const upcoming = bookings.filter(b => b.status === 'Confirmed' && new Date(b.departure_time) > new Date()).length;
        if (el('total-bookings')) el('total-bookings').textContent = bookings.length;
        if (el('upcoming'))       el('upcoming').textContent       = upcoming;
    });

    fetch(`${API}/loyalty.php?action=total`, { credentials: 'include' })
    .then(res => res.json())
    .then(data => { if (data.success && el('points')) el('points').textContent = data.data.total_points || 0; })
    .catch(() => {});
}

function loadBookings() {
    fetch(`${API}/booking.php?action=my`, { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
        if (!data.success) { document.getElementById('bookings-list').innerHTML = '<p class="no-results">Could not load bookings.</p>'; return; }
        const bookings = data.data.bookings;
        const list = document.getElementById('bookings-list');
        if (bookings.length === 0) { list.innerHTML = '<p class="no-results">No bookings yet. <a href="flights.html">Search flights</a></p>'; return; }
        list.innerHTML = bookings.map(b => `
            <div class="booking-item">
                <div class="booking-route">
                    <span class="city-code">${b.from_code}</span>
                    <span style="color:#1b6ca8;margin:0 10px">✈</span>
                    <span class="city-code">${b.to_code}</span>
                </div>
                <div class="booking-info">
                    <p><strong>${b.flight_number}</strong></p>
                    <p>${b.departure_time}</p>
                    <p>${b.class} Class</p>
                    <p style="font-size:0.78rem;color:#888;">Ref: ${b.booking_reference}</p>
                </div>
                <div class="booking-right">
                    <span class="booking-status ${b.status.toLowerCase()}">${b.status}</span>
                    <p class="booking-price">PKR ${Number(b.total_price).toLocaleString()}</p>
                    ${b.status === 'Confirmed' ? `
                        <button class="btn-boarding" onclick="window.location.href='boarding-pass.html?booking_ref=${b.booking_reference}&seat=${b.seat_number || ''}'">🎫 Boarding Pass</button>
                        <button class="btn-cancel" onclick="cancelBooking('${b.booking_reference}')">Cancel</button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    })
    .catch(() => { document.getElementById('bookings-list').innerHTML = '<p class="no-results">Error loading bookings.</p>'; });
}

function cancelBooking(ref) {
    if (!confirm('Cancel booking ' + ref + '?')) return;
    fetch(`${API}/booking.php?action=cancel`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ ref })
    })
    .then(res => res.json())
    .then(data => { alert(data.message); if (data.success) loadBookings(); })
    .catch(() => alert('Connection error.'));
}

function logoutUser() {
    fetch(`${API}/auth.php?action=logout`, { credentials: 'include' })
    .then(() => window.location.href = 'login.html');
}