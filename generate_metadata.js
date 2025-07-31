const fs = require('fs');
const path = require('path');

function getFilesInfo(dir, extensions) {
  return fs.readdirSync(dir)
    .filter(file => extensions.some(ext => file.endsWith(ext)))
    .map(file => {
      const stats = fs.statSync(path.join(dir, file));
      return {
        name: file,
        type: file.endsWith('.m3u') ? 'm3u' : 'epg',
        size: stats.size,
        updated: stats.mtime.toISOString()
      };
    });
}

function generateMetadata() {
  const files = getFilesInfo(__dirname, ['.m3u', '.xml.gz']);
  
  const metadata = {
    generated_at: new Date().toISOString(),
    next_update: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    m3u_count: files.filter(f => f.type === 'm3u').length,
    epg_count: files.filter(f => f.type === 'epg').length,
    total_files: files.length
  };

  fs.writeFileSync('files_metadata.json', JSON.stringify({ metadata, files }, null, 2));
  console.log('✅ Metadados gerados com sucesso!');
}

generateMetadata();