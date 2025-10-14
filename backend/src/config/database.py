from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager


# Inicialização das extensões
db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()

def init_db(app):
    """
    Inicializa o banco de dados e cria todas as tabelas.
    Deve ser chamado após criar o app Flask.
    """
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    with app.app_context():
        try:
            from src.infrastructure.model.usuario_model import UsuarioModel
            from src.infrastructure.model.exame_model import Exame
            from src.infrastructure.model.programa_risco_model import ProgramaRiscoModel
            from src.infrastructure.model.risco_model import RiscoModel
            from src.infrastructure.model.cargo_model import CargoModel
            
            db.create_all()
            print("✅ Banco de dados inicializado e tabelas criadas com sucesso")
        except Exception as e:
            print(f"❌ Erro ao criar tabelas: {e}")
