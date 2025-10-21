class UserDomain:
    def __init__(self, nome: str, email: str, senha: str, perfil: str, cargo_id: int | None = None):
        self.nome = nome
        self.email = email
        self.senha = senha
        self.perfil = perfil.upper()
        self.cargo_id = cargo_id
        self.ativo = True

        # Validação de perfil
        perfis_validos = ["COLABORADOR", "SESMIT", "GESTOR", "CIPA"]
        if self.perfil not in perfis_validos:
            raise ValueError(f"Perfil inválido: {self.perfil}")