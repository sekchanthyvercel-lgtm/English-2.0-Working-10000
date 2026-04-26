import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';

/**
 * Builds a Word-compatible header that closely matches the web design.
 * Uses VML-safe table structures with mso-* properties for background colors.
 */
function buildWordSafeHeader(
  schoolName: string,
  schoolAddress: string,
  studentLabel: string,
  classLabel: string,
  dateLabel: string,
  scoreLabel: string,
  teacherLabel: string,
  logoData: string | undefined,
  paperDesign: number,
  activeRulerColor: string,
  fontFamily: string,
  topic: string,
  globalLayout: number,
  baseLayout: number,
  withColor: boolean,
  isTopBottomLineEnabled: boolean = false,
  topBottomLineColor: string = '#0ea5e9',
  isStarLineEnabled: boolean = false,
  starLineStyle: number = 0
): string {

  const logoHtml = logoData
    ? `<img src="${logoData}" style="width:60pt;height:auto;display:block;" />`
    : '';

  const accentColors: Record<number, string> = {
    5: '#1e293b', // Professional Navy
    8: '#166534', // Eco Green
    13: '#7f1d1d', // Bold Red (Maroon)
    14: '#92400e', // Royal Gold
    18: '#000000', // Academic Heavy
    19: '#4338ca', // Art Deco
    20: '#0ea5e9', // Futuristic
  };

  const accentColor = withColor ? (accentColors[paperDesign] || activeRulerColor || '#ea580c') : '#000000';
  
  // Derivative colors for frames (from globalLayout)
  let topBarColor = isTopBottomLineEnabled ? topBottomLineColor : '';
  let leftBarColor = isTopBottomLineEnabled ? topBottomLineColor : '';
  
  if (withColor && !isTopBottomLineEnabled) {
    if (globalLayout === 1) { // Orange Mix
      topBarColor = '#ea580c';
      leftBarColor = '#059669';
    } else if (globalLayout === 2) { // Emerald
      topBarColor = '#059669';
      leftBarColor = '#059669';
    } else if (globalLayout === 3) { // Lavender
      topBarColor = '#9333ea';
      leftBarColor = '#9333ea';
    } else if (globalLayout === 6) { // Sky
      topBarColor = '#0284c7';
      leftBarColor = '#0ea5e9';
    } else if (globalLayout === 15) { // Deep Ocean
      topBarColor = '#1e3a8a';
      leftBarColor = '#3b82f6';
    }
    
    // Override leftBarColor if paperDesign specifically requires it (e.g., Style 8 Eco Green)
    if (paperDesign === 8) leftBarColor = '#059669';
    if (paperDesign === 13) leftBarColor = '#b91c1c';
    if (paperDesign === 20) leftBarColor = '#0ea5e9';
  }

  // Custom Red Style (Style 13) specifically for the red horizontal bar
  const headerTopBarColor = paperDesign === 13 && withColor && !isTopBottomLineEnabled ? '#b91c1c' : topBarColor;
  
  const topBarHtml = headerTopBarColor ? `
    <table border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%; border-collapse:collapse; margin-bottom:0pt;">
      <tr><td style="background-color:${headerTopBarColor}; mso-shading:${headerTopBarColor}; height:12pt; font-size:1pt;">&nbsp;</td></tr>
    </table>` : '';

  // Header Style Mappings for left-bar professional headers
  if ([3, 7].includes(paperDesign)) {
    return `${topBarHtml}
    <table border="0" cellspacing="0" cellpadding="0" width="100%"
      style="width:100%; border-collapse:collapse; margin-bottom:4pt; margin-top:2pt;">
      <tr>
        <td style="width:15%; vertical-align:middle; text-align:left;">
          ${logoHtml}
        </td>
        <td style="width:50%; vertical-align:middle; padding-left:10pt; border-left:${leftBarColor ? `15pt solid ${leftBarColor}` : '15pt solid #000000'};">
          <div style="font-size:22pt; font-weight:900; color:${accentColor}; 
                       font-family:'${fontFamily}'; text-transform:uppercase;
                       line-height:1.1; margin-bottom:4pt;">
            ${schoolName}
          </div>
          <div style="font-size:9pt; color:${accentColor}; font-weight:700;
                      text-transform:uppercase; letter-spacing:2pt;">
            ${topic ? topic.toUpperCase() : 'ACADEMIC EVALUATION'}
          </div>
        </td>
        <td style="width:35%; vertical-align:top; padding:8pt 0 4pt 10pt; text-align:right;">
          <table border="0" cellspacing="0" cellpadding="0" style="margin-left:auto;">
            <tr>
              <td style="font-size:9pt; font-style:italic; padding-bottom:4pt; text-align:right;">
                ${studentLabel}: ________________________
              </td>
            </tr>
            <tr>
              <td style="font-size:9pt; font-style:italic; padding-bottom:4pt; text-align:right;">
                ${classLabel}: ________________________
              </td>
            </tr>
            <tr>
              <td style="font-size:9pt; font-style:italic; padding-bottom:4pt; text-align:right;">
                ${dateLabel}: ________________________
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    // DIVIDER LINE
    <table border="0" cellspacing="0" cellpadding="0" width="100%"
      style="width:100%; border-collapse:collapse; margin-bottom:4pt; margin-top:2pt;">
      <tr>
        <td style="border-bottom:1.5pt solid ${accentColor}; 
                   mso-border-bottom-alt:1.5pt solid ${accentColor}; 
                   height:1pt; font-size:1pt;">&nbsp;</td>
      </tr>
    </table>`;
  }

  // ── Style 14 (Royal Gold): Elegant Gold bar top ──
  if (paperDesign === 14) {
    return `
    <table border="0" cellspacing="0" cellpadding="0" width="100%"
      style="width:100%; border-collapse:collapse; background-color:#fef3c7; border:1.5pt solid #d97706; margin-bottom:8pt;">
      <tr>
        <td style="background-color:#d4af37; mso-shading:#d4af37; height:4pt; font-size:1pt;">&nbsp;</td>
      </tr>
      <tr>
        <td style="padding:15pt;">
          <table border="0" cellspacing="0" cellpadding="0" width="100%">
            <tr>
              <td style="width:65%; vertical-align:middle;">
                <div style="font-size:22pt; font-weight:900; color:#451a03; text-transform:uppercase;">${schoolName}</div>
                <div style="font-size:9pt; color:#92400e; font-weight:700; text-transform:uppercase; margin-top:4pt;">
                  ${topic ? topic.toUpperCase() : 'ACADEMIC EVALUATION'}
                </div>
              </td>
              <td style="width:35%; text-align:right; font-size:9pt; color:#451a03;">
                ${studentLabel}: __________________<br/>
                ${classLabel}: __________________<br/>
                ${dateLabel}: __________________
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
  }

  // ── Style 15 (Deep Ocean): Blue header ──
  if (paperDesign === 15) {
     return `
     <table border="0" cellspacing="0" cellpadding="0" width="100%" 
       style="width:100%; border-collapse:collapse; border-left:12pt solid #1e3a8a; margin-bottom:8pt; background-color:#eff6ff;">
       <tr>
         <td style="padding:15pt;">
            <div style="font-size:20pt; font-weight:900; color:#1e3a8a; text-transform:uppercase;">${schoolName}</div>
            <div style="height:1pt; background-color:#3b82f6; width:50%; margin:8pt 0;">&nbsp;</div>
            <table border="0" cellspacing="0" cellpadding="0" width="100%" style="font-size:9pt; color:#1e40af;">
               <tr>
                  <td>${studentLabel}: ____________________</td>
                  <td style="text-align:right;">${classLabel}: ____________________</td>
               </tr>
            </table>
         </td>
       </tr>
     </table>`;
  }

  // ── Style 6 (paperDesign === 5): Green Nature (Boxed) ──
  if (paperDesign === 5) {
    return `
    <table border="0" cellspacing="0" cellpadding="10" width="100%"
      style="width:100%; border-collapse:collapse; border:3pt solid #16a34a; background-color:#f0fdf4; margin-bottom:12pt;">
      <tr>
        <td style="padding:10pt;">
          <table border="0" cellspacing="0" cellpadding="0" width="100%" style="border-bottom:2pt solid #16a34a; padding-bottom:6pt; margin-bottom:6pt;">
            <tr>
              <td style="font-size:18pt; font-weight:900; color:#065f46; text-transform:uppercase;">
                ${schoolName}
              </td>
              <td style="font-size:8pt; font-weight:700; color:#059669; text-align:right;">
                ${dateLabel}: ______/______/______<br/><br/>
                ${classLabel}: ______________________
              </td>
            </tr>
          </table>
          <div style="font-size:9pt; font-weight:700; color:#064e3b; margin-top:5pt;">
            ${studentLabel}: __________________________________________
          </div>
        </td>
      </tr>
    </table>`;
  }

  // ── Style 9 variants (paperDesign 8, 18, 19, 20, 21): Top-bar border ──
  if ([8, 18, 19, 20, 21].includes(paperDesign)) {
    const styleColors: Record<number, { text: string, sub: string, border: string }> = {
      8: { text: '#881337', sub: '#f43f5e', border: '#e11d48' },   // Modern Red (rose)
      18: { text: '#064e3b', sub: '#10b981', border: '#059669' },  // Modern Green (emerald)
      19: { text: '#1e3a8a', sub: '#3b82f6', border: '#2563eb' },  // Modern Blue (blue)
      20: { text: '#581c87', sub: '#a855f7', border: '#9333ea' },  // Modern Purple (purple)
      21: { text: '#7c2d12', sub: '#f97316', border: '#ea580c' }   // Modern Orange (orange)
    };
    const c = styleColors[paperDesign];
    return `<table border="0" cellspacing="0" cellpadding="0" width="100%"
      style="width:100%; border-collapse:collapse; margin-bottom:4pt; margin-top:2pt;">
      <tr>
        <td style="border-top: 4pt solid ${c.border}; padding-top: 12pt; width:60%; vertical-align:top; text-align:left;">
          ${logoHtml ? `<div style="margin-bottom:8pt;">${logoHtml}</div>` : ''}
          <div style="font-size:24pt; font-weight:900; color:${c.text}; 
                       font-family:'${fontFamily}'; text-transform:uppercase; line-height:1;">
            ${schoolName}
          </div>
          <div style="font-size:9pt; color:${c.sub}; font-weight:700;
                      text-transform:uppercase; letter-spacing:2pt; margin-top:6pt;">
            ${topic ? topic.toUpperCase() : 'ACADEMIC EVALUATION'}
          </div>
        </td>
        <td style="border-top: 4pt solid ${c.border}; padding-top: 12pt; width:40%; vertical-align:top; text-align:right;">
          <table border="0" cellspacing="0" cellpadding="0" style="margin-left:auto;">
            <tr>
              <td style="font-size:9pt; font-style:italic; padding-bottom:6pt; color:#64748b; text-align:right;">
                ${studentLabel}: __________________
              </td>
            </tr>
            <tr>
              <td style="font-size:9pt; font-style:italic; padding-bottom:6pt; color:#64748b; text-align:right;">
                ${classLabel}: __________________
              </td>
            </tr>
            <tr>
              <td style="font-size:9pt; font-style:italic; padding-bottom:6pt; color:#64748b; text-align:right;">
                ${dateLabel}: __________________
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
  }

  // ── Style 1 (paperDesign === 1): Boxed header ──
  if (paperDesign === 1) {
    return `<table border="0" cellspacing="0" cellpadding="10" width="100%"
      style="width:100%; border-collapse:collapse; border:2pt solid #000000; margin-bottom:4pt;">
      <tr>
        <td colspan="2" style="text-align:center; padding:12pt; border-bottom:1pt solid #000000;">
          <div style="font-size:18pt; font-weight:900; text-transform:uppercase;">${schoolName}</div>
        </td>
      </tr>
      <tr>
        <td style="font-size:9pt; font-weight:700; padding:6pt 10pt; width:50%;">
          ${studentLabel}: ________________________
        </td>
        <td style="font-size:9pt; font-weight:700; padding:6pt 10pt; width:50%;">
          ${dateLabel}: ________________________
        </td>
      </tr>
      <tr>
        <td style="font-size:9pt; font-weight:700; padding:6pt 10pt;">
          ${classLabel}: _________________________
        </td>
        <td style="font-size:9pt; font-weight:700; padding:6pt 10pt;">
          ${scoreLabel}: ________ / ________
        </td>
      </tr>
    </table>`;
  }

  // ── Style 4 (paperDesign === 4): Dark header ──
  if (paperDesign === 4) {
    return `<table border="0" cellspacing="0" cellpadding="0" width="100%"
      style="width:100%; border-collapse:collapse; margin-bottom:4pt;">
      <tr>
        <td style="background-color:#1e293b; mso-shading:#1e293b; mso-pattern:solid;
                   padding:16pt; border-radius:8pt;">
          <div style="color:#ffffff; font-size:18pt; font-weight:900; 
                      text-transform:uppercase; margin-bottom:10pt;">${schoolName}</div>
          <table border="0" cellspacing="0" cellpadding="0" width="100%">
            <tr>
              <td style="color:#ffffff; font-size:9pt; font-weight:700; 
                         border-bottom:1pt solid rgba(255,255,255,0.3); padding-bottom:2pt; width:33%;">
                ${studentLabel}: ____________
              </td>
              <td style="color:#ffffff; font-size:9pt; font-weight:700;
                         border-bottom:1pt solid rgba(255,255,255,0.3); padding-bottom:2pt; width:33%;">
                ${classLabel}: ____________
              </td>
              <td style="color:#ffffff; font-size:9pt; font-weight:700;
                         border-bottom:1pt solid rgba(255,255,255,0.3); padding-bottom:2pt; width:34%;">
                ${scoreLabel}: ______
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
  }

  // ── DEFAULT: Classic clean header (paperDesign 0, 2, 3, 5, 6, 7, 9, 10, 11...) ──
  return `<table border="0" cellspacing="0" cellpadding="0" width="100%"
    style="width:100%; border-collapse:collapse; margin-bottom:2pt;">
    <tr>
      <td style="border-bottom:2pt solid #000000; padding-bottom:6pt;">
        <table border="0" cellspacing="0" cellpadding="0" width="100%">
          <tr>
            <td style="vertical-align:middle; width:70%;">
              ${logoHtml}
              <div style="font-size:18pt; font-weight:900; text-transform:uppercase;
                          line-height:1.2;">${schoolName}</div>
              ${schoolAddress ? `<div style="font-size:9pt; color:#666666;">${schoolAddress}</div>` : ''}
            </td>
            <td style="vertical-align:top; width:30%; text-align:right;">
              <div style="font-size:9pt; font-weight:700; margin-bottom:4pt;">
                ${studentLabel}: _______________
              </div>
              <div style="font-size:9pt; font-weight:700; margin-bottom:4pt;">
                ${classLabel}: _______________
              </div>
              <div style="font-size:9pt; font-weight:700;">
                ${dateLabel}: _______________
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

export interface ExportMetadata {
  author?: string;
  date?: string;
  title?: string;
}

export const exportToWord = (
  htmlContent: string, 
  filename: string, 
  headerHtml: string = '', 
  marginValue: string = '0.4in 0.6in 0.4in 0.6in',
  fontFamily: string = 'Times New Roman',
  lineHeight: string = '1.15',
  metadata?: ExportMetadata,
  isFrameEnabled: boolean = false,
  activeDesign: string | number = '',
  paperStyles?: any,
  mcqStyle: number = 0,
  globalLayout: number = 0,
  baseLayout: number = 0,
  instructionRulerStyle: number = 0,
  instructionHeaderStyle: number = 0,
  instructionStyle: number = 0,
  isInstructionBackgroundEnabled: boolean = false,
  isColorExportEnabled: boolean = false,
  exportTheme: number = 1,
  isTopBottomLineEnabled: boolean = false,
  topBottomLineColor: string = '#0ea5e9',
  brandSettings?: {
    schoolName?: string;
    schoolAddress?: string;
    studentLabel?: string;
    classLabel?: string;
    dateLabel?: string;
    scoreLabel?: string;
    teacherLabel?: string;
    logoData?: string;
  },
  paperDesignIndex?: number,
  topicText?: string,
  tableDesignStyle: number = 0,
  exportTableOrDivider: 'TB' | 'DVD' = 'TB',
  isStarLineEnabled: boolean = false,
  starLineStyle: number = 0
) => {
  const mcqLetterCase = 'uppercase';
  
  // PRE-CLEANING: Aggressively remove any empty paragraphs or artificial breaks that cause gaps in Word
  let cleanedHtml = htmlContent
    .replace(/<p>\s*(&nbsp;)?\s*<\/p>/gi, '')
    .replace(/\n\s*\n/g, '\n');
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = cleanedHtml;

  // UNWRAP WRAPPER DIVS IMMEDIATELY (Crucial to avoid removing the entire content during cleaning)
  while (tempDiv.children.length === 1 && (tempDiv.firstElementChild?.tagName === 'DIV' || tempDiv.firstElementChild?.classList.contains('prose'))) {
    const wrapper = tempDiv.firstElementChild as HTMLElement;
    tempDiv.innerHTML = wrapper.innerHTML;
  }

  const headerDiv = document.createElement('div');
  headerDiv.innerHTML = headerHtml;

  // Randomize Ruler Color if it's the middle ruler layout
  // Use topBottomLineColor (randomizedExportColor from App.tsx) for consistency if available
  let activeRulerColor = topBottomLineColor || '#334155'; 
  
  if (baseLayout === 3 || activeDesign === '3' || activeDesign === 3) {
    // If we're in Divider 4, ensure we have a vibrant color if topBottomLineColor wasn't set
    if (!topBottomLineColor || topBottomLineColor === 'white' || topBottomLineColor === 'transparent') {
      const vibrantColors = ['#f97316', '#3b82f6', '#10b981', '#f43f5e', '#8b5cf6', '#f59e0b', '#6366f1', '#06b6d4'];
      activeRulerColor = vibrantColors[Math.floor(Math.random() * vibrantColors.length)];
    }
  }
  else if (globalLayout === 1 || activeDesign === 'design-playful') activeRulerColor = '#059669'; 
  else if (globalLayout === 2 || activeDesign === 'design-eco') activeRulerColor = '#059669';
  else if (activeDesign === 'design-modern-blue') activeRulerColor = '#2563eb';
  else if (globalLayout === 3) activeRulerColor = '#9333ea';

  // Sanitize font family for Word (extract first quoted name or use cleanly)
  // If fontFamily is like "'EB Garamond', serif", we want "EB Garamond"
  let cleanFontName = fontFamily.split(',')[0].replace(/['"]/g, '').trim();
  if (!cleanFontName) cleanFontName = 'Times New Roman';

  // ── WORD-SAFE HEADER OVERRIDE ──
  // The LLM-generated header uses CSS that Word ignores.
  // We replace it with a table-based Word-compatible version.
  const wordSafeHeader = buildWordSafeHeader(
    brandSettings?.schoolName || 'GLOBAL EDUCATION ACADEMY',
    brandSettings?.schoolAddress || '',
    brandSettings?.studentLabel || 'STUDENT NAME',
    brandSettings?.classLabel || 'CLASS',
    brandSettings?.dateLabel || 'DATE',
    brandSettings?.scoreLabel || 'SCORE',
    brandSettings?.teacherLabel || 'TEACHER',
    brandSettings?.logoData,
    paperDesignIndex || 0,
    activeRulerColor,
    cleanFontName,
    topicText || '',
    globalLayout,
    baseLayout,
    isColorExportEnabled,
    isTopBottomLineEnabled,
    topBottomLineColor,
    isStarLineEnabled,
    starLineStyle
  );

  // If we have brandSettings, aggressively remove redundant headers and student info from content
  if (brandSettings) {
    // 1. Remove explicit header elements
    tempDiv.querySelectorAll('.school-header, .worksheet-header, .academic-evaluation, h1').forEach(el => el.remove());
    
    // 2. Remove redundant school name and student board info from the TOP part of content only
    // To avoid removing the entire worksheet, we only target elements in the first 10-15 children.
    const schoolNamePart = (brandSettings.schoolName || '').split(' ')[0].toUpperCase();
    const children = Array.from(tempDiv.children);
    const topLimit = Math.min(children.length, 12);
    
    for (let i = 0; i < topLimit; i++) {
      const el = children[i];
      const text = el.textContent?.toUpperCase() || '';
      
      // Keywords that indicate header/student info
      const headerKeywords = ['NAME', 'CLASS', 'DATE', 'SCORE', 'TEACHER', 'ACADEMIC EVALUATION'];
      if (schoolNamePart.length > 2) headerKeywords.push(schoolNamePart);
      
      const matchCount = headerKeywords.filter(w => text.includes(w)).length;
      const hasContentMarkers = text.includes('PART') || text.includes('EXERCISE') || text.includes('QUESTION') || text.includes('I.') || text.includes('1.');
      
      // If it looks like a header (contains school name or multiple student fields) 
      // and doesn't look like actual content, remove it.
      if ((matchCount >= 2 || (schoolNamePart && text.includes(schoolNamePart) && text.length < 100)) && !hasContentMarkers) {
        el.remove();
      }
    }
  }

  // Dynamic Line Spacing Logic
  const spacingMap: Record<string, string> = {
    '1.0': '15pt',
    '1.15': '18pt',
    '1.5': '24pt',
    '2.0': '32pt'
  };
  const exactLineHeight = spacingMap[lineHeight] || `${Math.round(parseFloat(lineHeight) * 16)}pt`;

  // 1. Force MCQ text to be plain in Word - ABSOLUTE FIX
  tempDiv.querySelectorAll('.options-table td, [data-type="mcq-options"] td').forEach(td => {
    const cell = td as HTMLElement;
    cell.style.fontWeight = 'normal';
    cell.style.setProperty('font-weight', 'normal', 'important');
    cell.querySelectorAll('*').forEach(child => {
       (child as HTMLElement).style.fontWeight = 'normal';
       (child as HTMLElement).style.setProperty('font-weight', 'normal', 'important');
       if (child.tagName === 'B' || child.tagName === 'STRONG') {
          // Replace bold tags with spans
          const span = document.createElement('span');
          span.innerHTML = child.innerHTML;
          span.style.fontWeight = 'normal';
          child.parentNode?.replaceChild(span, child);
       }
    });
  });

  // 1. Image Formatting (Synchronous to prevent Chrome's strict gesture-expiry download interruptions)
  const images = [...Array.from(tempDiv.querySelectorAll('img')), ...Array.from(headerDiv.querySelectorAll('img'))];
  for (const img of images) {
    const originalWidth = img.width || 550;
    const isLogo = img.style.maxHeight === '80pt' || img.classList.contains('logo') || headerDiv.contains(img);

    if (isLogo) {
      img.style.width = '1.25in';
      img.style.height = 'auto';
    } else if (originalWidth > 200) {
      img.style.width = '6.5in';
      img.style.height = 'auto';
    } else {
      img.style.width = `${(originalWidth / 96).toFixed(2)}in`;
      img.style.height = 'auto';
    }
    img.style.display = 'block';
    if (!isLogo) img.style.margin = '5px auto';
  }

  // 1.5. STRICT BACKGROUND STRIPPING (Instruction Mode)
  if (!isInstructionBackgroundEnabled) {
    const allHeaders = tempDiv.querySelectorAll('.header-row, .part-header, .instruction-header, h2, h3');
    allHeaders.forEach(el => {
      const header = el as HTMLElement;
      header.style.backgroundColor = 'transparent';
      header.style.color = '#000000';
      header.style.setProperty('mso-shading', 'transparent');
      header.style.border = 'none';
      header.style.setProperty('mso-border-alt', 'none');
    });
  }

  // 1.6. SHAPE BOX CONVERSION (VML for Word)
  const shapeBoxes = tempDiv.querySelectorAll('.shape-drawn-1, .shape-drawn-2, .shape-drawn-3, .shape-box');
  shapeBoxes.forEach(box => {
    const el = box as HTMLElement;
    const content = el.innerHTML;
    // Detect green border from style if present, or use default
    const borderColor = '#059669'; 
    const bgColor = '#f0fdf4';
    
    el.innerHTML = `
      <!--[if gte vml 1]>
      <v:roundrect arcsize="0.25" style="width:100%; padding:15pt;" filled="t" fillcolor="${bgColor}" strokecolor="${borderColor}" strokeweight="2pt" o:allowincell="t">
        <v:textbox inset="10pt,10pt,10pt,10pt" style="mso-fit-shape-to-text:t;">
          <div style="font-family:'${fontFamily}'; font-size:11pt; color:#064e3b; text-align:center;">
            ${content}
          </div>
        </v:textbox>
      </v:roundrect>
      <![endif]-->
      <!--[if !mso]>--><div style="border:2pt solid ${borderColor}; border-radius:15pt; padding:15pt; background-color:${bgColor}; color:#064e3b; text-align:center; margin:10pt 0;">${content}</div><!--<![endif]-->
    `;
    el.style.border = 'none';
    el.style.backgroundColor = 'transparent';
  });

  // Map activeDesign ID to design classes for logic
  const designClassMap: Record<string, string> = {
    '1': 'design-modern-blue',
    '2': 'design-classic',
    '3': 'design-minimalist',
    '8': 'design-eco'
  };
  const designClass = designClassMap[activeDesign] || '';

  // Comprehensive MCQ Styles
  const mcqElements = tempDiv.querySelectorAll('b, strong, span');
  mcqElements.forEach(el => {
    // PROTECT ANSWER KEY: Do not circle letters in the answer key section
    const isAnswerKey = el.closest('.answer-key-section') || el.closest('.answer-key');
    if (isAnswerKey) return;

    if (mcqStyle > 0) {
      // Keep original case if requested, else uppercase (or lowercase based on setting)
      let rawText = el.textContent?.trim() || '';
      let match = rawText.match(/[a-dA-D]/);
      if (!match) return;
      
      let text = (match[0]).toUpperCase();

      if (['A', 'B', 'C', 'D', 'a', 'b', 'c', 'd'].includes(text)) {
        let borderColor = '#000000';
        let textColor = '#000000';
        let bgColor = '#ffffff';
        let isFilled = 'f';
        
        if (isColorExportEnabled) {
          if (activeDesign === 'design-eco' && (mcqStyle === 1 || mcqStyle === 15)) {
            borderColor = '#059669'; bgColor = '#ecfdf5'; textColor = '#065f46'; isFilled = 't';
          } else if ((activeDesign === 'design-modern-blue' || activeDesign === 'design-bold-red') && (mcqStyle === 1 || mcqStyle === 15)) {
            borderColor = '#2563eb'; bgColor = '#eff6ff'; textColor = '#171717'; isFilled = 't';
          }
        }

        if (mcqStyle === 1 || mcqStyle === 15) {
          const vmlFillAttr = isFilled === 't' ? `filled="t" fillcolor="${bgColor}"` : 'filled="f"';
          const htmlBgStyle = isFilled === 't' ? `background:${bgColor};` : 'background:transparent;';
          
          el.innerHTML = `<!--[if gte vml 1]><v:oval style="width:12.5pt;height:18pt;position:relative;top:-1.5pt;" ${vmlFillAttr} strokecolor="${borderColor}" strokeweight="0.75pt" o:allowincell="t"><v:textbox inset="0,0,0,0" style="mso-fit-shape-to-text:f;mso-direction-alt:auto;v-text-anchor:top;"><div style="text-align:center;font-size:7pt;line-height:7pt;color:${textColor};font-weight:normal;font-family:'${fontFamily}';margin:-2.5pt 0 0 0;padding:0;">${text}</div></v:textbox></v:oval><![endif]--><!--[if !mso]>--><span style="border:0.75pt solid ${borderColor}; width:12.5pt; height:18pt; border-radius:50%; ${htmlBgStyle} color:${textColor}; font-weight:normal; font-size:7pt; box-sizing:border-box; display:inline-flex; align-items:flex-start; justify-content:center; text-align:center; vertical-align:1pt; padding-top: 0;">${text}</span><!--<![endif]-->&nbsp;&nbsp;&nbsp;&nbsp;`;
          (el as HTMLElement).style.border = 'none';
          (el as HTMLElement).style.setProperty('mso-border-alt', 'none');
          (el as HTMLElement).style.backgroundColor = 'transparent';
          (el as HTMLElement).style.setProperty('mso-shading', 'transparent');
          (el as HTMLElement).style.marginRight = '0pt';
          (el as HTMLElement).style.verticalAlign = 'baseline';
          (el as HTMLElement).classList.add('mcq-letter-vml');
        }
        else if (mcqStyle === 2) {
          el.innerHTML = `<!--[if gte vml 1]><v:rect style="width:12.5pt;height:18pt;position:relative;top:-1.5pt;" filled="f" strokecolor="#000000" strokeweight="0.75pt" o:allowincell="t"><v:textbox inset="0,0,0,0" style="mso-fit-shape-to-text:f;v-text-anchor:top;"><div style="text-align:center;font-size:7pt;line-height:7pt;color:black;font-weight:normal;font-family:'${fontFamily}';margin:-2.5pt 0 0 0;padding:0;">${text}</div></v:textbox></v:rect><![endif]--><!--[if !mso]>--><span style="border:0.75pt solid black; width:12.5pt; height:18pt; color:black; font-weight:normal; font-size:7pt; box-sizing:border-box; display:inline-flex; align-items:flex-start; justify-content:center; text-align:center; vertical-align:1pt; padding-top: 0;">${text}</span><!--<![endif]-->&nbsp;&nbsp;&nbsp;&nbsp;`;
          (el as HTMLElement).style.border = 'none';
          (el as HTMLElement).style.setProperty('mso-border-alt', 'none');
          (el as HTMLElement).style.backgroundColor = 'transparent';
          (el as HTMLElement).style.setProperty('mso-shading', 'transparent');
          (el as HTMLElement).style.marginRight = '0pt';
          (el as HTMLElement).style.verticalAlign = 'baseline';
          (el as HTMLElement).classList.add('mcq-letter-vml');
        }
        else if (mcqStyle === 16) { // NEW: Pill / Tall Oval Style
          el.innerHTML = `<!--[if gte vml 1]><v:oval style="width:12.5pt;height:20pt;position:relative;top:-1.5pt;" filled="f" strokecolor="#000000" strokeweight="1pt" o:allowincell="t"><v:textbox inset="0,0,0,0" style="mso-fit-shape-to-text:f;v-text-anchor:top;"><div style="text-align:center;font-size:7pt;line-height:7pt;color:black;font-weight:normal;font-family:'${fontFamily}';margin:-2.5pt 0 0 0;padding:0;">${text}</div></v:textbox></v:oval><![endif]--><!--[if !mso]>--><span style="border:1pt solid black; width:12.5pt; height:20pt; border-radius:50% / 30%; color:black; font-weight:normal; font-size:7pt; box-sizing:border-box; display:inline-flex; align-items:flex-start; justify-content:center; text-align:center; vertical-align:1pt; padding-top: 0;">${text}</span><!--<![endif]-->&nbsp;&nbsp;&nbsp;&nbsp;`;
          (el as HTMLElement).style.border = 'none';
          (el as HTMLElement).style.marginRight = '0pt';
          (el as HTMLElement).style.verticalAlign = 'baseline';
          (el as HTMLElement).classList.add('mcq-letter-vml');
        }
        else if (mcqStyle === 17) { // NEW: Small Round Style (5pt font, 0.5pt stroke)
          el.innerHTML = `<!--[if gte vml 1]><v:oval style="width:12pt;height:12pt;position:relative;top:0pt;" filled="f" strokecolor="#000000" strokeweight="0.5pt" o:allowincell="t"><v:textbox inset="0,0,0,0" style="mso-fit-shape-to-text:f;mso-direction-alt:auto;v-text-anchor:middle;"><div style="text-align:center;font-size:6pt;line-height:6pt;color:black;font-weight:normal;font-family:'${fontFamily}';margin:0;padding:0 0 1.5pt 0;">${text}</div></v:textbox></v:oval><![endif]--><!--[if !mso]>--><span style="border:0.5pt solid black; width:12pt; height:12pt; border-radius:50%; color:black; font-weight:normal; font-size:6pt; box-sizing:border-box; display:inline-flex; align-items:center; justify-content:center; text-align:center; vertical-align:1pt; padding-bottom: 1.5pt;">${text}</span><!--<![endif]-->&nbsp;&nbsp;&nbsp;&nbsp;`;
          (el as HTMLElement).style.border = 'none';
          (el as HTMLElement).style.setProperty('mso-border-alt', 'none');
          (el as HTMLElement).style.backgroundColor = 'transparent';
          (el as HTMLElement).style.setProperty('mso-shading', 'transparent');
          (el as HTMLElement).style.marginRight = '0pt';
          (el as HTMLElement).style.verticalAlign = 'baseline';
          (el as HTMLElement).classList.add('mcq-letter-vml');
        }
        else if (mcqStyle === 18) { // NEW: Round 2 (Oval)
          el.innerHTML = `<!--[if gte vml 1]><v:oval style="width:26pt;height:22pt;position:relative;top:2pt;" filled="f" strokecolor="#000000" strokeweight="0.75pt" o:allowincell="t"><v:textbox inset="0,0,0,0" style="mso-fit-shape-to-text:f;mso-direction-alt:auto;v-text-anchor:middle;"><div style="text-align:center;font-size:10pt;line-height:10pt;color:black;font-weight:normal;font-family:'${fontFamily}';margin:0;padding:2pt 0 0 0;">${text}</div></v:textbox></v:oval><![endif]--><!--[if !mso]>--><span style="border:0.75pt solid black; width:26pt; height:22pt; border-radius:50%; color:black; font-weight:normal; font-size:10pt; box-sizing:border-box; display:inline-flex; align-items:center; justify-content:center; text-align:center; vertical-align:-2pt;">${text}</span><!--<![endif]-->&nbsp;&nbsp;&nbsp;&nbsp;`;
          (el as HTMLElement).style.border = 'none';
          (el as HTMLElement).style.setProperty('mso-border-alt', 'none');
          (el as HTMLElement).style.backgroundColor = 'transparent';
          (el as HTMLElement).style.setProperty('mso-shading', 'transparent');
          (el as HTMLElement).style.marginRight = '0pt';
          (el as HTMLElement).style.verticalAlign = 'baseline';
          (el as HTMLElement).classList.add('mcq-letter-vml');
        }
        else if (mcqStyle === 19) { // NEW: Round 3 (Sharp Small)
          el.innerHTML = `<!--[if gte vml 1]><v:oval style="width:10pt;height:10pt;position:relative;top:1pt;" filled="f" strokecolor="#000000" strokeweight="1.25pt" o:allowincell="t"><v:textbox inset="0,0,0,0" style="mso-fit-shape-to-text:f;mso-direction-alt:auto;v-text-anchor:middle;"><div style="text-align:center;font-size:16.5pt;line-height:16.5pt;color:black;font-weight:normal;font-family:'${fontFamily}';margin:0;padding: -3pt 0 0 0;">${text}</div></v:textbox></v:oval><![endif]--><!--[if !mso]>--><span style="border:1.25pt solid black; width:10pt; height:10pt; border-radius:50%; color:black; font-weight:normal; font-size:16.5pt; line-height:10pt; box-sizing:border-box; display:inline-flex; align-items:center; justify-content:center; text-align:center; vertical-align:-1pt;">${text}</span><!--<![endif]-->&nbsp;&nbsp;&nbsp;&nbsp;`;
          (el as HTMLElement).style.border = 'none';
          (el as HTMLElement).style.setProperty('mso-border-alt', 'none');
          (el as HTMLElement).style.backgroundColor = 'transparent';
          (el as HTMLElement).style.setProperty('mso-shading', 'transparent');
          (el as HTMLElement).style.marginRight = '0pt';
          (el as HTMLElement).style.verticalAlign = 'baseline';
          (el as HTMLElement).classList.add('mcq-letter-vml');
        }
        else if (mcqStyle === 20) { // NEW: Round 4 (Rounded Rect/Sun)
          el.innerHTML = `<!--[if gte vml 1]><v:roundrect arcsize="0.4" style="width:26pt;height:26pt;position:relative;top:5pt;" filled="f" strokecolor="#000000" strokeweight="0.75pt" o:allowincell="t"><v:textbox inset="0,0,0,0" style="mso-fit-shape-to-text:f;mso-direction-alt:auto;v-text-anchor:middle;"><div style="text-align:center;font-size:14pt;line-height:14pt;color:black;font-weight:normal;font-family:'${fontFamily}';margin:0;padding:5pt 0 0 0;">${text}</div></v:textbox></v:roundrect><![endif]--><!--[if !mso]>--><span style="border:0.75pt solid black; width:26pt; height:26pt; border-radius:30%; color:black; font-weight:normal; font-size:14pt; box-sizing:border-box; display:inline-flex; align-items:center; justify-content:center; text-align:center; vertical-align:-5pt;">${text}</span><!--<![endif]-->&nbsp;&nbsp;&nbsp;&nbsp;`;
          (el as HTMLElement).style.border = 'none';
          (el as HTMLElement).style.setProperty('mso-border-alt', 'none');
          (el as HTMLElement).style.backgroundColor = 'transparent';
          (el as HTMLElement).style.setProperty('mso-shading', 'transparent');
          (el as HTMLElement).style.marginRight = '0pt';
          (el as HTMLElement).style.verticalAlign = 'baseline';
          (el as HTMLElement).classList.add('mcq-letter-vml');
        }
        else if (mcqStyle === 21) { // NEW: Round 5 (Dashed Star)
          el.innerHTML = `<!--[if gte vml 1]><v:oval dashstyle="dash" style="width:28pt;height:28pt;position:relative;top:6pt;" filled="f" strokecolor="#000000" strokeweight="1.25pt" o:allowincell="t"><v:textbox inset="0,0,0,0" style="mso-fit-shape-to-text:f;mso-direction-alt:auto;v-text-anchor:middle;"><div style="text-align:center;font-size:14pt;line-height:14pt;color:black;font-weight:normal;font-family:'${fontFamily}';margin:0;padding:6pt 0 0 0;">${text}</div></v:textbox></v:oval><![endif]--><!--[if !mso]>--><span style="border:1.25pt dashed black; width:28pt; height:28pt; border-radius:50%; color:black; font-weight:normal; font-size:14pt; box-sizing:border-box; display:inline-flex; align-items:center; justify-content:center; text-align:center; vertical-align:-6pt;">${text}</span><!--<![endif]-->&nbsp;&nbsp;&nbsp;&nbsp;`;
          (el as HTMLElement).style.border = 'none';
          (el as HTMLElement).style.setProperty('mso-border-alt', 'none');
          (el as HTMLElement).style.backgroundColor = 'transparent';
          (el as HTMLElement).style.setProperty('mso-shading', 'transparent');
          (el as HTMLElement).style.marginRight = '0pt';
          (el as HTMLElement).style.verticalAlign = 'baseline';
          (el as HTMLElement).classList.add('mcq-letter-vml');
        }
        else if (mcqStyle === 6) el.innerHTML = `◆${text}`;
        else if (mcqStyle === 8) {
          el.innerHTML = text === 'A' ? 'Ⓐ' : text === 'B' ? 'Ⓑ' : text === 'C' ? 'Ⓒ' : 'Ⓓ';
          (el as HTMLElement).style.border = 'none';
          (el as HTMLElement).style.setProperty('mso-border-alt', 'none');
          (el as HTMLElement).style.backgroundColor = 'transparent';
          (el as HTMLElement).style.setProperty('mso-shading', 'transparent');
        }
        else if (mcqStyle === 11 || mcqStyle === 12) {
          let borderType = mcqStyle === 11 ? 'dashstyle="solid" strokeweight="1pt"' : 'dashstyle="dot" strokeweight="1.2pt"';
          let htmlBorder = mcqStyle === 11 ? '1pt solid black' : '1.2pt dotted black';

          el.innerHTML = `<!--[if gte vml 1]><v:oval style="width:15pt;height:21pt;position:relative;top:2pt;" filled="f" strokecolor="black" ${borderType} o:allowincell="t"><v:textbox inset="0,0,0,0" style="mso-fit-shape-to-text:f;v-text-anchor:top;"><div style="text-align:center;font-size:7pt;line-height:7pt;color:black;font-weight:bold;font-family:'${fontFamily}';margin:0;padding:0;">${text}</div></v:textbox></v:oval><![endif]--><!--[if !mso]>--><span style="border:${htmlBorder}; width:15pt; height:21pt; border-radius:50%; background:transparent; color:black; font-weight:bold; font-size:7pt; box-sizing:border-box; display:inline-flex; align-items:flex-start; justify-content:center; text-align:center; vertical-align:-2pt;">${text}</span><!--<![endif]-->&nbsp;&nbsp;&nbsp;&nbsp;`;
          (el as HTMLElement).style.border = 'none';
          (el as HTMLElement).style.setProperty('mso-border-alt', 'none');
          (el as HTMLElement).style.backgroundColor = 'transparent';
          (el as HTMLElement).style.setProperty('mso-shading', 'transparent');
          (el as HTMLElement).style.marginRight = '0pt';
          (el as HTMLElement).style.verticalAlign = 'baseline';
        }
        else if (mcqStyle === 13 || mcqStyle === 14) {
          el.innerHTML = text === 'A' ? '🅐' : text === 'B' ? '🅑' : text === 'C' ? '🅒' : '🅓';
          (el as HTMLElement).style.border = 'none';
          (el as HTMLElement).style.setProperty('mso-border-alt', 'none');
          (el as HTMLElement).style.backgroundColor = 'transparent';
          (el as HTMLElement).style.setProperty('mso-shading', 'transparent');
          if (mcqStyle === 14) (el as HTMLElement).style.color = '#10b981';
          (el as HTMLElement).innerHTML += '&nbsp;&nbsp;&nbsp;&nbsp;';
          (el as HTMLElement).style.marginRight = '0pt';
          (el as HTMLElement).style.verticalAlign = 'baseline';
        }
      }
    }
  });

  // Instruction Rulers
  const existingRulers = tempDiv.querySelectorAll('[class*="instruction-ruler-"]');
  existingRulers.forEach(ruler => {
    const el = ruler as HTMLElement;
    const styleNum = parseInt(el.className.match(/instruction-ruler-(\d+)/)?.[1] || '0');
    el.style.width = '100%';
    el.style.margin = '0 0 0 0';
    el.style.padding = '0';
    el.innerHTML = '';
    if (styleNum === 1) el.style.borderBottom = `1.5pt solid ${activeRulerColor}`;
    else if (styleNum === 2) el.style.borderBottom = `2pt dashed ${activeRulerColor}`;
    else if (styleNum === 3) el.style.borderBottom = `4pt double ${activeRulerColor}`;
    else if (styleNum === 4) el.style.borderBottom = `4pt solid ${activeRulerColor}`;
    else if (styleNum === 5 || styleNum === 6) el.style.borderBottom = `1pt solid ${activeRulerColor}`;
    
    if (styleNum > 0) el.style.setProperty('mso-border-bottom-alt', el.style.borderBottom);
  });

  // 1. TRANSFORM MCQ OPTIONS INTO WORD-SAFE LAYOUT TABLES
  const optionsTables = tempDiv.querySelectorAll('.options-table, [data-type="mcq-options"]');
  optionsTables.forEach(table => {
    const parent = table.parentElement;
    if (!parent) return;

    // We use a clean table because Word treats nested inline-blocks as vertical piles.
    // This table is purely for structural layout (1-column, 2-column, or 4-column).
    const legacyRow = table.querySelector('tr');
    if (!legacyRow) return;
    
    const cells = Array.from(legacyRow.cells);
    const columnCount = cells.length || 1;
    const cellWidth = Math.floor(100 / columnCount);

    const layoutTable = document.createElement('table');
    layoutTable.setAttribute('border', '0');
    layoutTable.setAttribute('cellspacing', '0');
    layoutTable.setAttribute('cellpadding', '0');
    layoutTable.style.width = '100%';
    layoutTable.style.borderCollapse = 'collapse';
    layoutTable.style.border = 'none';
    layoutTable.style.setProperty('mso-border-alt', 'none');
    layoutTable.style.setProperty('mso-table-lspace', '0pt');
    layoutTable.style.setProperty('mso-table-rspace', '0pt');

    const tr = document.createElement('tr');
    cells.forEach(cell => {
      const td = document.createElement('td');
      td.style.width = `${cellWidth}%`;
      td.style.verticalAlign = 'top';
      td.style.padding = '4pt 2pt';
      td.style.border = 'none';

      // FIX ALIGNMENT: If the cell contains an MCQ letter, split it into a 2-col layout table
      const mcqLetter = cell.querySelector('.mcq-letter-vml');
      if (mcqLetter) {
        const letterHtml = mcqLetter.outerHTML;
        // Strip the letter from the original text
        const remainder = cell.innerHTML.replace(letterHtml, '').trim();
        
        td.innerHTML = `
          <table border="0" cellspacing="0" cellpadding="0" style="width:100%; border-collapse:collapse; border:none;">
            <tr>
              <td style="width:20pt; vertical-align:top; border:none; padding:0;">${letterHtml}</td>
              <td style="vertical-align:top; border:none; padding:0 0 0 4pt;">${remainder}</td>
            </tr>
          </table>
        `;
      } else {
        td.innerHTML = cell.innerHTML;
      }
      
      tr.appendChild(td);
    });
    layoutTable.appendChild(tr);

    table.replaceWith(layoutTable);
  });

  // Answer Key Section Cleanup
  const answerKeySections = tempDiv.querySelectorAll('.answer-key-section, .answer-key');
  answerKeySections.forEach(section => {
    const el = section as HTMLElement;
    el.style.marginTop = '20pt';
    el.style.padding = '15pt';
    el.style.border = `1.5pt solid ${activeRulerColor}`;
    el.style.borderRadius = '5pt';
    el.style.backgroundColor = '#f8fafc';
    el.style.setProperty('mso-shading', '#f8fafc');
    
    const title = el.querySelector('h2');
    if (title) {
        title.style.marginTop = '0';
        title.style.color = '#1e293b';
        title.style.fontSize = '14pt';
        title.style.borderBottom = `1pt solid ${activeRulerColor}`;
        title.style.paddingBottom = '5pt';
        title.style.marginBottom = '10pt';
    }

    const textEls = el.querySelectorAll('p, div, span');
    textEls.forEach(t => {
      (t as HTMLElement).style.fontSize = '11pt';
      (t as HTMLElement).style.lineHeight = '1.5';
      (t as HTMLElement).style.color = '#334155';
    });
  });

  const tables = tempDiv.querySelectorAll('table');
  tables.forEach(table => {
    const isNested = table.parentElement?.closest('table') !== null;
    if (isNested) {
      table.style.border = 'none';
      table.style.width = '100%';
      table.querySelectorAll('td').forEach(c => {
        (c as HTMLElement).style.border = 'none';
        (c as HTMLElement).style.padding = '2pt';
      });
    } else {
      table.querySelectorAll('td, th').forEach(cell => {
          const row = cell.parentElement as HTMLTableRowElement | null;
          const isHeader = cell.classList.contains('header-row') || (cell.getAttribute('colspan') === '2') || (cell.tagName === 'TH') || (row?.rowIndex === 0);
          
          // GRID TABLE DESIGNS (10-17) MAPPING
          const gridStyleMap: Record<number, { headerBg: string, borderColor: string, textColor: string }> = {
            10: { headerBg: '#2563eb', borderColor: '#bfdbfe', textColor: '#ffffff' }, // Blue
            11: { headerBg: '#059669', borderColor: '#bbf7d0', textColor: '#ffffff' }, // Green
            12: { headerBg: '#ea580c', borderColor: '#fed7aa', textColor: '#ffffff' }, // Orange
            13: { headerBg: '#9333ea', borderColor: '#e9d5ff', textColor: '#ffffff' }, // Purple
            14: { headerBg: '#dc2626', borderColor: '#fecaca', textColor: '#ffffff' }, // Red
            15: { headerBg: '#d97706', borderColor: '#fde68a', textColor: '#ffffff' }, // Amber
            16: { headerBg: '#0d9488', borderColor: '#99f6e4', textColor: '#ffffff' }, // Teal
            17: { headerBg: '#4f46e5', borderColor: '#c7d2fe', textColor: '#ffffff' }  // Indigo
          };

          const activeGrid = gridStyleMap[tableDesignStyle];
          
          // Apply a default sharp light grid border BEFORE header overrides
          const c = cell as HTMLElement;
          const defaultBorderColor = activeGrid ? activeGrid.borderColor : '#cbd5e1';
          
          c.style.border = `0.5pt solid ${defaultBorderColor}`;
          c.style.setProperty('mso-border-alt', `0.5pt solid ${defaultBorderColor}`);

          if (isHeader) {
          // FORCE white background if disabled to prevent Word inheritance/defaults
          let bg = activeGrid ? activeGrid.headerBg : '#ffffff';
          let textColor = activeGrid ? activeGrid.textColor : '#000000';
          let shading = activeGrid ? activeGrid.headerBg : '#ffffff';

          if (isInstructionBackgroundEnabled) {
            // Apply specific style mappings based on the chosen style
            // IDs 0-19 mapped to professional Word formatting
            const headerStyles: Record<number, { bg: string, color: string, border?: string, italic?: boolean, bold?: boolean, textTransform?: string, underline?: boolean, borderBottom?: string, borderLeft?: string }> = {
              0: { bg: '#facc15', color: '#000000', border: '3pt solid black', bold: true, textTransform: 'uppercase' }, // Brutalist Pop
              1: { bg: '#f59e0b', color: '#ffffff', italic: true, bold: true }, // Elegant Gold (Orange-Gold)
              2: { bg: '#ffffff', color: '#64748b', borderBottom: '1.5pt solid #cbd5e1', textTransform: 'uppercase' }, // Minimalist Gray
              3: { bg: '#1e293b', color: '#ffffff', borderLeft: '8pt solid #6366f1', bold: true }, // Gradient Night
              4: { bg: '#ecfdf5', color: '#059669', border: '1.5pt solid #10b981', bold: true }, // Neon Emerald
              5: { bg: '#fde047', color: '#000000', border: '4pt solid black', bold: true }, // Brutalist Yellow
              6: { bg: '#4f46e5', color: '#ffffff', bold: true }, // Mix Styles
              7: { bg: '#fef3c7', color: '#92400e', border: '1pt solid #fde68a', bold: true }, // Pill Shape
              8: { bg: '#ffffff', color: '#000000', bold: true, underline: true }, // Underlined Bold
              9: { bg: '#f8fafc', color: '#1e293b', border: '0.5pt solid #e2e8f0', bold: true }, // Boxed Shadow
              10: { bg: '#0f172a', color: '#ffffff', bold: true }, // Dark Mode
              11: { bg: '#ffffff', color: '#475569', italic: true }, // Italic Elegant
              12: { bg: '#ffffff', color: '#000000', border: '2pt solid #e2e8f0' }, // Double Line (pseudo)
              13: { bg: '#fef9c3', color: '#854d0e' }, // Soft Highlight
              14: { bg: '#ffffff', color: '#1e293b', borderLeft: '4pt solid #6366f1' }, // Corner Accent
              15: { bg: '#ffffff', color: '#64748b', border: '1pt dashed #cbd5e1' }, // Dashed Grey
              16: { bg: '#ffffff', color: '#2563eb', border: '1pt solid #2563eb' }, // Modern Outline
              17: { bg: '#ffffff', color: '#000000', bold: true, textTransform: 'uppercase' }, // Bold Caps
              18: { bg: '#ecfdf5', color: '#065f46', borderLeft: '4pt solid #10b981' }, // Left Bar Green
              19: { bg: '#ffffff', color: '#000000', borderLeft: '4pt solid #cbd5e1', textTransform: 'uppercase' }, // Right Align
              20: { bg: '#eff6ff', color: '#1e40af', borderLeft: '10pt solid #2563eb', bold: true }, // Modern Blue Bar
              21: { bg: '#eef2ff', color: '#312e81', border: '1.5pt solid #4f46e5', bold: true }, // Indigo Aura
              22: { bg: '#f8fafc', color: '#0f172a', border: '2pt solid #1e293b', bold: true }, // Technical Grid
              23: { bg: '#ffffff', color: '#92400e', italic: true, borderBottom: '2pt solid #d97706' }, // Script Underline
              24: { bg: '#e11d48', color: '#ffffff', bold: true, textTransform: 'uppercase' } // Bold Warning
            };

            const style = headerStyles[instructionHeaderStyle] || { bg: '#f0fdf4', color: '#166534' };
            bg = style.bg;
            textColor = style.color;
            shading = style.bg;

            if (style.italic) c.style.fontStyle = 'italic';
            if (style.bold !== false) c.style.fontWeight = '700';
            if (style.textTransform) c.style.textTransform = style.textTransform;
            if (style.underline) c.style.textDecoration = 'underline';

            if (style.border) {
              c.style.border = style.border;
              c.style.setProperty('mso-border-alt', style.border);
            }
            if (style.borderBottom) {
              c.style.borderBottom = style.borderBottom;
              c.style.setProperty('mso-border-bottom-alt', style.borderBottom);
            }
            if (style.borderLeft) {
              c.style.borderLeft = style.borderLeft;
              c.style.setProperty('mso-border-left-alt', style.borderLeft);
            }
          }

          c.style.backgroundColor = bg;
          c.style.setProperty('mso-shading', shading);
          c.style.color = textColor;
          
          if (!isInstructionBackgroundEnabled) {
            c.style.border = 'none';
            c.style.borderBottom = `1.5pt solid ${activeRulerColor}`;
            c.style.setProperty('mso-border-bottom-alt', `1.5pt solid ${activeRulerColor}`);
            c.style.padding = '2pt 0';
          } else if (!c.style.border) {
            c.style.borderLeft = `6pt solid ${activeRulerColor}`;
            c.style.setProperty('mso-border-left-alt', `6pt solid ${activeRulerColor}`);
          }
          c.style.padding = '10pt';
          c.style.paddingLeft = '15pt';
          c.style.fontWeight = 'bold';
        }
      });
      
      // Zebra Striping detection
      const rows = Array.from(table.rows);
      if (table.classList.contains('zebra') || table.getAttribute('data-type') === 'zebra') {
        rows.forEach((row, idx) => {
          if (idx % 2 === 1) { // odd index = even row (1, 3, 5...)
            Array.from(row.cells).forEach(cell => {
              (cell as HTMLElement).style.backgroundColor = '#f8fafc';
              (cell as HTMLElement).style.setProperty('mso-shading', '#f8fafc');
            });
          }
        });
      }

      // 2. APPLY RULER DIVIDER LOGIC (MUST come after general border application to win specificity/override)
      const isRulerLayout = exportTableOrDivider === 'DVD';
      if (isRulerLayout) {
        const isActuallyTwoCol = Array.from(table.rows).some(r => r.cells.length === 2);
        if (isActuallyTwoCol) {
          table.style.border = 'none';
          table.style.setProperty('mso-border-alt', 'none');
          table.style.borderCollapse = 'collapse';
          table.style.marginBottom = '12pt';
          
          Array.from(table.rows).forEach(row => {
            const isHeaderRow = row.cells.length === 1 && !!row.cells[0].getAttribute('colspan');
            if (isHeaderRow) {
               row.cells[0].style.border = 'none';
               row.cells[0].style.borderBottom = `1.5pt solid ${activeRulerColor}`;
               row.cells[0].style.setProperty('mso-border-bottom-alt', `solid ${activeRulerColor} 1.5pt`);
               return;
            }

            if (row.cells.length === 2) {
              const leftCell = row.cells[0] as HTMLElement;
              const rightCell = row.cells[1] as HTMLElement;
              
              // Remove outer borders for cleanliness
              leftCell.style.border = 'none';
              leftCell.style.setProperty('mso-border-alt', 'none');
              rightCell.style.border = 'none';
              rightCell.style.setProperty('mso-border-alt', 'none');
              
              // Apply the middle divider with high priority
              leftCell.style.borderRight = `2.5pt solid ${activeRulerColor}`;
              leftCell.style.setProperty('mso-border-right-alt', `solid ${activeRulerColor} 2.5pt`);
              
              leftCell.style.paddingRight = '15pt';
              rightCell.style.paddingLeft = '15pt';
            }
          });
        }
      }
    }
  });

  // Word Bank Box
  const wordBanks = tempDiv.querySelectorAll('.word-bank-box-alt, .word-bank');
  wordBanks.forEach(box => {
    const el = box as HTMLElement;
    el.style.border = '1.5pt solid #334155';
    el.style.padding = '10pt';
    el.style.margin = '10pt 0';
    el.style.backgroundColor = '#f1f5f9';
    el.style.setProperty('mso-shading', '#f1f5f9');
    el.style.textAlign = 'center';
    el.style.fontWeight = 'bold';
    el.style.borderRadius = '5pt';
  });

  // Force font family override for Handwriting Theme
  if (exportTheme === 4) {
    tempDiv.querySelectorAll('*').forEach(el => {
      const element = el as HTMLElement;
      if (element.style) {
        element.style.fontFamily = cleanFontName;
      }
    });
  }

  // 4. CLEANUP: Trim leading empty spaces and problematic artifacts
  // Remove problematic empty paragraphs at the start
  const firstChild = tempDiv.firstElementChild;
  if (firstChild && (!firstChild.textContent?.trim() && !firstChild.querySelector('img, table'))) {
    firstChild.remove();
  }

  let sections = Array.from(tempDiv.children);
  // Important: If everything is wrapped in ONE div (like .prose), unwrap it so we can loop over sections
  if (sections.length === 1 && (sections[0].classList.contains('prose') || sections[0].tagName === 'DIV')) {
    sections = Array.from(sections[0].children);
  }

  const sectionsHtml: string[] = [];
  sections.forEach(el => {
    const htmlEl = el as HTMLElement;
    
    // Apply Organic Shape Drawn styles to Word
    if (htmlEl.classList.contains('shape-drawn-1') || htmlEl.classList.contains('shape-drawn-2') || htmlEl.classList.contains('shape-drawn-3')) {
       htmlEl.style.border = `2.5pt solid ${activeRulerColor || '#059669'}`;
       htmlEl.style.padding = '12pt';
       htmlEl.style.margin = '10pt auto';
       htmlEl.style.borderRadius = '15pt';
       htmlEl.style.backgroundColor = '#f0fdf4';
       htmlEl.style.setProperty('mso-shading', '#f0fdf4');
       htmlEl.style.width = '80%';
       htmlEl.style.textAlign = 'center';
       htmlEl.style.display = 'block';
    }
    
    // Only add non-empty elements
    if (htmlEl.textContent?.trim() || htmlEl.querySelector('img') || htmlEl.querySelector('table')) {
      sectionsHtml.push(`
      <table border="0" cellspacing="0" cellpadding="0" width="100%" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="font-family: '${cleanFontName}', serif; font-size: 12pt; padding-bottom: 4pt; line-height: ${exactLineHeight}; mso-line-height-rule: exactly;">
            ${htmlEl.outerHTML}
          </td>
        </tr>
      </table>`);
    }
  });

  const finalHtml = sectionsHtml.join('');

  // 5. Frame Style Simulation
  const frameStyle = '';
  const pageBorderStyle = isFrameEnabled ? `border: 3.0pt solid ${activeRulerColor}; padding: 24pt 24pt 24pt 24pt; mso-page-border-z-order: front; mso-page-border-surround-header:no; mso-page-border-surround-footer:no;` : '';
  const physicalFrameSyle = isFrameEnabled ? `border: 3.0pt solid ${activeRulerColor}; mso-border-alt: 3.5pt solid ${activeRulerColor}; padding: 10pt;` : '';

  let headerWatermarks = '';
  // Paper Styles - Moved All Borders to TD level for better Word support
  let bodyBgColor = '#ffffff';
  let paperTdStyle = '';
  
  if (globalLayout === 1 && isTopBottomLineEnabled) { // Orange Mix + Top-bottom line enabled
    paperTdStyle = `border-top: 12pt solid ${topBottomLineColor}; mso-border-top-alt: 12pt solid ${topBottomLineColor}; border-top-left-radius: 40pt; padding-left: 20pt; padding-top: 20pt; background: #ffffff; mso-shading: windowtext 0% #ffffff;`;
  } else if (globalLayout === 1) { // Orange Mix, default (no extra borders if top-bottom line is off)
    paperTdStyle = `padding-left: 10pt; mso-shading: windowtext 0% #ffffff;`;
  } else if (globalLayout === 2) { // Modern Emerald
    paperTdStyle = `background-color: #f0fdf4; padding-left: 15pt; mso-shading: windowtext 0% #f0fdf4;`;
    if (isTopBottomLineEnabled) paperTdStyle += `border-left: 12pt solid ${topBottomLineColor}; mso-border-left-alt: 12pt solid ${topBottomLineColor};`;
    bodyBgColor = '#f0fdf4';
  } else if (globalLayout >= 10 && globalLayout <= 16) { 
    // Star and decorative papers: White paper, scattered emojis as floating VML
    paperTdStyle = `background-color: #ffffff; padding: 15pt; mso-shading: windowtext 0% #ffffff;`;
    let icon = '';
    let color1 = '';
    let color2 = '';
    
    if (globalLayout === 10) { // Stars
        icon = '★'; color1 = '#fde047'; color2 = '#fcd34d';
    } else if (globalLayout === 11) { // Flowers
        icon = '✿'; color1 = '#f9a8d4'; color2 = '#fbcfe8';
    } else if (globalLayout === 12) { // Hearts
        icon = '♥'; color1 = '#fca5a5'; color2 = '#fecaca';
    } else if (globalLayout === 13) { // Bubbles
        icon = '〇'; color1 = '#7dd3fc'; color2 = '#bae6fd';
    } else if (globalLayout === 14) { // Leaves
        icon = '🌿'; color1 = '#bef264'; color2 = '#d9f99d';
    } else if (globalLayout === 15) { // Rainbow
        icon = '🌈'; color1 = '#e879f9'; color2 = '#f5d0fe';
    } else if (globalLayout === 16) { // Galaxy
        icon = '✧'; color1 = '#cbd5e1'; color2 = '#94a3b8';
    }

    headerWatermarks = `
      <div style="mso-element:header" id="h1">
        <p style="margin:0;padding:0;">
          <!--[if gte vml 1]>
          <v:rect style="position:absolute; left:60pt; top:150pt; width:30pt; height:30pt; z-index:-1; mso-position-horizontal-relative:page; mso-position-vertical-relative:page;" filled="f" stroked="f"><v:textbox style="mso-fit-shape-to-text:t;" inset="0,0,0,0"><span style="font-size:36pt; color:${color1};">${icon}</span></v:textbox></v:rect>
          <v:rect style="position:absolute; left:410pt; top:80pt; width:40pt; height:40pt; z-index:-1; mso-position-horizontal-relative:page; mso-position-vertical-relative:page;" filled="f" stroked="f"><v:textbox style="mso-fit-shape-to-text:t;" inset="0,0,0,0"><span style="font-size:24pt; color:${color2};">${icon}</span></v:textbox></v:rect>
          <v:rect style="position:absolute; left:180pt; top:350pt; width:40pt; height:40pt; z-index:-1; mso-position-horizontal-relative:page; mso-position-vertical-relative:page;" filled="f" stroked="f"><v:textbox style="mso-fit-shape-to-text:t;" inset="0,0,0,0"><span style="font-size:42pt; color:${color2};">${icon}</span></v:textbox></v:rect>
          <v:rect style="position:absolute; left:440pt; top:550pt; width:40pt; height:40pt; z-index:-1; mso-position-horizontal-relative:page; mso-position-vertical-relative:page;" filled="f" stroked="f"><v:textbox style="mso-fit-shape-to-text:t;" inset="0,0,0,0"><span style="font-size:30pt; color:${color1};">${icon}</span></v:textbox></v:rect>
          <v:rect style="position:absolute; left:220pt; top:720pt; width:40pt; height:40pt; z-index:-1; mso-position-horizontal-relative:page; mso-position-vertical-relative:page;" filled="f" stroked="f"><v:textbox style="mso-fit-shape-to-text:t;" inset="0,0,0,0"><span style="font-size:28pt; color:${color1};">${icon}</span></v:textbox></v:rect>
          <![endif]-->
        </p>
      </div>
    `;
  } else if (globalLayout === 17) {
    paperTdStyle = `background-color: #ffffff; border-left: 4.5pt double #ef4444; padding-left: 35pt; mso-shading: windowtext 0% #ffffff;`;
  } else if (globalLayout === 18) {
    paperTdStyle = `background-color: #fef3c7; border: 1pt solid #fde68a; mso-shading: windowtext 0% #fef3c7;`;
    bodyBgColor = '#fef3c7';
  } else {
    paperTdStyle = `mso-shading: windowtext 0% ${bodyBgColor};`;
  }

  // Removed footer HTML to save space and prevent it from appearing at the top in some parsers

  // 5.1. Star Line Logic (The "Cute Strip")
  if (isStarLineEnabled) {
      const starIcons = ['★', '🌸', '✨', '🌺', '🌼', '⭐', '🌻', '🌹'];
      let starVml = '';
      const xPos = isTopBottomLineEnabled ? 35 : 5; // Position it next to the top-bottom bar if active
      
      for (let i = 0; i < 35; i++) {
          const icon = starIcons[Math.floor(Math.random() * starIcons.length)];
          const yPos = 50 + (i * 22);
          const rotation = (Math.random() * 40) - 20;
          starVml += `
            <v:rect style="position:absolute; left:${xPos}pt; top:${yPos}pt; width:20pt; height:20pt; z-index:10; mso-position-horizontal-relative:page; mso-position-vertical-relative:page;" filled="f" stroked="f">
              <v:textbox style="mso-fit-shape-to-text:t;" inset="0,0,0,0">
                <div style="font-size:9pt; color:${activeRulerColor}; transform:rotate(${rotation}deg); opacity:0.6;">${icon}</div>
              </v:textbox>
            </v:rect>
          `;
      }
      
      // If we don't have headerWatermarks yet, create the structure
      if (!headerWatermarks) {
          headerWatermarks = `
            <div style="mso-element:header" id="h1">
              <p style="margin:0;padding:0;"><!--[if gte vml 1]>${starVml}<![endif]--></p>
            </div>
          `;
      } else {
          // Inject into existing headerWatermarks
          headerWatermarks = headerWatermarks.replace('<![endif]-->', `${starVml}<![endif]-->`);
      }
  }

  const content = `
    <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset='utf-8'>
      <style>
        @page Section1 { size: 8.5in 11.0in; margin: 0.5in; mso-header-margin: 0.5in; mso-footer-margin: 0.5in; ${headerWatermarks ? 'mso-header: h1;' : ''} ${pageBorderStyle} }
        div.Section1 { page: Section1; }
        body { font-family: "${cleanFontName}", serif; font-size: 12pt; background-color: ${bodyBgColor}; }
        p, div, span, h1, h2, h3, h4, h5, h6, td, ul, ol, li {
          mso-margin-top-alt: 0pt;
          mso-margin-bottom-alt: 0pt;
          margin-top: 0pt;
          margin-bottom: 0pt;
          mso-margin-right-alt: 0pt;
          margin-right: 0pt;
        }
        p, li { line-height: 115%; mso-line-height-alt: 13.8pt; }
        table { border-collapse: collapse; width: 100%; }
        td { padding: 0; vertical-align: top; }
        .options-table td { mso-line-height-rule: at-least; line-height: 24pt; height: 26pt; }
      </style>
    </head>
    <body>
      <div class="Section1">
        ${headerWatermarks}
        <!-- Master Table for Paper Design -->
    <table border="0" cellspacing="0" cellpadding="0" width="100%" style="width: 100%; border-collapse: collapse; ${physicalFrameSyle}">
      <tr>
        ${isTopBottomLineEnabled ? `
        <td style="width: 10pt; background-color: ${topBottomLineColor}; mso-shading: ${topBottomLineColor}; font-size: 1pt;">&nbsp;</td>
        ` : ''}
        <td style="padding: 10pt; ${paperTdStyle} ${frameStyle}">
            <div>
              ${brandSettings ? wordSafeHeader : headerDiv.innerHTML}
              ${finalHtml}
            </div>
          </td>
      </tr>
    </table>
      </div>
    </body>
    </html>`;

  const blob = new Blob(['\ufeff', content], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename.replace(/[^a-z0-9]/gi, '_')}.doc`;
  document.body.appendChild(link);
  link.click();
  
  // Delay cleanup to avoid interruption
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
};

export const exportToHTML = (htmlContent: string, filename: string, headerHtml: string = '') => {
  const fullHtml = `<html><body><div class="header">${headerHtml}</div><div class="content">${htmlContent}</div></body></html>`;
  saveAs(new Blob([fullHtml], { type: 'text/html;charset=utf-8' }), `${filename}.html`);
};

export const exportToPDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;
  try {
    // High-resolution capture (300 DPI approx)
    const dataUrl = await toPng(element, { 
      quality: 1,
      pixelRatio: 2, // Double pixels for crispness
      skipFonts: false,
      cacheBust: true
    });
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate dimensions to fit the page
    const imgWidth = pdfWidth;
    const imgHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;
    
    // Handle multi-page if content is too long
    let heightLeft = imgHeight;
    let position = 0;
    
    pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }
    
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("PDF Export failed", error);
    window.print();
  }
};
