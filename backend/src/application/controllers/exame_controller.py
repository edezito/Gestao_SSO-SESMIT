from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, current_user
# CORREÇÃO: Nome do arquivo geralmente é minúsculo em Python (pdf_service)
from src.application.services.pdf_Service import PdfService 
from src.application.services.exame_service import ExameService
from src.application.services.authorization_service import AuthorizationService
import io
import traceback # Importante para ver erros detalhados

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
        
        auth_service = AuthorizationService(current_user)
        # Verifica se é gestor ou sesmit
        is_gestor_or_sesmit = current_user.perfil.upper() in ['GESTOR', 'SESMIT']
        
        if is_gestor_or_sesmit:
            print("🔍 [DEBUG] Usuário é Gestor/SESMIT - buscando todos agendamentos")
            agendamentos = ExameService.listar_todos_agendamentos()
        else:
            print(f"🔍 [DEBUG] Usuário é Colaborador - buscando agendamentos do usuário {current_user.id}")
            agendamentos = ExameService.buscar_agendamentos_por_colaborador(current_user.id)
        
        print(f"🔍 [DEBUG] Total de agendamentos encontrados: {len(agendamentos)}")
        
        agendamentos_data = []
        for i, agendamento in enumerate(agendamentos):
            try:
                # Tratamento seguro para evitar erros de relacionamento
                colaborador_nome = 'N/A'
                exame_nome = 'N/A'
                
                if hasattr(agendamento, 'colaborador') and agendamento.colaborador:
                    colaborador_nome = agendamento.colaborador.nome
                
                if hasattr(agendamento, 'exame') and agendamento.exame:
                    exame_nome = agendamento.exame.nome
                elif hasattr(agendamento, 'tipo_exame') and agendamento.tipo_exame:
                    exame_nome = agendamento.tipo_exame
                
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
                
            except Exception as inner_e:
                print(f"❌ [DEBUG] Erro processando agendamento {agendamento.id}: {str(inner_e)}")
                # Adiciona com dados mínimos para não quebrar a lista toda
                agendamentos_data.append({
                    'id': agendamento.id,
                    'erro': 'Erro ao processar dados deste agendamento'
                })
        
        return jsonify(agendamentos_data), 200
        
    except Exception as e:
        print(f"❌ [DEBUG] Erro geral em listar_agendamentos: {str(e)}")
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
                # Proteção contra atributos que podem não existir dependendo do model
                'periodicidade_meses': getattr(tipo, 'periodicidade_meses', None),
                'valor_padrao': float(tipo.valor_padrao) if getattr(tipo, 'valor_padrao', None) else None
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
        print(f"Erro ao agendar: {e}")
        traceback.print_exc()
        return jsonify({'erro': f'Erro ao agendar exame: {str(e)}'}), 500

@exame_bp.route('/tipos-exame', methods=['POST'])
@jwt_required()
def criar_tipo_exame():
    """Cria um novo tipo de exame"""
    try:
        auth_service = AuthorizationService(current_user)
        if not auth_service.pode_criar_exame():
            return jsonify({'erro': 'Acesso negado.'}), 403
        
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

@exame_bp.route("/agendamentos/<int:agendamento_id>/gerar-pdf", methods=["GET"])
@jwt_required()
def gerar_pdf_agendamento(agendamento_id):
    """Gera PDF do agendamento de exame"""
    try:
        print(f"📄 [PDF] Iniciando geração de PDF para agendamento {agendamento_id}")
        
        # 1. Busca o agendamento usando o método correto que adicionamos no Service
        agendamento = ExameService.buscar_agendamento_por_id(agendamento_id)
        
        if not agendamento:
            print("❌ [PDF] Agendamento não encontrado no banco")
            return jsonify({"erro": "Agendamento não encontrado"}), 404

        print(f"📄 [PDF] Agendamento encontrado: ID {agendamento.id}. Gerando arquivo...")
        
        # 2. Gera o PDF
        pdf_bytes = PdfService.gerar_pdf_agendamento(agendamento)
        
        print(f"📄 [PDF] PDF gerado com sucesso - {len(pdf_bytes)} bytes")

        # 3. Define nome do arquivo
        colaborador_nome = "Exame"
        if hasattr(agendamento, 'colaborador') and agendamento.colaborador and agendamento.colaborador.nome:
            colaborador_nome = agendamento.colaborador.nome.replace(" ", "_")
        
        filename = f"Agendamento_{agendamento.id}_{colaborador_nome}.pdf"

        # 4. Envia o arquivo
        return send_file(
            io.BytesIO(pdf_bytes),
            as_attachment=True,
            download_name=filename,
            mimetype='application/pdf'
        )

    except AttributeError as e:
        print(f"❌ [PDF] Erro de Atributo: {e}")
        traceback.print_exc()
        return jsonify({"erro": f"Erro de configuração no servidor: {str(e)}"}), 500
        
    except Exception as e:
        print(f"❌ [PDF] Erro genérico ao gerar PDF: {e}")
        traceback.print_exc()
        return jsonify({"erro": "Erro interno ao gerar PDF"}), 500

# Rota de Teste
@exame_bp.route("/teste-pdf", methods=["GET"])
@jwt_required()
def teste_pdf():
    try:
        print("🧪 [TESTE] Iniciando teste de PDF")
        agendamentos = ExameService.listar_todos_agendamentos()
        if not agendamentos:
            return jsonify({"erro": "Nenhum agendamento encontrado para teste"}), 404
            
        agendamento_teste = agendamentos[0]
        print(f"🧪 [TESTE] Usando agendamento ID {agendamento_teste.id}")
        
        pdf_bytes = PdfService.gerar_pdf_agendamento(agendamento_teste)
        
        return send_file(
            io.BytesIO(pdf_bytes),
            as_attachment=True,
            download_name=f"TESTE_Agendamento_{agendamento_teste.id}.pdf",
            mimetype='application/pdf'
        )
    except Exception as e:
        print(f"❌ [TESTE] Erro: {e}")
        traceback.print_exc()
        return jsonify({"erro": str(e)}), 500