import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = Path(__file__).resolve().parent

# Directories
DATASET_DIR = BASE_DIR / "Tamil Brahmi Stone Inscription"
CATEGORISED_DIR = BASE_DIR / "images_categorised"
AUGMENTED_DIR = BASE_DIR / "augmented_images"
MODELS_DIR = BASE_DIR / "models" / "ancient_tamil_ocr" / "cnn"
DATA_DIR = BACKEND_DIR / "data"
UPLOAD_DIR = BACKEND_DIR / "static" / "uploads"
PROCESSED_DIR = BACKEND_DIR / "static" / "processed"
DB_PATH = BACKEND_DIR / "database" / "heritage_ai.db"

# Ensure directories exist
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH.parent.mkdir(parents=True, exist_ok=True)
DATA_DIR.mkdir(parents=True, exist_ok=True)

# Authentication & Security
SECRET_KEY = os.getenv("SECRET_KEY", "ancient-tamil-inscription-secret-key-2027-v1")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Model Classes: 28 ancient Tamil characters
TAMIL_CLASSES = [
    "க", "ர", "ற", "ன", "ஞ", "ந", "ஆ", "வ", "ல", "ண",
    "த", "ப", "ம", "பி", "பு", "தி", "ழ", "து", "ய", "யு",
    "னு", "நி", "ணூ", "எ", "உ", "ஒ", "வு", "ஸ்ரீ"
]

TAMIL_CLASS_NAMES = [
    "Ka (க)", "Ra (ர)", "Rra (ற)", "Na (ன)", "Nya (ஞ)", "Na (ந)", "Aa (ஆ)",
    "Va (வ)", "La (ல)", "Nna (ண)", "Ta (த)", "Pa (ப)", "Ma (ம)", "Pi (பி)",
    "Pu (பு)", "Thi (தி)", "Zha (ழ)", "Thu (து)", "Ya (ய)", "Yu (யு)", "Nu (னு)",
    "Ni (நி)", "Nnoo (ணூ)", "E (எ)", "U (உ)", "O (ஒ)", "Vu (வு)", "Sri (ஸ்ரீ)"
]

CONFIDENCE_THRESHOLD = 0.55
