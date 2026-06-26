window.onload = function() { loadDashboard(); }

function showTab(tab) {
    ['dashboard','flights','bookings','passengers','complaints'].forEach(t => {
        document.getElementById('tab-'+t).style.display = 'none';
    });
    document.getElementById('tab-'+tab).style.display = 'block';
    if (tab === 'dashboard')  loadDashboard();
    if (tab === 'flights')    loadFlights();
    if (tab === 'bookings')   loadBookings();
    if (tab === 'passengers') loadPassengers();
    if (tab === 'complaints') loadComplaints();
}

function loadDashboard() {
    fetch(`${API}/admin.php?action=dashboard`, { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
        if (!data.success) { alert('Admin access required!'); window.location.href = 'admin-login.html'; return; }
        const d = data.data;
        if(el('flights-today'))    el('flights-today').textContent    = d.flights_today;
        if(el('active-bookings'))  el('active-bookings').textContent  = d.active_bookings;
        if(el('total-passengers')) el('total-passengers').textContent = d.total_passengers;
        if(el('open-complaints'))  el('open-complaints').textContent  = d.open_complaints;
        if(el('revenue'))          el('revenue').textContent          = 'PKR ' + Number(d.revenue_this_month).toLocaleString();
    });
}

function loadFlights() {
    fetch(`${API}/admin.php?action=flights`, { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
        if (!data.success) return;
        document.getElementById('flights-table').innerHTML = `
            <div style="margin-bottom:16px;">
                <button class="btn-auth" style="width:auto;padding:10px 24px;" onclick="showAddFlightForm()">+ Add New Flight</button>
            </div>
            <div id="add-flight-form" style="display:none;background:#f8faff;border-radius:12px;padding:20px;margin-bottom:20px;">
                <h3 style="margin-bottom:16px;">Add New Flight</h3>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                    <div><label style="font-size:0.8rem;font-weight:600;">Flight Number</label><input type="text" id="af-number" placeholder="UF-105" style="width:100%;padding:10px;border:1.5px solid #e0e0e0;border-radius:8px;margin-top:4px;box-sizing:border-box;"></div>
                    <div><label style="font-size:0.8rem;font-weight:600;">Aircraft ID</label><input type="number" id="af-aircraft" placeholder="1" style="width:100%;padding:10px;border:1.5px solid #e0e0e0;border-radius:8px;margin-top:4px;box-sizing:border-box;"></div>
                    <div><label style="font-size:0.8rem;font-weight:600;">Origin Airport ID</label><input type="number" id="af-origin" placeholder="1" style="width:100%;padding:10px;border:1.5px solid #e0e0e0;border-radius:8px;margin-top:4px;box-sizing:border-box;"></div>
                    <div><label style="font-size:0.8rem;font-weight:600;">Destination Airport ID</label><input type="number" id="af-dest" placeholder="2" style="width:100%;padding:10px;border:1.5px solid #e0e0e0;border-radius:8px;margin-top:4px;box-sizing:border-box;"></div>
                    <div><label style="font-size:0.8rem;font-weight:600;">Departure Time</label><input type="datetime-local" id="af-dep" style="width:100%;padding:10px;border:1.5px solid #e0e0e0;border-radius:8px;margin-top:4px;box-sizing:border-box;"></div>
                    <div><label style="font-size:0.8rem;font-weight:600;">Arrival Time</label><input type="datetime-local" id="af-arr" style="width:100%;padding:10px;border:1.5px solid #e0e0e0;border-radius:8px;margin-top:4px;box-sizing:border-box;"></div>
                    <div><label style="font-size:0.8rem;font-weight:600;">Economy Price</label><input type="number" id="af-eprice" placeholder="12000" style="width:100%;padding:10px;border:1.5px solid #e0e0e0;border-radius:8px;margin-top:4px;box-sizing:border-box;"></div>
                    <div><label style="font-size:0.8rem;font-weight:600;">Business Price</label><input type="number" id="af-bprice" placeholder="28000" style="width:100%;padding:10px;border:1.5px solid #e0e0e0;border-radius:8px;margin-top:4px;box-sizing:border-box;"></div>
                </div>
                <div style="margin-top:16px;display:flex;gap:10px;">
                    <button class="btn-auth" style="width:auto;padding:10px 24px;" onclick="addFlight()">Save Flight</button>
                    <button onclick="document.getElementById('add-flight-form').style.display='none'" style="padding:10px 24px;background:transparent;border:1.5px solid #ccc;border-radius:8px;cursor:pointer;">Cancel</button>
                </div>
            </div>
            <table class="admin-table">
                <thead><tr><th>Flight</th><th>From</th><th>To</th><th>Departure</th><th>Economy</th><th>Business</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>${data.data.flights.map(f => `
                <tr>
                    <td>${f.flight_number}</td>
                    <td>${f.from_code} - ${f.from_city}</td>
                    <td>${f.to_code} - ${f.to_city}</td>
                    <td>${f.departure_time}</td>
                    <td>${f.available_economy} seats</td>
                    <td>${f.available_business} seats</td>
                    <td><span class="booking-status ${f.status.toLowerCase()}">${f.status}</span></td>
                    <td>
                        <select onchange="updateFlightStatus(${f.flight_id}, this.value)" style="padding:5px 8px;border:1.5px solid #e0e0e0;border-radius:6px;font-size:0.8rem;">
                            <option value="">Change Status</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Boarding">Boarding</option>
                            <option value="Departed">Departed</option>
                            <option value="Arrived">Arrived</option>
                            <option value="Delayed">Delayed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </td>
                </tr>`).join('')}</tbody>
            </table>`;
    });
}

function showAddFlightForm() {
    const form = document.getElementById('add-flight-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function addFlight() {
    const data = {
        flight_number: document.getElementById('af-number').value.trim(),
        aircraft_id:   parseInt(document.getElementById('af-aircraft').value),
        origin_id:     parseInt(document.getElementById('af-origin').value),
        destination_id:parseInt(document.getElementById('af-dest').value),
        departure_time:document.getElementById('af-dep').value,
        arrival_time:  document.getElementById('af-arr').value,
        economy_price: parseInt(document.getElementById('af-eprice').value),
        business_price:parseInt(document.getElementById('af-bprice').value)
    };
    fetch(`${API}/admin.php?action=add_flight`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => { alert(data.message); if (data.success) loadFlights(); });
}

function updateFlightStatus(flight_id, status) {
    if (!status) return;
    if (!confirm(`Change status to "${status}"?`)) return;
    fetch(`${API}/admin.php?action=update_flight_status`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ flight_id, status })
    })
    .then(res => res.json())
    .then(data => { alert(data.message); if (data.success) loadFlights(); });
}

function loadBookings() {
    fetch(`${API}/admin.php?action=bookings`, { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
        if (!data.success) return;
        document.getElementById('bookings-table').innerHTML = `
            <table class="admin-table">
                <thead><tr><th>Reference</th><th>Passenger</th><th>Flight</th><th>Route</th><th>Class</th><th>Seat</th><th>Price</th><th>Status</th></tr></thead>
                <tbody>${data.data.bookings.map(b => `
                <tr>
                    <td>${b.booking_reference}</td><td>${b.passenger}</td><td>${b.flight_number}</td>
                    <td>${b.from_city} → ${b.to_city}</td><td>${b.class}</td><td>${b.seat_number||'—'}</td>
                    <td>PKR ${Number(b.total_price).toLocaleString()}</td>
                    <td><span class="booking-status ${b.status.toLowerCase()}">${b.status}</span></td>
                </tr>`).join('')}</tbody>
            </table>`;
    });
}

function loadPassengers() {
    fetch(`${API}/admin.php?action=passengers`, { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
        if (!data.success) return;
        document.getElementById('passengers-table').innerHTML = `
            <table class="admin-table">
                <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Bookings</th><th>Joined</th><th>Action</th></tr></thead>
                <tbody>${data.data.passengers.map(p => `
                <tr>
                    <td>${p.first_name} ${p.last_name}</td><td>${p.email}</td><td>${p.phone||'—'}</td>
                    <td>${p.total_bookings}</td><td>${p.created_at}</td>
                    <td><button onclick="togglePassenger(${p.passenger_id}, ${p.is_active})"
                        style="padding:5px 10px;border:none;border-radius:6px;cursor:pointer;font-size:0.78rem;font-weight:700;
                        background:${p.is_active?'#fdeaea':'#e8f5e9'};color:${p.is_active?'#e53935':'#2e7d32'};">
                        ${p.is_active?'Deactivate':'Activate'}</button></td>
                </tr>`).join('')}</tbody>
            </table>`;
    });
}

function togglePassenger(passenger_id, is_active) {
    if (!confirm((is_active?'Deactivate':'Activate') + ' this passenger?')) return;
    fetch(`${API}/admin.php?action=toggle_passenger`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ passenger_id, is_active: !is_active })
    })
    .then(res => res.json())
    .then(data => { alert(data.message); if (data.success) loadPassengers(); });
}

function loadComplaints() {
    fetch(`${API}/admin.php?action=complaints`, { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
        if (!data.success) return;
        document.getElementById('complaints-table').innerHTML = `
            <table class="admin-table">
                <thead><tr><th>Ticket</th><th>Passenger</th><th>Category</th><th>Subject</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
                <tbody>${data.data.complaints.map(c => `
                <tr>
                    <td>${c.ticket_number}</td><td>${c.passenger}</td><td>${c.category}</td><td>${c.subject}</td>
                    <td><span class="booking-status ${c.status.toLowerCase()}">${c.status}</span></td>
                    <td>${c.submitted_at}</td>
                    <td>${c.status !== 'Resolved' ? `<button onclick="resolveComplaint('${c.ticket_number}')"
                        style="padding:5px 10px;background:#e8f5e9;color:#2e7d32;border:none;border-radius:6px;cursor:pointer;font-size:0.78rem;font-weight:700;">
                        ✓ Resolve</button>` : '<span style="color:#2e7d32;font-size:0.78rem;">✓ Resolved</span>'}</td>
                </tr>`).join('')}</tbody>
            </table>`;
    });
}

function resolveComplaint(ticket_number) {
    if (!confirm('Resolve complaint ' + ticket_number + '?')) return;
    fetch(`${API}/admin.php?action=resolve_complaint`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ ticket_number })
    })
    .then(res => res.json())
    .then(data => { alert(data.message); if (data.success) loadComplaints(); });
}