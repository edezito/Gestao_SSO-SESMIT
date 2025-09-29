from flask import Flask
from dotenv import load_dotenv
from flask_cors import CORS  # <--- Import CORS
from src.config.database import init_db
from src.application.controllers.usuario_controller import usuario_bp
from src.application.controllers.programa_risco_controller import programa_bp
from src.application.controllers.risco_controller import risco_bp
from src.application.controllers.exame_controller import exame_bp
from src.application.controllers.cargo_controller import cargo_bp
from src.application.controllers.dashboard_controller import dashboard_bp
import os

load_dotenv()

def create_app():
    app = Flask(__name__)

    # Configurações
    DB_USER = os.getenv('DB_USER')
    DB_PASSWORD = os.getenv('DB_PASSWORD')
    DB_HOST = os.getenv('DB_HOST')
    DB_PORT = os.getenv('DB_PORT')
    DB_NAME = os.getenv('DB_NAME')

    app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET')

    # Habilita CORS para todas as origens (pode restringir depois para frontend específico)
    CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

    # Inicializa banco e extensões
    init_db(app)

    # Registrar Blueprints
    app.register_blueprint(usuario_bp)
    app.register_blueprint(programa_bp)
    app.register_blueprint(risco_bp)
    app.register_blueprint(exame_bp)
    app.register_blueprint(cargo_bp)
    app.register_blueprint(dashboard_bp)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000)
