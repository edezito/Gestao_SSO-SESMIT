from src.infrastructure.model.usuario_model import UsuarioModel
from src.infrastructure.model.agendamento_model import Agendamento

class AuthorizationService:
    def __init__(self, usuario: UsuarioModel):
        self.usuario = usuario
        # ✅ CORREÇÃO: Garante que o perfil está em maiúsculas
        self._perfil = usuario.perfil.upper() if usuario and usuario.perfil else ""

    def _tem_perfil(self, *perfis):
        """Helper para verificar múltiplos perfis"""
        return self._perfil in perfis

    def pode_administrar_usuarios(self):
        """SESMIT e GESTOR podem administrar usuários"""
        return self._tem_perfil("SESMIT", "GESTOR")

    def pode_criar_exame(self, usuario_alvo_id=None):
        """
        ✅ CORREÇÃO: Apenas SESMIT e GESTOR podem criar exames
        COLABORADOR: NÃO pode criar exames (nem para si mesmo)
        """
        print(f"🔐 Verificando permissão para criar exame: usuario={self.usuario.id}, perfil={self._perfil}, alvo={usuario_alvo_id}")
        
        # ✅ Apenas SESMIT e GESTOR podem criar exames
        if self._tem_perfil("SESMIT", "GESTOR"):
            print("✅ Permissão concedida: SESMIT/GESTOR")
            return True
        
        # ❌ COLABORADOR NÃO PODE CRIAR EXAMES
        print("❌ Permissão negada: Colaborador não pode criar exames")
        return False

    def pode_listar_exames(self):
        """Todos os perfis autenticados podem listar exames"""
        return bool(self.usuario)

    def pode_crud_cargos(self):
        """Apenas SESMIT pode gerenciar cargos"""
        return self._tem_perfil("SESMIT")

    def pode_administrar_agendamento(self, agendamento_id: int = None, colaborador_alvo_id: int = None):
        """
        SESMIT/GESTOR: acesso total
        COLABORADOR: apenas seus próprios agendamentos
        """
        if self._tem_perfil("SESMIT", "GESTOR"):
            return True

        if self._tem_perfil("COLABORADOR"):
            # Verifica por agendamento específico
            if agendamento_id:
                agendamento = Agendamento.query.get(agendamento_id)
                return agendamento and agendamento.colaborador_id == self.usuario.id
            
            # Verifica por ID do colaborador
            if colaborador_alvo_id:
                return self.usuario.id == colaborador_alvo_id
        
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
        """Apenas SESMIT e GESTOR podem registrar CAT"""
        return self._tem_perfil("SESMIT", "GESTOR")

    def pode_listar_cat(self):
        """SESMIT, GESTOR e CIPA podem visualizar CATs"""
        return self._tem_perfil("SESMIT", "GESTOR", "CIPA")

    def pode_editar_cat(self):
        """Somente SESMIT e GESTOR podem editar CAT"""
        return self._tem_perfil("SESMIT", "GESTOR")

    def pode_deletar_cat(self):
        """Apenas SESMIT pode deletar CAT"""
        return self._tem_perfil("SESMIT")

    def pode_gerar_pdf_cat(self):
        """Todos os perfis autenticados podem gerar PDF da própria CAT"""
        return bool(self.usuario)