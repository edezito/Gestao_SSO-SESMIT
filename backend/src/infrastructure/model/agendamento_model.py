from src.config.database import db
from datetime import datetime

class Agendamento(db.Model):
    __tablename__ = 'agendamentos'
    
    id = db.Column(db.Integer, primary_key=True)
    colaborador_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    exame_id = db.Column(db.Integer, db.ForeignKey('exames.id'), nullable=False)
    tipo_exame = db.Column(db.String(50), nullable=False)
    data_agendamento = db.Column(db.DateTime, nullable=False)
    data_realizacao = db.Column(db.DateTime, nullable=True)
    observacoes = db.Column(db.Text, nullable=True)
    
    colaborador = db.relationship('UsuarioModel', back_populates='agendamentos', lazy='joined')
    exame = db.relationship('Exame', back_populates='agendamentos', lazy='joined')
    

    @property
    def status(self):
        if self.data_realizacao:
            return "REALIZADO"
       
        if self.data_agendamento < datetime.utcnow(): 
            return "VENCIDO"
        return "PENDENTE"
    
    def __repr__(self):
        return f'<Agendamento {self.id} - {self.tipo_exame}>'