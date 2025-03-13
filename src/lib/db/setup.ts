import sqlite from 'better-sqlite3';

export function setupTables(db: ReturnType<typeof sqlite>) {
  // Core Tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('patient', 'practitioner')) NOT NULL,
      username TEXT UNIQUE,
      name TEXT,
      avatar_url TEXT,
      practitioner_id INTEGER,
      FOREIGN KEY (practitioner_id) REFERENCES users(id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS session_store (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT NOT NULL,
      value TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(key)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS tweets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      tag TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tweet_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tweet_id) REFERENCES tweets(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(tweet_id, user_id)
    )
  `);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      practitioner_id INTEGER NOT NULL,
      patient_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      time_slot TEXT NOT NULL,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'cancelled')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (practitioner_id) REFERENCES users(id),
      FOREIGN KEY (patient_id) REFERENCES users(id)
    )
  `);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price INTEGER NOT NULL,
      category TEXT CHECK(category IN ('Herbs', 'Supplements')) NOT NULL,
      image_url TEXT NOT NULL,
      stock INTEGER NOT NULL DEFAULT 100
    )
  `);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id),
      UNIQUE(user_id, product_id)
    )
  `);

  // Feature Tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS nutrition (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      protein REAL NOT NULL,
      carbs REAL NOT NULL,
      fats REAL NOT NULL,
      fiber REAL NOT NULL,
      vitamin_a REAL NOT NULL,
      vitamin_b12 REAL NOT NULL,
      vitamin_c REAL NOT NULL,
      vitamin_d REAL NOT NULL,
      iron REAL NOT NULL,
      calcium REAL NOT NULL,
      zinc REAL NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      power_index REAL NOT NULL,
      bench_press REAL NOT NULL,
      squat REAL NOT NULL,
      deadlift REAL NOT NULL,
      muscle_balance REAL NOT NULL,
      vo2_max REAL NOT NULL,
      resting_heart_rate INTEGER NOT NULL,
      max_heart_rate INTEGER NOT NULL,
      endurance REAL NOT NULL,
      pace REAL NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS yoga_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      spine_flexibility REAL NOT NULL,
      hip_flexibility REAL NOT NULL,
      shoulder_flexibility REAL NOT NULL,
      balance_score REAL NOT NULL,
      overall_flexibility REAL NOT NULL,
      weekly_completion REAL NOT NULL,
      streak INTEGER NOT NULL,
      duration INTEGER NOT NULL,
      beginner_completed INTEGER NOT NULL,
      beginner_total INTEGER NOT NULL,
      intermediate_completed INTEGER NOT NULL,
      intermediate_total INTEGER NOT NULL,
      advanced_completed INTEGER NOT NULL,
      advanced_total INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS mental_health (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      meditation_minutes INTEGER NOT NULL,
      meditation_streak INTEGER NOT NULL,
      meditation_goal INTEGER NOT NULL,
      meditation_progress REAL NOT NULL,
      sleep_hours REAL NOT NULL,
      sleep_quality REAL NOT NULL,
      deep_sleep REAL NOT NULL,
      light_sleep REAL NOT NULL,
      rem_sleep REAL NOT NULL,
      sleep_consistency REAL NOT NULL,
      mood_category TEXT NOT NULL,
      mood_intensity REAL NOT NULL,
      stress_level REAL NOT NULL,
      recovery_score REAL NOT NULL,
      wellbeing_score REAL NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS meditation_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mental_health_id INTEGER,
      type TEXT,
      duration INTEGER,
      completion_rate INTEGER,
      frequency INTEGER,
      FOREIGN KEY(mental_health_id) REFERENCES mental_health(id)
    )
  `);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS mood_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mental_health_id INTEGER,
      timestamp TEXT,
      mood TEXT,
      intensity INTEGER,
      notes TEXT,
      FOREIGN KEY(mental_health_id) REFERENCES mental_health(id)
    )
  `);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS stress_triggers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mental_health_id INTEGER,
      category TEXT,
      intensity INTEGER,
      frequency INTEGER,
      coping_strategies TEXT,
      FOREIGN KEY(mental_health_id) REFERENCES mental_health(id)
    )
  `);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS medication_catalog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT CHECK(type IN ('ayurvedic', 'modern', 'supplement')) NOT NULL,
      name TEXT NOT NULL,
      typical_dosage TEXT NOT NULL,
      description TEXT NOT NULL,
      usage_guidelines TEXT NOT NULL,
      UNIQUE(type, name)
    )
  `);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS medications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      catalog_id INTEGER NOT NULL,
      dosage TEXT NOT NULL,
      frequency TEXT NOT NULL,
      timing TEXT CHECK(timing IN ('morning', 'afternoon', 'evening', 'night')) NOT NULL,
      with_food INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (catalog_id) REFERENCES medication_catalog(id)
    )
  `);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS medication_adherence (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      medication_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      taken INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (medication_id) REFERENCES medications(id),
      UNIQUE(user_id, medication_id, date)
    )
  `);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS biomarkers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      fasting_glucose REAL,
      post_prandial_glucose REAL,
      hba1c REAL,
      total_cholesterol REAL,
      hdl REAL,
      ldl REAL,
      triglycerides REAL,
      tsh REAL,
      t3 REAL,
      t4 REAL,
      vitamin_d REAL,
      vitamin_b12 REAL,
      crp REAL,
      esr REAL,
      alt REAL,
      ast REAL,
      albumin REAL,
      creatinine REAL,
      urea REAL,
      uric_acid REAL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS daily_schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      activities TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS treatment_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      problemOverview TEXT NOT NULL,
      treatmentStrategy TEXT NOT NULL,
      goals TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Indices for performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_nutrition_user_date ON nutrition(user_id, date);
    CREATE INDEX IF NOT EXISTS idx_workouts_user_date ON workouts(user_id, date);
    CREATE INDEX IF NOT EXISTS idx_yoga_user_date ON yoga_metrics(user_id, date);
    CREATE INDEX IF NOT EXISTS idx_mental_user_date ON mental_health(user_id, date);
    CREATE INDEX IF NOT EXISTS idx_medications_user ON medications(user_id);
    CREATE INDEX IF NOT EXISTS idx_adherence_user_date ON medication_adherence(user_id, date);
    CREATE INDEX IF NOT EXISTS idx_biomarkers_user_date ON biomarkers(user_id, date);
    CREATE INDEX IF NOT EXISTS idx_daily_schedules_user_date ON daily_schedules(user_id, date);
    CREATE INDEX IF NOT EXISTS idx_treatment_plans_user ON treatment_plans(user_id);
    CREATE INDEX IF NOT EXISTS idx_session_store_key ON session_store(key);
    CREATE INDEX IF NOT EXISTS idx_session_store_created_at ON session_store(created_at);
  `);

  // Health Insights table
  db.exec(`
    CREATE TABLE IF NOT EXISTS health_insights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      section TEXT CHECK(section IN ('biomarkers', 'workout', 'yoga', 'mental', 'diet_medication')) NOT NULL,
      insight_data TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES users(id)
    )
  `);

  // Add index for health insights
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_health_insights_patient ON health_insights(patient_id);
    CREATE INDEX IF NOT EXISTS idx_health_insights_section ON health_insights(section);
  `);

  // Messages table for practitioner-patient communication
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER NOT NULL,
      practitioner_id INTEGER NOT NULL,
      patient_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      read_at TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users(id),
      FOREIGN KEY (practitioner_id) REFERENCES users(id),
      FOREIGN KEY (patient_id) REFERENCES users(id)
    )
  `);

  // Add index for messages
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
    CREATE INDEX IF NOT EXISTS idx_messages_practitioner ON messages(practitioner_id);
    CREATE INDEX IF NOT EXISTS idx_messages_patient ON messages(patient_id);
  `);

  console.log('All tables created successfully');
}
