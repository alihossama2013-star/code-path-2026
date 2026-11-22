import { Chapter, Lesson, LocalizedText, TagSpec } from './types';

interface TagLessonSeed {
  id: string;
  chapterId: string;
  order: number;
  durationMinutes: number;
  title: LocalizedText;
  summary: LocalizedText;
  tags: string[];
  tagSpecs: TagSpec[];
  exampleCode: string;
  challenge: LocalizedText;
  quizQuestion: {
    question: LocalizedText;
    options: LocalizedText[];
    correctIndex: number;
    explanation: LocalizedText;
  };
}

function buildTagLesson(seed: TagLessonSeed): Lesson {
  return {
    id: seed.id,
    languageId: 'html',
    chapterId: seed.chapterId,
    order: seed.order,
    durationMinutes: seed.durationMinutes,
    tags: seed.tags,
    tagSpecs: seed.tagSpecs,
    title: seed.title,
    summary: seed.summary,
    sections: [
      {
        heading: {
          en: 'Syntax, Attributes & Purpose',
          ar: 'الصيغة والسمات والغرض',
        },
        body: seed.summary,
        code: seed.exampleCode,
        codeLanguage: 'html',
      },
    ],
    challenge: seed.challenge,
    starterCode: {
      html: seed.exampleCode,
      css:
        seed.chapterId === 'html-ch-08'
          ? `body {\n  font-family: system-ui, sans-serif;\n  padding: 24px;\n  line-height: 1.6;\n  color: #111111;\n}\ntable {\n  border-collapse: collapse;\n  width: 100%;\n}\ncaption {\n  font-weight: 600;\n  margin-bottom: 8px;\n  text-align: left;\n}\nth, td {\n  border: 1px solid #111111;\n  padding: 8px 12px;\n  text-align: left;\n}`
          : `body {\n  font-family: system-ui, sans-serif;\n  padding: 24px;\n  line-height: 1.6;\n  color: #111111;\n}`,
      js: '',
    },
    quiz: [
      {
        id: `${seed.id}-q1`,
        question: seed.quizQuestion.question,
        options: seed.quizQuestion.options,
        correctIndex: seed.quizQuestion.correctIndex,
        explanation: seed.quizQuestion.explanation,
      },
    ],
  };
}

export const htmlChapters: Chapter[] = [
  {
    id: 'html-ch-01',
    languageId: 'html',
    number: '01',
    title: { en: 'HTML Document Foundation', ar: 'أساس مستند HTML' },
    description: {
      en: 'Document declaration, root structure, metadata, and external resources.',
      ar: 'تعريف المستند، الهيكل الجذري، البيانات الوصفية، والموارد الخارجية.',
    },
  },
  {
    id: 'html-ch-02',
    languageId: 'html',
    number: '02',
    title: { en: 'Text and Text Formatting', ar: 'النصوص وتنسيق النصوص' },
    description: {
      en: 'Headings, emphasis & edits, quotations, technical notation, definition lists, data, and time.',
      ar: 'العناوين، التأكيد والتعديلات، الاقتباسات، الأكواد والاتجاه، قوائم التعريف، البيانات، والتوقيت.',
    },
  },
  {
    id: 'html-ch-03',
    languageId: 'html',
    number: '03',
    title: { en: 'Semantic Page Structure', ar: 'الهيكلة الدلالية للصفحة' },
    description: {
      en: 'Landmarks and containers for organizing meaningful document sections.',
      ar: 'المعالم الدلالية والحاويات لتنظيم أقسام المستند بوضوح.',
    },
  },
  {
    id: 'html-ch-04',
    languageId: 'html',
    number: '04',
    title: { en: 'Links & Navigation', ar: 'الروابط والتنقل' },
    description: {
      en: 'Hyperlinks, image maps, clickable regions, and search landmarks.',
      ar: 'الروابط التشعبية، خرائط الصور، المناطق التفاعلية، ونطاق البحث.',
    },
  },
  {
    id: 'html-ch-05',
    languageId: 'html',
    number: '05',
    title: { en: 'Lists & Menus', ar: 'القوائم' },
    description: {
      en: 'Unordered, ordered, list items, and toolbar menus.',
      ar: 'القوائم غير المرتبة والمرتبة وعناصر القوائم وقوائم الأوامر.',
    },
  },
  {
    id: 'html-ch-06',
    languageId: 'html',
    number: '06',
    title: { en: 'Images & Vector Graphics', ar: 'الصور والرسوم المتجهة' },
    description: {
      en: 'Embedded images, responsive art direction, figures, and SVG graphics.',
      ar: 'الصور المدمجة، الصور المتجاوبة، الأشكال التوضيحية، ورسوم SVG.',
    },
  },
  {
    id: 'html-ch-07',
    languageId: 'html',
    number: '07',
    title: { en: 'Audio, Video & Canvas', ar: 'الصوت والفيديو ولوحة الرسم' },
    description: {
      en: 'Native media players, subtitle tracks, and programmable canvas.',
      ar: 'مشغلات الوسائط المدمجة، مسارات الترجمة، ولوحة الرسم.',
    },
  },
  {
    id: 'html-ch-08',
    languageId: 'html',
    number: '08',
    title: { en: 'Tables & Tabular Data', ar: 'الجداول والبيانات الجدولية' },
    description: {
      en: 'Structured rows, headers, cells, table sections, and column groups.',
      ar: 'الصفوف، العناوين، الخلايا، أقسام الجدول، ومجموعات الأعمدة.',
    },
  },
  {
    id: 'html-ch-09',
    languageId: 'html',
    number: '09',
    title: { en: 'Forms & Inputs — Core', ar: 'النماذج والمدخلات — الأساسيات' },
    description: {
      en: 'Forms, input fields, labels, multiline text, buttons, and select menus.',
      ar: 'النماذج، حقول الإدخال، التسميات، النصوص الطويلة، الأزرار، والقوائم المنسدلة.',
    },
  },
  {
    id: 'html-ch-10',
    languageId: 'html',
    number: '10',
    title: { en: 'Forms & Inputs — Controls', ar: 'النماذج والمدخلات — عناصر متقدمة' },
    description: {
      en: 'Options, fieldsets, datalists, calculated outputs, progress, and meters.',
      ar: 'الخيارات، تجميع الحقول، قوائم الاقتراحات، المخرجات، ومؤشرات التقدم.',
    },
  },
  {
    id: 'html-ch-11',
    languageId: 'html',
    number: '11',
    title: { en: 'Interactive & Embedded Content', ar: 'العناصر التفاعلية والتضمين' },
    description: {
      en: 'Native accordions, modal dialogs, iframes, and external objects.',
      ar: 'القوائم القابلة للطي، النوافذ الحوارية، الإطارات المضمنة، والكائنات الخارجية.',
    },
  },
  {
    id: 'html-ch-12',
    languageId: 'html',
    number: '12',
    title: { en: 'Scripting & Templates', ar: 'البرمجة النصية والقوالب' },
    description: {
      en: 'Script containers, fallback notices, inert templates, and component slots.',
      ar: 'حاويات الأكواد، المحتوى البديل، القوالب المخفية، ومنافذ المكونات.',
    },
  },
];

export const htmlLessons: Lesson[] = [
  // ================= CHAPTER 01 =================
  buildTagLesson({
    id: 'html-01-01',
    chapterId: 'html-ch-01',
    order: 1,
    durationMinutes: 6,
    title: { en: 'Document Declaration', ar: 'تعريف نوع المستند' },
    summary: {
      en: 'Declare HTML5 standards mode at the very top of every document using <!DOCTYPE html>.',
      ar: 'التصريح بنمط HTML5 القياسي في أول سطر من كل مستند باستخدام <!DOCTYPE html>.',
    },
    tags: ['<!DOCTYPE html>'],
    tagSpecs: [
      {
        tag: '<!DOCTYPE html>',
        syntax: '<!DOCTYPE html>',
        attributes: {
          en: 'No attributes required. Case-insensitive instruction placed on line 1.',
          ar: 'لا يحتاج إلى سمات. تعليمة تُكتب في السطر الأول لإخبار المتصفح بإصدار HTML5.',
        },
        description: {
          en: 'Prevents browsers from entering legacy quirks mode and ensures standard HTML5 rendering.',
          ar: 'يمنع المتصفح من الدخول في وضع التوافق القديم ويضمن عرضاً قياسياً لـ HTML5.',
        },
      },
    ],
    exampleCode: `<!DOCTYPE html>
<html>
  <body>
    <p>HTML5 standards mode is active.</p>
  </body>
</html>`,
    challenge: {
      en: 'Write a minimal HTML document starting with <!DOCTYPE html> and a paragraph inside <body>.',
      ar: 'اكتب مستند HTML بسيطاً يبدأ بـ <!DOCTYPE html> وفقرة داخل <body>.',
    },
    quizQuestion: {
      question: {
        en: 'Where must <!DOCTYPE html> be placed in an HTML file?',
        ar: 'أين يجب وضع <!DOCTYPE html> في ملف HTML؟',
      },
      options: [
        { en: 'As the very first line before <html>', ar: 'في أول سطر قبل وسم <html>' },
        { en: 'Inside the <body> tag', ar: 'داخل وسم <body>' },
        { en: 'At the bottom of the file', ar: 'في نهاية الملف' },
      ],
      correctIndex: 0,
      explanation: {
        en: '<!DOCTYPE html> must appear on line 1 so the browser parses the document in standards mode from the start.',
        ar: 'يجب أن يكون في السطر الأول ليقرأ المتصفح المستند بالوضع القياسي منذ البداية.',
      },
    },
  }),
  buildTagLesson({
    id: 'html-01-02',
    chapterId: 'html-ch-01',
    order: 2,
    durationMinutes: 8,
    title: { en: 'Root and Document Metadata', ar: 'الجذر والبيانات الوصفية للمستند' },
    summary: {
      en: 'Wrap the entire page in <html> and hold document configuration inside <head>.',
      ar: 'تغليف الصفحة بالكامل داخل <html> ووضع إعدادات المستند داخل <head>.',
    },
    tags: ['<html>', '<head>'],
    tagSpecs: [
      {
        tag: '<html>',
        syntax: '<html lang="en" dir="ltr">...</html>',
        attributes: {
          en: 'lang (language code like "en" or "ar"), dir ("ltr" or "rtl").',
          ar: 'lang (رمز اللغة مثل "ar" أو "en")، و dir (اتجاه النص "rtl" أو "ltr").',
        },
        description: {
          en: 'The root element that encloses every other element on the page.',
          ar: 'العنصر الجذري الذي يحتوي على كافة عناصر الصفحة الأخرى.',
        },
      },
      {
        tag: '<head>',
        syntax: '<head>...</head>',
        attributes: {
          en: 'Global attributes only. Contains non-visible metadata tags.',
          ar: 'يقبل السمات العامة فقط ويحتوي على وسوم الإعدادات غير المرئية للمستخدم.',
        },
        description: {
          en: 'Stores document title, character encoding, stylesheets, and metadata.',
          ar: 'يخزّن عنوان الصفحة، ترميز الأحرف، روابط التنسيق، والبيانات الوصفية.',
        },
      },
    ],
    exampleCode: `<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <title>Root & Head Example</title>
  </head>
  <body>
    <p>Inside the root html element.</p>
  </body>
</html>`,
    challenge: {
      en: 'Write an HTML document using <html lang="ar" dir="rtl"> (or lang="en") with a <head> section inside it.',
      ar: 'اكتب مستند HTML يبدأ بـ <html lang="ar" dir="rtl"> مع قسم <head> بداخله.',
    },
    quizQuestion: {
      question: {
        en: 'Which attribute on <html> specifies the primary language of the document?',
        ar: 'أي سمة على وسم <html> تحدد اللغة الأساسية للمستند؟',
      },
      options: [
        { en: 'lang', ar: 'lang' },
        { en: 'src', ar: 'src' },
        { en: 'href', ar: 'href' },
      ],
      correctIndex: 0,
      explanation: {
        en: 'The lang attribute helps screen readers and search engines identify the page language.',
        ar: 'تساعد سمة lang قارئات الشاشة ومحركات البحث على معرفة لغة الصفحة.',
      },
    },
  }),
  buildTagLesson({
    id: 'html-01-03',
    chapterId: 'html-ch-01',
    order: 3,
    durationMinutes: 6,
    title: { en: 'Document Content', ar: 'محتوى المستند' },
    summary: {
      en: 'Place all visible text, headings, images, and interactive controls inside <body>.',
      ar: 'وضع جميع النصوص والعناوين والصور والعناصر التفاعلية المرئية داخل <body>.',
    },
    tags: ['<body>'],
    tagSpecs: [
      {
        tag: '<body>',
        syntax: '<body>...</body>',
        attributes: {
          en: 'Global attributes (id, class, style, data-*). Only one <body> per document.',
          ar: 'السمات العامة (id, class, style). يُسمح بوسم <body> واحد فقط في المستند.',
        },
        description: {
          en: 'Represents the entire visible content rendered inside the browser viewport.',
          ar: 'يمثل كامل المحتوى المرئي الذي يعرضه المتصفح داخل نافذة العرض.',
        },
      },
    ],
    exampleCode: `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Body Tag</title>
  </head>
  <body>
    <h1>Visible Document Content</h1>
    <p>Everything the user reads and interacts with belongs inside body.</p>
  </body>
</html>`,
    challenge: {
      en: 'Inside <body>, add an <h1> heading and a paragraph (<p>) describing what belongs inside the document body.',
      ar: 'داخل <body>، أضف عنواناً <h1> وفقرة <p> توضح ما يوضع داخل جسم المستند.',
    },
    quizQuestion: {
      question: {
        en: 'How many <body> elements should an HTML document contain?',
        ar: 'كم عدد عناصر <body> المسموح بها في مستند HTML الواحد؟',
      },
      options: [
        { en: 'Exactly one', ar: 'عنصر واحد فقط' },
        { en: 'One per section', ar: 'عنصر لكل قسم' },
        { en: 'Unlimited', ar: 'عدد غير محدود' },
      ],
      correctIndex: 0,
      explanation: {
        en: 'A valid HTML document has only one <body> element directly inside <html>.',
        ar: 'يحتوي مستند HTML الصحيح على عنصر <body> واحد فقط داخل <html>.',
      },
    },
  }),
  buildTagLesson({
    id: 'html-01-04',
    chapterId: 'html-ch-01',
    order: 4,
    durationMinutes: 8,
    title: { en: 'Document Title and Metadata', ar: 'عنوان المستند والبيانات الوصفية' },
    summary: {
      en: 'Define the browser tab title with <title> and character set / page info with <meta>.',
      ar: 'تحديد عنوان تبويب المتصفح عبر <title> وترميز الأحرف ووصف الصفحة عبر <meta>.',
    },
    tags: ['<title>', '<meta>'],
    tagSpecs: [
      {
        tag: '<title>',
        syntax: '<title>Page Title</title>',
        attributes: {
          en: 'Text-only content. Displayed in browser tabs, bookmarks, and search results.',
          ar: 'يحتوي على نص فقط ويظهر في تبويب المتصفح والمفضلة ونتائج البحث.',
        },
        description: {
          en: 'Sets the human-readable title of the HTML document.',
          ar: 'يحدد العنوان النصي المقروء لمستند HTML.',
        },
      },
      {
        tag: '<meta>',
        syntax: '<meta charset="UTF-8" />\n<meta name="description" content="..." />',
        attributes: {
          en: 'charset ("UTF-8"), name ("viewport", "description"), content (metadata value).',
          ar: 'charset ("UTF-8")، و name ("viewport", "description")، و content (القيمة).',
        },
        description: {
          en: 'Void tag that provides character encoding, viewport scaling, and SEO metadata.',
          ar: 'وسم مفرد يوفّر ترميز الأحرف وإعدادات العرض والبيانات الوصفية لمحركات البحث.',
        },
      },
    ],
    exampleCode: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="HTML5 Foundation Lesson" />
    <title>CodePath — Metadata</title>
  </head>
  <body>
    <p>Check the &lt;head&gt; metadata tags in this example.</p>
  </body>
</html>`,
    challenge: {
      en: 'Build a complete HTML webpage whose browser tab title is exactly "ali" using the <title> tag inside <head>, and include a visible heading or paragraph inside <body>.',
      ar: 'أنشئ صفحة ويب HTML كاملة يكون عنوان تبويبها في المتصفح "ali" بالضبط باستخدام وسم <title> داخل <head>، مع إضافة عنوان أو فقرة مرئية داخل <body>.',
    },
    quizQuestion: {
      question: {
        en: 'Which <meta> attribute declares UTF-8 character encoding?',
        ar: 'أي سمة في وسم <meta> تحدد ترميز الأحرف UTF-8؟',
      },
      options: [
        { en: 'charset', ar: 'charset' },
        { en: 'lang', ar: 'lang' },
        { en: 'title', ar: 'title' },
      ],
      correctIndex: 0,
      explanation: {
        en: '<meta charset="UTF-8" /> ensures Arabic, English, and special symbols render properly.',
        ar: 'يضمن <meta charset="UTF-8" /> عرض الأحرف العربية والإنجليزية والرموز بشكل صحيح.',
      },
    },
  }),
  buildTagLesson({
    id: 'html-01-05',
    chapterId: 'html-ch-01',
    order: 5,
    durationMinutes: 8,
    title: { en: 'External Document Resources', ar: 'الموارد الخارجية للمستند' },
    summary: {
      en: 'Connect external stylesheets or icons with <link> and set a base URL with <base>.',
      ar: 'ربط ملفات التنسيق والأيقونات الخارجية بـ <link> وتحديد المسار الأساسي بـ <base>.',
    },
    tags: ['<link>', '<base>'],
    tagSpecs: [
      {
        tag: '<link>',
        syntax: '<link rel="stylesheet" href="styles.css" />',
        attributes: {
          en: 'rel ("stylesheet", "icon", "canonical"), href (resource URL), type.',
          ar: 'rel (نوع العلاقة مثل "stylesheet" أو "icon")، و href (رابط الملف).',
        },
        description: {
          en: 'Links external resources like stylesheets and favicons to the document.',
          ar: 'يربط المستند بموارد خارجية مثل ملفات CSS وأيقونات الموقع.',
        },
      },
      {
        tag: '<base>',
        syntax: '<base href="https://example.com/docs/" target="_blank" />',
        attributes: {
          en: 'href (base URL for relative links), target (default link target).',
          ar: 'href (الرابط الأساسي للروابط النسبية)، و target (النافذة الافتراضية لفتح الروابط).',
        },
        description: {
          en: 'Defines the base URL used to resolve all relative URLs in the document.',
          ar: 'يحدد عنوان الأساس الذي تُبنى عليه كافة الروابط النسبية داخل الصفحة.',
        },
      },
    ],
    exampleCode: `<!DOCTYPE html>
<html lang="en">
  <head>
    <base href="https://developer.mozilla.org/en-US/docs/Web/HTML/" />
    <link rel="icon" href="/favicon.ico" />
    <title>External Resources</title>
  </head>
  <body>
    <p>Relative links resolve against the &lt;base&gt; URL.</p>
    <a href="Element/link">Learn about link</a>
  </body>
</html>`,
    challenge: {
      en: 'Inside <head>, write a <link> tag to load an external stylesheet named "main.css".',
      ar: 'داخل <head>، اكتب وسم <link> لربط ملف تنسيق خارجي باسم "main.css".',
    },
    quizQuestion: {
      question: {
        en: 'Which attribute on <link> defines the relationship to the linked file?',
        ar: 'أي سمة في وسم <link> تحدد نوع العلاقة مع الملف المرتبط؟',
      },
      options: [
        { en: 'rel', ar: 'rel' },
        { en: 'src', ar: 'src' },
        { en: 'alt', ar: 'alt' },
      ],
      correctIndex: 0,
      explanation: {
        en: 'rel (relationship) specifies how the external resource relates to the document, such as "stylesheet".',
        ar: 'تحدد سمة rel نوع العلاقة مثل "stylesheet" أو "icon".',
      },
    },
  }),

  // ================= CHAPTER 02 =================
  buildTagLesson({
    id: 'html-02-01',
    chapterId: 'html-ch-02',
    order: 6,
    durationMinutes: 10,
    title: {
      en: 'Headings & Basic Text Blocks',
      ar: 'العناوين والفقرات وفواصل الأسطر',
    },
    summary: {
      en: 'Structure document hierarchy with headings <h1>–<h6>, paragraphs <p>, line breaks <br>, and thematic dividers <hr>.',
      ar: 'تنظيم تسلسل الصفحة باستخدام العناوين <h1>–<h6> والفقرات <p> وفواصل الأسطر <br> والخطوط الفاصلة <hr>.',
    },
    tags: ['<h1>–<h6>', '<p>', '<br>', '<hr>'],
    tagSpecs: [
      {
        tag: '<h1>–<h6>',
        syntax: '<h1>Main Title</h1>\n<h2>Section</h2>\n<h3>Subsection</h3>',
        attributes: {
          en: 'Global attributes. <h1> is the highest level and <h6> is the lowest.',
          ar: 'السمات العامة. يمثل <h1> أعلى مستوى عنوان و <h6> أدنى مستوى.',
        },
        description: {
          en: 'Defines six ranked heading levels to establish clear outline hierarchy.',
          ar: 'يحدد ستة مستويات متدرجة للعناوين لبناء هيكل واضح للمحتوى.',
        },
      },
      {
        tag: '<p>',
        syntax: '<p>A complete block paragraph of text.</p>',
        attributes: {
          en: 'Global attributes. Block-level container for prose.',
          ar: 'السمات العامة. حاوية نصية قياسية للفقرات.',
        },
        description: {
          en: 'Represents a standalone paragraph separated vertically from adjacent blocks.',
          ar: 'يمثل فقرة نصية مستقلة تفصلها المتصفحات بمسافة واضحة عما قبلها وبعدها.',
        },
      },
      {
        tag: '<br>, <hr>',
        syntax: '<p>Line one<br />Line two</p>\n<hr />',
        attributes: {
          en: 'Void tags with no closing tag. <br> breaks a line; <hr> creates a thematic break.',
          ar: 'وسمان مفردان بدون إغلاق. يكسر <br> السطر ويفصل <hr> بين الموضوعات.',
        },
        description: {
          en: 'Forces a single line break inside text (<br>) or marks a topic shift (<hr>).',
          ar: 'ينقل النص إلى سطر جديد داخل الفقرة (<br>) أو يفصل بين موضوعين (<hr>).',
        },
      },
    ],
    exampleCode: `<h1>Web Publishing Guide</h1>
<h2>Chapter Summary</h2>
<p>Every well-structured article begins with a clear top heading and readable paragraphs.</p>
<hr />
<h3>Mailing Address Line Break Example</h3>
<p>CodePath Studio<br />Building 12, Tech District<br />Cairo</p>`,
    challenge: {
      en: 'Create a mini article inside <body> using an <h1>, an <h2>, two <p> paragraphs separated by <hr />, and at least one <br /> inside a paragraph.',
      ar: 'أنشئ مقالاً مصغراً داخل <body> يحتوي على <h1> و <h2> وفقرتين <p> يفصل بينهما <hr /> مع استخدام <br /> لكسر السطر داخل فقرة.',
    },
    quizQuestion: {
      question: {
        en: 'Which tag creates a thematic topic break between sections of a page?',
        ar: 'أي وسم ينشئ فاصلاً موضوعياً أفقياً بين أقسام النص؟',
      },
      options: [
        { en: '<hr>', ar: '<hr>' },
        { en: '<br>', ar: '<br>' },
        { en: '<h6>', ar: '<h6>' },
      ],
      correctIndex: 0,
      explanation: {
        en: '<hr> represents a thematic break between topic sections, while <br> only inserts a line break.',
        ar: 'يمثل <hr> فاصلاً موضوعياً بين الأقسام، بينما ينقل <br> النص للسطر التالي فقط.',
      },
    },
  }),
  buildTagLesson({
    id: 'html-02-02',
    chapterId: 'html-ch-02',
    order: 7,
    durationMinutes: 10,
    title: {
      en: 'Text Emphasis, Highlights & Edits',
      ar: 'التأكيد والتظليل وتعديلات النصوص',
    },
    summary: {
      en: 'Distinguish semantic importance (<strong>, <em>) from visual formatting (<b>, <i>, <u>, <s>), highlight text (<mark>, <small>), track edits (<del>, <ins>), and format formulas (<sub>, <sup>).',
      ar: 'التمييز بين التأكيد الدلالي (<strong>، <em>) والتنسيق الشكلي (<b>، <i>، <u>، <s>)، التظليل (<mark>، <small>)، التعديلات (<del>، <ins>)، والأسس (<sub>، <sup>).',
    },
    tags: [
      '<strong>', '<b>', '<em>', '<i>', '<mark>', '<small>',
      '<u>', '<s>', '<del>', '<ins>', '<sub>', '<sup>',
    ],
    tagSpecs: [
      {
        tag: '<strong>, <b>, <em>, <i>',
        syntax: '<strong>Urgent!</strong> <b>Keyword</b> · <em>Must</em> read <i>et al.</i>',
        attributes: {
          en: 'Global attributes. <strong>/<em> carry semantic weight; <b>/<i> convey stylistic distinction.',
          ar: 'السمات العامة. يحمل <strong> و <em> أهمية ونبرة دلالية، بينما <b> و <i> لتمييز الشكل.',
        },
        description: {
          en: 'Communicates importance, stress emphasis, keywords, or technical/foreign terms.',
          ar: 'يبرز العبارات المهمة أو المشددة أو المصطلحات التقنية واللغوية.',
        },
      },
      {
        tag: '<mark>, <small>, <u>, <s>',
        syntax: '<mark>Highlighted</mark> <small>Fine print</small> <u>Spelled</u> <s>Was $40</s>',
        attributes: {
          en: 'Global attributes. <s> marks content that is no longer accurate.',
          ar: 'السمات العامة. يشير <s> إلى معلومة لم تعد صحيحة أو سارية.',
        },
        description: {
          en: 'Applies search highlights, side comments/disclaimers, unarticulated annotations, and strikethrough.',
          ar: 'يظلل النتائج المهمة، النصوص القانونية الصغيرة، التسطير، والشطب.',
        },
      },
      {
        tag: '<del>, <ins>, <sub>, <sup>',
        syntax: '<del cite="#v1" datetime="2026-11-20">$50</del> <ins>$35</ins> · H<sub>2</sub>O · 2<sup>3</sup>',
        attributes: {
          en: 'cite & datetime on <del> and <ins> record edit history.',
          ar: 'سمتا cite و datetime على <del> و <ins> لتوثيق سبب وتاريخ التعديل.',
        },
        description: {
          en: 'Tracks document deletions/insertions and renders chemical subscripts and math exponents.',
          ar: 'يوثق النصوص المحذوفة والمضافة ويعرض الصيغ الكيميائية والأسس الرياضية.',
        },
      },
    ],
    exampleCode: `<p>
  <strong>Warning:</strong> Read <em>every</em> rule before deploying.
  Highlight key syntax like <mark>UTF-8</mark>, keep disclaimers in <small>terms apply</small>,
  use <b>bold labels</b> and <i>Latin phrases</i> cleanly.
</p>
<p>
  Plan Update: <s>Old tier</s> — Price changed from <del>$50</del> to <ins>$35</ins>.
  Check spelling of <u>recieve</u>. Science formula: H<sub>2</sub>O and 10<sup>2</sup> = 100.
</p>`,
    challenge: {
      en: 'Build a product update card using <strong>, <em>, <mark>, <del>, <ins>, and a chemical or math formula with <sub> and <sup>.',
      ar: 'أنشئ بطاقة تحديث منتج تستخدم <strong> و <em> و <mark> و <del> و <ins> مع معادلة كيميائية أو رياضية باستخدام <sub> و <sup>.',
    },
    quizQuestion: {
      question: {
        en: 'Which pair semantically marks text deleted from and inserted into a document?',
        ar: 'أي زوج وسوم يوثق النص المحذوف والنص المضاف دلالياً في المستند؟',
      },
      options: [
        { en: '<del> and <ins>', ar: '<del> و <ins>' },
        { en: '<b> and <i>', ar: '<b> و <i>' },
        { en: '<sub> and <sup>', ar: '<sub> و <sup>' },
      ],
      correctIndex: 0,
      explanation: {
        en: '<del> and <ins> represent tracked edits (and support cite/datetime), unlike visual-only formatting.',
        ar: 'يوثق <del> و <ins> التعديلات المحذوفة والمضافة ويدعمان سمة cite و datetime.',
      },
    },
  }),
  buildTagLesson({
    id: 'html-02-03',
    chapterId: 'html-ch-02',
    order: 8,
    durationMinutes: 10,
    title: {
      en: 'Quotations, Citations & Definitions',
      ar: 'الاقتباسات والمصادر والاختصارات والتعريفات',
    },
    summary: {
      en: 'Markup abbreviations (<abbr>), contact addresses (<address>), block & inline quotes (<blockquote>, <q>), cited works (<cite>), and term definitions (<dfn>).',
      ar: 'تمييز الاختصارات (<abbr>) وبيانات التواصل (<address>) والاقتباسات (<blockquote>، <q>) والمصادر (<cite>) وتعريف المصطلحات (<dfn>).',
    },
    tags: ['<abbr>', '<address>', '<blockquote>', '<q>', '<cite>', '<dfn>'],
    tagSpecs: [
      {
        tag: '<abbr>, <dfn>',
        syntax: '<dfn id="dom">DOM</dfn> (<abbr title="Document Object Model">DOM</abbr>)',
        attributes: {
          en: 'title on <abbr> supplies the full expansion on hover/focus.',
          ar: 'سمة title على <abbr> تعرض الاسم الكامل للاختصار عند التمرير.',
        },
        description: {
          en: 'Marks abbreviations with tooltips and identifies the defining instance of a term.',
          ar: 'يشرح الاختصارات ويحدد الموضع الذي يُعرَّف فيه المصطلح لأول مرة.',
        },
      },
      {
        tag: '<blockquote>, <q>, <cite>',
        syntax: '<blockquote cite="https://html.spec.whatwg.org"><q>Quote</q> — <cite>HTML Spec</cite></blockquote>',
        attributes: {
          en: 'cite (source URL) on <blockquote> and <q>. <cite> holds the title of the creative work.',
          ar: 'cite (رابط المصدر) على <blockquote> و <q>، بينما يحمل <cite> اسم الكتاب أو المرجع.',
        },
        description: {
          en: 'Separates long block quotations, short inline quotes, and creative work titles.',
          ar: 'يميز الاقتباسات الطويلة والقصيرة وأسماء الكتب أو المقالات المرجعية.',
        },
      },
      {
        tag: '<address>',
        syntax: '<address>Written by Tariq · <a href="mailto:hello@codepath.dev">Email</a></address>',
        attributes: {
          en: 'Global attributes. Applies to contact details for the nearest article or document.',
          ar: 'السمات العامة. مخصص لبيانات التواصل الخاصة بالمقال أو الموقع.',
        },
        description: {
          en: 'Represents author or organization contact details (email, URL, physical address).',
          ar: 'يمثل بيانات التواصل مع المؤلف أو الجهة مثل البريد الإلكتروني أو العنوان.',
        },
      },
    ],
    exampleCode: `<p>
  <dfn>HTML</dfn> stands for <abbr title="HyperText Markup Language">HTML</abbr>.
</p>
<blockquote cite="https://html.spec.whatwg.org">
  <q>Semantics give structure clear meaning across every browser.</q>
  <footer>— <cite>HTML Living Standard</cite></footer>
</blockquote>
<address>Contact author: hello@codepath.dev</address>`,
    challenge: {
      en: 'Write an introduction paragraph with <dfn> and <abbr title="...">, a <blockquote> quoting a <cite> source, and an <address> block.',
      ar: 'اكتب فقرة تعريفية تستخدم <dfn> و <abbr title="..."> مع اقتباس <blockquote> يذكر المصدر بـ <cite> وبيانات تواصل داخل <address>.',
    },
    quizQuestion: {
      question: {
        en: 'Which attribute on <abbr> stores the full expansion of an abbreviation?',
        ar: 'أي سمة على وسم <abbr> تخزّن الشرح الكامل للاختصار؟',
      },
      options: [
        { en: 'title', ar: 'title' },
        { en: 'cite', ar: 'cite' },
        { en: 'alt', ar: 'alt' },
      ],
      correctIndex: 0,
      explanation: {
        en: 'The title attribute provides the full expanded phrase for <abbr> tooltips and screen readers.',
        ar: 'توفر سمة title الاسم الكامل للاختصار عند التمرير ولقارئات الشاشة.',
      },
    },
  }),
  buildTagLesson({
    id: 'html-02-04',
    chapterId: 'html-ch-02',
    order: 9,
    durationMinutes: 10,
    title: {
      en: 'Code, Keyboard, Direction & Ruby Text',
      ar: 'الأكواد ولوحة المفاتيح والاتجاه وحواشي النطق',
    },
    summary: {
      en: 'Format technical snippets (<code>, <pre>, <kbd>, <samp>, <var>), isolate inline spans (<span>, <bdi>, <bdo>), and add pronunciation ruby guides (<ruby>, <rt>, <rp>).',
      ar: 'تنسيق الأكواد ومفاتيح الإدخال (<code>، <pre>، <kbd>، <samp>، <var>) والتحكم بالاتجاه (<span>، <bdi>، <bdo>) وحواشي النطق (<ruby>، <rt>، <rp>).',
    },
    tags: [
      '<code>', '<pre>', '<kbd>', '<samp>', '<var>',
      '<span>', '<bdi>', '<bdo>', '<ruby>', '<rt>', '<rp>',
    ],
    tagSpecs: [
      {
        tag: '<code>, <pre>, <kbd>, <samp>, <var>',
        syntax: '<pre><code>let x = 1;</code></pre>\n<kbd>Ctrl</kbd> + <kbd>S</kbd> · <var>n</var> → <samp>OK</samp>',
        attributes: {
          en: 'Global attributes. <pre> preserves spaces and line breaks verbatim.',
          ar: 'السمات العامة. يحافظ <pre> على المسافات والأسطر كما هي.',
        },
        description: {
          en: 'Differentiates source code, preformatted blocks, user keystrokes, program output, and math/code variables.',
          ar: 'يميز بين الكود المصدري والنص المنسق ومفاتيح المستخدم ومخرجات البرنامج والمتغيرات.',
        },
      },
      {
        tag: '<span>, <bdi>, <bdo>',
        syntax: '<span>Inline hook</span> · User: <bdi>علي</bdi> · <bdo dir="rtl">HTML5</bdo>',
        attributes: {
          en: 'dir ("ltr" | "rtl") on <bdo> overrides text direction; <bdi> isolates mixed-script text.',
          ar: 'سمة dir على <bdo> تفرض اتجاه النص، بينما يعزل <bdi> النص المختلط اتجاهياً.',
        },
        description: {
          en: 'Generic inline hook plus essential controls for mixing Arabic (RTL) and English (LTR) cleanly.',
          ar: 'حاوية سطرية للتنسيق مع أدوات أساسية لضبط النصوص العربية والإنجليزية المختلطة.',
        },
      },
      {
        tag: '<ruby>, <rt>, <rp>',
        syntax: '<ruby>漢<rp>(</rp><rt>Kan</rt><rp>)</rp></ruby>',
        attributes: {
          en: '<rt> holds the annotation above characters; <rp> supplies fallback parentheses.',
          ar: 'يحمل <rt> شرح النطق فوق الحرف، ويوفّر <rp> أقواساً احتياطية للمتصفحات القديمة.',
        },
        description: {
          en: 'Displays small pronunciation annotations above East Asian or specialized characters.',
          ar: 'يعرض إرشادات نطق صغيرة فوق الكلمات أو الرموز.',
        },
      },
    ],
    exampleCode: `<p>
  Press <kbd>Ctrl</kbd> + <kbd>S</kbd> to execute <code>save(<var>doc</var>)</code>
  and inspect output <samp>Saved 200 OK</samp>.
</p>
<pre><code>const status = "ready";
console.log(status);</code></pre>
<p>
  Student <bdi>علي</bdi> earned <span class="score">100%</span> ·
  Reversed: <bdo dir="rtl">CODE</bdo> ·
  Ruby: <ruby>東京<rp>(</rp><rt>Tokyo</rt><rp>)</rp></ruby>
</p>`,
    challenge: {
      en: 'Build a CLI help snippet containing <kbd>, <code>, <pre>, <var>, <samp>, and a <bdi> bilingual username.',
      ar: 'أنشئ دليل أداة أوامر برمجية يستخدم <kbd> و <code> و <pre> و <var> و <samp> مع اسم مستخدم ثنائي اللغة داخل <bdi>.',
    },
    quizQuestion: {
      question: {
        en: 'Which tag represents keyboard input from a user (such as Ctrl + S)?',
        ar: 'أي وسم يُستخدم لتمثيل إدخال مفاتيح لوحة المفاتيح مثل Ctrl + S؟',
      },
      options: [
        { en: '<kbd>', ar: '<kbd>' },
        { en: '<samp>', ar: '<samp>' },
        { en: '<bdo>', ar: '<bdo>' },
      ],
      correctIndex: 0,
      explanation: {
        en: '<kbd> marks keyboard or voice input, whereas <samp> marks sample computer output.',
        ar: 'يرمز <kbd> إلى مفاتيح الإدخال، بينما يمثل <samp> مخرجات البرنامج.',
      },
    },
  }),
  buildTagLesson({
    id: 'html-02-05',
    chapterId: 'html-ch-02',
    order: 10,
    durationMinutes: 8,
    title: { en: 'Description Lists and Terms', ar: 'قوائم التعريف والمصطلحات' },
    summary: {
      en: 'Group term-and-description pairs with <dl> and define each term with <dt>.',
      ar: 'تجميع أزواج المصطلح والوصف باستخدام <dl> وتعريف كل مصطلح بوسم <dt>.',
    },
    tags: ['<dl>', '<dt>'],
    tagSpecs: [
      {
        tag: '<dl>',
        syntax: '<dl>\n  <dt>Term</dt>\n  <dd>Description</dd>\n</dl>',
        attributes: {
          en: 'Global attributes. Wraps groups of <dt> and <dd> elements.',
          ar: 'السمات العامة. يحيط بمجموعات <dt> و <dd>.',
        },
        description: {
          en: 'Description list container ideal for glossaries and key-value metadata.',
          ar: 'حاوية قائمة تعريف مثالية للمعاجم والبيانات المزدوجة (اسم وقيمة).',
        },
      },
      {
        tag: '<dt>',
        syntax: '<dt>HTML</dt>',
        attributes: {
          en: 'Global attributes. Must appear inside a <dl>.',
          ar: 'السمات العامة. يجب أن يوضع داخل <dl>.',
        },
        description: {
          en: 'Specifies the term or name being defined in a description list.',
          ar: 'يحدد المصطلح أو الاسم المراد تعريفه داخل قائمة الوصف.',
        },
      },
    ],
    exampleCode: `<dl>
  <dt>HTML</dt>
  <dd>HyperText Markup Language for structuring web documents.</dd>
  <dt>DOM</dt>
  <dd>Document Object Model representing the page tree.</dd>
</dl>`,
    challenge: {
      en: 'Create a 2-term web glossary inside <body> using <dl>, <dt>, and <dd>.',
      ar: 'أنشئ قاموساً من مصطلحين داخل <body> باستخدام <dl> و <dt> و <dd>.',
    },
    quizQuestion: {
      question: {
        en: 'What is the purpose of the <dt> tag inside <dl>?',
        ar: 'ما هو دور وسم <dt> داخل <dl>؟',
      },
      options: [
        { en: 'Defines the term or name', ar: 'يحدد المصطلح أو الاسم' },
        { en: 'Creates a table cell', ar: 'ينشئ خلية في جدول' },
        { en: 'Embeds a video', ar: 'يدرج فيديو' },
      ],
      correctIndex: 0,
      explanation: {
        en: '<dt> stands for Description Term and names the item described by the following <dd>.',
        ar: 'يرمز <dt> إلى Description Term لتحديد المصطلح الذي يشرحه <dd>.',
      },
    },
  }),
  buildTagLesson({
    id: 'html-02-06',
    chapterId: 'html-ch-02',
    order: 11,
    durationMinutes: 8,
    title: { en: 'Description Content & Data', ar: 'محتوى الوصف وقيم البيانات' },
    summary: {
      en: 'Provide term descriptions with <dd> and attach machine-readable values with <data>.',
      ar: 'تقديم وصف المصطلح بـ <dd> وربط القيم القابلة للقراءة آلياً بـ <data>.',
    },
    tags: ['<dd>', '<data>'],
    tagSpecs: [
      {
        tag: '<dd>',
        syntax: '<dd>Definition text</dd>',
        attributes: {
          en: 'Global attributes. Follows one or more <dt> elements inside <dl>.',
          ar: 'السمات العامة. يأتي بعد وسم <dt> داخل <dl>.',
        },
        description: {
          en: 'Provides the description, definition, or value for the preceding term.',
          ar: 'يوفّر الشرح أو التعريف أو القيمة للمصطلح السابق له.',
        },
      },
      {
        tag: '<data>',
        syntax: '<data value="404">Not Found</data>',
        attributes: {
          en: 'value (required machine-readable string or numeric identifier).',
          ar: 'value (سمة مطلوبة تحتوي على القيمة الرقمية أو البرمجية للبيانات).',
        },
        description: {
          en: 'Links human-readable content with a machine-readable translation.',
          ar: 'يربط النص المقروء للبشر بقيمة برمجية واضحة للآلة.',
        },
      },
    ],
    exampleCode: `<dl>
  <dt>HTTP Status</dt>
  <dd><data value="200">200 OK — Request succeeded</data></dd>
  <dt>Module Code</dt>
  <dd><data value="HTML-02">Chapter 02: Text &amp; Data</data></dd>
</dl>`,
    challenge: {
      en: 'Build a <dl> specification list where <dd> contains a <data value="..."> tag with a machine-readable code or price.',
      ar: 'أنشئ قائمة مواصفات <dl> تحتوي داخل <dd> على وسم <data value="..."> لقيمة برمجية أو رقم منتج.',
    },
    quizQuestion: {
      question: {
        en: 'Which attribute on <data> holds the machine-readable value?',
        ar: 'أي سمة في وسم <data> تحمل القيمة القابلة للقراءة آلياً؟',
      },
      options: [
        { en: 'value', ar: 'value' },
        { en: 'href', ar: 'href' },
        { en: 'datetime', ar: 'datetime' },
      ],
      correctIndex: 0,
      explanation: {
        en: 'The value attribute stores the exact machine-readable identifier for the element text.',
        ar: 'تخزّن سمة value المعرّف الدقيق القابل للمعالجة البرمجية.',
      },
    },
  }),
  buildTagLesson({
    id: 'html-02-07',
    chapterId: 'html-ch-02',
    order: 12,
    durationMinutes: 8,
    title: { en: 'Time and Word Break Annotations', ar: 'وسوم التوقيت وفواصل الكلمات' },
    summary: {
      en: 'Mark dates and durations with <time> and suggest safe line-wrap points with <wbr>.',
      ar: 'تمييز التواريخ والأوقات بـ <time> وتحديد نقاط كسر الكلمات الطويلة بـ <wbr>.',
    },
    tags: ['<time>', '<wbr>'],
    tagSpecs: [
      {
        tag: '<time>',
        syntax: '<time datetime="2026-11-20">November 20, 2026</time>',
        attributes: {
          en: 'datetime (ISO-8601 date, time, or duration such as "2026-11-20" or "PT15M").',
          ar: 'datetime (التاريخ أو الوقت أو المدة بصيغة ISO-8601 القياسية).',
        },
        description: {
          en: 'Represents a specific period in time or date in a machine-readable format.',
          ar: 'يمثل تاريخاً أو وقتاً أو مدة زمنية بصيغة يفهمها المتصفح ومحركات البحث.',
        },
      },
      {
        tag: '<wbr>',
        syntax: 'https://codepath.dev/<wbr>curriculum/<wbr>html5',
        attributes: {
          en: 'Global attributes. Void tag with no closing tag.',
          ar: 'السمات العامة. وسم مفرد بدون وسم إغلاق.',
        },
        description: {
          en: 'Suggests an optional line-break opportunity inside long URLs or compound words.',
          ar: 'يقترح موضعاً مناسباً لكسر السطر داخل الروابط أو الكلمات الطويلة عند الحاجة.',
        },
      },
    ],
    exampleCode: `<p>
  Published on <time datetime="2026-11-20">November 20, 2026</time> ·
  Duration: <time datetime="PT8M">8 minutes</time>.
</p>
<p>
  Path: https://codepath.dev/<wbr>tracks/<wbr>html5/<wbr>chapter-02
</p>`,
    challenge: {
      en: 'Write a paragraph displaying a date using <time datetime="..."> and a long URL using <wbr> break points.',
      ar: 'اكتب فقرة تعرض تاريخاً بوسم <time datetime="..."> ورابطاً طويلاً يستخدم <wbr> لتحديد مواضع التفاف السطر.',
    },
    quizQuestion: {
      question: {
        en: 'Which attribute on <time> provides the standard machine-readable date?',
        ar: 'ما السمة المستخدمة في <time> لكتابة التاريخ بصيغة قياسية؟',
      },
      options: [
        { en: 'datetime', ar: 'datetime' },
        { en: 'date', ar: 'date' },
        { en: 'clock', ar: 'clock' },
      ],
      correctIndex: 0,
      explanation: {
        en: 'datetime holds an ISO-8601 formatted string regardless of how the visible text is phrased.',
        ar: 'تحمل سمة datetime التنسيق القياسي للتاريخ بصرف النظر عن النص المعروض.',
      },
    },
  }),

  // ================= CHAPTER 03 =================
  buildTagLesson({
    id: 'html-03-01',
    chapterId: 'html-ch-03',
    order: 13,
    durationMinutes: 8,
    title: { en: 'Header & Navigation Landmarks', ar: 'الترويسة وقائمة التنقل' },
    summary: {
      en: 'Structure introductory banners with <header> and navigation links with <nav>.',
      ar: 'بناء ترويسة الصفحة أو القسم بـ <header> وروابط التنقل الرئيسية بـ <nav>.',
    },
    tags: ['<header>', '<nav>'],
    tagSpecs: [
      {
        tag: '<header>',
        syntax: '<header>...</header>',
        attributes: {
          en: 'Global attributes. Used for site headers or article introductory blocks.',
          ar: 'السمات العامة. يُستخدم لمقدمة الصفحة أو مقدمة المقال.',
        },
        description: {
          en: 'Groups introductory content such as brand logos, titles, and navigation.',
          ar: 'يجمع العناصر التمهيدية مثل الشعار والعنوان وقائمة التنقل.',
        },
      },
      {
        tag: '<nav>',
        syntax: '<nav aria-label="Main">...</nav>',
        attributes: {
          en: 'aria-label (distinguishes multiple navigation regions for screen readers).',
          ar: 'aria-label (لتمييز قوائم التنقل المتعددة لقارئات الشاشة).',
        },
        description: {
          en: 'Identifies major navigation link blocks across the site or document.',
          ar: 'يعرّف قوائم الروابط الأساسية للتنقل داخل الموقع أو الصفحة.',
        },
      },
    ],
    exampleCode: `<header>
  <h1>CodePath Docs</h1>
  <nav aria-label="Primary">
    <a href="#intro">Introduction</a> |
    <a href="#tags">HTML Tags</a>
  </nav>
</header>`,
    challenge: {
      en: 'Build a <header> with a site title and a <nav aria-label="Primary"> menu containing at least two <a> links.',
      ar: 'أنشئ ترويسة <header> تضم عنوان الموقع وقائمة <nav aria-label="Primary"> تحتوي على رابطي <a> على الأقل.',
    },
    quizQuestion: {
      question: {
        en: 'Which tag should wrap a page’s primary set of navigation links?',
        ar: 'أي وسم يجب أن يحيط بمجموعة روابط التنقل الرئيسية في الصفحة؟',
      },
      options: [
        { en: '<nav>', ar: '<nav>' },
        { en: '<p>', ar: '<p>' },
        { en: '<meta>', ar: '<meta>' },
      ],
      correctIndex: 0,
      explanation: {
        en: '<nav> explicitly signals a major navigation landmark to browsers and assistive tools.',
        ar: 'يعلن وسم <nav> بوضوح عن منطقة تنقل رئيسية للمتصفح والتقنيات المساعدة.',
      },
    },
  }),
  buildTagLesson({
    id: 'html-03-02',
    chapterId: 'html-ch-03',
    order: 14,
    durationMinutes: 8,
    title: { en: 'Main Content & Footer', ar: 'المحتوى الرئيسي والتذييل' },
    summary: {
      en: 'Isolate the unique page body with <main> and close documents or sections with <footer>.',
      ar: 'تمييز المحتوى الرئيسي الفريد بـ <main> وختام الصفحة أو القسم بـ <footer>.',
    },
    tags: ['<main>', '<footer>'],
    tagSpecs: [
      {
        tag: '<main>',
        syntax: '<main>...</main>',
        attributes: {
          en: 'Global attributes. Only one visible <main> element should exist per page.',
          ar: 'السمات العامة. يجب أن يوجد وسم <main> مرئي واحد فقط في الصفحة.',
        },
        description: {
          en: 'Holds the central, unique content of the document excluding repeated headers/footers.',
          ar: 'يحتوي على المحتوى المركزي الفريد للصفحة بعيداً عن الترويسة والتذييل المتكررين.',
        },
      },
      {
        tag: '<footer>',
        syntax: '<footer>...</footer>',
        attributes: {
          en: 'Global attributes. Can belong to the page or an individual <article>.',
          ar: 'السمات العامة. يمكن استخدامه لتذييل الصفحة أو لتذييل مقال محدد.',
        },
        description: {
          en: 'Contains authorship, copyright notices, and secondary closing links.',
          ar: 'يحتوي على معلومات المؤلف وحقوق النشر والروابط الختامية.',
        },
      },
    ],
    exampleCode: `<main>
  <h2>Lesson Overview</h2>
  <p>The main landmark lets keyboard users skip straight to core content.</p>
</main>
<footer>
  <p>&copy; 2026 CodePath Curriculum</p>
</footer>`,
    challenge: {
      en: 'Combine <header>, <main>, and <footer> into a complete three-part page skeleton.',
      ar: 'ادمج <header> و <main> و <footer> لبناء هيكل صفحة متكامل من ثلاثة أجزاء.',
    },
    quizQuestion: {
      question: {
        en: 'Which landmark helps screen readers jump directly to the unique primary content?',
        ar: 'أي معلم يساعد قارئات الشاشة على القفز مباشرة إلى المحتوى الأساسي؟',
      },
      options: [
        { en: '<main>', ar: '<main>' },
        { en: '<footer>', ar: '<footer>' },
        { en: '<span>', ar: '<span>' },
      ],
      correctIndex: 0,
      explanation: {
        en: 'Assistive technologies expose <main> as the direct skip-to-content landmark.',
        ar: 'تعتمد التقنيات المساعدة على <main> للوصول السريع إلى المحتوى الرئيسي.',
      },
    },
  }),
  buildTagLesson({
    id: 'html-03-03',
    chapterId: 'html-ch-03',
    order: 15,
    durationMinutes: 8,
    title: { en: 'Sections & Articles', ar: 'الأقسام والمقالات المستقلة' },
    summary: {
      en: 'Group thematic content in <section> and standalone distributable pieces in <article>.',
      ar: 'تجميع المحتوى الموضوعي في <section> والمحتوى المستقل القابل لإعادة النشر في <article>.',
    },
    tags: ['<section>', '<article>'],
    tagSpecs: [
      {
        tag: '<section>',
        syntax: '<section>\n  <h2>Topic</h2>\n  <p>...</p>\n</section>',
        attributes: {
          en: 'Global attributes. Should normally contain a heading (<h2>–<h6>).',
          ar: 'السمات العامة. يفضل أن يبدأ دائماً بعنوان يصف موضوع القسم.',
        },
        description: {
          en: 'Represents a generic standalone thematic grouping of content.',
          ar: 'يمثل قسماً موضوعياً مترابطاً داخل المستند.',
        },
      },
      {
        tag: '<article>',
        syntax: '<article>\n  <h2>Post Title</h2>\n  <p>...</p>\n</article>',
        attributes: {
          en: 'Global attributes. Intended for self-contained compositions.',
          ar: 'السمات العامة. مخصص للمحتوى المستقل بذاته.',
        },
        description: {
          en: 'Self-contained content such as a blog post, lesson card, or forum entry.',
          ar: 'محتوى متكامل ومستقل مثل مقال أو بطاقة درس أو منشور.',
        },
      },
    ],
    exampleCode: `<section>
  <h2>Latest Tutorials</h2>
  <article>
    <h3>Understanding Semantic HTML</h3>
    <p>Articles can live inside sections, or sections inside articles.</p>
  </article>
</section>`,
    challenge: {
      en: 'Create a <section> with an <h2> heading containing an independent <article> card.',
      ar: 'أنشئ قسماً <section> يحتوي على عنوان <h2> وبداخله مقال مستقل <article>.',
    },
    quizQuestion: {
      question: {
        en: 'Which tag best fits a self-contained blog post or news card?',
        ar: 'أي وسم هو الأنسب لمقال مستقل أو بطاقة خبرية؟',
      },
      options: [
        { en: '<article>', ar: '<article>' },
        { en: '<br>', ar: '<br>' },
        { en: '<head>', ar: '<head>' },
      ],
      correctIndex: 0,
      explanation: {
        en: '<article> represents independent content that still makes sense on its own.',
        ar: 'يمثل <article> محتوى مستقلاً يظل مفهوماً حتى لو عُرض بمفرده.',
      },
    },
  }),
  buildTagLesson({
    id: 'html-03-04',
    chapterId: 'html-ch-03',
    order: 16,
    durationMinutes: 8,
    title: { en: 'Aside & Generic Containers', ar: 'المحتوى الجانبي والحاوية العامة' },
    summary: {
      en: 'Mark tangential sidebars with <aside> and use <div> only when no semantic tag applies.',
      ar: 'تمييز المحتوى الجانبي المساند بـ <aside> واستخدام <div> فقط عند عدم وجود وسم دلالي مناسب.',
    },
    tags: ['<aside>', '<div>'],
    tagSpecs: [
      {
        tag: '<aside>',
        syntax: '<aside>Related note</aside>',
        attributes: {
          en: 'Global attributes. Used for sidebars, callouts, or related links.',
          ar: 'السمات العامة. يُستخدم للشريط الجانبي والملاحظات التكميلية.',
        },
        description: {
          en: 'Represents content indirectly related to the surrounding main content.',
          ar: 'يمثل محتوى ذا صلة غير مباشرة أو تكميلية للمحتوى الرئيسي.',
        },
      },
      {
        tag: '<div>',
        syntax: '<div class="wrapper">...</div>',
        attributes: {
          en: 'Global attributes (class, id). Carries no semantic meaning.',
          ar: 'السمات العامة (class, id). لا يحمل أي معنى دلالي بحد ذاته.',
        },
        description: {
          en: 'Generic block-level container used strictly for styling or layout grouping.',
          ar: 'حاوية عامة على مستوى الكتلة تُستخدم لأغراض التخطيط والتنسيق فقط.',
        },
      },
    ],
    exampleCode: `<div class="layout">
  <main>
    <h2>Primary Lesson</h2>
    <p>Main explanation of semantic layout containers.</p>
  </main>
  <aside>
    <h3>Quick Tip</h3>
    <p>Prefer semantic tags before reaching for &lt;div&gt;.</p>
  </aside>
</div>`,
    challenge: {
      en: 'Create a <main> block paired with an <aside> tip wrapped inside a layout <div>.',
      ar: 'أنشئ قسماً رئيسياً <main> مع ملاحظة جانبية <aside> داخل حاوية <div>.',
    },
    quizQuestion: {
      question: {
        en: 'When should you use <div> instead of <section> or <article>?',
        ar: 'متى يفضل استخدام <div> بدلاً من <section> أو <article>؟',
      },
      options: [
        { en: 'When grouping purely for layout or styling without semantic meaning', ar: 'عند التجميع لأغراض التخطيط والتنسيق فقط دون معنى دلالي' },
        { en: 'For every heading on the page', ar: 'لكل عنوان في الصفحة' },
        { en: 'Instead of <title>', ar: 'بدلاً من <title>' },
      ],
      correctIndex: 0,
      explanation: {
        en: '<div> is a neutral container for styling hooks; semantic landmarks should come first.',
        ar: 'يُعد <div> حاوية محايدة للتنسيق، بينما تأتي الوسوم الدلالية أولاً.',
      },
    },
  }),

  // ================= CHAPTER 04 =================
  buildTagLesson({
    id: 'html-04-01',
    chapterId: 'html-ch-04',
    order: 17,
    durationMinutes: 8,
    title: { en: 'Hyperlinks & Image Map Areas', ar: 'الروابط التشعبية ومناطق الخرائط' },
    summary: {
      en: 'Navigate across pages with <a> and define clickable regions on images with <area>.',
      ar: 'التنقل بين الصفحات عبر <a> وتحديد مناطق قابلة للنقر على الصور عبر <area>.',
    },
    tags: ['<a>', '<area>'],
    tagSpecs: [
      {
        tag: '<a>',
        syntax: '<a href="https://example.com" target="_blank" rel="noopener">Visit</a>',
        attributes: {
          en: 'href (destination URL), target ("_self", "_blank"), download, rel.',
          ar: 'href (الوجهة)، target (مكان الفتح)، download (للتنزيل)، rel (العلاقة).',
        },
        description: {
          en: 'Creates a hyperlink to web pages, files, email addresses, or page anchors.',
          ar: 'ينشئ رابطاً تشعبياً لصفحة ويب أو ملف أو بريد إلكتروني أو موضع داخل الصفحة.',
        },
      },
      {
        tag: '<area>',
        syntax: '<area shape="rect" coords="0,0,100,100" href="#top" alt="Top" />',
        attributes: {
          en: 'shape ("rect", "circle", "poly"), coords, href, alt.',
          ar: 'shape (الشكل)، coords (الإحداثيات)، href (الرابط)، alt (النص البديل).',
        },
        description: {
          en: 'Defines a clickable hotspot region inside a <map> element.',
          ar: 'يعرّف منطقة تفاعلية قابلة للنقر داخل خريطة صورة <map>.',
        },
      },
    ],
    exampleCode: `<nav>
  <a href="#section-2">Jump to Section 2</a> |
  <a href="mailto:hello@codepath.dev">Email Support</a>
</nav>
<img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='70'><rect width='120' height='70' fill='%23111'/><rect x='120' width='120' height='70' fill='%23555'/><text x='22' y='40' fill='%23fff' font-family='sans-serif' font-size='13'>Section 2</text><text x='145' y='40' fill='%23fff' font-family='sans-serif' font-size='13'>Top</text></svg>" usemap="#nav-areas" width="240" height="70" alt="Clickable navigation bar" />
<map name="nav-areas">
  <area shape="rect" coords="0,0,120,70" href="#section-2" alt="Jump to Section 2" />
  <area shape="rect" coords="120,0,240,70" href="#" alt="Back to top" />
</map>
<section id="section-2">
  <h2>Anchor Target</h2>
  <p>Clicking #section-2 or the left hotspot jumps directly here.</p>
</section>`,
    challenge: {
      en: 'Create an external <a> link with target="_blank" and rel="noopener noreferrer", plus an interactive <map> containing an <area>.',
      ar: 'أنشئ رابطاً خارجياً <a> يحمل target="_blank" و rel="noopener noreferrer"، مع خريطة صورة <map> تضم منطقة <area>.',
    },
    quizQuestion: {
      question: {
        en: 'Which attribute on <a> specifies the destination URL?',
        ar: 'أي سمة في وسم <a> تحدد عنوان الوجهة؟',
      },
      options: [
        { en: 'href', ar: 'href' },
        { en: 'src', ar: 'src' },
        { en: 'action', ar: 'action' },
      ],
      correctIndex: 0,
      explanation: {
        en: 'href (Hypertext Reference) specifies the destination of an <a> link.',
        ar: 'تحدد سمة href الوجهة التي ينتقل إليها الرابط.',
      },
    },
  }),
  buildTagLesson({
    id: 'html-04-02',
    chapterId: 'html-ch-04',
    order: 18,
    durationMinutes: 8,
    title: { en: 'Image Maps & Search Landmark', ar: 'خرائط الصور ونطاق البحث' },
    summary: {
      en: 'Pair <map> with <area> for image hotspots and mark search interfaces with <search>.',
      ar: 'ربط <map> مع الصور التفاعلية وتمييز واجهات البحث بوسم <search>.',
    },
    tags: ['<map>', '<search>'],
    tagSpecs: [
      {
        tag: '<map>',
        syntax: '<map name="diagram">...</map>',
        attributes: {
          en: 'name (must match the usemap="#name" attribute on the target <img>).',
          ar: 'name (يجب أن يطابق قيمة usemap في وسم الصورة المرتبطة).',
        },
        description: {
          en: 'Container for <area> hotspots attached to an image.',
          ar: 'حاوية لمناطق النقر <area> المرتبطة بصورة معينة.',
        },
      },
      {
        tag: '<search>',
        syntax: '<search>\n  <form>...</form>\n</search>',
        attributes: {
          en: 'Global attributes. Modern HTML5 landmark for search/filter controls.',
          ar: 'السمات العامة. معلم HTML5 حديث مخصص لأدوات البحث والتصفية.',
        },
        description: {
          en: 'Identifies the portion of a page dedicated to searching or filtering.',
          ar: 'يعرّف الجزء المخصص للبحث أو التصفية داخل الصفحة.',
        },
      },
    ],
    exampleCode: `<search>
  <form>
    <label for="q">Search HTML tags:</label>
    <input id="q" type="search" placeholder="e.g. table" />
    <button type="submit">Find</button>
  </form>
</search>
<figure>
  <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='80'><rect width='220' height='80' fill='%23f5f5f5' stroke='%23111'/><circle cx='60' cy='40' r='22' fill='%23111'/><text x='98' y='45' font-family='sans-serif' font-size='13' fill='%23111'>Clickable Map</text></svg>" usemap="#quickmap" width="220" height="80" alt="Interactive diagram map" />
  <map name="quickmap">
    <area shape="circle" coords="60,40,22" href="#q" alt="Focus search" />
  </map>
</figure>`,
    challenge: {
      en: 'Wrap a search input and button inside a semantic <search> landmark.',
      ar: 'ضع حقل بحث وزر إرسال داخل وسم <search> الدلالي.',
    },
    quizQuestion: {
      question: {
        en: 'What does the <search> element represent in HTML5?',
        ar: 'ماذا يمثل عنصر <search> في HTML5؟',
      },
      options: [
        { en: 'A landmark region containing search or filtering controls', ar: 'منطقة دلالية تحتوي على عناصر البحث أو التصفية' },
        { en: 'A database query runner', ar: 'محرك استعلام قاعدة بيانات' },
        { en: 'A hidden comment tag', ar: 'وسم تعليق مخفي' },
      ],
      correctIndex: 0,
      explanation: {
        en: '<search> provides a built-in accessibility landmark for search forms.',
        ar: 'يوفر <search> معلماً قياسياً لإتاحة الوصول لـ نماذج البحث.',
      },
    },
  }),

  // ================= CHAPTER 05 =================
  buildTagLesson({
    id: 'html-05-01',
    chapterId: 'html-ch-05',
    order: 19,
    durationMinutes: 8,
    title: { en: 'Unordered & Ordered Lists', ar: 'القوائم غير المرتبة والمرتبة' },
    summary: {
      en: 'Display bulleted groups with <ul> and numbered sequences with <ol>.',
      ar: 'عرض العناصر النقطية بـ <ul> والتسلسلات المرقّمة بـ <ol>.',
    },
    tags: ['<ul>', '<ol>'],
    tagSpecs: [
      {
        tag: '<ul>',
        syntax: '<ul>\n  <li>Item</li>\n</ul>',
        attributes: {
          en: 'Global attributes. Used when item order does not change meaning.',
          ar: 'السمات العامة. تُستخدم عندما لا يؤثر الترتيب على المعنى.',
        },
        description: {
          en: 'Unordered (bulleted) list container.',
          ar: 'حاوية قائمة غير مرتبة (نقطية).',
        },
      },
      {
        tag: '<ol>',
        syntax: '<ol type="1" start="1">\n  <li>Step</li>\n</ol>',
        attributes: {
          en: 'start (starting number), reversed (countdown), type ("1", "a", "A", "i", "I").',
          ar: 'start (رقم البداية)، reversed (ترتيب عكسي)، type (نمط الترقيم).',
        },
        description: {
          en: 'Ordered (numbered) list for step-by-step instructions or rankings.',
          ar: 'قائمة مرتبة ومرقّمة للخطوات التسلسلية أو التصنيفات.',
        },
      },
    ],
    exampleCode: `<h3>Prerequisites</h3>
<ul>
  <li>Code editor</li>
  <li>Modern browser</li>
</ul>
<h3>Build Steps</h3>
<ol start="1">
  <li>Write semantic HTML</li>
  <li>Test in browser</li>
</ol>`,
    challenge: {
      en: 'Build both a bulleted <ul> list and a numbered <ol reversed> countdown list inside <body>.',
      ar: 'أنشئ قائمة نقطية <ul> وقائمة مرتبة تنازلياً <ol reversed> داخل <body>.',
    },
    quizQuestion: {
      question: {
        en: 'Which attribute sets the starting number of an ordered list <ol>?',
        ar: 'أي سمة تحدد رقم البداية في القائمة المرتبة <ol>؟',
      },
      options: [
        { en: 'start', ar: 'start' },
        { en: 'begin', ar: 'begin' },
        { en: 'index', ar: 'index' },
      ],
      correctIndex: 0,
      explanation: {
        en: 'The start attribute accepts an integer specifying where numbering begins.',
        ar: 'تستقبل سمة start رقماً صحيحاً يحدد نقطة بداية الترقيم.',
      },
    },
  }),
  buildTagLesson({
    id: 'html-05-02',
    chapterId: 'html-ch-05',
    order: 20,
    durationMinutes: 8,
    title: { en: 'List Items & Toolbar Menus', ar: 'عناصر القوائم وقوائم الأوامر' },
    summary: {
      en: 'Represent individual list entries with <li> and interactive command lists with <menu>.',
      ar: 'تمثيل كل عنصر داخل القائمة بـ <li> وقوائم الأوامر التفاعلية بـ <menu>.',
    },
    tags: ['<li>', '<menu>'],
    tagSpecs: [
      {
        tag: '<li>',
        syntax: '<li value="5">Item</li>',
        attributes: {
          en: 'value (sets explicit ordinal number when inside an <ol>).',
          ar: 'value (يحدد رقماً مخصصاً للعنصر عند وجوده داخل <ol>).',
        },
        description: {
          en: 'Must be a direct child of <ul>, <ol>, or <menu>.',
          ar: 'يمثل عنصراً واحداً ويجب وضعه مباشرة داخل <ul> أو <ol> أو <menu>.',
        },
      },
      {
        tag: '<menu>',
        syntax: '<menu>\n  <li><button>Save</button></li>\n</menu>',
        attributes: {
          en: 'Global attributes. Semantic alternative to <ul> for toolbars of actions.',
          ar: 'السمات العامة. بديل دلالي لـ <ul> مخصص لقوائم الأزرار والأوامر.',
        },
        description: {
          en: 'Unordered list specifically meant for interactive action buttons.',
          ar: 'قائمة مخصصة لتجميع أزرار الأوامر والإجراءات التفاعلية.',
        },
      },
    ],
    exampleCode: `<menu>
  <li><button type="button">New File</button></li>
  <li><button type="button">Save</button></li>
  <li><button type="button">Export</button></li>
</menu>`,
    challenge: {
      en: 'Build an interactive <menu> toolbar with <li> items (or a nested <ul> inside an <li>).',
      ar: 'أنشئ شريط أوامر <menu> يحتوي على عناصر <li> (أو قائمة <ul> متداخلة داخل <li>).',
    },
    quizQuestion: {
      question: {
        en: 'Which elements are valid direct parents for <li>?',
        ar: 'ما العناصر التي يصح أن تكون أباً مباشراً لوسم <li>؟',
      },
      options: [
        { en: '<ul>, <ol>, or <menu>', ar: '<ul> أو <ol> أو <menu>' },
        { en: '<p> or <span>', ar: '<p> أو <span>' },
        { en: '<head> or <meta>', ar: '<head> أو <meta>' },
      ],
      correctIndex: 0,
      explanation: {
        en: 'HTML allows <li> only inside list containers: <ul>, <ol>, and <menu>.',
        ar: 'تسمح لغة HTML بوضع <li> داخل حاويات القوائم فقط: <ul> و <ol> و <menu>.',
      },
    },
  }),

  // ================= CHAPTER 06 =================
  buildTagLesson({
    id: 'html-06-01',
    chapterId: 'html-ch-06',
    order: 21,
    durationMinutes: 10,
    title: { en: 'Images & Responsive Pictures', ar: 'الصور والصور المتجاوبة' },
    summary: {
      en: 'Embed images with <img> and provide art-directed responsive variants with <picture>.',
      ar: 'إدراج الصور بـ <img> وتقديم نسخ متجاوبة حسب حجم الشاشة بـ <picture>.',
    },
    tags: ['<img>', '<picture>'],
    tagSpecs: [
      {
        tag: '<img>',
        syntax: '<img src="photo.jpg" alt="Description" width="320" height="200" loading="lazy" />',
        attributes: {
          en: 'src (image URL), alt (required accessible text), width, height, loading ("lazy" | "eager").',
          ar: 'src (مسار الصورة)، alt (النص البديل الإلزامي)، width، height، loading.',
        },
        description: {
          en: 'Void element that embeds a raster or SVG image into the page.',
          ar: 'وسم مفرد يدرج صورة داخل المستند.',
        },
      },
      {
        tag: '<picture>',
        syntax: '<picture>\n  <source media="(min-width: 800px)" srcset="wide.jpg" />\n  <img src="small.jpg" alt="View" />\n</picture>',
        attributes: {
          en: 'Global attributes. Contains zero or more <source> tags and one fallback <img>.',
          ar: 'السمات العامة. يحتوي على وسوم <source> ووسم <img> احتياطي إلزامي.',
        },
        description: {
          en: 'Lets the browser pick the optimal image format or crop for the viewport.',
          ar: 'يتيح للمتصفح اختيار أنسب صيغة أو مقاس للصورة حسب الشاشة.',
        },
      },
    ],
    exampleCode: `<picture>
  <source media="(min-width: 640px)" srcset="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='120'><rect width='320' height='120' fill='%23111'/><text x='20' y='65' fill='%23fff' font-family='sans-serif' font-size='16'>Desktop Banner</text></svg>" />
  <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='120'><rect width='220' height='120' fill='%23333'/><text x='20' y='65' fill='%23fff' font-family='sans-serif' font-size='14'>Mobile Image</text></svg>" alt="Responsive banner example" />
</picture>`,
    challenge: {
      en: 'Write a <picture> container with a <source> and a fallback <img> that includes descriptive alt text and loading="lazy".',
      ar: 'اكتب حاوية <picture> تضم <source> ووسم <img> احتياطياً يحمل نص alt واضحاً وسمة loading="lazy".',
    },
    quizQuestion: {
      question: {
        en: 'Which attribute on <img> is essential for accessibility when images cannot be seen?',
        ar: 'أي سمة في وسم <img> ضرورية لإتاحة الوصول عند تعذر رؤية الصورة؟',
      },
      options: [
        { en: 'alt', ar: 'alt' },
        { en: 'rel', ar: 'rel' },
        { en: 'lang', ar: 'lang' },
      ],
      correctIndex: 0,
      explanation: {
        en: 'alt provides text read by screen readers and shown if the image fails to load.',
        ar: 'توفّر سمة alt وصفاً تقرؤه قارئات الشاشة ويظهر عند تعذر تحميل الصورة.',
      },
    },
  }),
  buildTagLesson({
    id: 'html-06-02',
    chapterId: 'html-ch-06',
    order: 22,
    durationMinutes: 8,
    title: { en: 'Media Sources & Figures', ar: 'مصادر الوسائط والأشكال التوضيحية' },
    summary: {
      en: 'List multiple media files with <source> and group illustrations with <figure>.',
      ar: 'تحديد عدة مصادر للوسائط بـ <source> وتجميع الأشكال والصور التوضيحية بـ <figure>.',
    },
    tags: ['<source>', '<figure>'],
    tagSpecs: [
      {
        tag: '<source>',
        syntax: '<source srcset="img.webp" type="image/webp" />',
        attributes: {
          en: 'src (for audio/video), srcset & media (for picture), type (MIME type).',
          ar: 'src (للصوت والفيديو)، srcset و media (لـ picture)، type (نوع الملف).',
        },
        description: {
          en: 'Void tag offering alternative media resources inside <picture>, <audio>, or <video>.',
          ar: 'وسم مفرد يوفّر ملفات بديلة داخل <picture> أو <audio> أو <video>.',
        },
      },
      {
        tag: '<figure>',
        syntax: '<figure>\n  <img src="..." alt="..." />\n  <figcaption>Caption</figcaption>\n</figure>',
        attributes: {
          en: 'Global attributes. Groups self-contained diagrams, photos, or code listings.',
          ar: 'السمات العامة. يجمع الرسوم أو الصور أو الأكواد المستقلة.',
        },
        description: {
          en: 'Self-contained figure referenced from the main flow of text.',
          ar: 'عنصر توضيحي مستقل يمكن ربطه بتعليق <figcaption>.',
        },
      },
    ],
    exampleCode: `<figure>
  <svg width="240" height="80" role="img" aria-label="Architecture box">
    <rect x="2" y="2" width="236" height="76" fill="#f5f5f5" stroke="#111111" />
    <text x="24" y="45" font-family="monospace" font-size="14">Figure 1.1: HTML Tree</text>
  </svg>
  <figcaption>Self-contained diagram wrapped in &lt;figure&gt;.</figcaption>
</figure>`,
    challenge: {
      en: 'Wrap an <img> or <svg> inside <figure> and pair it with a descriptive caption.',
      ar: 'ضع صورة أو رسم <svg> داخل <figure> مع وصف توضيحي.',
    },
    quizQuestion: {
      question: {
        en: 'Which elements can contain a <source> tag?',
        ar: 'ما العناصر التي يمكن أن تحتوي على وسم <source>؟',
      },
      options: [
        { en: '<picture>, <audio>, and <video>', ar: '<picture> و <audio> و <video>' },
        { en: '<p> and <h1>', ar: '<p> و <h1>' },
        { en: '<table> and <tr>', ar: '<table> و <tr>' },
      ],
      correctIndex: 0,
      explanation: {
        en: '<source> supplies format or resolution choices to <picture>, <audio>, and <video>.',
        ar: 'يزوّد <source> هذه العناصر الثلاثة بخيارات صيغ أو دقات متعددة.',
      },
    },
  }),
  buildTagLesson({
    id: 'html-06-03',
    chapterId: 'html-ch-06',
    order: 23,
    durationMinutes: 8,
    title: { en: 'Figure Captions & Vector Graphics', ar: 'تعليقات الأشكال ورسوم SVG' },
    summary: {
      en: 'Caption diagrams with <figcaption> and draw crisp resolution-independent vectors with <svg>.',
      ar: 'إضافة تعليق توضيحي للأشكال بـ <figcaption> ورسم متجهات دقيقة بـ <svg>.',
    },
    tags: ['<figcaption>', '<svg>'],
    tagSpecs: [
      {
        tag: '<figcaption>',
        syntax: '<figcaption>Figure 1: Layout Grid</figcaption>',
        attributes: {
          en: 'Global attributes. Placed as first or last child inside <figure>.',
          ar: 'السمات العامة. يوضع كأول أو آخر ابن داخل <figure>.',
        },
        description: {
          en: 'Provides an accessible caption or legend for its parent <figure>.',
          ar: 'يوفّر شرحاً أو تسمية توضيحية للشكل داخل <figure>.',
        },
      },
      {
        tag: '<svg>',
        syntax: '<svg width="100" height="100" viewBox="0 0 100 100">...</svg>',
        attributes: {
          en: 'width, height, viewBox, role="img", aria-label.',
          ar: 'width، height، viewBox (إحداثيات الرسم)، aria-label.',
        },
        description: {
          en: 'Scalable Vector Graphics container rendered directly in the HTML DOM.',
          ar: 'حاوية رسوم متجهة قابلة للتكبير دون فقدان الجودة وتُكتب مباشرة داخل HTML.',
        },
      },
    ],
    exampleCode: `<figure>
  <svg width="160" height="90" viewBox="0 0 160 90" aria-label="Monochrome geometric shapes">
    <rect x="10" y="15" width="60" height="60" fill="#111111" />
    <circle cx="115" cy="45" r="30" fill="none" stroke="#111111" stroke-width="3" />
  </svg>
  <figcaption>Crisp inline SVG square and circle.</figcaption>
</figure>`,
    challenge: {
      en: 'Create a <figure> holding an inline <svg> graphic (with shapes inside) and describe it using <figcaption>.',
      ar: 'أنشئ حاوية <figure> تضم رسماً متجهاً <svg> بداخله أشكال هندسية مع وصفه بوسم <figcaption>.',
    },
    quizQuestion: {
      question: {
        en: 'What does the viewBox attribute on <svg> define?',
        ar: 'ماذا تحدد سمة viewBox في وسم <svg>؟',
      },
      options: [
        { en: 'The internal coordinate system and aspect ratio', ar: 'نظام الإحداثيات الداخلي ونسبة العرض إلى الارتفاع' },
        { en: 'The font size of the page', ar: 'حجم خط الصفحة' },
        { en: 'The audio volume', ar: 'مستوى الصوت' },
      ],
      correctIndex: 0,
      explanation: {
        en: 'viewBox maps the internal drawing coordinates cleanly to any rendered width and height.',
        ar: 'تربط viewBox إحداثيات الرسم الداخلية بأي أبعاد عرض خارجية.',
      },
    },
  }),

  // ================= CHAPTER 07 =================
  buildTagLesson({
    id: 'html-07-01',
    chapterId: 'html-ch-07',
    order: 24,
    durationMinutes: 8,
    title: { en: 'Video & Audio Playback', ar: 'تشغيل الفيديو والصوت' },
    summary: {
      en: 'Embed native media players directly in HTML using <video> and <audio>.',
      ar: 'تضمين مشغلات فيديو وصوت أصلية في HTML باستخدام <video> و <audio>.',
    },
    tags: ['<video>', '<audio>'],
    tagSpecs: [
      {
        tag: '<video>',
        syntax: '<video controls width="320" poster="cover.jpg">\n  <source src="clip.mp4" type="video/mp4" />\n</video>',
        attributes: {
          en: 'controls, src, poster, autoplay, muted, loop, playsinline, preload.',
          ar: 'controls (أزرار التحكم)، src، poster (صورة الغلاف)، muted، loop.',
        },
        description: {
          en: 'Embeds a video player with built-in playback controls.',
          ar: 'يدرج مشغل فيديو بأزرار تحكم مدمجة في المتصفح.',
        },
      },
      {
        tag: '<audio>',
        syntax: '<audio controls src="sound.mp3"></audio>',
        attributes: {
          en: 'controls, src, loop, muted, preload ("none" | "metadata" | "auto").',
          ar: 'controls، src، loop، muted، preload.',
        },
        description: {
          en: 'Embeds an audio player for podcasts, music, or voice notes.',
          ar: 'يدرج مشغل صوتيات مدمجاً للملفات الصوتية.',
        },
      },
    ],
    exampleCode: `<section>
  <h3>Video &amp; Audio Markup</h3>
  <video controls width="320" preload="metadata">
    <source src="intro.mp4" type="video/mp4" />
    Your browser does not support HTML5 video.
  </video>
  <br /><br />
  <audio controls preload="none">
    <source src="lesson-audio.mp3" type="audio/mpeg" />
    Your browser does not support HTML5 audio.
  </audio>
</section>`,
    challenge: {
      en: 'Build a <video controls muted loop> player and an <audio controls> player inside <body>.',
      ar: 'أنشئ مشغل <video controls muted loop> ومشغل <audio controls> داخل <body>.',
    },
    quizQuestion: {
      question: {
        en: 'Which attribute displays play, pause, and volume buttons on <video> and <audio>?',
        ar: 'أي سمة تُظهر أزرار التشغيل والإيقاف ومستوى الصوت على <video> و <audio>؟',
      },
      options: [
        { en: 'controls', ar: 'controls' },
        { en: 'buttons', ar: 'buttons' },
        { en: 'player', ar: 'player' },
      ],
      correctIndex: 0,
      explanation: {
        en: 'Without the boolean controls attribute, browsers hide the native playback UI.',
        ar: 'بدون سمة controls يخفي المتصفح أزرار التحكم الافتراضية.',
      },
    },
  }),
  buildTagLesson({
    id: 'html-07-02',
    chapterId: 'html-ch-07',
    order: 25,
    durationMinutes: 8,
    title: { en: 'Media Tracks & Canvas', ar: 'مسارات الترجمة ولوحة الرسم' },
    summary: {
      en: 'Attach timed captions with <track> and declare a drawable bitmap surface with <canvas>.',
      ar: 'إرفاق ترجمة أو شروح زمنية بـ <track> وإنشاء مساحة رسم نقطية بـ <canvas>.',
    },
    tags: ['<track>', '<canvas>'],
    tagSpecs: [
      {
        tag: '<track>',
        syntax: '<track kind="subtitles" src="ar.vtt" srclang="ar" label="Arabic" default />',
        attributes: {
          en: 'kind ("subtitles", "captions", "chapters"), src (.vtt file), srclang, label, default.',
          ar: 'kind (النوع)، src (ملف الترجمة)، srclang (رمز اللغة)، label، default.',
        },
        description: {
          en: 'Specifies timed text tracks (WebVTT) inside <video> or <audio>.',
          ar: 'يضيف مسارات نصية متزامنة (مثل الترجمة) داخل <video> أو <audio>.',
        },
      },
      {
        tag: '<canvas>',
        syntax: '<canvas id="board" width="300" height="150">Fallback text</canvas>',
        attributes: {
          en: 'width (pixel width), height (pixel height). Inner content serves as fallback.',
          ar: 'width (العرض بالبكسل)، height (الارتفاع بالبكسل). النص الداخلي يظهر كبديل.',
        },
        description: {
          en: 'Provides a 2D/WebGL drawable bitmap area for charts, graphics, and animations.',
          ar: 'يوفر مساحة رسم ثنائية أو ثلاثية الأبعاد للرسوم والمخططات.',
        },
      },
    ],
    exampleCode: `<video controls width="300">
  <source src="lecture.mp4" type="video/mp4" />
  <track kind="captions" src="captions-en.vtt" srclang="en" label="English" default />
  <track kind="subtitles" src="captions-ar.vtt" srclang="ar" label="Arabic" />
</video>
<p>Canvas surface:</p>
<canvas width="280" height="80" style="border:1px solid #111111;">
  Canvas fallback description for assistive tools.
</canvas>`,
    challenge: {
      en: 'Create a <video> with a <track> subtitle file and a <canvas width="280" height="80"> drawing element.',
      ar: 'أنشئ عنصر <video> يضم مسار ترجمة <track> بالإضافة إلى لوحة رسم <canvas>.',
    },
    quizQuestion: {
      question: {
        en: 'What file format is typically linked by <track> for video captions?',
        ar: 'ما صيغة الملف التي يُربط بها وسم <track> عادةً لعرض الترجمة؟',
      },
      options: [
        { en: 'WebVTT (.vtt)', ar: 'WebVTT (.vtt)' },
        { en: 'CSS (.css)', ar: 'CSS (.css)' },
        { en: 'PNG (.png)', ar: 'PNG (.png)' },
      ],
      correctIndex: 0,
      explanation: {
        en: '<track> loads WebVTT (.vtt) timed text cue files.',
        ar: 'يحمل <track> ملفات الترجمة الزمنية بصيغة WebVTT (.vtt).',
      },
    },
  }),

  // ================= CHAPTER 08 =================
  buildTagLesson({
    id: 'html-08-01',
    chapterId: 'html-ch-08',
    order: 26,
    durationMinutes: 8,
    title: { en: 'Table Container & Caption', ar: 'الجدول وعنوان الجدول' },
    summary: {
      en: 'Create structured data tables with <table> and title them clearly with <caption>.',
      ar: 'إنشاء جداول البيانات المنظمة بوسم <table> وإضافة عنوان وصفي لها بـ <caption>.',
    },
    tags: ['<table>', '<caption>'],
    tagSpecs: [
      {
        tag: '<table>',
        syntax: '<table>\n  <caption>Schedule</caption>\n  ...\n</table>',
        attributes: {
          en: 'Global attributes. Use only for tabular data, never for page layout.',
          ar: 'السمات العامة. يُستخدم للبيانات الجدولية فقط وليس لتخطيط الصفحة.',
        },
        description: {
          en: 'Root container for rows and columns of structured data.',
          ar: 'الحاوية الرئيسية للصفوف والأعمدة في الجداول.',
        },
      },
      {
        tag: '<caption>',
        syntax: '<caption>2026 Curriculum Schedule</caption>',
        attributes: {
          en: 'Global attributes. Must be the very first child inside <table>.',
          ar: 'السمات العامة. يجب أن يكون أول عنصر مباشرة داخل <table>.',
        },
        description: {
          en: 'Provides an accessible title explaining what the table displays.',
          ar: 'يوفّر عنواناً واضحاً يصف محتوى الجدول لقارئات الشاشة والمستخدمين.',
        },
      },
    ],
    exampleCode: `<table>
  <caption>HTML5 Core Tags</caption>
  <tr>
    <th>Tag</th>
    <th>Role</th>
  </tr>
  <tr>
    <td>&lt;table&gt;</td>
    <td>Tabular container</td>
  </tr>
</table>`,
    challenge: {
      en: 'Write a <table> starting with <caption> as its first child element.',
      ar: 'اكتب جدولاً يبدأ بوسم <caption> كأول عنصر داخله.',
    },
    quizQuestion: {
      question: {
        en: 'Where must <caption> appear inside a <table>?',
        ar: 'أين يجب وضع وسم <caption> داخل <table>؟',
      },
      options: [
        { en: 'As the first child inside <table>', ar: 'كأول عنصر مباشرة داخل <table>' },
        { en: 'Outside <table>', ar: 'خارج <table>' },
        { en: 'Inside <td>', ar: 'داخل <td>' },
      ],
      correctIndex: 0,
      explanation: {
        en: 'HTML requires <caption> to be the first child of <table>.',
        ar: 'تشترط مواصفات HTML أن يكون <caption> أول عنصر داخل <table>.',
      },
    },
  }),
  buildTagLesson({
    id: 'html-08-02',
    chapterId: 'html-ch-08',
    order: 27,
    durationMinutes: 8,
    title: { en: 'Table Rows & Header Cells', ar: 'صفوف الجدول وخلايا العناوين' },
    summary: {
      en: 'Define horizontal rows with <tr> and column/row headings with <th>.',
      ar: 'تعريف الصفوف الأفقية بـ <tr> وخلايا العناوين للأعمدة أو الصفوف بـ <th>.',
    },
    tags: ['<tr>', '<th>'],
    tagSpecs: [
      {
        tag: '<tr>',
        syntax: '<tr>\n  <th>Name</th>\n  <td>Value</td>\n</tr>',
        attributes: {
          en: 'Global attributes. Contains <th> and <td> cells.',
          ar: 'السمات العامة. يحتوي على خلايا <th> أو <td>.',
        },
        description: {
          en: 'Defines a single horizontal row inside a table.',
          ar: 'يعرّف صفاً أفقياً واحداً داخل الجدول.',
        },
      },
      {
        tag: '<th>',
        syntax: '<th scope="col">Lesson</th>',
        attributes: {
          en: 'scope ("col", "row", "colgroup", "rowgroup"), colspan, rowspan.',
          ar: 'scope (نطاق العنوان: عمود أو صف)، colspan (دمج أعمدة)، rowspan (دمج صفوف).',
        },
        description: {
          en: 'Marks a header cell so screen readers associate columns with their data cells.',
          ar: 'يميز خلية العنوان لربطها بالبيانات في العمود أو الصف.',
        },
      },
    ],
    exampleCode: `<table>
  <tr>
    <th scope="col">Chapter</th>
    <th scope="col">Lessons</th>
  </tr>
  <tr>
    <th scope="row">01 Foundation</th>
    <td>5</td>
  </tr>
</table>`,
    challenge: {
      en: 'Build a <table> with two <tr> rows using <th scope="col"> column headers and at least one <th scope="row"> row label.',
      ar: 'أنشئ جدولاً يحتوي على صفّين <tr> باستخدام عناوين أعمدة <th scope="col"> وعنوان صف <th scope="row">.',
    },
    quizQuestion: {
      question: {
        en: 'Which attribute on <th> specifies whether it heads a column or a row?',
        ar: 'أي سمة على <th> تحدد ما إذا كان العنوان لعمود أم لصف؟',
      },
      options: [
        { en: 'scope', ar: 'scope' },
        { en: 'dir', ar: 'dir' },
        { en: 'target', ar: 'target' },
      ],
      correctIndex: 0,
      explanation: {
        en: 'scope="col" or scope="row" tells assistive tools which cells the header labels.',
        ar: 'توضح سمة scope="col" أو "row" الخلايا التي يتبعها هذا العنوان.',
      },
    },
  }),
  buildTagLesson({
    id: 'html-08-03',
    chapterId: 'html-ch-08',
    order: 28,
    durationMinutes: 8,
    title: { en: 'Data Cells & Table Header Group', ar: 'خلايا البيانات ومجموعة رأس الجدول' },
    summary: {
      en: 'Store cell values in <td> and group header rows cleanly inside <thead>.',
      ar: 'حفظ القيم داخل <td> وتجميع صفوف العناوين داخل <thead>.',
    },
    tags: ['<td>', '<thead>'],
    tagSpecs: [
      {
        tag: '<td>',
        syntax: '<td colspan="2">Merged Data</td>',
        attributes: {
          en: 'colspan (span multiple columns), rowspan (span multiple rows), headers.',
          ar: 'colspan (دمج أعمدة)، rowspan (دمج صفوف)، headers.',
        },
        description: {
          en: 'Standard table data cell containing a single data point.',
          ar: 'خلية البيانات القياسية داخل صف الجدول.',
        },
      },
      {
        tag: '<thead>',
        syntax: '<thead>\n  <tr><th>Col</th></tr>\n</thead>',
        attributes: {
          en: 'Global attributes. Groups the header row(s) of a table.',
          ar: 'السمات العامة. يجمع صفوف الترويسة في أعلى الجدول.',
        },
        description: {
          en: 'Separates table column headers from body rows for printing and scrolling.',
          ar: 'يفصل ترويسة الجدول عن جسم البيانات لتسهيل الطباعة والتمرير.',
        },
      },
    ],
    exampleCode: `<table>
  <thead>
    <tr>
      <th>Tag</th>
      <th>Category</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>&lt;td&gt;</td>
      <td>Table Data Cell</td>
    </tr>
  </tbody>
</table>`,
    challenge: {
      en: 'Create a <table> with column headers wrapped in <thead> and a row using <td colspan="2">.',
      ar: 'أنشئ جدولاً يضم رأس الجدول داخل <thead> مع خلية بيانات مدمجة <td colspan="2">.',
    },
    quizQuestion: {
      question: {
        en: 'Which attribute allows a <td> cell to stretch across multiple columns?',
        ar: 'أي سمة تسمح لخلية <td> بالامتداد عبر عدة أعمدة؟',
      },
      options: [
        { en: 'colspan', ar: 'colspan' },
        { en: 'rowspan', ar: 'rowspan' },
        { en: 'width', ar: 'width' },
      ],
      correctIndex: 0,
      explanation: {
        en: 'colspan merges horizontal columns, whereas rowspan merges vertical rows.',
        ar: 'تدمج colspan الأعمدة أفقياً، بينما تدمج rowspan الصفوف عمودياً.',
      },
    },
  }),
  buildTagLesson({
    id: 'html-08-04',
    chapterId: 'html-ch-08',
    order: 29,
    durationMinutes: 8,
    title: { en: 'Table Body & Table Footer', ar: 'جسم الجدول وتذييل الجدول' },
    summary: {
      en: 'Encapsulate primary data rows in <tbody> and summary totals in <tfoot>.',
      ar: 'احتواء صفوف البيانات الرئيسية في <tbody> وصفوف المجاميع والملخص في <tfoot>.',
    },
    tags: ['<tbody>', '<tfoot>'],
    tagSpecs: [
      {
        tag: '<tbody>',
        syntax: '<tbody>\n  <tr><td>Data</td></tr>\n</tbody>',
        attributes: {
          en: 'Global attributes. Wraps the main body rows of the table.',
          ar: 'السمات العامة. يحيط بصفوف البيانات الأساسية للجدول.',
        },
        description: {
          en: 'Groups primary tabular records separately from <thead> and <tfoot>.',
          ar: 'يفصل صفوف البيانات الأساسية عن الرأس والتذييل.',
        },
      },
      {
        tag: '<tfoot>',
        syntax: '<tfoot>\n  <tr><td>Total</td><td>12</td></tr>\n</tfoot>',
        attributes: {
          en: 'Global attributes. Summarizes table columns.',
          ar: 'السمات العامة. يجمع صفوف الخلاصة والمجاميع أسفل الجدول.',
        },
        description: {
          en: 'Defines summary rows such as totals or averages at the bottom of a table.',
          ar: 'يعرّف صفوف الخلاصة مثل المجموع أو المتوسط في نهاية الجدول.',
        },
      },
    ],
    exampleCode: `<table>
  <thead>
    <tr><th>Track</th><th>Chapters</th></tr>
  </thead>
  <tbody>
    <tr><td>HTML5</td><td>12</td></tr>
  </tbody>
  <tfoot>
    <tr><td>Total</td><td>12</td></tr>
  </tfoot>
</table>`,
    challenge: {
      en: 'Build a complete <table> using <thead>, <tbody> for data rows, and <tfoot> for the summary row.',
      ar: 'أنشئ جدولاً متكاملاً يضم <thead> و <tbody> لصفوف البيانات و <tfoot> لصف المجموع.',
    },
    quizQuestion: {
      question: {
        en: 'Which tag is specifically meant for summary or total rows in a table?',
        ar: 'أي وسم مخصص لصفوف المجاميع والملخص في الجدول؟',
      },
      options: [
        { en: '<tfoot>', ar: '<tfoot>' },
        { en: '<thead>', ar: '<thead>' },
        { en: '<caption>', ar: '<caption>' },
      ],
      correctIndex: 0,
      explanation: {
        en: '<tfoot> holds summary rows that conclude the columns in <tbody>.',
        ar: 'يحتوي <tfoot> على صفوف التلخيص والنتائج النهائية للأعمدة.',
      },
    },
  }),
  buildTagLesson({
    id: 'html-08-05',
    chapterId: 'html-ch-08',
    order: 30,
    durationMinutes: 8,
    title: { en: 'Column Groups & Columns', ar: 'مجموعات الأعمدة والأعمدة' },
    summary: {
      en: 'Target entire table columns structurally using <colgroup> and <col>.',
      ar: 'تحديد وتنسيق أعمدة الجدول بالكامل هيكلياً عبر <colgroup> و <col>.',
    },
    tags: ['<colgroup>', '<col>'],
    tagSpecs: [
      {
        tag: '<colgroup>',
        syntax: '<colgroup>\n  <col span="2" />\n</colgroup>',
        attributes: {
          en: 'span (number of consecutive columns). Placed right after <caption>.',
          ar: 'span (عدد الأعمدة المتتالية). يوضع بعد <caption> مباشرة.',
        },
        description: {
          en: 'Groups one or more <col> definitions for shared column properties.',
          ar: 'يجمع تعريفات الأعمدة <col> لتطبيق خصائص مشتركة عليها.',
        },
      },
      {
        tag: '<col>',
        syntax: '<col span="1" style="background-color:#f5f5f5" />',
        attributes: {
          en: 'span (how many columns this void tag covers).',
          ar: 'span (عدد الأعمدة التي يغطيها هذا الوسم المفرد).',
        },
        description: {
          en: 'Represents a single column or span of columns inside <colgroup>.',
          ar: 'يمثل عموداً واحداً أو مجموعة أعمدة داخل <colgroup>.',
        },
      },
    ],
    exampleCode: `<table>
  <caption>Column Styling</caption>
  <colgroup>
    <col style="background-color:#f5f5f5;" />
    <col />
  </colgroup>
  <tr><th>Tag</th><th>Purpose</th></tr>
  <tr><td>&lt;col&gt;</td><td>Column definition</td></tr>
</table>`,
    challenge: {
      en: 'Build a <table> using <colgroup> with <col span="2" /> to group multiple columns together.',
      ar: 'أنشئ جدولاً يستخدم <colgroup> مع <col span="2" /> لتنسيق عمودين معاً.',
    },
    quizQuestion: {
      question: {
        en: 'Which attribute on <col> lets one element cover multiple adjacent columns?',
        ar: 'أي سمة في <col> تجعله يغطي عدة أعمدة متجاورة؟',
      },
      options: [
        { en: 'span', ar: 'span' },
        { en: 'colspan', ar: 'colspan' },
        { en: 'scope', ar: 'scope' },
      ],
      correctIndex: 0,
      explanation: {
        en: '<col> and <colgroup> use span, whereas <td> and <th> use colspan.',
        ar: 'يستخدم <col> سمة span، بينما تستخدم الخلايا colspan.',
      },
    },
  }),

  // ================= CHAPTER 09 =================
  buildTagLesson({
    id: 'html-09-01',
    chapterId: 'html-ch-09',
    order: 31,
    durationMinutes: 10,
    title: { en: 'Form Container & Input Fields', ar: 'حاوية النموذج وحقول الإدخال' },
    summary: {
      en: 'Collect and submit user input with <form> and versatile <input> controls.',
      ar: 'جمع وإرسال بيانات المستخدم عبر <form> وحقول <input> المتنوعة.',
    },
    tags: ['<form>', '<input>'],
    tagSpecs: [
      {
        tag: '<form>',
        syntax: '<form action="/submit" method="post">...</form>',
        attributes: {
          en: 'action (submission URL), method ("get" | "post"), autocomplete, novalidate.',
          ar: 'action (رابط الإرسال)، method ("get" أو "post")، autocomplete.',
        },
        description: {
          en: 'Interactive document section for collecting and submitting user data.',
          ar: 'القسم التفاعلي المسؤول عن جمع البيانات وإرسالها.',
        },
      },
      {
        tag: '<input>',
        syntax: '<input type="email" name="email" required placeholder="you@example.com" />',
        attributes: {
          en: 'type (text, email, password, number, checkbox, radio, date, file), name, required, value, placeholder.',
          ar: 'type (نوع الحقل)، name، required، value، placeholder.',
        },
        description: {
          en: 'Void tag supporting over 20 built-in input types and HTML5 validation.',
          ar: 'وسم مفرد يدعم أكثر من 20 نوع إدخال وتحققاً مدمجاً من البيانات.',
        },
      },
    ],
    exampleCode: `<form action="#" method="get">
  <p><input type="text" name="username" placeholder="Username" required /></p>
  <p><input type="email" name="email" placeholder="Email address" required /></p>
  <p><input type="submit" value="Submit Form" /></p>
</form>`,
    challenge: {
      en: 'Create a <form> containing a text or email <input required /> and a numeric <input type="number" min="1" max="10" />.',
      ar: 'أنشئ نموذج <form> يحتوي على حقل إدخال إلزامي مع حقل رقمي <input type="number" min="1" max="10" />.',
    },
    quizQuestion: {
      question: {
        en: 'Which attribute on <input> enforces that the field cannot be submitted empty?',
        ar: 'أي سمة في <input> تجعل الحقل إلزامياً قبل إرسال النموذج؟',
      },
      options: [
        { en: 'required', ar: 'required' },
        { en: 'placeholder', ar: 'placeholder' },
        { en: 'name', ar: 'name' },
      ],
      correctIndex: 0,
      explanation: {
        en: 'The boolean required attribute triggers native HTML5 validation before submission.',
        ar: 'تُفعّل سمة required التحقق المدمج لمنع إرسال النموذج فارغاً.',
      },
    },
  }),
  buildTagLesson({
    id: 'html-09-02',
    chapterId: 'html-ch-09',
    order: 32,
    durationMinutes: 8,
    title: { en: 'Labels & Multiline Textarea', ar: 'التسميات ومربع النص متعدد الأسطر' },
    summary: {
      en: 'Bind accessible captions to inputs with <label> and accept long text with <textarea>.',
      ar: 'ربط التسميات التوضيحية بالحقول عبر <label> وإدخال النصوص الطويلة عبر <textarea>.',
    },
    tags: ['<label>', '<textarea>'],
    tagSpecs: [
      {
        tag: '<label>',
        syntax: '<label for="bio">Biography</label>\n<textarea id="bio"></textarea>',
        attributes: {
          en: 'for (must match the id of the associated form control).',
          ar: 'for (يجب أن يطابق قيمة id للحقل المرتبط به).',
        },
        description: {
          en: 'Associates a clickable label with an input for usability and accessibility.',
          ar: 'يربط نص التسمية بالحقل لزيادة قابلية الاستخدام وإتاحة الوصول.',
        },
      },
      {
        tag: '<textarea>',
        syntax: '<textarea id="bio" name="bio" rows="4" cols="32"></textarea>',
        attributes: {
          en: 'name, rows, cols, maxlength, placeholder, required.',
          ar: 'name، rows (عدد الأسطر)، cols، maxlength، placeholder.',
        },
        description: {
          en: 'Multi-line plain-text editing control.',
          ar: 'عنصر تحرير نصوص متعددة الأسطر.',
        },
      },
    ],
    exampleCode: `<form>
  <label for="notes">Lesson Notes:</label><br />
  <textarea id="notes" name="notes" rows="4" cols="36" placeholder="Write your summary..."></textarea>
</form>`,
    challenge: {
      en: 'Create a <label> linked via its for="..." attribute to a multi-line <textarea id="...">.',
      ar: 'أنشئ تسمية <label> مرتبطة عبر سمة for="..." بمربع نص متعدد الأسطر <textarea id="...">.',
    },
    quizQuestion: {
      question: {
        en: 'Which attribute links a <label> to an input’s id?',
        ar: 'ما السمة التي تربط وسم <label> بـ id الخاص بالحقل؟',
      },
      options: [
        { en: 'for', ar: 'for' },
        { en: 'name', ar: 'name' },
        { en: 'bind', ar: 'bind' },
      ],
      correctIndex: 0,
      explanation: {
        en: 'Matching label[for] to control[id] enables click-to-focus and screen reader announcements.',
        ar: 'تطابق for مع id يتيح النقر على التسمية للتركيز وقراءة الوصف تلقائياً.',
      },
    },
  }),
  buildTagLesson({
    id: 'html-09-03',
    chapterId: 'html-ch-09',
    order: 33,
    durationMinutes: 8,
    title: { en: 'Buttons & Select Dropdowns', ar: 'الأزرار والقوائم المنسدلة' },
    summary: {
      en: 'Trigger actions with <button> and let users choose from a menu with <select>.',
      ar: 'تنفيذ الإجراءات بـ <button> وإتاحة الاختيار من قائمة منسدلة بـ <select>.',
    },
    tags: ['<button>', '<select>'],
    tagSpecs: [
      {
        tag: '<button>',
        syntax: '<button type="button">Click</button>',
        attributes: {
          en: 'type ("submit", "button", "reset"), disabled, name, value.',
          ar: 'type ("submit" أو "button" أو "reset")، disabled، name.',
        },
        description: {
          en: 'Interactive button element capable of containing text or inline icons.',
          ar: 'زر تفاعلي يقبل النصوص أو الأيقونات بداخله.',
        },
      },
      {
        tag: '<select>',
        syntax: '<select name="lang">\n  <option value="html">HTML</option>\n</select>',
        attributes: {
          en: 'name, multiple, required, disabled.',
          ar: 'name، multiple (للاختيار المتعدد)، required، disabled.',
        },
        description: {
          en: 'Dropdown control presenting a list of <option> choices.',
          ar: 'قائمة منسدلة تعرض مجموعة خيارات <option>.',
        },
      },
    ],
    exampleCode: `<form>
  <label for="track">Choose track:</label>
  <select id="track" name="track">
    <option value="html">HTML5</option>
    <option value="css">CSS3</option>
  </select>
  <button type="submit">Continue</button>
</form>`,
    challenge: {
      en: 'Build a <form> containing a <select> dropdown menu and both submit and reset <button> elements.',
      ar: 'أنشئ نموذج <form> يضم قائمة منسدلة <select> مع زري إرسال وإعادة ضبط <button>.',
    },
    quizQuestion: {
      question: {
        en: 'What is the default type of a <button> inside a <form> if type is omitted?',
        ar: 'ما النوع الافتراضي لوسم <button> داخل <form> إذا لم تُكتب سمة type؟',
      },
      options: [
        { en: 'submit', ar: 'submit' },
        { en: 'reset', ar: 'reset' },
        { en: 'menu', ar: 'menu' },
      ],
      correctIndex: 0,
      explanation: {
        en: 'A <button> defaults to type="submit" inside forms, so always set type="button" for non-submitting buttons.',
        ar: 'يكون الزر submit افتراضياً داخل النموذج، لذا يُنصح بتحديد type="button" للأزرار العادية.',
      },
    },
  }),

  // ================= CHAPTER 10 =================
  buildTagLesson({
    id: 'html-10-01',
    chapterId: 'html-ch-10',
    order: 34,
    durationMinutes: 8,
    title: { en: 'Options & Option Groups', ar: 'الخيارات ومجموعات الخيارات' },
    summary: {
      en: 'Populate <select> controls with <option> items organized by <optgroup>.',
      ar: 'تعبئة قوائم <select> بخيارات <option> وتصنيفها داخل مجموعات <optgroup>.',
    },
    tags: ['<option>', '<optgroup>'],
    tagSpecs: [
      {
        tag: '<option>',
        syntax: '<option value="ar" selected>Arabic</option>',
        attributes: {
          en: 'value (submitted value), selected (default selection), disabled.',
          ar: 'value (القيمة المرسلة)، selected (مختار افتراضياً)، disabled.',
        },
        description: {
          en: 'Defines an individual selectable item inside <select> or <datalist>.',
          ar: 'يعرّف خياراً فردياً داخل <select> أو <datalist>.',
        },
      },
      {
        tag: '<optgroup>',
        syntax: '<optgroup label="Core">\n  <option>HTML</option>\n</optgroup>',
        attributes: {
          en: 'label (required group heading), disabled.',
          ar: 'label (عنوان المجموعة الإلزامي)، disabled.',
        },
        description: {
          en: 'Groups related <option> elements under a non-selectable category label.',
          ar: 'يصنّف الخيارات المتقاربة تحت عنوان مجموعة غير قابل للاختيار.',
        },
      },
    ],
    exampleCode: `<label for="topic">Select Topic:</label>
<select id="topic">
  <optgroup label="Markup">
    <option value="tags" selected>HTML5 Tags</option>
    <option value="forms">Forms</option>
  </optgroup>
  <optgroup label="Media">
    <option value="svg">SVG</option>
  </optgroup>
</select>`,
    challenge: {
      en: 'Build a <select> menu organized into two <optgroup label="..."> categories containing <option> choices.',
      ar: 'أنشئ قائمة <select> مقسمة إلى مجموعتي <optgroup label="..."> تحتويان على خيارات <option>.',
    },
    quizQuestion: {
      question: {
        en: 'Which attribute sets the visible group heading on <optgroup>?',
        ar: 'أي سمة تحدد عنوان المجموعة الظاهر في وسم <optgroup>؟',
      },
      options: [
        { en: 'label', ar: 'label' },
        { en: 'title', ar: 'title' },
        { en: 'name', ar: 'name' },
      ],
      correctIndex: 0,
      explanation: {
        en: 'The label attribute on <optgroup> displays the category header inside the dropdown.',
        ar: 'تعرض سمة label عنوان التصنيف داخل القائمة المنسدلة.',
      },
    },
  }),
  buildTagLesson({
    id: 'html-10-02',
    chapterId: 'html-ch-10',
    order: 35,
    durationMinutes: 8,
    title: { en: 'Fieldsets & Legends', ar: 'مجموعات الحقول وعناوينها' },
    summary: {
      en: 'Group related form fields in <fieldset> and give the group a caption with <legend>.',
      ar: 'تجميع حقول النموذج المترابطة داخل <fieldset> وإعطائها عنواناً بـ <legend>.',
    },
    tags: ['<fieldset>', '<legend>'],
    tagSpecs: [
      {
        tag: '<fieldset>',
        syntax: '<fieldset>\n  <legend>Account</legend>\n  ...\n</fieldset>',
        attributes: {
          en: 'disabled (disables all descendant controls at once), name, form.',
          ar: 'disabled (لتعطيل جميع الحقول بداخله دفعة واحدة)، name، form.',
        },
        description: {
          en: 'Visually and semantically groups related inputs, especially radio groups.',
          ar: 'يجمع الحقول المترابطة دلالياً وبصرياً خصوصاً أزرار الاختيار.',
        },
      },
      {
        tag: '<legend>',
        syntax: '<legend>Preferred Language</legend>',
        attributes: {
          en: 'Global attributes. Placed as the first child of <fieldset>.',
          ar: 'السمات العامة. يوضع كأول عنصر داخل <fieldset>.',
        },
        description: {
          en: 'Provides the accessible title for the enclosing <fieldset>.',
          ar: 'يوفّر العنوان الوصفي لمجموعة الحقول.',
        },
      },
    ],
    exampleCode: `<form>
  <fieldset>
    <legend>Preferred Direction</legend>
    <label><input type="radio" name="dir" value="ltr" checked /> LTR</label>
    <label><input type="radio" name="dir" value="rtl" /> RTL</label>
  </fieldset>
</form>`,
    challenge: {
      en: 'Group at least two radio inputs inside a <fieldset> titled with a <legend>.',
      ar: 'جمّع زرّي اختيار radio على الأقل داخل <fieldset> يحمل عنواناً بوسم <legend>.',
    },
    quizQuestion: {
      question: {
        en: 'What happens when you place the disabled attribute on a <fieldset>?',
        ar: 'ماذا يحدث عند وضع سمة disabled على وسم <fieldset>؟',
      },
      options: [
        { en: 'All form controls inside that fieldset become disabled', ar: 'تتعطل جميع حقول الإدخال الموجودة بداخله' },
        { en: 'The legend text is deleted', ar: 'يُحذف نص العنوان' },
        { en: 'The form submits automatically', ar: 'يُرسل النموذج تلقائياً' },
      ],
      correctIndex: 0,
      explanation: {
        en: 'Disabling a <fieldset> disables every nested input, select, and button inside it.',
        ar: 'يعطّل كل عناصر الإدخال والأزرار الواقعة بداخله دفعة واحدة.',
      },
    },
  }),
  buildTagLesson({
    id: 'html-10-03',
    chapterId: 'html-ch-10',
    order: 36,
    durationMinutes: 8,
    title: { en: 'Datalist & Output', ar: 'قائمة الاقتراحات والمخرجات' },
    summary: {
      en: 'Attach autocomplete suggestions with <datalist> and display calculation results with <output>.',
      ar: 'إضافة اقتراحات الإكمال التلقائي بـ <datalist> وعرض نتائج الحسابات بـ <output>.',
    },
    tags: ['<datalist>', '<output>'],
    tagSpecs: [
      {
        tag: '<datalist>',
        syntax: '<input list="browsers" />\n<datalist id="browsers"><option value="Firefox" /></datalist>',
        attributes: {
          en: 'id (referenced by an <input> element’s list attribute).',
          ar: 'id (يرتبط بسمة list على حقل <input>).',
        },
        description: {
          en: 'Provides native autocomplete options while still allowing custom text.',
          ar: 'يوفّر قائمة اقتراحات تلقائية مع السماح بكتابة قيمة مخصصة.',
        },
      },
      {
        tag: '<output>',
        syntax: '<output name="result" for="a b">0</output>',
        attributes: {
          en: 'for (space-separated IDs of input elements), name, form.',
          ar: 'for (معرفات الحقول المؤثرة في النتيجة)، name، form.',
        },
        description: {
          en: 'Container for the result of a calculation or user interaction.',
          ar: 'حاوية لعرض ناتج عملية حسابية أو تفاعل داخل النموذج.',
        },
      },
    ],
    exampleCode: `<form oninput="total.value = Number(a.value) + Number(b.value)">
  <label for="tagPick">HTML Tag:</label>
  <input id="tagPick" list="tag-suggestions" placeholder="Type a tag..." />
  <datalist id="tag-suggestions">
    <option value="section" />
    <option value="article" />
    <option value="dialog" />
  </datalist>
  <p>Sum: <input id="a" type="number" value="2" /> + <input id="b" type="number" value="3" /> = <output name="total" for="a b">5</output></p>
</form>`,
    challenge: {
      en: 'Build a <form> linking an <input list="..."> to a <datalist> with <option> values, plus an <output> tag.',
      ar: 'أنشئ نموذجاً يربط حقل <input list="..."> بقائمة <datalist> تحتوي خيارات <option> مع وسم <output>.',
    },
    quizQuestion: {
      question: {
        en: 'Which attribute on <input> connects it to a <datalist> by id?',
        ar: 'أي سمة في <input> تربطه بقائمة <datalist> عبر المعرف id؟',
      },
      options: [
        { en: 'list', ar: 'list' },
        { en: 'for', ar: 'for' },
        { en: 'src', ar: 'src' },
      ],
      correctIndex: 0,
      explanation: {
        en: '<input list="my-id"> pairs with <datalist id="my-id">.',
        ar: 'تربط سمة list الحقل بقائمة الاقتراحات التي تحمل نفس الـ id.',
      },
    },
  }),
  buildTagLesson({
    id: 'html-10-04',
    chapterId: 'html-ch-10',
    order: 37,
    durationMinutes: 8,
    title: { en: 'Progress & Meter Indicators', ar: 'مؤشرات التقدم والقياس' },
    summary: {
      en: 'Show task completion with <progress> and scalar measurements within a range with <meter>.',
      ar: 'عرض نسبة إتمام مهمة بـ <progress> وقياس قيمة ضمن نطاق محدد بـ <meter>.',
    },
    tags: ['<progress>', '<meter>'],
    tagSpecs: [
      {
        tag: '<progress>',
        syntax: '<progress value="70" max="100">70%</progress>',
        attributes: {
          en: 'value (current progress), max (total amount, defaults to 1).',
          ar: 'value (القيمة الحالية)، max (الحد الأقصى).',
        },
        description: {
          en: 'Displays the completion progress of a task such as downloading or learning.',
          ar: 'يعرض شريط تقدم لإتمام مهمة مثل التحميل أو التقدم الدراسي.',
        },
      },
      {
        tag: '<meter>',
        syntax: '<meter min="0" max="100" low="30" high="80" optimum="90" value="85">85%</meter>',
        attributes: {
          en: 'value, min, max, low, high, optimum.',
          ar: 'value، min، max، low، high، optimum.',
        },
        description: {
          en: 'Represents a scalar gauge within a known range (e.g. disk usage or score).',
          ar: 'يمثل مقياساً لقيمة ضمن نطاق معروف مثل مساحة القرص أو التقييم.',
        },
      },
    ],
    exampleCode: `<p>Course Progress: <progress value="10" max="12">10 of 12</progress></p>
<p>Quiz Score Gauge: <meter min="0" max="100" low="50" high="80" optimum="95" value="88">88%</meter></p>`,
    challenge: {
      en: 'Render a <progress value="..." max="..."> bar and a <meter min="0" max="100" value="..."> gauge.',
      ar: 'أنشئ شريط تقدم <progress value="..." max="..."> ومقياس قياس <meter min="0" max="100" value="...">.',
    },
    quizQuestion: {
      question: {
        en: 'When should you choose <meter> instead of <progress>?',
        ar: 'متى يجب استخدام <meter> بدلاً من <progress>؟',
      },
      options: [
        { en: 'For static gauges like disk space, temperature, or test scores', ar: 'للمقاييس الثابتة ضمن نطاق مثل المساحة أو الدرجات' },
        { en: 'For multi-line text input', ar: 'لإدخال نص متعدد الأسطر' },
        { en: 'For embedding audio', ar: 'لتضمين ملف صوتي' },
      ],
      correctIndex: 0,
      explanation: {
        en: '<progress> tracks ongoing task completion; <meter> measures a value inside a range.',
        ar: 'يقيس <progress> تقدم مهمة جارية، بينما يقيس <meter> قيمة ضمن نطاق.',
      },
    },
  }),

  // ================= CHAPTER 11 =================
  buildTagLesson({
    id: 'html-11-01',
    chapterId: 'html-ch-11',
    order: 38,
    durationMinutes: 8,
    title: { en: 'Disclosure Details & Summary', ar: 'القوائم التفاعلية القابلة للطي' },
    summary: {
      en: 'Build native expandable accordions with zero JavaScript using <details> and <summary>.',
      ar: 'بناء أقسام قابلة للفتح والإغلاق بدون JavaScript باستخدام <details> و <summary>.',
    },
    tags: ['<details>', '<summary>'],
    tagSpecs: [
      {
        tag: '<details>',
        syntax: '<details open>\n  <summary>Click to toggle</summary>\n  <p>Hidden content</p>\n</details>',
        attributes: {
          en: 'open (boolean attribute that expands the widget initially), name (exclusive accordion group).',
          ar: 'open (يفتح القسم افتراضياً)، name (لربط عدة أقسام معاً).',
        },
        description: {
          en: 'Native disclosure widget revealing extra information on click.',
          ar: 'عنصر كشف تفاعلي أصلي يعرض محتوى إضافياً عند النقر.',
        },
      },
      {
        tag: '<summary>',
        syntax: '<summary>View Hint</summary>',
        attributes: {
          en: 'Global attributes. Must be the first child inside <details>.',
          ar: 'السمات العامة. يجب أن يكون أول عنصر داخل <details>.',
        },
        description: {
          en: 'Clickable visible heading that toggles its parent <details>.',
          ar: 'العنوان الظاهر القابل للنقر الذي يفتح ويغلق محتوى <details>.',
        },
      },
    ],
    exampleCode: `<details>
  <summary>What is the rule for &lt;summary&gt;?</summary>
  <p>It must be the first child inside &lt;details&gt; and acts as the toggle button.</p>
</details>`,
    challenge: {
      en: 'Build an accordion using <details open> with a <summary> as its first child and a descriptive <p> inside.',
      ar: 'أنشئ قائمة قابلة للطي باستخدام <details open> تبدأ بوسم <summary> وبداخلها فقرة توضيحية <p>.',
    },
    quizQuestion: {
      question: {
        en: 'Which boolean attribute expands a <details> widget by default?',
        ar: 'أي سمة منطقية تجعل عنصر <details> مفتوحاً افتراضياً؟',
      },
      options: [
        { en: 'open', ar: 'open' },
        { en: 'expanded', ar: 'expanded' },
        { en: 'show', ar: 'show' },
      ],
      correctIndex: 0,
      explanation: {
        en: 'Adding open to <details> reveals its body immediately on load.',
        ar: 'إضافة سمة open تعرض المحتوى الداخلي مباشرة عند تحميل الصفحة.',
      },
    },
  }),
  buildTagLesson({
    id: 'html-11-02',
    chapterId: 'html-ch-11',
    order: 39,
    durationMinutes: 8,
    title: { en: 'Dialogs & Inline Frames', ar: 'النوافذ الحوارية والإطارات المضمنة' },
    summary: {
      en: 'Present modal or non-modal overlays with <dialog> and embed external pages with <iframe>.',
      ar: 'عرض النوافذ الحوارية بـ <dialog> وتضمين صفحات أخرى داخل الصفحة بـ <iframe>.',
    },
    tags: ['<dialog>', '<iframe>'],
    tagSpecs: [
      {
        tag: '<dialog>',
        syntax: '<dialog open>\n  <p>Notice</p>\n</dialog>',
        attributes: {
          en: 'open (displays the dialog when present). Supports method="dialog" forms.',
          ar: 'open (يُظهر النافذة عند وجوده). يدعم إغلاقها بنماذج method="dialog".',
        },
        description: {
          en: 'Native modal or popup dialog box element.',
          ar: 'عنصر نافذة حوارية أو تنبيه قياسي في HTML5.',
        },
      },
      {
        tag: '<iframe>',
        syntax: '<iframe title="Preview" srcdoc="<p>Hello</p>" sandbox></iframe>',
        attributes: {
          en: 'title (required for accessibility), src, srcdoc, sandbox, loading, width, height.',
          ar: 'title (مطلوب لإتاحة الوصول)، src، srcdoc، sandbox (لعزل الأمان).',
        },
        description: {
          en: 'Embeds another HTML browsing context inside the current page.',
          ar: 'يدرج صفحة HTML مستقلة داخل الصفحة الحالية.',
        },
      },
    ],
    exampleCode: `<dialog open>
  <p>Native HTML5 &lt;dialog&gt; box.</p>
</dialog>
<iframe
  title="Sandboxed HTML Frame"
  sandbox
  width="320"
  height="90"
  srcdoc="<p style='font-family:sans-serif'>Inside &lt;iframe&gt; via srcdoc.</p>"
></iframe>`,
    challenge: {
      en: 'Create an open <dialog open> notice and a sandboxed <iframe title="..." sandbox srcdoc="..."> frame displaying a custom heading.',
      ar: 'أنشئ نافذة حوارية <dialog open> وإطاراً مضمناً <iframe title="..." sandbox srcdoc="..."> يعرض عنواناً مخصصاً.',
    },
    quizQuestion: {
      question: {
        en: 'Which attribute on <iframe> restricts scripts and permissions for security?',
        ar: 'أي سمة في <iframe> تقيّد الصلاحيات والأكواد لتعزيز الأمان؟',
      },
      options: [
        { en: 'sandbox', ar: 'sandbox' },
        { en: 'open', ar: 'open' },
        { en: 'alt', ar: 'alt' },
      ],
      correctIndex: 0,
      explanation: {
        en: 'The sandbox attribute applies strict security restrictions to embedded iframe content.',
        ar: 'تفرض سمة sandbox قيود أمان صارمة على المحتوى المضمن.',
      },
    },
  }),
  buildTagLesson({
    id: 'html-11-03',
    chapterId: 'html-ch-11',
    order: 40,
    durationMinutes: 8,
    title: { en: 'External Embeds & Objects', ar: 'التضمين الخارجي والكائنات' },
    summary: {
      en: 'Include external documents such as PDFs or vector objects using <embed> and <object>.',
      ar: 'تضمين مستندات خارجية مثل ملفات PDF أو الكائنات عبر <embed> و <object>.',
    },
    tags: ['<embed>', '<object>'],
    tagSpecs: [
      {
        tag: '<embed>',
        syntax: '<embed type="application/pdf" src="guide.pdf" width="300" height="200" />',
        attributes: {
          en: 'src (resource URL), type (MIME type), width, height.',
          ar: 'src (مسار المورد)، type (نوع MIME)، width، height.',
        },
        description: {
          en: 'Void element for embedding external content handled by the browser.',
          ar: 'وسم مفرد لتضمين محتوى خارجي يعرضه المتصفح.',
        },
      },
      {
        tag: '<object>',
        syntax: '<object data="diagram.svg" type="image/svg+xml" width="200" height="100">Fallback</object>',
        attributes: {
          en: 'data (resource URL), type (MIME type), width, height. Supports fallback inner HTML.',
          ar: 'data (رابط الملف)، type، width، height. يدعم محتوى بديلاً بداخله.',
        },
        description: {
          en: 'Embeds an external resource with built-in fallback markup if unavailable.',
          ar: 'يدرج مورداً خارجياً مع إمكانية وضع محتوى بديل داخله.',
        },
      },
    ],
    exampleCode: `<object
  data="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='60'><rect width='220' height='60' fill='%23111'/><text x='18' y='35' fill='%23fff' font-family='sans-serif' font-size='14'>Embedded Object SVG</text></svg>"
  type="image/svg+xml"
  width="220"
  height="60"
>
  Fallback text if object cannot load.
</object>`,
    challenge: {
      en: 'Embed an external resource using <embed> and an <object> element containing clear fallback text inside.',
      ar: 'ضمّن مورداً خارجياً بوسم <embed> وأنشئ عنصر <object> يحتوي على نص بديل واضح بداخله.',
    },
    quizQuestion: {
      question: {
        en: 'Which attribute specifies the resource URL on an <object> element?',
        ar: 'أي سمة تحدد رابط المورد في وسم <object>؟',
      },
      options: [
        { en: 'data', ar: 'data' },
        { en: 'href', ar: 'href' },
        { en: 'action', ar: 'action' },
      ],
      correctIndex: 0,
      explanation: {
        en: '<object> uses the data attribute, whereas <embed> and <iframe> use src.',
        ar: 'يستخدم <object> سمة data، بينما يستخدم <embed> و <iframe> سمة src.',
      },
    },
  }),

  // ================= CHAPTER 12 =================
  buildTagLesson({
    id: 'html-12-01',
    chapterId: 'html-ch-12',
    order: 41,
    durationMinutes: 8,
    title: { en: 'Scripts & Noscript Fallback', ar: 'ملفات السكربت والمحتوى البديل' },
    summary: {
      en: 'Attach client scripts safely with <script> and provide fallback content with <noscript>.',
      ar: 'ربط الأكواد البرمجية بأمان عبر <script> وتقديم محتوى بديل عند تعطيلها عبر <noscript>.',
    },
    tags: ['<script>', '<noscript>'],
    tagSpecs: [
      {
        tag: '<script>',
        syntax: '<script src="app.js" defer></script>',
        attributes: {
          en: 'src (external script URL), defer (run after HTML parses), async, type ("module").',
          ar: 'src (مسار الملف)، defer (التنفيذ بعد اكتمال قراءة HTML)، async، type.',
        },
        description: {
          en: 'Embeds or references executable client-side code or JSON data blocks.',
          ar: 'يدرج أو يربط ملفات JavaScript أو كتل البيانات النصية.',
        },
      },
      {
        tag: '<noscript>',
        syntax: '<noscript>Enable JavaScript to use interactive features.</noscript>',
        attributes: {
          en: 'Global attributes. Rendered only when scripting is disabled or unsupported.',
          ar: 'السمات العامة. يظهر محتواه فقط إذا كان JavaScript معطلاً في المتصفح.',
        },
        description: {
          en: 'Fallback container shown when scripts cannot execute.',
          ar: 'حاوية بديلة تظهر عند عدم توفر دعم تشغيل السكربتات.',
        },
      },
    ],
    exampleCode: `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Script &amp; Noscript</title>
    <script src="main.js" defer></script>
  </head>
  <body>
    <p>Using <code>defer</code> prevents scripts from blocking HTML parsing.</p>
    <noscript>
      <p>JavaScript is disabled in your browser.</p>
    </noscript>
  </body>
</html>`,
    challenge: {
      en: 'Include a non-blocking <script src="app.js" defer></script> (or type="module") inside <head> and a <noscript> notice inside <body>.',
      ar: 'أضف وسم <script> مع defer أو type="module" داخل <head>، واكتب رسالة تنبيه داخل <noscript> في <body>.',
    },
    quizQuestion: {
      question: {
        en: 'What does the defer attribute do on a <script src="..."> tag in <head>?',
        ar: 'ماذا تفعل سمة defer على وسم <script src="..."> داخل <head>؟',
      },
      options: [
        { en: 'Downloads in parallel and executes after HTML parsing finishes', ar: 'يحمّل الملف بالتوازي وينفذه بعد اكتمال قراءة HTML' },
        { en: 'Disables the script completely', ar: 'يعطّل تشغيل الملف نهائياً' },
        { en: 'Runs only when JavaScript is disabled', ar: 'يعمل فقط عند تعطيل JavaScript' },
      ],
      correctIndex: 0,
      explanation: {
        en: 'defer keeps HTML parsing fast while preserving script execution order.',
        ar: 'تحافظ defer على سرعة بناء الصفحة مع ضمان ترتيب تنفيذ السكربتات.',
      },
    },
  }),
  buildTagLesson({
    id: 'html-12-02',
    chapterId: 'html-ch-12',
    order: 42,
    durationMinutes: 8,
    title: { en: 'Templates & Component Slots', ar: 'القوالب المخفية ومنافذ المكونات' },
    summary: {
      en: 'Store reusable inert HTML fragments in <template> and define insertion placeholders with <slot>.',
      ar: 'حفظ أجزاء HTML القابلة لإعادة الاستخدام دون عرض فوري في <template> وتحديد مواضع الإدراج بـ <slot>.',
    },
    tags: ['<template>', '<slot>'],
    tagSpecs: [
      {
        tag: '<template>',
        syntax: '<template id="card-tpl">\n  <article>...</article>\n</template>',
        attributes: {
          en: 'Global attributes (id). Content is parsed but not rendered until cloned.',
          ar: 'السمات العامة (id). يُقرأ المحتوى ولا يُعرض حتى يتم استنساخه.',
        },
        description: {
          en: 'Holds reusable client-side HTML fragments that stay hidden on initial load.',
          ar: 'يحفظ قوالب HTML قابلة للنسخ تبقى غير مرئية عند التحميل الأول.',
        },
      },
      {
        tag: '<slot>',
        syntax: '<slot name="header">Default Header</slot>',
        attributes: {
          en: 'name (named insertion outlet inside a Shadow DOM template).',
          ar: 'name (اسم المنفذ المخصص لاستقبال المحتوى داخل القالب).',
        },
        description: {
          en: 'Placeholder inside a Web Component template where external HTML can be projected.',
          ar: 'موضع مخصص داخل مكونات الويب لاستقبال محتوى خارجي.',
        },
      },
    ],
    exampleCode: `<template id="lesson-card">
  <article>
    <slot name="title">Default Lesson Title</slot>
    <slot name="body"><p>Default summary</p></slot>
  </article>
</template>
<p>The &lt;template&gt; above is inert and hidden until activated.</p>`,
    challenge: {
      en: 'Create a <template id="..."> card containing at least two named <slot name="..."> elements.',
      ar: 'أنشئ قالباً <template id="..."> يحتوي على منفذين مسميين <slot name="..."> على الأقل بداخله.',
    },
    quizQuestion: {
      question: {
        en: 'Are elements inside <template> rendered visually when the page first loads?',
        ar: 'هل تظهر العناصر المكتوبة داخل <template> مرئياً عند تحميل الصفحة؟',
      },
      options: [
        { en: 'No — template content stays inert and hidden until cloned', ar: 'لا — يبقى المحتوى مخفياً وغير نشط حتى يتم استنساخه' },
        { en: 'Yes — it renders like a <div>', ar: 'نعم — يظهر مثل وسم <div>' },
        { en: 'Only inside <footer>', ar: 'فقط داخل <footer>' },
      ],
      correctIndex: 0,
      explanation: {
        en: '<template> contents are parsed into a DocumentFragment and remain invisible until instantiated.',
        ar: 'يظل محتوى <template> مخفياً وجاهزاً للاستخدام عند استنساخه.',
      },
    },
  }),
];
