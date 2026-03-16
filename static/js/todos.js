const TodoList = {
    tasks: [],
    selectedId: null,

    render: function() {
        const div = document.createElement('div');
        div.innerHTML = `
            <h2 style="color:var(--accent);margin-bottom:1.5rem;">To-Do List</h2>
            <div id="todoError" class="error-message"></div>
            <div id="todoSuccess" class="success-message"></div>
            <div style="display:flex;gap:0.5rem;margin-bottom:1rem;">
                <input type="text" id="todoInput" placeholder="Enter a new task..." style="flex:1;" onkeydown="if(event.key==='Enter')TodoList.add()">
                <button onclick="TodoList.add()" style="width:auto;">Add Task</button>
            </div>
            <div class="list-container" id="todoList"></div>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:1rem;">
                <button class="success" onclick="TodoList.markCompleted()">✔ Mark Completed</button>
                <button class="danger" onclick="TodoList.deleteTask()">Delete Task</button>
                <button class="secondary" onclick="TodoList.clearAll()">Clear All</button>
            </div>
        `;
        return div;
    },

    init: function() {
        this.tasks = Storage.load('app_tasks', []);
        this.selectedId = null;
        this.renderList();
    },

    renderList: function() {
        const el = document.getElementById('todoList');
        if (!el) return;
        if (!this.tasks.length) {
            el.innerHTML = '<p style="color:var(--text-secondary);text-align:center;">No tasks yet</p>';
            return;
        }
        el.innerHTML = this.tasks.map(t => `
            <div class="list-item ${this.selectedId === t.id ? 'selected' : ''}" onclick="TodoList.select('${t.id}')">
                <span style="${t.completed ? 'text-decoration:line-through;color:var(--text-secondary)' : ''}">${t.completed ? '✔ ' : ''}${t.description}</span>
            </div>
        `).join('');
    },

    select: function(id) {
        this.selectedId = this.selectedId === id ? null : id;
        this.renderList();
    },

    add: function() {
        const input = document.getElementById('todoInput');
        const desc = input.value.trim();
        if (!desc) { this.showError('Task cannot be empty'); return; }
        const task = { id: Date.now().toString(), description: desc, completed: false };
        this.tasks.push(task);
        this.save();
        input.value = '';
        this.showSuccess('Task added');
        this.renderList();
    },

    markCompleted: function() {
        if (!this.selectedId) { this.showError('Select a task first'); return; }
        const t = this.tasks.find(x => x.id === this.selectedId);
        if (t) { t.completed = !t.completed; this.save(); this.renderList(); }
    },

    deleteTask: function() {
        if (!this.selectedId) { this.showError('Select a task to delete'); return; }
        this.tasks = this.tasks.filter(t => t.id !== this.selectedId);
        this.selectedId = null;
        this.save();
        this.showSuccess('Task deleted');
        this.renderList();
    },

    clearAll: function() {
        if (!this.tasks.length) return;
        if (!confirm('Delete all tasks?')) return;
        this.tasks = [];
        this.selectedId = null;
        this.save();
        this.showSuccess('All tasks cleared');
        this.renderList();
    },

    save: function() { Storage.save('app_tasks', this.tasks); },

    showError: function(msg) {
        const e = document.getElementById('todoError');
        if (e) { e.textContent = msg; e.classList.add('show'); }
        setTimeout(() => { if (e) e.classList.remove('show'); }, 3000);
    },

    showSuccess: function(msg) {
        const e = document.getElementById('todoSuccess');
        if (e) { e.textContent = msg; e.classList.add('show'); }
        setTimeout(() => { if (e) e.classList.remove('show'); }, 2000);
    }
};
