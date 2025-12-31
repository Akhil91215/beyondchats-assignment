import { useEffect, useState } from "react";

function App() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/articles")
      .then(res => res.json())
      .then(data => setArticles(data))
      .catch(err => console.error("Fetch error:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>BeyondChats Articles</h1>

      {articles.length === 0 && <p>Loading articles...</p>}

      {articles.map(article => (
        <div key={article.id} style={{ marginBottom: "20px" }}>
          <h2>{article.title}</h2>
          <div
  style={{ marginTop: "10px" }}
  dangerouslySetInnerHTML={{ __html: article.content }}
/>


          {/* Debug helper (optional) */}
          {/* <pre>{JSON.stringify(article, null, 2)}</pre> */}
        </div>
      ))}
    </div>
  );
}

export default App;
