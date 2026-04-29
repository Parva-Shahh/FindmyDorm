from app import app
from flask import render_template, session, redirect, request, jsonify

@app.route('/')
@app.route('/index')
def index():
    return render_template("index.html")

@app.route('/review')
def review():
    return render_template("review.html")

@app.route('/about')
def about():
    return render_template("about.html")

@app.route('/listings')
def listings():
    pre_uni    = request.args.get('uni', '')
    pre_type   = request.args.get('type', '')
    pre_search = request.args.get('search', '')
    return render_template("listings.html",
        pre_uni=pre_uni, pre_type=pre_type, pre_search=pre_search)

@app.route('/login')
def login():
    return render_template("login.html")

@app.route('/info')
def info():
    current_user = {'saved_dorms': []}
    return render_template("info.html", current_user=current_user)

@app.route('/profile')
def profile():
    return render_template("profile.html")

@app.route('/set_language/<lang_code>')
def set_language(lang_code):
    if lang_code in ['en', 'zh', 'de']:
        session['language'] = lang_code
    return redirect(request.referrer or '/')

@app.before_request
def set_session_language():
    if 'language' not in session:
        session['language'] = 'en'

# /save — toggles bookmark state in session so clicking again unbookmarks
@app.route('/save', methods=['POST'])
def save():
    data = request.get_json(silent=True) or {}
    dorm_id = data.get('dorm_id', '')
    if not dorm_id:
        return jsonify({'saved': False, 'dorm_id': dorm_id})
    saved = session.get('saved_dorms', [])
    if dorm_id in saved:
        saved.remove(dorm_id)
        is_saved = False
    else:
        saved.append(dorm_id)
        is_saved = True
    session['saved_dorms'] = saved
    return jsonify({'saved': is_saved, 'dorm_id': dorm_id})