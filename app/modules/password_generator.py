from flask import Blueprint, request, jsonify
import random
import string

password_bp = Blueprint('password', __name__, url_prefix='/api/password')

def validate_length(length):
    """Validate password length"""
    try:
        length = int(length)
        if length <= 0:
            return None, "Length must be a positive number"
        return length, None
    except (ValueError, TypeError):
        return None, "Length must be a valid number"

def generate_password(length, use_upper, use_lower, use_numbers, use_symbols):
    """Generate random password"""
    if not any([use_upper, use_lower, use_numbers, use_symbols]):
        return None, "Select at least one character type"
    
    chars = ''
    if use_upper:
        chars += string.ascii_uppercase
    if use_lower:
        chars += string.ascii_lowercase
    if use_numbers:
        chars += string.digits
    if use_symbols:
        chars += string.punctuation
    
    password = ''.join(random.choice(chars) for _ in range(length))
    return password, None

def calculate_strength(password):
    """Calculate password strength"""
    length = len(password)
    if length < 6:
        return "Weak"
    elif length <= 10:
        return "Medium"
    else:
        return "Strong"

@password_bp.route('/generate', methods=['POST'])
def generate():
    """Generate password"""
    data = request.get_json()
    
    length, error = validate_length(data.get('length', 12))
    if error:
        return jsonify({'error': error}), 400
    
    password, error = generate_password(
        length,
        data.get('uppercase', False),
        data.get('lowercase', False),
        data.get('numbers', False),
        data.get('symbols', False)
    )
    
    if error:
        return jsonify({'error': error}), 400
    
    strength = calculate_strength(password)
    return jsonify({
        'password': password,
        'strength': strength,
        'length': length
    })
