import { buildTenQuestionAssessment } from './assessmentBank';
import { Chapter, LanguageCourse, Lesson, PlaygroundStarter } from './types';
import { htmlChapters, htmlLessons } from './htmlCurriculum';
import { lessonEnrichments } from './lessonExplanations';
import { buildCurriculumWithReviews } from './reviewLessons';

export type {
  Chapter,
  CodeQuizCheck,
  CodeQuizQuestion,
  LanguageCourse,
  Lesson,
  LessonSection,
  LocalizedText,
  PlaygroundStarter,
  QuizQuestion,
  TagSpec,
} from './types';

export const languages: LanguageCourse[] = [
  {
    id: 'html',
    number: '01',
    name: 'HTML5',
    title: { en: 'HTML5', ar: 'HTML5' },
    description: {
      en: '12 Chapters · Tag-by-tag structure from document foundation to templates.',
      ar: '12 فصلاً · تعليم وسوم HTML5 بالتدريج من أساس المستند إلى القوالب.',
    },
  },
  {
    id: 'css',
    number: '02',
    name: 'CSS3',
    title: { en: 'CSS3', ar: 'CSS3' },
    description: {
      en: 'Box model, Flexbox, CSS Grid, and responsive layout systems.',
      ar: 'نموذج الصندوق، Flexbox، الشبكات CSS Grid، والتصميم المتجاوب.',
    },
  },
  {
    id: 'javascript',
    number: '03',
    name: 'JavaScript',
    title: { en: 'JavaScript', ar: 'JavaScript' },
    description: {
      en: 'Variables, functions, DOM interaction, and asynchronous requests.',
      ar: 'المتغيرات، الدوال، التفاعل مع DOM، والطلبات غير المتزامنة.',
    },
  },
  {
    id: 'react',
    number: '04',
    name: 'React & TypeScript',
    title: { en: 'React & TypeScript', ar: 'React و TypeScript' },
    description: {
      en: 'Reusable UI components, props, and state-driven interfaces.',
      ar: 'المكونات القابلة لإعادة الاستخدام، الخصائص، وإدارة الحالة.',
    },
  },
  {
    id: 'backend',
    number: '05',
    name: 'Backend & SQL',
    title: { en: 'Backend & SQL', ar: 'الخادم وقواعد البيانات' },
    description: {
      en: 'HTTP REST APIs, relational data modeling, and production deployment.',
      ar: 'واجهات HTTP البرمجية، قواعد البيانات العلائقية، والنشر الإنتاجي.',
    },
  },
];

const otherChapters: Chapter[] = [
  {
    id: 'css-ch-01',
    languageId: 'css',
    number: '01',
    title: { en: 'CSS Box Model & Layout', ar: 'نموذج الصندوق والتخطيط' },
    description: {
      en: 'Spacing, Flexbox alignment, and responsive Grid systems.',
      ar: 'المسافات، محاذاة Flexbox، وشبكات CSS Grid المتجاوبة.',
    },
  },
  {
    id: 'js-ch-01',
    languageId: 'javascript',
    number: '01',
    title: { en: 'Core Language & DOM', ar: 'أساسيات اللغة والتعامل مع DOM' },
    description: {
      en: 'Variables, functions, events, and async fetch.',
      ar: 'المتغيرات، الدوال، الأحداث، والطلبات غير المتزامنة.',
    },
  },
  {
    id: 'react-ch-01',
    languageId: 'react',
    number: '01',
    title: { en: 'Components & State', ar: 'المكونات وإدارة الحالة' },
    description: {
      en: 'Composable UI components, props, and useState.',
      ar: 'بناء المكونات، الخصائص، وحالة الواجهة.',
    },
  },
  {
    id: 'backend-ch-01',
    languageId: 'backend',
    number: '01',
    title: { en: 'APIs, Databases & Deployment', ar: 'الواجهات وقواعد البيانات والنشر' },
    description: {
      en: 'REST APIs, relational SQL tables, and shipping to production.',
      ar: 'واجهات REST، جداول SQL، والنشر الإنتاجي.',
    },
  },
];

const otherLessons: Lesson[] = [
  {
    id: 'css-box-model',
    languageId: 'css',
    chapterId: 'css-ch-01',
    order: 1,
    durationMinutes: 15,
    title: { en: 'CSS Box Model & Flexbox', ar: 'نموذج الصندوق و Flexbox' },
    summary: {
      en: 'Control spacing, borders, alignment, and flexible one-dimensional layouts.',
      ar: 'تحكّم بالمسافات والحدود والمحاذاة والتخطيطات المرنة.',
    },
    sections: [
      {
        heading: { en: 'Understanding the Box Model', ar: 'فهم نموذج الصندوق' },
        body: {
          en: 'Every element is a box with content, padding, border, and margin. Use box-sizing: border-box and display: flex for clean alignment.',
          ar: 'كل عنصر هو صندوق يتكون من المحتوى والحشوة والحدود والهامش. استخدم box-sizing: border-box و display: flex للمحاذاة الدقيقة.',
        },
        code: `* { box-sizing: border-box; }\n.bar {\n  display: flex;\n  justify-content: space-between;\n  padding: 16px;\n  border: 1px solid #e7e7e7;\n}`,
        codeLanguage: 'css',
      },
    ],
    challenge: {
      en: 'Align a two-item header using display: flex and justify-content: space-between.',
      ar: 'حاذي عنصرين في شريط علوي باستخدام display: flex و justify-content: space-between.',
    },
    starterCode: {
      html: `<header class="bar"><strong>CodePath</strong><nav>Docs</nav></header>`,
      css: `.bar { display: flex; justify-content: space-between; padding: 16px; border: 1px solid #111; }`,
      js: '',
    },
    quiz: [
      {
        id: 'css-q1',
        question: {
          en: 'Which property adds space inside an element between content and border?',
          ar: 'أي خاصية تضيف مساحة داخل العنصر بين المحتوى والحدود؟',
        },
        options: [
          { en: 'padding', ar: 'padding' },
          { en: 'margin', ar: 'margin' },
          { en: 'gap', ar: 'gap' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Padding adds internal space; margin adds external space outside the border.',
          ar: 'تضيف padding مساحة داخلية، بينما margin تضيف مساحة خارجية.',
        },
      },
    ],
  },
  {
    id: 'css-grid',
    languageId: 'css',
    chapterId: 'css-ch-01',
    order: 2,
    durationMinutes: 14,
    title: { en: 'CSS Grid & Responsive Layout', ar: 'شبكة CSS والتصميم المتجاوب' },
    summary: {
      en: 'Build multi-column responsive grids with repeat() and minmax().',
      ar: 'بناء شبكات متعددة الأعمدة متجاوبة باستخدام repeat() و minmax().',
    },
    sections: [
      {
        heading: { en: 'Fluid Grids', ar: 'الشبكات المرنة' },
        body: {
          en: 'CSS Grid defines rows and columns cleanly using fractional fr units.',
          ar: 'تتيح CSS Grid تقسيم الصفوف والأعمدة باستخدام وحدات fr المرنة.',
        },
        code: `.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));\n  gap: 16px;\n}`,
        codeLanguage: 'css',
      },
    ],
    challenge: {
      en: 'Build a responsive grid in the CSS tab using display: grid and grid-template-columns with minmax().',
      ar: 'أنشئ شبكة متجاوبة في تبويب CSS باستخدام display: grid و grid-template-columns مع minmax().',
    },
    starterCode: {
      html: `<div class="grid"><div>01</div><div>02</div><div>03</div></div>`,
      css: `.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; } .grid div { border: 1px solid #111; padding: 16px; }`,
      js: '',
    },
    quiz: [
      {
        id: 'css-q2',
        question: { en: 'What does 1fr stand for in CSS Grid?', ar: 'ماذا تعني وحدة 1fr في CSS Grid؟' },
        options: [
          { en: 'One fraction of available space', ar: 'جزء واحد من المساحة المتاحة' },
          { en: 'One fixed pixel', ar: 'بكسل واحد ثابت' },
          { en: 'One font unit', ar: 'وحدة خط واحدة' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'fr distributes remaining free space proportionally across grid tracks.',
          ar: 'توزع وحدة fr المساحة المتبقية بالتناسب بين الأعمدة.',
        },
      },
    ],
  },
  {
    id: 'js-essentials',
    languageId: 'javascript',
    chapterId: 'js-ch-01',
    order: 1,
    durationMinutes: 18,
    title: { en: 'Variables, Functions & DOM', ar: 'المتغيرات والدوال و DOM' },
    summary: {
      en: 'Declare variables with const/let, write functions, and handle DOM events.',
      ar: 'تعريف المتغيرات بـ const و let وكتابة الدوال والتفاعل مع أحداث الصفحة.',
    },
    sections: [
      {
        heading: { en: 'Interactive Logic', ar: 'المنطق التفاعلي' },
        body: {
          en: 'Combine const, let, functions, and addEventListener to make HTML pages respond to users.',
          ar: 'ادمج const و let والدوال و addEventListener لجعل صفحات HTML تتفاعل مع المستخدم.',
        },
        code: `const btn = document.querySelector('#inc');\nlet count = 0;\nbtn.addEventListener('click', () => {\n  count += 1;\n  console.log(count);\n});`,
        codeLanguage: 'javascript',
      },
    ],
    challenge: {
      en: 'Increment and log a counter value on button click.',
      ar: 'زد قيمة عدّاد واطبعها في وحدة التحكم عند النقر.',
    },
    starterCode: {
      html: `<button id="inc">Count: 0</button>`,
      css: `button { padding: 8px 16px; background: #111; color: #fff; border: 0; }`,
      js: `let c = 0; const b = document.getElementById('inc'); b.onclick = () => { c++; b.textContent = 'Count: ' + c; console.log(c); };`,
    },
    quiz: [
      {
        id: 'js-q1',
        question: {
          en: 'Which keyword prevents accidental variable reassignment?',
          ar: 'أي كلمة مفتاحية تمنع إعادة تعيين المتغير بالخطأ؟',
        },
        options: [
          { en: 'const', ar: 'const' },
          { en: 'var', ar: 'var' },
          { en: 'let', ar: 'let' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'const guarantees the binding cannot be reassigned.',
          ar: 'تضمن const عدم إعادة تعيين قيمة المتغير.',
        },
      },
    ],
  },
  {
    id: 'react-components',
    languageId: 'react',
    chapterId: 'react-ch-01',
    order: 1,
    durationMinutes: 18,
    title: { en: 'Components, Props & State', ar: 'المكونات والخصائص والحالة' },
    summary: {
      en: 'Build composable UI components powered by props and useState.',
      ar: 'بناء مكونات واجهة قابلة لإعادة الاستخدام باستخدام props و useState.',
    },
    sections: [
      {
        heading: { en: 'UI as a Function of State', ar: 'الواجهة كدالة للحالة' },
        body: {
          en: 'Components accept props from parents and manage local dynamic values with useState.',
          ar: 'تستقبل المكونات خصائص من الأب وتدير البيانات المتغيرة عبر useState.',
        },
        code: `function Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;\n}`,
        codeLanguage: 'tsx',
      },
    ],
    challenge: {
      en: 'Write click-handler state logic in the JS tab to toggle the #btn label between "On" and "Off".',
      ar: 'اكتب منطق الحالة عند النقر في تبويب JS لتبديل نص الزر #btn بين "On" و "Off".',
    },
    starterCode: {
      html: `<button id="btn">Off</button>`,
      css: `button { padding: 8px 16px; border: 1px solid #111; }`,
      js: `let on = false; const b = document.getElementById('btn'); b.onclick = () => { on = !on; b.textContent = on ? 'On' : 'Off'; };`,
    },
    quiz: [
      {
        id: 'react-q1',
        question: { en: 'How do props flow in React?', ar: 'كيف تتدفق الخصائص في React؟' },
        options: [
          { en: 'From parent to child', ar: 'من الأب إلى الابن' },
          { en: 'From child to parent automatically', ar: 'من الابن إلى الأب تلقائياً' },
          { en: 'Only in CSS', ar: 'في CSS فقط' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Props flow strictly downward from parent to child components.',
          ar: 'تتدفق الخصائص في اتجاه واحد من الأب إلى الابن.',
        },
      },
    ],
  },
  {
    id: 'backend-deploy',
    languageId: 'backend',
    chapterId: 'backend-ch-01',
    order: 1,
    durationMinutes: 18,
    title: { en: 'REST APIs, SQL & Deployment', ar: 'واجهات REST وقواعد SQL والنشر' },
    summary: {
      en: 'Connect HTTP endpoints, relational database queries, and production deployment.',
      ar: 'ربط نقاط نهاية HTTP واستعلامات قواعد البيانات ونشر التطبيق للإنتاج.',
    },
    sections: [
      {
        heading: { en: 'Client, Server & Database', ar: 'العميل والخادم وقاعدة البيانات' },
        body: {
          en: 'Backend servers handle HTTP requests, query SQL tables safely, and protect secrets in environment variables.',
          ar: 'تعالج الخوادم طلبات HTTP وتستعلم من جداول SQL وتحمي المفاتيح السرية في متغيرات البيئة.',
        },
        code: `app.get('/api/health', (req, res) => {\n  res.status(200).json({ ok: true });\n});`,
        codeLanguage: 'typescript',
      },
    ],
    challenge: {
      en: 'Log a JSON response payload containing status: 200 and ok: true in the JS tab using console.log().',
      ar: 'اطبع استجابة JSON تحتوي على status: 200 و ok: true في تبويب JS باستخدام console.log().',
    },
    starterCode: {
      html: `<p>Check console output.</p>`,
      css: `body { font-family: system-ui; padding: 24px; }`,
      js: `console.log({ status: 200, ok: true });`,
    },
    quiz: [
      {
        id: 'backend-q1',
        question: {
          en: 'Where should secret API keys be stored in production?',
          ar: 'أين يجب حفظ مفاتيح API السرية في بيئة الإنتاج؟',
        },
        options: [
          { en: 'Server-side environment variables', ar: 'متغيرات البيئة على الخادم' },
          { en: 'Inside HTML files', ar: 'داخل ملفات HTML' },
          { en: 'In CSS comments', ar: 'في تعليقات CSS' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Environment variables keep secrets out of source control and browser bundles.',
          ar: 'تحفظ متغيرات البيئة المفاتيح السرية بعيداً عن الكود المصدري والمتصفح.',
        },
      },
    ],
  },
];

export const chapters: Chapter[] = [...htmlChapters, ...otherChapters];

const enrichedBaseLessons: Lesson[] = [...htmlLessons, ...otherLessons].map((lesson) => {
  const enrichment = lessonEnrichments[lesson.id];
  const enrichedLesson: Lesson = enrichment
    ? {
        ...lesson,
        explanation: enrichment.explanation,
        imageUrl: enrichment.imageUrl,
        imageAlt: enrichment.imageAlt,
        imageCaption: enrichment.imageCaption,
      }
    : lesson;

  const assessment = buildTenQuestionAssessment(enrichedLesson);
  return {
    ...enrichedLesson,
    quiz: assessment.quiz,
    codeQuiz: assessment.codeQuiz,
  };
});

export const lessons: Lesson[] = buildCurriculumWithReviews(enrichedBaseLessons);

export const playgroundTemplates: Record<string, PlaygroundStarter> = {
  card: {
    html: `<main class="card">\n  <p class="kicker">HTML5 Foundations</p>\n  <h1>CodePath Student</h1>\n  <p class="bio">Building clean, accessible semantic HTML from first principles.</p>\n  <button id="actionBtn">Verify Setup</button>\n</main>`,
    css: `body {\n  margin: 0;\n  padding: 32px;\n  font-family: system-ui, sans-serif;\n  background: #f5f5f5;\n  color: #111111;\n}\n.card {\n  max-width: 380px;\n  background: #ffffff;\n  border: 1px solid #e7e7e7;\n  padding: 28px;\n}\n.kicker { font-size: 12px; color: #777777; margin: 0 0 8px; }\nh1 { margin: 0 0 10px; font-size: 22px; }\n.bio { color: #555555; line-height: 1.6; margin: 0 0 20px; }\nbutton {\n  background: #111111;\n  color: #ffffff;\n  border: none;\n  padding: 10px 18px;\n  font-size: 13px;\n  cursor: pointer;\n}`,
    js: `document.getElementById('actionBtn').addEventListener('click', () => {\n  console.log('Environment verified at ' + new Date().toLocaleTimeString());\n});`,
  },
  layout: {
    html: `<section class="grid">\n  <article class="cell"><strong>01.</strong> HTML5</article>\n  <article class="cell"><strong>02.</strong> CSS3</article>\n  <article class="cell"><strong>03.</strong> JavaScript</article>\n  <article class="cell"><strong>04.</strong> Backend</article>\n</section>`,
    css: `body { margin: 0; padding: 24px; font-family: system-ui, sans-serif; background: #fff; color: #111; }\n.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));\n  gap: 12px;\n}\n.cell {\n  border: 1px solid #111111;\n  padding: 20px;\n  font-size: 14px;\n}`,
    js: `console.log('4-item responsive grid ready.');`,
  },
  counter: {
    html: `<div class="counter">\n  <span id="value">0</span>\n  <div class="actions">\n    <button id="dec">-1</button>\n    <button id="reset">Reset</button>\n    <button id="inc">+1</button>\n  </div>\n</div>`,
    css: `body { margin: 0; padding: 32px; font-family: system-ui, sans-serif; background: #fff; color: #111; }\n.counter { border: 1px solid #e7e7e7; padding: 24px; max-width: 280px; }\n#value { display: block; font-size: 40px; font-weight: 700; margin-bottom: 16px; }\n.actions { display: flex; gap: 8px; }\nbutton { flex: 1; padding: 8px 12px; border: 1px solid #111; background: #fff; cursor: pointer; }\n#inc { background: #111; color: #fff; }`,
    js: `let count = 0;\nconst el = document.getElementById('value');\nconst update = (v) => { count = v; el.textContent = count; console.log('Counter:', count); };\ndocument.getElementById('inc').onclick = () => update(count + 1);\ndocument.getElementById('dec').onclick = () => update(count - 1);\ndocument.getElementById('reset').onclick = () => update(0);`,
  },
  api: {
    html: `<div class="panel">\n  <button id="fetchBtn">Simulate GET /api/tracks</button>\n  <pre id="output">Press the button to run an async request.</pre>\n</div>`,
    css: `body { margin: 0; padding: 24px; font-family: system-ui, sans-serif; }\nbutton { background: #111; color: #fff; border: 0; padding: 10px 16px; cursor: pointer; }\npre { margin-top: 16px; padding: 16px; background: #f5f5f5; border: 1px solid #e7e7e7; font-size: 12px; }`,
    js: `document.getElementById('fetchBtn').addEventListener('click', async () => {\n  const out = document.getElementById('output');\n  out.textContent = 'Requesting /api/tracks...';\n  await new Promise((r) => setTimeout(r, 450));\n  const payload = { status: 200, languages: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Backend'] };\n  out.textContent = JSON.stringify(payload, null, 2);\n  console.log('200 OK', payload);\n});`,
  },
};
