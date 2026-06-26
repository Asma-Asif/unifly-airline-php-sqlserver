window.onload = function () {
    const today = new Date().toISOString().split('T')[0];
    if (el('flight-num-date')) el('flight-num-date').value = today;
};

function switchTab(btn, tab) {
    document.querySelectorAll('.stab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    el('tab-number').style.display = tab === 'number' ? 'block' : 'none';
    el('tab-route').style.display  = tab === 'route'  ? 'block' : 'none';
    el('status-results').innerHTML = '';
}

function searchByNumber() {
    const num  = el('flight-num-input') ? el('flight-num-input').value.trim().toUpperCase() : '';
    const date = el('flight-num-date')  ? el('flight-num-date').value : '';
    if (!num) { alert('Please enter a flight number!'); return; }
    showLoading();
    fetch(`${API}/flights.php?action=status&flight_number=${num}&date=${date}`)
    .then(res => res.json())
    .then(data => {
        if (!data.success || !data.data.flights || data.data.flights.length === 0) { showNoResult(`No flight found for <strong>${num}</strong>`); return; }
        renderResults(data.data.flights);
    })
    .catch(() => showNoResult('Connection error.'));
}

function searchByRoute() {
    const from = el('route-from') ? el('route-from').value.trim().toUpperCase() : '';
    const to   = el('route-to')   ? el('route-to').value.trim().toUpperCase()   : '';
    if (!from || !to) { alert('Please enter both From and To!'); return; }
    showLoading();
    fetch(`${API}/flights.php?action=status&from=${from}&to=${to}`)
    .then(res => res.json())
    .then(data => {
        if (!data.success || !data.data.flights || data.data.flights.length === 0) { showNoResult(`No flights found for <strong>${from} → ${to}</strong>`); return; }
        renderResults(data.data.flights);
    })
    .catch(() => showNoResult('Connection error.'));
}

function renderResults(flights) {
    el('status-results').innerHTML = flights.map(f => `
        <div class="result-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:12px;">
                <div>
                    <div style="font-size:1.5rem;font-weight:800;color:#1a1a2e;">${f.flight_number}</div>
                    <div style="font-size:0.82rem;color:#888;">${f.departure_time ? f.departure_time.split(' ')[0] : '—'}</div>
                </div>
                <div class="status-badge ${f.status.toLowerCase()}">${f.status}</div>
            </div>
            <div class="status-route">
                <div style="text-align:center;">
                    <div class="status-code">${f.from_code}</div>
                    <div class="status-city-name">${f.from_city}</div>
                    <div class="status-time">${f.departure_time ? f.departure_time.split(' ')[1] : '—'}</div>
                </div>
                <div style="font-size:1.8rem;color:#1b6ca8;">✈</div>
                <div style="text-align:center;">
                    <div class="status-code">${f.to_code}</div>
                    <div class="status-city-name">${f.to_city}</div>
                    <div class="status-time">${f.arrival_time ? f.arrival_time.split(' ')[1] : '—'}</div>
                </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:16px;">
                <div class="detail-box"><div class="d-lbl">Aircraft</div><div class="d-val">${f.aircraft_model||'—'}</div></div>
                <div class="detail-box"><div class="d-lbl">Economy Left</div><div class="d-val">${f.available_economy??'—'}</div></div>
                <div class="detail-box"><div class="d-lbl">Business Left</div><div class="d-val">${f.available_business??'—'}</div></div>
            </div>
            ${f.status === 'Scheduled' ? `<div style="margin-top:16px;"><button class="btn-check" onclick="window.location.href='flights.html?from=${f.from_code}&to=${f.to_code}&date=${f.departure_time?f.departure_time.split(' ')[0]:''}&class=Economy'">Book This Flight</button></div>` : ''}
        </div>`).join('');
}

function showLoading() { el('status-results').innerHTML = '<div class="loading-status">Checking flight status...</div>'; }
function showNoResult(msg) { el('status-results').innerHTML = `<div class="no-result">${msg}</div>`; }