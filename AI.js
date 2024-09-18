function mdToHtml(str) {
  str = str.replace(/```([\s\S]*?)```/g, function (match, code) {
    return "<pre><code>" + code.trim() + "</code></pre>";
  });

  var tempStr = str;
  while (tempStr.indexOf("**") !== -1) {
    var firstPos = tempStr.indexOf("**");
    var nextPos = tempStr.indexOf("**", firstPos + 2);
    if (nextPos !== -1) {
      var innerTxt = tempStr.substring(firstPos + 2, nextPos);
      var strongified = "<strong>" + innerTxt + "</strong>";
      tempStr =
        tempStr.substring(0, firstPos) +
        strongified +
        tempStr.substring(nextPos + 2, tempStr.length);
      //get rid of unclosed '**'
    } else {
      tempStr = tempStr.replace("**", "");
    }
  }
  while (tempStr.indexOf("*") !== -1) {
    var firstPos = tempStr.indexOf("*");
    var nextPos = tempStr.indexOf("*", firstPos + 1);
    if (nextPos !== -1) {
      var innerTxt = tempStr.substring(firstPos + 1, nextPos);
      var italicized = "<i>" + innerTxt + "</i>";
      tempStr =
        tempStr.substring(0, firstPos) +
        italicized +
        tempStr.substring(nextPos + 2, tempStr.length);
      //get rid of unclosed '*'
    } else {
      tempStr = tempStr.replace("*", "");
    }
  }
  return tempStr;
}

// Function to send the dynamic content
async function generateInfo() {
  const card = document.getElementById("card");
  const text = document.getElementById("text").value;

  // Add user input to the card
  const userMessage = document.createElement("div");
  userMessage.className = "userMessage";
  userMessage.textContent = text;
  card.appendChild(userMessage);

  const data = {
    contents: [
      {
        parts: [
          {
            text: text,
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAensOkVRbHVydAJAiyX6Em-6HRHCTpUU8",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    // Display API response
    const apiMessage = document.createElement("div");
    apiMessage.className = "apiMessage";
    const htmlOutput = mdToHtml(result.candidates[0].content.parts[0].text);

    apiMessage.innerHTML = htmlOutput;

    card.appendChild(apiMessage);
    card.scrollTop = card.scrollHeight;
  } catch (error) {
    console.error("Error:", error);
  }
  document.getElementById("text").value = "";
}
