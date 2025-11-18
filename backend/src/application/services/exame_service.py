from datetime import datetime
from src.infrastructure.model.exame_model import Exame
from src.infrastructure.model.agendamento_model import Agendamento
from src.config.database import db

class ExameService:

    # ===============================
    # TIPO DE EXAME
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
    
    # --- ADICIONADO: Método que faltava para o PDF funcionar ---
    @staticmethod
    def buscar_agendamento_por_id(id):
        """Busca um agendamento pelo ID"""
        return Agendamento.query.get(id)
    
    # Alias para compatibilidade caso usem buscar_agendamento
    @staticmethod
    def buscar_agendamento(id):
        return ExameService.buscar_agendamento_por_id(id)

    @staticmethod
    def agendar_exame(colaborador_id, exame_id, tipo_exame, data_agendamento=None, observacoes=None):
        try:
            if not colaborador_id or not exame_id or not tipo_exame:
                raise ValueError("IDs e Tipo de exame são obrigatórios")
            
            if not data_agendamento:
                data_agendamento = datetime.utcnow()
            else:
                if isinstance(data_agendamento, str):
                    data_agendamento = datetime.fromisoformat(data_agendamento.replace('Z', '+00:00'))
            
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

    @staticmethod
    def buscar_por_status(status):
        status = status.upper()
        todos = Agendamento.query.all()
        return [a for a in todos if a.status == status]

    @staticmethod
    def buscar_agendamentos_por_colaborador(colaborador_id):
        return Agendamento.query.filter_by(colaborador_id=colaborador_id).all()

    @staticmethod
    def atualizar_agendamento(agendamento_id, data_agendamento=None, data_realizacao=None, observacoes=None):
        agendamento = Agendamento.query.get(agendamento_id)
        if not agendamento:
            return None
        
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
    
    @staticmethod
    def listar_todos_agendamentos():
        return Agendamento.query.all()