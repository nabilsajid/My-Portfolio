const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
let hasError = false;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const importRegex = /import\s+.*?\s+from\s+['"](.*?)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (importPath.startsWith('.')) {
      const dir = path.dirname(file);
      let targetPath = path.join(dir, importPath);
      
      // try adding extensions
      const exts = ['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx'];
      let foundExact = false;
      let actualCase = null;
      
      for (const ext of ['', ...exts]) {
        const checkPath = targetPath + ext;
        try {
          const dirPath = path.dirname(checkPath);
          const baseName = path.basename(checkPath);
          const filesInDir = fs.readdirSync(dirPath);
          if (filesInDir.includes(baseName)) {
            foundExact = true;
            break;
          }
        } catch (e) {
          // ignore
        }
      }
      
      if (!foundExact) {
        // try to find case insensitive match
        for (const ext of ['', ...exts]) {
          const checkPath = targetPath + ext;
          try {
            const dirPath = path.dirname(checkPath);
            const baseName = path.basename(checkPath);
            const filesInDir = fs.readdirSync(dirPath);
            const insensitiveMatch = filesInDir.find(f => f.toLowerCase() === baseName.toLowerCase());
            if (insensitiveMatch && insensitiveMatch !== baseName) {
              console.error(`Case mismatch in ${file}: imported '${importPath}', actual file is '${insensitiveMatch}'`);
              hasError = true;
              break;
            }
          } catch (e) {}
        }
      }
    }
  }
});

if (!hasError) console.log("No case mismatches found.");
