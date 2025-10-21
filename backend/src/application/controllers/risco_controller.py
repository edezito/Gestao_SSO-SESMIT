from flask import Blueprint, request, jsonify
from src.application.services.risco_service import RiscoService
from src.utils.decorators import roles_required

risco_bp = Blueprint("risco_bp", __name__, url_prefix="/riscos")

@risco_bp.route("/", methods=["POST"])
@roles_required("SESMIT")
def criar_risco():
    dados = request.json
    risco = RiscoService.criar(
        nome=dados.get("nome"),
        descricao=dados.get("descricao"),
        severidade=dados.get("severidade", "MEDIA"),
        programa_id=dados.get("programa_id"),
        exames_obrigatorios_ids=dados.get("exames_obrigatorios_ids")
    )
    return jsonify({"id": risco.id, "nome": risco.nome})

@risco_bp.route("/", methods=["GET"])
@roles_required("SESMIT", "GESTOR")
def listar_riscos():
    riscos = RiscoService.listar()
    return jsonify([
        {
            "id": r.id,
            "nome": r.nome,
            "descricao": r.descricao,
            "severidade": r.severidade,
            "programa_id": r.programa_id,
            "exames_obrigatorios": [{"id": e.id, "nome": e.nome} for e in r.exames_obrigatorios]
        }
        for r in riscos
    ])