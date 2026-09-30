import unicodedata
from typing import Dict, Any, List

class UnicodeService:
    def __init__(self):
        # Vowel signs that follow a base consonant in standard Tamil
        self.vowel_signs = {
            "ஆ": "ா",
            "இ": "ி",
            "ஈ": "ீ",
            "உ": "ு",
            "ஊ": "ூ",
            "எ": "ெ",
            "ஏ": "ே",
            "ஐ": "ை",
            "ஒ": "ொ",
            "ஓ": "ோ",
            "ஔ": "ௌ"
        }
        
        # Pure consonants in Tamil
        self.consonants = {"க", "ங", "ச", "ஞ", "ட", "ண", "த", "ந", "ப", "ம", "ய", "ர", "ல", "வ", "ழ", "ள", "ற", "ன"}
        
    def normalize_tamil_text(self, raw_chars: List[str]) -> str:
        """
        Takes the recognized character list and generates normalized Tamil Unicode.
        Applies epigraphical combinatory rules without distorting the recognized symbols.
        """
        if not raw_chars:
            return ""
            
        normalized_tokens = []
        i = 0
        n = len(raw_chars)
        
        while i < n:
            curr = raw_chars[i]
            
            # Special ligature handling
            if curr == "ஸ்ரீ":
                normalized_tokens.append("ஸ்ரீ")
                i += 1
                continue
                
            # If current character is a consonant and next is a vowel, check for natural combining
            if i + 1 < n and curr in self.consonants:
                nxt = raw_chars[i + 1]
                if nxt in self.vowel_signs:
                    # In modern Tamil, consonant + vowel sign combines into Uyir-Mei
                    sign = self.vowel_signs[nxt]
                    normalized_tokens.append(f"{curr}{sign}")
                    i += 2
                    continue
                    
            normalized_tokens.append(curr)
            i += 1
            
        # Join tokens and normalize Unicode (NFC form)
        combined = "".join(normalized_tokens)
        return unicodedata.normalize("NFC", combined)

    def process(self, raw_text: str, raw_chars: List[str]) -> Dict[str, str]:
        """
        Preserves recognized text and normalized Unicode text separately as required.
        """
        normalized = self.normalize_tamil_text(raw_chars)
        if not normalized:
            normalized = unicodedata.normalize("NFC", raw_text)
            
        return {
            "recognized_text": raw_text,
            "unicode_text": normalized
        }

unicode_service = UnicodeService()
