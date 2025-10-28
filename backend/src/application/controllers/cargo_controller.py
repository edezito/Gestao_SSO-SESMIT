from flask import Blueprint, request, jsonify
from src.application.services.cargo_service import CargoService
from src.application.services.authorization_service import AuthorizationService
from src.utils.role_required import role_required

cargo_bp = Blueprint("cargo_bp", __name__, url_prefix="/cargos")

def serialize_cargo(cargo):
    """Função auxiliar para serializar o objeto CargoModel."""
    return {
        "id": cargo.id,
        "nome": cargo.nome,
        "descricao": cargo.descricao,
        # Incluir associações
        "riscos_associados": [r.id for r in cargo.riscos_associados],
        "exames_exigidos": [e.id for e in cargo.exames_exigidos],
    }

# -----------------------------
# CRUD de Cargos
# -----------------------------

@cargo_bp.route("/", methods=["POST"])
@role_required(AuthorizationService.pode_crud_cargos) # Apenas SESMIT
def criar_cargo(authz: AuthorizationService):
    dados = request.json
    try:
        cargo = CargoService.criar_cargo(dados["nome"], dados.get("descricao"))
        return jsonify(serialize_cargo(cargo)), 201
    except ValueError as e:
        return jsonify({"erro": str(e)}), 400
    except Exception as e:
        return jsonify({"erro": "Erro ao criar cargo"}), 500

@cargo_bp.route("/", methods=["GET"])
@role_required(AuthorizationService.pode_crud_cargos) # Apenas SESMIT
def listar_cargos(authz: AuthorizationService):
    cargos = CargoService.listar_cargos()
    return jsonify([serialize_cargo(c) for c in cargos])

@cargo_bp.route("/<int:cargo_id>", methods=["PUT"])
@role_required(AuthorizationService.pode_crud_cargos) # Apenas SESMIT
def atualizar_cargo(cargo_id, authz: AuthorizationService):
    dados = request.json
    try:
        cargo = CargoService.atualizar_cargo(cargo_id, dados.get("nome"), dados.get("descricao"))
        return jsonify(serialize_cargo(cargo))
    except ValueError as e:
        return jsonify({"erro": str(e)}), 404
    except Exception as e:
        return jsonify({"erro": "Erro ao atualizar cargo"}), 500

@cargo_bp.route("/<int:cargo_id>", methods=["DELETE"])
@role_required(AuthorizationService.pode_crud_cargos) # Apenas SESMIT
def deletar_cargo(cargo_id, authz: AuthorizationService):
    try:
        CargoService.deletar_cargo(cargo_id)
        return jsonify({"msg": "Cargo deletado com sucesso"}), 200
    except ValueError as e:
        return jsonify({"erro": str(e)}), 400 # 400 para erro de vínculo ou 404
    except Exception as e:
        return jsonify({"erro": "Erro ao deletar cargo"}), 500
        
# -----------------------------
# Vínculos (Riscos e Exames)
# -----------------------------

@cargo_bp.route("/<int:cargo_id>/riscos", methods=["POST"])
@role_required(AuthorizationService.pode_crud_cargos) # Apenas SESMIT
def vincular_riscos_ao_cargo(cargo_id, authz: AuthorizationService):
    risco_ids = request.json.get("risco_ids", [])
    if not isinstance(risco_ids, list):
        return jsonify({"erro": "O campo 'risco_ids' deve ser uma lista de IDs."}), 400
        
    try:
        cargo_atualizado = CargoService.vincular_riscos(cargo_id, risco_ids)
        
        # Aqui, a lógica de geração automática de exames (em UsuarioService)
        # seria disparada para os colaboradores afetados, mas isso é uma rotina
        # que pode ser assíncrona ou manual, fora do escopo desta rota.
        
        return jsonify({
            "msg": f"Riscos vinculados ao cargo {cargo_atualizado.nome} com sucesso.",
            "riscos_associados": [r.id for r in cargo_atualizado.riscos_associados]
        }), 200
    except ValueError as e:
        return jsonify({"erro": str(e)}), 404
    except Exception as e:
        return jsonify({"erro": "Erro ao vincular riscos"}), 500
        
@cargo_bp.route("/<int:cargo_id>/exames", methods=["POST"])
@role_required(AuthorizationService.pode_crud_cargos) # Apenas SESMIT
def vincular_exames_ao_cargo(cargo_id, authz: AuthorizationService):
    exame_ids = request.json.get("exame_ids", [])
    if not isinstance(exame_ids, list):
        return jsonify({"erro": "O campo 'exame_ids' deve ser uma lista de IDs."}), 400
        
    try:
        cargo_atualizado = CargoService.vincular_exames(cargo_id, exame_ids)
        return jsonify({
            "msg": f"Exames diretos vinculados ao cargo {cargo_atualizado.nome} com sucesso.",
            "exames_exigidos": [e.id for e in cargo_atualizado.exames_exigidos]
        }), 200
    except ValueError as e:
        return jsonify({"erro": str(e)}), 404
    except Exception as e:
        return jsonify({"erro": "Erro ao vincular exames"}), 500