from src.config.database import db

class ProgramaRisco(db.Model):
    __tablename__ = "programas_risco"
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(80), nullable=False, unique=True)
    descricao = db.Column(db.Text, nullable=True)
    ativo = db.Column(db.Boolean, default=True)