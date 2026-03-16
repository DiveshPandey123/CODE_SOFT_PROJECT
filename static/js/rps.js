const RPS = {
    userScore: 0,
    computerScore: 0,
    emojis: { rock: '🪨', paper: '📄', scissors: '✂️' },

    render: function() {
        const div = document.createElement('div');
        div.innerHTML = `
            <h2 style="color:var(--accent);margin-bottom:1.5rem;">Rock Paper Scissors</h2>
            <div class="flex-center" style="margin-bottom:2rem;">
                <div class="score-display" style="flex:1;min-width:120px;">
                    <h3>You</h3>
                    <p id="userScore">0</p>
                </div>
                <div style="font-size:2rem;color:var(--text-secondary);">VS</div>
                <div class="score-display" style="flex:1;min-width:120px;">
                    <h3>Computer</h3>
                    <p id="compScore">0</p>
                </div>
            </div>
            <div class="flex-center" style="margin-bottom:2rem;">
                <button onclick="RPS.play('rock')" style="font-size:2rem;padding:1rem 2rem;background:var(--bg-primary);border:2px solid var(--accent);">🪨<br><small>Rock</small></button>
                <button onclick="RPS.play('paper')" style="font-size:2rem;padding:1rem 2rem;background:var(--bg-primary);border:2px solid var(--accent);">📄<br><small>Paper</small></button>
                <button onclick="RPS.play('scissors')" style="font-size:2rem;padding:1rem 2rem;background:var(--bg-primary);border:2px solid var(--accent);">✂️<br><small>Scissors</small></button>
            </div>
            <div id="rpsResult" style="text-align:center;font-size:1.5rem;min-height:80px;padding:1rem;background:var(--bg-primary);border-radius:var(--border-radius);margin-bottom:1rem;"></div>
            <div class="flex-center">
                <button class="danger" onclick="RPS.reset()">Reset Game</button>
            </div>
        `;
        return div;
    },

    init: function() {
        const saved = Storage.load('app_rps_scores', { userScore: 0, computerScore: 0 });
        this.userScore = saved.userScore;
        this.computerScore = saved.computerScore;
        this.updateScores();
    },

    play: function(choice) {
        const choices = ['rock', 'paper', 'scissors'];
        const comp = choices[Math.floor(Math.random() * 3)];

        let result;
        if (choice === comp) result = 'tie';
        else if (
            (choice === 'rock'     && comp === 'scissors') ||
            (choice === 'paper'    && comp === 'rock')     ||
            (choice === 'scissors' && comp === 'paper')
        ) result = 'win';
        else result = 'lose';

        if (result === 'win') this.userScore++;
        else if (result === 'lose') this.computerScore++;

        this.updateScores();
        this.showResult(choice, comp, result);
        Storage.save('app_rps_scores', { userScore: this.userScore, computerScore: this.computerScore });
    },

    showResult: function(userChoice, compChoice, result) {
        const el = document.getElementById('rpsResult');
        if (!el) return;
        const colors = { win: 'var(--success)', lose: 'var(--error)', tie: 'var(--warning)' };
        const labels = { win: 'You Win! 🎉', lose: 'You Lose! 😞', tie: "It's a Tie! 🤝" };
        el.innerHTML = `
            <div>${this.emojis[userChoice]} You &nbsp;&nbsp; vs &nbsp;&nbsp; Computer ${this.emojis[compChoice]}</div>
            <div style="color:${colors[result]};font-weight:bold;margin-top:0.5rem;">${labels[result]}</div>
        `;
    },

    reset: function() {
        if (!confirm('Reset game scores?')) return;
        this.userScore = 0;
        this.computerScore = 0;
        this.updateScores();
        Storage.save('app_rps_scores', { userScore: 0, computerScore: 0 });
        const el = document.getElementById('rpsResult');
        if (el) el.innerHTML = '';
    },

    updateScores: function() {
        const u = document.getElementById('userScore');
        const c = document.getElementById('compScore');
        if (u) u.textContent = this.userScore;
        if (c) c.textContent = this.computerScore;
    }
};
