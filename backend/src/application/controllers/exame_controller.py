from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, current_user
from src.application.services.exame_service import ExameService
from src.application.services.authorization_service import AuthorizationService

exame_bp = Blueprint('exame', __name__)

@exame_bp.route('/agendamentos', methods=['GET'])
@jwt_required()
def listar_agendamentos():
    """
    Lista agendamentos de exames
    - Gestor/SESMIT: veem todos os agendamentos
    - Colaborador: veem apenas seus agendamentos
    """
    try:
        print("🔍 [DEBUG] Iniciando listar_agendamentos")
        print(f"🔍 [DEBUG] Usuário atual: {current_user.id} - {current_user.perfil}")
        
        # CORREÇÃO: Usar a estrutura correta do AuthorizationService
        auth_service = AuthorizationService(current_user)
        is_gestor_or_sesmit = current_user.perfil.upper() in ['GESTOR', 'SESMIT']
        
        if is_gestor_or_sesmit:
            print("🔍 [DEBUG] Usuário é Gestor/SESMIT - buscando todos agendamentos")
            agendamentos = ExameService.listar_todos_agendamentos()
        else:
            print(f"🔍 [DEBUG] Usuário é Colaborador - buscando agendamentos do usuário {current_user.id}")
            agendamentos = ExameService.buscar_agendamentos_por_colaborador(current_user.id)
        
        print(f"🔍 [DEBUG] Total de agendamentos encontrados: {len(agendamentos)}")
        
        # Formata a resposta COM TRATAMENTO SEGURO
        agendamentos_data = []
        for i, agendamento in enumerate(agendamentos):
            try:
                print(f"🔍 [DEBUG] Processando agendamento {i+1}: ID {agendamento.id}")
                
                # Tratamento seguro para evitar erros de relacionamento
                colaborador_nome = 'N/A'
                exame_nome = 'N/A'
                
                # Verifica se o relacionamento colaborador existe e funciona
                if hasattr(agendamento, 'colaborador') and agendamento.colaborador:
                    colaborador_nome = agendamento.colaborador.nome
                    print(f"🔍 [DEBUG] Agendamento {agendamento.id} - Colaborador: {colaborador_nome}")
                else:
                    print(f"🔍 [DEBUG] Agendamento {agendamento.id} - Colaborador não encontrado ou relacionamento quebrado")
                
                # Verifica se o relacionamento exame existe e funciona
                if hasattr(agendamento, 'exame') and agendamento.exame:
                    exame_nome = agendamento.exame.nome
                    print(f"🔍 [DEBUG] Agendamento {agendamento.id} - Exame: {exame_nome}")
                else:
                    print(f"🔍 [DEBUG] Agendamento {agendamento.id} - Exame não encontrado ou relacionamento quebrado")
                
                agendamento_data = {
                    'id': agendamento.id,
                    'colaborador_id': agendamento.colaborador_id,
                    'colaborador_nome': colaborador_nome,
                    'exame_id': agendamento.exame_id,
                    'exame_nome': exame_nome,
                    'tipo_exame': agendamento.tipo_exame,
                    'data_agendamento': agendamento.data_agendamento.isoformat() if agendamento.data_agendamento else None,
                    'data_realizacao': agendamento.data_realizacao.isoformat() if agendamento.data_realizacao else None,
                    'observacoes': agendamento.observacoes,
                    'status': agendamento.status
                }
                agendamentos_data.append(agendamento_data)
                print(f"🔍 [DEBUG] Agendamento {agendamento.id} processado com sucesso")
                
            except Exception as inner_e:
                print(f"❌ [DEBUG] Erro processando agendamento {agendamento.id}: {str(inner_e)}")
                import traceback
                traceback.print_exc()
                
                # Dados mínimos em caso de erro
                agendamento_data = {
                    'id': agendamento.id,
                    'colaborador_id': agendamento.colaborador_id,
                    'colaborador_nome': 'Erro ao carregar',
                    'exame_id': agendamento.exame_id,
                    'exame_nome': 'Erro ao carregar',
                    'tipo_exame': agendamento.tipo_exame,
                    'data_agendamento': agendamento.data_agendamento.isoformat() if agendamento.data_agendamento else None,
                    'status': agendamento.status
                }
                agendamentos_data.append(agendamento_data)
        
        print(f"🔍 [DEBUG] Retornando {len(agendamentos_data)} agendamentos processados")
        return jsonify(agendamentos_data), 200
        
    except Exception as e:
        print(f"❌ [DEBUG] Erro geral em listar_agendamentos: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'erro': f'Erro ao buscar agendamentos: {str(e)}'}), 500

@exame_bp.route('/tipos-exame', methods=['GET'])
@jwt_required()
def listar_tipos_exame():
    """Lista todos os tipos de exame disponíveis"""
    try:
        tipos_exame = ExameService.listar_tipos_exame()
        
        tipos_data = []
        for tipo in tipos_exame:
            tipo_data = {
                'id': tipo.id,
                'nome': tipo.nome,
                'descricao': tipo.descricao,
                'periodicidade_meses': tipo.periodicidade_meses,
                'valor_padrao': float(tipo.valor_padrao) if tipo.valor_padrao else None
            }
            tipos_data.append(tipo_data)
        
        return jsonify(tipos_data), 200
        
    except Exception as e:
        return jsonify({'erro': f'Erro ao buscar tipos de exame: {str(e)}'}), 500

@exame_bp.route('/agendamentos', methods=['POST'])
@jwt_required()
def agendar_exame():
    """Agenda um novo exame"""
    try:
        # CORREÇÃO: Verificar permissão usando a estrutura correta
        auth_service = AuthorizationService(current_user)
        if not auth_service.pode_criar_exame():
            return jsonify({'erro': 'Acesso negado. Apenas gestores e SESMIT podem agendar exames.'}), 403
        
        dados = request.get_json()
        
        required_fields = ['colaborador_id', 'exame_id', 'tipo_exame']
        for field in required_fields:
            if field not in dados:
                return jsonify({'erro': f'Campo obrigatório faltando: {field}'}), 400
        
        agendamento = ExameService.agendar_exame(
            colaborador_id=dados['colaborador_id'],
            exame_id=dados['exame_id'],
            tipo_exame=dados['tipo_exame'],
            data_agendamento=dados.get('data_agendamento'),
            observacoes=dados.get('observacoes')
        )
        
        return jsonify({
            'mensagem': 'Exame agendado com sucesso',
            'agendamento': {
                'id': agendamento.id,
                'colaborador_id': agendamento.colaborador_id,
                'exame_id': agendamento.exame_id,
                'tipo_exame': agendamento.tipo_exame,
                'data_agendamento': agendamento.data_agendamento.isoformat() if agendamento.data_agendamento else None,
                'status': agendamento.status
            }
        }), 201
        
    except ValueError as e:
        return jsonify({'erro': str(e)}), 400
    except Exception as e:
        return jsonify({'erro': f'Erro ao agendar exame: {str(e)}'}), 500

@exame_bp.route('/tipos-exame', methods=['POST'])
@jwt_required()
def criar_tipo_exame():
    """Cria um novo tipo de exame"""
    try:
        # CORREÇÃO: Verificar permissão usando a estrutura correta
        auth_service = AuthorizationService(current_user)
        if not auth_service.pode_criar_exame():  # Usa a mesma permissão de criar exames
            return jsonify({'erro': 'Acesso negado. Apenas gestores e SESMIT podem criar tipos de exame.'}), 403
        
        dados = request.get_json()
        
        if 'nome' not in dados:
            return jsonify({'erro': 'Campo obrigatório faltando: nome'}), 400
        
        tipo_exame = ExameService.criar_tipo_exame(
            nome=dados['nome'],
            descricao=dados.get('descricao')
        )
        
        return jsonify({
            'mensagem': 'Tipo de exame criado com sucesso',
            'tipo_exame': {
                'id': tipo_exame.id,
                'nome': tipo_exame.nome,
                'descricao': tipo_exame.descricao
            }
        }), 201
        
    except Exception as e:
        return jsonify({'erro': f'Erro ao criar tipo de exame: {str(e)}'}), 500