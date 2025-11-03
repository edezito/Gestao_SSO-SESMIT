from src.config.database import db
from datetime import datetime

class CATModel(db.Model):
    __tablename__ = "cats"

    id = db.Column(db.Integer, primary_key=True)
    colaborador_id = db.Column(db.Integer, db.ForeignKey("usuarios.id"), nullable=False)
    cargo_id = db.Column(db.Integer, db.ForeignKey("cargos.id"), nullable=False)

    data_acidente = db.Column(db.DateTime, nullable=False)
    local_acidente = db.Column(db.String(255), nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    testemunhas = db.Column(db.String(255))
    tipo_acidente = db.Column(db.String(100))
    comunicante = db.Column(db.String(255))
    status = db.Column(db.String(50), default="EM ABERTO")
    criado_em = db.Column(db.DateTime, default=datetime.utcnow)

    colaborador = db.relationship("UsuarioModel", backref="cats")
    cargo = db.relationship("CargoModel")

    def to_dict(self):
        return {
            "id": self.id,
            "colaborador_id": self.colaborador_id,
            "colaborador_nome": self.colaborador.nome if self.colaborador else None,
            "cargo_id": self.cargo_id,
            "cargo_nome": self.cargo.nome if self.cargo else None,
            "data_acidente": self.data_acidente.isoformat() if self.data_acidente else None,
            "local_acidente": self.local_acidente,
            "descricao": self.descricao,
            "testemunhas": self.testemunhas,
            "tipo_acidente": self.tipo_acidente,
            "comunicante": self.comunicante,
            "status": self.status,
            "criado_em": self.criado_em.isoformat() if self.criado_em else None,
        }