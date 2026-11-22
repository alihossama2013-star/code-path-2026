import { LessonExplanation, LocalizedText } from './types';

export interface LessonEnrichment {
  explanation: LessonExplanation;
  imageUrl: string;
  imageAlt: LocalizedText;
  imageCaption: LocalizedText;
}

const IMG_FOUNDATION = '/src/assets/images/diagram_html_foundation_1795205594761.jpg';
const IMG_TEXT = '/src/assets/images/concept_text_typography_1795352326832.jpg';
const IMG_SEMANTIC = '/src/assets/images/diagram_html_semantic_1795205595697.jpg';
const IMG_LINKS = '/src/assets/images/concept_links_navigation_1795352326621.jpg';
const IMG_LISTS = '/src/assets/images/concept_lists_menus_1795352329976.jpg';
const IMG_VECTORS = '/src/assets/images/concept_images_vectors_1795352329742.jpg';
const IMG_AUDIO_VIDEO = '/src/assets/images/concept_audio_video_media_1795352329971.jpg';
const IMG_MEDIA_TABLES = '/src/assets/images/diagram_html_media_tables_1795205597187.jpg';
const IMG_FORMS = '/src/assets/images/diagram_html_forms_1795205595380.jpg';
const IMG_INTERACTIVE = '/src/assets/images/concept_interactive_dialogs_1795352329567.jpg';
const IMG_EMBEDDED = '/src/assets/images/concept_embedded_canvas_1795352329106.jpg';
const IMG_CSS = '/src/assets/images/concept_css_layout_grid_1795352329786.jpg';
const IMG_JS_REACT = '/src/assets/images/concept_js_react_components_1795352329663.jpg';
const IMG_FULLSTACK = '/src/assets/images/diagram_fullstack_layers_1795205594996.jpg';

export const lessonEnrichments: Record<string, LessonEnrichment> = {
  'html-01-01': {
    imageUrl: IMG_FOUNDATION,
    imageAlt: {
      en: 'HTML5 document foundation tree showing DOCTYPE html at the top feeding into html, head, and body',
      ar: 'مخطط أساس مستند HTML5 يوضح تصريح DOCTYPE في القمة متبوعاً بعناصر html و head و body',
    },
    imageCaption: {
      en: 'Visual flow: <!DOCTYPE html> activates standards mode before the browser builds the DOM tree.',
      ar: 'التدفق البصري: يفعل التصريح <!DOCTYPE html> الوضع القياسي قبل أن يبدأ المتصفح ببناء شجرة الصفحة.',
    },
    explanation: {
      overview: {
        en: 'Before a browser renders a single word or button, it needs to know which version of HTML your file follows. The <!DOCTYPE html> instruction is not a regular HTML tag; it is a short declaration placed at the very top of your file that tells Chrome, Safari, Firefox, and Edge to use modern HTML5 rules.',
        ar: 'قبل أن يعرض المتصفح أي كلمة أو زر، يحتاج إلى معرفة إصدار HTML الذي يتبعه ملفك. تعليمة <!DOCTYPE html> ليست وسماً تقليدياً له إغلاق، بل هي تصريح قصير يُكتب في السطر الأول لإخبار المتصفح بتشغيل قواعد HTML5 الحديثة.',
      },
      howItWorks: {
        en: 'In the early web, browsers had to support inconsistent legacy pages using a fallback behavior called "Quirks Mode", where CSS spacing and box sizes behaved unpredictably. When the browser reads <!DOCTYPE html> on line 1, it immediately switches into Standards Mode so layout, fonts, and elements behave consistently across every device.',
        ar: 'في بدايات الويب، اضطرت المتصفحات لدعم صفحات قديمة غير قياسية عبر وضع يُسمى وضع التوافق القديم (Quirks Mode)، حيث تختلف المقاسات والألوان بشكل غير متوقع. عند قراءة <!DOCTYPE html> في السطر الأول، ينتقل المتصفح فوراً إلى الوضع القياسي (Standards Mode) لضمان تطابق العرض على جميع الأجهزة.',
      },
      keyPoints: {
        en: [
          'Always place <!DOCTYPE html> on line 1 with no blank lines or comments before it.',
          'It has no closing tag and requires no attributes.',
          'It is case-insensitive, though lowercase or uppercase DOCTYPE is the universal convention.',
        ],
        ar: [
          'ضع التصريح <!DOCTYPE html> دائماً في السطر الأول دون أي نص أو فراغ قبله.',
          'لا يحتاج إلى وسم إغلاق ولا يأخذ أي سمات إضافية.',
          'لا يتأثر بحالة الأحرف، لكن كتابته بصيغة <!DOCTYPE html> هي المعيار الأشهر.',
        ],
      },
      commonMistake: {
        en: 'Forgetting <!DOCTYPE html> or placing HTML comments above it can silently trigger Quirks Mode and break CSS box sizing.',
        ar: 'نسيان كتابة <!DOCTYPE html> أو وضع تعليق برمجي قبله قد يُفعّل وضع التوافق القديم ويُفسد تخطيط CSS.',
      },
    },
  },
  'html-01-02': {
    imageUrl: IMG_FOUNDATION,
    imageAlt: {
      en: 'HTML root container wrapping head metadata and body content branches',
      ar: 'العنصر الجذري html يغلف فرعي البيانات الوصفية head والمحتوى body',
    },
    imageCaption: {
      en: 'The <html> element is the parent root holding two direct branches: <head> and <body>.',
      ar: 'العنصر <html> هو الجذر الرئيسي الذي يضم فرعين مباشرين: <head> و <body>.',
    },
    explanation: {
      overview: {
        en: 'Once <!DOCTYPE html> sets the rules, the <html> element acts as the outer container for the entire webpage. Inside it live exactly two main sections: <head> for invisible settings and configuration, and <body> for everything the visitor actually sees.',
        ar: 'بعد تحديد نوع المستند، يأتي وسم <html> ليعمل كالحاوية الأم التي تضم صفحة الويب بأكملها. وبداخل هذا الجذر يعيش قسمان رئيسيان فقط: <head> للإعدادات غير المرئية، و <body> لكل ما يراه المستخدم ويتفاعل معه.',
      },
      howItWorks: {
        en: 'Adding lang="en" or lang="ar" on <html> informs screen readers which pronunciation engine to use and helps search engines index your language accurately. Adding dir="rtl" flips the document reading direction cleanly for Arabic interfaces. Meanwhile, the <head> section loads character encoding, page titles, and stylesheets before visible elements paint onto the screen.',
        ar: 'إضافة سمة lang="ar" أو lang="en" على وسم <html> تُرشد قارئات الشاشة إلى لغة النطق الصحيحة وتساعد محركات البحث على فهرسة الصفحة بدقة. أما سمة dir="rtl" فتضبط اتجاه الصفحة من اليمين إلى اليسار للغة العربية. في المقابل، يحتفظ وسم <head> بترميز الحروف وعنوان التبويب وملفات التنسيق لتحضيرها قبل رسم المحتوى.',
      },
      keyPoints: {
        en: [
          'Every visible and invisible HTML element must live inside <html>...</html>.',
          'Always declare lang (such as lang="ar" or lang="en") on <html> for accessibility.',
          'Content inside <head> configures the page; it is never displayed inside the main viewport.',
        ],
        ar: [
          'جميع عناصر الصفحة المرئية وغير المرئية يجب أن تقع داخل <html>...</html>.',
          'احرص دائماً على كتابة سمة lang على <html> لدعم إتاحة الوصول ومحركات البحث.',
          'ما يُكتب داخل <head> هو إعدادات للمتصفح ولا يظهر داخل مساحة المحتوى الرئيسية.',
        ],
      },
      commonMistake: {
        en: 'Putting headings, paragraphs, or images directly inside <head> or outside <html> causes browsers to move them unpredictably during parsing.',
        ar: 'وضع العناوين أو الفقرات داخل <head> أو خارج <html> يؤدي إلى إعادة ترتيب العناصر تلقائياً بشكل غير متوقع.',
      },
    },
  },
  'html-01-03': {
    imageUrl: IMG_FOUNDATION,
    imageAlt: {
      en: 'Document anatomy showing body containing visible text and interface blocks',
      ar: 'بنية المستند توضح احتواء وسم body على النصوص والعناصر المرئية',
    },
    imageCaption: {
      en: 'Everything rendered inside the browser window originates inside <body>.',
      ar: 'كل ما يظهر للمستخدم داخل نافذة المتصفح يُكتب داخل وسم <body>.',
    },
    explanation: {
      overview: {
        en: 'The <body> element is the canvas of your webpage. Every heading, paragraph, photo, link, table, form, and interactive button that appears in the browser window belongs inside <body>.',
        ar: 'يمثل وسم <body> مساحة العرض المرئية في صفحتك. كل عنوان أو فقرة أو صورة أو رابط أو جدول أو نموذج يراه الزائر داخل نافذة المتصفح مكانه الصحيح هو داخل <body>.',
      },
      howItWorks: {
        en: 'After reading <head>, the browser parses <body> from top to bottom and constructs visual layout boxes in the Document Object Model (DOM). There must be only one <body> element per HTML file, placed immediately after </head>.',
        ar: 'بعد قراءة إعدادات <head>، يقرأ المتصفح وسم <body> من الأعلى إلى الأسفل لبناء شجرة العناصر المرئية (DOM). يشترط معيار HTML وجود وسم <body> واحد فقط في كل ملف، ويأتي مباشرة بعد إغلاق </head>.',
      },
      keyPoints: {
        en: [
          'Only one <body> tag is permitted in an HTML document.',
          'All semantic landmarks like <header>, <main>, and <footer> live inside <body>.',
          'Global attributes like class, id, and dir can also be placed on <body>.',
        ],
        ar: [
          'يُسمح بوسم <body> واحد فقط في صفحة HTML الواحدة.',
          'جميع المعالم الدلالية مثل <header> و <main> و <footer> توضع داخل <body>.',
          'يقبل <body> السمات العامة مثل class و id و dir.',
        ],
      },
      commonMistake: {
        en: 'Writing visible text right after </html> or creating multiple <body> tags makes the DOM invalid.',
        ar: 'كتابة نصوص مرئية بعد إغلاق </html> أو تكرار وسم <body> يجعل بنية المستند غير صالحة.',
      },
    },
  },
  'html-01-04': {
    imageUrl: IMG_FOUNDATION,
    imageAlt: {
      en: 'Head metadata block illustrating title and meta tags feeding browser tabs and SEO',
      ar: 'قسم البيانات الوصفية يوضح ارتباط وسمي title و meta بتبويب المتصفح ومحركات البحث',
    },
    imageCaption: {
      en: '<title> names the browser tab; <meta> defines UTF-8 encoding and mobile viewport scaling.',
      ar: 'يسمّي <title> تبويب المتصفح، ويضبط <meta> ترميز الأحرف ومقياس شاشات الهواتف.',
    },
    explanation: {
      overview: {
        en: 'While visitors cannot see <head> directly on the page, <title> and <meta> dramatically shape their experience. <title> sets the label shown in the browser tab and Google search results, while <meta> provides essential technical instructions like character encoding and mobile scaling.',
        ar: 'رغم أن الزائر لا يرى قسم <head> داخل جسم الصفحة، فإن وسمي <title> و <meta> يؤثران بشكل مباشر على تجربته. يحدد <title> العنوان الظاهر في تبويب المتصفح ونتائج البحث، بينما يزود <meta> المتصفح بتعليمات أساسية مثل ترميز الحروف وتوافق الشاشات.',
      },
      howItWorks: {
        en: '<meta charset="UTF-8" /> tells the browser how to decode Arabic letters, English letters, and symbols without garbled text. <meta name="viewport" content="width=device-width, initial-scale=1.0" /> prevents smartphones from zooming out to a tiny desktop layout. Meanwhile, <meta name="description" content="..." /> summarizes the page for search engines.',
        ar: 'يخبر <meta charset="UTF-8" /> المتصفح بكيفية فك تشفير الحروف العربية والإنجليزية والرموز دون ظهور علامات مشوهة. أما وسم viewport فيمنع الهواتف الذكية من تصغير الصفحة كشاشة حاسوب، بينما يكتب وسم description ملخصاً للموقع يظهر في محركات البحث.',
      },
      keyPoints: {
        en: [
          'Put <meta charset="UTF-8" /> as the very first tag inside <head>.',
          '<title> accepts plain text only — HTML tags inside <title> will display as literal text.',
          'Always include the viewport <meta> tag so responsive pages look crisp on mobile phones.',
        ],
        ar: [
          'ضع <meta charset="UTF-8" /> كأول وسم داخل <head> دائماً.',
          'يقبل وسم <title> نصاً عادياً فقط ولا تُفسَّر داخله وسوم HTML أخرى.',
          'لا تستغنِ أبداً عن وسم viewport لضمان وضوح الصفحة على الهواتف الذكية.',
        ],
      },
      commonMistake: {
        en: 'Omitting charset="UTF-8" can turn Arabic characters into unreadable symbols on older servers.',
        ar: 'إهمال كتابة charset="UTF-8" قد يتسبب في ظهور النصوص العربية كرموز غير مفهومة.',
      },
    },
  },
  'html-01-05': {
    imageUrl: IMG_FOUNDATION,
    imageAlt: {
      en: 'Document head connecting external stylesheet and icon files via link and resolving paths with base',
      ar: 'قسم head يربط ملفات التنسيق والأيقونات الخارجية بـ link ويحدد المسار المرجعي بـ base',
    },
    imageCaption: {
      en: '<link> pulls in external CSS and favicons; <base> sets the root prefix for relative URLs.',
      ar: 'يربط <link> ملفات التنسيق والأيقونات الخارجية، ويحدد <base> عنوان الأساس للروابط النسبية.',
    },
    explanation: {
      overview: {
        en: 'Real websites separate HTML structure from CSS styling and icons across multiple files. The <link> tag connects your HTML page to external stylesheets, web fonts, and browser tab icons. The <base> tag defines a shared starting URL for every relative link on the page.',
        ar: 'في المشاريع الحقيقية نفصل بنية HTML عن تنسيقات CSS والأيقونات في ملفات مستقلة. يقوم وسم <link> بربط الصفحة بملفات التنسيق والأيقونات، بينما يحدد وسم <base> مساراً أساسياً مشتركاً تُحسب منه جميع الروابط النسبية في الصفحة.',
      },
      howItWorks: {
        en: 'When the browser encounters <link rel="stylesheet" href="styles.css" />, it reads the rel attribute to understand the relationship ("stylesheet" or "icon") and downloads the file at href. If <base href="https://example.com/docs/" /> is present, any relative link like <a href="intro.html"> automatically resolves to https://example.com/docs/intro.html.',
        ar: 'عندما يقرأ المتصفح <link rel="stylesheet" href="styles.css" />، يفحص سمة rel ليعرف طبيعة الملف ("stylesheet" للتنسيق أو "icon" للأيقونة) ثم يحمله من المسار المحدد في href. وإذا وُجد <base href="..." /> في <head>، فإن كل رابط نسبي داخل الصفحة يُدمج تلقائياً مع هذا العنوان الأساسي.',
      },
      keyPoints: {
        en: [
          'Use rel="stylesheet" for CSS files and rel="icon" for site favicons.',
          'Both <link> and <base> are void tags — they have no closing tags.',
          'Only one <base> element is allowed per document, and it affects all relative URLs including #anchors.',
        ],
        ar: [
          'استخدم rel="stylesheet" لملفات CSS و rel="icon" لأيقونة التبويب.',
          'كلا الوسمين <link> و <base> مفردان ولا يملكان وسم إغلاق.',
          'يُسمح بوسم <base> واحد فقط في المستند، وتذكر أنه يؤثر على كافة الروابط النسبية بما فيها روابط # الداخلية.',
        ],
      },
      commonMistake: {
        en: 'Confusing <link> (which connects external resources in <head>) with <a> (which creates clickable hyperlinks in <body>).',
        ar: 'الخلط بين <link> المخصص لربط الموارد داخل <head> ووسم <a> المخصص للروابط القابلة للنقر داخل <body>.',
      },
    },
  },
  'html-02-01': {
    imageUrl: IMG_TEXT,
    imageAlt: {
      en: 'HTML5 document outline hierarchy showing h1 to h6 headings, paragraphs p, line breaks br, and hr thematic dividers',
      ar: 'مخطط تسلسل العناوين من h1 إلى h6 والفقرات p وفواصل الأسطر br والخطوط الفاصلة hr',
    },
    imageCaption: {
      en: 'Headings establish your document outline while <p>, <br>, and <hr> organize readable blocks and breaks.',
      ar: 'ترسم العناوين هيكل المستند بينما تنظم وسوم <p> و <br> و <hr> الفقرات وفواصل الموضوعات.',
    },
    explanation: {
      overview: {
        en: 'Readable web pages start with clear visual and structural hierarchy. HTML gives you six heading ranks (<h1> through <h6>) for titles and subheadings, the <p> tag for prose paragraphs, <br> for intentional single line breaks (such as poems or street addresses), and <hr> for horizontal thematic dividers between distinct topics.',
        ar: 'تبدأ أي صفحة ويب مقروءة بتسلسل واضح للعناوين والنصوص. تمنحك HTML ست مستويات من العناوين (<h1> حتى <h6>)، ووسم <p> للفقرات النصية، ووسم <br> لكسر السطر داخل الفقرة عند الضرورة (مثل العناوين البريدية أو الأبيات الشعرية)، ووسم <hr> للفصل الموضوعي بين قسمين مختلفين.',
      },
      howItWorks: {
        en: 'Screen readers build an interactive table of contents directly from <h1>–<h6> tags. Keep a single main <h1> for the page title, place <h2> tags directly beneath it for major sections, and nest <h3> inside <h2>. Unlike <p>, which wraps an entire block with natural spacing above and below, <br> and <hr> are void tags that carry no closing tag.',
        ar: 'تعتمد قارئات الشاشة ومحركات البحث على وسوم <h1>–<h6> لبناء فهرس المحتوى تلقائياً. ابدأ بعنوان رئيسي واحد <h1> للصفحة، وتبعه بـ <h2> للأقسام الكبرى ثم <h3> للأقسام الفرعية. وعلى عكس <p> الذي يحيط بكتلة النص ويفصلها عمودياً، فإن <br> و <hr> وسمان مفردان لا يملكان وسم إغلاق.',
      },
      keyPoints: {
        en: [
          'Choose heading levels by document outline rank (h1 → h2 → h3), never to resize text.',
          'Wrap every independent block of text in <p> rather than separating lines with <br />.',
          'Reserve <hr> for genuine thematic shifts, not purely decorative borders.',
        ],
        ar: [
          'اختر مستوى العنوان بناءً على تسلسله في الصفحة (h1 ثم h2 ثم h3) وليس لمجرد تكبير أو تصغير الخط.',
          'ضع كل فقرة مستقلة داخل وسم <p> خاص بها بدلاً من تكديس <br />.',
          'استخدم <hr> للانتقال بين موضوعات مختلفة داخل القسم.',
        ],
      },
      commonMistake: {
        en: 'Repeating multiple <br /> tags to create empty vertical space instead of separate <p> paragraphs or CSS margin.',
        ar: 'تكرار <br /> عدة مرات لترك مسافات فارغة بدلاً من إنشاء فقرات <p> منفصلة أو استخدام هوامش CSS.',
      },
    },
  },
  'html-02-02': {
    imageUrl: IMG_TEXT,
    imageAlt: {
      en: 'Semantic text emphasis and edit tags diagram comparing strong/em against b/i, highlights, and del/ins edits',
      ar: 'مقارنة وسوم التأكيد الدلالي strong و em مع التنسيق الشكلي والتظليل والتعديلات del و ins',
    },
    imageCaption: {
      en: 'Use <strong> and <em> for real meaning; use <del>, <ins>, <sub>, and <sup> for edits and formulas.',
      ar: 'استخدم <strong> و <em> للأهمية الدلالية، و <del> و <ins> و <sub> و <sup> للتعديلات والمعادلات.',
    },
    explanation: {
      overview: {
        en: 'Not all bold or italic text means the same thing. HTML separates true semantic emphasis (<strong> for serious importance, <em> for spoken stress) from stylistic distinctions (<b> for keywords, <i> for foreign or technical terms). This lesson also covers <mark> highlights, <small> fine print, <u> spelling/annotations, <s> outdated text, <del>/<ins> tracked edits, and <sub>/<sup> scripts.',
        ar: 'ليست كل كلمة عريضة أو مائلة تحمل المعنى نفسه. تفصل HTML بين التأكيد الدلالي الحقيقي (<strong> للأهمية القصوى و <em> للتشديد النطقي) والتمييز الشكلي (<b> للكلمات المفتاحية و <i> للمصطلحات الأجنبية والتقنية). كما يغطي الدرس التظليل <mark> والحواشي الصغيرة <small> والتعديلات <del> و <ins> والأسس <sub> و <sup>.',
      },
      howItWorks: {
        en: 'Screen readers change voice tone for <strong> and <em>, whereas <b> and <i> only alter styling. When updating prices or articles, <s> marks content that is no longer accurate without history, while <del> and <ins> formally record removed and added text (supporting cite and datetime attributes). Use <sub> for chemical formulas like H₂O and <sup> for powers like 10².',
        ar: 'تُغيّر قارئات الشاشة نبرة الصوت عند <strong> و <em>، بينما يقتصر <b> و <i> على المظهر البصري. وعند تحديث الأسعار أو النصوص، يشير <s> لمعلومة غير سارية حالياً، بينما يوثق <del> و <ins> التعديل رسمياً. ويُستخدم <sub> للأرقام السفلية مثل H₂O و <sup> للأسس الرياضية مثل 10².',
      },
      keyPoints: {
        en: [
          'Reach for <strong> and <em> first whenever words carry urgency or vocal emphasis.',
          'Use <mark> for search-result matches or relevant study highlights, and <small> for disclaimers/copyright.',
          'Keep <sub> and <sup> for genuine subscripts/superscripts (chemistry, footnotes, exponents).',
        ],
        ar: [
          'ابدأ دائماً بـ <strong> و <em> عند الرغبة في إبراز أهمية المعنى أو التشديد عليه.',
          'استخدم <mark> لتظليل الكلمات المفتاحية المهمة، و <small> للملاحظات القانونية والحقوق.',
          'خصص <sub> و <sup> للصيغ العلمية والحواشي والأسس فقط.',
        ],
      },
      commonMistake: {
        en: 'Using <u> purely to underline ordinary words — users often mistake underlined text for broken hyperlinks.',
        ar: 'استخدام وسم <u> لتسطير كلمات عادية؛ فقد يظن المستخدم خطأً أنها روابط لا تعمل.',
      },
    },
  },
  'html-02-03': {
    imageUrl: IMG_TEXT,
    imageAlt: {
      en: 'Quotations, citations, definitions, and contact tags layout linking blockquote, q, cite, abbr, dfn, and address',
      ar: 'بنية الاقتباسات والمصادر والاختصارات والتعريفات عبر blockquote و q و cite و abbr و dfn و address',
    },
    imageCaption: {
      en: 'Cite sources cleanly with <blockquote>, <q>, and <cite>, and explain terms with <dfn> and <abbr>.',
      ar: 'وثّق المصادر بدقة عبر <blockquote> و <q> و <cite>، وعرّف المصطلحات بوسمي <dfn> و <abbr>.',
    },
    explanation: {
      overview: {
        en: 'Technical articles, documentation, and essays constantly reference external sources, define terminology, and credit authors. HTML provides dedicated semantic tags for each job: <abbr> for acronyms, <dfn> for the exact place a term is defined, <blockquote> and <q> for block and inline quotations, <cite> for source titles, and <address> for author contact info.',
        ar: 'تحتاج المقالات والوثائق التقنية باستمرار إلى توثيق المصادر وتعريف المصطلحات وذكر بيانات التواصل. توفر HTML وسوماً مخصصة لكل غرض: <abbr> للاختصارات، و <dfn> لتحديد موضع تعريف المصطلح، و <blockquote> و <q> للاقتباسات الطويلة والقصيرة، و <cite> لاسم المرجع، و <address> لبيانات التواصل.',
      },
      howItWorks: {
        en: 'Adding title="Document Object Model" to <abbr> reveals the full expansion on mouse hover and to assistive tools. Browsers automatically wrap <q> in smart language-appropriate quotation marks, while <blockquote> indents multi-line quotes and accepts a cite="URL" attribute pointing to the original source. Reserve <address> strictly for contact details (emails, social URLs, physical address) — never for arbitrary street names inside a story.',
        ar: 'إضافة سمة title على <abbr> تُظهر الشرح الكامل للاختصار عند تمرير الفأرة ولقارئات الشاشة. ويضيف المتصفح علامات تنصيص تلقائية حول <q>، بينما يخصّص <blockquote> للاقتباسات الطويلة مع إمكانية إضافة رابط المصدر في سمة cite. أما <address> فيُقتصر استخدامه على بيانات التواصل الخاصة بالمؤلف أو الموقع فقط.',
      },
      keyPoints: {
        en: [
          'Always attach a descriptive title="..." attribute to <abbr> so users can inspect the full meaning.',
          'Use <cite> for titles of works (books, specs, papers, films), not usually for a person’s name alone.',
          'Place <address> inside <footer> or <article> for clear authorship contact details.',
        ],
        ar: [
          'أضف سمة title="..." دائماً مع وسم <abbr> لتوضيح معنى الاختصار.',
          'استخدم <cite> لاسم الكتاب أو المواصفة أو المقال، وليس لمجرد اسم شخص عادي.',
          'ضع <address> غالباً داخل <footer> أو نهاية <article> لتوضيح جهة التواصل.',
        ],
      },
      commonMistake: {
        en: 'Wrapping any street address mentioned in a blog story inside <address> instead of reserving <address> for page/article contact info.',
        ar: 'استخدام وسم <address> لأي عنوان شارع مذكور عرضياً في القصة بدلاً من تخصيصه لمعلومات التواصل الرسمية.',
      },
    },
  },
  'html-02-04': {
    imageUrl: IMG_TEXT,
    imageAlt: {
      en: 'Technical inline tags showing code, pre, kbd, samp, var, bdi isolation, bdo direction override, and ruby annotations',
      ar: 'الوسوم التقنية للأكواد code و pre و kbd وعزل الاتجاه bdi و bdo وحواشي النطق ruby',
    },
    imageCaption: {
      en: 'Combine <pre><code> for multi-line snippets and <bdi> whenever mixing Arabic and English text.',
      ar: 'ادمج <pre><code> لكتل الكود متعددة الأسطر، واستخدم <bdi> عند خلط العربية والإنجليزية.',
    },
    explanation: {
      overview: {
        en: 'Developer documentation and bilingual websites rely on precise inline tags. Use <code> for inline code, <pre> to preserve exact spaces and line breaks, <kbd> for keyboard shortcuts, <samp> for terminal/program output, and <var> for variables. Alongside them, <span> provides a neutral inline hook, <bdi>/<bdo> handle mixed Right-to-Left & Left-to-Right text, and <ruby>/<rt>/<rp> attach pronunciation annotations.',
        ar: 'تعتمد المواقع التقنية والمواقع ثنائية اللغة (العربية/الإنجليزية) على هذه المجموعة من الوسوم: <code> للكود السطري، و <pre> للحفاظ على المسافات والأسطر، و <kbd> لأزرار لوحة المفاتيح، و <samp> لمخرجات البرامج، و <var> للمتغيرات. كما يوفر <span> حاوية سطرية محايدة، بينما يعالج <bdi> و <bdo> تداخل الاتجاهات، ويعرض <ruby> مع <rt> و <rp> حواشي النطق.',
      },
      howItWorks: {
        en: 'Inside normal HTML, multiple spaces and newlines collapse into a single space — wrapping <code> inside <pre> preserves exact indentation for multi-line code blocks. For Arabic interfaces displaying English usernames or error codes, wrapping dynamic names in <bdi> isolates their text direction so surrounding punctuation stays in place, whereas <bdo dir="rtl"> forcefully reverses character direction.',
        ar: 'تتجاهل HTML المسافات المتكررة والأسطر الجديدة تلقائياً، لذا نضع <code> داخل <pre> للحفاظ على تنسيق الكود متعدد الأسطر كما هو. وفي الواجهات العربية التي تعرض أسماءً إنجليزية أو عكسية، يعزل وسم <bdi> اتجاه الاسم لحماية ترتيب الجملة، بينما يفرض <bdo dir="rtl"> اتجاهاً محدداً قسراً. أما <ruby> فيضع نطق الرمز داخل <rt> مع أقواس بديلة <rp>.',
      },
      keyPoints: {
        en: [
          'Always nest <code> inside <pre> for multi-line code listings.',
          'Wrap dynamic usernames or mixed-direction strings in <bdi> in bilingual RTL/LTR apps.',
          'Distinguish user input (<kbd>) from computer output (<samp>) and math/code variables (<var>).',
        ],
        ar: [
          'ضع <code> داخل <pre> دائماً عند عرض مقاطع كود متعددة الأسطر.',
          'استخدم <bdi> حول الأسماء المتغيرة داخل الجمل العربية لتجنب تبعثر علامات الترقيم.',
          'فرّق بين مدخلات المستخدم (<kbd>) ومخرجات البرنامج (<samp>) وأسماء المتغيرات (<var>).',
        ],
      },
      commonMistake: {
        en: 'Putting multi-line code inside <code> alone without <pre>, causing all line breaks and indentation to collapse into one line.',
        ar: 'وضع كود متعدد الأسطر داخل <code> دون تغليفه بوسم <pre>، مما يدمج كل الأسطر في سطر واحد.',
      },
    },
  },
  'html-02-05': {
    imageUrl: IMG_TEXT,
    imageAlt: {
      en: 'Description list diagram linking dl parent to dt terms and dd explanations',
      ar: 'مخطط قائمة التعريف يوضح ارتباط الحاوية dl بالمصطلحات dt والشروحات dd',
    },
    imageCaption: {
      en: '<dl> pairs one or more <dt> terms with their matching <dd> descriptions.',
      ar: 'تربط حاوية <dl> مصطلحاً واحداً أو أكثر <dt> بشروحاتها المناسبة <dd>.',
    },
    explanation: {
      overview: {
        en: 'When you need to display a glossary, FAQ, or key-value metadata such as "Author: Layla" or "Version: 5.0", a regular bullet list loses the explicit link between label and value. HTML solves this with Description Lists (<dl>) and Description Terms (<dt>).',
        ar: 'عندما تريد عرض قاموس مصطلحات أو أسئلة شائعة أو بيانات ثنائية مثل "المؤلف: ليلى" أو "الإصدار: 5.0"، لا تكفي القوائم النقطية العادية لإظهار العلاقة بين الاسم وقيمته. هنا توفر HTML قوائم التعريف <dl> وعناصر المصطلح <dt>.',
      },
      howItWorks: {
        en: 'The <dl> tag creates the outer description list container. Inside it, each <dt> announces the term, question, or property name. Multiple <dt> tags can even share one description, or a single <dt> can be followed by multiple <dd> details.',
        ar: 'ينشئ وسم <dl> الحاوية الخارجية لقائمة التعريفات. وبداخله يحدد كل وسم <dt> اسم المصطلح أو السؤال أو الخاصية. ويمكن لمصطلحين <dt> الاشتراك في شرح واحد، كما يمكن لمصطلح واحد أن يتبعه أكثر من شرح <dd>.',
      },
      keyPoints: {
        en: [
          'Use <dl> for glossaries, metadata specs, and term-definition pairs.',
          'Only <dt>, <dd>, and wrapper <div> elements are valid direct children of <dl>.',
          'Do not use <dt> alone outside a <dl> container.',
        ],
        ar: [
          'استخدم <dl> للمعاجم والمواصفات التقنية وأزواج الاسم والقيمة.',
          'العناصر المسموحة مباشرة داخل <dl> هي <dt> و <dd> (أو <div> للتجميع فقط).',
          'لا تكتب وسم <dt> منفرداً خارج حاوية <dl>.',
        ],
      },
      commonMistake: {
        en: 'Wrapping <dt> and <dd> inside <li> tags — description lists do not use <li> at all.',
        ar: 'وضع <dt> و <dd> داخل وسم <li> — فقوائم التعريف لا تستخدم <li> إطلاقاً.',
      },
    },
  },
  'html-02-06': {
    imageUrl: IMG_TEXT,
    imageAlt: {
      en: 'Description value pairing showing dd text and machine-readable data value attribute',
      ar: 'اقتران قيمة الوصف dd ووسم data بالقيمة البرمجية القابلة للقراءة الآلية',
    },
    imageCaption: {
      en: '<dd> holds the human explanation while <data value="..."> attaches an exact code for scripts.',
      ar: 'يحمل <dd> الشرح المقروء للبشر بينما يربط <data value="..."> قيمة برمجية دقيقة للأكواد.',
    },
    explanation: {
      overview: {
        en: 'Every term <dt> needs its matching explanation inside <dd> (Description Details). Meanwhile, when displaying formatted prices, status codes, or product IDs, the <data> element lets you show friendly text to humans while storing a clean machine-readable value in the value attribute.',
        ar: 'يحتاج كل مصطلح <dt> إلى شرحه المقابل داخل وسم <dd>. وعندما تعرض أسعاراً أو أكواد حالة أو أرقام منتجات، يتيح لك وسم <data> عرض نص مألوف للإنسان مع تخزين قيمة رقمية أو برمجية دقيقة داخل سمة value لتقرأها البرامج.',
      },
      howItWorks: {
        en: 'Browsers typically indent <dd> slightly beneath its <dt> term to visually show the relationship. Inside any paragraph or <dd>, wrapping text like <data value="200">200 OK — Request succeeded</data> gives JavaScript or search indexers direct access to "200" without parsing words out of the sentence.',
        ar: 'تقوم المتصفحات عادةً بإزاحة محتوى <dd> قليلاً لتمييز ارتباطه بالمصطلح <dt> فوقه. وعند استخدام <data value="200">200 OK</data>، تحصل الأكواد ومحركات البحث على القيمة "200" مباشرة دون الحاجة لتفكيك النص العربي أو الإنجليزي.',
      },
      keyPoints: {
        en: [
          '<dd> can contain rich HTML such as paragraphs, links, or lists — not just plain words.',
          'Always provide the value attribute on <data>; otherwise the tag has no machine-readable payload.',
          'For dates and durations, prefer <time> over <data>.',
        ],
        ar: [
          'يمكن أن يحتوي <dd> على فقرات أو روابط أو قوائم داخلية، وليس مجرد كلمة واحدة.',
          'يجب دائماً إضافة سمة value مع وسم <data> لإعطاء القيمة البرمجية.',
          'للتواريخ والأوقات، استخدم وسم <time> بدلاً من <data>.',
        ],
      },
      commonMistake: {
        en: 'Putting <dd> before any <dt> inside a <dl>, leaving the description without a term.',
        ar: 'كتابة <dd> قبل وجود وسم <dt> داخل <dl>، مما يترك الشرح بلا مصطلح يرتبط به.',
      },
    },
  },
  'html-02-07': {
    imageUrl: IMG_TEXT,
    imageAlt: {
      en: 'Time element mapping human date to ISO-8601 datetime and wbr marking safe word wrap points',
      ar: 'وسم time يربط التاريخ بصيغة ISO-8601 ووسم wbr يحدد نقاط التفاف الكلمات الطويلة',
    },
    imageCaption: {
      en: '<time> standardizes dates for calendars and search engines; <wbr> prevents long URLs from overflowing.',
      ar: 'يوحّد <time> صيغة التواريخ لمحركات البحث، ويمنع <wbr> خروج الروابط الطويلة عن الشاشة.',
    },
    explanation: {
      overview: {
        en: 'Dates are written differently across languages and cultures ("Nov 20", "20/11/2026", or "20 نوفمبر"). The <time> tag lets you display natural wording for readers while giving browsers an exact ISO-8601 timestamp. Alongside it, <wbr> (Word Break Opportunity) tells the browser safe places to wrap long URLs or technical identifiers on narrow screens.',
        ar: 'تُكتب التواريخ بطرق مختلفة بين اللغات (مثل "20 نوفمبر" أو "20/11/2026"). يتيح وسم <time> كتابة التاريخ بصيغة طبيعية للقارئ مع تزويد المتصفح بتاريخ قياسي دقيق في سمة datetime. كما يحدد وسم <wbr> المواضع الآمنة لكسر الروابط أو الكلمات التقنية الطويلة على شاشات الهواتف.',
      },
      howItWorks: {
        en: 'Inside <time datetime="2026-11-20">, the datetime attribute uses YYYY-MM-DD (or durations like PT8M for 8 minutes). Unlike <br />, which always forces a new line, <wbr> remains invisible on wide screens and only breaks the line if the container is too narrow to fit the full word.',
        ar: 'في <time datetime="2026-11-20">، تُكتب سمة datetime بصيغة YYYY-MM-DD (أو للمدد الزمنية مثل PT8M أي 8 دقائق). وعلى عكس <br /> الذي يجبر السطر على النزول دائماً، يبقى وسم <wbr> غير مرئي على الشاشات العريضة ولا يكسر السطر إلا عند ضيق المساحة.',
      },
      keyPoints: {
        en: [
          'Use ISO-8601 format in datetime (e.g. "2026-11-20" or "14:30").',
          '<wbr> is a void tag with no closing tag and inserts no hyphen.',
          'Place <wbr> right after slashes or dots in long URLs for clean mobile wrapping.',
        ],
        ar: [
          'استخدم صيغة ISO-8601 داخل سمة datetime مثل "2026-11-20" أو "14:30".',
          'وسم <wbr> مفرد ولا يضيف شرطة (-) عند كسر الكلمة.',
          'ضع <wbr> بعد الشرطات المائلة (/) أو النقاط داخل الروابط الطويلة لتحسين العرض على الجوال.',
        ],
      },
      commonMistake: {
        en: 'Using <br /> inside a long URL instead of <wbr>, which permanently splits the link even on wide desktop monitors.',
        ar: 'استخدام <br /> وسط رابط طويل بدلاً من <wbr>، مما يقسم الرابط قسراً حتى على الشاشات الكبيرة.',
      },
    },
  },
  'html-03-01': {
    imageUrl: IMG_SEMANTIC,
    imageAlt: {
      en: 'Semantic page layout diagram highlighting header and nav landmarks at the top of a document',
      ar: 'مخطط الهيكلة الدلالية يوضح ترويسة الصفحة header وقائمة التنقل nav في أعلى المستند',
    },
    imageCaption: {
      en: 'Landmark tags map out page regions so browsers and screen readers understand page hierarchy immediately.',
      ar: 'ترسم المعالم الدلالية خريطة الصفحة ليفهم المتصفح وقارئات الشاشة أقسامها فوراً.',
    },
    explanation: {
      overview: {
        en: 'Before semantic HTML5, developers built entire layouts out of meaningless <div> boxes, making it hard for search engines and screen readers to tell a menu from a footer. <header> and <nav> solve this by explicitly naming your introductory banner and your primary navigation links.',
        ar: 'قبل HTML5، كان المطورون يبنون الصفحات بالكامل من صناديق <div> صماء لا توضح دور كل قسم. جاءت وسوم الهيكلة الدلالية مثل <header> و <nav> لتمييز الترويسة التعريفية وشريط روابط التنقل بوضوح تام.',
      },
      howItWorks: {
        en: 'A top-level <header> typically holds the site logo, title, and main <nav>. You can also place a <header> inside an <article> for that article’s own headline and author date. When a page has more than one <nav> (such as header navigation and footer navigation), adding aria-label="Primary" distinguishes them clearly.',
        ar: 'يضم وسم <header> الرئيسي عادةً شعار الموقع وعنوانه وشريط <nav>. كما يمكن استخدام <header> داخل <article> ليحمل عنوان المقال وتاريخه. وإذا احتوت الصفحة على أكثر من قائمة <nav> (في الأعلى والأسفل)، تُستخدم سمة aria-label لتمييز كل قائمة باسم واضح.',
      },
      keyPoints: {
        en: [
          'Do not wrap every minor link in <nav> — reserve <nav> for major navigation blocks.',
          'A page can have multiple <header> elements if each introduces its own <article> or <section>.',
          'Never nest a <header> inside another <header> or inside a <footer>.',
        ],
        ar: [
          'لا تضع كل رابط عابر داخل <nav> — خصصه لمجموعات التنقل الرئيسية فقط.',
          'يمكن وجود أكثر من <header> إذا كان كل منها يفتتح مقالاً أو قسماً مستقلاً.',
          'يُمنع وضع <header> داخل <header> آخر أو داخل <footer>.',
        ],
      },
      commonMistake: {
        en: 'Using <header> purely as a visual top bar when the content does not introduce a page or section.',
        ar: 'استخدام <header> لمجرد التزيين العلوي دون أن يمثل مقدمة فعلية للصفحة أو القسم.',
      },
    },
  },
  'html-03-02': {
    imageUrl: IMG_SEMANTIC,
    imageAlt: {
      en: 'Semantic page wireframe showing main content zone above footer landmark',
      ar: 'مخطط الصفحة يوضح منطقة المحتوى الرئيسي main وفوقها التذييل footer',
    },
    imageCaption: {
      en: '<main> isolates the unique core content; <footer> anchors closing metadata and links.',
      ar: 'يعزل وسم <main> المحتوى الفريد للصفحة، بينما يختم <footer> الصفحة بالروابط وحقوق النشر.',
    },
    explanation: {
      overview: {
        en: 'Every page shares repeated menus at the top and copyright notices at the bottom, surrounding one unique centerpiece. <main> marks that central unique content, while <footer> closes the page (or an individual article) with authorship, legal info, and closing links.',
        ar: 'تشترك صفحات الموقع غالباً في شريط علوي وتذييل متكررين يحيطان بمحتوى فريد في المنتصف. يحدد وسم <main> هذا المحتوى المركزي الفريد، بينما يختم وسم <footer> الصفحة أو المقال بمعلومات المؤلف وحقوق النشر والروابط الختامية.',
      },
      howItWorks: {
        en: 'Keyboard-only and blind users rely on the <main> landmark to jump straight past repetitive navigation bars directly to the article or app controls. Only one visible <main> element should exist in a document, and it should never sit inside <header>, <nav>, <aside>, or <footer>.',
        ar: 'يعتمد مستخدمو لوحة المفاتيح وقارئات الشاشة على معلم <main> للقفز مباشرة متجاوزين القوائم المتكررة نحو المحتوى الرئيسي. يجب أن يوجد عنصر <main> مرئي واحد فقط في المستند، وألا يوضع داخل <header> أو <nav> أو <aside> أو <footer>.',
      },
      keyPoints: {
        en: [
          'Keep exactly one visible <main> per document.',
          '<footer> is valid at the bottom of the page OR at the bottom of an <article>.',
          'Together, <header>, <main>, and <footer> form the core three-part skeleton of every modern page.',
        ],
        ar: [
          'احرص على وجود وسم <main> مرئي واحد فقط في الصفحة.',
          'يصح استخدام <footer> في أسفل الصفحة بالكامل أو في ختام مقال <article>.',
          'تشكل وسوم <header> و <main> و <footer> الهيكل الأساسي الثلاثي لأي صفحة حديثة.',
        ],
      },
      commonMistake: {
        en: 'Placing the entire site header and footer inside <main>, which defeats the purpose of isolating unique content.',
        ar: 'إدخال ترويسة الموقع أو تذييله المتكرر داخل وسم <main>، مما يُفقد <main> دوره في عزل المحتوى الفريد.',
      },
    },
  },
  'html-03-03': {
    imageUrl: IMG_SEMANTIC,
    imageAlt: {
      en: 'Page architecture contrasting thematic section groups with self-contained article blocks',
      ar: 'مقارنة معمارية بين أقسام الموضوعات section والمقالات المستقلة article',
    },
    imageCaption: {
      en: '<section> groups related themes; <article> wraps standalone content that makes sense anywhere.',
      ar: 'يجمع <section> موضوعاً مترابطاً، بينما يغلف <article> محتوى مستقلاً مفهوماً بمفرده.',
    },
    explanation: {
      overview: {
        en: 'Inside <main>, content naturally divides into chapters and independent entries. <section> groups a thematic slice of your page (such as "Features" or "Latest Lessons"), whereas <article> wraps a complete, self-contained unit (like a blog post, news card, or product review) that could be syndicated on its own.',
        ar: 'داخل <main> ينقسم المحتوى عادةً إلى أقسام موضوعية ووحدات مستقلة. يجمع وسم <section> جزءاً موضوعياً من الصفحة (مثل قسم المميزات أو الدروس)، بينما يحيط وسم <article> بوحدة محتوى متكاملة ومستقلة بذاتها (مثل مقال أو بطاقة منتج) يظل معناها مفهوماً حتى لو نُشرت بمفردها.',
      },
      howItWorks: {
        en: 'A helpful mental test: if you copy-pasted the block onto another website and it still made complete sense on its own, use <article>. If it is a chapter or group within a larger page and needs a heading (<h2>–<h6>), use <section>. Articles can contain sections (e.g., Introduction, Body), and sections can contain lists of articles.',
        ar: 'اختبار بسيط للتفريق بينهما: إذا كان بإمكانك نقل الجزء إلى موقع آخر وبقي مفهوماً بالكامل فهو <article>. أما إذا كان يمثل فصلاً أو قسماً ضمن صفحة أكبر ويحتاج عنواناً (<h2>–<h6>) فهو <section>. ويمكن للمقال أن يضم عدة أقسام، كما يمكن للقسم أن يضم عدة مقالات.',
      },
      keyPoints: {
        en: [
          'Every <section> should almost always include a heading tag (<h2>–<h6>).',
          'Use <article> for blog posts, forum comments, lesson cards, and standalone widgets.',
          'Do not replace <div> with <section> when you only need a CSS styling box.',
        ],
        ar: [
          'يجب أن يحتوي كل <section> غالباً على عنوان يصف موضوعه.',
          'استخدم <article> للمقالات والتعليقات وبطاقات الأخبار والدروس المستقلة.',
          'لا تستبدل <div> بـ <section> لمجرد تطبيق تنسيق CSS دون وجود موضوع دلالي.',
        ],
      },
      commonMistake: {
        en: 'Creating <section> blocks with no headings, leaving screen readers with unlabeled regions.',
        ar: 'إنشاء وسوم <section> بدون أي عناوين بداخلها، مما يجعل القسم مبهماً لقارئات الشاشة.',
      },
    },
  },
  'html-03-04': {
    imageUrl: IMG_SEMANTIC,
    imageAlt: {
      en: 'Layout grid showing main article next to tangential aside sidebar inside a div wrapper',
      ar: 'تخطيط يوضح المحتوى الرئيسي بجانب الشريط الجانبي aside داخل حاوية التخطيط div',
    },
    imageCaption: {
      en: '<aside> holds supporting side notes; <div> is reserved strictly for layout or CSS styling hooks.',
      ar: 'يحمل <aside> الملاحظات الجانبية المساندة، بينما يُترك <div> لأغراض التنسيق والتخطيط فقط.',
    },
    explanation: {
      overview: {
        en: 'Pages often include callout boxes, related links, or sidebars that complement the main topic without being essential to it — that is the role of <aside>. And when you purely need an invisible box for CSS Flexbox, Grid, or spacing with no semantic meaning, <div> is the right neutral tool.',
        ar: 'تحتوي الصفحات كثيراً على شرائط جانبية أو صناديق ملاحظات تكمّل الموضوع الأساسي دون أن تكون جزءاً من متنه الرئيسي — وهذا هو دور وسم <aside>. وعندما تحتاج فقط إلى صندوق لتطبيق تنسيق CSS أو تخطيط الشبكة دون إضافة معنى دلالي، فإن وسم <div> هو الخيار المحايد الصحيح.',
      },
      howItWorks: {
        en: 'When <aside> sits at the top level of the page, assistive tools expose it as a "Complementary" landmark. Inside an <article>, <aside> works like a sidebar note or glossary callout tied to that article. By contrast, <div> sends zero semantic signal to browsers — it exists purely as a block container for layout and styling.',
        ar: 'عند وضع <aside> في مستوى الصفحة يعرّفه المتصفح كمنطقة تكميلية (Complementary). وإذا وُضع داخل <article> فإنه يمثل ملاحظة جانبية مرتبطة بالمقال. أما <div> فلا ينقل أي معنى دلالي؛ دوره تقني بحت لتجميع العناصر وتنسيقها.',
      },
      keyPoints: {
        en: [
          'Reach for semantic tags (<header>, <nav>, <main>, <article>, <aside>) first before using <div>.',
          'Use <div> as a layout wrapper for CSS Grid/Flexbox columns.',
          'Never use <div> for clickable buttons or links — always use <button> or <a>.',
        ],
        ar: [
          'ابدأ دائماً بالوسوم الدلالية أولاً قبل اللجوء إلى <div>.',
          'استخدم <div> كحاوية لتنظيم الأعمدة عبر CSS Grid أو Flexbox.',
          'لا تستخدم <div> كزر قابل للنقر بدلاً من <button> أو <a>.',
        ],
      },
      commonMistake: {
        en: 'Overusing nested <div> elements ("div soup") where semantic landmarks belong.',
        ar: 'الإفراط في تداخل وسوم <div> في كل مكان بدلاً من استخدام المعالم الدلالية المناسبة.',
      },
    },
  },
  'html-04-01': {
    imageUrl: IMG_LINKS,
    imageAlt: {
      en: 'Hyperlink navigation and image map hotspots routing to page anchors and external URLs',
      ar: 'مخطط الروابط التشعبية ومناطق خرائط الصور المرتبطة بوجهات داخلية وخارجية',
    },
    imageCaption: {
      en: '<a> powers text/button hyperlinks; <area> maps rectangular, circular, or polygonal hotspots onto images.',
      ar: 'ينشئ <a> الروابط النصية، بينما يحدد <area> مناطق قابلة للنقر بأشكال هندسية على الصور.',
    },
    explanation: {
      overview: {
        en: 'The "HyperText" in HTML literally comes from hyperlinks. The <a> (anchor) tag connects pages across the web, jumps to sections on the same page, or triggers email and file downloads. For specialized diagrams or maps where different regions of a single image link to different targets, <area> defines each clickable hotspot.',
        ar: 'يرمز حرفا HT في HTML إلى النص التشعبي الذي تربطه الروابط ببعضها. ينشئ وسم <a> الروابط بين الصفحات أو إلى أجزاء داخل الصفحة نفسها أو لإرسال بريد أو تنزيل ملف. أما وسم <area> فيُستخدم لتحديد مناطق هندسية قابلة للنقر فوق صورة واحدة داخل خريطة صور.',
      },
      howItWorks: {
        en: 'An <a> tag needs an href attribute pointing to a URL ("https://..."), a local ID ("#section-2"), or a protocol ("mailto:..."). Opening external links in a new tab uses target="_blank" paired with rel="noopener noreferrer" for security. Inside a <map>, each <area> uses shape ("rect", "circle", or "poly"), pixel coords, href, and alt text.',
        ar: 'يعتمد وسم <a> على سمة href لتحديد الوجهة سواء كانت رابطاً خارجياً أو معرفاً داخل الصفحة (#section-2) أو بريداً (mailto:). وعند فتح رابط في تبويب جديد نضيف target="_blank" مع rel="noopener noreferrer" للحماية. أما <area> فيعمل داخل <map> ويأخذ سمة shape و coords والإحداثيات و alt.',
      },
      keyPoints: {
        en: [
          'Write descriptive link text (like "Read HTML Guide") rather than vague "Click here".',
          'An <a> without an href attribute is treated as a placeholder, not an active link.',
          'Always give every <area> an alt attribute describing its destination.',
        ],
        ar: [
          'اكتب نص رابط واضح يصف الوجهة بدلاً من عبارة عامة مثل "اضغط هنا".',
          'وسم <a> بدون سمة href لا يُعد رابطاً فعالاً ولا يمكن التركيز عليه بلوحة المفاتيح.',
          'أضف دائماً سمة alt لكل وسم <area> لوصف المنطقة التفاعلية.',
        ],
      },
      commonMistake: {
        en: 'Using target="_blank" without rel="noopener" or using <a> when a <button> should trigger an in-page JavaScript action.',
        ar: 'استخدام <a> لتنفيذ إجراء برمجي داخل الصفحة بدلاً من <button>، أو فتح تبويب جديد دون rel="noopener".',
      },
    },
  },
  'html-04-02': {
    imageUrl: IMG_LINKS,
    imageAlt: {
      en: 'Image map container pairing with img usemap and semantic search landmark wrapping filter form',
      ar: 'حاوية خريطة الصور map المرتبطة بالصورة ومعلم البحث الحديث search',
    },
    imageCaption: {
      en: '<map name="..."> binds hotspots to <img usemap="#...">; <search> creates a native search landmark.',
      ar: 'يربط <map> المناطق التفاعلية بالصورة عبر usemap، ويعرّف <search> منطقة البحث والفلترة.',
    },
    explanation: {
      overview: {
        en: 'To activate clickable <area> hotspots on an image, you wrap them in a <map> container and connect it to your <img>. Meanwhile, modern HTML5 introduced the <search> element so browsers and assistive technologies immediately recognize search bars and filter panels without extra ARIA attributes.',
        ar: 'لتفعيل مناطق النقر <area> على أي صورة، نضعها داخل حاوية <map> ونربطها بالصورة عبر السمة usemap. كما أضاف معيار HTML5 الحديث وسم <search> لتمييز صناديق البحث والتصفية تلقائياً للمتصفحات وقارئات الشاشة دون تعقيد.',
      },
      howItWorks: {
        en: 'Give <map> a unique name (for example name="quickmap") and point the image to it with usemap="#quickmap" (note the # hash symbol). For <search>, place it around your search <form> or filter inputs — it works cleanly for both global site search and in-page table filtering.',
        ar: 'امنح وسم <map> اسماً فريداً عبر name="quickmap" ثم اربط الصورة به عبر usemap="#quickmap" (لا تنسَ علامة #). أما وسم <search> فيحيط بنموذج البحث <form> أو أدوات الفلترة سواء لبحث الموقع بالكامل أو لتصفية قائمة محلية.',
      },
      keyPoints: {
        en: [
          'The # prefix is required in usemap="#name" to match <map name="name">.',
          '<search> is a semantic landmark — it does not submit forms by itself; keep <form> inside it when needed.',
          'Screen readers let users jump directly to <search> landmarks just like <nav> and <main>.',
        ],
        ar: [
          'علامة # إلزامية في usemap="#name" لمطابقة name في <map>.',
          'وسم <search> معلم دلالي وليس نموذجاً، لذا ضع <form> بداخله عند إرسال البحث.',
          'تتيح قارئات الشاشة الانتقال السريع إلى <search> تماماً مثل <nav> و <main>.',
        ],
      },
      commonMistake: {
        en: 'Forgetting the # symbol inside usemap="quickmap", which prevents the image map from activating.',
        ar: 'نسيان كتابة علامة # داخل سمة usemap، مما يعطّل ربط خريطة الصورة.',
      },
    },
  },
  'html-05-01': {
    imageUrl: IMG_LISTS,
    imageAlt: {
      en: 'List hierarchy comparing bulleted unordered list ul with numbered ordered list ol',
      ar: 'مقارنة هرمية بين القائمة غير المرتبة ul والقائمة المرقمة ol',
    },
    imageCaption: {
      en: 'Use <ul> when order is interchangeable; use <ol> when sequence or ranking matters.',
      ar: 'استخدم <ul> عندما لا يهم الترتيب، و <ol> عندما يكون التسلسل أو التصنيف مقصوداً.',
    },
    explanation: {
      overview: {
        en: 'Whenever you present grouped items — whether ingredients, navigation links, or numbered tutorial steps — HTML lists express that grouping structurally. Use <ul> (Unordered List) when items have no fixed sequence, and <ol> (Ordered List) when step order or ranking matters.',
        ar: 'كلما عرضت مجموعة عناصر مترابطة — سواء كانت مكونات أو روابط أو خطوات شرح متسلسلة — تعبّر القوائم في HTML عن هذا التجميع بوضوح. استخدم <ul> للقوائم غير المرتبة التي لا يغير ترتيبها المعنى، و <ol> عندما يكون الترتيب التسلسلي أو الترقيم مهماً.',
      },
      howItWorks: {
        en: 'By default, browsers render <ul> with bullet points and <ol> with decimal numbers (1, 2, 3...). With <ol>, HTML gives you built-in attributes: start="5" begins numbering at 5, reversed counts downward, and type="A" or type="i" switches to letters or Roman numerals without touching CSS.',
        ar: 'افتراضياً يعرض المتصفح <ul> بنقاط دائرية و <ol> بأرقام (1، 2، 3...). ومع <ol> يمكنك التحكم عبر سمات مدمجة مثل start="5" لبدء العد من 5، أو reversed للعد التنازلي، أو type لتغيير النمط إلى أحرف أو أرقام لاتينية.',
      },
      keyPoints: {
        en: [
          'Ask yourself: if I shuffle the items, does the meaning break? If yes, use <ol>; if no, use <ul>.',
          'Screen readers announce total item count (e.g., "List of 4 items") automatically.',
          'Lists can be nested inside <li> items to build multi-level outlines.',
        ],
        ar: [
          'اسأل نفسك: إذا بدّلت ترتيب العناصر هل يتغير المعنى؟ إذا نعم فاستخدم <ol>، وإلا فاستخدم <ul>.',
          'تعلن قارئات الشاشة عدد عناصر القائمة تلقائياً للمستخدم.',
          'يمكن وضع قائمة فرعية داخل عنصر <li> لإنشاء قوائم متداخلة.',
        ],
      },
      commonMistake: {
        en: 'Placing headings, paragraphs, or plain text directly inside <ul> or <ol> without wrapping them in <li>.',
        ar: 'وضع فقرات أو نصوص مباشرة داخل <ul> أو <ol> دون تغليفها داخل وسم <li>.',
      },
    },
  },
  'html-05-02': {
    imageUrl: IMG_LISTS,
    imageAlt: {
      en: 'List item li nested inside ul, ol, and interactive toolbar menu containers',
      ar: 'عنصر القائمة li داخل حاويات ul و ol وقائمة الأوامر التفاعلية menu',
    },
    imageCaption: {
      en: 'Every list entry uses <li>; <menu> serves as a semantic toolbar list for action buttons.',
      ar: 'يمثل <li> كل عنصر داخل القائمة، بينما يعمل <menu> كقائمة دلالية لأزرار الأوامر.',
    },
    explanation: {
      overview: {
        en: 'Inside every <ul>, <ol>, or <menu>, individual entries are represented by <li> (List Item). While <ul> handles general bullets, HTML5 defines <menu> specifically as a semantic unordered list for toolbars of interactive commands and buttons.',
        ar: 'داخل كل قائمة <ul> أو <ol> أو <menu>، يُمثَّل كل عنصر مفرد بوسم <li>. وبينما تُستخدم <ul> للقوائم العامة، خصص معيار HTML5 وسم <menu> كقائمة دلالية لتجميع أزرار الأوامر وأشرطة الأدوات التفاعلية.',
      },
      howItWorks: {
        en: 'An <li> element can hold plain text, links, buttons, or even another nested list. When placed inside an <ol>, you can override a single item’s number using <li value="10"> and subsequent items will continue counting from 10. Inside <menu>, wrapping toolbar buttons inside <li> keeps interactive controls cleanly structured.',
        ar: 'يمكن أن يحتوي <li> على نص أو رابط أو زر أو قائمة فرعية كاملة. وعند وجوده داخل <ol>، تستطيع فرض رقم معين لأحد العناصر بسمة value="10" فيكمل الترقيم بعده تلقائياً. أما <menu> فيجمع أزرار الإجراءات (مثل حفظ وتصدير) داخل عناصر <li> منظمة.',
      },
      keyPoints: {
        en: [
          '<li> must always be a direct child of <ul>, <ol>, or <menu>.',
          'Use <menu> for lists of interactive action buttons rather than static reading text.',
          'Nest sub-lists inside the parent <li>, not directly between two <li> tags.',
        ],
        ar: [
          'يجب أن يكون <li> ابناً مباشراً لـ <ul> أو <ol> أو <menu> فقط.',
          'استخدم <menu> لقوائم أزرار الأوامر التفاعلية بدلاً من النصوص الثابتة.',
          'عند إنشاء قائمة فرعية، ضعها داخل وسم <li> الأب وليس خارجه.',
        ],
      },
      commonMistake: {
        en: 'Placing a nested <ul> between two <li> items instead of placing it inside the preceding <li>.',
        ar: 'كتابة قائمة <ul> فرعية بين عنصري <li> بدلاً من وضعها داخل وسم <li> الذي تتبعه.',
      },
    },
  },
  'html-06-01': {
    imageUrl: IMG_VECTORS,
    imageAlt: {
      en: 'Responsive picture selection diagram choosing source media queries with img fallback',
      ar: 'مخطط اختيار الصورة المتجاوبة عبر picture و source مع صورة img الاحتياطية',
    },
    imageCaption: {
      en: '<picture> evaluates <source> rules top-to-bottom and falls back to the required <img>.',
      ar: 'يفحص <picture> شروط <source> من الأعلى للأسفل ويعتمد على <img> كصورة أساسية واحتياطية.',
    },
    explanation: {
      overview: {
        en: 'Images communicate ideas instantly on the web. The <img> void tag embeds an image file, while <picture> acts as a smart wrapper that lets the browser pick the best crop or modern format (such as WebP or AVIF) depending on the visitor’s screen width or capabilities.',
        ar: 'تنقل الصور الفكرة بسرعة للمستخدم. يدرج وسم <img> المفرد ملف صورة داخل الصفحة، بينما يعمل وسم <picture> كغلاف ذكي يتيح للمتصفح اختيار النسخة الأنسب (من حيث المقاس أو الصيغة الحديثة مثل WebP) حسب عرض شاشة الزائر.',
      },
      howItWorks: {
        en: 'For <img>, always specify src, meaningful alt text, and width/height attributes so the browser reserves space before downloading (preventing layout jump). Inside <picture>, list one or more <source> tags with media or type attributes, followed by one mandatory <img> tag at the end.',
        ar: 'في وسم <img>، حدد دائماً src و alt والسمتين width و height ليحجز المتصفح مساحة الصورة قبل التحميل دون اهتزاز الصفحة. وداخل <picture>، تضع وسوم <source> بشروط الشاشة أو الصيغة، وتضع دائماً وسم <img> واحداً في النهاية ليعرضه المتصفح أو يقرأ منه نص alt.',
      },
      keyPoints: {
        en: [
          'Always provide descriptive alt text; use alt="" (empty string) only for purely decorative images.',
          'Use loading="lazy" on off-screen images below the fold to speed up initial page load.',
          '<picture> will not render anything without a child <img> element.',
        ],
        ar: [
          'اكتب نص alt يصف محتوى الصورة بوضوح، واجعله فارغاً alt="" فقط للزخارف البحتة.',
          'أضف loading="lazy" للصور الموجودة أسفل الصفحة لتسريع التحميل الأولي.',
          'لا يعرض وسم <picture> أي صورة ما لم يحتوِ على وسم <img> بداخله.',
        ],
      },
      commonMistake: {
        en: 'Omitting the alt attribute on <img> or forgetting the fallback <img> inside <picture>.',
        ar: 'إهمال سمة alt في وسم <img> أو نسيان وضع وسم <img> الاحتياطي داخل <picture>.',
      },
    },
  },
  'html-06-02': {
    imageUrl: IMG_VECTORS,
    imageAlt: {
      en: 'Media source selection and figure container diagram',
      ar: 'مخطط مصادر الوسائط source وحاوية الشكل التوضيحي figure',
    },
    imageCaption: {
      en: '<source> supplies format choices; <figure> groups self-contained visual content.',
      ar: 'يوفر <source> خيارات صيغ الملفات، ويجمع <figure> الأشكال والرسوم المستقلة.',
    },
    explanation: {
      overview: {
        en: 'Different browsers and devices support different media formats and screen sizes. The <source> void tag lets <picture>, <audio>, and <video> offer multiple file options so the browser picks the first compatible one. Meanwhile, <figure> groups self-contained visual items like photos, charts, or code blocks referenced in your article.',
        ar: 'تدعم المتصفحات والأجهزة صيغ ملفات وأحجاماً مختلفة. يتيح وسم <source> المفرد تقديم عدة بدائل داخل <picture> أو <audio> أو <video> ليختار المتصفح أول ملف متوافق. بينما يجمع وسم <figure> الرسوم أو الصور أو الأكواد المستقلة المرتبطة بشرح الدرس.',
      },
      howItWorks: {
        en: 'Inside <audio> and <video>, <source> uses src and type (such as type="video/mp4"). Inside <picture>, <source> uses srcset, media, and type. Wrapping your diagram or photo inside <figure> tells readers and search engines that the visual unit stands together with its caption.',
        ar: 'داخل <audio> و <video> يستخدم <source> السمتين src و type. أما داخل <picture> فيستخدم srcset و media و type. وعند تغليف الصورة أو الرسم داخل <figure>، يتعامل المتصفح معه كوحدة توضيحية متكاملة مستقلة عن تدفق النص.',
      },
      keyPoints: {
        en: [
          '<source> is a void tag and renders nothing on its own outside a media/picture parent.',
          'Always specify the MIME type attribute so the browser skips unsupported formats without downloading them.',
          '<figure> can wrap images, SVG diagrams, tables, or code listings.',
        ],
        ar: [
          'وسم <source> مفرد ولا يعرض شيئاً بمفرده خارج حاوية وسائط أو صورة.',
          'حدد سمة type دائماً ليتجاهل المتصفح الصيغ غير المدعومة قبل تحميلها.',
          'يمكن لوسم <figure> احتواء صورة أو رسم SVG أو جدول أو مثال كود.',
        ],
      },
      commonMistake: {
        en: 'Using src="..." instead of srcset="..." on a <source> element inside <picture>.',
        ar: 'كتابة src بدلاً من srcset في وسم <source> عند استخدامه داخل <picture>.',
      },
    },
  },
  'html-06-03': {
    imageUrl: IMG_VECTORS,
    imageAlt: {
      en: 'Figure caption paired with inline scalable vector graphics svg coordinate box',
      ar: 'تعليق الشكل التوضيحي figcaption مقترناً بلوحة الرسم المتجه svg',
    },
    imageCaption: {
      en: '<figcaption> labels its parent <figure>; <svg> draws crisp scalable shapes directly in HTML.',
      ar: 'يصف <figcaption> محتوى <figure>، بينما يرسم <svg> أشكالاً متجهة واضحة في أي مقياس.',
    },
    explanation: {
      overview: {
        en: 'A diagram is far clearer when paired with a concise label — that is why <figcaption> exists inside <figure>. And unlike pixel-based PNG or JPEG files that blur when zoomed in, <svg> (Scalable Vector Graphics) lets you draw crisp icons, diagrams, and charts directly with HTML markup.',
        ar: 'تزداد وضوح الرسوم والصور عند إرفاق تعليق توضيحي معها عبر وسم <figcaption> داخل <figure>. وبخلاف الصور النقطية (PNG/JPEG) التي تتشوش عند التكبير، يتيح وسم <svg> رسم الأيقونات والمخططات الهندسية بدقة فائقة لا تتأثر بالتكبير مباشرة داخل HTML.',
      },
      howItWorks: {
        en: 'Place <figcaption> as either the first or last child inside <figure>. For inline <svg>, define width, height, and viewBox="0 0 160 90" to establish an internal coordinate grid. Inside <svg>, geometric tags like <rect>, <circle>, <line>, and <path> render sharp lines at any resolution.',
        ar: 'يوضع وسم <figcaption> كأول أو آخر عنصر داخل <figure>. وفي <svg>، تحدد width و height و viewBox لضبط نظام الإحداثيات الداخلي، وبداخله تُرسم الأشكال مثل <rect> و <circle> و <line> بحدّة تامة على كل الشاشات.',
      },
      keyPoints: {
        en: [
          'Only one <figcaption> should appear inside a single <figure>.',
          'Add aria-label or role="img" on meaningful inline <svg> graphics for screen readers.',
          'Because inline <svg> lives in the DOM, its colors and strokes can be styled dynamically.',
        ],
        ar: [
          'يُوضع وسم <figcaption> واحد فقط داخل كل <figure>.',
          'أضف aria-label على رسوم <svg> التوضيحية لتوضيح معناها لقارئات الشاشة.',
          'وجود <svg> مباشرة داخل HTML يتيح تلوينه وتحريكه بسهولة عبر CSS و JavaScript.',
        ],
      },
      commonMistake: {
        en: 'Placing <figcaption> outside <figure> or omitting viewBox on a responsive <svg>.',
        ar: 'وضع <figcaption> خارج <figure> أو نسيان سمة viewBox في رسوم <svg> المتجاوبة.',
      },
    },
  },
  'html-07-01': {
    imageUrl: IMG_AUDIO_VIDEO,
    imageAlt: {
      en: 'Native HTML5 video and audio players with playback controls and fallback sources',
      ar: 'مشغلات الفيديو والصوت المدمجة في HTML5 مع أزرار التحكم ومصادر التشغيل',
    },
    imageCaption: {
      en: '<video> and <audio> provide native browser playback without third-party plugins.',
      ar: 'يوفر <video> و <audio> تشغيلاً مدمجاً للوسائط في المتصفح دون الحاجة لإضافات خارجية.',
    },
    explanation: {
      overview: {
        en: 'Modern HTML5 renders video and audio natively right inside the browser — no plugins required. With <video> and <audio>, you get accessible play/pause buttons, timeline scrubbing, volume control, and fullscreen playback out of the box.',
        ar: 'تدعم HTML5 تشغيل الفيديو والصوت أصلياً داخل المتصفح دون أي برامج مساعدة خارجية. يمنحك وسما <video> و <audio> أزرار التشغيل والإيقاف وشريط التقدم والتحكم بالصوت بشكل جاهز ومتاح للجميع.',
      },
      howItWorks: {
        en: 'Always include the controls attribute unless you are building a custom JavaScript player, otherwise users have no UI to press Play. Add preload="metadata" so the browser loads duration and dimensions without wasting bandwidth downloading the whole file upfront. Browsers also require muted whenever autoplay is used.',
        ar: 'أضف دائماً سمة controls لتظهر أزرار التحكم للمستخدم. وتساعد سمة preload="metadata" في تحميل معلومات المدة والأبعاد دون استهلاك الإنترنت بتنزيل كامل الملف مسبقاً. كما تشترط المتصفحات الحديثة وجود muted مع autoplay لتجنب الإزعاج الصوتي التلقائي.',
      },
      keyPoints: {
        en: [
          'Text placed inside <video>...</video> acts as fallback if a very old browser cannot play it.',
          'Use poster="thumb.jpg" on <video> to show a preview frame before playback begins.',
          'Include <source> elements inside <video> or <audio> to support multiple codecs like MP4 and WebM.',
        ],
        ar: [
          'النص المكتوب بين <video> و </video> لا يظهر إلا إذا تعذّر على المتصفح تشغيل الفيديو.',
          'استخدم سمة poster لعرض صورة غلاف جذابة قبل بدء تشغيل الفيديو.',
          'يفضل وضع عناصر <source> بالداخل لتوفير صيغ متعددة مثل MP4 و WebM.',
        ],
      },
      commonMistake: {
        en: 'Forgetting the controls attribute, leaving an invisible or unplayable audio/video box on the page.',
        ar: 'نسيان كتابة سمة controls، مما يجعل مشغل الصوت غير مرئي أو الفيديو غير قابل للتشغيل من المستخدم.',
      },
    },
  },
  'html-07-02': {
    imageUrl: IMG_AUDIO_VIDEO,
    imageAlt: {
      en: 'Video timed WebVTT subtitle track architecture alongside 2D canvas drawing grid',
      ar: 'بنية مسارات الترجمة الزمنية WebVTT في track ولوحة الرسم النقطية canvas',
    },
    imageCaption: {
      en: '<track> synchronizes WebVTT subtitles and captions; <canvas> provides a pixel-level drawing surface.',
      ar: 'يزامن <track> ملفات الترجمة والشرح النصي، بينما يوفر <canvas> سطح رسم بالبكسل للأكواد.',
    },
    explanation: {
      overview: {
        en: 'Video content must be accessible across languages and for deaf or muted viewers — <track> attaches synchronized WebVTT (.vtt) subtitle and caption files directly to <video> or <audio>. Meanwhile, <canvas> creates a blank pixel-based drawing board that JavaScript uses to paint interactive charts, image editors, or 2D/3D games.',
        ar: 'لإتاحة الفيديوهات لجميع اللغات ولمن يشاهدون بدون صوت أو من ذوي الإعاقة السمعية، يربط وسم <track> ملفات ترجمة متزامنة بصيغة WebVTT مع مشغل الفيديو أو الصوت. أما وسم <canvas> فينشئ لوحة رسم نقطية فارغة ترسم عليها JavaScript الرسوم البيانية أو محررات الصور أو الألعاب.',
      },
      howItWorks: {
        en: 'Inside <video>, each <track> specifies kind ("subtitles" for translations or "captions" including sound effects), src pointing to a .vtt file, srclang ("ar", "en"), and a readable label. For <canvas>, set width and height as HTML attributes (not CSS) so pixel coordinates match the drawing resolution without stretching.',
        ar: 'داخل <video>، يحدد وسم <track> نوع المسار عبر kind (مثل subtitles للترجمة أو captions للوصف الكامل)، ورابط ملف .vtt، ولغة الترجمة srclang، واسمها label. وفي <canvas>، اضبط width و height كسمات HTML وليس عبر CSS فقط حتى لا يتمدد الرسم أو يتشوه.',
      },
      keyPoints: {
        en: [
          'Use the default boolean attribute on the primary <track> you want enabled automatically.',
          '<track> is a void tag and lives inside <video> or <audio>.',
          'Put descriptive fallback text inside <canvas>...</canvas> for assistive tools.',
        ],
        ar: [
          'أضف سمة default لمسار الترجمة الذي تريد تفعيله تلقائياً.',
          'وسم <track> مفرد ويُكتب داخل <video> أو <audio> بعد وسوم <source>.',
          'اكتب نصاً توضيحياً داخل <canvas>...</canvas> ليكون بديلاً لقارئات الشاشة.',
        ],
      },
      commonMistake: {
        en: 'Resizing <canvas> solely with CSS width/height without setting the HTML width/height attributes, causing blurry graphics.',
        ar: 'تكبير <canvas> عبر CSS فقط دون ضبط سمتي width و height في HTML، مما يسبب ضبابية الرسم.',
      },
    },
  },
  'html-08-01': {
    imageUrl: IMG_MEDIA_TABLES,
    imageAlt: {
      en: 'Data table anatomy diagram highlighting table container and top caption element',
      ar: 'مخطط بنية الجدول يوضح الحاوية table وعنوان الجدول caption في المقدمة',
    },
    imageCaption: {
      en: 'Use <table> strictly for true tabular data and start it with a clear <caption>.',
      ar: 'استخدم <table> للبيانات الجدولية الحقيقية فقط، وابدأه دائماً بعنوان وصفي <caption>.',
    },
    explanation: {
      overview: {
        en: 'Tables exist to organize two-dimensional data — schedules, comparison matrices, price lists, and grade sheets — where rows and columns intersect meaningfully. The <table> element creates the grid container, and <caption> gives the table an accessible title.',
        ar: 'وُجدت الجداول لتنظيم البيانات ثنائية الأبعاد — مثل الجداول الدراسية ومقارنات الأسعار وسجلات الدرجات — حيث يتقاطع الصف مع العمود لإعطاء معلومة واضحة. ينشئ وسم <table> هذا الإطار، ويمنحه <caption> عنواناً تعريفياً واضحاً.',
      },
      howItWorks: {
        en: 'By HTML5 rules, <caption> must be the very first child inside <table>. Unlike an external <h2> heading placed above a table, <caption> stays bound to the table inside the DOM so screen readers announce the table title automatically before reading any cells. Borders and padding should be styled with CSS rather than legacy HTML4 attributes like border="1".',
        ar: 'بحسب مواصفات HTML5، يجب أن يكون <caption> أول عنصر مباشرة داخل <table>. وبخلاف وضع عنوان <h2> منفصل فوق الجدول، يرتبط <caption> برمجياً بالجدول فتقرؤه قارئات الشاشة تلقائياً عند الوصول للجدول. ويفضل تنسيق الحدود والمسافات عبر CSS بدلاً من سمات HTML4 القديمة.',
      },
      keyPoints: {
        en: [
          'Never use <table> to build page layouts — use CSS Grid or Flexbox for layouts.',
          'Place <caption> immediately after the opening <table> tag.',
          'Style table borders cleanly using CSS border-collapse: collapse.',
        ],
        ar: [
          'لا تستخدم <table> لتصميم تخطيط الصفحات — استخدم CSS Grid أو Flexbox.',
          'ضع وسم <caption> مباشرة بعد فتح وسم <table>.',
          'نسّق حدود الجدول ومسافاته باستخدام CSS مثل border-collapse: collapse.',
        ],
      },
      commonMistake: {
        en: 'Placing <caption> after <tr> rows or relying on deprecated HTML4 attributes like cellpadding instead of CSS.',
        ar: 'وضع <caption> بعد الصفوف أو الاعتماد على سمات قديمة مثل cellpadding بدلاً من CSS.',
      },
    },
  },
  'html-08-02': {
    imageUrl: IMG_MEDIA_TABLES,
    imageAlt: {
      en: 'Table row tr holding column and row header cells th with scope attributes',
      ar: 'صف الجدول tr يضم خلايا العناوين th مع سمة النطاق scope',
    },
    imageCaption: {
      en: '<tr> creates horizontal rows; <th scope="col|row"> identifies column and row headings.',
      ar: 'ينشئ <tr> الصفوف الأفقية، بينما يحدد <th scope="col|row"> عناوين الأعمدة والصفوف.',
    },
    explanation: {
      overview: {
        en: 'Every table is built row by row from top to bottom. The <tr> (Table Row) tag creates each horizontal row, while <th> (Table Header) marks cells that label an entire column or row.',
        ar: 'يُبنى الجدول صفاً تلو الآخر من الأعلى للأسفل. ينشئ وسم <tr> كل صف أفقي، بينما يحدد وسم <th> الخلايا التي تعمل كعناوين لعمود كامل أو صف كامل.',
      },
      howItWorks: {
        en: 'Browsers bold and center <th> text by default, but the real power is semantic: adding scope="col" tells assistive software this header describes the column below it, whereas scope="row" means it labels the cells across that horizontal row. Every <th> or <td> cell must live inside a <tr>.',
        ar: 'تُظهر المتصفحات نص <th> بخط عريض افتراضياً، لكن الأهم هو المعنى الدلالي: إضافة scope="col" تعني أن الخلية عنوان للعمود، و scope="row" تعني أنها عنوان للصف الأفقي. وكل خلية <th> أو <td> يجب أن تكون داخل صف <tr>.',
      },
      keyPoints: {
        en: [
          'Keep the number of cells consistent across rows (accounting for any colspan/rowspan).',
          'Use scope="col" on top column headers and scope="row" on leading row labels.',
          'Never place text directly inside <tr> — always wrap content in <th> or <td>.',
        ],
        ar: [
          'حافظ على تساوي عدد الخلايا في جميع الصفوف.',
          'استخدم scope="col" لعناوين الأعمدة و scope="row" لعناوين الصفوف.',
          'لا تكتب نصاً مباشرة داخل <tr> بدون وضعه داخل <th> أو <td>.',
        ],
      },
      commonMistake: {
        en: 'Using bold <td><b>Title</b></td> instead of <th>, losing the semantic connection between header and data.',
        ar: 'استخدام <td> مع خط عريض بدلاً من <th>، مما يفقد الرابط الدلالي بين العنوان والبيانات.',
      },
    },
  },
  'html-08-03': {
    imageUrl: IMG_MEDIA_TABLES,
    imageAlt: {
      en: 'Table thead section separating header rows from td data cells',
      ar: 'قسم رأس الجدول thead يفصل صفوف العناوين عن خلايا البيانات td',
    },
    imageCaption: {
      en: '<thead> wraps column header rows; <td> holds individual data values and supports cell merging.',
      ar: 'يجمع <thead> صفوف الترويسة، وتحفظ <td> قيم البيانات مع دعم دمج الخلايا.',
    },
    explanation: {
      overview: {
        en: 'While <th> labels columns, the actual records live inside <td> (Table Data) cells. To keep large tables organized, <thead> groups the header row(s) cleanly apart from the data rows.',
        ar: 'بينما يعرّف <th> العناوين، تُحفظ القيم والبيانات الفعلية داخل خلايا <td>. ولتنظيم الجداول الكبيرة، يجمع وسم <thead> صفوف الترويسة في قسم مستقل عن صفوف البيانات.',
      },
      howItWorks: {
        en: 'Separating headers into <thead> allows browsers to repeat table headings on every printed page and makes sticky scrolling headers trivial with CSS. Inside a row, a <td> cell can span multiple columns with colspan="2" or multiple rows with rowspan="2" for complex schedules.',
        ar: 'فصل العناوين داخل <thead> يمكّن المتصفح من تكرار الترويسة عند الطباعة ويسهّل تثبيتها أثناء التمرير. كما يمكن لخلية <td> الامتداد عبر عدة أعمدة بـ colspan أو عدة صفوف بـ rowspan.',
      },
      keyPoints: {
        en: [
          '<thead> typically contains one or more <tr> rows filled with <th> cells.',
          'When using colspan="2" in a row, omit the extra <td> that it replaces.',
          'Keep <thead> above <tbody> in document order.',
        ],
        ar: [
          'يحتوي <thead> عادةً على صف <tr> أو أكثر مملوء بخلايا <th>.',
          'عند استخدام colspan="2" في صف، احذف الخلية الزائدة التي تم دمجها.',
          'ضع قسم <thead> دائماً قبل قسم <tbody>.',
        ],
      },
      commonMistake: {
        en: 'Adding colspan="2" without removing the second cell in that row, causing cells to spill out of alignment.',
        ar: 'إضافة colspan="2" دون تقليص عدد الخلايا في نفس الصف، مما يدفع الخلية الأخيرة خارج حدود الجدول.',
      },
    },
  },
  'html-08-04': {
    imageUrl: IMG_MEDIA_TABLES,
    imageAlt: {
      en: 'Full semantic table segmentation showing thead, tbody records, and tfoot summary row',
      ar: 'التقسيم الكامل للجدول بين الرأس thead وجسم البيانات tbody والتذييل tfoot',
    },
    imageCaption: {
      en: '<tbody> isolates data rows while <tfoot> summarizes column totals cleanly.',
      ar: 'يحتضن <tbody> صفوف السجلات، بينما يعرض <tfoot> المجاميع والنتائج الختامية.',
    },
    explanation: {
      overview: {
        en: 'Just as a document has <header>, <main>, and <footer>, a well-structured table divides into <thead>, <tbody>, and <tfoot>. Wrapping main records in <tbody> and summary totals in <tfoot> separates raw entries from calculated conclusions.',
        ar: 'تماماً كما ينقسم المستند إلى ترويسة ومحتوى وتذييل، ينقسم الجدول المنظم إلى <thead> و <tbody> و <tfoot>. يجمع <tbody> صفوف البيانات الأساسية، بينما يعرض <tfoot> صفوف الخلاصة والمجاميع النهائية.',
      },
      howItWorks: {
        en: 'A single table can even have multiple <tbody> groups to separate logical categories (like January vs. February transactions) while sharing the same <thead> and <tfoot>. Screen readers and print engines also recognize <tfoot> as the table’s summary footer.',
        ar: 'يمكن للجدول الواحد أن يضم أكثر من قسم <tbody> لتجميع فئات مختلفة من السجلات تحت نفس العناوين، مع بقاء <tfoot> مخصصاً للخلاصة والمجاميع في الأسفل.',
      },
      keyPoints: {
        en: [
          'Use <tbody> whenever a table also uses <thead> or <tfoot>.',
          '<tfoot> is ideal for Totals, Averages, or Summary rows.',
          'Even if omitted, browsers implicitly insert a <tbody> in the DOM — writing it explicitly keeps your markup predictable.',
        ],
        ar: [
          'استخدم <tbody> دائماً عندما يحتوي الجدول على <thead> أو <tfoot>.',
          'يُعد <tfoot> المكان المثالي لصفوف المجموع أو المتوسط العام.',
          'كتابة <tbody> صراحةً تجعل الكود أوضح وأسهل في التنسيق عبر CSS.',
        ],
      },
      commonMistake: {
        en: 'Mixing regular data rows directly inside <tfoot> instead of keeping only summary rows there.',
        ar: 'وضع صفوف بيانات عادية داخل <tfoot> بدلاً من قصره على صفوف المجاميع والملخصات.',
      },
    },
  },
  'html-08-05': {
    imageUrl: IMG_MEDIA_TABLES,
    imageAlt: {
      en: 'Table colgroup and col structure targeting vertical columns across rows',
      ar: 'مجموعة الأعمدة colgroup ووسم col لاستهداف الأعمدة عمودياً عبر الصفوف',
    },
    imageCaption: {
      en: '<colgroup> and <col> let you target entire vertical columns in one place without repeating classes on every cell.',
      ar: 'يتيح <colgroup> و <col> تنسيق أو تعريف أعمدة كاملة عمودياً دون تكرار الكلاسات على كل خلية.',
    },
    explanation: {
      overview: {
        en: 'HTML tables are written row by row, which makes styling an entire vertical column tedious if you have to add a class to every single <td>. The <colgroup> and <col> elements solve this by letting you define or style columns vertically from one central spot.',
        ar: 'تُكتب جداول HTML صفاً بعد صف، لذا يصبح تنسيق عمود كامل عمودياً مرهقاً إذا اضطررت لإضافة تنسيق على كل خلية <td>. يحل وسما <colgroup> و <col> هذه المشكلة بتعريف الأعمدة عمودياً من مكان واحد في أعلى الجدول.',
      },
      howItWorks: {
        en: 'Place <colgroup> right after <caption> and before <thead>. Inside it, each void <col /> element corresponds in order to a vertical column from left to right (or right to left in RTL). Using span="2" lets a single <col> cover two adjacent columns at once.',
        ar: 'يوضع <colgroup> بعد <caption> مباشرة وقبل <thead>. وبداخله يقابل كل وسم <col /> مفرد عموداً بالترتيب، ويمكن استخدام span="2" لتغطية عمودين متجاورين بوسم واحد.',
      },
      keyPoints: {
        en: [
          '<col> only accepts a focused set of CSS properties: width, background, border, and visibility.',
          'Place <colgroup> after <caption> and before <thead> / <tbody>.',
          'Use span on <col> (not colspan) to group multiple columns.',
        ],
        ar: [
          'يدعم <col> مجموعة محددة من خصائص CSS مثل العرض width والخلفية background والحدود.',
          'يجب وضع <colgroup> بعد <caption> وقبل <thead> أو <tbody>.',
          'يستخدم <col> سمة span وليس colspan لتغطية عدة أعمدة.',
        ],
      },
      commonMistake: {
        en: 'Writing text-align or color on <col> and wondering why it does not apply — CSS limits <col> to background, width, border, and visibility.',
        ar: 'محاولة تغيير لون النص أو محاذاته من خلال <col>؛ فمعيار CSS يقصر تأثير <col> على العرض والخلفية والحدود والرؤية.',
      },
    },
  },
  'html-09-01': {
    imageUrl: IMG_FORMS,
    imageAlt: {
      en: 'HTML5 form container enclosing input fields with native validation attributes',
      ar: 'حاوية النموذج form تضم حقول الإدخال input مع سمات التحقق المدمجة',
    },
    imageCaption: {
      en: '<form> coordinates submission; <input> adapts to text, email, password, number, date, and more.',
      ar: 'يدير <form> إرسال البيانات، ويتحول <input> لأكثر من عشرين نوعاً من حقول الإدخال.',
    },
    explanation: {
      overview: {
        en: 'Forms turn static webpages into interactive applications where users log in, search, or submit orders. The <form> tag wraps your controls and defines where and how data is sent, while <input> is the versatile workhorse creating text boxes, email fields, numbers, checkboxes, and radio buttons.',
        ar: 'تحوّل النماذج الصفحات الثابتة إلى تطبيقات تفاعلية لتسجيل الدخول والبحث وإرسال الطلبات. يحيط وسم <form> بالحقول ويحدد وجهة وطريقة الإرسال، بينما يتشكل وسم <input> المفرد ليصبح حقل نص أو بريد أو رقم أو مربع اختيار.',
      },
      howItWorks: {
        en: 'Set method="get" on <form> for search queries (values appear in the URL) and method="post" for private data like logins or signups. On <input>, changing type ("email", "number", "password", "date") automatically changes both the mobile keyboard and built-in HTML5 validation rules when combined with required.',
        ar: 'استخدم method="get" لعمليات البحث حيث تظهر القيم في الرابط، و method="post" للبيانات الحساسة مثل تسجيل الدخول. وفي وسم <input>، يغير نوع type (مثل email أو number أو password) شكل لوحة مفاتيح الجوال وقواعد التحقق التلقائي عند إضافة سمة required.',
      },
      keyPoints: {
        en: [
          'Every <input> must have a name attribute if you want its value included when the form submits.',
          'Never use placeholder as a replacement for a real <label>.',
          'Built-in attributes like required, min, max, and minlength validate input before JavaScript even runs.',
        ],
        ar: [
          'يجب أن يمتلك كل <input> سمة name ليُرسل اسمه وقيمته مع النموذج.',
          'لا تعتمد على placeholder كبديل دائم عن وسم <label>.',
          'توفر سمات required و min و max تحققاً مدمجاً سريعاً من المدخلات.',
        ],
      },
      commonMistake: {
        en: 'Nesting one <form> inside another <form>, which is invalid in HTML and breaks submission.',
        ar: 'وضع وسم <form> داخل وسم <form> آخر، وهو غير مسموح في HTML ويعطّل الإرسال.',
      },
    },
  },
  'html-09-02': {
    imageUrl: IMG_FORMS,
    imageAlt: {
      en: 'Label element linked via for attribute to multiline textarea control',
      ar: 'وسم التسمية label مرتبطاً عبر سمة for بمربع النص متعدد الأسطر textarea',
    },
    imageCaption: {
      en: 'Matching <label for="id"> to <textarea id="id"> improves click targets and accessibility.',
      ar: 'تطابق for مع id يربط التسمية بمربع النص لتحسين النقر وإتاحة الوصول.',
    },
    explanation: {
      overview: {
        en: 'An unlabeled input field leaves screen reader users guessing what to type, and tiny checkboxes are hard to tap on mobile. The <label> element binds a clear caption directly to its control. For multi-paragraph feedback, bios, or comments, <textarea> replaces single-line <input> with a resizable multi-line box.',
        ar: 'الحقل بدون تسمية يترك مستخدمي قارئات الشاشة في حيرة، كما يصعب لمس الحقول الصغيرة على الهاتف. يربط وسم <label> عنواناً واضحاً بالحقل مباشرة. وللنصوص الطويلة مثل الملاحظات والتعليقات، نستخدم <textarea> متعدد الأسطر بدلاً من <input>.',
      },
      howItWorks: {
        en: 'Give your control an id (like id="notes") and set for="notes" on its <label>. Now clicking or tapping anywhere on the label text focuses the field automatically. Unlike <input>, <textarea> has an opening and closing tag — any default text goes between <textarea> and </textarea>, not in a value attribute.',
        ar: 'امنح الحقل معرفاً مثل id="notes" وضع نفس القيمة في for="notes" على وسم <label>. عندئذ يؤدي النقر على نص التسمية إلى وضع المؤشر داخل الحقل تلقائياً. وبخلاف <input>، يمتلك <textarea> وسم فتح وإغلاق ويُكتب النص الافتراضي بينهما.',
      },
      keyPoints: {
        en: [
          'Match label[for] to the target input’s id — or wrap the input directly inside <label>.',
          'Use rows and cols on <textarea> to suggest its initial visible height and width.',
          'Add maxlength to limit character count cleanly.',
        ],
        ar: [
          'طابق قيمة for في <label> مع id الخاص بالحقل (أو ضع الحقل داخل <label>).',
          'حدد rows و cols على <textarea> لضبط حجمه الأولي.',
          'تساعد سمة maxlength في تحديد الحد الأقصى لعدد الأحرف.',
        ],
      },
      commonMistake: {
        en: 'Writing <textarea value="Hello" /> — <textarea> is not a void tag and ignores the value attribute in HTML.',
        ar: 'كتابة سمة value داخل <textarea> — فهو ليس وسماً مفرداً بل يوضع نصه الافتراضي بين وسمي الفتح والإغلاق.',
      },
    },
  },
  'html-09-03': {
    imageUrl: IMG_FORMS,
    imageAlt: {
      en: 'Interactive button element types alongside select dropdown menu control',
      ar: 'أنواع الأزرار التفاعلية في button والقائمة المنسدلة select',
    },
    imageCaption: {
      en: 'Always specify type on <button>; use <select> for fixed single or multi-choice dropdowns.',
      ar: 'حدد نوع الزر type دائماً في <button>، واستخدم <select> لقوائم الاختيار المنسدلة.',
    },
    explanation: {
      overview: {
        en: 'Forms need clear triggers to submit or run actions, and compact menus when space is tight. <button> creates rich interactive buttons that can hold text or icons, while <select> builds a native accessible dropdown menu.',
        ar: 'تحتاج النماذج إلى أزرار واضحة لإرسال البيانات أو تنفيذ الأوامر، وإلى قوائم مدمجة عندما تكثر الخيارات. ينشئ <button> أزراراً مرنة تقبل النصوص والأيقونات، بينما ينشئ <select> قائمة منسدلة قياسية يسهل استخدامها بلوحة المفاتيح.',
      },
      howItWorks: {
        en: 'A vital HTML rule: inside a <form>, a <button> without a type attribute defaults to type="submit", meaning clicking it reloads or submits the entire form! Always explicitly write type="submit", type="button" (for JS-only actions), or type="reset". Meanwhile, <select> pairs with <label for="..."> and contains <option> choices.',
        ar: 'قاعدة مهمة: داخل النموذج <form>، يتحول أي <button> بدون سمة type تلقائياً إلى زر إرسال (submit). لذا اكتب دائماً type="button" للأزرار العادية، أو type="submit" للإرسال، أو type="reset" لإعادة الضبط. وترتبط قائمة <select> بتسمية <label> وتضم خيارات <option>.',
      },
      keyPoints: {
        en: [
          'Prefer <button type="submit"> over <input type="submit"> because <button> can contain rich inner HTML/icons.',
          'Always set type="button" on non-submitting buttons inside forms.',
          'Add multiple on <select> to allow selecting several choices at once.',
        ],
        ar: [
          'يفضل <button> على <input type="submit"> لمرونته في احتواء الأيقونات وتنسيقه.',
          'حدد type="button" لأزرار التحكم التي لا ترسل النموذج.',
          'تسمح سمة multiple في <select> باختيار أكثر من عنصر.',
        ],
      },
      commonMistake: {
        en: 'Leaving out type="button" on a toggle or cancel button inside a <form>, accidentally submitting the form on click.',
        ar: 'ترك <button> بدون type="button" داخل نموذج، مما يتسبب في إرسال النموذج بالخطأ عند النقر.',
      },
    },
  },
  'html-10-01': {
    imageUrl: IMG_FORMS,
    imageAlt: {
      en: 'Select dropdown organized with optgroup category headers and option values',
      ar: 'قائمة select منظمة بمجموعات optgroup وخيارات option ذات قيم محددة',
    },
    imageCaption: {
      en: '<optgroup> visually organizes long <select> lists into labeled categories of <option> items.',
      ar: 'ينظم <optgroup> القوائم الطويلة إلى فئات مرئية تحتوي على خيارات <option>.',
    },
    explanation: {
      overview: {
        en: 'A dropdown with 20 ungrouped items is hard to scan. Inside <select>, <option> defines each selectable entry and its submitted value, while <optgroup> groups related options beneath bold non-selectable category headers.',
        ar: 'يصعب قراءة قائمة منسدلة تضم عشرات الخيارات العشوائية. داخل <select>، يحدد وسم <option> كل خيار وقيمته الفعلية، بينما يجمع <optgroup> الخيارات المتشابهة تحت عنوان تصنيف واضح غير قابل للاختيار.',
      },
      howItWorks: {
        en: 'Each <option> separates what the user reads (inner text, e.g., "Arabic") from what gets submitted to your server (value="ar"). Adding selected pre-picks a default option. Wrapping groups inside <optgroup label="Markup"> adds a clean section heading and indents its child options automatically.',
        ar: 'يفصل وسم <option> بين النص الذي يقرؤه المستخدم (مثل "العربية") والقيمة التي تُرسل للخادم (value="ar")، وتحدد سمة selected الخيار الافتراضي. وعند وضع الخيارات داخل <optgroup label="Markup">، يظهر عنوان التصنيف تلقائياً دون أن يتمكن المستخدم من اختياره.',
      },
      keyPoints: {
        en: [
          'Always include the required label attribute on <optgroup>.',
          'Provide a clear value attribute on every <option>.',
          'Disable specific unavailable options with disabled rather than deleting them silently when context helps.',
        ],
        ar: [
          'سمة label إلزامية على <optgroup> لعرض اسم المجموعة.',
          'اكتب سمة value واضحة ومختصرة لكل <option>.',
          'يمكن تعطيل خيار مؤقتاً بسمة disabled أو تعطيل مجموعة كاملة.',
        ],
      },
      commonMistake: {
        en: 'Nesting an <optgroup> inside another <optgroup> — HTML allows only one level of option grouping.',
        ar: 'تداخل <optgroup> داخل <optgroup> آخر — تدعم HTML مستوى واحداً فقط من المجموعات.',
      },
    },
  },
  'html-10-02': {
    imageUrl: IMG_FORMS,
    imageAlt: {
      en: 'Fieldset box with legend caption grouping radio button inputs',
      ar: 'إطار مجموعة الحقول fieldset مع عنوانه legend يحيط بأزرار الاختيار',
    },
    imageCaption: {
      en: '<fieldset> and <legend> group related controls and let screen readers announce the group question.',
      ar: 'يجمع <fieldset> و <legend> الحقول المترابطة لتقرأها قارئات الشاشة مع عنوان السؤال.',
    },
    explanation: {
      overview: {
        en: 'Long forms become exhausting unless related fields are grouped logically (such as "Shipping Address" or "Preferred Direction"). <fieldset> draws a semantic box around related controls, and <legend> provides the caption describing that group.',
        ar: 'تصبح النماذج الطويلة مربكة ما لم نقسّمها إلى مجموعات واضحة مثل "معلومات الحساب" أو "اتجاه الواجهة المفضل". يجمع وسم <fieldset> الحقول المترابطة معاً، ويمنحها وسم <legend> عنواناً وصفياً واضحاً.',
      },
      howItWorks: {
        en: 'For radio buttons and checkboxes, <fieldset> + <legend> is essential: when a user tabs onto a radio button, screen readers announce the <legend> question first, then the option label. Placing disabled on <fieldset> disables every input, select, and button inside it with a single attribute.',
        ar: 'تظهر أهمية <fieldset> و <legend> بوضوح مع أزرار الاختيار (radio/checkbox)، حيث تنطق قارئة الشاشة عنوان <legend> أولاً ليعرف المستخدم سياق السؤال. كما أن إضافة disabled على <fieldset> يعطّل كل الحقول بداخله دفعة واحدة.',
      },
      keyPoints: {
        en: [
          'Always place <legend> as the very first child inside <fieldset>.',
          'All radio buttons in the same choice group must share the same name attribute.',
          'Disabled <fieldset> controls also exclude their values from form submission.',
        ],
        ar: [
          'يجب وضع <legend> كأول عنصر مباشرة داخل <fieldset>.',
          'تتشارك أزرار radio لنفس السؤال نفس قيمة سمة name.',
          'الحقول المعطلة عبر <fieldset disabled> لا تُرسل بياناتها عند الإرسال.',
        ],
      },
      commonMistake: {
        en: 'Using an <h3> inside a <div> around radio buttons instead of <fieldset> and <legend>.',
        ar: 'وضع عنوان <h3> داخل <div> بدلاً من <fieldset> و <legend>، مما يفقد الارتباط السياقي للحقول.',
      },
    },
  },
  'html-10-03': {
    imageUrl: IMG_FORMS,
    imageAlt: {
      en: 'Input paired with datalist autocomplete suggestions and live output calculation container',
      ar: 'حقل input متصل بقائمة الاقتراحات datalist وحاوية المخرجات الحية output',
    },
    imageCaption: {
      en: '<datalist> offers optional autocomplete suggestions; <output> announces live calculation results.',
      ar: 'تقدّم <datalist> اقتراحات بحث مرنة، ويعرض <output> نتائج الحسابات الفورية.',
    },
    explanation: {
      overview: {
        en: 'Sometimes <select> is too strict because users need to type custom values, yet you still want to offer helpful autocomplete suggestions — that is what <datalist> does. Alongside it, <output> provides a semantic container for displaying the live result of a form calculation or interactive control.',
        ar: 'أحياناً تكون قائمة <select> مقيدة عندما يحتاج المستخدم للكتابة الحرة مع الاستفادة من اقتراحات جاهزة — وهنا يأتي دور <datalist>. وبجانبه يوفر وسم <output> حاوية دلالية لعرض ناتج عملية حسابية أو تفاعل فوري داخل النموذج.',
      },
      howItWorks: {
        en: 'Link an <input> to a <datalist> by matching input[list] to datalist[id]. The <datalist> itself stays hidden and populates the browser’s autocomplete dropdown as the user types. Meanwhile, <output for="a b"> connects visually and semantically to the input IDs that drive its calculated value.',
        ar: 'اربط حقل الإدخال بقائمة الاقتراحات عبر تطابق سمة list في <input> مع id في <datalist>. تبقى القائمة مخفية ولا تظهر إلا كاقتراحات أثناء الكتابة. أما <output for="a b"> فيرتبط بمعرفات الحقول لحساب النتيجة وإعلان التحديثات لتقنيات إتاحة الوصول.',
      },
      keyPoints: {
        en: [
          'Unlike <select>, <datalist> lets users pick a suggestion OR enter any custom text.',
          'Use <output> for totals, range slider values, and live estimators.',
          '<output> values are not submitted as form parameters to a server by default.',
        ],
        ar: [
          'بخلاف <select>، تسمح <datalist> باختيار اقتراح أو كتابة قيمة حرة جديدة.',
          'استخدم <output> لعرض المجاميع أو قيم شريط التمرير (range).',
          'لا تُرسل قيمة <output> كحقل عادي عند إرسال النموذج للخادم.',
        ],
      },
      commonMistake: {
        en: 'Using for="..." instead of list="..." on <input> when trying to connect a <datalist>.',
        ar: 'كتابة سمة for بدلاً من list على حقل <input> لربطه بـ <datalist>.',
      },
    },
  },
  'html-10-04': {
    imageUrl: IMG_FORMS,
    imageAlt: {
      en: 'Comparison between progress task completion bar and meter range gauge',
      ar: 'مقارنة بين شريط تقدم المهمة progress ومقياس النطاق الثابت meter',
    },
    imageCaption: {
      en: 'Use <progress> for ongoing tasks moving toward completion; use <meter> for gauges within a fixed range.',
      ar: 'استخدم <progress> لمتابعة إنجاز مهمة جارية، و <meter> لقياس قيمة ضمن نطاق محدد.',
    },
    explanation: {
      overview: {
        en: 'HTML5 includes two specialized bar elements that look similar at first glance but carry completely different meanings. <progress> tracks how close an ongoing task is to finishing (like uploading a file or completing 10 of 12 chapters), while <meter> displays a static measurement within a known range (like battery level, disk space, or a quiz score).',
        ar: 'توفر HTML5 عنصرين متشابهين بصرياً لكن بمعنيين مختلفين تماماً. يتتبع <progress> نسبة إتمام مهمة جارية في طريقها للاكتمال (مثل تحميل ملف أو إنهاء 10 من 12 فصلاً)، بينما يقيس <meter> قيمة حالية ضمن نطاق ثابت (مثل مساحة القرص أو درجة حرارة أو نتيجة اختبار).',
      },
      howItWorks: {
        en: '<progress> takes value and max; if you omit value, it animates as an indeterminate loading bar. <meter> adds min, max, low, high, and optimum thresholds — browsers automatically color the bar green, yellow, or red depending on how close value is to optimum.',
        ar: 'يأخذ <progress> السمتين value و max (وإذا حُذفت value يظهر كشريط انتظار غير محدد). أما <meter> فيدعم حدوداً ذكية مثل min و max و low و high و optimum لتغيير لون المؤشر تلقائياً حسب اقتراب القيمة من المثالية.',
      },
      keyPoints: {
        en: [
          'Always put readable fallback text inside <progress>70%</progress> and <meter>85%</meter>.',
          'Never use <progress> for static gauges like storage usage — that is what <meter> is for.',
          'Never use <meter> to represent an indeterminate loading state.',
        ],
        ar: [
          'ضع دائماً نصاً بديلاً داخل الوسم مثل <progress>70%</progress>.',
          'لا تستخدم <progress> لقياس مساحة التخزين أو البطارية — استخدم <meter>.',
          'لا تستخدم <meter> لشريط تحميل قيد التقدم — استخدم <progress>.',
        ],
      },
      commonMistake: {
        en: 'Swapping <progress> and <meter> because both render a horizontal bar.',
        ar: 'استبدال <progress> بـ <meter> لمجرد تشابه شكلهما الأفقي.',
      },
    },
  },
  'html-11-01': {
    imageUrl: IMG_INTERACTIVE,
    imageAlt: {
      en: 'Native disclosure accordion built with details container and clickable summary heading',
      ar: 'عنصر الكشف التفاعلي details مع عنوانه القابل للنقر summary',
    },
    imageCaption: {
      en: '<details> and <summary> create keyboard-accessible accordions with zero JavaScript.',
      ar: 'يبني <details> و <summary> قوائم قابلة للفتح والإغلاق بسهولة دون سطر JavaScript واحد.',
    },
    explanation: {
      overview: {
        en: 'Before HTML5, even a simple FAQ accordion required JavaScript click listeners and ARIA state toggles. Now <details> and <summary> give you a native, accessible expand-and-collapse widget built directly into the browser.',
        ar: 'سابقاً كان بناء سؤال قابل للفتح والإغلاق يتطلب كتابة كود JavaScript وإدارة حالات إتاحة الوصول يدوياً. الآن يوفر وسما <details> و <summary> أداة طي وكشف مدمجة في المتصفح تعمل تلقائياً بلوحة المفاتيح والفأرة.',
      },
      howItWorks: {
        en: 'Place <summary> as the very first child inside <details>. Clicking the summary (or pressing Enter/Space on it) toggles the open attribute on <details>, automatically revealing or hiding everything else inside it. Adding the same name attribute across multiple <details> tags links them into an exclusive accordion.',
        ar: 'ضع وسم <summary> كأول عنصر مباشرة داخل <details>. عند النقر على العنوان يقوم المتصفح تلقائياً بإضافة أو إزالة سمة open على <details> لإظهار أو إخفاء المحتوى التالي. كما أن إعطاء نفس سمة name لعدة عناصر <details> يحولها إلى أكورديون حصري.',
      },
      keyPoints: {
        en: [
          'If you omit <summary>, the browser displays a generic "Details" label instead.',
          'Add open to <details open> if you want the section expanded on initial page load.',
          'Works seamlessly with keyboard navigation and screen readers out of the box.',
        ],
        ar: [
          'إذا لم تكتب <summary>، يعرض المتصفح كلمة افتراضية عامة مثل "التفاصيل".',
          'أضف سمة open لجعل المحتوى مفتوحاً منذ تحميل الصفحة.',
          'يدعم التنقل بلوحة المفاتيح وقارئات الشاشة تلقائياً.',
        ],
      },
      commonMistake: {
        en: 'Putting <summary> at the bottom of <details> instead of making it the first child.',
        ar: 'وضع وسم <summary> في نهاية <details> بدلاً من أن يكون أول عنصر داخله.',
      },
    },
  },
  'html-11-02': {
    imageUrl: IMG_INTERACTIVE,
    imageAlt: {
      en: 'Native dialog overlay box and sandboxed iframe embedded document frame',
      ar: 'النافذة الحوارية dialog والإطار المضمن المعزول أمنياً iframe',
    },
    imageCaption: {
      en: '<dialog> handles native popups and modals; <iframe> safely isolates embedded external contexts.',
      ar: 'يدير <dialog> النوافذ الحوارية، بينما يعزل <iframe> الصفحات المضمنة بأمان.',
    },
    explanation: {
      overview: {
        en: 'Web apps frequently need confirmation dialogs or embedded previews like maps and sandboxes. The <dialog> tag provides a native dialog box with built-in Escape-key dismissal and focus handling, while <iframe> embeds an independent HTML browsing context inside your current page.',
        ar: 'تحتاج تطبيقات الويب غالباً إلى نوافذ تأكيد أو تضمين معاينات وصفحات أخرى داخل الصفحة. يوفر وسم <dialog> نافذة حوارية قياسية تدعم الإغلاق بزر Escape وإدارة التركيز، بينما يضمّن وسم <iframe> صفحة HTML مستقلة بالكامل داخل صفحتك.',
      },
      howItWorks: {
        en: 'A <dialog> stays hidden until you add the open attribute (for non-modal boxes) or call dialog.showModal() in JavaScript (which dims the background and traps focus cleanly). For <iframe>, always include a descriptive title attribute for screen readers and apply sandbox to block untrusted scripts, popups, or form submissions.',
        ar: 'تبقى <dialog> مخفية حتى تضيف سمة open أو تستدعي الدالة البرمجية showModal() التي تظلّل الخلفية وتحصر التركيز داخلها. أما <iframe> فيتطلب دائماً سمة title لوصف المحتوى، وسمة sandbox لفرض قيود أمنية صارمة على الصفحة المضمنة.',
      },
      keyPoints: {
        en: [
          'A <form method="dialog"> inside <dialog> closes the dialog on submit without any JavaScript.',
          'Always give <iframe> a clear title attribute describing what is embedded.',
          'Use srcdoc="..." on <iframe> to render inline HTML snippets safely inside a sandbox.',
        ],
        ar: [
          'وجود <form method="dialog"> داخل <dialog> يغلق النافذة تلقائياً عند الإرسال دون JavaScript.',
          'لا تنسَ سمة title على <iframe> لتوضيح محتواه لمستخدمي قارئات الشاشة.',
          'تتيح سمة srcdoc عرض كود HTML مباشر داخل إطار <iframe> معزول.',
        ],
      },
      commonMistake: {
        en: 'Embedding untrusted HTML in an <iframe> without sandbox, or forgetting title on <iframe>.',
        ar: 'تضمين محتوى غير موثوق في <iframe> بدون سمة sandbox، أو نسيان سمة title.',
      },
    },
  },
  'html-11-03': {
    imageUrl: IMG_INTERACTIVE,
    imageAlt: {
      en: 'External embed void element contrasted with object fallback wrapper',
      ar: 'مقارنة بين عنصر التضمين المفرد embed وحاوية الكائنات ذات المحتوى البديل object',
    },
    imageCaption: {
      en: '<embed> inserts external plugins/PDFs directly; <object> adds nested fallback markup.',
      ar: 'يدرج <embed> الموارد الخارجية مباشرة، بينما يتيح <object> وضع محتوى بديل بداخله.',
    },
    explanation: {
      overview: {
        en: 'When displaying non-HTML resources such as interactive PDF manuals or standalone SVG packages, HTML gives you <embed> and <object>. Both embed external media via MIME type, with <object> offering graceful fallback HTML inside its tags if the browser cannot load the file.',
        ar: 'عند عرض موارد خارجية مثل ملفات PDF أو مستندات رسومية مستقلة، توفر HTML وسمي <embed> و <object>. كلاهما يعرض المورد حسب نوعه (MIME type)، لكن <object> يتميز بإمكانية وضع محتوى بديل بداخله يظهر إذا تعذر تحميل الملف.',
      },
      howItWorks: {
        en: '<embed> is a self-closing void tag using src and type, leaving no room for fallback HTML. By contrast, <object> uses data (not src!) alongside type, and wraps fallback text or download links between <object> and </object>.',
        ar: 'وسم <embed> مفرد يستخدم سمتي src و type دون محتوى بديل. في المقابل، يستخدم وسم <object> سمة data (وليس src) مع type، ويمكن كتابة نص أو رابط تحميل بديل بين وسمي الفتح والإغلاق.',
      },
      keyPoints: {
        en: [
          'Prefer <img> for standard pictures, <video>/<audio> for media, and <iframe> for HTML pages.',
          'Remember: <embed> uses src; <object> uses data.',
          'Always declare the exact MIME type (such as application/pdf or image/svg+xml).',
        ],
        ar: [
          'استخدم <img> للصور و <video> للفيديو و <iframe> لصفحات HTML، واقتصر بـ <object>/<embed> على مستندات مثل PDF.',
          'تذكّر: <embed> يستخدم src، بينما <object> يستخدم data.',
          'حدد نوع الملف بدقة في سمة type مثل application/pdf.',
        ],
      },
      commonMistake: {
        en: 'Writing src="..." instead of data="..." on <object>, causing the embedded resource to stay blank.',
        ar: 'كتابة src بدلاً من data على وسم <object>، مما يمنع تحميل المورد.',
      },
    },
  },
  'html-12-01': {
    imageUrl: IMG_EMBEDDED,
    imageAlt: {
      en: 'Deferred script loading alongside HTML parsing and noscript fallback container',
      ar: 'تحميل السكربت المؤجل defer بالتوازي مع قراءة HTML وصندوق البديل noscript',
    },
    imageCaption: {
      en: '<script defer> downloads in parallel without blocking HTML rendering; <noscript> warns when scripts are off.',
      ar: 'يحمل <script defer> الكود بالتوازي دون تعطيل عرض الصفحة، ويظهر <noscript> عند تعطل السكربت.',
    },
    explanation: {
      overview: {
        en: 'HTML provides structure, CSS provides visual design, and JavaScript brings logic and interactivity via the <script> tag. Meanwhile, <noscript> gives a clean fallback message or basic alternative if a visitor’s browser has JavaScript disabled or blocked.',
        ar: 'تبني HTML الهيكل، وتنسق CSS المظهر، وتضيف JavaScript المنطق والتفاعل عبر وسم <script>. وفي حال كان تشغيل JavaScript معطلاً أو محظوراً لدى الزائر، يعرض وسم <noscript> رسالة أو بديلاً مناسباً.',
      },
      howItWorks: {
        en: 'Normally, when a browser sees <script src="app.js"> in <head>, it stops reading HTML until the JS downloads and runs — slowing down the page. Adding defer tells the browser to download the script in the background and wait to run it until the entire HTML document is parsed, in exact order.',
        ar: 'عند قراءة <script src="app.js"> داخل <head> بدون سمات، يتوقف المتصفح عن بناء الصفحة حتى يكتمل تنزيل وتشغيل الملف. لكن إضافة سمة defer تجعل التحميل يتم بالتوازي في الخلفية ثم يُنفّذ الكود بعد انتهاء قراءة HTML بالكامل وبنفس الترتيب.',
      },
      keyPoints: {
        en: [
          'Use defer or type="module" when placing external scripts inside <head>.',
          'Never write inline document logic inside a <script src="..."> tag — if src is present, inner code is ignored.',
          'Keep <noscript> concise and helpful for non-JS environments or search crawlers.',
        ],
        ar: [
          'استخدم defer أو type="module" عند وضع <script> داخل <head> لتجنب بطء التحميل.',
          'إذا احتوى <script> على سمة src، يتجاهل المتصفح أي كود مكتوب بين وسمي الفتح والإغلاق.',
          'اجعل رسالة <noscript> واضحة ومختصرة للمتصفحات التي تعطل السكربت.',
        ],
      },
      commonMistake: {
        en: 'Putting a blocking <script> in <head> without defer, causing scripts to run before <body> elements even exist.',
        ar: 'وضع <script> في <head> بدون defer، فيعمل الكود قبل أن يقرأ المتصفح عناصر <body> ويفشل في العثور عليها.',
      },
    },
  },
  'html-12-02': {
    imageUrl: IMG_EMBEDDED,
    imageAlt: {
      en: 'Inert template blueprint fragment with named slot placeholders for reusable components',
      ar: 'القالب المخفي template ومنافذ العرض المخصصة slot للمكونات القابلة لإعادة الاستخدام',
    },
    imageCaption: {
      en: '<template> stays inert until cloned by JS; <slot> projects dynamic content into Web Components.',
      ar: 'يبقى <template> خاملاً مخفياً حتى يُستنسخ برمجياً، ويستقبل <slot> المحتوى داخل مكونات الويب.',
    },
    explanation: {
      overview: {
        en: 'Modern web apps reuse cards, alerts, and list items dozens of times without repeating markup. HTML5’s <template> holds ready-to-clone HTML blueprints that stay completely invisible on load, while <slot> acts as a dynamic placeholder inside custom Web Components where outside content can plug in.',
        ar: 'تعيد التطبيقات الحديثة استخدام البطاقات والتنبيهات عشرات المرات دون تكرار الكود. يحفظ وسم <template> نماذج HTML جاهزة للاستنساخ تبقى مخفية وغير نشطة عند التحميل، بينما يعمل وسم <slot> كمنفذ استقبال مرن داخل مكونات الويب لإدراج محتوى مخصص.',
      },
      howItWorks: {
        en: 'Images, scripts, and audio inside a <template> do not download or execute while sitting in the template — the browser parses the HTML into an inert DocumentFragment until JavaScript clones template.content. Inside a Shadow DOM component, <slot name="title"> pulls in any element marked slot="title", or shows its own fallback content if none is provided.',
        ar: 'لا يتم تحميل الصور أو تشغيل الأكواد داخل <template> عند تحميل الصفحة، بل يقرؤها المتصفح كقالب جاهز حتى تنسخه JavaScript. وداخل مكونات الويب، يستقبل <slot name="title"> أي عنصر يحمل slot="title" أو يعرض المحتوى الافتراضي المكتوب بداخله.',
      },
      keyPoints: {
        en: [
          'Content inside <template> never renders visually on its own.',
          'Scripts or images inside <template> stay dormant until cloned into the live document.',
          'Give each <slot> sensible default content between <slot> and </slot>.',
        ],
        ar: [
          'محتوى <template> لا يظهر للمستخدم نهائياً قبل استنساخه.',
          'تبقى الصور والأكواد داخل <template> خاملة حتى تُضاف إلى الصفحة الحية.',
          'ضع محتوى افتراضياً مناسباً داخل <slot>...</slot> في حال عدم تمرير قيمة مخصصة.',
        ],
      },
      commonMistake: {
        en: 'Expecting CSS or JavaScript to automatically clone and show <template> without instantiating template.content.',
        ar: 'توقع ظهور عناصر <template> تلقائياً في الصفحة بمجرد كتابتها دون استنساخها عبر JavaScript.',
      },
    },
  },
  'css-box-model': {
    imageUrl: IMG_CSS,
    imageAlt: {
      en: 'CSS box model layers and flexbox main axis alignment diagram',
      ar: 'مخطط نموذج الصندوق في CSS وطبقات الحشوة والحدود والهامش ومحاذاة Flexbox',
    },
    imageCaption: {
      en: 'Every HTML element is a four-layer box (content, padding, border, margin) aligned cleanly with Flexbox.',
      ar: 'كل عنصر HTML هو صندوق من أربع طبقات (المحتوى، الحشوة، الحدود، الهامش) يُصفّ بمرونة عبر Flexbox.',
    },
    explanation: {
      overview: {
        en: 'Once HTML defines the structure of your page, CSS paints the visual layout. The two foundational pillars of CSS layout are the Box Model (how every element occupies space) and Flexbox (how sibling elements align along a horizontal row or vertical column).',
        ar: 'بعد أن تبني HTML هيكل الصفحة، تتولى CSS رسم المظهر والتخطيط. ويقوم تخطيط CSS الحديث على ركيزتين أساسيتين: نموذج الصندوق (كيفية حساب مساحة كل عنصر) و Flexbox (كيفية محاذاة العناصر المتجاورة في صف أو عمود).',
      },
      howItWorks: {
        en: 'Think of every HTML tag as a wrapped parcel: the text/image is Content, the breathing room inside is Padding, the outer frame is Border, and the distance pushing neighbors away is Margin. Setting box-sizing: border-box ensures padding and border stay inside your declared width. Adding display: flex on a parent lets justify-content space children horizontally and align-items center them vertically.',
        ar: 'تخيّل كل عنصر كصندوق بأربع طبقات من الداخل للخارج: المحتوى ثم الحشوة الداخلية (padding) ثم الإطار (border) ثم الهامش الخارجي (margin). وتضمن قاعدة box-sizing: border-box بقاء العرض الإجمالي ثابتاً دون تمدد. وعند تفعيل display: flex على الأب، تتحكم justify-content بالتوزيع الأفقي و align-items بالمحاذاة العمودية.',
      },
      keyPoints: {
        en: [
          'Always include * { box-sizing: border-box; } so widths remain predictable.',
          'Use padding for inner breathing room and margin for outer separation between elements.',
          'Use gap on a flex container instead of adding awkward margins to individual items.',
        ],
        ar: [
          'استخدم قاعدة box-sizing: border-box لضمان ثبات مقاسات العناصر.',
          'استخدم padding للمساحة الداخلية و margin للمسافة الخارجية بين العناصر.',
          'استخدم خاصية gap داخل حاوية Flexbox بدلاً من تكرار الهوامش على كل عنصر.',
        ],
      },
      commonMistake: {
        en: 'Forgetting box-sizing: border-box, causing a 300px box with 20px padding to unexpectedly grow to 340px wide.',
        ar: 'نسيان box-sizing: border-box، مما يؤدي لزيادة عرض العنصر تلقائياً عند إضافة padding أو border.',
      },
    },
  },
  'css-grid': {
    imageUrl: IMG_CSS,
    imageAlt: {
      en: 'Responsive CSS Grid tracks distributing columns proportionally with fr units',
      ar: 'مخطط شبكة CSS Grid المتجاوبة وتوزيع المساحات بوحدة fr',
    },
    imageCaption: {
      en: 'CSS Grid controls both rows and columns simultaneously using flexible fr tracks and auto-fit.',
      ar: 'تتحكم CSS Grid بالصفوف والأعمدة معاً باستخدام وحدات fr المرنة و auto-fit.',
    },
    explanation: {
      overview: {
        en: 'While Flexbox excels at lining items along one direction, CSS Grid gives you true two-dimensional layout control over both rows and columns at once. With one or two CSS lines, card grids can automatically adapt from 4 columns on desktop down to 1 column on mobile.',
        ar: 'بينما يتفوق Flexbox في ترتيب العناصر في محور واحد، تمنحك CSS Grid تحكماً ثنائي الأبعاد في الصفوف والأعمدة في الوقت نفسه. وبسطور قليلة يمكنك بناء شبكة بطاقات تتكيف تلقائياً من 4 أعمدة على الحاسوب إلى عمود واحد على الهاتف.',
      },
      howItWorks: {
        en: 'Applying display: grid on a container turns its direct children into grid cells. The rule grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)) tells the browser: fit as many columns as possible as long as each is at least 180px wide, and share any leftover width equally using the fractional 1fr unit.',
        ar: 'تفعيل display: grid على الحاوية يحوّل أبناءها المباشرين إلى خلايا شبكة. وتخبر قاعدة repeat(auto-fit, minmax(180px, 1fr)) المتصفح بوضع أكبر عدد من الأعمدة بشرط ألا يقل عرض العمود عن 180px، مع توزيع المساحة المتبقية بالتساوي بوحدة 1fr.',
      },
      keyPoints: {
        en: [
          'Use fr units instead of fixed pixels for responsive columns that never overflow.',
          'Combine gap with auto-fit and minmax() to build responsive layouts without extra media queries.',
          'Use Flexbox for 1D bars/navs and CSS Grid for 2D page sections and card matrices.',
        ],
        ar: [
          'اعتمد على وحدة fr المرنة بدلاً من البكسل الثابت لتفادي خروج الأعمدة عن الشاشة.',
          'ادمج gap مع auto-fit و minmax() لتصميم متجاوب دون كتابة Media Queries معقدة.',
          'استخدم Flexbox للأشرطة أحادية البعد، و CSS Grid للشبكات ثنائية الأبعاد.',
        ],
      },
      commonMistake: {
        en: 'Using rigid pixel columns like 400px 400px 400px that force horizontal scrollbars on narrow mobile screens.',
        ar: 'تحديد أعمدة بعرض بكسل ثابت كبير، مما يتسبب في ظهور شريط تمرير أفقي مزعج على الهواتف.',
      },
    },
  },
  'js-essentials': {
    imageUrl: IMG_JS_REACT,
    imageAlt: {
      en: 'JavaScript client interaction connecting DOM selectors, variables, functions, and event listeners',
      ar: 'تفاعل JavaScript مع واجهة المتصفح عبر المتغيرات والدوال ومستمعي الأحداث في DOM',
    },
    imageCaption: {
      en: 'JavaScript selects HTML elements from the DOM, holds state in variables, and reacts to user events.',
      ar: 'تختار JavaScript العناصر من شجرة DOM وتحفظ الحالة في المتغيرات وتستجيب لأحداث المستخدم.',
    },
    explanation: {
      overview: {
        en: 'HTML builds the skeleton and CSS styles it, while JavaScript adds real behavior and logic. With variables, functions, and DOM events, your page can respond to button clicks, validate forms, update counters, and fetch live data without reloading.',
        ar: 'تبني HTML الهيكل وتنسقه CSS، بينما تمنح JavaScript الصفحة التفاعل والمنطق البرمجي. عبر المتغيرات والدوال والأحداث، تستجيب صفحتك للنقرات وتحدّث المحتوى وتجلب البيانات الحية دون إعادة تحميل الصفحة.',
      },
      howItWorks: {
        en: 'Declare fixed references with const and changing values with let (avoid legacy var). Use document.querySelector("#id") to grab an HTML element from the DOM tree, then attach addEventListener("click", () => { ... }) so your function runs whenever the user interacts with that element.',
        ar: 'عرّف القيم الثابتة بـ const والمتغيرات القابلة للتغيير بـ let (وتجنب var القديمة). استخدم document.querySelector للوصول إلى العنصر داخل شجرة الصفحة (DOM)، ثم أضف addEventListener("click", ...) لتنفيذ دالتك فور تفاعل المستخدم.',
      },
      keyPoints: {
        en: [
          'Default to const for variables and only switch to let when a value truly needs reassignment.',
          'Prefer addEventListener over inline onclick HTML attributes for cleaner separation.',
          'Check console.log() values in the Playground Console to verify your logic step by step.',
        ],
        ar: [
          'ابدأ دائماً بـ const ولا تستخدم let إلا عندما تتغير قيمة المتغير فعلياً.',
          'فضّل addEventListener على كتابة onclick مباشرة داخل وسوم HTML.',
          'استعن بـ console.log() لمراقبة القيم وتتبع خطوات تنفيذ الكود.',
        ],
      },
      commonMistake: {
        en: 'Trying to reassign a const variable or querying a DOM element before the HTML has finished loading.',
        ar: 'محاولة تغيير قيمة متغير معرّف بـ const، أو البحث عن عنصر في DOM قبل اكتمال تحميل HTML.',
      },
    },
  },
  'react-components': {
    imageUrl: IMG_JS_REACT,
    imageAlt: {
      en: 'React component tree passing props downward and managing local state with useState',
      ar: 'شجرة مكونات React تمرر الخصائص props للأسفل وتدير الحالة المحلية عبر useState',
    },
    imageCaption: {
      en: 'React models interfaces as reusable functions: UI updates automatically whenever state changes.',
      ar: 'تبني React الواجهات كدوال قابلة لإعادة الاستخدام تتحدث تلقائياً عند تغيّر الحالة.',
    },
    explanation: {
      overview: {
        en: 'As applications grow, manually updating dozens of DOM nodes with document.querySelector becomes error-prone. React simplifies this by letting you build independent, reusable UI pieces called Components — TypeScript adds type safety so props and state stay predictable.',
        ar: 'مع كِبر حجم التطبيق، يصبح تعديل عشرات العناصر يدوياً عبر document.querySelector عرضة للأخطاء. تبسّط مكتبة React ذلك بتقسيم الواجهة إلى مكونات مستقلة قابلة لإعادة الاستخدام (Components)، مع قوة TypeScript لضمان سلامة أنواع البيانات.',
      },
      howItWorks: {
        en: 'A React component is a JavaScript/TypeScript function that returns JSX markup. Parent components pass read-only inputs downward via props, while a component tracks its own changing values using the useState hook. Whenever you call the state setter (like setCount(c + 1)), React automatically re-renders only what changed.',
        ar: 'المكون في React عبارة عن دالة تعيد واجهة JSX. يمرر المكون الأب البيانات للأسفل عبر props للقراءة فقط، بينما يدير المكون بياناته المتغيرة محلياً عبر useState. وعند استدعاء دالة تحديث الحالة مثل setCount، تعيد React تحديث الجزء المتغير فقط بكفاءة.',
      },
      keyPoints: {
        en: [
          'Always treat props as read-only — never mutate props inside a child component.',
          'Update state via its setter function (e.g. setCount), never by mutating the state variable directly.',
          'Keep components focused on one clear job so they are easy to reuse and test.',
        ],
        ar: [
          'تعامل مع props كبيانات للقراءة فقط ولا تعدّلها داخل المكون الابن.',
          'حدّث الحالة دائماً عبر دالة التحديث مثل setCount وليس بالتعديل المباشر على المتغير.',
          'اجعل كل مكون مسؤولاً عن مهمة واضحة ليسهل اختباره وإعادة استخدامه.',
        ],
      },
      commonMistake: {
        en: 'Mutating state arrays/objects directly (e.g. items.push()) instead of passing a new copy to setState, which skips re-rendering.',
        ar: 'تعديل المصفوفة أو الكائن في الحالة مباشرة دون تمرير نسخة جديدة، مما يمنع React من تحديث الواجهة.',
      },
    },
  },
  'backend-deploy': {
    imageUrl: IMG_FULLSTACK,
    imageAlt: {
      en: 'Full-stack three-tier architecture linking Client browser, Express REST API server, and SQL Database',
      ar: 'البنية المعمارية الكاملة التي تربط المتصفح بخادم REST API وقاعدة بيانات SQL',
    },
    imageCaption: {
      en: 'Client UI sends HTTP requests to the API server, which validates input, protects secrets, and queries SQL.',
      ar: 'يرسل المتصفح طلبات HTTP إلى خادم API الذي يتحقق من المدخلات ويحمي الأسرار ويستعلم من SQL.',
    },
    explanation: {
      overview: {
        en: 'Browser code alone cannot securely store shared user records or hide private API keys. A full-stack application adds a backend API server and a relational database so data persists safely across devices and deployments.',
        ar: 'لا يستطيع كود المتصفح وحده حفظ بيانات المستخدمين بشكل مشترك أو إخفاء المفاتيح السرية. لذا يضيف التطبيق المتكامل خادماً خلفياً (Backend API) وقاعدة بيانات علائقية لحفظ السجلات بأمان وتشغيل التطبيق في الإنتاج.',
      },
      howItWorks: {
        en: 'When the browser sends an HTTP request (like GET or POST /api/lessons), your Express server validates the caller, reads any secret keys from server-side process.env variables, runs parameterized SQL queries against the database, and returns clean JSON with an appropriate HTTP status code (200 OK, 400 Bad Request, 401 Unauthorized).',
        ar: 'عندما يرسل المتصفح طلب HTTP (مثل GET أو POST)، يتحقق خادم Express من الصلاحية والمدخلات، ويقرأ المفاتيح السرية من متغيرات البيئة process.env على الخادم فقط، ثم ينفذ استعلامات SQL محمية ويعيد استجابة JSON مع رمز حالة HTTP المناسب مثل 200 أو 400.',
      },
      keyPoints: {
        en: [
          'Never place private API keys or database passwords in frontend React/HTML files.',
          'Always validate user input on the server and use parameterized SQL queries.',
          'Use the 3D Architecture explorer in CodePath to visualize Client → API → Database traffic.',
        ],
        ar: [
          'لا تضع أبداً مفاتيح API السرية أو كلمات مرور قاعدة البيانات في كود الواجهة الأمامية.',
          'تحقق دائماً من صحة المدخلات على الخادم واستخدم استعلامات SQL محمية بالمعاملات.',
          'جرّب عارض البنية ثلاثي الأبعاد لتتبع حركة الطلبات بين العميل والخادم وقاعدة البيانات.',
        ],
      },
      commonMistake: {
        en: 'Trusting client-side validation alone or exposing secret keys in browser-bundled code.',
        ar: 'الاكتفاء بالتحقق من المدخلات في المتصفح فقط أو تسريب المفاتيح السرية في ملفات الواجهة.',
      },
    },
  },
};
