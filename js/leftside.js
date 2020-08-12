// Document elements
const DOC_TIME_INPUT = document.querySelector("#time-input");
const DOC_PLACEHOLDER = document.querySelector("#time-placeholder");
const DOC_STARTSTOP_BUTTON = document.querySelector("#time-startstop-button");
const DOC_RESET_BUTTON = document.querySelector("#time-reset-button");

// Timer variables
let timerStartTime = "";
let timerState = false;

DOC_TIME_INPUT.addEventListener("input", () => {
    // Prevent non-number and colon characters and length max 6
    let val = DOC_TIME_INPUT.value.split(":").join("");
    if (/[^0-9:]$/.test(val)) val = val.slice(0, -1);
    if (val.length > 6) val = val.slice(0, 6);

    setDocInputAndPlaceholder(formatTime(val));
});
DOC_TIME_INPUT.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") {
        DOC_STARTSTOP_BUTTON.click();
    }
});
DOC_PLACEHOLDER.addEventListener("click", () => {
    DOC_TIME_INPUT.focus();
});
DOC_STARTSTOP_BUTTON.addEventListener("click", () => {
    timerState = !timerState;
    if (timerState && DOC_TIME_INPUT.value !== "") {
        setStartGraphics();
        timerStartTime = DOC_TIME_INPUT.value;
        setTimeout(startTimerCountDown, 1000);
    } else {
        setStopGraphics();
    }
});
DOC_RESET_BUTTON.addEventListener("click", () => {
    timerState = false;
    setStopGraphics();

    setDocInputAndPlaceholder(timerStartTime);
    DOC_PLACEHOLDER.setAttribute("hidden", true);
});

function setStartGraphics() {
    DOC_TIME_INPUT.setAttribute("readonly", true);
    DOC_PLACEHOLDER.setAttribute("hidden", true);
    DOC_STARTSTOP_BUTTON.textContent = "STOP";
}
function setStopGraphics() {
    DOC_TIME_INPUT.removeAttribute("readonly");
    DOC_PLACEHOLDER.removeAttribute("hidden");
    DOC_STARTSTOP_BUTTON.textContent = "START";
}
function setDocInputAndPlaceholder(docInputText) {
    DOC_TIME_INPUT.value = docInputText;

    let placeholderHidden = DOC_PLACEHOLDER.getAttribute("hidden")
        ? true
        : false;
    if (placeholderHidden) {
        DOC_PLACEHOLDER.removeAttribute("hidden");
    }

    DOC_PLACEHOLDER.textContent = "00:00:00".slice(
        0,
        8 - DOC_TIME_INPUT.value.length
    );
    DOC_TIME_INPUT.setAttribute(
        "style",
        "width: " + Math.max(385 - DOC_PLACEHOLDER.clientWidth, 1) + "px"
    );

    if (placeholderHidden) {
        DOC_PLACEHOLDER.setAttribute("hidden", true);
    }
}
function startTimerCountDown() {
    if (!timerState) return;

    // Convert time to seconds
    let val = DOC_TIME_INPUT.value.split(":").join("");
    while (val.length < 6) {
        val = "0" + val;
    }
    let t = +val.slice(0, 2) * 3600;
    t += +val.slice(2, 4) * 60;
    t += +val.slice(4);

    // Count down one second
    t--;

    // EDGE CASE t > 99:60:60, round down to t = 360059 (=99:59:59)
    if (t > 99 * 3600 + 60 * 60 + 60) t = 99 * 3600 + 59 * 60 + 59;

    // Convert back
    let hours = Math.floor(t / 3600);
    let minutes = Math.floor((t - hours * 3600) / 60);
    let seconds = t - hours * 3600 - minutes * 60;

    // Formatting colons :
    let hoursString = hours.toString();
    let minutesString = minutes < 10 ? "0" + minutes : minutes.toString();
    let secondsString = seconds < 10 ? "0" + seconds : seconds.toString();

    let timeString = hoursString + minutesString + secondsString;
    timeString = timeString.replace(/^0+/, "");

    // Set strings to input and placeholder text
    setDocInputAndPlaceholder(formatTime(timeString));

    if (DOC_TIME_INPUT.value === "") {
        // Timer complete
        new Audio("sounds/soft_alarm.mp3").play();

        timerState = false;
        setStopGraphics();
    } else {
        // Timer continue
        setTimeout(startTimerCountDown, 1000);
    }
}
function formatTime(val) {
    // Format string of time with colons :
    switch (val.length) {
        case 3:
            val = `${val.slice(0, 1)}:${val.slice(1)}`;
            break;
        case 4:
            val = `${val.slice(0, 2)}:${val.slice(2)}`;
            break;
        case 5:
            val = `${val.slice(0, 1)}:${val.slice(1, 3)}:${val.slice(3)}`;
            break;
        case 6:
            val = `${val.slice(0, 2)}:${val.slice(2, 4)}:${val.slice(4)}`;
        default:
            break;
    }
    return val;
}
