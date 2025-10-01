from src.config.database import db

class Exame(db.Model):
    __tablename__ = "exames"
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), unique=True, nullable=False)
    descricao = db.Column(db.Text)

    agendamentos = db.relationship("Agendamento", back_populates="exame")
