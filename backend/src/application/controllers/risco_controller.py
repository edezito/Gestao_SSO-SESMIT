from flask import Blueprint, request, jsonify
from src.application.services.risco_service import RiscoService

risco_bp = Blueprint("risco_bp", __name__)

@risco_bp.route("/riscos", methods=["POST"])
def criar_risco():
    dados = request.json
    risco = RiscoService.criar(dados["nome"], dados.get("descricao"))
    return jsonify({"id": risco.id, "nome": risco.nome})

@risco_bp.route("/riscos", methods=["GET"])
def listar_riscos():
    riscos = RiscoService.listar()
    return jsonify([{"id": r.id, "nome": r.nome} for r in riscos])

@risco_bp.route("/riscos/<int:risco_id>/cargo/<int:cargo_id>", methods=["POST"])
def associar_risco_cargo(risco_id, cargo_id):
    cargo = RiscoService.associar_risco_cargo(risco_id, cargo_id)
    return jsonify({
        "cargo": cargo.nome,
        "riscos": [r.nome for r in cargo.riscos],
        "exames": [e.nome for e in cargo.exames]
    })