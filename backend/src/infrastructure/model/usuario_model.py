from src.config.database import db
from datetime import datetime, timezone
class UsuarioModel(db.Model):
    __tablename__ = 'usuarios'
    __table_args__ = {'extend_existing': True}  #

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    senha = db.Column(db.String(255), nullable=False)
    perfil = db.Column(db.Enum('COLABORADOR', 'SESMIT', 'GESTOR', 'CIPA'), nullable=False)
    ativo = db.Column(db.Boolean, default=True)
    criado_em = db.Column(db.DateTime, default=datetime.now(timezone.utc))


