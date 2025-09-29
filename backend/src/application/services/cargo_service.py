from src.infrastructure.model.cargo_model import Cargo
from src.config.database import db

class CargoService:

    @staticmethod
    def criar(nome: str):
        if Cargo.query.filter_by(nome=nome).first():
            raise ValueError("Cargo já cadastrado")
        cargo = Cargo(nome=nome)
        db.session.add(cargo)
        db.session.commit()
        return cargo

    @staticmethod
    def listar():
        return Cargo.query.all()

    @staticmethod
    def buscar_por_id(cargo_id: int):
        return Cargo.query.get(cargo_id)

    @staticmethod
    def atualizar(cargo_id: int, nome: str = None):
        cargo = Cargo.query.get(cargo_id)
        if not cargo:
            raise ValueError("Cargo não encontrado")
        if nome:
            cargo.nome = nome
        db.session.commit()
        return cargo

    @staticmethod
    def deletar(cargo_id: int):
        cargo = Cargo.query.get(cargo_id)
        if not cargo:
            raise ValueError("Cargo não encontrado")
        db.session.delete(cargo)
        db.session.commit()
        return True