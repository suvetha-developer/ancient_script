import json
import re
from pathlib import Path
from typing import List, Dict, Any, Optional
from collections import Counter
from backend.config import DATA_DIR

class RetrievalService:
    def __init__(self, index_path: Optional[Path] = None):
        self.index_path = index_path or (DATA_DIR / "archaeological_index.json")
        self.records: List[Dict[str, Any]] = []
        self._load_index()
        
    def _load_index(self):
        if self.index_path.exists():
            try:
                with open(self.index_path, 'r', encoding='utf-8') as f:
                    self.records = json.load(f)
                print(f"[RetrievalService] Loaded {len(self.records)} archaeological records.")
            except Exception as e:
                print(f"[RetrievalService] Error loading index: {e}")
                self.records = []
        else:
            print(f"[RetrievalService] Index file not found at {self.index_path}")
            self.records = []

    def _extract_ngrams(self, text: str, n: int = 2) -> Counter:
        clean = re.sub(r'\s+', '', text)
        return Counter([clean[i:i+n] for i in range(len(clean) - n + 1)]) if len(clean) >= n else Counter([clean])

    def search(self, query_text: str = "", filename: str = "", top_k: int = 4) -> List[Dict[str, Any]]:
        """
        Retrieves top relevant inscription records using a multi-factor ranking:
        1. Exact or partial filename / image_id match (if uploading a known benchmark image)
        2. Keyword and entity overlap (rulers, sites, districts, vocabulary)
        3. Character n-gram similarity with ancient Tamil text & transcription
        """
        if not self.records:
            return []
            
        scores = []
        query_lower = query_text.lower().strip()
        query_ngrams = self._extract_ngrams(query_text, n=2)
        
        # Normalize filename
        fn_clean = Path(filename).stem.lower().replace("_original", "").replace("_annotated", "").replace("_binary", "").replace("_gray", "")
        
        for rec in self.records:
            score = 0.0
            matched_terms = []
            
            rec_id = rec.get("image_id", "").lower()
            rec_fn = Path(rec.get("filename", "")).stem.lower()
            rec_site = rec.get("site_name", "").lower()
            rec_district = rec.get("district", "").lower()
            rec_ruler = rec.get("ruler", "").lower()
            rec_dynasty = rec.get("dynasty", "").lower()
            rec_tamil = rec.get("recognized_sample_text", "")
            rec_context = rec.get("historical_context", "").lower()
            
            # 1. Filename / ID direct match (Weight: 80.0)
            if fn_clean and (fn_clean == rec_id or fn_clean == rec_fn or fn_clean in rec_id or rec_id in fn_clean):
                score += 80.0
                matched_terms.append(f"Image ID match: {rec.get('image_id')}")
            elif fn_clean and rec_site in fn_clean:
                score += 50.0
                matched_terms.append(f"Site match in filename: {rec.get('site_name')}")
                
            # 2. Site / District / Entity match in query (Weight: 20.0 - 30.0)
            if query_lower:
                if rec_site and rec_site in query_lower:
                    score += 30.0
                    matched_terms.append(f"Site: {rec.get('site_name')}")
                if rec_district and rec_district in query_lower:
                    score += 15.0
                    matched_terms.append(f"District: {rec.get('district')}")
                if rec_ruler and rec_ruler in query_lower:
                    score += 25.0
                    matched_terms.append(f"Ruler: {rec.get('ruler')}")
                if rec_dynasty and rec_dynasty in query_lower:
                    score += 15.0
                    matched_terms.append(f"Dynasty: {rec.get('dynasty')}")
                    
                # 3. Tamil text lexical / n-gram overlap
                rec_ngrams = self._extract_ngrams(rec_tamil, n=2)
                overlap = sum((query_ngrams & rec_ngrams).values())
                if overlap > 0:
                    ngram_score = min(overlap * 5.0, 40.0)
                    score += ngram_score
                    matched_terms.append(f"Text similarity ({overlap} n-gram matches)")
                    
                # 4. Common epigraphic terms
                epigraphic_terms = ["பாலி", "பாழி", "ஆதன்", "அதியன்", "கோ", "மகன்", "பள்ளி", "கல்", "ஊர்", "செய்த", "கொடை", "ஸ்ரீ"]
                for term in epigraphic_terms:
                    if term in query_text and term in rec_tamil:
                        score += 8.0
                        matched_terms.append(f"Epigraphic keyword: {term}")

            scores.append((score, matched_terms, rec))
            
        # Sort descending by score
        scores.sort(key=lambda x: x[0], reverse=True)
        
        # If no specific matches, return diversified prominent benchmark records
        results = []
        for score, matched, rec in scores[:top_k]:
            res_item = dict(rec)
            res_item["relevance_score"] = round(score, 2)
            res_item["matched_terms"] = matched if matched else ["Archaeological Reference Catalog"]
            results.append(res_item)
            
        return results

retrieval_service = RetrievalService()
