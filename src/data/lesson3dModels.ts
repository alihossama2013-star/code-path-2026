import { Lesson, LocalizedText } from './types';

export type Lesson3DArchetype =
  | 'document-shell'
  | 'semantic-blocks'
  | 'media-conduit'
  | 'interactive-circuit'
  | 'css-box-grid'
  | 'fullstack-flow';

export type Lesson3DFocusId = 'overview' | 'partA' | 'partB' | 'partC';

export interface Lesson3DPartSpec {
  id: 'partA' | 'partB' | 'partC';
  label: LocalizedText;
  detail: LocalizedText;
  cameraPos: [number, number, number];
  cameraTarget: [number, number, number];
}

export interface Lesson3DSpec {
  archetype: Lesson3DArchetype;
  title: LocalizedText;
  subtitle: LocalizedText;
  supportsFlow: boolean;
  plateLabels: [string, string, string];
  overviewCamera: {
    pos: [number, number, number];
    target: [number, number, number];
  };
  parts: [Lesson3DPartSpec, Lesson3DPartSpec, Lesson3DPartSpec];
}

function getTagPair(lesson: Lesson): [string, string, string] {
  const tags = lesson.tags ?? [];
  if (lesson.isReview) {
    return [
      tags[0] ?? 'Lesson 01',
      'Bridge / Integration',
      tags[1] ?? tags[tags.length - 1] ?? 'Lesson 02',
    ];
  }
  if (lesson.id === 'css-box-model') return ['margin', 'border / padding', 'content'];
  if (lesson.id === 'css-grid') return ['.grid', '1fr tracks', 'gap'];
  if (lesson.id === 'js-essentials') return ['const / let', 'function()', 'DOM Event'];
  if (lesson.id === 'react-components') return ['props', 'useState', '<Component />'];
  if (lesson.id === 'backend-deploy') return ['Client UI', 'REST API', 'SQL Store'];

  const a = tags[0] ?? `<${lesson.id}>`;
  const b = tags[1] ?? (tags[0] ? `${tags[0]} props` : 'attribute');
  const c = tags[2] ?? 'Browser DOM';
  return [a, b, c];
}

export function getLesson3DSpec(lesson: Lesson): Lesson3DSpec {
  const plates = getTagPair(lesson);
  const [tag1, tag2] = [lesson.tags?.[0] ?? lesson.title.en, lesson.tags?.[1] ?? ''];

  // 0. Dedicated Review Checkpoint Bridge (combines Lesson A -> Integration -> Lesson B)
  if (lesson.isReview && lesson.reviewedLessonTitles) {
    const [titleA, titleB] = lesson.reviewedLessonTitles;
    return {
      archetype: 'fullstack-flow',
      title: {
        en: `3D Review Bridge: ${titleA.en} + ${titleB.en}`,
        ar: `جسر المراجعة 3D: ${titleA.ar} + ${titleB.ar}`,
      },
      subtitle: {
        en: 'Inspect how signals and structure from the first lesson flow into and reinforce the second lesson.',
        ar: 'استكشف كيف يتكامل المفهوم الأول مع الثاني داخل بنية عمل مترابطة واحدة.',
      },
      supportsFlow: true,
      plateLabels: plates,
      overviewCamera: { pos: [4.5, 3.2, 4.5], target: [0, 1.0, 0] },
      parts: [
        {
          id: 'partA',
          label: {
            en: `Part 1: ${titleA.en}`,
            ar: `الجزء الأول: ${titleA.ar}`,
          },
          detail: {
            en: `Provides the structural foundation from "${titleA.en}" (${plates[0]}).`,
            ar: `يشكّل الأساس البنيوي من الدرس الأول "${titleA.ar}" (${plates[0]}).`,
          },
          cameraPos: [-2.8, 2.4, 3.2],
          cameraTarget: [-1.1, 0.9, 0],
        },
        {
          id: 'partB',
          label: {
            en: 'Unified Integration Layer',
            ar: 'طبقة الدمج والتكامل',
          },
          detail: {
            en: 'Connects syntax, attributes, and DOM hierarchy cleanly so both topics work together in one file.',
            ar: 'تربط الوسوم والخصائص والتسلسل البنيوي ليعمل الدرسان معاً بسلاسة.',
          },
          cameraPos: [0, 2.7, 3.4],
          cameraTarget: [0, 1.15, 0],
        },
        {
          id: 'partC',
          label: {
            en: `Part 2: ${titleB.en}`,
            ar: `الجزء الثاني: ${titleB.ar}`,
          },
          detail: {
            en: `Extends and completes the page with "${titleB.en}" (${plates[2]}).`,
            ar: `يُكمل البناء ويضيف قدرات الدرس الثاني "${titleB.ar}" (${plates[2]}).`,
          },
          cameraPos: [2.8, 2.4, 3.2],
          cameraTarget: [1.1, 0.9, 0],
        },
      ],
    };
  }

  // 1. CSS Box Model & Grid Dissector
  if (lesson.languageId === 'css') {
    const isGrid = lesson.id === 'css-grid';
    return {
      archetype: 'css-box-grid',
      title: isGrid
        ? { en: '3D CSS Grid Track Matrix', ar: 'شبكة CSS Grid ثلاثية الأبعاد' }
        : { en: '3D CSS Box Model Layers', ar: 'طبقات نموذج الصندوق Box Model ثلاثي الأبعاد' },
      subtitle: isGrid
        ? {
            en: 'Explode rows, fractional column tracks, and gap gutters spatially.',
            ar: 'فكّك الصفوف ومسارات الأعمدة المرنة fr وفراغات gap بشكل مجسّم.',
          }
        : {
            en: 'Separate Margin, Border, Padding, and Content planes along Y to inspect spacing.',
            ar: 'افصل طبقات الهامش الخارجي والحدود والحشوة والمحتوى عمودياً لفهم الأبعاد بدقة.',
          },
      supportsFlow: isGrid,
      plateLabels: plates,
      overviewCamera: { pos: [4.2, 3.6, 4.4], target: [0, 0.85, 0] },
      parts: [
        {
          id: 'partA',
          label: isGrid
            ? { en: 'Outer Grid Track Frame', ar: 'إطار مسارات الشبكة' }
            : { en: 'Margin Perimeter', ar: 'الهامش الخارجي Margin' },
          detail: isGrid
            ? {
                en: 'Defines the parent display: grid enclosure that aligns all child tracks.',
                ar: 'الحاوية الأب بـ display: grid التي تنظّم توزيع الأعمدة والصفوف.',
              }
            : {
                en: 'Transparent outer clearance separating this box from neighboring elements.',
                ar: 'المسافة الخارجية الفاصلة بين هذا الصندوق والعناصر المجاورة.',
              },
          cameraPos: [3.8, 2.2, 3.6],
          cameraTarget: [0, 0.2, 0],
        },
        {
          id: 'partB',
          label: isGrid
            ? { en: 'Gap & Fractional Columns', ar: 'الفواصل ووحدات 1fr' }
            : { en: 'Border & Padding Ring', ar: 'الحدود والحشوة Border/Padding' },
          detail: isGrid
            ? {
                en: 'Flexible 1fr divisions resize tracks proportionally with uniform gap spacing.',
                ar: 'أعمدة 1fr تتمدد وتنكمش تلقائياً مع مسافات gap ثابتة بين الخلايا.',
              }
            : {
                en: 'Border frames the element edge while padding cushions inner content away from it.',
                ar: 'الحدود تحيط بالصندوق، بينما تصنع padding مسافة داخلية تريح المحتوى.',
              },
          cameraPos: [2.9, 2.6, 2.9],
          cameraTarget: [0, 0.85, 0],
        },
        {
          id: 'partC',
          label: isGrid
            ? { en: 'Responsive Cells', ar: 'الخلايا المتجاوبة' }
            : { en: 'Inner Content Core', ar: 'قلب المحتوى Content' },
          detail: isGrid
            ? {
                en: 'Grid items snap strictly into track boundaries calculated by repeat(auto-fit, minmax()).',
                ar: 'تستقر البطاقات داخل مسارات الشبكة المحسوبة بـ minmax().',
              }
            : {
                en: 'The innermost core rendering typography, images, or nested child nodes.',
                ar: 'الطبقة المركزية التي تعرض النص أو الصور داخل الصندوق.',
              },
          cameraPos: [2.5, 3.2, 2.6],
          cameraTarget: [0, 1.35, 0],
        },
      ],
    };
  }

  // 2. JS / React / Backend Reactive Data Pipeline
  if (
    lesson.languageId === 'javascript' ||
    lesson.languageId === 'react' ||
    lesson.languageId === 'backend'
  ) {
    const isReact = lesson.languageId === 'react';
    const isBackend = lesson.languageId === 'backend';
    return {
      archetype: 'fullstack-flow',
      title: isBackend
        ? { en: '3D Request & SQL Pipeline', ar: 'مسار الطلبات وقاعدة البيانات 3D' }
        : isReact
          ? { en: '3D Component & State Flow', ar: 'تدفق المكونات والحالة في React 3D' }
          : { en: '3D Event & DOM Pipeline', ar: 'دورة الأحداث والتفاعل مع DOM 3D' },
      subtitle: {
        en: 'Watch live signal packets flow across state, logic, and rendered output layers.',
        ar: 'شاهد تدفق حزم البيانات بين الحالة والمنطق والواجهة المعروضة للمستخدم.',
      },
      supportsFlow: true,
      plateLabels: plates,
      overviewCamera: { pos: [4.5, 3.2, 4.5], target: [0, 1.0, 0] },
      parts: [
        {
          id: 'partA',
          label: { en: plates[0], ar: plates[0] },
          detail: isBackend
            ? {
                en: 'Client sends structured HTTP GET/POST requests into the backend pipeline.',
                ar: 'يرسل العميل طلبات HTTP منظمة نحو الخادم.',
              }
            : isReact
              ? {
                  en: 'Parent component passes read-only props downward to child UI blocks.',
                  ar: 'يمرر المكون الأب خصائص props للقراءة فقط نحو الأبناء.',
                }
              : {
                  en: 'const / let bindings store runtime state values safely in memory.',
                  ar: 'تحفظ المتغيرات const و let القيم والحالة في الذاكرة بأمان.',
                },
          cameraPos: [-2.8, 2.4, 3.2],
          cameraTarget: [-1.1, 0.9, 0],
        },
        {
          id: 'partB',
          label: { en: plates[1], ar: plates[1] },
          detail: isBackend
            ? {
                en: 'API Server validates payloads, reads process.env secrets, and authorizes actions.',
                ar: 'يتحقق الخادم من الصلاحيات ويقرأ الأسرار من process.env بأمان.',
              }
            : isReact
              ? {
                  en: 'useState triggers clean UI re-renders whenever the setter updates state.',
                  ar: 'يعيد useState رسم المكون تلقائياً فور تحديث الحالة عبر دالة التحديث.',
                }
              : {
                  en: 'Functions encapsulate reusable DOM updates triggered cleanly on demand.',
                  ar: 'تغلّف الدوال منطق تحديث الصفحة وتُستدعى عند الحاجة.',
                },
          cameraPos: [0, 2.7, 3.4],
          cameraTarget: [0, 1.15, 0],
        },
        {
          id: 'partC',
          label: { en: plates[2], ar: plates[2] },
          detail: isBackend
            ? {
                en: 'Parameterized SQL tables store persistent rows protected against injection.',
                ar: 'تحفظ جداول SQL البيانات بشكل دائم مع استعلامات محمية بمعاملات.',
              }
            : isReact
              ? {
                  en: 'Rendered JSX produces crisp DOM output reflecting current component state.',
                  ar: 'يُحوّل JSX النتيجة إلى عناصر DOM محدثة على الشاشة.',
                }
              : {
                  en: 'Event listeners connect user clicks and inputs back into JavaScript logic.',
                  ar: 'تربط مستمعات الأحداث نقرات المستخدم بمنطق JavaScript التفاعلي.',
                },
          cameraPos: [2.8, 2.4, 3.2],
          cameraTarget: [1.1, 0.9, 0],
        },
      ],
    };
  }

  // 3. HTML Chapter 01 + Ch 12 Document Shell & Embedded Layer
  if (lesson.chapterId === 'html-ch-01' || lesson.chapterId === 'html-ch-12') {
    const isCh12 = lesson.chapterId === 'html-ch-12';
    return {
      archetype: 'document-shell',
      title: isCh12
        ? { en: '3D Script, Template & Canvas Architecture', ar: 'بنية السكربت والقوالب والـ Canvas 3D' }
        : { en: '3D HTML5 Document Shell & DOM Frame', ar: 'الهيكل ثلاثي الأبعاد لمستند HTML5' },
      subtitle: {
        en: 'Inspect how the DOCTYPE foundation, hidden <head> configuration, and visible <body> stack together.',
        ar: 'استكشف كيف تتكامل قاعدة <!DOCTYPE> وطبقة الإعداد الخفية <head> مع مساحة العرض <body>.',
      },
      supportsFlow: true,
      plateLabels: plates,
      overviewCamera: { pos: [4.4, 3.5, 4.4], target: [0, 1.15, 0] },
      parts: [
        {
          id: 'partA',
          label: { en: `Foundation (${tag1})`, ar: `القاعدة الأساسية (${tag1})` },
          detail: {
            en: 'Locks the browser into modern HTML5 standards mode and opens the root DOM enclosure.',
            ar: 'يضبط المتصفح على الوضع القياسي الحديث ويفتح جذر المستند بالكامل.',
          },
          cameraPos: [3.2, 1.4, 3.2],
          cameraTarget: [0, 0.3, 0],
        },
        {
          id: 'partB',
          label: {
            en: tag2 ? `<head> Bus (${tag2})` : '<head> Metadata Rack',
            ar: tag2 ? `وحدة الإعداد (${tag2})` : 'وحدة بيانات <head>',
          },
          detail: {
            en: 'Holds title, charset metadata, stylesheet links, and base URLs before visible layout begins.',
            ar: 'تحمل العنوان والترميز وروابط التنسيق ومرجع الروابط قبل رسم أي عنصر مرئي.',
          },
          cameraPos: [2.9, 2.5, 3.1],
          cameraTarget: [0, 1.15, 0],
        },
        {
          id: 'partC',
          label: { en: '<body> Viewport Stage', ar: 'شاشة العرض <body>' },
          detail: {
            en: 'Renders every visible heading, paragraph, media element, and interactive script for users.',
            ar: 'تعرض كل العناصر المرئية والتفاعلية التي يراها المستخدم داخل المتصفح.',
          },
          cameraPos: [2.8, 3.4, 3.0],
          cameraTarget: [0, 2.0, 0],
        },
      ],
    };
  }

  // 4. HTML Ch 04 Links & Ch 06 Images/Vectors & Ch 07 Audio/Video & Ch 12 iframe
  if (
    lesson.chapterId === 'html-ch-04' ||
    lesson.chapterId === 'html-ch-06' ||
    lesson.chapterId === 'html-ch-07'
  ) {
    const isMedia = lesson.chapterId === 'html-ch-07';
    const isImages = lesson.chapterId === 'html-ch-06';
    return {
      archetype: 'media-conduit',
      title: isMedia
        ? { en: '3D Media Stream & Player Stage', ar: 'منصة بث الصوت والفيديو ثلاثية الأبعاد' }
        : isImages
          ? { en: '3D Optical Frame & Vector Viewport', ar: 'إطار الصور والرسوم المتجهة 3D' }
          : { en: '3D Hyperlink & Resource Conduit', ar: 'قناة الربط والتنقل ثلاثية الأبعاد' },
      subtitle: {
        en: 'Visualizes how source attributes (href / src) stream external files or targets into an inline viewport.',
        ar: 'يوضّح كيف تجلب سمات المصدر (href / src) الملفات أو الصفحات وتربطها بنقطة العرض.',
      },
      supportsFlow: true,
      plateLabels: plates,
      overviewCamera: { pos: [4.3, 3.1, 4.4], target: [0, 1.0, 0] },
      parts: [
        {
          id: 'partA',
          label: { en: `Source Anchor (${tag1})`, ar: `نقطة المصدر (${tag1})` },
          detail: {
            en: 'Declares the source URL, MIME hints, and accessible labels before loading external bytes.',
            ar: 'يحدد رابط المصدر والبديل النصي alt أو مسار التنقل بدقة.',
          },
          cameraPos: [-2.6, 2.3, 3.2],
          cameraTarget: [-1.1, 0.9, 0],
        },
        {
          id: 'partB',
          label: { en: 'Transfer Pipe & Packets', ar: 'مسار النقل والحزم' },
          detail: {
            en: 'Streams requested HTML pages, responsive srcset images, vector shapes, or media chunks cleanly.',
            ar: 'ينقل البيانات أو ينفذ الانتقال عبر الروابط بين المصدر ونافذة العرض.',
          },
          cameraPos: [0, 2.8, 3.5],
          cameraTarget: [0, 1.0, 0],
        },
        {
          id: 'partC',
          label: {
            en: tag2 ? `Viewport Output (${tag2})` : 'Rendered Media Frame',
            ar: tag2 ? `إطار العرض (${tag2})` : 'إطار العرض النهائي',
          },
          detail: {
            en: 'Displays crisp raster graphics, scalable SVG coordinates, or synchronized media controls.',
            ar: 'يعرض الصورة أو الرسم المتجه SVG أو مشغّل الصوت/الفيديو للمستخدم.',
          },
          cameraPos: [2.7, 2.3, 3.2],
          cameraTarget: [1.1, 1.0, 0],
        },
      ],
    };
  }

  // 5. HTML Ch 08 Tables + Ch 09/10 Forms & Controls + Ch 11 Interactive Dialogs/Details
  if (
    lesson.chapterId === 'html-ch-08' ||
    lesson.chapterId === 'html-ch-09' ||
    lesson.chapterId === 'html-ch-10' ||
    lesson.chapterId === 'html-ch-11'
  ) {
    const isTable = lesson.chapterId === 'html-ch-08';
    return {
      archetype: 'interactive-circuit',
      title: isTable
        ? { en: '3D Tabular Grid Matrix', ar: 'مصفوفة الجدول البياناتي ثلاثية الأبعاد' }
        : { en: '3D Interactive Control Console', ar: 'لوحة التحكم والنماذج ثلاثية الأبعاد' },
      subtitle: isTable
        ? {
            en: 'Inspect how table header rows align vertically over grouped body data cells.',
            ar: 'استكشف كيف تصطف صفوف الترويسة فوق خلايا البيانات والملخص بانتظام هندسي.',
          }
        : {
            en: 'Explode interactive inputs, accessible labels, and submission/disclosure pathways.',
            ar: 'فكّك عناصر الإدخال التفاعلية والوسوم المرتبطة بها ومسار إرسال البيانات.',
          },
      supportsFlow: true,
      plateLabels: plates,
      overviewCamera: { pos: [4.3, 3.4, 4.3], target: [0, 0.9, 0] },
      parts: [
        {
          id: 'partA',
          label: { en: `Input / Header Tier (${tag1})`, ar: `طبقة العنصر الأول (${tag1})` },
          detail: isTable
            ? {
                en: 'Groups semantic table columns or titles clearly above body cells.',
                ar: 'ينظم أعمدة الجدول أو ترويسته بوضوح فوق صفوف المحتوى.',
              }
            : {
                en: 'Captures structured user input or toggles interactive state with clear focus affordances.',
                ar: 'يستقبل مدخلات المستخدم أو يبدّل الحالة التفاعلية بوضوح.',
              },
          cameraPos: [2.9, 2.3, 3.2],
          cameraTarget: [0, 0.45, 0],
        },
        {
          id: 'partB',
          label: { en: tag2 ? `Control Bus (${tag2})` : 'Binding Circuitry', ar: tag2 ? `ربط التحكم (${tag2})` : 'دائرة الربط' },
          detail: {
            en: 'Links accessible names, types, constraints, and column spans along predictable axes.',
            ar: 'يربط الخصائص الدلالية والأنواع والقيود بشكل متناسق.',
          },
          cameraPos: [2.7, 2.7, 2.9],
          cameraTarget: [0, 0.9, 0],
        },
        {
          id: 'partC',
          label: { en: 'Action & Output State', ar: 'حالة التنفيذ والإخراج' },
          detail: {
            en: 'Delivers validated form submissions, open panels, or metered visual feedback.',
            ar: 'يعرض نتيجة الإرسال أو النافذة المنبثقة أو قياس القيمة بوضوح.',
          },
          cameraPos: [2.6, 3.2, 2.8],
          cameraTarget: [0, 1.35, 0],
        },
      ],
    };
  }

  // 6. Default HTML Semantic Blocks & Text / Lists (Ch 02, Ch 03, Ch 05)
  return {
    archetype: 'semantic-blocks',
    title: {
      en: `3D Structural Hierarchy — ${tag1}`,
      ar: `الهيكل البنيوي ثلاثي الأبعاد — ${tag1}`,
    },
    subtitle: {
      en: 'See how parent landmarks, hierarchy tiers, and inline elements nest cleanly in DOM space.',
      ar: 'شاهد كيف تترتب الحاويات الدلالية ومستويات العناوين والعناصر المتداخلة داخل شجرة الصفحة.',
    },
    supportsFlow: false,
    plateLabels: plates,
    overviewCamera: { pos: [4.2, 3.3, 4.3], target: [0, 1.0, 0] },
    parts: [
      {
        id: 'partA',
        label: { en: `Outer Container (${tag1})`, ar: `الحاوية أو الوسم الأساسي (${tag1})` },
        detail: {
          en: 'Establishes the primary structural boundary or typographic role in the document outline.',
          ar: 'يحدد الإطار البنيوي الأساسي أو الدور الدلالي للعنصر داخل المستند.',
        },
        cameraPos: [3.2, 1.8, 3.3],
        cameraTarget: [0, 0.35, 0],
      },
      {
        id: 'partB',
        label: {
          en: tag2 ? `Nested Role (${tag2})` : 'Inner Hierarchy Tier',
          ar: tag2 ? `المستوى المتداخل (${tag2})` : 'الطبقة الفرعية',
        },
        detail: {
          en: 'Organizes secondary headings, list items, or inline semantic annotations inside the parent.',
          ar: 'ينظم العناوين الفرعية أو عناصر القائمة أو التنسيق الدلالي داخل الأب.',
        },
        cameraPos: [2.8, 2.6, 3.0],
        cameraTarget: [0, 1.0, 0],
      },
      {
        id: 'partC',
        label: { en: 'Content Payload', ar: 'طبقة المحتوى النصي' },
        detail: {
          en: 'The readable text or inline phrasing rendered crisply for readers and screen readers.',
          ar: 'النص أو المحتوى النهائي الذي يظهر بوضوح للمستخدمين وقارئات الشاشة.',
        },
        cameraPos: [2.5, 3.2, 2.8],
        cameraTarget: [0, 1.55, 0],
      },
    ],
  };
}
