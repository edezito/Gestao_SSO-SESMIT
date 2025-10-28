from src.config.database import db
from src.infrastructure.model.cargo_model import CargoModel
from src.infrastructure.model.risco_model import Risco
from src.infrastructure.model.exame_model import Exame
from typing import List

class CargoService:

    @staticmethod
    def criar_cargo(nome: str, descricao: str = None):
        if CargoModel.query.filter_by(nome=nome).first():
            raise ValueError("Cargo com este nome já existe.")
        
        cargo = CargoModel(nome=nome, descricao=descricao)
        db.session.add(cargo)
        db.session.commit()
        return cargo

    @staticmethod
    def listar_cargos():
        return CargoModel.query.all()

    @staticmethod
    def atualizar_cargo(cargo_id: int, nome: str = None, descricao: str = None):
        cargo = CargoModel.query.get(cargo_id)
        if not cargo:
            raise ValueError("Cargo não encontrado.")
            
        if nome:
            cargo.nome = nome
        if descricao is not None:
            cargo.descricao = descricao
            
        db.session.commit()
        return cargo

    @staticmethod
    def deletar_cargo(cargo_id: int):
        cargo = CargoModel.query.get(cargo_id)
        if not cargo:
            raise ValueError("Cargo não encontrado.")
            
        # Verifica se há usuários associados antes de deletar
        if cargo.usuarios.count() > 0:
            raise ValueError("Não é possível deletar. Existem colaboradores vinculados a este cargo.")
            
        db.session.delete(cargo)
        db.session.commit()

    @staticmethod
    def vincular_riscos(cargo_id: int, risco_ids: List[int]):
        """Vincula uma lista de riscos a um cargo específico."""
        cargo = CargoModel.query.get(cargo_id)
        if not cargo:
            raise ValueError("Cargo não encontrado.")
            
        riscos = Risco.query.filter(Risco.id.in_(risco_ids)).all()
        if len(riscos) != len(risco_ids):
            raise ValueError("Um ou mais riscos não foram encontrados.")

        # Substitui a lista de riscos
        cargo.riscos_associados = riscos
        db.session.commit()
        return cargo

    @staticmethod
    def vincular_exames(cargo_id: int, exame_ids: List[int]):
        """Vincula uma lista de exames obrigatórios DIRETOS a um cargo específico."""
        cargo = CargoModel.query.get(cargo_id)
        if not cargo:
            raise ValueError("Cargo não encontrado.")
            
        exames = Exame.query.filter(Exame.id.in_(exame_ids)).all()
        if len(exames) != len(exame_ids):
            raise ValueError("Um ou mais exames não foram encontrados.")

        # Substitui a lista de exames
        cargo.exames_exigidos = exames
        db.session.commit()
        return cargo