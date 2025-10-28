from src.infrastructure.model.usuario_model import UsuarioModel
from src.infrastructure.model.agendamento_model import Agendamento

class AuthorizationService:
    def __init__(self, usuario: UsuarioModel):
        self.usuario = usuario

    def pode_administrar_usuarios(self):
        """Pode listar, criar, atualizar (não-próprio) e inativar usuários."""
        if not self.usuario:
            return False
        return self.usuario.perfil in ["SESMIT", "GESTOR"]

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
    
    def pode_administrar_agendamento(self, agendamento_id: int = None, colaborador_alvo_id: int = None):
        """
        Verifica se o usuário logado pode interagir com um agendamento.
        - Se agendamento_id for passado, verifica se ele é dono do registro.
        - Se colaborador_alvo_id for passado, verifica se ele pode criar para o alvo.
        """
        if not self.usuario:
            return False

        if self.usuario.perfil in ["SESMIT", "GESTOR"]:
            return True

        if agendamento_id is not None:
            agendamento = Agendamento.query.get(agendamento_id)
            if agendamento and agendamento.colaborador_id == self.usuario.id:
                return True
            return False

        if colaborador_alvo_id is not None:
            return self.usuario.perfil == "COLABORADOR" and self.usuario.id == colaborador_alvo_id
            
        return False