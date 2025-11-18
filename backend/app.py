# app.py
from flask import Flask, jsonify, request
from dotenv import load_dotenv
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from src.config.database import init_db
from src.application.controllers.cat_controller import cat_bp
from src.application.controllers.usuario_controller import usuario_bp
from src.application.controllers.exame_controller import exame_bp
from src.application.controllers.cargo_controller import cargo_bp
from src.application.controllers.risco_controller import risco_bp
from src.application.controllers.dashboard_controller import dashboard_bp
import os

load_dotenv()

def create_app():
    app = Flask(__name__)

    # Configurações
    DB_USER = os.getenv('DB_USER')
    DB_PASSWORD = os.getenv('DB_PASSWORD')
    DB_HOST = os.getenv('DB_HOST', 'db')
    DB_PORT = os.getenv('DB_PORT', '3306')
    DB_NAME = os.getenv('DB_NAME')

    app.config['SQLALCHEMY_DATABASE_URI'] = (
        f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET', 'defaultsecret')

    # CORS - mais robusto
    CORS(
        app,
        origins=["http://localhost:3000", "http://127.0.0.1:3000"],
        supports_credentials=True,
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allow_headers=[
            "Content-Type", "Authorization", "Access-Control-Allow-Origin",
            "Access-Control-Allow-Headers", "X-Requested-With"
        ],
        expose_headers=["Content-Type", "Authorization", "Content-Disposition"], 
        max_age=3600
    )

    @app.before_request
    def handle_options():
        if request.method == 'OPTIONS':
            response = jsonify({'status': 'preflight'})
            response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
            response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
            response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
            response.headers.add('Access-Control-Allow-Credentials', 'true')
            return response

    # Inicializa banco
    init_db(app)

    # Configura JWT depois do init_db (evita circular imports)
    jwt = JWTManager(app)

    # import dinâmico do modelo de usuário — evita import cycles no topo do arquivo
    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        """
        Callback para carregar usuário automaticamente do banco
        Import feito localmente para evitar ciclos de importação.
        """
        try:
            from src.infrastructure.model.usuario_model import UsuarioModel
            identity = jwt_data.get("sub")
            return UsuarioModel.query.get(identity)
        except Exception:
            return None

    # Registra blueprints apenas se ainda não registrados
    # (Protege contra registro duplo que causa AssertionError)
    blueprints_to_register = [
        (usuario_bp, "/api/usuarios"),
        (exame_bp, "/api/exames"),
        (cargo_bp, "/api/cargos"),
        (risco_bp, "/api/riscos"),
        (dashboard_bp, "/api/dashboard"),
        (cat_bp, "/api/cats"),

    ]

    for bp, prefix in blueprints_to_register:
        if bp.name not in app.blueprints:
            app.register_blueprint(bp, url_prefix=prefix)

    # Health check
    @app.route("/health")
    def health():
        try:
            from src.config.database import db
            db.session.execute('SELECT 1')
            return {"status": "ok", "database": "connected"}, 200
        except Exception as e:
            return {"status": "error", "database": "disconnected", "error": str(e)}, 500

    @app.route("/api")
    def api_info():
        return {
            "name": "SSO Management API",
            "version": "1.0.0",
            "endpoints": {
                "usuarios": "/api/usuarios",
                "exames": "/api/exames",
                "cargos": "/api/cargos",
                "riscos": "/api/riscos"
            }
        }

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Endpoint não encontrado"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Erro interno do servidor"}), 500

    return app

# Cria app apenas quando o módulo é executado — evita side-effects em imports
app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
