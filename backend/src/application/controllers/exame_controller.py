from flask import Blueprint, request, jsonify
from src.application.services.exame_service import ExameService
from src.infrastructure.model.usuario_model import UsuarioModel

exame_bp = Blueprint("exame_bp", __name__)

# Criar exame
@exame_bp.route("/exames", methods=["POST"])
def criar_exame():
    dados = request.json
    exame = ExameService.criar(
        nome=dados["nome"],
        colaborador_id=dados["colaborador_id"],
        tipo_exame=dados["tipo_exame"],
        data_agendamento=dados.get("data_agendamento"),
        descricao=dados.get("descricao"),
        observacoes=dados.get("observacoes")
    )
    return jsonify({"id": exame.id, "nome": exame.nome, "status": exame.status})

# Listar todos exames
@exame_bp.route("/exames", methods=["GET"])
def listar_exames():
    exames = ExameService.listar()
    return jsonify([{
        "id": e.id,
        "nome": e.nome,
        "colaborador": e.colaborador.nome,
        "tipo_exame": e.tipo_exame,
        "data_agendamento": e.data_agendamento,
        "data_realizacao": e.data_realizacao,
        "status": e.status
    } for e in exames])

# Listar exames por colaborador
@exame_bp.route("/exames/colaborador/<int:colaborador_id>", methods=["GET"])
def listar_exames_por_colaborador(colaborador_id):
    colaborador = UsuarioModel.query.get(colaborador_id)
    if not colaborador:
        return jsonify({"erro": "Colaborador não encontrado"}), 404
    exames = ExameService.buscar_por_colaborador(colaborador_id)
    return jsonify([{
        "id": e.id,
        "nome": e.nome,
        "tipo_exame": e.tipo_exame,
        "data_agendamento": e.data_agendamento,
        "data_realizacao": e.data_realizacao,
        "status": e.status
    } for e in exames])

# Listar exames por status
@exame_bp.route("/exames/status/<string:status>", methods=["GET"])
def listar_exames_por_status(status):
    exames = ExameService.buscar_por_status(status)
    return jsonify([{
        "id": e.id,
        "nome": e.nome,
        "colaborador": e.colaborador.nome,
        "tipo_exame": e.tipo_exame,
        "data_agendamento": e.data_agendamento,
        "data_realizacao": e.data_realizacao,
        "status": e.status
    } for e in exames])

# Atualizar exame
@exame_bp.route("/exames/<int:exame_id>", methods=["PUT"])
def atualizar_exame(exame_id):
    dados = request.json
    exame = ExameService.atualizar(exame_id, **dados)
    if not exame:
        return jsonify({"erro": "Exame não encontrado"}), 404
    return jsonify({"id": exame.id, "nome": exame.nome, "status": exame.status})

# Deletar exame
@exame_bp.route("/exames/<int:exame_id>", methods=["DELETE"])
def deletar_exame(exame_id):
    sucesso = ExameService.deletar(exame_id)
    if not sucesso:
        return jsonify({"erro": "Exame não encontrado"}), 404
    return jsonify({"msg": "Exame deletado com sucesso"})