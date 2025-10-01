from src.infrastructure.model.usuario_model import UsuarioModel

class AuthorizationService:
    def __init__(self, usuario: UsuarioModel):
        self.usuario = usuario

    def pode_criar_exame(self, usuario_alvo_id=None):
        if not self.usuario:
            return False

        if self.usuario.perfil in ["SESMIT", "GESTOR"]:
            return True
        if self.usuario.perfil == "COLABORADOR" and self.usuario.id == usuario_alvo_id:
            return True
        return False

    def pode_listar_exames(self):
        if not self.usuario:
            return False
        return self.usuario.perfil in ["SESMIT", "GESTOR", "COLABORADOR"]

    def pode_crud_cargos(self):
        if not self.usuario:
            return False
        return self.usuario.perfil == "SESMIT"