// This is a simple Password Generator App that will generate random password maybe you can you them to secure your account.
// I tried my best to make the code as simple as possible please dont mind the variable names.
// Also this idea came in my mind after checking Traversy Media's latest video.

// Clear the concole on every refresh
console.clear();
// set the body to full height
// document.body.style.height = `${innerHeight}px`

// Range Slider Properties.
// Fill : The trailing color that you see when you drag the slider.
// background : Default Range Slider Background
const sliderProps = {
	fill: "#0B1EDF",
	background: "rgba(255, 255, 255, 0.214)",
};

// Selecting the Range Slider container which will effect the LENGTH property of the password.
const slider = document.querySelector(".range__slider");

// Text which will show the value of the range slider.
const sliderValue = document.querySelector(".length__title");

// Using Event Listener to apply the fill and also change the value of the text.
slider.querySelector("input").addEventListener("input", event => {
	sliderValue.setAttribute("data-length", event.target.value);
	applyFill(event.target);
});
// Selecting the range input and passing it in the applyFill func.
applyFill(slider.querySelector("input"));
// This function is responsible to create the trailing color and setting the fill.
function applyFill(slider) {
	const percentage = (100 * (slider.value - slider.min)) / (slider.max - slider.min);
	const bg = `linear-gradient(90deg, ${sliderProps.fill} ${percentage}%, ${sliderProps.background} ${percentage +
			0.1}%)`;
	slider.style.background = bg;
	sliderValue.setAttribute("data-length", slider.value);
}

// Object of all the function names that we will use to create random letters of password
const randomFunc = {
	lower: getRandomLower,
	upper: getRandomUpper,
	number: getRandomNumber,
	symbol: getRandomSymbol,
};

// Random more secure value
function secureMathRandom() {
	return window.crypto.getRandomValues(new Uint32Array(1))[0] / (Math.pow(2, 32) - 1);
}

// Generator Functions
// All the functions that are responsible to return a random value taht we will use to create password.
function getRandomLower() {
	return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}
function getRandomUpper() {
	return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}
function getRandomNumber() {
	return String.fromCharCode(Math.floor(secureMathRandom() * 10) + 48);
}
function getRandomSymbol() {
	const symbols = '~!@#$%^&*()_+{}":?><;.,';
	return symbols[Math.floor(Math.random() * symbols.length)];
}

// Selecting all the DOM Elements that are necessary -->

// The Viewbox where the result will be shown
const resultEl = document.getElementById("result");
// The input slider, will use to change the length of the password
const lengthEl = document.getElementById("slider");

// Checkboxes representing the options that is responsible to create differnt type of password based on user
const uppercaseEl = document.getElementById("uppercase");
const lowercaseEl = document.getElementById("lowercase");
const numberEl = document.getElementById("number");
const symbolEl = document.getElementById("symbol");

// Button to generate the password
const generateBtn = document.getElementById("generate");
// Button to copy the text
const copyBtn = document.getElementById("copy-btn");
// Result viewbox container
const resultContainer = document.querySelector(".result");
// Text info showed after generate button is clicked
const copyInfo = document.querySelector(".result__info.right");
// Text appear after copy button is clicked
const copiedInfo = document.querySelector(".result__info.left");

// if this variable is trye only then the copyBtn will appear, i.e. when the user first click generate the copyBth will interact.
let generatedPassword = false;

// Update Css Props of the COPY button
// Getting the bounds of the result viewbox container
let resultContainerBound = {
	left: resultContainer.getBoundingClientRect().left,
	top: resultContainer.getBoundingClientRect().top,
};
// This will update the position of the copy button based on mouse Position
resultContainer.addEventListener("mousemove", e => {
	resultContainerBound = {
		left: resultContainer.getBoundingClientRect().left,
		top: resultContainer.getBoundingClientRect().top,
	};
	if(generatedPassword){
		copyBtn.style.opacity = '1';
		copyBtn.style.pointerEvents = 'all';
		copyBtn.style.setProperty("--x", `${e.x - resultContainerBound.left}px`);
		copyBtn.style.setProperty("--y", `${e.y - resultContainerBound.top}px`);
	}else{
		copyBtn.style.opacity = '0';
		copyBtn.style.pointerEvents = 'none';
	}
});
window.addEventListener("resize", e => {
	resultContainerBound = {
		left: resultContainer.getBoundingClientRect().left,
		top: resultContainer.getBoundingClientRect().top,
	};
});

// Copy Password in clipboard
copyBtn.addEventListener("click", () => {
	const textarea = document.createElement("textarea");
	const password = resultEl.innerText;
	if (!password || password == "CLICK GENERATE") {
		return;
	}
	textarea.value = password;
	document.body.appendChild(textarea);
	textarea.select();
	document.execCommand("copy");
	textarea.remove();

	copyInfo.style.transform = "translateY(200%)";
	copyInfo.style.opacity = "0";
	copiedInfo.style.transform = "translateY(0%)";
	copiedInfo.style.opacity = "0.75";
});

// When Generate is clicked Password id generated.
generateBtn.addEventListener("click", () => {
	const length = +lengthEl.value;
	const hasLower = lowercaseEl.checked;
	const hasUpper = uppercaseEl.checked;
	const hasNumber = numberEl.checked;
	const hasSymbol = symbolEl.checked;
	generatedPassword = true;
	resultEl.innerText = generatePassword(length, hasLower, hasUpper, hasNumber, hasSymbol);
	copyInfo.style.transform = "translateY(0%)";
	copyInfo.style.opacity = "0.75";
	copiedInfo.style.transform = "translateY(200%)";
	copiedInfo.style.opacity = "0";
});

// Function responsible to generate password and then returning it.
function generatePassword(length, lower, upper, number, symbol) {
	let generatedPassword = "";
	const typesCount = lower + upper + number + symbol;
	const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(item => Object.values(item)[0]);
	if (typesCount === 0) {
		return "";
	}
	for (let i = 0; i < length; i++) {
		typesArr.forEach(type => {
			const funcName = Object.keys(type)[0];
			generatedPassword += randomFunc[funcName]();
		});
	}
	return generatedPassword.slice(0, length)
									.split('').sort(() => Math.random() - 0.5)
									.join('');
}

// function that handles the checkboxes state, so at least one needs to be selected. The last checkbox will be disabled.
function disableOnlyCheckbox(){
	let totalChecked = [uppercaseEl, lowercaseEl, numberEl, symbolEl].filter(el => el.checked)
	totalChecked.forEach(el => {
		if(totalChecked.length == 1){
			el.disabled = true;
		}else{
			el.disabled = false;
		}
	})
}

[uppercaseEl, lowercaseEl, numberEl, symbolEl].forEach(el => {
	el.addEventListener('click', () => {
		disableOnlyCheckbox()
	})
})


// loading page
const template = `
	<style>
		:host {
			--size: 40px;
			position: fixed;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			background-color: #9094ff;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
		.isometric {
			position: relative;
			transform: rotateX(55deg) rotateZ(-45deg) translate(calc(var(--size) * -2), 0);
			margin-bottom: calc(3 * var(--size));
		}
		.box {
			position: absolute;
			width: var(--size);
			height: var(--size);
			background: #6C70E0;
			animation: slide .9s cubic-bezier(.65,.53,.59,.93) infinite;
		}
		.box:before, .box:after {
			content: "";
			position: absolute;
			width: 100%;
			height: 100%;
		}
		.box:before {
			background: #0E0F47;
			transform: skew(0deg, -45deg);
			right: 100%;
			top: 50%;
		}
		.box:after {
			background: #262BC7;
			transform: skew(-45deg, 0deg);
			top: 100%;
			right: 50%;
		}
		.box:nth-child(1) {
			--sx: 50%;
			--sy: -50%;
			--ex: 150%;
			--ey: 50%;
		}
		.box:nth-child(2) {
			--sx: -50%;
			--sy: -50%;
			--ex: 50%;
			--ey: -50%;
		}
		.box:nth-child(3) {
			--sx: 150%;
			--sy: 50%;
			--ex: 50%;
			--ey: 50%;
		}
		.box:nth-child(4) {
			--sx: 50%;
			--sy: 50%;
			--ex: -50%;
			--ey: -50%;
		}
		h1 {
			color: #06067e;
		}
		span {
			color: transparent;
			position: relative;
		}
		span:before {
			content: ".";
			position: absolute;
			bottom: -2px;
			color: #06067e;
			margin-left: 1px;
			animation: load 1.5s linear infinite;
			display: inline-block;
		}
		@keyframes slide {
			0% {
				transform: translate(var(--sx), var(--sy));
			}
			65% {
				transform: translate(var(--ex), var(--sy));
			}
			95%, 100% {
				transform: translate(var(--ex), var(--ey));
			}
		}
		@keyframes load {
			20% {
				content: ".";
			}
			40% {
				content: "..";
			}
			80%, 100% {
				content: "...";
			}
		}
	</style>
	<div class="isometric">
		<div class="box"></div>
		<div class="box"></div>
		<div class="box"></div>
		<div class="box"></div>
	</div>
	<h1>Loading<span>...</span></h1>
`;

customElements.define('ui-loader', class extends HTMLElement {
	constructor() {
		super();
	}
	connectedCallback() {
		this.attachShadow({ mode: 'open' });
		this.shadowRoot.innerHTML = template;
	}
});

var TIME_PER_PAGE = 2500;
	window.onload = function() {
		var pages = document.querySelectorAll('.page'),
			numPages = pages ? pages.length : 0;
			i = -1;

		function nextPage() {
			if (i >= 0)
				pages[i].classList.remove('currentPage');

			i++;
			pages[i].classList.add('currentPage');
			if (i < numPages - 1)
				setTimeout(nextPage, TIME_PER_PAGE);
		}

		nextPage();
	}