from flask import Flask, send_from_directory, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import pandas as pd
import os
from datetime import datetime

app = Flask(__name__, static_folder='.')


# Initialize Excel files if they don't exist
def init_excel_files():
    if not os.path.exists('users.xlsx'):
        df = pd.DataFrame(
            columns=['name', 'email', 'password', 'points', 'created_at'])
        df.to_excel('users.xlsx', index=False)

    if not os.path.exists('coupons.xlsx'):
        df = pd.DataFrame(
            columns=['company', 'code', 'points', 'user_email', 'created_at'])
        df.to_excel('coupons.xlsx', index=False)


init_excel_files()


@app.route('/')
def home():
    return send_from_directory('.', 'index.html')


@app.route('/map')
def map():
    return send_from_directory('.', 'map.html')


@app.route('/contact')
def contact():
    return send_from_directory('.', 'contact.html')


@app.route('/donate')
def donate():
    return send_from_directory('.', 'donate.html')


@app.route('/rewards')
def rewards():
    return send_from_directory('.', 'rewards.html')


@app.route('/login')
def login_page():
    return send_from_directory('.', 'login.html')


@app.route('/signup')
def signup_page():
    return send_from_directory('.', 'signup.html')


@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)


@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()

    # Read existing users
    users_df = pd.read_excel('users.xlsx')

    # Check if email already exists
    if data['email'] in users_df['email'].values:
        return jsonify({
            'success': False,
            'message': 'Email already registered'
        })

    # Create new user
    new_user = pd.DataFrame({
        'name': [data['name']],
        'email': [data['email']],
        'password': [generate_password_hash(data['password'])],
        'points': [0],
        'created_at': [datetime.now()]
    })

    # Append new user to Excel file
    users_df = pd.concat([users_df, new_user], ignore_index=True)
    users_df.to_excel('users.xlsx', index=False)

    return jsonify({'success': True})


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()

    # Read users from Excel
    users_df = pd.read_excel('users.xlsx')

    # Find user by email
    user = users_df[users_df['email'] == data['email']]

    if user.empty:
        return jsonify({'success': False, 'message': 'User not found'})

    # Check password
    if check_password_hash(user['password'].iloc[0], data['password']):
        return jsonify({'success': True})

    return jsonify({'success': False, 'message': 'Invalid password'})


@app.route('/api/save_coupon', methods=['POST'])
def save_coupon():
    data = request.get_json()

    # Read existing coupons
    coupons_df = pd.read_excel('coupons.xlsx')

    # Creating a new coupon entry
    new_coupon = pd.DataFrame({
        'company': [data['company']],
        'code': [data['code']],
        'points': [data['points']],
        'user_email': [request.headers.get('X-User-Email')],
        'created_at': [datetime.now()]
    })

    # Append new coupon to Excel file
    coupons_df = pd.concat([coupons_df, new_coupon], ignore_index=True)
    coupons_df.to_excel('coupons.xlsx', index=False)

    return jsonify({'success': True})


@app.route('/api/contact', methods=['POST'])
def handle_contact():
    data = request.json

    # For now, we'll just return a success message
    return jsonify({'message': 'Message received successfully'})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
