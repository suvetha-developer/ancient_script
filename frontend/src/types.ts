export type UploadSource = "camera" | "gallery" | "document";

export type StageStatus = "pending" | "active" | "done";

export interface SelectedFile {
  file: File;
  previewUrl: string;
  source: UploadSource;
}

export interface PipelineStage {
  id: string;
  step: string;
  label: string;
  status: StageStatus;
}

export interface GlyphData {
  bbox: { x: number; y: number; w: number; h: number };
  class_index: number;
  character: string;
  class_name: string;
  confidence: number;
  uncertain: boolean;
}

export interface InscriptionSource {
  title: string;
  url: string;
  site?: string;
  period?: string;
  relevance?: number;
  reference?: string;
}

export interface TempleHistory {
  name: string;
  location: string;
  period: string;
  background: string;
  significance: string;
}

export interface NamedEntity {
  text: string;
  text_en: string;
  label: "PERSON" | "LOCATION" | "OCCUPATION" | "DONATION" | "ARTIFACT" | "DYNASTY" | "PERIOD" | "TITLE" | string;
  category: string;
  confidence: number;
  description: string;
}

export interface AnalysisResult {
  id: string;
  originalImageUrl: string;
  processedImageUrl: string;
  filename: string;
  scriptType: string;
  recognizedText: string;
  unicodeText: string;
  modernTamil: string;
  translationEnglish: string;
  meaning: string;
  historicalInfo: string[];
  templeHistory: TempleHistory | null;
  sources: InscriptionSource[];
  confidence: number;
  lowConfidence: boolean;
  confidenceNote: string;
  glyphs?: GlyphData[];
  namedEntities?: NamedEntity[];
  createdAt?: string;
}

export interface DatasetStats {
  dataset_name: string;
  total_stone_inscriptions: number;
  total_full_stone_images: number;
  image_variants: {
    original_photographs: number;
    expert_annotated: number;
    binary_masks: number;
    grayscale_enhanced: number;
  };
  character_recognition_samples: {
    categorized_crops: number;
    augmented_crops: number;
    total_character_samples: number;
  };
  total_classes: number;
  classes: string[];
  archaeological_coverage: {
    total_records: number;
    total_sites: number;
    sites: string[];
    total_districts: number;
    districts: string[];
    periods: string[];
  };
  scripts_represented: string[];
  model_architecture: string;
  model_status: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const PIPELINE_STAGES: { id: string; step: string; label: string }[] = [
  { id: "stage_1", step: "01", label: "Preparing Image" },
  { id: "stage_2", step: "02", label: "Enhancing Inscription" },
  { id: "stage_3", step: "03", label: "Detecting Inscription Region" },
  { id: "stage_4", step: "04", label: "Recognizing Ancient Tamil Script" },
  { id: "stage_5", step: "05", label: "Converting to Unicode" },
  { id: "stage_6", step: "06", label: "Searching Relevant Records" },
  { id: "stage_7", step: "07", label: "Translating Text" },
  { id: "stage_8", step: "08", label: "Extracting Meaning" },
];

export const MOCK_RESULT: AnalysisResult = {
  id: "demo-001",
  originalImageUrl: "",
  processedImageUrl: "",
  filename: "demo_inscription.jpg",
  scriptType: "Tamil-Brahmi Stone Inscription",
  recognizedText: "கரந்தவ",
  unicodeText: "\u0B95\u0BB0\u0BA8\u0BCD\u0BA4\u0BB5",
  modernTamil: "கரந்தவன்",
  translationEnglish: "He who hid (the truth) / The hidden one",
  meaning:
    "This inscription refers to a revered person described as 'one who concealed' — likely a saint or ruler known for humility or secrecy. Tamil-Brahmi inscriptions of this type are commonly found on hero stones and memorial pillars from the Sangam period (300 BCE – 300 CE).",
  historicalInfo: [
    "Tamil-Brahmi script was used between 3rd century BCE and 4th century CE.",
    "Stone inscriptions of this style are commonly found in Tamil Nadu and Sri Lanka.",
    "The phrase style suggests a Sangam-era hero stone (Nadu Kal) commemoration.",
  ],
  templeHistory: {
    name: "Pugalur Hero Stone Site",
    location: "Karur, Tamil Nadu",
    period: "1st – 3rd century CE",
    background:
      "One of the richest sites for Tamil-Brahmi inscriptions, discovered along the banks of the Amaravati river.",
    significance:
      "Contains over 200 inscriptions referencing local chieftains, merchants, and religious donations.",
  },
  sources: [
    {
      title: "Tamil-Brahmi Inscriptions of Pugalur",
      url: "https://en.wikipedia.org/wiki/Tamil-Brahmi",
      site: "Wikipedia",
      period: "1st–3rd century CE",
      relevance: 0.92,
      reference: "ASI Report 1968",
    },
    {
      title: "Early Tamil Epigraphy",
      url: "https://en.wikipedia.org/wiki/Tamil_inscriptions",
      site: "Wikipedia",
      period: "Sangam Age",
      relevance: 0.87,
    },
  ],
  confidence: 0.89,
  lowConfidence: false,
  confidenceNote: "High confidence recognition across all detected glyphs.",
  glyphs: [
    { bbox: { x: 10, y: 10, w: 40, h: 40 }, class_index: 0, character: "\u0B95", class_name: "Ka (\u0B95)", confidence: 0.95, uncertain: false },
    { bbox: { x: 55, y: 10, w: 40, h: 40 }, class_index: 1, character: "\u0BB0", class_name: "Ra (\u0BB0)", confidence: 0.91, uncertain: false },
    { bbox: { x: 100, y: 10, w: 40, h: 40 }, class_index: 10, character: "\u0BA4", class_name: "Ta (\u0BA4)", confidence: 0.88, uncertain: false },
  ],
  createdAt: new Date().toISOString(),
};
