from flask import Blueprint, request, jsonify
import random

rps_bp = Blueprint('rps', __name__, url_prefix='/api/rps')

# Game state
game_state = {
    'user_score': 0,
    'computer_score': 0
}

def get_computer_choice():
    """Get random computer choice"""
    return random.choice(['rock', 'paper', 'scissors'])

def determine_winner(user_choice, computer_choice):
    """Determine winner of round"""
    user_choice = user_choice.lower()
    computer_choice = computer_choice.lower()
    
    if user_choice == computer_choice:
        return 'tie'
    
    if user_choice == 'rock' and computer_choice == 'scissors':
        return 'win'
    elif user_choice == 'paper' and computer_choice == 'rock':
        return 'win'
    elif user_choice == 'scissors' and computer_choice == 'paper':
        return 'win'
    else:
        return 'lose'

@rps_bp.route('/play', methods=['POST'])
def play():
    """Play one round"""
    data = request.get_json()
    user_choice = data.get('choice', '').lower()
    
    if user_choice not in ['rock', 'paper', 'scissors']:
        return jsonify({'error': 'Invalid choice'}), 400
    
    computer_choice = get_computer_choice()
    result = determine_winner(user_choice, computer_choice)
    
    if result == 'win':
        game_state['user_score'] += 1
    elif result == 'lose':
        game_state['computer_score'] += 1
    
    return jsonify({
        'user_choice': user_choice,
        'computer_choice': computer_choice,
        'result': result,
        'user_score': game_state['user_score'],
        'computer_score': game_state['computer_score']
    })

@rps_bp.route('/scores', methods=['GET'])
def get_scores():
    """Get current scores"""
    return jsonify(game_state)

@rps_bp.route('/reset', methods=['POST'])
def reset():
    """Reset scores"""
    game_state['user_score'] = 0
    game_state['computer_score'] = 0
    return jsonify(game_state)
