from datetime import datetime
from time import timezone
from unittest import case
from src.infrastructure.model.exame_model import Exame
from src.config.database import db

class ExameService:

    @staticmethod
    def criar(nome, colaborador_id, tipo_exame, data_agendamento=None, descricao=None, observacoes=None):
        exame = Exame(
            nome=nome,
            colaborador_id=colaborador_id,
            tipo_exame=tipo_exame,
            data_agendamento=data_agendamento or None,
            descricao=descricao,
            observacoes=observacoes
        )
        db.session.add(exame)
        db.session.commit()
        return exame

    @staticmethod
    def listar():
        return Exame.query.all()

    @staticmethod
    def buscar_por_colaborador(colaborador_id):
        return Exame.query.filter_by(colaborador_id=colaborador_id).all()

    @staticmethod
    def buscar_por_status(status):
        status = status.upper()
        
        status_expression = case(
            (Exame.data_realizacao != None, "REALIZADO"),
            (Exame.data_agendamento < datetime.now(timezone.utc)(), "VENCIDO"),
            else_="PENDENTE"
        )
        
        return Exame.query.filter(status_expression == status).all()

    @staticmethod
    def atualizar(exame_id, **kwargs):
        exame = Exame.query.get(exame_id)
        if not exame:
            return None
        for key, value in kwargs.items():
            if hasattr(exame, key):
                setattr(exame, key, value)
        db.session.commit()
        return exame

    @staticmethod
    def deletar(exame_id):
        exame = Exame.query.get(exame_id)
        if not exame:
            return False
        db.session.delete(exame)
        db.session.commit()
        return True