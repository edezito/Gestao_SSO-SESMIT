from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from flask import jsonify
from src.application.services.authorization_service import AuthorizationService
from src.infrastructure.model.usuario_model import UsuarioModel

def role_required(check_function):
    def wrapper(fn):
        @wraps(fn)
        def decorated(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            usuario_id = claims.get("sub")
            usuario = UsuarioModel.query.get(usuario_id)

            authz = AuthorizationService(usuario)
            if not check_function(authz):
                return jsonify({"msg": "Acesso negado"}), 403

            return fn(*args, **kwargs)
        return decorated
    return wrapper
