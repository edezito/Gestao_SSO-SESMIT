from src.infrastructure.model.cargo_model import CargoModel
from src.infrastructure.model.risco_model import RiscoModel
from src.infrastructure.model.exame_model import Exame
from src.config.database import db
from datetime import datetime

class VinculoService:
    @staticmethod
    def gerar_exames_automaticos_por_cargo(cargo_id, tipo_exame_default="PERIODICO", agendar_data=None):
        cargo = CargoModel.query.get(cargo_id)
        if not cargo:
            raise ValueError("Cargo não encontrado")

        # define uma data de agendamento padrão: agora, ou passada
        agendar_data = agendar_data or datetime.utcnow()

        created = []
        # para cada colaborador desse cargo, para cada risco do cargo, cria exames vinculados aos riscos
        for colaborador in cargo.colaboradores:
            for risco in cargo.riscos:
                for exame_template in risco.exames_obrigatorios:
                    # evita duplicação simples: checar se já existe exame com mesmo nome e tipo pendente para o colaborador
                    existe = Exame.query.filter_by(
                        colaborador_id=colaborador.id,
                        nome=exame_template.nome,
                        tipo_exame=tipo_exame_default,
                        data_realizacao=None
                    ).first()
                    if existe:
                        continue

                    novo = Exame(
                        nome=exame_template.nome,
                        descricao=exame_template.descricao,
                        colaborador_id=colaborador.id,
                        tipo_exame=tipo_exame_default,
                        data_agendamento=agendar_data
                    )
                    db.session.add(novo)
                    created.append(novo)
        db.session.commit()
        return created

    @staticmethod
    def gerar_exames_para_todos_cargos(tipo_exame_default="PERIODICO", agendar_data=None):
        cargos = CargoModel.query.filter_by(ativo=True).all()
        total = []
        for cargo in cargos:
            total.extend(VinculoService.gerar_exames_automaticos_por_cargo(cargo.id, tipo_exame_default, agendar_data))
        return total