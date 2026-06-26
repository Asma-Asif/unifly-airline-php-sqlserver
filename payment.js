const DEALS = [
    { id:1, type:'domestic',      from:'LHE', to:'KHI', from_city:'Lahore',    to_city:'Karachi',   original:15000, price:7999,  saving:47, badge:'hot',     dates:'May 20 — Jun 30, 2026', bg:'#1a3a2a', icon:'🌊' },
    { id:2, type:'domestic',      from:'ISB', to:'KHI', from_city:'Islamabad', to_city:'Karachi',   original:12000, price:8500,  saving:29, badge:'new',     dates:'Jun 1 — Jul 15, 2026',  bg:'#0a1a3a', icon:'🏛️' },
    { id:3, type:'domestic',      from:'LHE', to:'ISB', from_city:'Lahore',    to_city:'Islamabad', original:10000, price:6999,  saving:30, badge:'limited', dates:'May 25 — Jun 25, 2026', bg:'#1a2a1a', icon:'🏔️' },
    { id:4, type:'domestic',      from:'KHI', to:'PEW', from_city:'Karachi',   to_city:'Peshawar',  original:18000, price:11999, saving:33, badge:'hot',     dates:'Jun 5 — Jul 5, 2026',   bg:'#2a1a0a', icon:'🏔️' },
    { id:5, type:'international', from:'LHE', to:'DXB', from_city:'Lahore',    to_city:'Dubai',     original:65000, price:42999, saving:34, badge:'new',     dates:'Jun 15 — Aug 31, 2026', bg:'#2a1a00', icon:'🏙️' },
    { id:6, type:'business',      from:'LHE', to:'KHI', from_city:'Lahore',    to_city:'Karachi',   original:35000, price:24999, saving:29, badge:'limited', dates:'May 20 — Jun 20, 2026', bg:'#1a1a2e', icon:'💼' }
];

window.onload = function () { renderDeals(DEALS); };

function filterDeals(btn, type) {
    document.querySelectorAll('.ftab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderDeals(type === 'all' ? DEALS : DEALS.filter(d => d.type === type));
}

function renderDeals(deals) {
    const grid = document.getElementById('deals-grid');
    if (!grid) return;
    if (deals.length === 0) { grid.innerHTML = '<p style="text-align:center;color:#aaa;grid-column:1/-1;padding:40px;">No deals available.</p>'; return; }
    grid.innerHTML = deals.map(d => `
        <div class="deal-card">
            <div class="deal-img" style="background:${d.bg};">
                <span>${d.icon}</span>
                <span class="deal-badge ${d.badge}">${d.badge==='hot'?'🔥 HOT':d.badge==='new'?'✨ NEW':'⚡ LIMITED'}</span>
            </div>
            <div class="deal-body">
                <div class="deal-route"><span class="deal-code">${d.from}</span><span style="color:#1b6ca8;">✈</span><span class="deal-code">${d.to}</span></div>
                <div class="deal-cities">${d.from_city} → ${d.to_city}</div>
                <div class="deal-dates">🗓 <span>${d.dates}</span></div>
                <div class="deal-price-row">
                    <div><div class="deal-original">PKR ${d.original.toLocaleString()}</div><div class="deal-amount">PKR ${d.price.toLocaleString()}</div><div class="deal-saving">Save ${d.saving}%</div></div>
                    <button class="btn-deal" onclick="bookDeal('${d.from}','${d.to}')">Book Now</button>
                </div>
            </div>
        </div>`).join('');
}

function bookDeal(from, to) {
    const today = new Date(); today.setDate(today.getDate()+1);
    window.location.href = `flights.html?from=${from}&to=${to}&date=${today.toISOString().split('T')[0]}&class=Economy`;
}