const Contacts = {
    contacts: [],
    selectedId: null,

    render: function() {
        const div = document.createElement('div');
        div.innerHTML = `
            <h2 style="color:var(--accent);margin-bottom:1.5rem;">Contact Book</h2>
            <div id="contactMsg" class="error-message"></div>
            <div id="contactSuccess" class="success-message"></div>
            <div class="grid-2">
                <div>
                    <div class="form-group">
                        <label>Name *</label>
                        <input type="text" id="contactName" placeholder="Full name">
                    </div>
                    <div class="form-group">
                        <label>Phone *</label>
                        <input type="text" id="contactPhone" placeholder="Phone number">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="contactEmail" placeholder="Email address">
                    </div>
                    <div class="form-group">
                        <label>Address</label>
                        <input type="text" id="contactAddress" placeholder="Address">
                    </div>
                    <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
                        <button onclick="Contacts.add()">Add</button>
                        <button class="secondary" onclick="Contacts.update()">Update</button>
                        <button class="danger" onclick="Contacts.delete()">Delete</button>
                    </div>
                </div>
                <div>
                    <div class="form-group">
                        <label>Search</label>
                        <input type="text" id="contactSearch" placeholder="Search by name or phone" oninput="Contacts.search()">
                    </div>
                    <div class="list-container" id="contactList"></div>
                </div>
            </div>
        `;
        return div;
    },

    init: function() {
        this.contacts = Storage.load('app_contacts', []);
        this.selectedId = null;
        this.renderList(this.contacts);
    },

    renderList: function(list) {
        const el = document.getElementById('contactList');
        if (!el) return;
        if (!list.length) {
            el.innerHTML = '<p style="color:var(--text-secondary);text-align:center;">No contacts found</p>';
            return;
        }
        el.innerHTML = list.map(c => `
            <div class="list-item ${this.selectedId === c.id ? 'selected' : ''}" onclick="Contacts.select('${c.id}')">
                <strong>${c.name}</strong><br>
                <small style="color:var(--text-secondary)">${c.phone}</small>
            </div>
        `).join('');
    },

    select: function(id) {
        this.selectedId = id;
        const c = this.contacts.find(x => x.id === id);
        if (!c) return;
        document.getElementById('contactName').value = c.name;
        document.getElementById('contactPhone').value = c.phone;
        document.getElementById('contactEmail').value = c.email || '';
        document.getElementById('contactAddress').value = c.address || '';
        this.renderList(this.contacts);
    },

    add: function() {
        const name = document.getElementById('contactName').value.trim();
        const phone = document.getElementById('contactPhone').value.trim();
        if (!name || !phone) { this.showError('Name and phone are required'); return; }
        const contact = {
            id: Date.now().toString(),
            name,
            phone,
            email: document.getElementById('contactEmail').value.trim(),
            address: document.getElementById('contactAddress').value.trim()
        };
        this.contacts.push(contact);
        this.save();
        this.clearForm();
        this.showSuccess('Contact added');
        this.renderList(this.contacts);
    },

    update: function() {
        if (!this.selectedId) { this.showError('Select a contact to update'); return; }
        const name = document.getElementById('contactName').value.trim();
        const phone = document.getElementById('contactPhone').value.trim();
        if (!name || !phone) { this.showError('Name and phone are required'); return; }
        const idx = this.contacts.findIndex(c => c.id === this.selectedId);
        if (idx === -1) return;
        this.contacts[idx] = { ...this.contacts[idx], name, phone,
            email: document.getElementById('contactEmail').value.trim(),
            address: document.getElementById('contactAddress').value.trim()
        };
        this.save();
        this.showSuccess('Contact updated');
        this.renderList(this.contacts);
    },

    delete: function() {
        if (!this.selectedId) { this.showError('Select a contact to delete'); return; }
        if (!confirm('Delete this contact?')) return;
        this.contacts = this.contacts.filter(c => c.id !== this.selectedId);
        this.selectedId = null;
        this.save();
        this.clearForm();
        this.showSuccess('Contact deleted');
        this.renderList(this.contacts);
    },

    search: function() {
        const q = document.getElementById('contactSearch').value.toLowerCase();
        const filtered = q ? this.contacts.filter(c =>
            c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q)
        ) : this.contacts;
        this.renderList(filtered);
    },

    save: function() { Storage.save('app_contacts', this.contacts); },

    clearForm: function() {
        ['contactName','contactPhone','contactEmail','contactAddress'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        this.selectedId = null;
    },

    showError: function(msg) {
        const e = document.getElementById('contactMsg');
        if (e) { e.textContent = msg; e.classList.add('show'); }
        setTimeout(() => { if (e) e.classList.remove('show'); }, 3000);
    },

    showSuccess: function(msg) {
        const e = document.getElementById('contactSuccess');
        if (e) { e.textContent = msg; e.classList.add('show'); }
        setTimeout(() => { if (e) e.classList.remove('show'); }, 2000);
    }
};
