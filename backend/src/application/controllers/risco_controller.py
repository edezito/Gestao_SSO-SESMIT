from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, current_user
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
# CRUD de Riscos - CORRIGIDO
# -----------------------------

@risco_bp.route("/", methods=["POST"])
@jwt_required()
@role_required(lambda authz: authz.pode_crud_cargos())  # ✅ CORREÇÃO: usar lambda
def criar_risco():
    dados = request.json
    try:
        if not dados.get("nome"):
            return jsonify({"erro": "Nome do risco é obrigatório"}), 400
            
        risco = RiscoService.criar_risco(dados["nome"], dados.get("descricao"))
        return jsonify(serialize_risco(risco)), 201
    except ValueError as e:
        return jsonify({"erro": str(e)}), 400
    except Exception as e:
        print(f"Erro ao criar risco: {str(e)}")
        return jsonify({"erro": "Erro interno ao criar risco"}), 500

@risco_bp.route("/", methods=["GET"])
@jwt_required()
@role_required(lambda authz: authz.pode_crud_cargos())  # ✅ CORREÇÃO: usar lambda
def listar_riscos():
    try:
        riscos = RiscoService.listar_riscos()
        return jsonify([serialize_risco(r) for r in riscos])
    except Exception as e:
        print(f"Erro ao listar riscos: {str(e)}")
        return jsonify({"erro": "Erro interno ao listar riscos"}), 500

@risco_bp.route("/<int:risco_id>", methods=["PUT"])
@jwt_required()
@role_required(lambda authz: authz.pode_crud_cargos())  # ✅ CORREÇÃO: usar lambda
def atualizar_risco(risco_id):
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
        print(f"Erro ao atualizar risco: {str(e)}")
        return jsonify({"erro": "Erro interno ao atualizar risco"}), 500

@risco_bp.route("/<int:risco_id>", methods=["DELETE"])
@jwt_required()
@role_required(lambda authz: authz.pode_crud_cargos())  # ✅ CORREÇÃO: usar lambda
def deletar_risco(risco_id):
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
        print(f"Erro ao deletar risco: {str(e)}")
        return jsonify({"erro": "Erro interno ao inativar risco"}), 500

# -----------------------------
# Vínculo Risco -> Exame Obrigatório
# -----------------------------

@risco_bp.route("/<int:risco_id>/exames", methods=["POST"])
@jwt_required()
@role_required(lambda authz: authz.pode_crud_cargos())  # ✅ CORREÇÃO: usar lambda
def vincular_exames_ao_risco(risco_id):
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
        print(f"Erro ao vincular exames: {str(e)}")
        return jsonify({"erro": "Erro interno ao vincular exames ao risco"}), 500