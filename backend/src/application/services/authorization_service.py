from src.infrastructure.model.cat_model import CATModel
from src.infrastructure.model.usuario_model import UsuarioModel
from src.infrastructure.model.agendamento_model import Agendamento

class AuthorizationService:
    def __init__(self, usuario: UsuarioModel):
        self.usuario = usuario
        self._perfil = usuario.perfil.upper() if usuario and usuario.perfil else ""

    def _tem_perfil(self, *perfis):
        return self._perfil in perfis

    # ===================================
    # USUÁRIOS / COLABORADORES
    # ===================================

    def pode_administrar_usuarios(self):
        """Somente o GESTOR gerencia usuários (CRUD)."""
        return self._tem_perfil("GESTOR")

    def pode_listar_colaboradores(self):
        """GESTOR vê tudo. SESMIT apenas consulta."""
        return self._tem_perfil("GESTOR", "SESMIT")

    def pode_visualizar_usuario(self, usuario_id):
        """
        GESTOR → pode visualizar todos
        SESMIT → NÃO visualiza detalhes de usuário
        COLABORADOR → apenas o próprio perfil
        """
        if self._tem_perfil("GESTOR"):
            return True
        
        if self._tem_perfil("SESMIT"):
            return False  # SESMIT NÃO visualiza detalhes individuais

        return self._tem_perfil("COLABORADOR") and self.usuario.id == usuario_id

    # ===================================
    # CARGOS
    # ===================================

    def pode_crud_cargos(self):
        """Somente GESTOR administra cargos."""
        return self._tem_perfil("GESTOR")

    # ===================================
    # EXAMES
    # ===================================

    def pode_criar_exame(self, usuario_alvo_id=None):
        """SESMIT cria, GESTOR supervisiona."""
        return self._tem_perfil("SESMIT", "GESTOR")

    def pode_listar_exames(self):
        return True

    # ===================================
    # AGENDAMENTO
    # ===================================

    def pode_administrar_agendamento(self, agendamento_id: int = None, colaborador_alvo_id: int = None):
        if self._tem_perfil("SESMIT"):
            return True

        if self._tem_perfil("COLABORADOR"):
            if agendamento_id:
                ag = Agendamento.query.get(agendamento_id)
                return ag and ag.colaborador_id == self.usuario.id

            if colaborador_alvo_id:
                return self.usuario.id == colaborador_alvo_id

        return False

    # ===================================
    # CAT
    # ===================================

    def pode_criar_cat(self):
        return self._tem_perfil("SESMIT", "GESTOR")

    def pode_listar_cat(self):
        return self._tem_perfil("SESMIT", "GESTOR", "CIPA")

    def pode_editar_cat(self):
        return self._tem_perfil("SESMIT", "GESTOR")

    def pode_deletar_cat(self):
        return self._tem_perfil("SESMIT")

    def pode_visualizar_cat(self, cat_id: int):
        if self._tem_perfil("SESMIT", "GESTOR", "CIPA"):
            return True

        if self._tem_perfil("COLABORADOR"):
            cat = CATModel.query.get(cat_id)
            return cat and cat.colaborador_id == self.usuario.id

        return False

    def pode_gerar_pdf_cat(self):
        return bool(self.usuario)

    # ===================================
    # PDF AGENDAMENTO
    # ===================================

    def pode_gerar_pdf_agendamento(self, agendamento_id: int = None):
        if self._tem_perfil("SESMIT"):
            return True
        
        if self._tem_perfil("COLABORADOR") and agendamento_id:
            ag = Agendamento.query.get(agendamento_id)
            return ag and ag.colaborador_id == self.usuario.id

        return False

    # ===================================
    # RISCOS, DASHBOARD, RELATÓRIOS
    # ===================================

    def pode_gerenciar_riscos(self):
        return self._tem_perfil("SESMIT")

    def pode_acessar_dashboard(self):
        return self._tem_perfil("SESMIT", "CIPA")

    def pode_gerar_relatorios(self):
        return self._tem_perfil("SESMIT")
