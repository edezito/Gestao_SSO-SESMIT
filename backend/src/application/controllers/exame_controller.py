from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt, verify_jwt_in_request
from src.application.services.exame_service import ExameService
from src.infrastructure.model.usuario_model import UsuarioModel
from src.infrastructure.model.agendamento_model import Agendamento
from src.application.services.authorization_service import AuthorizationService
from src.config.database import db

exame_bp = Blueprint("exame_bp", __name__)

# -----------------------------
# Criar tipo de exame
# -----------------------------
@exame_bp.route("/tipos-exame", methods=["POST"])
def criar_tipo_exame():
    verify_jwt_in_request()
    dados = request.json
    usuario_id = get_jwt().get("sub")
    usuario = UsuarioModel.query.get(usuario_id)
    authz = AuthorizationService(usuario)

    if usuario.perfil not in ["SESMIT", "GESTOR"]:
        return jsonify({"msg": "Acesso negado"}), 403

    exame = ExameService.criar_tipo_exame(
        nome=dados["nome"],
        descricao=dados.get("descricao")
    )
    return jsonify({"id": exame.id, "nome": exame.nome})

# -----------------------------
# Listar tipos de exame
# -----------------------------
@exame_bp.route("/tipos-exame", methods=["GET"])
def listar_tipos_exame():
    verify_jwt_in_request()
    exames = ExameService.listar_tipos_exame()
    return jsonify([{"id": e.id, "nome": e.nome, "descricao": e.descricao} for e in exames])

# -----------------------------
# Agendar exame
# -----------------------------
@exame_bp.route("/agendamentos", methods=["POST"])
def agendar_exame():
    verify_jwt_in_request()
    dados = request.json
    usuario_id = get_jwt().get("sub")
    usuario = UsuarioModel.query.get(usuario_id)
    authz = AuthorizationService(usuario)

    # Apenas SESMIT ou GESTOR podem agendar para outros
    if usuario.perfil == "COLABORADOR" and usuario.id != dados.get("colaborador_id"):
        return jsonify({"msg": "Acesso negado"}), 403

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
        "data_agendamento": agendamento.data_agendamento.isoformat() if agendamento.data_agendamento else None
    })

# -----------------------------
# Listar agendamentos (CORRIGIDO - sem ExameService.listar_agendamentos)
# -----------------------------
@exame_bp.route("/agendamentos", methods=["GET"])
def listar_agendamentos():
    verify_jwt_in_request()
    usuario_id = get_jwt().get("sub")
    usuario = UsuarioModel.query.get(usuario_id)

    # Buscar agendamentos com join para carregar relacionamentos
    from src.infrastructure.model.agendamento_model import Agendamento
    
    query = Agendamento.query.options(
        db.joinedload(Agendamento.colaborador),
        db.joinedload(Agendamento.exame)
    )
    
    # COLABORADOR só vê seus agendamentos
    if usuario.perfil == "COLABORADOR":
        query = query.filter_by(colaborador_id=usuario_id)
    
    agendamentos = query.order_by(Agendamento.data_agendamento.desc()).all()
    
    if not agendamentos:
        mensagem = "Nenhum exame agendado" if usuario.perfil == "COLABORADOR" else "Nenhum agendamento encontrado"
        sugestao = "Solicite o agendamento ao SESMIT ou gestor." if usuario.perfil == "COLABORADOR" else None
        
        return jsonify({
            "mensagem": mensagem,
            "sugestao": sugestao,
            "dados": []
        })
    
    # Debug: verificar os dados
    print("=== DEBUG AGENDAMENTOS ===")
    for a in agendamentos:
        print(f"Agendamento ID: {a.id}")
        print(f"Colaborador: {a.colaborador}")
        print(f"Colaborador Nome: {a.colaborador.nome if a.colaborador else 'NONE'}")
        print(f"Exame: {a.exame}")
        print(f"Exame Nome: {a.exame.nome if a.exame else 'NONE'}")
        print("---")
    
    return jsonify([{
        "id": a.id,
        "colaborador_id": a.colaborador_id,
        "colaborador_nome": a.colaborador.nome if a.colaborador and hasattr(a.colaborador, 'nome') else "Nome não disponível",
        "exame_id": a.exame_id,
        "exame_nome": a.exame.nome if a.exame and hasattr(a.exame, 'nome') else "Exame não disponível",
        "tipo_exame": a.tipo_exame,
        "data_agendamento": a.data_agendamento.isoformat() if a.data_agendamento else None,
        "data_realizacao": a.data_realizacao.isoformat() if a.data_realizacao else None,
        "observacoes": a.observacoes,
        "status": a.status
    } for a in agendamentos])

# -----------------------------
# Buscar agendamento por ID
# -----------------------------
@exame_bp.route("/agendamentos/<int:agendamento_id>", methods=["GET"])
def buscar_agendamento(agendamento_id):
    verify_jwt_in_request()
    usuario_id = get_jwt().get("sub")
    usuario = UsuarioModel.query.get(usuario_id)

    agendamento = Agendamento.query.get(agendamento_id)
    if not agendamento:
        return jsonify({"erro": "Agendamento não encontrado"}), 404

    # COLABORADOR só pode ver seus próprios agendamentos
    if usuario.perfil == "COLABORADOR" and agendamento.colaborador_id != usuario.id:
        return jsonify({"msg": "Acesso negado"}), 403

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

# -----------------------------
# Atualizar agendamento
# -----------------------------
@exame_bp.route("/agendamentos/<int:agendamento_id>", methods=["PUT"])
def atualizar_agendamento(agendamento_id):
    verify_jwt_in_request()
    dados = request.json
    usuario_id = get_jwt().get("sub")
    usuario = UsuarioModel.query.get(usuario_id)

    agendamento = Agendamento.query.get(agendamento_id)
    if not agendamento:
        return jsonify({"erro": "Agendamento não encontrado"}), 404

    # COLABORADOR só pode atualizar seus próprios agendamentos
    if usuario.perfil == "COLABORADOR" and agendamento.colaborador_id != usuario.id:
        return jsonify({"msg": "Acesso negado"}), 403

    agendamento_atualizado = ExameService.atualizar_agendamento(
        agendamento_id=agendamento_id,
        data_agendamento=dados.get("data_agendamento"),
        data_realizacao=dados.get("data_realizacao"),
        observacoes=dados.get("observacoes")
    )

    if not agendamento_atualizado:
        return jsonify({"erro": "Erro ao atualizar agendamento"}), 500

    return jsonify({
        "id": agendamento_atualizado.id,
        "colaborador_id": agendamento_atualizado.colaborador_id,
        "exame_id": agendamento_atualizado.exame_id,
        "tipo_exame": agendamento_atualizado.tipo_exame,
        "data_agendamento": agendamento_atualizado.data_agendamento.isoformat() if agendamento_atualizado.data_agendamento else None,
        "data_realizacao": agendamento_atualizado.data_realizacao.isoformat() if agendamento_atualizado.data_realizacao else None
    })

# -----------------------------
# Deletar agendamento
# -----------------------------
@exame_bp.route("/agendamentos/<int:agendamento_id>", methods=["DELETE"])
def deletar_agendamento(agendamento_id):
    verify_jwt_in_request()
    usuario_id = get_jwt().get("sub")
    usuario = UsuarioModel.query.get(usuario_id)

    agendamento = Agendamento.query.get(agendamento_id)
    if not agendamento:
        return jsonify({"erro": "Agendamento não encontrado"}), 404

    # COLABORADOR só pode deletar seus próprios agendamentos
    if usuario.perfil == "COLABORADOR" and agendamento.colaborador_id != usuario.id:
        return jsonify({"msg": "Acesso negado"}), 403

    sucesso = ExameService.deletar_agendamento(agendamento_id)
    
    if sucesso:
        return jsonify({"msg": "Agendamento deletado com sucesso"})
    else:
        return jsonify({"erro": "Erro ao deletar agendamento"}), 500
    
