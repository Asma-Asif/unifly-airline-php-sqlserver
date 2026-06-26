function submitComplaint() {
    const category    = el('category')    ? el('category').value    : '';
    const subject     = el('subject')     ? el('subject').value     : '';
    const description = el('description') ? el('description').value : '';
    if (!subject || !description) { alert('Please fill all fields!'); return; }
    fetch(`${API}/complaint.php?action=submit`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ category, subject, description })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('Complaint submitted! Ticket: ' + data.data.ticket_number);
            el('subject').value = ''; el('description').value = '';
        } else { alert(data.message); }
    })
    .catch(() => alert('Connection error.'));
}

function trackComplaint() {
    const ticket = el('ticket-input') ? el('ticket-input').value.trim() : '';
    if (!ticket) { alert('Enter ticket number!'); return; }
    fetch(`${API}/complaint.php?action=track&ticket=${ticket}`, { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
        const result = el('track-result');
        if (!data.success) { result.innerHTML = '<p class="no-results">Ticket not found.</p>'; return; }
        const c = data.data;
        result.innerHTML = `
            <div class="track-card">
                <div class="track-row-info"><strong>Ticket:</strong> ${c.ticket_number}</div>
                <div class="track-row-info"><strong>Category:</strong> ${c.category}</div>
                <div class="track-row-info"><strong>Subject:</strong> ${c.subject}</div>
                <div class="track-row-info"><strong>Status:</strong> <span class="booking-status ${c.status.toLowerCase()}">${c.status}</span></div>
                <div class="track-row-info"><strong>Submitted:</strong> ${c.submitted_at}</div>
            </div>`;
    })
    .catch(() => alert('Connection error.'));
}