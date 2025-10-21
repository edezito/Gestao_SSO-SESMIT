from flask import Blueprint, request, jsonify
from src.application.services.usuario_service import UsuarioService
from src.domain.usuario_domain import UserDomain
from src.utils.decorators import roles_required
from flask_jwt_extended import get_jwt

usuario_bp = Blueprint('usuario_bp', __name__)

# Rota pública: cadastro
@usuario_bp.route('/cadastro', methods=['POST'])
def cadastro():
    dados = request.json
    try:
        user_domain = UserDomain(
            nome=dados['nome'],
            email=dados['email'],
            senha=dados['senha'],
            perfil=dados['perfil'],
            cargo_id=dados.get('cargo_id')  # novo campo
        )
        usuario = UsuarioService.criar_usuario(user_domain)
        return jsonify({'msg': 'Usuário cadastrado', 'id': usuario.id})
    except ValueError as e:
        return jsonify({'erro': str(e)}), 400

# Rota pública: login
@usuario_bp.route('/login', methods=['POST'])
def login():
    dados = request.json
    token = UsuarioService.autenticar(dados['email'], dados['senha'])
    if not token:
        return jsonify({'erro': 'Email ou senha incorretos'}), 401
    return jsonify({'access_token': token})

# Rota unificada para /usuario/<id>
@usuario_bp.route("/usuario/<int:id>", methods=['PUT', 'DELETE'])
@roles_required("COLABORADOR", "SESMIT", "GESTOR", self_allowed=True)
def gerenciar_usuario(id):
    claims = get_jwt()
    perfil = claims.get("perfil")
    user_id = claims.get("sub")

    if request.method == 'PUT':
        dados = request.json
        # COLABORADOR só pode atualizar seus próprios dados (self_allowed já faz isso)
        usuario = UsuarioService.atualizar_usuario(
            usuario_id=id,
            nome=dados.get('nome'),
            senha=dados.get('senha'),
            perfil=dados.get('perfil') if perfil != "COLABORADOR" else None
        )
        return jsonify({'msg': 'Usuário atualizado', 'id': usuario.id})

    if request.method == 'DELETE':
        # COLABORADOR não pode desativar outros
        usuario = UsuarioService.desativar_usuario(id)
        return jsonify({'msg': 'Usuário desativado', 'id': usuario.id})
# Listar colaboradores

@usuario_bp.route("/colaboradores", methods=["GET"])
@roles_required("SESMIT", "GESTOR")
def listar_colaboradores():
    colaboradores = UsuarioService.listar_colaboradores()
    if not colaboradores:
        return jsonify([])
    return jsonify([
        {"id": c.id, "nome": c.nome, "cargo_id": c.cargo_id, "cargo_nome": getattr(c.cargo, "nome", None)}
        for c in colaboradores
    ])