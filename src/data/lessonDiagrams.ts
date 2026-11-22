import { Lesson, LocalizedText } from './types';

export type DiagramArchetype = 'tree' | 'flow' | 'layout' | 'pair';

export interface DiagramNode {
  tag: string;
  label: LocalizedText;
  sub?: string;
}

export interface LessonDiagramSpec {
  archetype: DiagramArchetype;
  heading: LocalizedText;
  badge: string;
  nodes: DiagramNode[];
  footerNote: LocalizedText;
}

export const lessonDiagrams: Record<string, LessonDiagramSpec> = {
  'html-01-01': {
    archetype: 'flow',
    heading: { en: 'Doctype Mode Switch', ar: 'مفتاح تفعيل الوضع القياسي' },
    badge: '<!DOCTYPE html>',
    nodes: [
      { tag: '<!DOCTYPE html>', label: { en: 'Line 1 Header', ar: 'السطر الأول' }, sub: 'HTML5' },
      { tag: 'Parser Engine', label: { en: 'Standards Mode', ar: 'الوضع القياسي' }, sub: 'CSS Box Ready' },
      { tag: 'Viewport', label: { en: 'Consistent Render', ar: 'عرض متطابق' }, sub: 'Cross-Browser' },
    ],
    footerNote: {
      en: 'Line 1 declaration prevents legacy Quirks Mode layout bugs.',
      ar: 'وجود التصريح في السطر الأول يمنع وضع التوافق القديم غير المنتظم.',
    },
  },
  'html-01-02': {
    archetype: 'tree',
    heading: { en: 'Root Element & Two Branches', ar: 'الجذر الرئيسي والفرعان المباشران' },
    badge: '<html> · <head>',
    nodes: [
      { tag: '<html lang dir>', label: { en: 'Document Root', ar: 'الجذر الأم' }, sub: 'lang="ar" dir="rtl"' },
      { tag: '<head>', label: { en: 'Invisible Config', ar: 'إعدادات مخفية' }, sub: 'Title, Meta, CSS' },
      { tag: '<body>', label: { en: 'Visible Page', ar: 'المحتوى المرئي' }, sub: 'DOM Viewport' },
    ],
    footerNote: {
      en: '<html> encloses exactly two direct structural children: <head> and <body>.',
      ar: 'يحتوي <html> على فرعين مباشرين فقط: <head> للإعدادات و <body> للمحتوى.',
    },
  },
  'html-01-03': {
    archetype: 'layout',
    heading: { en: 'Visible Body Viewport Canvas', ar: 'مساحة العرض المرئية داخل body' },
    badge: '<body>',
    nodes: [
      { tag: '<body>', label: { en: 'Document Canvas', ar: 'لوحة العرض' }, sub: 'Single per page' },
      { tag: '<header>', label: { en: 'Top Bar', ar: 'الترويسة' } },
      { tag: '<main>', label: { en: 'Primary Text & UI', ar: 'المحتوى الرئيسي' } },
      { tag: '<footer>', label: { en: 'Bottom Info', ar: 'التذييل' } },
    ],
    footerNote: {
      en: 'Every visible heading, paragraph, image, and control lives inside <body>.',
      ar: 'كل ما يراه الزائر داخل نافذة المتصفح يجب أن يقع داخل وسم <body>.',
    },
  },
  'html-01-04': {
    archetype: 'pair',
    heading: { en: 'Browser Tab Title & UTF-8 Metadata', ar: 'عنوان التبويب وترميز الحروف' },
    badge: '<title> · <meta>',
    nodes: [
      { tag: '<title>ali</title>', label: { en: 'Browser Tab & SEO', ar: 'اسم تبويب المتصفح' }, sub: 'Plain text only' },
      { tag: '<meta charset="UTF-8">', label: { en: 'Arabic & Symbol Decode', ar: 'فك تشفير الحروف' }, sub: 'Line 1 in <head>' },
      { tag: '<meta name="viewport">', label: { en: 'Mobile Width Scaling', ar: 'ضبط عرض الهاتف' }, sub: 'device-width' },
    ],
    footerNote: {
      en: '<title> names the tab while <meta> locks character encoding and mobile scaling.',
      ar: 'يسمّي <title> التبويب بينما يضبط <meta> ترميز الحروف ومقياس الهواتف.',
    },
  },
  'html-01-05': {
    archetype: 'flow',
    heading: { en: 'External Stylesheet & Base URL Resolution', ar: 'ربط التنسيقات الخارجية والمسار الأساسي' },
    badge: '<link> · <base>',
    nodes: [
      { tag: '<base href="/docs/">', label: { en: 'URL Prefix Root', ar: 'البادئة الافتراضية' }, sub: 'Resolves links' },
      { tag: '<link rel="stylesheet">', label: { en: 'CSS Fetch Request', ar: 'جلب ملف التنسيق' }, sub: 'href="main.css"' },
      { tag: 'Styled DOM', label: { en: 'Painted Interface', ar: 'واجهة منسّقة' }, sub: 'Favicon + Styles' },
    ],
    footerNote: {
      en: 'Place <base> above <link> inside <head> when resolving relative paths.',
      ar: 'يُوضع <base> قبل الروابط النسبية لتوجيه <link> و <a> بشكل موحد.',
    },
  },
  'html-02-01': {
    archetype: 'layout',
    heading: { en: 'Typographic Heading Scale & Dividers', ar: 'تدرج مستويات العناوين وفواصل النص' },
    badge: '<h1>–<h6> · <p> · <br> · <hr>',
    nodes: [
      { tag: '<h1> -> <h6>', label: { en: '6-Level Outline', ar: 'ستة مستويات هرمية' }, sub: 'Document Hierarchy' },
      { tag: '<p>', label: { en: 'Prose Paragraph Block', ar: 'فقرة نصية مستقلة' } },
      { tag: '<br>', label: { en: 'Single Line Break', ar: 'سطر جديد مفرد' } },
      { tag: '<hr>', label: { en: 'Thematic Section Shift', ar: 'فاصل موضوعي' } },
    ],
    footerNote: {
      en: 'Screen readers navigate outlines via <h1>–<h6>; separate paragraphs with <p>.',
      ar: 'تعتمد قارئات الشاشة على <h1>–<h6> لبناء فهرس الصفحة والتنقل السريع.',
    },
  },
  'html-02-02': {
    archetype: 'pair',
    heading: { en: 'Semantic Emphasis vs Tracked Edits', ar: 'التوكيد الدلالي مقابل تتبع التعديلات' },
    badge: '<strong> · <em> · <mark> · <del> · <ins>',
    nodes: [
      { tag: '<strong> / <em>', label: { en: 'Importance & Stress', ar: 'الأهمية والتشديد' }, sub: 'Screen-reader tone' },
      { tag: '<mark> / <small>', label: { en: 'Highlight & Fine Print', ar: 'التظليل والهامش' }, sub: 'Search & Notes' },
      { tag: '<del> -> <ins>', label: { en: 'Revision Diff Pair', ar: 'تتبع الحذف والإضافة' }, sub: 'cite & datetime' },
      { tag: '<sub> / <sup>', label: { en: 'H2O & x^2 Baseline', ar: 'المعادلات والأسس' } },
    ],
    footerNote: {
      en: 'Semantic inline formatting conveys intent to both visual users and screen readers.',
      ar: 'تنقل وسوم التنسيق الدلالية المعنى الدقيق بصرياً وصوتياً.',
    },
  },
  'html-02-03': {
    archetype: 'pair',
    heading: { en: 'Citations, Definitions & Author Contact', ar: 'الاقتباسات والتعريفات وبيانات المؤلف' },
    badge: '<abbr> · <dfn> · <blockquote> · <cite>',
    nodes: [
      { tag: '<abbr title="...">', label: { en: 'Acronym Expansion', ar: 'شرح الاختصارات' }, sub: 'Hover Tooltip' },
      { tag: '<dfn>', label: { en: 'First Term Definition', ar: 'أول تعريف للمصطلح' } },
      { tag: '<blockquote> + <cite>', label: { en: 'Quoted Work & Source', ar: 'الاقتباس واسم المرجع' }, sub: '<q> inline' },
      { tag: '<address>', label: { en: 'Author Contact Block', ar: 'بيانات التواصل' } },
    ],
    footerNote: {
      en: 'Keep work titles inside <cite> and reserve <address> strictly for contact details.',
      ar: 'احفظ اسم المرجع داخل <cite> واقتصر في <address> على بيانات الاتصال.',
    },
  },
  'html-02-04': {
    archetype: 'layout',
    heading: { en: 'Technical Code, RTL Isolation & Ruby', ar: 'كتل الكود وعزل الاتجاه وحواشي النطق' },
    badge: '<pre> · <code> · <kbd> · <bdi> · <ruby>',
    nodes: [
      { tag: '<pre><code>', label: { en: 'Exact Whitespace Block', ar: 'كود يحفظ المسافات' }, sub: 'Monospace' },
      { tag: '<kbd> / <samp> / <var>', label: { en: 'Keys, Output & Vars', ar: 'الأزرار والمخرجات' } },
      { tag: '<bdi> / <bdo>', label: { en: 'Bidi Direction Control', ar: 'عزل الاتجاه المختلط' }, sub: 'AR + EN safe' },
      { tag: '<ruby><rt><rp>', label: { en: 'Ruby Pronunciation', ar: 'حواشي النطق فوق النص' } },
    ],
    footerNote: {
      en: 'Wrap mixed-direction usernames in <bdi> so Arabic punctuation never flips.',
      ar: 'يعزل <bdi> الأسماء الإنجليزية داخل الجمل العربية لحماية ترتيب الترقيم.',
    },
  },
  'html-02-05': {
    archetype: 'tree',
    heading: { en: 'Description List & Term Keys', ar: 'قائمة التعريف ومفاتيح المصطلحات' },
    badge: '<dl> · <dt>',
    nodes: [
      { tag: '<dl>', label: { en: 'Description List Root', ar: 'حاوية المصطلحات' }, sub: 'Key-Value Container' },
      { tag: '<dt>Term 1</dt>', label: { en: 'Glossary Key', ar: 'المصطلح الأول' } },
      { tag: '<dt>Term 2</dt>', label: { en: 'Specification Key', ar: 'المصطلح الثاني' } },
    ],
    footerNote: {
      en: '<dt> elements must appear inside <dl> to mark semantic terms cleanly.',
      ar: 'يقع كل مصطلح <dt> داخل حاوية <dl> المخصصة لقوائم التعريف.',
    },
  },
  'html-02-06': {
    archetype: 'pair',
    heading: { en: 'Human Description & Machine Value', ar: 'الشرح النصي والقيمة البرمجية' },
    badge: '<dd> · <data>',
    nodes: [
      { tag: '<dt> + <dd>', label: { en: 'Detailed Explanation', ar: 'شرح المصطلح' }, sub: 'Rich HTML allowed' },
      { tag: '<data value="900">', label: { en: 'Machine Number Link', ar: 'قيمة قابلة للفرز' }, sub: 'Visible: "900 SAR"' },
    ],
    footerNote: {
      en: '<dd> completes <dt> entries while <data value="..."> feeds scripts clean machine values.',
      ar: 'يشرح <dd> المصطلح، بينما يخزن <data value="..."> القيمة الموحدة للبرمجة.',
    },
  },
  'html-02-07': {
    archetype: 'flow',
    heading: { en: 'ISO-8601 Time & Responsive Word Wrap', ar: 'التوقيت القياسي والتفاف الكلمات الطويلة' },
    badge: '<time> · <wbr>',
    nodes: [
      { tag: '<time datetime="2026-05-01">', label: { en: 'Machine Timestamp', ar: 'صيغة تاريخ موحدة' }, sub: 'SEO + Calendars' },
      { tag: 'api/<wbr>v2/<wbr>status', label: { en: 'Optional Wrap Point', ar: 'نقطة كسر آمنة' }, sub: 'Zero visible gap' },
      { tag: 'Narrow Screen', label: { en: 'Clean Line Reflow', ar: 'التفاف منظم للهاتف' }, sub: 'No horizontal scroll' },
    ],
    footerNote: {
      en: '<wbr> breaks long URLs only when container width shrinks.',
      ar: 'يكسر <wbr> الروابط الطويلة فقط عند ضيق الشاشة دون تشويه الشاشات الواسعة.',
    },
  },
  'html-03-01': {
    archetype: 'layout',
    heading: { en: 'Top Masthead & Primary Navigation Landmark', ar: 'ترويسة الصفحة ومعلم التنقل الرئيسي' },
    badge: '<header> · <nav>',
    nodes: [
      { tag: '<header>', label: { en: 'Intro & Brand Masthead', ar: 'الشعار والترويسة' }, sub: 'Top Landmark' },
      { tag: '<nav aria-label>', label: { en: 'Major Navigation Links', ar: 'روابط التنقل الرئيسية' } },
      { tag: '<ul><li><a>', label: { en: 'Accessible Link List', ar: 'قائمة روابط منظمة' } },
    ],
    footerNote: {
      en: 'Reserve <nav> for major site navigation blocks, not every single link.',
      ar: 'خصّص وسم <nav> لمجموعات الروابط الرئيسية لسهولة قفز قارئات الشاشة.',
    },
  },
  'html-03-02': {
    archetype: 'layout',
    heading: { en: 'Unique Main Landmark & Page Footer', ar: 'المحتوى الفريد main وتذييل الصفحة footer' },
    badge: '<main> · <footer>',
    nodes: [
      { tag: '<main>', label: { en: 'Primary Page Content', ar: 'المحتوى الأساسي الفريد' }, sub: 'One visible <main>' },
      { tag: 'Skip Target', label: { en: 'Keyboard Jump Point', ar: 'نقطة قفز لوحة المفاتيح' } },
      { tag: '<footer>', label: { en: 'Author, Legal & Links', ar: 'حقوق النشر والروابط' } },
    ],
    footerNote: {
      en: 'Only one visible <main> landmark should exist per HTML document.',
      ar: 'يُستخدم وسم <main> مرة واحدة مرئية لكل صفحة لتحديد قلب المحتوى.',
    },
  },
  'html-03-03': {
    archetype: 'pair',
    heading: { en: 'Thematic Sections vs Standalone Articles', ar: 'الأقسام الموضوعية مقابل المقالات المستقلة' },
    badge: '<section> · <article>',
    nodes: [
      { tag: '<section>', label: { en: 'Grouped Chapter Topic', ar: 'قسم موضوعي في الصفحة' }, sub: 'Needs <h2>–<h6>' },
      { tag: '<article>', label: { en: 'Self-Contained Entry', ar: 'محتوى مستقل بذاته' }, sub: 'Post / Card / Comment' },
    ],
    footerNote: {
      en: 'If the block makes sense syndicated alone on another site, choose <article>.',
      ar: 'اختر <article> إذا كان المحتوى مفهوماً ومستقلاً بذاته خارج الصفحة.',
    },
  },
  'html-03-04': {
    archetype: 'pair',
    heading: { en: 'Tangential Sidebar Aside vs Generic Div', ar: 'المحتوى الجانبي aside مقابل الحاوية العامة div' },
    badge: '<aside> · <div>',
    nodes: [
      { tag: '<aside>', label: { en: 'Sidebar / Related Links', ar: 'محتوى جانبي مرتبط' }, sub: 'Semantic Landmark' },
      { tag: '<div>', label: { en: 'CSS Layout Wrapper', ar: 'حاوية تصميم محايدة' }, sub: 'Zero semantic meaning' },
    ],
    footerNote: {
      en: 'Reach for semantic tags first; use <div> purely for CSS layout grouping.',
      ar: 'ابدأ بالوسوم الدلالية أولاً واستخدم <div> فقط للتنسيق البصري.',
    },
  },
  'html-04-01': {
    archetype: 'flow',
    heading: { en: 'Anchor Routing & Image Hotspot Coordinates', ar: 'توجيه الروابط ومناطق خريطة الصور' },
    badge: '<a> · <area>',
    nodes: [
      { tag: '<a href rel target>', label: { en: 'Hyperlink Routing', ar: 'الرابط التشعبي' }, sub: 'rel="noopener"' },
      { tag: '<area shape coords>', label: { en: 'Clickable Shape Region', ar: 'منطقة نقر هندسية' }, sub: 'rect / circle / poly' },
      { tag: 'Destination', label: { en: 'New Page or Section', ar: 'الوجهة المستهدفة' }, sub: 'Safe Navigation' },
    ],
    footerNote: {
      en: 'Pair target="_blank" with rel="noopener noreferrer" on external URLs.',
      ar: 'أضف دائماً rel="noopener noreferrer" عند استخدام target="_blank".',
    },
  },
  'html-04-02': {
    archetype: 'flow',
    heading: { en: 'Image Map Binding & Search Landmark', ar: 'ربط خريطة الصور ومعلم البحث الدلالي' },
    badge: '<map> · <search>',
    nodes: [
      { tag: '<img usemap="#nav">', label: { en: 'Host Graphic', ar: 'الصورة المضيفة' } },
      { tag: '<map name="nav">', label: { en: 'Named Area Group', ar: 'مجموعة المناطق' } },
      { tag: '<search><form>', label: { en: 'Site Search Region', ar: 'منطقة البحث الدلالية' }, sub: 'Native landmark' },
    ],
    footerNote: {
      en: '<search> wraps search bars and filter controls cleanly without extra ARIA roles.',
      ar: 'يغلف وسم <search> شريط البحث ليتعرف عليه المتصفح وقارئات الشاشة فوراً.',
    },
  },
  'html-05-01': {
    archetype: 'pair',
    heading: { en: 'Unordered Bullets vs Ordered Steps', ar: 'القائمة النقطية مقابل القائمة المرقمة' },
    badge: '<ul> · <ol>',
    nodes: [
      { tag: '<ul>', label: { en: 'Order Interchangeable', ar: 'ترتيب غير ملزم' }, sub: 'Bullets / Menus' },
      { tag: '<ol start reversed>', label: { en: 'Sequential Steps', ar: 'خطوات متسلسلة' }, sub: '1, 2, 3...' },
    ],
    footerNote: {
      en: 'Use <ol> whenever swapping two items would break instructions or rankings.',
      ar: 'استخدم <ol> دائماً عندما يغيّر تبديل العناصر ترتيب الخطوات.',
    },
  },
  'html-05-02': {
    archetype: 'tree',
    heading: { en: 'List Item Nesting Inside Action Menus', ar: 'تداخل بنود القائمة داخل شريط الأوامر' },
    badge: '<li> · <menu>',
    nodes: [
      { tag: '<ul> / <ol> / <menu>', label: { en: 'Parent List Container', ar: 'الحاوية الأب' }, sub: 'Toolbar or List' },
      { tag: '<li>', label: { en: 'List Entry Item', ar: 'بند القائمة' } },
      { tag: '<button>Action</button>', label: { en: 'Interactive Command', ar: 'أمر تفاعلي' } },
    ],
    footerNote: {
      en: 'Nested sub-lists must always sit inside a parent <li> element.',
      ar: 'تُكتب القوائم المتداخلة داخل وسم <li> التابع لها لضمان صحة DOM.',
    },
  },
  'html-06-01': {
    archetype: 'flow',
    heading: { en: 'Responsive Art Direction & Image Fallback', ar: 'اختيار الصورة المتجاوبة والبديل الآمن' },
    badge: '<img> · <picture>',
    nodes: [
      { tag: '<picture>', label: { en: 'Format Selector', ar: 'حاوية الاختيار' } },
      { tag: '<source srcset>', label: { en: 'AVIF / WebP / Media', ar: 'صيغ ومقاسات حديثة' } },
      { tag: '<img alt loading>', label: { en: 'Mandatory Fallback', ar: 'الصورة الأساسية والبديل' }, sub: 'width + height' },
    ],
    footerNote: {
      en: '<picture> always ends with a mandatory <img> carrying alt, width, and height.',
      ar: 'ينتهي <picture> دائماً بوسم <img> إلزامي يحمل alt والأبعاد.',
    },
  },
  'html-06-02': {
    archetype: 'tree',
    heading: { en: 'Media Sources & Self-Contained Figure', ar: 'تعدد مصادر الوسائط وحاوية الشكل المستقلة' },
    badge: '<source> · <figure>',
    nodes: [
      { tag: '<figure>', label: { en: 'Visual Exhibit Box', ar: 'حاوية العرض المستقلة' } },
      { tag: '<source>', label: { en: 'Format Candidate', ar: 'ملف بديل' }, sub: 'srcset / src' },
      { tag: '<img> / <video>', label: { en: 'Rendered Media', ar: 'الوسيط المعروض' } },
    ],
    footerNote: {
      en: '<source> uses srcset in <picture> and src in <video> or <audio>.',
      ar: 'يأخذ <source> سمة srcset داخل <picture> وسمة src داخل الفيديو والصوت.',
    },
  },
  'html-06-03': {
    archetype: 'pair',
    heading: { en: 'Captioned Figure & Scalable Vector Grid', ar: 'تعليق الشكل التوضيحي والرسم المتجه SVG' },
    badge: '<figcaption> · <svg>',
    nodes: [
      { tag: '<figure><figcaption>', label: { en: 'Bound Visual Caption', ar: 'عنوان توضيحي مرتبط' }, sub: 'First or Last child' },
      { tag: '<svg viewBox="0 0 W H">', label: { en: 'Infinite Vector Sharpness', ar: 'رسم رياضي فائق الدقة' }, sub: '<circle> <rect> <path>' },
    ],
    footerNote: {
      en: 'Inline <svg> elements stay crisp at any zoom and respond to CSS styling.',
      ar: 'تحافظ رسوم <svg> على حدتها في جميع درجات التكبير.',
    },
  },
  'html-07-01': {
    archetype: 'pair',
    heading: { en: 'Native HTML5 Video & Audio Players', ar: 'مشغلات الفيديو والصوت المدمجة في المتصفح' },
    badge: '<video> · <audio>',
    nodes: [
      { tag: '<video controls poster>', label: { en: 'Visual Player Frame', ar: 'إطار مشغل الفيديو' }, sub: 'muted playsinline' },
      { tag: '<audio controls>', label: { en: 'Compact Audio Bar', ar: 'شريط التشغيل الصوتي' }, sub: 'MP3 / OGG' },
    ],
    footerNote: {
      en: 'Always supply controls and fallback text between media tags.',
      ar: 'أضف سمة controls ونصاً بديلاً بين وسومي البداية والإغلاق.',
    },
  },
  'html-07-02': {
    archetype: 'flow',
    heading: { en: 'Timed WebVTT Subtitles & Pixel Canvas', ar: 'مسارات الترجمة الزمنية ولوحة البكسل' },
    badge: '<track> · <canvas>',
    nodes: [
      { tag: '<track kind src srclang>', label: { en: 'WebVTT Caption Feed', ar: 'ملف الترجمة الزمني' }, sub: 'ar.vtt / en.vtt' },
      { tag: '<canvas width height>', label: { en: '2D / WebGL Surface', ar: 'لوحة الرسم البرمجي' }, sub: 'getContext("2d")' },
      { tag: 'JavaScript Loop', label: { en: 'Dynamic Frames', ar: 'رسم وتحديث مباشر' } },
    ],
    footerNote: {
      en: 'Set canvas pixel resolution using HTML width and height attributes.',
      ar: 'حدّد دقة <canvas> عبر سمات HTML وليس CSS فقط لتفادي التمويه.',
    },
  },
  'html-08-01': {
    archetype: 'tree',
    heading: { en: 'Data Table Container & Accessible Caption', ar: 'حاوية الجدول البياني وعنوانه التعريفي' },
    badge: '<table> · <caption>',
    nodes: [
      { tag: '<table>', label: { en: 'Tabular Data Grid', ar: 'جدول البيانات' } },
      { tag: '<caption>', label: { en: 'First Child Title', ar: 'عنوان الجدول الأول' }, sub: 'Screen-reader label' },
      { tag: 'Rows & Cells', label: { en: 'Structured Matrix', ar: 'صفوف وأعمدة منظمة' } },
    ],
    footerNote: {
      en: 'Place <caption> immediately after <table> so assistive tools announce it first.',
      ar: 'ضع <caption> كأول عنصر بعد <table> مباشرة لوصف موضوع الجدول.',
    },
  },
  'html-08-02': {
    archetype: 'layout',
    heading: { en: 'Table Rows & Header Scope Binding', ar: 'صفوف الجدول وربط خلايا العناوين scope' },
    badge: '<tr> · <th>',
    nodes: [
      { tag: '<tr>', label: { en: 'Horizontal Table Row', ar: 'صف أفقي في الجدول' } },
      { tag: '<th scope="col">', label: { en: 'Column Heading Cell', ar: 'رأس العمود' } },
      { tag: '<th scope="row">', label: { en: 'Row Heading Cell', ar: 'رأس الصف' } },
    ],
    footerNote: {
      en: 'Adding scope="col" or scope="row" links data cells accurately to their headers.',
      ar: 'تربط سمة scope كل خلية بيانات برأس العمود أو الصف الخاص بها.',
    },
  },
  'html-08-03': {
    archetype: 'tree',
    heading: { en: 'Table Head Band & Merged Data Cells', ar: 'نطاق ترويسة الجدول ودمج الخلايا' },
    badge: '<td> · <thead>',
    nodes: [
      { tag: '<thead>', label: { en: 'Header Row Group', ar: 'مجموعة صفوف الرأس' }, sub: 'Repeats on print' },
      { tag: '<td>', label: { en: 'Standard Data Cell', ar: 'خلية بيانات عادية' } },
      { tag: '<td colspan="2" rowspan>', label: { en: 'Spanning Cell', ar: 'خلية ممتدة' } },
    ],
    footerNote: {
      en: '<thead> groups column header rows separately from data rows.',
      ar: 'يفصل <thead> صفوف عناوين الأعمدة عن جسم البيانات.',
    },
  },
  'html-08-04': {
    archetype: 'layout',
    heading: { en: 'Table Body Records & Summary Footer', ar: 'جسم السجلات وتذييل المجاميع' },
    badge: '<tbody> · <tfoot>',
    nodes: [
      { tag: '<thead>', label: { en: 'Column Headers', ar: 'رؤوس الأعمدة' } },
      { tag: '<tbody>', label: { en: 'Primary Data Rows', ar: 'صفوف البيانات الرئيسية' }, sub: 'Scrollable body' },
      { tag: '<tfoot>', label: { en: 'Totals & Summary Row', ar: 'صف الإجمالي والملخص' }, sub: 'Bottom Summary' },
    ],
    footerNote: {
      en: 'Separate <tbody> and <tfoot> to keep totals distinct from record rows.',
      ar: 'افصل صفوف البيانات داخل <tbody> وصف المجموع النهائي داخل <tfoot>.',
    },
  },
  'html-08-05': {
    archetype: 'layout',
    heading: { en: 'Column Group Styling Across Tracks', ar: 'تنسيق الأعمدة جماعياً عبر colgroup و col' },
    badge: '<colgroup> · <col>',
    nodes: [
      { tag: '<colgroup>', label: { en: 'Column Definition Container', ar: 'حاوية تعريف الأعمدة' }, sub: 'Before <thead>' },
      { tag: '<col span="2">', label: { en: 'Spans 2 Columns', ar: 'تطبيق على عمودين' } },
      { tag: '<col class="num">', label: { en: 'Column 3 Style', ar: 'تنسيق العمود الثالث' } },
    ],
    footerNote: {
      en: 'Control entire table columns in one place using <colgroup> and void <col> tags.',
      ar: 'نسّق أعمدة كاملة بسهولة عبر <colgroup> والوسوم المفردة <col>.',
    },
  },
  'html-09-01': {
    archetype: 'flow',
    heading: { en: 'Form Submission & Typed User Inputs', ar: 'إرسال النموذج وأنواع حقول الإدخال' },
    badge: '<form> · <input>',
    nodes: [
      { tag: '<form action method>', label: { en: 'Submission Envelope', ar: 'غلاف الإرسال' }, sub: 'GET / POST' },
      { tag: '<input type name required>', label: { en: 'Validated Field', ar: 'حقل إدخال متحقق' }, sub: 'email / password / text' },
      { tag: 'HTTP Payload', label: { en: 'Server / JS Handler', ar: 'استقبال البيانات' } },
    ],
    footerNote: {
      en: 'Every submitted <input> needs a name attribute to carry its key in form data.',
      ar: 'يحتاج كل حقل <input> إلى سمة name ليُرسل اسمه مع قيمته.',
    },
  },
  'html-09-02': {
    archetype: 'pair',
    heading: { en: 'Accessible Label Binding & Multi-Line Textarea', ar: 'ربط التسمية label وصندوق النص textarea' },
    badge: '<label> · <textarea>',
    nodes: [
      { tag: '<label for="bio">', label: { en: 'Clickable Accessible Label', ar: 'تسمية قابلة للنقر' }, sub: 'Matches id="bio"' },
      { tag: '<textarea id="bio" rows>', label: { en: 'Multi-Line Editor', ar: 'مربع نص متعدد الأسطر' }, sub: 'Has closing tag' },
    ],
    footerNote: {
      en: 'Matching label[for] to input/textarea[id] enlarges click targets and aids screen readers.',
      ar: 'تطابق for مع id يوسّع منطقة النقر ويربط الوصف بقارئات الشاشة.',
    },
  },
  'html-09-03': {
    archetype: 'pair',
    heading: { en: 'Explicit Button Types & Select Dropdowns', ar: 'أنواع الأزرار وقوائم الاختيار المنسدلة' },
    badge: '<button> · <select>',
    nodes: [
      { tag: '<button type="submit|button">', label: { en: 'Safe Action Trigger', ar: 'زر إرسال أو إجراء' }, sub: 'Explicit type' },
      { tag: '<select name required>', label: { en: 'Dropdown Menu Host', ar: 'قائمة اختيار منسدلة' }, sub: 'Multiple / Single' },
    ],
    footerNote: {
      en: 'Always declare type="button" on non-submitting buttons inside forms.',
      ar: 'حدّد type="button" للأزرار العادية داخل النماذج لمنع الإرسال العرضي.',
    },
  },
  'html-10-01': {
    archetype: 'tree',
    heading: { en: 'Grouped Dropdown Options Hierarchy', ar: 'تنظيم خيارات القائمة داخل مجموعات' },
    badge: '<option> · <optgroup>',
    nodes: [
      { tag: '<select>', label: { en: 'Dropdown List', ar: 'القائمة الرئيسية' } },
      { tag: '<optgroup label="...">', label: { en: 'Non-Selectable Category', ar: 'عنوان مجموعة' } },
      { tag: '<option value="...">', label: { en: 'Selectable Choice', ar: 'خيار قابل للاختيار' } },
    ],
    footerNote: {
      en: 'Group long option lists with <optgroup label="..."> for fast visual scanning.',
      ar: 'قسّم القوائم الطويلة إلى مجموعات عبر <optgroup label="...">.',
    },
  },
  'html-10-02': {
    archetype: 'tree',
    heading: { en: 'Fieldset Group & Legend Title', ar: 'تجميع حقول النموذج وعنوان المجموعة' },
    badge: '<fieldset> · <legend>',
    nodes: [
      { tag: '<fieldset>', label: { en: 'Related Controls Group', ar: 'مجموعة حقول مرتبطة' }, sub: 'Supports disabled' },
      { tag: '<legend>', label: { en: 'First Child Title', ar: 'العنوان الأول للمجموعة' } },
      { tag: 'Radio / Checkboxes', label: { en: 'Shared Question Context', ar: 'خيارات سؤال مشترك' } },
    ],
    footerNote: {
      en: '<legend> must be the first child inside <fieldset> so screen readers announce context.',
      ar: 'يوضع <legend> كأول عنصر داخل <fieldset> لقراءة عنوان المجموعة مع كل خيار.',
    },
  },
  'html-10-03': {
    archetype: 'flow',
    heading: { en: 'Autocomplete Datalist & Live Output', ar: 'اقتراحات الإدخال وعرض النتيجة الحية' },
    badge: '<datalist> · <output>',
    nodes: [
      { tag: '<input list="tracks">', label: { en: 'Free-Type Input', ar: 'حقل كتابة حر' } },
      { tag: '<datalist id="tracks">', label: { en: 'Suggestion Options', ar: 'قائمة الاقتراحات' }, sub: 'Auto-filtered' },
      { tag: '<output for="...">', label: { en: 'Calculated Result', ar: 'ناتج الحساب المباشر' } },
    ],
    footerNote: {
      en: 'input[list] connects to datalist[id] while <output> announces live calculation results.',
      ar: 'يرتبط input بـ datalist عبر list و id بينما يعرض <output> نتائج الحساب.',
    },
  },
  'html-10-04': {
    archetype: 'pair',
    heading: { en: 'Task Progress vs Bounded Gauge Meter', ar: 'شريط تقدم المهام مقابل مقياس النطاق' },
    badge: '<progress> · <meter>',
    nodes: [
      { tag: '<progress value max>', label: { en: 'Ongoing Task Completion', ar: 'تقدم مهمة جارية' }, sub: 'Upload / Course %' },
      { tag: '<meter min max optimum>', label: { en: 'Static Gauge Reading', ar: 'مقياس ضمن حد أدنى/أقصى' }, sub: 'Disk / Battery / Score' },
    ],
    footerNote: {
      en: 'Use <progress> for dynamic completion and <meter> for scalar range measurements.',
      ar: 'استخدم <progress> لتقدم المهام و <meter> لقياس القيم داخل نطاق معروف.',
    },
  },
  'html-11-01': {
    archetype: 'tree',
    heading: { en: 'Native Disclosure Widget Anatomy', ar: 'تشريح عنصر الطي والفتح التفاعلي' },
    badge: '<details> · <summary>',
    nodes: [
      { tag: '<details open?>', label: { en: 'Expandable Container', ar: 'حاوية قابلة للطي' } },
      { tag: '<summary>', label: { en: 'Always-Visible Toggle', ar: 'العنوان القابل للنقر' }, sub: 'Must be child #1' },
      { tag: 'Hidden Body', label: { en: 'Revealed Content', ar: 'المحتوى المكشوف' } },
    ],
    footerNote: {
      en: '<details> + <summary> builds accessible accordions with zero JavaScript.',
      ar: 'يبني <details> مع <summary> قائمة طي تفاعلية دون أي كود JavaScript.',
    },
  },
  'html-11-02': {
    archetype: 'pair',
    heading: { en: 'Top-Layer Modal Dialog & Sandboxed Iframe', ar: 'النافذة الحوارية والإطار المعزول أمنياً' },
    badge: '<dialog> · <iframe>',
    nodes: [
      { tag: '<dialog open>', label: { en: 'Top-Layer Native Modal', ar: 'نافذة حوارية أصلية' }, sub: 'Escape closes modal' },
      { tag: '<iframe title sandbox>', label: { en: 'Isolated Sub-Document', ar: 'صفحة مضمّنة معزولة' }, sub: 'loading="lazy"' },
    ],
    footerNote: {
      en: 'Include descriptive title and sandbox protections on every external <iframe>.',
      ar: 'زوّد كل <iframe> بسمة title وصفية وقيود sandbox المناسبة.',
    },
  },
  'html-11-03': {
    archetype: 'pair',
    heading: { en: 'Void Embed vs Object Fallback Wrapper', ar: 'المضمن المفرد embed مقابل الحاوية object' },
    badge: '<embed> · <object>',
    nodes: [
      { tag: '<embed src type>', label: { en: 'Void External Plugin', ar: 'عنصر تضمين مفرد' }, sub: 'No fallback children' },
      { tag: '<object data type>', label: { en: 'Container with Fallback', ar: 'حاوية مع رابط بديل' }, sub: 'Nested <a> link' },
    ],
    footerNote: {
      en: 'Always nest fallback download links inside <object>...</object>.',
      ar: 'أدرج رابط تنزيل بديل داخل <object> لمن يتعذر لديه العرض المباشر.',
    },
  },
  'html-12-01': {
    archetype: 'flow',
    heading: { en: 'Non-Blocking Defer Script & Noscript Guard', ar: 'تنفيذ script غير الحاجز وبديل noscript' },
    badge: '<script> · <noscript>',
    nodes: [
      { tag: 'HTML Parser', label: { en: 'Uninterrupted DOM Build', ar: 'بناء المستند دون توقف' } },
      { tag: '<script defer src>', label: { en: 'Parallel Fetch + Run End', ar: 'تنزيل متوازٍ وتشغيل آمن' }, sub: 'or type="module"' },
      { tag: '<noscript>', label: { en: 'JS-Disabled Fallback', ar: 'رسالة عند تعطيل JS' } },
    ],
    footerNote: {
      en: 'Use defer or type="module" so <head> scripts never block initial render.',
      ar: 'استخدم defer أو type="module" لمنع تعطيل عرض الصفحة أثناء تحميل السكربت.',
    },
  },
  'html-12-02': {
    archetype: 'flow',
    heading: { en: 'Inert Template Blueprint & Named Slots', ar: 'القالب الخامل ومنافذ التخصيص المسماة' },
    badge: '<template> · <slot>',
    nodes: [
      { tag: '<template>', label: { en: 'Hidden Inert Fragment', ar: 'هيكل مخفي قبل الاستنساخ' } },
      { tag: '<slot name="title">', label: { en: 'Named Insertion Point', ar: 'منفذ محتوى مسمّى' } },
      { tag: 'cloneNode(true)', label: { en: 'Stamped Live Component', ar: 'مكوّن مكرر حي' } },
    ],
    footerNote: {
      en: 'Content inside <template> stays dormant until JavaScript clones it into the DOM.',
      ar: 'لا يظهر ما بداخل <template> ولا يعمل حتى يُستنسخ عبر JavaScript.',
    },
  },
  'css-box-model': {
    archetype: 'layout',
    heading: { en: 'CSS Box Model Layers & Flex Main Axis', ar: 'طبقات نموذج الصندوق ومحور Flexbox' },
    badge: 'box-sizing · display: flex',
    nodes: [
      { tag: 'Margin -> Border', label: { en: 'Outer Spacing & Frame', ar: 'الهامش الخارجي والحدود' } },
      { tag: 'Padding -> Content', label: { en: 'Inner Space & Text', ar: 'الحشوة الداخلية والمحتوى' } },
      { tag: 'display: flex', label: { en: 'justify-content Axis', ar: 'توزيع العناصر أفقياً' }, sub: 'space-between' },
    ],
    footerNote: {
      en: 'Combine border-box sizing with parent flex alignment for predictable bars.',
      ar: 'ادمج border-box مع خصائص flex على الحاوية الأم لضمان تناسق الشريط.',
    },
  },
  'css-grid': {
    archetype: 'layout',
    heading: { en: 'Responsive Fractional CSS Grid Tracks', ar: 'أعمدة شبكة CSS المرنة بوحدة fr' },
    badge: 'display: grid · minmax()',
    nodes: [
      { tag: 'repeat(auto-fit, ...)', label: { en: 'Dynamic Column Count', ar: 'عدد أعمدة تلقائي' } },
      { tag: 'minmax(180px, 1fr)', label: { en: 'Fluid Track Sizing', ar: 'تمدد مرن متساوٍ' } },
      { tag: 'gap: 16px', label: { en: 'Consistent Track Gutters', ar: 'فراغات متساوية' } },
    ],
    footerNote: {
      en: 'auto-fit + minmax() reflows columns across mobile and desktop automatically.',
      ar: 'تُعيد auto-fit مع minmax() ترتيب الأعمدة تلقائياً حسب عرض الشاشة.',
    },
  },
  'js-essentials': {
    archetype: 'flow',
    heading: { en: 'DOM Selector -> Event Listener -> State Update', ar: 'تحديد العنصر -> مستمع الحدث -> تحديث الحالة' },
    badge: 'const/let · addEventListener',
    nodes: [
      { tag: 'querySelector("#inc")', label: { en: 'DOM Reference (const)', ar: 'مرجع العنصر الثابت' } },
      { tag: 'addEventListener("click")', label: { en: 'User Event Trigger', ar: 'استجابة لنقرة المستخدم' } },
      { tag: 'count += 1; console.log', label: { en: 'Mutable State (let)', ar: 'تحديث المتغير والطباعة' } },
    ],
    footerNote: {
      en: 'Keep element references in const and mutable counters in let.',
      ar: 'احفظ مراجع العناصر في const والقيم المتغيرة في let.',
    },
  },
  'react-components': {
    archetype: 'flow',
    heading: { en: 'Props Downward & State Re-Render Loop', ar: 'تدفق الخصائص للأسفل ودورة تحديث الحالة' },
    badge: 'props · useState',
    nodes: [
      { tag: '<Parent prop={val} />', label: { en: 'Read-Only Props Down', ar: 'تمرير الخصائص للابن' } },
      { tag: 'useState(initial)', label: { en: 'Local Component State', ar: 'حالة المكون المحلية' } },
      { tag: 'setCount(c => c + 1)', label: { en: 'Targeted DOM Re-Render', ar: 'إعادة رسم تلقائية' } },
    ],
    footerNote: {
      en: 'Never mutate state directly—always trigger updates via the setter function.',
      ar: 'استدعِ دالة التحديث دائماً بدلاً من تعديل متغير الحالة مباشرة.',
    },
  },
  'backend-deploy': {
    archetype: 'flow',
    heading: { en: 'Full-Stack HTTP Request -> API -> SQL Pipeline', ar: 'مسار الطلب من المتصفح إلى الخادم وقاعدة البيانات' },
    badge: 'GET /api · JSON · ENV',
    nodes: [
      { tag: 'Client fetch("/api")', label: { en: 'HTTP Request', ar: 'طلب من المتصفح' } },
      { tag: 'app.get -> res.json', label: { en: 'Express Route Logic', ar: 'معالجة المسار والمنطق' }, sub: 'process.env Secrets' },
      { tag: '200 OK { ok: true }', label: { en: 'JSON + SQL Response', ar: 'استجابة JSON منظمة' } },
    ],
    footerNote: {
      en: 'Keep API keys and DB credentials strictly in server-side environment variables.',
      ar: 'احفظ مفاتيح الربط وكلمات المرور في متغيرات البيئة على الخادم فقط.',
    },
  },
};

export function getLessonDiagramSpec(lesson: Lesson): LessonDiagramSpec | undefined {
  const direct = lessonDiagrams[lesson.id];
  if (direct) return direct;

  if (lesson.isReview && lesson.reviewedLessonIds) {
    const [idA, idB] = lesson.reviewedLessonIds;
    const specA = lessonDiagrams[idA];
    const specB = lessonDiagrams[idB];
    const [titleA, titleB] = lesson.reviewedLessonTitles ?? [
      { en: idA, ar: idA },
      { en: idB, ar: idB },
    ];

    const nodesA = specA?.nodes.slice(0, 2) ?? [];
    const nodesB = specB?.nodes.slice(0, 2) ?? [];
    const combinedNodes = [...nodesA, ...nodesB];

    if (combinedNodes.length === 0) return undefined;

    const badgeParts = [specA?.badge, specB?.badge].filter(Boolean);

    return {
      archetype: 'pair',
      heading: {
        en: `Combined Review: ${titleA.en} + ${titleB.en}`,
        ar: `مخطط المراجعة المدمج: ${titleA.ar} + ${titleB.ar}`,
      },
      badge: badgeParts.join('  +  '),
      nodes: combinedNodes,
      footerNote: {
        en: `Combines core concepts from "${titleA.en}" and "${titleB.en}" into one unified mental model.`,
        ar: `يدمج هذا المخطط المفاهيم الأساسية من "${titleA.ar}" و"${titleB.ar}" في نموذج واحد مترابط.`,
      },
    };
  }

  return undefined;
}

