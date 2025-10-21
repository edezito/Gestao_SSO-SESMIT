from src.config.database import bcrypt
from flask_jwt_extended import create_access_token
from datetime import timedelta

def hash_senha(senha: str) -> str:
    """Gera o hash de uma senha usando bcrypt."""
    return bcrypt.generate_password_hash(senha).decode('utf-8')

def verificar_senha(senha_hash: str, senha: str) -> bool:
    """Verifica se uma senha corresponde a um hash."""
    return bcrypt.check_password_hash(senha_hash, senha)

def gerar_token(usuario_id: int, perfil: str) -> str:
    """
    Gera um token JWT com:
      - 'sub' = id do usuário
      - 'perfil' = perfil do usuário (COLABORADOR, SESMIT, etc.)
    """
    additional_claims = {"perfil": perfil}
    access_token = create_access_token(
        identity=usuario_id,              # vira o 'sub' no JWT
        additional_claims=additional_claims,
        expires_delta=timedelta(hours=8)  # expira em 8h (pode ajustar)
    )
    return access_token