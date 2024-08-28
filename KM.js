
let dimensions = [];

function fetchDimensions() {
  fetch('https://raw.githubusercontent.com/Mariamk03/IT-Project/main/assessment_content.json')
         
    .then(response => response.json())
    .then(data => {
      dimensions = data;
      //startAssessment(); // Starte das Assessment, sobald die Daten geladen sind
    })
    .catch(error => console.error('Fehler beim Laden der Dimensionsdaten:', error));
}


// Initialisiere das Assessment beim Laden der Seite
document.addEventListener('DOMContentLoaded', fetchDimensions);

let currentDimension = 0;
//let currentQuestionIndex = 0;



document.addEventListener('DOMContentLoaded', () => {
  const footerElement = document.getElementById('footer');
  const jsonUrl = 'https://raw.githubusercontent.com/Mariamk03/IT-Project/main/footer-content.json';

  
  fetch(jsonUrl)
      .then(response => response.json())
      .then(data => {
          footerElement.innerHTML = `
              <p>Kontakt: <a href="mailto:${data.contactEmail}">${data.contactEmail}</a></p>
              <p>Telefon: ${data.phone}</p>
              <p>${data.copyright}</p>
          `;
      })
      .catch(error => console.error('Fehler beim Laden der Footer-Daten:', error));
});



function startAssessment() {
  window.scrollTo(0, 0);
  document.getElementById('welcomeScreen').style.display = 'none';
  document.getElementById('assessment').style.display = 'block';
  document.getElementById('progressBarContainer').style.display = 'block';
  document.getElementById('homeIcon').style.display = 'block';
  document.getElementById('footer').style.display = 'none';
  document.getElementById('header').style.display = 'none';
  document.getElementById('header-bottom').style.display = 'none';

  // Initialisiere totalQuestions hier
  //totalQuestions = dimensions.reduce((total, dimension) => total + dimension.questions.length, 0);

  loadDimension(currentDimension);
}


  
function loadDimension(dimensionIndex) {
    const dimension = dimensions[dimensionIndex];
    const assessmentContainer = document.getElementById('assessment');
    let htmlContent = `<h2>${dimension.name}</h2>`;

    dimension.questions.forEach((question, questionIndex) => {
        htmlContent += `<h3>${question.text}</h3><div class="question-text">`;
        question.answers.forEach((answer, answerIndex) => {
            const isChecked = question.selectedAnswerIndex === answerIndex ? 'checked' : '';
            htmlContent += `
                <div class="answer-option">
                    <input type="radio" id="answer_${dimensionIndex}_${questionIndex}_${answerIndex}" 
                           name="question${dimensionIndex}_${questionIndex}" 
                           value="${answerIndex}" 
                           ${isChecked}
                           onclick="saveAnswer(${dimensionIndex}, ${questionIndex}, ${answerIndex})">
                    <label for="answer_${dimensionIndex}_${questionIndex}_${answerIndex}">${answer.text}</label>
                </div>
            `;
        });
        htmlContent += '</div>';
    });

    htmlContent += `<div class="button-container">`;
    if (dimensionIndex > 0) {
        htmlContent += `<button class="button" onclick="previousDimension()">Zurück</button>`;
    }
    if (dimensionIndex < dimensions.length - 1) {
        htmlContent += `<button class="button" onclick="checkAnswersAndProceed(${dimensionIndex}, false)">Nächste Dimension</button>`;
    } else {
        htmlContent += `<button class="button" onclick="checkAnswersAndProceed(${dimensionIndex}, true)">Assessment absenden</button>`;
    }
    htmlContent += `</div>`;

    assessmentContainer.innerHTML = htmlContent;
    updateProgressBar();
}
  
  function saveAnswer(dimensionIndex, questionIndex, answerIndex) {
    let dimension = dimensions[dimensionIndex];
    let question = dimension.questions[questionIndex];
    if (question.selectedAnswerIndex !== null) {
      dimension.totalScore -= question.answers[question.selectedAnswerIndex].score;
    }
    question.selectedAnswerIndex = answerIndex;
    dimension.totalScore += question.answers[answerIndex].score;
    updateProgressBar();
  }

  function checkAnswersAndProceed(dimensionIndex, isFinal) {
    if (areAllQuestionsAnswered(dimensionIndex)) {
        if (isFinal) {
            submitAssessment();
        } else {
            nextDimension();
        }
    } else {
      alert("Bitte beantworten Sie alle Fragen, bevor Sie fortfahren.");
    }
}
  
function areAllQuestionsAnswered(dimensionIndex) {
    return dimensions[dimensionIndex].questions.every(question => question.selectedAnswerIndex !== null);
}

function backToStart() {

     // Reset des aktuellen Dimensionsindex
     currentDimension = 0;

     // Reset aller gespeicherten Antworten und Punkte in jeder Dimension
     dimensions.forEach(dimension => {
         dimension.totalScore = 0;  // Setzt den Gesamtpunktestand zurück
         dimension.questions.forEach(question => {
             question.selectedAnswerIndex = null;  // Entfernt die Auswahl der Antwort
         });
     });
    // Verstecken der verschiedenen Ansichten
    document.getElementById('assessment').style.display = 'none';
    document.getElementById('resultsScreen').style.display = 'none';
    document.getElementById('footer').style.display = 'block';
    document.getElementById('header').style.display = 'block';
    document.getElementById('header-bottom').style.display = 'block';
  
    document.querySelectorAll('.detail-screen').forEach(screen => {
        screen.style.display = 'none';
    });

    // Ausblenden des Fortschrittsbalkens und des Home-Icons
    document.getElementById('progressBarContainer').style.display = 'none';
    document.getElementById('homeIcon').style.display = 'none';

    // Zeigen der Startseite
    document.getElementById('welcomeScreen').style.display = 'block';

    // Zurücksetzen des Fortschrittsbalkens auf 0%
    document.getElementById('progressBar').style.hight = '0%';

    
}

function updateProgressBar() {
    let totalQuestions = dimensions.reduce((sum, dim) => sum + dim.questions.length, 0);
    let answeredQuestions = dimensions.reduce((sum, dim) => sum + dim.questions.filter(q => q.selectedAnswerIndex !== null).length, 0);
    let progressPercentage = (answeredQuestions / totalQuestions) * 100;
    document.getElementById('progressBar').style.height = `${progressPercentage}%`;
  }

/*
function checkDimensionCompletion(dimensionIndex) {
    let allAnswered = dimensions[dimensionIndex].questions.every(q => q.selectedAnswerIndex !== null);
    if (!allAnswered) {
      alert('Bitte beantworten Sie alle Fragen dieser Dimension, bevor Sie fortfahren.');
      return;
    }
    nextDimension();
  }*/

  function nextDimension() {
    window.scrollTo(0, 0);
    if (currentDimension < dimensions.length - 1) {
      currentDimension++;
      loadDimension(currentDimension);
    } else {
      submitAssessment();
    }
  }
  
  function previousDimension() {
    window.scrollTo(0, 0);
    if (currentDimension > 0) {
      currentDimension--;
      loadDimension(currentDimension);
    }
  }

  function submitAssessment() {
    window.scrollTo(0, 0);
    document.getElementById('assessment').style.display = 'none';
    document.getElementById('progressBarContainer').style.display = 'none';
    document.getElementById('homeIcon').style.display = 'block';
    document.getElementById('footer').style.display = 'none';
    document.getElementById('header').style.display = 'none';
    document.getElementById('header-bottom').style.display = 'none';
  
    showResultsScreen();
  }

  function showResultsScreen() {
    const resultsScreen = document.getElementById('resultsScreen');
    resultsScreen.innerHTML = `<h1>Assessment-Ergebnisse</h1>`;
    dimensions.forEach((dimension, index) => {
        const maxScore = dimension.questions.reduce((sum, question) => sum + Math.max(...question.answers.map(a => a.score)), 0);
        resultsScreen.innerHTML += `<div class="dimension-result">
            <h2>${dimension.name}: ${dimension.totalScore} / ${maxScore}</h2>
            <button class="button" onclick="showDetailScreen(${index})">Detailansicht</button>
        </div>`;
    });

    const downloadButton = document.createElement('button');
  downloadButton.className = 'button';
  downloadButton.onclick = downloadResultsAsPDF;
  downloadButton.textContent = 'Ergebnisse herunterladen';
  resultsScreen.appendChild(downloadButton);
    resultsScreen.style.display = 'block';
    
    // Verstecke alle Detailansichten
    document.querySelectorAll('.detail-screen').forEach(screen => {
       screen.style.display = 'none';
    });
}

function downloadResultsAsPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Seitenbreite ermitteln
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Titel
  doc.setFontSize(18);
  const title = "Wissensmanagement Self-Assessment Ergebnisse";
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, (pageWidth - titleWidth) / 2, 20);  // Zentrieren des Titels
  
  // Inhalt
  doc.setFontSize(12);
  let yPosition = 40;

  // Alle Ergebnis-Elemente durchlaufen und zum PDF hinzufügen
  const dimensionResults = document.querySelectorAll('#resultsScreen .dimension-result');
  
  dimensionResults.forEach((dimension, index) => {
      const title = dimension.querySelector('h2').innerText;
      
      // Titel der Dimension hinzufügen
      doc.setFontSize(14);
      const titleWidth = doc.getTextWidth(title);
      doc.text(title, (pageWidth - titleWidth) / 2, yPosition);  // Zentrieren des Titels
      yPosition += 10;
      
      // Linienumbruch, falls nötig  
      if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
      }
      
      // Temporär die Detailansicht sichtbar machen, falls sie versteckt ist
      const detailScreen = document.getElementById(`detailScreen-${index}`);
      if (detailScreen) {
          const previousDisplay = detailScreen.style.display;
          detailScreen.style.display = 'block';
          
          const detailContent = detailScreen.innerText;
          const detailLines = doc.splitTextToSize(detailContent, 180);
          
          detailLines.forEach(line => {
              if (yPosition > 280) {
                  doc.addPage();
                  yPosition = 20;
              }
              const lineWidth = doc.getTextWidth(line);
              doc.text(line, (pageWidth - lineWidth) / 2, yPosition);  // Zentrieren des Textes
              yPosition += 7;
          });
          
          // Nach Verarbeitung den ursprünglichen Display-Wert wiederherstellen
          detailScreen.style.display = previousDisplay;

          // Abstand nach jeder Detailansicht
          yPosition += 10;
      }
  });

  // PDF speichern
  doc.save("Wissensmanagement_Ergebnisse_mit_Details.pdf");
}

function downloadDetailAsPDF(index) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Erhalte den Dimension-Namen aus der Detailansicht
  const detailScreen = document.getElementById(`detailScreen${index + 1}`);
  const dimensionName = detailScreen.querySelector('h1').innerText;

  // Setze den Titel mit dem Dimension-Namen und zentriere ihn
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(`Detaillierte Ergebnisse für Dimension ${dimensionName}`, 105, 20, null, null, 'center');

  // Bereite den Inhalt für das PDF vor
  let yPosition = 40;
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;

  // Sammle die Detail-Inhalte ohne Buttons
  const questionDetails = detailScreen.querySelectorAll('.question-detail');

  questionDetails.forEach(question => {
    const criteria = question.querySelector('h2').innerText;
    const recommendation = question.querySelector('.recommendation-box').innerText;

    // Teile den Kriterien-Text auf, falls er zu lang ist
    const criteriaLines = doc.splitTextToSize(criteria, pageWidth - 40); // 40 ist die Breite des linken und rechten Randes

    // Füge jede Zeile des Kriterien-Texts hinzu
    criteriaLines.forEach(line => {
      if (yPosition + 10 > pageHeight - 40) {  // Überprüfe, ob die nächste Zeile über die Seite hinausgehen würde
        doc.addPage();
        yPosition = 20;
      }
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(line, pageWidth / 2, yPosition, null, null, 'center');  // Zentriere den Text
      yPosition += 10;
    });

    // Teile den Empfehlungstext auf, falls er zu lang ist und gebe ihm denselben Platz wie dem Kriterium
    const recommendationLines = doc.splitTextToSize(recommendation, pageWidth);

    // Füge jede Zeile des Empfehlungstexts hinzu
    recommendationLines.forEach(line => {
      if (yPosition + 7 > pageHeight ) {  // Überprüfe, ob die nächste Zeile über die Seite hinausgehen würde
        doc.addPage();
        yPosition = 20;
      }
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(line, pageWidth / 2, yPosition, null, null, 'center');  // Zentriere den Text
      yPosition += 7;
    });

    yPosition += 10;  // Füge etwas Abstand zwischen den Fragen hinzu
  });

  // Speichere das PDF
  doc.save(`Detaillierte_Ergebnisse_fuer_${dimensionName}.pdf`);
}






// Event-Listener für den Download-Button
document.getElementById('downloadPDF').addEventListener('click', downloadPDF);

// Event-Listener für die Download-Buttons in den Detailansichten
for (let i = 0; i < 5; i++) {
  document.getElementById(`downloadDetail-${i}`).addEventListener('click', function() {
      downloadDetailAsPDF(i);
  });
}


function showDetailScreen(index) {
    // Verstecke die Ergebnisansicht und alle anderen Detailansichten
  window.scrollTo(0, 0);
    document.getElementById('resultsScreen').style.display = 'none';
    document.querySelectorAll('.detail-screen').forEach(screen => screen.style.display = 'none');

    // Hole das spezifische Detailansicht-Element für die gewählte Dimension
    const detailScreen = document.getElementById(`detailScreen${index + 1}`);
    const dimension = dimensions[index];
    let htmlContent = `<h1>${dimension.name}</h1>`;

    // Erzeuge HTML-Inhalt für jede Frage
    dimension.questions.forEach(question => {
        const selectedAnswer = question.answers[question.selectedAnswerIndex];
        htmlContent += `
        <div class="question-detail">
            <h2><strong>${question.criteria}</strong></h2> <!-- Kriterium fett gedruckt -->
            <div class="recommendation-box">
                <p>${selectedAnswer ? selectedAnswer.recommendation : 'Keine Empfehlung verfügbar'}</p>
            </div>
        </div>
        `;
    });

    // Button zum Herunterladen der Detailansicht als PDF
    htmlContent += `<button class="button" onclick="downloadDetailAsPDF(${index})">Herunterladen</button>`;

    // Button zum Zurückkehren zu den Ergebnissen
    htmlContent += `<button class="button" onclick="showResultsScreen()">Zurück zu Ergebnissen</button>`;

    // Setze den HTML-Inhalt und zeige die Detailansicht an
    detailScreen.innerHTML = htmlContent;
    detailScreen.style.display = 'block';
}

