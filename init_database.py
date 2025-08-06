#!/usr/bin/env python3
"""
Forensic Toxicology Database Initialization Script

This script populates the database with comprehensive information about:
- Pharmaceutical ingredients
- Narcotic stimulants  
- Synthetic drugs
- Their metabolites and reference values

Data sources: Clinical toxicology references, forensic guidelines, and pharmacological databases
"""

from app import app, db, Substance, Metabolite
import json

def init_database():
    """Initialize the database with comprehensive forensic toxicology data"""
    
    with app.app_context():
        # Drop and recreate all tables
        db.drop_all()
        db.create_all()
        
        # Pharmaceutical substances
        pharmaceuticals = [
            {
                'name': 'Acetaminophen',
                'common_names': 'Paracetamol, Tylenol, APAP',
                'chemical_formula': 'C8H9NO2',
                'cas_number': '103-90-2',
                'category': 'pharmaceutical',
                'description': 'Widely used analgesic and antipyretic drug. Common cause of overdose-related liver toxicity.',
                'mechanism_of_action': 'Inhibits COX enzymes in the CNS, reducing prostaglandin synthesis. Hepatotoxicity occurs through NAPQI formation.',
                'therapeutic_dose_min': 10.0,
                'therapeutic_dose_max': 20.0,
                'toxic_dose': 150.0,
                'lethal_dose': 300.0,
                'dose_unit': 'mg/L',
                'half_life': '1-4 hours',
                'detection_window': 'Urine: 1-3 days, Blood: 4-8 hours',
                'metabolites': [
                    {
                        'name': 'Acetaminophen Glucuronide',
                        'chemical_formula': 'C14H17NO8',
                        'is_active': False,
                        'formation_pathway': 'Phase II glucuronidation by UGT1A1, UGT1A6, UGT1A9',
                        'detection_significance': 'Major metabolite, represents 50-60% of dose',
                        'therapeutic_range_min': 50.0,
                        'therapeutic_range_max': 200.0,
                        'unit': 'mg/L'
                    },
                    {
                        'name': 'Acetaminophen Sulfate',
                        'chemical_formula': 'C8H9NO5S',
                        'is_active': False,
                        'formation_pathway': 'Sulfation by SULT1A1 and SULT1A3',
                        'detection_significance': 'Secondary metabolite, 20-30% of dose',
                        'therapeutic_range_min': 20.0,
                        'therapeutic_range_max': 80.0,
                        'unit': 'mg/L'
                    },
                    {
                        'name': 'N-Acetyl-p-benzoquinone imine (NAPQI)',
                        'chemical_formula': 'C8H7NO2',
                        'is_active': True,
                        'formation_pathway': 'CYP2E1, CYP1A2 oxidation',
                        'detection_significance': 'Toxic metabolite responsible for hepatotoxicity',
                        'toxic_level': 5.0,
                        'unit': 'µg/L'
                    }
                ]
            },
            {
                'name': 'Diazepam',
                'common_names': 'Valium, Diastat',
                'chemical_formula': 'C16H13ClN2O',
                'cas_number': '439-14-5',
                'category': 'pharmaceutical',
                'description': 'Benzodiazepine anxiolytic and anticonvulsant. Commonly detected in forensic cases.',
                'mechanism_of_action': 'Enhances GABA-A receptor activity, causing CNS depression.',
                'therapeutic_dose_min': 0.1,
                'therapeutic_dose_max': 2.5,
                'toxic_dose': 5.0,
                'lethal_dose': 50.0,
                'dose_unit': 'mg/L',
                'half_life': '20-100 hours',
                'detection_window': 'Urine: 3-6 weeks, Blood: 2-7 days',
                'metabolites': [
                    {
                        'name': 'Desmethyldiazepam',
                        'chemical_formula': 'C15H11ClN2O',
                        'is_active': True,
                        'formation_pathway': 'CYP2C19 and CYP3A4 N-demethylation',
                        'detection_significance': 'Major active metabolite with long half-life',
                        'therapeutic_range_min': 0.1,
                        'therapeutic_range_max': 1.5,
                        'toxic_level': 3.0,
                        'unit': 'mg/L'
                    },
                    {
                        'name': 'Temazepam',
                        'chemical_formula': 'C16H13ClN2O2',
                        'is_active': True,
                        'formation_pathway': '3-hydroxylation by CYP3A4',
                        'detection_significance': 'Active metabolite, shorter half-life than parent',
                        'therapeutic_range_min': 0.02,
                        'therapeutic_range_max': 0.5,
                        'unit': 'mg/L'
                    },
                    {
                        'name': 'Oxazepam',
                        'chemical_formula': 'C15H11ClN2O2',
                        'is_active': True,
                        'formation_pathway': 'Further metabolism of temazepam',
                        'detection_significance': 'Final active metabolite before glucuronidation',
                        'therapeutic_range_min': 0.2,
                        'therapeutic_range_max': 1.5,
                        'unit': 'mg/L'
                    }
                ]
            },
            {
                'name': 'Morphine',
                'common_names': 'MS Contin, Roxanol, Avinza',
                'chemical_formula': 'C17H19NO3',
                'cas_number': '57-27-2',
                'category': 'pharmaceutical',
                'description': 'Opioid analgesic derived from opium. Gold standard for severe pain management.',
                'mechanism_of_action': 'Mu-opioid receptor agonist causing analgesia and respiratory depression.',
                'therapeutic_dose_min': 0.01,
                'therapeutic_dose_max': 0.1,
                'toxic_dose': 0.2,
                'lethal_dose': 0.5,
                'dose_unit': 'mg/L',
                'half_life': '2-4 hours',
                'detection_window': 'Urine: 2-3 days, Blood: 6-12 hours',
                'metabolites': [
                    {
                        'name': 'Morphine-3-glucuronide',
                        'chemical_formula': 'C23H27NO9',
                        'is_active': False,
                        'formation_pathway': 'UGT2B7 glucuronidation at 3-position',
                        'detection_significance': 'Major metabolite (50-70%), no analgesic activity',
                        'therapeutic_range_min': 0.1,
                        'therapeutic_range_max': 2.0,
                        'unit': 'mg/L'
                    },
                    {
                        'name': 'Morphine-6-glucuronide',
                        'chemical_formula': 'C23H27NO9',
                        'is_active': True,
                        'formation_pathway': 'UGT2B7 glucuronidation at 6-position',
                        'detection_significance': 'Active metabolite with greater potency than morphine',
                        'therapeutic_range_min': 0.02,
                        'therapeutic_range_max': 0.3,
                        'toxic_level': 0.5,
                        'unit': 'mg/L'
                    }
                ]
            },
            {
                'name': 'Digoxin',
                'common_names': 'Lanoxin, Digitek',
                'chemical_formula': 'C41H64O14',
                'cas_number': '20830-75-5',
                'category': 'pharmaceutical',
                'description': 'Cardiac glycoside used for heart failure and atrial fibrillation. Narrow therapeutic window.',
                'mechanism_of_action': 'Inhibits Na+/K+-ATPase pump, increasing intracellular calcium and contractility.',
                'therapeutic_dose_min': 0.8,
                'therapeutic_dose_max': 2.0,
                'toxic_dose': 2.5,
                'lethal_dose': 10.0,
                'dose_unit': 'µg/L',
                'half_life': '36-48 hours',
                'detection_window': 'Urine: 5-7 days, Blood: 7-10 days',
                'metabolites': [
                    {
                        'name': 'Digoxigenin',
                        'chemical_formula': 'C23H34O5',
                        'is_active': True,
                        'formation_pathway': 'Hydrolysis of digitoxose sugars',
                        'detection_significance': 'Active aglycone, maintains cardiotoxic properties',
                        'toxic_level': 5.0,
                        'unit': 'µg/L'
                    }
                ]
            }
        ]
        
        # Narcotic stimulants
        narcotics = [
            {
                'name': 'Cocaine',
                'common_names': 'Coke, Crack, Snow, Blow',
                'chemical_formula': 'C17H21NO4',
                'cas_number': '50-36-2',
                'category': 'narcotic',
                'description': 'Powerful stimulant derived from coca plant. Blocks sodium channels and dopamine reuptake.',
                'mechanism_of_action': 'Blocks dopamine, norepinephrine, and serotonin reuptake transporters.',
                'therapeutic_dose_min': None,
                'therapeutic_dose_max': None,
                'toxic_dose': 0.5,
                'lethal_dose': 5.0,
                'dose_unit': 'mg/L',
                'half_life': '0.5-1.5 hours',
                'detection_window': 'Urine: 2-4 days, Blood: 12-24 hours',
                'metabolites': [
                    {
                        'name': 'Benzoylecgonine',
                        'chemical_formula': 'C16H19NO4',
                        'is_active': False,
                        'formation_pathway': 'Hydrolysis by plasma and liver esterases',
                        'detection_significance': 'Major urinary metabolite, extends detection window',
                        'toxic_level': 2.0,
                        'unit': 'mg/L'
                    },
                    {
                        'name': 'Ecgonine methyl ester',
                        'chemical_formula': 'C10H17NO3',
                        'is_active': False,
                        'formation_pathway': 'Hydrolysis by liver carboxylesterases',
                        'detection_significance': 'Secondary metabolite, shorter half-life',
                        'unit': 'mg/L'
                    },
                    {
                        'name': 'Cocaethylene',
                        'chemical_formula': 'C18H23NO4',
                        'is_active': True,
                        'formation_pathway': 'Transesterification in presence of ethanol',
                        'detection_significance': 'Active metabolite when cocaine used with alcohol',
                        'toxic_level': 0.2,
                        'unit': 'mg/L'
                    }
                ]
            },
            {
                'name': 'Methamphetamine',
                'common_names': 'Meth, Crystal, Ice, Glass',
                'chemical_formula': 'C10H15N',
                'cas_number': '537-46-2',
                'category': 'narcotic',
                'description': 'Potent CNS stimulant with high abuse potential. Neurotoxic effects on dopamine system.',
                'mechanism_of_action': 'Reverses dopamine and norepinephrine transporters, depletes vesicular stores.',
                'therapeutic_dose_min': None,
                'therapeutic_dose_max': None,
                'toxic_dose': 0.2,
                'lethal_dose': 3.0,
                'dose_unit': 'mg/L',
                'half_life': '10-12 hours',
                'detection_window': 'Urine: 3-5 days, Blood: 24-48 hours',
                'metabolites': [
                    {
                        'name': 'Amphetamine',
                        'chemical_formula': 'C9H13N',
                        'is_active': True,
                        'formation_pathway': 'CYP2D6 N-demethylation',
                        'detection_significance': 'Major active metabolite with similar effects',
                        'toxic_level': 0.2,
                        'unit': 'mg/L'
                    },
                    {
                        'name': '4-Hydroxymethamphetamine',
                        'chemical_formula': 'C10H15NO',
                        'is_active': True,
                        'formation_pathway': 'CYP2D6 aromatic hydroxylation',
                        'detection_significance': 'Minor metabolite, retains some activity',
                        'unit': 'mg/L'
                    }
                ]
            },
            {
                'name': 'Heroin',
                'common_names': 'Diacetylmorphine, Smack, H, Junk',
                'chemical_formula': 'C21H23NO5',
                'cas_number': '561-27-3',
                'category': 'narcotic',
                'description': 'Semi-synthetic opioid with rapid onset. Rapidly metabolized to morphine.',
                'mechanism_of_action': 'Prodrug rapidly converted to 6-MAM and morphine, acting on opioid receptors.',
                'therapeutic_dose_min': None,
                'therapeutic_dose_max': None,
                'toxic_dose': 0.05,
                'lethal_dose': 0.2,
                'dose_unit': 'mg/L',
                'half_life': '2-6 minutes',
                'detection_window': 'Urine: 1-3 days, Blood: 30 minutes',
                'metabolites': [
                    {
                        'name': '6-Monoacetylmorphine',
                        'chemical_formula': 'C19H21NO4',
                        'is_active': True,
                        'formation_pathway': 'Rapid deacetylation by plasma esterases',
                        'detection_significance': 'Specific heroin marker, proves heroin use',
                        'toxic_level': 0.02,
                        'unit': 'mg/L'
                    },
                    {
                        'name': 'Morphine',
                        'chemical_formula': 'C17H19NO3',
                        'is_active': True,
                        'formation_pathway': 'Further deacetylation of 6-MAM',
                        'detection_significance': 'Final metabolite, same as pharmaceutical morphine',
                        'toxic_level': 0.2,
                        'unit': 'mg/L'
                    }
                ]
            }
        ]
        
        # Synthetic drugs
        synthetics = [
            {
                'name': 'MDMA',
                'common_names': 'Ecstasy, Molly, E, X',
                'chemical_formula': 'C11H15NO2',
                'cas_number': '42542-10-9',
                'category': 'synthetic',
                'description': 'Empathogenic stimulant with serotonergic and dopaminergic effects. Popular club drug.',
                'mechanism_of_action': 'Reverses serotonin, dopamine, and norepinephrine transporters; releases stored neurotransmitters.',
                'therapeutic_dose_min': None,
                'therapeutic_dose_max': None,
                'toxic_dose': 0.5,
                'lethal_dose': 2.0,
                'dose_unit': 'mg/L',
                'half_life': '6-8 hours',
                'detection_window': 'Urine: 3-4 days, Blood: 24 hours',
                'metabolites': [
                    {
                        'name': 'MDA',
                        'chemical_formula': 'C10H13NO2',
                        'is_active': True,
                        'formation_pathway': 'CYP2D6 N-demethylation',
                        'detection_significance': 'Active metabolite with hallucinogenic properties',
                        'toxic_level': 0.3,
                        'unit': 'mg/L'
                    },
                    {
                        'name': 'HMMA',
                        'chemical_formula': 'C10H13NO3',
                        'is_active': False,
                        'formation_pathway': 'O-demethylation followed by methylation',
                        'detection_significance': 'Major urinary metabolite',
                        'unit': 'mg/L'
                    }
                ]
            },
            {
                'name': 'LSD',
                'common_names': 'Acid, Tabs, Lucy, Doses',
                'chemical_formula': 'C20H25N3O',
                'cas_number': '50-37-3',
                'category': 'synthetic',
                'description': 'Potent hallucinogen with extremely low active doses. Ergot alkaloid derivative.',
                'mechanism_of_action': 'Partial agonist at 5-HT2A receptors, causing visual and auditory hallucinations.',
                'therapeutic_dose_min': None,
                'therapeutic_dose_max': None,
                'toxic_dose': 0.001,
                'lethal_dose': 0.01,
                'dose_unit': 'mg/L',
                'half_life': '3-5 hours',
                'detection_window': 'Urine: 1-3 days, Blood: 6-12 hours',
                'metabolites': [
                    {
                        'name': '2-Oxo-3-hydroxy-LSD',
                        'chemical_formula': 'C20H23N3O2',
                        'is_active': False,
                        'formation_pathway': 'Hepatic metabolism',
                        'detection_significance': 'Major metabolite for detection',
                        'unit': 'µg/L'
                    }
                ]
            },
            {
                'name': 'Fentanyl',
                'common_names': 'Apache, China Girl, Dance Fever',
                'chemical_formula': 'C22H28N2O',
                'cas_number': '437-38-7',
                'category': 'synthetic',
                'description': 'Extremely potent synthetic opioid. 50-100x more potent than morphine. Major overdose risk.',
                'mechanism_of_action': 'High-affinity mu-opioid receptor agonist with rapid onset and short duration.',
                'therapeutic_dose_min': 0.001,
                'therapeutic_dose_max': 0.01,
                'toxic_dose': 0.01,
                'lethal_dose': 0.02,
                'dose_unit': 'mg/L',
                'half_life': '3-7 hours',
                'detection_window': 'Urine: 1-3 days, Blood: 8-24 hours',
                'metabolites': [
                    {
                        'name': 'Norfentanyl',
                        'chemical_formula': 'C14H18N2O',
                        'is_active': True,
                        'formation_pathway': 'CYP3A4 N-dealkylation',
                        'detection_significance': 'Major metabolite, less potent than parent',
                        'toxic_level': 0.005,
                        'unit': 'mg/L'
                    }
                ]
            },
            {
                'name': 'Synthetic Cannabinoid JWH-018',
                'common_names': 'Spice, K2, Synthetic Marijuana',
                'chemical_formula': 'C24H23NO',
                'cas_number': '209414-07-3',
                'category': 'synthetic',
                'description': 'Synthetic cannabinoid receptor agonist. More potent and dangerous than THC.',
                'mechanism_of_action': 'Full agonist at CB1 and CB2 receptors, unlike partial agonist THC.',
                'therapeutic_dose_min': None,
                'therapeutic_dose_max': None,
                'toxic_dose': 0.01,
                'lethal_dose': 0.1,
                'dose_unit': 'mg/L',
                'half_life': '1-3 hours',
                'detection_window': 'Urine: 1-2 days, Blood: 2-6 hours',
                'metabolites': [
                    {
                        'name': 'JWH-018 N-pentanoic acid',
                        'chemical_formula': 'C24H21NO3',
                        'is_active': False,
                        'formation_pathway': 'Oxidative metabolism of pentyl chain',
                        'detection_significance': 'Primary urinary metabolite for detection',
                        'unit': 'µg/L'
                    }
                ]
            },
            {
                'name': 'Cathinone',
                'common_names': 'Bath Salts, Plant Food, Khat',
                'chemical_formula': 'C9H11NO',
                'cas_number': '71031-15-7',
                'category': 'synthetic',
                'description': 'Stimulant found in khat plant. Parent compound of many synthetic cathinones.',
                'mechanism_of_action': 'Blocks dopamine and norepinephrine reuptake, similar to amphetamines.',
                'therapeutic_dose_min': None,
                'therapeutic_dose_max': None,
                'toxic_dose': 0.1,
                'lethal_dose': 1.0,
                'dose_unit': 'mg/L',
                'half_life': '1.5-3 hours',
                'detection_window': 'Urine: 1-3 days, Blood: 4-8 hours',
                'metabolites': [
                    {
                        'name': 'Norephedrine',
                        'chemical_formula': 'C9H13NO',
                        'is_active': True,
                        'formation_pathway': 'Reduction of ketone group',
                        'detection_significance': 'Active metabolite with stimulant properties',
                        'unit': 'mg/L'
                    }
                ]
            }
        ]
        
        # Combine all substances
        all_substances = pharmaceuticals + narcotics + synthetics
        
        # Add substances to database
        for substance_data in all_substances:
            metabolites_data = substance_data.pop('metabolites', [])
            
            substance = Substance(**substance_data)
            db.session.add(substance)
            db.session.flush()  # Get the ID
            
            # Add metabolites
            for metabolite_data in metabolites_data:
                metabolite_data['substance_id'] = substance.id
                metabolite = Metabolite(**metabolite_data)
                db.session.add(metabolite)
        
        db.session.commit()
        print(f"Successfully initialized database with {len(all_substances)} substances")

if __name__ == "__main__":
    init_database()