from flask import Blueprint, request, jsonify
from src.application.services.cargo_service import CargoService
from src.application.services.vinculo_service import VinculoService

cargo_bp = Blueprint("cargo_bp", __name__)

@cargo_bp.route("/", methods=["POST"])
def criar_cargo():
    dados = request.json
    cargo = CargoService.criar(nome=dados.get("nome"), descricao=dados.get("descricao"), riscos_ids=dados.get("riscos_ids"))
    return jsonify({"id": cargo.id, "nome": cargo.nome})

@cargo_bp.route("/", methods=["GET"])
def listar_cargos():
    cargos = CargoService.listar()
    return jsonify([{
        "id": c.id,
        "nome": c.nome,
        "descricao": c.descricao,
        "riscos": [{"id": r.id, "nome": r.nome} for r in c.riscos]
    } for c in cargos])

@cargo_bp.route("/<int:cargo_id>/gerar-exames", methods=["POST"])
def gerar_exames_cargo(cargo_id):
    dados = request.json or {}
    tipo = dados.get("tipo_exame", "PERIODICO")
    data_agendamento = dados.get("data_agendamento")
    created = VinculoService.gerar_exames_automaticos_por_cargo(cargo_id, tipo_exame_default=tipo, agendar_data=data_agendamento)
    return jsonify([{"id": e.id, "nome": e.nome, "colaborador_id": e.colaborador_id} for e in created])