from src.infrastructure.model.sso_model import ProgramaRisco
from src.config.database import db

class ProgramaRiscoService:

    @staticmethod
    def criar(nome, descricao=None):
        programa = ProgramaRisco(nome=nome, descricao=descricao)
        db.session.add(programa)
        db.session.commit()
        return programa

    @staticmethod
    def listar():
        return ProgramaRisco.query.filter_by(ativo=True).all()

    @staticmethod
    def atualizar(programa_id, nome=None, descricao=None):
        programa = ProgramaRisco.query.get(programa_id)
        if not programa:
            raise ValueError("Programa não encontrado")

        if nome: programa.nome = nome
        if descricao: programa.descricao = descricao

        db.session.commit()
        return programa

    @staticmethod
    def desativar(programa_id):
        programa = ProgramaRisco.query.get(programa_id)
        if not programa:
            raise ValueError("Programa não encontrado")
        programa.ativo = False
        db.session.commit()
        return programa