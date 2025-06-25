const fs = require('fs');
const https = require('https');
const { parseString } = require('xml2js');

const MEDIUM_RSS = 'https://medium.com/feed/@lucas-cunha';

async function fetchMediumPosts() {
  return new Promise((resolve, reject) => {
    https.get(MEDIUM_RSS, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        parseString(data, (err, result) => {
          if (err) {
            console.error('Erro ao fazer parsing do XML:', err);
            return reject(err);
          }

          try {
            const items = result?.rss?.channel?.[0]?.item;
            if (!items || !Array.isArray(items)) {
              throw new Error('Feed inválido ou sem posts.');
            }

            const posts = items.map((item, index) => {
              const description = item.description?.[0] || item['content:encoded']?.[0] || '';
              console.log('DESCRIPTION:', description); // Para debug
              // Tenta extrair o primeiro <p>...</p>
              let summary = '';
              const pMatch = description.match(/<p[^>]*>(.*?)<\/p>/i);
              if (pMatch && pMatch[1]) {
                // Remove entidades HTML básicas
                summary = pMatch[1].replace(/&[^;]+;/g, ' ').trim();
              } else {
                // Remove todas as tags HTML e pega os primeiros 200 caracteres
                summary = description.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim().substring(0, 200) + '...';
              }

              return {
                id: index + 1,
                title: item.title?.[0] || 'Sem título',
                date: item.pubDate?.[0]
                  ? new Date(item.pubDate[0]).toISOString().split('T')[0]
                  : '',
                excerpt: description.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim().substring(0, 200) + '...',
                summary: summary,
                slug: item.title?.[0]
                  ? item.title[0].toLowerCase().replace(/[^a-z0-9]+/g, '-')
                  : `post-${index + 1}`,
                url: item.link?.[0] || '',
                platform: 'medium',
                readTime: '5 min'
              };
            });

            resolve(posts);
          } catch (parseError) {
            console.error('Erro ao processar os itens do feed:', parseError);
            reject(parseError);
          }
        });
      });
      response.on('error', (err) => {
        console.error('Erro na resposta HTTPS:', err);
        reject(err);
      });
    }).on('error', (err) => {
      console.error('Erro ao requisitar o feed:', err);
      reject(err);
    });
  });
}

async function updatePosts() {
  try {
    const posts = await fetchMediumPosts();
    fs.writeFileSync('./public/posts.json', JSON.stringify(posts, null, 2));
    console.log('Posts atualizados com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar posts:', error);
  }
}

updatePosts();