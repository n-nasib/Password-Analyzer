function togglePassword() {
  const input = document.getElementById("password");
  input.type = input.type === "password" ? "text" : "password";
}

function analyzePassword() {
  const password = document.getElementById("password").value;
  const crackTime = document.getElementById("crackTime");
  const strengthLevel = document.getElementById("strengthLevel");
  const analysisGrid = document.getElementById("analysisGrid");
  const recommendList = document.getElementById("recommendList");

  if (!password) {
    crackTime.textContent = "Please enter a password";
    strengthLevel.textContent = "Not analyzed yet";
    strengthLevel.className = "strength-level neutral";
    analysisGrid.innerHTML = "";
    recommendList.innerHTML = "<li>Please enter a password first.</li>";
    return;
  }

  let lower = 0;
  let upper = 0;
  let digit = 0;
  let symbol = 0;

  for (let ch of password) {
    if (ch >= "a" && ch <= "z") {
      lower++;
    } else if (ch >= "A" && ch <= "Z") {
      upper++;
    } else if (ch >= "0" && ch <= "9") {
      digit++;
    } else {
      symbol++;
    }
  }

  let repeated = false;
  for (let i = 0; i < password.length - 1; i++) {
    if (password[i] === password[i + 1]) {
      repeated = true;
      break;
    }
  }

  let sequence = false;
  for (let i = 0; i < password.length - 3; i++) {
    if (
      password.charCodeAt(i) + 1 === password.charCodeAt(i + 1) &&
      password.charCodeAt(i + 1) + 1 === password.charCodeAt(i + 2) &&
      password.charCodeAt(i + 2) + 1 === password.charCodeAt(i + 3)
    ) {
      sequence = true;
      break;
    }
  }

  let score = 0;

  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 20;
  if (lower > 0) score += 10;
  if (upper > 0) score += 10;
  if (digit > 0) score += 10;
  if (symbol > 0) score += 10;
  if (repeated) score -= 15;
  if (sequence) score -= 20;

  score = Math.max(0, Math.min(score, 100));

  let strength = "";
  let time = "";
  let strengthClass = "";

  if (score < 40) {
    strength = "Weak";
    time = "A few minutes to a few hours";
    strengthClass = "weak";
  } else if (score < 70) {
    strength = "Medium";
    time = "Several days to a few months";
    strengthClass = "medium";
  } else {
    strength = "Strong";
    time = "Years or longer";
    strengthClass = "strong";
  }

  crackTime.textContent = time;
  strengthLevel.textContent = strength;
  strengthLevel.className = `strength-level ${strengthClass}`;

  analysisGrid.innerHTML = `
    <div class="analysis-card"><strong>Length:</strong> ${password.length}</div>
    <div class="analysis-card"><strong>Lowercase:</strong> ${lower}</div>
    <div class="analysis-card"><strong>Uppercase:</strong> ${upper}</div>
    <div class="analysis-card"><strong>Numbers:</strong> ${digit}</div>
    <div class="analysis-card"><strong>Symbols:</strong> ${symbol}</div>
    <div class="analysis-card"><strong>Repeated characters:</strong> ${repeated ? "Yes" : "No"}</div>
    <div class="analysis-card"><strong>Sequential pattern:</strong> ${sequence ? "Yes" : "No"}</div>
    <div class="analysis-card"><strong>Score:</strong> ${score}/100</div>
  `;

  let suggestions = [];

  if (password.length < 12) {
    suggestions.push("Use 12 or more characters.");
  }
  if (lower === 0) {
    suggestions.push("Add lowercase letters.");
  }
  if (upper === 0) {
    suggestions.push("Add uppercase letters.");
  }
  if (digit === 0) {
    suggestions.push("Add numbers.");
  }
  if (symbol === 0) {
    suggestions.push("Add symbols like ! @ # $ %.");
  }
  if (repeated) {
    suggestions.push("Avoid repeated characters like aa or 11.");
  }
  if (sequence) {
    suggestions.push("Avoid predictable sequences like 1234 or abcd.");
  }
  if (suggestions.length === 0) {
    suggestions.push("Nice job — this password passed the main checks in this analyzer.");
  }

  recommendList.innerHTML = suggestions.map(item => `<li>${item}</li>`).join("");

  document.getElementById("analysisSection").scrollIntoView({
    behavior: "smooth"
  });
}