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
        this.doseModal = document.getElementById('doseModal');
        this.measuredLevel = document.getElementById('measuredLevel');
        this.analyzeDose = document.getElementById('analyzeDose');
        this.analysisResult = document.getElementById('analysisResult');
        this.doseUnit = document.getElementById('doseUnit');
    }
    
    bindEvents() {
        this.searchInput.addEventListener('input', () => this.handleSearch());
        this.categoryFilter.addEventListener('change', () => this.handleCategoryFilter());
        this.clearFilters.addEventListener('click', () => this.clearAllFilters());
        this.analyzeDose.addEventListener('click', () => this.performDoseAnalysis());
        
        // Modal events
        const closeModal = document.querySelector('.close');
        closeModal.addEventListener('click', () => this.closeDoseModal());
        
        window.addEventListener('click', (event) => {
            if (event.target === this.doseModal) {
                this.closeDoseModal();
            }
        });
        
        // Enter key support for dose analysis
        this.measuredLevel.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.performDoseAnalysis();
            }
        });
    }
    
    async loadSubstances() {
        try {
            this.showLoading();
            const response = await fetch('/api/substances');
            this.substances = await response.json();
            this.filteredSubstances = [...this.substances];
            this.displaySubstances();
            this.updateResultsCount();
        } catch (error) {
            console.error('Error loading substances:', error);
            this.showError('Failed to load substances');
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
                (substance.description && substance.description.toLowerCase().includes(this.currentSearch)) ||
                (substance.chemical_formula && substance.chemical_formula.toLowerCase().includes(this.currentSearch));
            
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
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search" style="font-size: 2em; color: #bdc3c7; margin-bottom: 15px;"></i>
                    <p>No substances found matching your criteria.</p>
                </div>
            `;
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
        
        // Add click event listeners
        container.querySelectorAll('.substance-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                this.selectSubstance(id);
            });
        });
    }
    
    selectSubstance(id) {
        // Update visual selection
        this.substancesList.querySelectorAll('.substance-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        const selectedItem = this.substancesList.querySelector(`[data-id="${id}"]`);
        if (selectedItem) {
            selectedItem.classList.add('selected');
        }
        
        // Find and display substance details
        this.selectedSubstance = this.substances.find(s => s.id === id);
        if (this.selectedSubstance) {
            this.displaySubstanceDetail(this.selectedSubstance);
        }
    }
    
    displaySubstanceDetail(substance) {
        const container = this.substanceDetail;
        
        const commonNames = substance.common_names ? 
            substance.common_names.split(',').map(name => name.trim()).join(', ') : 
            'None listed';
        
        container.innerHTML = `
            <div class="detail-section">
                <h3><i class="fas fa-info-circle"></i> Basic Information</h3>
                <div class="detail-info">
                    <div class="info-item">
                        <div class="info-label">Primary Name</div>
                        <div class="info-value">${substance.name}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Common Names</div>
                        <div class="info-value">${commonNames}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Category</div>
                        <div class="info-value">${this.formatCategory(substance.category)}</div>
                    </div>
                    ${substance.chemical_formula ? `
                    <div class="info-item">
                        <div class="info-label">Chemical Formula</div>
                        <div class="info-value">${substance.chemical_formula}</div>
                    </div>
                    ` : ''}
                    ${substance.cas_number ? `
                    <div class="info-item">
                        <div class="info-label">CAS Number</div>
                        <div class="info-value">${substance.cas_number}</div>
                    </div>
                    ` : ''}
                    ${substance.half_life ? `
                    <div class="info-item">
                        <div class="info-label">Half-life</div>
                        <div class="info-value">${substance.half_life}</div>
                    </div>
                    ` : ''}
                    ${substance.detection_window ? `
                    <div class="info-item">
                        <div class="info-label">Detection Window</div>
                        <div class="info-value">${substance.detection_window}</div>
                    </div>
                    ` : ''}
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
                    ${this.renderDoseRange('Therapeutic Range', 
                        substance.therapeutic_dose_min, 
                        substance.therapeutic_dose_max, 
                        substance.dose_unit, 
                        'therapeutic')}
                    ${substance.toxic_dose ? this.renderDoseRange('Toxic Level', 
                        substance.toxic_dose, 
                        null, 
                        substance.dose_unit, 
                        'toxic') : ''}
                    ${substance.lethal_dose ? this.renderDoseRange('Lethal Level', 
                        substance.lethal_dose, 
                        null, 
                        substance.dose_unit, 
                        'lethal') : ''}
                </div>
                <button class="analyze-dose-btn" onclick="app.openDoseModal()">
                    <i class="fas fa-calculator"></i> Analyze Measured Level
                </button>
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
                ${metabolite.chemical_formula ? `<div class="metabolite-formula">${metabolite.chemical_formula}</div>` : ''}
                ${metabolite.formation_pathway ? `
                    <div style="margin: 10px 0;">
                        <strong>Formation:</strong> ${metabolite.formation_pathway}
                    </div>
                ` : ''}
                ${metabolite.detection_significance ? `
                    <div style="margin: 10px 0;">
                        <strong>Detection Significance:</strong> ${metabolite.detection_significance}
                    </div>
                ` : ''}
                ${metabolite.therapeutic_range_min || metabolite.therapeutic_range_max || metabolite.toxic_level ? `
                    <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e0e6ed;">
                        <strong>Reference Levels (${metabolite.unit}):</strong>
                        ${metabolite.therapeutic_range_min && metabolite.therapeutic_range_max ? 
                            `<br>Therapeutic: ${metabolite.therapeutic_range_min} - ${metabolite.therapeutic_range_max}` : ''}
                        ${metabolite.toxic_level ? `<br>Toxic: ≥ ${metabolite.toxic_level}` : ''}
                    </div>
                ` : ''}
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
    
    openDoseModal() {
        if (!this.selectedSubstance) return;
        
        this.doseUnit.textContent = this.selectedSubstance.dose_unit || 'mg/L';
        this.measuredLevel.value = '';
        this.analysisResult.style.display = 'none';
        this.doseModal.style.display = 'block';
        this.measuredLevel.focus();
    }
    
    closeDoseModal() {
        this.doseModal.style.display = 'none';
    }
    
    async performDoseAnalysis() {
        if (!this.selectedSubstance || !this.measuredLevel.value) return;
        
        const level = parseFloat(this.measuredLevel.value);
        if (isNaN(level) || level < 0) {
            this.showAnalysisResult('Please enter a valid positive number', 'error');
            return;
        }
        
        try {
            const response = await fetch('/api/dose-analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    substance_id: this.selectedSubstance.id,
                    measured_level: level
                })
            });
            
            const analysis = await response.json();
            this.showAnalysisResult(analysis);
        } catch (error) {
            console.error('Error analyzing dose:', error);
            this.showAnalysisResult('Error performing analysis', 'error');
        }
    }
    
    showAnalysisResult(analysis, type = null) {
        const result = this.analysisResult;
        
        if (type === 'error') {
            result.innerHTML = `<div style="color: #e74c3c;"><strong>Error:</strong> ${analysis}</div>`;
            result.className = 'analysis-result';
        } else {
            const interpretationClass = this.getInterpretationClass(analysis.interpretation);
            result.className = `analysis-result ${interpretationClass}`;
            result.innerHTML = `
                <div>
                    <strong>Substance:</strong> ${analysis.substance_name}<br>
                    <strong>Measured Level:</strong> ${analysis.measured_level} ${analysis.unit}<br>
                    <strong>Interpretation:</strong> <span style="font-weight: 600;">${analysis.interpretation}</span>
                </div>
            `;
        }
        
        result.style.display = 'block';
    }
    
    getInterpretationClass(interpretation) {
        const lower = interpretation.toLowerCase();
        if (lower.includes('sub-therapeutic')) return 'result-sub-therapeutic';
        if (lower.includes('therapeutic')) return 'result-therapeutic';
        if (lower.includes('lethal')) return 'result-lethal';
        if (lower.includes('toxic')) return 'result-toxic';
        return 'result-therapeutic';
    }
    
    showLoading() {
        this.substancesList.innerHTML = '<div class="loading">Loading substances...</div>';
    }
    
    showError(message) {
        this.substancesList.innerHTML = `
            <div style="text-align: center; color: #e74c3c; padding: 20px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2em; margin-bottom: 15px;"></i>
                <p>${message}</p>
            </div>
        `;
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ForensicToxicologyApp();
});