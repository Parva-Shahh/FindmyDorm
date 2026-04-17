from app import app
from flask import render_template, session, redirect, request

@app.route('/')

@app.route('/index')
def index():
    return (render_template("index.html"))

@app.route('/about')
def about():
    return (render_template ("about.html"))

@app.route('/products')
def products():
        return (render_template ("products.html"))

@app.route('/store')
def store():
        return (render_template ("store.html"))

@app.route('/setlang/<lang_code>')
def set_language(lang_code):
# If the language mataches one of the languages we are facilitating
# Change the value of the language variable in session to that
    if lang_code in ['en', 'fr', 'de']:
        session['language'] = lang_code
# Redirect the page to the page from which the language change
# request was made
    return redirect(request.referrer or '/')

# Before each request to the app, check if the language variable
# in session has a value. If not set it to English
@app.before_request
def set_session_language():
    if 'language' not in session:
        session['language'] = 'en' # Set default language here

