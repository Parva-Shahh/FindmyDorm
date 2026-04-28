from flask import Flask, session
from flask_babel import Babel

app = Flask(__name__)
app.config['SECRET_KEY'] = 'dev-key-123'
app.config['BABEL_DEFAULT_LOCALE'] = 'en'

def get_locale():
    lang = session.get('language', 'en')
    return 'zh' if lang == 'cn' else lang

babel = Babel(app, locale_selector=get_locale)

from app import routes