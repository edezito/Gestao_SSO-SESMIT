from functools import wraps
from flask import jsonify, request
from flask_jwt_extended import verify_jwt_in_request, get_jwt

def roles_required(*roles, self_allowed=False):
    """
    Decorator para restringir acesso a rotas conforme o 'perfil' no token JWT.

    Parâmetros:
        roles: lista de perfis permitidos (ex: "SESMIT", "GESTOR", "COLABORADOR")
        self_allowed: se True, permite que usuários acessem apenas seus próprios recursos
                      quando forem do tipo COLABORADOR.

    Uso:
        @roles_required("SESMIT", "GESTOR")
        @roles_required("COLABORADOR", self_allowed=True)
    """
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            # Verifica se existe token válido
            try:
                verify_jwt_in_request()
            except Exception:
                return jsonify({"erro": "Token inválido ou ausente"}), 401

            claims = get_jwt() or {}
            perfil = claims.get("perfil")
            user_id = claims.get("sub")

            # Se perfil não estiver permitido, bloqueia
            if perfil not in roles:
                return jsonify({"erro": "Acesso negado"}), 403

            # Se self_allowed, verifica se está tentando acessar outro recurso
            if self_allowed and perfil == "COLABORADOR":
                recurso_id = kwargs.get("id") or request.json.get("colaborador_id")
                if recurso_id and recurso_id != user_id:
                    return jsonify({"erro": "Acesso negado: apenas seu próprio recurso"}), 403

            return fn(*args, **kwargs)
        return decorator
    return wrapper