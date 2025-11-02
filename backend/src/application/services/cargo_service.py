# src/application/services/cargo_service.py
from src.config.database import db
from src.infrastructure.model.cargo_model import CargoModel
from src.infrastructure.model.risco_model import Risco
from src.infrastructure.model.exame_model import Exame
from src.infrastructure.model.usuario_model import UsuarioModel
from src.infrastructure.model.agendamento_model import Agendamento
from typing import List
from datetime import datetime

class CargoService:

    @staticmethod
    def criar_cargo(nome: str, descricao: str = None):
        if CargoModel.query.filter_by(nome=nome).first():
            raise ValueError("Cargo com este nome já existe.")
        
        cargo = CargoModel(nome=nome, descricao=descricao)
        db.session.add(cargo)
        db.session.commit()
        return cargo

    @staticmethod
    def listar_cargos():
        return CargoModel.query.all()

    @staticmethod
    def atualizar_cargo(cargo_id: int, nome: str = None, descricao: str = None):
        cargo = CargoModel.query.get(cargo_id)
        if not cargo:
            raise ValueError("Cargo não encontrado.")
            
        if nome:
            cargo.nome = nome
        if descricao is not None:
            cargo.descricao = descricao
            
        db.session.commit()
        return cargo

    @staticmethod
    def deletar_cargo(cargo_id: int):
        cargo = CargoModel.query.get(cargo_id)
        if not cargo:
            raise ValueError("Cargo não encontrado.")
            
        # Verifica se há usuários associados antes de deletar
        if cargo.usuarios.count() > 0:
            raise ValueError("Não é possível deletar. Existem colaboradores vinculados a este cargo.")
            
        db.session.delete(cargo)
        db.session.commit()

    @staticmethod
    def vincular_riscos(cargo_id: int, risco_ids: List[int]):
        """Vincula uma lista de riscos a um cargo específico E atualiza exames dos colaboradores."""
        cargo = CargoModel.query.get(cargo_id)
        if not cargo:
            raise ValueError("Cargo não encontrado.")
            
        riscos = Risco.query.filter(Risco.id.in_(risco_ids)).all()
        if len(riscos) != len(risco_ids):
            raise ValueError("Um ou mais riscos não foram encontrados.")

        # Substitui a lista de riscos
        cargo.riscos_associados = riscos
        db.session.commit()
        
        # ✅ ATUALIZAÇÃO AUTOMÁTICA: Gera exames para colaboradores deste cargo
        CargoService._gerar_exames_para_colaboradores(cargo)
        
        return cargo

    @staticmethod
    def vincular_exames(cargo_id: int, exame_ids: List[int]):
        """Vincula uma lista de exames obrigatórios DIRETOS a um cargo específico."""
        cargo = CargoModel.query.get(cargo_id)
        if not cargo:
            raise ValueError("Cargo não encontrado.")
            
        exames = Exame.query.filter(Exame.id.in_(exame_ids)).all()
        if len(exames) != len(exame_ids):
            raise ValueError("Um ou mais exames não foram encontrados.")

        # Substitui a lista de exames
        cargo.exames_exigidos = exames
        db.session.commit()
        
        # ✅ ATUALIZAÇÃO AUTOMÁTICA: Gera exames para colaboradores deste cargo
        CargoService._gerar_exames_para_colaboradores(cargo)
        
        return cargo

    @staticmethod
    def _gerar_exames_para_colaboradores(cargo: CargoModel):
        """
        Gera automaticamente exames para todos os colaboradores deste cargo
        baseado nos riscos associados e exames diretos.
        """
        try:
            colaboradores = cargo.usuarios.all()
            print(f"🔄 Gerando exames automáticos para {len(colaboradores)} colaboradores do cargo {cargo.nome}")
            
            for colaborador in colaboradores:
                CargoService._gerar_exames_para_colaborador(colaborador, cargo)
                
            db.session.commit()
            print(f"✅ Exames gerados automaticamente para colaboradores do cargo {cargo.nome}")
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Erro ao gerar exames automáticos: {str(e)}")
            raise

    @staticmethod
    def _gerar_exames_para_colaborador(colaborador: UsuarioModel, cargo: CargoModel):
        """
        Gera exames para um colaborador específico baseado nos riscos do cargo.
        """
        # Coletar TODOS os exames necessários
        exames_necessarios = set()
        
        # 1. Exames dos riscos associados ao cargo
        for risco in cargo.riscos_associados:
            if risco.ativo:  # Só considera riscos ativos
                for exame in risco.exames_obrigatorios:
                    exames_necessarios.add(exame.id)
        
        # 2. Exames diretos do cargo
        for exame in cargo.exames_exigidos:
            exames_necessarios.add(exame.id)
        
        # 3. Verificar exames já agendados (para evitar duplicação)
        exames_ja_agendados = set()
        agendamentos_existentes = Agendamento.query.filter_by(
            colaborador_id=colaborador.id
        ).all()
        
        for agendamento in agendamentos_existentes:
            if agendamento.exame_id:
                exames_ja_agendados.add(agendamento.exame_id)
        
        # 4. Criar agendamentos apenas para exames não existentes
        exames_para_agendar = exames_necessarios - exames_ja_agendados
        
        for exame_id in exames_para_agendar:
            exame = Exame.query.get(exame_id)
            if exame:
                # Cria agendamento automático
                novo_agendamento = Agendamento(
                    colaborador_id=colaborador.id,
                    exame_id=exame.id,
                    tipo_exame=exame.nome,
                    data_agendamento=datetime.utcnow(),
                    observacoes=f"Agendamento automático - Cargo: {cargo.nome}",
                    data_realizacao=None
                )
                db.session.add(novo_agendamento)
                print(f"📅 Agendado exame '{exame.nome}' para {colaborador.nome}")

    @staticmethod
    def atualizar_exames_colaborador(colaborador_id: int):
        """
        Atualiza exames de um colaborador específico baseado no seu cargo.
        Útil quando um colaborador muda de cargo.
        """
        try:
            colaborador = UsuarioModel.query.get(colaborador_id)
            if not colaborador or not colaborador.cargo:
                return
            
            cargo = colaborador.cargo
            print(f"🔄 Atualizando exames para {colaborador.nome} (Cargo: {cargo.nome})")
            
            # Gera novos exames baseado no cargo atual
            CargoService._gerar_exames_para_colaborador(colaborador, cargo)
            db.session.commit()
            
            print(f"✅ Exames atualizados para {colaborador.nome}")
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Erro ao atualizar exames do colaborador: {str(e)}")
            raise