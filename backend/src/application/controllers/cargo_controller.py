from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, current_user
from src.application.services.cargo_service import CargoService
from src.application.services.authorization_service import AuthorizationService
from src.utils.role_required import role_required

# NOTE: removi url_prefix daqui — controle o prefixo no app.py (ex: "/api/cargos")
cargo_bp = Blueprint("cargo_bp", __name__)

def serialize_cargo(cargo):
    """Função auxiliar para serializar o objeto CargoModel."""
    try:
        # ✅ CORREÇÃO: Verifica se as relações estão carregadas
        riscos_associados = []
        if hasattr(cargo, 'riscos_associados') and cargo.riscos_associados:
            try:
                riscos_associados = [{"id": r.id, "nome": r.nome} for r in cargo.riscos_associados]
            except Exception as e:
                print(f"Erro ao serializar riscos do cargo {cargo.id}: {str(e)}")
                riscos_associados = []

        exames_exigidos = []
        if hasattr(cargo, 'exames_exigidos') and cargo.exames_exigidos:
            try:
                exames_exigidos = [{"id": e.id, "nome": e.nome} for e in cargo.exames_exigidos]
            except Exception as e:
                print(f"Erro ao serializar exames do cargo {cargo.id}: {str(e)}")
                exames_exigidos = []

        total_colaboradores = 0
        if hasattr(cargo, 'usuarios'):
            try:
                # Se usuarios for relationship de SQLAlchemy, .count() funciona apenas em query objects.
                # Se for lista, use len(...)
                try:
                    total_colaboradores = cargo.usuarios.count()
                except Exception:
                    total_colaboradores = len(cargo.usuarios) if cargo.usuarios is not None else 0
            except Exception as e:
                print(f"Erro ao contar usuários do cargo {cargo.id}: {str(e)}")
                total_colaboradores = 0

        return {
            "id": cargo.id,
            "nome": cargo.nome,
            "descricao": cargo.descricao,
            "riscos_associados": riscos_associados,
            "exames_exigidos": exames_exigidos,
            "total_colaboradores": total_colaboradores
        }
    except Exception as e:
        print(f"Erro crítico ao serializar cargo {getattr(cargo, 'id', 'unknown')}: {str(e)}")
        # Retorna dados mínimos em caso de erro
        return {
            "id": getattr(cargo, 'id', 0),
            "nome": getattr(cargo, 'nome', 'Erro'),
            "descricao": getattr(cargo, 'descricao', ''),
            "riscos_associados": [],
            "exames_exigidos": [],
            "total_colaboradores": 0
        }

# -----------------------------
# CRUD de Cargos - LISTAR
# -----------------------------
@cargo_bp.route("/", methods=["GET"], endpoint="cargo_listar")
@jwt_required()
@role_required(lambda authz: authz.pode_crud_cargos())
def listar_cargos():
    try:
        print("🔄 Iniciando listagem de cargos...")
        cargos = CargoService.listar_cargos()
        print(f"✅ Service retornou {len(cargos)} cargos")
        
        cargos_serializados = []
        for i, cargo in enumerate(cargos):
            try:
                print(f"🔄 Serializando cargo {i+1}/{len(cargos)}: {getattr(cargo, 'nome', '—')}")
                cargo_serializado = serialize_cargo(cargo)
                cargos_serializados.append(cargo_serializado)
                print(f"✅ Cargo {getattr(cargo, 'nome', '—')} serializado com sucesso")
            except Exception as e:
                print(f"❌ Erro ao serializar cargo {getattr(cargo, 'id', 'unknown')}: {str(e)}")
                # Adiciona dados básicos mesmo com erro
                cargos_serializados.append({
                    "id": getattr(cargo, 'id', None),
                    "nome": getattr(cargo, 'nome', ''),
                    "descricao": getattr(cargo, 'descricao', ''),
                    "riscos_associados": [],
                    "exames_exigidos": [],
                    "total_colaboradores": 0
                })
        
        print(f"✅ Retornando {len(cargos_serializados)} cargos serializados")
        return jsonify(cargos_serializados)
        
    except Exception as e:
        print(f"❌ Erro crítico ao listar cargos: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"erro": f"Erro interno ao listar cargos: {str(e)}"}), 500

# -----------------------------
# CRUD de Cargos - CRIAR
# -----------------------------
@cargo_bp.route("/", methods=["POST"], endpoint="cargo_criar")
@jwt_required()
@role_required(lambda authz: authz.pode_crud_cargos())
def criar_cargo():
    dados = request.json
    try:
        if not dados or not dados.get("nome"):
            return jsonify({"erro": "Nome do cargo é obrigatório"}), 400
            
        cargo = CargoService.criar_cargo(dados["nome"], dados.get("descricao"))
        return jsonify(serialize_cargo(cargo)), 201
    except ValueError as e:
        return jsonify({"erro": str(e)}), 400
    except Exception as e:
        print(f"Erro ao criar cargo: {str(e)}")
        import traceback; traceback.print_exc()
        return jsonify({"erro": "Erro interno ao criar cargo"}), 500

# -----------------------------
# CRUD de Cargos - ATUALIZAR
# -----------------------------
@cargo_bp.route("/<int:cargo_id>", methods=["PUT"], endpoint="cargo_atualizar")
@jwt_required()
@role_required(lambda authz: authz.pode_crud_cargos())
def atualizar_cargo(cargo_id):
    dados = request.json
    try:
        cargo = CargoService.atualizar_cargo(cargo_id, dados.get("nome"), dados.get("descricao"))
        return jsonify(serialize_cargo(cargo))
    except ValueError as e:
        return jsonify({"erro": str(e)}), 404
    except Exception as e:
        print(f"Erro ao atualizar cargo: {str(e)}")
        import traceback; traceback.print_exc()
        return jsonify({"erro": "Erro interno ao atualizar cargo"}), 500

# -----------------------------
# CRUD de Cargos - DELETAR
# -----------------------------
@cargo_bp.route("/<int:cargo_id>", methods=["DELETE"], endpoint="cargo_deletar")
@jwt_required()
@role_required(lambda authz: authz.pode_crud_cargos())
def deletar_cargo(cargo_id):
    try:
        CargoService.deletar_cargo(cargo_id)
        return jsonify({"msg": "Cargo deletado com sucesso"}), 200
    except ValueError as e:
        return jsonify({"erro": str(e)}), 400
    except Exception as e:
        print(f"Erro ao deletar cargo: {str(e)}")
        import traceback; traceback.print_exc()
        return jsonify({"erro": "Erro interno ao deletar cargo"}), 500
        
# -----------------------------
# Vínculos (Riscos e Exames) - COM ATUALIZAÇÃO AUTOMÁTICA
# -----------------------------
@cargo_bp.route("/<int:cargo_id>/riscos", methods=["POST"], endpoint="cargo_vincular_riscos")
@jwt_required()
@role_required(lambda authz: authz.pode_crud_cargos())
def vincular_riscos_ao_cargo(cargo_id):
    risco_ids = request.json.get("risco_ids", [])
    if not isinstance(risco_ids, list):
        return jsonify({"erro": "O campo 'risco_ids' deve ser uma lista de IDs."}), 400
        
    try:
        cargo_atualizado = CargoService.vincular_riscos(cargo_id, risco_ids)
        
        return jsonify({
            "msg": f"Riscos vinculados ao cargo {cargo_atualizado.nome} com sucesso. Exames gerados automaticamente para {cargo_atualizado.usuarios.count()} colaboradores.",
            "riscos_associados": [{"id": r.id, "nome": r.nome} for r in cargo_atualizado.riscos_associados],
            "colaboradores_afetados": cargo_atualizado.usuarios.count()
        }), 200
    except ValueError as e:
        return jsonify({"erro": str(e)}), 404
    except Exception as e:
        print(f"Erro ao vincular riscos: {str(e)}")
        import traceback; traceback.print_exc()
        return jsonify({"erro": "Erro interno ao vincular riscos"}), 500
        
@cargo_bp.route("/<int:cargo_id>/exames", methods=["POST"], endpoint="cargo_vincular_exames")
@jwt_required()
@role_required(lambda authz: authz.pode_crud_cargos())
def vincular_exames_ao_cargo(cargo_id):
    exame_ids = request.json.get("exame_ids", [])
    if not isinstance(exame_ids, list):
        return jsonify({"erro": "O campo 'exame_ids' deve ser uma lista de IDs."}), 400
        
    try:
        cargo_atualizado = CargoService.vincular_exames(cargo_id, exame_ids)
        return jsonify({
            "msg": f"Exames diretos vinculados ao cargo {cargo_atualizado.nome} com sucesso. Exames gerados automaticamente para {cargo_atualizado.usuarios.count()} colaboradores.",
            "exames_exigidos": [{"id": e.id, "nome": e.nome} for e in cargo_atualizado.exames_exigidos],
            "colaboradores_afetados": cargo_atualizado.usuarios.count()
        }), 200
    except ValueError as e:
        return jsonify({"erro": str(e)}), 404
    except Exception as e:
        print(f"Erro ao vincular exames: {str(e)}")
        import traceback; traceback.print_exc()
        return jsonify({"erro": "Erro interno ao vincular exames"}), 500

# -----------------------------
# NOVA ROTA: Atualizar exames de um colaborador específico
# -----------------------------
@cargo_bp.route("/colaboradores/<int:colaborador_id>/atualizar-exames", methods=["POST"], endpoint="cargo_atualizar_exames_colaborador")
@jwt_required()
@role_required(lambda authz: authz.pode_crud_cargos())
def atualizar_exames_colaborador(colaborador_id):
    """
    Atualiza os exames de um colaborador específico baseado no seu cargo atual.
    Útil quando um colaborador muda de cargo manualmente.
    """
    try:
        CargoService.atualizar_exames_colaborador(colaborador_id)
        return jsonify({
            "msg": f"Exames do colaborador atualizados com sucesso.",
            "colaborador_id": colaborador_id
        }), 200
    except Exception as e:
        print(f"Erro ao atualizar exames do colaborador: {str(e)}")
        import traceback; traceback.print_exc()
        return jsonify({"erro": "Erro interno ao atualizar exames"}), 500
