class UserDomain:
    def __init__(self, nome: str, email: str, senha: str, perfil: str):
        self.nome = nome
        self.email = email
        self.senha = senha
        self.perfil = perfil.upper()  # COLABORADOR, SESMIT, GESTOR, CIPA
        self.ativo = True