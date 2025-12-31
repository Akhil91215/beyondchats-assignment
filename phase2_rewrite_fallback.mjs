function simpleRewrite(original, references) {
  return `
<h2>Updated Article</h2>

<p>${original
    .replace(/AI/g, "Artificial Intelligence")
    .replace(/chatbot/g, "AI-powered chatbot")}</p>

<h3>Insights from Top Ranking Articles</h3>

<ul>
  ${references.map(r => `<li>${r.title}</li>`).join("")}
</ul>

<h3>References</h3>
<ul>
  ${references.map(r => `<li><a href="${r.link}">${r.link}</a></li>`).join("")}
</ul>
`;
}

export default simpleRewrite;
