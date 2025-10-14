from flask import Blueprint, request, jsonify
from src.application.services.programa_risco_service import ProgramaRiscoService

prog_bp = Blueprint("programa_risco_bp", __name__, url_prefix="/programas_risco")

@prog_bp.route("", methods=["POST"])
def criar_programa():
    dados = request.json
    prog = ProgramaRiscoService.criar(nome=dados.get("nome"), descricao=dados.get("descricao"))
    return jsonify({"id": prog.id, "nome": prog.nome})

@prog_bp.route("", methods=["GET"])
def listar_programas():
    lista = ProgramaRiscoService.listar()
    return jsonify([{"id": p.id, "nome": p.nome, "descricao": p.descricao} for p in lista])