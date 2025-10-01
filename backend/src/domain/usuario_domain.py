from datetime import datetime, timezone

class UserDomain:
    def __init__(
        self,
        nome: str,
        email: str,
        senha: str,
        perfil: str,
        cargo_id: int = None, 
        ativo: bool = True,
        id: int = None,
        criado_em: datetime = None
    ):
        self.id = id
        self.nome = nome
        self.email = email
        self.senha = senha
        self.perfil = perfil.upper()
        self.ativo = ativo
        self.cargo_id = cargo_id
        self.criado_em = criado_em or datetime.now(timezone.utc)