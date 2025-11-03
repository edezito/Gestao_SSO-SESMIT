from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required
from src.application.services.cat_service import CATService
from src.utils.role_required import role_required
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

cat_bp = Blueprint("cat_bp", __name__)

# -----------------------------
# CRUD CAT
# -----------------------------
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
@role_required(lambda authz: authz.pode_listar_cat())
def listar_cats():
    try:
        cats = CATService.listar_cats()
        return jsonify([c.to_dict() for c in cats])
    except Exception as e:
        print(f"Erro ao listar CATs: {str(e)}")
        return jsonify({"erro": "Erro interno ao listar CATs"}), 500


@cat_bp.route("/<int:cat_id>", methods=["GET"])
@jwt_required()
@role_required(lambda authz: authz.pode_listar_cat())
def buscar_cat(cat_id):
    try:
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

# -----------------------------
# Geração de PDF Oficial da CAT
# -----------------------------
@cat_bp.route("/<int:cat_id>/gerar-pdf", methods=["GET"])
@jwt_required()
@role_required(lambda authz: authz.pode_gerar_pdf_cat())
def gerar_pdf_cat(cat_id):
    """
    Gera o PDF oficial da Comunicação de Acidente de Trabalho (CAT)
    """
    try:
        cat = CATService.buscar_cat(cat_id)
        if not cat:
            return jsonify({"erro": "CAT não encontrada"}), 404

        buffer = BytesIO()
        p = canvas.Canvas(buffer, pagesize=A4)
        width, height = A4

        # Cabeçalho
        p.setFont("Helvetica-Bold", 16)
        p.drawString(180, height - 50, "COMUNICAÇÃO DE ACIDENTE DE TRABALHO (CAT)")

        # Linha de separação
        p.setLineWidth(1)
        p.line(40, height - 60, width - 40, height - 60)

        # Dados gerais
        p.setFont("Helvetica", 12)
        y = height - 100
        p.drawString(50, y, f"ID CAT: {cat.id}")
        p.drawString(300, y, f"Status: {cat.status}")
        y -= 25
        p.drawString(50, y, f"Colaborador: {cat.colaborador.nome if cat.colaborador else 'N/A'}")
        y -= 25
        p.drawString(50, y, f"Cargo: {cat.cargo.nome if cat.cargo else 'N/A'}")
        y -= 25
        p.drawString(50, y, f"Data do Acidente: {cat.data_acidente.strftime('%d/%m/%Y %H:%M')}")
        y -= 25
        p.drawString(50, y, f"Local do Acidente: {cat.local_acidente}")
        y -= 25
        p.drawString(50, y, f"Tipo de Acidente: {cat.tipo_acidente or 'Não especificado'}")
        y -= 25
        p.drawString(50, y, f"Comunicante: {cat.comunicante or 'Não informado'}")

        # Descrição
        y -= 40
        p.setFont("Helvetica-Bold", 12)
        p.drawString(50, y, "Descrição do Acidente:")
        y -= 20
        p.setFont("Helvetica", 11)
        texto = cat.descricao or ""
        for linha in texto.split("\n"):
            p.drawString(60, y, linha.strip())
            y -= 15

        # Testemunhas
        if cat.testemunhas:
            y -= 20
            p.setFont("Helvetica-Bold", 12)
            p.drawString(50, y, "Testemunhas:")
            y -= 15
            p.setFont("Helvetica", 11)
            p.drawString(60, y, cat.testemunhas)

        # Rodapé
        p.setFont("Helvetica-Oblique", 10)
        p.drawString(50, 40, f"Emitido em: {cat.criado_em.strftime('%d/%m/%Y %H:%M')}")

        p.showPage()
        p.save()

        buffer.seek(0)
        return send_file(
            buffer,
            as_attachment=True,
            download_name=f"CAT_{cat.id}_{cat.colaborador.nome.replace(' ', '_')}.pdf",
            mimetype="application/pdf"
        )

    except Exception as e:
        print(f"Erro ao gerar PDF: {e}")
        return jsonify({"erro": "Erro interno ao gerar PDF"}), 500