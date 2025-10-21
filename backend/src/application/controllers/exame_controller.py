from flask import Blueprint, request, jsonify
from src.application.services.exame_service import ExameService
from src.infrastructure.model.usuario_model import UsuarioModel
from flask_jwt_extended import get_jwt, jwt_required


from src.utils.decorators import roles_required

exame_bp = Blueprint("exame_bp", __name__)

@exame_bp.route("/exames", methods=["POST"])
@roles_required("COLABORADOR", "SESMIT", "GESTOR")
def criar_exame():
    dados = request.json or {}
    claims = get_jwt()
    perfil = claims.get("perfil")
    user_id = claims.get("sub")

    colaborador_id = dados.get("colaborador_id")
    if not colaborador_id:
        return jsonify({"erro": "colaborador_id obrigatório"}), 400

    if perfil == "COLABORADOR" and colaborador_id != user_id:
        return jsonify({"erro": "Colaborador só pode agendar seus próprios exames"}), 403

    colaborador = UsuarioModel.query.get(colaborador_id)
    if not colaborador:
        return jsonify({"erro": "Colaborador não encontrado"}), 404

    exame = ExameService.criar(
        nome=dados["nome"],
        colaborador_id=colaborador_id,
        tipo_exame=dados["tipo_exame"],
        data_agendamento=dados.get("data_agendamento"),
        descricao=dados.get("descricao"),
        observacoes=dados.get("observacoes")
    )

    return jsonify({"id": exame.id, "nome": exame.nome, "status": exame.status}), 201


@exame_bp.route("/exames", methods=["GET"])
@jwt_required()
@roles_required("COLABORADOR", "SESMIT", "GESTOR")
def listar_exames():
    claims = get_jwt()
    perfil = claims.get("perfil")
    user_id = claims.get("sub")

    if perfil == "COLABORADOR":
        exames = ExameService.buscar_por_colaborador(user_id)
    else:
        exames = ExameService.listar()

    return jsonify([
        {
            "id": e.id,
            "nome": e.nome,
            "colaborador_id": e.colaborador_id,
            "colaborador_nome": getattr(e.colaborador, "nome", None),
            "tipo_exame": e.tipo_exame,
            "data_agendamento": e.data_agendamento.isoformat() if e.data_agendamento else None,
            "data_realizacao": e.data_realizacao.isoformat() if e.data_realizacao else None,
            "status": e.status
        }
        for e in exames
    ])