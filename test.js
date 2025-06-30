import fs from 'fs/promises';

/**
 * Writes JSON data to a text file
 * @param {string} filePath - The path to the text file
 * @param {object} jsonData - The JSON data to write
 * @returns {Promise<void>}
 */
async function writeJsonToFile(filePath, jsonData) {
  try {
    // Convert JSON data to a formatted string
    const jsonString = JSON.stringify(jsonData, null, 2);
    
    // Write the JSON string to the file
    fs.writeFile(filePath, jsonString);
    
    console.log(`✅ Successfully wrote JSON to ${filePath}`);
  } catch (error) {
    console.error(`❌ Error writing JSON to ${filePath}:`, error.message);
    throw error;
  }
}

const data = { name: 'John', age: 30, city: 'New York' };


writeJsonToFile('./data.js.map', data);