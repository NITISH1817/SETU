const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/locales');
const enJsonPath = path.join(localesDir, 'en.json');
let enData = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));

const languages = [
  { code: 'hi', name: 'हिंदी' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'mr', name: 'मराठी' },
  { code: 'ml', name: 'മലയാളം' },
  { code: 'kn', name: 'ಕನ್ನಡ' }
];

// Helper to deeply mock-translate an object by prefixing
function prefixObject(obj, prefix) {
  const result = {};
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'string') {
      result[key] = `[${prefix}] ${obj[key]}`;
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      result[key] = prefixObject(obj[key], prefix);
    } else {
      result[key] = obj[key];
    }
  }
  return result;
}

function run() {
  console.log("Starting mock translation process...");

  for (const lang of languages) {
    console.log(`Prefixing FULL enData for ${lang.code}...`);
    const langPath = path.join(localesDir, `${lang.code}.json`);
    
    // Prefix the English data entirely so it's guaranteed to work visually
    let translatedFull = prefixObject(enData, lang.name);
    
    fs.writeFileSync(langPath, JSON.stringify(translatedFull, null, 2));
    console.log(`Generated and updated ${lang.code}.json`);
  }

  console.log("Done updating locales with prefixed translations.");
}

run();
