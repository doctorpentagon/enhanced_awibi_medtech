// Comprehensive list of AWIBI MedTech chapters across Africa and beyond
export const chapters = [
  // Nigeria
  { id: 1, name: 'AMT ABEOKUTA', city: 'Abeokuta', state: 'Ogun', country: 'Nigeria', region: 'West Africa', members: 45, status: 'Active', type: 'Regional', established: '2024-01-15' },
  { id: 2, name: 'AMT IKORODU', city: 'Ikorodu', state: 'Lagos', country: 'Nigeria', region: 'West Africa', members: 78, status: 'Active', type: 'Regional', established: '2023-11-20' },
  { id: 3, name: 'AMT KANO', city: 'Kano', state: 'Kano', country: 'Nigeria', region: 'West Africa', members: 62, status: 'Active', type: 'Regional', established: '2024-02-10' },
  { id: 4, name: 'AMT UNIVERSITY OF ILORIN', city: 'Ilorin', state: 'Kwara', country: 'Nigeria', region: 'West Africa', members: 134, status: 'Active', type: 'University', established: '2023-09-05' },
  { id: 5, name: 'AMT LAGOS STATE UNIVERSITY', city: 'Lagos', state: 'Lagos', country: 'Nigeria', region: 'West Africa', members: 89, status: 'Active', type: 'University', established: '2023-10-12' },
  { id: 6, name: 'AMT IBADAN', city: 'Ibadan', state: 'Oyo', country: 'Nigeria', region: 'West Africa', members: 97, status: 'Active', type: 'Regional', established: '2024-01-08' },
  { id: 7, name: 'AMT ABUJA', city: 'Abuja', state: 'FCT', country: 'Nigeria', region: 'West Africa', members: 156, status: 'Active', type: 'Regional', established: '2023-08-15' },
  { id: 8, name: 'AMT PORT HARCOURT', city: 'Port Harcourt', state: 'Rivers', country: 'Nigeria', region: 'West Africa', members: 73, status: 'Active', type: 'Regional', established: '2024-03-01' },
  { id: 9, name: 'AMT ENUGU', city: 'Enugu', state: 'Enugu', country: 'Nigeria', region: 'West Africa', members: 54, status: 'Active', type: 'Regional', established: '2024-02-20' },
  { id: 10, name: 'AMT CALABAR', city: 'Calabar', state: 'Cross River', country: 'Nigeria', region: 'West Africa', members: 41, status: 'Active', type: 'Regional', established: '2024-04-05' },

  // Ghana
  { id: 11, name: 'AMT ACCRA', city: 'Accra', state: 'Greater Accra', country: 'Ghana', region: 'West Africa', members: 82, status: 'Active', type: 'Regional', established: '2024-01-25' },
  { id: 12, name: 'AMT KUMASI', city: 'Kumasi', state: 'Ashanti', country: 'Ghana', region: 'West Africa', members: 67, status: 'Active', type: 'Regional', established: '2024-02-15' },
  { id: 13, name: 'AMT UNIVERSITY OF GHANA', city: 'Legon', state: 'Greater Accra', country: 'Ghana', region: 'West Africa', members: 103, status: 'Active', type: 'University', established: '2023-12-10' },

  // Kenya
  { id: 14, name: 'AMT NAIROBI', city: 'Nairobi', state: 'Nairobi', country: 'Kenya', region: 'East Africa', members: 124, status: 'Active', type: 'Regional', established: '2023-10-20' },
  { id: 15, name: 'AMT MOMBASA', city: 'Mombasa', state: 'Mombasa', country: 'Kenya', region: 'East Africa', members: 58, status: 'Active', type: 'Regional', established: '2024-01-30' },
  { id: 16, name: 'AMT UNIVERSITY OF NAIROBI', city: 'Nairobi', state: 'Nairobi', country: 'Kenya', region: 'East Africa', members: 91, status: 'Active', type: 'University', established: '2023-11-15' },

  // South Africa
  { id: 17, name: 'AMT CAPE TOWN', city: 'Cape Town', state: 'Western Cape', country: 'South Africa', region: 'Southern Africa', members: 112, status: 'Active', type: 'Regional', established: '2023-09-20' },
  { id: 18, name: 'AMT JOHANNESBURG', city: 'Johannesburg', state: 'Gauteng', country: 'South Africa', region: 'Southern Africa', members: 145, status: 'Active', type: 'Regional', established: '2023-08-10' },
  { id: 19, name: 'AMT DURBAN', city: 'Durban', state: 'KwaZulu-Natal', country: 'South Africa', region: 'Southern Africa', members: 76, status: 'Active', type: 'Regional', established: '2024-02-05' },
  { id: 20, name: 'AMT UNIVERSITY OF CAPE TOWN', city: 'Cape Town', state: 'Western Cape', country: 'South Africa', region: 'Southern Africa', members: 88, status: 'Active', type: 'University', established: '2023-10-01' },

  // Egypt
  { id: 21, name: 'AMT CAIRO', city: 'Cairo', state: 'Cairo', country: 'Egypt', region: 'North Africa', members: 134, status: 'Active', type: 'Regional', established: '2023-11-05' },
  { id: 22, name: 'AMT ALEXANDRIA', city: 'Alexandria', state: 'Alexandria', country: 'Egypt', region: 'North Africa', members: 67, status: 'Active', type: 'Regional', established: '2024-01-12' },

  // Morocco
  { id: 23, name: 'AMT CASABLANCA', city: 'Casablanca', state: 'Casablanca-Settat', country: 'Morocco', region: 'North Africa', members: 89, status: 'Active', type: 'Regional', established: '2024-02-28' },
  { id: 24, name: 'AMT RABAT', city: 'Rabat', state: 'Rabat-Salé-Kénitra', country: 'Morocco', region: 'North Africa', members: 54, status: 'Active', type: 'Regional', established: '2024-03-15' },

  // Ethiopia
  { id: 25, name: 'AMT ADDIS ABABA', city: 'Addis Ababa', state: 'Addis Ababa', country: 'Ethiopia', region: 'East Africa', members: 98, status: 'Active', type: 'Regional', established: '2024-01-20' },

  // Uganda
  { id: 26, name: 'AMT KAMPALA', city: 'Kampala', state: 'Central', country: 'Uganda', region: 'East Africa', members: 72, status: 'Active', type: 'Regional', established: '2024-02-10' },

  // Tanzania
  { id: 27, name: 'AMT DAR ES SALAAM', city: 'Dar es Salaam', state: 'Dar es Salaam', country: 'Tanzania', region: 'East Africa', members: 63, status: 'Active', type: 'Regional', established: '2024-03-05' },

  // Rwanda
  { id: 28, name: 'AMT KIGALI', city: 'Kigali', state: 'Kigali', country: 'Rwanda', region: 'East Africa', members: 45, status: 'Active', type: 'Regional', established: '2024-04-01' },

  // Senegal
  { id: 29, name: 'AMT DAKAR', city: 'Dakar', state: 'Dakar', country: 'Senegal', region: 'West Africa', members: 56, status: 'Active', type: 'Regional', established: '2024-03-20' },

  // Ivory Coast
  { id: 30, name: 'AMT ABIDJAN', city: 'Abidjan', state: 'Lagunes', country: 'Ivory Coast', region: 'West Africa', members: 48, status: 'Active', type: 'Regional', established: '2024-04-10' },

  // Cameroon
  { id: 31, name: 'AMT DOUALA', city: 'Douala', state: 'Littoral', country: 'Cameroon', region: 'Central Africa', members: 52, status: 'Active', type: 'Regional', established: '2024-03-25' },
  { id: 32, name: 'AMT YAOUNDÉ', city: 'Yaoundé', state: 'Centre', country: 'Cameroon', region: 'Central Africa', members: 41, status: 'Active', type: 'Regional', established: '2024-04-15' },

  // Botswana
  { id: 33, name: 'AMT GABORONE', city: 'Gaborone', state: 'South-East', country: 'Botswana', region: 'Southern Africa', members: 34, status: 'Active', type: 'Regional', established: '2024-04-20' },

  // Zambia
  { id: 34, name: 'AMT LUSAKA', city: 'Lusaka', state: 'Lusaka', country: 'Zambia', region: 'Southern Africa', members: 39, status: 'Active', type: 'Regional', established: '2024-05-01' },

  // Zimbabwe
  { id: 35, name: 'AMT HARARE', city: 'Harare', state: 'Harare', country: 'Zimbabwe', region: 'Southern Africa', members: 43, status: 'Active', type: 'Regional', established: '2024-05-10' },

  // International Chapters (Outside Africa)
  { id: 36, name: 'AMT LONDON', city: 'London', state: 'England', country: 'United Kingdom', region: 'Europe', members: 67, status: 'Active', type: 'International', established: '2023-12-01' },
  { id: 37, name: 'AMT NEW YORK', city: 'New York', state: 'New York', country: 'United States', region: 'North America', members: 89, status: 'Active', type: 'International', established: '2023-11-20' },
  { id: 38, name: 'AMT TORONTO', city: 'Toronto', state: 'Ontario', country: 'Canada', region: 'North America', members: 54, status: 'Active', type: 'International', established: '2024-01-15' },
  { id: 39, name: 'AMT SYDNEY', city: 'Sydney', state: 'New South Wales', country: 'Australia', region: 'Oceania', members: 42, status: 'Active', type: 'International', established: '2024-02-01' },
  { id: 40, name: 'AMT DUBAI', city: 'Dubai', state: 'Dubai', country: 'United Arab Emirates', region: 'Middle East', members: 76, status: 'Active', type: 'International', established: '2024-01-10' },
];

// Function to search chapters
export const searchChapters = (searchTerm) => {
  if (!searchTerm) return chapters;
  
  const term = searchTerm.toLowerCase();
  return chapters.filter(chapter =>
    chapter.name.toLowerCase().includes(term) ||
    chapter.city.toLowerCase().includes(term) ||
    chapter.state.toLowerCase().includes(term) ||
    chapter.country.toLowerCase().includes(term) ||
    chapter.region.toLowerCase().includes(term) ||
    chapter.type.toLowerCase().includes(term)
  );
};

// Function to get chapters by country
export const getChaptersByCountry = (country) => {
  return chapters.filter(chapter => chapter.country === country);
};

// Function to get chapters by region
export const getChaptersByRegion = (region) => {
  return chapters.filter(chapter => chapter.region === region);
};

// Function to get chapters by type
export const getChaptersByType = (type) => {
  return chapters.filter(chapter => chapter.type === type);
};

// Function to get all countries
export const getAllCountries = () => {
  return [...new Set(chapters.map(chapter => chapter.country))].sort();
};

// Function to get all regions
export const getAllRegions = () => {
  return [...new Set(chapters.map(chapter => chapter.region))].sort();
};

// Function to get all types
export const getAllTypes = () => {
  return [...new Set(chapters.map(chapter => chapter.type))].sort();
};

