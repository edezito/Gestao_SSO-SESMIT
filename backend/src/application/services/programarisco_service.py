from src.config.database import db
# Assumindo que o modelo ProgramaRisco está em sso_model.py
from src.infrastructure.model.sso_model import ProgramaRisco

class ProgramaRiscoService:

    @staticmethod
    def criar_programa(nome: str, descricao: str = None):
        if ProgramaRisco.query.filter_by(nome=nome).first():
            raise ValueError("Programa de Risco com este nome já existe.")
        
        programa = ProgramaRisco(nome=nome, descricao=descricao)
        db.session.add(programa)
        db.session.commit()
        return programa

    @staticmethod
    def listar_programas():
        # Listar apenas os programas ativos
        return ProgramaRisco.query.filter_by(ativo=True).all()

    @staticmethod
    def buscar_programa_por_id(programa_id: int):
        return ProgramaRisco.query.get(programa_id)

    @staticmethod
    def atualizar_programa(programa_id: int, nome: str = None, descricao: str = None, ativo: bool = None):
        programa = ProgramaRisco.query.get(programa_id)
        if not programa:
            raise ValueError("Programa de Risco não encontrado.")
            
        if nome:
            programa.nome = nome
        if descricao is not None:
            programa.descricao = descricao
        if ativo is not None:
            programa.ativo = ativo

        db.session.commit()
        return programa

    @staticmethod
    def deletar_programa(programa_id: int):
        """Deleção Lógica (Inativação)."""
        programa = ProgramaRisco.query.get(programa_id)
        if not programa:
            raise ValueError("Programa de Risco não encontrado.")
            
        # Marca como inativo
        programa.ativo = False
        db.session.commit()
        return programa