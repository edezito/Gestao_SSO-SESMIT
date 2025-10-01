from src.config.database import db
from datetime import datetime

class Agendamento(db.Model):
    __tablename__ = 'agendamentos'
    
    id = db.Column(db.Integer, primary_key=True)
    colaborador_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    exame_id = db.Column(db.Integer, db.ForeignKey('exames.id'), nullable=False)
    tipo_exame = db.Column(db.String(50), nullable=False)  # ADMISSIONAL, PERIODICO, ETC
    data_agendamento = db.Column(db.DateTime, nullable=False)
    data_realizacao = db.Column(db.DateTime, nullable=True)
    observacoes = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default='AGENDADO')  # AGENDADO, REALIZADO, CANCELADO
    
    # Relacionamentos
    colaborador = db.relationship('UsuarioModel', back_populates='agendamentos', lazy='joined')
    exame = db.relationship('Exame', back_populates='agendamentos', lazy='joined')
    
    def __repr__(self):
        return f'<Agendamento {self.id} - {self.tipo_exame}>'