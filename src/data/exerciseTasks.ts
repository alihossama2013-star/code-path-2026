import { Language } from '../i18n/translations';
import { Lesson, PlaygroundStarter } from './types';

export interface ExerciseCheckItem {
  label: string;
  ok: boolean;
}

export interface ExerciseValidationResult {
  passed: boolean;
  checks: ExerciseCheckItem[];
  feedback: string;
}

export function extractHtmlTitle(html: string): string {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!match) return '';
  return match[1].replace(/\s+/g, ' ').trim();
}

export function getExerciseStarter(_lesson: Lesson): PlaygroundStarter {
  return {
    html: '',
    css: '',
    js: '',
  };
}

function normalizeTagSelector(rawTag: string): string | null {
  const cleaned = rawTag.replace(/[<>]/g, '').trim().toLowerCase();
  if (!cleaned || cleaned.startsWith('!doctype')) return null;
  if (cleaned.includes('–') || cleaned.includes('-')) {
    if (cleaned.startsWith('h1')) return 'h1, h2, h3, h4, h5, h6';
  }
  return cleaned;
}

export function validateExercise(
  lesson: Lesson,
  code: PlaygroundStarter,
  lang: Language,
  allLessons?: Lesson[]
): ExerciseValidationResult {
  const msg = (en: string, ar: string) => (lang === 'ar' ? ar : en);

  if (lesson.isReview && lesson.reviewedLessonIds && allLessons) {
    const [idA, idB] = lesson.reviewedLessonIds;
    const lessonA = allLessons.find((item) => item.id === idA);
    const lessonB = allLessons.find((item) => item.id === idB);

    if (lessonA && lessonB) {
      const resA = validateExercise(lessonA, code, lang, allLessons);
      const resB = validateExercise(lessonB, code, lang, allLessons);

      const seen = new Set<string>();
      const combinedChecks: ExerciseCheckItem[] = [];
      for (const item of [...resA.checks, ...resB.checks]) {
        if (!seen.has(item.label)) {
          seen.add(item.label);
          combinedChecks.push(item);
        }
      }

      const passed = combinedChecks.length > 0 && combinedChecks.every((c) => c.ok);
      const firstFail = combinedChecks.find((c) => !c.ok);
      const feedback = passed
        ? msg(
            'Review task verified successfully. Both previous lessons are combined cleanly and Assessment is unlocked.',
            'تم التحقق من تمرين المراجعة بنجاح. تم دمج متطلبات الدرسين السابقين وفتح الاختبار الآن.'
          )
        : msg(
            `Review task not complete yet: ${firstFail?.label}. Combine requirements from both lessons and Verify again.`,
            `تمرين المراجعة غير مكتمل بعد: ${firstFail?.label}. تأكد من استيفاء شروط الدرسين ثم اضغط تحقق مرة أخرى.`
          );

      return { passed, checks: combinedChecks, feedback };
    }
  }

  const html = code.html || '';
  const css = code.css || '';
  const js = code.js || '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const checks: ExerciseCheckItem[] = [];

  switch (lesson.id) {
    case 'html-01-01': {
      const hasDoctype = /^\s*<!doctype\s+html\s*>/i.test(html);
      const hasParagraph = Boolean(doc.body?.querySelector('p')?.textContent?.trim());
      checks.push(
        {
          label: msg('Starts with <!DOCTYPE html> on the first line', 'يبدأ الملف بتصريح <!DOCTYPE html> في السطر الأول'),
          ok: hasDoctype,
        },
        {
          label: msg('Contains a non-empty <p> inside <body>', 'يحتوي على فقرة <p> غير فارغة داخل <body>'),
          ok: hasParagraph,
        }
      );
      break;
    }

    case 'html-01-02': {
      const hasHtmlTag = /<html\b[^>]*>/i.test(html);
      const langMatch = html.match(/<html\b[^>]*\blang\s*=\s*["']([^"']+)["']/i);
      const hasHeadTag = /<head\b[^>]*>[\s\S]*<\/head>/i.test(html);
      checks.push(
        {
          label: msg('Includes root <html> tag with a valid lang attribute', 'يحتوي على وسم <html> الجذري مع سمة lang صالحة'),
          ok: hasHtmlTag && Boolean(langMatch && langMatch[1].trim().length > 0),
        },
        {
          label: msg('Includes a <head>...</head> section inside <html>', 'يحتوي على قسم <head>...</head> داخل <html>'),
          ok: hasHeadTag,
        }
      );
      break;
    }

    case 'html-01-03': {
      const hasBodyTag = /<body\b[^>]*>[\s\S]*<\/body>/i.test(html);
      const bodyText = (doc.body?.textContent || '').trim();
      const hasVisibleChild = (doc.body?.children.length ?? 0) > 0 && bodyText.length > 0;
      checks.push(
        {
          label: msg('Contains a <body>...</body> container', 'يحتوي على وسم <body>...</body>'),
          ok: hasBodyTag,
        },
        {
          label: msg('Includes visible elements and text inside <body>', 'يحتوي على عناصر ونصوص مرئية داخل <body>'),
          ok: hasVisibleChild,
        }
      );
      break;
    }

    case 'html-01-04': {
      const hasHead = /<head\b[^>]*>[\s\S]*<\/head>/i.test(html);
      const headEl = doc.querySelector('head');
      const titleEl = headEl?.querySelector('title');
      const rawTitle = extractHtmlTitle(html);
      const isExactAli = rawTitle === 'ali';
      const hasVisibleBody = (doc.body?.textContent || '').trim().length > 0;

      checks.push(
        {
          label: msg('Contains a <head> section with a <title> tag inside it', 'يحتوي على قسم <head> وبداخله وسم <title>'),
          ok: hasHead && Boolean(titleEl),
        },
        {
          label: msg(
            `Page <title> is set to "ali" (found: "${rawTitle || 'empty'}")`,
            `عنوان الصفحة <title> يساوي "ali" (الحالي: "${rawTitle || 'فارغ'}")`
          ),
          ok: isExactAli,
        },
        {
          label: msg('Website <body> has visible content', 'يحتوي <body> الموقع على محتوى مرئي'),
          ok: hasVisibleBody,
        }
      );
      break;
    }

    case 'html-01-05': {
      const hasHead = /<head\b[^>]*>[\s\S]*<\/head>/i.test(html) || /<link\b/i.test(html);
      const linkEl = doc.querySelector('head link[rel="stylesheet"][href]');
      const hrefVal = linkEl?.getAttribute('href')?.trim() || '';
      checks.push(
        {
          label: msg('Includes a <head> section', 'يحتوي على قسم <head>'),
          ok: hasHead,
        },
        {
          label: msg('Includes <link rel="stylesheet" href="main.css" /> inside <head>', 'يحتوي على <link rel="stylesheet" href="main.css" /> داخل <head>'),
          ok: Boolean(linkEl && hrefVal.length > 0),
        }
      );
      break;
    }

    case 'html-02-01': {
      const hasH1 = Boolean(doc.body?.querySelector('h1')?.textContent?.trim());
      const hasH2 = Boolean(doc.body?.querySelector('h2')?.textContent?.trim());
      const pCount = doc.body?.querySelectorAll('p').length ?? 0;
      const hasHr = Boolean(doc.body?.querySelector('hr'));
      const hasBr = Boolean(doc.body?.querySelector('br'));
      checks.push(
        {
          label: msg('Uses <h1> and <h2> heading hierarchy', 'يستخدم تدرج العناوين <h1> و <h2>'),
          ok: hasH1 && hasH2,
        },
        {
          label: msg('Includes at least two <p> paragraphs', 'يحتوي على فقرتي <p> على الأقل'),
          ok: pCount >= 2,
        },
        {
          label: msg('Uses <hr /> divider and at least one <br /> line break', 'يستخدم الخط الفاصل <hr /> وكسر السطر <br />'),
          ok: hasHr && hasBr,
        }
      );
      break;
    }

    case 'html-02-02': {
      const hasStrongAndEm = Boolean(doc.body?.querySelector('strong') && doc.body?.querySelector('em'));
      const hasMark = Boolean(doc.body?.querySelector('mark'));
      const hasEdits = Boolean(doc.body?.querySelector('del') && doc.body?.querySelector('ins'));
      const hasScripts = Boolean(doc.body?.querySelector('sub') && doc.body?.querySelector('sup'));
      checks.push(
        {
          label: msg('Uses <strong> and <em> for semantic emphasis', 'يستخدم <strong> و <em> للتأكيد الدلالي'),
          ok: hasStrongAndEm,
        },
        {
          label: msg('Includes <mark> highlight plus <del> and <ins> tracked edits', 'يحتوي على <mark> للتظليل مع <del> و <ins> للتعديلات'),
          ok: hasMark && hasEdits,
        },
        {
          label: msg('Includes <sub> and <sup> formatting', 'يحتوي على تنسيق <sub> و <sup>'),
          ok: hasScripts,
        }
      );
      break;
    }

    case 'html-02-03': {
      const abbrEl = doc.body?.querySelector('abbr[title]');
      const hasAbbrAndDfn = Boolean(
        abbrEl && (abbrEl.getAttribute('title') || '').trim().length > 0 && doc.body?.querySelector('dfn')
      );
      const hasQuoteAndCite = Boolean(
        doc.body?.querySelector('blockquote') && doc.body?.querySelector('cite')
      );
      const hasAddress = Boolean(doc.body?.querySelector('address')?.textContent?.trim());
      checks.push(
        {
          label: msg('Uses <dfn> and <abbr title="..."> with an explanation', 'يستخدم <dfn> و <abbr title="..."> مع الشرح'),
          ok: hasAbbrAndDfn,
        },
        {
          label: msg('Includes a <blockquote> citing a <cite> source', 'يحتوي على اقتباس <blockquote> مع اسم المصدر داخل <cite>'),
          ok: hasQuoteAndCite,
        },
        {
          label: msg('Includes an <address> contact block', 'يحتوي على قسم بيانات تواصل <address>'),
          ok: hasAddress,
        }
      );
      break;
    }

    case 'html-02-04': {
      const hasKbdAndCode = Boolean(doc.body?.querySelector('kbd') && doc.body?.querySelector('code'));
      const hasPre = Boolean(doc.body?.querySelector('pre'));
      const hasVarAndSamp = Boolean(doc.body?.querySelector('var') && doc.body?.querySelector('samp'));
      const hasBdi = Boolean(doc.body?.querySelector('bdi'));
      checks.push(
        {
          label: msg('Includes <kbd>, <code>, and <pre> block', 'يحتوي على <kbd> و <code> مع <pre>'),
          ok: hasKbdAndCode && hasPre,
        },
        {
          label: msg('Includes <var> and <samp> output tags', 'يحتوي على وسمي <var> و <samp>'),
          ok: hasVarAndSamp,
        },
        {
          label: msg('Isolates bilingual text using <bdi>', 'يعزل النص ثنائي اللغة باستخدام <bdi>'),
          ok: hasBdi,
        }
      );
      break;
    }

    case 'html-02-05': {
      const dtCount = doc.body?.querySelectorAll('dl dt').length ?? 0;
      const ddCount = doc.body?.querySelectorAll('dl dd').length ?? 0;
      checks.push(
        {
          label: msg('Creates a <dl> list with at least two <dt> terms', 'ينشئ قائمة <dl> تحتوي على مصطلحي <dt> على الأقل'),
          ok: dtCount >= 2,
        },
        {
          label: msg('Pairs terms with <dd> definitions', 'يربط المصطلحات بشروحات <dd>'),
          ok: ddCount >= 2,
        }
      );
      break;
    }

    case 'html-02-06': {
      const hasDd = Boolean(doc.body?.querySelector('dl dd'));
      const dataEl = doc.body?.querySelector('data[value]');
      const hasVal = Boolean(dataEl && (dataEl.getAttribute('value') || '').trim().length > 0);
      checks.push(
        {
          label: msg('Contains a <dl> with <dd> description content', 'يحتوي على قائمة <dl> وبها وسم <dd>'),
          ok: hasDd,
        },
        {
          label: msg('Uses <data value="..."> with a non-empty machine value', 'يستخدم <data value="..."> مع قيمة برمجية غير فارغة'),
          ok: hasVal,
        }
      );
      break;
    }

    case 'html-02-07': {
      const timeEl = doc.body?.querySelector('time[datetime]');
      const hasDatetime = Boolean(timeEl && (timeEl.getAttribute('datetime') || '').trim().length > 0);
      const hasWbr = Boolean(doc.body?.querySelector('wbr'));
      checks.push(
        {
          label: msg('Includes <time datetime="..."> with a valid datetime value', 'يحتوي على <time datetime="..."> مع قيمة زمنية صالحة'),
          ok: hasDatetime,
        },
        {
          label: msg('Includes <wbr> inside text or a long URL', 'يستخدم وسم <wbr> لتحديد مواضع كسر الكلمات'),
          ok: hasWbr,
        }
      );
      break;
    }

    case 'css-box-model': {
      const hasFlex = /display\s*:\s*flex/i.test(css);
      const hasJustify = /justify-content\s*:\s*space-between/i.test(css);
      const hasChildren = (doc.body?.querySelectorAll('*').length ?? 0) >= 2;
      checks.push(
        {
          label: msg('HTML contains container with header items', 'يحتوي HTML على حاوية بعناصر الترويسة'),
          ok: hasChildren,
        },
        {
          label: msg('CSS applies display: flex', 'تطبّق CSS خاصية display: flex'),
          ok: hasFlex,
        },
        {
          label: msg('CSS aligns items using justify-content: space-between', 'توزع CSS العناصر باستخدام justify-content: space-between'),
          ok: hasJustify,
        }
      );
      break;
    }

    case 'css-grid': {
      const hasGrid = /display\s*:\s*grid/i.test(css);
      const hasColumns = /grid-template-columns\s*:[^;]*minmax\s*\(/i.test(css);
      checks.push(
        {
          label: msg('CSS applies display: grid', 'تطبّق CSS خاصية display: grid'),
          ok: hasGrid,
        },
        {
          label: msg('Defines responsive tracks with grid-template-columns and minmax()', 'تحدد الأعمدة المتجاوبة عبر grid-template-columns و minmax()'),
          ok: hasColumns,
        }
      );
      break;
    }

    case 'js-essentials': {
      const hasVar = /\b(const|let)\b/.test(js);
      const hasEvent = /(addEventListener\s*\(\s*['"]click['"]|\.onclick\s*=)/i.test(js);
      const hasLog = /console\.log\s*\(/.test(js);
      checks.push(
        {
          label: msg('Declares state or element references using const/let', 'يعرّف المتغيرات أو العناصر باستخدام const أو let'),
          ok: hasVar,
        },
        {
          label: msg('Attaches a click event handler and logs with console.log()', 'يربط حدث النقر click ويطبع النتيجة عبر console.log()'),
          ok: hasEvent && hasLog,
        }
      );
      break;
    }

    case 'react-components': {
      const hasButton = Boolean(doc.body?.querySelector('button'));
      const hasStateLogic = /\b(let|const|useState)\b/.test(js) && /(onclick|addEventListener|set)/i.test(js);
      checks.push(
        {
          label: msg('Includes an interactive <button> element', 'يحتوي على زر <button> تفاعلي'),
          ok: hasButton,
        },
        {
          label: msg('Updates state and UI text when clicked', 'يحدّث الحالة ونص الواجهة عند النقر'),
          ok: hasStateLogic,
        }
      );
      break;
    }

    case 'backend-deploy': {
      const hasLog = /console\.log\s*\(/.test(js);
      const hasPayload = /(status|ok|200)/i.test(js);
      checks.push(
        {
          label: msg('Logs an API response payload with status/ok to the console', 'يطبع استجابة API (status / ok) في وحدة التحكم'),
          ok: hasLog && hasPayload,
        }
      );
      break;
    }

    default: {
      const tagsToVerify = lesson.tags ?? [];
      for (const rawTag of tagsToVerify) {
        const selector = normalizeTagSelector(rawTag);
        if (!selector) continue;

        let matched = Boolean(doc.querySelector(selector));
        // Template inner slots live inside HTMLTemplateElement.content
        if (!matched && selector === 'slot') {
          const templates = Array.from(doc.querySelectorAll('template'));
          matched = templates.some((tpl) => Boolean(tpl.content.querySelector('slot')));
        }
        checks.push({
          label: msg(`Uses ${rawTag} properly in the document`, `يستخدم وسم ${rawTag} بشكل صحيح في المستند`),
          ok: matched,
        });
      }

      if (lesson.id === 'html-04-01') {
        const links = Array.from(doc.querySelectorAll('a[href]'));
        const hasBlankAndRel = links.some(
          (a) =>
            a.getAttribute('target') === '_blank' &&
            (a.getAttribute('rel') || '').toLowerCase().includes('noopener')
        );
        checks.push({
          label: msg(
            'Includes an external <a> with target="_blank" and rel="noopener..."',
            'يحتوي على رابط <a> خارجي يحمل target="_blank" و rel="noopener..."'
          ),
          ok: hasBlankAndRel,
        });
      }

      if (lesson.id === 'html-06-01') {
        const imgs = Array.from(doc.querySelectorAll('img'));
        const hasAltAndLazy = imgs.some(
          (img) =>
            (img.getAttribute('alt') || '').trim().length > 0 &&
            img.getAttribute('loading') === 'lazy'
        );
        checks.push({
          label: msg('<img> has non-empty alt text and loading="lazy"', 'يحمل وسم <img> نص alt واضح و loading="lazy"'),
          ok: hasAltAndLazy,
        });
      }

      if (lesson.id === 'html-07-01') {
        const video = doc.querySelector('video');
        checks.push({
          label: msg('<video> includes controls, muted, and loop attributes', 'يحمل وسم <video> سمات controls و muted و loop'),
          ok: Boolean(video && video.hasAttribute('controls') && video.hasAttribute('muted') && video.hasAttribute('loop')),
        });
      }

      if (lesson.id === 'html-09-02') {
        const label = doc.querySelector('label[for]');
        const targetId = label?.getAttribute('for');
        const matchesTextarea = Boolean(targetId && doc.getElementById(targetId)?.tagName === 'TEXTAREA');
        checks.push({
          label: msg('<label for="..."> matches <textarea id="...">', 'تطابق سمة for في <label> معرف id الخاص بـ <textarea>'),
          ok: matchesTextarea,
        });
      }

      if (lesson.id === 'html-11-01') {
        const detailsOpen = doc.querySelector('details[open] > summary');
        checks.push({
          label: msg('<details open> begins with <summary> as its first child', 'يبدأ <details open> بوسم <summary> كأول عنصر داخله'),
          ok: Boolean(detailsOpen),
        });
      }

      if (lesson.id === 'html-12-01') {
        const scriptEl = doc.querySelector('head script[src]');
        const isNonBlocking = Boolean(
          scriptEl && (scriptEl.hasAttribute('defer') || scriptEl.getAttribute('type') === 'module')
        );
        checks.push({
          label: msg('<script src="..."> in <head> uses defer or type="module"', 'وسم <script src="..."> داخل <head> يستخدم defer أو type="module"'),
          ok: isNonBlocking,
        });
      }

      if (lesson.id === 'html-12-02') {
        const templates = Array.from(doc.querySelectorAll('template'));
        const hasTwoNamedSlots = templates.some(
          (tpl) => tpl.content.querySelectorAll('slot[name]').length >= 2
        );
        checks.push({
          label: msg('Contains at least two named <slot name="..."> elements inside <template>', 'يحتوي على منفذي <slot name="..."> على الأقل داخل <template>'),
          ok: hasTwoNamedSlots,
        });
      }

      if (checks.length === 0) {
        checks.push({
          label: msg('HTML document contains non-empty markup', 'يحتوي مستند HTML على عناصر صالحة'),
          ok: html.trim().length > 0,
        });
      }
      break;
    }
  }

  const passed = checks.length > 0 && checks.every((c) => c.ok);
  const failedItems = checks.filter((c) => !c.ok);

  const feedback = passed
    ? msg(
        'Task verified successfully. Your Assessment tab is now unlocked.',
        'تم التحقق من إنجاز التمرين بنجاح. تم فتح تبويب الاختبار الآن.'
      )
    : msg(
        `Task not complete yet: ${failedItems[0]?.label}. Fix your code and run Verify again before proceeding to Assessment.`,
        `التمرين غير مكتمل بعد: ${failedItems[0]?.label}. عدّل الكود ثم اضغط تحقق مرة أخرى لفتح الاختبار.`
      );

  return { passed, checks, feedback };
}
