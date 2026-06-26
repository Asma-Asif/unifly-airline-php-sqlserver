// ── BOOKING PAGE ──
let flightData = null;
let basePrice  = 0;

window.onload = function () {
    const p         = new URLSearchParams(window.location.search);
    const flight_id = p.get('flight_id');
    const cls       = p.get('class') || 'Economy';

    if (!flight_id) {
        const summary = document.getElementById('flight-summary');
        if (summary) summary.innerHTML =
            '<p class="no-results">No flight selected. <a href="flights.html">Search flights</a></p>';
        return;
    }

    if (el('class')) el('class').value = cls;

    fetch(`${API}/flights.php?action=detail&id=${flight_id}`)
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                el('flight-summary').innerHTML =
                    '<p class="no-results">Flight not found.</p>';
                return;
            }

            flightData = data.data;
            basePrice  = cls === 'Business'
                ? flightData.business_price
                : flightData.economy_price;

            const summary = el('flight-summary');
            if (summary) {
                summary.innerHTML = `
                    <div class="summary-route">
                        <div class="summary-city">
                            <span class="city-code">${flightData.from_code}</span>
                            <span class="city-name">${flightData.from_city}</span>
                        </div>
                        <div class="summary-middle">✈</div>
                        <div class="summary-city">
                            <span class="city-code">${flightData.to_code}</span>
                            <span class="city-name">${flightData.to_city}</span>
                        </div>
                    </div>
                    <div class="summary-details">
                        <p><strong>Flight:</strong> ${flightData.flight_number}</p>
                        <p><strong>Departure:</strong> ${flightData.departure_time}</p>
                        <p><strong>Arrival:</strong> ${flightData.arrival_time}</p>
                        <p><strong>Aircraft:</strong> ${flightData.model}</p>
                        <p><strong>Class:</strong> ${cls}</p>
                    </div>
                `;
            }
            updatePrice();
        })
        .catch(() => {
            const summary = el('flight-summary');
            if (summary) summary.innerHTML =
                '<p class="no-results">Error loading flight. Check XAMPP is running.</p>';
        });

    const baggageEl = el('baggage');
    if (baggageEl) baggageEl.addEventListener('change', updatePrice);
};

function updatePrice() {
    const baggageEl = el('baggage');
    if (!baggageEl) return;
    const baggage       = parseInt(baggageEl.value) || 0;
    const baggageCharge = baggage * 500;
    const total         = basePrice + baggageCharge;
    if (el('base-fare'))      el('base-fare').textContent      = 'PKR ' + Number(basePrice).toLocaleString();
    if (el('baggage-charge')) el('baggage-charge').textContent = 'PKR ' + Number(baggageCharge).toLocaleString();
    if (el('total-price'))    el('total-price').textContent    = 'PKR ' + Number(total).toLocaleString();
}

function confirmBooking() {
    const p         = new URLSearchParams(window.location.search);
    const flight_id = p.get('flight_id');
    const cls       = el('class')   ? el('class').value             : 'Economy';
    const meal      = el('meal')    ? el('meal').value              : 'Halal';
    const baggage   = el('baggage') ? parseInt(el('baggage').value) : 0;

    if (!flight_id) { alert('No flight selected!'); return; }

    fetch(`${API}/booking.php?action=create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            flight_id:        parseInt(flight_id),
            class:            cls,
            meal_preference:  meal,
            extra_baggage_kg: baggage
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            const baggageCost = baggage * 500;
            window.location.href =
                `seats.html?flight_id=${flight_id}` +
                `&class=${cls}` +
                `&booking_ref=${data.data.booking_reference}` +
                `&base=${data.data.total_price - baggageCost}` +
                `&baggage=${baggageCost}` +
                `&meal=${meal}`;
        } else {
            alert(data.message);
        }
    })
    .catch(() => alert('Connection error. Make sure XAMPP is running.'));
}