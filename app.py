from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os
import json
from datetime import datetime

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

# Import application modules
from app.modules.calculator import calculator_bp
from app.modules.contacts import contacts_bp
from app.modules.password_generator import password_bp
from app.modules.rps import rps_bp
from app.modules.todos import todos_bp

# Register blueprints
app.register_blueprint(calculator_bp)
app.register_blueprint(contacts_bp)
app.register_blueprint(password_bp)
app.register_blueprint(rps_bp)
app.register_blueprint(todos_bp)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/health')
def health():
    return jsonify({'status': 'ok', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
