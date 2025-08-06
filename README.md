# Forensic Toxicology Database Application

A comprehensive web-based database application for forensic toxicology professionals, providing detailed information about pharmaceutical ingredients, narcotic stimulants, synthetic drugs, and their metabolites.

## 🔬 Features

### Core Functionality
- **Comprehensive Substance Database**: Extensive collection of substances organized by category
  - Pharmaceutical ingredients
  - Narcotic stimulants  
  - Synthetic drugs
- **Metabolite Tracking**: Detailed information about substance metabolites including:
  - Chemical formulas and structures
  - Formation pathways
  - Active/inactive status
  - Detection significance
- **Therapeutic and Toxic Reference Values**: Automatic viewing of:
  - Therapeutic dose ranges
  - Toxic levels
  - Lethal doses
  - Detection windows

### User Interface
- **Modern Web Interface**: Clean, professional design optimized for forensic work
- **Advanced Search & Filtering**: 
  - Text search across substance names, descriptions, and common names
  - Category-based filtering
  - Real-time results updating
- **Detailed Substance Profiles**: Complete information including:
  - Chemical formulas and CAS numbers
  - Mechanism of action
  - Half-life and detection windows
  - Comprehensive metabolite information

### Technical Features
- **Lightweight Architecture**: Built with Python's standard library - no external dependencies required
- **SQLite Database**: Reliable, embedded database for data storage
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time API**: REST endpoints for data access and analysis

## 🚀 Quick Start

### Requirements
- Python 3.6 or higher (standard library only)
- Modern web browser
- No additional dependencies required

### Installation & Usage

1. **Clone or download the application files**
2. **Start the application**:
   ```bash
   cd /workspace
   python3 simple_app.py
   ```
3. **Access the application**:
   - Open your web browser
   - Navigate to `http://localhost:8000`
   - The database will be automatically initialized on first run

### Application Structure
```
forensic-toxicology-app/
├── simple_app.py          # Main application (standalone)
├── app.py                 # Full Flask application (requires dependencies)
├── init_database.py       # Database initialization script
├── requirements.txt       # Python dependencies for full app
├── templates/             # HTML templates
│   └── index.html
├── static/               # Static assets
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
└── README.md             # This file
```

## 📊 Database Content

### Pharmaceutical Substances
- **Acetaminophen** (Paracetamol, Tylenol)
  - Metabolites: Glucuronide, Sulfate, NAPQI (toxic)
  - Therapeutic range: 10-20 mg/L
  - Toxic level: 150 mg/L
- **Diazepam** (Valium)
  - Metabolites: Desmethyldiazepam, Temazepam, Oxazepam
  - Therapeutic range: 0.1-2.5 mg/L
  - Long detection window: 3-6 weeks in urine
- **Morphine** 
  - Metabolites: Morphine-3-glucuronide, Morphine-6-glucuronide (active)
  - Therapeutic range: 0.01-0.1 mg/L
  - Gold standard opioid analgesic
- **Digoxin**
  - Narrow therapeutic window: 0.8-2.0 µg/L
  - Critical cardiac medication monitoring

### Narcotic Stimulants
- **Cocaine**
  - Metabolites: Benzoylecgonine (major), Cocaethylene (when used with alcohol)
  - Detection: Urine 2-4 days, Blood 12-24 hours
- **Methamphetamine**
  - Metabolites: Amphetamine (active), 4-Hydroxymethamphetamine
  - High abuse potential, neurotoxic effects
- **Heroin** (Diacetylmorphine)
  - Metabolites: 6-Monoacetylmorphine (specific heroin marker), Morphine
  - Rapid metabolism: 2-6 minute half-life

### Synthetic Drugs
- **MDMA** (Ecstasy)
  - Metabolites: MDA (active, hallucinogenic), HMMA
  - Empathogenic stimulant effects
- **Fentanyl**
  - Extremely potent: 50-100x more potent than morphine
  - Major overdose risk substance
  - Metabolite: Norfentanyl
- **LSD**
  - Potent hallucinogen with extremely low active doses
  - Detection challenges due to low concentrations
- **Synthetic Cannabinoids** (JWH-018)
  - More dangerous than natural THC
  - Full CB1/CB2 receptor agonist
- **Cathinone** ("Bath Salts")
  - Stimulant effects similar to amphetamines
  - Found in khat plant

## 🔍 Using the Application

### Search and Navigation
1. **Browse by Category**: Use the dropdown filter to view specific substance types
2. **Text Search**: Enter substance names, common names, or descriptions in the search box
3. **Select Substances**: Click on any substance in the left panel to view detailed information
4. **Clear Filters**: Use the "Clear" button to reset all filters

### Understanding the Data
- **Therapeutic Range**: Safe and effective dose levels for medications
- **Toxic Level**: Concentration at which harmful effects may occur
- **Lethal Level**: Potentially fatal concentration
- **Active Metabolites**: Metabolites that retain pharmacological activity
- **Detection Significance**: Importance of metabolites in forensic testing

### Professional Applications
- **Forensic Investigations**: Reference for post-mortem toxicology
- **Clinical Toxicology**: Emergency medicine and overdose management
- **Drug Testing**: Understanding detection windows and metabolite patterns
- **Legal Proceedings**: Expert testimony and case preparation
- **Educational Purposes**: Training and reference for toxicology professionals

## 🛠 Technical Implementation

### Architecture
- **Backend**: Python HTTP server with SQLite database
- **Frontend**: Modern HTML5/CSS3/JavaScript
- **API**: RESTful endpoints for data access
- **Database**: SQLite with substances and metabolites tables

### API Endpoints
- `GET /api/substances` - List all substances with optional filtering
- `GET /api/substances/:id` - Get detailed substance information
- `GET /api/categories` - Get available substance categories
- `POST /api/dose-analysis` - Analyze measured levels (full version)

### Data Model
```sql
substances:
- Basic information (name, formula, CAS number)
- Category classification
- Pharmacokinetic data (half-life, detection window)
- Toxicological reference values
- Mechanism of action

metabolites:
- Linked to parent substances
- Formation pathways
- Activity status
- Reference levels
- Detection significance
```

## 🎯 Use Cases

### Forensic Laboratories
- **Post-mortem Analysis**: Interpreting toxicological findings
- **Case Work**: Reference for substance identification
- **Report Writing**: Standardized reference values

### Clinical Settings
- **Emergency Medicine**: Overdose assessment and treatment
- **Therapeutic Drug Monitoring**: Ensuring safe medication levels
- **Poison Control**: Rapid substance identification and risk assessment

### Legal Professionals
- **Expert Testimony**: Scientific basis for legal proceedings
- **Case Preparation**: Understanding toxicological evidence
- **Education**: Training for legal professionals handling drug cases

### Research and Education
- **Academic Training**: Teaching forensic toxicology principles
- **Research Reference**: Comprehensive substance database
- **Continuing Education**: Professional development resource

## 🔒 Data Sources and Accuracy

The database is compiled from:
- Clinical toxicology references
- Forensic toxicology guidelines
- Pharmacological databases
- Peer-reviewed literature
- Professional toxicology standards

**Note**: This application is for educational and reference purposes. Always consult current literature and professional guidelines for critical decisions.

## 📝 Version Information

- **Current Version**: 1.0.0
- **Last Updated**: December 2024
- **Python Compatibility**: 3.6+
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)

## 🤝 Contributing

This is an educational project demonstrating comprehensive forensic toxicology database design. For professional applications, ensure data validation against current standards and regulatory requirements.

## ⚠️ Disclaimer

This application is intended for educational and reference purposes only. Professional forensic and clinical decisions should always be based on current literature, professional guidelines, and appropriate validation procedures. The authors assume no responsibility for decisions made based on this information.

---

**Forensic Toxicology Database** - Supporting forensic science education and professional reference needs.