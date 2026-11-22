import { Language } from '../i18n/translations';
import { extractHtmlTitle } from './exerciseTasks';
import { CodeQuizCheck, CodeQuizQuestion, Lesson, PlaygroundStarter, QuizQuestion } from './types';

function cleanTagKey(raw: string): string {
  return raw.replace(/[<>]/g, '').trim().toLowerCase();
}

function makeDoc(html: string): Document {
  return new DOMParser().parseFromString(html || '', 'text/html');
}

function makeResult(checks: CodeQuizCheck[]) {
  return {
    passed: checks.length > 0 && checks.every((c) => c.ok),
    checks,
  };
}

interface TagAssessmentSeed {
  mcqs: Omit<QuizQuestion, 'id'>[];
  codeTasks: Omit<CodeQuizQuestion, 'id'>[];
}

const msg = (lang: Language, en: string, ar: string) => (lang === 'ar' ? ar : en);

const TAG_BANK: Record<string, TagAssessmentSeed> = {
  '!doctype html': {
    mcqs: [
      {
        question: { en: 'What happens if <!DOCTYPE html> is omitted?', ar: 'ماذا يحدث عند نسيان كتابة <!DOCTYPE html>؟' },
        options: [
          { en: 'Browsers fall back to Quirks Mode', ar: 'ينتقل المتصفح إلى وضع التوافق القديم (Quirks Mode)' },
          { en: 'The file turns into CSS', ar: 'يتحول الملف إلى CSS' },
          { en: 'Images fail to download', ar: 'يتوقف تحميل الصور' },
        ],
        correctIndex: 0,
        explanation: { en: 'Omitting DOCTYPE triggers legacy Quirks Mode box-sizing behavior.', ar: 'غياب DOCTYPE يفعل وضع التوافق القديم الذي يغير حسابات المقاسات.' },
      },
      {
        question: { en: 'Where must <!DOCTYPE html> appear in an HTML5 file?', ar: 'أين يجب أن يظهر التصريح <!DOCTYPE html>؟' },
        options: [
          { en: 'Inside <body>', ar: 'داخل <body>' },
          { en: 'At the very top on line 1', ar: 'في أعلى الملف بالسطر الأول تماماً' },
          { en: 'After </html>', ar: 'بعد وسم </html>' },
        ],
        correctIndex: 1,
        explanation: { en: 'It must be the first instruction before any HTML tags.', ar: 'يجب أن يكون في السطر الأول قبل أي وسم آخر.' },
      },
      {
        question: { en: 'Does <!DOCTYPE html> require a closing tag?', ar: 'هل يحتاج <!DOCTYPE html> إلى وسم إغلاق؟' },
        options: [
          { en: 'Yes, </!DOCTYPE>', ar: 'نعم، يحتاج </!DOCTYPE>' },
          { en: 'Only inside <head>', ar: 'فقط داخل <head>' },
          { en: 'No, it is a single declaration', ar: 'لا، هو تصريح مفرد بدون وسم إغلاق' },
        ],
        correctIndex: 2,
        explanation: { en: '<!DOCTYPE html> is a preamble declaration, not a paired element.', ar: 'هو تصريح افتتاحي وليس عنصراً له إغلاق.' },
      },
      {
        question: { en: 'Can an HTML comment safely sit above <!DOCTYPE html>?', ar: 'هل يُنصح بوضع تعليق HTML فوق <!DOCTYPE html>؟' },
        options: [
          { en: 'No, comments above it can trigger Quirks Mode', ar: 'لا، التعليقات قبله قد تفعل وضع التوافق القديم' },
          { en: 'Yes, it improves SEO', ar: 'نعم، ذلك يحسن السيو' },
          { en: 'Only in Arabic pages', ar: 'فقط في الصفحات العربية' },
        ],
        correctIndex: 0,
        explanation: { en: 'Anything before DOCTYPE risks pushing older parsers into Quirks Mode.', ar: 'أي نص أو تعليق قبل DOCTYPE قد يربك المحلل.' },
      },
    ],
    codeTasks: [
      {
        prompt: { en: 'Write a valid HTML5 document starting with <!DOCTYPE html> and a <p> saying "Ready".', ar: 'اكتب مستند HTML5 يبدأ بـ <!DOCTYPE html> وفقرة <p> تحتوي على "Ready".' },
        language: 'html',
        validate: (code, lang) => {
          const doc = makeDoc(code.html);
          const hasDoc = /^\s*<!doctype\s+html\s*>/i.test(code.html);
          const pText = (doc.body?.querySelector('p')?.textContent || '').trim();
          return makeResult([
            { label: msg(lang, 'Starts with <!DOCTYPE html>', 'يبدأ بـ <!DOCTYPE html>'), ok: hasDoc },
            { label: msg(lang, 'Contains <p> with "Ready"', 'يحتوي على <p> بنص Ready'), ok: /ready/i.test(pText) },
          ]);
        },
      },
      {
        prompt: { en: 'Create an HTML5 skeleton with <!DOCTYPE html>, <html>, and an empty <head> + <body> containing an <h1>.', ar: 'أنشئ هيكلاً يبدأ بـ <!DOCTYPE html> ثم <html> وبداخله <head> و <body> يحتوي على <h1>.' },
        language: 'html',
        validate: (code, lang) => {
          const doc = makeDoc(code.html);
          return makeResult([
            { label: msg(lang, 'Includes <!DOCTYPE html>', 'يحتوي على <!DOCTYPE html>'), ok: /<!doctype\s+html/i.test(code.html) },
            { label: msg(lang, 'Includes <html>, <head>, and <body>', 'يحتوي على <html> و <head> و <body>'), ok: /<html/i.test(code.html) && /<head/i.test(code.html) && /<body/i.test(code.html) },
            { label: msg(lang, 'Includes non-empty <h1>', 'يحتوي على عنوان <h1> غير فارغ'), ok: Boolean(doc.body?.querySelector('h1')?.textContent?.trim()) },
          ]);
        },
      },
      {
        prompt: { en: 'Build a standards-mode greeting page with <!DOCTYPE html>, <title>Hello</title>, and a <p> element.', ar: 'أنشئ صفحة تبدأ بـ <!DOCTYPE html> مع <title>Hello</title> وفقرة <p>.' },
        language: 'html',
        validate: (code, lang) => {
          const doc = makeDoc(code.html);
          return makeResult([
            { label: msg(lang, 'Starts with <!DOCTYPE html>', 'يبدأ بـ <!DOCTYPE html>'), ok: /^\s*<!doctype\s+html/i.test(code.html) },
            { label: msg(lang, 'Title is "Hello"', 'العنوان هو Hello'), ok: extractHtmlTitle(code.html).toLowerCase() === 'hello' },
            { label: msg(lang, 'Includes a <p> element', 'يحتوي على فقرة <p>'), ok: Boolean(doc.body?.querySelector('p')?.textContent?.trim()) },
          ]);
        },
      },
      {
        prompt: { en: 'Write a document with <!DOCTYPE html>, an <h2> heading, and two <p> paragraphs inside <body>.', ar: 'اكتب مستنداً يبدأ بـ <!DOCTYPE html> ويحتوي في <body> على <h2> وفقرتين <p>.' },
        language: 'html',
        validate: (code, lang) => {
          const doc = makeDoc(code.html);
          return makeResult([
            { label: msg(lang, 'Has <!DOCTYPE html>', 'يحتوي على <!DOCTYPE html>'), ok: /<!doctype\s+html/i.test(code.html) },
            { label: msg(lang, 'Has <h2> and at least 2 <p> elements', 'يحتوي على <h2> وفقرتي <p> على الأقل'), ok: Boolean(doc.body?.querySelector('h2')) && (doc.body?.querySelectorAll('p').length ?? 0) >= 2 },
          ]);
        },
      },
      {
        prompt: { en: 'Write a complete standards-mode HTML5 profile with <!DOCTYPE html>, <main>, <h1>, and <p>.', ar: 'اكتب صفحة HTML5 قياسية متكاملة فيها <!DOCTYPE html> و <main> و <h1> و <p>.' },
        language: 'html',
        validate: (code, lang) => {
          const doc = makeDoc(code.html);
          return makeResult([
            { label: msg(lang, 'Starts with <!DOCTYPE html>', 'يبدأ بـ <!DOCTYPE html>'), ok: /^\s*<!doctype\s+html/i.test(code.html) },
            { label: msg(lang, 'Contains <main> with <h1> and <p>', 'يحتوي <main> على <h1> و <p>'), ok: Boolean(doc.querySelector('main h1') && doc.querySelector('main p')) },
          ]);
        },
      },
    ],
  },
  html: {
    mcqs: [
      {
        question: { en: 'Which attribute sets right-to-left reading direction for Arabic pages?', ar: 'أي سمة تضبط اتجاه القراءة من اليمين إلى اليسار للغة العربية؟' },
        options: [
          { en: 'align="right"', ar: 'align="right"' },
          { en: 'dir="rtl"', ar: 'dir="rtl"' },
          { en: 'float="rtl"', ar: 'float="rtl"' },
        ],
        correctIndex: 1,
        explanation: { en: 'dir="rtl" flips document flow, scrollbars, and alignment cleanly.', ar: 'تضبط dir="rtl" اتجاه الصفحة والواجهة بالكامل.' },
      },
      {
        question: { en: 'Which two direct child elements live inside <html>?', ar: 'ما هما الفرعان المباشران اللذان يعيشان داخل <html>؟' },
        options: [
          { en: '<header> and <footer>', ar: '<header> و <footer>' },
          { en: '<head> and <body>', ar: '<head> و <body>' },
          { en: '<main> and <aside>', ar: '<main> و <aside>' },
        ],
        correctIndex: 1,
        explanation: { en: '<html> holds <head> first and <body> second.', ar: 'يضم <html> قسماً للرأس <head> ثم جسماً للمحتوى <body>.' },
      },
      {
        question: { en: 'Why is <html lang="en"> important for accessibility?', ar: 'لماذا تفيد سمة lang="en" أو lang="ar" إتاحة الوصول؟' },
        options: [
          { en: 'Screen readers choose the right pronunciation voice', ar: 'تختار قارئات الشاشة محرك النطق الصحيح للغة' },
          { en: 'It increases font weight automatically', ar: 'تزيد سماكة الخط تلقائياً' },
          { en: 'It compresses images', ar: 'تضغط الصور تلقائياً' },
        ],
        correctIndex: 0,
        explanation: { en: 'Screen readers rely on the lang attribute to select accurate language rules.', ar: 'تعتمد قارئات الشاشة على سمة lang لاختيار قواعد النطق الصحيحة.' },
      },
      {
        question: { en: 'Where should visible paragraphs never be placed?', ar: 'أين لا يجوز وضع الفقرات المرئية أبداً؟' },
        options: [
          { en: 'Inside <main>', ar: 'داخل <main>' },
          { en: 'Inside <section>', ar: 'داخل <section>' },
          { en: 'Inside <head>', ar: 'داخل <head>' },
        ],
        correctIndex: 2,
        explanation: { en: '<head> is exclusively for metadata and linked assets.', ar: '<head> مخصص للبيانات الوصفية والملفات المرتبطة فقط.' },
      },
    ],
    codeTasks: [
      {
        prompt: { en: 'Create <html lang="en"> wrapping an empty <head> and a <body> with a heading.', ar: 'أنشئ <html lang="en"> يغلف <head> و <body> وبداخله عنوان.' },
        language: 'html',
        validate: (code, lang) => {
          const doc = makeDoc(code.html);
          return makeResult([
            { label: msg(lang, 'Has <html lang="en">', 'يحتوي على <html lang="en">'), ok: /<html[^>]*\blang\s*=\s*["']en["']/i.test(code.html) },
            { label: msg(lang, 'Contains <head> and visible <body> text', 'يحتوي على <head> ونص داخل <body>'), ok: /<head/i.test(code.html) && (doc.body?.textContent || '').trim().length > 0 },
          ]);
        },
      },
      {
        prompt: { en: 'Build an Arabic RTL root document with <html lang="ar" dir="rtl">, <head>, and a Arabic <p>.', ar: 'أنشئ مستنداً عربياً يحمل <html lang="ar" dir="rtl"> مع <head> وفقرة <p>.' },
        language: 'html',
        validate: (code, lang) => {
          const doc = makeDoc(code.html);
          return makeResult([
            { label: msg(lang, 'Sets lang="ar" and dir="rtl" on <html>', 'يحدد lang="ar" و dir="rtl" على <html>'), ok: /<html[^>]*\blang\s*=\s*["']ar["']/i.test(code.html) && /<html[^>]*\bdir\s*=\s*["']rtl["']/i.test(code.html) },
            { label: msg(lang, 'Contains <head> and <p>', 'يحتوي على <head> وفقرة <p>'), ok: /<head/i.test(code.html) && Boolean(doc.body?.querySelector('p')?.textContent?.trim()) },
          ]);
        },
      },
      {
        prompt: { en: 'Write <!DOCTYPE html> followed by <html>, <head><title>App</title></head>, and <body><p>OK</p></body>.', ar: 'اكتب <!DOCTYPE html> ثم <html> و <head><title>App</title></head> و <body><p>OK</p></body>.' },
        language: 'html',
        validate: (code, lang) => {
          const doc = makeDoc(code.html);
          return makeResult([
            { label: msg(lang, 'Has DOCTYPE and <html>', 'يحتوي على DOCTYPE و <html>'), ok: /<!doctype\s+html/i.test(code.html) && /<html/i.test(code.html) },
            { label: msg(lang, 'Title is "App" and body has <p>', 'العنوان App وفي الجسم فقرة <p>'), ok: extractHtmlTitle(code.html) === 'App' && Boolean(doc.body?.querySelector('p')) },
          ]);
        },
      },
      {
        prompt: { en: 'Configure <html lang="fr"> with a <head> containing <meta charset="UTF-8" /> and a <body>.', ar: 'اضبط <html lang="fr"> مع <head> فيه <meta charset="UTF-8" /> وقسم <body>.' },
        language: 'html',
        validate: (code, lang) => {
          const doc = makeDoc(code.html);
          return makeResult([
            { label: msg(lang, 'Sets lang="fr" on <html>', 'يحدد lang="fr" على <html>'), ok: /<html[^>]*\blang\s*=\s*["']fr["']/i.test(code.html) },
            { label: msg(lang, 'Has <meta charset="UTF-8">', 'يحتوي على <meta charset="UTF-8">'), ok: Boolean(doc.querySelector('head meta[charset]')) },
          ]);
        },
      },
      {
        prompt: { en: 'Write a bilingual-ready <html> structure with lang, <head><title>Site</title></head>, and <body><h1>Welcome</h1></body>.', ar: 'اكتب بنية <html> كاملة تحدد lang وفي <head> عنوان Site وفي <body> عنوان <h1>Welcome</h1>.' },
        language: 'html',
        validate: (code, lang) => {
          const doc = makeDoc(code.html);
          return makeResult([
            { label: msg(lang, '<html> includes lang attribute', 'وسم <html> يحتوي على سمة lang'), ok: /<html[^>]*\blang\s*=/i.test(code.html) },
            { label: msg(lang, 'Has <title>Site</title> and <h1>', 'يحتوي على <title>Site</title> وعنوان <h1>'), ok: extractHtmlTitle(code.html) === 'Site' && Boolean(doc.body?.querySelector('h1')?.textContent?.trim()) },
          ]);
        },
      },
    ],
  },
  body: {
    mcqs: [
      {
        question: { en: 'Where does all visible text, imagery, and buttons belong?', ar: 'أين يجب وضع كل النصوص والصور والأزرار المرئية؟' },
        options: [
          { en: 'Inside <head>', ar: 'داخل <head>' },
          { en: 'Inside <body>', ar: 'داخل <body>' },
          { en: 'Before <!DOCTYPE>', ar: 'قبل <!DOCTYPE>' },
        ],
        correctIndex: 1,
        explanation: { en: '<body> holds every visible element painted in the viewport.', ar: 'يحتوي <body> على جميع العناصر المرئية على الصفحة.' },
      },
      {
        question: { en: 'Which element directly precedes <body> in a standard document?', ar: 'أي وسم يسبق <body> مباشرة في المستند القياسي؟' },
        options: [
          { en: '</head>', ar: '</head>' },
          { en: '</html>', ar: '</html>' },
          { en: '</footer>', ar: '</footer>' },
        ],
        correctIndex: 0,
        explanation: { en: '<body> begins immediately after </head> closes.', ar: 'يبدأ <body> مباشرة بعد إغلاق </head>.' },
      },
      {
        question: { en: 'Can global attributes like class and id be added to <body>?', ar: 'هل يقبل وسم <body> السمات العامة مثل class و id؟' },
        options: [
          { en: 'Yes, <body> supports all global attributes', ar: 'نعم، يدعم <body> جميع السمات العامة' },
          { en: 'No, <body> accepts zero attributes', ar: 'لا، لا يقبل أي سمات' },
          { en: 'Only lang is allowed', ar: 'فقط سمة lang' },
        ],
        correctIndex: 0,
        explanation: { en: '<body> accepts global attributes such as class, id, dir, and data-*.', ar: 'يقبل <body> السمات العامة مثل class و id و dir.' },
      },
      {
        question: { en: 'What happens if you place visible text outside </html>?', ar: 'ماذا يحدث عند كتابة نص مرئي بعد إغلاق </html>؟' },
        options: [
          { en: 'The browser ignores it completely', ar: 'يتجاهله المتصفح كلياً' },
          { en: 'The parser implicitly moves it back into <body>, making HTML invalid', ar: 'يعيد المتصفح نقله إلى <body> وتصبح البنية غير صالحة' },
          { en: 'It renders in the browser tab', ar: 'يظهر في تبويب المتصفح' },
        ],
        correctIndex: 1,
        explanation: { en: 'HTML error recovery moves stray nodes into <body>, though validators flag it.', ar: 'ينقل المتصفح النص التائه إلى <body> أثناء التصحيح ولكن الكود يُعد غير قياسي.' },
      },
    ],
    codeTasks: [
      {
        prompt: { en: 'Write a <body> container holding an <h1> heading and one <p> paragraph.', ar: 'اكتب وسم <body> وبداخله عنوان <h1> وفقرة <p>.' },
        language: 'html',
        validate: (code, lang) => {
          const doc = makeDoc(code.html);
          return makeResult([
            { label: msg(lang, 'Has <body> with <h1> and <p>', 'يحتوي <body> على <h1> و <p>'), ok: /<body\b/i.test(code.html) && Boolean(doc.body?.querySelector('h1') && doc.body?.querySelector('p')) },
          ]);
        },
      },
      {
        prompt: { en: 'Add class="app" to <body> and place a <button> inside it.', ar: 'أضف class="app" إلى وسم <body> وضع داخله زر <button>.' },
        language: 'html',
        validate: (code, lang) => {
          const doc = makeDoc(code.html);
          return makeResult([
            { label: msg(lang, '<body> has class="app"', 'وسم <body> يحمل class="app"'), ok: doc.body?.classList.contains('app') ?? false },
            { label: msg(lang, 'Contains a <button>', 'يحتوي على زر <button>'), ok: Boolean(doc.body?.querySelector('button')?.textContent?.trim()) },
          ]);
        },
      },
      {
        prompt: { en: 'Place a semantic <main> and <footer> inside <body> with text in each.', ar: 'ضع <main> و <footer> داخل <body> مع نص داخل كل منهما.' },
        language: 'html',
        validate: (code, lang) => {
          const doc = makeDoc(code.html);
          return makeResult([
            { label: msg(lang, 'Has <body>', 'يحتوي على <body>'), ok: /<body\b/i.test(code.html) },
            { label: msg(lang, 'Contains non-empty <main> and <footer>', 'يحتوي على <main> و <footer> غير فارغين'), ok: Boolean(doc.body?.querySelector('main')?.textContent?.trim() && doc.body?.querySelector('footer')?.textContent?.trim()) },
          ]);
        },
      },
      {
        prompt: { en: 'Create a page with <body> containing a heading <h1> and a bulleted <ul> list of 2 items.', ar: 'أنشئ <body> يحتوي على <h1> وقائمة <ul> بها عنصران <li>.' },
        language: 'html',
        validate: (code, lang) => {
          const doc = makeDoc(code.html);
          return makeResult([
            { label: msg(lang, 'Has <h1> and 2 <li> items inside <ul>', 'يحتوي على <h1> وعنصرين <li> داخل <ul>'), ok: Boolean(doc.body?.querySelector('h1')) && (doc.body?.querySelectorAll('ul li').length ?? 0) >= 2 },
          ]);
        },
      },
      {
        prompt: { en: 'Build a clean <html> page where <head> sets <title>Body Lab</title> and <body> renders <p>Visible</p>.', ar: 'أنشئ صفحة فيها <title>Body Lab</title> داخل <head> وفقرة <p>Visible</p> داخل <body>.' },
        language: 'html',
        validate: (code, lang) => {
          const doc = makeDoc(code.html);
          return makeResult([
            { label: msg(lang, 'Title is "Body Lab"', 'العنوان هو Body Lab'), ok: extractHtmlTitle(code.html) === 'Body Lab' },
            { label: msg(lang, '<body> contains <p>Visible</p>', 'يحتوي <body> على Visible داخل <p>'), ok: /visible/i.test(doc.body?.querySelector('p')?.textContent || '') },
          ]);
        },
      },
    ],
  },
  title: {
    mcqs: [
      {
        question: { en: 'Where does the text inside <title> appear?', ar: 'أين يظهر النص المكتوب داخل وسم <title>؟' },
        options: [
          { en: 'In the browser tab, bookmarks, and search results', ar: 'في تبويب المتصفح والمفضلة ونتائج محركات البحث' },
          { en: 'As an H1 banner inside <body>', ar: 'كعنوان H1 داخل <body>' },
          { en: 'Inside the browser console only', ar: 'في وحدة التحكم فقط' },
        ],
        correctIndex: 0,
        explanation: { en: '<title> defines the document name displayed in browser tabs and bookmarks.', ar: 'يعرض <title> اسم الصفحة في تبويب المتصفح والإشارات المرجعية.' },
      },
      {
        question: { en: 'What happens if you put <strong> tags inside <title>?', ar: 'ماذا يحدث إذا كتبت وسم <strong> داخل <title>؟' },
        options: [
          { en: 'The browser tab turns bold', ar: 'يصبح خط التبويب عريضاً' },
          { en: 'It displays literally as plain text "<strong>"', ar: 'يظهر كنص حرفي "<strong>" لأن العنوان نص فقط' },
          { en: 'The page fails to load', ar: 'يفشل تحميل الصفحة' },
        ],
        correctIndex: 1,
        explanation: { en: '<title> accepts plain text only and ignores child HTML tags.', ar: 'يقبل <title> نصاً مجرداً فقط ولا يفسر الوسوم داخله.' },
      },
      {
        question: { en: 'Which <meta> tag ensures mobile devices do not zoom out to desktop width?', ar: 'أي وسم <meta> يمنع الهواتف من تصغير الصفحة لعرض الحاسوب؟' },
        options: [
          { en: '<meta name="viewport" content="width=device-width, initial-scale=1.0" />', ar: '<meta name="viewport" content="width=device-width, initial-scale=1.0" />' },
          { en: '<meta charset="mobile" />', ar: '<meta charset="mobile" />' },
          { en: '<meta http-equiv="zoom" />', ar: '<meta http-equiv="zoom" />' },
        ],
        correctIndex: 0,
        explanation: { en: 'The viewport meta tag sets layout width to the physical device width.', ar: 'يضبط وسم viewport عرض التصميم ليتطابق مع عرض شاشة الهاتف.' },
      },
      {
        question: { en: 'Which tag belongs inside <head> alongside <title> for SEO summaries?', ar: 'أي وسم يُكتب داخل <head> لكتابة ملخص الصفحة لمحركات البحث؟' },
        options: [
          { en: '<meta name="description" content="..." />', ar: '<meta name="description" content="..." />' },
          { en: '<p class="seo">', ar: '<p class="seo">' },
          { en: '<summary>', ar: '<summary>' },
        ],
        correctIndex: 0,
        explanation: { en: 'Search engines read <meta name="description"> for page snippets.', ar: 'تقرأ محركات البحث ملخص الصفحة من <meta name="description">.' },
      },
    ],
    codeTasks: [
      {
        prompt: { en: 'Create a <head> section setting the browser tab <title> to "Portfolio".', ar: 'أنشئ قسم <head> يضبط عنوان التبويب <title> ليكون "Portfolio".' },
        language: 'html',
        validate: (code, lang) => makeResult([
          { label: msg(lang, '<head> contains <title>Portfolio</title>', 'يحتوي <head> على <title>Portfolio</title>'), ok: /<head/i.test(code.html) && extractHtmlTitle(code.html) === 'Portfolio' },
        ]),
      },
      {
        prompt: { en: 'Inside <head>, add <meta charset="UTF-8" /> and <title>News</title>.', ar: 'داخل <head>، أضف <meta charset="UTF-8" /> و <title>News</title>.' },
        language: 'html',
        validate: (code, lang) => {
          const doc = makeDoc(code.html);
          return makeResult([
            { label: msg(lang, 'Has <meta charset="UTF-8">', 'يحتوي على <meta charset="UTF-8">'), ok: Boolean(doc.querySelector('head meta[charset]')) },
            { label: msg(lang, 'Title is "News"', 'العنوان هو News'), ok: extractHtmlTitle(code.html) === 'News' },
          ]);
        },
      },
      {
        prompt: { en: 'Add a mobile viewport <meta name="viewport" content="width=device-width, initial-scale=1.0" /> inside <head>.', ar: 'أضف وسم viewport داخل <head> لضبط توافق الهاتف.' },
        language: 'html',
        validate: (code, lang) => {
          const doc = makeDoc(code.html);
          const vp = doc.querySelector('head meta[name="viewport"]');
          return makeResult([
            { label: msg(lang, 'Has viewport meta tag with width=device-width', 'يحتوي على وسم viewport بقيمة width=device-width'), ok: Boolean(vp && /width\s*=\s*device-width/i.test(vp.getAttribute('content') || '')) },
          ]);
        },
      },
      {
        prompt: { en: 'Add a <meta name="description" content="..." /> tag with non-empty content inside <head>.', ar: 'أضف وسم <meta name="description" content="..." /> بوصف غير فارغ داخل <head>.' },
        language: 'html',
        validate: (code, lang) => {
          const doc = makeDoc(code.html);
          const desc = doc.querySelector('head meta[name="description"]');
          return makeResult([
            { label: msg(lang, 'Includes non-empty meta description', 'يحتوي على وصف meta description غير فارغ'), ok: Boolean(desc && (desc.getAttribute('content') || '').trim().length >= 3) },
          ]);
        },
      },
      {
        prompt: { en: 'Build a complete HTML page with charset UTF-8, <title>ali</title>, and an <h1> greeting in <body>.', ar: 'ابنِ صفحة كاملة فيها UTF-8 و <title>ali</title> وعنوان ترحيبي <h1> داخل <body>.' },
        language: 'html',
        validate: (code, lang) => {
          const doc = makeDoc(code.html);
          return makeResult([
            { label: msg(lang, 'Has UTF-8 meta tag', 'يحتوي على UTF-8'), ok: Boolean(doc.querySelector('head meta[charset]')) },
            { label: msg(lang, 'Tab title is "ali"', 'عنوان التبويب هو ali'), ok: extractHtmlTitle(code.html) === 'ali' },
            { label: msg(lang, '<body> has <h1>', 'يحتوي <body> على <h1>'), ok: Boolean(doc.body?.querySelector('h1')?.textContent?.trim()) },
          ]);
        },
      },
    ],
  },
  link: {
    mcqs: [
      {
        question: { en: 'Which attributes are required on <link> to load CSS?', ar: 'ما السمات اللازمة على <link> لتحميل ملف CSS؟' },
        options: [
          { en: 'src and type', ar: 'src و type' },
          { en: 'rel="stylesheet" and href', ar: 'rel="stylesheet" و href' },
          { en: 'action and method', ar: 'action و method' },
        ],
        correctIndex: 1,
        explanation: { en: '<link> connects resources using rel (relationship) and href (path).', ar: 'يربط <link> الملفات عبر rel لتحديد العلاقة و href لمسار الملف.' },
      },
      {
        question: { en: 'How do you link a browser tab favicon using <link>?', ar: 'كيف تضيف أيقونة تبويب المتصفح (Favicon) باستخدام <link>؟' },
        options: [
          { en: '<link rel="icon" href="/favicon.ico" />', ar: '<link rel="icon" href="/favicon.ico" />' },
          { en: '<img rel="icon" />', ar: '<img rel="icon" />' },
          { en: '<base icon="/favicon.ico" />', ar: '<base icon="/favicon.ico" />' },
        ],
        correctIndex: 0,
        explanation: { en: 'rel="icon" registers the favicon displayed next to the page title.', ar: 'تسجل rel="icon" أيقونة الصفحة في تبويب المتصفح.' },
      },
      {
        question: { en: 'What does <base href="https://example.com/docs/" /> control?', ar: 'بماذا يتحكم وسم <base href="https://example.com/docs/" />؟' },
        options: [
          { en: 'The background color of <body>', ar: 'لون خلفية الصفحة' },
          { en: 'The root base URL used to resolve all relative URLs on the page', ar: 'الرابط الأساسي الذي تُحسب نسبةً إليه جميع الروابط النسبية' },
          { en: 'The database port', ar: 'منفذ قاعدة البيانات' },
        ],
        correctIndex: 1,
        explanation: { en: '<base> sets the resolution prefix for relative href/src attributes.', ar: 'يحدد <base> البادئة المرجعية لكل الروابط النسبية في المستند.' },
      },
      {
        question: { en: 'How many <base> tags are allowed inside one HTML document?', ar: 'كم وسم <base> يُسمح بوضعه داخل صفحة HTML واحدة؟' },
        options: [
          { en: 'At most one <base> inside <head>', ar: 'وسم <base> واحد على الأكثر داخل <head>' },
          { en: 'One per section', ar: 'واحد لكل قسم' },
          { en: 'Unlimited', ar: 'عدد غير محدود' },
        ],
        correctIndex: 0,
        explanation: { en: 'Only the first <base> element inside <head> applies.', ar: 'يسمح المعيار بوسم <base> واحد فقط داخل <head>.' },
      },
    ],
    codeTasks: [
      {
        prompt: { en: 'Inside <head>, link an external stylesheet named "styles.css".', ar: 'داخل <head>، اربط ملف تنسيق خارجي باسم "styles.css".' },
        language: 'html',
        validate: (code, lang) => {
          const doc = makeDoc(code.html);
          const lnk = doc.querySelector('head link[rel="stylesheet"]');
          return makeResult([
            { label: msg(lang, 'Has <link rel="stylesheet" href="styles.css">', 'يحتوي على link لملف styles.css'), ok: Boolean(lnk && /styles\.css/i.test(lnk.getAttribute('href') || '')) },
          ]);
        },
      },
      {
        prompt: { en: 'Add a favicon <link rel="icon" href="/icon.png" /> inside <head>.', ar: 'أضف أيقونة موقع <link rel="icon" href="/icon.png" /> داخل <head>.' },
        language: 'html',
        validate: (code, lang) => {
          const doc = makeDoc(code.html);
          const lnk = doc.querySelector('head link[rel*="icon"][href]');
          return makeResult([
            { label: msg(lang, 'Includes <link rel="icon" href="...">', 'يحتوي على <link rel="icon"> مع href'), ok: Boolean(lnk && (lnk.getAttribute('href') || '').trim().length > 0) },
          ]);
        },
      },
      {
        prompt: { en: 'Add <base href="/app/" /> inside <head> along with a stylesheet link.', ar: 'أضف <base href="/app/" /> داخل <head> مع رابط لملف تنسيق.' },
        language: 'html',
        validate: (code, lang) => {
          const doc = makeDoc(code.html);
          return makeResult([
            { label: msg(lang, 'Includes <base href="/app/">', 'يحتوي على <base href="/app/">'), ok: Boolean(doc.querySelector('head base[href="/app/"]')) },
            { label: msg(lang, 'Includes stylesheet <link>', 'يحتوي على <link rel="stylesheet">'), ok: Boolean(doc.querySelector('head link[rel="stylesheet"][href]')) },
          ]);
        },
      },
      {
        prompt: { en: 'Add a canonical link tag <link rel="canonical" href="https://codepath.dev" /> inside <head>.', ar: 'أضف رابط canonical داخل <head> يشير إلى https://codepath.dev.' },
        language: 'html',
        validate: (code, lang) => {
          const doc = makeDoc(code.html);
          const canon = doc.querySelector('head link[rel="canonical"][href]');
          return makeResult([
            { label: msg(lang, 'Has canonical link with https URL', 'يحتوي على canonical برابط صالح'), ok: Boolean(canon && /^https?:\/\//i.test(canon.getAttribute('href') || '')) },
          ]);
        },
      },
      {
        prompt: { en: 'Build <head> with <base href="https://example.com/" />, <title>Docs</title>, and <link rel="stylesheet" href="theme.css" />.', ar: 'اكتب <head> يحتوي على <base> و <title>Docs</title> ورابط تنسيق theme.css.' },
        language: 'html',
        validate: (code, lang) => {
          const doc = makeDoc(code.html);
          return makeResult([
            { label: msg(lang, 'Includes <base href>', 'يحتوي على <base href>'), ok: Boolean(doc.querySelector('head base[href]')) },
            { label: msg(lang, 'Includes <title>Docs</title> and theme.css link', 'يحتوي على Docs و theme.css'), ok: extractHtmlTitle(code.html) === 'Docs' && Boolean(doc.querySelector('head link[rel="stylesheet"][href*="theme.css"]')) },
          ]);
        },
      },
    ],
  },
};

const GENERIC_HTML_TAG_FACTORY = (rawTag: string, lessonTitleEn: string, lessonTitleAr: string): TagAssessmentSeed => {
  const clean = cleanTagKey(rawTag).split(/[,\s/–-]+/)[0] || 'div';

  // Rich tag-specific behaviors for every chapter tag
  switch (clean) {
    case 'h1':
    case 'p':
    case 'br':
    case 'hr':
      return {
        mcqs: [
          {
            question: { en: 'How many <h1> main headings should a typical webpage have?', ar: 'كم عنوان <h1> رئيسي يُنصح بوجوده في الصفحة الواحدة؟' },
            options: [
              { en: 'One primary <h1> for the main page topic', ar: 'عنوان <h1> واحد رئيسي يعبر عن موضوع الصفحة' },
              { en: 'At least six <h1> tags', ar: 'ستة وسوم <h1> على الأقل' },
              { en: 'Zero headings', ar: 'بدون أي عناوين' },
            ],
            correctIndex: 0,
            explanation: { en: 'Using one top-level <h1> gives screen readers and search engines a clear page outline.', ar: 'يساعد وجود <h1> واحد رئيسي قارئات الشاشة ومحركات البحث على فهم تسلسل الصفحة.' },
          },
          {
            question: { en: 'Which tag is best for separating two distinct prose paragraphs?', ar: 'أي وسم مناسب لفصل فقرتين نصيتين مستقلتين؟' },
            options: [
              { en: '<br><br>', ar: 'تكرار <br><br>' },
              { en: 'Separate <p>...</p> elements', ar: 'وسما <p>...</p> منفصلان' },
              { en: '<h6>', ar: 'وسم <h6>' },
            ],
            correctIndex: 1,
            explanation: { en: 'Use separate <p> elements for paragraphs rather than stacking <br> tags.', ar: 'استخدم <p> لكل فقرة بدلاً من تكديس <br>.' },
          },
          {
            question: { en: 'Which pair are void elements with NO closing tag?', ar: 'أي زوج يُعد من الوسوم المفردة التي ليس لها وسم إغلاق؟' },
            options: [
              { en: '<p> and <h1>', ar: '<p> و <h1>' },
              { en: '<br> and <hr>', ar: '<br> و <hr>' },
              { en: '<h2> and <h3>', ar: '<h2> و <h3>' },
            ],
            correctIndex: 1,
            explanation: { en: '<br> and <hr> are void elements and never wrap child text.', ar: '<br> و <hr> وسمان مفردان بدون محتوى داخلي.' },
          },
          {
            question: { en: 'What should guide your choice between <h2> and <h4>?', ar: 'ما الذي يجب أن يحدد اختيارك بين <h2> و <h4>؟' },
            options: [
              { en: 'Logical outline depth, never font size', ar: 'عمق التسلسل المنطقي للعناوين وليس حجم الخط' },
              { en: 'Random preference', ar: 'الاختيار العشوائي' },
              { en: 'Line length', ar: 'طول السطر' },
            ],
            correctIndex: 0,
            explanation: { en: 'Heading levels represent document hierarchy; adjust visual sizes with CSS.', ar: 'العناوين تحدد البنية الهرمية، بينما يُضبط الحجم البصري عبر CSS.' },
          },
        ],
        codeTasks: [
          {
            prompt: { en: 'Write an article outline with one <h1> and two <h2> subheadings.', ar: 'اكتب هيكلاً يحتوي على <h1> واحد وعنوانين فرعيين <h2>.' },
            language: 'html',
            validate: (code, lang) => {
              const doc = makeDoc(code.html);
              return makeResult([
                { label: msg(lang, 'Has <h1> and at least two <h2> elements', 'يحتوي على <h1> وعنواني <h2>'), ok: Boolean(doc.body?.querySelector('h1')) && (doc.body?.querySelectorAll('h2').length ?? 0) >= 2 },
              ]);
            },
          },
          {
            prompt: { en: 'Write two paragraphs (<p>) separated by a horizontal <hr /> divider.', ar: 'اكتب فقرتين <p> يفصل بينهما خط <hr />.' },
            language: 'html',
            validate: (code, lang) => {
              const doc = makeDoc(code.html);
              return makeResult([
                { label: msg(lang, 'Has 2 <p> paragraphs and <hr>', 'يحتوي على فقرتي <p> و <hr>'), ok: (doc.body?.querySelectorAll('p').length ?? 0) >= 2 && Boolean(doc.body?.querySelector('hr')) },
              ]);
            },
          },
          {
            prompt: { en: 'Create a postal address paragraph <p> with two lines separated using <br />.', ar: 'أنشئ فقرة عنوان <p> من سطرين مفصولين بوسم <br />.' },
            language: 'html',
            validate: (code, lang) => {
              const doc = makeDoc(code.html);
              return makeResult([
                { label: msg(lang, 'Contains <p> with <br>', 'يحتوي <p> على كسر سطر <br>'), ok: Boolean(doc.body?.querySelector('p br')) },
              ]);
            },
          },
          {
            prompt: { en: 'Build a hierarchy descending cleanly from <h1> to <h2> to <h3>.', ar: 'أنشئ تسلسلاً نظيفاً من <h1> ثم <h2> ثم <h3>.' },
            language: 'html',
            validate: (code, lang) => {
              const doc = makeDoc(code.html);
              return makeResult([
                { label: msg(lang, 'Includes <h1>, <h2>, and <h3>', 'يحتوي على <h1> و <h2> و <h3>'), ok: Boolean(doc.body?.querySelector('h1') && doc.body?.querySelector('h2') && doc.body?.querySelector('h3')) },
              ]);
            },
          },
          {
            prompt: { en: 'Compose a mini guide using <h1>, <h2>, two <p> tags, <br />, and <hr />.', ar: 'اكتب دليلاً مصغراً يجمع <h1> و <h2> وفقرتين <p> مع <br /> و <hr />.' },
            language: 'html',
            validate: (code, lang) => {
              const doc = makeDoc(code.html);
              return makeResult([
                { label: msg(lang, 'Uses <h1>, <h2>, 2+ <p>, <br>, and <hr>', 'يستخدم جميع العناصر المطلوبة'), ok: Boolean(doc.body?.querySelector('h1') && doc.body?.querySelector('h2') && doc.body?.querySelector('br') && doc.body?.querySelector('hr')) && (doc.body?.querySelectorAll('p').length ?? 0) >= 2 },
              ]);
            },
          },
        ],
      };

    case 'strong':
    case 'b':
    case 'em':
      return {
        mcqs: [
          {
            question: { en: 'How do <strong> and <b> differ?', ar: 'ما الفرق بين <strong> و <b>؟' },
            options: [
              { en: '<strong> carries semantic importance; <b> draws attention stylistically', ar: 'يحمل <strong> أهمية دلالية بينما يركز <b> على الشكل البصري' },
              { en: '<b> only works inside <head>', ar: 'يعمل <b> داخل <head> فقط' },
              { en: '<strong> turns text italic', ar: 'يجعل <strong> النص مائلاً' },
            ],
            correctIndex: 0,
            explanation: { en: 'Assistive tech treats <strong> as high importance.', ar: 'تتعامل قارئات الشاشة مع <strong> على أنه نص ذو أهمية عالية.' },
          },
          {
            question: { en: 'Which tag highlights search matches or relevant words visually?', ar: 'أي وسم يُستخدم لتظليل كلمات مطابقة أو مهمة مثل نتائج البحث؟' },
            options: [
              { en: '<small>', ar: '<small>' },
              { en: '<mark>', ar: '<mark>' },
              { en: '<sub>', ar: '<sub>' },
            ],
            correctIndex: 1,
            explanation: { en: '<mark> marks highlighted reference text.', ar: 'يُبرز <mark> النص المظلّل بلون مميز.' },
          },
          {
            question: { en: 'Which tag formats chemical subscripts like H2O?', ar: 'أي وسم يكتب الأرقام السفلية في الصيغ الكيميائية مثل H2O؟' },
            options: [
              { en: '<sup>', ar: '<sup>' },
              { en: '<u>', ar: '<u>' },
              { en: '<sub>', ar: '<sub>' },
            ],
            correctIndex: 2,
            explanation: { en: '<sub> lowers text below the baseline; <sup> raises exponents.', ar: 'يخفض <sub> النص للأسفل بينما يرفع <sup> الأسس للأعلى.' },
          },
          {
            question: { en: 'When should you prefer <s> over <del>?', ar: 'متى نستخدم <s> بدلاً من <del>؟' },
            options: [
              { en: 'For outdated prices/info rather than tracked document edits', ar: 'للأسعار أو المعلومات القديمة غير الدقيقة بدلاً من تتبع تحرير المستند' },
              { en: 'For creating headings', ar: 'لإنشاء العناوين' },
              { en: 'For italics', ar: 'للخط المائل' },
            ],
            correctIndex: 0,
            explanation: { en: '<s> denotes obsolete content; <del> denotes tracked deletions.', ar: 'يشير <s> لمعلومة لم تعد دقيقة، و <del> لحذف موثق.' },
          },
        ],
        codeTasks: [
          {
            prompt: { en: 'Write a warning <p> containing both <strong> and <em>.', ar: 'اكتب فقرة تحذير <p> تحتوي على <strong> و <em>.' },
            language: 'html',
            validate: (code, lang) => {
              const doc = makeDoc(code.html);
              return makeResult([
                { label: msg(lang, 'Has <p> with <strong> and <em>', 'يحتوي <p> على <strong> و <em>'), ok: Boolean(doc.body?.querySelector('p strong') && doc.body?.querySelector('p em')) },
              ]);
            },
          },
          {
            prompt: { en: 'Write a search result sentence highlighting a keyword inside <mark>.', ar: 'اكتب جملة تظلّل كلمة مفتاحية باستخدام <mark>.' },
            language: 'html',
            validate: (code, lang) => {
              const doc = makeDoc(code.html);
              return makeResult([
                { label: msg(lang, 'Contains non-empty <mark>', 'يحتوي على وسم <mark> غير فارغ'), ok: Boolean(doc.body?.querySelector('mark')?.textContent?.trim()) },
              ]);
            },
          },
          {
            prompt: { en: 'Write a revision notice showing old text inside <del> and new text inside <ins>.', ar: 'اكتب تعديلاً يعرض النص القديم داخل <del> والجديد داخل <ins>.' },
            language: 'html',
            validate: (code, lang) => {
              const doc = makeDoc(code.html);
              return makeResult([
                { label: msg(lang, 'Contains both <del> and <ins>', 'يحتوي على <del> و <ins>'), ok: Boolean(doc.body?.querySelector('del')?.textContent?.trim() && doc.body?.querySelector('ins')?.textContent?.trim()) },
              ]);
            },
          },
          {
            prompt: { en: 'Write both a chemical formula using <sub> and a power exponent using <sup>.', ar: 'اكتب صيغة كيميائية باستخدام <sub> وأساً رياضياً باستخدام <sup>.' },
            language: 'html',
            validate: (code, lang) => {
              const doc = makeDoc(code.html);
              return makeResult([
                { label: msg(lang, 'Uses <sub> and <sup>', 'يستخدم <sub> و <sup>'), ok: Boolean(doc.body?.querySelector('sub') && doc.body?.querySelector('sup')) },
              ]);
            },
          },
          {
            prompt: { en: 'Create a product price card using <s> for the old price, <strong> for the new price, and <small> for terms.', ar: 'أنشئ بطاقة سعر تستخدم <s> للسعر القديم و <strong> للجديد و <small> للشروط.' },
            language: 'html',
            validate: (code, lang) => {
              const doc = makeDoc(code.html);
              return makeResult([
                { label: msg(lang, 'Uses <s>, <strong>, and <small>', 'يستخدم <s> و <strong> و <small>'), ok: Boolean(doc.body?.querySelector('s') && doc.body?.querySelector('strong') && doc.body?.querySelector('small')) },
              ]);
            },
          },
        ],
      };

    case 'abbr':
      return {
        mcqs: [
          {
            question: { en: 'Which element marks a short inline quote inside a paragraph?', ar: 'أي وسم يحيط باقتباس قصير داخل السطر؟' },
            options: [
              { en: '<q>', ar: '<q>' },
              { en: '<abbr>', ar: '<abbr>' },
              { en: '<address>', ar: '<address>' },
            ],
            correctIndex: 0,
            explanation: { en: '<q> adds localized quotation marks around short inline quotes.', ar: 'يحيط <q> الاقتباسات القصيرة السطرية بعلامات تنصيص تلقائياً.' },
          },
          {
            question: { en: 'What should you place inside <cite>?', ar: 'ما الذي يُوضع داخل وسم <cite>؟' },
            options: [
              { en: 'The title of the referenced book, specification, or article', ar: 'عنوان الكتاب أو المقال أو المرجع المقتبس منه' },
              { en: 'Only a street number', ar: 'رقم الشارع فقط' },
              { en: 'A CSS color code', ar: 'كود لون CSS' },
            ],
            correctIndex: 0,
            explanation: { en: '<cite> identifies the title of a creative work or specification.', ar: 'يمثل <cite> اسم العمل المرجعي.' },
          },
          {
            question: { en: 'Which tag highlights the defining occurrence of a new term in prose?', ar: 'أي وسم يحدد الموضع الذي يُعرَّف فيه مصطلح جديد لأول مرة؟' },
            options: [
              { en: '<dfn>', ar: '<dfn>' },
              { en: '<address>', ar: '<address>' },
              { en: '<hr>', ar: '<hr>' },
            ],
            correctIndex: 0,
            explanation: { en: '<dfn> marks the defining instance of a technical term.', ar: 'يميز <dfn> تعريف المصطلح في السياق.' },
          },
          {
            question: { en: 'What content belongs inside <address>?', ar: 'ما المحتوى المناسب لوسم <address>؟' },
            options: [
              { en: 'Author or organization contact info (email, URL, physical address)', ar: 'بيانات التواصل مع الكاتب أو الجهة' },
              { en: 'Every date in a blog post', ar: 'جميع التواريخ في المقال' },
              { en: 'Keyboard shortcuts', ar: 'اختصارات لوحة المفاتيح' },
            ],
            correctIndex: 0,
            explanation: { en: '<address> semantically holds contact details for an article or document.', ar: 'يُخصَّص <address> لمعلومات التواصل فقط.' },
          },
        ],
        codeTasks: [
          {
            prompt: { en: 'Write <abbr title="Cascading Style Sheets">CSS</abbr> inside a <p> sentence.', ar: 'اكتب <abbr title="Cascading Style Sheets">CSS</abbr> داخل جملة في <p>.' },
            language: 'html',
            validate: (code, lang) => {
              const doc = makeDoc(code.html);
              const el = doc.body?.querySelector('abbr[title]');
              return makeResult([
                { label: msg(lang, 'Has <abbr> with non-empty title attribute', 'يحتوي <abbr> على سمة title غير فارغة'), ok: Boolean(el && (el.getAttribute('title') || '').trim().length > 0) },
              ]);
            },
          },
          {
            prompt: { en: 'Define a term in prose using <dfn> inside a <p>.', ar: 'عرّف مصطلحاً داخل فقرة <p> باستخدام <dfn>.' },
            language: 'html',
            validate: (code, lang) => {
              const doc = makeDoc(code.html);
              return makeResult([
                { label: msg(lang, 'Includes <dfn> inside <p>', 'يحتوي <p> على وسم <dfn>'), ok: Boolean(doc.body?.querySelector('p dfn')?.textContent?.trim()) },
              ]);
            },
          },
          {
            prompt: { en: 'Write a short inline quote using <q> inside a paragraph.', ar: 'اكتب اقتباساً سطرياً قصيراً داخل فقرة باستخدام <q>.' },
            language: 'html',
            validate: (code, lang) => {
              const doc = makeDoc(code.html);
              return makeResult([
                { label: msg(lang, 'Contains non-empty <q>', 'يحتوي على وسم <q> غير فارغ'), ok: Boolean(doc.body?.querySelector('q')?.textContent?.trim()) },
              ]);
            },
          },
          {
            prompt: { en: 'Write a <blockquote> containing a quote and citing a source with <cite>.', ar: 'اكتب <blockquote> يحتوي على اقتباس ووسم <cite> للمصدر.' },
            language: 'html',
            validate: (code, lang) => {
              const doc = makeDoc(code.html);
              return makeResult([
                { label: msg(lang, 'Includes <blockquote> and <cite>', 'يحتوي على <blockquote> و <cite>'), ok: Boolean(doc.body?.querySelector('blockquote')?.textContent?.trim() && doc.body?.querySelector('cite')?.textContent?.trim()) },
              ]);
            },
          },
          {
            prompt: { en: 'Add an <address> block containing an email link (<a href="mailto:...">).', ar: 'أضف قسم <address> يحتوي على رابط بريد إلكتروني.' },
            language: 'html',
            validate: (code, lang) => {
              const doc = makeDoc(code.html);
              return makeResult([
                { label: msg(lang, 'Has <address> with mailto link or contact info', 'يحتوي <address> على رابط بريد أو تواصل'), ok: Boolean(doc.body?.querySelector('address a[href^="mailto:"]')) },
              ]);
            },
          },
        ],
      };

    case 'code':
    case 'pre':
      return {
        mcqs: [
          {
            question: { en: 'Why wrap <code> inside <pre> for multi-line code snippets?', ar: 'لماذا نضع <code> داخل <pre> عند عرض كود من عدة أسطر؟' },
            options: [
              { en: '<pre> preserves exact indentation spaces and line breaks', ar: 'يحافظ <pre> على المسافات والأسطر الجديدة كما هي' },
              { en: '<pre> hides the code from search engines', ar: 'يخفي الكود عن محركات البحث' },
              { en: '<pre> executes JavaScript automatically', ar: 'يشغّل JavaScript تلقائياً' },
            ],
            correctIndex: 0,
            explanation: { en: 'HTML collapses whitespace normally; <pre> keeps indentation intact.', ar: 'تدمج HTML المسافات إلا داخل <pre> الذي يحفظها بدقة.' },
          },
          {
            question: { en: 'Which tag represents keyboard input such as Ctrl+C?', ar: 'أي وسم يمثل ضغطات لوحة المفاتيح مثل Ctrl+C؟' },
            options: [
              { en: '<samp>', ar: '<samp>' },
              { en: '<kbd>', ar: '<kbd>' },
              { en: '<var>', ar: '<var>' },
            ],
            correctIndex: 1,
            explanation: { en: '<kbd> denotes user keyboard or voice input.', ar: 'يمثل <kbd> مفاتيح الإدخال من المستخدم.' },
          },
          {
            question: { en: 'What does <bdi> do when mixing Arabic and English text?', ar: 'ما وظيفة وسم <bdi> عند خلط النص العربي والإنجليزي؟' },
            options: [
              { en: 'Isolates text direction so surrounding punctuation stays ordered', ar: 'يعزل اتجاه النص لمنع انقلاب الترقيم أو تداخل الاتجاهين' },
              { en: 'Translates words automatically', ar: 'يترجم الكلمات تلقائياً' },
              { en: 'Makes text bold italic', ar: 'يجعل الخط عريضاً ومائلاً' },
            ],
            correctIndex: 0,
            explanation: { en: '<bdi> prevents bidirectional ordering glitches around mixed usernames or IDs.', ar: 'يحمي <bdi> ترتيب الجمل عند وجود أسماء أجنبية داخل العربية.' },
          },
          {
            question: { en: 'Which tags pair inside <ruby> to provide phonetic guides?', ar: 'ما الوسوم التي تعمل مع <ruby> لإظهار النطق فوق النص؟' },
            options: [
              { en: '<rt> and <rp>', ar: '<rt> و <rp>' },
              { en: '<dt> and <dd>', ar: '<dt> و <dd>' },
              { en: '<th> and <td>', ar: '<th> و <td>' },
            ],
            correctIndex: 0,
            explanation: { en: '<rt> holds the ruby text annotation and <rp> holds fallback parentheses.', ar: 'يحمل <rt> النطق التوضيحي و <rp> الأقواس البديلة.' },
          },
        ],
        codeTasks: [
          {
            prompt: { en: 'Write a keyboard shortcut hint using two <kbd> tags (e.g. Ctrl + C).', ar: 'اكتب تلميح اختصار لوحة مفاتيح باستخدام وسمي <kbd> (مثل Ctrl + C).' },
            language: 'html',
            validate: (code, lang) => {
              const doc = makeDoc(code.html);
              return makeResult([
                { label: msg(lang, 'Has at least two <kbd> tags', 'يحتوي على وسمي <kbd> على الأقل'), ok: (doc.body?.querySelectorAll('kbd').length ?? 0) >= 2 },
              ]);
            },
          },
          {
            prompt: { en: 'Write a multi-line code snippet wrapped in <pre><code>...</code></pre>.', ar: 'اكتب مقطع كود مغلفاً بوسمي <pre><code>...</code></pre>.' },
            language: 'html',
            validate: (code, lang) => {
              const doc = makeDoc(code.html);
              return makeResult([
                { label: msg(lang, 'Has <code> inside <pre>', 'يحتوي على <code> داخل <pre>'), ok: Boolean(doc.body?.querySelector('pre > code')?.textContent?.trim()) },
              ]);
            },
          },
          {
            prompt: { en: 'Create a CLI explanation combining <var> for a variable and <samp> for output.', ar: 'أنشئ شرحاً لأمر برمجي يدمج <var> للمتغير و <samp> للمخرجات.' },
            language: 'html',
            validate: (code, lang) => {
              const doc = makeDoc(code.html);
              return makeResult([
                { label: msg(lang, 'Includes <var> and <samp>', 'يحتوي على <var> و <samp>'), ok: Boolean(doc.body?.querySelector('var') && doc.body?.querySelector('samp')) },
              ]);
            },
          },
          {
            prompt: { en: 'Wrap a username inside <bdi> inside a paragraph with <span>.', ar: 'اعزل اسم مستخدم داخل <bdi> ضمن فقرة تستخدم <span>.' },
            language: 'html',
            validate: (code, lang) => {
              const doc = makeDoc(code.html);
              return makeResult([
                { label: msg(lang, 'Contains <bdi> and <span>', 'يحتوي على <bdi> و <span>'), ok: Boolean(doc.body?.querySelector('bdi')?.textContent?.trim() && doc.body?.querySelector('span')) },
              ]);
            },
          },
          {
            prompt: { en: 'Create a <ruby> annotation containing <rt> and fallback <rp> parentheses.', ar: 'أنشئ حاشية نطق <ruby> تحتوي على <rt> وأقواس بديلة <rp>.' },
            language: 'html',
            validate: (code, lang) => {
              const doc = makeDoc(code.html);
              return makeResult([
                { label: msg(lang, 'Contains <ruby> with <rt> and <rp>', 'يحتوي <ruby> على <rt> و <rp>'), ok: Boolean(doc.body?.querySelector('ruby rt') && doc.body?.querySelector('ruby rp')) },
              ]);
            },
          },
        ],
      };

    default:
      break;
  }

  // Universal crisp tag-aware builder for all remaining HTML tags (Ch 02-12)
  return {
    mcqs: [
      {
        question: {
          en: `What is the primary semantic role of <${clean}> in HTML5?`,
          ar: `ما هو الدور الدلالي الأساسي لوسم <${clean}> في HTML5؟`,
        },
        options: [
          { en: `${lessonTitleEn} structure & browser semantics`, ar: `تنظيم بنية ${lessonTitleAr} وإيضاح الدلالة للمتصفح` },
          { en: 'Running SQL database migrations', ar: 'تشغيل ترحيلات قواعد البيانات' },
          { en: 'Encrypting TLS certificates', ar: 'تشفير شهادات الأمان' },
        ],
        correctIndex: 0,
        explanation: {
          en: `<${clean}> communicates structure and semantics directly to browsers and assistive technology.`,
          ar: `يوصل <${clean}> البنية والمعنى الصحيح للمتصفح وقارئات الشاشة.`,
        },
      },
      {
        question: {
          en: `Which practice improves accessibility when writing <${clean}>?`,
          ar: `ما الممارسة التي تحسّن إتاحة الوصول عند استخدام <${clean}>؟`,
        },
        options: [
          { en: 'Using vague placeholder text only', ar: 'الاكتفاء بنصوص مبهمة' },
          { en: 'Supplying meaningful text, labels, and valid HTML attributes', ar: 'توفير نصوص واضحة وسمات HTML صالحة وموصوفة' },
          { en: 'Replacing semantic tags with empty <div> elements', ar: 'استبدال الوسوم الدلالية بـ <div> فارغة' },
        ],
        correctIndex: 1,
        explanation: {
          en: 'Valid semantic markup paired with clear labels makes content accessible to all users.',
          ar: 'الالتزام بالوسوم الدلالية والسمات الواضحة يضمن تجربة وصول شاملة.',
        },
      },
      {
        question: {
          en: `How does the browser handle <${clean}> if required attributes or nesting rules are broken?`,
          ar: `ماذا يحدث إذا أُسيء استخدام سمات أو تداخل <${clean}>؟`,
        },
        options: [
          { en: 'Semantics, layout, or assistive screen reader behavior degrades', ar: 'تتأثر الدلالة أو التنسيق أو قراءة قارئات الشاشة سلباً' },
          { en: 'The computer shuts down', ar: 'يتوقف الجهاز عن العمل' },
          { en: 'CSS turns into JavaScript', ar: 'تتحول CSS إلى JavaScript' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Respecting parent/child nesting and required attributes keeps DOM behavior predictable.',
          ar: 'احترام قواعد التداخل والسمات المطلوبة يحفظ عمل الشجرة بسلاسة.',
        },
      },
      {
        question: {
          en: `Which approach avoids common mistakes with <${clean}>?`,
          ar: `أي أسلوب يتفادى الأخطاء الشائعة مع <${clean}>؟`,
        },
        options: [
          { en: 'Choosing tags for visual appearance alone', ar: 'اختيار الوسم بناءً على شكله فقط' },
          { en: 'Omission of closing tags on paired blocks', ar: 'حذف وسوم الإغلاق' },
          { en: 'Matching semantic HTML structure with clean attributes', ar: 'تطابق البنية الدلالية الصحيحة مع السمات المناسبة' },
        ],
        correctIndex: 2,
        explanation: {
          en: 'Write semantic HTML matching content meaning rather than using elements purely for styling.',
          ar: 'اكتب الوسم وفق معناه الدلالي وليس لشكله الظاهري فقط.',
        },
      },
    ],
    codeTasks: [
      {
        prompt: {
          en: `Write a clean HTML snippet using <${clean}> with meaningful inner text or attributes.`,
          ar: `اكتب مقطع HTML صحيحاً يستخدم <${clean}> مع نص أو سمات واضحة.`,
        },
        language: 'html',
        validate: (code, lang) => {
          const doc = makeDoc(code.html);
          const el = doc.querySelector(clean);
          const templates = Array.from(doc.querySelectorAll('template'));
          const found = Boolean(el) || templates.some((t) => Boolean(t.content.querySelector(clean)));
          return makeResult([
            { label: msg(lang, `Includes valid <${clean}> element`, `يحتوي على عنصر <${clean}> صالح`), ok: found },
          ]);
        },
      },
      {
        prompt: {
          en: `Add an id or class attribute on <${clean}> and wrap it inside a valid parent container.`,
          ar: `أضف سمة id أو class إلى <${clean}> وضعه داخل حاوية صالحة.`,
        },
        language: 'html',
        validate: (code, lang) => {
          const doc = makeDoc(code.html);
          const el = doc.querySelector(`${clean}[id], ${clean}[class]`) || doc.querySelector(clean);
          const hasAttr = Boolean(el && (el.hasAttribute('id') || el.hasAttribute('class')));
          return makeResult([
            { label: msg(lang, `Includes <${clean}>`, `يحتوي على <${clean}>`), ok: Boolean(el) },
            { label: msg(lang, 'Includes id or class attribute', 'يحتوي على سمة id أو class'), ok: hasAttr },
          ]);
        },
      },
      {
        prompt: {
          en: `Combine <${clean}> with a clear heading (<h2> or <label> or <caption>) describing its purpose.`,
          ar: `ادمج <${clean}> مع عنوان وصفي واضح (<h2> أو <label> أو <caption>).`,
        },
        language: 'html',
        validate: (code, lang) => {
          const doc = makeDoc(code.html);
          const hasEl = Boolean(doc.querySelector(clean));
          const hasLabel = Boolean(doc.querySelector('h1, h2, h3, label, caption, summary, legend, figcaption'));
          return makeResult([
            { label: msg(lang, `Contains <${clean}>`, `يحتوي على <${clean}>`), ok: hasEl },
            { label: msg(lang, 'Paired with a descriptive heading or label', 'مقترن بعنوان أو تسمية واضحة'), ok: hasLabel },
          ]);
        },
      },
      {
        prompt: {
          en: `Create a two-part HTML example featuring <${clean}> and at least two text or child items.`,
          ar: `أنشئ مثال HTML مكوّناً من جزئين يستخدم <${clean}> مع عنصرين أو نصين واضحين.`,
        },
        language: 'html',
        validate: (code, lang) => {
          const doc = makeDoc(code.html);
          const hasEl = Boolean(doc.querySelector(clean));
          const totalEls = doc.body?.querySelectorAll('*').length ?? 0;
          return makeResult([
            { label: msg(lang, `Includes <${clean}>`, `يحتوي على <${clean}>`), ok: hasEl },
            { label: msg(lang, 'Contains multi-element structure (2+ elements)', 'يحتوي على بنية متعددة العناصر'), ok: totalEls >= 2 },
          ]);
        },
      },
      {
        prompt: {
          en: `Build a complete mini HTML component demonstrating ${lessonTitleEn} using <${clean}> inside semantic structure.`,
          ar: `ابنِ مكوّن HTML متكاملاً يطبق درس ${lessonTitleAr} مستخدماً <${clean}> داخل بنية دلالية.`,
        },
        language: 'html',
        validate: (code, lang) => {
          const doc = makeDoc(code.html);
          const hasEl = Boolean(doc.querySelector(clean));
          const textLen = (doc.body?.textContent || '').trim().length;
          return makeResult([
            { label: msg(lang, `Includes <${clean}>`, `يحتوي على <${clean}>`), ok: hasEl },
            { label: msg(lang, 'Includes complete readable content', 'يحتوي على محتوى نصي مكتمل'), ok: textLen >= 5 || Boolean(doc.querySelector('input, img, video, audio, svg, canvas, iframe, progress, meter')) },
          ]);
        },
      },
    ],
  };
};

// Tailored 5-MCQ + 5-Code-Task overrides for HTML lessons with tag pairs or specialized attributes
const SPECIAL_LESSON_CODE_TASKS: Record<string, Omit<CodeQuizQuestion, 'id'>[]> = {
  'html-02-05': [
    {
      prompt: { en: 'Create a <dl> description list with one <dt> term named "HTML".', ar: 'أنشئ قائمة وصف <dl> بها مصطلح <dt> باسم "HTML".' },
      language: 'html',
      validate: (code, lang) => {
        const doc = makeDoc(code.html);
        return makeResult([{ label: msg(lang, 'Has <dl> with <dt>HTML</dt>', 'يحتوي <dl> على <dt>HTML</dt>'), ok: Array.from(doc.querySelectorAll('dl dt')).some((el) => /html/i.test(el.textContent || '')) }]);
      },
    },
    {
      prompt: { en: 'Build a <dl> glossary containing two <dt> terms ("DOM" and "API") with matching <dd> items.', ar: 'أنشئ قائمة <dl> تحتوي على مصطلحي <dt> (DOM و API) مع شرح <dd> لكل منهما.' },
      language: 'html',
      validate: (code, lang) => {
        const doc = makeDoc(code.html);
        return makeResult([
          { label: msg(lang, 'Has 2+ <dt> inside <dl>', 'يحتوي على مصطلحي <dt> داخل <dl>'), ok: doc.querySelectorAll('dl dt').length >= 2 },
          { label: msg(lang, 'Has 2+ <dd> inside <dl>', 'يحتوي على شرحي <dd> داخل <dl>'), ok: doc.querySelectorAll('dl dd').length >= 2 },
        ]);
      },
    },
    {
      prompt: { en: 'Group two synonymous <dt> terms followed by one shared <dd> inside <dl>.', ar: 'اجمع مصطلحي <dt> متتاليين يتبعهما شرح <dd> مشترك داخل <dl>.' },
      language: 'html',
      validate: (code, lang) => {
        const doc = makeDoc(code.html);
        return makeResult([{ label: msg(lang, 'Has 2 <dt> and 1+ <dd> in <dl>', 'يحتوي <dl> على مصطلحين <dt> و <dd>'), ok: doc.querySelectorAll('dl dt').length >= 2 && doc.querySelectorAll('dl dd').length >= 1 }]);
      },
    },
    {
      prompt: { en: 'Add a section <h2>FAQ</h2> followed by a <dl> containing a question in <dt> and answer in <dd>.', ar: 'أضف عنوان <h2>FAQ</h2> تليه قائمة <dl> فيها سؤال داخل <dt> وإجابة داخل <dd>.' },
      language: 'html',
      validate: (code, lang) => {
        const doc = makeDoc(code.html);
        return makeResult([
          { label: msg(lang, 'Has <h2> and <dl>', 'يحتوي على <h2> و <dl>'), ok: Boolean(doc.querySelector('h2') && doc.querySelector('dl')) },
          { label: msg(lang, 'Contains <dt> and <dd>', 'يحتوي على <dt> و <dd>'), ok: Boolean(doc.querySelector('dl dt') && doc.querySelector('dl dd')) },
        ]);
      },
    },
    {
      prompt: { en: 'Create a 3-term metadata <dl> list describing Author, License, and Version.', ar: 'أنشئ قائمة بيانات <dl> من 3 مصطلحات للمؤلف والرخصة والإصدار.' },
      language: 'html',
      validate: (code, lang) => {
        const doc = makeDoc(code.html);
        return makeResult([{ label: msg(lang, 'Has 3 <dt> and 3 <dd> inside <dl>', 'يحتوي <dl> على 3 <dt> و 3 <dd>'), ok: doc.querySelectorAll('dl dt').length >= 3 && doc.querySelectorAll('dl dd').length >= 3 }]);
      },
    },
  ],
  'html-04-01': [
    {
      prompt: { en: 'Create a link <a href="https://example.com">Visit</a>.', ar: 'أنشئ رابطاً <a href="https://example.com">Visit</a>.' },
      language: 'html',
      validate: (code, lang) => {
        const doc = makeDoc(code.html);
        return makeResult([{ label: msg(lang, 'Has <a> with valid href', 'يحتوي على <a> مع href صالح'), ok: Boolean(doc.querySelector('a[href^="http"]')?.textContent?.trim()) }]);
      },
    },
    {
      prompt: { en: 'Create a safe external link opening in a new tab using target="_blank" and rel="noopener noreferrer".', ar: 'أنشئ رابطاً خارجياً يفتح في تبويب جديد بأمان باستخدام target="_blank" و rel="noopener noreferrer".' },
      language: 'html',
      validate: (code, lang) => {
        const doc = makeDoc(code.html);
        const a = doc.querySelector('a[target="_blank"]');
        return makeResult([{ label: msg(lang, 'Has target="_blank" and rel="noopener..."', 'يحمل target="_blank" و rel="noopener"'), ok: Boolean(a && (a.getAttribute('rel') || '').toLowerCase().includes('noopener')) }]);
      },
    },
    {
      prompt: { en: 'Create an internal anchor link jumping to "#pricing".', ar: 'أنشئ رابطاً داخلياً يقفز إلى القسم "#pricing".' },
      language: 'html',
      validate: (code, lang) => {
        const doc = makeDoc(code.html);
        return makeResult([{ label: msg(lang, 'Has <a href="#pricing">', 'يحتوي على <a href="#pricing">'), ok: Boolean(doc.querySelector('a[href="#pricing"]')) }]);
      },
    },
    {
      prompt: { en: 'Create an email link using mailto: (e.g. mailto:hi@codepath.dev).', ar: 'أنشئ رابط بريد إلكتروني يستخدم mailto:.' },
      language: 'html',
      validate: (code, lang) => {
        const doc = makeDoc(code.html);
        return makeResult([{ label: msg(lang, 'Has mailto: link', 'يحتوي على رابط mailto:'), ok: Boolean(doc.querySelector('a[href^="mailto:"]')) }]);
      },
    },
    {
      prompt: { en: 'Create an <area shape="rect" coords="0,0,100,50" href="#top" alt="Top"> inside a <map>.', ar: 'أنشئ <area shape="rect" coords="0,0,100,50" href="#top" alt="Top"> داخل <map>.' },
      language: 'html',
      validate: (code, lang) => {
        const doc = makeDoc(code.html);
        const area = doc.querySelector('map area[shape][coords][href][alt]');
        return makeResult([{ label: msg(lang, 'Has <area> with shape, coords, href, and alt', 'يحتوي <area> على السمات المطلوبة'), ok: Boolean(area) }]);
      },
    },
  ],
  'html-08-01': [
    {
      prompt: { en: 'Create a <table> with a <caption> title inside it.', ar: 'أنشئ جدول <table> وبداخله عنوان <caption>.' },
      language: 'html',
      validate: (code, lang) => {
        const doc = makeDoc(code.html);
        return makeResult([{ label: msg(lang, 'Has <table> containing <caption>', 'يحتوي <table> على <caption>'), ok: Boolean(doc.querySelector('table > caption')?.textContent?.trim()) }]);
      },
    },
    {
      prompt: { en: 'Build a <table> with 2 <tr> rows and 2 <td> cells in each row.', ar: 'ابنِ جدول <table> من صفين <tr> وفي كل صف خليتي <td>.' },
      language: 'html',
      validate: (code, lang) => {
        const doc = makeDoc(code.html);
        return makeResult([
          { label: msg(lang, 'Has 2+ <tr> rows', 'يحتوي على صفين <tr>'), ok: doc.querySelectorAll('table tr').length >= 2 },
          { label: msg(lang, 'Has 4+ <td> cells', 'يحتوي على 4 خلايا <td>'), ok: doc.querySelectorAll('table td').length >= 4 },
        ]);
      },
    },
    {
      prompt: { en: 'Create a <table> header row using <th> tags with scope="col".', ar: 'أنشئ صف ترويسة جدول باستخدام <th> مع سمة scope="col".' },
      language: 'html',
      validate: (code, lang) => {
        const doc = makeDoc(code.html);
        return makeResult([{ label: msg(lang, 'Has <th scope="col">', 'يحتوي على <th scope="col">'), ok: doc.querySelectorAll('table th[scope="col"]').length >= 2 }]);
      },
    },
    {
      prompt: { en: 'Structure a <table> with <thead> and <tbody> sections.', ar: 'نظّم جدولاً باستخدام قسمي <thead> و <tbody>.' },
      language: 'html',
      validate: (code, lang) => {
        const doc = makeDoc(code.html);
        return makeResult([{ label: msg(lang, 'Has <thead> and <tbody>', 'يحتوي على <thead> و <tbody>'), ok: Boolean(doc.querySelector('table thead') && doc.querySelector('table tbody')) }]);
      },
    },
    {
      prompt: { en: 'Build a complete accessible data table with <caption>, <thead>, <tbody>, <th>, and <td>.', ar: 'أنشئ جدول بيانات متكاملاً يضم <caption> و <thead> و <tbody> و <th> و <td>.' },
      language: 'html',
      validate: (code, lang) => {
        const doc = makeDoc(code.html);
        return makeResult([
          { label: msg(lang, 'Has <caption>, <thead>, and <tbody>', 'يحتوي على <caption> و <thead> و <tbody>'), ok: Boolean(doc.querySelector('table caption') && doc.querySelector('table thead th') && doc.querySelector('table tbody td')) },
        ]);
      },
    },
  ],
  'css-box-model': [
    {
      prompt: { en: 'Apply universal box-sizing: border-box in CSS.', ar: 'طبّق خاصية box-sizing: border-box على جميع العناصر في CSS.' },
      language: 'css',
      validate: (code, lang) => makeResult([{ label: msg(lang, 'Sets box-sizing: border-box', 'يضبط box-sizing: border-box'), ok: /box-sizing\s*:\s*border-box/i.test(code.css) }]),
    },
    {
      prompt: { en: 'Style a .card class with 16px padding and a 1px solid #111111 border.', ar: 'نسّق صنف .card بحشوة padding: 16px وحدود 1px solid #111111.' },
      language: 'css',
      validate: (code, lang) => makeResult([
        { label: msg(lang, 'Has .card rule with padding', 'يضبط padding لصنف .card'), ok: /\.card\b[\s\S]*padding\s*:/i.test(code.css) },
        { label: msg(lang, 'Has border property', 'يحتوي على خاصية border'), ok: /border\s*:/i.test(code.css) },
      ]),
    },
    {
      prompt: { en: 'Make .bar a flex container using display: flex and gap: 12px.', ar: 'اجعل .bar حاوية مرنة باستخدام display: flex و gap: 12px.' },
      language: 'css',
      validate: (code, lang) => makeResult([
        { label: msg(lang, 'Uses display: flex', 'يستخدم display: flex'), ok: /display\s*:\s*flex/i.test(code.css) },
        { label: msg(lang, 'Sets gap property', 'يضبط خاصية gap'), ok: /gap\s*:/i.test(code.css) },
      ]),
    },
    {
      prompt: { en: 'Center items both horizontally and vertically in .center using Flexbox.', ar: 'وسّط العناصر أفقياً وعمودياً داخل .center باستخدام Flexbox.' },
      language: 'css',
      validate: (code, lang) => makeResult([
        { label: msg(lang, 'Uses display: flex', 'يستخدم display: flex'), ok: /display\s*:\s*flex/i.test(code.css) },
        { label: msg(lang, 'Sets justify-content: center and align-items: center', 'يضبط justify-content و align-items على center'), ok: /justify-content\s*:\s*center/i.test(code.css) && /align-items\s*:\s*center/i.test(code.css) },
      ]),
    },
    {
      prompt: { en: 'Create a responsive header rule (.nav) with display: flex, justify-content: space-between, and padding.', ar: 'أنشئ تنسيق شريط علوي .nav يستخدم display: flex و justify-content: space-between و padding.' },
      language: 'css',
      validate: (code, lang) => makeResult([
        { label: msg(lang, 'Uses display: flex + space-between + padding', 'يستخدم display: flex و space-between و padding'), ok: /display\s*:\s*flex/i.test(code.css) && /justify-content\s*:\s*space-between/i.test(code.css) && /padding\s*:/i.test(code.css) },
      ]),
    },
  ],
  'css-grid': [
    {
      prompt: { en: 'Enable CSS Grid on .grid with display: grid.', ar: 'فعّل CSS Grid على الصنف .grid عبر display: grid.' },
      language: 'css',
      validate: (code, lang) => makeResult([{ label: msg(lang, 'Applies display: grid to .grid', 'يطبق display: grid على .grid'), ok: /\.grid\b[\s\S]*display\s*:\s*grid/i.test(code.css) }]),
    },
    {
      prompt: { en: 'Define a 3-equal-column grid using repeat(3, 1fr).', ar: 'عرّف شبكة من 3 أعمدة متساوية باستخدام repeat(3, 1fr).' },
      language: 'css',
      validate: (code, lang) => makeResult([{ label: msg(lang, 'Uses grid-template-columns: repeat(3, 1fr)', 'يستخدم repeat(3, 1fr)'), ok: /grid-template-columns\s*:[^;]*repeat\s*\(\s*3\s*,\s*1fr\s*\)/i.test(code.css) }]),
    },
    {
      prompt: { en: 'Add a 16px gutter between grid cells using gap.', ar: 'أضف فراغاً بمقدار 16px بين خلايا الشبكة عبر gap.' },
      language: 'css',
      validate: (code, lang) => makeResult([{ label: msg(lang, 'Sets gap: 16px', 'يضبط gap: 16px'), ok: /gap\s*:\s*16px/i.test(code.css) }]),
    },
    {
      prompt: { en: 'Build an auto-fitting responsive grid with repeat(auto-fit, minmax(160px, 1fr)).', ar: 'ابنِ شبكة متجاوبة تلقائياً عبر repeat(auto-fit, minmax(160px, 1fr)).' },
      language: 'css',
      validate: (code, lang) => makeResult([{ label: msg(lang, 'Uses auto-fit with minmax()', 'يستخدم auto-fit و minmax()'), ok: /auto-fit/i.test(code.css) && /minmax\s*\(/i.test(code.css) }]),
    },
    {
      prompt: { en: 'Create a dashboard grid with display: grid, fractional columns (fr), and gap.', ar: 'أنشئ شبكة لوحة تحكم فيها display: grid ووحدات fr ومسافات gap.' },
      language: 'css',
      validate: (code, lang) => makeResult([{ label: msg(lang, 'Combines grid, fr units, and gap', 'يدمج grid و fr و gap'), ok: /display\s*:\s*grid/i.test(code.css) && /\d+fr/i.test(code.css) && /gap\s*:/i.test(code.css) }]),
    },
  ],
  'js-essentials': [
    {
      prompt: { en: 'Declare a constant variable called appName using const and log it with console.log().', ar: 'عرّف ثابتاً باسم appName باستخدام const واطبعه عبر console.log().' },
      language: 'javascript',
      validate: (code, lang) => makeResult([
        { label: msg(lang, 'Declares const appName', 'يعرّف const appName'), ok: /\bconst\s+appName\s*=/.test(code.js) },
        { label: msg(lang, 'Logs with console.log()', 'يطبع عبر console.log()'), ok: /console\.log\s*\(/.test(code.js) },
      ]),
    },
    {
      prompt: { en: 'Write a function add(a, b) that returns a + b.', ar: 'اكتب دالة add(a, b) تعيد مجموع a + b.' },
      language: 'javascript',
      validate: (code, lang) => makeResult([
        { label: msg(lang, 'Defines function add', 'يعرّف دالة add'), ok: /(function\s+add\s*\(|const\s+add\s*=)/.test(code.js) },
        { label: msg(lang, 'Returns sum', 'يعيد ناتج الجمع'), ok: /return\b/.test(code.js) && /\+/.test(code.js) },
      ]),
    },
    {
      prompt: { en: 'Declare a mutable counter using let count = 0 and increment it.', ar: 'عرّف عداداً متغيراً let count = 0 ثم زد قيمته.' },
      language: 'javascript',
      validate: (code, lang) => makeResult([
        { label: msg(lang, 'Uses let count = 0', 'يستخدم let count = 0'), ok: /\blet\s+count\s*=\s*0/.test(code.js) },
        { label: msg(lang, 'Increments count', 'يزيد قيمة count'), ok: /(count\+\+|count\s*\+=\s*1|count\s*=\s*count\s*\+\s*1)/.test(code.js) },
      ]),
    },
    {
      prompt: { en: 'Select an element with document.querySelector and update its textContent.', ar: 'حدد عنصراً عبر document.querySelector وحدّث خاصيته textContent.' },
      language: 'javascript',
      validate: (code, lang) => makeResult([
        { label: msg(lang, 'Calls document.querySelector', 'يستدعي document.querySelector'), ok: /document\.querySelector\s*\(/.test(code.js) },
        { label: msg(lang, 'Updates textContent', 'يحدّث textContent'), ok: /\.textContent\s*=/.test(code.js) },
      ]),
    },
    {
      prompt: { en: 'Attach a click event listener via addEventListener("click", ...) and call console.log().', ar: 'اربط حدث النقر via addEventListener("click", ...) واطبع رسالة عبر console.log().' },
      language: 'javascript',
      validate: (code, lang) => makeResult([
        { label: msg(lang, 'Attaches click event listener', 'يربط حدث النقر click'), ok: /addEventListener\s*\(\s*['"]click['"]/.test(code.js) },
        { label: msg(lang, 'Logs inside handler', 'يطبع عبر console.log()'), ok: /console\.log\s*\(/.test(code.js) },
      ]),
    },
  ],
  'react-components': [
    {
      prompt: { en: 'Write a component function Greeting() returning an <h1>Hello</h1> element.', ar: 'اكتب دالة مكون Greeting() تعيد عنصر <h1>Hello</h1>.' },
      language: 'javascript',
      validate: (code, lang) => makeResult([
        { label: msg(lang, 'Defines PascalCase function Greeting', 'يعرّف الدالة Greeting'), ok: /function\s+Greeting\s*\(/.test(code.js) || /const\s+Greeting\s*=/.test(code.js) },
        { label: msg(lang, 'Returns JSX <h1>', 'يعيد عنصر <h1>'), ok: /return[\s\S]*<h1/i.test(code.js) },
      ]),
    },
    {
      prompt: { en: 'Write a component Badge({ title }) that renders {title} inside a <span>.', ar: 'اكتب مكون Badge({ title }) يعرض {title} داخل <span>.' },
      language: 'javascript',
      validate: (code, lang) => makeResult([
        { label: msg(lang, 'Accepts title prop', 'يستقبل خاصية title'), ok: /Badge\s*\(\s*\{?\s*title/.test(code.js) },
        { label: msg(lang, 'Renders {title} inside <span>', 'يعرض {title} داخل <span>'), ok: /<span[\s\S]*\{title\}/.test(code.js) },
      ]),
    },
    {
      prompt: { en: 'Initialize state with const [count, setCount] = useState(0).', ar: 'عرّف الحالة باستخدام const [count, setCount] = useState(0).' },
      language: 'javascript',
      validate: (code, lang) => makeResult([
        { label: msg(lang, 'Uses useState(0) hook', 'يستخدم خطاف useState(0)'), ok: /const\s*\[\s*\w+\s*,\s*set\w+\s*\]\s*=\s*useState\s*\(\s*0\s*\)/.test(code.js) },
      ]),
    },
    {
      prompt: { en: 'Write a <button onClick={() => setCount(c => c + 1)}> handler.', ar: 'اكتب زر <button> يستدعي setCount عند النقر عبر onClick.' },
      language: 'javascript',
      validate: (code, lang) => makeResult([
        { label: msg(lang, 'Uses onClick calling setter function', 'يربط onClick بدالة تحديث الحالة'), ok: /onClick\s*=\s*\{/.test(code.js) && /set\w+\s*\(/.test(code.js) },
      ]),
    },
    {
      prompt: { en: 'Build an interactive Toggle component with useState(false) and a button displaying On/Off.', ar: 'أنشئ مكون Toggle يستخدم useState(false) وزر يعرض On/Off عند النقر.' },
      language: 'javascript',
      validate: (code, lang) => makeResult([
        { label: msg(lang, 'Defines Toggle with useState', 'يعرّف Toggle مع useState'), ok: /Toggle/.test(code.js) && /useState/.test(code.js) },
        { label: msg(lang, 'Includes interactive <button>', 'يحتوي على زر تفاعلي'), ok: /<button/.test(code.js) && /onClick/.test(code.js) },
      ]),
    },
  ],
  'backend-deploy': [
    {
      prompt: { en: 'Define an Express GET route app.get("/api/health", ...) returning JSON { ok: true }.', ar: 'أنشئ مسار GET باسم /api/health يعيد استجابة JSON تحتوي على { ok: true }.' },
      language: 'javascript',
      validate: (code, lang) => makeResult([
        { label: msg(lang, 'Defines app.get("/api/health", ...)', 'يعرّف app.get("/api/health")'), ok: /app\.get\s*\(\s*['"]\/api\/health['"]/.test(code.js) },
        { label: msg(lang, 'Sends JSON response', 'يرسل استجابة json'), ok: /res[\s\S]*\.json\s*\(/.test(code.js) },
      ]),
    },
    {
      prompt: { en: 'Write an Express POST route app.post("/api/items", ...) responding with status 201.', ar: 'اكتب مسار POST باسم /api/items يستجيب برمز الحالة 201.' },
      language: 'javascript',
      validate: (code, lang) => makeResult([
        { label: msg(lang, 'Defines app.post("/api/items", ...)', 'يعرّف app.post("/api/items")'), ok: /app\.post\s*\(\s*['"]\/api\/items['"]/.test(code.js) },
        { label: msg(lang, 'Sets status 201', 'يضبط الحالة 201'), ok: /status\s*\(\s*201\s*\)/.test(code.js) },
      ]),
    },
    {
      prompt: { en: 'Read an API key securely from process.env.API_KEY without hardcoding any secret.', ar: 'اقرأ مفتاح API بأمان من process.env.API_KEY دون كتابة أي مفتاح سري في الكود.' },
      language: 'javascript',
      validate: (code, lang) => makeResult([
        { label: msg(lang, 'Reads from process.env', 'يقرأ من متغير البيئة process.env'), ok: /process\.env\.[A-Z0-9_]+/.test(code.js) },
      ]),
    },
    {
      prompt: { en: 'Write a parameterized SQL query string using a $1 placeholder.', ar: 'اكتب استعلام SQL آمناً باستخدام معامل $1 لتفادي الحقن.' },
      language: 'javascript',
      validate: (code, lang) => makeResult([
        { label: msg(lang, 'Uses SELECT and $1 parameter placeholder', 'يستخدم SELECT ومعامل $1'), ok: /select\b/i.test(code.js) && /\$1/.test(code.js) },
      ]),
    },
    {
      prompt: { en: 'Log a structured JSON server status object containing status: 200 and ok: true.', ar: 'اطبع كائن حالة الخادم بصيغة JSON يحتوي على status: 200 و ok: true.' },
      language: 'javascript',
      validate: (code, lang) => makeResult([
        { label: msg(lang, 'Logs status 200 and ok: true via console.log()', 'يطبع status: 200 و ok: true عبر console.log()'), ok: /console\.log\s*\(/.test(code.js) && /200/.test(code.js) && /ok/i.test(code.js) },
      ]),
    },
  ],
};

// Extra curated MCQs for CSS, JS, React, and Backend lessons
const EXTRA_TRACK_MCQS: Record<string, Omit<QuizQuestion, 'id'>[]> = {
  'css-box-model': [
    {
      question: { en: 'What does box-sizing: border-box include inside an element width?', ar: 'ما الذي تحسبه box-sizing: border-box ضمن عرض العنصر؟' },
      options: [
        { en: 'Content, padding, and border', ar: 'المحتوى والحشوة والحدود' },
        { en: 'Only margin', ar: 'الهامش الخارجي فقط' },
        { en: 'Nothing beyond text', ar: 'النص فقط' },
      ],
      correctIndex: 0,
      explanation: { en: 'border-box includes padding and border inside the declared width.', ar: 'تُدرج border-box الحشوة والحدود ضمن العرض الكلي المحدد.' },
    },
    {
      question: { en: 'Which CSS property distributes space between flex items along the main axis?', ar: 'أي خاصية توزع المساحة بين عناصر Flex على المحور الرئيسي؟' },
      options: [
        { en: 'align-self', ar: 'align-self' },
        { en: 'justify-content', ar: 'justify-content' },
        { en: 'z-index', ar: 'z-index' },
      ],
      correctIndex: 1,
      explanation: { en: 'justify-content aligns items along the main flex axis.', ar: 'تتحكم justify-content بتوزيع العناصر على المحور الرئيسي.' },
    },
    {
      question: { en: 'Where should display: flex be applied?', ar: 'أين تُكتب خاصية display: flex؟' },
      options: [
        { en: 'On the parent container wrapping the flex items', ar: 'على الحاوية الأب التي تضم العناصر' },
        { en: 'Only on <head>', ar: 'داخل <head> فقط' },
        { en: 'On text nodes', ar: 'على النصوص المجردة' },
      ],
      correctIndex: 0,
      explanation: { en: 'Flex layout properties activate on direct children of a flex parent.', ar: 'تُطبّق display: flex على العنصر الأب ليصبح أبناؤه عناصر مرنة.' },
    },
    {
      question: { en: 'Which property adds uniform gutters exclusively between flex/grid items?', ar: 'أي خاصية تضيف فراغات متساوية بين العناصر دون أطراف الحاوية؟' },
      options: [
        { en: 'outline', ar: 'outline' },
        { en: 'gap', ar: 'gap' },
        { en: 'opacity', ar: 'opacity' },
      ],
      correctIndex: 1,
      explanation: { en: 'gap creates clean spacing exclusively between sibling items.', ar: 'تضيف gap مسافات منتظمة بين العناصر المتجاورة فقط.' },
    },
  ],
  'css-grid': [
    {
      question: { en: 'What does repeat(auto-fit, minmax(180px, 1fr)) accomplish?', ar: 'ماذا تحقق الصيغة repeat(auto-fit, minmax(180px, 1fr))؟' },
      options: [
        { en: 'Automatically wraps columns responsively without media queries', ar: 'تكيّف عدد الأعمدة تلقائياً مع عرض الشاشة دون media queries' },
        { en: 'Hides every column on mobile', ar: 'تخفي الأعمدة على الهاتف' },
        { en: 'Locks all columns to 180px forever', ar: 'تثبت العرض عند 180 بكسل دائماً' },
      ],
      correctIndex: 0,
      explanation: { en: 'auto-fit + minmax fits as many columns as fit and stretches remaining space.', ar: 'تُنشئ أعمدة مرنة تتكيف تلقائياً مع المساحة المتاحة.' },
    },
    {
      question: { en: 'When is CSS Grid preferred over Flexbox?', ar: 'متى يُفضّل استخدام CSS Grid على Flexbox؟' },
      options: [
        { en: 'Two-dimensional layouts controlling both rows and columns together', ar: 'التخطيطات ثنائية الأبعاد للتحكم بالصفوف والأعمدة معاً' },
        { en: 'Changing text font color', ar: 'لتغيير لون الخط' },
        { en: 'Adding border radius', ar: 'لتدوير الزوايا' },
      ],
      correctIndex: 0,
      explanation: { en: 'Grid shines for 2D row + column structures.', ar: 'تتفوق Grid في تنظيم الصفوف والأعمدة في بعدين معاً.' },
    },
    {
      question: { en: 'Which property controls spacing between Grid rows and columns?', ar: 'أي خاصية تحدد المسافات بين صفوف وأعمدة الشبكة؟' },
      options: [
        { en: 'gap', ar: 'gap' },
        { en: 'float', ar: 'float' },
        { en: 'position', ar: 'position' },
      ],
      correctIndex: 0,
      explanation: { en: 'gap sets consistent row and column gutters.', ar: 'تضبط gap الفواصل المنتظمة بين خلايا الشبكة.' },
    },
    {
      question: { en: 'Why avoid fixed 300px columns for multi-column desktop grids?', ar: 'لماذا نتجنب الأعمدة الثابتة بالبكسل فقط في الشبكات المتجاوبة؟' },
      options: [
        { en: 'They cause horizontal overflow on narrow mobile screens', ar: 'تسبب فيضاً أفقياً وشريط تمرير مزعج على الهواتف' },
        { en: 'Browsers ban pixels', ar: 'المتصفحات تمنع البكسل' },
        { en: 'They change text direction', ar: 'تغير اتجاه النص' },
      ],
      correctIndex: 0,
      explanation: { en: 'Fractional fr tracks with minmax prevent horizontal scrolling on smaller viewports.', ar: 'تضمن وحدات fr مع minmax ملاءمة جميع المقاسات دون فيض.' },
    },
  ],
  'js-essentials': [
    {
      question: { en: 'When should you choose let instead of const?', ar: 'متى نختار let بدلاً من const؟' },
      options: [
        { en: 'When a variable value will be reassigned (like a counter)', ar: 'عندما تتغير قيمة المتغير لاحقاً مثل العدّاد' },
        { en: 'Always for every variable', ar: 'دائماً لكل المتغيرات' },
        { en: 'Only inside CSS files', ar: 'في ملفات CSS فقط' },
      ],
      correctIndex: 0,
      explanation: { en: 'Use const by default and let only when reassignment is needed.', ar: 'استخدم const افتراضياً و let فقط عند الحاجة لتحديث القيمة.' },
    },
    {
      question: { en: 'Which method attaches an interaction handler to a DOM element?', ar: 'أي دالة تربط حدث تفاعل بعنصر في الصفحة؟' },
      options: [
        { en: 'element.addEventListener("click", fn)', ar: 'element.addEventListener("click", fn)' },
        { en: 'element.css("click")', ar: 'element.css("click")' },
        { en: 'element.meta("click")', ar: 'element.meta("click")' },
      ],
      correctIndex: 0,
      explanation: { en: 'addEventListener registers callbacks without overwriting existing handlers.', ar: 'يسجل addEventListener دوال الاستجابة للأحداث بأمان.' },
    },
    {
      question: { en: 'Why prefer textContent over innerHTML for plain counter strings?', ar: 'لماذا نفضّل textContent على innerHTML لتحديث نصوص العدّادات؟' },
      options: [
        { en: 'It is faster and prevents accidental HTML/XSS injection', ar: 'أسرع ويمنع حقن أكواد HTML ضارة' },
        { en: 'It makes text uppercase', ar: 'يجعل الحروف كبيرة' },
        { en: 'innerHTML does not exist in JS', ar: 'innerHTML غير موجودة' },
      ],
      correctIndex: 0,
      explanation: { en: 'textContent safely inserts plain text without parsing HTML.', ar: 'يدرج textContent النص بأمان دون تفسير وسوم HTML.' },
    },
    {
      question: { en: 'What mistake occurs in btn.addEventListener("click", handleClick())?', ar: 'ما الخطأ في كتابة btn.addEventListener("click", handleClick())؟' },
      options: [
        { en: 'The () invokes handleClick immediately on load instead of on click', ar: 'الأقواس () تشغّل الدالة فوراً عند التحميل بدلاً من انتظار النقر' },
        { en: 'Missing semicolon', ar: 'نسيان الفاصلة المنقوطة' },
        { en: 'Wrong tag name', ar: 'اسم وسم خاطئ' },
      ],
      correctIndex: 0,
      explanation: { en: 'Pass the function reference handleClick without trailing parentheses.', ar: 'مرر اسم الدالة بدون أقواس تنفيذ ليتم استدعاؤها عند النقر فقط.' },
    },
  ],
  'react-components': [
    {
      question: { en: 'Which React hook creates local state inside a function component?', ar: 'أي خطاف (Hook) يُستخدم لإدارة الحالة المحلية داخل مكون React؟' },
      options: [
        { en: 'useState', ar: 'useState' },
        { en: 'useTable', ar: 'useTable' },
        { en: 'useStyle', ar: 'useStyle' },
      ],
      correctIndex: 0,
      explanation: { en: 'useState returns [value, setter] for reactive state updates.', ar: 'تعيد useState قيمة الحالة الحالية ودالة التحديث.' },
    },
    {
      question: { en: 'How should React state be updated?', ar: 'كيف يجب تحديث قيمة الحالة في React؟' },
      options: [
        { en: 'By mutating count++ directly', ar: 'بتعديل count++ مباشرة' },
        { en: 'By calling the setter function like setCount(c => c + 1)', ar: 'باستدعاء دالة التحديث مثل setCount(c => c + 1)' },
        { en: 'Reloading the entire browser window', ar: 'بإعادة تحميل المتصفح' },
      ],
      correctIndex: 1,
      explanation: { en: 'Calling the setter notifies React to re-render updated UI.', ar: 'استدعاء دالة التحديث يُخبر React بإعادة رسم المكون.' },
    },
    {
      question: { en: 'Why must React component names start with an uppercase letter?', ar: 'لماذا تبدأ أسماء مكونات React بحرف كبير دائماً؟' },
      options: [
        { en: 'JSX distinguishes custom components (<Card />) from lowercase HTML tags (<div>)', ar: 'ليميّز JSX المكونات المخصصة عن وسوم HTML القياسية' },
        { en: 'For CSS specificity', ar: 'لأولوية CSS' },
        { en: 'It is optional', ar: 'أمر اختياري تماماً' },
      ],
      correctIndex: 0,
      explanation: { en: 'Lowercase names compile as native DOM tag strings in JSX.', ar: 'تُفسر الأسماء بحرف صغير كوسوم HTML عادية في JSX.' },
    },
    {
      question: { en: 'Can a child component directly mutate props received from its parent?', ar: 'هل يحق للمكون الابن تعديل قيمة props المستلمة من الأب مباشرة؟' },
      options: [
        { en: 'No, props are strictly read-only', ar: 'لا، الخصائص props للقراءة فقط' },
        { en: 'Yes, always', ar: 'نعم دائماً' },
        { en: 'Only numeric props', ar: 'الخصائص الرقمية فقط' },
      ],
      correctIndex: 0,
      explanation: { en: 'Props are immutable inputs passed down from parent components.', ar: 'تُعامل props كمعطيات ثابتة للقراءة فقط.' },
    },
  ],
  'backend-deploy': [
    {
      question: { en: 'Which HTTP status code indicates a successful GET JSON response?', ar: 'أي رمز حالة HTTP يشير إلى نجاح استجابة GET JSON؟' },
      options: [
        { en: '200 OK', ar: '200 OK' },
        { en: '404 Not Found', ar: '404 Not Found' },
        { en: '500 Server Error', ar: '500 Server Error' },
      ],
      correctIndex: 0,
      explanation: { en: '200 OK signals standard request success.', ar: 'الرمز 200 يعني نجاح الطلب واسترجاع البيانات.' },
    },
    {
      question: { en: 'Why use parameterized SQL queries ($1, $2) instead of string concatenation?', ar: 'لماذا نستخدم استعلامات SQL الممررة ($1, $2) بدلاً من دمج النصوص؟' },
      options: [
        { en: 'To prevent SQL Injection attacks', ar: 'لمنع هجمات حقن SQL (SQL Injection)' },
        { en: 'To double file sizes', ar: 'لمضاعفة حجم الملفات' },
        { en: 'To skip authentication', ar: 'لتجاوز التحقق' },
      ],
      correctIndex: 0,
      explanation: { en: 'Parameterized queries separate SQL syntax from untrusted user input.', ar: 'تفصل المعاملات بنية الاستعلام عن مدخلات المستخدم بأمان.' },
    },
    {
      question: { en: 'Which HTTP method typically creates a new resource on a REST API?', ar: 'أي طلب HTTP يُستخدم عادةً لإنشاء سجل جديد في واجهة REST؟' },
      options: [
        { en: 'POST', ar: 'POST' },
        { en: 'HEAD', ar: 'HEAD' },
        { en: 'OPTIONS', ar: 'OPTIONS' },
      ],
      correctIndex: 0,
      explanation: { en: 'POST submits payloads to create new server records.', ar: 'يُرسل POST البيانات لإنشاء موارد جديدة على الخادم.' },
    },
    {
      question: { en: 'Why never commit .env secret files to Git repositories?', ar: 'لماذا يجب استبعاد ملفات .env السرية من مستودعات Git؟' },
      options: [
        { en: 'Committing .env exposes private DB passwords and API keys publicly', ar: 'رفعها يكشف كلمات مرور قواعد البيانات ومفاتيح API للعلن' },
        { en: 'Git cannot read text files', ar: 'لا يقرأ Git الملفات النصية' },
        { en: 'It breaks HTML tags', ar: 'يفسد وسوم HTML' },
      ],
      correctIndex: 0,
      explanation: { en: 'Keep secrets out of source control and inject them via server environment variables.', ar: 'أبقِ الأسرار خارج Git وحقنها عبر متغيرات البيئة في الخادم.' },
    },
  ],
};

export function buildTenQuestionAssessment(lesson: Lesson): {
  quiz: QuizQuestion[];
  codeQuiz: CodeQuizQuestion[];
} {
  // 1. Assemble 5 Multiple-Choice Questions (preserving lesson.quiz[0] as Q1)
  const mcqs: QuizQuestion[] = [...lesson.quiz];
  const seenPrompts = new Set(mcqs.map((q) => q.question.en));

  if (EXTRA_TRACK_MCQS[lesson.id]) {
    EXTRA_TRACK_MCQS[lesson.id].forEach((seed, idx) => {
      if (mcqs.length < 5 && !seenPrompts.has(seed.question.en)) {
        seenPrompts.add(seed.question.en);
        mcqs.push({ id: `${lesson.id}-mcq-${idx + 2}`, ...seed });
      }
    });
  }

  const lessonTags = lesson.tags ?? [];
  for (const rawTag of lessonTags) {
    if (mcqs.length >= 5) break;
    const key = cleanTagKey(rawTag);
    const seedBank =
      TAG_BANK[key] ??
      GENERIC_HTML_TAG_FACTORY(rawTag, lesson.title.en, lesson.title.ar);
    for (const qSeed of seedBank.mcqs) {
      if (mcqs.length >= 5) break;
      if (!seenPrompts.has(qSeed.question.en)) {
        seenPrompts.add(qSeed.question.en);
        mcqs.push({ id: `${lesson.id}-mcq-${mcqs.length + 1}`, ...qSeed });
      }
    }
  }

  // Fallback fill if single-tag lesson still needs MCQs up to 5
  if (mcqs.length < 5) {
    const primaryTag = lessonTags[0] ?? `<${lesson.id}>`;
    const fallbackBank = GENERIC_HTML_TAG_FACTORY(primaryTag, lesson.title.en, lesson.title.ar);
    for (const qSeed of fallbackBank.mcqs) {
      if (mcqs.length >= 5) break;
      if (!seenPrompts.has(qSeed.question.en)) {
        seenPrompts.add(qSeed.question.en);
        mcqs.push({ id: `${lesson.id}-mcq-${mcqs.length + 1}`, ...qSeed });
      }
    }
  }

  // 2. Assemble 5 Real Coding Questions (empty editor + live Web Preview per question)
  const codeTasks: CodeQuizQuestion[] = [];
  if (SPECIAL_LESSON_CODE_TASKS[lesson.id]) {
    SPECIAL_LESSON_CODE_TASKS[lesson.id].slice(0, 5).forEach((task, idx) => {
      codeTasks.push({ id: `${lesson.id}-code-${idx + 1}`, ...task });
    });
  } else {
    // Interleave coding tasks from the tags covered by this lesson (e.g. Tag 1 & Tag 2)
    const tagSeeds = lessonTags.map((rawTag) => {
      const key = cleanTagKey(rawTag);
      return TAG_BANK[key] ?? GENERIC_HTML_TAG_FACTORY(rawTag, lesson.title.en, lesson.title.ar);
    });

    const primaryTasks = tagSeeds[0]?.codeTasks ?? [];
    const secondaryTasks = tagSeeds[1]?.codeTasks ?? primaryTasks;

    const combinedPool: Omit<CodeQuizQuestion, 'id'>[] = [];
    for (let i = 0; i < 5; i++) {
      if (primaryTasks[i]) combinedPool.push(primaryTasks[i]);
      if (secondaryTasks[i] && secondaryTasks !== primaryTasks) combinedPool.push(secondaryTasks[i]);
    }

    const seenCodePrompts = new Set<string>();
    for (const task of combinedPool) {
      if (codeTasks.length >= 5) break;
      if (!seenCodePrompts.has(task.prompt.en)) {
        seenCodePrompts.add(task.prompt.en);
        codeTasks.push({ id: `${lesson.id}-code-${codeTasks.length + 1}`, ...task });
      }
    }
  }

  return {
    quiz: mcqs.slice(0, 5),
    codeQuiz: codeTasks.slice(0, 5),
  };
}
