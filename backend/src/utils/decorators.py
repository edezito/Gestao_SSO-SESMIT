from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt

def roles_required(*roles):
    """
    Decorator para restringir acesso a rotas Flask conforme o 'perfil' no token JWT.
    Uso:
        @roles_required("SESMIT", "GESTOR")
    """
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            try:
                verify_jwt_in_request()
            except Exception:
                return jsonify({"erro": "Token inválido ou ausente"}), 401

            claims = get_jwt() or {}
            perfil = claims.get("perfil")

            if perfil not in roles:
                return jsonify({"erro": "Acesso negado"}), 403

            return fn(*args, **kwargs)
        return decorator
    return wrapper