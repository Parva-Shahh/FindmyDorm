# Import the Flask application instance named 'app'
# This object was created in __init__.py
from app import app

# The @app.route decorator tells Flask which URL should trigger the function
# This route maps the root URL (http://localhost:5000/)

@app.route('/')

# Define a function named 'index'
# This function is called when a user visits '/'
def week1():
    # Return a simple text response to be displayed in the browser
    return "Hello, From Lab Class Week 1!"

@app.route('/about')
def about():
    return (render_template ("about.html"))

@app.route('/base')
def base():
    return (render_template ("base.html"))

@app.route('/home')
def home():
    return (render_template ("home.html"))

@app.route('/info')
def info():
    return (render_template ("info.html"))

@app.route('/listings')
def listings():
    return (render_template ("listings.html"))

@app.route('/profile')
def profile():
    return (render_template ("profile.html"))