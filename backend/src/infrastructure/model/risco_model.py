from src.config.database import db

# tabela intermediária risco <-> exame obrigatório
riscos_exames = db.Table(
    "riscos_exames",
    db.Column("risco_id", db.Integer, db.ForeignKey("riscos.id"), primary_key=True),
    db.Column("exame_id", db.Integer, db.ForeignKey("exames.id"), primary_key=True)
)

class RiscoModel(db.Model):
    __tablename__ = "riscos"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120), nullable=False)
    descricao = db.Column(db.Text)
    severidade = db.Column(db.Enum("BAIXA", "MEDIA", "ALTA", name="risco_severidade"), default="MEDIA")

    programa_id = db.Column(db.Integer, db.ForeignKey("programas_risco.id"))
    programa = db.relationship("ProgramaRiscoModel", back_populates="riscos")

    # exames obrigatórios para este risco (associa com a tabela exames já existente)
    exames_obrigatorios = db.relationship("Exame", secondary=riscos_exames, backref="riscos_associados")