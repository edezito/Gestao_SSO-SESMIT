from src.infrastructure.model.exame_model import Exame
from src.config.database import db

class ExameService:

    @staticmethod
    def criar(nome, descricao=None):
        exame = Exame(nome=nome, descricao=descricao)
        db.session.add(exame)
        db.session.commit()
        return exame

    @staticmethod
    def listar():
        return Exame.query.all()

    @staticmethod
    def buscar_por_cargo(cargo):
        return cargo.exames