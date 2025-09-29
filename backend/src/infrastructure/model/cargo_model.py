from src.config.database import db

riscos_cargos = db.Table(
    "riscos_cargos",
    db.Column("cargo_id", db.Integer, db.ForeignKey("cargos.id"), primary_key=True),
    db.Column("risco_id", db.Integer, db.ForeignKey("riscos.id"), primary_key=True),
)

exames_cargos = db.Table(
    "exames_cargos",
    db.Column("cargo_id", db.Integer, db.ForeignKey("cargos.id"), primary_key=True),
    db.Column("exame_id", db.Integer, db.ForeignKey("exames.id"), primary_key=True),
)

class Cargo(db.Model):
    __tablename__ = "cargos"
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), unique=True, nullable=False)

    riscos = db.relationship("Risco", secondary=riscos_cargos, backref="cargos")
    exames = db.relationship("Exame", secondary=exames_cargos, backref="cargos")