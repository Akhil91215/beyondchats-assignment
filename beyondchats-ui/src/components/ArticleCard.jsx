export default function ArticleCard({ article }) {
  return (
    <div style={{
      border: "1px solid #ddd",
      padding: "16px",
      marginBottom: "20px",
      borderRadius: "8px"
    }}>
      <pre>{JSON.stringify(article, null, 2)}</pre>

      <h2>{article.title}</h2>

      <h4>Original Content</h4>
      <p>{article.originalContent}</p>

      <h4>Updated Content</h4>
      <p>{article.updatedContent}</p>

      {article.references?.length > 0 && (
        <>
          <h4>References</h4>
          <ul>
            {article.references.map((ref, i) => (
              <li key={i}>
                <a href={ref} target="_blank">{ref}</a>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
