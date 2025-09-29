from flask import Blueprint, request, jsonify
from src.application.services.exame_service import ExameService
from src.infrastructure.model.cargo_model import Cargo

exame_bp = Blueprint("exame_bp", __name__)

@exame_bp.route("/exames", methods=["POST"])
def criar_exame():
    dados = request.json
    exame = ExameService.criar(dados["nome"], dados.get("descricao"))
    return jsonify({"id": exame.id, "nome": exame.nome})

@exame_bp.route("/exames", methods=["GET"])
def listar_exames():
    exames = ExameService.listar()
    return jsonify([{"id": e.id, "nome": e.nome} for e in exames])

@exame_bp.route("/exames/cargo/<int:cargo_id>", methods=["GET"])
def listar_exames_por_cargo(cargo_id):
    cargo = Cargo.query.get(cargo_id)
    if not cargo:
        return jsonify({"erro": "Cargo não encontrado"}), 404
    exames = ExameService.buscar_por_cargo(cargo)
    return jsonify([{"id": e.id, "nome": e.nome} for e in exames])