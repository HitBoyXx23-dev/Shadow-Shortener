document.getElementById("shorten-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const url = document.getElementById("url").value;
  const res = await fetch("/shorten", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  const data = await res.json();

  const result = document.getElementById("result");
  const shortUrl = document.getElementById("short-url");
  shortUrl.href = data.shortUrl;
  shortUrl.textContent = data.shortUrl;
  result.classList.remove("hidden");
});
