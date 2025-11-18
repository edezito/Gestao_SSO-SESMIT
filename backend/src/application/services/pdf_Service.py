import io
import traceback
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.units import mm
from datetime import datetime

class PdfService:
    
    @staticmethod
    def _safe_text(obj, attr=None, default="--"):
        """Função auxiliar para evitar erro de atributo nulo"""
        try:
            if obj is None:
                return default
            if attr:
                val = getattr(obj, attr, None)
                return str(val) if val is not None else default
            return str(obj)
        except Exception:
            return default

    @staticmethod
    def gerar_pdf_cat(cat):
        try:
            print(f"🔍 [PDF-SERVICE] Montando PDF CAT ID: {cat.id}")
            buffer = io.BytesIO()
            
            doc = SimpleDocTemplate(
                buffer, 
                pagesize=A4,
                rightMargin=15*mm, leftMargin=15*mm,
                topMargin=15*mm, bottomMargin=15*mm
            )
            
            styles = getSampleStyleSheet()
            story = []
            
            title_style = ParagraphStyle(
                'CustomTitle',
                parent=styles['Heading1'],
                fontSize=16,
                spaceAfter=20,
                alignment=1,
                textColor=colors.HexColor('#2c3e50')
            )
            
            story.append(Paragraph("COMUNICAÇÃO DE ACIDENTE DE TRABALHO - CAT", title_style))
            story.append(Spacer(1, 20))
            info_style = styles["Normal"]
            
            # Dados da CAT
            colab = PdfService._safe_text(cat.colaborador, 'nome', 'Removido')
            cargo = PdfService._safe_text(cat.cargo, 'nome', 'N/A')
            local = PdfService._safe_text(cat, 'local_acidente')
            
            dados = [
                [Paragraph("<b>Nº CAT:</b>", info_style), Paragraph(str(cat.id), info_style)],
                [Paragraph("<b>Data:</b>", info_style), Paragraph(cat.data_acidente.strftime('%d/%m/%Y') if cat.data_acidente else "--", info_style)],
                [Paragraph("<b>Local:</b>", info_style), Paragraph(local, info_style)],
                [Paragraph("<b>Colaborador:</b>", info_style), Paragraph(colab, info_style)],
                [Paragraph("<b>Cargo:</b>", info_style), Paragraph(cargo, info_style)],
            ]
            
            tabela = Table(dados, colWidths=[50*mm, 120*mm])
            tabela.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f8f9fa')),
                ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
                ('ALIGN', (0, 0), (0, -1), 'LEFT'),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ('TOPPADDING', (0, 0), (-1, -1), 8),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.grey)
            ]))
            
            story.append(tabela)
            story.append(Spacer(1, 20))
            
            story.append(Paragraph("<b>Descrição:</b>", info_style))
            story.append(Spacer(1, 10))
            story.append(Paragraph(PdfService._safe_text(cat, 'descricao'), info_style))
            story.append(Spacer(1, 20))
            story.append(Paragraph(f"<i>Emitido em: {datetime.now().strftime('%d/%m/%Y %H:%M')}</i>", info_style))
            
            doc.build(story)
            buffer.seek(0)
            return buffer.getvalue()

        except Exception as e:
            print(f"❌ [PDF] Erro CAT: {str(e)}")
            traceback.print_exc()
            raise ValueError(str(e))
    
    @staticmethod
    def gerar_pdf_agendamento(agendamento):
        try:
            print(f"🔍 [PDF-SERVICE] Montando PDF Agendamento ID: {agendamento.id}")
            buffer = io.BytesIO()
            
            doc = SimpleDocTemplate(
                buffer, 
                pagesize=A4,
                rightMargin=15*mm, leftMargin=15*mm,
                topMargin=15*mm, bottomMargin=15*mm
            )
            
            styles = getSampleStyleSheet()
            story = []
            
            title_style = ParagraphStyle(
                'CustomTitle',
                parent=styles['Heading1'],
                fontSize=14,
                spaceAfter=30,
                alignment=1,
                textColor=colors.HexColor('#2c3e50')
            )
            
            story.append(Paragraph("COMPROVANTE DE AGENDAMENTO DE EXAME", title_style))
            story.append(Spacer(1, 20))
            info_style = styles["Normal"]
            
            colab = PdfService._safe_text(agendamento.colaborador, 'nome', 'N/A')
            exame_nome = PdfService._safe_text(agendamento.exame, 'nome', 'N/A')
            
            dados = [
                [Paragraph("<b>Nº Agendamento:</b>", info_style), Paragraph(str(agendamento.id), info_style)],
                [Paragraph("<b>Colaborador:</b>", info_style), Paragraph(colab, info_style)],
                [Paragraph("<b>Exame:</b>", info_style), Paragraph(exame_nome, info_style)],
                [Paragraph("<b>Tipo:</b>", info_style), Paragraph(PdfService._safe_text(agendamento, 'tipo_exame'), info_style)],
                [Paragraph("<b>Data:</b>", info_style), 
                 Paragraph(agendamento.data_agendamento.strftime('%d/%m/%Y') if agendamento.data_agendamento else "A definir", info_style)],
                [Paragraph("<b>Status:</b>", info_style), Paragraph(PdfService._safe_text(agendamento, 'status').upper(), info_style)],
            ]
            
            if agendamento.observacoes:
                dados.append([Paragraph("<b>Observações:</b>", info_style), Paragraph(agendamento.observacoes, info_style)])
            
            # 50mm + 120mm = 170mm (Seguro para A4)
            tabela = Table(dados, colWidths=[50*mm, 120*mm])
            tabela.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f8f9fa')),
                ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
                ('ALIGN', (0, 0), (0, -1), 'LEFT'),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ('TOPPADDING', (0, 0), (-1, -1), 8),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.grey)
            ]))
            
            story.append(tabela)
            story.append(Spacer(1, 20))
            
            story.append(Paragraph("<b>Instruções:</b>", info_style))
            story.append(Spacer(1, 10))
            story.append(Paragraph("• Apresente este comprovante no local do exame", info_style))
            story.append(Paragraph("• Chegue com 15 minutos de antecedência", info_style))
            story.append(Paragraph("• Leve documento de identificação com foto", info_style))
            story.append(Spacer(1, 20))
            story.append(Paragraph(f"<i>Emitido em: {datetime.now().strftime('%d/%m/%Y %H:%M')}</i>", info_style))
            
            doc.build(story)
            buffer.seek(0)
            return buffer.getvalue()

        except Exception as e:
            print(f"❌ [PDF] Erro Agendamento: {str(e)}")
            traceback.print_exc()
            raise ValueError(str(e))