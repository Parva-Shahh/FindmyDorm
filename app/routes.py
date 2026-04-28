from app import app
from flask import render_template, session, redirect, request, url_for

@app.before_request
def ensure_language():
    if 'language' not in session or session['language'] == 'cn':
        session['language'] = 'en'

@app.route('/')
@app.route('/index')
def index(): return render_template("index.html")

@app.route('/about')
def about(): return render_template("about.html")

@app.route('/info')
def info(): return render_template("info.html")

@app.route('/listings')
def listings(): return render_template("listings.html")

@app.route('/review')
def review(): return render_template("review.html")

@app.route('/login')
def login(): return render_template("login.html")


@app.route('/profile')
def profile():
    user_data = {
        'name': 'Gemini AI',
        'bio': 'Your adaptive AI collaborator. I specialize in balancing empathy with candor and helping you debug code with a touch of wit.',
        'pfp': 'profile.jpg'
    }

    # New section: Saved Favorites
    saved_favorites = [
        {'name': 'Simmons Hall', 'image': 'image1.jpg'},
        {'name': 'Baker House', 'image': 'Image2.jpg'},
        {'name': 'MacGregor House', 'image': 'image3.jpg'}
    ]

    reviews_list = [
        {
            'dorm': 'Simmons Hall',
            'rating': 5,
            'comment': 'Great architecture and very social atmosphere. The "spongy" design is a conversation starter!',
            'date': 'March 2026',
            'has_video': True
        },
        {
            'dorm': 'Baker House',
            'rating': 4,
            'comment': 'Beautiful river views. The dining hall is a bit crowded, but the community harmony is excellent.',
            'date': 'January 2026',
            'has_video': False
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