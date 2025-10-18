from flask import Blueprint, request, jsonify
from src.application.services.usuario_service import UsuarioService
from src.domain.usuario_domain import UserDomain

usuario_bp = Blueprint('usuario_bp', __name__)

# Rota pública, sem proteção
@usuario_bp.route('/cadastro', methods=['POST'])
def cadastro():
    dados = request.json
    try:
        user_domain = UserDomain(
            nome=dados['nome'],
            email=dados['email'],
            senha=dados['senha'],
            perfil=dados['perfil']
        )
        usuario = UsuarioService.criar_usuario(user_domain)
        return jsonify({'msg': 'Usuário cadastrado', 'id': usuario.id})
    except ValueError as e:
        return jsonify({'erro': str(e)}), 400

# Rota pública, sem proteção
@usuario_bp.route('/login', methods=['POST'])
def login():
    dados = request.json
    token = UsuarioService.autenticar(dados['email'], dados['senha'])
    if not token:
        return jsonify({'erro': 'Email ou senha incorretos'}), 401
    return jsonify({'access_token': token})

# Rota unificada para /usuario/<id>
@usuario_bp.route('/usuario/<int:id>', methods=['PUT', 'DELETE'])
def gerenciar_usuario(id):
    # Se a requisição for PUT, atualiza o usuário
    if request.method == 'PUT':
        dados = request.json
        try:
            usuario = UsuarioService.atualizar_usuario(
                usuario_id=id,
                nome=dados.get('nome'),
                senha=dados.get('senha'),
                perfil=dados.get('perfil')
            )
            return jsonify({'msg': 'Usuário atualizado', 'id': usuario.id})
        except ValueError as e:
            return jsonify({'erro': str(e)}), 400
    
    # Se a requisição for DELETE, desativa o usuário
    if request.method == 'DELETE':
        try:
            usuario = UsuarioService.desativar_usuario(id)
            return jsonify({'msg': 'Usuário desativado', 'id': usuario.id})
        except ValueError as e:
            return jsonify({'erro': str(e)}), 400

@usuario_bp.route("/colaboradores", methods=["GET"])
def listar_colaboradores():
    colaboradores = UsuarioService.listar_colaboradores()
    if not colaboradores:
        return jsonify([])
        
    return jsonify([{
        "id": c.id,
        "nome": c.nome
    } for c in colaboradores])