const PasswordGenerator = {
    render: function() {
        const div = document.createElement('div');
        div.innerHTML = `
            <h2 style="color:var(--accent);margin-bottom:1.5rem;">Password Generator</h2>
            <div id="passError" class="error-message"></div>
            <div id="passSuccess" class="success-message"></div>
            <div class="form-group">
                <label>Password Length</label>
                <input type="number" id="passLength" value="12" min="1" max="128">
            </div>
            <div class="form-group">
                <label>Character Types</label>
                <div class="checkbox-group">
                    <label class="checkbox-item"><input type="checkbox" id="passUpper" checked> Uppercase (A-Z)</label>
                    <label class="checkbox-item"><input type="checkbox" id="passLower" checked> Lowercase (a-z)</label>
                    <label class="checkbox-item"><input type="checkbox" id="passNumbers" checked> Numbers (0-9)</label>
                    <label class="checkbox-item"><input type="checkbox" id="passSymbols"> Symbols (!@#$)</label>
                </div>
            </div>
            <button onclick="PasswordGenerator.generate()" style="margin-bottom:1rem;">Generate Password</button>
            <div class="display-field" id="passDisplay" style="font-size:1rem;letter-spacing:2px;">—</div>
            <div id="passStrength" style="margin:0.5rem 0;font-weight:bold;"></div>
            <button class="secondary" onclick="PasswordGenerator.copy()" id="copyBtn" style="display:none;">Copy to Clipboard</button>
        `;
        return div;
    },

    init: function() {},

    generate: function() {
        const lengthVal = document.getElementById('passLength').value;
        const length = parseInt(lengthVal);

        if (!length || length <= 0) {
            this.showError('Enter a valid positive number');
            return;
        }

        const uppercase = document.getElementById('passUpper').checked;
        const lowercase = document.getElementById('passLower').checked;
        const numbers = document.getElementById('passNumbers').checked;
        const symbols = document.getElementById('passSymbols').checked;

        if (!uppercase && !lowercase && !numbers && !symbols) {
            this.showError('Select at least one character type');
            return;
        }

        let chars = '';
        if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
        if (numbers)   chars += '0123456789';
        if (symbols)   chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars[Math.floor(Math.random() * chars.length)];
        }

        const strength = length < 6 ? 'Weak' : length <= 10 ? 'Medium' : 'Strong';
        const colors = { Weak: 'var(--error)', Medium: 'var(--warning)', Strong: 'var(--success)' };

        document.getElementById('passDisplay').textContent = password;
        const strengthEl = document.getElementById('passStrength');
        strengthEl.textContent = `Strength: ${strength}`;
        strengthEl.style.color = colors[strength];
        document.getElementById('copyBtn').style.display = 'inline-block';
        this.hideError();
    },

    copy: function() {
        const pass = document.getElementById('passDisplay').textContent;
        if (pass === '—') return;
        navigator.clipboard.writeText(pass)
            .then(() => this.showSuccess('Password copied to clipboard!'))
            .catch(() => this.showSuccess('Password copied!'));
    },

    showError: function(msg) {
        const e = document.getElementById('passError');
        if (e) { e.textContent = msg; e.classList.add('show'); }
    },

    hideError: function() {
        const e = document.getElementById('passError');
        if (e) e.classList.remove('show');
    },

    showSuccess: function(msg) {
        const e = document.getElementById('passSuccess');
        if (e) { e.textContent = msg; e.classList.add('show'); }
        setTimeout(() => { if (e) e.classList.remove('show'); }, 2000);
    }
};
