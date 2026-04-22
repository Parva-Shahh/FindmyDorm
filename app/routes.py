from app import app
from flask import render_template, session, redirect, request

#Starts, website function
@app.route('/')

#Routes to Home page - Parva
@app.route('/index')
def index():
    return (render_template("index.html"))

#Routes to review - Garreth
@app.route('/review')
def review():
    return (render_template ("review.html"))

#Routes to About page - Alex
@app.route('/about')
def about():
    return (render_template ("about.html"))

#Routes to Listings page - Nathaniel
@app.route('/listings')
def listings():
        return (render_template ("listings.html"))

#Routes to Profile page - Alex
@app.route('/profile')
def profile():
    return (render_template ("profile.html"))

#Routes to Login page - Garreth
@app.route('/login')
def login():
    return (render_template ("login.html"))

@app.route('/setlang/<lang_code>')
def set_language(lang_code):
    # If the language matches one of the languages we are facilitating
    # Change the value of the language variable in session to that
    if lang_code in ['en', 'cn', 'de']:
        session['language'] = lang_code
    # Redirect the page to the page from which the language change
    # request was made
    return redirect(request.referrer or '/')

# Before each request to the app, check if the language variable
# in session has a value. If not set it to English.
@app.before_request
def set_session_language():
    if 'language' not in session:
        session['language'] = 'en' # Set default language here