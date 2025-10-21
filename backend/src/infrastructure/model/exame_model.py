from time import timezone
from src.config.database import db
from datetime import datetime
class Exame(db.Model):
    __tablename__ = "exames"
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), unique=True, nullable=False)
    descricao = db.Column(db.Text)
    
    colaborador_id = db.Column(db.Integer, db.ForeignKey("usuarios.id"), nullable=False)
    tipo_exame = db.Column(db.Enum('ADMISSIONAL', 'PERIODICO', 'RETORNO', 'DEMISSIONAL', name="tipo_exame"), nullable=False)
    data_agendamento = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc))
    data_realizacao = db.Column(db.DateTime)
    observacoes = db.Column(db.Text)
    
    @property
    def status(self):
        if not self.data_realizacao:
            if self.data_agendamento < datetime.now(timezone.utc)():
                return "VENCIDO"
            return "PENDENTE"
        return "REALIZADO"

    colaborador = db.relationship("UsuarioModel", backref="exames")