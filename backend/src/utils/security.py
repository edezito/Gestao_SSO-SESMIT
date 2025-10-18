from src.config.database import bcrypt
from flask_jwt_extended import create_access_token

def hash_senha(senha: str) -> str:
    """Gera o hash de uma senha usando bcrypt."""
    return bcrypt.generate_password_hash(senha).decode('utf-8')

def verificar_senha(senha_hash: str, senha: str) -> bool:
    """Verifica se uma senha corresponde a um hash."""
    return bcrypt.check_password_hash(senha_hash, senha)

# ✨ ATUALIZADO AQUI
def gerar_token(usuario_id: int, perfil: str) -> str:
    additional_claims = {"perfil": perfil}
    
    access_token = create_access_token(
        identity=usuario_id, 
        additional_claims=additional_claims
    )
    return access_token