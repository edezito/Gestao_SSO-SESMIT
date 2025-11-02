from datetime import datetime
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
    # AGENDAMENTO - USANDO PROPRIEDADE STATUS
    # ===============================
    @staticmethod
    def agendar_exame(colaborador_id, exame_id, tipo_exame, data_agendamento=None, observacoes=None):
        """
        Agenda um novo exame para um colaborador
        """
        try:
            # Validações básicas
            if not colaborador_id:
                raise ValueError("ID do colaborador é obrigatório")
            
            if not exame_id:
                raise ValueError("ID do exame é obrigatório")
            
            if not tipo_exame:
                raise ValueError("Tipo do exame é obrigatório")
            
            # Se data_agendamento não for fornecida, usa a data atual
            if not data_agendamento:
                data_agendamento = datetime.utcnow()
            else:
                # Converte string para datetime se necessário
                if isinstance(data_agendamento, str):
                    data_agendamento = datetime.fromisoformat(data_agendamento.replace('Z', '+00:00'))
            
            # Cria o agendamento
            agendamento = Agendamento(
                colaborador_id=colaborador_id,
                exame_id=exame_id,
                tipo_exame=tipo_exame,
                data_agendamento=data_agendamento,
                observacoes=observacoes,
                data_realizacao=None
            )
            
            db.session.add(agendamento)
            db.session.commit()
            
            return agendamento
            
        except ValueError as e:
            db.session.rollback()
            raise e
        except Exception as e:
            db.session.rollback()
            print(f"Erro ao agendar exame: {str(e)}")
            raise Exception("Erro interno ao agendar exame")

    # ===============================
    # MÉTODOS SIMPLIFICADOS USANDO A PROPRIEDADE STATUS
    # ===============================
    
    @staticmethod
    def buscar_por_status(status):
        """
        Busca agendamentos por status usando a propriedade calculada
        """
        status = status.upper()
        todos_agendamentos = Agendamento.query.all()
        
        # Filtra usando a propriedade status do modelo
        return [agendamento for agendamento in todos_agendamentos 
                if agendamento.status == status]

    @staticmethod
    def buscar_agendamentos_por_colaborador(colaborador_id):
        """
        Busca todos os agendamentos de um colaborador específico
        """
        return Agendamento.query.filter_by(colaborador_id=colaborador_id).all()

    @staticmethod
    def buscar_agendamentos_pendentes():
        """
        Busca apenas agendamentos pendentes (mais eficiente)
        """
        return Agendamento.query.filter(
            Agendamento.data_realizacao.is_(None),
            Agendamento.data_agendamento >= datetime.utcnow()
        ).all()

    @staticmethod
    def buscar_agendamentos_vencidos():
        """
        Busca apenas agendamentos vencidos (mais eficiente)
        """
        return Agendamento.query.filter(
            Agendamento.data_realizacao.is_(None),
            Agendamento.data_agendamento < datetime.utcnow()
        ).all()

    @staticmethod
    def buscar_agendamentos_realizados():
        """
        Busca apenas agendamentos realizados
        """
        return Agendamento.query.filter(
            Agendamento.data_realizacao.isnot(None)
        ).all()

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