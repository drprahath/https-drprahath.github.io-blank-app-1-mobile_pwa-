"use strict";

const QUESTIONS = [
  {
    id: "step_1",
    stepLabel: "Step 1 of 12",
    question: "What is your age?",
    options: ["Less than 19", "19-34", "35-55", "More than 55", "Do not wish to answer"],
  },
  {
    id: "step_2",
    stepLabel: "Step 2 of 12",
    question: "What is your gender?",
    options: ["Female", "Male", "Transgender", "Non-binary / Gender diverse", "Prefer not to say"],
  },
  {
    id: "step_3",
    stepLabel: "Step 3 of 12",
    question: "Are you married?",
    options: ["Yes", "No", "Do not wish to answer"],
  },
  {
    id: "step_3_1",
    stepLabel: "Step 3.1 of 12",
    question: "If married, what is your current status?",
    condition: (answers) => answers.step_3 === "Yes",
    options: [
      "Living with spouse",
      "Living with a non-marital person",
      "Separated",
      "Do not wish to answer",
      "Not applicable",
    ],
  },
  {
    id: "step_3_2",
    stepLabel: "Step 3.2 of 12",
    question: "Have you had sex with anyone outside your marital relationship?",
    condition: (answers) => answers.step_3 === "Yes",
    options: ["Yes", "No"],
  },
  {
    id: "step_4",
    stepLabel: "Step 4 of 12",
    question: "When was your last sex encounter?",
    options: [
      "Less than a week",
      "More than a week less than a month",
      "More than a month",
      "Never",
      "Do not wish to answer",
    ],
  },
  {
    id: "step_5",
    stepLabel: "Step 5 of 12",
    question: "How do you know or meet your sexual partner?",
    condition: (answers) => answers.step_4 !== "Never",
    options: [
      "Spouse / Long-term regular partner",
      "Acquaintance",
      "Internet dating site/mobile app",
      "Facebook/Whatsapp friends",
      "Commercial Sex worker",
      "Do not wish to answer",
    ],
  },
  {
    id: "step_6",
    stepLabel: "Step 6 of 12",
    question: "Did you or your partner use any protective method?",
    condition: (answers) => answers.step_4 !== "Never",
    options: ["Yes", "Sometimes / Inconsistently", "No"],
  },
  {
    id: "step_7",
    stepLabel: "Step 7 of 12",
    question: "Have you had more than one sexual partner in the past 6 months?",
    condition: (answers) => answers.step_4 !== "Never",
    options: ["Yes", "No", "Do not wish to answer"],
  },
  {
    id: "step_8",
    stepLabel: "Step 8 of 12",
    question: "Did you have any symptoms in your genital, anal, or oral region, or on your skin?",
    options: ["Yes", "No"],
  },
  {
    id: "step_9",
    stepLabel: "Step 9 of 12",
    question: "Has your sexual partner recently had STI symptoms or an STI/HIV diagnosis?",
    options: ["Yes", "No", "Not sure / Do not know"],
  },
  {
    id: "step_10",
    stepLabel: "Step 10 of 12",
    question: "Have you ever shared needles, syringes, or skin-piercing instruments?",
    options: ["Yes", "No", "Do not wish to answer"],
  },
  {
    id: "step_11",
    stepLabel: "Step 11 of 12",
    question: "When was your last HIV or STI test?",
    options: ["Within the last 6 months", "More than 6 months ago", "Never tested", "Do not wish to answer"],
  },
  {
    id: "step_12",
    stepLabel: "Step 12 of 12",
    question: "Would you like confidential testing and prevention guidance?",
    options: ["Yes", "No"],
  },
];

const RESULT_LEVELS = {
  higher: {
    title: "Higher Risk – Clinical Evaluation & Testing Recommended",
    color: "#c62828",
    background: "#ffebee",
  },
  moderate: {
    title: "Moderate Risk – Routine STI/HIV Screening Advised",
    color: "#a84800",
    background: "#fff3e0",
  },
  lower: {
    title: "Lower Reported Risk – Continue Preventive Practices",
    color: "#2e7d32",
    background: "#e8f5e9",
  },
};

const app = document.querySelector("#app");
const state = {
  screen: "intro",
  answers: {},
  questionId: null,
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function getActiveQuestions() {
  return QUESTIONS.filter((question) => !question.condition || question.condition(state.answers));
}

function clearInactiveBranchAnswers(questionId, answer) {
  if (questionId === "step_3" && answer !== "Yes") {
    delete state.answers.step_3_1;
    delete state.answers.step_3_2;
  }
  if (questionId === "step_4" && answer === "Never") {
    delete state.answers.step_5;
    delete state.answers.step_6;
    delete state.answers.step_7;
  }
}

function renderIntro() {
  app.innerHTML = `
    <section class="card" aria-labelledby="intro-title">
      <p class="eyebrow">Private · Non-judgmental · Self-guided</p>
      <h1 id="intro-title">Take a moment to understand your STI risk</h1>
      <p class="lead">Answer a few questions about your sexual health to understand possible risk factors and practical next steps.</p>
      <div class="intro-note">
        <p><strong>Created by Dr Prahatheeswaran G, MBBS, MD, MPH, PhD Scholar at IIT Madras.</strong></p>
        <p>This app aims to help you understand your own risk category and possible next steps. Its information and questions refer to standard materials from NACO and the Tamil Nadu State AIDS Control Society (TANSACS).</p>
        <p>Suggestions and comments are welcome.</p>
        <p class="slogan">Prevention is better than cure.</p>
      </div>
      <p class="privacy-note">Your answers are used only during this session. They are not saved or sent anywhere.</p>
      <div class="button-row">
        <button class="button" type="button" data-action="show-instructions">Start self-assessment</button>
      </div>
    </section>`;
}

function renderInstructions() {
  app.innerHTML = `
    <section class="card" aria-labelledby="instructions-title">
      <p class="eyebrow">Before you begin</p>
      <h1 id="instructions-title">Assessment instructions and confidentiality</h1>
      <ul class="guidance-list">
        <li><strong>Non-judgmental:</strong> The questions are intended to help you understand potential risk factors and practical health steps.</li>
        <li><strong>Confidential:</strong> Your responses remain in this browser session. They are not stored or transmitted online.</li>
        <li><strong>Your choice:</strong> Where available, you may choose “Do not wish to answer” or “Prefer not to say.”</li>
        <li><strong>Not a diagnosis:</strong> This assessment cannot replace clinical testing. Only a healthcare professional and laboratory test can confirm an STI or HIV diagnosis.</li>
      </ul>
      <div class="button-row">
        <button class="button secondary" type="button" data-action="show-intro">Back</button>
        <button class="button" type="button" data-action="begin">Proceed to questions</button>
      </div>
    </section>`;
}

function renderQuestion() {
  const activeQuestions = getActiveQuestions();
  let questionIndex = activeQuestions.findIndex((question) => question.id === state.questionId);
  if (questionIndex < 0) {
    questionIndex = 0;
    state.questionId = activeQuestions[0].id;
  }
  const question = activeQuestions[questionIndex];
  const progress = ((questionIndex + 1) / activeQuestions.length) * 100;
  const options = question.options.map((option, index) => {
    const optionId = `option-${index}`;
    const checked = state.answers[question.id] === option ? " checked" : "";
    return `
      <label class="option-card" for="${optionId}">
        <input id="${optionId}" type="radio" name="answer" value="${escapeHtml(option)}"${checked}>
        <span class="choice-box" aria-hidden="true"></span>
        <span class="option-text">${escapeHtml(option)}</span>
      </label>`;
  }).join("");

  app.innerHTML = `
    <div class="progress-wrap" aria-label="Assessment progress">
      <div class="progress-label">
        <span>${escapeHtml(question.stepLabel)}</span>
        <span>Question ${questionIndex + 1} of ${activeQuestions.length}</span>
      </div>
      <div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(progress)}" aria-label="Assessment progress">
        <div class="progress-value" style="width: ${progress}%"></div>
      </div>
    </div>
    <form id="question-form" class="question-card" novalidate>
      <fieldset aria-describedby="selection-error">
        <legend>${escapeHtml(question.question)}</legend>
        <div class="option-list">${options}</div>
      </fieldset>
      <p id="selection-error" class="selection-error" role="alert"></p>
      <div class="question-actions">
        ${questionIndex > 0 ? '<button class="button secondary" type="button" data-action="previous">Previous</button>' : '<button class="button secondary" type="button" data-action="cancel">Cancel assessment</button>'}
        <button class="button" type="submit">${questionIndex === activeQuestions.length - 1 ? "Finish assessment" : "Next question"}</button>
      </div>
    </form>`;
}

function evaluateRisk() {
  const answers = state.answers;
  let score = 0;
  const reasons = [];

  if (answers.step_8 === "Yes") {
    score += 4;
    reasons.push("Reported symptoms in the genital, anal, oral, or skin region require prompt clinical evaluation.");
  }
  if (answers.step_9 === "Yes") {
    score += 3;
    reasons.push("Partner history of STI symptoms or diagnosis increases potential exposure risk.");
  }
  if (answers.step_10 === "Yes") {
    score += 4;
    reasons.push("Sharing needles or skin-piercing instruments carries a high risk for blood-borne infections (HIV, Hepatitis B/C).");
  }
  if (["No", "Sometimes / Inconsistently"].includes(answers.step_6)) {
    score += 2;
    reasons.push("Inconsistent or non-use of protective barriers (condoms) increases STI transmission risk.");
  }
  if (answers.step_3_2 === "Yes" || answers.step_7 === "Yes") {
    score += 2;
    reasons.push("Having multiple or concurrent sexual partners increases the likelihood of exposure.");
  }
  if ([
    "Commercial Sex worker",
    "Internet dating site/mobile app",
    "Facebook/Whatsapp friends",
  ].includes(answers.step_5)) {
    score += 1;
    reasons.push("Engaging with partners whose STI status may be unknown increases potential risk.");
  }

  if (score >= 4) return { ...RESULT_LEVELS.higher, reasons };
  if (score >= 2) return { ...RESULT_LEVELS.moderate, reasons };
  return { ...RESULT_LEVELS.lower, reasons };
}

function renderResults() {
  const result = evaluateRisk();
  const reasons = result.reasons.length
    ? `<ul class="result-list">${result.reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}</ul>`
    : "<p>No acute symptoms or high-risk exposure factors were reported. Routine periodic screening remains recommended for sexually active individuals.</p>";
  const timeSensitive = state.answers.step_4 === "Less than a week"
    ? `<p class="time-sensitive"><strong>Time-sensitive:</strong> If a potential HIV exposure occurred within the last 72 hours, consult a physician immediately about post-exposure prophylaxis (PEP).</p>`
    : "";

  app.innerHTML = `
    <section class="card" aria-labelledby="results-title">
      <p class="eyebrow">Your summary</p>
      <div class="risk-banner" style="--result-color: ${result.color}; --result-bg: ${result.background}">
        <h1 id="results-title">${escapeHtml(result.title)}</h1>
        <p>Disclaimer: This self-assessment identifies potential risk factors and is not a medical diagnosis. Only a healthcare professional and laboratory test can confirm an STI or HIV status.</p>
      </div>
      <div class="result-grid">
        <section class="result-section" aria-labelledby="factors-title">
          <h3 id="factors-title">Key factors from your responses</h3>
          ${reasons}
          ${timeSensitive}
        </section>
        <section class="result-section" aria-labelledby="next-steps-title">
          <h3 id="next-steps-title">Recommended next steps and referrals</h3>
          <ol class="result-list">
            <li><strong>Free confidential testing:</strong> Visit an Integrated Counselling &amp; Testing Centre (ICTC) or Designated STI/RTI Clinic (Suraksha Clinic) at a Government Hospital.</li>
            <li><strong>National helplines:</strong> Call 1097 (NACO helpline) or 104 (State Health Helpline) for confidential counselling and clinic locations.</li>
            <li><strong>Prevention:</strong> Use condoms consistently, encourage partner testing, and discuss PrEP with a healthcare provider.</li>
          </ol>
        </section>
      </div>
      <div class="button-row">
        <button class="button secondary" type="button" data-action="review">Review answers</button>
        <button class="button" type="button" data-action="restart">Start a new assessment</button>
      </div>
    </section>`;
}

function render() {
  if (state.screen === "intro") renderIntro();
  else if (state.screen === "instructions") renderInstructions();
  else if (state.screen === "quiz") renderQuestion();
  else renderResults();
  app.focus({ preventScroll: true });
}

function resetAssessment() {
  state.screen = "intro";
  state.answers = {};
  state.questionId = null;
  render();
}

app.addEventListener("change", (event) => {
  if (event.target.matches('input[name="answer"]') && state.screen === "quiz") {
    const question = QUESTIONS.find((item) => item.id === state.questionId);
    state.answers[question.id] = event.target.value;
    clearInactiveBranchAnswers(question.id, event.target.value);
    const error = document.querySelector("#selection-error");
    if (error) error.textContent = "";
  }
});

app.addEventListener("submit", (event) => {
  if (event.target.id !== "question-form") return;
  event.preventDefault();
  const question = QUESTIONS.find((item) => item.id === state.questionId);
  const selected = state.answers[question.id];
  if (!selected) {
    const error = document.querySelector("#selection-error");
    error.textContent = "Please select an option before continuing.";
    app.querySelector('input[name="answer"]')?.focus();
    return;
  }

  const activeQuestions = getActiveQuestions();
  const questionIndex = activeQuestions.findIndex((item) => item.id === question.id);
  if (questionIndex === activeQuestions.length - 1) {
    state.screen = "results";
  } else {
    state.questionId = activeQuestions[questionIndex + 1].id;
  }
  render();
});

app.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  switch (button.dataset.action) {
    case "show-instructions":
      state.screen = "instructions";
      break;
    case "show-intro":
      state.screen = "intro";
      break;
    case "begin":
      state.screen = "quiz";
      state.questionId = getActiveQuestions()[0].id;
      break;
    case "previous": {
      const activeQuestions = getActiveQuestions();
      const questionIndex = activeQuestions.findIndex((item) => item.id === state.questionId);
      if (questionIndex > 0) state.questionId = activeQuestions[questionIndex - 1].id;
      break;
    }
    case "cancel":
    case "restart":
      resetAssessment();
      return;
    case "review":
      state.screen = "quiz";
      state.questionId = getActiveQuestions()[0].id;
      break;
    default:
      return;
  }
  render();
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js")
    .then(() => navigator.serviceWorker.ready)
    .then(() => {
      document.querySelector("#offline-status").textContent =
        "Offline access is ready. Responses remain on this device and are never transmitted.";
    })
    .catch((error) => {
      console.error("Offline support could not be enabled.", error);
      document.querySelector("#offline-status").textContent =
        "Offline installation is unavailable at this address. Use HTTPS or localhost.";
    });
}

render();
