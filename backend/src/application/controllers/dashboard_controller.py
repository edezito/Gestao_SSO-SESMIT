# src/application/controllers/dashboard_controller.py
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy import func
from src.config.database import db

dashboard_bp = Blueprint('dashboard_bp', __name__)

@dashboard_bp.route('/summary', methods=['GET'])
@jwt_required()
def summary():
    """
    Retorna um resumo para o dashboard:
    - total_exames (tipos de exame cadastrados)
    - exames_pendentes (agendamentos pendentes)
    - colaboradores (total de usuarios)
    - riscos_ativos (total de riscos com ativo=True)
    - vinculos (quantidade de cargos com riscos vinculados)
    """
    try:
        # IMPORTS locais pra evitar circular imports
        from src.infrastructure.model.exame_model import Exame
        from src.infrastructure.model.agendamento_model import Agendamento
        from src.infrastructure.model.usuario_model import UsuarioModel
        from src.infrastructure.model.risco_model import Risco
        from src.infrastructure.model.cargo_model import CargoModel

        # Total de tipos de exame cadastrados
        total_exames = db.session.query(func.count(Exame.id)).scalar() or 0

        # Exames pendentes: exemplo considerando Agendamento.status == 'PENDENTE'
        # Ajuste a condição para a coluna que você usa (status, data_realizacao, etc.)
        try:
            exames_pendentes = db.session.query(func.count(Agendamento.id)).filter(
                (Agendamento.status == 'PENDENTE') | (Agendamento.data_realizacao == None)
            ).scalar() or 0
        except Exception:
            # fallback genérico: contar agendamentos sem data_realizacao
            exames_pendentes = db.session.query(func.count(Agendamento.id)).filter(
                Agendamento.data_realizacao == None
            ).scalar() or 0

        # Total de colaboradores (usuários)
        colaboradores = db.session.query(func.count(UsuarioModel.id)).scalar() or 0

        # Riscos ativos (se existir campo 'ativo')
        try:
            riscos_ativos = db.session.query(func.count(Risco.id)).filter(Risco.ativo == True).scalar() or 0
        except Exception:
            riscos_ativos = db.session.query(func.count(Risco.id)).scalar() or 0

        # Vínculos: número de cargos que têm riscos associados
        try:
            # Assumindo relação cargo.riscos_associados (many-to-many)
            # método eficiente: join e distinct
            vinculos = db.session.query(func.count(CargoModel.id)).join(
                CargoModel.riscos_associados
            ).distinct().scalar() or 0
        except Exception:
            # fallback: contar cargos (se não tiver relação configurada)
            vinculos = db.session.query(func.count(CargoModel.id)).scalar() or 0

        return jsonify({
            "total_exames": int(total_exames),
            "exames_pendentes": int(exames_pendentes),
            "colaboradores": int(colaboradores),
            "riscos_ativos": int(riscos_ativos),
            "vinculos": int(vinculos)
        }), 200

    except Exception as e:
        import traceback; traceback.print_exc()
        return jsonify({"erro": "Erro ao gerar summary", "detalhe": str(e)}), 500
