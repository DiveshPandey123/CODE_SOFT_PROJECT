// Main app controller
const App = {
    currentApp: 'calculator',
    apps: {
        calculator: Calculator,
        contacts: Contacts,
        password: PasswordGenerator,
        rps: RPS,
        todos: TodoList
    },
    
    init: function() {
        this.setupNavigation();
        this.loadApp('calculator');
    },
    
    setupNavigation: function() {
        const navLinks = document.querySelectorAll('.nav-link');
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');
        
        // Mobile menu toggle
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        
        // Navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const appName = link.dataset.app;
                this.loadApp(appName);
                
                // Close mobile menu
                navMenu.classList.remove('active');
            });
        });
    },
    
    loadApp: function(appName) {
        if (!this.apps[appName]) return;
        
        this.currentApp = appName;
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.app === appName) {
                link.classList.add('active');
            }
        });
        
        // Load app content
        const container = document.getElementById('appContainer');
        container.innerHTML = '';
        
        const app = this.apps[appName];
        if (app.render) {
            container.appendChild(app.render());
        }
        
        if (app.init) {
            app.init();
        }
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
