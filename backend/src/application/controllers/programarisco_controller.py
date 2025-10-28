from flask import Blueprint, request, jsonify
from src.application.services.programarisco_service import ProgramaRiscoService
from src.application.services.authorization_service import AuthorizationService
from src.utils.role_required import role_required

programa_bp = Blueprint("programa_bp", __name__, url_prefix="/programas-risco")

def serialize_programa(programa):
    """Função auxiliar para serializar o objeto ProgramaRisco."""
    return {
        "id": programa.id,
        "nome": programa.nome,
        "descricao": programa.descricao,
        "ativo": programa.ativo
    }

# -----------------------------
# CRUD de Programas de Risco
# -----------------------------

@programa_bp.route("/", methods=["POST"])
# Acesso restrito a SESMIT, usando a permissão já definida.
@role_required(AuthorizationService.pode_crud_cargos) 
def criar_programa(authz: AuthorizationService):
    dados = request.json
    try:
        programa = ProgramaRiscoService.criar_programa(dados["nome"], dados.get("descricao"))
        return jsonify(serialize_programa(programa)), 201
    except ValueError as e:
        return jsonify({"erro": str(e)}), 400
    except Exception as e:
        return jsonify({"erro": "Erro ao criar programa de risco"}), 500

@programa_bp.route("/", methods=["GET"])
@role_required(AuthorizationService.pode_crud_cargos)
def listar_programas(authz: AuthorizationService):
    programas = ProgramaRiscoService.listar_programas()
    return jsonify([serialize_programa(p) for p in programas])

@programa_bp.route("/<int:programa_id>", methods=["GET"])
@role_required(AuthorizationService.pode_crud_cargos)
def buscar_programa(programa_id, authz: AuthorizationService):
    programa = ProgramaRiscoService.buscar_programa_por_id(programa_id)
    if not programa:
        return jsonify({"erro": "Programa de Risco não encontrado"}), 404
    return jsonify(serialize_programa(programa))


@programa_bp.route("/<int:programa_id>", methods=["PUT"])
@role_required(AuthorizationService.pode_crud_cargos)
def atualizar_programa(programa_id, authz: AuthorizationService):
    dados = request.json
    try:
        programa = ProgramaRiscoService.atualizar_programa(
            programa_id, 
            dados.get("nome"), 
            dados.get("descricao"),
            dados.get("ativo")
        )
        return jsonify(serialize_programa(programa))
    except ValueError as e:
        return jsonify({"erro": str(e)}), 404
    except Exception as e:
        return jsonify({"erro": "Erro ao atualizar programa"}), 500

@programa_bp.route("/<int:programa_id>", methods=["DELETE"])
@role_required(AuthorizationService.pode_crud_cargos)
def deletar_programa(programa_id, authz: AuthorizationService):
    """Deleta o programa (deleção lógica/inativação)."""
    try:
        programa_inativado = ProgramaRiscoService.deletar_programa(programa_id)
        return jsonify({
            "msg": f"Programa de Risco '{programa_inativado.nome}' inativado com sucesso.",
            "ativo": False
        }), 200
    except ValueError as e:
        return jsonify({"erro": str(e)}), 404
    except Exception as e:
        return jsonify({"erro": "Erro ao inativar programa"}), 500