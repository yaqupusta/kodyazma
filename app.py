from flask import Flask, render_template, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import os
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'forensic-tox-app-2024')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///forensic_toxicology.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app)

# Database Models
class Substance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False, unique=True)
    common_names = db.Column(db.Text)  # JSON string of alternative names
    chemical_formula = db.Column(db.String(100))
    cas_number = db.Column(db.String(50))
    category = db.Column(db.String(100), nullable=False)  # pharmaceutical, narcotic, synthetic
    description = db.Column(db.Text)
    mechanism_of_action = db.Column(db.Text)
    therapeutic_dose_min = db.Column(db.Float)
    therapeutic_dose_max = db.Column(db.Float)
    toxic_dose = db.Column(db.Float)
    lethal_dose = db.Column(db.Float)
    dose_unit = db.Column(db.String(20), default='mg/L')
    half_life = db.Column(db.String(50))
    detection_window = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    metabolites = db.relationship('Metabolite', backref='parent_substance', lazy=True, cascade='all, delete-orphan')

class Metabolite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    substance_id = db.Column(db.Integer, db.ForeignKey('substance.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    chemical_formula = db.Column(db.String(100))
    is_active = db.Column(db.Boolean, default=False)
    formation_pathway = db.Column(db.Text)
    detection_significance = db.Column(db.Text)
    therapeutic_range_min = db.Column(db.Float)
    therapeutic_range_max = db.Column(db.Float)
    toxic_level = db.Column(db.Float)
    unit = db.Column(db.String(20), default='ng/mL')

# API Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/substances')
def get_substances():
    category = request.args.get('category')
    search = request.args.get('search')
    
    query = Substance.query
    
    if category:
        query = query.filter(Substance.category == category)
    
    if search:
        query = query.filter(
            Substance.name.contains(search) | 
            Substance.common_names.contains(search) |
            Substance.description.contains(search)
        )
    
    substances = query.all()
    
    return jsonify([{
        'id': s.id,
        'name': s.name,
        'common_names': s.common_names,
        'chemical_formula': s.chemical_formula,
        'cas_number': s.cas_number,
        'category': s.category,
        'description': s.description,
        'mechanism_of_action': s.mechanism_of_action,
        'therapeutic_dose_min': s.therapeutic_dose_min,
        'therapeutic_dose_max': s.therapeutic_dose_max,
        'toxic_dose': s.toxic_dose,
        'lethal_dose': s.lethal_dose,
        'dose_unit': s.dose_unit,
        'half_life': s.half_life,
        'detection_window': s.detection_window,
        'metabolites': [{
            'id': m.id,
            'name': m.name,
            'chemical_formula': m.chemical_formula,
            'is_active': m.is_active,
            'formation_pathway': m.formation_pathway,
            'detection_significance': m.detection_significance,
            'therapeutic_range_min': m.therapeutic_range_min,
            'therapeutic_range_max': m.therapeutic_range_max,
            'toxic_level': m.toxic_level,
            'unit': m.unit
        } for m in s.metabolites]
    } for s in substances])

@app.route('/api/substances/<int:substance_id>')
def get_substance_detail(substance_id):
    substance = Substance.query.get_or_404(substance_id)
    
    return jsonify({
        'id': substance.id,
        'name': substance.name,
        'common_names': substance.common_names,
        'chemical_formula': substance.chemical_formula,
        'cas_number': substance.cas_number,
        'category': substance.category,
        'description': substance.description,
        'mechanism_of_action': substance.mechanism_of_action,
        'therapeutic_dose_min': substance.therapeutic_dose_min,
        'therapeutic_dose_max': substance.therapeutic_dose_max,
        'toxic_dose': substance.toxic_dose,
        'lethal_dose': substance.lethal_dose,
        'dose_unit': substance.dose_unit,
        'half_life': substance.half_life,
        'detection_window': substance.detection_window,
        'metabolites': [{
            'id': m.id,
            'name': m.name,
            'chemical_formula': m.chemical_formula,
            'is_active': m.is_active,
            'formation_pathway': m.formation_pathway,
            'detection_significance': m.detection_significance,
            'therapeutic_range_min': m.therapeutic_range_min,
            'therapeutic_range_max': m.therapeutic_range_max,
            'toxic_level': m.toxic_level,
            'unit': m.unit
        } for m in substance.metabolites]
    })

@app.route('/api/categories')
def get_categories():
    categories = db.session.query(Substance.category).distinct().all()
    return jsonify([cat[0] for cat in categories])

@app.route('/api/dose-analysis', methods=['POST'])
def analyze_dose():
    data = request.get_json()
    substance_id = data.get('substance_id')
    measured_level = data.get('measured_level')
    
    substance = Substance.query.get_or_404(substance_id)
    
    analysis = {
        'substance_name': substance.name,
        'measured_level': measured_level,
        'unit': substance.dose_unit,
        'interpretation': 'Unknown'
    }
    
    if substance.therapeutic_dose_min and substance.therapeutic_dose_max:
        if measured_level < substance.therapeutic_dose_min:
            analysis['interpretation'] = 'Sub-therapeutic'
        elif measured_level <= substance.therapeutic_dose_max:
            analysis['interpretation'] = 'Therapeutic range'
        elif substance.toxic_dose and measured_level < substance.toxic_dose:
            analysis['interpretation'] = 'Above therapeutic, potentially toxic'
        elif substance.toxic_dose and measured_level >= substance.toxic_dose:
            if substance.lethal_dose and measured_level >= substance.lethal_dose:
                analysis['interpretation'] = 'Potentially lethal'
            else:
                analysis['interpretation'] = 'Toxic range'
    
    return jsonify(analysis)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)