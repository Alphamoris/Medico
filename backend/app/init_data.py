from datetime import datetime
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Medicine,Author,Comment,Post,DoctorModel

medidcine_data = [
    (1, 'Paracetamol', 5.99, 'general', 500, 'Over-the-counter pain and fever reducer', '500mg, 1-2 tablets every 4-6 hours', False, 4.5, 1234, 10, '2025-12-31', 'HealthCare Pharma'),
    (2, 'Ibuprofen', 7.5, 'general', 450, 'Non-steroidal anti-inflammatory drug for pain relief', '400mg, 1 tablet every 6 hours', False, 4.3, 987, 5, '2025-11-15', 'MedPlus Solutions'),
    (3, 'Multivitamin Complex', 15.99, 'general', 300, 'Daily nutritional supplement with essential vitamins', '1 tablet daily after meal', False, 4.7, 2345, 15, '2026-06-30', 'Vitality Wellness'),
    (4, 'Diclofenac Sodium', 12.75, 'orthopedic', 250, 'Pain relief and anti-inflammatory for joint and muscle pain', '50mg, 2-3 times daily', True, 4.2, 567, 8, '2025-09-22', 'OrthoMed Pharmaceuticals'),
    (5, 'Calcium Supplement', 18.5, 'orthopedic', 400, 'Bone health and calcium fortification', '1000mg daily', False, 4.6, 1876, 12, '2026-03-15', 'BoneStrong Labs'),
    (6, 'Glucosamine Chondroitin', 25.99, 'orthopedic', 200, 'Joint health supplement for mobility', '1500mg daily', False, 4.4, 1123, 20, '2026-01-30', 'JointCare Innovations'),
    (7, 'Tramadol', 22.75, 'orthopedic', 150, 'Prescription pain medication for moderate to severe pain', '50mg, up to 4 times daily', True, 4, 345, 5, '2025-07-18', 'PainRelief Pharma'),
    (8, 'Atorvastatin', 35.5, 'cardiology', 300, 'Cholesterol-lowering medication', '20mg once daily', True, 4.5, 789, 15, '2025-10-25', 'CardioHealth Solutions'),
    (9, 'Aspirin', 6.99, 'cardiology', 500, 'Blood thinner and heart health supplement', '81mg daily', False, 4.6, 2567, 5, '2026-05-15', 'HeartGuard Pharmaceuticals'),
    (10, 'Metoprolol', 18.25, 'cardiology', 200, 'Beta-blocker for blood pressure management', '50mg twice daily', True, 4.3, 456, 10, '2025-08-30', 'CircuCare Medical'),
    (11, 'Lisinopril', 22.99, 'cardiology', 250, 'ACE inhibitor for hypertension treatment', '10mg once daily', True, 4.4, 612, 8, '2025-12-10', 'CardioVasc Pharma'),
    (12, 'Omeprazole', 14.5, 'general', 350, 'Acid reflux and heartburn relief', '20mg daily', False, 4.5, 1456, 12, '2026-02-28', 'DigestWell Laboratories'),
    (13, 'Losartan', 26.75, 'cardiology', 180, 'Medication for high blood pressure', '50mg once daily', True, 4.2, 534, 15, '2025-11-05', 'CardioMed Innovations'),
    (14, 'Prednisone', 16.99, 'orthopedic', 220, 'Corticosteroid for inflammation and immune system disorders', '5-10mg daily', True, 4.1, 389, 5, '2025-09-15', 'ImmunoHealth Pharma'),
    (15, 'Gabapentin', 30.25, 'orthopedic', 190, 'Nerve pain and epilepsy medication', '300mg three times daily', True, 4.3, 476, 10, '2025-10-20', 'NeuroCare Solutions'),
    (16, 'Crocin', 45.5, 'general', 600, 'Trusted painkiller and fever reducer', '500mg, 1-2 tablets every 4-6 hours', False, 4.6, 3245, 10, '2025-11-30', 'GlaxoSmithKline'),
    (17, 'Digene', 35.75, 'general', 450, 'Antacid for quick relief from acidity and indigestion', '1-2 tablets after meals', False, 4.4, 2567, 5, '2025-09-15', 'Pfizer'),
    (18, 'Sporlac', 120.99, 'general', 300, 'Probiotic for gut health and digestive issues', '1 capsule twice daily', False, 4.5, 1876, 15, '2026-03-25', 'Systopic Laboratories'),
    (19, 'Volini', 89.5, 'orthopedic', 250, 'Pain relief spray for muscle and joint pain', 'Apply 2-3 times daily on affected area', False, 4.3, 1234, 12, '2025-10-20', 'Himalaya Wellness'),
    (20, 'Shelcal', 175.25, 'orthopedic', 400, 'Calcium supplement for bone health', '1 tablet daily', False, 4.7, 2345, 20, '2026-05-30', 'Sun Pharmaceutical'),
    (21, 'Combiflam', 65.99, 'orthopedic', 350, 'Combination pain relief and anti-inflammatory', '1 tablet every 6-8 hours', False, 4.5, 1876, 8, '2025-12-10', 'Sanofi India'),
    (22, 'Zolmist', 250.75, 'orthopedic', 150, 'Muscle relaxant for chronic pain', '1 tablet twice daily', True, 4.2, 567, 5, '2025-08-15', 'Zydus Cadila'),
    (23, 'Ecosprin', 45.25, 'cardiology', 500, 'Cardiac aspirin for heart health', '75mg once daily', False, 4.6, 2789, 10, '2026-02-28', 'USV Pvt Ltd'),
    (24, 'Telma', 180.5, 'cardiology', 200, 'Blood pressure management medication', '40mg once daily', True, 4.4, 1123, 15, '2025-11-05', 'Glenmark Pharmaceuticals'),
    (25, 'Vertin', 95.99, 'cardiology', 180, 'Medication for vertigo and balance disorders', '16mg twice daily', True, 4.3, 678, 12, '2025-09-22', 'Elder Pharmaceuticals'),
    (26, 'Syndopa', 125.75, 'cardiology', 220, 'Medication for Parkinsons disease', '250mg three times daily', True, 4.1, 345, 5, '2025-07-18', 'Sun Pharmaceutical'),
    (27, 'Asthalin', 75.25, 'general', 300, 'Bronchodilator for asthma and respiratory issues', '2 puffs every 4-6 hours', False, 4.5, 1567, 10, '2025-10-15', 'Cipla'),
    (28, 'Azithral', 120.5, 'general', 250, 'Antibiotic for various bacterial infections', '500mg once daily for 3 days', True, 4.4, 1234, 15, '2025-12-05', 'Alkem Laboratories'),
    (29, 'Becosules', 85.99, 'general', 400, 'Multivitamin and mineral supplement', '1 capsule daily', False, 4.6, 2345, 8, '2026-04-30', 'Pfizer'),
    (30, 'Coldact', 65.75, 'general', 350, 'Cold and flu relief tablets', '1 tablet every 4-6 hours', False, 4.3, 987, 12, '2025-11-20', 'Mankind Pharma')
]

authors_data = [
    ('dr_sarah', 'Dr. Sarah Johnson', '/logo.ico', 'Nutritionist', True),
    ('coach_mike', 'Coach Mike', '/logo.ico', 'Fitness Expert', True),
    ('health_guru', 'Dr. David Lee', '/logo.ico', 'Wellness Expert', True),
    ('fitness_pro', 'Jessica Smith', '/logo.ico', 'Personal Trainer', True),
    ('dr_emily', 'Dr. Emily Chen', '/logo.ico', 'Sports Medicine', True)
]

comments_data = [
    ('comment_1', 'fitness_pro', 'This HIIT workout looks intense but effective! I\'ll definitely try it with my clients.', '2024-02-10 13:00:00', 15, 'post_2'),
    ('comment_2', 'dr_emily', 'Important reminder to warm up properly before attempting any HIIT workout to prevent injury.', '2024-02-10 13:30:00', 25, 'post_2'),
    ('comment_3', 'health_guru', 'Great insights on Mediterranean diet! The research is very promising.', '2024-02-10 14:30:00', 20, 'post_1'),
    ('comment_4', 'coach_mike', 'Excellent points about strength training. I\'ve seen similar results with my clients.', '2024-02-10 07:00:00', 18, 'post_5'),
    ('comment_5', 'dr_sarah', 'The connection between mindful eating and digestion is fascinating. Great article!', '2024-02-10 09:30:00', 22, 'post_4')
]

post_data = [
    ('post_1', 'dr_sarah', 'New research reveals the Mediterranean diet\'s power to boost heart health and brain function. Key benefits include lower risk of heart disease, improved cholesterol, and enhanced cognitive abilities. To adopt this lifestyle, prioritize plant-based foods, healthy fats, and limit processed foods.', '2024-02-10 14:00:00', 245, False, 18, 'Nutrition,Research,Heart Health', '3 min read', True, '/logo.ico', '2024-02-10 15:00:00'),
    ('post_2', 'coach_mike', 'Forget long cardio sessions! High-Intensity Interval Training (HIIT) offers superior results in less time. A 20-minute HIIT workout can burn more calories than an hour of jogging. It improves cardiovascular health, boosts metabolism, and builds muscle.', '2024-02-10 12:00:00', 189, False, 24, 'Fitness,HIIT,Workout', '4 min read', True, '/logo.ico', '2024-02-10 13:00:00'),
    ('post_3', 'dr_emily', 'Prioritize warm-up routines to prevent injuries and maximize workout effectiveness. A proper warm-up increases blood flow, improves joint mobility, and reduces muscle soreness. Start with light cardio, followed by dynamic stretches and specific warm-up exercises.', '2024-02-10 10:00:00', 167, False, 15, 'Sports Medicine,Fitness,Health', '5 min read', True, '/logo.ico', '2024-02-10 11:00:00'),
    ('post_4', 'health_guru', 'Mindful eating can revolutionize your digestion and weight management. By cultivating a mindful approach to food, you can improve your relationship with food, reduce stress eating, and make healthier choices.', '2024-02-10 08:00:00', 156, False, 22, 'Nutrition,Wellness,Mindfulness', '4 min read', False, '/logo.ico', '2024-02-10 09:00:00'),
    ('post_5', 'fitness_pro', 'Build lean muscle with a science-based approach to strength training. Discover optimal rep ranges, recovery techniques, and proper form to achieve your fitness goals.', '2024-02-10 06:00:00', 178, False, 20, 'Strength Training,Fitness,Science', '6 min read', True, '/logo.ico', '2024-02-10 07:00:00'),
    ('post_6', 'dr_sarah', 'Prioritize quality sleep for overall health. Aim for 7-9 hours of sleep each night. Establish a consistent sleep schedule, create a relaxing bedtime routine, and optimize your sleep environment.', '2024-02-09 18:00:00', 192, False, 17, 'Sleep,Health,Wellness', '5 min read', True, '/logo.ico', '2024-02-09 19:00:00'),
    ('post_7', 'coach_mike', 'Strengthen your core for improved posture, stability, and overall fitness. Core exercises like planks, leg raises, and Russian twists can help you achieve a stronger, healthier body.', '2024-02-09 16:00:00', 165, False, 21, 'Fitness,Core Strength,Exercise', '3 min read', False, '/logo.ico', '2024-02-09 17:00:00'),
    ('post_8', 'dr_emily', 'Stay hydrated for optimal performance and health. Drink plenty of water throughout the day, especially during exercise. Signs of dehydration include thirst, fatigue, and dizziness.', '2024-02-09 14:00:00', 148, False, 19, 'Sports Medicine,Hydration,Performance', '4 min read', True, '/logo.ico', '2024-02-09 15:00:00'),
    ('post_9', 'health_guru', 'Manage stress to improve your mental and physical health. Practice relaxation techniques like meditation, yoga, or deep breathing. Prioritize activities you enjoy and limit stress triggers.', '2024-02-09 12:00:00', 172, False, 23, 'Wellness,Stress,Gut Health', '6 min read', False, '/logo.ico', '2024-02-09 13:00:00'),
    ('post_10', 'fitness_pro', 'Enhance your athletic performance and prevent injuries with regular stretching and flexibility exercises. Incorporate static and dynamic stretches into your workout routine.', '2024-02-09 10:00:00', 187, False, 16, 'Fitness,Flexibility,Mobility', '5 min read', True, '/logo.ico', '2024-02-09 11:00:00')
]

doctors_data = [
    ('Dr. Benjamin Foster', 'Cardiologist', 4.9, 425, '22 years', '/logo.ico', 'Today', 'Cleveland Clinic', '5000+', 'MD - Cardiology, Yale School of Medicine', ['English', 'German'], 450, ['Mon', 'Wed', 'Thu'], True, 8, 'Pioneer in advanced cardiac imaging and minimally invasive procedures. Former Chief of Cardiology at Mayo Clinic.', ['08:00', '10:00', '14:00', '16:00'], ['Interventional Cardiology', 'Advanced Heart Failure', 'Cardiac Imaging'], ['Blue Cross', 'Aetna', 'United Healthcare', 'Cigna'], ['Cleveland Clinic', 'Johns Hopkins']),
    ('Dr. Alexandra Chen', 'Neurologist', 4.95, 380, '20 years', '/logo.ico', 'Tomorrow', 'Massachusetts General Hospital', '4500+', 'MD - Neurology, Harvard Medical School', ['English', 'Mandarin', 'French'], 500, ['Tue', 'Thu', 'Fri'], True, 6, 'Leading researcher in neurodegenerative diseases. Published over 100 peer-reviewed papers.', ['09:00', '11:00', '15:00', '17:00'], ['Movement Disorders', 'Neurodegenerative Diseases', 'Neuro-oncology'], ['Blue Shield', 'Medicare', 'Humana'], ['Mass General', 'Brigham and Women\'s Hospital']),
    ('Dr. Victoria Reynolds', 'Pediatrician', 4.9, 520, '18 years', '/logo.ico', 'Today', 'Boston Children\'s Hospital', '6000+', 'MD - Pediatrics, Stanford University', ['English', 'Spanish'], 350, ['Mon', 'Tue', 'Wed', 'Fri'], True, 5, 'Specializes in pediatric developmental disorders. Former president of American Academy of Pediatrics.', ['08:30', '10:30', '14:30', '16:30'], ['Developmental Pediatrics', 'Behavioral Health', 'Chronic Disease Management'], ['Aetna', 'United Healthcare', 'Cigna'], ['Boston Children\'s Hospital', 'Dana-Farber Cancer Institute']),
    ('Dr. Richard Martinez', 'Orthopedic', 4.95, 450, '25 years', '/logo.ico', 'Next Week', 'Hospital for Special Surgery', '4800+', 'MD - Orthopedic Surgery, Johns Hopkins', ['English', 'Spanish'], 600, ['Mon', 'Wed', 'Thu'], True, 7, 'Pioneering surgeon in joint replacement. Team physician for multiple professional sports teams.', ['07:30', '09:30', '13:30', '15:30'], ['Sports Medicine', 'Joint Replacement', 'Spine Surgery'], ['Blue Cross', 'Cigna', 'Oxford'], ['HSS', 'NewYork-Presbyterian']),
    ('Dr. Sarah Thompson', 'Dermatologist', 4.85, 390, '16 years', '/logo.ico', 'Tomorrow', 'Stanford Dermatology Center', '3500+', 'MD - Dermatology, University of Pennsylvania', ['English'], 400, ['Tue', 'Thu', 'Fri'], True, 4, 'Leading expert in melanoma treatment and cosmetic dermatology. NIH-funded researcher.', ['09:00', '11:00', '14:00', '16:00'], ['Skin Cancer', 'Cosmetic Dermatology', 'Laser Surgery'], ['Aetna', 'Blue Shield', 'United Healthcare'], ['Stanford Hospital', 'UCSF Medical Center']),
    ('Dr. James Harrison', 'Cardiologist', 4.9, 480, '24 years', '/logo.ico', 'Today', 'Mount Sinai Heart', '5500+', 'MD - Cardiology, Columbia University', ['English', 'Italian'], 475, ['Mon', 'Wed', 'Fri'], True, 9, 'Renowned expert in structural heart disease. Pioneer in TAVR procedures.', ['08:00', '10:00', '13:00', '15:00'], ['Structural Heart Disease', 'Interventional Cardiology', 'Heart Failure'], ['Empire', 'United Healthcare', 'Aetna'], ['Mount Sinai', 'NYU Langone']),
    ('Dr. Michelle Park', 'Neurologist', 4.85, 360, '19 years', '/logo.ico', 'Tomorrow', 'UCSF Medical Center', '4000+', 'MD - Neurology, Stanford University', ['English', 'Korean'], 450, ['Tue', 'Thu', 'Fri'], True, 5, 'Specializes in multiple sclerosis and neuroimmunology. Leading clinical researcher.', ['09:30', '11:30', '14:30', '16:30'], ['Multiple Sclerosis', 'Neuroimmunology', 'Headache Medicine'], ['Blue Shield', 'Anthem', 'United Healthcare'], ['UCSF Medical Center', 'Stanford Hospital']),
    ('Dr. Robert Williams', 'Orthopedic', 4.9, 410, '21 years', '/logo.ico', 'Next Week', 'Mayo Clinic', '4200+', 'MD - Orthopedic Surgery, Duke University', ['English'], 550, ['Mon', 'Tue', 'Thu'], True, 6, 'Internationally recognized spine surgeon. Developer of minimally invasive techniques.', ['08:00', '10:00', '14:00', '16:00'], ['Spine Surgery', 'Minimally Invasive Surgery', 'Complex Reconstruction'], ['Blue Cross', 'United Healthcare', 'Medica'], ['Mayo Clinic', 'Methodist Hospital']),
    ('Dr. Emily Anderson', 'Pediatrician', 4.95, 490, '17 years', '/logo.ico', 'Today', 'Nationwide Children\'s Hospital', '5800+', 'MD - Pediatrics, Washington University', ['English', 'French'], 375, ['Mon', 'Wed', 'Thu', 'Fri'], True, 4, 'Expert in pediatric critical care. Published author on childhood development.', ['08:30', '10:30', '13:30', '15:30'], ['Critical Care', 'Neonatal Care', 'Emergency Medicine'], ['Anthem', 'United Healthcare', 'Cigna'], ['Nationwide Children\'s', 'Ohio State Medical Center']),
    ('Dr. Daniel Kim', 'Dermatologist', 4.9, 370, '18 years', '/logo.ico', 'Tomorrow', 'UCLA Dermatology', '3800+', 'MD - Dermatology, Harvard Medical School', ['English', 'Korean', 'Spanish'], 425, ['Tue', 'Wed', 'Fri'], True, 5, 'Leading authority in ethnic skin care and advanced laser treatments. UCLA Clinical Professor.', ['09:00', '11:00', '14:00', '16:00'], ['Cosmetic Dermatology', 'Laser Surgery', 'Ethnic Skin Care'], ['Blue Shield', 'Cigna', 'Kaiser'], ['UCLA Medical Center', 'Cedars-Sinai'])
]

def populate_medicines(session: Session, medicines_data: list) -> None:
    for item in medicines_data:
        medicine = Medicine(
            id=item[0],
            name=item[1],
            price=item[2],
            category=item[3],
            stock=item[4],
            description=item[5],
            dosage=item[6],
            requires_prescription=item[7],
            rating=item[8],
            reviews=item[9],
            discount=item[10],
            expiry=item[11],
            manufacturer=item[12]
        )
        session.add(medicine)
    try:
        session.commit()
    except Exception as e:
        session.rollback()
        print(f"Error populating medicines: {e}")

def populate_authors(session: Session, authors_data: list) -> None:
    for item in authors_data:
        author = Author(
            id=item[0],
            name=item[1],
            avatar=item[2],
            role=item[3],
            verified=item[4]
        )
        session.add(author)
    try:
        session.commit()
    except Exception as e:
        session.rollback()
        print(f"Error populating authors: {e}")

def populate_comments(session: Session, comments_data: list) -> None:
    for item in comments_data:
        comment = Comment(
            id=item[0],
            author_id=item[1],
            content=item[2],
            timestamp=datetime.strptime(item[3], '%Y-%m-%d %H:%M:%S'),
            likes=item[4],
            post_id=item[5]
        )
        session.add(comment)
    try:
        session.commit()
    except Exception as e:
        session.rollback()
        print(f"Error populating comments: {e}")

def populate_posts(session: Session, posts_data: list) -> None:
    for item in posts_data:
        post = Post(
            id=item[0],
            author_id=item[1],
            content=item[2],
            timestamp=datetime.strptime(item[3], '%Y-%m-%d %H:%M:%S'),
            likes=item[4],
            liked=item[5],
            shares=item[6],
            tags=item[7],
            read_time=item[8],
            trending=item[9],
            image=item[10],
            completed_time=datetime.strptime(item[11], '%Y-%m-%d %H:%M:%S') if item[11] else None
        )
        session.add(post)
    try:
        session.commit()
    except Exception as e:
        session.rollback()
        print(f"Error populating posts: {e}")

def populate_doctors(session: Session, doctors_data: list) -> None:
    for item in doctors_data:
        doctor = DoctorModel(
            name=item[0],
            speciality=item[1],
            rating=item[2],
            reviews=item[3],
            experience=item[4],
            image=item[5],
            next_available=item[6],
            location=item[7],
            patients=item[8],
            education=item[9],
            languages=item[10],
            consultation_fee=item[11],
            availability=item[12],
            verified=item[13],
            awards=item[14],
            bio=item[15],
            time_slots=item[16],
            specializations=item[17],
            insurance_accepted=item[18],
            hospital_affiliations=item[19]
        )
        session.add(doctor)
    try:
        session.commit()
    except Exception as e:
        session.rollback()
        print(f"Error populating doctors: {e}")

if __name__ == "__main__":
    db = next(get_db())
    
    # First populate authors since they are referenced by posts and comments
    populate_authors(db, authors_data)
    # Then populate posts since they are referenced by comments
    populate_posts(db, post_data)
    # Finally populate comments since they depend on both authors and posts
    populate_comments(db, comments_data)
    # These can be populated in any order since they don't have dependencies
    populate_medicines(db, medidcine_data)
    populate_doctors(db, doctors_data)
