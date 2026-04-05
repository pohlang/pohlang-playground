// PohLang Playground – Interactive Quiz & Challenges
// ---------------------------------------------------

const QUIZ_QUESTIONS = [
  {
    id: 1,
    category: 'Output',
    difficulty: 'beginner',
    question: 'How do you print text to the output in PohLang?',
    options: [
      'print("Hello")',
      'Write "Hello"',
      'echo "Hello"',
      'console.log("Hello")'
    ],
    correct: 1,
    explanation: 'In PohLang, the <code>Write</code> keyword is used to output text. E.g. <code>Write "Hello, World!"</code>'
  },
  {
    id: 2,
    category: 'Variables',
    difficulty: 'beginner',
    question: 'Which line correctly assigns the value 42 to a variable called <code>answer</code>?',
    options: [
      'let answer = 42',
      'answer := 42',
      'Set answer to 42',
      'var answer = 42'
    ],
    correct: 2,
    explanation: 'PohLang uses <code>Set &lt;name&gt; to &lt;value&gt;</code> to declare and assign variables.'
  },
  {
    id: 3,
    category: 'Conditionals',
    difficulty: 'beginner',
    question: 'What is the correct way to start an if-statement in PohLang?',
    options: [
      'if (x > 5) {',
      'when x > 5:',
      'If x > 5',
      'check x > 5 then'
    ],
    correct: 2,
    explanation: 'PohLang uses <code>If &lt;condition&gt;</code> to start a conditional block, closed with <code>End</code>.'
  },
  {
    id: 4,
    category: 'Conditionals',
    difficulty: 'beginner',
    question: 'In PohLang, which keyword is used as "else"?',
    options: [
      'Else',
      'Otherwise',
      'Elif',
      'Both "Else" and "Otherwise"'
    ],
    correct: 3,
    explanation: 'PohLang supports both <code>Else</code> and <code>Otherwise</code> as the else branch of a conditional.'
  },
  {
    id: 5,
    category: 'Loops',
    difficulty: 'beginner',
    question: 'Which snippet loops exactly 5 times in PohLang?',
    options: [
      'for i in range(5):',
      'loop 5 do',
      'Repeat 5 times',
      'While count < 5'
    ],
    correct: 2,
    explanation: '<code>Repeat N times</code> is the PohLang way to create a counted loop. Close the block with <code>End</code>.'
  },
  {
    id: 6,
    category: 'Functions',
    difficulty: 'beginner',
    question: 'How do you define a function named <code>greet</code> that takes a <code>name</code> parameter?',
    options: [
      'function greet(name) {',
      'def greet(name):',
      'Make greet with name',
      'func greet(name):'
    ],
    correct: 2,
    explanation: 'Functions in PohLang are defined with <code>Make &lt;name&gt; with &lt;params&gt;</code>, closed with <code>End</code>.'
  },
  {
    id: 7,
    category: 'Functions',
    difficulty: 'beginner',
    question: 'How do you call the function <code>greet</code> with the argument <code>"Alice"</code>?',
    options: [
      'greet("Alice")',
      'call greet with "Alice"',
      'Use greet with "Alice"',
      'invoke greet "Alice"'
    ],
    correct: 2,
    explanation: 'Function calls in PohLang use <code>Use &lt;name&gt; with &lt;args&gt;</code>.'
  },
  {
    id: 8,
    category: 'Collections',
    difficulty: 'beginner',
    question: 'Which line creates a list of three fruits in PohLang?',
    options: [
      'Set fruits = ["apple", "banana", "cherry"]',
      'fruits = list("apple", "banana", "cherry")',
      'Set fruits to Make a list of "apple", "banana", "cherry"',
      'Make fruits with "apple", "banana", "cherry"'
    ],
    correct: 2,
    explanation: 'Lists in PohLang are created with <code>Make a list of &lt;items&gt;</code>.'
  },
  {
    id: 9,
    category: 'Collections',
    difficulty: 'intermediate',
    question: 'How do you access the first element of a list called <code>nums</code>?',
    options: [
      'nums.first()',
      'nums[0]',
      'first(nums)',
      'nums.get(0)'
    ],
    correct: 1,
    explanation: 'PohLang uses zero-based square-bracket indexing: <code>nums[0]</code> gives the first element.'
  },
  {
    id: 10,
    category: 'Collections',
    difficulty: 'intermediate',
    question: 'How do you create a dictionary in PohLang?',
    options: [
      'Set d to {"key": "value"}',
      'Set d to Make a dictionary with "key" set to "value"',
      'Make dict with "key" = "value"',
      'dict(key="value")'
    ],
    correct: 1,
    explanation: 'Dictionaries use <code>Make a dictionary with &lt;key&gt; set to &lt;value&gt;</code>.'
  },
  {
    id: 11,
    category: 'Operators',
    difficulty: 'beginner',
    question: 'Which of these is a valid PohLang way to say "a times b"?',
    options: [
      'a × b',
      'a * b',
      'a times b',
      'Both "a * b" and "a times b"'
    ],
    correct: 3,
    explanation: 'PohLang supports both symbolic (<code>a * b</code>) and natural language (<code>a times b</code>) operators.'
  },
  {
    id: 12,
    category: 'Program Structure',
    difficulty: 'beginner',
    question: 'What keyword pair is used to mark the beginning and end of a program?',
    options: [
      'BEGIN / END',
      'Start Program / End Program',
      'Program Start / Program End',
      'Open / Close'
    ],
    correct: 1,
    explanation: 'A PohLang program is wrapped in <code>Start Program</code> … <code>End Program</code>.'
  },
  {
    id: 13,
    category: 'Operators',
    difficulty: 'intermediate',
    question: 'How do you write a "not equal" comparison in PohLang?',
    options: [
      'Only !=',
      'Only "is not equal to"',
      'Only <>',
      'Both != and "is not equal to" are valid'
    ],
    correct: 3,
    explanation: 'PohLang accepts both the symbolic <code>!=</code> and the phrase <code>is not equal to</code>.'
  },
  {
    id: 14,
    category: 'Loops',
    difficulty: 'intermediate',
    question: 'After the body of a loop or function, which keyword closes the block?',
    options: [
      'Done',
      'EndLoop / EndFunction',
      'End',
      'Close'
    ],
    correct: 2,
    explanation: 'All blocks (loops, functions, conditionals) are closed with a single <code>End</code> keyword.'
  },
  {
    id: 15,
    category: 'Comments',
    difficulty: 'beginner',
    question: 'How do you write a single-line comment in PohLang?',
    options: [
      '// This is a comment',
      '/* This is a comment */',
      '# This is a comment',
      '-- This is a comment'
    ],
    correct: 2,
    explanation: 'PohLang uses the <code>#</code> character for single-line comments, just like Python.'
  }
];

const CHALLENGES = [
  {
    id: 1,
    title: 'Hello, World!',
    difficulty: 'beginner',
    emoji: '👋',
    description: 'Write a PohLang program that outputs exactly: <code>Hello, World!</code>',
    hint: 'Use the <code>Write</code> keyword. Wrap your program in <code>Start Program</code> / <code>End Program</code>.',
    starterCode: 'Start Program\n    # Write your code here\nEnd Program',
    expectedOutput: 'Hello, World!',
    points: 10
  },
  {
    id: 2,
    title: 'Variable Math',
    difficulty: 'beginner',
    emoji: '🔢',
    description: 'Set a variable <code>x</code> to <code>15</code> and a variable <code>y</code> to <code>7</code>, then <code>Write</code> their sum.',
    hint: 'Use <code>Set x to 15</code>, then <code>Write x + y</code>.',
    starterCode: 'Start Program\n    # Declare x and y, then write their sum\nEnd Program',
    expectedOutput: '22',
    points: 15
  },
  {
    id: 3,
    title: 'Conditional Check',
    difficulty: 'beginner',
    emoji: '🔀',
    description: 'Write a program that checks if <code>10 is greater than 5</code> and writes <code>Yes!</code> if true, or <code>No!</code> otherwise.',
    hint: 'Use <code>If 10 > 5</code> … <code>Otherwise</code> … <code>End</code>.',
    starterCode: 'Start Program\n    # Check 10 > 5 and write Yes! or No!\nEnd Program',
    expectedOutput: 'Yes!',
    points: 20
  },
  {
    id: 4,
    title: 'Loop Counter',
    difficulty: 'beginner',
    emoji: '🔁',
    description: 'Write a program that prints the word <code>Go!</code> exactly 3 times (each on its own line).',
    hint: 'Use <code>Repeat 3 times</code> … <code>End</code>.',
    starterCode: 'Start Program\n    # Print "Go!" three times\nEnd Program',
    expectedOutput: 'Go!\nGo!\nGo!',
    points: 20
  },
  {
    id: 5,
    title: 'Function Builder',
    difficulty: 'intermediate',
    emoji: '⚙️',
    description: 'Define a function <code>square</code> that takes <code>n</code> and writes <code>n * n</code>. Then call it with the value <code>4</code>.',
    hint: 'Use <code>Make square with n</code> / <code>Write n * n</code> / <code>End</code>, then <code>Use square with 4</code>.',
    starterCode: 'Start Program\n    # Define and call your function here\nEnd Program',
    expectedOutput: '16',
    points: 30
  },
  {
    id: 6,
    title: 'List Explorer',
    difficulty: 'intermediate',
    emoji: '📋',
    description: 'Create a list called <code>colors</code> with the items <code>"red"</code>, <code>"green"</code>, <code>"blue"</code>. Then write the <em>second</em> item.',
    hint: 'Lists are zero-indexed, so the second item is at index <code>1</code>.',
    starterCode: 'Start Program\n    # Create the list and write the second item\nEnd Program',
    expectedOutput: 'green',
    points: 25
  }
];

// ─── State ──────────────────────────────────────────────────────────────────
const LS_QUIZ_PROGRESS = 'pohlang.quiz.progress';
const LS_CHALLENGE_PROGRESS = 'pohlang.challenge.progress';

const quizState = {
  questions: [],
  currentIndex: 0,
  score: 0,
  streak: 0,
  maxStreak: 0,
  answers: [],    // { questionId, chosen, correct }
  started: false,
  finished: false
};

function loadChallengeProgress() {
  try {
    return JSON.parse(localStorage.getItem(LS_CHALLENGE_PROGRESS)) || {};
  } catch { return {}; }
}

function saveChallengeProgress(progress) {
  try { localStorage.setItem(LS_CHALLENGE_PROGRESS, JSON.stringify(progress)); } catch {}
}

// ─── Quiz rendering ──────────────────────────────────────────────────────────
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startQuiz() {
  quizState.questions = shuffleArray(QUIZ_QUESTIONS);
  quizState.currentIndex = 0;
  quizState.score = 0;
  quizState.streak = 0;
  quizState.maxStreak = 0;
  quizState.answers = [];
  quizState.started = true;
  quizState.finished = false;
  renderQuizQuestion();
}

function renderQuizLanding() {
  const container = document.getElementById('quizContainer');
  if (!container) return;
  container.innerHTML = `
    <div class="quiz-landing">
      <div class="quiz-landing-icon">🧠</div>
      <h2>PohLang Knowledge Quiz</h2>
      <p>Test your understanding of PohLang syntax and concepts with <strong>${QUIZ_QUESTIONS.length} questions</strong> across multiple topics.</p>
      <div class="quiz-features">
        <div class="quiz-feature-item"><span>📊</span><span>15 Questions</span></div>
        <div class="quiz-feature-item"><span>🔥</span><span>Streak Bonus</span></div>
        <div class="quiz-feature-item"><span>💡</span><span>Explanations</span></div>
        <div class="quiz-feature-item"><span>🏆</span><span>Performance Badge</span></div>
      </div>
      <button id="startQuizBtn" class="primary-btn quiz-start-btn">Start Quiz 🚀</button>
    </div>
  `;
  document.getElementById('startQuizBtn')?.addEventListener('click', startQuiz);
}

function renderQuizQuestion() {
  const container = document.getElementById('quizContainer');
  if (!container) return;

  const q = quizState.questions[quizState.currentIndex];
  const total = quizState.questions.length;
  const progress = quizState.currentIndex / total * 100;

  container.innerHTML = `
    <div class="quiz-header">
      <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${progress}%"></div></div>
      <div class="quiz-meta">
        <span class="quiz-counter">${quizState.currentIndex + 1} / ${total}</span>
        <span class="quiz-score-live">⭐ ${quizState.score} pts</span>
        <span class="quiz-streak ${quizState.streak >= 3 ? 'hot' : ''}">🔥 ${quizState.streak}</span>
      </div>
    </div>
    <div class="quiz-card">
      <div class="quiz-card-top">
        <span class="quiz-category">${q.category}</span>
        <span class="quiz-difficulty difficulty-${q.difficulty}">${q.difficulty}</span>
      </div>
      <p class="quiz-question">${q.question}</p>
      <div class="quiz-options" id="quizOptions">
        ${q.options.map((opt, i) => `
          <button class="quiz-option" data-idx="${i}">${String.fromCharCode(65 + i)}. ${opt}</button>
        `).join('')}
      </div>
    </div>
  `;

  document.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => answerQuestion(parseInt(btn.dataset.idx)));
  });
}

function answerQuestion(chosen) {
  const q = quizState.questions[quizState.currentIndex];
  const correct = chosen === q.correct;
  const pointsEarned = correct ? (10 + (quizState.streak >= 3 ? 5 : 0)) : 0;

  if (correct) {
    quizState.score += pointsEarned;
    quizState.streak++;
    quizState.maxStreak = Math.max(quizState.maxStreak, quizState.streak);
  } else {
    quizState.streak = 0;
  }

  quizState.answers.push({ questionId: q.id, chosen, correct });

  // Show feedback
  const optionsEl = document.getElementById('quizOptions');
  if (!optionsEl) return;

  optionsEl.querySelectorAll('.quiz-option').forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add('correct');
    if (i === chosen && !correct) btn.classList.add('incorrect');
  });

  const feedback = document.createElement('div');
  feedback.className = `quiz-feedback ${correct ? 'feedback-correct' : 'feedback-incorrect'}`;
  feedback.innerHTML = `
    <div class="feedback-icon">${correct ? '✅' : '❌'}</div>
    <div class="feedback-body">
      <strong>${correct ? `Correct! +${pointsEarned} pts${quizState.streak >= 3 ? ' 🔥 Streak bonus!' : ''}` : 'Not quite!'}</strong>
      <p>${q.explanation}</p>
    </div>
  `;

  optionsEl.after(feedback);

  const nextBtn = document.createElement('button');
  nextBtn.className = 'primary-btn quiz-next-btn';
  const isLast = quizState.currentIndex === quizState.questions.length - 1;
  nextBtn.textContent = isLast ? 'See Results 🏆' : 'Next Question →';
  nextBtn.addEventListener('click', () => {
    quizState.currentIndex++;
    if (quizState.currentIndex >= quizState.questions.length) {
      renderQuizResults();
    } else {
      renderQuizQuestion();
    }
  });

  const card = document.querySelector('.quiz-card');
  card?.appendChild(nextBtn);
}

function renderQuizResults() {
  quizState.finished = true;
  const container = document.getElementById('quizContainer');
  if (!container) return;

  const total = quizState.questions.length;
  const correct = quizState.answers.filter(a => a.correct).length;
  const pct = Math.round((correct / total) * 100);

  let badge, badgeClass, message;
  if (pct >= 90) { badge = '🥇 Expert'; badgeClass = 'gold'; message = 'Outstanding! You really know PohLang!'; }
  else if (pct >= 70) { badge = '🥈 Proficient'; badgeClass = 'silver'; message = 'Great work! Keep practicing to reach expert level!'; }
  else if (pct >= 50) { badge = '🥉 Learner'; badgeClass = 'bronze'; message = 'Good effort! Review the explanations and try again.'; }
  else { badge = '📖 Beginner'; badgeClass = ''; message = 'Keep learning! Check the syntax guide and try again.'; }

  // Build review list
  const reviewItems = quizState.answers.map((a, i) => {
    const q = quizState.questions[i];
    return `
      <div class="review-item ${a.correct ? 'review-correct' : 'review-incorrect'}">
        <span class="review-icon">${a.correct ? '✅' : '❌'}</span>
        <div class="review-body">
          <span class="review-q">${q.question}</span>
          ${!a.correct ? `<span class="review-answer">Correct: ${q.options[q.correct]}</span>` : ''}
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="quiz-results">
      <div class="results-badge badge-${badgeClass}">${badge}</div>
      <h2 class="results-title">Quiz Complete!</h2>
      <p class="results-message">${message}</p>
      <div class="results-stats">
        <div class="results-stat">
          <span class="stat-value">${correct}/${total}</span>
          <span class="stat-label">Correct</span>
        </div>
        <div class="results-stat">
          <span class="stat-value">${pct}%</span>
          <span class="stat-label">Score</span>
        </div>
        <div class="results-stat">
          <span class="stat-value">⭐ ${quizState.score}</span>
          <span class="stat-label">Points</span>
        </div>
        <div class="results-stat">
          <span class="stat-value">🔥 ${quizState.maxStreak}</span>
          <span class="stat-label">Best Streak</span>
        </div>
      </div>
      <div class="results-review">
        <h3>Review Your Answers</h3>
        ${reviewItems}
      </div>
      <button id="retakeQuizBtn" class="primary-btn quiz-start-btn">Retake Quiz 🔄</button>
    </div>
  `;

  document.getElementById('retakeQuizBtn')?.addEventListener('click', startQuiz);
}

// ─── Challenges rendering ─────────────────────────────────────────────────────
function renderChallenges() {
  const container = document.getElementById('challengesContainer');
  if (!container) return;

  const progress = loadChallengeProgress();
  const totalPoints = CHALLENGES.reduce((s, c) => s + (progress[c.id]?.completed ? c.points : 0), 0);
  const maxPoints = CHALLENGES.reduce((s, c) => s + c.points, 0);
  const completed = CHALLENGES.filter(c => progress[c.id]?.completed).length;
  const progressPercent = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;

  container.innerHTML = `
    <div class="challenges-header">
      <div class="challenges-title-row">
        <h2>🎯 Coding Challenges</h2>
        <div class="challenges-score">⭐ ${totalPoints} / ${maxPoints} pts</div>
      </div>
      <p class="challenges-desc">Apply your PohLang skills by solving real coding challenges. Your code is executed and checked against expected output.</p>
      <div class="challenges-overall-bar">
        <div class="challenges-overall-fill" style="width:${progressPercent}%"></div>
      </div>
      <div class="challenges-progress-text">${completed} of ${CHALLENGES.length} challenges completed</div>
    </div>
    <div class="challenges-grid">
      ${CHALLENGES.map(c => {
        const done = progress[c.id]?.completed;
        return `
          <div class="challenge-card ${done ? 'challenge-done' : ''}" data-challenge-id="${c.id}">
            <div class="challenge-card-top">
              <span class="challenge-emoji">${c.emoji}</span>
              <span class="challenge-difficulty difficulty-${c.difficulty}">${c.difficulty}</span>
              ${done ? '<span class="challenge-badge">✅ Done</span>' : ''}
            </div>
            <h3 class="challenge-title">${c.title}</h3>
            <p class="challenge-desc">${c.description}</p>
            <div class="challenge-points">🏆 ${c.points} pts</div>
            <button class="challenge-open-btn ${done ? '' : 'primary-btn'}" data-id="${c.id}">
              ${done ? '🔁 Redo' : '▶ Attempt'}
            </button>
          </div>
        `;
      }).join('')}
    </div>
  `;

  container.querySelectorAll('.challenge-open-btn').forEach(btn => {
    btn.addEventListener('click', () => openChallenge(parseInt(btn.dataset.id)));
  });
}

function openChallenge(id) {
  const challenge = CHALLENGES.find(c => c.id === id);
  if (!challenge) return;

  const overlay = document.createElement('div');
  overlay.id = 'challengeOverlay';
  overlay.className = 'challenge-overlay';
  overlay.innerHTML = `
    <div class="challenge-modal">
      <div class="challenge-modal-header">
        <span>${challenge.emoji} Challenge ${challenge.id}: ${challenge.title}</span>
        <button id="closeChallengeModal" class="icon-btn">✕</button>
      </div>
      <div class="challenge-modal-body">
        <div class="challenge-modal-desc">
          <p>${challenge.description}</p>
          <details class="challenge-hint-details">
            <summary>💡 Hint</summary>
            <p>${challenge.hint}</p>
          </details>
          <div class="challenge-expected">
            <strong>Expected output:</strong>
            <pre>${challenge.expectedOutput}</pre>
          </div>
        </div>
        <div class="challenge-editor-section">
          <div class="challenge-editor-label">Your Code</div>
          <textarea id="challengeEditor" class="challenge-editor" spellcheck="false">${challenge.starterCode}</textarea>
          <div class="challenge-actions">
            <button id="runChallengeBtn" class="primary-btn">▶ Run &amp; Check</button>
            <button id="resetChallengeBtn">🔄 Reset</button>
          </div>
          <div id="challengeResult" class="challenge-result hidden"></div>
          <pre id="challengeOutput" class="challenge-output hidden"></pre>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById('closeChallengeModal')?.addEventListener('click', () => {
    overlay.remove();
    renderChallenges();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
      renderChallenges();
    }
  });

  document.getElementById('resetChallengeBtn')?.addEventListener('click', () => {
    document.getElementById('challengeEditor').value = challenge.starterCode;
    document.getElementById('challengeResult').className = 'challenge-result hidden';
    document.getElementById('challengeOutput').className = 'challenge-output hidden';
  });

  document.getElementById('runChallengeBtn')?.addEventListener('click', () =>
    runChallenge(challenge)
  );

  // Ctrl/Cmd+Enter inside the challenge editor
  document.getElementById('challengeEditor')?.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runChallenge(challenge);
    }
  });
}

async function runChallenge(challenge) {
  const editor = document.getElementById('challengeEditor');
  const resultEl = document.getElementById('challengeResult');
  const outputEl = document.getElementById('challengeOutput');
  const runBtn = document.getElementById('runChallengeBtn');
  if (!editor || !resultEl || !outputEl) return;

  const code = editor.value;
  runBtn.disabled = true;
  runBtn.textContent = '⏳ Running…';
  resultEl.className = 'challenge-result hidden';
  outputEl.className = 'challenge-output hidden';

  let stdout = '';
  let errorMsg = '';

  try {
    const res = await fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, mode: 'run' })
    });
    const data = await res.json();
    stdout = (data.stdout || '').trim();
    if (!data.ok && !stdout) {
      errorMsg = data.stderr || data.error || 'Execution failed';
    }
  } catch (e) {
    errorMsg = '⚠️ Runner not available. Start the local server to run challenges.';
  }

  runBtn.disabled = false;
  runBtn.textContent = '▶ Run & Check';

  outputEl.className = 'challenge-output';
  outputEl.textContent = stdout || errorMsg;

  if (errorMsg && !stdout) {
    resultEl.className = 'challenge-result result-error';
    resultEl.innerHTML = '<span>⚠️ Error running your code. Check the output above.</span>';
  } else {
    const expected = challenge.expectedOutput.trim();
    const passed = stdout === expected;

    if (passed) {
      resultEl.className = 'challenge-result result-pass';
      resultEl.innerHTML = `<span>🎉 Correct! You earned <strong>${challenge.points} pts</strong>!</span>`;
      // Save progress
      const progress = loadChallengeProgress();
      if (!progress[challenge.id]?.completed) {
        progress[challenge.id] = { completed: true, ts: Date.now() };
        saveChallengeProgress(progress);
      }
    } else {
      resultEl.className = 'challenge-result result-fail';
      resultEl.innerHTML = `
        <span>❌ Not quite. Expected:<br><code>${challenge.expectedOutput}</code></span>
      `;
    }
  }

  resultEl.classList.remove('hidden');
}

// ─── Tab navigation ──────────────────────────────────────────────────────────
function initTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  const panels = document.querySelectorAll('.tab-panel');
  const playgroundActions = document.getElementById('playgroundActions');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const target = tab.dataset.tab;
      const panel = document.getElementById(`panel-${target}`);
      if (panel) panel.classList.add('active');

      // Show/hide playground-specific header actions
      if (playgroundActions) {
        playgroundActions.style.display = (target === 'playground') ? '' : 'none';
      }

      if (target === 'quiz') {
        const container = document.getElementById('quizContainer');
        if (container && !container.querySelector('.quiz-landing, .quiz-card, .quiz-results')) {
          renderQuizLanding();
        }
      } else if (target === 'challenges') {
        renderChallenges();
      }
    });
  });
}

// Init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  // Render quiz landing in background so it's ready when tab opens
  const qc = document.getElementById('quizContainer');
  if (qc) renderQuizLanding();
  renderChallenges();
});
