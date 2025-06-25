const fs = require('fs');
const https = require('https');
const { parseString } = require('xml2js');

const MEDIUM_RSS = 'https://medium.com/feed/@lucas-cunha';
const POSTS_PATH = './public/posts.json';

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

            const posts = items.map((item) => {
              const description = item.description?.[0] || item['content:encoded']?.[0] || '';
              let summary = '';
              const pMatch = description.match(/<p[^>]*>(.*?)<\/p>/i);
              if (pMatch && pMatch[1]) {
                summary = pMatch[1].replace(/&[^;]+;/g, ' ').trim();
              } else {
                summary = description.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim().substring(0, 200) + '...';
              }

              return {
                title: item.title?.[0] || 'Sem título',
                date: item.pubDate?.[0]
                  ? new Date(item.pubDate[0]).toISOString().split('T')[0]
                  : '',
                excerpt: description.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim().substring(0, 200) + '...',
                summary: summary,
                slug: item.title?.[0]
                  ? item.title[0].toLowerCase().replace(/[^a-z0-9]+/g, '-')
                  : `post-${Math.random().toString(36).slice(2)}`,
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
    // Lê posts antigos (se existir)
    let oldPosts = [];
    if (fs.existsSync(POSTS_PATH)) {
      oldPosts = JSON.parse(fs.readFileSync(POSTS_PATH, 'utf-8'));
    }

    const newPosts = await fetchMediumPosts();

    // Adiciona apenas os posts que não existem ainda (comparando por URL)
    const allPosts = [...oldPosts];
    newPosts.forEach((post) => {
      if (!oldPosts.some(old => old.url === post.url)) {
        allPosts.unshift({
          ...post,
          id: allPosts.length + 1 // Gera novo id sequencial
        });
      }
    });

    fs.writeFileSync(POSTS_PATH, JSON.stringify(allPosts, null, 2));
    console.log('Posts atualizados com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar posts:', error);
  }
}

updatePosts();