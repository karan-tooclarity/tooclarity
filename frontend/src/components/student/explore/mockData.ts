export interface InstitutionCard {
  id: string;
  name: string;
  location: string;
  logo: string; // can be empty to use placeholder
}

export interface InstitutionGroup {
  category: string;
  institutions: InstitutionCard[];
}

export const getMockInstitutionGroups = (): InstitutionGroup[] => [
  {
    category: "Kindergarten",
    institutions: [
      { id: "kg1", name: "Bachpan", location: "Jubilee hills", logo: "" },
      { id: "kg2", name: "Halen O Grace International", location: "Kondapur", logo: "" },
      { id: "kg3", name: "Little Millennium", location: "Secundrabad", logo: "" },
      { id: "kg4", name: "Prerana Pre School", location: "Banjara Hills", logo: "" }
    ]
  },
  {
    category: "School",
    institutions: [
      { id: "sc1", name: "Bachpan", location: "Jubilee hills", logo: "" },
      { id: "sc2", name: "Halen O Grace International", location: "Kondapur", logo: "" },
      { id: "sc3", name: "Little Millennium", location: "Secundrabad", logo: "" },
      { id: "sc4", name: "Bright Minds High School", location: "Madhapur", logo: "" }
    ]
  },
  {
    category: "Intermediate",
    institutions: [
      { id: "im1", name: "Narayana Junior College", location: "Ameerpet", logo: "" },
      { id: "im2", name: "Sri Chaitanya", location: "Kukatpally", logo: "" },
      { id: "im3", name: "FIITJEE", location: "Dilsukhnagar", logo: "" },
      { id: "im4", name: "Resonance", location: "Hitech City", logo: "" }
    ]
  }
];
