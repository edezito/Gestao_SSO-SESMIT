from src.infrastructure.model.programa_risco_model import ProgramaRiscoModel
from src.config.database import db

class ProgramaRiscoService:
    @staticmethod
    def criar(nome, descricao=None):
        prog = ProgramaRiscoModel(nome=nome, descricao=descricao)
        db.session.add(prog)
        db.session.commit()
        return prog

    @staticmethod
    def listar():
        return ProgramaRiscoModel.query.all()

    @staticmethod
    def buscar_por_id(prog_id):
        return ProgramaRiscoModel.query.get(prog_id)

    @staticmethod
    def atualizar(prog_id, **kwargs):
        prog = ProgramaRiscoModel.query.get(prog_id)
        if not prog:
            return None
        for k,v in kwargs.items():
            if hasattr(prog, k):
                setattr(prog, k, v)
        db.session.commit()
        return prog

    @staticmethod
    def deletar(prog_id):
        prog = ProgramaRiscoModel.query.get(prog_id)
        if not prog:
            return False
        db.session.delete(prog)
        db.session.commit()
        return True