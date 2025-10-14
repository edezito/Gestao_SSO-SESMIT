from src.config.database import db

class ProgramaRiscoModel(db.Model):
    __tablename__ = "programas_risco"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), unique=True, nullable=False)  # ex: PCMSO, PGR, LTCAT
    descricao = db.Column(db.Text)

    riscos = db.relationship("RiscoModel", back_populates="programa", cascade="all, delete-orphan")