# Arquivo: src/config/database.py (Atualizado)

from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()
migrate = Migrate() 

def init_db(app):
    """
    Inicializa o banco de dados e as extensões com a aplicação Flask.
    """
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    with app.app_context():
        try:
            from src.infrastructure.model.usuario_model import UsuarioModel
            from src.infrastructure.model.exame_model import Exame
            
            db.create_all()
            print("✅ Banco de dados inicializado e tabelas criadas com sucesso")
        except Exception as e:
            print(f"❌ Erro ao criar tabelas: {e}")
