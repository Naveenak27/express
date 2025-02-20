// server/utils/csvParser.js
const fs = require('fs');
const { parse } = require('csv-parse');
const XLSX = require('xlsx');

exports.parseCsv = async (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      console.log('Reading file:', filePath);
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      console.log('Sheet name:', sheetName);
      
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);
      console.log('Raw spreadsheet data:', data);

      // Get all column headers
      const headers = Object.keys(data[0] || {});
      console.log('Available columns:', headers);
      
      const emails = data.map(row => {
        // Look for common email column names
        const emailKey = Object.keys(row).find(key => 
          key.toLowerCase().includes('email') || 
          key.toLowerCase() === 'e-mail' ||
          key.toLowerCase() === 'mail'
        );
        
        console.log('Found email key:', emailKey);
        console.log('Row data:', row);
        
        if (emailKey) {
          return row[emailKey];
        } else {
          // If no email column found, try to find any field that looks like an email
          const possibleEmail = Object.values(row).find(value => 
            typeof value === 'string' && 
            value.includes('@') && 
            value.includes('.')
          );
          return possibleEmail;
        }
      }).filter(email => {
        const isValid = email && 
                       typeof email === 'string' && 
                       email.includes('@') && 
                       email.includes('.');
        console.log('Email:', email, 'Valid:', isValid);
        return isValid;
      });
      
      console.log('Final extracted emails:', emails);
      resolve(emails);
      
    } catch (spreadsheetError) {
      console.error('Spreadsheet parsing error:', spreadsheetError);
      
      // Fall back to CSV parsing
      const emails = [];
      fs.createReadStream(filePath)
        .pipe(parse({ 
          columns: true,
          skip_empty_lines: true,
          trim: true
        }))
        .on('data', (row) => {
          console.log('CSV row:', row);
          // Try to find email in any column
          const email = Object.values(row).find(value => 
            typeof value === 'string' && 
            value.includes('@') && 
            value.includes('.')
          );
          if (email) {
            console.log('Found email in CSV:', email);
            emails.push(email);
          }
        })
        .on('end', () => {
          console.log('CSV parsing complete. Emails found:', emails);
          resolve(emails);
        })
        .on('error', (error) => {
          console.error('CSV parsing error:', error);
          reject(error);
        });
    }
  });
};
