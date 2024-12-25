document.addEventListener('DOMContentLoaded', () => {
    const fetchQuestionButton = document.getElementById('fetchQuestion');
    const questionText = document.getElementById('questionText');
    const papersList = document.getElementById('papersList');

    // Fetch random question
    if (fetchQuestionButton) {
        fetchQuestionButton.addEventListener('click', () => {
            questionText.innerText = 'Here is a random practice question!';
        });
    }

    // Fetch past papers
    if (papersList) {
        papersList.innerHTML = `
            <li><a href="file:///C:/Users/vikhil/Desktop/firstone/maths.html" >Past Paper 2023</a></li>
             <li><a href="paper2.pdf" download>Past Paper 2022</a></li>

            <li><a href="paper3.pdf" download>Past Paper 2021</a></li>
        `;
    }
});
