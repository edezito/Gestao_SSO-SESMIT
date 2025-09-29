from flask import Blueprint, jsonify
from src.infrastructure.model.cargo_model import Cargo

dashboard_bp = Blueprint("dashboard_bp", __name__)

@dashboard_bp.route("/dashboard/cargos", methods=["GET"])
def dashboard_cargos():
    cargos = Cargo.query.all()
    resultado = []

    for cargo in cargos:
        resultado.append({
            "cargo": cargo.nome,
            "riscos": [r.nome for r in cargo.riscos],
            "exames": [e.nome for e in cargo.exames]
        })

    return jsonify(resultado)