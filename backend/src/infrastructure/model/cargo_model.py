from src.config.database import db
from datetime import datetime, timezone

class CargoModel(db.Model):
    __tablename__ = 'cargos'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False, unique=True)
    descricao = db.Column(db.Text, nullable=True)

    # Relacionamento com usuários
    usuarios = db.relationship("UsuarioModel", back_populates="cargo", lazy='subquery')

    def __repr__(self):
        return f'<Cargo {self.nome}>'