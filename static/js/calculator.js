const Calculator = {
    expression: '',

    render: function() {
        const div = document.createElement('div');
        div.innerHTML = `
            <h2 style="color:var(--accent);margin-bottom:1.5rem;">Calculator</h2>
            <div class="display-field" id="calcDisplay">0</div>
            <div id="calcError" class="error-message"></div>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0.5rem;margin-top:1rem;">
                <button class="secondary" onclick="Calculator.clear()">C</button>
                <button class="secondary" onclick="Calculator.deleteLast()">⌫</button>
                <button class="secondary" onclick="Calculator.append('%')">%</button>
                <button onclick="Calculator.append('/')">÷</button>
                <button class="secondary" onclick="Calculator.append('7')">7</button>
                <button class="secondary" onclick="Calculator.append('8')">8</button>
                <button class="secondary" onclick="Calculator.append('9')">9</button>
                <button onclick="Calculator.append('*')">×</button>
                <button class="secondary" onclick="Calculator.append('4')">4</button>
                <button class="secondary" onclick="Calculator.append('5')">5</button>
                <button class="secondary" onclick="Calculator.append('6')">6</button>
                <button onclick="Calculator.append('-')">−</button>
                <button class="secondary" onclick="Calculator.append('1')">1</button>
                <button class="secondary" onclick="Calculator.append('2')">2</button>
                <button class="secondary" onclick="Calculator.append('3')">3</button>
                <button onclick="Calculator.append('+')">+</button>
                <button class="secondary" onclick="Calculator.append('0')" style="grid-column:span 2;">0</button>
                <button class="secondary" onclick="Calculator.append('.')">.</button>
                <button onclick="Calculator.evaluate()" style="background:var(--success);">=</button>
            </div>
        `;
        return div;
    },

    init: function() {
        this.expression = '';
        this.updateDisplay('0');
    },

    append: function(val) {
        this.hideError();
        if (this.expression === '0' && !isNaN(val)) {
            this.expression = val;
        } else {
            this.expression += val;
        }
        this.updateDisplay(this.expression);
    },

    clear: function() {
        this.expression = '';
        this.updateDisplay('0');
        this.hideError();
    },

    deleteLast: function() {
        this.expression = this.expression.slice(0, -1);
        this.updateDisplay(this.expression || '0');
    },

    evaluate: function() {
        if (!this.expression) return;
        fetch('/api/calculator/evaluate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ expression: this.expression })
        })
        .then(r => r.json())
        .then(data => {
            if (data.error) {
                this.showError(data.error);
            } else {
                this.expression = String(data.result);
                this.updateDisplay(this.expression);
            }
        })
        .catch(() => this.showError('Connection error. Please try again.'));
    },

    updateDisplay: function(val) {
        const d = document.getElementById('calcDisplay');
        if (d) d.textContent = val;
    },

    showError: function(msg) {
        const e = document.getElementById('calcError');
        if (e) { e.textContent = msg; e.classList.add('show'); }
    },

    hideError: function() {
        const e = document.getElementById('calcError');
        if (e) e.classList.remove('show');
    }
};
