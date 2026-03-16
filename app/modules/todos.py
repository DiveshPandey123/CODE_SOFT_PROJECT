from flask import Blueprint, request, jsonify
import uuid

todos_bp = Blueprint('todos', __name__, url_prefix='/api/todos')

# In-memory storage (will be replaced with localStorage on frontend)
todos_store = {}

@todos_bp.route('', methods=['GET'])
def get_tasks():
    """Get all tasks"""
    return jsonify(list(todos_store.values()))

@todos_bp.route('', methods=['POST'])
def add_task():
    """Add new task"""
    data = request.get_json()
    description = data.get('description', '').strip()
    
    if not description:
        return jsonify({'error': 'Task cannot be empty'}), 400
    
    task_id = str(uuid.uuid4())
    task = {
        'id': task_id,
        'description': description,
        'completed': False
    }
    todos_store[task_id] = task
    return jsonify(task), 201

@todos_bp.route('/<task_id>', methods=['PUT'])
def update_task(task_id):
    """Update task"""
    if task_id not in todos_store:
        return jsonify({'error': 'Task not found'}), 404
    
    data = request.get_json()
    task = todos_store[task_id]
    
    if 'description' in data:
        task['description'] = data['description'].strip()
    if 'completed' in data:
        task['completed'] = data['completed']
    
    return jsonify(task)

@todos_bp.route('/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Delete task"""
    if task_id not in todos_store:
        return jsonify({'error': 'Task not found'}), 404
    
    del todos_store[task_id]
    return jsonify({'success': True})

@todos_bp.route('/clear', methods=['POST'])
def clear_all():
    """Clear all tasks"""
    todos_store.clear()
    return jsonify({'success': True})
