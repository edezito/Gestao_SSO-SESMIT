from src.config.database import bcrypt
from flask_jwt_extended import create_access_token
from datetime import timedelta

def hash_senha(senha: str) -> str:
    return bcrypt.generate_password_hash(senha).decode('utf-8')

def verificar_senha(senha: str, senha_hash: str) -> bool:
    return bcrypt.check_password_hash(senha_hash, senha)

def gerar_token(usuario_id: int, perfil: str) -> str:
    payload = {'usuario_id': usuario_id, 'perfil': perfil}
    return create_access_token(identity=payload, expires_delta=timedelta(hours=1))