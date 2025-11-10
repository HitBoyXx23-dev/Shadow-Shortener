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

  // --- Create or update copy button ---
  let copyBtn = document.getElementById("copy-btn");
  if (!copyBtn) {
    copyBtn = document.createElement("button");
    copyBtn.id = "copy-btn";
    copyBtn.textContent = "Copy Link";
    copyBtn.style.marginTop = "10px";
    copyBtn.style.padding = "6px 12px";
    copyBtn.style.border = "none";
    copyBtn.style.borderRadius = "6px";
    copyBtn.style.background = "#6a0dad";
    copyBtn.style.color = "white";
    copyBtn.style.cursor = "pointer";
    shortUrl.insertAdjacentElement("afterend", copyBtn);
  }

  copyBtn.onclick = async () => {
    try {
      await navigator.clipboard.writeText(data.shortUrl);
      copyBtn.textContent = "Copied!";
      copyBtn.style.background = "#333";
      setTimeout(() => {
        copyBtn.textContent = "Copy Link";
        copyBtn.style.background = "#6a0dad";
      }, 1500);
    } catch (err) {
      alert("Failed to copy link.");
    }
  };
});
