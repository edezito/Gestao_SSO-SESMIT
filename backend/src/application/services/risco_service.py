from src.infrastructure.model.risco_model import Risco
from src.infrastructure.model.cargo_model import Cargo
from src.infrastructure.model.exame_model import Exame
from src.config.database import db

class RiscoService:

    @staticmethod
    def criar(nome, descricao=None):
        risco = Risco(nome=nome, descricao=descricao)
        db.session.add(risco)
        db.session.commit()
        return risco

    @staticmethod
    def listar():
        return Risco.query.filter_by(ativo=True).all()

    @staticmethod
    def associar_risco_cargo(risco_id, cargo_id):
        cargo = Cargo.query.get(cargo_id)
        risco = Risco.query.get(risco_id)

        if not cargo or not risco:
            raise ValueError("Cargo ou risco não encontrado")

        cargo.riscos.append(risco)

        # Regras de exames automáticos por risco
        exames_por_risco = {
            "Ruído": ["Audiometria"],
            "Agentes Químicos": ["Hemograma", "Exame de Função Hepática"],
            "Fumos Metálicos": ["Espirometria", "Raio-X de Tórax"]
        }

        if risco.nome in exames_por_risco:
            for exame_nome in exames_por_risco[risco.nome]:
                exame = Exame.query.filter_by(nome=exame_nome).first()
                if not exame:
                    exame = Exame(nome=exame_nome)
                    db.session.add(exame)
                if exame not in cargo.exames:
                    cargo.exames.append(exame)

        db.session.commit()
        return cargo