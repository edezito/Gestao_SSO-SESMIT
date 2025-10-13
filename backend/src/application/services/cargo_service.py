from src.infrastructure.model.cargo_model import CargoModel
from src.infrastructure.model.risco_model import RiscoModel
from src.config.database import db

class CargoService:
    @staticmethod
    def criar(nome, descricao=None, riscos_ids=None):
        cargo = CargoModel(nome=nome, descricao=descricao)
        if riscos_ids:
            riscos = RiscoModel.query.filter(RiscoModel.id.in_(riscos_ids)).all()
            cargo.riscos = riscos
        db.session.add(cargo)
        db.session.commit()
        return cargo

    @staticmethod
    def listar():
        return CargoModel.query.all()

    @staticmethod
    def buscar_por_id(cargo_id):
        return CargoModel.query.get(cargo_id)

    @staticmethod
    def atualizar(cargo_id, **kwargs):
        cargo = CargoModel.query.get(cargo_id)
        if not cargo:
            return None

        riscos_ids = kwargs.pop("riscos_ids", None)
        for k,v in kwargs.items():
            if hasattr(cargo, k):
                setattr(cargo, k, v)

        if riscos_ids is not None:
            riscos = RiscoModel.query.filter(RiscoModel.id.in_(riscos_ids)).all()
            cargo.riscos = riscos

        db.session.commit()
        return cargo

    @staticmethod
    def deletar(cargo_id):
        cargo = CargoModel.query.get(cargo_id)
        if not cargo:
            return False
        db.session.delete(cargo)
        db.session.commit()
        return True