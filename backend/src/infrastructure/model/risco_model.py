from src.config.database import db

risco_exame_assoc = db.Table('risco_exame_assoc',
    db.Column('risco_id', db.Integer, db.ForeignKey('riscos.id'), primary_key=True),
    db.Column('exame_id', db.Integer, db.ForeignKey('exames.id'), primary_key=True)
)

class Risco(db.Model):
    __tablename__ = "riscos"
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), unique=True, nullable=False)
    descricao = db.Column(db.Text)
    ativo = db.Column(db.Boolean, default=True)

    exames_obrigatorios = db.relationship("Exame",
        secondary=risco_exame_assoc,
        backref=db.backref("riscos_associados", lazy='dynamic'),
        lazy='subquery'
    )
    
    def __repr__(self):
        return f'<Risco {self.nome}>'