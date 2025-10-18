from flask import Blueprint, request, jsonify
from src.application.services.exame_service import ExameService
from src.infrastructure.model.usuario_model import UsuarioModel

exame_bp = Blueprint("exame_bp", __name__)

# Criar exame
@exame_bp.route("/exames", methods=["POST"])
def criar_exame():
    dados = request.json
    exame = ExameService.criar(
        nome=dados["nome"],
        colaborador_id=dados["colaborador_id"],
        tipo_exame=dados["tipo_exame"],
        data_agendamento=dados.get("data_agendamento"),
        descricao=dados.get("descricao"),
        observacoes=dados.get("observacoes")
    )
    # Supondo que 'status' é uma propriedade do modelo
    status_exame = exame.status if hasattr(exame, 'status') else 'INDEFINIDO'
    return jsonify({"id": exame.id, "nome": exame.nome, "status": status_exame})

# Listar todos exames
@exame_bp.route("/exames", methods=["GET"])
def listar_exames():
    exames = ExameService.listar()
    
    # Prepara a lista de resultados de forma segura para evitar erros
    lista_de_exames_json = []
    for e in exames:
        # Tenta calcular o status, com um valor padrão em caso de erro
        try:
            status_exame = e.status
        except TypeError:
            status_exame = "INDEFINIDO"

        exame_json = {
            "id": e.id,
            "nome": e.nome,
            # Garante que o colaborador existe antes de pegar os dados
            "colaborador_nome": e.colaborador.nome if e.colaborador else "Colaborador Removido",
            "colaborador_email": e.colaborador.email if e.colaborador else "N/A",
            "tipo_exame": e.tipo_exame,
            # Formata as datas para o padrão ISO 8601, que é seguro para JSON
            "data_agendamento": e.data_agendamento.isoformat() if e.data_agendamento else None,
            "data_realizacao": e.data_realizacao.isoformat() if e.data_realizacao else None,
            "status": status_exame
        }
        lista_de_exames_json.append(exame_json)
        
    return jsonify(lista_de_exames_json)

# Listar exames por colaborador (já estava seguro)
@exame_bp.route("/exames/colaborador/<int:colaborador_id>", methods=["GET"])
def listar_exames_por_colaborador(colaborador_id):
    colaborador = UsuarioModel.query.get(colaborador_id)
    if not colaborador:
        return jsonify({"erro": "Colaborador não encontrado"}), 404
    exames = ExameService.buscar_por_colaborador(colaborador_id)
    # ... (aqui a lógica é segura pois o colaborador já foi verificado)
    return jsonify([exame.to_dict() for exame in exames]) # Supondo um método to_dict no modelo

# Listar exames por status
@exame_bp.route("/exames/status/<string:status>", methods=["GET"])
def listar_exames_por_status(status):
    exames = ExameService.buscar_por_status(status)
    # APLIQUE A MESMA LÓGICA ROBUSTA DA LISTAGEM GERAL
    lista_de_exames_json = []
    for e in exames:
        try:
            status_exame = e.status
        except TypeError:
            status_exame = "INDEFINIDO"
            
        exame_json = {
            "id": e.id,
            "nome": e.nome,
            "colaborador_nome": e.colaborador.nome if e.colaborador else "Colaborador Removido",
            "tipo_exame": e.tipo_exame,
            "data_agendamento": e.data_agendamento.isoformat() if e.data_agendamento else None,
            "data_realizacao": e.data_realizacao.isoformat() if e.data_realizacao else None,
            "status": status_exame
        }
        lista_de_exames_json.append(exame_json)
        
    return jsonify(lista_de_exames_json)