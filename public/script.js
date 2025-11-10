document.getElementById("shorten-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const url = document.getElementById("url").value;
  const mode = document.querySelector('input[name="mode"]:checked').value;
  const customWord = document.getElementById("custom-word").value.trim();

  const res = await fetch("/shorten", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, mode, customWord }),
  });

  const data = await res.json();

  const shortUrl = document.getElementById("short-url");
  shortUrl.href = data.shortUrl;
  shortUrl.textContent = data.shortUrl;
  shortUrl.classList.remove("hidden");
});
