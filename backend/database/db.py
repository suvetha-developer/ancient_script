import sqlite3
import json
from datetime import datetime
from pathlib import Path
from typing import Optional, List, Dict, Any
from backend.config import DB_PATH

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    # Users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # Analysis History table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS analyses (
        id TEXT PRIMARY KEY,
        user_id INTEGER,
        original_image_url TEXT NOT NULL,
        processed_image_url TEXT NOT NULL,
        filename TEXT NOT NULL,
        script_type TEXT NOT NULL,
        recognized_text TEXT NOT NULL,
        unicode_text TEXT NOT NULL,
        modern_tamil TEXT NOT NULL,
        translation_english TEXT NOT NULL,
        meaning TEXT NOT NULL,
        historical_info TEXT, -- JSON array
        temple_info TEXT,     -- JSON object
        sources TEXT,         -- JSON array
        confidence REAL NOT NULL,
        low_confidence INTEGER DEFAULT 0,
        confidence_note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    """)
    
    conn.commit()
    conn.close()

# Initialize upon module load
init_db()
