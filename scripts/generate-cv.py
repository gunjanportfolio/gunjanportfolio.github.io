#!/usr/bin/env python3
"""Generate Gunjan Bandekar's portfolio CV PDF into public/cv/."""

from pathlib import Path

from fpdf import FPDF

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PATH = ROOT / "public" / "cv" / "Gunjan_Bandekar_CV.pdf"

FULL_NAME = "Gunjan Bandekar"
TAGLINE = "Data Analyst & Treatment Coordinator"
EMAIL = "gunjanbandekar20@gmail.com"
LINKEDIN = "https://www.linkedin.com/in/gunjanbandekar1320/"
BIO = (
    "Data Analyst and Treatment Coordinator currently working at Happy Kids "
    "Dental Clinic, with Business Analyst experience across healthcare and "
    "banking. Skilled in SQL, Python, Power BI/Tableau, requirements "
    "gathering, and AI-driven analytics."
)

EXPERIENCES = [
    {
        "title": "Data Analyst & Treatment Coordinator",
        "company": "Happy Kids Dental Clinic",
        "date": "July 2026 - Present",
        "points": [
            "Supporting clinic operations and patient care coordination as Data Analyst and Treatment Coordinator.",
            "Analyzing clinic operational and patient data to support decision-making.",
            "Building reporting and dashboards for clinical and admin stakeholders.",
            "Identifying process improvements through data-driven insights.",
        ],
    },
    {
        "title": "Data Analyst",
        "company": "Mint Dental Clinic",
        "date": "April 2025 - May 2026",
        "points": [
            "Delivered data analysis and reporting to improve clinic performance visibility.",
            "Supported stakeholders with actionable insights from operational datasets.",
            "Documented analytical workflows and improved reporting consistency.",
        ],
    },
    {
        "title": "Business Analyst (Internship)",
        "company": "HDFC - Pune, India",
        "date": "May 2020 - September 2024",
        "points": [
            "Led requirements gathering with C-level stakeholders and designed an AI-powered BI platform with executive dashboards; reduced insight delivery time by 80% and improved accuracy for complex business queries by 35%.",
            "Designed predictive analytics models on Azure and automated reporting workflows with regional sales managers; increased sales prediction accuracy by 10-13% across regions.",
            "Developed a user-friendly anomaly detection system and trained business users to identify key performance drivers within seconds.",
            "Designed reusable AI integration architecture and deployment protocols enabling rapid AI solution rollout across 5+ enterprise clients.",
        ],
    },
]

EDUCATION = [
    {
        "degree": "MSc. Management of Business Information Technology",
        "school": "University of Greenwich",
        "date": "September 2025",
    }
]

SKILL_CATEGORIES = [
    (
        "Core BA Skills",
        "Requirements Gathering, Stakeholder Management, Business Process Analysis, UAT & Test Data Creation",
    ),
    (
        "Analytics & BI",
        "SQL (Data Analysis), Python (Business Intelligence), Excel (Advanced), Power BI / Tableau",
    ),
    (
        "Process & Documentation",
        "Visio (Process Mapping), Business Case Development, Gap Analysis, Workflow Optimization",
    ),
    (
        "Data Management",
        "Database Analysis (NoSQL, GraphDB), Data Modeling, Business Data Architecture",
    ),
    (
        "Project Management",
        "Agile / Scrum, Project Planning, Cross-functional Collaboration, Change Management",
    ),
    (
        "Innovation & AI",
        "Business Process Automation, AI-Driven Analytics, Intelligent Document Processing, Predictive Modeling",
    ),
]

ACTIVITIES = [
    {
        "title": "Business Analyst Peer Mentoring",
        "organization": "Professional BA Network",
        "date": "2024 - Present",
        "description": (
            "Mentors early-career business analysts on requirements elicitation, "
            "stakeholder workshops, and turning ambiguous business problems into "
            "measurable analytics outcomes."
        ),
    },
    {
        "title": "Healthcare Analytics Community Sessions",
        "organization": "Dental Clinic Operations Community",
        "date": "2025 - Present",
        "description": (
            "Shares clinic reporting practices, UAT approaches, and data-driven "
            "treatment coordination insights with healthcare analytics peers."
        ),
    },
]


class CurriculumVitaePdf(FPDF):
    def header(self):
        return None

    def footer(self):
        self.set_y(-12)
        self.set_font("Helvetica", size=8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 8, f"Page {self.page_no()}", align="C")


def add_section_title(pdf: CurriculumVitaePdf, title: str) -> None:
    pdf.ln(4)
    pdf.set_font("Helvetica", "B", 12)
    pdf.set_text_color(0, 90, 170)
    pdf.cell(0, 7, title.upper(), new_x="LMARGIN", new_y="NEXT")
    pdf.set_draw_color(0, 140, 220)
    pdf.set_line_width(0.4)
    pdf.line(pdf.l_margin, pdf.get_y(), pdf.w - pdf.r_margin, pdf.get_y())
    pdf.ln(3)
    pdf.set_text_color(30, 30, 30)


def write_wrapped(pdf: CurriculumVitaePdf, text: str, size: int = 10) -> None:
    pdf.set_font("Helvetica", size=size)
    pdf.multi_cell(0, 5, text)


def build_cv() -> None:
    pdf = CurriculumVitaePdf(format="A4")
    pdf.set_auto_page_break(auto=True, margin=16)
    pdf.add_page()
    pdf.set_margins(16, 16, 16)

    pdf.set_font("Helvetica", "B", 22)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 10, FULL_NAME, new_x="LMARGIN", new_y="NEXT")

    pdf.set_font("Helvetica", size=12)
    pdf.set_text_color(0, 114, 255)
    pdf.cell(0, 7, TAGLINE, new_x="LMARGIN", new_y="NEXT")

    pdf.set_font("Helvetica", size=9)
    pdf.set_text_color(70, 70, 70)
    pdf.cell(0, 5, f"{EMAIL}  |  {LINKEDIN}", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)

    add_section_title(pdf, "Profile")
    write_wrapped(pdf, BIO)

    add_section_title(pdf, "Experience")
    for experience in EXPERIENCES:
        pdf.set_font("Helvetica", "B", 11)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(0, 6, experience["title"], new_x="LMARGIN", new_y="NEXT")

        pdf.set_font("Helvetica", size=10)
        pdf.set_text_color(50, 50, 50)
        pdf.cell(
            0,
            5,
            f"{experience['company']}  |  {experience['date']}",
            new_x="LMARGIN",
            new_y="NEXT",
        )

        pdf.set_text_color(40, 40, 40)
        for point in experience["points"]:
            pdf.set_x(pdf.l_margin + 2)
            write_wrapped(pdf, f"- {point}", size=9)
        pdf.ln(2)

    add_section_title(pdf, "Education")
    for item in EDUCATION:
        pdf.set_font("Helvetica", "B", 11)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(0, 6, item["degree"], new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Helvetica", size=10)
        pdf.set_text_color(50, 50, 50)
        pdf.cell(
            0,
            5,
            f"{item['school']}  |  {item['date']}",
            new_x="LMARGIN",
            new_y="NEXT",
        )

    add_section_title(pdf, "Skills")
    for category_name, skills_text in SKILL_CATEGORIES:
        pdf.set_font("Helvetica", "B", 10)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(0, 5, category_name, new_x="LMARGIN", new_y="NEXT")
        pdf.set_text_color(40, 40, 40)
        write_wrapped(pdf, skills_text, size=9)
        pdf.ln(1)

    add_section_title(pdf, "Activities")
    for activity in ACTIVITIES:
        pdf.set_font("Helvetica", "B", 10)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(0, 5, activity["title"], new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Helvetica", size=9)
        pdf.set_text_color(50, 50, 50)
        pdf.cell(
            0,
            4,
            f"{activity['organization']}  |  {activity['date']}",
            new_x="LMARGIN",
            new_y="NEXT",
        )
        pdf.set_text_color(40, 40, 40)
        write_wrapped(pdf, activity["description"], size=9)
        pdf.ln(1)

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    pdf.output(str(OUTPUT_PATH))
    print(f"Wrote {OUTPUT_PATH}")


if __name__ == "__main__":
    build_cv()
