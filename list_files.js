const fs = require('fs');
const path = require('path');

function listFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        fileList.push(`Directory: ${filePath}`);
        listFiles(filePath, fileList);
      }
    } else {
      if (!file.endsWith('.lock') && file !== '.env') {
        fileList.push(`File: ${filePath}`);
        const content = fs.readFileSync(filePath, 'utf8');
        fileList.push('Content:');
        fileList.push(content);
        fileList.push('---END OF FILE---');
      }
    }
  });
  return fileList;
}

const projectFiles = listFiles('.');
fs.writeFileSync('project_files.txt', projectFiles.join('\n'), 'utf8');
console.log('Project file listing created in project_files.txt');