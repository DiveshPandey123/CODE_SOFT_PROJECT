from flask import Blueprint, request, jsonify
import uuid

contacts_bp = Blueprint('contacts', __name__, url_prefix='/api/contacts')

# In-memory storage (will be replaced with localStorage on frontend)
contacts_store = {}

@contacts_bp.route('', methods=['GET'])
def get_contacts():
    """Get all contacts"""
    return jsonify(list(contacts_store.values()))

@contacts_bp.route('', methods=['POST'])
def add_contact():
    """Add new contact"""
    data = request.get_json()
    name = data.get('name', '').strip()
    phone = data.get('phone', '').strip()
    email = data.get('email', '').strip()
    address = data.get('address', '').strip()
    
    if not name or not phone:
        return jsonify({'error': 'Name and phone are required'}), 400
    
    contact_id = str(uuid.uuid4())
    contact = {
        'id': contact_id,
        'name': name,
        'phone': phone,
        'email': email,
        'address': address
    }
    contacts_store[contact_id] = contact
    return jsonify(contact), 201

@contacts_bp.route('/<contact_id>', methods=['PUT'])
def update_contact(contact_id):
    """Update contact"""
    if contact_id not in contacts_store:
        return jsonify({'error': 'Contact not found'}), 404
    
    data = request.get_json()
    contact = contacts_store[contact_id]
    
    if 'name' in data:
        contact['name'] = data['name'].strip()
    if 'phone' in data:
        contact['phone'] = data['phone'].strip()
    if 'email' in data:
        contact['email'] = data['email'].strip()
    if 'address' in data:
        contact['address'] = data['address'].strip()
    
    return jsonify(contact)

@contacts_bp.route('/<contact_id>', methods=['DELETE'])
def delete_contact(contact_id):
    """Delete contact"""
    if contact_id not in contacts_store:
        return jsonify({'error': 'Contact not found'}), 404
    
    del contacts_store[contact_id]
    return jsonify({'success': True})

@contacts_bp.route('/search', methods=['GET'])
def search_contacts():
    """Search contacts by name or phone"""
    query = request.args.get('q', '').lower()
    if not query:
        return jsonify(list(contacts_store.values()))
    
    results = [c for c in contacts_store.values() 
               if query in c['name'].lower() or query in c['phone'].lower()]
    return jsonify(results)
