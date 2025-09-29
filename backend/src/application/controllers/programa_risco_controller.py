from flask import Blueprint, request, jsonify
from src.application.services.programa_risco_service import ProgramaRiscoService

programa_bp = Blueprint("programa_bp", __name__)

@programa_bp.route("/programas", methods=["POST"])
def criar_programa():
    dados = request.json
    programa = ProgramaRiscoService.criar(dados["nome"], dados.get("descricao"))
    return jsonify({"id": programa.id, "nome": programa.nome})

@programa_bp.route("/programas", methods=["GET"])
def listar_programas():
    programas = ProgramaRiscoService.listar()
    return jsonify([{"id": p.id, "nome": p.nome} for p in programas])