#!/usr/bin/env python3
"""
Simple Forensic Toxicology Database Application
A lightweight version using only Python built-in modules
"""

import json
import sqlite3
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading
import webbrowser

# Database setup
DB_PATH = 'forensic_toxicology.db'

def init_database():
    """Initialize SQLite database with forensic toxicology data"""
    
    # Remove existing database
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute('''
        CREATE TABLE substances (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            common_names TEXT,
            chemical_formula TEXT,
            cas_number TEXT,
            category TEXT NOT NULL,
            description TEXT,
            mechanism_of_action TEXT,
            therapeutic_dose_min REAL,
            therapeutic_dose_max REAL,
            toxic_dose REAL,
            lethal_dose REAL,
            dose_unit TEXT DEFAULT 'mg/L',
            half_life TEXT,
            detection_window TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE metabolites (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            substance_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            chemical_formula TEXT,
            is_active BOOLEAN DEFAULT 0,
            formation_pathway TEXT,
            detection_significance TEXT,
            therapeutic_range_min REAL,
            therapeutic_range_max REAL,
            toxic_level REAL,
            unit TEXT DEFAULT 'ng/mL',
            FOREIGN KEY (substance_id) REFERENCES substances (id)
        )
    ''')
    
    # Insert sample data
    substances = [
        # Pharmaceuticals
        ('Acetaminophen', 'Paracetamol, Tylenol, APAP', 'C8H9NO2', '103-90-2', 'pharmaceutical',
         'Widely used analgesic and antipyretic drug. Common cause of overdose-related liver toxicity.',
         'Inhibits COX enzymes in the CNS, reducing prostaglandin synthesis. Hepatotoxicity occurs through NAPQI formation.',
         10.0, 20.0, 150.0, 300.0, 'mg/L', '1-4 hours', 'Urine: 1-3 days, Blood: 4-8 hours'),
        
        ('Diazepam', 'Valium, Diastat', 'C16H13ClN2O', '439-14-5', 'pharmaceutical',
         'Benzodiazepine anxiolytic and anticonvulsant. Commonly detected in forensic cases.',
         'Enhances GABA-A receptor activity, causing CNS depression.',
         0.1, 2.5, 5.0, 50.0, 'mg/L', '20-100 hours', 'Urine: 3-6 weeks, Blood: 2-7 days'),
        
        ('Morphine', 'MS Contin, Roxanol, Avinza', 'C17H19NO3', '57-27-2', 'pharmaceutical',
         'Opioid analgesic derived from opium. Gold standard for severe pain management.',
         'Mu-opioid receptor agonist causing analgesia and respiratory depression.',
         0.01, 0.1, 0.2, 0.5, 'mg/L', '2-4 hours', 'Urine: 2-3 days, Blood: 6-12 hours'),
        
        # Narcotics
        ('Cocaine', 'Coke, Crack, Snow, Blow', 'C17H21NO4', '50-36-2', 'narcotic',
         'Powerful stimulant derived from coca plant. Blocks sodium channels and dopamine reuptake.',
         'Blocks dopamine, norepinephrine, and serotonin reuptake transporters.',
         None, None, 0.5, 5.0, 'mg/L', '0.5-1.5 hours', 'Urine: 2-4 days, Blood: 12-24 hours'),
        
        ('Methamphetamine', 'Meth, Crystal, Ice, Glass', 'C10H15N', '537-46-2', 'narcotic',
         'Potent CNS stimulant with high abuse potential. Neurotoxic effects on dopamine system.',
         'Reverses dopamine and norepinephrine transporters, depletes vesicular stores.',
         None, None, 0.2, 3.0, 'mg/L', '10-12 hours', 'Urine: 3-5 days, Blood: 24-48 hours'),
        
        ('Heroin', 'Diacetylmorphine, Smack, H, Junk', 'C21H23NO5', '561-27-3', 'narcotic',
         'Semi-synthetic opioid with rapid onset. Rapidly metabolized to morphine.',
         'Prodrug rapidly converted to 6-MAM and morphine, acting on opioid receptors.',
         None, None, 0.05, 0.2, 'mg/L', '2-6 minutes', 'Urine: 1-3 days, Blood: 30 minutes'),
        
        # Synthetics
        ('MDMA', 'Ecstasy, Molly, E, X', 'C11H15NO2', '42542-10-9', 'synthetic',
         'Empathogenic stimulant with serotonergic and dopaminergic effects. Popular club drug.',
         'Reverses serotonin, dopamine, and norepinephrine transporters; releases stored neurotransmitters.',
         None, None, 0.5, 2.0, 'mg/L', '6-8 hours', 'Urine: 3-4 days, Blood: 24 hours'),
        
        ('Fentanyl', 'Apache, China Girl, Dance Fever', 'C22H28N2O', '437-38-7', 'synthetic',
         'Extremely potent synthetic opioid. 50-100x more potent than morphine. Major overdose risk.',
         'High-affinity mu-opioid receptor agonist with rapid onset and short duration.',
         0.001, 0.01, 0.01, 0.02, 'mg/L', '3-7 hours', 'Urine: 1-3 days, Blood: 8-24 hours'),
        
        ('LSD', 'Acid, Tabs, Lucy, Doses', 'C20H25N3O', '50-37-3', 'synthetic',
         'Potent hallucinogen with extremely low active doses. Ergot alkaloid derivative.',
         'Partial agonist at 5-HT2A receptors, causing visual and auditory hallucinations.',
         None, None, 0.001, 0.01, 'mg/L', '3-5 hours', 'Urine: 1-3 days, Blood: 6-12 hours')
    ]
    
    cursor.executemany('''
        INSERT INTO substances (name, common_names, chemical_formula, cas_number, category,
                              description, mechanism_of_action, therapeutic_dose_min, therapeutic_dose_max,
                              toxic_dose, lethal_dose, dose_unit, half_life, detection_window)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', substances)
    
    # Insert metabolites for some substances
    metabolites = [
        # Acetaminophen metabolites
        (1, 'Acetaminophen Glucuronide', 'C14H17NO8', 0, 'Phase II glucuronidation by UGT1A1, UGT1A6, UGT1A9',
         'Major metabolite, represents 50-60% of dose', 50.0, 200.0, None, 'mg/L'),
        (1, 'N-Acetyl-p-benzoquinone imine (NAPQI)', 'C8H7NO2', 1, 'CYP2E1, CYP1A2 oxidation',
         'Toxic metabolite responsible for hepatotoxicity', None, None, 5.0, 'µg/L'),
        
        # Cocaine metabolites
        (4, 'Benzoylecgonine', 'C16H19NO4', 0, 'Hydrolysis by plasma and liver esterases',
         'Major urinary metabolite, extends detection window', None, None, 2.0, 'mg/L'),
        (4, 'Cocaethylene', 'C18H23NO4', 1, 'Transesterification in presence of ethanol',
         'Active metabolite when cocaine used with alcohol', None, None, 0.2, 'mg/L'),
        
        # Heroin metabolites
        (6, '6-Monoacetylmorphine', 'C19H21NO4', 1, 'Rapid deacetylation by plasma esterases',
         'Specific heroin marker, proves heroin use', None, None, 0.02, 'mg/L'),
        
        # MDMA metabolites
        (7, 'MDA', 'C10H13NO2', 1, 'CYP2D6 N-demethylation',
         'Active metabolite with hallucinogenic properties', None, None, 0.3, 'mg/L'),
    ]
    
    cursor.executemany('''
        INSERT INTO metabolites (substance_id, name, chemical_formula, is_active, formation_pathway,
                               detection_significance, therapeutic_range_min, therapeutic_range_max, toxic_level, unit)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', metabolites)
    
    conn.commit()
    conn.close()
    print(f"Database initialized with {len(substances)} substances and {len(metabolites)} metabolites")

class ForensicToxRequestHandler(SimpleHTTPRequestHandler):
    """Custom HTTP request handler for the forensic toxicology app"""
    
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        query_params = parse_qs(parsed_path.query)
        
        if path == '/':
            self.serve_html_file('index.html')
        elif path == '/api/substances':
            self.handle_substances_api(query_params)
        elif path.startswith('/api/substances/'):
            substance_id = path.split('/')[-1]
            self.handle_substance_detail_api(substance_id)
        elif path == '/api/categories':
            self.handle_categories_api()
        else:
            super().do_GET()
    
    def do_POST(self):
        """Handle POST requests"""
        if self.path == '/api/dose-analysis':
            self.handle_dose_analysis_api()
        else:
            self.send_error(404)
    
    def serve_html_file(self, filename):
        """Serve the main HTML file with embedded CSS and JS"""
        html_content = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forensic Toxicology Database</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; color: #333; }
        .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
        .header { background: rgba(255,255,255,0.95); border-radius: 15px; padding: 30px; text-align: center; margin-bottom: 30px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
        .header h1 { color: #2c3e50; font-size: 2.5em; margin-bottom: 10px; }
        .search-section { background: rgba(255,255,255,0.95); border-radius: 15px; padding: 25px; margin-bottom: 30px; }
        .search-controls { display: flex; gap: 15px; align-items: center; flex-wrap: wrap; }
        .search-input-group { position: relative; flex: 1; min-width: 300px; }
        .search-input-group i { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #7f8c8d; }
        #searchInput { width: 100%; padding: 12px 15px 12px 45px; border: 2px solid #e0e6ed; border-radius: 10px; font-size: 16px; }
        #categoryFilter { padding: 12px 15px; border: 2px solid #e0e6ed; border-radius: 10px; font-size: 16px; background: white; min-width: 180px; }
        .clear-btn { padding: 12px 20px; background: #e74c3c; color: white; border: none; border-radius: 10px; cursor: pointer; }
        .content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; height: calc(100vh - 400px); min-height: 600px; }
        .substances-panel, .detail-panel { background: rgba(255,255,255,0.95); border-radius: 15px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); overflow: hidden; display: flex; flex-direction: column; }
        .panel-header { padding: 20px 25px; background: linear-gradient(135deg, #3498db, #2980b9); color: white; display: flex; justify-content: space-between; align-items: center; }
        .substances-list { flex: 1; overflow-y: auto; padding: 10px; }
        .substance-item { background: white; border: 1px solid #e0e6ed; border-radius: 10px; padding: 15px; margin-bottom: 10px; cursor: pointer; transition: all 0.3s ease; }
        .substance-item:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-color: #3498db; }
        .substance-item.selected { border-color: #3498db; background: #f8f9ff; }
        .substance-name { font-size: 1.1em; font-weight: 600; color: #2c3e50; margin-bottom: 5px; }
        .substance-category { display: inline-block; padding: 4px 8px; border-radius: 15px; font-size: 0.8em; font-weight: 500; margin-bottom: 8px; }
        .category-pharmaceutical { background: #e8f5e8; color: #27ae60; }
        .category-narcotic { background: #ffeaa7; color: #f39c12; }
        .category-synthetic { background: #fab1a0; color: #e17055; }
        .substance-formula { font-family: 'Courier New', monospace; color: #7f8c8d; font-size: 0.9em; margin-bottom: 5px; }
        .substance-description { color: #5a6c7d; font-size: 0.9em; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .substance-detail { flex: 1; overflow-y: auto; padding: 25px; }
        .welcome-message { text-align: center; color: #7f8c8d; margin-top: 100px; }
        .detail-section { margin-bottom: 30px; }
        .detail-section h3 { color: #2c3e50; font-size: 1.2em; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #ecf0f1; }
        .detail-info { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; }
        .info-item { background: #f8f9fa; padding: 12px; border-radius: 8px; border-left: 4px solid #3498db; }
        .info-label { font-weight: 600; color: #2c3e50; font-size: 0.9em; margin-bottom: 5px; }
        .info-value { color: #5a6c7d; font-size: 0.95em; }
        .dose-ranges { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin: 20px 0; }
        .dose-range { background: white; border: 1px solid #e0e6ed; border-radius: 10px; padding: 15px; text-align: center; }
        .dose-therapeutic { border-left: 4px solid #27ae60; }
        .dose-toxic { border-left: 4px solid #f39c12; }
        .dose-lethal { border-left: 4px solid #e74c3c; }
        .dose-label { font-weight: 600; font-size: 0.9em; margin-bottom: 8px; }
        .dose-value { font-size: 1.1em; font-weight: 700; }
        .metabolites-grid { display: grid; gap: 15px; }
        .metabolite-card { background: white; border: 1px solid #e0e6ed; border-radius: 10px; padding: 20px; position: relative; }
        .metabolite-active { border-left: 4px solid #27ae60; }
        .metabolite-inactive { border-left: 4px solid #95a5a6; }
        .metabolite-name { font-weight: 600; color: #2c3e50; margin-bottom: 10px; }
        .active-badge { position: absolute; top: 15px; right: 15px; padding: 4px 8px; border-radius: 12px; font-size: 0.7em; font-weight: 600; }
        .badge-active { background: #d5f4e6; color: #27ae60; }
        .badge-inactive { background: #ecf0f1; color: #95a5a6; }
        @media (max-width: 1024px) { .content-grid { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1><i class="fas fa-flask"></i> Forensic Toxicology Database</h1>
            <p>Comprehensive database of substances, metabolites, and toxicological reference values</p>
        </header>

        <div class="search-section">
            <div class="search-controls">
                <div class="search-input-group">
                    <i class="fas fa-search"></i>
                    <input type="text" id="searchInput" placeholder="Search substances, common names, or descriptions...">
                </div>
                <select id="categoryFilter">
                    <option value="">All Categories</option>
                    <option value="pharmaceutical">Pharmaceuticals</option>
                    <option value="narcotic">Narcotic Stimulants</option>
                    <option value="synthetic">Synthetic Drugs</option>
                </select>
                <button id="clearFilters" class="clear-btn">
                    <i class="fas fa-times"></i> Clear
                </button>
            </div>
        </div>

        <div class="content-grid">
            <div class="substances-panel">
                <div class="panel-header">
                    <h2><i class="fas fa-list"></i> Substances</h2>
                    <div class="results-count">
                        <span id="resultsCount">0 substances found</span>
                    </div>
                </div>
                <div id="substancesList" class="substances-list">
                    <!-- Substances will be loaded here -->
                </div>
            </div>

            <div class="detail-panel">
                <div id="substanceDetail" class="substance-detail">
                    <div class="welcome-message">
                        <i class="fas fa-arrow-left" style="font-size: 3em; margin-bottom: 20px;"></i>
                        <h3>Select a substance to view details</h3>
                        <p>Choose a substance from the left panel to view comprehensive information including metabolites, therapeutic ranges, and toxicological data.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        class ForensicToxicologyApp {
            constructor() {
                this.substances = [];
                this.filteredSubstances = [];
                this.selectedSubstance = null;
                this.currentCategory = '';
                this.currentSearch = '';
                
                this.initializeElements();
                this.bindEvents();
                this.loadSubstances();
            }
            
            initializeElements() {
                this.searchInput = document.getElementById('searchInput');
                this.categoryFilter = document.getElementById('categoryFilter');
                this.clearFilters = document.getElementById('clearFilters');
                this.substancesList = document.getElementById('substancesList');
                this.substanceDetail = document.getElementById('substanceDetail');
                this.resultsCount = document.getElementById('resultsCount');
            }
            
            bindEvents() {
                this.searchInput.addEventListener('input', () => this.handleSearch());
                this.categoryFilter.addEventListener('change', () => this.handleCategoryFilter());
                this.clearFilters.addEventListener('click', () => this.clearAllFilters());
            }
            
            async loadSubstances() {
                try {
                    const response = await fetch('/api/substances');
                    this.substances = await response.json();
                    this.filteredSubstances = [...this.substances];
                    this.displaySubstances();
                    this.updateResultsCount();
                } catch (error) {
                    console.error('Error loading substances:', error);
                }
            }
            
            handleSearch() {
                this.currentSearch = this.searchInput.value.toLowerCase().trim();
                this.filterSubstances();
            }
            
            handleCategoryFilter() {
                this.currentCategory = this.categoryFilter.value;
                this.filterSubstances();
            }
            
            filterSubstances() {
                this.filteredSubstances = this.substances.filter(substance => {
                    const matchesCategory = !this.currentCategory || substance.category === this.currentCategory;
                    const matchesSearch = !this.currentSearch || 
                        substance.name.toLowerCase().includes(this.currentSearch) ||
                        (substance.common_names && substance.common_names.toLowerCase().includes(this.currentSearch)) ||
                        (substance.description && substance.description.toLowerCase().includes(this.currentSearch));
                    
                    return matchesCategory && matchesSearch;
                });
                
                this.displaySubstances();
                this.updateResultsCount();
            }
            
            clearAllFilters() {
                this.searchInput.value = '';
                this.categoryFilter.value = '';
                this.currentSearch = '';
                this.currentCategory = '';
                this.filteredSubstances = [...this.substances];
                this.displaySubstances();
                this.updateResultsCount();
            }
            
            displaySubstances() {
                const container = this.substancesList;
                
                if (this.filteredSubstances.length === 0) {
                    container.innerHTML = '<div style="text-align: center; padding: 20px; color: #7f8c8d;"><p>No substances found.</p></div>';
                    return;
                }
                
                container.innerHTML = this.filteredSubstances.map(substance => `
                    <div class="substance-item" data-id="${substance.id}">
                        <div class="substance-name">${substance.name}</div>
                        <div class="substance-category category-${substance.category}">
                            ${this.formatCategory(substance.category)}
                        </div>
                        ${substance.chemical_formula ? `<div class="substance-formula">${substance.chemical_formula}</div>` : ''}
                        <div class="substance-description">
                            ${substance.description || 'No description available'}
                        </div>
                    </div>
                `).join('');
                
                container.querySelectorAll('.substance-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const id = parseInt(item.dataset.id);
                        this.selectSubstance(id);
                    });
                });
            }
            
            selectSubstance(id) {
                this.substancesList.querySelectorAll('.substance-item').forEach(item => {
                    item.classList.remove('selected');
                });
                
                const selectedItem = this.substancesList.querySelector(`[data-id="${id}"]`);
                if (selectedItem) {
                    selectedItem.classList.add('selected');
                }
                
                this.selectedSubstance = this.substances.find(s => s.id === id);
                if (this.selectedSubstance) {
                    this.displaySubstanceDetail(this.selectedSubstance);
                }
            }
            
            displaySubstanceDetail(substance) {
                const container = this.substanceDetail;
                
                const commonNames = substance.common_names || 'None listed';
                
                container.innerHTML = `
                    <div class="detail-section">
                        <h3><i class="fas fa-info-circle"></i> Basic Information</h3>
                        <div class="detail-info">
                            <div class="info-item"><div class="info-label">Primary Name</div><div class="info-value">${substance.name}</div></div>
                            <div class="info-item"><div class="info-label">Common Names</div><div class="info-value">${commonNames}</div></div>
                            <div class="info-item"><div class="info-label">Category</div><div class="info-value">${this.formatCategory(substance.category)}</div></div>
                            ${substance.chemical_formula ? `<div class="info-item"><div class="info-label">Chemical Formula</div><div class="info-value">${substance.chemical_formula}</div></div>` : ''}
                            ${substance.cas_number ? `<div class="info-item"><div class="info-label">CAS Number</div><div class="info-value">${substance.cas_number}</div></div>` : ''}
                            ${substance.half_life ? `<div class="info-item"><div class="info-label">Half-life</div><div class="info-value">${substance.half_life}</div></div>` : ''}
                            ${substance.detection_window ? `<div class="info-item"><div class="info-label">Detection Window</div><div class="info-value">${substance.detection_window}</div></div>` : ''}
                        </div>
                    </div>
                    
                    ${substance.description ? `
                    <div class="detail-section">
                        <h3><i class="fas fa-file-alt"></i> Description</h3>
                        <p>${substance.description}</p>
                    </div>
                    ` : ''}
                    
                    ${substance.mechanism_of_action ? `
                    <div class="detail-section">
                        <h3><i class="fas fa-cogs"></i> Mechanism of Action</h3>
                        <p>${substance.mechanism_of_action}</p>
                    </div>
                    ` : ''}
                    
                    <div class="detail-section">
                        <h3><i class="fas fa-chart-bar"></i> Reference Levels</h3>
                        <div class="dose-ranges">
                            ${this.renderDoseRange('Therapeutic Range', substance.therapeutic_dose_min, substance.therapeutic_dose_max, substance.dose_unit, 'therapeutic')}
                            ${substance.toxic_dose ? this.renderDoseRange('Toxic Level', substance.toxic_dose, null, substance.dose_unit, 'toxic') : ''}
                            ${substance.lethal_dose ? this.renderDoseRange('Lethal Level', substance.lethal_dose, null, substance.dose_unit, 'lethal') : ''}
                        </div>
                    </div>
                    
                    ${substance.metabolites && substance.metabolites.length > 0 ? `
                    <div class="detail-section">
                        <h3><i class="fas fa-sitemap"></i> Metabolites (${substance.metabolites.length})</h3>
                        <div class="metabolites-grid">
                            ${substance.metabolites.map(metabolite => this.renderMetabolite(metabolite)).join('')}
                        </div>
                    </div>
                    ` : ''}
                `;
            }
            
            renderDoseRange(label, min, max, unit, type) {
                let value;
                if (min !== null && max !== null) {
                    value = `${min} - ${max} ${unit}`;
                } else if (min !== null) {
                    value = `≥ ${min} ${unit}`;
                } else if (max !== null) {
                    value = `≤ ${max} ${unit}`;
                } else {
                    return '';
                }
                
                return `
                    <div class="dose-range dose-${type}">
                        <div class="dose-label">${label}</div>
                        <div class="dose-value">${value}</div>
                    </div>
                `;
            }
            
            renderMetabolite(metabolite) {
                return `
                    <div class="metabolite-card ${metabolite.is_active ? 'metabolite-active' : 'metabolite-inactive'}">
                        <div class="active-badge ${metabolite.is_active ? 'badge-active' : 'badge-inactive'}">
                            ${metabolite.is_active ? 'Active' : 'Inactive'}
                        </div>
                        <div class="metabolite-name">${metabolite.name}</div>
                        ${metabolite.chemical_formula ? `<div style="font-family: 'Courier New', monospace; color: #7f8c8d; margin-bottom: 10px;">${metabolite.chemical_formula}</div>` : ''}
                        ${metabolite.formation_pathway ? `<div style="margin: 10px 0;"><strong>Formation:</strong> ${metabolite.formation_pathway}</div>` : ''}
                        ${metabolite.detection_significance ? `<div style="margin: 10px 0;"><strong>Detection Significance:</strong> ${metabolite.detection_significance}</div>` : ''}
                    </div>
                `;
            }
            
            formatCategory(category) {
                const categoryMap = {
                    'pharmaceutical': 'Pharmaceutical',
                    'narcotic': 'Narcotic Stimulant',
                    'synthetic': 'Synthetic Drug'
                };
                return categoryMap[category] || category;
            }
            
            updateResultsCount() {
                const count = this.filteredSubstances.length;
                const text = count === 1 ? '1 substance found' : `${count} substances found`;
                this.resultsCount.textContent = text;
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            window.app = new ForensicToxicologyApp();
        });
    </script>
</body>
</html>'''
        
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write(html_content.encode())
    
    def handle_substances_api(self, query_params):
        """Handle substances API endpoint"""
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Build query based on filters
        query = "SELECT * FROM substances"
        where_conditions = []
        params = []
        
        if 'category' in query_params and query_params['category'][0]:
            where_conditions.append("category = ?")
            params.append(query_params['category'][0])
        
        if 'search' in query_params and query_params['search'][0]:
            search_term = f"%{query_params['search'][0]}%"
            where_conditions.append("(name LIKE ? OR common_names LIKE ? OR description LIKE ?)")
            params.extend([search_term, search_term, search_term])
        
        if where_conditions:
            query += " WHERE " + " AND ".join(where_conditions)
        
        cursor.execute(query, params)
        substances = cursor.fetchall()
        
        # Get metabolites for each substance
        result = []
        for substance in substances:
            substance_dict = dict(substance)
            
            # Get metabolites
            cursor.execute("SELECT * FROM metabolites WHERE substance_id = ?", (substance['id'],))
            metabolites = cursor.fetchall()
            substance_dict['metabolites'] = [dict(m) for m in metabolites]
            
            result.append(substance_dict)
        
        conn.close()
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(result).encode())
    
    def handle_substance_detail_api(self, substance_id):
        """Handle individual substance detail API"""
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM substances WHERE id = ?", (substance_id,))
        substance = cursor.fetchone()
        
        if not substance:
            self.send_error(404)
            return
        
        substance_dict = dict(substance)
        
        # Get metabolites
        cursor.execute("SELECT * FROM metabolites WHERE substance_id = ?", (substance_id,))
        metabolites = cursor.fetchall()
        substance_dict['metabolites'] = [dict(m) for m in metabolites]
        
        conn.close()
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(substance_dict).encode())
    
    def handle_categories_api(self):
        """Handle categories API"""
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute("SELECT DISTINCT category FROM substances")
        categories = [row[0] for row in cursor.fetchall()]
        
        conn.close()
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(categories).encode())
    
    def handle_dose_analysis_api(self):
        """Handle dose analysis API"""
        # This is a simplified version - in the full app it would be more sophisticated
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"message": "Dose analysis endpoint"}).encode())

def start_server():
    """Start the HTTP server"""
    init_database()
    
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, ForensicToxRequestHandler)
    
    print("Forensic Toxicology Database running at http://localhost:8000")
    print("Press Ctrl+C to stop the server")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped")
        httpd.server_close()

if __name__ == "__main__":
    start_server()