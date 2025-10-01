from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt, verify_jwt_in_request
from src.application.services.usuario_service import UsuarioService
from src.infrastructure.model.usuario_model import UsuarioModel
from src.application.services.authorization_service import AuthorizationService
from src.domain.usuario_domain import UserDomain

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
def listar_colaboradores():
    verify_jwt_in_request()
    usuario_id = get_jwt().get("sub")
    usuario = UsuarioModel.query.get(usuario_id)
    authz = AuthorizationService(usuario)

    # Apenas SESMIT, GESTOR podem ver todos os colaboradores
    if usuario.perfil not in ["SESMIT", "GESTOR"]:
        return jsonify({
            "erro": "Acesso restrito",
            "mensagem": "Apenas usuários com perfil SESMIT ou GESTOR podem visualizar a lista de colaboradores.",
            "sugestao": "Solicite acesso ao administrador do sistema."
        }), 403

    usuarios = UsuarioService.listar_usuarios()
    
    if not usuarios:
        return jsonify({
            "mensagem": "Nenhum colaborador encontrado",
            "dados": []
        })
    
    return jsonify([{
        "id": u.id,
        "nome": u.nome,
        "email": u.email,
        "perfil": u.perfil,
        "cargo": u.cargo.nome if u.cargo else None,
        "ativo": u.ativo,
        "criado_em": u.criado_em.isoformat() if u.criado_em else None
    } for u in usuarios])

# -----------------------------
# Buscar usuário por ID
# -----------------------------
@usuario_bp.route("/colaboradores/<int:usuario_id>", methods=["GET"])
def buscar_colaborador(usuario_id):
    verify_jwt_in_request()
    current_user_id = get_jwt().get("sub")
    current_user = UsuarioModel.query.get(current_user_id)
    authz = AuthorizationService(current_user)

    # COLABORADOR só pode ver seu próprio perfil
    if current_user.perfil == "COLABORADOR" and current_user.id != usuario_id:
        return jsonify({"msg": "Acesso negado"}), 403

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
def criar_colaborador():
    verify_jwt_in_request()
    dados = request.json
    usuario_id = get_jwt().get("sub")
    usuario = UsuarioModel.query.get(usuario_id)
    authz = AuthorizationService(usuario)

    # Apenas SESMIT, GESTOR podem criar usuários
    if usuario.perfil not in ["SESMIT", "GESTOR"]:
        return jsonify({"msg": "Acesso negado"}), 403

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
def atualizar_colaborador(usuario_id):
    verify_jwt_in_request()
    dados = request.json
    current_user_id = get_jwt().get("sub")
    current_user = UsuarioModel.query.get(current_user_id)
    authz = AuthorizationService(current_user)

    # COLABORADOR só pode atualizar seu próprio perfil
    if current_user.perfil == "COLABORADOR" and current_user.id != usuario_id:
        return jsonify({"msg": "Acesso negado"}), 403

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
def deletar_colaborador(usuario_id):
    verify_jwt_in_request()
    current_user_id = get_jwt().get("sub")
    current_user = UsuarioModel.query.get(current_user_id)
    authz = AuthorizationService(current_user)

    # Apenas SESMIT, GESTOR podem deletar usuários
    if current_user.perfil not in ["SESMIT", "GESTOR"]:
        return jsonify({"msg": "Acesso negado"}), 403

    sucesso = UsuarioService.deletar_usuario(usuario_id)
    
    if sucesso:
        return jsonify({"msg": "Usuário inativado com sucesso"})
    else:
        return jsonify({"erro": "Erro ao inativar usuário"}), 500