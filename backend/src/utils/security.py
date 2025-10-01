from src.config.database import bcrypt
from flask_jwt_extended import create_access_token
from datetime import timedelta

def hash_senha(senha: str) -> str:
    return bcrypt.generate_password_hash(senha).decode('utf-8')

def verificar_senha(senha: str, senha_hash: str) -> bool:
    return bcrypt.check_password_hash(senha_hash, senha)

def gerar_token(usuario_id: int, perfil: str) -> str:
    identity = str(usuario_id)

    additional_claims = {'perfil': perfil}
    
    return create_access_token(
        identity=identity,
        additional_claims=additional_claims,
        expires_delta=timedelta(hours=1)
    )