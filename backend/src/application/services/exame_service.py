from datetime import datetime
from unittest import case
from src.infrastructure.model.exame_model import Exame
from src.infrastructure.model.agendamento_model import Agendamento
from src.config.database import db

class ExameService:

    # ===============================
    # TIPO DE EXAME (Sem alterações)
    # ===============================
    @staticmethod
    def criar_tipo_exame(nome, descricao=None):
        exame_existente = Exame.query.filter_by(nome=nome).first()
        if exame_existente:
            return exame_existente

        exame = Exame(nome=nome, descricao=descricao)
        db.session.add(exame)
        db.session.commit()
        return exame

    @staticmethod
    def listar_tipos_exame():
        return Exame.query.all()

    # ===============================
    # AGENDAMENTO
    # ===============================
    @staticmethod
    def buscar_por_status(status):
        status = status.upper()
        
        # CORRIGIDO: Referenciar o modelo Agendamento e suas colunas
        status_expression = case(
            # Se data_realizacao for diferente de NULL
            (Agendamento.data_realizacao != None, "REALIZADO"),
            # Se data_realizacao for NULL E data_agendamento for anterior a data atual
            (Agendamento.data_agendamento < datetime.utcnow(), "VENCIDO"),
            # Caso contrário
            else_="PENDENTE"
        )
        
        # CORRIGIDO: Consultar o modelo Agendamento
        return Agendamento.query.filter(status_expression == status).all()

    @staticmethod
    def buscar_por_status(status):
        status = status.upper()
        
        status_expression = case(
            (Exame.data_realizacao != None, "REALIZADO"),
            (Exame.data_agendamento < datetime.utcnow(), "VENCIDO"),
            else_="PENDENTE"
        )
        
        return Exame.query.filter(status_expression == status).all()

    @staticmethod
    def atualizar_agendamento(agendamento_id, data_agendamento=None, data_realizacao=None, observacoes=None):
        agendamento = Agendamento.query.get(agendamento_id)
        if not agendamento:
            return None
        
        # Apenas os campos permitidos são atualizados
        if data_agendamento is not None:
            agendamento.data_agendamento = data_agendamento
        if data_realizacao is not None:
            agendamento.data_realizacao = data_realizacao
        if observacoes is not None:
            agendamento.observacoes = observacoes
            
        db.session.commit()
        return agendamento

    @staticmethod
    def deletar_agendamento(agendamento_id):
        agendamento = Agendamento.query.get(agendamento_id)
        if not agendamento:
            return False
        db.session.delete(agendamento)
        db.session.commit()
        return True