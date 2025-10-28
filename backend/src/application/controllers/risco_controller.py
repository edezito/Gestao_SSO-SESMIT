from flask import Blueprint, request, jsonify
from src.application.services.risco_service import RiscoService
from src.application.services.authorization_service import AuthorizationService
from src.utils.role_required import role_required

risco_bp = Blueprint("risco_bp", __name__, url_prefix="/riscos")

def serialize_risco(risco):
    """Função auxiliar para serializar o objeto Risco."""
    return {
        "id": risco.id,
        "nome": risco.nome,
        "descricao": risco.descricao,
        "ativo": risco.ativo,
        "exames_obrigatorios": [e.id for e in risco.exames_obrigatorios]
    }

# -----------------------------
# CRUD de Riscos
# -----------------------------

@risco_bp.route("/", methods=["POST"])
# Reutilizar a permissão de SESMIT (pode_crud_cargos), mas idealmente seria 'pode_crud_sso'
@role_required(AuthorizationService.pode_crud_cargos) 
def criar_risco(authz: AuthorizationService):
    dados = request.json
    try:
        risco = RiscoService.criar_risco(dados["nome"], dados.get("descricao"))
        return jsonify(serialize_risco(risco)), 201
    except ValueError as e:
        return jsonify({"erro": str(e)}), 400
    except Exception as e:
        return jsonify({"erro": "Erro ao criar risco"}), 500

@risco_bp.route("/", methods=["GET"])
@role_required(AuthorizationService.pode_crud_cargos)
def listar_riscos(authz: AuthorizationService):
    riscos = RiscoService.listar_riscos()
    return jsonify([serialize_risco(r) for r in riscos])

@risco_bp.route("/<int:risco_id>", methods=["PUT"])
@role_required(AuthorizationService.pode_crud_cargos)
def atualizar_risco(risco_id, authz: AuthorizationService):
    dados = request.json
    try:
        risco = RiscoService.atualizar_risco(
            risco_id, 
            dados.get("nome"), 
            dados.get("descricao"),
            dados.get("ativo")
        )
        return jsonify(serialize_risco(risco))
    except ValueError as e:
        return jsonify({"erro": str(e)}), 404
    except Exception as e:
        return jsonify({"erro": "Erro ao atualizar risco"}), 500

@risco_bp.route("/<int:risco_id>", methods=["DELETE"])
@role_required(AuthorizationService.pode_crud_cargos)
def deletar_risco(risco_id, authz: AuthorizationService):
    """Deleta o risco (deleção lógica/inativação)."""
    try:
        risco_inativado = RiscoService.deletar_risco(risco_id)
        return jsonify({
            "msg": f"Risco '{risco_inativado.nome}' inativado com sucesso.",
            "ativo": False
        }), 200
    except ValueError as e:
        return jsonify({"erro": str(e)}), 404
    except Exception as e:
        return jsonify({"erro": "Erro ao inativar risco"}), 500

# -----------------------------
# Vínculo Risco -> Exame Obrigatório
# -----------------------------

@risco_bp.route("/<int:risco_id>/exames", methods=["POST"])
@role_required(AuthorizationService.pode_crud_cargos)
def vincular_exames_ao_risco(risco_id, authz: AuthorizationService):
    exame_ids = request.json.get("exame_ids", [])
    if not isinstance(exame_ids, list):
        return jsonify({"erro": "O campo 'exame_ids' deve ser uma lista de IDs."}), 400
        
    try:
        risco_atualizado = RiscoService.vincular_exames_obrigatorios(risco_id, exame_ids)
        return jsonify({
            "msg": f"Exames obrigatórios vinculados ao risco '{risco_atualizado.nome}' com sucesso.",
            "exames_obrigatorios": [e.id for e in risco_atualizado.exames_obrigatorios]
        }), 200
    except ValueError as e:
        return jsonify({"erro": str(e)}), 404
    except Exception as e:
        return jsonify({"erro": "Erro ao vincular exames ao risco"}), 500