from flask import Blueprint, Response, request, jsonify, send_file
from flask_jwt_extended import jwt_required, current_user
from src.application.services.cat_service import CATService
from src.utils.role_required import role_required
from src.application.services.authorization_service import AuthorizationService
from src.application.services.pdf_Service import PdfService
import io

cat_bp = Blueprint("cat_bp", __name__)

@cat_bp.route("/", methods=["POST"])
@jwt_required()
@role_required(lambda authz: authz.pode_criar_cat())
def criar_cat():
    try:
        dados = request.json
        obrigatorios = ["colaborador_id", "cargo_id", "data_acidente", "local_acidente", "descricao"]
        for campo in obrigatorios:
            if not dados.get(campo):
                return jsonify({"erro": f"Campo obrigatório faltando: {campo}"}), 400
        nova_cat = CATService.criar_cat(dados)
        return jsonify(nova_cat.to_dict()), 201
    except ValueError as e:
        return jsonify({"erro": str(e)}), 400
    except Exception as e:
        print(f"Erro ao criar CAT: {str(e)}")
        return jsonify({"erro": "Erro interno ao criar CAT"}), 500

@cat_bp.route("/", methods=["GET"])
@jwt_required()
def listar_cats():
    try:
        auth_service = AuthorizationService(current_user)
        
        if auth_service.pode_listar_cat(): # Admin
            print(f"🔍 [AUTH] {current_user.email} é admin. Listando todas as CATs.")
            cats = CATService.listar_todas_cats()
        else: # Colaborador
            print(f"🔍 [AUTH] {current_user.email} é Colaborador. Listando apenas suas CATs.")
            cats = CATService.listar_cats_por_colaborador(current_user.id)

        return jsonify([c.to_dict() for c in cats])
    except Exception as e:
        print(f"Erro ao listar CATs: {str(e)}")
        return jsonify({"erro": "Erro interno ao listar CATs"}), 500

@cat_bp.route("/<int:cat_id>", methods=["GET"])
@jwt_required()
def buscar_cat(cat_id):
    try:
        auth_service = AuthorizationService(current_user)
        if not auth_service.pode_visualizar_cat(cat_id):
            return jsonify({"erro": "Acesso negado"}), 403
            
        cat = CATService.buscar_cat(cat_id)
        if not cat:
            return jsonify({"erro": "CAT não encontrada"}), 404
        return jsonify(cat.to_dict())
    except Exception as e:
        return jsonify({"erro": "Erro interno ao buscar CAT"}), 500

@cat_bp.route("/<int:cat_id>", methods=["PUT"])
@jwt_required()
@role_required(lambda authz: authz.pode_editar_cat())
def atualizar_cat(cat_id):
    try:
        dados = request.json
        cat = CATService.atualizar_cat(cat_id, dados)
        return jsonify(cat.to_dict())
    except ValueError as e:
        return jsonify({"erro": str(e)}), 404
    except Exception as e:
        return jsonify({"erro": "Erro interno ao atualizar CAT"}), 500

@cat_bp.route("/<int:cat_id>", methods=["DELETE"])
@jwt_required()
@role_required(lambda authz: authz.pode_deletar_cat())
def deletar_cat(cat_id):
    try:
        CATService.deletar_cat(cat_id)
        return jsonify({"msg": "CAT excluída com sucesso"})
    except ValueError as e:
        return jsonify({"erro": str(e)}), 404
    except Exception as e:
        return jsonify({"erro": "Erro interno ao deletar CAT"}), 500

@cat_bp.route("/<int:cat_id>/gerar-pdf", methods=["GET"])
@jwt_required()
def gerar_pdf_cat(cat_id):
    try:
        print(f"\n🚀 [ROTA] Recebida requisição para PDF CAT ID: {cat_id}")
        
        auth_service = AuthorizationService(current_user)
        if not auth_service.pode_visualizar_cat(cat_id):
            print(f"⛔ [ROTA] Acesso negado para usuário {current_user.id}")
            return jsonify({"erro": "Acesso negado"}), 403

        cat = CATService.buscar_cat(cat_id)
        if not cat:
            print("❌ [ROTA] CAT não encontrada no banco")
            return jsonify({"erro": "CAT não encontrada"}), 404

        print(f"✅ [ROTA] CAT encontrada. Chamando Service...")
        
        # Chama o service protegido
        pdf_bytes = PdfService.gerar_pdf_cat(cat)
        
        print(f"📦 [ROTA] Bytes recebidos ({len(pdf_bytes)}). Preparando envio...")

        # Nome seguro
        colab_nome = "Funcionario"
        if cat.colaborador and cat.colaborador.nome:
             colab_nome = cat.colaborador.nome.replace(" ", "_")
        
        filename = f"CAT_{cat.id}_{colab_nome}.pdf"

        return send_file(
            io.BytesIO(pdf_bytes),
            as_attachment=True,
            download_name=filename,
            mimetype='application/pdf'
        )

    except Exception as e:
        print(f"🔥 [ROTA] EXCEPTION CAPTURADA: {str(e)}")
        import traceback
        traceback.print_exc() # Imprime o erro completo no terminal
        return jsonify({"erro": "Erro interno ao gerar PDF"}), 500