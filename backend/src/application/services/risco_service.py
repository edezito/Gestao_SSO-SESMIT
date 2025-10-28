from src.config.database import db
from src.infrastructure.model.risco_model import Risco
from src.infrastructure.model.exame_model import Exame
from typing import List

class RiscoService:

    # ===============================
    # CRUD Básico de Risco
    # ===============================
    @staticmethod
    def criar_risco(nome: str, descricao: str = None):
        if Risco.query.filter_by(nome=nome).first():
            raise ValueError("Risco com este nome já existe.")
        
        risco = Risco(nome=nome, descricao=descricao)
        db.session.add(risco)
        db.session.commit()
        return risco

    @staticmethod
    def listar_riscos():
        # Listar apenas os riscos ativos, para uso no sistema
        return Risco.query.filter_by(ativo=True).all()

    @staticmethod
    def atualizar_risco(risco_id: int, nome: str = None, descricao: str = None, ativo: bool = None):
        risco = Risco.query.get(risco_id)
        if not risco:
            raise ValueError("Risco não encontrado.")
            
        if nome:
            risco.nome = nome
        if descricao is not None:
            risco.descricao = descricao
        if ativo is not None:
            risco.ativo = ativo # Permite inativar o risco

        db.session.commit()
        return risco

    @staticmethod
    def deletar_risco(risco_id: int):
        """Deleção Lógica (Inativação)."""
        risco = Risco.query.get(risco_id)
        if not risco:
            raise ValueError("Risco não encontrado.")
            
        # Para evitar erros de FK na tabela de associação, apenas inativamos o risco.
        risco.ativo = False
        db.session.commit()
        return risco
        
    # ===============================
    # Vínculo Risco -> Exame
    # ===============================
    @staticmethod
    def vincular_exames_obrigatorios(risco_id: int, exame_ids: List[int]):
        """Define os exames obrigatórios para este risco."""
        risco = Risco.query.get(risco_id)
        if not risco:
            raise ValueError("Risco não encontrado.")
            
        exames = Exame.query.filter(Exame.id.in_(exame_ids)).all()
        if len(exames) != len(exame_ids):
            raise ValueError("Um ou mais exames não foram encontrados.")

        # Substitui a lista de exames obrigatórios
        risco.exames_obrigatorios = exames
        db.session.commit()
        return risco