from flask import Blueprint, request, jsonify
from src.application.services.cargo_service import CargoService

cargo_bp = Blueprint("cargo_bp", __name__)

@cargo_bp.route("/cargos", methods=["POST"])
def criar_cargo():
    dados = request.json
    try:
        cargo = CargoService.criar(dados["nome"])
        return jsonify({"id": cargo.id, "nome": cargo.nome})
    except ValueError as e:
        return jsonify({"erro": str(e)}), 400

@cargo_bp.route("/cargos", methods=["GET"])
def listar_cargos():
    cargos = CargoService.listar()
    return jsonify([{"id": c.id, "nome": c.nome} for c in cargos])

@cargo_bp.route("/cargos/<int:cargo_id>", methods=["GET"])
def buscar_cargo(cargo_id):
    cargo = CargoService.buscar_por_id(cargo_id)
    if not cargo:
        return jsonify({"erro": "Cargo não encontrado"}), 404
    return jsonify({"id": cargo.id, "nome": cargo.nome})

@cargo_bp.route("/cargos/<int:cargo_id>", methods=["PUT"])
def atualizar_cargo(cargo_id):
    dados = request.json
    try:
        cargo = CargoService.atualizar(cargo_id, dados.get("nome"))
        return jsonify({"id": cargo.id, "nome": cargo.nome})
    except ValueError as e:
        return jsonify({"erro": str(e)}), 404

@cargo_bp.route("/cargos/<int:cargo_id>", methods=["DELETE"])
def deletar_cargo(cargo_id):
    try:
        CargoService.deletar(cargo_id)
        return jsonify({"msg": "Cargo deletado com sucesso"})
    except ValueError as e:
        return jsonify({"erro": str(e)}), 404