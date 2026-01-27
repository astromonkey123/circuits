const button_slider = document.getElementById('slider');
const help_button = document.getElementById('help');
const help_window = document.getElementById('help-window');

let total_slide = 0;

button_slider.addEventListener('wheel', (e) => slideBarWheel(e));

help.addEventListener('click', () => showHelpWindow());

function slideBarWheel(e) {
    total_slide -= e.deltaY;

    if (total_slide > 0) {
        total_slide = 0;
    } else if (total_slide < -410) {
        total_slide = -410;
    }

    button_slider.style.left = total_slide + "px";
}

function showHelpWindow() {
    if (help_window.style.visibility == "visible") {
        help_window.style.visibility = "hidden";
    } else {
        help_window.style.visibility = "visible";
    }
}