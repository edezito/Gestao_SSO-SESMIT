from functools import wraps
from flask_jwt_extended import current_user
from flask import jsonify

def role_required(check_function):
    """
    Decorator para verificar permissões baseadas em roles.
    Uso: @role_required(lambda authz: authz.pode_administrar_usuarios())
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Verifica se o usuário está autenticado e carregado
            if not current_user:
                return jsonify({"msg": "Usuário não autenticado ou token inválido"}), 401

            # Cria serviço de autorização
            from src.application.services.authorization_service import AuthorizationService
            authz = AuthorizationService(current_user)

            # Verifica a permissão
            if not check_function(authz):
                return jsonify({
                    "msg": "Acesso negado. Permissão insuficiente.",
                    "perfil_requerido": check_function.__name__ if hasattr(check_function, '__name__') else "específica"
                }), 403

            # Chama a função original
            return f(*args, **kwargs)
        return decorated_function
    return decorator