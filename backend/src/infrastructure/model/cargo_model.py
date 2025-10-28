from src.config.database import db
from datetime import datetime, timezone

# Tabela de Associação N:N entre Cargo e Risco (NOVA)
cargo_risco_assoc = db.Table('cargo_risco_assoc',
    db.Column('cargo_id', db.Integer, db.ForeignKey('cargos.id'), primary_key=True),
    db.Column('risco_id', db.Integer, db.ForeignKey('riscos.id'), primary_key=True)
)

# Tabela de Associação N:N entre Cargo e Exame (Correção da Tarefa 1.1)
cargo_exame_assoc = db.Table('cargo_exame_assoc',
    db.Column('cargo_id', db.Integer, db.ForeignKey('cargos.id'), primary_key=True),
    db.Column('exame_id', db.Integer, db.ForeignKey('exames.id'), primary_key=True)
)

class CargoModel(db.Model):
    __tablename__ = 'cargos'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False, unique=True)
    descricao = db.Column(db.Text, nullable=True)

    # Relacionamento com usuários
    usuarios = db.relationship("UsuarioModel", back_populates="cargo", lazy='subquery')

    # 1. NOVO RELACIONAMENTO: Riscos Associados (Tarefa 5)
    riscos_associados = db.relationship("Risco", 
        secondary=cargo_risco_assoc,
        backref=db.backref("cargos_associados", lazy='dynamic'),
        lazy='subquery'
    )
    
    # 2. RELACIONAMENTO EXISTENTE: Exames Exigidos (Para lógica de agendamento automático)
    exames_exigidos = db.relationship("Exame", 
        secondary=cargo_exame_assoc,
        backref=db.backref("cargos_que_exigem", lazy='dynamic'),
        lazy='subquery'
    )

    def __repr__(self):
        return f'<Cargo {self.nome}>'