    const FEED_CONTAINER = document.getElementById('feed');

    const FEEDS = [
        'https://news.google.com/rss/search?q=pet+viral',
        'https://news.google.com/rss/search?q=dog+viral',
        'https://news.google.com/rss/search?q=cat+viral',
        'https://news.google.com/rss/search?q=goat+viral',
        'https://news.google.com/rss/search?q=parrot+viral',
    
        'https://www.reddit.com/r/AnimalsBeingBros/new/.rss',
    
        'https://www.peta.org/blog/feed/',
    
        'https://news.google.com/rss/search?q=baby+animal+born',
        'https://news.google.com/rss/search?q=baby+animal+born+zoo',
        'https://news.google.com/rss/search?q=zoo+animal+killed',
        'https://news.google.com/rss/search?q=pet+killed',
    
        'https://news.google.com/rss/search?q=dog+rescue+local',
        'https://news.google.com/rss/search?q=dog+hero+story',
        'https://news.google.com/rss/search?q=new+celebrity+pet',
        'https://news.google.com/rss/search?q=name+of+celebrity+pet'
    ];
    

    const SEEN_LINKS = new Set(); // Track already-seen article URLs

    // Fetch and parse RSS feed
    async function fetchRSSFeed(rssUrl) {
    const apiURL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
    const response = await fetch(apiURL);
    const data = await response.json();
    return data.items || [];
    }

    // Fetch all feeds and combine articles
    async function fetchAllFeeds() {
    let allArticles = [];
    for (const feedUrl of FEEDS) {
        const articles = await fetchRSSFeed(feedUrl);
        allArticles = allArticles.concat(articles);
    }
    // Sort articles by date (newest first)
    return allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    }

    // Render new articles
    function renderNewArticles(newArticles) {
    // Render newest articles first, pushing older ones down
    newArticles.reverse().forEach(article => {
        if (!SEEN_LINKS.has(article.link)) {
        const articleDiv = document.createElement('div');
        articleDiv.className = 'article';
        articleDiv.innerHTML = `
            <h2>${article.title}</h2>
            <p><strong>Source:</strong> ${article.author || article.feed || 'Unknown'}</p>
            <p><em>${new Date(article.pubDate).toLocaleString()}</em></p>
            <p>${article.description || ''}</p>
            <p><a href="${article.link}" target="_blank">Read more</a></p>
        `;
        FEED_CONTAINER.prepend(articleDiv); // Add new articles at the top
        SEEN_LINKS.add(article.link); // Mark article as seen
        }
    });
    }

    // Update feed dynamically
    async function updateFeed() {
    const allArticles = await fetchAllFeeds();
    const newArticles = allArticles.filter(article => !SEEN_LINKS.has(article.link));
    if (newArticles.length > 0) {
        renderNewArticles(newArticles); // Render only new articles
    }
    else{
        console.log("No new articles.");
    }
    }

    // Initial load
    updateFeed();

    // Scan for new articles every second
    setInterval(updateFeed, 1000);
