document.addEventListener("DOMContentLoaded", function () {
    const spreadsheetId = "1uC34hI5AT2Uxrp5rVmEpsc07-4aRrKnRaMcjpiUVZJw";
    const apiKey = "AIzaSyCAY4rjXddC2nK1TNbu5SEQawCYLty9k04";
    const sheetRange = "reading_content!A:K"; // Ensure correct range
  
    const urlParams = new URLSearchParams(window.location.search);
    const rowNumber = urlParams.get("row");
  
    if (!rowNumber || rowNumber < 2) {
      document.getElementById("title").textContent = "Invalid Selection!";
      return;
    }
 
    document.getElementById("close-content").addEventListener("click", function () {
      // ✅ Force hide the content display
      document.getElementById("content-display").style.display = "none";
  
      // ✅ Force show the grid again
      document.getElementById("activity-grid").style.display = "grid"; /* or "block" if grid doesn't work */
  });
  
 


    function fetchContentData() {
      fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetRange}?key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
          const rowIndex = parseInt(rowNumber) - 2; // Convert to number & adjust index
          const rows = data.values;
  
          if (!rows[rowIndex]) {
            document.getElementById("title").textContent = "Content Not Found!";
            return;
          }
  
          const row = rows[rowIndex]; // The selected row data
          document.getElementById("title").textContent = row[0] || "Untitled"; // Topic Name
  
          // Define activities & column mappings
          const activities = [
            { name: "Reading", column: 2, icon: "fa-book-open" },  
            { name: "Vocabulary", column: 3, icon: "fa-font" },    
            { name: "Choose the Correct Answer", column: 4, icon: "fa-check-circle" },
            { name: "Word Game", column: 5, icon: "fa-puzzle-piece" },
            { name: "Video", column: 6, icon: "fa-play-circle" },
            { name: "Fill in the Blanks", column: 7, icon: "fa-edit" },
            { name: "Answer the Questions", column: 8, icon: "fa-question-circle" },
            { name: "Write It", column: 9, icon: "fa-pen" },
            { name: "Summary", column: 10, icon: "fa-file-alt" }
          ];
  
          const activityGrid = document.getElementById("activity-grid");
          activityGrid.innerHTML = ""; // Clear previous content
  
          activities.forEach(activity => {
            const content = row[activity.column] ? row[activity.column] : "No content available";
  
            const activityTile = document.createElement("div");
            activityTile.classList.add("content-tile");
  
            activityTile.innerHTML = `
              <button class="tile-button" data-title="${activity.name}" data-content="${content}">
                <i class="fas ${activity.icon} icon-style"></i> 
                <div class="tile-text">${activity.name}</div>
              </button>
            `;
  
            activityGrid.appendChild(activityTile);
          });
  
          // Attach event listeners AFTER tiles are created
          document.querySelectorAll(".tile-button").forEach(button => {
            button.addEventListener("click", function () {
              const title = this.getAttribute("data-title");
              const content = this.getAttribute("data-content");
              showContent(title, content);
            });
          });
  
        })
        .catch(error => {
          console.error("Error fetching data:", error);
          document.getElementById("title").textContent = "Error loading content.";
        });
    }
  
    function showContent(title, content) {
      document.getElementById("activity-title").textContent = title;
  
      // Convert new lines (\n) into <br> tags
      const formattedContent = content.replace(/\n/g, "<br>");
  
      // Properly format the image tag
      const imageHtml = `<img src="https://tse1.mm.bing.net/th?id=OIG3.7wVf2i02DkQrNejy7aX7&pid=ImgGn" style="width: 50%; display: block; margin: 0 auto;">`;
  
      // Add the image on top of the content
      document.getElementById("activity-content").innerHTML = imageHtml + formattedContent;
  
      // ✅ Force hide the grid
      document.getElementById("activity-grid").style.display = "none";
  
      // ✅ Force show the content display
      document.getElementById("content-display").style.display = "block";
  }
  
  
    
  
    fetchContentData();
  });
  