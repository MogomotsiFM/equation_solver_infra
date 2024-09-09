const form = document.querySelector("#equationSolver");

const textarea = document.querySelector("#solution");

async function sendData() {
    const equation = document.querySelector("#equation").value;
    const headers = new Headers();
    headers.append("Content-Type", "text/plain");

    const request = new Request("https://uzw4exadb8.execute-api.us-east-1.amazonaws.com/dev/", {
        method: "POST",
        body: equation,
        mode: "cors",
        headers: headers
    });

    fetch(request)
        .then((response) => response.text())
        .then((data) => JSON.parse(data))
        .then((data) => {
            let maxWidth = 10;
            let maxLengthString = '';

            const sol = document.querySelector("#solution");
            sol.value = "";
            for (let line of data) {
                sol.value += "\n";
                sol.value += line;

                const tmp = getCharacterWidth(line, textarea);
                if (tmp > maxWidth) {
                    maxWidth = tmp;
                    maxLengthString = line;
                }
            }

            console.log(maxWidth)
            autoResize(textarea, maxWidth);
        })
        .catch(console.error);
}


// Take over form submission
const listener = (event) => {
    event.preventDefault();
    sendData();
}
form.addEventListener("submit", listener);

function autoResize(ta, width) {
    ta.style.height = "auto";
    ta.style.height = ta.scrollHeight + "px";

    ta.style.width = "auto";
    ta.style.width = (width + 10) + "px";
}

// https://stackoverflow.com/questions/76145682/how-do-i-find-the-width-of-a-character-in-a-textarea-in-javascript#:~:text=function%20getCharacterWidth(,temp)%3B%0A%0Areturn%20width%3B%0A%7D
function getCharacterWidth(char, textarea) {
    // Create a temporary element to measure the width of the character
    const temp = document.createElement('span');
    temp.textContent = char;
    
    // Copy the textarea's font to the temporary element
    temp.style.font = getComputedStyle(textarea).font;
    
    // Add the temporary element to the document so we can measure its width
    document.body.appendChild(temp);
    
    // Get the width of the character in pixels
    const width = temp.offsetWidth;
    
    // Remove the temporary element from the document
    document.body.removeChild(temp);
    
    return width;
}