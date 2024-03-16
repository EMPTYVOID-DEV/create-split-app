import cfont from "cfonts";
import { title } from "../const.js";

const splitColors = {
  startingColor: "#e55037",
  endingColor: "#38bdf8",
};

export function welcome() {
  cfont.say(title, {
    font: "tiny", // define the font face
    align: "left", // define text alignment
    colors: null, // define all colors
    background: "transparent", // define the background color, you can also use `backgroundColor` here as key
    letterSpacing: 1, // define letter spacing
    lineHeight: 1, // define the line height
    space: true, // define if the output text should have empty lines on top and on the bottom
    maxLength: "0", // define how many character can be on one line
    gradient: Object.values(splitColors), // define your two gradient colors
    independentGradient: false, // define if you want to recalculate the gradient for each new line
    transitionGradient: false, // define if this is a transition between colors directly
    env: "node",
  });
}
