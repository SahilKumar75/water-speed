import { useState, useEffect, useRef } from 'react';
import { MapPin, CheckCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question, AnswerValue, LocationAnswer } from '../types';

// Sample data - replace with your preferred data source
const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Armenia', 'Australia',
  'Austria', 'Bangladesh', 'Belgium', 'Brazil', 'Bulgaria', 'Canada',
  'Chile', 'China', 'Colombia', 'Croatia', 'Czech Republic', 'Denmark',
  'Egypt', 'Estonia', 'Finland', 'France', 'Germany', 'Greece',
  'Hungary', 'Iceland', 'India', 'Indonesia', 'Ireland', 'Israel',
  'Italy', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Latvia',
  'Lithuania', 'Malaysia', 'Mexico', 'Netherlands', 'New Zealand', 'Norway',
  'Pakistan', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Romania',
  'Russia', 'Saudi Arabia', 'Singapore', 'South Africa', 'South Korea', 'Spain',
  'Sweden', 'Switzerland', 'Thailand', 'Turkey', 'Ukraine', 'United Arab Emirates',
  'United Kingdom', 'United States', 'Vietnam'
];

const CITIES_BY_COUNTRY: Record<string, string[]> = {
  'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'],
  'India': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat'],
  'United Kingdom': ['London', 'Birmingham', 'Manchester', 'Leeds', 'Glasgow', 'Liverpool', 'Newcastle', 'Sheffield', 'Bristol', 'Cardiff'],
  'Canada': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener'],
  'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Canberra', 'Newcastle', 'Wollongong', 'Logan City'],
  'Germany': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig'],
  'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'],
  'Japan': ['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kawasaki', 'Kyoto', 'Saitama'],
  'China': ['Shanghai', 'Beijing', 'Chongqing', 'Tianjin', 'Guangzhou', 'Shenzhen', 'Wuhan', 'Dongguan', 'Chengdu', 'Nanjing'],
  'Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre']
};

interface LocationInputProps {
  question: Question;
  value?: AnswerValue;
  onChange: (value: AnswerValue) => void;
}

export default function LocationInput({ question, value, onChange }: LocationInputProps) {
  // Autocomplete states only
  // ✅ CORRECT - Always initialize with strings
  const [countryInput, setCountryInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [zipInput, setZipInput] = useState('');
  const [countrySuggestions, setCountrySuggestions] = useState<string[]>([]);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  
  // Refs for click outside detection
  const countryRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  // Initialize values from props
  // ✅ CORRECT - Always ensure string values
  useEffect(() => {
    const locationValue = value as LocationAnswer;
    setCountryInput(locationValue?.country || '');
    setCityInput(locationValue?.city || '');
    setZipInput(locationValue?.zipCode || '');
  }, [value]);


  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setShowCountrySuggestions(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setShowCitySuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter countries based on input
  const filterCountries = (input: string) => {
    if (!input.trim()) return [];
    const filtered = COUNTRIES.filter(country =>
      country.toLowerCase().includes(input.toLowerCase())
    ).slice(0, 8); // Limit to 8 suggestions
    console.log('Filtered countries:', filtered); // Debug
    return filtered;
  };

  // Filter cities based on selected country and input
  const filterCities = (input: string, selectedCountry: string) => {
    if (!input.trim()) return [];
    const cities = CITIES_BY_COUNTRY[selectedCountry] || [];
    const filtered = cities.filter(city =>
      city.toLowerCase().includes(input.toLowerCase())
    ).slice(0, 8); // Limit to 8 suggestions
    console.log('Filtered cities:', filtered, 'for country:', selectedCountry); // Debug
    return filtered;
  };

  // Handle country input change
  const handleCountryChange = (newValue: string) => {
    setCountryInput(newValue);
    setCountrySuggestions(filterCountries(newValue));
    setShowCountrySuggestions(true);
    
    // Reset city when country changes
    if (newValue !== (value as LocationAnswer)?.country) {
      setCityInput('');
      setCitySuggestions([]);
    }
    
    updateLocationValue('country', newValue);
  };

  // Handle city input change
  const handleCityChange = (newValue: string) => {
    setCityInput(newValue);
    const currentCountry = countryInput || (value as LocationAnswer)?.country || '';
    setCitySuggestions(filterCities(newValue, currentCountry));
    setShowCitySuggestions(true);
    updateLocationValue('city', newValue);
  };

  // Handle ZIP code change
  const handleZipChange = (newValue: string) => {
    setZipInput(newValue);
    updateLocationValue('zipCode', newValue);
  };

  // Update location value
  const updateLocationValue = (field: string, newValue: string) => {
    const currentValue = (value as LocationAnswer) || {};
    const updatedValue = {
      ...currentValue,
      [field]: newValue
    };
    console.log('Updating location value:', field, newValue, 'Full value:', updatedValue);
    onChange(updatedValue);
  };

  // Handle suggestion selection - FIXED with onMouseDown
  const selectCountry = (country: string) => {
    console.log('Selecting country:', country); // Debug log
    setCountryInput(country);
    setShowCountrySuggestions(false);
    setCountrySuggestions([]);
    updateLocationValue('country', country);
    
    // Clear city when country changes
    setCityInput('');
    updateLocationValue('city', '');
    
    // Debug: log the updated state
    setTimeout(() => {
      console.log('Country input after selection:', countryInput);
      console.log('Updated location value:', value);
    }, 100);
  };

  const selectCity = (city: string) => {
    console.log('Selecting city:', city); // Debug log
    setCityInput(city);
    setShowCitySuggestions(false);
    setCitySuggestions([]);
    updateLocationValue('city', city);
    
    // Debug: log the updated state
    setTimeout(() => {
      console.log('City input after selection:', cityInput);
      console.log('Updated location value:', value);
    }, 100);
  };

  return (
    <div className="space-y-6">
      {/* Manual Input Fields with Autocomplete */}
      <div className="space-y-4">
        <div className="text-center text-white/60 text-sm mb-6">
          Enter your location details below:
        </div>
        
        {/* Country Input with Autocomplete */}
        <motion.div 
          ref={countryRef}
          className={`relative transition-all duration-300 ${
            countryInput ? 'ring-2 ring-green-400/50' : ''
          }`}
        >
          <label className="block text-white/80 text-sm font-medium mb-2">
            <span>Country</span>
            {countryInput && (
              <CheckCircle className="inline w-4 h-4 text-green-400 ml-2" />
            )}
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              value={countryInput}
              onChange={(e) => handleCountryChange(e.target.value)}
              onFocus={() => {
                setShowCountrySuggestions(true);
                setCountrySuggestions(filterCountries(countryInput));
              }}
              className={`w-full bg-white/10 border rounded-xl pl-12 pr-10 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all ${
                countryInput
                  ? 'border-green-400/50 focus:border-green-400/50 focus:ring-green-400/50 bg-green-400/5'
                  : 'border-white/20 focus:border-cyan-400/50 focus:ring-cyan-400/50'
              }`}
              placeholder="Enter your country"
            />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          </div>
          
          {/* Country Suggestions */}
          <AnimatePresence>
            {showCountrySuggestions && countrySuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 z-10 mt-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl max-h-60 overflow-y-auto"
              >
                {countrySuggestions.map((country, index) => (
                  <motion.div
                    key={country}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={(e) => {
                      console.log('Country suggestion clicked:', country); // Debug
                      e.preventDefault();
                      e.stopPropagation();
                      selectCountry(country);
                    }}
                    className="px-4 py-3 text-white hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-green-400" />
                      <span>{country}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* City Input with Autocomplete */}
        <motion.div 
          ref={cityRef}
          className={`relative transition-all duration-300 ${
            cityInput ? 'ring-2 ring-green-400/50' : ''
          }`}
        >
          <label className="block text-white/80 text-sm font-medium mb-2">
            <span>City</span>
            {cityInput && (
              <CheckCircle className="inline w-4 h-4 text-green-400 ml-2" />
            )}
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              value={cityInput}
              onChange={(e) => handleCityChange(e.target.value)}
              onFocus={() => {
                setShowCitySuggestions(true);
                setCitySuggestions(filterCities(cityInput, countryInput));
              }}
              className={`w-full bg-white/10 border rounded-xl pl-12 pr-10 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all ${
                cityInput
                  ? 'border-green-400/50 focus:border-green-400/50 focus:ring-green-400/50 bg-green-400/5'
                  : 'border-white/20 focus:border-cyan-400/50 focus:ring-cyan-400/50'
              }`}
              placeholder="Enter your city"
            />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          </div>
          
          {/* City Suggestions - FIXED with onMouseDown */}
          <AnimatePresence>
            {showCitySuggestions && citySuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 z-10 mt-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl max-h-60 overflow-y-auto"
              >
                {citySuggestions.map((city, index) => (
                  <motion.div
                    key={city}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={(e) => {
                      console.log('City suggestion clicked:', city); // Debug
                      e.preventDefault();
                      e.stopPropagation();
                      selectCity(city);
                    }}
                    className="px-4 py-3 text-white hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      <span>{city}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ZIP Code Input */}
        <motion.div 
          className={`transition-all duration-300 ${
            zipInput ? 'ring-2 ring-green-400/50' : ''
          }`}
        >
          <label className="block text-white/80 text-sm font-medium mb-2">
            <span>ZIP/Postal Code</span>
            {zipInput && (
              <CheckCircle className="inline w-4 h-4 text-green-400 ml-2" />
            )}
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              value={zipInput}
              onChange={(e) => handleZipChange(e.target.value)}
              className={`w-full bg-white/10 border rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all ${
                zipInput
                  ? 'border-green-400/50 focus:border-green-400/50 focus:ring-green-400/50 bg-green-400/5'
                  : 'border-white/20 focus:border-cyan-400/50 focus:ring-cyan-400/50'
              }`}
              placeholder="Enter your ZIP code"
            />
          </div>
        </motion.div>
      </div>

      {/* Helpful Tip */}
      <div className="text-center text-white/50 text-xs mt-6">
        <p>💡 Start typing to see location suggestions</p>
      </div>
    </div>
  );
}
