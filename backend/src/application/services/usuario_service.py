from src.infrastructure.model.usuario_model import UsuarioModel
from src.infrastructure.model.cargo_model import CargoModel
from src.application.services.exame_service import ExameService
from src.config.database import db
from src.domain.usuario_domain import UserDomain
from src.utils.security import hash_senha, verificar_senha, gerar_token

class UsuarioService:

    @staticmethod
    def criar_usuario(user_domain: UserDomain):
        if UsuarioModel.query.filter_by(email=user_domain.email).first():
            raise ValueError("Email já cadastrado")
        
        usuario = UsuarioModel(
            nome=user_domain.nome,
            email=user_domain.email,
            senha=hash_senha(user_domain.senha),
            perfil=user_domain.perfil,
            cargo_id=user_domain.cargo_id 
        )
        db.session.add(usuario)
        db.session.commit()
        return usuario

    @staticmethod
    def definir_cargo_usuario(usuario_id: int, cargo_id: int):
        usuario = UsuarioModel.query.get(usuario_id)
        if not usuario:
            raise ValueError("Usuário não encontrado")

        cargo = CargoModel.query.get(cargo_id)
        if not cargo:
            raise ValueError("Cargo (CBO) não encontrado")
        
        usuario.cargo_id = cargo_id
        db.session.add(usuario)

        if hasattr(cargo, 'exames_exigidos'):
            for exame_exigido in cargo.exames_exigidos:
                ExameService.agendar_exame(
                    colaborador_id=usuario.id,
                    exame_id=exame_exigido.id,
                    tipo_exame='ADMISSIONAL'
                )

        db.session.commit()
        return usuario

    @staticmethod
    def autenticar(email: str, senha: str):
        usuario = UsuarioModel.query.filter_by(email=email, ativo=True).first()
        if not usuario or not verificar_senha(senha, usuario.senha):
            return None
        token = gerar_token(usuario.id, usuario.perfil)
        return token

    @staticmethod
    def atualizar_usuario(usuario_id: int, **kwargs):
        usuario = UsuarioModel.query.get(usuario_id)
        if not usuario:
            raise ValueError("Usuário não encontrado")
        
        if 'nome' in kwargs and kwargs['nome']:
            usuario.nome = kwargs['nome']
        if 'senha' in kwargs and kwargs['senha']:
            usuario.senha = hash_senha(kwargs['senha'])
        if 'perfil' in kwargs and kwargs['perfil']:
            usuario.perfil = kwargs['perfil'].upper()
        if 'cargo_id' in kwargs:
            usuario.cargo_id = kwargs['cargo_id']
        if 'ativo' in kwargs:
            usuario.ativo = kwargs['ativo']
            
        db.session.commit()
        return usuario

    @staticmethod
    def desativar_usuario(usuario_id: int):
        usuario = UsuarioModel.query.get(usuario_id)
        if not usuario:
            raise ValueError("Usuário não encontrado")
        usuario.ativo = False
        db.session.commit()
        return usuario

    @staticmethod
    def listar_usuarios():
        return UsuarioModel.query.filter_by(ativo=True).all()

    @staticmethod
    def buscar_usuario_por_id(usuario_id):
        return UsuarioModel.query.get(usuario_id)

    @staticmethod
    def deletar_usuario(usuario_id):
        usuario = UsuarioModel.query.get(usuario_id)
        if not usuario:
            return False
        usuario.ativo = False
        db.session.commit()
        return True