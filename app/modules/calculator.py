from flask import Blueprint, request, jsonify
import re

calculator_bp = Blueprint('calculator', __name__, url_prefix='/api/calculator')

def validate_expression(expr):
    """Validate mathematical expression syntax"""
    expr = expr.strip()
    if not expr:
        return False, "Expression cannot be empty"
    
    # Allow only numbers, operators, and parentheses
    if not re.match(r'^[\d+\-*/(). ]+$', expr):
        return False, "Invalid characters in expression"
    
    # Check for incomplete operations
    if expr.endswith(('+', '-', '*', '/')):
        return False, "Expression cannot end with an operator"
    
    return True, None

def evaluate_expression(expr):
    """Safely evaluate mathematical expression"""
    try:
        # Check for division by zero
        if '/0' in expr.replace(' ', ''):
            return None, "Cannot divide by zero"
        
        result = eval(expr)
        return result, None
    except ZeroDivisionError:
        return None, "Cannot divide by zero"
    except Exception as e:
        return None, f"Invalid expression: {str(e)}"

@calculator_bp.route('/evaluate', methods=['POST'])
def evaluate():
    data = request.get_json()
    expr = data.get('expression', '').strip()
    
    valid, error = validate_expression(expr)
    if not valid:
        return jsonify({'error': error}), 400
    
    result, error = evaluate_expression(expr)
    if error:
        return jsonify({'error': error}), 400
    
    return jsonify({'result': result, 'expression': expr})
