from flask import Flask

app = Flask(__name__, static_folder="../hermesfrontend", static_url_path="/")
