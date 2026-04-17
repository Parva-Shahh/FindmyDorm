# Start of code

from flask import Flask

# Create an application object – instance of class Flask(imported at line 1)

app = Flask(__name__)

# __name__ is a predefined Python variable – set to the name of the module in which it is used

# imports routes from the app (won’t exist when you start – you will create it)

from app import routes

# End of code