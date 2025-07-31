// Importa o módulo 'fs' (File System) do Node.js, usado para ler e escrever arquivos e diretórios
const fs = require('fs');

// Importa o módulo 'path' do Node.js, usado para trabalhar com caminhos de arquivos de forma segura
const path = require('path');

/**
 * Função que obtém informações dos arquivos de um diretório com base nas extensões fornecidas
 * @param {string} dir - Caminho do diretório onde os arquivos serão procurados
 * @param {Array} extensions - Lista de extensões que queremos filtrar (ex: ['.m3u', '.xml.gz'])
 * @returns {Array} - Retorna um array de objetos contendo dados dos arquivos encontrados
 */
function getFilesInfo(dir, extensions) {
  return fs.readdirSync(dir) // Lê de forma síncrona todos os arquivos do diretório especificado
    .filter(file => 
      extensions.some(ext => file.endsWith(ext)) // Filtra apenas arquivos que terminam com as extensões desejadas
    )
    .map(file => {
      const stats = fs.statSync(path.join(dir, file)); // Obtém estatísticas (tamanho, data de modificação, etc.) do arquivo

      return {
        name: file, // Nome do arquivo
        type: file.endsWith('.m3u') ? 'm3u' : 'epg', // Define o tipo do arquivo como 'm3u' ou 'epg'
        size: stats.size, // Tamanho do arquivo em bytes
        updated: stats.mtime.toISOString() // Data da última modificação convertida para string no formato ISO
      };
    });
}

/**
 * Função principal que gera o arquivo 'files_metadata.json' com os metadados de todos os arquivos
 */
function generateMetadata() {
  // Chama a função getFilesInfo buscando arquivos .m3u e .xml.gz no diretório atual
  const files = getFilesInfo(__dirname, ['.m3u', '.xml.gz']);

  // Cria um objeto contendo os metadados gerais
  const metadata = {
    generated_at: new Date().toISOString(), // Data e hora atual da geração no formato ISO
    next_update: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Data e hora do próximo update (em 24h)
    m3u_count: files.filter(f => f.type === 'm3u').length, // Quantidade de arquivos tipo 'm3u'
    epg_count: files.filter(f => f.type === 'epg').length, // Quantidade de arquivos tipo 'epg'
    total_files: files.length // Total de arquivos encontrados
  };

  // Escreve o arquivo 'files_metadata.json' com os dados formatados (2 espaços de indentação)
  fs.writeFileSync('files_metadata.json', JSON.stringify({ metadata, files }, null, 2));

  // Exibe mensagem no console indicando sucesso
  console.log('✅ Metadados gerados com sucesso!');
}

// Chama a função principal para iniciar o processo
generateMetadata();


/*
==============================================
 MÓDULOS NECESSÁRIOS PARA A EXECUÇÃO DO SCRIPT
==============================================
*/

// Importa o módulo 'fs' (File System) que permite interagir com o sistema de arquivos,
// como ler, escrever e verificar existência de arquivos e diretórios.
// Exemplo de uso: fs.readFileSync('arquivo.txt');
/*
const fs = require('fs');
*/

// Importa o módulo 'path' que auxilia na manipulação de caminhos de arquivos e diretórios,
// como criar caminhos absolutos ou relativos de forma segura entre sistemas operacionais.
/*
const path = require('path');
*/

/*
==============================================
 LISTA DE ARQUIVOS ESPERADOS
==============================================

Aqui está definida uma lista com os nomes exatos dos arquivos que o script espera encontrar.
Esses arquivos são verificados um a um, e, caso existam, serão adicionados à lista de saída com metadados.
Arquivos ausentes são ignorados silenciosamente.

Extensões:
- `.m3u` são arquivos de playlists de IPTV.
- `.xml.gz` são arquivos EPG (Guia de Programação Eletrônica) compactados.
*/
/*
const expectedFiles = [
    'epgbrasil.m3u',
    'epgbrasilportugal.m3u',
    'epgportugal.m3u',
    'PiauiTV.m3u',
    'm3u@proton.me.m3u',
    'playlist.m3u',
    'playlists.m3u',
    'pornstars.m3u',
    'epgbrasil.xml.gz',
    'epgbrasilportugal.xml.gz',
    'epgportugal.xml.gz'
];
*/

/*
==============================================
 FUNÇÃO PRINCIPAL: generateMetadata
==============================================

Essa função verifica quais arquivos existem na lista `expectedFiles` e coleta dados como:
- Nome
- Tipo (m3u ou epg)
- Tamanho em bytes
- Data da última modificação

Depois, monta um objeto contendo todos esses dados e gera um arquivo JSON chamado 'files_metadata.json'.
*/
/*
function generateMetadata() {
    // Inicializa uma lista vazia para armazenar os arquivos encontrados
    const files = [];

    // Inicializa os contadores de arquivos por tipo
    let m3uCount = 0; // Para contar arquivos .m3u
    let epgCount = 0; // Para contar arquivos .xml.gz

    // Itera sobre todos os nomes de arquivos esperados
    expectedFiles.forEach(filename => {
        try {
            // Cria o caminho absoluto do arquivo atual com base no diretório atual
            const filePath = path.join(__dirname, filename);

            // Verifica se o arquivo realmente existe no sistema de arquivos
            if (fs.existsSync(filePath)) {
                // Obtém estatísticas do arquivo como tamanho e data da última modificação
                const stats = fs.statSync(filePath);

                // Determina se o arquivo é do tipo m3u ou epg com base na extensão
                const fileType = filename.endsWith('.m3u') ? 'm3u' : 'epg';

                // Atualiza os contadores de acordo com o tipo identificado
                if (fileType === 'm3u') m3uCount++;
                if (fileType === 'epg') epgCount++;

                // Adiciona os dados do arquivo à lista de arquivos encontrados
                files.push({
                    name: filename,                      // Nome do arquivo
                    type: fileType,                      // Tipo do arquivo (m3u ou epg)
                    size: stats.size,                    // Tamanho do arquivo em bytes
                    updated: stats.mtime.toISOString()   // Data da última modificação em formato ISO
                });
            }
        } catch (error) {
            // Em caso de erro durante a leitura ou verificação de algum arquivo, exibe no console
            console.error(`Erro ao processar o arquivo ${filename}:`, error);
        }
    });

    // Define o horário da próxima atualização (24 horas após a execução atual)
    const nextUpdate = new Date();
    nextUpdate.setHours(nextUpdate.getHours() + 24);

    // Monta o objeto com metadados gerais
    const metadata = {
        generated_at: new Date().toISOString(),  // Momento em que a função foi executada
        next_update: nextUpdate.toISOString(),   // Previsão de próxima execução
        m3u_count: m3uCount,                     // Quantidade de arquivos .m3u encontrados
        epg_count: epgCount,                     // Quantidade de arquivos .epg (.xml.gz) encontrados
        total_files: files.length                // Total de arquivos válidos encontrados
    };

    // Junta os metadados com os dados detalhados dos arquivos
    const output = {
        metadata,
        files
    };

    // Converte os dados para JSON (com identação de 2 espaços) e grava no disco
    fs.writeFileSync('files_metadata.json', JSON.stringify(output, null, 2));

    // Exibe mensagem de sucesso no console
    console.log('Metadados gerados com sucesso!');
}
*/

/*
=======================================================
 CHAMADA FINAL DA FUNÇÃO
=======================================================

Aqui ocorre a chamada da função `generateMetadata()` que inicia todo o processo
de verificação dos arquivos e geração do arquivo `files_metadata.json`.

Se os módulos e arquivos estiverem no lugar certo, ele executará sem problemas.
*/
/*
generateMetadata();
*/
