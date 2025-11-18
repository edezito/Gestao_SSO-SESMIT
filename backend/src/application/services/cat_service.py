from src.config.database import db
from src.infrastructure.model.cat_model import CATModel
from src.infrastructure.model.usuario_model import UsuarioModel
from src.infrastructure.model.cargo_model import CargoModel
from datetime import datetime

class CATService:
    @staticmethod
    def criar_cat(dados):
        colaborador = UsuarioModel.query.get(dados["colaborador_id"])
        cargo = CargoModel.query.get(dados["cargo_id"])

        if not colaborador:
            raise ValueError("Colaborador não encontrado")
        if not cargo:
            raise ValueError("Cargo não encontrado")

        nova_cat = CATModel(
            colaborador_id=colaborador.id,
            cargo_id=cargo.id,
            data_acidente=datetime.fromisoformat(dados["data_acidente"]),
            local_acidente=dados["local_acidente"],
            descricao=dados["descricao"],
            testemunhas=dados.get("testemunhas"),
            tipo_acidente=dados.get("tipo_acidente"),
            comunicante=dados.get("comunicante"),
            status="EM ABERTO"
        )

        db.session.add(nova_cat)
        db.session.commit()
        return nova_cat

    @staticmethod
    def listar_todas_cats():
        """✅ Busca TODAS as CATs."""
        return CATModel.query.order_by(CATModel.criado_em.desc()).all()
    
    @staticmethod
    def listar_cats_por_colaborador(colaborador_id: int):
        """✅ Busca CATs apenas de um colaborador específico."""
        return CATModel.query.filter_by(colaborador_id=colaborador_id).order_by(CATModel.criado_em.desc()).all()
    
    @staticmethod
    def buscar_cat(cat_id):
        # O .get() já é a forma mais rápida de buscar pela PK
        return CATModel.query.get(cat_id)

    @staticmethod
    def atualizar_cat(cat_id, dados):
        cat = CATModel.query.get(cat_id)
        if not cat:
            raise ValueError("CAT não encontrada")
        
        # Lista de campos permitidos para atualização
        # Isso evita que dados sensíveis (como 'id' ou 'colaborador_id') sejam mudados
        campos_permitidos = [
            'data_acidente', 'local_acidente', 'descricao', 'testemunhas',
            'tipo_acidente', 'comunicante', 'status', 'cargo_id'
        ]

        for campo, valor in dados.items():
            if campo in campos_permitidos and valor is not None:
                # Tratamento especial para data, se vier como string ISO
                if campo == 'data_acidente' and isinstance(valor, str):
                    setattr(cat, campo, datetime.fromisoformat(valor))
                else:
                    setattr(cat, campo, valor)
                    
        db.session.commit()
        return cat

    @staticmethod
    def deletar_cat(cat_id):
        cat = CATModel.query.get(cat_id)
        if not cat:
            raise ValueError("CAT não encontrada")
        db.session.delete(cat)
        db.session.commit()
        return True