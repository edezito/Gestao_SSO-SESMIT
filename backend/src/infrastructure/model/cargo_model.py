from src.config.database import db

# associativa many-to-many cargo <-> risco
cargos_riscos = db.Table(
    "cargos_riscos",
    db.Column("cargo_id", db.Integer, db.ForeignKey("cargos.id"), primary_key=True),
    db.Column("risco_id", db.Integer, db.ForeignKey("riscos.id"), primary_key=True)
)

class CargoModel(db.Model):
    __tablename__ = "cargos"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120), nullable=False, unique=True)
    descricao = db.Column(db.Text)
    ativo = db.Column(db.Boolean, default=True)

    # riscos associados ao cargo
    riscos = db.relationship("RiscoModel", secondary=cargos_riscos, backref="cargos")

    # relacionamento inverso: usuarios que ocupam esse cargo
    colaboradores = db.relationship("UsuarioModel", backref="cargo", lazy="dynamic")