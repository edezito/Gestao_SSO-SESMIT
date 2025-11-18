from src.infrastructure.model.cat_model import CATModel
from src.infrastructure.model.usuario_model import UsuarioModel
from src.infrastructure.model.agendamento_model import Agendamento

class AuthorizationService:
    def __init__(self, usuario: UsuarioModel):
        self.usuario = usuario
        self._perfil = usuario.perfil.upper() if usuario and usuario.perfil else ""

    def _tem_perfil(self, *perfis):
        """Helper para verificar múltiplos perfis"""
        return self._perfil in perfis

    def pode_administrar_usuarios(self):
        """✅ REVISADO: Apenas GESTOR pode administrar usuários"""
        return self._tem_perfil("GESTOR")

    def pode_criar_exame(self, usuario_alvo_id=None):
        """
        SESMIT e GESTOR podem criar exames
        """
        print(f"🔐 Verificando permissão para criar exame: usuario={self.usuario.id}, perfil={self._perfil}, alvo={usuario_alvo_id}")
        
        if self._tem_perfil("SESMIT", "GESTOR"):
            print("✅ Permissão concedida: SESMIT/GESTOR")
            return True
        
        print("❌ Permissão negada: Perfil não autorizado")
        return False

    def pode_listar_exames(self):
        """Todos os perfis autenticados podem listar exames"""
        return bool(self.usuario)

    def pode_crud_cargos(self):
        """✅ REVISADO: GESTOR e SESMIT podem gerenciar cargos"""
        return self._tem_perfil("GESTOR", "SESMIT")

    def pode_administrar_agendamento(self, agendamento_id: int = None, colaborador_alvo_id: int = None):
        """
        ✅ REVISADO:
        SESMIT: acesso total
        GESTOR: NÃO TEM MAIS ACESSO TOTAL
        COLABORADOR: apenas seus próprios agendamentos
        """
        # ✅ REVISADO: Apenas SESMIT tem acesso total
        if self._tem_perfil("SESMIT"):
            return True

        # Lógica de self-service do Colaborador
        if self._tem_perfil("COLABORADOR"):
            # Verifica por agendamento específico
            if agendamento_id:
                agendamento = Agendamento.query.get(agendamento_id)
                return agendamento and agendamento.colaborador_id == self.usuario.id
            
            # Verifica por ID do colaborador
            if colaborador_alvo_id:
                return self.usuario.id == colaborador_alvo_id
        
        # GESTOR e outros perfis (sem ser SESMIT) não têm acesso admin
        return False

    def pode_visualizar_usuario(self, usuario_id):
        """
        SESMIT/GESTOR: podem ver qualquer usuário
        COLABORADOR: só pode ver seu próprio perfil
        """
        if self._tem_perfil("SESMIT", "GESTOR"):
            return True
        return self._tem_perfil("COLABORADOR") and self.usuario.id == usuario_id
    

    # ===============================
    # Permissões específicas para CAT
    # ===============================
    def pode_criar_cat(self):
        return self._tem_perfil("SESMIT", "GESTOR")

    def pode_listar_cat(self):
        """Permissão para ver a LISTA COMPLETA de CATs."""
        return self._tem_perfil("SESMIT", "GESTOR", "CIPA")

    def pode_editar_cat(self):
        return self._tem_perfil("SESMIT", "GESTOR")

    def pode_deletar_cat(self):
        return self._tem_perfil("SESMIT")

    def pode_visualizar_cat(self, cat_id: int):
        """
        ✅ NOVA PERMISSÃO:
        - Admin (SESMIT/GESTOR/CIPA) pode ver qualquer CAT.
        - Colaborador pode ver a CAT apenas se for dele.
        """
        if self._tem_perfil("SESMIT", "GESTOR", "CIPA"):
            return True
        
        # Colaborador só pode ver a própria CAT
        if self._tem_perfil("COLABORADOR"):
            cat = CATModel.query.get(cat_id)
            return cat and cat.colaborador_id == self.usuario.id
        
        return False

    def pode_gerar_pdf_cat(self):
        """
        Permissão genérica para saber se o usuário está logado.
        A verificação de dono será feita por 'pode_visualizar_cat'.
        """
        return bool(self.usuario)

    # ===============================
    # NOVAS PERMISSÕES PARA PDF
    # ===============================
    
    def pode_gerar_pdf_agendamento(self, agendamento_id: int = None):
        """
        Permissão para gerar PDF de agendamento:
        - SESMIT: pode gerar qualquer PDF
        - COLABORADOR: só pode gerar PDF dos próprios agendamentos
        - GESTOR: não tem acesso a PDFs de agendamento (conforme regra revisada)
        """
        if self._tem_perfil("SESMIT"):
            return True
            
        if self._tem_perfil("COLABORADOR") and agendamento_id:
            agendamento = Agendamento.query.get(agendamento_id)
            return agendamento and agendamento.colaborador_id == self.usuario.id
            
        return False

    def pode_gerenciar_riscos(self):
        """Permissão para gerenciar riscos ocupacionais"""
        return self._tem_perfil("SESMIT", "GESTOR")

    def pode_acessar_dashboard(self):
        """Permissão para acessar dashboard administrativo"""
        return self._tem_perfil("SESMIT", "GESTOR", "CIPA")

    def pode_gerar_relatorios(self):
        """Permissão para gerar relatórios do sistema"""
        return self._tem_perfil("SESMIT", "GESTOR")