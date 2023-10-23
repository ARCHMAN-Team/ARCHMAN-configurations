const express= require('express')
const app = express()
const cors = require('cors');
const fs = require('fs');
const path = require('path'); 
const multer = require('multer');
app.use(cors()); 

app.listen(8080, ()=>{console.log("server started on port 8080")})


app.get('/directory-layout', (req, res) => {
    // Read the Perl configuration file
    const configContent = fs.readFileSync('/home/docs/data/config/config.pl', 'utf8');
  
    // Extract the "# main directory layout" section using regular expressions
    const regex = /# main directory layout\n([\s\S]*?)\n\n# where to copy across website templates from/gs;
    const match = regex.exec(configContent);
  
    if (match && match[1]) {
      const mainDirectoryLayout = match[1];
  
      // Split the lines and extract the key-value pairs
      const lines = mainDirectoryLayout.split('\n');
      const directoryLayout = {};
  
      lines.forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
          directoryLayout[key.trim()] = value.trim();
        }
      });
  
      // Send the directory layout as JSON response
      res.json(directoryLayout);
    } else {
      // Send an error response if the section is not found
      res.status(404).json({ error: 'Directory layout not found' });
    }
  });
  

//Acceptable file format
app.get('/api/aff', (req, res) => {
    const perlFilePath = '/home/docs/data/config/config.pl';
  
    fs.readFile(perlFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
  
      const regex = /@upload_accept\s*=\s*\((.*?)\);/s;
      const match = regex.exec(data);
      if (match) {
        const acceptableFileFormatsString = match[1];
        const acceptableFileFormats = acceptableFileFormatsString.split(/['",\s]+/).filter(Boolean);
        res.json({ acceptableFileFormats });
      } else {
        res.status(404).json({ error: 'Acceptable file formats not found' });
      }
    });
});
  

const bodyParser = require('body-parser');
const { log } = require('console');

app.use(bodyParser.json());

//get key to add
app.post('/api/add', (req, res) => {
  const variableValue = req.body.variableName;

  // Read the Perl file
  const perlFilePath = '/home/docs/data/config/config.pl';
  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Extract the JSON array from the Perl file
    const regex = /@upload_accept\s*=\s*\((.*?)\);/s;
    const match = regex.exec(data);
    if (!match) {
      res.status(404).json({ error: 'JSON array not found in the Perl file' });
      return;
    }

    const currentJsonArray = match[1];
    const updatedJsonArray = currentJsonArray + `, '${variableValue}'`;

    // Replace the existing JSON array with the updated one in the Perl file content
    const updatedContent = data.replace(currentJsonArray, updatedJsonArray);

    // Write the updated content back to the Perl file
    fs.writeFile(perlFilePath, updatedContent, 'utf8', (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      // Send a response back to the client
      res.json({ message: 'Variable added and Perl file updated successfully' });
    });
  });
});
//get key to delete
app.post('/api/delete', (req, res) => {
  const variableValueToDelete = req.body.variableName;

  const perlFilePath = '/home/docs/data/config/config.pl';
  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const regex = /@upload_accept\s*=\s*\(\s*((?:'[^']+'(?:\s*,\s*)?)*)\s*\);/s;
    const match = regex.exec(data);
    if (match) {
      const acceptableFileFormatsString = match[1];
      const acceptableFileFormats = acceptableFileFormatsString
        .split(/(?:\s*,\s*)?'([^']+)'/)
        .filter(Boolean);

      const updatedFormats = acceptableFileFormats.filter(
        format => format !== variableValueToDelete
      );

      // Rebuild the string with updated formats
      const updatedFormatsString = updatedFormats
        .map(format => `'${format}'`)
        .join(', ');

      const updatedData = data.replace(
        acceptableFileFormatsString,
        updatedFormatsString
      );

      fs.writeFile(perlFilePath, updatedData, 'utf8', (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        res.json({ message: 'Variable deleted successfully' });
      });
    } else {
      res.status(404).json({ error: 'Acceptable file formats not found' });
    }
  });
});
//get data
app.get('/api/administrators', (req, res) => {
  const perlFilePath = '/home/docs/data/config/config.pl'; 

  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const administratorsRegex = /@administrators\s*=\s*\((.*?)\);/;
    const verifySaltRegex = /\$verifySalt\s*=\s*(\d+);/;

    const administratorsMatch = administratorsRegex.exec(data);
    const verifySaltMatch = verifySaltRegex.exec(data);

    const administrators = administratorsMatch
      ? administratorsMatch[1]
          .split(',')
          .map(id => id.trim())
          .filter(Boolean)
      : [];

    const verifySalt = verifySaltMatch ? parseInt(verifySaltMatch[1]) : null;

    res.json({ administrators, verifySalt });
  });
});
//get id to add
app.post('/api/add-administrator', (req, res) => {
  const { administratorId } = req.body;

  // Read the Perl configuration file
  const perlFilePath = '/home/docs/data/config/config.pl';
  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const regex = /@administrators\s*=\s*\((.*?)\);/;
    const match = regex.exec(data);

    if (match && match[1]) {
      const administrators = match[1]
        .split(',')
        .map(id => id.trim())
        .filter(Boolean);

      // Check if the administrator ID already exists
      if (administrators.includes(administratorId)) {
        res.status(400).json({ error: 'Administrator already exists' });
        return;
      }

      // Add the new administrator ID
      administrators.push(administratorId);

      // Construct the updated administrators line
      const updatedAdministrators = `@administrators = (${administrators.join(',')});`;

      // Replace the existing administrators line with the updated one
      const updatedData = data.replace(regex, updatedAdministrators);

      // Write the updated content back to the Perl file
      fs.writeFile(perlFilePath, updatedData, 'utf8', (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }

        res.json({ message: 'Administrator added successfully' });
      });
    } else {
      res.status(404).json({ error: 'Administrators not found' });
    }
  });
});
//get id to delete
app.post('/api/delete-administrator', (req, res) => {
  const { accountId } = req.body;

  // Read the Perl configuration file
  const perlFilePath = '/home/docs/data/config/config.pl';
  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const regex = /@administrators\s*=\s*\((.*?)\);/;
    const match = regex.exec(data);

    if (match && match[1]) {
      const administrators = match[1]
        .split(',')
        .map(id => id.trim())
        .filter(Boolean);

      // Check if the administrator ID exists
      if (!administrators.includes(accountId)) {
        res.status(400).json({ error: 'Administrator does not exist' });
        return;
      }

      // Remove the administrator ID
      const updatedAdministrators = administrators.filter(id => id !== accountId);

      // Construct the updated administrators line
      const updatedAdministratorsLine = `@administrators = (${updatedAdministrators.join(',')});`;

      // Replace the existing administrators line with the updated one
      const updatedData = data.replace(regex, updatedAdministratorsLine);

      // Write the updated content back to the Perl file
      fs.writeFile(perlFilePath, updatedData, 'utf8', (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }

        res.json({ message: 'Administrator deleted successfully' });
      });
    } else {
      res.status(404).json({ error: 'Administrators not found' });
    }
  });
});
//get password to update
app.post('/api/update-verify-salt', (req, res) => {
  const newVerifySalt = req.body.verifySalt;

  // Read the Perl file
  const perlFilePath = '/home/docs/data/config/config.pl';
  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Update the verifySalt value in the Perl file content
    const updatedContent = data.replace(/\$verifySalt\s*=\s*\d+;/, `$verifySalt = ${newVerifySalt};`);

    // Write the updated content back to the Perl file
    fs.writeFile(perlFilePath, updatedContent, 'utf8', (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      // Send a response back to the client
      res.json({ message: 'verifySalt updated successfully' });
    });
  });
});
//get data
app.get('/api/separators', (req, res) => {
  const perlFilePath = '/home/docs/data/config/config.pl'; 

  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const separatorRegex = /\$separator\s*=\s*'(.*)';/;
    const separator2Regex = /\$separator2\s*=\s*'(.*)';/;
    const separatorCleanRegex = /\$separatorClean\s*=\s*'(.*)';/;
    const separator2CleanRegex = /\$separator2Clean\s*=\s*'(.*)';/;

    const separatorMatch = separatorRegex.exec(data);
    const separator2Match = separator2Regex.exec(data);
    const separatorCleanMatch = separatorCleanRegex.exec(data);
    const separator2CleanMatch = separator2CleanRegex.exec(data);

    const separator = separatorMatch ? separatorMatch[1] : '';
    const separator2 = separator2Match ? separator2Match[1] : '';
    const separatorClean = separatorCleanMatch ? separatorCleanMatch[1] : '';
    const separator2Clean = separator2CleanMatch ? separator2CleanMatch[1] : '';

    res.json({
      separator,
      separator2,
      separatorClean,
      separator2Clean
    });
  });
});
//get separator to update
app.post('/api/update-separator', (req, res) => {
  const { selectedOption, inputSep } = req.body;

  const validOptions = ['separator', 'separator2', 'separatorClean', 'separator2Clean'];
  if (!validOptions.includes(selectedOption)) {
    return res.status(400).json({ error: 'Invalid separator selected' });
  }

  // Read the Perl configuration file
  const perlFilePath = '/home/docs/data/config/config.pl';
  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const separatorRegex = new RegExp(`\\$${selectedOption}\\s*=\\s*'(.*)';`);
    const match = separatorRegex.exec(data);
    if (!match) {
      return res.status(404).json({ error: 'Separator not found' });
    }

    // Update the separator value with the new separator
    const updatedData = data.replace(match[0], `$${selectedOption} = '${inputSep}';`);

    fs.writeFile(perlFilePath, updatedData, 'utf8', (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json({ message: `Separator '${selectedOption}' updated successfully` });
    });
  });
});
//get data
app.get('/api/managed-string', (req, res) => {
  const perlFilePath = '/home/docs/data/config/config.pl'; 

  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const regex = /# manageable directories\n(\$managed = \[([\s\S]*?)\]);/;
    const match = regex.exec(data);

    if (match && match[1]) {
      const manageableDirectoriesString = match[1];
      res.json({ manageableDirectoriesString });
    } else {
      res.status(404).json({ error: 'Manageable directories not found' });
    }
  });
});
app.post('/api/update-manageable', (req, res) => {
  const { manageableDirectoriesString } = req.body;

  const perlFilePath = '/home/docs/data/config/config.pl'; 

  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const regex = /# manageable directories\n(\$managed = \[([\s\S]*?)\]);/;
    const match = regex.exec(data);

    if (match && match[1]) {
      const updatedData = data.replace(match[1], manageableDirectoriesString);

      fs.writeFile(perlFilePath, updatedData, 'utf8', (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }

        res.json({ message: 'Manageable directories updated successfully' });
      });
    } else {
      res.status(404).json({ error: 'Manageable directories not found' });
    }
  });
});
//TEST
app.get('/api/fields-string', (req, res) => {
  const perlFilePath = '/home/docs/data/config/config.pl'; 

  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const regex = /# list of fields for search and browse and sort\n(\$indexers = \{([\s\S]*?)\});/;
    const match = regex.exec(data);

    if (match && match[1]) {
      const manageableFieldsString = match[1];
      res.json({ manageableFieldsString });
    } else {
      res.status(404).json({ error: 'Manageable fields not found' });
    }
  });
});
app.post('/api/update-fields', (req, res) => {
  const { manageableFieldsString } = req.body;

  const perlFilePath = '/home/docs/data/config/config.pl'; 

  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const regex = /# list of fields for search and browse and sort\n(\$indexers = \{([\s\S]*?)\});/;
    const match = regex.exec(data);

    if (match && match[1]) {
      const updatedData = data.replace(match[1], manageableFieldsString);

      fs.writeFile(perlFilePath, updatedData, 'utf8', (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }

        res.json({ message: 'Manageable fields updated successfully' });
      });
    } else {
      res.status(404).json({ error: 'Manageable fields not found' });
    }
  });
});
app.get('/api/structure-string', (req, res) => {
  const perlFilePath = '/home/docs/data/config/config.pl'; 

  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const regex = /# how to structure uploads based on a field\n(\$uploadStructure = \{([\s\S]*?)\});/;
    const match = regex.exec(data);

    if (match && match[1]) {
      const manageableStructureString = match[1];
      res.json({ manageableStructureString });
    } else {
      res.status(404).json({ error: 'Manageable structure not found' });
    }
  });
});
app.post('/api/update-structure', (req, res) => {
  const { manageableStructureString } = req.body;

  const perlFilePath = '/home/docs/data/config/config.pl'; 

  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    const regex = /# how to structure uploads based on a field\n(\$uploadStructure = \{([\s\S]*?)\});/;
    const match = regex.exec(data);

    if (match && match[1]) {
      const updatedData = data.replace(match[1], manageableStructureString);

      fs.writeFile(perlFilePath, updatedData, 'utf8', (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }

        res.json({ message: 'Manageable structure updated successfully' });
      });
    } else {
      res.status(404).json({ error: 'Manageable structure not found' });
    }
  });
});
app.get('/api/main-string', (req, res) => {
  const perlFilePath = '/home/docs/data/config/config.pl'; 

  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const regex = /# main directory layout\n([\s\S]+?)\n};/;
    const match = regex.exec(data);

    if (match && match[1]) {
      const manageableMainString = match[1];
      res.json({ manageableMainString });
    } else {
      res.status(404).json({ error: 'Manageable main not found' });
    }
  });
});
//get key
app.post('/api/update-main', (req, res) => {
  const { manageableMainString } = req.body;

  const perlFilePath = '/home/docs/data/config/config.pl'; 

  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    const regex = /# main directory layout\n([\s\S]+?)\n};/;
    const match = regex.exec(data);

    if (match && match[1]) {
      const updatedData = data.replace(match[1], manageableMainString);

      fs.writeFile(perlFilePath, updatedData, 'utf8', (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }

        res.json({ message: 'Manageable main updated successfully' });
      });
    } else {
      res.status(404).json({ error: 'Manageable main not found' });
    }
  });
});

//fetch data
app.get('/api/upload-structureNew', (req, res) => {
  const perlFilePath = '/home/docs/data/config/config.pl'; 

  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading Perl file:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Define a regular expression to match the upload structure data in the Perl file
    const regex = /# how to structure uploads based on a field\s*\$uploadStructure\s*=\s*{([\s\S]*?)};/m;
    const match = regex.exec(data);

    if (match && match[1]) {
      const uploadStructureString = match[1];
      //console.log('Perl upload structure string:', uploadStructureString); 
      res.send(uploadStructureString);
    } else {
      // Send an error response if the section is not found
      res.status(404).json({ error: 'Upload structure not found in Perl file' });
    }
  });
});

//get new key and value to add
app.post('/api/add-upload-structureNew', (req, res) => {
  const { key, value } = req.body;

  // Read the content of the Perl file
  const perlFilePath = '/home/docs/data/config/config.pl';
  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading Perl file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const regex = /'radGeneralMaterialDesignation'\s*=>\s*{([\s\S]*?)}/;
    const match = regex.exec(data);

    if (match && match[1]) {
      let updatedData = data;
      if (data.includes(`${key}' => '${value}'`)) {
        // Key-value pair already exists, update value
        updatedData = data.replace(
          new RegExp(`'${key}' => '[^']*'`),
          `'${key}' => '${value}'`
        );
      } else {
        // Add new key-value pair
        updatedData = data.replace(
          match[1].trim(), // Trim leading/trailing whitespace
          `$&,\n      '${key}' => '${value}'`
        );
      }

      // Write the updated content back to the Perl file
      fs.writeFile(perlFilePath, updatedData, 'utf8', (err) => {
        if (err) {
          console.error('Error writing to Perl file:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        res.json({ message: 'Key-value pair added to $uploadStructure successfully' });
      });
    } else {
      return res.status(404).json({ error: 'Upload structure not found in Perl file' });
    }
  });
});

//get new value of key
app.post('/api/update-right-value', (req, res) => {
  const { key, value } = req.body;
  const configFilePath = '/home/docs/data/config/config.pl'; 

  fs.readFile(configFilePath, 'utf8', (readErr, configFileContent) => {
    if (readErr) {
      console.error('Error reading config file:', readErr);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const updatedContent = configFileContent.replace(
      new RegExp(`'${key}'\\s*=>\\s*'[^']*'`),
      `'${key}' => '${value}'`
    );

    fs.writeFile(configFilePath, updatedContent, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error updating config file:', writeErr);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.json({ message: 'Right value updated successfully' });
    });
  });
});


//get key to delete
app.post('/api/deleteManagedDir', (req, res) => {
  const { key } = req.body;
  const perlFilePath = '/home/docs/data/config/config.pl'; 
console.log(key);
  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading Perl file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const startMarker = '# manageable directories';
    const endMarker = '#EndMD';

    const startIndex = data.indexOf(startMarker);
    const endIndex = data.indexOf(endMarker);

    if (startIndex !== -1 && endIndex !== -1) {
      const section = data.substring(startIndex, endIndex + endMarker.length);
      const lines = section.split('\n');

      const cleanedKey = key.replace(/'/g, ''); // Remove single quotes
      const ck = cleanedKey.trim(); // Remove leading and trailing spaces
      const finalKey = `"${ck}"`; // Add double quotes

      const updatedLines = lines.map(line => {
        if (line.includes(ck)) {
          return ''; // Return an empty string to remove the line
        }
        return line;
      }).filter(line => line !== ''); // Filter out the empty lines

      const updatedSection = updatedLines.join('\n');
      const updatedData = data.replace(section, updatedSection);

      fs.writeFile(perlFilePath, updatedData, 'utf8', (err) => {
        if (err) {
          console.error('Error writing to Perl file:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        res.json({ message: 'Key-value pair deleted successfully' });
      });
    } else {
      return res.status(404).json({ error: 'Markers not found in Perl file' });
    }
  });
});

//get new value of key
app.post('/api/updateManagedDirs', (req, res) => {
  const { key, value } = req.body;
  const perlFilePath = '/home/docs/data/config/config.pl'; 

  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading Perl file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const startMarker = '# manageable directories';
    const endMarker = '#EndMD';

    const startIndex = data.indexOf(startMarker);
    const endIndex = data.indexOf(endMarker);

    if (startIndex !== -1 && endIndex !== -1) {
      const section = data.substring(startIndex, endIndex + endMarker.length);
      const lines = section.split('\n');
     

   
      const cleanedKey = key.replace(/'/g, ''); // Remove single quotes
      const ck = cleanedKey.trim(); // Remove leading and trailing spaces
const finalKey = `"${ck}"`; // Add double quotes

      
    
   let newU=0;
      for (let i = 2; i < lines.length-2; i++) 
      {
        if(lines[i].includes(ck))
        {
       newU=i;
        }
      }


      const updatedLines = lines.map(line => {
        if (line.includes(ck)) {
          //const updatedLine = line.replace(/(\$.*?)(\s*,\s*)([^,]*?),/g, `$1 = ${value},`);
          const c = lines[newU].split(", ");
          const updatedLine = lines[newU].replace(c[1], value) + ' ],';
          return updatedLine;
        }
        return line;
      });

      const updatedSection = updatedLines.join('\n');
      const updatedData = data.replace(section, updatedSection);

      fs.writeFile(perlFilePath, updatedData, 'utf8', (err) => {
        if (err) {
          console.error('Error writing to Perl file:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        res.json({ message: 'Right value updated successfully' });
      });
    } else {
      return res.status(404).json({ error: 'Markers not found in Perl file' });
    }
  });
});


//get key to delete 
app.post('/api/delete-upload-structureNew', (req, res) => {
  const { key } = req.body;

  // Read the content of the Perl file
  const perlFilePath = '/home/docs/data/config/config.pl';
  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading Perl file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Create a regular expression to match the key-value pair and surrounding comma
    const regex = new RegExp(`\\s*['"]${key}['"]\\s*=>\\s*['"][^'"]+['"]\\s*,?`, 'g');

    // Remove the matched line from the data
    const updatedData = data.replace(regex, '');

 

    // Write the updated content back to the Perl file
    fs.writeFile(perlFilePath, updatedData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing to Perl file:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.json({ message: 'Key-value pair deleted from $uploadStructure successfully' });
    });
  });
});

//fetch data from file
app.get('/api/upload-manageableNew', (req, res) => {
  const perlFilePath = '/home/docs/data/config/config.pl'; 

  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading Perl file:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Define a regular expression to match the upload structure data in the Perl file

    const regex = /# manageable directories\n(\$managed = \[([\s\S]*?)\]);/;
    const match = regex.exec(data);

    if (match && match[1]) {
      const uploadManageString = match[1];
      //console.log('Perl upload structure string:', uploadManageString); 
      res.send(uploadManageString);
    } else {
      // Send an error response if the section is not found
      res.status(404).json({ error: 'Upload structure not found in Perl file' });
    }
  });
});

//get key and value to add
app.post('/api/add-upload-manageableNew', (req, res) => {
  const { key, value } = req.body;

  // Read the content of the Perl file
  const perlFilePath = '/home/docs/data/config/config.pl';
  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading Perl file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const regex = /(\$managed\s*=\s*\[[^\]]*])/;
    const match = regex.exec(data);

    if (match && match[1]) {
      const updatedData = data.replace(
        match[1],
        `${match[1]},\n      [ '${key}', ${value} ]`
      );



      fs.writeFile(perlFilePath, updatedData, 'utf8', (err) => {
        if (err) {
          console.error('Error writing to Perl file:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }


        res.json({ message: 'Key-value pair added to $uploadStructure successfully' });
      });
    } else {
      return res.status(404).json({ error: 'Upload structure not found in Perl file' });
    }
  });
});






//# list of fields for search and browse and sort New
app.get('/api/upload-fieldsNew', (req, res) => {
  const perlFilePath = '/home/docs/data/config/config.pl'; 

  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading Perl file:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Define a regular expression to match the upload structure data in the Perl file

    const regex = /'main' => {([\s\S]*?)};/;
    const match = regex.exec(data);

    if (match && match[1]) {
      const uploadManageString = match[1];
   
      res.send(uploadManageString);
    } else {
      // Send an error response if the section is not found
      res.status(404).json({ error: 'Upload structure not found in Perl file' });
    }
  });
});


app.get('/api/layout-infoo', (req, res) => {
  const perlFilePath = '/home/docs/data/config/config.pl'; 

  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading Perl file:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Regular expression to match the main directory layout information
    
    const regex = /# main directory layout\n([\s\S]*?)\n# where to copy across website templates from/;
    const match = regex.exec(data);

    if (match && match[1]) {
      const layoutInfoString = match[1];
      res.send(layoutInfoString);
    } else {
      res.status(404).json({ error: 'Layout information not found in Perl file' });
    }
  });
});
app.post('/api/add-upload-ayout-infoo', (req, res) => {
  const { key, value } = req.body;

  // Read the content of the Perl file
  const perlFilePath = '/home/docs/data/config/config.pl';
  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading Perl file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const regex = /# main directory layout\n([\s\S]*?)\n# where to copy across website templates from/;
    const match = regex.exec(data);

    if (match && match[1]) {
      const updatedData = data.replace(
        match[1],
        `$&\n${key} = ${value};`
      );


      fs.writeFile(perlFilePath, updatedData, 'utf8', (err) => {
        if (err) {
          console.error('Error writing to Perl file:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }


        res.json({ message: 'Key-value pair added to $uploadStructure successfully' });
      });
    } else {
      return res.status(404).json({ error: 'Upload structure not found in Perl file' });
    }
  });
});

//get new value of key
app.post('/api/updateRightMDN', (req, res) => {
  const { key, value } = req.body;
  const perlFilePath = '/home/docs/data/config/config.pl'; 

  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading Perl file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const regex = new RegExp(`${key.replace(/\$/g, '\\$')}\\s*=\\s*([^;]*);`);
    const match = regex.exec(data);
   
    if (match && match[1] !== undefined) {
      const updatedData = data.replace(
        regex,
        `${key} = ${value};`
      );

      fs.writeFile(perlFilePath, updatedData, 'utf8', (err) => {
        if (err) {
          console.error('Error writing to Perl file:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        res.json({ message: 'Right value updated successfully' });
      });
    } else {
      return res.status(404).json({ error: 'Key not found in Perl file' });
    }
  });
});

//get key to delete
app.post('/api/deleteKeyMDN', (req, res) => {
  const { key } = req.body;
  const perlFilePath = '/home/docs/data/config/config.pl';

  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading Perl file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const regex = new RegExp(`^\\s*${key.replace(/\$/g, '\\$')}\\s*=.*$`, 'gm');
    const updatedData = data.replace(regex, '');

    fs.writeFile(perlFilePath, updatedData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing to Perl file:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.json({ message: 'Key-value pair deleted successfully' });
    });
  });
});

//get values from file
app.get('/api/website-templates', (req, res) => {
  const perlFilePath = '/home/docs/data/config/config.pl'; 

  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading Perl file:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Regular expression to match the main directory layout information
    
    const regex = /# where to copy across website templates from\n([\s\S]*?)\n#Upload locations/;
    const match = regex.exec(data);

    if (match && match[1]) {
      const layoutInfoString = match[1];
      res.send(layoutInfoString);
    } else {
      res.status(404).json({ error: 'Layout information not found in Perl file' });
    }
  });
});

//get key and value to add
app.post('/api/add-upload-website-templates', (req, res) => {
  const { key, value } = req.body;

  // Read the content of the Perl file
  const perlFilePath = '/home/docs/data/config/config.pl';
  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading Perl file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const regex = /# where to copy across website templates from\n([\s\S]*?)\n#Addition/;
    const match = regex.exec(data);

    if (match && match[1]) {
      const updatedData = data.replace(
        match[1],
        match[1].trim() + `,\n   [${key},${value}]`
      );


      fs.writeFile(perlFilePath, updatedData, 'utf8', (err) => {
        if (err) {
          console.error('Error writing to Perl file:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }


        res.json({ message: 'Key-value pair added to $uploadStructure successfully' });
      });
    } else {
      return res.status(404).json({ error: 'Upload structure not found in Perl file' });
    }
  });
});

//get key to delete
app.post('/api/deleteKeyValueTL', (req, res) => {
  const { key } = req.body;
  const perlFilePath = '/home/docs/data/config/config.pl';

  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading Perl file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const startMarker = '# where to copy across website templates from';
    const endMarker = '#Addition';

    const startIndex = data.indexOf(startMarker);
    const endIndex = data.indexOf(endMarker);

    if (startIndex !== -1 && endIndex !== -1) {
      const section = data.substring(startIndex, endIndex + endMarker.length);
      const lines = section.split('\n');

      const updatedLines = lines.filter(line => !line.includes(key));

      const updatedSection = updatedLines.join('\n');
      const updatedData = data.replace(section, updatedSection);

      fs.writeFile(perlFilePath, updatedData, 'utf8', (err) => {
        if (err) {
          console.error('Error writing to Perl file:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        res.json({ message: 'Key-value pair deleted successfully' });
      });
    } else {
      return res.status(404).json({ error: 'Markers not found in Perl file' });
    }
  });
});

//get new value and update
app.post('/api/updateRightValueTL', (req, res) => {
  const { key, value } = req.body;
  const perlFilePath = '/home/docs/data/config/config.pl'; 

  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading Perl file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const startMarker = '# where to copy across website templates from';
    const endMarker = '#Addition';

    const startIndex = data.indexOf(startMarker);
    const endIndex = data.indexOf(endMarker);

    if (startIndex !== -1 && endIndex !== -1) {
      const section = data.substring(startIndex, endIndex + endMarker.length);
      const lines = section.split('\n');

      const updatedLines = lines.map(line => {
        if (line.includes(key)) {
          const updatedLine = line.replace(/(\[.*), (.*\])/g, `$1, ${value}]`);
          return updatedLine;
        }
        return line;
      });

      const updatedSection = updatedLines.join('\n');
      const updatedData = data.replace(section, updatedSection);

      fs.writeFile(perlFilePath, updatedData, 'utf8', (err) => {
        if (err) {
          console.error('Error writing to Perl file:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        res.json({ message: 'Right value updated successfully' });
      });
    } else {
      return res.status(404).json({ error: 'Markers not found in Perl file' });
    }
  });
});

app.get('/api/locations-files', (req, res) => {
  const perlFilePath = '/home/docs/data/config/config.pl'; 

  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading Perl file:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Regular expression to match the main directory layout information
    
    const regex = /# locations of external programs and key files\n([\s\S]*?)\n# vocabulary/;
    const match = regex.exec(data);

    if (match && match[1]) {
      const layoutInfoString = match[1];
      res.send(layoutInfoString);
    } else {
      res.status(404).json({ error: 'Layout information not found in Perl file' });
    }
  });
});
//get new key and value and add
app.post('/api/add-upload-locations-files', (req, res) => {
  const { key, value } = req.body;

  // Read the content of the Perl file
  const perlFilePath = '/home/docs/data/config/config.pl';
  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading Perl file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const regex = /# locations of external programs and key files\n([\s\S]*?)\n# vocabulary/;
    const match = regex.exec(data);

    if (match && match[1]) {
      const updatedData = data.replace(
        match[1],
        `$&\n${key} = ${value};`
      );


      fs.writeFile(perlFilePath, updatedData, 'utf8', (err) => {
        if (err) {
          console.error('Error writing to Perl file:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }


        res.json({ message: 'Key-value pair added to $uploadStructure successfully' });
      });
    } else {
      return res.status(404).json({ error: 'Upload structure not found in Perl file' });
    }
  });
});

app.get('/api/voc', (req, res) => {
  const perlFilePath = '/home/docs/data/config/config.pl'; 

  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading Perl file:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Regular expression to match the main directory layout information
    
    const regex = /# vocabulary\n([\s\S]*?)\n# acceptable file formats for upload/;
    const match = regex.exec(data);

    if (match && match[1]) {
      const layoutInfoString = match[1];
      res.send(layoutInfoString);
    } else {
      res.status(404).json({ error: 'Layout information not found in Perl file' });
    }
  });
});

//get new key and value and add
app.post('/api/add-upload-voc', (req, res) => {
  const { key, value } = req.body;

  // Read the content of the Perl file
  const perlFilePath = '/home/docs/data/config/config.pl';
  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading Perl file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const regex = /# vocabulary\n([\s\S]*?)\n# vocabulary iteration one end/;
    const match = regex.exec(data);

    if (match && match[1]) {
      const updatedData = data.replace(
        match[1],
        `$&,\n   '${key}' => '${value}'`
      );


      fs.writeFile(perlFilePath, updatedData, 'utf8', (err) => {
        if (err) {
          console.error('Error writing to Perl file:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }


        res.json({ message: 'Key-value pair added to $uploadStructure successfully' });
      });
    } else {
      return res.status(404).json({ error: 'Upload structure not found in Perl file' });
    }
  });
});


//-------------------------------------------------------------------------------------------------------------
//UI side
let xslFilePath = path.resolve('/home/docs/data/config/transform.xsl');
let pageTitle = getDefaultTitleFromXSL(xslFilePath);

function getDefaultTitleFromXSL(filePath) {
  try {
    const xslContent = fs.readFileSync(filePath, 'utf8');
    const titleMatch = /<title>(.*?)<\/title>/i.exec(xslContent);
    if (titleMatch && titleMatch[1]) {
      return titleMatch[1];
    }
  } catch (error) {
    console.error('Error reading XSL file:', error);
  }
  return 'NDLTD Document Archive'; // Default title if reading XSL file fails
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/api/get-title', (req, res) => {
  res.json({ pageTitle });
});
//get new title and update 
app.post('/api/update-title', (req, res) => {
  const { newTitle } = req.body;
  pageTitle = newTitle;

  // Read the content of the XSL file
  fs.readFile(xslFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading XSL file:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Update the XSL file content with the new title
    const updatedData = data.replace(
      /<title>(.*?)<\/title>/i,
      `<title>${pageTitle}</title>`
    );

    // Write the updated content back to the XSL file
    fs.writeFile(xslFilePath, updatedData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing to XSL file:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.json({ message: 'Title updated successfully' });
    });
  });
});

app.get('/your-page', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});




///pageTitleAdminHeader
const configFilePath = path.resolve('/home/docs/data/config/transform.xsl');

app.get('/api/get-pageTitleAdminHeader', (req, res) => {
  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      res.status(500).json({ error: 'Error reading config file' });
      return;
    }

    const match = /<xsl:variable name="dynamicTitle">(.*?)<\/xsl:variable>/i.exec(data);
    if (match && match[1]) {
      const pageTitle = match[1];
      res.json({ pageTitle });
    } else {
      res.status(500).json({ error: 'pageTitle not found in config file' });
    }
  });
});

//get new title and update 
app.post('/api/update-pageTitleAdminHeader', (req, res) => {
  const newTitle = req.body.newTitle;

  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      res.status(500).json({ error: 'Error reading config file' });
      return;
    }

    const updatedData = data.replace(/<xsl:variable name="dynamicTitle">.*<\/xsl:variable>/i, `<xsl:variable name="dynamicTitle">${newTitle}</xsl:variable>`);

    fs.writeFile(configFilePath, updatedData, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error updating title in config file:', writeErr);
        res.status(500).json({ error: 'Error updating title in config file' });
        return;
      }

      res.json({ message: 'Title updated successfully' });
    });
  });
});


app.get('/api/get-bannerHome', (req, res) => {
  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      res.status(500).json({ error: 'Error reading config file' });
      return;
    }

    const match = /<xsl:variable name="index">(.*?)<\/xsl:variable>/i.exec(data);
    if (match && match[1]) {
      const pageTitle = match[1];
      res.json({ pageTitle });
    
    } else {
      res.status(500).json({ error: 'pageTitle not found in config file' });
    }
  });
});


//get new title and update 
app.post('/api/update-get-bannerHome', (req, res) => {
  const newbannerHome = req.body.newbannerHome;

  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      res.status(500).json({ error: 'Error reading config file' });
      return;
    }

    const updatedData = data.replace(/<xsl:variable name="index">.*<\/xsl:variable>/i, `<xsl:variable name="index">${newbannerHome}</xsl:variable>`);

    fs.writeFile(configFilePath, updatedData, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error updating title in config file:', writeErr);
        res.status(500).json({ error: 'Error updating title in config file' });
        return;
      }

      res.json({ message: 'Title updated successfully' });
    });
  });
});


app.get('/api/get-bannerAbout', (req, res) => {
  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      res.status(500).json({ error: 'Error reading config file' });
      return;
    }

    const match = /<xsl:variable name="about">(.*?)<\/xsl:variable>/i.exec(data);
    if (match && match[1]) {
      const pageTitle = match[1];
      res.json({ pageTitle });
    
    } else {
      res.status(500).json({ error: 'pageTitle not found in config file' });
    }
  });
});
//get new title and update 
app.post('/api/update-get-bannerAbout', (req, res) => {
  const newbannerAbout = req.body.newbannerAbout;

  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      res.status(500).json({ error: 'Error reading config file' });
      return;
    }

    const updatedData = data.replace(/<xsl:variable name="about">.*<\/xsl:variable>/i, `<xsl:variable name="about">${newbannerAbout}</xsl:variable>`);

    fs.writeFile(configFilePath, updatedData, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error updating title in config file:', writeErr);
        res.status(500).json({ error: 'Error updating title in config file' });
        return;
      }

      res.json({ message: 'Title updated successfully' });
    });
  });
});


app.get('/api/get-bannerUsers', (req, res) => {
  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      res.status(500).json({ error: 'Error reading config file' });
      return;
    }

    const match = /<xsl:variable name="users">(.*?)<\/xsl:variable>/i.exec(data);
    if (match && match[1]) {
      const pageTitle = match[1];
      res.json({ pageTitle });
    
    } else {
      res.status(500).json({ error: 'pageTitle not found in config file' });
    }
  });
});

//get new title and update 
app.post('/api/update-get-bannerUsers', (req, res) => {
  const newbannerUsers = req.body.newbannerUsers;

  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      res.status(500).json({ error: 'Error reading config file' });
      return;
    }

    const updatedData = data.replace(/<xsl:variable name="users">.*<\/xsl:variable>/i, `<xsl:variable name="users">${newbannerUsers}</xsl:variable>`);

    fs.writeFile(configFilePath, updatedData, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error updating title in config file:', writeErr);
        res.status(500).json({ error: 'Error updating title in config file' });
        return;
      }

      res.json({ message: 'Title updated successfully' });
    });
  });
});

app.get('/api/get-bannerSearch', (req, res) => {
  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      res.status(500).json({ error: 'Error reading config file' });
      return;
    }

    const match = /<xsl:variable name="search">(.*?)<\/xsl:variable>/i.exec(data);
    if (match && match[1]) {
      const pageTitle = match[1];
      res.json({ pageTitle });
    
    } else {
      res.status(500).json({ error: 'pageTitle not found in config file' });
    }
  });
});

//get new title and update 
app.post('/api/update-get-bannerSearch', (req, res) => {
  const newbannerSearch = req.body.newbannerSearch;

  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      res.status(500).json({ error: 'Error reading config file' });
      return;
    }

    const updatedData = data.replace(/<xsl:variable name="search">.*<\/xsl:variable>/i, `<xsl:variable name="search">${newbannerSearch}</xsl:variable>`);

    fs.writeFile(configFilePath, updatedData, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error updating title in config file:', writeErr);
        res.status(500).json({ error: 'Error updating title in config file' });
        return;
      }

      res.json({ message: 'Title updated successfully' });
    });
  });
});


app.get('/api/get-bannerContact', (req, res) => {
  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      res.status(500).json({ error: 'Error reading config file' });
      return;
    }

    const match = /<xsl:variable name="contact">(.*?)<\/xsl:variable>/i.exec(data);
    if (match && match[1]) {
      const pageTitle = match[1];
      res.json({ pageTitle });
    
    } else {
      res.status(500).json({ error: 'pageTitle not found in config file' });
    }
  });
});
//get new title and update 
app.post('/api/update-get-bannerContact', (req, res) => {
  const newbannerContact = req.body.newbannerContact;

  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      res.status(500).json({ error: 'Error reading config file' });
      return;
    }

    const updatedData = data.replace(/<xsl:variable name="contact">.*<\/xsl:variable>/i, `<xsl:variable name="contact">${newbannerContact}</xsl:variable>`);

    fs.writeFile(configFilePath, updatedData, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error updating title in config file:', writeErr);
        res.status(500).json({ error: 'Error updating title in config file' });
        return;
      }

      res.json({ message: 'Title updated successfully' });
    });
  });
});


app.get('/api/get-bannerLogIn', (req, res) => {
  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      res.status(500).json({ error: 'Error reading config file' });
      return;
    }

    const match = /<xsl:variable name="banner-logIn">(.*?)<\/xsl:variable>/i.exec(data);
    if (match && match[1]) {
      const pageTitle = match[1];
      res.json({ pageTitle });
    
    } else {
      res.status(500).json({ error: 'pageTitle not found in config file' });
    }
  });
});
//get new title and update 
app.post('/api/update-get-bannerLogIn', (req, res) => {
  const newbannerLogIn = req.body.newbannerLogIn;

  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      res.status(500).json({ error: 'Error reading config file' });
      return;
    }

    const updatedData = data.replace(/<xsl:variable name="banner-logIn">.*<\/xsl:variable>/i, `<xsl:variable name="banner-logIn">${newbannerLogIn}</xsl:variable>`);

    fs.writeFile(configFilePath, updatedData, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error updating title in config file:', writeErr);
        res.status(500).json({ error: 'Error updating title in config file' });
        return;
      }

      res.json({ message: 'Title updated successfully' });
    });
  });
});

app.get('/api/get-indexAdminBanner', (req, res) => {
  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      res.status(500).json({ error: 'Error reading config file' });
      return;
    }

    const match = /<xsl:variable name="indexAdminBanner">(.*?)<\/xsl:variable>/i.exec(data);
    if (match && match[1]) {
      const pageTitle = match[1];
      res.json({ pageTitle });
    
    } else {
      res.status(500).json({ error: 'pageTitle not found in config file' });
    }
  });
});

//get new title and update 
app.post('/api/update-get-indexAdminBanner', (req, res) => {
  const newindexAdminBanner = req.body.newindexAdminBanner;

  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      res.status(500).json({ error: 'Error reading config file' });
      return;
    }

    const updatedData = data.replace(/<xsl:variable name="indexAdminBanner">.*<\/xsl:variable>/i, `<xsl:variable name="indexAdminBanner">${newindexAdminBanner}</xsl:variable>`);

    fs.writeFile(configFilePath, updatedData, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error updating title in config file:', writeErr);
        res.status(500).json({ error: 'Error updating title in config file' });
        return;
      }

      res.json({ message: 'Title updated successfully' });
    });
  });
});

app.get('/api/get-SearchResults', (req, res) => {
  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      res.status(500).json({ error: 'Error reading config file' });
      return;
    }

    const match = /<xsl:variable name="SearchResults">(.*?)<\/xsl:variable>/i.exec(data);
    if (match && match[1]) {
      const pageTitle = match[1];
      res.json({ pageTitle });
    
    } else {
      res.status(500).json({ error: 'pageTitle not found in config file' });
    }
  });
});
//get new title and update 
app.post('/api/update-get-SearchResults', (req, res) => {
  const newSearchResults = req.body.newSearchResults;

  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      res.status(500).json({ error: 'Error reading config file' });
      return;
    }

    const updatedData = data.replace(/<xsl:variable name="SearchResults">.*<\/xsl:variable>/i, `<xsl:variable name="SearchResults">${newSearchResults}</xsl:variable>`);

    fs.writeFile(configFilePath, updatedData, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error updating title in config file:', writeErr);
        res.status(500).json({ error: 'Error updating title in config file' });
        return;
      }

      res.json({ message: 'Title updated successfully' });
    });
  });
});

app.get('/api/get-SearcTermsIn', (req, res) => {
  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      res.status(500).json({ error: 'Error reading config file' });
      return;
    }

    const match = /<xsl:variable name="SearchTermsIn">(.*?)<\/xsl:variable>/i.exec(data);
    if (match && match[1]) {
      const pageTitle = match[1];
      res.json({ pageTitle });
    
    } else {
      res.status(500).json({ error: 'pageTitle not found in config file' });
    }
  });
});

//get new title and update 
app.post('/api/update-get-SearcTermsIn', (req, res) => {
  const newSearchTermsIn = req.body.newSearchTermsIn;

  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      res.status(500).json({ error: 'Error reading config file' });
      return;
    }

    const updatedData = data.replace(/<xsl:variable name="SearchTermsIn">.*<\/xsl:variable>/i, `<xsl:variable name="SearchTermsIn">${newSearchTermsIn}</xsl:variable>`);

    fs.writeFile(configFilePath, updatedData, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error updating title in config file:', writeErr);
        res.status(500).json({ error: 'Error updating title in config file' });
        return;
      }

      res.json({ message: 'Title updated successfully' });
    });
  });
});


app.get('/api/get-SearchHeading', (req, res) => {
  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      res.status(500).json({ error: 'Error reading config file' });
      return;
    }

    const match = /<xsl:variable name="SearchHeading">(.*?)<\/xsl:variable>/i.exec(data);
    if (match && match[1]) {
      const pageTitle = match[1];
      res.json({ pageTitle });
    
    } else {
      res.status(500).json({ error: 'pageTitle not found in config file' });
    }
  });
});
//get new title and update 
app.post('/api/update-get-SearchHeading', (req, res) => {
  const newSearchHeading = req.body.newSearchHeading;

  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      res.status(500).json({ error: 'Error reading config file' });
      return;
    }

    const updatedData = data.replace(/<xsl:variable name="SearchHeading">.*<\/xsl:variable>/i, `<xsl:variable name="SearchHeading">${newSearchHeading}</xsl:variable>`);

    fs.writeFile(configFilePath, updatedData, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error updating title in config file:', writeErr);
        res.status(500).json({ error: 'Error updating title in config file' });
        return;
      }

      res.json({ message: 'Title updated successfully' });
    });
  });
});

app.get('/api/get-BrowseCollectionsHeading', (req, res) => {
  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      res.status(500).json({ error: 'Error reading config file' });
      return;
    }

    const match = /<xsl:variable name="BrowseCollectionsHeading">(.*?)<\/xsl:variable>/i.exec(data);
    if (match && match[1]) {
      const pageTitle = match[1];
      res.json({ pageTitle });
    
    } else {
      res.status(500).json({ error: 'pageTitle not found in config file' });
    }
  });
});


//get new title and update 
app.post('/api/update-get-BrowseCollectionsHeading', (req, res) => {
  const newBrowseCollectionsHeading = req.body.newBrowseCollectionsHeading;

  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      res.status(500).json({ error: 'Error reading config file' });
      return;
    }

    const updatedData = data.replace(/<xsl:variable name="BrowseCollectionsHeading">.*<\/xsl:variable>/i, `<xsl:variable name="BrowseCollectionsHeading">${newBrowseCollectionsHeading}</xsl:variable>`);

    fs.writeFile(configFilePath, updatedData, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error updating title in config file:', writeErr);
        res.status(500).json({ error: 'Error updating title in config file' });
        return;
      }

      res.json({ message: 'Title updated successfully' });
    });
  });
});


//get current title 
app.get('/api/get-AboutHeading', (req, res) => {
  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      res.status(500).json({ error: 'Error reading config file' });
      return;
    }

    const match = /<xsl:variable name="AboutHeading">(.*?)<\/xsl:variable>/i.exec(data);
    if (match && match[1]) {
      const pageTitle = match[1];
      res.json({ pageTitle });
    
    } else {
      res.status(500).json({ error: 'pageTitle not found in config file' });
    }
  });
});

//get new title and update
app.post('/api/update-get-AboutHeading', (req, res) => {
  const newAboutHeading = req.body.newAboutHeading;

  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      res.status(500).json({ error: 'Error reading config file' });
      return;
    }

    const updatedData = data.replace(/<xsl:variable name="AboutHeading">.*<\/xsl:variable>/i, `<xsl:variable name="AboutHeading">${newAboutHeading}</xsl:variable>`);

    fs.writeFile(configFilePath, updatedData, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error updating title in config file:', writeErr);
        res.status(500).json({ error: 'Error updating title in config file' });
        return;
      }

      res.json({ message: 'Title updated successfully' });
    });
  });
});

//get current description from file
app.get('/api/get-AboutDesc', (req, res) => {
  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      res.status(500).json({ error: 'Error reading config file' });
      return;
    }

    const match = /<xsl:variable name="AboutDesc">(.*?)<\/xsl:variable>/i.exec(data);
    if (match && match[1]) {
      const pageTitle = match[1];
      res.json({ pageTitle });
    
    } else {
      res.status(500).json({ error: 'pageTitle not found in config file' });
    }
  });
});

//get new description
app.post('/api/update-get-AboutDesc', (req, res) => {
  const newAboutDesc = req.body.newAboutDesc;

  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      res.status(500).json({ error: 'Error reading config file' });
      return;
    }

    const updatedData = data.replace(/<xsl:variable name="AboutDesc">.*<\/xsl:variable>/i, `<xsl:variable name="AboutDesc">${newAboutDesc}</xsl:variable>`);

    fs.writeFile(configFilePath, updatedData, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error updating title in config file:', writeErr);
        res.status(500).json({ error: 'Error updating title in config file' });
        return;
      }

      res.json({ message: 'Title updated successfully' });
    });
  });
});



//IMAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/home/docs/data/website/images'); 
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); 
  },
});

const upload = multer({ storage });

app.post('/api/upload', upload.single('image'), (req, res) => {
  res.json({ message: 'Image uploaded successfully' });
});


//Image names 
app.get('/api/getImageNames', (req, res) => {
  fs.readdir( '/home/docs/data/website/images', (err, files) => {
    if (err) {
      console.error('Error reading image directory:', err);
      res.status(500).json({ error: 'Error reading image directory' });
    } else {
      const imageNames = files.filter(file => {
        const extension = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif'].includes(extension);
      });
      res.json({ imageNames });
    }
  });
});

app.post('/api/update-get-Image', (req, res) => {
  const selectedImage = req.body.selectedImage;

  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      res.status(500).json({ error: 'Error reading config file' });
      return;
    }

    const updatedData = data.replace(/<xsl:variable name="imageFileName">.*<\/xsl:variable>/i, `<xsl:variable name="imageFileName">${selectedImage}</xsl:variable>`);

    fs.writeFile(configFilePath, updatedData, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error updating title in config file:', writeErr);
        res.status(500).json({ error: 'Error updating title in config file' });
        return;
      }

      res.json({ message: 'Title updated successfully' });
    });
  });
});

app.get('/api/get-currImage', (req, res) => {
  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      res.status(500).json({ error: 'Error reading config file' });
      return;
    }

    const match = /<xsl:variable name="imageFileName">(.*?)<\/xsl:variable>/i.exec(data);
    if (match && match[1]) {
      const pageTitle = match[1];
      res.json({ pageTitle });
    
    } else {
      res.status(500).json({ error: 'pageTitle not found in config file' });
    }
  });
});



//CSS
const cssFilePath = path.join('/home/docs/data/website/styles/style.css');

app.get('/api/css', (req, res) => {
  fs.readFile(cssFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading CSS file:', err);
      res.status(500).send('Internal Server Error');
    } else {
      const fontRule = data.match(/body\s*\{([^}]+)\}/)[1];
      res.json({ fontCss: fontRule });
    }
  });
});


//get font to update
app.post('/api/update-css', (req, res) => {
  const { fontSize, fontFamily } = req.body;

  fs.readFile(cssFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading CSS file:', err);
      res.status(500).send('Internal Server Error');
    } else {
      const updatedCss = data.replace(/font:\s*\d+pt\s*([^;]+)/, `font: ${fontSize} ${fontFamily}`);
      
      fs.writeFile(cssFilePath, updatedCss, 'utf8', err => {
        if (err) {
          console.error('Error writing to CSS file:', err);
          res.status(500).send('Internal Server Error');
        } else {
          res.status(200).send('CSS Updated Successfully');
        }
      });
    }
  });
});

//fetch colour
app.get('/api/bannerbordercolor', (req, res) => {
  fs.readFile(cssFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading CSS file:', err);
      res.status(500).send('Internal Server Error');
    } else {
      const bannerBorderColorMatch = data.match(/\.banner\s*\{[^}]*border-bottom-color:\s*([\w#]+);/);
      const bannerBorderColor = bannerBorderColorMatch ? bannerBorderColorMatch[1] : null;

      res.json({ bannerBorderColor });
    }
  });
});

//get colour to update
app.post('/api/bannerbordercolor', (req, res) => {
  const { bannerBorderColor } = req.body;

  fs.readFile(cssFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading CSS file:', err);
      res.status(500).send('Internal Server Error');
    } else {
      const bannerBorderColorMatch = data.match(/\.banner\s*\{[^}]*border-bottom-color:\s*([\w#]+);/);
      const originalBannerBorderColor = bannerBorderColorMatch ? bannerBorderColorMatch[1] : null;
      
      if (originalBannerBorderColor) {
        const updatedCss = data.replace(originalBannerBorderColor, bannerBorderColor);
        
        fs.writeFile(cssFilePath, updatedCss, 'utf8', err => {
          if (err) {
            console.error('Error writing to CSS file:', err);
            res.status(500).send('Internal Server Error');
          } else {
            res.status(200).send('Banner Border Color Updated Successfully');
          }
        });
      } else {
        res.status(400).send('Banner Border Color Property Not Found');
      }
    }
  });
});


app.get('/api/collectionboxcolor', (req, res) => {
  fs.readFile(cssFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading CSS file:', err);
      res.status(500).send('Internal Server Error');
    } else {
      const bannerBorderColorMatch = data.match(/\.collectionbox\s*\{[^}]*background:\s*([\w#]+);/);
      const bannerBorderColor = bannerBorderColorMatch ? bannerBorderColorMatch[1] : null;

      res.json({ bannerBorderColor });
    }
  });
});



//get colour to update
app.post('/api/collectionboxcolor', (req, res) => {
  const { collectionboxcolor } = req.body;

  fs.readFile(cssFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading CSS file:', err);
      res.status(500).send('Internal Server Error');
    } else {
      const bannerBorderColorMatch = data.match(/\.collectionbox\s*\{[^}]*background:\s*([\w#]+);/);
      const SearchMenuColorMatch = data.match(/\.searchmenu\s*\{[^}]*background:\s*([\w#]+);/);

      const originalBannerBorderColor = bannerBorderColorMatch ? bannerBorderColorMatch[1] : null;
      const originalSearchMenuColor= SearchMenuColorMatch ? SearchMenuColorMatch[1] : null;
      
      if (originalBannerBorderColor) {
       

        const updatedCss = data
        .replace(originalBannerBorderColor, collectionboxcolor)
        .replace(originalSearchMenuColor, collectionboxcolor);
        
        fs.writeFile(cssFilePath, updatedCss, 'utf8', err => {
          if (err) {
            console.error('Error writing to CSS file:', err);
            res.status(500).send('Internal Server Error');
          } else {
            res.status(200).send('Banner Border Color Updated Successfully');
          }
        });
      } else {
        res.status(400).send('Banner Border Color Property Not Found');
      }
    }
  });
});


//fetch title from file
app.get('/api/collectiontitle', (req, res) => {
  fs.readFile(cssFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading CSS file:', err);
      res.status(500).send('Internal Server Error');
    } else {
      const bannerBorderColorMatch = data.match(/\.collectiontitle\s*\{[^}]*color:\s*([\w#]+);/);
      const bannerBorderColor = bannerBorderColorMatch ? bannerBorderColorMatch[1] : null;

      res.json({ bannerBorderColor });
    }
  });
});


//get title to update
app.post('/api/collectiontitle', (req, res) => {
  const { collectiontitle } = req.body;

  fs.readFile(cssFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading CSS file:', err);
      res.status(500).send('Internal Server Error');
    } else {
      const bannerBorderColorMatch = data.match(/\.collectiontitle\s*\{[^}]*color:\s*([\w#]+);/);
      const originalBannerBorderColor = bannerBorderColorMatch ? bannerBorderColorMatch[1] : null;
      
      if (originalBannerBorderColor) {
        const updatedCss = data.replace(originalBannerBorderColor, collectiontitle);
        
        fs.writeFile(cssFilePath, updatedCss, 'utf8', err => {
          if (err) {
            console.error('Error writing to CSS file:', err);
            res.status(500).send('Internal Server Error');
          } else {
            res.status(200).send('Banner Border Color Updated Successfully');
          }
        });
      } else {
        res.status(400).send('Banner Border Color Property Not Found');
      }
    }
  });
});


//get title from file
app.get('/api/linesection', (req, res) => {
  fs.readFile(cssFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading CSS file:', err);
      res.status(500).send('Internal Server Error');
    } else {
      const bannerBorderColorMatch = data.match(/\.linesection\s*\{[^}]*border-bottom-color:\s*([\w#]+);/);
      const bannerBorderColor = bannerBorderColorMatch ? bannerBorderColorMatch[1] : null;

      res.json({ bannerBorderColor });
    }
  });
});


//fetch new title
app.post('/api/linesection', (req, res) => {
  const { linesection } = req.body;

  fs.readFile(cssFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading CSS file:', err);
      res.status(500).send('Internal Server Error');
    } else {
      const bannerBorderColorMatch = data.match(/\.linesection\s*\{[^}]*border-bottom-color:\s*([\w#]+);/);
      const ImagePaneColorMatch = data.match(/\.imagepane\s*\{[^}]*border-bottom-color:\s*([\w#]+);/);
      const originalBannerBorderColor = bannerBorderColorMatch ? bannerBorderColorMatch[1] : null;
      const originalImagePaneColor = ImagePaneColorMatch ? ImagePaneColorMatch[1] : null;
      
      if (originalBannerBorderColor) {
        // Modify both banner and imagepane colors in the CSS content
        const updatedCss = data
          .replace(originalBannerBorderColor, linesection)
          .replace(originalImagePaneColor, linesection);

        fs.writeFile(cssFilePath, updatedCss, 'utf8', err => {
          if (err) {
            console.error('Error writing to CSS file:', err);
            res.status(500).send('Internal Server Error');
          } else {
            res.status(200).send('Banner Border Color Updated Successfully');
          }
        });
      } else {
        res.status(400).send('Banner Border Color Property Not Found');
      }
    }
  });
});
//api/update-upload-locations-files
app.post('/api/update-upload-locations-files', (req, res) => {
  const { key, value } = req.body;
  const perlFilePath = '/home/docs/data/config/config.pl'; 

  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading Perl file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const lines = data.split('\n');
    const updatedLines = lines.map(line => {
      if (line.includes(`${key} = `)) {
        const updatedLine = `${key} = ${value}`;
        return updatedLine;
      }
      return line;
    });

    const updatedData = updatedLines.join('\n');

    fs.writeFile(perlFilePath, updatedData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing to Perl file:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.json({ message: 'Right value updated successfully' });
    });
  });
});

app.post('/api/deleteLocationFile', (req, res) => {
  const { key } = req.body;
  const perlFilePath = '/home/docs/data/config/config.pl'; 

  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading Perl file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const lines = data.split('\n');
    const updatedLines = lines.filter(line => !line.includes(`${key} = `));

    const updatedData = updatedLines.join('\n');

    fs.writeFile(perlFilePath, updatedData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing to Perl file:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.json({ message: 'Key deleted successfully' });
    });
  });
});

//api/update-upload-voc
app.post('/api/update-upload-voc', (req, res) => {
  const { key, value } = req.body;
  const perlFilePath = '/home/docs/data/config/config.pl'; 

  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading Perl file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const startMarker = '# vocabulary\n$vocab = {';
    const endMarker = '# vocabulary iteration one end';

    const startIndex = data.indexOf(startMarker);
    const endIndex = data.indexOf(endMarker);

    if (startIndex !== -1 && endIndex !== -1) {
      const section = data.substring(startIndex, endIndex + endMarker.length);
      const lines = section.split('\n');

      const cleanedKey = key.replace(/'/g, ''); // Remove single quotes
      const ck = cleanedKey.trim(); // Remove leading and trailing spaces

      const updatedLines = lines.map(line => {
        if (line.includes(ck)) {
          const updatedLine = `${key} => ${value}`;
          return updatedLine;
        }
        return line;
      });

      const updatedSection = updatedLines.join('\n');
      const updatedData = data.replace(section, updatedSection);

      fs.writeFile(perlFilePath, updatedData, 'utf8', (err) => {
        if (err) {
          console.error('Error writing to Perl file:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        res.json({ message: 'Right value updated successfully' });
      });
    } else {
      return res.status(404).json({ error: 'Markers not found in Perl file' });
    }
  });
});


//fetch key to delete
app.post('/api/delete-upload-voc', (req, res) => {
  const { key } = req.body;

const newKey = key.trim();

  const perlFilePath = '/home/docs/data/config/config.pl'; 

  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading Perl file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const startMarker = '# vocabulary\n$vocab = {';
    const endMarker = '# vocabulary iteration one end';

    const startIndex = data.indexOf(startMarker);
    const endIndex = data.indexOf(endMarker);

    if (startIndex !== -1 && endIndex !== -1) {
      const section = data.substring(startIndex, endIndex + endMarker.length);
      const lines = section.split('\n');

      const updatedLines = lines.filter(line => !line.includes(`${newKey}`)); // Remove the line containing the key

      const updatedSection = updatedLines.join('\n');
      const updatedData = data.replace(section, updatedSection);

      fs.writeFile(perlFilePath, updatedData, 'utf8', (err) => {
        if (err) {
          console.error('Error writing to Perl file:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        res.json({ message: 'Key-value pair deleted successfully' });
      });
    } else {
      return res.status(404).json({ error: 'Markers not found in Perl file' });
    }
  });
});




//FieldSort server (ALL)
app.post('/api/update-fieldMain', (req, res) => {
  const { key, value } = req.body;
  let fieldSearchData = getFieldSearchData();
  if (fieldSearchData !== null) {
    // Update the field_search data with the new key-value pair
    const regex = new RegExp(`\\b${key}\\b\\s*=>\\s*'.*?'`);
    if (regex.test(fieldSearchData)) {
      fieldSearchData = fieldSearchData.replace(regex, `${key} => ${value}`);
      updateFieldSearchData(fieldSearchData);
      res.json({ message: 'Key-value pair updated successfully' });
    } else {
      res.status(404).json({ error: 'Key not found in field search data' });
    }
  } else {
    res.status(404).json({ error: 'Field search data not found in Perl file' });
  }
});
const configFile = '/home/docs/data/config/config.pl'; 

const getFieldSearchData = () => {
  const data = fs.readFileSync(configFile, 'utf8');
  const regex = /'field_search' => {([\s\S]*?)};/;
  const match = regex.exec(data);

  if (match && match[1]) {
    return match[1];
  }
  return null;
};


//Fetch new attribute 
app.post('/api/add-fieldMain', (req, res) => {
  const { key, value } = req.body;
  let configFileData = fs.readFileSync(configFile, 'utf8');

  if (configFileData) {
    const updatedFieldSearchData = addToFieldSearchData(key, value, configFileData);

    if (updatedFieldSearchData !== null) {
      fs.writeFileSync(configFile, updatedFieldSearchData, 'utf8');
      res.json({ message: 'Key-value pair added successfully' });
    } else {
      res.status(500).json({ error: 'Error adding key-value pair' });
    }
  } else {
    res.status(404).json({ error: 'Configuration file not found' });
  }
});


//Add to field search
function addToFieldSearchData(key, value, configFileData) {
  const regex = /'field_search'\s*=>\s*\{([\s\S]*?)\}/;
  const match = regex.exec(configFileData);

  if (match && match[1]) {
    const fieldSearchString = match[1];
    const newKeyValuePair = `  ${key} => '${value}',\n`;
    const updatedFieldSearchString = `${newKeyValuePair}${fieldSearchString}`;
    const updatedConfigData = configFileData.replace(match[0], `'field_search' => {\n${updatedFieldSearchString}\n}`);
    return updatedConfigData;
  }

  return null;
}


//Update data
const updateFieldSearchData = (newFieldSearchData) => {
  const data = fs.readFileSync(configFile, 'utf8');
  const updatedData = data.replace(/'field_search' => {[\s\S]*?};/, `'field_search' => {\n${newFieldSearchData}\n};`);
  
  fs.writeFileSync(configFile, updatedData, 'utf8');
};


//Fetch key
app.post('/api/delete-fieldMain', (req, res) => {
  const { key } = req.body;
  let configFileData = fs.readFileSync(configFile, 'utf8');

  if (configFileData) {
    const updatedFieldSearchData = deleteFromFieldSearchData(key, configFileData);

    if (updatedFieldSearchData !== null) {
      fs.writeFileSync(configFile, updatedFieldSearchData, 'utf8');
      res.json({ message: 'Key-value pair deleted successfully' });
    } else {
      res.status(500).json({ error: 'Error deleting key-value pair' });
    }
  } else {
    res.status(404).json({ error: 'Configuration file not found' });
  }
});


//delete attribute from field search
function deleteFromFieldSearchData(key, configFileData) {
  const regex = /'field_search'\s*=>\s*\{([\s\S]*?)\}/;
  const match = regex.exec(configFileData);

  if (match && match[1]) {
    const fieldSearchString = match[1];
    const keyRegex = new RegExp(`\\b${key}\\b\\s*=>\\s*'.*?',?\\n?`);
    const updatedFieldSearchString = fieldSearchString.replace(keyRegex, '');
    const updatedConfigData = configFileData.replace(match[0], `'field_search' => {\n${updatedFieldSearchString}\n}`);
    return updatedConfigData;
  }

  return null;
}


//Browse sort new 
app.get('/api/browse-fieldsNew', (req, res) => {
  const perlFilePath = '/home/docs/data/config/config.pl'; 

  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading Perl file:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const regex = /'field_browse'\s*=>\s*\[\s*((?:\[[^\]]*\](?:\s*,\s*)?)*)\s*\]/;
    const match = regex.exec(data);

    if (match && match[1]) {
      const fieldBrowseString = match[1];
      const fieldBrowseData = fieldBrowseString
        .split(/\s*\]\s*,\s*\[/)
        .map((item) => {
          const [, firstPart] = item.match(/'([^']+)'/);
          return firstPart;
        });

      res.json(fieldBrowseData);
    } else {
      res.status(404).json({ error: 'Field browse data not found in Perl file' });
    }
  });
});


//Fetch key to add 
app.post('/api/update-browse', (req, res) => {
  const { leftValue } = req.body;
  const perlFilePath = '/home/docs/data/config/config.pl';

  fs.readFile(perlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading Perl file:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const updatedData = addEntryToBrowse(data, leftValue);

    if (updatedData !== null) {
      fs.writeFileSync(perlFilePath, updatedData, 'utf8');
      res.json({ message: 'Browse data updated successfully' });
    } else {
      res.status(500).json({ error: 'Error updating browse data' });
    }
  });
});


//Fetch key to add function
function addEntryToBrowse(data, leftValue) {
  const lines = data.split('\n');
  let isInFieldBrowse = false;
  let newLines = [];
  const capitalizedLeftValue = leftValue.charAt(0).toUpperCase() + leftValue.slice(1);
  for (const line of lines) {
    if (line.includes('#FieldBrowseStart')) {
      isInFieldBrowse = true;
    }

    if (isInFieldBrowse) {
      if (line.includes('[')) {
        // Insert the new entry after the opening bracket '['
        newLines.push(line); // Keep the original opening bracket line
        newLines.push(`  [ ${leftValue}, '${capitalizedLeftValue}', '${leftValue}' ],`);
        isInFieldBrowse = false;
      } else {
        newLines.push(line); // Preserve the existing lines within field_browse
      }
    } else {
      newLines.push(line);
    }
  }

  return newLines.join('\n');
}




//Fetch key to delete
app.post('/api/delete-field-browse', (req, res) => {
  const { key } = req.body;
  let configFileData = fs.readFileSync(configFile, 'utf8');

  if (configFileData) {
    const updatedConfigData = deleteEntryFromFieldBrowse(key, configFileData);

    if (updatedConfigData !== null) {
      fs.writeFileSync(configFile, updatedConfigData, 'utf8');
      res.json({ message: 'Element deleted successfully' });
    } else {
      res.status(500).json({ error: 'Error deleting element' });
    }
  } else {
    res.status(404).json({ error: 'Configuration file not found' });
  }
});


//Delete field browse attribute 
function deleteEntryFromFieldBrowse(key, configFileData) {
  const startMarker = "#FieldBrowseStart";
  const endMarker = "#FieldBrowseEND";

  const startIndex = configFileData.indexOf(startMarker);
  const endIndex = configFileData.indexOf(endMarker);

  if (startIndex !== -1 && endIndex !== -1) {
    const section = configFileData.substring(startIndex, endIndex + endMarker.length);

    // Split the section into lines and filter out the line containing the key
    const lines = section.split('\n').filter(line => !line.includes(`${key}`));

    // Reconstruct the section
    const updatedSection = lines.join('\n');

    // Replace the old section with the updated one in the entire config data
    const updatedConfigData = configFileData.replace(section, updatedSection);

    return updatedConfigData;
  }

  return null;
}


app.get('/api/get-htmlHeadertitle', (req, res) => {
  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      res.status(500).json({ error: 'Error reading config file' });
      return;
    }

    const match = /<xsl:variable name="dynamicTitleHtmlHeader">(.*?)<\/xsl:variable>/i.exec(data);
    if (match && match[1]) {
      const pageTitle = match[1];
      res.json({ pageTitle });
    
    } else {
      res.status(500).json({ error: 'pageTitle not found in config file' });
    }
  });
});

//get new title and update 
app.post('/api/update-get-htmlHeadertitle', (req, res) => {
  const newHtml = req.body.newHtml;

  fs.readFile(configFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      res.status(500).json({ error: 'Error reading config file' });
      return;
    }

    const updatedData = data.replace(/<xsl:variable name="dynamicTitleHtmlHeader">.*<\/xsl:variable>/i, `<xsl:variable name="dynamicTitleHtmlHeader">${newHtml}</xsl:variable>`);

    fs.writeFile(configFilePath, updatedData, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error updating title in config file:', writeErr);
        res.status(500).json({ error: 'Error updating title in config file' });
        return;
      }

      res.json({ message: 'Title updated successfully' });
    });
  });
});