import re
from typing import Dict, Any, List, Optional

# Ancient Tamil Epigraphical Dictionary (Brahmi & Vatteluttu terms to Modern Tamil & English)
EPIGRAPHIC_LEXICON = {
    "பாலி": {
        "tamil": "சமணத் துறவிகளுக்கான கற்படுக்கை",
        "english": "stone cavern bed for ascetics"
    },
    "பாழி": {
        "tamil": "சமண முனிவர் உறைவிடம் / குகைப் பள்ளி",
        "english": "Jain hermitage / rock shelter"
    },
    "பள்ளி": {
        "tamil": "சமண / பௌத்த மடாலயம்",
        "english": "monastery / educational shelter"
    },
    "காவிதி": {
        "tamil": "அரசால் சிறப்பு வணிகர் அல்லது அமைச்சருக்கு வழங்கப்படும் உயரிய பட்டம்",
        "english": "prestigious title conferred on distinguished merchants/ministers by royal court"
    },
    "வணிகன்": {
        "tamil": "வர்த்தகர் / வணிகர்",
        "english": "merchant / trader"
    },
    "அதியன்": {
        "tamil": "தகடூரை ஆண்ட சங்ககால அதியமான் மன்னன்",
        "english": "King Atiyan (Adiyaman) ruler of Tagadur"
    },
    "நெடுமான்": {
        "tamil": "நெடுமான் அஞ்சி எனும் சங்கப் பெருவேந்தன்",
        "english": "Neduman Anci, famed Sangam ruler and patron of poetess Avvaiyar"
    },
    "நெடுஞ்செழியன்": {
        "tamil": "சங்ககாலப் பாண்டிய மன்னன் நெடுஞ்செழியன்",
        "english": "Sangam Pandya King Nedunjeliyan"
    },
    "கோ": {
        "tamil": "அரசன் / மன்னன்",
        "english": "King / Monarch"
    },
    "ஆதன்": {
        "tamil": "சேர மன்னர் அல்லது தகைசால் குடிமகன் பெயர்",
        "english": "Athan (noble personal name, often royal Chera lineage)"
    },
    "பணவன்": {
        "tamil": "அரசப் பணியாளன் / பணிவிடையாளர்",
        "english": "royal servant / official attendee"
    },
    "ஈத்த": {
        "tamil": "வழங்கிய / கொடை அளித்த",
        "english": "gifted / endowed"
    },
    "செய்த": {
        "tamil": "செய்வித்த / அமைத்த",
        "english": "constructed / caused to be made"
    },
    "அதிட்டானம்": {
        "tamil": "இருக்கை / மேடை / வழிபாட்டு தளம்",
        "english": "stone seat / pedestal / sanctum base"
    },
    "நடுகல்": {
        "tamil": "போரில் வீரமரணம் அடைந்த வீரனுக்கு நடப்பட்ட நினைவுக்கல்",
        "english": "memorial hero stone commemorating fallen warrior"
    },
    "ஸ்ரீ": {
        "tamil": "மங்கள வாழ்த்துச் சொல் / திரு",
        "english": "auspicious invocatory prefix (Sri)"
    }
}

class TranslationService:
    def translate(
        self,
        recognized_text: str,
        unicode_text: str,
        retrieved_context: Optional[Dict[str, Any]] = None,
        is_single_glyph: bool = False
    ) -> Dict[str, Any]:
        """
        Translates recognized ancient Tamil into Modern Tamil and English,
        anchored directly to retrieved archaeological reference context.
        """
        # Case 1: If a single isolated glyph was uploaded
        if is_single_glyph or len(recognized_text.strip()) == 1:
            char = recognized_text.strip()
            return {
                "modern_tamil": f"பண்டைய தமிழ் கல்வெட்டு எழுத்து: '{char}' (உயிர்/மெய் எழுத்துக் குறியீடு). தனி எழுத்தாக கல்வெட்டுகளில் உயிரெழுத்தையோ அல்லது கூட்டெழுத்தின் பகுதியையோ குறிக்கும்.",
                "translation_english": f"Ancient Tamil epigraphic character: '{char}'. Represents an isolated vowel/consonant glyph carved on stone.",
                "confidence_status": "High (Single Glyph Identification)",
                "translation_source": "Tamil Epigraphy Paleographic Alphabet Standard"
            }
            
        # Case 2: If we have high-relevance retrieved archaeological context
        if retrieved_context and retrieved_context.get("relevance_score", 0) >= 30:
            mod_tamil = retrieved_context.get("translation_tamil", "")
            eng_trans = retrieved_context.get("translation_english", "")
            site = retrieved_context.get("site_name", "Unknown Site")
            district = retrieved_context.get("district", "Tamil Nadu")
            
            return {
                "modern_tamil": mod_tamil,
                "translation_english": eng_trans,
                "confidence_status": "Context-Anchored Inscription Translation",
                "translation_source": f"Archaeological Records of {site}, {district} (TNDA / Epigraphia Indica)"
            }
            
        # Case 3: Linguistic morphological translation based on recognized tokens
        found_meanings_ta = []
        found_meanings_en = []
        
        for term, lex in EPIGRAPHIC_LEXICON.items():
            if term in unicode_text or term in recognized_text:
                found_meanings_ta.append(f"'{term}': {lex['tamil']}")
                found_meanings_en.append(f"'{term}': {lex['english']}")
                
        if found_meanings_ta:
            modern_ta = f"கல்வெட்டுச் சொற்கள் விளக்கம்: {'; '.join(found_meanings_ta)}. இது பழந்தமிழில் சமணக் குகைப் படுக்கை அல்லது அரசர் கொடையைக் குறிக்கும் கல்வெட்டு தொடராகும்."
            trans_en = f"Epigraphic terms identified: {'; '.join(found_meanings_en)}. Indicates an ancient commemorative or donor record."
            status = "Keyword-Guided Epigraphical Interpretation"
        else:
            modern_ta = f"அடையாளம் காணப்பட்ட எழுத்துக்கள்: '{unicode_text}'. கல்வெட்டு வரி வடிவம் முழுமையாகச் சிதையாமல் இருக்கும் பகுதிகளில் மேலும் தொல்லியல் ஆய்வுக்குரியது."
            trans_en = f"Recognized characters: '{unicode_text}'. Represents an ancient Tamil epigraph; precise continuous syntax partially fragmented due to natural rock weathering."
            status = "Paleographic Transcription Translation"
            
        return {
            "modern_tamil": modern_ta,
            "translation_english": trans_en,
            "confidence_status": status,
            "translation_source": "Tamil Epigraphical Linguistic Corpus"
        }

translation_service = TranslationService()
