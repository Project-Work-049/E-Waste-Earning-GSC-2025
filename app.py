from flask import Flask, send_from_directory, request, jsonify, render_template
from werkzeug.security import generate_password_hash, check_password_hash
import pandas as pd
import os
from datetime import datetime

app = Flask(__name__)

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
@app.route('/index')
def home():
    return render_template('index.html')

@app.route('/map')
def map():
    return render_template('map.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/donate')
def donate():
    return render_template('donate.html')

@app.route('/rewards')
def rewards():
    return render_template('rewards.html')

@app.route('/login')
def login_page():
    return render_template('login.html')

@app.route('/signup')
def signup_page():
    return render_template('signup.html')

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    users_df = pd.read_excel('users.xlsx')

    if data['email'] in users_df['email'].values:
        return jsonify({'success': False, 'message': 'Email already registered'})

    new_user = pd.DataFrame({
        'name': [data['name']],
        'email': [data['email']],
        'password': [generate_password_hash(data['password'])],
        'points': [0],
        'created_at': [datetime.now()]
    })

    users_df = pd.concat([users_df, new_user], ignore_index=True)
    users_df.to_excel('users.xlsx', index=False)
    return jsonify({'success': True})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    users_df = pd.read_excel('users.xlsx')
    user = users_df[users_df['email'] == data['email']]

    if user.empty:
        return jsonify({'success': False, 'message': 'User not found'})

    if check_password_hash(user['password'].iloc[0], data['password']):
        return jsonify({'success': True})

    return jsonify({'success': False, 'message': 'Invalid password'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)