import json
from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font('helvetica', 'B', 15)
        self.cell(0, 10, 'Rapport de Projet : CineStack', border=0, ln=1, align='C')
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}/{{nb}}', align='C')

    def chapter_title(self, title):
        self.set_font('helvetica', 'B', 12)
        self.set_fill_color(200, 220, 255)
        self.cell(0, 8, title, fill=True, ln=1)
        self.ln(4)

    def chapter_body(self, body):
        self.set_font('helvetica', '', 11)
        self.multi_cell(0, 6, body)
        self.ln(4)

pdf = PDF()
pdf.alias_nb_pages()
pdf.add_page()
pdf.set_auto_page_break(auto=True, margin=15)

# Contenu du rapport
sections = [
    ("1. Synthese (Executive Summary)", 
     "Le projet CineStack a consiste en la conception et le deploiement d'une application web full-stack dediee a la gestion de catalogues cinematographiques et aux critiques de films. En l'espace de trois jours intenses de developpement, l'equipe a reussi a livrer une solution robuste integrant un backend Spring Boot securise et un frontend React moderne."),
    
    ("2. Objectifs Atteints", 
     "- API REST fonctionnelle : Gestion complete des films, genres et critiques.\n"
     "- Securite renforcee : Implementation de l'authentification et de l'autorisation via JWT.\n"
     "- Interface Utilisateur (UI) : Creation d'un dashboard administrateur reactif avec React.\n"
     "- Conteneurisation : Orchestration complete via Docker Compose."),
    
    ("3. Methodologie", 
     "Nous avons adopte une approche Agile de type Scrum compresse, privilegiant :\n"
     "- Developpement pilote par les composants.\n"
     "- Integration Continue : Tests unitaires reguliers.\n"
     "- Architecture n-tiers : Utilisation des patterns Repository, Service et DTO."),
     
    ("4. Analyse des Ecarts", 
     "- Budget : Les couts operationnels sont restes a moins de 5% de l'estimation initiale.\n"
     "- Delais : Le deploiement a ete realise 2 jours avant l'echeance theorique.\n"
     "- Perimetre (Scope) : Toutes les fonctionnalites prevues ont ete livrees avec succes."),
     
    ("5. Defis et Solutions", 
     "Defi : Synchronisation complexe des etats de securite entre backend et frontend.\n"
     "Solution : Mise en place d'un AuthContext cote frontend pour centraliser la gestion JWT.\n\n"
     "Defi : Filtrage dynamique des films.\n"
     "Solution : Utilisation des Spring Data JPA Specifications."),
     
    ("6. Recommandations", 
     "1. Extension des Tests : Augmenter la couverture des tests frontend.\n"
     "2. Mise en cache : Implementer Redis pour les requetes frequentes.\n"
     "3. CI/CD : Automatiser le pipeline de deploiement vers un environnement de staging.")
]

for title, body in sections:
    pdf.chapter_title(title)
    pdf.chapter_body(body)

pdf.output('Rapport_CineStack.pdf')
print("PDF généré avec succès : Rapport_CineStack.pdf")
