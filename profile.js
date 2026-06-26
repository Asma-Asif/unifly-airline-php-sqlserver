let allDestinations = [];
const CITY_ICONS = { 'Lahore':'🕌','Karachi':'🌊','Islamabad':'🏛️','Peshawar':'🏔️','Quetta':'🏜️','Multan':'🌸','Faisalabad':'🏭','Skardu':'🏔️','Dubai':'🏙️','default':'✈️' };
const CITY_COLORS = { 'Lahore':'#1a3a2a','Karachi':'#0a1a3a','Islamabad':'#1a2a1a','Peshawar':'#2a1a0a','default':'#1a1a2e' };

window.onload = function () { loadDestinations(); };

function loadDestinations() {
    fetch(`${API}/flights.php?action=airports`)
    .then(res => res.json())
    .then(data => {
        if (!data.success) { document.getElementById('dest-grid').innerHTML = '<p class="no-dest">Could not load destinations.</p>'; return; }
        allDestinations = data.data || [];
        const countries = [...new Set(allDestinations.map(a => a.country))];
        if(el('total-dest'))      el('total-dest').textContent      = allDestinations.length;
        if(el('total-countries')) el('total-countries').textContent = countries.length;
        if(el('total-flights'))   el('total-flights').textContent   = allDestinations.length * 2;
        const filter = el('country-filter');
        if (filter) countries.forEach(c => { const opt = document.createElement('option'); opt.value = c; opt.textContent = c; filter.appendChild(opt); });
        renderDestinations(allDestinations);
    })
    .catch(() => { document.getElementById('dest-grid').innerHTML = '<p class="no-dest">Connection error.</p>'; });
}

function filterDestinations() {
    const search  = el('search-input')   ? el('search-input').value.toLowerCase()  : '';
    const country = el('country-filter') ? el('country-filter').value              : '';
    const filtered = allDestinations.filter(a => {
        const matchSearch  = !search  || a.city.toLowerCase().includes(search) || a.airport_code.toLowerCase().includes(search) || a.airport_name.toLowerCase().includes(search);
        const matchCountry = !country || a.country === country;
        return matchSearch && matchCountry;
    });
    renderDestinations(filtered);
}

function renderDestinations(destinations) {
    const grid = el('dest-grid');
    if (!grid) return;
    if (destinations.length === 0) { grid.innerHTML = '<p class="no-dest">No destinations found.</p>'; return; }
    grid.innerHTML = destinations.map(a => `
        <div class="dest-card" onclick="flyTo('${a.airport_code}')">
            <div class="dest-img" style="background:${CITY_COLORS[a.city]||CITY_COLORS['default']};">
                <span>${CITY_ICONS[a.city]||CITY_ICONS['default']}</span>
                <span class="dest-country-badge">${a.country}</span>
            </div>
            <div class="dest-body">
                <div class="dest-city">${a.city}</div>
                <div class="dest-code">${a.airport_code}</div>
                <div class="dest-airport">${a.airport_name}</div>
                <button class="btn-fly">✈ Fly to ${a.city}</button>
            </div>
        </div>`).join('');
}

function flyTo(code) {
    const today = new Date(); today.setDate(today.getDate()+1);
    window.location.href = `flights.html?to=${code}&date=${today.toISOString().split('T')[0]}&class=Economy`;
}