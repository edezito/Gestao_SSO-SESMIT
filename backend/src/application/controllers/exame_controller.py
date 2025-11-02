from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, current_user
from src.application.services.exame_service import ExameService
from src.infrastructure.model.agendamento_model import Agendamento
from src.application.services.authorization_service import AuthorizationService
from src.utils.role_required import role_required
from src.config.database import db

exame_bp = Blueprint("exame_bp", __name__)

# -----------------------------
# Criar tipo de exame
# -----------------------------
@exame_bp.route("/tipos-exame", methods=["POST"])
@jwt_required() 
@role_required(lambda authz: authz.pode_administrar_usuarios())
def criar_tipo_exame():
    try:
        dados = request.json
        
        if not dados or not dados.get("nome"):
            return jsonify({"erro": "Nome do exame é obrigatório"}), 400
        
        exame = ExameService.criar_tipo_exame(
            nome=dados["nome"],
            descricao=dados.get("descricao")
        )
        
        return jsonify({
            "id": exame.id, 
            "nome": exame.nome,
            "descricao": exame.descricao,
            "mensagem": "Tipo de exame criado com sucesso"
        }), 201
        
    except Exception as e:
        print(f"Erro ao criar tipo de exame: {str(e)}")
        return jsonify({"erro": "Erro interno ao criar tipo de exame"}), 500

# -----------------------------
# Listar tipos de exame
# -----------------------------
@exame_bp.route("/tipos-exame", methods=["GET"])
@jwt_required() 
def listar_tipos_exame():
    try:
        exames = ExameService.listar_tipos_exame()
        return jsonify([{
            "id": e.id, 
            "nome": e.nome, 
            "descricao": e.descricao
        } for e in exames])
        
    except Exception as e:
        print(f"Erro ao listar tipos de exame: {str(e)}")
        return jsonify({"erro": "Erro interno ao listar tipos de exame"}), 500

# -----------------------------
# Agendar exame - VERSÃO CORRIGIDA (ÚNICA)
# -----------------------------
@exame_bp.route("/agendamentos", methods=["POST"])
@jwt_required() 
@role_required(lambda authz: authz.pode_criar_exame(request.json.get("colaborador_id") if request.json else None))
def agendar_exame():
    try:
        dados = request.json
        
        # Validação de dados obrigatórios
        if not dados:
            return jsonify({"erro": "Dados não fornecidos"}), 400
        
        campos_obrigatorios = ["colaborador_id", "exame_id", "tipo_exame"]
        for campo in campos_obrigatorios:
            if campo not in dados:
                return jsonify({"erro": f"Campo obrigatório faltando: {campo}"}), 400
        
        agendamento = ExameService.agendar_exame(
            colaborador_id=dados["colaborador_id"],
            exame_id=dados["exame_id"],
            tipo_exame=dados["tipo_exame"],
            data_agendamento=dados.get("data_agendamento"),
            observacoes=dados.get("observacoes")
        )
        
        return jsonify({
            "id": agendamento.id,
            "colaborador_id": agendamento.colaborador_id,
            "exame_id": agendamento.exame_id,
            "tipo_exame": agendamento.tipo_exame,
            "data_agendamento": agendamento.data_agendamento.isoformat() if agendamento.data_agendamento else None,
            "status": agendamento.status,
            "mensagem": "Exame agendado com sucesso"
        }), 201
        
    except ValueError as e:
        return jsonify({"erro": str(e)}), 400
    except Exception as e:
        print(f"Erro interno ao agendar exame: {str(e)}")
        return jsonify({"erro": "Erro interno do servidor ao agendar exame"}), 500

# -----------------------------
# Listar agendamentos
# -----------------------------
@exame_bp.route("/agendamentos", methods=["GET"])
@jwt_required()
@role_required(lambda authz: authz.pode_listar_exames())
def listar_agendamentos():
    try:
        limit = request.args.get("limit", default=0, type=int)
        page = request.args.get("page", default=1, type=int)
        
        query = Agendamento.query.options(
            db.joinedload(Agendamento.colaborador),
            db.joinedload(Agendamento.exame)
        )

        if current_user.perfil.upper() == "COLABORADOR":
            query = query.filter_by(colaborador_id=current_user.id)

        query = query.order_by(Agendamento.data_agendamento.desc())

        # Aplicar paginação se limit for especificado
        if limit > 0:
            query = query.limit(limit)

        agendamentos = query.all()

        if not agendamentos:
            mensagem = "Nenhum exame agendado" if current_user.perfil.upper() == "COLABORADOR" else "Nenhum agendamento encontrado"
            sugestao = "Solicite o agendamento ao SESMIT ou gestor." if current_user.perfil.upper() == "COLABORADOR" else None
            return jsonify({
                "mensagem": mensagem,
                "sugestao": sugestao,
                "dados": [],
                "total": 0,
                "limit": limit
            })

        # Retornar estrutura consistente
        return jsonify({
            "dados": [{
                "id": a.id,
                "colaborador_id": a.colaborador_id,
                "colaborador_nome": a.colaborador.nome if a.colaborador else "N/A",
                "exame_id": a.exame_id,
                "exame_nome": a.exame.nome if a.exame else "N/A",
                "tipo_exame": a.tipo_exame,
                "data_agendamento": a.data_agendamento.isoformat() if a.data_agendamento else None,
                "data_realizacao": a.data_realizacao.isoformat() if a.data_realizacao else None,
                "observacoes": a.observacoes,
                "status": a.status
            } for a in agendamentos],
            "total": len(agendamentos),
            "limit": limit,
            "pagina": page
        })
        
    except Exception as e:
        print(f"Erro ao listar agendamentos: {str(e)}")
        return jsonify({
            "erro": "Erro interno ao listar agendamentos",
            "detalhes": str(e)
        }), 500

# -----------------------------
# Buscar agendamento por ID
# -----------------------------
@exame_bp.route("/agendamentos/<int:agendamento_id>", methods=["GET"])
@jwt_required() 
@role_required(lambda authz: authz.pode_administrar_agendamento(agendamento_id=agendamento_id))
def buscar_agendamento(agendamento_id):
    try:
        agendamento = Agendamento.query.options(
            db.joinedload(Agendamento.colaborador),
            db.joinedload(Agendamento.exame)
        ).get(agendamento_id)
        
        if not agendamento:
            return jsonify({"erro": "Agendamento não encontrado"}), 404

        return jsonify({
            "id": agendamento.id,
            "colaborador_id": agendamento.colaborador_id,
            "colaborador_nome": agendamento.colaborador.nome if agendamento.colaborador else "N/A",
            "exame_id": agendamento.exame_id,
            "exame_nome": agendamento.exame.nome if agendamento.exame else "N/A",
            "tipo_exame": agendamento.tipo_exame,
            "data_agendamento": agendamento.data_agendamento.isoformat() if agendamento.data_agendamento else None,
            "data_realizacao": agendamento.data_realizacao.isoformat() if agendamento.data_realizacao else None,
            "observacoes": agendamento.observacoes,
            "status": agendamento.status
        })
        
    except Exception as e:
        print(f"Erro ao buscar agendamento: {str(e)}")
        return jsonify({"erro": "Erro interno ao buscar agendamento"}), 500

# -----------------------------
# Atualizar agendamento
# -----------------------------
@exame_bp.route("/agendamentos/<int:agendamento_id>", methods=["PUT"])
@jwt_required() 
@role_required(lambda authz: authz.pode_administrar_agendamento(agendamento_id=agendamento_id))
def atualizar_agendamento(agendamento_id):
    try:
        dados = request.json
        
        if not dados:
            return jsonify({"erro": "Dados não fornecidos"}), 400
        
        agendamento_atualizado = ExameService.atualizar_agendamento(
            agendamento_id=agendamento_id,
            data_agendamento=dados.get("data_agendamento"),
            data_realizacao=dados.get("data_realizacao"),
            observacoes=dados.get("observacoes")
        )

        if not agendamento_atualizado:
            return jsonify({"erro": "Agendamento não encontrado"}), 404

        return jsonify({
            "id": agendamento_atualizado.id,
            "colaborador_id": agendamento_atualizado.colaborador_id,
            "exame_id": agendamento_atualizado.exame_id,
            "tipo_exame": agendamento_atualizado.tipo_exame,
            "data_agendamento": agendamento_atualizado.data_agendamento.isoformat() if agendamento_atualizado.data_agendamento else None,
            "data_realizacao": agendamento_atualizado.data_realizacao.isoformat() if agendamento_atualizado.data_realizacao else None,
            "observacoes": agendamento_atualizado.observacoes,
            "status": agendamento_atualizado.status,
            "mensagem": "Agendamento atualizado com sucesso"
        })
        
    except Exception as e:
        print(f"Erro ao atualizar agendamento: {str(e)}")
        return jsonify({"erro": "Erro interno ao atualizar agendamento"}), 500

# -----------------------------
# Deletar agendamento
# -----------------------------
@exame_bp.route("/agendamentos/<int:agendamento_id>", methods=["DELETE"])
@jwt_required() 
@role_required(lambda authz: authz.pode_administrar_agendamento(agendamento_id=agendamento_id))
def deletar_agendamento(agendamento_id):
    try:
        sucesso = ExameService.deletar_agendamento(agendamento_id)
        
        if sucesso:
            return jsonify({"mensagem": "Agendamento deletado com sucesso"})
        else:
            return jsonify({"erro": "Agendamento não encontrado"}), 404
            
    except Exception as e:
        print(f"Erro ao deletar agendamento: {str(e)}")
        return jsonify({"erro": "Erro interno ao deletar agendamento"}), 500