from src.infrastructure.model.risco_model import RiscoModel
from src.infrastructure.model.exame_model import Exame
from src.config.database import db

class RiscoService:
    @staticmethod
    def criar(nome, descricao=None, severidade="MEDIA", programa_id=None, exames_obrigatorios_ids=None):
        risco = RiscoModel(nome=nome, descricao=descricao, severidade=severidade, programa_id=programa_id)
        if exames_obrigatorios_ids:
            exames = Exame.query.filter(Exame.id.in_(exames_obrigatorios_ids)).all()
            risco.exames_obrigatorios = exames
        db.session.add(risco)
        db.session.commit()
        return risco

    @staticmethod
    def listar():
        return RiscoModel.query.all()

    @staticmethod
    def buscar_por_id(risco_id):
        return RiscoModel.query.get(risco_id)

    @staticmethod
    def atualizar(risco_id, **kwargs):
        risco = RiscoModel.query.get(risco_id)
        if not risco:
            return None

        exames_ids = kwargs.pop("exames_obrigatorios_ids", None)
        for k,v in kwargs.items():
            if hasattr(risco, k):
                setattr(risco, k, v)

        if exames_ids is not None:
            from src.infrastructure.model.exame_model import Exame
            exames = Exame.query.filter(Exame.id.in_(exames_ids)).all()
            risco.exames_obrigatorios = exames

        db.session.commit()
        return risco

    @staticmethod
    def deletar(risco_id):
        risco = RiscoModel.query.get(risco_id)
        if not risco:
            return False
        db.session.delete(risco)
        db.session.commit()
        return True