from app import app
from flask import render_template, session, redirect, request, url_for
from flask_babel import _

@app.before_request
def ensure_language():
    if 'language' not in session:
        session['language'] = 'en'

@app.route('/')
@app.route('/index')
def index():
    return render_template("index.html")

@app.route('/about')
def about():
    return render_template("about.html")

# --- MISSING ROUTES ADDED BELOW ---

@app.route('/listings')
def listings():
    # Placeholder until you create listings.html
    return render_template("index.html")

@app.route('/review')
def review():
    # Placeholder until you create review.html
    return render_template("index.html")

@app.route('/login')
def login():
    # Placeholder until you create login.html
    return render_template("index.html")

# ----------------------------------

@app.route('/profile')
def profile():
    user_data = {
        'name': 'Resident User',
        'bio': 'Living the dorm life since 2024. Architecture enthusiast and coffee lover.',
        'pfp': 'profile.jpg'
    }
    saved_favorites = [
        {'name': 'Simmons Hall', 'image': 'image1.jpg'},
        {'name': 'Baker House', 'image': 'Image2.jpg'},
        {'name': 'MacGregor House', 'image': 'image4.jpg'}
    ]
    reviews_list = [
        {
            'dorm': 'Simmons Hall',
            'rating': 5,
            'comment': 'Great architecture and very social atmosphere!',
            'date': 'March 2026',
            'has_video': True
        }
    ]
    return render_template("profile.html", user=user_data, reviews=reviews_list, favorites=saved_favorites)

@app.route('/set_language/<lang_code>')
def set_language(lang_code):
    if lang_code == 'cn':
        lang_code = 'zh'
    if lang_code in ['en', 'zh', 'de']:
        session['language'] = lang_code
    return redirect(request.referrer or url_for('index'))