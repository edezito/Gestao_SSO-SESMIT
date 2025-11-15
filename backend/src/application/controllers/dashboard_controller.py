# src/application/controllers/dashboard_controller.py
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, current_user  # ✅ 1. Importar current_user
from sqlalchemy import func
from src.config.database import db

dashboard_bp = Blueprint('dashboard_bp', __name__)

@dashboard_bp.route('/summary', methods=['GET'])
@jwt_required()
def summary():
    """
    Retorna um resumo para o dashboard, adaptado ao perfil do usuário.
    - GESTOR/SESMIT: Veem todos os dados.
    - COLABORADOR: Vê apenas seus exames pendentes.
    """
    try:
        # IMPORTS locais
        from src.infrastructure.model.exame_model import Exame
        from src.infrastructure.model.agendamento_model import Agendamento
        from src.infrastructure.model.usuario_model import UsuarioModel
        from src.infrastructure.model.risco_model import Risco
        from src.infrastructure.model.cargo_model import CargoModel

        # ✅ 2. Pega o perfil do usuário logado
        perfil = current_user.perfil.upper()
        is_admin = perfil in ['GESTOR', 'SESMIT']

        # --- DADOS PARA TODOS OS PERFIS ---
        # Total de tipos de exame (informativo, não sensível)
        total_exames = db.session.query(func.count(Exame.id)).scalar() or 0
        
        # Dicionário de resposta inicial
        response_data = {
            "total_exames": int(total_exames)
        }

        # --- DADOS ESPECÍFICOS DE ADMIN (GESTOR/SESMIT) ---
        if is_admin:
            # Exames pendentes (VISÃO GLOBAL)
            try:
                exames_pendentes_global = db.session.query(func.count(Agendamento.id)).filter(
                    (Agendamento.status == 'PENDENTE') | (Agendamento.data_realizacao == None)
                ).scalar() or 0
            except Exception:
                exames_pendentes_global = 0

            # Total de colaboradores
            colaboradores = db.session.query(func.count(UsuarioModel.id)).scalar() or 0
            
            # Riscos ativos
            try:
                riscos_ativos = db.session.query(func.count(Risco.id)).filter(Risco.ativo == True).scalar() or 0
            except Exception:
                riscos_ativos = db.session.query(func.count(Risco.id)).scalar() or 0

            # Vínculos
            try:
                vinculos = db.session.query(func.count(CargoModel.id)).join(
                    CargoModel.riscos_associados
                ).distinct().scalar() or 0
            except Exception:
                vinculos = 0

            # Adiciona dados de admin à resposta
            response_data.update({
                "exames_pendentes": int(exames_pendentes_global),
                "colaboradores": int(colaboradores),
                "riscos_ativos": int(riscos_ativos),
                "vinculos": int(vinculos)
            })

        # --- DADOS ESPECÍFICOS DO COLABORADOR ---
        else:
            # Exames pendentes (APENAS OS DELE)
            try:
                exames_pendentes_pessoal = db.session.query(func.count(Agendamento.id)).filter(
                    Agendamento.colaborador_id == current_user.id,  # ✅ Filtro de segurança
                    (Agendamento.status == 'PENDENTE') | (Agendamento.data_realizacao == None)
                ).scalar() or 0
            except Exception:
                exames_pendentes_pessoal = 0
            
            # Adiciona dados de colaborador à resposta
            response_data.update({
                "exames_pendentes": int(exames_pendentes_pessoal)
                # Colaborador não recebe 'colaboradores', 'riscos_ativos', 'vinculos'
            })

        # ✅ 3. Retorna os dados filtrados
        return jsonify(response_data), 200

    except Exception as e:
        import traceback; traceback.print_exc()
        return jsonify({"erro": "Erro ao gerar summary", "detalhe": str(e)}), 500