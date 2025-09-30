# Lógica de negócio

from src.infrastructure.model.usuario_model import UsuarioModel
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
            perfil=user_domain.perfil
        )
        db.session.add(usuario)
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
    def atualizar_usuario(usuario_id: int, nome: str = None, senha: str = None, perfil: str = None):
        usuario = UsuarioModel.query.get(usuario_id)
        if not usuario:
            raise ValueError("Usuário não encontrado")

        if nome:
            usuario.nome = nome
        if senha:
            usuario.senha = hash_senha(senha)
        if perfil:
            usuario.perfil = perfil.upper()

        db.session.commit()
        return usuario
    
    @staticmethod
    def listar_colaboradores():
        return UsuarioModel.query.filter_by(perfil='COLABORADOR', ativo=True).all()

    @staticmethod
    def desativar_usuario(usuario_id: int):
        usuario = UsuarioModel.query.get(usuario_id)
        if not usuario:
            raise ValueError("Usuário não encontrado")
        usuario.ativo = False
        db.session.commit()
        return usuario