from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, current_user
from src.application.services.usuario_service import UsuarioService
from src.infrastructure.model.usuario_model import UsuarioModel
from src.application.services.authorization_service import AuthorizationService
from src.domain.usuario_domain import UserDomain
from src.utils.role_required import role_required

usuario_bp = Blueprint("usuario_bp", __name__)

# -----------------------------
# CADASTRO PÚBLICO (sem autenticação)
# -----------------------------
@usuario_bp.route("/cadastro", methods=["POST"])
def cadastrar_usuario():
    dados = request.json
    try:
        user_domain = UserDomain(
            nome=dados["nome"],
            email=dados["email"],
            senha=dados["senha"],
            perfil=dados.get("perfil", "COLABORADOR"),
            cargo_id=dados.get("cargo_id")
        )
        novo_usuario = UsuarioService.criar_usuario(user_domain)
        return jsonify({
            "id": novo_usuario.id,
            "nome": novo_usuario.nome,
            "email": novo_usuario.email,
            "perfil": novo_usuario.perfil,
            "cargo": novo_usuario.cargo.nome if novo_usuario.cargo else None
        }), 201
    except Exception as e:
        return jsonify({"erro": str(e)}), 400

# -----------------------------
# LOGIN (sem autenticação)
# -----------------------------
@usuario_bp.route("/login", methods=["POST"])
def login():
    dados = request.json
    try:
        token = UsuarioService.autenticar(
            email=dados["email"],
            senha=dados["senha"]
        )
        if not token:
            return jsonify({"erro": "Credenciais inválidas"}), 401
        return jsonify({"token": token})
    except Exception as e:
        return jsonify({"erro": str(e)}), 400

# -----------------------------
# Listar usuários/colaboradores
# -----------------------------
@usuario_bp.route("/colaboradores", methods=["GET"])
@jwt_required() 
@role_required(lambda authz: authz.pode_administrar_usuarios())
def listar_colaboradores():  # ✅ Remove authz parameter
    usuarios = UsuarioService.listar_usuarios()
    return jsonify([{
        "id": u.id,
        "nome": u.nome,
        "email": u.email,
        "perfil": u.perfil,
        "ativo": u.ativo,
        "cargo": u.cargo.nome if u.cargo else None
    } for u in usuarios])

# -----------------------------
# Buscar usuário por ID
# -----------------------------
@usuario_bp.route("/colaboradores/<int:usuario_id>", methods=["GET"])
@jwt_required() 
@role_required(lambda authz: authz.pode_visualizar_usuario(usuario_id))  # ✅ Nova permissão
def buscar_colaborador(usuario_id):
    usuario = UsuarioService.buscar_usuario_por_id(usuario_id)
    if not usuario:
        return jsonify({"erro": "Usuário não encontrado"}), 404

    return jsonify({
        "id": usuario.id,
        "nome": usuario.nome,
        "email": usuario.email,
        "perfil": usuario.perfil,
        "cargo": usuario.cargo.nome if usuario.cargo else None,
        "ativo": usuario.ativo,
        "criado_em": usuario.criado_em.isoformat() if usuario.criado_em else None
    })

# -----------------------------
# Criar usuário (com autenticação)
# -----------------------------
@usuario_bp.route("/colaboradores", methods=["POST"])
@jwt_required() 
@role_required(lambda authz: authz.pode_administrar_usuarios())
def criar_colaborador():  # ✅ Remove authz parameter
    dados = request.json
    try:
        user_domain = UserDomain(
            nome=dados["nome"],
            email=dados["email"],
            senha=dados["senha"],
            perfil=dados.get("perfil", "COLABORADOR"),
            cargo_id=dados.get("cargo_id")
        )
        novo_usuario = UsuarioService.criar_usuario(user_domain)
        return jsonify({
            "id": novo_usuario.id,
            "nome": novo_usuario.nome,
            "email": novo_usuario.email,
            "perfil": novo_usuario.perfil,
            "cargo": novo_usuario.cargo.nome if novo_usuario.cargo else None
        }), 201
    except Exception as e:
        return jsonify({"erro": str(e)}), 400

# -----------------------------
# Atualizar usuário
# -----------------------------
@usuario_bp.route("/colaboradores/<int:usuario_id>", methods=["PUT"])
@jwt_required() 
@role_required(lambda authz: authz.pode_administrar_usuarios() or authz.usuario.id == usuario_id)
def atualizar_colaborador(usuario_id):
    dados = request.json
    try:
        usuario_atualizado = UsuarioService.atualizar_usuario(
            usuario_id=usuario_id,
            **dados
        )
        return jsonify({
            "id": usuario_atualizado.id,
            "nome": usuario_atualizado.nome,
            "email": usuario_atualizado.email,
            "perfil": usuario_atualizado.perfil,
            "cargo": usuario_atualizado.cargo.nome if usuario_atualizado.cargo else None
        })
    except Exception as e:
        return jsonify({"erro": str(e)}), 400

# -----------------------------
# Deletar usuário (inativar)
# -----------------------------
@usuario_bp.route("/colaboradores/<int:usuario_id>", methods=["DELETE"])
@jwt_required() 
@role_required(lambda authz: authz.pode_administrar_usuarios())
def deletar_colaborador(usuario_id):  # ✅ Remove authz parameter
    try:
        usuario_inativado = UsuarioService.inativar_usuario(usuario_id) 
        return jsonify({
            "msg": f"Usuário {usuario_inativado.nome} inativado com sucesso",
            "ativo": usuario_inativado.ativo
        })
    except ValueError as e:
        return jsonify({"erro": str(e)}), 404
    except Exception as e:
        return jsonify({"erro": "Erro ao inativar usuário"}), 500