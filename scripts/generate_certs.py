from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor

NAVY = HexColor('#14110F')
GOLD = HexColor('#B8703D')
SILVER = HexColor('#7A7165')
WHITE = HexColor('#F7F4EF')

def make_placeholder(filename, title, issuer, ref_label, ref_value):
    c = canvas.Canvas(filename, pagesize=A4)
    width, height = A4

    # Background
    c.setFillColor(WHITE)
    c.rect(0, 0, width, height, fill=1, stroke=0)

    # Header band
    c.setFillColor(NAVY)
    c.rect(0, height - 30*mm, width, 30*mm, fill=1, stroke=0)

    # Gold accent line
    c.setFillColor(GOLD)
    c.rect(0, height - 30*mm, width, 2, fill=1, stroke=0)

    # Company name in header
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 20)
    c.drawString(20*mm, height - 18*mm, "WAHENOOR EXPORTS LIMITED")
    c.setFont("Helvetica", 9)
    c.setFillColor(GOLD)
    c.drawString(20*mm, height - 25*mm, "United Kingdom  |  www.welexports.com")

    # Document title
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 22)
    c.drawCentredString(width/2, height - 55*mm, title)

    # Issuer
    c.setFont("Helvetica", 12)
    c.setFillColor(SILVER)
    c.drawCentredString(width/2, height - 65*mm, f"Issued by: {issuer}")

    # Reference box
    c.setStrokeColor(GOLD)
    c.setLineWidth(1)
    c.rect(40*mm, height - 110*mm, width - 80*mm, 30*mm, fill=0, stroke=1)
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(NAVY)
    c.drawCentredString(width/2, height - 95*mm, ref_label)
    c.setFont("Helvetica", 11)
    c.setFillColor(SILVER)
    c.drawCentredString(width/2, height - 102*mm, ref_value)

    # Placeholder notice
    c.setFont("Helvetica-Oblique", 10)
    c.setFillColor(SILVER)
    notice_lines = [
        "This is a placeholder document generated for website demonstration purposes.",
        "Please replace this file with the company's actual scanned certificate",
        "(PDF or high-resolution image) before publishing the site live.",
    ]
    y = height - 140*mm
    for line in notice_lines:
        c.drawCentredString(width/2, y, line)
        y -= 6*mm

    # Footer
    c.setFont("Helvetica", 8)
    c.setFillColor(SILVER)
    c.drawCentredString(width/2, 20*mm, "Wahenoor Exports Limited — Registered in England & Wales — info@welexports.com")

    c.showPage()
    c.save()

make_placeholder(
    "/home/claude/wahenoor/public/certificates/certificate-of-incorporation.pdf",
    "Certificate of Incorporation",
    "Companies House, UK",
    "Company Registration Number",
    "[Insert Company Number]"
)

make_placeholder(
    "/home/claude/wahenoor/public/certificates/waste-carrier-licence.pdf",
    "Waste Carrier Licence",
    "UK Environment Agency",
    "Waste Carrier Licence Number",
    "[Insert Licence Number]"
)

make_placeholder(
    "/home/claude/wahenoor/public/certificates/eori-registration.pdf",
    "EORI Registration Certificate",
    "HMRC / UK Border Force",
    "EORI Number",
    "[Insert EORI Number]"
)

make_placeholder(
    "/home/claude/wahenoor/public/certificates/vat-registration.pdf",
    "VAT Registration Certificate",
    "HM Revenue & Customs",
    "VAT Registration Number",
    "[Insert VAT Number]"
)

print("All 4 placeholder certificate PDFs created.")
