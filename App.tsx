import React, { useState, useEffect, useRef } from 'react';
import {
  NeuralEngine,
  AcademicLevel,
  HistoryItem,
  QuickSource,
  StrictRule,
  SettingsTab,
  UserSession,
  BrandSettings,
  InstructionTemplate,
  Priority,
  RuleCategory,
  ExternalKeys,
  ChatMessage,
  AnswerStrategy,
  CustomExerciseType
} from './types';
import {
  INITIAL_MODULES,
  LANGUAGES,
  ACADEMIC_LEVELS,
  GLOBAL_STRICT_COMMAND,
  BORDER_FRAME_INSTRUCTION,
  PART_BACKGROUND_INSTRUCTION,
  INSTRUCTION_HEADER_BACKGROUND_INSTRUCTION,
  PAGE_STYLES,
  DEFAULT_STRICT_RULES,
  DEFAULT_MASTER_PROTOCOLS,
  INITIAL_TEMPLATES,
  THEMES,
  FONTS,
  SUBJECTS,
  PAPER_DESIGNS
} from './constants';

// --- THE NEW FIREBASE MAGIC ---
import { db, auth, googleProvider } from './firebase';
import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit, 
  onSnapshot, 
  Timestamp, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { handleFirestoreError, OperationType } from './services/firestoreErrorHandler';

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Something went wrong.";
      try {
        const parsed = JSON.parse(this.state.error?.message || "");
        if (parsed.error) errorMessage = `Firestore Error: ${parsed.error} (${parsed.operationType} on ${parsed.path})`;
      } catch {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-[32px] shadow-xl border border-slate-100 max-w-md w-full text-center space-y-6">
            <div className="h-16 w-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
              <i className="fa-solid fa-circle-exclamation"></i>
            </div>
            <h2 className="text-xl font-black text-slate-900 uppercase">System Interruption</h2>
            <p className="text-slate-500 text-sm leading-relaxed">{errorMessage}</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
            >
              Restart Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
// ------------------------------

import { callNeuralEngine } from './services/neuralService';
import { exportToWord, exportToPDF, exportToHTML } from './services/wordExportService';
import Worksheet from './components/Worksheet';
import NeuralChatAssistant from './components/NeuralChatAssistant'
import Sidebar from './components/Sidebar';
import FormatDesignEditor from './components/FormatDesignEditor';
import { OnboardingTutorial } from './components/OnboardingTutorial';
const DEFAULT_BRAND_SETTINGS: BrandSettings = {
  fontSize: 12,
  fontWeight: '800',
  letterSpacing: 0,
  textTransform: 'none',
  schoolName: 'GLOBAL EDUCATION ACADEMY',
  schoolAddress: 'Developing Potential for Success School',
  footerText: 'This test is for educational purposes only. © 2026 DPSS.',
  studentLabel: 'STUDENT NAME',
  idLabel: 'STUDENT ID',
  scoreLabel: 'SCORE',
  dateLabel: 'DATE',
  classLabel: 'CLASS',
  teacherLabel: 'TEACHER',
  headerStyle: 13,
  logos: Array(30).fill(undefined),
  logoWidth: 300,
  logoData: undefined,
  activeFont: 'Garamond',
  randomizeFont: false,
  headerRulerStyle: 4,
  lineHeight: '1.15'
};

const DEFAULT_SESSION: UserSession = {
  name: 'Public User',
  email: 'public@dpss.edu',
  code: 'dpss',
  loginTime: Date.now()
};

const MASTER_PROTOCOLS_KEY = 'dp_master_v46';
const STRICT_RULES_KEY = 'dp_rules_v46';
const TEMPLATES_KEY = 'dp_templates_v46';
const HISTORY_KEY = 'dp_history_v46';
const BRAND_SETTINGS_KEY = 'dp_brand_v46';
const USER_SESSION_KEY = 'dp_session_v46';
const ENGINE_CONFIG_KEY = 'dp_engine_config_v46';
const ONBOARDING_KEY = 'dp_onboarding_v1';

const StylePreview: React.FC<{ styleName?: string; typeId?: string; label?: string }> = ({ styleName, typeId, label }) => {
  const name = styleName || label || '';
  
  const renderMockup = () => {
    // 0. Correct/Incorrect & True/False (Requested Specific Layouts)
    if (typeId === 'tf' || typeId === 'true_false' || typeId === 'correct_incorrect' || name.includes('True/False') || name.includes('C/I')) {
       const isCI = typeId === 'correct_incorrect' || name.includes('C/I');
       const symbol = isCI ? 'C/I' : 'T/F';
       const longSymbol = isCI ? 'CORRECT/INCORRECT' : 'TRUE/FALSE';
       
       return (
         <div className="w-full h-full border border-slate-200 rounded-xl bg-white overflow-hidden shadow-inner font-sans p-4 relative">
           <div className="space-y-4">
             <div className="text-[9px] flex items-center gap-2 font-medium">
               <span className="font-black text-slate-400">1.</span>
               <span className="text-orange-600 font-black">({symbol})</span>
               <span>She go to school every day.</span>
             </div>
             <div className="text-[9px] flex items-center gap-2 font-medium">
               <span className="font-black text-slate-400">2.</span>
               <span>The cat is big and white.</span>
               <span className="text-orange-600 font-black ml-auto">({symbol})</span>
             </div>
             <div className="text-[9px] flex items-center gap-2 font-medium">
               <span className="font-black text-slate-400">3.</span>
               <span className="border-b-2 border-slate-300 w-8 h-2"></span>
               <span>They are playing in the park.</span>
             </div>
             <div className="text-[9px] flex items-center gap-2 font-medium">
               <span className="font-black text-slate-400">4.</span>
               <span className="text-orange-600 font-black">({longSymbol})</span>
               <span>It is raining outside.</span>
             </div>
           </div>
           <div className="absolute bottom-2 right-4 text-[6px] font-black text-slate-300 uppercase tracking-widest">Variety Preview</div>
         </div>
       );
    }

    // 1. Key Term Varieties (Improved Previews with Randomization)
    if (typeId === 'key_term' || name.includes('Key Term')) {
      const isTable = name.includes('Table') || name.includes('Pro') || name.includes('Divider');
      const isShape = name.includes('Shape') || name.includes('Word Box');
      // Randomly cycle layout in preview to show variety
      const randomLayout = Math.floor(Math.random() * 4); // 0: standard, 1: reversed, 2: top-bottom, 3: grid
      
      return (
        <div className="w-full h-full border border-slate-200 rounded-xl bg-white overflow-hidden shadow-inner flex flex-col p-4 font-sans relative">
          {(isShape || name.includes('word_box')) && (
             <div className="mb-4 w-full p-2 rounded-2xl border-2 border-orange-500 bg-orange-50/30 flex justify-center gap-4 text-[8px] font-black uppercase">
                <span>HAPPY</span> <span>FAST</span> <span>LARGE</span>
             </div>
          )}
          <div className={`space-y-4 flex flex-col ${isTable ? 'border border-slate-900 rounded bg-slate-50' : ''}`}>
            {isTable && (
               <div className="flex border-b border-slate-900 bg-slate-800 text-white text-[7px] font-black uppercase p-1">
                  <div className={randomLayout === 1 ? "w-1/3 text-center border-r border-slate-700" : "w-2/3 border-r border-slate-700"}>{randomLayout === 1 ? 'WORDS' : 'DEFINITIONS'}</div>
                  <div className={randomLayout === 1 ? "w-2/3 pl-2" : "w-1/3 text-center"}>{randomLayout === 1 ? 'DEFINITIONS' : 'WORDS'}</div>
               </div>
            )}
            
            {(randomLayout === 2) ? (
              <div className="p-2 space-y-3">
                <div className="text-[9px] italic border-b border-orange-200 pb-1">1. A feeling of extreme joy and happiness...</div>
                <div className="h-4 w-1/2 border-2 border-slate-900 rounded bg-white"></div>
                <div className="text-[9px] italic border-b border-orange-200 pb-1 pt-1">2. Moving at a very high speed...</div>
                <div className="h-4 w-1/2 border-2 border-slate-900 rounded bg-white"></div>
              </div>
            ) : (
              [1, 2].map(i => (
                <div key={i} className={`flex ${randomLayout === 1 ? 'flex-row-reverse' : 'flex-row'} items-center gap-3 text-[10px] font-medium p-2 ${isTable ? 'border-b border-slate-200' : ''}`}>
                  <span className={`${randomLayout === 1 ? 'w-1/3' : 'w-2/3'} text-slate-800 leading-tight italic truncate`}>
                    {randomLayout === 1 ? (i === 1 ? 'HAPPY' : 'FAST') : 'The feeling of joy...'}
                  </span>
                  <span className={`${randomLayout === 1 ? 'w-2/3' : 'w-1/3'} border-b border-slate-400 h-4`}>
                    {randomLayout === 1 ? '' : ''}
                  </span>
                </div>
              ))
            )}
          </div>
          <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-orange-600/10 text-orange-600 text-[6px] font-black rounded uppercase">Random Layout</div>
        </div>
      );
    }

    // 2. Grammar Specific (Distinct from Reading)
    if (typeId === 'grammar' || name.includes('Grammar') || typeId === 'completion' || typeId === 'cloze' || name.includes('Sentence') || label?.toLowerCase().includes('grammar')) {
       const isBoxed = name.includes('Boxed') || name.includes('Yellow') || name.includes('Gold');
       const isMinimal = name.includes('Minimal') || name.includes('Gray');
       const isElegant = name.includes('Elegant') || name.includes('Gold');

       return (
        <div className={`w-full h-full border border-slate-200 rounded-xl bg-white overflow-hidden shadow-inner font-sans ${isBoxed ? 'p-2' : 'p-6'}`}>
          <div className={`${isBoxed ? 'border-2 border-slate-900 rounded-lg p-4 bg-slate-50' : 'space-y-4'}`}>
            <div className={`text-[10px] font-bold text-slate-800 flex flex-col gap-1 ${isElegant ? 'italic text-orange-600' : ''}`}>
              <span className={`uppercase text-[7px] font-black tracking-widest ${isElegant ? 'text-amber-500' : 'text-blue-600'}`}>Grammar Practice</span>
              <div className={`flex gap-2 ${isMinimal ? 'border-b border-slate-100 pb-2' : ''}`}>
                <span className="text-slate-400 font-black">1.</span>
                <span>She {isBoxed ? <span className="px-1 border border-slate-400">____</span> : '____'} (go) to school by bus.</span>
              </div>
            </div>
            <div className={`text-[10px] font-bold text-slate-800 flex flex-col gap-1 mt-2`}>
              <div className={`flex gap-2 ${isMinimal ? 'border-b border-slate-100 pb-2' : ''}`}>
                <span className="text-slate-400 font-black">2.</span>
                <span>They ____ (be) happy today.</span>
              </div>
            </div>
            {isElegant && (
               <div className="mt-4 pt-2 border-t border-amber-100 flex items-center gap-2 opacity-50">
                  <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                  <div className="h-1 w-12 bg-slate-200 rounded"></div>
               </div>
            )}
          </div>
          <div className="absolute bottom-2 right-4 text-[6px] font-black text-slate-300 uppercase tracking-widest">{name} Mode Enabled</div>
        </div>
       );
    }

    // 2.1 MCQ Specific Layouts (Requested variety)
    if (typeId === 'mcq' || name.includes('MCQ')) {
      const isBoxed = name.includes('Boxed');
      const isMinimal = name.includes('Minimal');
      const styleLabel = styleName || 'Standard';
      
      return (
        <div className="w-full h-full border border-slate-200 rounded-xl bg-white overflow-hidden shadow-inner p-4 font-sans flex flex-col">
          <div className="text-[10px] font-black text-slate-900 mb-2 flex gap-2">
            <span className="text-indigo-600">1.</span>
            <span>Where ____ your brother live?</span>
          </div>
          
          {isBoxed ? (
            <div className="grid grid-cols-2 gap-2">
              {['do', 'does', 'is', 'are'].map((opt, i) => (
                <div key={i} className="border border-slate-200 rounded-md p-1.5 flex items-center gap-2 bg-slate-50 shadow-sm">
                  <span className="text-[7px] font-bold w-3.5 h-3.5 rounded-full bg-indigo-500 text-white flex items-center justify-center">{String.fromCharCode(65+i)}</span>
                  <span className="text-[9px] font-medium">{opt}</span>
                </div>
              ))}
            </div>
          ) : isMinimal ? (
            <div className="space-y-1">
              {['do', 'does', 'is', 'are'].map((opt, i) => (
                <div key={i} className="flex items-center gap-3 py-1 border-b border-slate-50">
                  <span className="text-[8px] font-black text-slate-400">{String.fromCharCode(65+i)}.</span>
                  <span className="text-[9px]">{opt}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-4">
              {['do', 'does', 'is', 'are'].map((opt, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-[9px] font-bold text-slate-400">{String.fromCharCode(65+i)}.</span>
                  <span className="text-[9px]">{opt}</span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-auto pt-2 text-[6px] font-black text-slate-300 uppercase tracking-widest">{styleLabel} Template</div>
        </div>
      );
    }

    // 3. Reading Specific (Distinct from Grammar)
    if (typeId === 'reading' || name.includes('Reading') || typeId === 'passage' || name.includes('Analysis') || label?.toLowerCase().includes('reading')) {
      return (
        <div className="w-full h-full border border-slate-200 rounded-xl bg-white overflow-hidden shadow-inner flex flex-col p-6 font-sans">
          <div className="w-full h-24 bg-slate-800 border border-slate-200 rounded-xl p-4 mb-4 relative overflow-hidden flex flex-col gap-1 shadow-md">
             <div className="h-2.5 w-1/2 bg-indigo-500 mb-1 rounded-full border border-white/20"></div>
             <div className="space-y-2">
                <div className="h-1.5 w-full bg-slate-600 rounded-full"></div>
                <div className="h-1.5 w-[90%] bg-slate-600 rounded-full opacity-60"></div>
                <div className="h-1.5 w-full bg-slate-600 rounded-full"></div>
             </div>
             <div className="absolute top-2 right-2 flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 opacity-50"></div>
             </div>
             <div className="mt-auto flex justify-between items-center">
                <span className="text-[6px] font-black text-indigo-400 uppercase tracking-widest">Main Passage</span>
                <span className="text-[6px] font-medium text-slate-500 uppercase italic">Word count: 250+</span>
             </div>
          </div>
          <div className="space-y-3 px-1">
             <div className="flex items-center gap-3">
                <span className="text-[9px] font-black text-slate-900">1.</span>
                <div className="h-1.5 w-full bg-slate-100 rounded-full"></div>
             </div>
             <div className="flex items-center gap-3">
                <span className="text-[9px] font-black text-slate-900 border-b border-orange-500">2.</span>
                <div className="h-1.5 w-3/4 bg-slate-100 rounded-full underline decoration-orange-400"></div>
             </div>
          </div>
        </div>
      );
    }

    // 0. Matching Specific Styles (High Fidelity Mockups)
    if (typeId === 'matching' || name.includes('Matching') || name.includes('Match') || name.includes('Supply Key Terms') || name.includes('Divided Line')) {
      const isDivided = name.includes('Divider') || name.includes('Divided') || name.includes('Line');
      const isArrow = name.includes('Classic') || name.includes('Arrow') || name.includes('Draw');
      const isBoxed = name.includes('Boxed');
      const isZebra = name.includes('Zebra');
      
      return (
        <div className="w-full h-full border border-slate-200 rounded-xl relative bg-white overflow-hidden shadow-inner font-sans p-4">
          <div className={`w-full h-full border border-slate-900 rounded relative flex flex-col ${isBoxed ? 'p-2 gap-2' : ''}`}>
            {/* Headers - Uppercase as requested */}
            <div className="flex w-full border-b border-slate-900 bg-slate-50">
              <div className="w-1/2 p-2 text-[8px] font-black uppercase text-center border-r border-slate-900 tracking-wider">VOCABULARY/QUESTIONS</div>
              <div className="w-1/2 p-2 text-[8px] font-black uppercase text-center tracking-wider">DEFINITIONS/ANSWERS</div>
            </div>

            <div className={`flex flex-1 relative overflow-hidden ${isZebra ? 'flex-col' : ''}`}>
              {!isZebra && (
                <>
                  {/* Draw Line / Arrow Vertical line - NOW ORANGE */}
                  {(isDivided || isArrow) && (
                    <div className="absolute left-1/2 inset-y-0 w-[2.5px] bg-orange-500 z-10 flex flex-col items-center">
                      {isArrow && <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-orange-500 mt-[-2px]"></div>}
                      <div className="flex-1 w-full"></div>
                    </div>
                  )}

                  {/* Content Columns - EXACTLY 3 ITEMS ON INDEPENDENT LINES */}
                  <div className="w-1/2 p-3 flex flex-col justify-around border-r border-slate-900 bg-white">
                    {[
                      { n: '1.', t: 'Big', b: '____' },
                      { n: '2.', t: 'Small', b: '____' },
                      { n: '3.', t: 'Slow', b: '____' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] font-black text-slate-800 border-b border-transparent pb-1 min-h-[30px]">
                        <span>{item.n}</span>
                        {(name.includes('Blank') || name.includes('Clean')) && <span className="text-slate-300 font-normal">{item.b}</span>}
                        <span>{item.t}</span>
                        {/* Fake Draw Line for specific style - NOW ORANGE */}
                        {name.includes('Draw') && i === 1 && (
                          <div className="absolute left-[35%] top-[50%] w-[60%] h-[1.5px] bg-orange-500 rotate-[-15deg] origin-left z-20 opacity-80">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-orange-500"></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="w-1/2 p-3 flex flex-col justify-around pl-6 bg-white">
                    {[
                      { l: 'A)', t: 'Large' },
                      { l: 'B)', t: 'Little' },
                      { l: 'C)', t: 'Not fast' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-[10px] font-medium text-slate-700 min-h-[30px]">
                        <span className="font-black text-slate-900">{item.l}</span>
                        <span className="italic truncate">{item.t}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {isZebra && (
                <div className="flex flex-col flex-1">
                  {[
                    { q: '1. Fast', a: 'Quickly moving' },
                    { q: '2. Slow', a: 'Steady and calm' },
                    { q: '3. Big', a: 'Large in size' }
                  ].map((row, i) => (
                    <div key={i} className={`flex items-center flex-1 border-b border-slate-100 ${i % 2 === 1 ? 'bg-orange-50/20' : 'bg-white'}`}>
                      <div className="w-1/2 p-3 border-r border-orange-500/30 text-[10px] font-black text-slate-800 relative">
                        {row.q}
                        {i === 1 && <div className="absolute right-[-1.5px] inset-y-0 w-[3px] bg-orange-500"></div>}
                      </div>
                      <div className="w-1/2 p-3 text-[10px] italic text-slate-500 pl-4">{row.a}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // 1. Divider / Ruler Styles (Matching Screenshot)
    if (name.includes('Divider') || name.includes('Divided Line') || name.includes('Ruler')) {
      const accentColor = 'bg-orange-500'; // Consistently orange as requested
      return (
        <div className="w-full h-full border border-slate-200 rounded-xl relative bg-white overflow-hidden shadow-inner font-sans p-6">
          <div className="flex w-full h-full border border-slate-900 rounded relative flex-col">
            {/* Headers - Uppercase as requested */}
            <div className="flex w-full border-b border-slate-900 bg-slate-50">
              <div className="w-1/2 p-2 text-[8px] font-black uppercase text-center border-r border-slate-900 tracking-wider">VOCABULARY/QUESTIONS</div>
              <div className="w-1/2 p-2 text-[8px] font-black uppercase text-center tracking-wider">DEFINITIONS/ANSWERS</div>
            </div>
            
            <div className="flex flex-1 relative">
              {/* Professional Vertical Divider */}
              <div className={`absolute inset-y-0 left-1/2 w-[2pt] ${accentColor} z-10`}></div>
              
              <div className="w-1/2 p-4 flex flex-col justify-around border-r border-slate-900">
                {[
                  { n: '1.', text: 'Routine' },
                  { n: '2.', text: 'Reward' },
                  { n: '3.', text: 'Habit' }
                ].map((item) => (
                  <div key={item.n} className="flex items-center gap-2 border-b border-transparent pb-1 min-h-[30px]">
                    <span className="text-[10px] font-black text-slate-800">{item.n}</span>
                    <span className="text-[11px] font-medium text-slate-600">{item.text}</span>
                  </div>
                ))}
              </div>
              
              <div className="w-1/2 p-4 flex flex-col justify-around pl-6">
                {[
                  'A fixed way...',
                  'Something given...',
                  'Action done...'
                ].map((text, i) => (
                  <div key={i} className="text-[10px] font-medium text-slate-500 leading-tight italic min-h-[30px] flex items-center">
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 2. No Divider (Matching Screenshot)
    if (name.includes('No Divider')) {
      return (
        <div className="w-full h-full border border-slate-200 rounded-xl bg-white overflow-hidden shadow-inner font-sans p-6">
          <div className="flex w-full h-full border border-slate-900 rounded relative flex-col">
            {/* Headers - Uppercase as requested */}
            <div className="flex w-full border-b border-slate-900 bg-slate-50">
              <div className="w-1/2 p-2 text-[8px] font-black uppercase text-center border-r border-slate-900 tracking-wider">VOCABULARY/QUESTIONS</div>
              <div className="w-1/2 p-2 text-[8px] font-black uppercase text-center tracking-wider">DEFINITIONS/ANSWERS</div>
            </div>
            <div className="flex flex-1 relative">
              <div className="w-1/2 p-4 flex flex-col justify-around border-r border-slate-900">
                {[
                  { n: '1.', text: 'Routine' },
                  { n: '2.', text: 'Reward' },
                  { n: '3.', text: 'Habit' }
                ].map((item) => (
                  <div key={item.n} className="flex items-center gap-2 border-b border-transparent pb-1 min-h-[30px]">
                    <span className="text-[10px] font-black text-slate-800">{item.n}</span>
                    <span className="text-[11px] font-medium text-slate-600">{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="w-1/2 p-4 flex flex-col justify-around pl-4">
                {[
                  'A fixed way...',
                  'Something given...',
                  'Action done...'
                ].map((text, i) => (
                  <div key={i} className="text-[10px] font-medium text-slate-500 italic min-h-[30px] flex items-center">
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 3. Zebra Table (Matching Screenshot)
    if (name.includes('Zebra')) {
      return (
        <div className="w-full h-full border border-slate-200 rounded-xl bg-white overflow-hidden shadow-inner font-sans p-2">
          <div className="w-full border border-orange-100 rounded-lg overflow-hidden h-full flex flex-col">
            {/* Headers - Uppercase as requested */}
            <div className="flex bg-orange-50/50 border-b border-orange-100">
               <div className="w-1/2 p-2 border-r border-orange-100 text-[9px] font-black text-orange-900 uppercase tracking-tighter text-center">VOCABULARY/QUESTIONS</div>
               <div className="w-1/2 p-2 text-[9px] font-black text-orange-900 uppercase tracking-tighter text-center">DEFINITIONS/ANSWERS</div>
            </div>
            {[
              { t: '1. Term', m: 'Def...' },
              { t: '2. Word', m: 'Usage...' },
              { t: '3. Verb', m: 'Action...' }
            ].map((row, i) => (
              <div key={i} className={`flex items-center flex-1 border-b border-orange-50 last:border-0 ${i % 2 === 1 ? 'bg-orange-50/20' : 'bg-white'}`}>
                <div className="w-1/2 p-2 border-r border-orange-100 text-[10px] font-bold text-slate-700">{row.t}</div>
                <div className="w-1/2 p-2 text-[10px] italic text-slate-50 pl-4">{row.m}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 4. Shape Banks (Matching Screenshot)
    if (name.includes('Shape')) {
      const isTop = name.includes('Top');
      const accentColor = isTop ? 'border-orange-500 text-orange-600' : 'border-rose-500 text-rose-600';
      const words = isTop ? ['Happy', 'Fast', 'Big'] : ['Bright', 'Dark', 'Warm'];
      
      return (
        <div className="w-full h-full border border-slate-200 rounded-xl bg-white overflow-hidden shadow-inner flex flex-col p-4 font-sans">
          {isTop && (
            <div className={`mb-4 w-full h-10 rounded-full border-2 ${accentColor} flex items-center justify-center gap-4 bg-orange-50/30`}>
              {words.map(w => <span key={w} className="text-[10px] font-black uppercase tracking-tight">{w}</span>)}
            </div>
          )}
          
          <div className="flex-1 space-y-4 pt-2 px-2">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold">1. The cat is ____________ .</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold">2. The plane is ____________ .</span>
             </div>
          </div>

          {!isTop && (
            <div className={`mt-4 w-full h-10 rounded-full border-2 ${accentColor} flex items-center justify-center gap-4 bg-rose-50/30`}>
              {words.map(w => <span key={w} className="text-[10px] font-black uppercase tracking-tight">{w}</span>)}
            </div>
          )}
        </div>
      );
    }

    // 4.5. Single Column Styles (Speaking, Discuss, Study Sentences)
    if (name.includes('Speaking') || name.includes('Discuss') || name.includes('Sentences')) {
      return (
        <div className="w-full h-full border border-slate-200 rounded-xl bg-white overflow-hidden shadow-inner flex flex-col p-6 font-sans">
          <div className="space-y-6">
            {[
              'Why do you like learning English?',
              'What is your favorite place in the city?',
              'How often do you visit your grandparents?'
            ].map((text, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="text-[10px] font-black text-slate-800 leading-tight">
                  {i + 1}. {text}
                </div>
                {/* Independent lines for items, no messy overlap */}
                <div className="h-[1px] w-full bg-slate-100 mt-2"></div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 5. Key Terms (Matching Screenshot: CLEAN KEY TERMS)
    if (name.includes('Key Term') || name.includes('Clean Key Terms')) {
      return (
        <div className="w-full h-full border border-slate-200 rounded-xl bg-white overflow-hidden shadow-inner flex flex-col p-6 font-sans">
          <div className="space-y-4">
            {[
              'Moving with high speed',
              'Feeling joy or pleasure',
              'Having a low temperature'
            ].map((text, i) => (
              <div key={i} className="flex justify-between items-end gap-4">
                <div className="flex-1 text-[10px] font-medium text-slate-800 leading-tight italic">
                  {i + 1}. {text}
                </div>
                <div className="flex-[0.8] border-b border-dashed border-slate-300 mb-1"></div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 6. Pro Table Style
    if (name.includes('Table') || name.includes('Column') || label?.includes('Table')) {
      const isMatchingTable = typeId === 'matching' || name.includes('Match');
      return (
        <div className="w-full h-full border-2 border-slate-200 rounded-2xl flex flex-col bg-white overflow-hidden shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)]">
          <div className="h-10 bg-slate-900 flex items-center justify-between px-4">
             <div className="flex gap-1.5">
               <div className="h-2 w-2 rounded-full bg-rose-500"></div>
               <div className="h-2 w-2 rounded-full bg-amber-500"></div>
               <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
             </div>
          </div>
          <div className="h-8 bg-slate-100 border-b border-slate-200 flex">
            <div className={`w-1/2 border-r border-slate-200 py-2 text-center text-[7px] font-black uppercase tracking-tighter ${isMatchingTable ? 'text-slate-800' : 'text-transparent'}`}>
               {isMatchingTable ? 'Vocabulary/Questions' : 'ID'}
            </div>
            <div className={`w-1/2 py-2 text-center text-[7px] font-black uppercase tracking-tighter ${isMatchingTable ? 'text-slate-800' : 'text-transparent'}`}>
               {isMatchingTable ? 'Definitions/Answers' : ''}
            </div>
          </div>
          <div className="flex-1 flex flex-col">
            {[1, 2, 3].map(i => (
              <div key={i} className={`flex border-b border-slate-100 last:border-0 h-full bg-white`}>
                <div className="w-1/2 border-r border-slate-100 p-2.5 flex items-center gap-2">
                  <span className="text-[9px] font-black text-slate-300">{i}</span>
                  <div className="h-2 w-full bg-slate-200/50 rounded-sm"></div>
                </div>
                <div className="w-1/2 p-2.5 flex items-center"><div className="h-2 w-3/4 bg-slate-100 rounded-sm"></div></div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 7. Special Shapes (Star, Egg, Circle)
    if (name.includes('Star') || name.includes('Egg') || name.includes('Oval') || name.includes('Circle')) {
      const isStar = name.includes('Star');
      const isEgg = name.includes('Egg') || name.includes('Oval');
      return (
        <div className="w-full h-full border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-center p-4">
          <div className="w-full flex flex-wrap justify-center gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className={`relative w-12 h-12 flex items-center justify-center ${isEgg ? 'rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] border-2 border-orange-400 bg-white' : ''} ${name.includes('Circle') ? 'rounded-full border-2 border-orange-400 bg-white' : ''}`}>
                {isStar && <i className="fa-solid fa-star text-orange-400 text-xl"></i>}
                <span className={`text-[10px] font-black ${isStar ? 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[8px]' : 'text-orange-900'}`}>{i}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    // Default fallback (Educational Content)
    return (
      <div className="w-full h-full border border-slate-200 rounded-xl bg-white overflow-hidden shadow-inner font-sans p-6">
        <div className="flex w-full h-full border border-slate-900 rounded relative">
          <div className="w-1/2 p-4 flex flex-col gap-4">
            {[
              { n: '1.', text: 'Vocabulary' },
              { n: '2.', text: 'Sentence' },
              { n: '3.', text: 'Context' }
            ].map((item) => (
              <div key={item.n} className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-800">{item.n}</span>
                <span className="text-[11px] font-medium text-slate-600">{item.text}</span>
              </div>
            ))}
          </div>
          <div className="w-1/2 p-4 flex flex-col gap-4 pl-4 border-l border-slate-100 border-dashed">
            {[
              'Detailed text...',
              'Example usage...',
              'Key meaning...'
            ].map((text, i) => (
              <div key={i} className="text-[10px] font-medium text-slate-500 italic">
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-white relative group-hover:scale-105 transition-transform duration-500">
      {renderMockup()}
    </div>
  );
};

const toTitleCase = (str: string) => {
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const CollapsibleSection: React.FC<{
  title: string;
  subtitle?: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  isCollapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  rightElement?: React.ReactNode;
}> = ({ title, subtitle, icon, iconBg, iconColor, isCollapsed, onToggle, children, rightElement }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between group cursor-pointer" onClick={onToggle}>
      <div className="flex items-center gap-4">
        <div className={`h-10 w-10 ${iconBg} rounded-2xl flex items-center justify-center ${iconColor} transition-transform duration-300 ${isCollapsed ? '' : 'rotate-12'}`}>
          <i className={`fa-solid ${icon}`}></i>
        </div>
        <div>
          <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-tight">{title}</h4>
          {subtitle && <p className="text-[10px] font-medium text-slate-400 uppercase">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-4">
        {rightElement}
        <div className={`h-8 w-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all ${isCollapsed ? '' : 'rotate-180'}`}>
          <i className="fa-solid fa-chevron-down text-[10px]"></i>
        </div>
      </div>
    </div>
    {!isCollapsed && (
      <div className="animate-in slide-in-from-top-4 duration-300">
        {children}
      </div>
    )}
  </div>
);

function App() {
  const [session, setSession] = useState<UserSession>({
    name: 'Public User',
    email: 'public@dpss.edu',
    code: 'dpss',
    loginTime: Date.now()
  });

  const [authLoading, setAuthLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<'generator' | 'preview' | 'book_creation' | 'ielts_master' | 'dpss_studio' | 'grammar_iframe' | 'khmer_program' | 'design_test_style' | 'header_footer_design' | 'paper_style_design' | 'instruction_design' | 'instruction_styles'>('generator');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [sidebarSide, setSidebarSide] = useState<'left' | 'right'>('left');
  
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(true);

  // --- REFACTORED FIREBASE HANDLERS ---
  
  // Auth & Cloud Sync
  useEffect(() => {
    let unsubscribes: (() => void)[] = [];

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      // Clean up previous listeners
      unsubscribes.forEach(unsub => unsub());
      unsubscribes = [];

      if (user) {
        setSession({
          name: user.displayName || 'User',
          email: user.email || '',
          code: 'dpss',
          loginTime: Date.now()
        });

        const uid = user.uid;

        // 1. Sync User Settings
        unsubscribes.push(onSnapshot(doc(db, 'users', uid), (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            if (data.brandSettings) setBrandSettings(prev => ({ ...prev, ...data.brandSettings }));
            if (data.paperStyles) setPaperStyles(data.paperStyles);
            if (data.paperDesign !== undefined) setPaperDesign(data.paperDesign);
            if (data.engineConfig) {
              if (data.engineConfig.active) setActiveEngine(data.engineConfig.active);
              if (data.engineConfig.keys) setExternalKeys(data.engineConfig.keys);
            }
            if (data.onboardingComplete !== undefined) setShowOnboarding(!data.onboardingComplete);
          } else {
            // Initialize user doc if it doesn't exist
            setDoc(doc(db, 'users', uid), {
              uid,
              email: user.email,
              brandSettings: DEFAULT_BRAND_SETTINGS,
              onboardingComplete: false,
              createdAt: serverTimestamp()
            }).catch(e => handleFirestoreError(e, OperationType.CREATE, `users/${uid}`));
          }
        }));

        // 2. Sync Custom Designs
        unsubscribes.push(onSnapshot(query(collection(db, 'customDesigns'), where('uid', '==', uid)), (snap) => {
          const designs = snap.docs.map(d => ({ ...d.data(), id: d.id } as any));
          // Always include core required designs in memory
          setCustomDesigns(designs);
        }));

        // 3. Sync Custom Exercise Types
        unsubscribes.push(onSnapshot(query(collection(db, 'customExerciseTypes'), where('uid', '==', uid)), (snap) => {
          const types = snap.docs.map(d => ({ ...d.data(), id: d.id } as any));
          if (types.length > 0) setCustomExerciseTypes(types);
        }));

        // 4. Sync History
        unsubscribes.push(onSnapshot(query(collection(db, 'history'), where('uid', '==', uid), orderBy('timestamp', 'desc'), limit(50)), (snap) => {
          const cloudHistory = snap.docs.map(d => ({ ...d.data(), id: d.id } as HistoryItem));
          setHistory(cloudHistory);
        }));

        // 5. Sync Strict Rules
        unsubscribes.push(onSnapshot(query(collection(db, 'strictRules'), where('uid', '==', uid)), (snap) => {
            const cloudRules = snap.docs.map(d => ({ ...d.data(), id: d.id } as StrictRule));
            if (cloudRules.length > 0) setStrictRules(cloudRules);
        }));

        // 6. Sync Master Protocols
        unsubscribes.push(onSnapshot(query(collection(db, 'masterProtocols'), where('uid', '==', uid)), (snap) => {
            const cloudProtocols = snap.docs.map(d => ({ ...d.data(), id: d.id } as StrictRule));
            if (cloudProtocols.length > 0) setMasterProtocols(cloudProtocols);
        }));

      } else {
        setSession(DEFAULT_SESSION);
        // Reset or use defaults for public user
      }
      setAuthLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribes.forEach(unsub => unsub());
    };
  }, []);

  const saveUserSettings = async (updates: any) => {
    if (!auth.currentUser) return;
    try {
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        ...updates,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
    }
  };

  const handleRenameHistory = async (id: string, newTitle: string) => {
    if (!auth.currentUser) return;
    try {
        await updateDoc(doc(db, 'history', id), { title: newTitle });
    } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `history/${id}`);
    }
  };

  const handleDeleteHistory = async (id: string) => {
    if (!confirm("Delete this session from history?")) return;
    if (!auth.currentUser) return;
    try {
      await deleteDoc(doc(db, 'history', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `history/${id}`);
    }
  };

  const handleAddCustomExerciseType = async () => {
    const name = prompt("Enter new exercise type name:");
    if (name && auth.currentUser) {
      const id = `custom_${Date.now()}`;
      const newType: CustomExerciseType = { 
        id, 
        name, 
        category: toTitleCase(activeModule) as any,
        uid: auth.currentUser.uid
      };
      try {
        await setDoc(doc(db, 'customExerciseTypes', id), newType);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `customExerciseTypes/${id}`);
      }
    } else if (!auth.currentUser) {
        alert("Please login to create custom types.");
    }
  };

  const handleSaveToHistory = async (item: HistoryItem) => {
    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, 'history'), {
        ...item,
        uid: auth.currentUser.uid,
        authorEmail: auth.currentUser.email,
        timestamp: Date.now()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'history');
    }
  };
  const [isAssistantVisible, setIsAssistantVisible] = useState(false);
  const [activeModule, setActiveModule] = useState<string>('Grammar');
  const [activeLanguage, setActiveLanguage] = useState<string>('English');
  const [activeLevel, setActiveLevel] = useState<AcademicLevel>('Level 7');
  const [answerStrategy, setAnswerStrategy] = useState<AnswerStrategy>('GENERAL_MIXED');
  const [topic, setTopic] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [worksheetContent, setWorksheetContent] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);
  const [isSettingsFullScreen, setIsSettingsFullScreen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('COMMAND');
  const [isFrameEnabled, setIsFrameEnabled] = useState(false);
  const [isHandDrawnBorderEnabled, setIsHandDrawnBorderEnabled] = useState(false);
  const [isTopBottomLineEnabled, setIsTopBottomLineEnabled] = useState(true);
  const [isTopBottomBothEnabled, setIsTopBottomBothEnabled] = useState(false);
  const [topBottomLineColor, setTopBottomLineColor] = useState('#10b981'); // Emerald 500
  const [isStarLineEnabled, setIsStarLineEnabled] = useState(false);
  const [isStarBothEnabled, setIsStarBothEnabled] = useState(false);
  const [starLineStyle, setStarLineStyle] = useState(0); // 0: Random, 1: Stars, 2: Flowers, 3: Hearts, 4: Mixed
  const [enablePages, setEnablePages] = useState(true);
  const [isPartBackgroundEnabled, setIsPartBackgroundEnabled] = useState(false);
  const [isInstructionBackgroundEnabled, setIsInstructionBackgroundEnabled] = useState(false);
  const [isColorfulBackgroundEnabled, setIsColorfulBackgroundEnabled] = useState(true);
  const [instructionCase, setInstructionCase] = useState<'uppercase' | 'lowercase' | 'random'>('uppercase');
  const [activeSubject, setActiveSubject] = useState<string>('cambodia');
  const [isRandomSubject, setIsRandomSubject] = useState(true);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [globalLayout, setGlobalLayout] = useState<number>(10); // Star Layout Default
  const [baseLayout, setBaseLayout] = useState<number>(3); // Divider 4
  const [instructionRulerStyle, setInstructionRulerStyle] = useState<number>(4); // Ruler S1
  const [isBottomPanelHidden, setIsBottomPanelHidden] = useState(false);
  const [isCountriesHidden, setIsCountriesHidden] = useState(false);
  const [customArchitectSubTab, setCustomArchitectSubTab] = useState<string>('All');
  const [paperDesign, setPaperDesign] = useState<number>(8); // Style 9: Modern Red
  const [instructionHeaderStyle, setInstructionHeaderStyle] = useState<number>(6); // Style 6: Mix Styles (Default)
  const [defaultColumnCount, setDefaultColumnCount] = useState<number>(2); // 2 columns
  const [architectTab, setArchitectTab] = useState<'Grammar' | 'Vocabulary' | 'Reading' | 'Generals' | 'Custom'>('Grammar');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [selectedExerciseTypeId, setSelectedExerciseTypeId] = useState<string | null>(null);
  const [selectedExerciseCategoryId, setSelectedExerciseCategoryId] = useState<string>('GRAMMAR');
  const [mcqLayout, setMcqLayout] = useState<'single' | 'double' | 'quad'>('single'); 
  const [mcqSpacing, setMcqSpacing] = useState<'none' | 'one'>('none');
  const [copiedStyle, setCopiedStyle] = useState<{style: any, prompt?: string} | null>(null);
  
  const randomizeTopBottomLineColor = () => {
    // Green and Orange shades only, sometimes lighter
    const colors = [
      '#059669', // Emerald 600
      '#16a34a', // Green 600
      '#22c55e', // Green 500
      '#4ade80', // Green 400 (light)
      '#86efac', // Green 300 (very light)
      '#ea580c', // Orange 600
      '#f97316', // Orange 500
      '#fb923c', // Orange 400 (light)
      '#fdba74', // Orange 300 (very light)
      '#fed7aa'  // Orange 200 (extra light)
    ];
    setTopBottomLineColor(colors[Math.floor(Math.random() * colors.length)]);
  };

  const toggleTopBottomLine = () => {
    const nextVal = !isTopBottomLineEnabled;
    setIsTopBottomLineEnabled(nextVal);
    if (nextVal) {
      setIsStarLineEnabled(false);
      setIsTopBottomBothEnabled(false);
      setIsStarBothEnabled(false);
      randomizeTopBottomLineColor();
    }
  };

  const toggleTopBottomBoth = () => {
    const nextVal = !isTopBottomBothEnabled;
    setIsTopBottomBothEnabled(nextVal);
    if (nextVal) {
      setIsTopBottomLineEnabled(false);
      setIsStarLineEnabled(false);
      setIsStarBothEnabled(false);
      randomizeTopBottomLineColor();
    }
  };

  const toggleStarLine = () => {
    const nextVal = !isStarLineEnabled;
    setIsStarLineEnabled(nextVal);
    if (nextVal) {
      setIsTopBottomLineEnabled(false);
      setIsTopBottomBothEnabled(false);
      setIsStarBothEnabled(false);
    }
  };

  const toggleStarBoth = () => {
    const nextVal = !isStarBothEnabled;
    setIsStarBothEnabled(nextVal);
    if (nextVal) {
      setIsTopBottomLineEnabled(false);
      setIsTopBottomBothEnabled(false);
      setIsStarLineEnabled(false);
    }
  };

  useEffect(() => {
    if (auth.currentUser) {
        saveUserSettings({ mcqLayout });
    }
  }, [mcqLayout]);

  useEffect(() => {
    if (auth.currentUser) {
        saveUserSettings({ mcqSpacing });
    }
  }, [mcqSpacing]);

  useEffect(() => {
    if (auth.currentUser) {
        saveUserSettings({ baseLayout });
    }
  }, [baseLayout]);

  useEffect(() => {
    if (auth.currentUser) {
        saveUserSettings({ instructionRulerStyle });
    }
  }, [instructionRulerStyle]);
  const [mcqStyle, setMcqStyle] = useState<number>(0); 
  const [mcqOptionStyle, setMcqOptionStyle] = useState<'Standard' | 'Boxed' | 'Minimalist' | 'Elegant' | 'Brutalist' | 'None' | 'Round' | 'Square' | 'Brackets' | 'Double' | 'Double Circle' | 'Dotted Circle' | 'Thick Circle' | 'Round 2' | 'Round 3' | 'Round 4' | 'Star'>('Standard');
  const [tableDesignStyle, setTableDesignStyle] = useState<number>(0); // Table Design Style
  const [isColorExportEnabled, setIsColorExportEnabled] = useState<boolean>(false);
  const [instructionStyle, setInstructionStyle] = useState<number>(0); // Default
  const [paperStyles, setPaperStyles] = useState<{
    mcq: number | string;
    tf: number | string;
    correctIncorrect: number | string;
    vocabulary: number | string;
    circle: number | string;
    sentenceCompletion: number | string;
    wordBox: number | string;
    readingPassage: number | string;
    matching: string;
    cloze: number | string;
    doubleMcq: number | string;
    key_term: number | string;
    study: string | number;
  }>({
    mcq: 0,
    tf: 4, 
    correctIncorrect: 0,
    vocabulary: 0,
    circle: 0,
    sentenceCompletion: 0,
    wordBox: 0,
    readingPassage: 0,
    matching: 'v_draw_line_divided', 
    cloze: 0,
    doubleMcq: 0,
    key_term: 'v_key_term_divider',
    study: 'v_study_table'
  });

  useEffect(() => {
    localStorage.setItem('dp_paper_styles_v2', JSON.stringify(paperStyles));
  }, [paperStyles]);

  const [customDesigns, setCustomDesigns] = useState<{id: string, name: string, type: string, category: string, style: any, prompt?: string}[]>([]);

  const handleSaveCustomDesign = async (design: any) => {
    if (auth.currentUser) {
        try {
            const docRef = doc(db, 'customDesigns', design.id);
            await setDoc(docRef, { ...design, uid: auth.currentUser.uid });
        } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, `customDesigns/${design.id}`);
        }
    } else {
        setCustomDesigns(prev => {
            const existing = prev.findIndex(d => d.id === design.id);
            if (existing !== -1) {
                const next = [...prev];
                next[existing] = design;
                return next;
            }
            return [...prev, design];
        });
    }
  };

  const handleDeleteCustomDesign = async (id: string) => {
    if (!confirm("Are you sure you want to delete this design?")) return;
    
    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, 'customDesigns', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `customDesigns/${id}`);
      }
    } else {
        setCustomDesigns(prev => prev.filter(d => d.id !== id));
    }
  };
  
  const [customExerciseTypes, setCustomExerciseTypes] = useState<CustomExerciseType[]>([
    { id: 'mcq', name: 'Multiple Choice (MCQ)', category: 'General' },
    { id: 'matching', name: 'Matching', category: 'General' },
    { id: 'true_false', name: 'True / False', category: 'General' },
    { id: 'correct_incorrect', name: 'Correct / Incorrect', category: 'General' },
    { id: 'rewrite', name: 'Rewrite the sentences', category: 'Grammar' }
  ]);
  const [designTargetTypeId, setDesignTargetTypeId] = useState<string | null>(null);
  const [designTargetName, setDesignTargetName] = useState<string | null>(null);
  const [editingCustomDesignId, setEditingCustomDesignId] = useState<string | null>(null);
  
  const [showNewTypeModal, setShowNewTypeModal] = useState(false);
  const [activeDesignType, setActiveDesignType] = useState<{ category: string, typeId: string } | null>(null);
  const [newTypeNameInput, setNewTypeNameInput] = useState('');

  const [isSingleReadingText, setIsSingleReadingText] = useState(false);
  const [isRelaxingBackgroundEnabled, setIsRelaxingBackgroundEnabled] = useState(true);
  const [userCustomBackground, setUserCustomBackground] = useState<string | null>(() => {
    return localStorage.getItem('dp_user_custom_bg');
  });
  const [currentBackground, setCurrentBackground] = useState("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop"); // Ocean morning default

  const exportToCSV = () => {
    if (!worksheetContent) {
      alert("Generate content first!");
      return;
    }
    
    // Create a temporary DOM element to parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(worksheetContent, 'text/html');
    const rows = [['Part', 'Number', 'Question', 'Options', 'Answer Key']];
    
    // Attempt to extract information from the structured HTML
    const parts = doc.querySelectorAll('table:not(.options-table):not(.professional-table)');
    const answerKeySection = doc.querySelector('.answer-key-section');
    const answerKeyText = answerKeySection ? answerKeySection.textContent || '' : '';
    
    // Extraction strategy
    // We look for tables because many layouts use them for parts
    doc.querySelectorAll('tr').forEach(tr => {
      const header = tr.querySelector('.header-row');
      if (header) {
        const partName = header.textContent?.trim() || '';
        // Extract items in subsequent siblings if they aren't header rows themselves
        let nextTr = tr.nextElementSibling;
        while (nextTr && !nextTr.querySelector('.header-row')) {
          // Find question numbers in the row
          const text = nextTr.textContent || '';
          const match = text.match(/(\d+)[\.\)]\s*(.*)/);
          if (match) {
            const num = match[1];
            let question = match[2].trim();
            
            // For MCQs, the options might be in nested tables
            const optionsTable = nextTr.querySelector('.options-table');
            let optionsStr = '';
            if (optionsTable) {
              const options = Array.from(optionsTable.querySelectorAll('td')).map(td => td.textContent?.trim()).filter(Boolean);
              optionsStr = options.join(' || ');
              // Clean question of options if they leaked in
              question = question.split('A.')[0].split('A)')[0].trim();
            }
            
            // Find answer in the key
            const answerMatch = answerKeyText.match(new RegExp(`${num}[:\\.][\\s*]*(<b>)?([A-D])(</b>)?`, 'i'));
            const answer = answerMatch ? answerMatch[2] : '';
            
            rows.push([partName, num, question, optionsStr, answer]);
          }
          nextTr = nextTr.nextElementSibling;
        }
      }
    });

    // Fallback for non-table parts
    if (rows.length === 1) {
      doc.querySelectorAll('p').forEach(p => {
        const text = p.textContent || '';
        const match = text.match(/(\d+)[\.\)]\s*(.*)/);
        if (match) {
          rows.push(['Main', match[1], match[2], '', '']);
        }
      });
    }

    const csvContent = rows.map(r => r.map(c => `"${(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `dpss_dataset_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const randomizeBackground = () => {
    const backgrounds = [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop", // Ocean morning
      "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?q=80&w=2000&auto=format&fit=crop", // Ocean blue
      "https://images.unsplash.com/photo-1468413253725-0d5181091126?q=80&w=2000&auto=format&fit=crop", // Tropical beach
      "https://images.unsplash.com/photo-1505118380757-91f5f45d8de4?q=80&w=2000&auto=format&fit=crop", // Calm sea
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=2000&auto=format&fit=crop"  // Beach sunset
    ];
    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    setCurrentBackground(randomBg);
  };

  const [activeLogicCategory, setActiveLogicCategory] = useState<RuleCategory>('General');
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);
  const [activeProtocolCategory, setActiveProtocolCategory] = useState<RuleCategory>('General');
  const [expandedProtocolId, setExpandedProtocolId] = useState<string | null>(null);
  const [activeTemplateCategory, setActiveTemplateCategory] = useState<string>('GRAMMAR');
  const [expandedTemplateId, setExpandedTemplateId] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');

  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('dp_theme_v30');
      return saved || 'default';
    } catch { return 'default'; }
  });

  const [activeEngine, setActiveEngine] = useState<NeuralEngine>(() => {
    try {
      const saved = localStorage.getItem(ENGINE_CONFIG_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        let active = parsed.active;
        // Migration for legacy model names
        if (
          active === 'gemini-3.1-flash-lite-preview' || 
          active === 'gemini-1.5-flash-lite' ||
          active === 'gemini-3-flash-lite'
        ) {
          active = NeuralEngine.GEMINI_3_FLASH_LITE;
        } else if (
          active === 'gemini-3-flash-preview' || 
          active === 'gemini-1.5-flash' ||
          active === 'gemini-3-flash'
        ) {
          active = NeuralEngine.GEMINI_3_FLASH;
        } else if (
          active === 'gemini-3.1-pro-preview' || 
          active === 'gemini-1.5-pro' ||
          active === 'gemini-3-pro'
        ) {
          active = NeuralEngine.GEMINI_3_PRO;
        }
        return active;
      }
      return NeuralEngine.GEMINI_3_FLASH_LITE;
    } catch { return NeuralEngine.GEMINI_3_FLASH_LITE; }
  });

  const [externalKeys, setExternalKeys] = useState<ExternalKeys>(() => {
    try {
      const saved = localStorage.getItem(ENGINE_CONFIG_KEY);
      return saved ? JSON.parse(saved).keys : {};
    } catch { return {}; }
  });
  
  const [brandSettings, setBrandSettings] = useState<BrandSettings>(() => {
    try {
      const saved = localStorage.getItem(BRAND_SETTINGS_KEY);
      const parsed = saved ? JSON.parse(saved) : DEFAULT_BRAND_SETTINGS;
      return { ...DEFAULT_BRAND_SETTINGS, ...parsed };
    } catch { return DEFAULT_BRAND_SETTINGS; }
  });

  const [isBrandLoaded, setIsBrandLoaded] = useState(false);
  const loadedEmailRef = useRef<string | null>(null);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setSession({
          name: user.displayName || 'User',
          email: user.email || '',
          code: 'dpss',
          loginTime: Date.now()
        });
      } else {
        setSession(DEFAULT_SESSION);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setAuthLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setSession(DEFAULT_SESSION);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Fetching moved to consolidated effect 

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [masterProtocols, setMasterProtocols] = useState<StrictRule[]>(() => {
    try {
      const saved = localStorage.getItem(MASTER_PROTOCOLS_KEY);
      let parsed = saved ? JSON.parse(saved) : DEFAULT_MASTER_PROTOCOLS;
      if (!Array.isArray(parsed)) parsed = DEFAULT_MASTER_PROTOCOLS;
      
      // Force update existing defaults from constants.ts
      const updated = parsed.map((p: any) => {
        if (p.isCustomized) return p;
        const fresh = DEFAULT_MASTER_PROTOCOLS.find(f => f.id === p.id);
        return fresh ? { ...p, ...fresh } : p;
      });

      // Auto-merge missing defaults
      const existingIds = new Set(updated.map((p: any) => p.id));
      const missing = DEFAULT_MASTER_PROTOCOLS.filter(p => !existingIds.has(p.id));
      return [...updated, ...missing];
    } catch { return DEFAULT_MASTER_PROTOCOLS; }
  });
  const [strictRules, setStrictRules] = useState<StrictRule[]>(() => {
    try {
      const saved = localStorage.getItem(STRICT_RULES_KEY);
      let parsed = saved ? JSON.parse(saved) : DEFAULT_STRICT_RULES;
      if (!Array.isArray(parsed)) parsed = DEFAULT_STRICT_RULES;

      // Force update existing defaults from constants.ts
      const updated = parsed.map((r: any) => {
        if (r.isCustomized) return r;
        const fresh = DEFAULT_STRICT_RULES.find(f => f.id === r.id);
        return fresh ? { ...r, ...fresh } : r;
      });

      // Auto-merge missing defaults
      const existingIds = new Set(updated.map((r: any) => r.id));
      const missing = DEFAULT_STRICT_RULES.filter(r => !existingIds.has(r.id));
      return [...updated, ...missing];
    } catch { return DEFAULT_STRICT_RULES; }
  });
  const [instructionTemplates, setInstructionTemplates] = useState<InstructionTemplate[]>(() => {
    try {
      const saved = localStorage.getItem(TEMPLATES_KEY);
      let parsed = saved ? JSON.parse(saved) : INITIAL_TEMPLATES;
      if (!Array.isArray(parsed)) parsed = INITIAL_TEMPLATES;
      
      // Force update all fields from INITIAL_TEMPLATES for existing IDs
      const updated = parsed.map((t: any) => {
        if (t.isCustomized) return t;
        const fresh = INITIAL_TEMPLATES.find(f => f.id === t.id);
        if (fresh) {
          return {
            ...t,
            ...fresh
          };
        }
        return t;
      });

      // Auto-merge missing defaults
      const existingIds = new Set(updated.map((t: any) => t.id));
      const missing = INITIAL_TEMPLATES.filter(t => !existingIds.has(t.id));
      return [...updated, ...missing];
    } catch { return INITIAL_TEMPLATES; }
  });

  const [selectedInstructionIds, setSelectedInstructionIds] = useState<string[]>(['g_circle', 'g_correct_incorrect', 'g_complete_sentences', 'g_complete_story', 'mcq_standard', 'g_pair']);
  const [columnOverrides, setColumnOverrides] = useState<Record<string, number>>({
    'g_circle': 2,
    'g_correct_incorrect': 2,
    'g_complete_sentences': 1,
    'g_complete_story': 1,
    'mcq_standard': 1,
    'g_pair': 1
  });
  const [itemCountOverrides, setItemCountOverrides] = useState<Record<string, number>>({
    'g_circle': 20,
    'g_correct_incorrect': 20,
    'g_complete_sentences': 10,
    'g_complete_story': 10,
    'mcq_standard': 10,
    'g_pair': 10,
    'v_study_table_v2': 15,
    'v_sentence_study': 15,
    'v_mcq_standard': 15,
    'v_matching_pro': 15,
    'v_box': 15,
    'v_speaking_std': 10,
    'v_copy_no_answers': 10,
    'v_synonyms_exercises': 10
  });
  
  const [sourceMaterial, setSourceMaterial] = useState<QuickSource | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoUploadRef = useRef<HTMLInputElement>(null);
  const bgUploadRef = useRef<HTMLInputElement>(null);

  const [loginName, setLoginName] = useState('');
  const [loginCode, setLoginCode] = useState('');
  const [loginError, setLoginError] = useState('');

  const [showOnboarding, setShowOnboarding] = useState(() => {
    try {
      const saved = localStorage.getItem(ONBOARDING_KEY);
      return saved !== 'completed';
    } catch { return true; }
  });

  const [exportSettings, setExportSettings] = useState({
    filename: 'DPSS 1',
    title: 'DPSS 1',
    theme: 1, // 1 to 6
    showModal: false,
    exportTableOrDivider: 'DVD' as 'TB' | 'DVD'
  });

  useEffect(() => { 
    if (auth.currentUser) {
        saveUserSettings({ brandSettings });
    }
  }, [brandSettings]);

  useEffect(() => {
    if (auth.currentUser) {
        saveUserSettings({
            engineConfig: { active: activeEngine, keys: externalKeys }
        });
    }
  }, [activeEngine, externalKeys]);

  useEffect(() => {
    if (auth.currentUser) {
        saveUserSettings({ paperStyles });
    }
  }, [paperStyles]);

  useEffect(() => {
    if (auth.currentUser) {
        saveUserSettings({ paperDesign });
    }
  }, [paperDesign]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
      setActiveThemeId(randomTheme.id);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const cyclePriority = (current: Priority): Priority => {
    const priorities: Priority[] = ['Low', 'Average', 'Medium', 'High'];
    const currentIndex = priorities.indexOf(current);
    return priorities[(currentIndex + 1) % priorities.length];
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    if (auth.currentUser) {
        saveUserSettings({ onboardingComplete: true });
    } else {
        localStorage.setItem(ONBOARDING_KEY, 'completed');
    }
  };

  const toggleInstruction = (id: string) => {
    setSelectedInstructionIds(prev => {
      const template = instructionTemplates.find(t => t.id === id);
      if (!template) return prev;

      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }
      
      const typeIdToReplace = template.typeId || template.id;
      
      // Find other instruction with same typeId/id and category
      const otherWithSameType = instructionTemplates.find(t => 
        prev.includes(t.id) && 
        (t.typeId === template.typeId || t.id === template.id) &&
        t.category === template.category
      );
      
      if (otherWithSameType) {
        // Replacement mode
        return prev.map(i => i === otherWithSameType.id ? id : i);
      }
      
      return [...prev, id];
    });
  };
  const setItemCount = (id: string, count: number) => setItemCountOverrides(prev => ({ ...prev, [id]: count }));
  const adjustColumns = (id: string, delta: number) => {
    setColumnOverrides(prev => ({ ...prev, [id]: Math.max(0, Math.min(6, (prev[id] || 0) + delta)) }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setSourceMaterial({ data: (event.target?.result as string).split(',')[1], mimeType: file.type, name: file.name });
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 1. Initial size check
      if (file.size > 10 * 1024 * 1024) {
        alert("Image is too large. Please use a file smaller than 10MB.");
        if (logoUploadRef.current) logoUploadRef.current.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // 2. Resize & Compress Logic
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Max dimension 600px is sufficient for A4 header logos
          // This keeps file size very low (~50-100KB)
          const MAX_DIM = 600; 
          
          if (width > height) {
            if (width > MAX_DIM) {
              height *= MAX_DIM / width;
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width *= MAX_DIM / height;
              height = MAX_DIM;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
             ctx.drawImage(img, 0, 0, width, height);
             // Compress to JPEG 0.7 quality
             const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
             
             setBrandSettings(prev => {
               const newLogos = [...prev.logos];
               const firstEmpty = newLogos.findIndex(l => !l);
               if (firstEmpty !== -1) {
                 newLogos[firstEmpty] = dataUrl;
               } else {
                 newLogos.push(dataUrl);
               }
               return { ...prev, logos: newLogos, logoData: dataUrl };
             });
          }
          
          if (logoUploadRef.current) logoUploadRef.current.value = '';
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUserBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Background image too large. Please use a file under 5MB.");
      return;
    }
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setUserCustomBackground(dataUrl);
        localStorage.setItem('dp_user_custom_bg', dataUrl);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Background upload error:', err);
    }
  };

  const removeLogo = (index: number) => {
    setBrandSettings(prev => {
      const newLogos = [...prev.logos];
      newLogos[index] = undefined;
      return { ...prev, logos: newLogos };
    });
  };

  const generateNeuralBlueprint = (count: number) => {
    const keys = ['A', 'B', 'C', 'D'];
    let blueprint: string[] = [];
    
    // Bucket logic: For every 10 items, pre-select a bucket
    const numBuckets = Math.ceil(count / 10);
    
    for (let b = 0; b < numBuckets; b++) {
      const bucketSize = Math.min(10, count - b * 10);
      const bucket: string[] = [];
      
      if (bucketSize === 10) {
        // Specific distribution for 10: e.g. 3A, 2B, 2C, 3D
        const dist = ['A', 'A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'D'];
        bucket.push(...dist);
      } else {
        // Mandatory presence for smaller buckets
        const mandatoryKeys = bucketSize >= 4 ? [...keys] : keys.slice(0, bucketSize);
        bucket.push(...mandatoryKeys);
        while (bucket.length < bucketSize) {
          bucket.push(keys[Math.floor(Math.random() * keys.length)]);
        }
      }
      
      // Shuffle the bucket
      for (let i = bucket.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bucket[i], bucket[j]] = [bucket[j], bucket[i]];
      }
      
      blueprint.push(...bucket);
    }

    // Enforce Streak Limit: Max 2 identical
    for (let i = 2; i < blueprint.length; i++) {
      if (blueprint[i] === blueprint[i-1] && blueprint[i] === blueprint[i-2]) {
        for (let j = i + 1; j < blueprint.length; j++) {
          if (blueprint[j] !== blueprint[i]) {
            [blueprint[i], blueprint[j]] = [blueprint[j], blueprint[i]];
            break;
          }
        }
      }
    }

    return blueprint;
  };

  const applyCustomDesign = (design: any) => {
    setPaperStyles(prev => {
      const next = { ...prev };
      if (design.type === 'mcq') next.mcq = design.id;
      else if (design.type === 'matching') next.matching = design.id;
      else if (design.type === 'true_false' || design.type === 'tf') next.tf = design.id;
      else if (design.type === 'correct_incorrect') next.correctIncorrect = design.id;
      else if (design.type === 'vocabulary') next.vocabulary = design.id;
      else if (design.type === 'reading' || design.type === 'readingPassage') next.readingPassage = design.id;
      else if (design.type === 'circle') next.circle = design.id;
      else if (design.type === 'sentenceCompletion') next.sentenceCompletion = design.id;
      else if (design.type === 'wordBox') next.wordBox = design.id;
      return next;
    });
    if (design.style?.mcqStyle !== undefined) {
      setMcqStyle(design.style.mcqStyle);
    }
    alert(`Applied custom design: ${design.name}`);
  };

  const getStyleInstruction = (type: string, value: any, defaultLogic: string) => {
    if (typeof value === 'string' && value.startsWith('custom_')) {
      const design = customDesigns.find(d => d.id === value);
      if (design) {
        const customHtml = design.style.editableContent?.mainContent || design.style.mainContent || design.prompt || '';
        return `[CUSTOM DESIGN ENFORCED - ABSOLUTE MANDATORY]: You MUST use this EXACT HTML structure as a template for each item in the ${type} section:
\`\`\`html
${customHtml}
\`\`\`
[STRICT RULES]:
1. ELEMENT ORDER: You MUST maintain the EXACT order of elements (tables, text, blanks, etc.) as shown in the template.
2. TABLE STRUCTURE: If the template uses a table for questions or options, you MUST use a table.
3. PLACEHOLDER REPLACEMENT: Replace the sample text with REAL questions about {{TOPIC}}.
4. NO DEVIATION: Do NOT add extra spacing or change the layout. The user expects the generated test to look IDENTICAL to their design.`;
      }
    }
    return defaultLogic;
  };

  const handleGenerate = async () => {
    console.log("🚀 Starting Neural Synthesis...");
    
    const paperStylesInstruction = `
[PAPER STYLE ARCHITECT]:
- MCQ Style: ${getStyleInstruction('mcq', paperStyles.mcq, paperStyles.mcq === 0 ? "Standard A, B, C, D with period." : 
                paperStyles.mcq === 1 ? "Underscore prefix before number (e.g., ___ 1. Question)." :
                paperStyles.mcq === 2 ? "Boxed letters [A] [B] [C] [D]." :
                paperStyles.mcq === 3 ? "Circled letters with random colors. MANDATORY: Wrap each letter (A, B, C, D) in a span with a random, distinct background color (e.g., <span style=\"background-color: #ff9999; color: black; border-radius: 50%; padding: 4px 8px; display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; font-weight: bold;\">A</span>). Use different colors for A, B, C, and D. Ensure text is clearly visible and centered." : 
                "Custom layout style " + (typeof paperStyles.mcq === 'number' ? paperStyles.mcq + 1 : paperStyles.mcq))}
- MCQ Spacing: ${mcqSpacing === 'none' ? "No extra vertical space between questions." : "Add exactly ONE empty line (Enter) between each question for better spacing."}
- True/False Style: ${getStyleInstruction('tf', paperStyles.tf, paperStyles.tf === 0 ? 'Put "( T / F )" at the BEGINNING (e.g., "( T / F ) 1. The cat is big.").' : 
                      paperStyles.tf === 1 ? 'Put "( T / F )" at the END (e.g., "1. The cat is big. ( T / F )").' :
                      paperStyles.tf === 2 ? 'Put "_____" at the beginning (e.g., "_____ 1. The cat is big.").' :
                      paperStyles.tf === 3 ? 'Put "(____)" at the beginning (e.g., "(____) 1. The cat is big.").' :
                      paperStyles.tf === 4 ? 'Put "(TRUE/FALSE)" at the beginning (e.g., "(TRUE/FALSE) 1. The cat is big.").' :
                      paperStyles.tf === 5 ? 'Put "[ T / F ]" at the end (e.g., "1. The cat is big. [ T / F ]").' :
                      paperStyles.tf === 6 ? 'Put "(____) (" at the beginning and ")" at the end of the sentence (e.g., "(____) (1. The cat is big.)").' :
                      "Custom T/F style " + (typeof paperStyles.tf === 'number' ? paperStyles.tf + 1 : paperStyles.tf))}
- Correct/Incorrect Style: ${getStyleInstruction('correctIncorrect', paperStyles.correctIncorrect, paperStyles.correctIncorrect === 0 ? 'Put "( C / I )" at the BEGINNING (e.g., "( C / I ) 1. She go to school.").' : 
                             paperStyles.correctIncorrect === 1 ? 'Put "( C / I )" at the END (e.g., "1. She go to school. ( C / I )").' :
                             paperStyles.correctIncorrect === 2 ? 'Put "_____" at the beginning (e.g., "_____ 1. She go to school.").' :
                             paperStyles.correctIncorrect === 3 ? 'Put "(____)" at the beginning (e.g., "(____) 1. She go to school.").' :
                             paperStyles.correctIncorrect === 4 ? 'Put "(CORRECT/INCORRECT)" at the beginning (e.g., "(CORRECT/INCORRECT) 1. She go to school.").' :
                             paperStyles.correctIncorrect === 5 ? 'Put "(____) (" at the beginning and ")" at the end of the sentence (e.g., "(____) (1. She go to school.)").' :
                             "Custom C/I style " + (typeof paperStyles.correctIncorrect === 'number' ? paperStyles.correctIncorrect + 1 : paperStyles.correctIncorrect))}
- Key Term Design Reactor: ${activeModule === 'Vocabulary' ? 'MANDATORY DESIGN: For Key Terms and Matching, you MUST use exactly 1 table with 2 columns. Column 1: Term or Definition. Column 2: Answer or Match. Ensure perfect vertical alignment across all parts.' : ''}
- Vocabulary Style: ${getStyleInstruction('vocabulary', paperStyles.vocabulary, paperStyles.vocabulary === 0 ? "Classic Fill-in-the-blank. Use a 2-column HTML table with fixed layout. Column 1 (width: 40%): Number + Word. Column 2 (width: 60%): Long blank line for Definition. Add a solid vertical line (border-left: 2.5pt solid black; padding-left: 15px) to divide them clearly." : 
                       paperStyles.vocabulary === 1 ? "Alternating Rows (Italicized). Use a 2-column HTML table with fixed width. Column 1 (width: 40%): Number + Word. Column 2 (width: 60%): Definition. Add a solid vertical rule line (border-left: 2.5pt solid black; padding-left: 15px) between columns." :
                       paperStyles.vocabulary === 2 ? "Standard Alternating Rows. Use a 2-column HTML table with fixed width. Column 1 (width: 40%): Number + Word. Column 2 (width: 60%): Definition. Add a solid vertical rule line (border-left: 2.5pt solid black; padding-left: 15px) between columns." :
                       paperStyles.vocabulary === 'v_study_table_v2' ? "Vertical Divider Study (Green Divider - Picture 2 Logic). MANDATORY: Use a 2-column HTML table (width 100%) with a solid 2.5pt thick GREEN vertical rule line (border-left: 2.5pt solid #10b981; padding-left: 20px) (Col 1: 40%, Col 2: 60%) to divide vocabulary and definitions. Ensure definitions start exactly at the line position." :
                       paperStyles.vocabulary === 'v_study_clean_no_divider' ? "Clean No Divider (Picture 1 Logic). Use a 2-column HTML table (width 100%). Column 1 (width 40%): Number + Vocabulary. Column 2 (width 60%): Definition. Ensure perfect alignment but DO NOT use any vertical lines, pipes, or dividers between columns. Add padding-left: 15px to column 2." :
                       paperStyles.vocabulary === 'v_key_term_clean' ? "Clean Key Terms. Use a 2-column HTML table. Column 1 (width: 70%): Number + Definition. Column 2 (width: 30%): Long blank line (________) for the answer." :
                       paperStyles.vocabulary === 'v_zebra_table' ? "Zebra Striped Table (Colored Divider). Use a 2-column table (40/60 split) with alternating background colors for rows and a vibrant middle divider line." :
                       paperStyles.vocabulary === 'v_shape_bank' ? "Shape Word Bank (Oval Box - Picture 3 Logic). Place all vocabulary words in a large rounded oval box (border: 2pt solid green; border-radius: 50pt; padding: 15px; text-align: center; margin: 15px auto; width: 80%; line-height: 2;). The box can be at the TOP (below instruction) or at the BOTTOM of the exercise. Use a 1-column list for the definitions with long blank lines (__________ 1. Definition)." :
                       "Bordered Table. Create an HTML table with 2 columns. Column 1: Definition. Column 2: Number + Word/Key Term. Apply Divider 4 style. Ensure a clear vertical rule line between the columns.")}
- Vocabulary Alignment: MANDATORY: For ALL vocabulary-related exercises (Study Table, Match, etc.), you MUST use exactly 1 table with 2 columns. Column 1 width: 40%. Column 2 width: 60%. Add padding-left: 30px to Column 2 so the definition is clearly separated. All content must start with consistent indentation. For Matching items (1-10), use unique sequential letters (A, B, C, D, E, F, G, H, I, J) for the matching column. DO NOT reuse letters like 'A', 'B' multiple times in one part. Every item MUST have a unique letter.
- Vocabulary Introduction: Always include a clear introduction sentence before the vocabulary list (e.g., "PART A: Study the following vocabulary words and their corresponding definitions.").
- Global Indentation: For ALL question types, ensure the question numbers (1., 2., 3.) are perfectly aligned vertically. Use a table structure if necessary to ensure the text starts at the same horizontal position.
- Instruction Clarity: Ensure all "PART X: ..." headers and instruction sentences are perfectly clear and visible. Use dark text for light backgrounds and light text for dark backgrounds. ${isInstructionBackgroundEnabled ? 'Apply a light background color (e.g., background: #f1f5f9) to the instruction header row.' : 'MANDATORY: DO NOT use any background colors or shading for instructions.'}
- Circle Style: ${getStyleInstruction('circle', paperStyles.circle, paperStyles.circle === 0 ? "Standard bold text to circle." : 
                  paperStyles.circle === 1 ? "Underlined text to circle." :
                  paperStyles.circle === 2 ? "Italicized text to circle." :
                  "Custom Circle style " + (typeof paperStyles.circle === 'number' ? paperStyles.circle + 1 : paperStyles.circle))}
- Sentence Completion Style: ${getStyleInstruction('sentenceCompletion', paperStyles.sentenceCompletion, paperStyles.sentenceCompletion === 0 ? "Standard blank line at the end (e.g., 1. The cat is ____.)." : 
                                 paperStyles.sentenceCompletion === 1 ? "Blank line with base word in parentheses (e.g., 1. The cat is ____ (sleep).)." :
                                 "Custom Sentence Completion style " + (typeof paperStyles.sentenceCompletion === 'number' ? paperStyles.sentenceCompletion + 1 : paperStyles.sentenceCompletion))}
- Word Box Style: ${getStyleInstruction('wordBox', paperStyles.wordBox, paperStyles.wordBox === 0 ? "Standard comma-separated list in a box." : 
                   paperStyles.wordBox === 1 ? "Bulleted list in a box." :
                   "Custom Word Box style " + (typeof paperStyles.wordBox === 'number' ? paperStyles.wordBox + 1 : paperStyles.wordBox))}
- Reading Passage Style: ${getStyleInstruction('readingPassage', paperStyles.readingPassage, paperStyles.readingPassage === 0 ? "Standard single column text." : 
                           paperStyles.readingPassage === 1 ? "Two-column text layout." :
                           paperStyles.readingPassage === 2 ? "Text enclosed in a bordered box." :
                           "Custom Reading Passage style " + (typeof paperStyles.readingPassage === 'number' ? paperStyles.readingPassage + 1 : paperStyles.readingPassage))}
- Matching Style: ${getStyleInstruction('matching', paperStyles.matching, paperStyles.matching === 'classic' ? "Classic Matching. MANDATORY: Use a 2-column HTML table. Col 1: Number + Term. Col 2: Letter + Definition. Add a solid thick vertical divider (border-left: 2.5pt solid black; padding-left: 15px) between columns." : 
                   paperStyles.matching === 'v_draw_line' ? "Draw Line. Use a 2-column HTML table. Col 1 (width 40%): Number + Term. Col 2 (width 60%): Letter (A, B, C...) + Definition. NO vertical line divider between columns." :
                   paperStyles.matching === 'm_top' ? "Matching Top (Standardized). Use a 2-column HTML table. Column 1: Number + Term. Column 2: Blank (____) + Definition." :
                   paperStyles.matching === 'm_bottom' ? "Matching Bottom (Standardized). Use a 2-column HTML table. Column 1: Definition. Column 2: Number + Word." :
                   paperStyles.matching === 'm_clean' ? "Matching clean. Use a 2-column HTML table with fixed width (Col 1: 40%, Col 2: 60%). Col 1: Number + Term. Col 2: Letter + Definition. Add a gap by adding padding-left: 30px to Col 2." :
                   paperStyles.matching === 'm_divider' ? "Matching Divider. Use a 2-column HTML table (Col 1: 40%, Col 2: 60%). Col 1: Number + Word. Col 2: Letter + Definition. Add a solid thick vertical rule line (border-left: 2.5pt solid black; padding-left: 30px) between columns." :
                   paperStyles.matching === 'm_no_divider' ? "Matching No Divider. Use a 2-column HTML table (Col 1: 40%, Col 2: 60%). Col 1: Number + Word. Col 2: Letter + Definition. NO vertical lines. Add padding-left: 30px to Col 2." :
                   paperStyles.matching === 'm_column' ? "Matching Column Table. Create an HTML table with 2 columns. Column 1: Vocabulary. Column 2: Definition. Apply Divider 4 border style." :
                   paperStyles.matching === 'v_draw_line_divided' ? "Matching Divider (Orange Divider - Picture 4 Logic). MANDATORY: Use a 2-column HTML table with a solid thick VIBRANT ORANGE vertical rule line (border-left: 2.5pt solid #f97316; padding-left: 30px). Col 1 (40%): Number + Term. Col 2 (60%): Letter (A, B, C, etc.) + Definition. Ensure letters start exactly at the divider position." :
                   paperStyles.matching === 'm_shape' ? "Shape Bank matching (Oval Box - Picture 3 Logic). Place all vocabulary options/matches in a large rounded oval box (border: 2pt solid green; border-radius: 50pt; padding: 15px; text-align: center; margin: 15px auto; width: 80%; line-height: 2;). Then provide the matching definitions below in a 1-column list with a blank line on the left (e.g., '__________ 1. Definition')." :
                   "Custom Matching style " + paperStyles.matching)}
[MATCHING LETTER MANDATE]: For all Matching exercises with 10 items, you MUST use exactly 10 unique sequential letters (A, B, C, D, E, F, G, H, I, J). DO NOT repeat letters 'A' or 'B' for multiple definitions. DO NOT truncate the letter list. Each definition MUST have its own unique letter.
- Cloze Style: ${getStyleInstruction('cloze', paperStyles.cloze, "Standard cloze passage with blanks.")}
- Double MCQ Style: ${getStyleInstruction('doubleMcq', paperStyles.doubleMcq, "Standard double-gap MCQ with 4 options per item.")}
`;

    if (selectedInstructionIds.length === 0) { 
      console.warn("⚠️ No components selected.");
      alert("Please select at least one component (e.g., MCQ, True/False) from the list below."); 
      return; 
    }
    
    setIsGenerating(true);
    setGenerationError(null);
    setGenerationStep('Initializing Neural Core...');
    
    // Sort selected instruction IDs for Vocabulary module
    let finalSelectedIds = [...selectedInstructionIds];
    if (activeModule === 'Vocabulary') {
      const vocabOrderMap: Record<string, number> = {
        'v_study_list_one_column': 1,
        'v_study_table': 1,
        'v_study_table_v2': 1,
        'v_study_clean_no_divider': 1,
        'v_zebra_table': 1,
        'v_boxed_pairs': 1,
        'v_sentence_study': 2,
        'v_sentences': 2,
        'v_mcq': 3,
        'v_matching': 4,
        'v_match': 4,
        'v_matching_idiom': 4,
        'v_draw_line_divided': 4,
        'v_matching_pro': 4,
        'v_key_term': 5,
        'v_key_term_clean': 5,
        'v_key_term_divider': 5,
        'v_key_term_list_one_column': 5,
        'v_supply_terms': 5,
        'v_writing_definition_1': 5,
        'v_writing_definition_2': 5,
        'v_writing_definition_3': 5,
        'v_speaking': 100 // Discussion at the end
      };
      
      finalSelectedIds.sort((a, b) => {
        const orderA = vocabOrderMap[a] || 50;
        const orderB = vocabOrderMap[b] || 50;
        return orderA - orderB;
      });
    }

    const selectedTemps = instructionTemplates
      .filter(t => finalSelectedIds.includes(t.id))
      .sort((a, b) => finalSelectedIds.indexOf(a.id) - finalSelectedIds.indexOf(b.id));

    // Filter Master Protocols and Strict Rules by category
    const filterByCategory = (rules: StrictRule[]) => 
      rules.filter(r => r.active && (r.category === 'General' || r.category.toLowerCase() === activeModule.toLowerCase()));

    const filteredProtocols = filterByCategory(masterProtocols);
    const filteredRules = filterByCategory(strictRules);

    let pageStyleInstruction = '';
    if (enablePages) {
      const randomStyle = PAGE_STYLES[Math.floor(Math.random() * PAGE_STYLES.length)];
      pageStyleInstruction = `\n[PAGE STYLE - CRITICAL]: Wrap the ENTIRE assessment content in a single <div> with the following style: "${randomStyle.style}". This creates a unique beautiful page border/frame.`;
    }

    let partBackgroundInstruction = '';
    if (isPartBackgroundEnabled) {
      partBackgroundInstruction = `\n${PART_BACKGROUND_INSTRUCTION}`;
    }

    const instructionStyles = [
      { id: 0, name: 'Brutalist Pop', prompt: 'background-color: #facc15; border: 4pt solid black; box-shadow: 8px 8px 0px black; text-transform: uppercase; font-style: italic; font-weight: 900; color: black; padding: 10px;' },
      { id: 1, name: 'Elegant Gold', prompt: 'background: linear-gradient(to right, #f59e0b, #ea580c); color: white; display: inline-block; padding: 8px 20px; font-weight: 900; border-radius: 8px; font-style: italic; box-shadow: 0 4px 10px rgba(0,0,0,0.2);' },
      { id: 2, name: 'Minimalist Gray', prompt: 'border-bottom: 1.5pt solid #cbd5e1; color: #64748b; font-weight: bold; text-transform: uppercase; letter-spacing: 2pt; padding-bottom: 5px; background: transparent;' },
      { id: 3, name: 'Gradient Night', prompt: 'background: linear-gradient(to right, #1e293b, #334155); color: white; border-left: 10pt solid #6366f1; padding: 12px 20px; font-weight: bold; border-radius: 4px;' },
      { id: 4, name: 'Neon Emerald', prompt: 'border: 2pt solid #10b981; color: #065f46; background-color: #ecfdf5; font-weight: 900; text-transform: uppercase; border-radius: 6px; padding: 5px 12px;' },
      { id: 5, name: 'Brutalist Yellow', prompt: 'background-color: #fde047; border: 6pt solid black; color: black; font-weight: 900; padding: 15px; text-transform: uppercase;' },
      { id: 6, name: 'Mix Styles', prompt: 'background: linear-gradient(90deg, #6366f1, #a855f7); color: white; border-radius: 12px; font-weight: bold; padding: 8px 15px;' },
      { id: 7, name: 'Pill Shape', prompt: 'background-color: #fef3c7; color: #92400e; border: 1pt solid #fde68a; border-radius: 50px; padding: 10px 30px; font-weight: bold;' },
      { id: 8, name: 'Underlined Bold', prompt: 'text-decoration: underline black 3pt; text-underline-offset: 6pt; font-weight: 900; text-transform: uppercase; background: transparent;' },
      { id: 9, name: 'Boxed Shadow', prompt: 'background: white; border: 1pt solid #e2e8f0; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border-radius: 12px; padding: 10px; font-weight: 900;' },
      { id: 10, name: 'Dark Mode', prompt: 'background: #1e293b; color: white; border-radius: 8px; padding: 10px 15px; font-weight: bold;' },
      { id: 11, name: 'Italic Elegant', prompt: 'font-style: italic; font-family: serif; color: #475569; border-bottom: 1pt solid #cbd5e1; padding-bottom: 4px; background: transparent;' },
      { id: 12, name: 'Double Line', prompt: 'border-top: 2pt solid #94a3b8; border-bottom: 2pt solid #94a3b8; padding: 10px 0; font-weight: bold; background: transparent;' },
      { id: 13, name: 'Soft Highlight', prompt: 'background-color: #fef9c3; color: #854d0e; padding: 4px 10px; border-radius: 4px; border-left: 4pt solid #facc15;' },
      { id: 14, name: 'Corner Accent', prompt: 'border-top: 5pt solid #6366f1; border-left: 5pt solid #6366f1; background: #f5f3ff; color: #4338ca; padding: 10px; font-weight: bold;' },
      { id: 15, name: 'Dashed Grey', prompt: 'border: 2pt dashed #94a3b8; color: #64748b; padding: 8px; font-weight: bold; text-transform: uppercase;' },
      { id: 16, name: 'Modern Outline', prompt: 'border: 1pt solid #3b82f6; color: #2563eb; background: #eff6ff; border-radius: 10px; padding: 6px 15px; font-weight: bold;' },
      { id: 17, name: 'Bold Caps', prompt: 'text-transform: uppercase; font-weight: 900; letter-spacing: 0.2em; font-size: 1.1em; background: transparent;' },
      { id: 18, name: 'Left Bar Green', prompt: 'border-left: 8pt solid #10b981; background: #ecfdf5; color: #065f46; padding: 10px 20px; font-weight: bold;' },
      { id: 19, name: 'Right Align', prompt: 'text-align: right; border-right: 6pt solid #cbd5e1; padding: 10px 20px; color: #475569; font-weight: bold;' }
    ];

    const selStyle = instructionStyles.find(s => s.id === instructionHeaderStyle) || instructionStyles[6];

    let instructionBackgroundInstruction = '';
    if (isInstructionBackgroundEnabled) {
      instructionBackgroundInstruction = `\n[INSTRUCTION HEADER STYLE - MANDATORY]: Every part header (e.g. PART A: ...) MUST be wrapped in a styling tag (like <div> or <span>) with EXACTLY this style: "${selStyle.prompt}". DO NOT use any other styles for the instruction header. 
      [SUBTLE ROTATION]: If you generate more than 3 parts, you may slightly vary the color of the background using other soft tones if the style allows, but you MUST respect the structural theme of the selected style: "${selStyle.name}".`;
    } else {
      instructionBackgroundInstruction = `\n[STRICT NO-COLOR MODE]: You are strictly forbidden from applying any background-color, shading, or highlight to the instruction header, intros, or any other part titles. EVERYTHING MUST BE TRANSPARENT (background-color: transparent !important;). Text color MUST be black (#000000). THIS IS A PRINTER-FRIENDLY NO-COLOR TEST.
      - ALSO: Ensure NO colored backgrounds for any introduction text or titles.
      - MANDATORY: DO NOT use the "header-row" class or any other class that might introduce a default background color.`;
    }

    // Enforce 12 underscores as requested by user
    const blankStyles = ['____________', '____________'];
    const selectedBlankStyle = blankStyles[Math.floor(Math.random() * blankStyles.length)];

    let currentSubject = SUBJECTS.find(s => s.id === activeSubject) || SUBJECTS[0];
    if (isRandomSubject) {
      currentSubject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
    }
    const subjectInstruction = `\n[LOCALIZATION - CRITICAL]: Use names and places from the following lists to make the test culturally relevant. 
    NAMES: ${currentSubject.names.join(', ')}
    PLACES: ${currentSubject.places.join(', ')}
    Ensure these names and places are used naturally within the questions and reading texts.`;

    let vocabOrderInstruction = '';
    if (activeModule === 'Vocabulary') {
      vocabOrderInstruction = `\n[VOCABULARY ORDERING - ABSOLUTE MANDATORY]:
      1. PART A MUST BE: Study Vocabulary with definition (Vertical Divider Study / Study Table).
      2. PART B MUST BE: Study examples (Sentence Study style).
      3. ALL SPEAKING / DISCUSSION parts MUST ALWAYS be placed at the very end of the practice.
      4. REORDER ALL SELECTED VOCABULARY EXERCISES TO MATCH THIS SEQUENCE REGARDLESS OF THE SELECTION ORDER.`;
    }

    const caseInstruction = instructionCase === 'uppercase' 
      ? "CRITICAL: EVERY SINGLE instruction header for ALL parts (Grammar, Vocabulary, Reading) MUST be in ALL CAPS (UPPERCASE) without exception (e.g., 'PART A: CHOOSE THE APPROPRIATE OPTIONS...'). HOWEVER, READING PASSAGES, exercises, and questions MUST ALWAYS use normal sentence case. NEVER capitalize the whole text of a reading passage."
      : instructionCase === 'lowercase' 
      ? "CRITICAL: EVERY SINGLE instruction header MUST follow 'Title Case' (e.g., 'Part A: Fill In The Blanks'). This is a strict requirement. HOWEVER, READING PASSAGES, exercises, and questions MUST ALWAYS use normal sentence case. DO NOT use Title Case for reading texts."
      : instructionCase === 'random'
      ? "CRITICAL: Randomly choose between ALL CAPS or Title Case for EVERY SINGLE instruction header. HOWEVER, READING PASSAGES, exercises, and questions MUST ALWAYS use normal sentence case."
      : "";

    const protocolsPrompt = filteredProtocols.map(p => `[PROTOCOL - ${p.priority}]: ${p.promptInjection.replace(/{{BLANK}}/g, selectedBlankStyle)}`).join('\n');
    const rulesPrompt = filteredRules.map(r => `[STRICT RULE - ${r.priority}]: ${r.promptInjection.replace(/{{BLANK}}/g, selectedBlankStyle)}`).join('\n');
    
    const fallbackTopic = "Mixed Topics (Avoid bias towards 'Must/Have to'. Provide a wide variety of situations)";
    const strategyInstruction = answerStrategy === 'GENERAL_MIXED' 
      ? `[STRATEGY]: GENERAL-MIXED (Horizontal Logic). The context is {{TOPIC}}, but distractors should test high-frequency "general" errors (Gerunds, Prepositions, Agreement).`
      : `[STRATEGY]: TOPIC-FOCUSED (Vertical Logic). Every item and distractor must focus strictly on the rules of {{TOPIC}}.`;

    const generationIntegrityInstruction = `
[GENERATION INTEGRITY - CRITICAL]:
1. STRICT PART LIMIT: You are strictly AUTHORIZED to generate ONLY the ${selectedInstructionIds.length} parts listed below. You are FORBIDDEN from adding, inventing, or splitting extra sections. Use EXACTLY ${selectedInstructionIds.length} parts.
2. ALL SELECTED TYPES: You MUST generate content for EVERY SINGLE exercise type selected in the list below. Do NOT skip any. Total parts to generate: ${selectedInstructionIds.length}.
3. NO EXTRA CONTENT: Do NOT add introductory text, concluding remarks, or "extra" sections beyond the ${selectedInstructionIds.length} requested parts. Stop immediately after the Answer Key.
4. READING PASSAGE LOGIC & PLACEMENT:
   ${isSingleReadingText 
     ? "- [ONE READING FOR ALL]: Generate ONLY ONE reading passage. Place it STRICTLY INSIDE ROW 2 of the HTML table for PART A (as specified in the formatting instructions). CRITICAL: DO NOT DUPLICATE the instruction header. There must only be ONE 'PART A:' header. After the passage, directly list the questions in the subsequent row without repeating the header." 
     : "- [UNIQUE READING PASSAGES]: For each Reading-related part, generate a COMPLETELY UNIQUE reading passage. Each passage MUST be placed STRICTLY INSIDE ROW 2 of the HTML table for that part. CRITICAL: DO NOT DUPLICATE the instruction headers. Only write the header once per part."
   }
   - [CASE RULE]: Reading passages MUST use normal sentence case. NEVER capitalize the entire text.
5. INSTRUCTION CASING: EVERY SINGLE instruction header (e.g., "PART A:", "PART B:") MUST strictly follow the casing requested above.
6. ITEM COUNTS: Strictly follow the item count overrides if provided.
7. VARIETY: Ensure high variety in scenarios and sentence structures.
8. COMPLETE OUTPUT: Do NOT truncate the response. Ensure every part from 1 to ${selectedInstructionIds.length} is fully written.
`;

    const rulerInstruction = `\n[RULER STYLE - CRITICAL]: After EVERY instruction header (e.g., PART A: ...), you MUST insert a <div class="instruction-ruler-5"></div>. This is a visual separator.`;

    const tableStyles = [
      { id: 0, name: 'Standard', prompt: 'border: 1pt solid black; border-collapse: collapse; width: 100%;' },
      { id: 1, name: 'No Borders', prompt: 'border: none; border-collapse: collapse; width: 100%;' },
      { id: 2, name: 'Header Only', prompt: 'border-bottom: 2pt solid black; border-collapse: collapse; width: 100%;' },
      { id: 3, name: 'Banded Rows', prompt: 'border-collapse: collapse; width: 100%; tr:nth-child(even) { background-color: #f8fafc; }' },
      { id: 4, name: 'Banded Columns', prompt: 'border-collapse: collapse; width: 100%; td:nth-child(even) { background-color: #f8fafc; }' },
      { id: 5, name: 'Minimalist', prompt: 'border: 0.5pt solid #e2e8f0; border-collapse: collapse; width: 100%;' },
      { id: 6, name: 'Clean White', prompt: 'border: 1pt solid #cbd5e1; border-collapse: collapse; width: 100%; background: white;' },
      { id: 7, name: 'Dotted Plain', prompt: 'border: 1pt dotted #94a3b8; border-collapse: collapse; width: 100%;' },
      { id: 8, name: 'Grid Blue', prompt: 'border: 1pt solid #bfdbfe; border-collapse: collapse; width: 100%; th { background-color: #2563eb; color: white; }' },
      { id: 9, name: 'Grid Green', prompt: 'border: 1pt solid #bbf7d0; border-collapse: collapse; width: 100%; th { background-color: #16a34a; color: white; }' },
      { id: 10, name: 'Grid Orange', prompt: 'border: 1pt solid #fed7aa; border-collapse: collapse; width: 100%; th { background-color: #ea580c; color: white; }' },
      { id: 11, name: 'Grid Purple', prompt: 'border: 1pt solid #e9d5ff; border-collapse: collapse; width: 100%; th { background-color: #9333ea; color: white; }' },
      { id: 12, name: 'Grid Red', prompt: 'border: 1pt solid #fecdd3; border-collapse: collapse; width: 100%; th { background-color: #e11d48; color: white; }' },
      { id: 13, name: 'Grid Teal', prompt: 'border: 1pt solid #99f6e4; border-collapse: collapse; width: 100%; th { background-color: #0d9488; color: white; }' },
      { id: 14, name: 'Grid Indigo', prompt: 'border: 1pt solid #c7d2fe; border-collapse: collapse; width: 100%; th { background-color: #4f46e5; color: white; }' },
      { id: 15, name: 'Grid Amber', prompt: 'border: 1pt solid #fde68a; border-collapse: collapse; width: 100%; th { background-color: #d97706; color: white; }' }
    ];
    const activeTableStyle = tableStyles[tableDesignStyle] || tableStyles[0];
    const tableStyleInstruction = `\n[TABLE STYLE - MANDATORY]: All tables (including exercise tables and headers) MUST strictly follow this style code: "${activeTableStyle.prompt}". No other table styles allowed.`;

    const answerKeyProtocol = `\n[STRICT NO-ANSWER PROTOCOL]: You are generate a student assessment. You are strictly FORBIDDEN from including the answers (keys) within the exercise layout. The student questions MUST show blank lines (____) or empty cells where answers are required. DO NOT fill in the answers in the student content. All answers MUST be placed ONLY in the Answer Key section at the very end of the response.`;

    const headerDesigns = [
      `<div style="border-bottom: 2pt solid black; padding-bottom: 10pt; margin-bottom: 20pt;">
        <div style="display: flex; align-items: center; gap: 15pt; margin-bottom: 15pt;">
          ${brandSettings.logoData ? `<img src="${brandSettings.logoData}" style="max-height: 60pt; width: auto;" />` : ''}
          <h1 style="text-align: ${brandSettings.logoData ? 'left' : 'center'}; flex: 1; margin: 0; font-size: 24pt; text-transform: uppercase;">${brandSettings.schoolName || 'Worksheet'}</h1>
        </div>
        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 10pt; margin-bottom: 5pt;">
          <span>${brandSettings.studentLabel || 'Name'}: _________________________________</span>
          <span>${brandSettings.dateLabel || 'Date'}: ____ / ____ / ____</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 10pt;">
          <span>${brandSettings.classLabel || 'Class'}: _________________________________</span>
          <span>${brandSettings.teacherLabel || 'Teacher'}: _________________________________</span>
        </div>
      </div>`,
      `<div style="border: 2pt solid black; padding: 15pt; margin-bottom: 20pt; text-align: center;">
        <h1 style="font-size: 22pt; margin-bottom: 5pt;">${brandSettings.schoolName || 'Worksheet'}</h1>
        <div style="border-top: 1pt solid black; padding-top: 10pt; display: grid; grid-template-columns: 1fr 1fr; gap: 10pt; text-align: left; font-size: 9pt;">
          <div>${brandSettings.studentLabel || 'NAME'}: __________________________</div>
          <div>${brandSettings.dateLabel || 'DATE'}: __________________________</div>
          <div>${brandSettings.classLabel || 'CLASS'}: _________________________</div>
          <div>${brandSettings.scoreLabel || 'SCORE'}: ________ / ________</div>
        </div>
      </div>`,
      `<div style="margin-bottom: 30pt;">
        <div style="font-size: 8pt; border-bottom: 1pt solid #ccc; padding-bottom: 5pt; margin-bottom: 10pt; display: flex; justify-content: space-between;">
          <span>${brandSettings.schoolName}</span>
          <span>Academic Year: 2025-2026</span>
        </div>
        <h1 style="font-size: 28pt; font-weight: 900; letter-spacing: -1pt; margin-bottom: 10pt;">${topic.toUpperCase()}</h1>
        <div style="background: #f1f5f9; padding: 10pt; border-radius: 4pt; display: flex; gap: 20pt; font-size: 9pt;">
          <span><b>${brandSettings.studentLabel || 'STUDENT'}:</b> ____________________</span>
          <span><b>${brandSettings.idLabel || 'ID'}:</b> __________</span>
          <span><b>${brandSettings.dateLabel || 'DATE'}:</b> __________</span>
        </div>
      </div>`,
      `<div style="border-left: 5pt solid #2563eb; padding-left: 15pt; margin-bottom: 25pt;">
        <h1 style="font-size: 20pt; color: #1e40af; margin-bottom: 5pt; font-weight: 800;">${brandSettings.schoolName || 'Worksheet'}</h1>
        <div style="font-size: 10pt; color: #64748b; margin-bottom: 10pt;">Topic: ${topic || 'General Assessment'}</div>
        <div style="display: flex; gap: 15pt; font-size: 9pt; border-top: 1pt dashed #cbd5e1; padding-top: 8pt;">
          <span>${brandSettings.studentLabel || 'Name'}: _________________</span>
          <span>${brandSettings.classLabel || 'Class'}: _________</span>
          <span>${brandSettings.dateLabel || 'Date'}: _________</span>
        </div>
      </div>`,
      `<div style="background: #1e293b; color: white; padding: 20pt; border-radius: 8pt; margin-bottom: 25pt; position: relative; overflow: hidden;">
        <div style="position: absolute; right: -20pt; top: -20pt; width: 100pt; height: 100pt; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>
        <h1 style="font-size: 24pt; font-weight: 900; margin-bottom: 10pt; position: relative;">${brandSettings.schoolName || 'Worksheet'}</h1>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10pt; font-size: 9pt; opacity: 0.9;">
          <div style="border-bottom: 1pt solid rgba(255,255,255,0.3); padding-bottom: 2pt;">${brandSettings.studentLabel || 'Student'}: ________________</div>
          <div style="border-bottom: 1pt solid rgba(255,255,255,0.3); padding-bottom: 2pt;">${brandSettings.idLabel || 'ID'}: ________________</div>
          <div style="border-bottom: 1pt solid rgba(255,255,255,0.3); padding-bottom: 2pt;">${brandSettings.scoreLabel || 'Score'}: ________</div>
        </div>
      </div>`,
      `<div style="border: 4pt solid #16a34a; padding: 15pt; margin-bottom: 25pt; border-radius: 12pt; background: #f0fdf4;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2pt solid #16a34a; padding-bottom: 10pt; margin-bottom: 10pt;">
          <h1 style="font-size: 18pt; color: #166534; font-weight: 900; margin: 0;">${brandSettings.schoolName || 'Worksheet'}</h1>
          <div style="text-align: right; font-size: 8pt; color: #15803d;">
            <div>${brandSettings.dateLabel || 'DATE'}: ____/____/____</div>
            <div>${brandSettings.classLabel || 'CLASS'}: ___________</div>
          </div>
        </div>
        <div style="font-size: 10pt; color: #14532d; font-weight: bold;">${brandSettings.studentLabel || 'NAME'}: ______________________________________________________</div>
      </div>`,
      `<div style="background: linear-gradient(135deg, #065f46 0%, #064e3b 100%); color: white; padding: 25pt; margin-bottom: 30pt; border-radius: 4pt; box-shadow: 0 10pt 20pt rgba(6, 95, 70, 0.2);">
        <div style="border: 1pt solid rgba(255,255,255,0.2); padding: 15pt;">
          <h1 style="font-size: 22pt; font-weight: 200; letter-spacing: 5pt; text-align: center; margin-bottom: 15pt; text-transform: uppercase;">${brandSettings.schoolName || 'Assessment'}</h1>
          <div style="display: flex; justify-content: space-around; font-size: 9pt; font-family: monospace;">
            <span>[ ${brandSettings.studentLabel || 'STUDENT'}: ____________ ]</span>
            <span>[ ${brandSettings.dateLabel || 'DATE'}: __/__/__ ]</span>
            <span>[ ${brandSettings.scoreLabel || 'SCORE'}: ____ ]</span>
          </div>
        </div>
      </div>`,
      `<div style="border: 1pt solid #e2e8f0; padding: 0; margin-bottom: 25pt; border-radius: 8pt; overflow: hidden; box-shadow: 0 4pt 6pt -1pt rgba(0,0,0,0.1);">
        <div style="background: #facc15; padding: 15pt; display: flex; justify-content: space-between; align-items: center;">
          <h1 style="font-size: 16pt; font-weight: 900; color: #854d0e; margin: 0;">${brandSettings.schoolName || 'Worksheet'}</h1>
          <div style="background: white; padding: 4pt 12pt; border-radius: 20pt; font-size: 9pt; font-weight: bold; color: #854d0e;">${brandSettings.scoreLabel || 'SCORE'}: ____ / ____</div>
        </div>
        <div style="padding: 12pt; display: grid; grid-template-columns: 2fr 1fr; gap: 10pt; font-size: 9pt; background: white;">
          <div style="border-bottom: 1pt solid #e2e8f0;">${brandSettings.studentLabel || 'NAME'}: _________________________</div>
          <div style="border-bottom: 1pt solid #e2e8f0;">${brandSettings.dateLabel || 'DATE'}: ____________</div>
        </div>
      </div>`,
      `<div style="border-top: 8pt solid #dc2626; padding-top: 15pt; margin-bottom: 25pt;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h1 style="font-size: 26pt; font-weight: 900; color: #991b1b; line-height: 1;">${brandSettings.schoolName || 'TEST'}</h1>
            <div style="font-size: 10pt; color: #ef4444; font-weight: bold; margin-top: 5pt;">ACADEMIC EVALUATION</div>
          </div>
          <div style="text-align: right; font-family: serif; font-style: italic; font-size: 10pt;">
            <div>${brandSettings.studentLabel || 'Name'}: _________________</div>
            <div>${brandSettings.classLabel || 'Class'}: ________________</div>
            <div>${brandSettings.dateLabel || 'Date'}: _________________</div>
          </div>
        </div>
      </div>`,
      `<div style="display: flex; flex-direction: column; gap: 10pt; margin-bottom: 30pt;">
        <h1 style="font-size: 14pt; font-weight: 400; color: #64748b; border-left: 2pt solid #cbd5e1; padding-left: 10pt;">${brandSettings.schoolName || 'Worksheet'}</h1>
        <div style="font-size: 32pt; font-weight: 900; color: #0f172a; line-height: 1;">${topic.toUpperCase()}</div>
        <div style="height: 1pt; background: #e2e8f0; width: 100%;"></div>
        <div style="display: flex; gap: 30pt; font-size: 9pt; color: #94a3b8; font-weight: bold;">
          <span>${brandSettings.studentLabel || 'STUDENT'}: ____________________</span>
          <span>${brandSettings.dateLabel || 'DATE'}: ____________________</span>
        </div>
      </div>`,
      `<div style="display: flex; align-items: center; gap: 20pt; border-bottom: 3pt solid black; padding-bottom: 15pt; margin-bottom: 25pt;">
        ${brandSettings.logoData ? `<img src="${brandSettings.logoData}" style="max-height: 80pt; width: auto;" />` : '<div style="width: 80pt; height: 80pt; border: 2pt dashed #cbd5e1; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 8pt; text-align: center;">School Logo</div>'}
        <div style="flex: 1;">
          <h1 style="font-size: 24pt; font-weight: 900; margin: 0; text-transform: uppercase;">${brandSettings.schoolName || 'Worksheet'}</h1>
          <div style="font-size: 10pt; font-weight: bold; color: #64748b; margin-top: 5pt;">${brandSettings.schoolAddress}</div>
          <div style="display: flex; gap: 15pt; font-size: 9pt; margin-top: 10pt; border-top: 1pt solid #e2e8f0; padding-top: 5pt;">
            <span>${brandSettings.studentLabel || 'Name'}: _________________</span>
            <span>${brandSettings.classLabel || 'Class'}: _________</span>
            <span>${brandSettings.dateLabel || 'Date'}: _________</span>
          </div>
        </div>
      </div>`
    ];

    const selectedHeader = headerDesigns[paperDesign % headerDesigns.length];

    const letterOptions = 'A, B, C, D';
    const optionsPerLine = mcqLayout === 'single' ? 4 : mcqLayout === 'double' ? 2 : 1;

    const mcqLayoutInstruction = `[MCQ LAYOUT - ABSOLUTE MANDATORY]: For Multiple Choice Questions, format the options using exactly "${letterOptions}". 
    MANDATORY: YOU MUST USE A <table> with class "options-table" for MCQ options.
    MANDATORY: Generate exactly 15 items for each MCQ section if possible.
    [NO BOLD CHOICES]: You are STRICTLY FORBIDDEN from using <b> or <strong> tags for choices or choice letters (A, B, C, D). They MUST be plain text (font-weight: 400).
    NO BOLDING ON LETTERS: Use "A. " NOT "<b>A.</b>". THIS IS CRITICAL.
    THIS RULE OVERRIDES ANY OTHER MCQ FORMATTING RULE.
    ${optionsPerLine === 4 ? '- ONE LINE: Use a <table> with 4 columns (25% width each) for MCQ options.' : 
      optionsPerLine === 2 ? '- TWO LINES: Use a <table> with 2 columns (50% width each) for MCQ options.' : 
      '- FOUR LINES: Use a 1-column <table> (100% width) with 4 rows for MCQ options.'}
    [OPTION STYLE]: Apply "${mcqOptionStyle}" aesthetics. 
    ${mcqOptionStyle === 'Boxed' ? 'Wrap each option cell (<td>) in a solid border.' : ''}
    ${mcqOptionStyle === 'Brutalist' ? 'Use ultra-thick black borders and heavy 2D shadows for option cells.' : ''}
    ${mcqOptionStyle === 'Round' ? 'Represent option letters inside high-contrast circular badges.' : ''}
    ${mcqOptionStyle === 'Double Circle' ? 'Represent option letters inside high-contrast double-line circular badges.' : ''}
    ${mcqOptionStyle === 'Square' ? 'Represent option letters inside high-contrast square badges.' : ''}
    ${mcqOptionStyle === 'Round 2' ? 'Represent option letters inside horizontal oval shapes.' : ''}
    ${mcqOptionStyle === 'Brackets' ? 'Use brackets like [A] or {A} instead of plain letters.' : ''}
    ${isColorExportEnabled ? '[COLOR ENABLED]: Apply vibrant theme colors to your badges and layout elements.' : '[MONOCHROME]: Stay strictly black and white.'}
    [STYLE]: Use the letter options exactly as provided: ${letterOptions} followed by a period (if no brackets).
    [INLINE ENFORCEMENT]: You MUST ensure each option (Label + Text) stays on a SINGLE LINE. DO NOT allow the text to wrap to a second line.
    
    [MCQ DESIGN VARIETY]:
    - Randomly choose between these styles for the question line:
      1. Standard: "1. What is the capital of France?"
      2. Answer Blank at Start: "____ 1. What is the capital of France?" (Use 5 underscores for the blank).
      3. Letter on Line: "<u>&nbsp;&nbsp;A&nbsp;&nbsp;</u> 1. What is the capital of France?" (Where A is the correct letter, placed on a underlined blank before the number).
    
    [TEACHER ANSWER KEY - MANDATORY]: 
    - At the very end of the document, add a section wrapped in <div class="answer-key-section">.
    - Inside, add a <h2> titled "Teacher Answer Key".
    - Format the answers compactly: "Part A: 1:A, 2:C, 3:D..."
    - CRITICAL: For non-MCQ sections (like Matching, Supply Terms, Sentence Completion), the answer key MUST provide the ACTUAL CORRECT WORD or PHRASE (e.g., "1:Animal, 2:Blue..."). DO NOT use letters (A, B, C) if the questions don't have multiple choice options.
    - If "MCQ Design" is active, wrap the letters in <b> tags here too (e.g., "1:<b>A</b>").
    - Ensure the answer key is clearly separated from the test content.
    
    [HEADER DESIGN]:
    - Use the following HTML for the top of the worksheet:
    ${selectedHeader}
    
    [FOOTER DESIGN]:
    - At the very bottom of the document (after the answer key), add a footer wrapped in <div class="worksheet-footer">.
    - Use the following text for the footer: "${brandSettings.footerText}"
    - Style it with small font size (8pt), centered, and slightly faded color.
    
    [EXERCISE DESIGN - CREATIVE]: 
    - For "Writing Definition" or "Supply Key Terms", use professional HTML tables with <thead> and <tbody>.
    - Use zebra striping for tables.
    - For "Matching", randomly choose between these styles:
      1. Word Bank at Top: List words in a box at the top, then definitions below with a blank line on the left (e.g., "__________ 1. A large animal with a trunk").
      2. Word Bank at Bottom: Definitions on the right, blank lines on the left (e.g., "__________ 1. ..."), and a word bank box at the very bottom of the section.
      3. Two-Column Match: Column 1 (1-10) with terms, Column 2 (A-G) with definitions.
      4. Letter Matching: "____ 1. Definition..." with a list of options (A, B, C...) below or in a side box.
    - For "Fill in the blank", vary the blank position: sometimes at the beginning ("__________ is the capital of France"), middle, or end. Use <span class="blank-line"></span> for blanks.
    - For "True or False", you MUST use this style:
        ${paperStyles.tf === 0 ? 'a. ( T / F ) at the end: "1. The sky is blue. ( T / F )"' :
          paperStyles.tf === 1 ? 'b. Blank at start: "<span class="blank-line"></span> 1. The sky is blue."' :
          paperStyles.tf === 2 ? 'c. Checkbox at start: "<span class="checkbox-box"></span> 1. The sky is blue."' :
          'd. True / False labels at the end.'}
    - For "Correct or Incorrect", you MUST use this style:
        ${paperStyles.correctIncorrect === 0 ? 'a. Checkbox at start: "<span class="checkbox-box"></span> 1. Sentence with error."' :
          paperStyles.correctIncorrect === 1 ? 'b. ( C / I ) at the end: "1. Sentence with error. ( C / I )"' :
          'c. "Correct / Incorrect" labels at the end.'}
    - For "Sentence Rewrite", provide the original sentence, then a blank line below it for the student to write the new version.
    - Make the designs look interesting and varied, like a high-quality printed textbook.
    - Ensure all tables have the class "professional-table" for consistent styling.`;

    const alignments = ['left', 'center', 'right'];
    const randomAlignment = alignments[Math.floor(Math.random() * alignments.length)];
    
    const headerStyle = isInstructionBackgroundEnabled 
      ? `class="header-row", background-color: #334155, color: white, text-align: left, padding: 4pt 12pt, font-weight: bold, margin-bottom: 0 !important`
      : `class="header-row", background-color: transparent, color: black, text-align: left, padding: 2pt 0, font-weight: bold, margin-bottom: 0 !important`;

    const instructionVisualPrompt = `
[INSTRUCTION STYLE - CRITICAL BOLDFACE]: All instruction headers (e.g., PART A: ...) MUST be rendered with <b> tags AND inline style "font-weight: 900 !important; color: black !important;". Ensure they are exceptionally bold and high-contrast.

[STRICT SCOPE MANDATE]: You are STRICTLY FORBIDDEN from generating any sections or parts that were not explicitly listed in the "consists of the following sections" list below. DO NOT add "Part G", "Part H" etc. if they are not requested. ONLY generate the requested sections.

[VOCABULARY STYLE ENFORCEMENT]:
- "Matching": Use a 2-column table. Column 1: Terms. Column 2: Definitions (prefixed with A, B, C...).
- "Key Terms": Provide a "Definition" first, followed by a long blank line for the student to write the "Key Term".
- "Vocabulary Bank": Use the "shape-drawn" classes for any word banks to give them a hand-drawn organic appearance.
`;
    
    const componentLogic = selectedTemps.map((t, idx) => {
      const overrideCol = columnOverrides[t.id] !== undefined ? columnOverrides[t.id] : (t.columnCount !== undefined ? t.columnCount : defaultColumnCount);
      const overrideItems = itemCountOverrides[t.id] || 10;
      
      const rawHeader = `PART ${String.fromCharCode(65 + idx)}: ${t.professionalLabel || t.label}`;
      const formattedHeader = instructionCase === 'uppercase' ? rawHeader.toUpperCase() : instructionCase === 'lowercase' ? toTitleCase(rawHeader) : rawHeader;

      let blueprintStr = '';
      
      // Determine the type of question to generate the correct blueprint
      const isTF = t.id.includes('tf') || t.label.includes('True/False');
      const isMCQ = t.id.includes('mcq') || t.label.includes('MCQ');
      const isOpenEnded = t.id.includes('short_answer') || t.id.includes('inferential') || t.id.includes('critical_thinking') || t.id.includes('rewrite') || t.id.includes('speaking');

      if (isTF) {
        // Generate T/F/NG blueprint
        const tfKeys = ['T', 'F', 'NG'];
        const blueprint: string[] = [];
        for (let i = 0; i < overrideItems; i++) {
          blueprint.push(tfKeys[Math.floor(Math.random() * tfKeys.length)]);
        }
        blueprintStr = `(USE THIS ANSWER KEY: ${blueprint.map((key, i) => `${i + 1}:${key}`).join(', ')})`;
      } else if (isMCQ || (!isOpenEnded && !isTF)) {
        // Generate standard A, B, C, D blueprint for MCQs and other closed-ended questions
        const blueprint = generateNeuralBlueprint(overrideItems);
        blueprintStr = `(USE THIS ANSWER KEY: ${blueprint.map((key, i) => `${i + 1}:${key}`).join(', ')})`;
      } else {
        // Open-ended questions do not get a forced blueprint
        blueprintStr = `(DO NOT USE A PRE-ASSIGNED ANSWER KEY. Generate natural, accurate answers for the Teacher Answer Key based on the text.)`;
      }

      let formatInstruction = '';
      
      // Use overrideCol if it's > 0, otherwise use defaultColumnCount
      const effectiveCols = overrideCol > 0 ? overrideCol : defaultColumnCount;
      const isVocabStudyTable = activeModule === 'Vocabulary' && (t.id.includes('study') || t.id.includes('key_term') || t.id.includes('matching') || t.label.includes('Key Term') || t.label.includes('Matching') || t.label.includes('Study Table') || t.label.includes('Definition Table') || t.label.includes('Vocabulary List')) && !t.id.includes('sentence_study') && !t.id.includes('speaking');
      const isForcedList = overrideCol === 0 && defaultColumnCount === 1 && ![2, 3, 4].includes(baseLayout) && !isVocabStudyTable;
      
      const isReadingComponent = t.category === 'READING' || activeModule === 'Reading';
      const needsReadingRow = (isReadingComponent && !isSingleReadingText) || (isSingleReadingText && idx === 0);
      const readingRowInstruction = needsReadingRow
        ? `\n            - Row 2 (CRITICAL): A single <td> spanning all columns (colspan="${effectiveCols}") containing the FULL READING PASSAGE. NEVER put the passage outside the table.` 
        : '';
      const itemsRowNumber = needsReadingRow ? 3 : 2;

      if (isVocabStudyTable) {
        const shapeKeywords = ['shape', 'bottom', 'top', 'draw'];
        const isStackedShape = 
          ['v_matching_shape', 'v_shape_bank_bottom', 'v_shape_bank_top', 'm_bottom', 'm_top', 'custom'].some(id => t.id.includes(id)) ||
          shapeKeywords.some(keyword => t.styleName?.toLowerCase().includes(keyword) || t.label?.toLowerCase().includes(keyword));
        
        const vocabStyleSpecifics = (t.styleName?.toLowerCase().includes('divider') || t.id.includes('v_study_table')) ? 'Apply a solid 2.5pt thick vertical divider line (border-left) between Column 1 and Column 2. Use a vibrant color matching the subject theme.' :
                                   (t.styleName?.toLowerCase().includes('no divider') || t.styleName?.toLowerCase().includes('clean') || t.id.includes('v_study_clean')) ? 'DO NOT use any borders or dividers.' :
                                   (t.styleName?.toLowerCase().includes('zebra') || t.id.includes('v_zebra_table')) ? 'Use alternating row colors and a middle divider.' :
                                   (isStackedShape) ? 
                                   `WRAP the vocabulary list/bank in a <div class="shape-drawn-\${Math.floor(Math.random() * 3) + 1}"> (MANDATORY CLASS). Inside this organic shape-drawn box, wrap each word/phrase in a <span>. This creates the randomize DRAWING design style shape.` :
                                   'Apply a solid middle divider line.';

        const isAnswerType = t.typeId === 'key_term' || t.typeId === 'matching';
        const isMatching = t.typeId === 'matching' || t.label.toLowerCase().includes('matching');

        if (isStackedShape) {
          formatInstruction = `(MANDATORY FORMAT: Stacked layout for Vocabulary/Matching Shape Bank. 
            - Header: Use ${headerStyle}. Title: "${formattedHeader}".
            - Vocabulary Bank: Create a <div class="shape-drawn-${Math.floor(Math.random() * 3) + 1}"> (MANDATORY CLASS). Inside this organic shape-drawn box, list all the key terms/words separated by commas. This box MUST be placed at either the TOP (right after header) or BOTTOM of the section.
            - Questions: Render the items below (or above) the bank. For definitions, put "Definition: [Blank Line]" for Key Terms, or "_____ 1. Definition" for Matching.
            - STRICT INSTRUCTION: DO NOT use a 2-column table layout for the items if using a shape bank.
            - ${vocabStyleSpecifics}
            ${isMatching ? '\n- [MATCHING LETTER MANDATE]: Use unique sequential letters A, B, C, D, E, F, G, H, I, J for the 10 items. DO NOT REPEAT LETTERS.' : ''}
            - ${answerKeyProtocol})`;
        } else {
          formatInstruction = `(MANDATORY FORMAT: Use 1 single HTML <table> with 2 columns for this vocabulary exercise. 
            - Row 1 (header): Header row spanning both columns (colspan="2"), with ${headerStyle}. Title: "${formattedHeader}".${readingRowInstruction.replace(/colspan="\d+"/, 'colspan="2"')}
            - Subsequent Rows: Create one row per vocabulary item. Each row MUST have EXACTLY 2 cells (<td>). 
            - Cell 1 (40% width): Question/Number/Definition.
            - Cell 2 (60% width): ${isAnswerType ? 'STRICTLY BLANK LINE (__________). DO NOT place the answer here.' : 'Definition/Meaning/Answer (Study content).'}
            - TABLE STYLING: ${activeTableStyle.prompt}
            - ${vocabStyleSpecifics}
            ${isMatching ? '\n- [MATCHING LETTER MANDATE]: Use unique sequential letters A, B, C, D, E, F, G, H, I, J for the 10 items. DO NOT REPEAT LETTERS.' : ''}
            - [CRITICAL]: Ensure perfect vertical alignment. This table must serve as the student's workspace. ${answerKeyProtocol})`;
        }
      } else if (t.id === 'mcq_columns_grid') {
        formatInstruction = `(MANDATORY FORMAT: Use a nested 4-column HTML table for MCQ options A, B, C, and D for each question. 
          - Question: Standard numbering (1. Sentence...).
          - Options: Placed on a new line below the sentence. Every set of options MUST be inside a <table> with 4 columns.
          - Alignment: Ensure A, B, C, D are perfectly aligned across all questions.)`;
      } else if (t.id === 'mcq_inline_paren') {
        formatInstruction = `(MANDATORY FORMAT: Parenthetical Inline MCQ. 
          - FORMAT: Place the options A, B, C, and D strictly within parentheses at the VERY END of each sentence. 
          - Separator: Use a forward slash "/" between options. 
          - Example: 1. She is happy. (A. is / B. are / C. am / D. be)
          - DO NOT put options on new lines or in tables.)`;
      } else if (t.id === 'g_circle_slash') {
        formatInstruction = `(MANDATORY FORMAT: Slash Choice Circuit. 
          - FORMAT: The correct answer choice and its distractor(s) must be presented WITHIN the sentence, separated by a slash and enclosed in square brackets.
          - Example: 1. My sister [is / are / am] very tall.
          - No A, B, C, D options allowed.)`;
      } else if (t.id === 'g_pair') {
        formatInstruction = `(MANDATORY FORMAT: Double-Gap MCQ Nested Table.
          - Question: Standard numbering (1. Sentence with two gaps).
          - Options: Placed on a new line below the sentence. Every set of options MUST be inside a <table> with 4 columns.
          - Style: Bold each option (e.g., <b>A. visits / likes</b>). 
          - Alignment: Ensure A, B, C, D are perfectly aligned across all questions.)`;
      } else if (isForcedList) {
        formatInstruction = `(FORMAT: Standard numbered list. ${isPartBackgroundEnabled ? 'MANDATORY: Wrap the entire part in a <div class="..."> with a unique background style class from the PART BACKGROUND PROTOCOL.' : ''} Every numbered item (1., 2., 3., etc.) MUST start on a NEW LINE using an HTML <p> or <br> tag. DO NOT bunch them together in a single paragraph. DO NOT use tables or columns.)`;
      } else if (baseLayout === 0 || (baseLayout === 3 && effectiveCols === 1)) {
        // Option 1 (Clean) or Option 4 with 1 column override
        if (effectiveCols > 1) {
          formatInstruction = `(MANDATORY FORMAT: Use a real HTML <table> with ${effectiveCols} columns. 
            ${isPartBackgroundEnabled ? 'MANDATORY: Apply a unique background style class from the PART BACKGROUND PROTOCOL to this <table> tag.' : ''}
            - Row 1: Header row spanning all ${effectiveCols} columns (colspan="${effectiveCols}"), with ${headerStyle}. Title: "${formattedHeader}".${readingRowInstruction}
            - Row ${itemsRowNumber}: Distribute the ${overrideItems} items STRICTLY EVENLY across ${effectiveCols} columns. (e.g. if 10 items, put 5 in Col 1 and 5 in Col 2).
            - MANDATORY: Every numbered item (1., 2., 3., etc.) MUST start on a NEW LINE using an HTML <p> or <br> tag. DO NOT bunch them together.
            - The table MUST have a border: 1.5pt solid #334155.
            - DO NOT put borders between the items inside the cells. This is the "Clean" layout with ${effectiveCols} columns.)`;
        } else {
          formatInstruction = `(MANDATORY FORMAT: Use a real HTML <table> with 1 column and EXACTLY ${itemsRowNumber} rows. 
            ${isPartBackgroundEnabled ? 'MANDATORY: Apply a unique background style class from the PART BACKGROUND PROTOCOL to this <table> tag.' : ''}
            - Row 1: Header row with ${headerStyle}. Title: "${formattedHeader}".${readingRowInstruction}
            - Row ${itemsRowNumber}: A single <td> containing ALL ${overrideItems} items. MANDATORY: Every numbered item (1., 2., 3., etc.) MUST start on a NEW LINE using an HTML <p> or <br> tag. DO NOT bunch them together in a single paragraph.
            - The table MUST have a border: 1.5pt solid #334155.
            - DO NOT put borders between the items inside the table body. This is the "Clean" layout.)`;
        }
      } else if (baseLayout === 1) {
        // Option 2 (Lined): 1 column, multiple rows (Header + One row per item)
        if (effectiveCols > 1) {
          formatInstruction = `(MANDATORY FORMAT: Use a real HTML <table> with ${effectiveCols} columns. 
            ${isPartBackgroundEnabled ? 'MANDATORY: Apply a unique background style class from the PART BACKGROUND PROTOCOL to this <table> tag.' : ''}
            - Row 1: Header row spanning all ${effectiveCols} columns (colspan="${effectiveCols}"), with ${headerStyle}. Title: "${formattedHeader}".${readingRowInstruction}
            - Subsequent rows: Distribute the ${overrideItems} items STRICTLY EVENLY across ${effectiveCols} columns.
            - Every <td> MUST have a border: 1pt solid #334155; padding: 10px;
            - This creates a lined grid with ${effectiveCols} columns.)`;
        } else {
          formatInstruction = `(MANDATORY FORMAT: Use a real HTML <table> with 1 column. 
            ${isPartBackgroundEnabled ? 'MANDATORY: Apply a unique background style class from the PART BACKGROUND PROTOCOL to this <table> tag.' : ''}
            - Row 1: Header row with ${headerStyle}. Title: "${formattedHeader}".${readingRowInstruction}
            - Subsequent rows: Each row contains EXACTLY ONE item.
            - Every <td> MUST have a border: 1pt solid #334155; padding: 10px;
            - This creates lines between every question.)`;
        }
      } else if (baseLayout === 2) {
        // Option 3 (Grid): 2 columns, multiple rows (Header + Items distributed)
        formatInstruction = `(MANDATORY FORMAT: Use a real HTML <table> with ${effectiveCols} columns. 
            ${isPartBackgroundEnabled ? 'MANDATORY: Apply a unique background style class from the PART BACKGROUND PROTOCOL to this <table> tag.' : ''}
            - Row 1: Header row spanning all ${effectiveCols} columns (colspan="${effectiveCols}"), with ${headerStyle}. Title: "${formattedHeader}".${readingRowInstruction}
            - Subsequent rows: Distribute the ${overrideItems} items STRICTLY EVENLY across ${effectiveCols} columns (one item per cell).
            - Every <td> MUST have a border: 1pt solid #334155; padding: 10px; vertical-align: top;
            - This creates a professional worksheet grid with ${effectiveCols} columns.)`;
      } else if (baseLayout === 3) {
        // Option 4 (Vertical Ruler Middle): 2 columns with a middle ruler
        formatInstruction = `(MANDATORY FORMAT: Use a real HTML <table> with 2 columns. 
            ${isPartBackgroundEnabled ? 'MANDATORY: Apply a unique background style class from the PART BACKGROUND PROTOCOL to this <table> tag.' : ''}
            - Row 1: Header row spanning both columns (colspan="2"), with ${headerStyle}. Title: "${formattedHeader}".${readingRowInstruction.replace(/colspan="\d+"/, 'colspan="2"')}
            - Subsequent rows: Distribute the ${overrideItems} items STRICTLY EVENLY across 2 columns.
            - MANDATORY: The <table> MUST have a class="ruler-table". 
            - The middle border between columns MUST be a solid 1.5pt line (the "ruler").
            - DO NOT use outer borders. ONLY the middle vertical border is allowed.
            - [CRITICAL]: If you do not use a 2-column table for EVERY part, the middle ruler line will be broken. This is the "Middle Ruler" layout where content is split into two halves.)`;
        } else if (baseLayout === 4) {
        // Option 5 (Rulers Left): 2 columns, 1 row (Header) + N rows (Items)
        formatInstruction = `(MANDATORY FORMAT: Use a real HTML <table> with 2 columns. 
          - Row 1: Header row spanning both columns (colspan="2"), with ${headerStyle}. Title: "${formattedHeader}".${readingRowInstruction.replace(/colspan="\d+"/, 'colspan="2"')}
          - Subsequent Rows: Each row MUST have EXACTLY 2 cells (<td>). 
          - Cell 1: The Question Number and Instruction (e.g. "1. Choose the correct answer:").
          - Cell 2: The actual question content or MCQ options.
          - MANDATORY: The table MUST have a vertical border between the two columns to act as a "Ruler".
          - Use class="ruler-table" for the <table> tag.
          - This is the "Ruler" layout where the left column is for numbering and the right column is for content.)`;
      } else if (baseLayout >= 5) {
        // Options 6-9 (S1-S4): Similar to Clean but with different background lines
        formatInstruction = `(MANDATORY FORMAT: Use a real HTML <table> with 1 column and EXACTLY ${itemsRowNumber} rows. 
          - Row 1: Header row with ${headerStyle}. Title: "${formattedHeader}".${readingRowInstruction}
          - Row ${itemsRowNumber}: A single <td> containing ALL ${overrideItems} items. MANDATORY: Every numbered item (1., 2., 3., etc.) MUST start on a NEW LINE using an HTML <p> or <br> tag.
          - The table MUST have a border: 1.5pt solid #334155.
          - This is a "Lined" layout with special background lines.)`;
      } else {
        formatInstruction = `(FORMAT: Standard numbered list. ${isPartBackgroundEnabled ? 'MANDATORY: Wrap the entire part in a <div class="..."> with a unique background style class from the PART BACKGROUND PROTOCOL.' : ''} Every numbered item (1., 2., 3., etc.) MUST start on a NEW LINE using an HTML <p> or <br> tag. DO NOT bunch them together in a single paragraph. DO NOT use tables or columns.)`;
      }
        
      const formattedPrompt = instructionCase === 'uppercase' ? t.prompt.toUpperCase() : t.prompt;
        
      return `[SECTION START - ${String.fromCharCode(65 + idx)}]: (DO NOT PRINT "SECTION ${String.fromCharCode(65 + idx)}") [MANDATORY HEADER - YOU MUST USE THIS EXACT TEXT ONLY ONCE: "<b>${formattedHeader}</b>"]: <b>${formattedPrompt.replace(/{{BLANK}}/g, selectedBlankStyle)}</b> (GENERATE EXACTLY ${overrideItems} ITEMS) ${blueprintStr} ${formatInstruction} ${paperStylesInstruction} ${tableStyleInstruction} ${rulerInstruction} ${instructionVisualPrompt} ${answerKeyProtocol} [CLEAN HEADER PROTOCOL]: Place the mandatory header ONLY ONCE. If the formatting instruction above (Row 1) specifies putting the header inside a table row, YOU MUST NOT print the header again outside the table. DO NOT PRINT THE TITLE TWICE. Avoid double headers at all costs.`;
    }).join('\n\n');

    const moduleSafetyGuard = activeModule === 'Grammar'
      ? `[MODULE SAFETY GUARD - CRITICAL]: You are generating a GRAMMAR assessment. You are strictly FORBIDDEN from including reading passages or vocabulary-only definitions. Focus 100% on grammar rules, situational logic, and positional word order. Ensure NO LEAKAGE from Reading or Vocabulary modules.`
      : activeModule === 'Vocabulary'
      ? `[MODULE SAFETY GUARD - CRITICAL]: You are generating a VOCABULARY assessment. 
         [VOCABULARY RELEVANCE & VARIETY - ABSOLUTE MANDATORY]:
         - FORBIDDEN: Generic "AI idioms" (piece of cake, break a leg).
         - RELEVANCE: All idioms and phrasal verbs MUST directly relate to the topic of "${topic || fallbackTopic}".
         - VARIETY: DO NOT repeat any idiom or phrasal verb. Use unique terms to boost speaking/vocabulary.
         - SOURCE: Extract phrases from the reading passage if provided.
         
         [LEXICAL MIX MANDATE (CRITICAL DOUBLE FIX!)]:
         You are FORBIDDEN from generating only standard single words. To boost students' vocabulary and speaking, you MUST inject phrases. 
         In EVERY vocabulary exercise (Study Tables, MCQs, Matching, Word Boxes), strictly adhere to this mixture ratio (Scale per 10 items):
         - 10% Idioms (Strictly related to the topic of "${topic || fallbackTopic}").
         - 40% Phrases (MUST include Verb Phrases, Noun Phrases, or Phrasal Verbs related to the topic).
         - 50% Single Words (Advanced vocabulary based on level calibration).
         Example: For a 15-item exercise, use ~1-2 Idioms, ~6 multi-word Phrases, ~7-8 single Words. You MUST include phrases with more than 2 words.
         - [MATCHING LETTER MANDATE]: For EVERY matching exercise with 10 items, use letters A, B, C, D, E, F, G, H, I, J.
         
         You are strictly FORBIDDEN from testing grammar rules, injecting grammar errors, or including reading passages. 
         - NO READING LOGIC: Do NOT include "Not Mentioned" or "Unknown" options. 
         - NO GRAMMAR LOGIC: Protocol 21 (Cross-Topic Injection) and Rule 1 (No-Free-Verb) are DISABLED. 
         - PURE SEMANTICS: Focus 100% on word meanings. All distractors must be grammatically identical to the correct answer.
         - [LAYOUT MANDATE]: For ALL Vocabulary-related parts (Study Table, Key Terms, Matching), you MUST use exactly 1 table with 2 columns. Column 1 is for the term/definition, Column 2 is for the match/answer. This is an absolute requirement.`
      : activeModule === 'Reading'
      ? `[MODULE SAFETY GUARD - CRITICAL]: You are generating a READING assessment. You are strictly FORBIDDEN from testing grammar rules or injecting grammar errors. Focus 100% on comprehension and inference logic.
         - PASSAGE DIVERSITY: ${isSingleReadingText ? 'Use ONE SINGLE reading passage for the ENTIRE test. All parts must refer to this single passage.' : 'Use a DIFFERENT reading passage for EACH part of the test.'}
         - LEVEL ADAPTATION: The length and level of thinking must strictly match the selected Academic Level (${activeLevel}).`
      : '';

    const readingPassageLength = (activeLevel === 'Kid' || activeLevel === 'Beginner') ? '50-80 words' : '300-500 words';
    const readingPassageInstruction = isSingleReadingText 
      ? `1. GENERATE ONE SINGLE PASSAGE (~${readingPassageLength}) about "${topic || fallbackTopic}" at the top of the test.` 
      : `1. GENERATE A UNIQUE, SEPARATE PASSAGE (~${readingPassageLength}) FOR EVERY SINGLE PART of the test. Each part MUST have its own distinct text.`;

    const componentList = selectedTemps.map((t, idx) => {
      const label = t.professionalLabel || t.label;
      const formattedLabel = instructionCase === 'uppercase' ? label.toUpperCase() : instructionCase === 'lowercase' ? toTitleCase(label) : label;
      return `- PART ${String.fromCharCode(65 + idx)}: ${formattedLabel} (Item Count: ${itemCountOverrides[t.id] || 10})`;
    }).join('\n');

    const isHighLevel = ['Level 5', 'Level 6', 'Level 7', 'Level 8', 'Level 9', 'Level 10', 'Level 11', 'Upper Intermediate', 'Advanced', 'IELTS', 'TOEFL'].includes(activeLevel);
    const levelComplexityInstruction = isHighLevel
      ? `\n7. [SENTENCE MIX & CONTEXT MANDATE]: This is an ADVANCED ${activeLevel} test. 
          - EVERY ITEM MUST provide deep context. FORBIDDEN from using single, isolated sentences for more than 50% of the items.
          - STRICT RATIO (For every 10 items):
            * 5 Items: Single sentence (Exactly 1 full stop '.')
            * 3 Items: Double sentences (Exactly 2 full stops '.')
            * 2 Items: Triple sentences (Exactly 3 full stops '.')
          - I define a "sentence" by the presence of a full stop (.). If an item has only 1 full stop, it is ONE sentence.
          - MANDATORY: This mix is REQUIRED to boost reading comprehension skills.
          - Every item MUST embed the target in a context that requires critical thinking. FORBIDDEN from using only simple, short single sentences.`
      : '';

    const mandatorySequence = (activeModule === 'Grammar' 
      ? `1. GENERATE EXACTLY AND ONLY THE ${selectedInstructionIds.length} REQUESTED PARTS LISTED BELOW. 
2. [TOPIC DISTRIBUTION]: Focus 100% on "${topic || fallbackTopic}". Distribute nuances of this topic across the requested parts.
3. [STRICT LIMIT]: DO NOT ADD ANY ADDITIONAL SECTIONS, INTROS, OR OUTROS.
4. [MODULE FIREWALL]: You are strictly FORBIDDEN from generating Reading passages (unless a Reading template is selected) or Vocabulary definitions. Focus only on Grammar structural accuracy.
5. [PART LIST]:
${componentList}
6. [COMPLETENESS]: You MUST generate every part in the list above. Number each starting from 1.`
      : activeModule === 'Reading'
      ? `1. GENERATE EXACTLY AND ONLY THE ${selectedInstructionIds.length} REQUESTED PARTS LISTED BELOW.
2. ${readingPassageInstruction}
3. [STRICT LIMIT]: DO NOT ADD EXTRA PARTS. 
4. [MODULE FIREWALL]: Strictly forbidden from testing grammar mechanics. Focus on comprehension.
5. [PART LIST]:
${componentList}
6. [COMPLETENESS]: Every part listed above MUST be generated completely.`
      : `1. GENERATE EXACTLY AND ONLY THE ${selectedInstructionIds.length} REQUESTED PARTS LISTED BELOW.
2. [STRICT LIMIT]: DO NOT ADD EXTRA SECTIONS.
3. [MODULE FIREWALL]: No grammar testing in vocabulary sections.
4. [PART LIST]:
${componentList}
5. [COMPLETENESS]: Generate every part listed below. Number items starting from 1.`) + levelComplexityInstruction;

    const instructionRulerPrompt = instructionRulerStyle > 0 
      ? `[INSTRUCTION RULER - MANDATORY]: After EVERY instruction header (e.g., PART A: ...), you MUST insert a <div class="instruction-ruler-${instructionRulerStyle}"></div>. This is a visual separator that MUST be visible.
         - ZERO VERTICAL MARGIN: You are STRICTLY FORBIDDEN from adding any blank lines, <br> tags, or padding between the header, the ruler, and the first item. They must be perfectly adjacent.
         - S1: Simple 1pt solid line.
         - S2: 2pt dashed line.
         - S3: 3pt double line.
         - S4: Thick 4pt solid line with gradient.
         - S5: Decorative line with stars (★ ★ ★).
         - S6: Decorative line with hearts (♥ ♥ ♥).`
      : '';

    const instructionStyleWorksheetFix = `
      [INSTRUCTION LEAK PREVENTION]: You are strictly forbidden from repeating the instruction header inside the exercise content.
      The header (PART A, PART B, etc.) must appear ONLY ONCE at the top. 
      If using tables, the first row MUST contain the header, and then the content must follow in subsequent rows or columns.
      DO NOT spill header styles (backgrounds/borders) into the exercise body.
    `;

    const listeningLogicFirewall = '';
    const listeningTapescriptPrompt = '';

    const finalLogic = `
${moduleSafetyGuard}
${listeningLogicFirewall}
${listeningTapescriptPrompt}
${vocabOrderInstruction}
${generationIntegrityInstruction}
${subjectInstruction}
${caseInstruction}
${GLOBAL_STRICT_COMMAND.replace(/{{TOPIC}}/g, topic || fallbackTopic).replace(/{{BLANK}}/g, selectedBlankStyle)}
${isFrameEnabled ? BORDER_FRAME_INSTRUCTION.replace("'isHandDrawnBorderEnabled' is true", `isHandDrawnBorderEnabled is ${isHandDrawnBorderEnabled}`) : ''}
${pageStyleInstruction}
${partBackgroundInstruction}
${instructionBackgroundInstruction}
${instructionRulerPrompt}
${instructionStyleWorksheetFix}
${protocolsPrompt}
${strategyInstruction.replace(/{{TOPIC}}/g, topic || fallbackTopic)}
${mcqLayoutInstruction}
${paperStylesInstruction}
${rulesPrompt}

[SYSTEM OBJECTIVE]: Generate a COMPLETE assessment based on the requested components.
[MANDATORY]: You MUST generate ALL ${selectedInstructionIds.length} requested parts. DO NOT skip any parts. DO NOT generate ANY additional parts beyond the ${selectedInstructionIds.length} requested. If you hit a length limit, prioritize completing all parts with fewer items rather than skipping entire parts or over-generating.
[TARGET TOPIC]: "${topic || fallbackTopic}"
[TARGET LEVEL]: ${activeLevel}
[LANGUAGE]: ${activeLanguage}

### MANDATORY SEQUENCE ###
${mandatorySequence}

${componentLogic}
    `;
    
    try {
      setGenerationStep('Applying Master Protocols...');
      // Randomize logo from available logos
      const availableLogos = (brandSettings.logos || []).filter(l => !!l);
      if (availableLogos.length > 0) {
        const randomLogo = availableLogos[Math.floor(Math.random() * availableLogos.length)];
        setBrandSettings(prev => ({ ...prev, logoData: randomLogo }));
      }

      // Randomize Font if enabled
      if (brandSettings.randomizeFont) {
        const randomFont = FONTS[Math.floor(Math.random() * FONTS.length)];
        setBrandSettings(prev => ({ ...prev, activeFont: randomFont.name }));
      }

      setGenerationStep('Synthesizing Test Items...');
      // FIREBASE CLOUD SAVE IMPLEMENTATION
      // ==================================================
      // 1. Call the AI Brain
      const result = await callNeuralEngine(activeEngine, finalLogic, protocolsPrompt, sourceMaterial, externalKeys);
      
      if (result.text.includes('Error:')) {
        setGenerationError(result.text);
        setIsGenerating(false);
        setGenerationStep('');
        return;
      }

      setGenerationStep('Finalizing Layout...');
      
      let finalHtml = result.text;
      
      // POST-PROCESSING: Enforcement of "No Color" mode if disabled
      if (!isInstructionBackgroundEnabled) {
        // Strip common background styles from the generated HTML
        finalHtml = finalHtml.replace(/background-color:[^;"]+;?/gi, 'background-color:transparent;')
                             .replace(/background:[^;"]+;?/gi, 'background:transparent;')
                             .replace(/bgcolor="[^"]+"/gi, 'bgcolor="transparent"');
      }

      // Aggressive redundancy removal for headers
    finalHtml = finalHtml.replace(/<div[^>]*header-design[^>]*>[\s\S]*?<\/div>/gi, '');
    
    // Ensure "Introduction" text doesn't have background color if disabled
    if (!isInstructionBackgroundEnabled) {
      finalHtml = finalHtml.replace(/<div[^>]*>Introduction:[\s\S]*?<\/div>/gi, (match) => {
        return match.replace(/background-color:[^;"]+;?/gi, 'background-color:transparent;')
                    .replace(/background:[^;"]+;?/gi, 'background:transparent;');
      });
    }

    setWorksheetContent(finalHtml);
      setIsGenerating(false);
      setGenerationStep('');
      setGenerationError(null);
      setViewMode('preview');

      // 2. Create the data package
      const newTestItem = {
        id: `hist-${Date.now()}`,
        title: `${activeLanguage} ${activeModule}: ${activeLevel} - ${topic || "Synthesis"}`,
        content: result.text,
        timestamp: Date.now(),
        promptId: 'manual',
        logicSnapshot: finalLogic,
        module: activeModule,
        level: activeLevel,
        topic: topic,
        // Add who created it
        authorName: auth.currentUser?.displayName || session?.name || 'Anonymous',
        authorEmail: auth.currentUser?.email || session?.email || 'N/A',
        uid: auth.currentUser?.uid || 'anonymous'
      };

      // 3. Update Local History (so you see it on screen)
      setHistory(prev => {
        const current = Array.isArray(prev) ? prev : [];
        return [newTestItem, ...current].slice(0, 30);
      });

      // 4. SEND TO THE CLOUD (The Magic Step!)
      if (auth.currentUser) {
        try {
             await setDoc(doc(db, 'history', newTestItem.id), newTestItem);
             console.log("✅☁️ Test successfully saved to the Firebase Cloud Notebook!");
        } catch (e) {
             handleFirestoreError(e, OperationType.WRITE, `history/${newTestItem.id}`);
        }
      }
    } catch (error: any) {
      console.error("Generation failed:", error);
      setGenerationError(error.message || "Neural synthesis failed. Please check your connection or API keys.");
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleAssistantMessage = async (msg: string, file?: QuickSource) => {
    const userMsg: ChatMessage = { id: `msg-${Date.now()}`, role: 'user', text: msg, timestamp: Date.now() };
    setChatMessages(prev => [...prev, userMsg]);
    setIsGenerating(true);
    setGenerationStep('Assistant Processing...');
    try {
      const context = `Assistant Mode. Worksheet: ${worksheetContent.slice(0, 1000)}. Edit based on: ${msg}`;
      const result = await callNeuralEngine(activeEngine, msg, context, file || sourceMaterial, externalKeys);
      
      if (result.text.includes('Error:')) {
        setGenerationError(result.text);
        setIsGenerating(false);
        setGenerationStep('');
        return;
      }

      setChatMessages(prev => [...prev, { id: `msg-bot-${Date.now()}`, role: 'architect', text: "Synthesis updated.", timestamp: Date.now() }]);
      setWorksheetContent(result.text);
      setIsGenerating(false);
      setGenerationStep('');
    } catch (error: any) {
      console.error("Assistant failed:", error);
      setGenerationError(error.message || "Assistant synthesis failed.");
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handlePrint = () => {
    // Due to iframe sandbox restrictions in this environment, window.print() silently fails.
    // We automatically fallback to generating a perfect printable PDF for the user to print.
    exportToPDF('worksheet-container', `DPSS_Printable_Test_${new Date().getTime()}`);
  };

  const handleCopyToDocs = () => {
    const container = document.getElementById('worksheet-container');
    if (!container) return;
    
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(container);
    selection?.removeAllRanges();
    selection?.addRange(range);
    
    try {
      document.execCommand('copy');
      alert("Successfully copied! Open Google Docs or Microsoft Word, and paste (Ctrl+V) the test.");
    } catch (e) {
      alert("Could not copy automatically. Please select text and copy manually.");
    }
    selection?.removeAllRanges();
  };

  const [previewZoom, setPreviewZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleExportWord = () => {
    if (!worksheetContent) return;
    
    // Create a cleaner filename from the topic
    const cleanTopic = (topic || 'Assessment').trim().replace(/[^a-z0-9]/gi, '_');
    const timestamp = new Date().toISOString().split('T')[0];
    
    setExportSettings(prev => ({
      ...prev,
      filename: `DPSS_${activeLanguage}_${activeLevel}_${cleanTopic}_${timestamp}`,
      title: `${activeModule} Assessment: ${topic || 'General'}`,
      showModal: true
    }));
  };

  const confirmExportWord = () => {
    const { filename, title, theme } = exportSettings;
    const logoHtml = brandSettings.logoData ? `<table style="width: 100%; border: none; margin-bottom: 2pt;"><tr><td style="border: none; text-align: center;"><img src="${brandSettings.logoData}" width="624" style="width: 6.5in;" /></td></tr></table>` : '';
    let activeFontFamily = (FONTS.find(f => f.name === brandSettings.activeFont) || FONTS[1]).family;
    const activeTheme = THEMES.find(t => t.id === activeThemeId) || THEMES[0];
    const themeColor = activeTheme.color;
    
    // Apply Options 1 to 6 overrides dynamically for export only without modifying the web view state
    let expFrameEnabled = isFrameEnabled;
    let expMcqStyle = mcqStyle;
    let expGlobalLayout = globalLayout;
    
    if (theme === 1) { // Standard
      // Do not reset expGlobalLayout, respect user's choice in Paper Design.
      // expGlobalLayout = 0; 
    } else if (theme === 2) { // Frame Bigger Size
      expFrameEnabled = true;
    } else if (theme === 3) { // Hand-drawn MCQ
      expMcqStyle = 12; // Hand-drawn circle mapping
    } else if (theme === 4) { // Handwriting Font
      activeFontFamily = "'Segoe Print', 'Bradley Hand ITC', 'Ink Free', cursive"; 
    } else if (theme === 5) { // Stylist Header
      expGlobalLayout = 0;
      expFrameEnabled = false;
    } else if (theme === 6) { // Stylist Frame and Stylist header
      expGlobalLayout = 1; // Example: Orange mix
      expFrameEnabled = true;
    }

    const exportColors = [
      '#059669', '#16a34a', '#22c55e', '#4ade80', '#86efac', 
      '#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa'
    ];
    const randomizedExportColor = exportColors[Math.floor(Math.random() * exportColors.length)];

    // Use the headerHtml argument correctly
    exportToWord(
      worksheetContent, 
      filename || `DPSS_Test_${activeLanguage}_${activeLevel}`,
      "", // Pass empty string to avoid double header since the LLM already generates the header
      '0.4in 0.6in 0.4in 0.6in',
      activeFontFamily,
      brandSettings.lineHeight || '1.15',
      undefined,
      expFrameEnabled,
      brandSettings.headerStyle !== undefined ? brandSettings.headerStyle : (theme === 5 || theme === 6 ? 5 : paperDesign),
      paperStyles,
      expMcqStyle,
      expGlobalLayout,
      baseLayout,
      instructionRulerStyle,
      instructionHeaderStyle,
      instructionStyle,
      isInstructionBackgroundEnabled,
      isColorExportEnabled,
      theme,
      isTopBottomLineEnabled,
      randomizedExportColor,
      // ── NEW PARAMS ──
      brandSettings,      
      paperDesign,        
      topic,
      tableDesignStyle,
      exportSettings.exportTableOrDivider,
      isStarLineEnabled,
      starLineStyle
    );
    
    setExportSettings(prev => ({ ...prev, showModal: false }));
  };

  const updateRule = async (id: string, updates: Partial<StrictRule>) => {
    const updatedRule = { ...strictRules.find(r => r.id === id), ...updates, isCustomized: true } as StrictRule;
    if (auth.currentUser) {
        try {
            await setDoc(doc(db, 'strictRules', id), { ...updatedRule, uid: auth.currentUser.uid });
        } catch (e) {
            handleFirestoreError(e, OperationType.UPDATE, `strictRules/${id}`);
        }
    } else {
        setStrictRules(prev => prev.map(r => r.id === id ? updatedRule : r));
    }
  };

  const updateProtocol = async (id: string, updates: Partial<StrictRule>) => {
    const updatedProtocol = { ...masterProtocols.find(p => p.id === id), ...updates, isCustomized: true } as StrictRule;
    if (auth.currentUser) {
        try {
            await setDoc(doc(db, 'masterProtocols', id), { ...updatedProtocol, uid: auth.currentUser.uid });
        } catch (e) {
            handleFirestoreError(e, OperationType.UPDATE, `masterProtocols/${id}`);
        }
    } else {
        setMasterProtocols(prev => prev.map(p => p.id === id ? updatedProtocol : p));
    }
  };

  const updateTemplate = async (id: string, updates: Partial<InstructionTemplate>) => {
    const updatedTemplate = { ...instructionTemplates.find(t => t.id === id), ...updates, isCustomized: true } as InstructionTemplate;
    if (auth.currentUser) {
        try {
            await setDoc(doc(db, 'instructionTemplates', id), { ...updatedTemplate, uid: auth.currentUser.uid });
        } catch (e) {
            handleFirestoreError(e, OperationType.UPDATE, `instructionTemplates/${id}`);
        }
    } else {
        setInstructionTemplates(prev => prev.map(t => t.id === id ? updatedTemplate : t));
    }
  };

  const deleteTemplate = async (id: string) => {
    if (!confirm("Delete this template?")) return;
    if (auth.currentUser) {
        try {
            await deleteDoc(doc(db, 'instructionTemplates', id));
        } catch (e) {
            handleFirestoreError(e, OperationType.DELETE, `instructionTemplates/${id}`);
        }
    } else {
        setInstructionTemplates(prev => prev.filter(t => t.id !== id));
    }
  };

  const deleteRule = async (id: string) => {
    if (!confirm("Delete this rule?")) return;
    if (auth.currentUser) {
        try {
            await deleteDoc(doc(db, 'strictRules', id));
        } catch (e) {
            handleFirestoreError(e, OperationType.DELETE, `strictRules/${id}`);
        }
    } else {
        setStrictRules(prev => prev.filter(r => r.id !== id));
    }
  };

  const deleteProtocol = async (id: string) => {
    if (!confirm("Delete this protocol?")) return;
    if (auth.currentUser) {
        try {
            await deleteDoc(doc(db, 'masterProtocols', id));
        } catch (e) {
            handleFirestoreError(e, OperationType.DELETE, `masterProtocols/${id}`);
        }
    } else {
        setMasterProtocols(prev => prev.filter(p => p.id !== id));
    }
  };
  
  const handleModuleChange = (m: string) => {
    setActiveModule(m);
    if (['Grammar', 'Reading', 'Vocabulary'].includes(m)) {
      setArchitectTab(m as any);
      
      // Set professional defaults based on module selection
      if (m === 'Reading') {
        setSelectedInstructionIds(['r_critical_thinking', 'r_inferential', 'r_mcq', 'r_tf_stmt', 'r_summary_cloze']);
      } else if (m === 'Vocabulary') {
        setSelectedInstructionIds(['v_study_table_v2', 'v_sentence_study', 'v_mcq_standard', 'v_matching_pro', 'v_box', 'v_speaking_std', 'v_copy_no_answers', 'v_synonyms_exercises']);
        setItemCountOverrides(prev => ({
          ...prev,
          'v_study_table_v2': 15,
          'v_sentence_study': 15,
          'v_mcq_standard': 15,
          'v_matching_pro': 15,
          'v_box': 15,
          'v_speaking_std': 10,
          'v_copy_no_answers': 10,
          'v_synonyms_exercises': 10
        }));
      } else if (m === 'Grammar') {
        setSelectedInstructionIds(['g_circle', 'g_correct_incorrect', 'g_complete_sentences', 'g_complete_story', 'mcq_standard', 'g_pair']);
        setColumnOverrides(prev => ({
          ...prev,
          'g_circle': 2,
          'g_correct_incorrect': 2,
          'g_complete_sentences': 1,
          'g_complete_story': 1,
          'mcq_standard': 1,
          'g_pair': 1
        }));
        setItemCountOverrides(prev => ({
          ...prev,
          'g_circle': 20,
          'g_correct_incorrect': 20,
          'g_complete_sentences': 10,
          'g_complete_story': 10,
          'mcq_standard': 10,
          'g_pair': 10
        }));
      } else {
        setSelectedInstructionIds([]);
      }
    }
  };

  const syncWithDefaults = () => {
    try {
      setMasterProtocols(prev => {
        const updated = prev.map(p => {
          if (p.isCustomized) return p;
          const defaultProtocol = DEFAULT_MASTER_PROTOCOLS.find(dp => dp.id === p.id);
          return defaultProtocol ? { ...p, ...defaultProtocol } : p;
        });
        const existingIds = new Set(prev.map(p => p.id));
        const newItems = DEFAULT_MASTER_PROTOCOLS.filter(p => !existingIds.has(p.id));
        return [...updated, ...newItems];
      });
      setStrictRules(prev => {
        const updated = prev.map(r => {
          if (r.isCustomized) return r;
          const defaultRule = DEFAULT_STRICT_RULES.find(dr => dr.id === r.id);
          return defaultRule ? { ...r, ...defaultRule } : r;
        });
        const existingIds = new Set(prev.map(r => r.id));
        const newItems = DEFAULT_STRICT_RULES.filter(r => !existingIds.has(r.id));
        return [...updated, ...newItems];
      });
      setInstructionTemplates(prev => {
        const updated = prev.map(t => {
          if (t.isCustomized) return t;
          const defaultTemp = INITIAL_TEMPLATES.find(dt => dt.id === t.id);
          return defaultTemp ? { ...t, ...defaultTemp } : t;
        });
        const existingIds = new Set(prev.map(t => t.id));
        const newItems = INITIAL_TEMPLATES.filter(t => !existingIds.has(t.id));
        return [...updated, ...newItems];
      });
      alert("Neural protocols and templates synchronized with latest definitions. Custom edits were preserved.");
    } catch (error) {
      console.error("Sync failed:", error);
      alert("Neural Circuit Interrupted during sync. Please try again.");
    }
  };

  const hardReset = () => {
    if (confirm("WARNING: This will delete all custom rules, protocols, and templates. Are you sure?")) {
      localStorage.removeItem(MASTER_PROTOCOLS_KEY);
      localStorage.removeItem(STRICT_RULES_KEY);
      localStorage.removeItem(TEMPLATES_KEY);
      window.location.reload();
    }
  };

  const addRule = async () => {
    const id = `rule-${Date.now()}`;
    const newRule: StrictRule = { id, label: 'NEW LOGIC NODE', description: '', promptInjection: '', active: true, priority: 'Medium', category: activeLogicCategory };
    if (auth.currentUser) {
        try {
            await setDoc(doc(db, 'strictRules', id), { ...newRule, uid: auth.currentUser.uid });
            setExpandedRuleId(id);
        } catch (e) {
            handleFirestoreError(e, OperationType.CREATE, `strictRules/${id}`);
        }
    } else {
        setStrictRules([...strictRules, newRule]); setExpandedRuleId(id);
    }
  };

  const addProtocol = async () => {
    const id = `mp-${Date.now()}`;
    const newProtocol: StrictRule = { id, label: 'NEW PROTOCOL', description: '', promptInjection: '', active: true, priority: 'Medium', category: activeProtocolCategory };
    if (auth.currentUser) {
        try {
            await setDoc(doc(db, 'masterProtocols', id), { ...newProtocol, uid: auth.currentUser.uid });
            setExpandedProtocolId(id);
        } catch (e) {
            handleFirestoreError(e, OperationType.CREATE, `masterProtocols/${id}`);
        }
    } else {
        setMasterProtocols([...masterProtocols, newProtocol]); setExpandedProtocolId(id);
    }
  };

  const addTemplate = async () => {
    const id = `temp-${Date.now()}`;
    const newTemplate: InstructionTemplate = { id, label: `NEW PART`, prompt: `Detail logic for {{TOPIC}}...`, category: activeTemplateCategory as any, columnCount: 0 };
    if (auth.currentUser) {
        try {
            await setDoc(doc(db, 'instructionTemplates', id), { ...newTemplate, uid: auth.currentUser.uid });
            setExpandedTemplateId(id);
        } catch (e) {
            handleFirestoreError(e, OperationType.CREATE, `instructionTemplates/${id}`);
        }
    } else {
        setInstructionTemplates(prev => [...prev, newTemplate]);
        setExpandedTemplateId(id);
    }
  };

  const uniqueGroupedTemplates = React.useMemo(() => {
    const seenTypes = new Set();
    const result: any[] = [];
    instructionTemplates
      .filter(t => t.category?.toUpperCase() === activeModule.toUpperCase())
      .sort((a, b) => {
        const aType = a.typeId || a.id;
        const bType = b.typeId || b.id;
        
        // Ensure same types stay together before sorting by default
        if (aType !== bType) return String(aType).localeCompare(String(bType));

        // Within same type, prioritize the DEFAULT one currently set in paperStyles
        const defaultA = paperStyles[a.typeId as keyof typeof paperStyles] === a.id;
        const defaultB = paperStyles[b.typeId as keyof typeof paperStyles] === b.id;
        
        if (defaultA && !defaultB) return -1;
        if (!defaultA && defaultB) return 1;
        
        return a.label.localeCompare(b.label);
      })
      .forEach(t => {
        if (!t.typeId) {
          result.push({ ...t, isGroupedType: false });
        } else {
          const typeKey = `${t.category}_${t.typeId}`;
          if (!seenTypes.has(typeKey)) {
            seenTypes.add(typeKey);
            // The first one in each group is now guaranteed to be the DEFAULT if it exists
            const defaultId = paperStyles[t.typeId as keyof typeof paperStyles];
            const activeTemplate = instructionTemplates.find(it => it.id === defaultId) || t;
            
            result.push({ 
              ...t, 
              isGroupedType: true, 
              displayLabel: t.typeId === 'tf' ? 'True/False & C/I' : (activeTemplate.label || t.label),
              styleName: activeTemplate.styleName || activeTemplate.label,
              originalId: activeTemplate.id 
            });
          }
        }
      });
    return result;
  }, [instructionTemplates, activeModule, paperStyles]);

  const handleDuplicateDesign = (design: any, targetCategory?: string) => {
    const newId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const category = targetCategory || design.category || activeModule;
    
    const newDesign = {
      ...design,
      id: newId,
      name: `${design.name || design.styleName} (Copy)`,
      category: category,
      timestamp: Date.now(),
      uid: auth.currentUser?.uid || 'anonymous'
    };

    if (design.styleName) {
      // It's an InstructionTemplate
      setInstructionTemplates(prev => [...prev, { ...newDesign, label: newDesign.name, isCustomized: true }]);
    } else {
      // It's a CustomDesign
      setCustomDesigns(prev => [...prev, newDesign]);
      if (auth.currentUser) {
        setDoc(doc(db, 'customDesigns', newId), newDesign).catch(e => handleFirestoreError(e, OperationType.WRITE, `customDesigns/${newId}`));
      }
    }
    alert(`Style duplicated to ${category}!`);
  };


  const handleGroupedTemplateToggle = (item: any) => {
    if (!item.isGroupedType) {
      toggleInstruction(item.id);
      return;
    }
    
    const activeId = selectedInstructionIds.find(id => {
      const t = instructionTemplates.find(x => x.id === id);
      return t?.typeId === item.typeId && t?.category === item.category;
    });

    if (activeId) {
      toggleInstruction(activeId);
    } else {
      const defaultId = paperStyles[item.typeId as keyof typeof paperStyles];
      const templateExists = instructionTemplates.some(t => t.id === defaultId);
      toggleInstruction(templateExists ? (defaultId as string) : item.originalId);
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen overflow-hidden text-slate-900 relative transition-all duration-500 bg-slate-50">
        {firebaseError && (
          <div className="fixed top-0 left-0 right-0 z-[1000] bg-rose-600 text-white px-4 py-2 text-center text-xs font-bold animate-in slide-in-from-top duration-500">
            <i className="fa-solid fa-circle-exclamation mr-2"></i>
            {firebaseError}
            <button onClick={() => setFirebaseError(null)} className="ml-4 underline">Dismiss</button>
          </div>
        )}
        {showOnboarding && <OnboardingTutorial onComplete={handleOnboardingComplete} />}
      {viewMode === 'generator' && (
        <>
          <Sidebar 
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            curriculum={INITIAL_MODULES}
            activeModule={activeModule}
            onModuleChange={handleModuleChange}
            activeLevel={activeLevel}
            onLevelChange={setActiveLevel}
            topic={topic}
            onTopicChange={setTopic}
            onClearCanvas={() => { setWorksheetContent(''); setTopic(''); setSelectedInstructionIds([]); }}
            onToggleSettings={(tab) => { if(tab) setSettingsTab(tab as SettingsTab); setShowSettings(true); }}
            history={history}
            onLoadHistory={(item) => { setWorksheetContent(item.content); setViewMode('preview'); }}
            onDeleteHistory={async (id) => {
              try {
                const newHistory = history.filter(h => h.id !== id);
                setHistory(newHistory);
                localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
                if (session?.email) {
                  const docRef = doc(db, 'user_history', session.email);
                  await setDoc(docRef, { history: newHistory });
                }
              } catch (e) { console.error(e); }
            }}
            onRenameHistory={async (id, newTitle) => {
              try {
                const newHistory = history.map(h => h.id === id ? { ...h, title: newTitle } : h);
                setHistory(newHistory);
                localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
                if (session?.email) {
                  const docRef = doc(db, 'user_history', session.email);
                  await setDoc(docRef, { history: newHistory });
                }
              } catch (e) { console.error(e); }
            }}
            brandSettings={brandSettings}
            templates={instructionTemplates.filter(t => t.category?.toUpperCase() === activeModule.toUpperCase())}
            activeTemplate={null}
            onTemplateSelect={(t) => toggleInstruction(t.id)}
            isSingleReadingText={isSingleReadingText}
            onSingleReadingTextChange={setIsSingleReadingText}
            isRelaxingBackgroundEnabled={isColorfulBackgroundEnabled}
            onRelaxingBackgroundChange={setIsColorfulBackgroundEnabled}
            isPartBackgroundEnabled={isPartBackgroundEnabled}
            onPartBackgroundChange={setIsPartBackgroundEnabled}
            isInstructionBackgroundEnabled={isInstructionBackgroundEnabled}
            onInstructionBackgroundChange={setIsInstructionBackgroundEnabled}
            onRandomizeBackground={randomizeBackground}
            paperDesign={paperDesign}
            onPaperDesignChange={setPaperDesign}
            onDesignPaperClick={() => setViewMode('design_test_style')}
            onPaperStyleClick={() => setViewMode('paper_style_design')}
            mcqLayout={mcqLayout}
            onMCQLayoutChange={setMcqLayout}
            onInstructionDesignClick={() => setViewMode('instruction_design')}
            onInstructionStylesClick={() => setViewMode('instruction_styles')}
            onHeaderFooterDesignClick={() => setViewMode('header_footer_design')}
            onFormatDesignClick={() => { setSettingsTab('FORMAT_DESIGN'); setShowSettings(true); }}
            onSubjectsClick={() => setShowSubjectModal(true)}
            exportTableOrDivider={exportSettings.exportTableOrDivider}
            onExportTableOrDividerChange={(val) => setExportSettings(prev => ({ ...prev, exportTableOrDivider: val }))}
            instructionCase={instructionCase}
            onInstructionCaseChange={setInstructionCase}
            width={sidebarWidth}
            onWidthChange={setSidebarWidth}
            side={sidebarSide}
            onSideChange={setSidebarSide}
            user={auth.currentUser}
            onLogin={handleGoogleLogin}
            onLogout={handleLogout}
          />

          <main 
            style={{ 
              marginLeft: isSidebarOpen && sidebarSide === 'left' ? (windowWidth >= 1024 ? `${sidebarWidth}px` : '0px') : '0px',
              marginRight: isSidebarOpen && sidebarSide === 'right' ? (windowWidth >= 1024 ? `${sidebarWidth}px` : '0px') : '0px'
            }}
            className="flex-1 flex flex-col overflow-y-auto transition-all duration-500 relative"
          >
            {isRelaxingBackgroundEnabled && (
               <div 
                 className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000"
                 style={{ backgroundImage: `url('${userCustomBackground || currentBackground}')` }}
               >
                 <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>
               </div>
            )}
            {/* Mobile Overlay */}
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-slate-900/20 z-[100] lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}
            {/* Top Navigation Bar */}
            <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between shrink-0 relative z-10 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-4 lg:gap-6 min-w-max">
                {!isSidebarOpen && (
                  <button onClick={() => setIsSidebarOpen(true)} className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-slate-700 hover:text-orange-600 transition-all border border-white/30">
                    <i className="fa-solid fa-bars"></i>
                  </button>
                )}
                
                <div className="flex items-center gap-4">
                  {/* Removed + Add New Exercise Type button per user request */}

                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="px-6 lg:px-8 py-3 bg-orange-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-orange-700 transition-all shadow-lg shadow-orange-200/50 active:scale-95 disabled:opacity-50 whitespace-nowrap"
                  >
                    {isGenerating ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                    Build Test
                  </button>

                  <div className="flex bg-white/20 backdrop-blur-md p-1 rounded-xl gap-1 border border-white/30 min-w-max relative z-[50]">
                    <button 
                      onClick={() => {
                        const next = (baseLayout + 1) % 9;
                        setBaseLayout(next);
                        if (next === 4) setMcqLayout('quad');
                      }}
                      className={`px-4 lg:px-6 py-2 rounded-lg text-[11px] font-bold flex items-center gap-2 transition-all whitespace-nowrap ${baseLayout > 0 ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 hover:bg-white/40'}`}
                    >
                      <i className={`fa-solid ${baseLayout === 4 ? 'fa-columns' : baseLayout === 3 ? 'fa-arrows-left-right' : baseLayout === 2 ? 'fa-table-columns' : baseLayout === 1 ? 'fa-grip-lines' : 'fa-list'} text-[10px]`}></i> 
                      {baseLayout === 0 ? 'Divider 1' : baseLayout === 1 ? 'Divider 2' : baseLayout === 2 ? 'Divider 3' : baseLayout === 3 ? 'Divider 4' : baseLayout === 4 ? 'Divider 5' : `Divider ${baseLayout + 1}`}
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const next = (instructionRulerStyle + 1) % 7;
                        setInstructionRulerStyle(next);
                      }}
                      className={`px-4 lg:px-6 py-2 rounded-lg text-[11px] font-bold flex items-center gap-2 transition-all whitespace-nowrap ${instructionRulerStyle > 0 ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-700 hover:bg-white/40'}`}
                    >
                      <i className="fa-solid fa-ruler-horizontal text-[10px]"></i> 
                      {instructionRulerStyle === 0 ? 'No Divider' : 
                       instructionRulerStyle === 1 ? 'Divider: S1' :
                       instructionRulerStyle === 2 ? 'Divider: S2' :
                       instructionRulerStyle === 3 ? 'Divider: S3' :
                       instructionRulerStyle === 4 ? 'Ruler S1' :
                       instructionRulerStyle === 5 ? 'Divider: S5' :
                       instructionRulerStyle === 6 ? 'Divider: S6' :
                       instructionRulerStyle === 7 ? 'Divider: S7' :
                       instructionRulerStyle === 8 ? 'Divider: S8' :
                       'Divider: S9'}
                    </button>
                    <button 
                      onClick={() => setShowSettings(true)}
                      className="px-4 lg:px-6 py-2 text-slate-700 hover:bg-white/40 rounded-lg text-[11px] font-bold flex items-center gap-2 transition-all whitespace-nowrap"
                    >
                      <i className="fa-solid fa-eye text-[10px]"></i> Workspace
                    </button>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 lg:px-6 py-2 text-slate-700 hover:bg-white/40 rounded-lg text-[11px] font-bold flex items-center gap-2 transition-all whitespace-nowrap"
                    >
                      <i className="fa-solid fa-file-import text-[10px]"></i> Source
                    </button>
                    <button 
                      onClick={() => setIsFrameEnabled(!isFrameEnabled)}
                      className={`px-4 lg:px-6 py-2 rounded-lg text-[11px] font-bold flex items-center gap-2 transition-all whitespace-nowrap ${isFrameEnabled ? 'bg-orange-600 text-white shadow-md' : 'text-slate-700 hover:bg-white/40'}`}
                    >
                      <i className={`fa-solid ${isFrameEnabled ? 'fa-square-check' : 'fa-square'} text-[10px]`}></i> Frame
                    </button>
                    <button 
                      onClick={toggleTopBottomBoth}
                      className={`px-4 lg:px-6 py-2 rounded-lg text-[11px] font-bold flex items-center gap-2 transition-all whitespace-nowrap ${isTopBottomBothEnabled ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 hover:bg-white/40'}`}
                    >
                      <i className={`fa-solid ${isTopBottomBothEnabled ? 'fa-square-check' : 'fa-arrows-left-right'} text-[10px]`}></i> Both T-B Line
                    </button>
                    <button 
                      onClick={toggleStarBoth}
                      className={`px-4 lg:px-6 py-2 rounded-lg text-[11px] font-bold flex items-center gap-2 transition-all whitespace-nowrap ${isStarBothEnabled ? 'bg-amber-500 text-white shadow-md' : 'text-slate-700 hover:bg-white/40'}`}
                    >
                      <i className={`fa-solid ${isStarBothEnabled ? 'fa-star' : 'fa-star-half-stroke'} text-[10px]`}></i> Both Star Line
                    </button>
                    <button 
                      onClick={toggleTopBottomLine}
                      className={`px-4 lg:px-6 py-2 rounded-lg text-[11px] font-bold flex items-center gap-2 transition-all whitespace-nowrap ${isTopBottomLineEnabled ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 hover:bg-white/40'}`}
                    >
                      <i className={`fa-solid ${isTopBottomLineEnabled ? 'fa-square-check' : 'fa-square'} text-[10px]`}></i> Top-bottom Line
                    </button>
                    <button 
                      onClick={toggleStarLine}
                      className={`px-4 lg:px-6 py-2 rounded-lg text-[11px] font-bold flex items-center gap-2 transition-all whitespace-nowrap ${isStarLineEnabled ? 'bg-amber-500 text-white shadow-md' : 'text-slate-700 hover:bg-white/40'}`}
                    >
                      <i className={`fa-solid ${isStarLineEnabled ? 'fa-square-check' : 'fa-star'} text-[10px]`}></i> Star Line
                    </button>
                    <button 
                      onClick={() => setIsHandDrawnBorderEnabled(!isHandDrawnBorderEnabled)}
                      className={`px-4 lg:px-6 py-2 rounded-lg text-[11px] font-bold flex items-center gap-2 transition-all whitespace-nowrap ${isHandDrawnBorderEnabled ? 'bg-amber-600 text-white shadow-md' : 'text-slate-700 hover:bg-white/40'}`}
                    >
                      <i className={`fa-solid ${isHandDrawnBorderEnabled ? 'fa-square-check' : 'fa-pencil'} text-[10px]`}></i> Hand-Drawn
                    </button>
                    <button 
                      onClick={() => setEnablePages(!enablePages)}
                      className={`px-4 lg:px-6 py-2 rounded-lg text-[11px] font-bold flex items-center gap-2 transition-all whitespace-nowrap ${enablePages ? 'bg-purple-600 text-white shadow-md' : 'text-slate-700 hover:bg-white/40'}`}
                    >
                      <i className={`fa-solid ${enablePages ? 'fa-square-check' : 'fa-square'} text-[10px]`}></i> Pages
                    </button>
                    <button 
                      onClick={() => setIsPartBackgroundEnabled(!isPartBackgroundEnabled)}
                      className={`px-4 lg:px-6 py-2 rounded-lg text-[11px] font-bold flex items-center gap-2 transition-all whitespace-nowrap ${isPartBackgroundEnabled ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:bg-white/40'}`}
                    >
                      <i className={`fa-solid ${isPartBackgroundEnabled ? 'fa-square-check' : 'fa-square'} text-[10px]`}></i> Part BG
                    </button>
                    <button 
                      onClick={() => setIsInstructionBackgroundEnabled(!isInstructionBackgroundEnabled)}
                      className={`px-4 lg:px-6 py-2 rounded-lg text-[11px] font-bold flex items-center gap-2 transition-all whitespace-nowrap ${isInstructionBackgroundEnabled ? 'bg-amber-600 text-white shadow-md' : 'text-slate-700 hover:bg-white/40'}`}
                    >
                      <i className={`fa-solid ${isInstructionBackgroundEnabled ? 'fa-square-check' : 'fa-square'} text-[10px]`}></i> Instruction BG
                    </button>
                    <button 
                      onClick={() => setIsColorfulBackgroundEnabled(!isColorfulBackgroundEnabled)}
                      className={`px-4 lg:px-6 py-2 rounded-lg text-[11px] font-bold flex items-center gap-2 transition-all whitespace-nowrap ${isColorfulBackgroundEnabled ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-700 hover:bg-white/40'}`}
                    >
                      <i className={`fa-solid ${isColorfulBackgroundEnabled ? 'fa-square-check' : 'fa-square'} text-[10px]`}></i> Color BG
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 px-4">
                <button className="h-10 w-10 text-slate-700 hover:text-orange-600 transition-colors bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shrink-0">
                  <i className="fa-solid fa-palette text-lg"></i>
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8 no-scrollbar relative z-10">
              <div className="max-w-6xl mx-auto space-y-8">
                {/* Split Layout: Templates Left | Global Config Center | Templates Right */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                  {/* Templates Left (First Half) */}
                  <div className="lg:col-span-1 space-y-4">
                    <div className="flex items-center justify-between px-2 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-4 bg-orange-500 rounded-full"></div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Exercise Templates</h3>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {uniqueGroupedTemplates
                        .map((t, idx, arr) => {
                          const midpoint = Math.ceil(arr.length / 2);
                          if (idx >= midpoint) return null;
                          const isSelected = t.isGroupedType 
                            ? selectedInstructionIds.some(id => {
                                const tmp = instructionTemplates.find(x => x.id === id);
                                return tmp?.typeId === t.typeId && tmp?.category === t.category;
                              })
                            : selectedInstructionIds.includes(t.originalId || t.id);
                          const cat = t.category?.toUpperCase();
                          const colorClass = cat === 'VOCABULARY' ? 'emerald' : cat === 'READING' ? 'blue' : 'orange';
                          const displayLabel = t.isGroupedType ? t.displayLabel : t.label;
                          
                          return (
                            <div
                              key={t.id}
                              className={`group bg-white border rounded-2xl p-4 flex items-center justify-between hover:border-${colorClass}-200 hover:shadow-md transition-all cursor-pointer ${isSelected ? `border-${colorClass}-500 bg-${colorClass}-5/30` : 'border-slate-100'}`}
                              onClick={() => handleGroupedTemplateToggle(t)}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`h-9 w-9 rounded-xl flex items-center justify-center transition-colors ${isSelected ? `bg-${colorClass}-600 text-white` : `bg-slate-50 text-slate-400 group-hover:bg-${colorClass}-50 group-hover:text-${colorClass}-500`}`}>
                                  <i className="fa-solid fa-book text-sm"></i>
                                </div>
                                <div className="flex flex-col">
                                  <span className={`text-[10px] font-bold uppercase tracking-tight ${isSelected ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>{displayLabel}</span>
                                  {!t.isGroupedType && t.styleName && <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">{t.styleName}</span>}
                                </div>
                              </div>
                              <div className={`h-6 w-6 rounded-lg border flex items-center justify-center transition-all ${isSelected ? `bg-${colorClass}-600 border-${colorClass}-600 text-white` : `border-slate-100 text-slate-300 group-hover:border-${colorClass}-500 group-hover:text-${colorClass}-500`}`}>
                                <i className={`fa-solid ${isSelected ? 'fa-check' : 'fa-plus'} text-[10px]`}></i>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Center Config */}
                  <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[32px] p-6 lg:p-10 border border-slate-100 shadow-sm space-y-8">
                      {sourceMaterial && (
                        <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 w-fit">
                          <i className="fa-solid fa-file-circle-check text-emerald-500"></i>
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{sourceMaterial.name} attached</span>
                          <button onClick={() => setSourceMaterial(null)} className="text-emerald-400 hover:text-emerald-600 ml-2">
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Language</label>
                          <select 
                            value={activeLanguage}
                            onChange={(e) => setActiveLanguage(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-700 font-bold text-sm outline-none focus:border-orange-200 transition-all appearance-none cursor-pointer"
                          >
                            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                        </div>

                        <div className="space-y-3">
                          <button 
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="w-full py-3 bg-orange-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-orange-700 transition-all shadow-lg shadow-orange-200/50 active:scale-95 disabled:opacity-50"
                          >
                            {isGenerating ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                            Build Test
                          </button>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Academic Level</label>
                          <select 
                            value={activeLevel}
                            onChange={(e) => setActiveLevel(e.target.value as AcademicLevel)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-700 font-bold text-sm outline-none focus:border-orange-200 transition-all appearance-none cursor-pointer"
                          >
                            {ACADEMIC_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Universal Topic</label>
                          <input 
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder=""
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-700 font-bold text-sm outline-none focus:border-orange-200 transition-all placeholder:text-slate-300"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Test Structure Section (Moved here for better flow) */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between px-2">
                        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Selected Exercises ({selectedInstructionIds.length})</h3>
                        {selectedInstructionIds.length > 0 && (
                          <button 
                            onClick={() => setSelectedInstructionIds([])}
                            className="text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors"
                          >
                            Clear All
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {instructionTemplates
                          .filter(t => t.category?.toUpperCase() === activeModule.toUpperCase() && selectedInstructionIds.includes(t.id))
                          .sort((a, b) => {
                            // Sort by typeId then id
                            const aType = a.typeId || 'zzz';
                            const bType = b.typeId || 'zzz';
                            if (aType !== bType) return aType.localeCompare(bType);
                            return a.id.localeCompare(b.id);
                          })
                          .map((t, idx) => {
                            const curItems = itemCountOverrides[t.id] || 10;
                            const curCols = columnOverrides[t.id] !== undefined ? columnOverrides[t.id] : (t.columnCount !== undefined ? t.columnCount : defaultColumnCount);
                            
                            // Diverse color mapping based on index
                            const colors = ['orange', 'blue', 'emerald', 'rose', 'violet', 'amber', 'indigo', 'cyan'];
                            const colorClass = colors[idx % colors.length];
                            
                            // Random divider color logic (visual only for the card)
                            const dividerColors = ['#f97316', '#3b82f6', '#10b981', '#f43f5e', '#8b5cf6', '#f59e0b', '#6366f1', '#06b6d4'];
                            const randomDividerColor = dividerColors[Math.floor(Math.random() * dividerColors.length)];
                            
                            // Relaxing backgrounds
                            const backgrounds = [
                              'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=400&h=200', // Forest
                              'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400&h=200', // Mountain
                              'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=400&h=200', // Ocean
                              'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=400&h=200', // Lake
                              'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=400&h=200', // Meadow
                            ];
                            const bgUrl = backgrounds[idx % backgrounds.length];

                            return (
                              <div key={t.id} className={`card-gradient-${colorClass} rounded-2xl p-3 border border-${colorClass}-100 compact-shadow group hover:shadow-md transition-all relative overflow-hidden`}>
                                {/* Relaxing Background Overlay */}
                                <div 
                                  className="absolute inset-0 opacity-[0.08] pointer-events-none bg-cover bg-center mix-blend-multiply"
                                  style={{ backgroundImage: `url(${bgUrl})` }}
                                />
                                
                                <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                  <button onClick={() => toggleInstruction(t.id)} className="h-6 w-6 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                    <i className="fa-solid fa-trash-can text-[9px]"></i>
                                  </button>
                                </div>
                                
                                <div className="flex items-center gap-2 mb-2 relative z-10">
                                  <div className={`h-7 w-7 bg-white text-${colorClass}-600 rounded-lg flex items-center justify-center shadow-sm border border-${colorClass}-100 flex-shrink-0`} style={{ borderLeftColor: randomDividerColor, borderLeftWidth: '3px' }}>
                                    <i className="fa-solid fa-star text-[10px]"></i>
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight leading-tight truncate">
                                      {t.typeId === 'mcq' ? 'MCQ (Multiple Choice)' : 
                                       t.typeId === 'matching' ? 'Matching' :
                                       t.typeId === 'tf' ? 'True/False' :
                                       t.typeId === 'circle' ? 'Circle / Check' :
                                       t.typeId === 'completion' ? 'Sentence Completion' :
                                       t.typeId === 'word_box' ? 'Word Box' :
                                       t.typeId === 'cloze' ? 'Cloze Passage' :
                                       t.typeId === 'speaking' ? 'Speaking' :
                                       t.typeId === 'key_term' ? 'Matching' :
                                       t.typeId === 'table' ? 'Tables & Grids' :
                                       t.label}
                                    </span>
                                    {t.styleName && <span className={`text-[8px] font-bold text-${colorClass}-500 uppercase tracking-widest`}>{t.styleName}</span>}
                                  </div>
                                </div>
                                
                                <div className="flex flex-col gap-2 relative z-10">
                                  <div className="space-y-1">
                                    <div className="flex justify-between items-center px-1">
                                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Item</span>
                                      <span className={`text-[9px] font-black text-${colorClass}-600`}>{curItems}</span>
                                    </div>
                                    <div className="flex bg-white/60 backdrop-blur-sm rounded-lg p-0.5 gap-0.5 border border-slate-100 shadow-inner">
                                      {[5, 10, 15, 20, 25, 30].map(num => (
                                        <button 
                                          key={num} 
                                          onClick={() => setItemCount(t.id, num)} 
                                          className={`flex-1 h-5 rounded-md text-[8px] font-bold transition-all ${curItems === num ? `bg-white text-${colorClass}-600 shadow-sm border border-${colorClass}-50` : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                          {num}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex justify-between items-center px-1">
                                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Column</span>
                                      <span className="text-[9px] font-black text-slate-600">{curCols || 'L'}</span>
                                    </div>
                                    <div className="flex bg-white/60 backdrop-blur-sm rounded-lg p-0.5 gap-0.5 border border-slate-100 shadow-inner">
                                      {[0, 1, 2, 3, 4, 6].map(num => (
                                        <button 
                                          key={num} 
                                          onClick={() => setColumnOverrides(prev => ({ ...prev, [t.id]: num }))} 
                                          className={`flex-1 h-5 rounded-md text-[8px] font-bold transition-all ${curCols === num ? `bg-white text-${colorClass}-600 shadow-sm border border-${colorClass}-50` : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                          {num === 0 ? 'L' : num}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                        {selectedInstructionIds.length === 0 && (
                          <div className="md:col-span-2 h-40 border-2 border-dashed border-slate-200 rounded-[32px] bg-slate-50/50 flex flex-col items-center justify-center text-center p-6">
                            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-slate-200 mb-3 shadow-sm">
                              <i className="fa-solid fa-plus text-lg"></i>
                            </div>
                            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">No Exercises Selected</h4>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Templates Right (Second Half) */}
                  <div className="lg:col-span-1 space-y-4">
                    <div className="flex items-center justify-between px-2 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-4 bg-orange-500 rounded-full opacity-0"></div>
                        <h3 className="text-[10px] font-black text-transparent select-none uppercase tracking-widest">More Templates</h3>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {uniqueGroupedTemplates
                        .map((t, idx, arr) => {
                          const midpoint = Math.ceil(arr.length / 2);
                          if (idx < midpoint) return null;
                          const isSelected = t.isGroupedType 
                            ? selectedInstructionIds.some(id => {
                                const tmp = instructionTemplates.find(x => x.id === id);
                                return tmp?.typeId === t.typeId && tmp?.category === t.category;
                              })
                            : selectedInstructionIds.includes(t.originalId || t.id);
                          const cat = t.category?.toUpperCase();
                          const colorClass = cat === 'VOCABULARY' ? 'emerald' : cat === 'READING' ? 'blue' : 'orange';
                          const displayLabel = t.isGroupedType ? t.displayLabel : t.label;
                          
                          return (
                            <div
                              key={t.id}
                              className={`group bg-white border rounded-2xl p-4 flex items-center justify-between hover:border-${colorClass}-200 hover:shadow-md transition-all cursor-pointer ${isSelected ? `border-${colorClass}-500 bg-${colorClass}-5/30` : 'border-slate-100'}`}
                              onClick={() => handleGroupedTemplateToggle(t)}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`h-9 w-9 rounded-xl flex items-center justify-center transition-colors ${isSelected ? `bg-${colorClass}-600 text-white` : `bg-slate-50 text-slate-400 group-hover:bg-${colorClass}-50 group-hover:text-${colorClass}-500`}`}>
                                  <i className="fa-solid fa-book text-sm"></i>
                                </div>
                                <div className="flex flex-col">
                                  <span className={`text-[10px] font-bold uppercase tracking-tight ${isSelected ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>{displayLabel}</span>
                                  {!t.isGroupedType && t.styleName && <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">{t.styleName}</span>}
                                </div>
                              </div>
                              <div className={`h-6 w-6 rounded-lg border flex items-center justify-center transition-all ${isSelected ? `bg-${colorClass}-600 border-${colorClass}-600 text-white` : `border-slate-100 text-slate-300 group-hover:border-${colorClass}-500 group-hover:text-${colorClass}-500`}`}>
                                <i className={`fa-solid ${isSelected ? 'fa-check' : 'fa-plus'} text-[10px]`}></i>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>

                {/* Main Content Grid (Now just Live Output) */}
                <div className="grid grid-cols-1 gap-8">
                  {/* Live Output Section */}
                  <div className="space-y-6">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2">Live Output</h3>
                    <div className="h-[400px] bg-white rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center p-10 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none"></div>
                      <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-100 mb-8">
                        <i className="fa-solid fa-sparkles text-4xl"></i>
                      </div>
                      <h4 className="text-base font-bold text-slate-800 mb-3">Ready to Build</h4>
                      <p className="text-xs text-slate-400 max-w-[240px] leading-relaxed">Configure your test and click "Build Test" to generate your assessment.</p>
                      
                      {isGenerating && (
                        <div className="fixed bottom-8 right-8 bg-white border border-slate-200 rounded-[32px] p-6 shadow-2xl z-[9999] animate-in slide-in-from-bottom-10 duration-500 max-w-sm w-full border-b-4 border-b-orange-500">
                          <div className="flex items-center gap-6">
                            <div className="relative flex-shrink-0">
                              <div className="h-16 w-16 border-[4px] border-slate-100 border-t-orange-600 rounded-full animate-spin"></div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <i className="fa-solid fa-brain-circuit text-xl text-orange-600 animate-pulse"></i>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                  <i className="fa-solid fa-microchip text-orange-600"></i>
                                  Neural Synthesis
                                </h3>
                                <div className="flex items-center gap-1.5">
                                  <div className="h-1.5 w-1.5 bg-orange-600 rounded-full animate-ping"></div>
                                  <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">{generationStep || 'Processing...'}</span>
                                </div>
                              </div>
                              <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
                                Crafting your professional assessment with deep semantic analysis...
                              </p>
                              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden shadow-inner">
                                <div className="h-full bg-gradient-to-r from-orange-500 to-orange-700 animate-progress w-full"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {generationError && (
                        <div className="absolute inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center z-30 p-10">
                          <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-6 shadow-xl shadow-red-600/10">
                            <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
                          </div>
                          <h4 className="text-sm font-bold text-slate-800 mb-2">Neural Synthesis Failed</h4>
                          <p className="text-xs text-slate-400 max-w-[280px] leading-relaxed mb-8">The AI engine encountered an issue. This could be due to a complex prompt or temporary service interruption.</p>
                          <div className="flex gap-4">
                            <button onClick={() => setGenerationError(null)} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-all">Dismiss</button>
                            <button onClick={handleGenerate} className="px-6 py-3 bg-orange-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-orange-700 shadow-lg shadow-orange-600/20 transition-all flex items-center gap-2">
                              <i className="fa-solid fa-rotate-right"></i>
                              Retry Synthesis
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </>
      )}

      {viewMode === 'preview' && (
        <section 
          style={{ 
            marginLeft: isSidebarOpen && !isFullscreen && sidebarSide === 'left' ? (windowWidth >= 1024 ? `${sidebarWidth}px` : '0px') : '0px',
            marginRight: isSidebarOpen && !isFullscreen && sidebarSide === 'right' ? (windowWidth >= 1024 ? `${sidebarWidth}px` : '0px') : '0px'
          }}
          className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-500 bg-slate-50 transition-all duration-300"
        >
          {!isFullscreen && (
            <div className="p-4 lg:p-6 bg-white border-b border-slate-200 flex flex-wrap gap-4 justify-between items-center z-10 no-print shadow-sm">
              <button onClick={() => setViewMode('generator')} className="border border-slate-200 text-slate-600 px-6 lg:px-8 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-slate-50 flex items-center gap-4 group transition-all">
                <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> WORKSPACE
              </button>
              
              <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Zoom</span>
                <input 
                  type="range" 
                  min="50" 
                  max="150" 
                  value={previewZoom} 
                  onChange={(e) => setPreviewZoom(parseInt(e.target.value))}
                  className="w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
                <span className="text-[10px] font-bold text-slate-600 w-8">{previewZoom}%</span>
              </div>

              <div className="flex gap-2 lg:gap-3 ml-auto">
                <button onClick={() => setIsFullscreen(true)} className="h-10 w-10 lg:h-12 lg:w-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-orange-600 transition-all shadow-sm" title="Fullscreen">
                  <i className="fa-solid fa-expand"></i>
                </button>
                <button 
                  onClick={handleCopyToDocs}
                  className="px-4 py-3 bg-emerald-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-emerald-700 shadow-sm flex items-center gap-2 transition-all"
                  title="Copy exactly as shown for Google Docs"
                >
                  <i className="fa-solid fa-copy"></i> Docs
                </button>
                <button 
                  onClick={() => exportToPDF('worksheet-container', `Test_${new Date().getTime()}`)}
                  className="px-4 py-3 bg-red-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-red-700 shadow-sm flex items-center gap-2 transition-all"
                >
                  <i className="fa-solid fa-file-pdf"></i> PDF
                </button>
                <button 
                  onClick={() => exportToHTML(worksheetContent, `Test_${new Date().getTime()}`)}
                  className="px-4 py-3 bg-blue-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-blue-700 shadow-sm flex items-center gap-2 transition-all"
                >
                  <i className="fa-solid fa-code"></i> HTML
                </button>
                <button 
                  onClick={handleExportWord}
                  className="px-4 py-3 bg-indigo-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-indigo-700 shadow-sm flex items-center gap-2 transition-all"
                >
                  <i className="fa-solid fa-file-word"></i> Word
                </button>
                <button onClick={handlePrint} className="h-10 w-10 lg:h-12 lg:w-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-orange-600 transition-all shadow-sm">
                  <i className="fa-solid fa-print"></i>
                </button>
              </div>
            </div>
          )}
          
          {isFullscreen && (
            <button 
              onClick={() => setIsFullscreen(false)}
              className="fixed top-6 right-6 h-12 w-12 bg-slate-900/80 backdrop-blur-md text-white rounded-full flex items-center justify-center z-[200] hover:bg-slate-900 transition-all shadow-2xl no-print"
            >
              <i className="fa-solid fa-compress"></i>
            </button>
          )}

          <div className="flex-1 overflow-auto">
            <Worksheet 
              content={worksheetContent} 
              onContentChange={setWorksheetContent} 
              isGenerating={isGenerating} 
              theme={THEMES.find(t => t.id === activeThemeId) || THEMES[0]} 
              paperType="Plain" 
              brandSettings={brandSettings} 
              level={activeLevel} 
              module={activeModule} 
              topic={topic} 
              paperDesign={paperDesign}
              mcqStyle={activeThemeId === '3' ? 12 : mcqStyle}
              instructionStyle={instructionStyle}
              isColorfulBackgroundEnabled={isColorfulBackgroundEnabled}
              isInstructionBackgroundEnabled={activeThemeId === '1' || activeThemeId === '5' ? false : isInstructionBackgroundEnabled}
              globalLayout={activeThemeId === '1' || activeThemeId === '5' ? 0 : globalLayout}
              baseLayout={baseLayout}
              instructionRulerStyle={instructionRulerStyle}
              zoom={previewZoom}
              isTopBottomLineEnabled={isTopBottomLineEnabled}
              isTopBottomBothEnabled={isTopBottomBothEnabled}
              topBottomLineColor={topBottomLineColor}
              isStarLineEnabled={isStarLineEnabled}
              isStarBothEnabled={isStarBothEnabled}
              starLineStyle={starLineStyle}
              isHandDrawnBorderEnabled={isHandDrawnBorderEnabled}
            />
          </div>
        </section>
      )}

      {viewMode === 'grammar_iframe' && (
        <section 
          style={{ 
            marginLeft: isSidebarOpen && sidebarSide === 'left' ? (windowWidth >= 1024 ? `${sidebarWidth}px` : '0px') : '0px',
            marginRight: isSidebarOpen && sidebarSide === 'right' ? (windowWidth >= 1024 ? `${sidebarWidth}px` : '0px') : '0px'
          }}
          className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-500 bg-slate-50 transition-all duration-300"
        >
          <div className="p-4 lg:p-6 bg-white border-b border-slate-200 flex flex-wrap gap-4 justify-between items-center z-10 no-print shadow-sm">
            <button onClick={() => setViewMode('generator')} className="border border-slate-200 text-slate-600 px-6 lg:px-8 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-slate-50 flex items-center gap-4 group transition-all">
              <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> WORKSPACE
            </button>
            <div className="flex-1 text-center">
              <h2 className="text-slate-800 font-bold uppercase tracking-widest text-[12px]">Neural Grammar Engine</h2>
            </div>
            <div className="flex gap-2">
              <a 
                href="https://aistudio.google.com/apps/f6448ec0-06de-44f2-93d6-13cd43bceb87?showPreview=true&showAssistant=true" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-orange-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-orange-700 shadow-sm flex items-center gap-2 transition-all"
              >
                <i className="fa-solid fa-arrow-up-right-from-square"></i> Launch Tool
              </a>
            </div>
          </div>
          <div className="flex-1 bg-white overflow-hidden relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center bg-slate-50 -z-10">
              <i className="fa-solid fa-circle-exclamation text-4xl text-slate-300 mb-4"></i>
              <p className="text-slate-500 font-bold text-sm">If the tool refuses to connect, please use the "Launch Tool" button above.</p>
            </div>
            <iframe 
              src="https://aistudio.google.com/apps/f6448ec0-06de-44f2-93d6-13cd43bceb87?showPreview=true&showAssistant=true"
              className="w-full h-full min-h-[800px] border-none relative z-10"
              title="Grammar Tool"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-modals allow-top-navigation-by-user-activation"
            />
          </div>
        </section>
      )}

      {viewMode === 'khmer_program' && (
        <section 
          style={{ 
            marginLeft: isSidebarOpen && sidebarSide === 'left' ? (windowWidth >= 1024 ? `${sidebarWidth}px` : '0px') : '0px',
            marginRight: isSidebarOpen && sidebarSide === 'right' ? (windowWidth >= 1024 ? `${sidebarWidth}px` : '0px') : '0px'
          }}
          className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-500 bg-slate-50 transition-all duration-300"
        >
          <div className="p-4 lg:p-6 bg-white border-b border-slate-200 flex flex-wrap gap-4 justify-between items-center z-10 no-print shadow-sm">
            <button onClick={() => setViewMode('generator')} className="border border-slate-200 text-slate-600 px-6 lg:px-8 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-slate-50 flex items-center gap-4 group transition-all">
              <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> WORKSPACE
            </button>
            <div className="flex-1 text-center">
              <h2 className="text-slate-800 font-bold uppercase tracking-widest text-[12px]">Khmer Program Test Builder</h2>
            </div>
            <div className="flex gap-2">
              <a 
                href="https://chanthy-master-engine-gbcdawq79gtmzdw7cqfh7f.streamlit.app/?tool=khmer_program&embed=true" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-orange-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-orange-700 shadow-sm flex items-center gap-2 transition-all"
              >
                <i className="fa-solid fa-arrow-up-right-from-square"></i> Launch Tool
              </a>
            </div>
          </div>
          <div className="flex-1 bg-white overflow-hidden relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center bg-slate-50 -z-10">
              <i className="fa-solid fa-circle-exclamation text-4xl text-slate-300 mb-4"></i>
              <p className="text-slate-500 font-bold text-sm">If the tool refuses to connect, please use the "Launch Tool" button above.</p>
            </div>
            <iframe 
              src="https://chanthy-master-engine-gbcdawq79gtmzdw7cqfh7f.streamlit.app/?tool=khmer_program&embed=true"
              className="w-full h-full min-h-[800px] border-none relative z-10"
              title="Khmer Program Tool"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-modals allow-top-navigation-by-user-activation"
            />
          </div>
        </section>
      )}

      {viewMode === 'book_creation' && (
        <section 
          style={{ 
            marginLeft: isSidebarOpen && sidebarSide === 'left' ? (windowWidth >= 1024 ? `${sidebarWidth}px` : '0px') : '0px',
            marginRight: isSidebarOpen && sidebarSide === 'right' ? (windowWidth >= 1024 ? `${sidebarWidth}px` : '0px') : '0px'
          }}
          className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-500 bg-slate-50 transition-all duration-300"
        >
          <div className="p-4 lg:p-6 bg-white border-b border-slate-200 flex flex-wrap gap-4 justify-between items-center z-10 no-print shadow-sm">
            <button onClick={() => setViewMode('generator')} className="border border-slate-200 text-slate-600 px-6 lg:px-8 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-slate-50 flex items-center gap-4 group transition-all">
              <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> WORKSPACE
            </button>
            <div className="flex-1 text-center">
              <h2 className="text-slate-800 font-bold uppercase tracking-widest text-[12px]">Neural Book Engine</h2>
            </div>
            <div className="flex gap-2">
              <a 
                href="https://chanthy-master-engine-gbcdawq79gtmzdw7cqfh7f.streamlit.app/?tool=book_creation&embed=true" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-orange-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-orange-700 shadow-sm flex items-center gap-2 transition-all"
              >
                <i className="fa-solid fa-arrow-up-right-from-square"></i> Launch Tool
              </a>
            </div>
          </div>
          <div className="flex-1 bg-white overflow-hidden relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center bg-slate-50 -z-10">
              <i className="fa-solid fa-circle-exclamation text-4xl text-slate-300 mb-4"></i>
              <p className="text-slate-500 font-bold text-sm">If the tool refuses to connect, please use the "Launch Tool" button above.</p>
            </div>
            <iframe 
              src="https://chanthy-master-engine-gbcdawq79gtmzdw7cqfh7f.streamlit.app/?tool=book_creation&embed=true"
              className="w-full h-full min-h-[800px] border-none relative z-10"
              title="Book Creation Tool"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-modals allow-top-navigation-by-user-activation"
            />
          </div>
        </section>
      )}

      {viewMode === 'paper_style_design' && (
        <section 
          style={{ 
            marginLeft: isSidebarOpen && sidebarSide === 'left' ? (windowWidth >= 1024 ? `${sidebarWidth}px` : '0px') : '0px',
            marginRight: isSidebarOpen && sidebarSide === 'right' ? (windowWidth >= 1024 ? `${sidebarWidth}px` : '0px') : '0px'
          }}
          className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-500 bg-slate-50 transition-all duration-300"
        >
          <div className="p-4 lg:p-6 bg-white border-b border-slate-200 flex flex-wrap gap-4 justify-between items-center z-10 no-print shadow-sm">
            <button onClick={() => setViewMode('generator')} className="border border-slate-200 text-slate-600 px-6 lg:px-8 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-slate-50 flex items-center gap-4 group transition-all">
              <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> WORKSPACE
            </button>
            <div className="flex-1 text-center">
              <h2 className="text-slate-800 font-bold uppercase tracking-widest text-[12px]">Paper Style Selection</h2>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setViewMode('generator')}
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-emerald-700 shadow-sm flex items-center gap-2 transition-all"
              >
                <i className="fa-solid fa-check"></i> Save & Set Default
              </button>
            </div>
          </div>
          <div className="flex-1 bg-slate-50 overflow-y-auto p-8 no-scrollbar">
            <div className="max-w-4xl mx-auto space-y-10">
              <div className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Popular Paper Styles</h3>
                <p className="text-sm text-slate-500 mb-8">Choose a base layout for your test paper. Selecting a style sets it as your default.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {[
                    { id: 0, name: 'Divider 1: Clean White', desc: 'Pure white paper with subtle border.', icon: 'fa-file-lines' },
                    { id: 1, name: 'Divider 2: Orange Mix', desc: 'White paper with orange accents.', icon: 'fa-palette' },
                    { id: 2, name: 'Divider 3: Modern Emerald', desc: 'Professional green theme.', icon: 'fa-gem' },
                    { id: 3, name: 'Divider 4: Soft Lavender', desc: 'Elegant purple theme.', icon: 'fa-feather' },
                    { id: 4, name: 'Divider 5: Mint', desc: 'Very light green paper.', icon: 'fa-leaf' },
                    { id: 5, name: 'Divider 6: Peach', desc: 'Very light orange paper.', icon: 'fa-sun' },
                    { id: 6, name: 'Divider 7: Sky', desc: 'Very light blue paper.', icon: 'fa-cloud' },
                    { id: 7, name: 'Divider 8: Lavender', desc: 'Very light purple paper.', icon: 'fa-moon' },
                    { id: 8, name: 'Divider 9: Citrus', desc: 'Light Green & Orange mix.', icon: 'fa-lemon' },
                    { id: 9, name: 'Divider 10: Rose', desc: 'Very light pink paper.', icon: 'fa-heart' },
                    { id: 10, name: 'Divider 11: Stars', desc: 'Decorative stars background.', icon: 'fa-star' },
                    { id: 11, name: 'Divider 12: Flowers', desc: 'Decorative flowers background.', icon: 'fa-flower' },
                    { id: 12, name: 'Divider 13: Hearts', desc: 'Decorative hearts background.', icon: 'fa-heart' },
                    { id: 13, name: 'Divider 14: Bubbles', desc: 'Decorative bubbles background.', icon: 'fa-soap' },
                    { id: 14, name: 'Divider 15: Leaves', desc: 'Decorative leaves background.', icon: 'fa-leaf' },
                    { id: 15, name: 'Divider 16: Rainbow', desc: 'Subtle rainbow gradient.', icon: 'fa-rainbow' },
                    { id: 16, name: 'Divider 17: Galaxy', desc: 'Dark galaxy themed paper.', icon: 'fa-user-astronaut' },
                    { id: 17, name: 'Divider 18: Notebook', desc: 'Classic spiral notebook style.', icon: 'fa-book-open' },
                    { id: 18, name: 'Divider 19: Vintage', desc: 'Aged parchment style.', icon: 'fa-scroll' },
                    { id: 19, name: 'Divider 20: Modern', desc: 'Geometric modern art style.', icon: 'fa-shapes' },
                  ].map((style) => (
                    <div 
                      key={style.id}
                      onClick={() => {
                        setGlobalLayout(style.id);
                        if (style.id === 3) {
                          setMcqLayout('quad');
                        }
                      }}
                      className={`p-8 rounded-[40px] border-2 cursor-pointer transition-all ${globalLayout === style.id ? 'border-emerald-500 bg-emerald-50/30 shadow-xl scale-[1.02]' : 'border-slate-100 bg-white hover:border-emerald-200 shadow-sm'}`}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-2xl ${globalLayout === style.id ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                          <i className={`fa-solid ${style.icon}`}></i>
                        </div>
                        {globalLayout === style.id && <div className="h-8 w-8 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg animate-in zoom-in"><i className="fa-solid fa-check"></i></div>}
                      </div>
                      <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">{style.name}</h4>
                      <p className="text-xs font-medium text-slate-500 leading-relaxed">{style.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Preview Section - Moved up for better visibility */}
                <div className="bg-slate-900 rounded-[40px] p-12 border border-slate-800 shadow-2xl overflow-hidden relative group">
                  <div className="absolute top-0 right-0 p-8">
                    <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest animate-pulse">Live Preview Active</div>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Style Visualization</h3>
                  <p className="text-sm text-slate-400 mb-12">See how your selected paper style will look in the final output.</p>
                  
                  <div className="relative flex justify-center">
                    <div className={`w-full max-w-[500px] aspect-[1/1.414] bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] rounded-sm overflow-hidden transition-all duration-700 ${
                      baseLayout === 1 ? 'layout-lined' : 
                      baseLayout === 2 ? 'layout-grid' : 
                      baseLayout === 3 ? 'layout-vertical-middle' :
                      baseLayout === 4 ? 'layout-rulers' : 
                      baseLayout === 5 ? 'layout-s1' :
                      baseLayout === 6 ? 'layout-s2' :
                      baseLayout === 7 ? 'layout-s3' :
                      baseLayout === 8 ? 'layout-s4' : ''
                    } ${
                      globalLayout === 0 ? 'layout-clean-white' :
                      globalLayout === 1 ? 'layout-orange-mix' :
                      globalLayout === 2 ? 'layout-modern-emerald' :
                      globalLayout === 3 ? 'layout-soft-lavender' :
                      globalLayout === 4 ? 'layout-mint' :
                      globalLayout === 5 ? 'layout-peach' :
                      globalLayout === 6 ? 'layout-sky' :
                      globalLayout === 7 ? 'layout-lavender' :
                      globalLayout === 8 ? 'layout-citrus' :
                      globalLayout === 9 ? 'layout-rose' : 
                      globalLayout === 10 ? 'layout-stars' :
                      globalLayout === 11 ? 'layout-flowers' :
                      globalLayout === 12 ? 'layout-hearts' :
                      globalLayout === 13 ? 'layout-bubbles' :
                      globalLayout === 14 ? 'layout-leaves' :
                      globalLayout === 15 ? 'layout-rainbow' :
                      globalLayout === 16 ? 'layout-galaxy' :
                      globalLayout === 17 ? 'layout-notebook' :
                      globalLayout === 18 ? 'layout-vintage' :
                      globalLayout === 19 ? 'layout-modern' : ''
                    }`} style={{ transform: 'scale(0.9)' }}>
                      <div className="p-12 space-y-8">
                        <div className="h-6 w-3/4 bg-slate-200 rounded-full"></div>
                        <div className="h-6 w-1/2 bg-slate-200 rounded-full"></div>
                        <div className="h-6 w-full bg-slate-100 rounded-full"></div>
                        <div className="pt-12 space-y-6">
                          <div className="h-4 w-1/3 bg-slate-300 rounded-full"></div>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="h-4 bg-slate-100 rounded-full"></div>
                            <div className="h-4 bg-slate-100 rounded-full"></div>
                          </div>
                        </div>
                        <div className="space-y-6">
                          <div className="h-4 w-1/3 bg-slate-300 rounded-full"></div>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="h-4 bg-slate-100 rounded-full"></div>
                            <div className="h-4 bg-slate-100 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                      {/* Ruler Simulation for Preview */}
                      {baseLayout === 4 && (
                        <div className="absolute left-0 top-0 bottom-0 w-[40px] bg-slate-50 border-r-2 border-red-300 flex items-center justify-center">
                          <div className="h-full w-[1px] bg-red-200"></div>
                        </div>
                      )}
                      {baseLayout === 3 && (
                        <div className="absolute left-1/2 top-0 bottom-0 w-[2.5pt] bg-orange-500 opacity-60"></div>
                      )}
                      {instructionRulerStyle > 0 && (
                        <div className="absolute top-[100px] left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-slate-800"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* MCQ Grid View Removed */}


      {viewMode === 'instruction_design' && (
        <section 
          style={{ 
            marginLeft: isSidebarOpen && sidebarSide === 'left' ? (windowWidth >= 1024 ? `${sidebarWidth}px` : '0px') : '0px',
            marginRight: isSidebarOpen && sidebarSide === 'right' ? (windowWidth >= 1024 ? `${sidebarWidth}px` : '0px') : '0px'
          }}
          className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-500 bg-slate-50 transition-all duration-300"
        >
          <div className="p-4 lg:p-6 bg-white border-b border-slate-200 flex flex-wrap gap-4 justify-between items-center z-10 no-print shadow-sm">
            <button onClick={() => setViewMode('generator')} className="border border-slate-200 text-slate-600 px-6 lg:px-8 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-slate-50 flex items-center gap-4 group transition-all">
              <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> WORKSPACE
            </button>
            <div className="flex-1 text-center">
              <h2 className="text-slate-800 font-bold uppercase tracking-widest text-[12px]">Table Design Workspace</h2>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setViewMode('generator')}
                className="px-6 py-3 bg-rose-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-rose-700 shadow-sm flex items-center gap-2 transition-all"
              >
                <i className="fa-solid fa-check"></i> Save & Apply
              </button>
            </div>
          </div>
          <div className="flex-1 bg-slate-50 overflow-y-auto p-8 no-scrollbar">
            <div className="max-w-5xl mx-auto space-y-10">
              <div className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-12 w-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">
                    <i className="fa-solid fa-table"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Table Design Architect</h3>
                    <p className="text-sm text-slate-500">Choose professional table styles for your exercises (Plain & Grid Tables).</p>
                  </div>
                </div>
                
                <div className="space-y-12">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="h-px w-8 bg-slate-200"></span>
                        Plain Tables
                      </h4>
                      <button 
                        onClick={() => {
                          setDesignTargetTypeId('table');
                          setDesignTargetName('My New Table Style');
                          setSettingsTab('FORMAT_DESIGN');
                          setShowSettings(true);
                        }}
                        className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all flex items-center gap-2"
                      >
                        <i className="fa-solid fa-plus"></i> Add New Style
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { id: 0, name: 'Standard', color: 'bg-slate-800', border: 'border-slate-300' },
                        { id: 1, name: 'No Borders', color: 'bg-slate-100', border: 'border-transparent' },
                        { id: 2, name: 'Header Only', color: 'bg-slate-800', border: 'border-b-slate-300' },
                        { id: 3, name: 'Banded Rows', color: 'bg-slate-400', border: 'border-slate-200' },
                        { id: 4, name: 'Banded Columns', color: 'bg-slate-400', border: 'border-slate-200' },
                        { id: 5, name: 'Minimalist', color: 'bg-slate-200', border: 'border-slate-100' },
                        { id: 6, name: 'Clean White', color: 'bg-white', border: 'border-slate-200' },
                        { id: 7, name: 'Dotted Plain', color: 'bg-slate-50', border: 'border-dotted border-slate-300' }
                      ].map((style) => (
                        <div 
                          key={style.id}
                          onClick={() => {
                            setTableDesignStyle(style.id);
                            alert(`Table style applied: ${style.name}`);
                          }}
                          className={`p-4 rounded-xl border cursor-pointer transition-all group ${tableDesignStyle === style.id ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 bg-white hover:border-rose-300'}`}
                        >
                          <div className={`h-24 w-full ${style.border} border rounded-lg overflow-hidden bg-white flex flex-col relative`}>
                            {tableDesignStyle === style.id && <div className="absolute top-1 right-1 h-4 w-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[8px] z-10"><i className="fa-solid fa-check"></i></div>}
                            <div className={`h-4 w-full ${style.color} opacity-20`}></div>
                            <div className="flex-1 grid grid-cols-3 grid-rows-4">
                              {[...Array(12)].map((_, i) => (
                                <div key={i} className={`border-[0.5px] ${style.border} opacity-30`}></div>
                              ))}
                            </div>
                          </div>
                          <h5 className="mt-3 text-[10px] font-bold text-slate-600 text-center uppercase tracking-wider">{style.name}</h5>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <span className="h-px w-8 bg-slate-200"></span>
                      Grid Tables (Colorful)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { id: 8, name: 'Grid Blue', color: 'bg-blue-600', border: 'border-blue-200' },
                        { id: 9, name: 'Grid Green', color: 'bg-emerald-600', border: 'border-emerald-200' },
                        { id: 10, name: 'Grid Orange', color: 'bg-orange-600', border: 'border-orange-200' },
                        { id: 11, name: 'Grid Purple', color: 'bg-purple-600', border: 'border-purple-200' },
                        { id: 12, name: 'Grid Red', color: 'bg-rose-600', border: 'border-rose-200' },
                        { id: 13, name: 'Grid Teal', color: 'bg-teal-600', border: 'border-teal-200' },
                        { id: 14, name: 'Grid Indigo', color: 'bg-indigo-600', border: 'border-indigo-200' },
                        { id: 15, name: 'Grid Amber', color: 'bg-amber-600', border: 'border-amber-200' }
                      ].map((style) => (
                        <div 
                          key={style.id}
                          onClick={() => {
                            setTableDesignStyle(style.id);
                            alert(`Table style applied: ${style.name}`);
                          }}
                          className={`p-4 rounded-xl border cursor-pointer transition-all group ${tableDesignStyle === style.id ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 bg-white hover:border-rose-300'}`}
                        >
                          <div className={`h-24 w-full border ${style.border} rounded-lg overflow-hidden bg-white flex flex-col relative`}>
                            {tableDesignStyle === style.id && <div className="absolute top-1 right-1 h-4 w-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[8px] z-10"><i className="fa-solid fa-check"></i></div>}
                            <div className={`h-4 w-full ${style.color}`}></div>
                            <div className="flex-1 grid grid-cols-3 grid-rows-4">
                              {[...Array(12)].map((_, i) => (
                                <div key={i} className={`border-[0.5px] ${style.border}`}></div>
                              ))}
                            </div>
                          </div>
                          <h5 className="mt-3 text-[10px] font-bold text-slate-600 text-center uppercase tracking-wider">{style.name}</h5>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {viewMode === 'instruction_styles' && (
        <section 
          style={{ 
            marginLeft: isSidebarOpen && sidebarSide === 'left' ? (windowWidth >= 1024 ? `${sidebarWidth}px` : '0px') : '0px',
            marginRight: isSidebarOpen && sidebarSide === 'right' ? (windowWidth >= 1024 ? `${sidebarWidth}px` : '0px') : '0px'
          }}
          className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-500 bg-slate-50 transition-all duration-300"
        >
          <div className="p-4 lg:p-6 bg-white border-b border-slate-200 flex flex-wrap gap-4 justify-between items-center z-10 no-print shadow-sm">
            <button onClick={() => setViewMode('generator')} className="border border-slate-200 text-slate-600 px-6 lg:px-8 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-slate-50 flex items-center gap-4 group transition-all">
              <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> WORKSPACE
            </button>
            <div className="flex-1 text-center">
              <h2 className="text-slate-800 font-bold uppercase tracking-widest text-[12px]">Instruction Styles Workspace</h2>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setViewMode('generator')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-indigo-700 shadow-sm flex items-center gap-2 transition-all"
              >
                <i className="fa-solid fa-check"></i> Save & Apply
              </button>
            </div>
          </div>
          <div className="flex-1 bg-slate-50 overflow-y-auto p-8 no-scrollbar">
            <div className="max-w-5xl mx-auto space-y-10">
              <div className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                    <i className="fa-solid fa-pen-nib"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Instruction Design Library</h3>
                    <p className="text-sm text-slate-500">Choose from 20 professional instruction styles for your test parts.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {[
                    { id: 0, name: 'Brutalist Pop', desc: 'Yellow with shadow', style: 'bg-yellow-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black font-black uppercase italic' },
                    { id: 1, name: 'Elegant Gold', desc: 'Gold italic gradient', style: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white italic font-bold px-6 py-3 rounded-lg shadow-lg' },
                    { id: 2, name: 'Minimalist Gray', desc: 'Thin line minimalist', style: 'border-b border-slate-200 text-slate-400 font-medium tracking-widest uppercase text-xs pb-2' },
                    { id: 3, name: 'Gradient Night', desc: 'Dark slate gradient', style: 'bg-slate-800 text-white px-6 py-4 rounded-xl font-bold shadow-xl border-l-8 border-indigo-500' },
                    { id: 4, name: 'Neon Emerald', desc: 'Green neon border', style: 'border-2 border-emerald-500 text-emerald-600 bg-emerald-50/30 px-4 py-2 rounded-md font-black tracking-tight' },
                    { id: 5, name: 'Brutalist Yellow', desc: 'Thick black border', style: 'bg-yellow-300 border-[6px] border-black text-black font-black p-4' },
                    { id: 6, name: 'Mix Styles', desc: 'Gradient background', style: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-xl' },
                    { id: 7, name: 'Pill Shape', desc: 'Rounded corners', style: 'bg-amber-100 text-amber-800 px-6 py-2 rounded-full border border-amber-200' },
                    { id: 8, name: 'Underlined Bold', desc: 'Classic academic style', style: 'font-black underline decoration-2 underline-offset-4' },
                    { id: 9, name: 'Boxed Shadow', desc: 'Floating effect', style: 'bg-white shadow-md border border-slate-100 px-4 py-2 rounded-xl' },
                    { id: 10, name: 'Dark Mode', desc: 'White text on dark', style: 'bg-slate-800 text-white px-4 py-2 rounded-lg' },
                    { id: 11, name: 'Italic Elegant', desc: 'Serif italic style', style: 'italic font-serif text-slate-600' },
                    { id: 12, name: 'Double Line', desc: 'Top and bottom borders', style: 'border-y-2 border-slate-200 py-2' },
                    { id: 13, name: 'Soft Highlight', desc: 'Yellow highlight', style: 'bg-yellow-100 text-yellow-900 px-2' },
                    { id: 14, name: 'Corner Accent', desc: 'Top-left accent', style: 'border-t-4 border-l-4 border-indigo-500 p-2' },
                    { id: 15, name: 'Dashed Grey', desc: 'Subtle dashed border', style: 'border border-dashed border-slate-300 text-slate-500' },
                    { id: 16, name: 'Modern Outline', desc: 'Thin colored border', style: 'border border-blue-500 text-blue-600 rounded-md' },
                    { id: 17, name: 'Bold Caps', desc: 'Uppercase heavy', style: 'uppercase font-black tracking-widest' },
                    { id: 18, name: 'Left Bar Green', desc: 'Green left accent', style: 'border-l-4 border-emerald-500 bg-emerald-50/50 pl-3' },
                    { id: 19, name: 'Right Align', desc: 'Aligned to right', style: 'text-right border-r-4 border-slate-300 pr-3' },
                    { id: 20, name: 'Modern Blue Bar', desc: 'Sleek blue accent', style: 'border-l-[12px] border-blue-600 bg-blue-50/30 pl-4 py-2 font-bold text-blue-900' },
                    { id: 21, name: 'Indigo Aura', desc: 'Shadow and border', style: 'border-2 border-indigo-200 bg-indigo-50 shadow-[4px_4px_0px_0px_rgba(79,70,229,1)] px-4 py-2' },
                    { id: 22, name: 'Technical Grid', desc: 'Grid pattern bg', style: 'border-2 border-slate-800 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-[size:10px_10px] p-4 font-mono font-bold' },
                    { id: 23, name: 'Script Underline', desc: 'Elegant cursive', style: 'font-serif italic border-b-2 border-amber-600 pb-1 text-slate-800' },
                    { id: 24, name: 'Bold Warning', desc: 'Red attention style', style: 'bg-rose-600 text-white p-4 rounded-lg font-black uppercase tracking-tighter' }
                  ].map((style) => (
                    <div 
                      key={style.id}
                      onClick={() => {
                        setInstructionHeaderStyle(style.id);
                        // Automatically enable backgrounds for fancy styles to ensure user intent is followed
                        if (style.id !== 2 && style.id !== 8 && style.id !== 11 && style.id !== 17) {
                          setIsInstructionBackgroundEnabled(true);
                        }
                      }}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${instructionHeaderStyle === style.id ? 'border-indigo-500 bg-indigo-50/30 shadow-md' : 'border-slate-100 hover:border-indigo-300 bg-white'}`}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h5 className="font-bold text-slate-700">{style.name}</h5>
                        {instructionHeaderStyle === style.id && <div className="h-6 w-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs"><i className="fa-solid fa-check"></i></div>}
                      </div>
                      <div className={`p-4 rounded-lg mb-2 text-sm ${style.style}`}>
                        Instruction Example
                      </div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{style.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {viewMode === 'design_test_style' && (
        <section 
          style={{ 
            marginLeft: isSidebarOpen && sidebarSide === 'left' ? (windowWidth >= 1024 ? `${sidebarWidth}px` : '0px') : '0px',
            marginRight: isSidebarOpen && sidebarSide === 'right' ? (windowWidth >= 1024 ? `${sidebarWidth}px` : '0px') : '0px'
          }}
          className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-500 bg-slate-50 transition-all duration-300"
        >
          <div className="p-4 lg:p-6 bg-white border-b border-slate-200 flex flex-wrap gap-4 justify-between items-center z-10 no-print shadow-sm">
            <button onClick={() => setViewMode('generator')} className="border border-slate-200 text-slate-600 px-6 lg:px-8 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-slate-50 flex items-center gap-4 group transition-all">
              <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> WORKSPACE
            </button>
            <div className="flex-1 text-center">
              <h2 className="text-slate-800 font-bold uppercase tracking-widest text-[12px]">Design Test Style</h2>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setViewMode('generator')}
                className="px-6 py-3 bg-orange-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-orange-700 shadow-sm flex items-center gap-2 transition-all"
              >
                <i className="fa-solid fa-check"></i> Save & Set Default
              </button>
            </div>
          </div>
          <div className="flex-1 bg-slate-50 overflow-y-auto p-4 lg:p-10">
            <div className="max-w-6xl mx-auto space-y-10">
              {/* Category Selector (Header Table Style) */}
              <div className="bg-white rounded-[40px] p-2 border border-slate-100 shadow-xl flex flex-wrap gap-2 justify-center items-center">
                {['Grammar', 'Vocabulary', 'Reading', 'Generals', 'Custom'].map(tab => {
                  const isActive = architectTab === tab;
                  const icons: Record<string, string> = {
                    'Grammar': 'fa-pen-nib',
                    'Vocabulary': 'fa-book-open',
                    'Reading': 'fa-file-lines',
                    'Generals': 'fa-globe',
                    'Custom': 'fa-wand-magic-sparkles'
                  };
                  return (
                    <button
                      key={tab}
                      onClick={() => {
                        setArchitectTab(tab as any);
                        setSelectedExerciseTypeId(null);
                      }}
                      className={`flex-1 min-w-[140px] py-4 px-6 rounded-[32px] text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${isActive ? 'bg-slate-900 text-white shadow-xl scale-[1.02]' : 'bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
                    >
                      <i className={`fa-solid ${icons[tab]}`}></i>
                      {tab}
                    </button>
                  );
                })}
              </div>

              {/* Types Selector (Row/Table Display) */}
              <div className="space-y-6">
                <div className="flex justify-between items-center px-4">
                  <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <i className="fa-solid fa-table-list text-orange-600"></i>
                    Exercise Types: {architectTab}
                  </h3>
                  <button 
                    onClick={() => {
                      setNewTypeNameInput('');
                      setShowNewTypeModal(true);
                    }}
                    className="flex items-center gap-2 text-blue-600 text-[11px] font-black uppercase hover:text-blue-700 transition-colors"
                  >
                    <i className="fa-solid fa-plus-circle"></i> Add NEW Type
                  </button>
                </div>

                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 border-b border-slate-50">
                    {Array.from(new Set(instructionTemplates
                      .filter(t => t.category?.toUpperCase() === (architectTab === 'Generals' ? 'GENERALS' : architectTab.toUpperCase()))
                      .map(t => t.typeId || t.label))) // Use label as fallback for uniqueness
                      .map(id => {
                        const firstTemplate = instructionTemplates.find(t => (t.typeId === id || t.label === id));
                        if (!firstTemplate) return null;
                        
                        const typeId = firstTemplate.typeId || id;
                        const label = firstTemplate.label;
                        
                        const isActive = selectedExerciseTypeId === typeId;

                        return (
                          <button
                            key={typeId}
                            onClick={() => setSelectedExerciseTypeId(typeId)}
                            className={`p-6 border-r border-b border-slate-50 transition-all flex flex-col items-center gap-3 text-center group ${isActive ? 'bg-orange-50/50' : 'hover:bg-slate-50'}`}
                          >
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${isActive ? 'bg-orange-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 group-hover:bg-white group-hover:shadow-sm'}`}>
                               <i className={`fa-solid ${
                                 typeId === 'mcq' ? 'fa-list-check' : 
                                 typeId === 'matching' ? 'fa-arrows-left-right' :
                                 typeId === 'tf' ? 'fa-square-check' :
                                 typeId === 'circle' ? 'fa-circle-dot' :
                                 typeId === 'completion' ? 'fa-pen-to-square' :
                                 typeId === 'word_box' ? 'fa-box-open' :
                                 typeId === 'cloze' ? 'fa-align-left' :
                                 typeId === 'speaking' ? 'fa-microphone' :
                                 typeId === 'key_term' ? 'fa-font' :
                                 typeId === 'table' ? 'fa-table' :
                                 'fa-shapes'
                               }`}></i>
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-orange-600' : 'text-slate-500'}`}>{label}</span>
                          </button>
                        );
                      })}
                      {/* Custom Added Types */}
                      {instructionTemplates
                        .filter(t => t.category?.toUpperCase() === (architectTab === 'Generals' ? 'GENERALS' : architectTab.toUpperCase()) && !t.typeId)
                        .map(t => {
                          const isActive = selectedExerciseTypeId === t.id;
                          return (
                            <button
                              key={t.id}
                              onClick={() => setSelectedExerciseTypeId(t.id)}
                              className={`p-6 border-r border-b border-slate-50 transition-all flex flex-col items-center gap-3 text-center group ${isActive ? 'bg-orange-50/50' : 'hover:bg-slate-50'}`}
                            >
                              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${isActive ? 'bg-orange-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 group-hover:bg-white group-hover:shadow-sm'}`}>
                                <i className="fa-solid fa-puzzle-piece"></i>
                              </div>
                              <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-orange-600' : 'text-slate-500'}`}>{t.label}</span>
                            </button>
                          );
                        })}
                  </div>
                </div>
              </div>

              {/* Styles Gallery */}
              {selectedExerciseTypeId && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6">
                  <div className="flex justify-between items-center px-4">
                    <div>
                      <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                        <span className="h-8 w-1 bg-orange-600 rounded-full"></span>
                        {selectedExerciseTypeId === 'mcq' ? 'MCQ Style Gallery' : 
                         selectedExerciseTypeId === 'matching' ? 'Matching Variations' :
                         selectedExerciseTypeId === 'tf' ? 'True/False & C/I' :
                         selectedExerciseTypeId === 'key_term' ? 'Key Term Library' :
                         'Style Library'}
                      </h4>
                      <p className="text-xs text-slate-400 font-medium ml-4 mt-1 uppercase tracking-widest">Select a default style for this exercise type</p>
                    </div>
                    <button 
                      onClick={() => {
                        setDesignTargetTypeId(selectedExerciseTypeId);
                        setDesignTargetName('New Custom Style');
                        setSettingsTab('FORMAT_DESIGN');
                        setShowSettings(true);
                      }}
                      className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 flex items-center gap-3 transition-all"
                    >
                      <i className="fa-solid fa-plus-circle"></i> Add NEW Style
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Predefined Templates */}
                    {instructionTemplates
                      .filter(t => (t.typeId === selectedExerciseTypeId || t.id === selectedExerciseTypeId))
                      .map(t => (
                        <div 
                          key={t.id}
                          onClick={() => {
                            const newId = t.id;
                            const type = selectedExerciseTypeId;
                            setPaperStyles(prev => ({ ...prev, [type as keyof typeof paperStyles]: newId }));
                            
                            // Enforce "Only one active style per type"
                            setSelectedInstructionIds(prev => {
                              // Find any already selected ID that has the same typeId
                              const otherIds = prev.filter(id => {
                                const template = instructionTemplates.find(x => x.id === id);
                                return template?.typeId !== type;
                              });
                              // Add the new one
                              return [...otherIds, newId];
                            });
                          }}
                          className={`p-8 rounded-[40px] border-2 transition-all cursor-pointer group relative overflow-hidden ${paperStyles[selectedExerciseTypeId as keyof typeof paperStyles] === t.id || selectedInstructionIds.includes(t.id) ? 'border-orange-500 bg-white shadow-2xl scale-[1.02]' : 'border-slate-100 bg-white hover:border-orange-200 shadow-sm'}`}
                        >
                          {(paperStyles[selectedExerciseTypeId as keyof typeof paperStyles] === t.id || selectedInstructionIds.includes(t.id)) && (
                            <div className="absolute top-0 right-0 py-2 px-6 bg-orange-600 text-white text-[9px] font-black uppercase tracking-widest rounded-bl-2xl shadow-sm">
                              Active Style
                            </div>
                          )}
                          
                          <div className="flex items-center gap-4 mb-6 group/title">
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${paperStyles[selectedExerciseTypeId as keyof typeof paperStyles] === t.id || selectedInstructionIds.includes(t.id) ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 'bg-slate-50 text-slate-400'}`}>
                              <i className={`fa-solid ${
                                 t.styleName === 'Boxed' ? 'fa-box' :
                                 t.styleName === 'Minimal' ? 'fa-border-none' :
                                 t.styleName === 'Numbered' ? 'fa-list-ol' :
                                 t.styleName === 'Bulleted' ? 'fa-list-ul' :
                                 selectedExerciseTypeId === 'mcq' ? 'fa-list-check' : 
                                 selectedExerciseTypeId === 'matching' ? 'fa-arrows-left-right' :
                                 selectedExerciseTypeId === 'tf' ? 'fa-square-check' :
                                 'fa-puzzle-piece'
                              }`}></i>
                            </div>
                            <div className="flex-1">
                               <input 
                                  value={t.styleName || t.label}
                                  onChange={(e) => {
                                     const newVal = e.target.value;
                                     setInstructionTemplates(prev => prev.map(item => item.id === t.id ? { ...item, styleName: newVal, label: newVal } : item));
                                  }}
                                  className="text-[12px] font-black text-slate-900 uppercase block leading-tight bg-transparent border-b border-transparent focus:border-orange-500 focus:outline-none w-full"
                                  onClick={(e) => e.stopPropagation()}
                               />
                               <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Category: </span>
                                  <select 
                                    value={t.category}
                                    onChange={(e) => {
                                      const newCat = e.target.value as any;
                                      setInstructionTemplates(prev => prev.map(item => item.id === t.id ? { ...item, category: newCat } : item));
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-[9px] text-orange-600 font-black uppercase tracking-widest bg-transparent border-none outline-none cursor-pointer"
                                  >
                                    {['GRAMMAR', 'VOCABULARY', 'READING', 'GENERALS', 'CUSTOM'].map(c => <option key={c} value={c}>{c}</option>)}
                                  </select>
                               </div>
                            </div>
                            <div className="flex gap-2">
                               <button 
                                  title="Duplicate Style"
                                  onClick={(e) => {
                                     e.stopPropagation();
                                     handleDuplicateDesign(t);
                                  }}
                                  className="h-8 w-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all shadow-sm"
                               >
                                  <i className="fa-solid fa-clone text-[10px]"></i>
                               </button>
                               <button 
                                  title="Copy Prompt"
                                  onClick={(e) => {
                                     e.stopPropagation();
                                     setCopiedStyle({ style: { ...paperStyles }, prompt: t.prompt });
                                     alert("Style prompt copied!");
                                  }}
                                  className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                               >
                                  <i className="fa-solid fa-copy text-[10px]"></i>
                               </button>
                               <button 
                                  title="Paste Prompt"
                                  disabled={!copiedStyle}
                                  onClick={(e) => {
                                     e.stopPropagation();
                                     if (copiedStyle) {
                                        setInstructionTemplates(prev => prev.map(item => item.id === t.id ? { ...item, prompt: copiedStyle.prompt } : item));
                                        alert("Style prompt pasted!");
                                     }
                                  }}
                                  className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all shadow-sm ${copiedStyle ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-500 hover:text-white' : 'bg-slate-50 text-slate-300 cursor-not-allowed'}`}
                               >
                                  <i className="fa-solid fa-paste text-[10px]"></i>
                               </button>
                            </div>
                          </div>

                          <div className="h-44 bg-white border-2 border-slate-50 shadow-inner rounded-[32px] p-6 overflow-hidden relative group-hover:border-orange-100 transition-all">
                            <StylePreview styleName={t.styleName} typeId={t.typeId} label={t.label} />
                          </div>
                        </div>
                      ))}

                    {/* Custom Designs */}
                    {customDesigns
                      .filter(d => d.type === selectedExerciseTypeId)
                      .map(design => (
                        <div 
                          key={design.id}
                          onClick={() => {
                            setPaperStyles(prev => ({ ...prev, [selectedExerciseTypeId]: design.id }));
                          }}
                          className={`p-8 rounded-[40px] border-2 transition-all cursor-pointer group relative overflow-hidden ${paperStyles[selectedExerciseTypeId as keyof typeof paperStyles] === design.id ? 'border-blue-500 bg-white shadow-2xl scale-[1.02]' : 'border-slate-100 bg-white hover:border-blue-200 shadow-sm'}`}
                        >
                          {paperStyles[selectedExerciseTypeId as keyof typeof paperStyles] === design.id && (
                            <div className="absolute top-0 right-0 py-2 px-6 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-bl-2xl shadow-sm">
                              Active Style
                            </div>
                          )}

                          <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${paperStyles[selectedExerciseTypeId as keyof typeof paperStyles] === design.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-50 text-slate-400'}`}>
                                <i className="fa-solid fa-wand-magic-sparkles"></i>
                              </div>
                              <div>
                                <span className="text-[12px] font-black text-slate-900 uppercase block leading-tight">{design.name}</span>
                                <span className="text-[9px] text-blue-600 font-bold uppercase tracking-widest">Custom AI Design</span>
                              </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Rename logic
                                  const newName = prompt("Rename your design:", design.name);
                                  if (newName && newName !== design.name) {
                                    setCustomDesigns(prev => prev.map(d => d.id === design.id ? {...d, name: newName} : d));
                                    // Update Firestore if needed
                                    if (auth.currentUser) {
                                      const { doc, updateDoc } = require('firebase/firestore');
                                      updateDoc(doc(db, 'customDesigns', design.id), { name: newName });
                                    }
                                  }
                                }}
                                className="h-10 w-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all shadow-sm"
                              >
                                <i className="fa-solid fa-pen text-[11px]"></i>
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteCustomDesign(design.id);
                                }}
                                className="h-10 w-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                              >
                                <i className="fa-solid fa-trash-can text-[11px]"></i>
                              </button>
                            </div>
                          </div>
                          <div className="h-40 bg-white border border-slate-100 rounded-[24px] p-4 flex flex-col gap-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                                    <span className="text-[9px] font-black text-slate-700">Vocabulary {i}</span>
                                    <div className="h-2 w-16 bg-slate-200 rounded-full"></div>
                                </div>
                            ))}
                          </div>
                        </div>
                      ))}

                    {/* Add Style Card */}
                    <div 
                      onClick={() => {
                        setDesignTargetTypeId(selectedExerciseTypeId);
                        setDesignTargetName('New Custom Style'); // Default name, they can change it in the editor
                        setSettingsTab('FORMAT_DESIGN');
                        setShowSettings(true);
                      }}
                      className="p-8 rounded-[40px] border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer transition-all flex flex-col items-center justify-center gap-4 text-center group min-h-[260px]"
                    >
                      <div className="h-16 w-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-all shadow-sm">
                        <i className="fa-solid fa-plus text-2xl"></i>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest group-hover:text-blue-600">Create New Style</span>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Using Custom Format Engine</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Instructions/Help Section */}
              {!selectedExerciseTypeId && (
                <div className="p-20 flex flex-col items-center text-center space-y-6 animate-in zoom-in-95 duration-700">
                   <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-xl border border-slate-100 relative group">
                      <div className="absolute inset-0 bg-orange-100 rounded-full animate-ping opacity-20 group-hover:opacity-40 transition-opacity"></div>
                      <i className="fa-solid fa-mouse-pointer text-slate-200 text-4xl group-hover:text-orange-500 transition-colors"></i>
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Select an Exercise Type</h3>
                      <p className="text-sm text-slate-400 max-w-sm mx-auto uppercase tracking-widest font-black">Choose a type from the table above to start customizing its visual styles and formatting protocols.</p>
                   </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
      {viewMode === 'header_footer_design' && (
        <section 
          style={{ 
            marginLeft: isSidebarOpen && sidebarSide === 'left' ? (windowWidth >= 1024 ? `${sidebarWidth}px` : '0px') : '0px',
            marginRight: isSidebarOpen && sidebarSide === 'right' ? (windowWidth >= 1024 ? `${sidebarWidth}px` : '0px') : '0px'
          }}
          className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-500 bg-slate-50 transition-all duration-300"
        >
          <div className="p-4 lg:p-6 bg-white border-b border-slate-200 flex flex-wrap gap-4 justify-between items-center z-10 no-print shadow-sm">
            <button onClick={() => setViewMode('generator')} className="border border-slate-200 text-slate-600 px-6 lg:px-8 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-slate-50 flex items-center gap-4 group transition-all">
              <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> WORKSPACE
            </button>
            <div className="flex-1 text-center">
              <h2 className="text-slate-800 font-bold uppercase tracking-widest text-[12px]">Header & Footer Styles Workspace</h2>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setBrandSettings(prev => ({ ...prev, headerStyle: paperDesign }));
                  setViewMode('generator');
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-blue-700 shadow-sm flex items-center gap-2 transition-all"
              >
                <i className="fa-solid fa-check"></i> Save & Set Default
              </button>
            </div>
          </div>
          <div className="flex-1 bg-slate-50 overflow-y-auto p-8 no-scrollbar">
            <div className="max-w-4xl mx-auto space-y-10">
              <div className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Header & Footer Architect</h3>
                <p className="text-sm text-slate-500 mb-8">Select from professional header and footer designs for your paper test.</p>
                
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 mb-10 space-y-8">
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <i className="fa-solid fa-sliders text-orange-500"></i> Advanced Header Customization
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Custom Header Text (Overrides Default)</label>
                      <input 
                        value={brandSettings.customHeaderText || ''} 
                        onChange={e => setBrandSettings({ ...brandSettings, customHeaderText: e.target.value })} 
                        className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-orange-500 font-bold text-slate-700 shadow-sm" 
                        placeholder="e.g. FINAL TERM EXAMINATION - SEMESTER 1" 
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Header Divider Style</label>
                      <div className={`flex bg-white p-1.5 rounded-2xl gap-1 overflow-x-auto border border-slate-200 shadow-sm`}>
                        {[0, 1, 2, 3, 4, 5, 6].map(style => (
                          <button 
                            key={style} 
                            onClick={() => setBrandSettings({ ...brandSettings, headerRulerStyle: style })} 
                            className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all shrink-0 ${brandSettings.headerRulerStyle === style ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                            {style === 0 ? 'None' : `Divider ${style}`}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Header Design 1 */}
                  <div 
                    onClick={() => setPaperDesign(0)}
                    className={`p-8 rounded-2xl border-2 cursor-pointer transition-all ${paperDesign === 0 ? 'border-blue-500 bg-blue-50/30 shadow-md' : 'border-slate-200 hover:border-blue-300 bg-white'}`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h5 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Style 1: Classic Professional</h5>
                      {paperDesign === 0 && <div className="h-6 w-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs"><i className="fa-solid fa-check"></i></div>}
                    </div>
                    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                      <div className="border-b-2 border-black pb-4 mb-6">
                        <div className="flex justify-between font-bold text-[10px] mb-2">
                          <span>{brandSettings.studentLabel}: _________________</span>
                          <span>{brandSettings.dateLabel}: ____/____/____</span>
                        </div>
                        <div className="flex justify-between font-bold text-[10px]">
                          <span>{brandSettings.classLabel}: _________________</span>
                          <span>{brandSettings.teacherLabel}: _________________</span>
                        </div>
                        <h1 className="text-center mt-6 text-xl font-black uppercase tracking-tighter">{brandSettings.schoolName}</h1>
                      </div>
                    </div>
                  </div>

                  {/* Header Design 2 */}
                  <div 
                    onClick={() => setPaperDesign(1)}
                    className={`p-8 rounded-2xl border-2 cursor-pointer transition-all ${paperDesign === 1 ? 'border-blue-500 bg-blue-50/30 shadow-md' : 'border-slate-200 hover:border-blue-300 bg-white'}`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h5 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Style 2: Boxed Header</h5>
                      {paperDesign === 1 && <div className="h-6 w-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs"><i className="fa-solid fa-check"></i></div>}
                    </div>
                    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                      <div className="border-2 border-black p-6 text-center">
                        <h1 className="text-lg font-black mb-4 uppercase tracking-widest">{brandSettings.schoolName}</h1>
                        <div className="border-t border-black pt-4 grid grid-cols-2 gap-4 text-left text-[9px] font-bold">
                          <div>{brandSettings.studentLabel}: ____________</div>
                          <div>{brandSettings.dateLabel}: ____________</div>
                          <div>{brandSettings.classLabel}: ____________</div>
                          <div>{brandSettings.scoreLabel}: ____ / ____</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Header Design 3 */}
                  <div 
                    onClick={() => setPaperDesign(2)}
                    className={`p-8 rounded-2xl border-2 cursor-pointer transition-all ${paperDesign === 2 ? 'border-blue-500 bg-blue-50/30 shadow-md' : 'border-slate-200 hover:border-blue-300 bg-white'}`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h5 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Style 3: Modern Minimal</h5>
                      {paperDesign === 2 && <div className="h-6 w-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs"><i className="fa-solid fa-check"></i></div>}
                    </div>
                    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                      <div className="text-[8px] border-bottom border-slate-300 pb-2 mb-4 flex justify-between uppercase font-bold text-slate-400 tracking-widest">
                        <span>{brandSettings.schoolName}</span>
                        <span>Academic Year: 2025-2026</span>
                      </div>
                      <h1 className="text-2xl font-black tracking-tighter mb-4 uppercase">WORKSHEET TITLE</h1>
                      <div className="bg-slate-100 p-4 rounded-lg flex gap-6 text-[9px] font-bold text-slate-600">
                        <span>{brandSettings.studentLabel}: _________</span>
                        <span>{brandSettings.idLabel}: _____</span>
                        <span>{brandSettings.dateLabel}: _____</span>
                      </div>
                    </div>
                  </div>

                  {/* Header Design 4 */}
                  <div 
                    onClick={() => setPaperDesign(3)}
                    className={`p-8 rounded-2xl border-2 cursor-pointer transition-all ${paperDesign === 3 ? 'border-blue-500 bg-blue-50/30 shadow-md' : 'border-slate-200 hover:border-blue-300 bg-white'}`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h5 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Style 4: Accent Sidebar</h5>
                      {paperDesign === 3 && <div className="h-6 w-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs"><i className="fa-solid fa-check"></i></div>}
                    </div>
                    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                      <div className="border-l-[6px] border-blue-600 pl-6">
                        <h1 className="text-xl font-black text-blue-900 uppercase tracking-tight mb-1">{brandSettings.schoolName}</h1>
                        <div className="text-[10px] text-slate-400 font-bold mb-4 uppercase tracking-widest">Topic: General Assessment</div>
                        <div className="flex gap-6 text-[9px] font-bold text-slate-500 border-t border-dashed border-slate-200 pt-4">
                          <span>{brandSettings.studentLabel}: _________</span>
                          <span>{brandSettings.classLabel}: _____</span>
                          <span>{brandSettings.dateLabel}: _____</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Header Design 5 */}
                  <div 
                    onClick={() => setPaperDesign(4)}
                    className={`p-8 rounded-2xl border-2 cursor-pointer transition-all ${paperDesign === 4 ? 'border-blue-500 bg-blue-50/30 shadow-md' : 'border-slate-200 hover:border-blue-300 bg-white'}`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h5 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Style 5: Dark Header</h5>
                      {paperDesign === 4 && <div className="h-6 w-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs"><i className="fa-solid fa-check"></i></div>}
                    </div>
                    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                      <div className="bg-slate-900 text-white p-8 rounded-xl relative overflow-hidden">
                        <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-white/5 rounded-full"></div>
                        <h1 className="text-xl font-black uppercase tracking-widest mb-4 relative z-10">{brandSettings.schoolName}</h1>
                        <div className="grid grid-cols-3 gap-4 text-[9px] font-bold opacity-80 relative z-10">
                          <div className="border-b border-white/30 pb-1">{brandSettings.studentLabel}: _______</div>
                          <div className="border-b border-white/30 pb-1">{brandSettings.idLabel}: _______</div>
                          <div className="border-b border-white/30 pb-1">{brandSettings.scoreLabel}: ____</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Header Design 6 - Green Nature */}
                  <div 
                    onClick={() => setPaperDesign(5)}
                    className={`p-8 rounded-2xl border-2 cursor-pointer transition-all ${paperDesign === 5 ? 'border-emerald-500 bg-emerald-50/30 shadow-md' : 'border-slate-200 hover:border-emerald-300 bg-white'}`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h5 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Style 6: Green Nature</h5>
                      {paperDesign === 5 && <div className="h-6 w-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs"><i className="fa-solid fa-check"></i></div>}
                    </div>
                    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                      <div className="border: 4pt solid #16a34a; padding: 10pt; border-radius: 8pt; background: #f0fdf4;">
                        <div className="flex justify-between items-center border-bottom: 2pt solid #16a34a; padding-bottom: 5pt; margin-bottom: 5pt;">
                          <h1 className="text-lg font-black text-emerald-800 uppercase">{brandSettings.schoolName}</h1>
                          <div className="text-[8px] text-emerald-600 font-bold">
                            <div>{brandSettings.dateLabel}: ____/____/____</div>
                            <div>{brandSettings.classLabel}: ___________</div>
                          </div>
                        </div>
                        <div className="text-[9px] text-emerald-900 font-bold">{brandSettings.studentLabel}: ________________________________</div>
                      </div>
                    </div>
                  </div>

                  {/* Header Design 7 - Emerald Professional */}
                  <div 
                    onClick={() => setPaperDesign(6)}
                    className={`p-8 rounded-2xl border-2 cursor-pointer transition-all ${paperDesign === 6 ? 'border-emerald-500 bg-emerald-50/30 shadow-md' : 'border-slate-200 hover:border-emerald-300 bg-white'}`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h5 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Style 7: Emerald Professional</h5>
                      {paperDesign === 6 && <div className="h-6 w-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs"><i className="fa-solid fa-check"></i></div>}
                    </div>
                    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                      <div className="bg-emerald-900 text-white p-6 rounded-lg text-center">
                        <h1 className="text-xl font-light tracking-[4px] uppercase mb-4">{brandSettings.schoolName}</h1>
                        <div className="flex justify-around text-[8px] font-mono opacity-80">
                          <span>[ {brandSettings.studentLabel}: ________ ]</span>
                          <span>[ {brandSettings.dateLabel}: __/__/__ ]</span>
                          <span>[ {brandSettings.scoreLabel}: ____ ]</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Header Design 8 - Yellow/Gold */}
                  <div 
                    onClick={() => setPaperDesign(7)}
                    className={`p-8 rounded-2xl border-2 cursor-pointer transition-all ${paperDesign === 7 ? 'border-yellow-500 bg-yellow-50/30 shadow-md' : 'border-slate-200 hover:border-yellow-300 bg-white'}`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h5 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Style 8: Boxed Gold</h5>
                      {paperDesign === 7 && <div className="h-6 w-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs"><i className="fa-solid fa-check"></i></div>}
                    </div>
                    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <div className="bg-yellow-400 p-3 flex justify-between items-center">
                          <h1 className="text-sm font-black text-yellow-900 uppercase">{brandSettings.schoolName}</h1>
                          <div className="bg-white px-3 py-1 rounded-full text-[8px] font-bold text-yellow-800">{brandSettings.scoreLabel}: ____</div>
                        </div>
                        <div className="p-3 grid grid-cols-2 gap-4 text-[9px] font-bold">
                          <div className="border-b border-slate-100">{brandSettings.studentLabel}: ________</div>
                          <div className="border-b border-slate-100">{brandSettings.dateLabel}: ________</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Header Design 9 - Modern Red */}
                  <div 
                    onClick={() => setPaperDesign(8)}
                    className={`p-8 rounded-2xl border-2 cursor-pointer transition-all ${paperDesign === 8 ? 'border-rose-500 bg-rose-50/30 shadow-md' : 'border-slate-200 hover:border-rose-300 bg-white'}`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h5 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Style 9: Modern Red</h5>
                      {paperDesign === 8 && <div className="h-6 w-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs"><i className="fa-solid fa-check"></i></div>}
                    </div>
                    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                      <div className="border-t-4 border-rose-600 pt-4 flex justify-between items-start">
                        <div>
                          <h1 className="text-2xl font-black text-rose-900 leading-none uppercase">{brandSettings.schoolName}</h1>
                          <div className="text-[9px] text-rose-500 font-bold mt-2 uppercase tracking-widest">Academic Evaluation</div>
                        </div>
                        <div className="text-right text-[9px] font-serif italic text-slate-500">
                          <div>{brandSettings.studentLabel}: _________</div>
                          <div>{brandSettings.classLabel}: _________</div>
                          <div>{brandSettings.dateLabel}: _________</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Header Design 9b - Modern Green (Default) */}
                  <div 
                    onClick={() => setPaperDesign(18)}
                    className={`p-8 rounded-2xl border-2 cursor-pointer transition-all ${paperDesign === 18 ? 'border-emerald-500 bg-emerald-50/30 shadow-md' : 'border-slate-200 hover:border-emerald-300 bg-white'}`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h5 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Style 9b: Modern Green</h5>
                      {paperDesign === 18 && <div className="h-6 w-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs"><i className="fa-solid fa-check"></i></div>}
                    </div>
                    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                      <div className="border-t-4 border-emerald-600 pt-4 flex justify-between items-start">
                        <div>
                          <h1 className="text-2xl font-black text-emerald-900 leading-none uppercase">{brandSettings.schoolName}</h1>
                          <div className="text-[9px] text-emerald-500 font-bold mt-2 uppercase tracking-widest">Academic Evaluation</div>
                        </div>
                        <div className="text-right text-[9px] font-serif italic text-slate-500">
                          <div>{brandSettings.studentLabel}: _________</div>
                          <div>{brandSettings.classLabel}: _________</div>
                          <div>{brandSettings.dateLabel}: _________</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Header Design 9c - Modern Blue */}
                  <div 
                    onClick={() => setPaperDesign(19)}
                    className={`p-8 rounded-2xl border-2 cursor-pointer transition-all ${paperDesign === 19 ? 'border-blue-500 bg-blue-50/30 shadow-md' : 'border-slate-200 hover:border-blue-300 bg-white'}`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h5 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Style 9c: Modern Blue</h5>
                      {paperDesign === 19 && <div className="h-6 w-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs"><i className="fa-solid fa-check"></i></div>}
                    </div>
                    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                      <div className="border-t-4 border-blue-600 pt-4 flex justify-between items-start">
                        <div>
                          <h1 className="text-2xl font-black text-blue-900 leading-none uppercase">{brandSettings.schoolName}</h1>
                          <div className="text-[9px] text-blue-500 font-bold mt-2 uppercase tracking-widest">Academic Evaluation</div>
                        </div>
                        <div className="text-right text-[9px] font-serif italic text-slate-500">
                          <div>{brandSettings.studentLabel}: _________</div>
                          <div>{brandSettings.classLabel}: _________</div>
                          <div>{brandSettings.dateLabel}: _________</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Header Design 9d - Modern Purple */}
                  <div 
                    onClick={() => setPaperDesign(20)}
                    className={`p-8 rounded-2xl border-2 cursor-pointer transition-all ${paperDesign === 20 ? 'border-purple-500 bg-purple-50/30 shadow-md' : 'border-slate-200 hover:border-purple-300 bg-white'}`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h5 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Style 9d: Modern Purple</h5>
                      {paperDesign === 20 && <div className="h-6 w-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs"><i className="fa-solid fa-check"></i></div>}
                    </div>
                    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                      <div className="border-t-4 border-purple-600 pt-4 flex justify-between items-start">
                        <div>
                          <h1 className="text-2xl font-black text-purple-900 leading-none uppercase">{brandSettings.schoolName}</h1>
                          <div className="text-[9px] text-purple-500 font-bold mt-2 uppercase tracking-widest">Academic Evaluation</div>
                        </div>
                        <div className="text-right text-[9px] font-serif italic text-slate-500">
                          <div>{brandSettings.studentLabel}: _________</div>
                          <div>{brandSettings.classLabel}: _________</div>
                          <div>{brandSettings.dateLabel}: _________</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Header Design 9e - Modern Orange */}
                  <div 
                    onClick={() => setPaperDesign(21)}
                    className={`p-8 rounded-2xl border-2 cursor-pointer transition-all ${paperDesign === 21 ? 'border-orange-500 bg-orange-50/30 shadow-md' : 'border-slate-200 hover:border-orange-300 bg-white'}`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h5 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Style 9e: Modern Orange</h5>
                      {paperDesign === 21 && <div className="h-6 w-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs"><i className="fa-solid fa-check"></i></div>}
                    </div>
                    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                      <div className="border-t-4 border-orange-600 pt-4 flex justify-between items-start">
                        <div>
                          <h1 className="text-2xl font-black text-orange-900 leading-none uppercase">{brandSettings.schoolName}</h1>
                          <div className="text-[9px] text-orange-500 font-bold mt-2 uppercase tracking-widest">Academic Evaluation</div>
                        </div>
                        <div className="text-right text-[9px] font-serif italic text-slate-500">
                          <div>{brandSettings.studentLabel}: _________</div>
                          <div>{brandSettings.classLabel}: _________</div>
                          <div>{brandSettings.dateLabel}: _________</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Header Design 10 - Clean Minimal */}
                  <div 
                    onClick={() => setPaperDesign(9)}
                    className={`p-8 rounded-2xl border-2 cursor-pointer transition-all ${paperDesign === 9 ? 'border-slate-800 bg-slate-50 shadow-md' : 'border-slate-200 hover:border-slate-400 bg-white'}`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h5 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Style 10: Clean Minimal</h5>
                      {paperDesign === 9 && <div className="h-6 w-6 bg-slate-800 text-white rounded-full flex items-center justify-center text-xs"><i className="fa-solid fa-check"></i></div>}
                    </div>
                    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                      <div className="flex flex-col gap-3">
                        <h1 className="text-sm font-medium text-slate-400 border-l-2 border-slate-200 pl-4 uppercase">{brandSettings.schoolName}</h1>
                        <h1 className="text-2xl font-black text-slate-900 leading-none uppercase tracking-tighter">WORKSHEET TITLE</h1>
                        <div className="h-px bg-slate-100 w-full"></div>
                        <div className="flex gap-10 text-[9px] font-bold text-slate-400">
                          <span>{brandSettings.studentLabel}: _________</span>
                          <span>{brandSettings.dateLabel}: _________</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Header Design 11 - School Logo Header */}
                  <div 
                    onClick={() => setPaperDesign(10)}
                    className={`p-8 rounded-2xl border-2 cursor-pointer transition-all ${paperDesign === 10 ? 'border-orange-500 bg-orange-50/30 shadow-md' : 'border-slate-200 hover:border-orange-300 bg-white'}`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h5 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Style 11: School Logo Header</h5>
                      {paperDesign === 10 && <div className="h-6 w-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs"><i className="fa-solid fa-check"></i></div>}
                    </div>
                    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                      <div className="flex items-center gap-4 border-b-2 border-black pb-4">
                        {brandSettings.logoData ? (
                          <img src={brandSettings.logoData} className="h-12 w-12 object-contain" />
                        ) : (
                          <div className="h-12 w-12 bg-slate-100 rounded-lg flex items-center justify-center text-[8px] text-slate-400 font-bold text-center uppercase">Logo</div>
                        )}
                        <div className="flex-1">
                          <h1 className="text-sm font-black uppercase tracking-tight">{brandSettings.schoolName}</h1>
                          <div className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{brandSettings.schoolAddress}</div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <input 
                            type="file" 
                            id="logo-upload-h11" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  setBrandSettings(prev => ({ ...prev, logoData: ev.target?.result as string }));
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <button 
                            onClick={(e) => { e.stopPropagation(); document.getElementById('logo-upload-h11')?.click(); }}
                            className="h-8 w-8 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center hover:bg-orange-100 hover:text-orange-600 transition-all border border-slate-100"
                            title="Upload Logo"
                          >
                            <i className="fa-solid fa-upload text-[10px]"></i>
                          </button>
                          {brandSettings.logoData && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); setBrandSettings(prev => ({ ...prev, logoData: undefined })); }}
                              className="h-8 w-8 bg-slate-50 text-rose-400 rounded-lg flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-all border border-slate-100"
                              title="Remove Logo"
                            >
                              <i className="fa-solid fa-trash text-[10px]"></i>
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 flex gap-4 text-[8px] font-bold text-slate-400">
                        <span>{brandSettings.studentLabel}: _________</span>
                        <span>{brandSettings.dateLabel}: _________</span>
                      </div>
                    </div>
                  </div>

                  {/* Header Design 12 - Royal Gold */}
                  <div 
                    onClick={() => setPaperDesign(11)}
                    className={`p-8 rounded-2xl border-2 cursor-pointer transition-all ${paperDesign === 11 ? 'border-yellow-600 bg-yellow-50/30 shadow-md' : 'border-slate-200 hover:border-yellow-400 bg-white'}`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h5 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Style 12: Royal Gold</h5>
                      {paperDesign === 11 && <div className="h-6 w-6 bg-yellow-600 text-white rounded-full flex items-center justify-center text-xs"><i className="fa-solid fa-check"></i></div>}
                    </div>
                    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                      <div className="border-4 border-yellow-600 p-4 bg-yellow-50">
                        <h1 className="text-center text-lg font-black text-yellow-900 uppercase">{brandSettings.schoolName}</h1>
                        <div className="mt-4 flex justify-between text-[8px] font-bold text-yellow-700">
                          <span>{brandSettings.studentLabel}: _________</span>
                          <span>{brandSettings.scoreLabel}: ____</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Header Design 13 - Deep Ocean */}
                  <div 
                    onClick={() => setPaperDesign(12)}
                    className={`p-8 rounded-2xl border-2 cursor-pointer transition-all ${paperDesign === 12 ? 'border-blue-800 bg-blue-50/30 shadow-md' : 'border-slate-200 hover:border-blue-400 bg-white'}`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h5 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Style 13: Deep Ocean</h5>
                      {paperDesign === 12 && <div className="h-6 w-6 bg-blue-800 text-white rounded-full flex items-center justify-center text-xs"><i className="fa-solid fa-check"></i></div>}
                    </div>
                    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                      <div className="bg-blue-900 text-white p-6 rounded-none">
                        <h1 className="text-xl font-black uppercase tracking-widest mb-2">{brandSettings.schoolName}</h1>
                        <div className="h-1 bg-blue-400 w-1/4 mb-4"></div>
                        <div className="flex gap-4 text-[8px] font-bold opacity-70">
                          <span>{brandSettings.studentLabel}: _________</span>
                          <span>{brandSettings.dateLabel}: _________</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Header Design 14 - Sunset Vibrant */}
                  <div 
                    onClick={() => setPaperDesign(13)}
                    className={`p-8 rounded-2xl border-2 cursor-pointer transition-all ${paperDesign === 13 ? 'border-rose-600 bg-rose-50/30 shadow-md' : 'border-slate-200 hover:border-rose-400 bg-white'}`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h5 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Style 14: Sunset Vibrant</h5>
                      {paperDesign === 13 && <div className="h-6 w-6 bg-rose-600 text-white rounded-full flex items-center justify-center text-xs"><i className="fa-solid fa-check"></i></div>}
                    </div>
                    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                      <div className="bg-gradient-to-r from-rose-600 to-orange-500 text-white p-6 rounded-2xl">
                        <h1 className="text-lg font-black uppercase">{brandSettings.schoolName}</h1>
                        <div className="mt-4 grid grid-cols-2 gap-2 text-[8px] font-bold">
                          <div className="bg-white/20 p-1 rounded">{brandSettings.studentLabel}: _______</div>
                          <div className="bg-white/20 p-1 rounded">{brandSettings.classLabel}: _______</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Header Design 15 - Cyberpunk */}
                  <div 
                    onClick={() => setPaperDesign(14)}
                    className={`p-8 rounded-2xl border-2 cursor-pointer transition-all ${paperDesign === 14 ? 'border-black bg-slate-100 shadow-md' : 'border-slate-200 hover:border-slate-400 bg-white'}`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h5 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Style 15: Cyberpunk</h5>
                      {paperDesign === 14 && <div className="h-6 w-6 bg-black text-white rounded-full flex items-center justify-center text-xs"><i className="fa-solid fa-check"></i></div>}
                    </div>
                    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                      <div className="border-2 border-black p-4 relative">
                        <div className="absolute -top-3 -left-3 bg-black text-white px-2 py-1 text-[8px] font-black uppercase">TOP SECRET</div>
                        <h1 className="text-xl font-black uppercase tracking-tighter mt-2">{brandSettings.schoolName}</h1>
                        <div className="mt-4 flex gap-4 text-[8px] font-mono">
                          <span>&gt; {brandSettings.studentLabel}: _________</span>
                          <span>&gt; {brandSettings.dateLabel}: _________</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Header Design 16 - Academic Heavy */}
                  <div 
                    onClick={() => setPaperDesign(15)}
                    className={`p-8 rounded-2xl border-2 cursor-pointer transition-all ${paperDesign === 15 ? 'border-slate-900 bg-slate-50 shadow-md' : 'border-slate-200 hover:border-slate-400 bg-white'}`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h5 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Style 16: Academic Heavy</h5>
                      {paperDesign === 15 && <div className="h-6 w-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs"><i className="fa-solid fa-check"></i></div>}
                    </div>
                    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                      <div className="border-b-4 border-double border-black pb-4 text-center">
                        <h1 className="text-2xl font-serif font-black uppercase">{brandSettings.schoolName}</h1>
                        <p className="text-[8px] font-serif italic mt-1">Established 1995 • Academic Excellence</p>
                        <div className="mt-4 flex justify-center gap-8 text-[9px] font-bold">
                          <span>{brandSettings.studentLabel}: _________________</span>
                          <span>{brandSettings.dateLabel}: ____/____/____</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Header Design 17 - Art Deco */}
                  <div 
                    onClick={() => setPaperDesign(16)}
                    className={`p-8 rounded-2xl border-2 cursor-pointer transition-all ${paperDesign === 16 ? 'border-indigo-600 bg-indigo-50/30 shadow-md' : 'border-slate-200 hover:border-indigo-400 bg-white'}`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h5 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Style 17: Art Deco</h5>
                      {paperDesign === 16 && <div className="h-6 w-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs"><i className="fa-solid fa-check"></i></div>}
                    </div>
                    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                      <div className="border-8 border-double border-indigo-600 p-4 text-center">
                        <h1 className="text-lg font-black text-indigo-900 uppercase tracking-[0.2em]">{brandSettings.schoolName}</h1>
                        <div className="h-px bg-indigo-200 w-full my-4"></div>
                        <div className="flex justify-between text-[8px] font-bold text-indigo-600 uppercase">
                          <span>{brandSettings.studentLabel}: _______</span>
                          <span>{brandSettings.scoreLabel}: ____</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Header Design 18 - Futuristic */}
                  <div 
                    onClick={() => setPaperDesign(17)}
                    className={`p-8 rounded-2xl border-2 cursor-pointer transition-all ${paperDesign === 17 ? 'border-sky-500 bg-sky-50/30 shadow-md' : 'border-slate-200 hover:border-sky-300 bg-white'}`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h5 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Style 18: Futuristic</h5>
                      {paperDesign === 17 && <div className="h-6 w-6 bg-sky-500 text-white rounded-full flex items-center justify-center text-xs"><i className="fa-solid fa-check"></i></div>}
                    </div>
                    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                      <div className="bg-sky-50 border border-sky-200 p-6 rounded-none relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-sky-500/10 rotate-45 translate-x-8 -translate-y-8"></div>
                        <h1 className="text-xl font-black text-sky-900 uppercase tracking-tighter mb-4">{brandSettings.schoolName}</h1>
                        <div className="flex gap-4 text-[8px] font-bold text-sky-600">
                          <span className="bg-white px-2 py-1 border border-sky-100">{brandSettings.studentLabel}: _________</span>
                          <span className="bg-white px-2 py-1 border border-sky-100">{brandSettings.dateLabel}: _________</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Header Design 19 - Midnight Architect */}
                  <div 
                    onClick={() => setPaperDesign(18)}
                    className={`p-8 rounded-2xl border-2 cursor-pointer transition-all ${paperDesign === 18 ? 'border-slate-800 bg-slate-50 shadow-md' : 'border-slate-200 hover:border-slate-400 bg-white'}`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h5 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Style 19: Midnight Architect</h5>
                      {paperDesign === 18 && <div className="h-6 w-6 bg-slate-800 text-white rounded-full flex items-center justify-center text-xs"><i className="fa-solid fa-check"></i></div>}
                    </div>
                    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                      <div className="bg-slate-800 text-white p-6 flex justify-between items-center">
                        <div>
                          <h1 className="text-lg font-black uppercase tracking-widest">{brandSettings.schoolName}</h1>
                          <p className="text-[8px] opacity-60">Examination Department</p>
                        </div>
                        <div className="text-right text-[8px] font-bold">
                          <div>{brandSettings.studentLabel}: _______</div>
                          <div>{brandSettings.scoreLabel}: ____</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Header Design 20 - Rainbow Gradient */}
                  <div 
                    onClick={() => setPaperDesign(19)}
                    className={`p-8 rounded-2xl border-2 cursor-pointer transition-all ${paperDesign === 19 ? 'border-purple-500 bg-purple-50/30 shadow-md' : 'border-slate-200 hover:border-purple-300 bg-white'}`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h5 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Style 20: Rainbow Gradient</h5>
                      {paperDesign === 19 && <div className="h-6 w-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs"><i className="fa-solid fa-check"></i></div>}
                    </div>
                    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6 rounded-xl">
                        <h1 className="text-center text-lg font-black uppercase tracking-widest">{brandSettings.schoolName}</h1>
                        <div className="mt-4 flex justify-around text-[8px] font-bold">
                          <span>{brandSettings.studentLabel}: _______</span>
                          <span>{brandSettings.dateLabel}: _______</span>
                          <span>{brandSettings.scoreLabel}: ____</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Header Design Style 14 - Royal Gold */}
                  <div 
                    onClick={() => setPaperDesign(14)}
                    className={`p-8 rounded-2xl border-2 cursor-pointer transition-all ${paperDesign === 14 ? 'border-amber-500 bg-amber-50/30 shadow-md' : 'border-slate-200 hover:border-amber-300 bg-white'}`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h5 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Style 10: Royal Gold</h5>
                      {paperDesign === 14 && <div className="h-6 w-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs"><i className="fa-solid fa-check"></i></div>}
                    </div>
                    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                      <div className="border-t-[8px] border-amber-500 pt-4 flex justify-between items-start bg-amber-50/50 p-4">
                        <div>
                          <h1 className="text-2xl font-black text-amber-900 leading-none uppercase">{brandSettings.schoolName}</h1>
                          <div className="text-[9px] text-amber-600 font-bold mt-2 uppercase tracking-widest">Premium Selection</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Header Design Style 15 - Deep Ocean */}
                  <div 
                    onClick={() => setPaperDesign(15)}
                    className={`p-8 rounded-2xl border-2 cursor-pointer transition-all ${paperDesign === 15 ? 'border-blue-900 bg-blue-50/30 shadow-md' : 'border-slate-200 hover:border-blue-800 bg-white'}`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h5 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Style 11: Deep Ocean</h5>
                      {paperDesign === 15 && <div className="h-6 w-6 bg-blue-900 text-white rounded-full flex items-center justify-center text-xs"><i className="fa-solid fa-check"></i></div>}
                    </div>
                    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                      <div className="border-l-[12px] border-blue-900 pl-4 py-4 bg-blue-50">
                          <h1 className="text-2xl font-black text-blue-900 leading-none uppercase">{brandSettings.schoolName}</h1>
                          <div className="text-[9px] text-blue-600 font-bold mt-2 uppercase tracking-widest">Scholastic Archive</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {viewMode === 'ielts_master' && (
        <section 
          style={{ 
            marginLeft: isSidebarOpen && sidebarSide === 'left' ? (windowWidth >= 1024 ? `${sidebarWidth}px` : '0px') : '0px',
            marginRight: isSidebarOpen && sidebarSide === 'right' ? (windowWidth >= 1024 ? `${sidebarWidth}px` : '0px') : '0px'
          }}
          className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-500 bg-slate-50 transition-all duration-300"
        >
          <div className="p-4 lg:p-6 bg-white border-b border-slate-200 flex flex-wrap gap-4 justify-between items-center z-10 no-print shadow-sm">
            <button onClick={() => setViewMode('generator')} className="border border-slate-200 text-slate-600 px-6 lg:px-8 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-slate-50 flex items-center gap-4 group transition-all">
              <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> WORKSPACE
            </button>
            <div className="flex-1 text-center">
              <h2 className="text-slate-800 font-bold uppercase tracking-widest text-[12px]">IELTS Mastermind</h2>
            </div>
            <div className="flex gap-2">
              <a 
                href="https://chanthy-master-engine-gbcdawq79gtmzdw7cqfh7f.streamlit.app/?tool=ielts_master&embed=true" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-orange-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-orange-700 shadow-sm flex items-center gap-2 transition-all"
              >
                <i className="fa-solid fa-arrow-up-right-from-square"></i> Launch Tool
              </a>
            </div>
          </div>
          <div className="flex-1 bg-white overflow-hidden relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center bg-slate-50 -z-10">
              <i className="fa-solid fa-circle-exclamation text-4xl text-slate-300 mb-4"></i>
              <p className="text-slate-500 font-bold text-sm">If the tool refuses to connect, please use the "Launch Tool" button above.</p>
            </div>
            <iframe 
              src="https://chanthy-master-engine-gbcdawq79gtmzdw7cqfh7f.streamlit.app/?tool=ielts_master&embed=true"
              className="w-full h-full min-h-[800px] border-none"
              title="IELTS Master Tool"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-modals allow-top-navigation-by-user-activation"
            />
          </div>
        </section>
      )}

      {viewMode === 'dpss_studio' && (
        <section 
          style={{ 
            marginLeft: isSidebarOpen && sidebarSide === 'left' ? (windowWidth >= 1024 ? `${sidebarWidth}px` : '0px') : '0px',
            marginRight: isSidebarOpen && sidebarSide === 'right' ? (windowWidth >= 1024 ? `${sidebarWidth}px` : '0px') : '0px'
          }}
          className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-500 bg-slate-50 transition-all duration-300"
        >
          <div className="p-4 lg:p-6 bg-white border-b border-slate-200 flex flex-wrap gap-4 justify-between items-center z-10 no-print shadow-sm">
            <button onClick={() => setViewMode('generator')} className="border border-slate-200 text-slate-600 px-6 lg:px-8 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-slate-50 flex items-center gap-4 group transition-all">
              <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> WORKSPACE
            </button>
            <div className="flex-1 text-center">
              <h2 className="text-slate-800 font-bold uppercase tracking-widest text-[12px]">DPSS Studio</h2>
            </div>
            <div className="flex gap-2">
              <a 
                href="https://chanthy-master-engine-gbcdawq79gtmzdw7cqfh7f.streamlit.app/?tool=dpss_studio&embed=true" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-orange-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-orange-700 shadow-sm flex items-center gap-2 transition-all"
              >
                <i className="fa-solid fa-arrow-up-right-from-square"></i> Launch Tool
              </a>
            </div>
          </div>
          <div className="flex-1 bg-white overflow-hidden relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center bg-slate-50 -z-10">
              <i className="fa-solid fa-circle-exclamation text-4xl text-slate-300 mb-4"></i>
              <p className="text-slate-500 font-bold text-sm">If the tool refuses to connect, please use the "Launch Tool" button above.</p>
            </div>
            <iframe 
              src="https://chanthy-master-engine-gbcdawq79gtmzdw7cqfh7f.streamlit.app/?tool=dpss_studio&embed=true"
              className="w-full h-full min-h-[800px] border-none"
              title="DPSS Studio Tool"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-modals allow-top-navigation-by-user-activation"
            />
          </div>
        </section>
      )}
      {!showSettings && isAssistantVisible && (
        <div className="fixed bottom-24 right-6 w-[340px] max-w-[90vw] h-[400px] bg-white/95 backdrop-blur-xl rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 z-[200]">
            <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-800">Live Assistant</span>
              </div>
              <button onClick={() => setIsAssistantVisible(false)} className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 shadow-sm transition-all">
                <i className="fa-solid fa-minus"></i>
              </button>
            </div>
            <div className="flex-1 overflow-hidden p-4">
              <NeuralChatAssistant 
                messages={chatMessages} 
                input={chatInput} 
                onInputChange={setChatInput} 
                onSendMessage={handleAssistantMessage} 
                isGenerating={isGenerating} 
                quickSource={sourceMaterial} 
                inline={true} 
              />
            </div>
        </div>
      )}
      {!showSettings && (
        <button 
          onClick={() => setIsAssistantVisible(!isAssistantVisible)} 
          className={`fixed bottom-6 right-6 h-16 w-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all z-[200] ${isAssistantVisible ? 'bg-orange-600 rotate-90' : 'bg-slate-800 hover:bg-slate-900'}`}
        >
          <i className={`fa-solid ${isAssistantVisible ? 'fa-xmark' : 'fa-wand-magic-sparkles text-xl'}`}></i>
        </button>
      )}

      {/* Add New Type Modal */}
      {showNewTypeModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-900 uppercase tracking-widest">Add New Exercise Type</h3>
              <button onClick={() => setShowNewTypeModal(false)} className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600"><i className="fa-solid fa-xmark"></i></button>
            </div>
            <p className="text-sm text-slate-500 mb-6">Enter the name for your new custom exercise type. This will be added to the <span className="font-bold text-orange-600 uppercase">{architectTab}</span> library.</p>
            <input
              type="text"
              value={newTypeNameInput}
              onChange={(e) => setNewTypeNameInput(e.target.value)}
              placeholder="Exercise Type Name (e.g. MCQ)"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl mb-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newTypeNameInput.trim()) {
                  const catMap: Record<string, string> = {
                    'Grammar': 'GRAMMAR',
                    'Vocabulary': 'VOCABULARY',
                    'Reading': 'READING',
                    'Mixed': 'GENERALS',
                    'Generals': 'GENERALS',
                    'Custom': 'CUSTOM'
                  };
                  const newType: InstructionTemplate = {
                    id: `custom-${Date.now()}`,
                    label: newTypeNameInput.trim(),
                    professionalLabel: `${newTypeNameInput.trim()}.`,
                    prompt: `${newTypeNameInput.trim()}.`,
                    category: (catMap[architectTab] || 'CUSTOM') as any
                  };
                  setInstructionTemplates([...instructionTemplates, newType]);
                  setShowNewTypeModal(false);
                  alert(`Added new ${architectTab} exercise type: ${newTypeNameInput.trim()}`);
                }
              }}
            />
            <div className="flex gap-4">
              <button 
                onClick={() => setShowNewTypeModal(false)}
                className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (newTypeNameInput.trim()) {
                    const catMap: Record<string, string> = {
                      'Grammar': 'GRAMMAR',
                      'Vocabulary': 'VOCABULARY',
                      'Reading': 'READING',
                      'Mixed': 'GENERALS',
                      'Generals': 'GENERALS',
                      'Custom': 'CUSTOM'
                    };
                    const newType: InstructionTemplate = {
                      id: `custom-${Date.now()}`,
                      label: newTypeNameInput.trim(),
                      professionalLabel: `${newTypeNameInput.trim()}.`,
                      prompt: `${newTypeNameInput.trim()}.`,
                      category: (catMap[architectTab] || 'CUSTOM') as any
                    };
                    setInstructionTemplates([...instructionTemplates, newType]);
                    setShowNewTypeModal(false);
                    alert(`Added new ${architectTab} exercise type: ${newTypeNameInput.trim()}`);
                  }
                }}
                disabled={!newTypeNameInput.trim()}
                className="flex-1 py-4 bg-blue-600 text-white font-bold uppercase tracking-widest rounded-2xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-100"
              >
                Create
              </button>
            </div>

            {/* List of custom types in this category with delete button */}
            {instructionTemplates.filter(t => {
                const catMap: Record<string, string> = {
                    'Grammar': 'GRAMMAR',
                    'Vocabulary': 'VOCABULARY',
                    'Reading': 'READING',
                    'Mixed': 'GENERALS',
                    'Generals': 'GENERALS',
                    'Custom': 'CUSTOM'
                };
                const targetCat = catMap[architectTab] || 'CUSTOM';
                return t.category === targetCat && t.id.toString().startsWith('custom-');
            }).length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Manage Custom Types</h4>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                  {instructionTemplates.filter(t => {
                        const catMap: Record<string, string> = {
                            'Grammar': 'GRAMMAR',
                            'Vocabulary': 'VOCABULARY',
                            'Reading': 'READING',
                            'Mixed': 'GENERALS',
                            'Generals': 'GENERALS',
                            'Custom': 'CUSTOM'
                        };
                        const targetCat = catMap[architectTab] || 'CUSTOM';
                        return t.category === targetCat && t.id.toString().startsWith('custom-');
                  }).map(t => (
                    <div key={t.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                      <span className="text-xs font-bold text-slate-700">{t.label}</span>
                      <button 
                        onClick={() => {
                          if (window.confirm(`Delete ${t.label}?`)) {
                            setInstructionTemplates(prev => prev.filter(item => item.id !== t.id));
                          }
                        }}
                        className="h-7 w-7 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                      >
                        <i className="fa-solid fa-trash-can text-[10px]"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showSettings && (
        <div className={`fixed inset-0 z-[250] bg-slate-950/80 backdrop-blur-2xl flex items-start justify-center pt-8 ${isSettingsFullScreen ? 'p-0' : 'p-4'}`}>
          <div className={`bg-[#f8fafc] bg-[radial-gradient(circle_at_top_right,rgba(234,88,12,0.03),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.03),transparent_40%)] overflow-hidden shadow-2xl flex flex-col border border-white/50 transition-all duration-500 ${isSettingsFullScreen ? 'w-full h-full rounded-none' : 'rounded-[48px] lg:rounded-[64px] w-full max-w-4xl h-full max-h-[85vh]'}`}>
             <div className={`${isSettingsFullScreen && settingsTab === 'FORMAT_DESIGN' ? 'hidden' : 'p-4 lg:p-5 pb-0'} flex justify-between items-center`}>
               <div className="flex items-center gap-4">
                 <div className="h-3 w-3 bg-orange-600 rounded-full animate-pulse"></div>
                 <h2 className="text-[11px] font-black uppercase text-slate-900 tracking-widest">Workspace Control Node</h2>
               </div>
               <div className="flex items-center gap-3">
                 <button 
                   onClick={() => setIsSettingsFullScreen(!isSettingsFullScreen)} 
                   className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
                   title={isSettingsFullScreen ? "Exit Full Screen" : "Full Screen"}
                 >
                   <i className={`fa-solid ${isSettingsFullScreen ? 'fa-compress' : 'fa-expand'} text-sm`}></i>
                 </button>
                 <button onClick={() => setShowSettings(false)} className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900"><i className="fa-solid fa-xmark text-xl"></i></button>
               </div>
             </div>
             <div className={`${isSettingsFullScreen && settingsTab === 'FORMAT_DESIGN' ? 'fixed top-2 left-4 z-[300]' : 'px-4 lg:px-8 mb-1'}`}>
               <div className={`flex bg-slate-100/70 p-1 rounded-[32px] gap-1 overflow-x-auto ${isSettingsFullScreen && settingsTab === 'FORMAT_DESIGN' ? 'scale-75 origin-left opacity-50 hover:opacity-100 transition-opacity' : ''}`}>
                 {['COMMAND', 'ACCOUNT', 'ENGINE', 'BACKBONE LOGIC', 'DESIGN', 'FORMAT_DESIGN', 'BACKGROUND', 'LOGO'].map(tab => (
                   <button 
                     key={tab} 
                     onClick={() => setSettingsTab(tab as SettingsTab)} 
                     className={`px-4 lg:px-6 py-2 rounded-[28px] text-[9px] font-black uppercase tracking-widest transition-all ${settingsTab === tab ? 'bg-orange-600 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                     {tab === 'FORMAT_DESIGN' ? 'DESIGN TEST FORMAT' : tab === 'BACKGROUND' ? 'UPLOAD BG' : tab.replace('_', ' ')}
                   </button>
                 ))}
               </div>
             </div>
             {isSettingsFullScreen && settingsTab === 'FORMAT_DESIGN' && (
               <button 
                 onClick={() => setShowSettings(false)} 
                 className="fixed top-4 right-4 z-[300] h-10 w-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-lg"
               >
                 <i className="fa-solid fa-xmark text-xl"></i>
               </button>
             )}
             <div className={`flex-1 overflow-y-auto ${isSettingsFullScreen && settingsTab === 'FORMAT_DESIGN' ? 'px-2 pb-2' : 'px-4 lg:px-8 pb-8'} space-y-4`}>
                {settingsTab === 'FORMAT_DESIGN' && (
                  <div className="h-full min-h-[600px] animate-in fade-in slide-in-from-bottom-6">
                    <FormatDesignEditor 
                      currentStyle={editingCustomDesignId ? customDesigns.find(d => d.id === editingCustomDesignId)?.style : { mcqStyle, mcqLayout, mcqSpacing, paperStyles }}
                      initialName={editingCustomDesignId ? customDesigns.find(d => d.id === editingCustomDesignId)?.name : designTargetName || undefined}
                      designTargetTypeId={editingCustomDesignId ? customDesigns.find(d => d.id === editingCustomDesignId)?.type : designTargetTypeId}
                      initialCategory={(() => {
                        const targetType = editingCustomDesignId ? customDesigns.find(d => d.id === editingCustomDesignId)?.type : designTargetTypeId;
                        if (targetType === 'matching') return 'Vocabulary';
                        if (targetType === 'correct_incorrect') return 'Grammar';
                        if (targetType === 'true_false') return 'Reading';
                        if (targetType === 'mcq') return 'Grammar';
                        if (targetType === 'vocabulary') return 'Vocabulary';
                        if (targetType === 'reading') return 'Reading';
                        return 'General';
                      })() as RuleCategory}
                      onSave={async (design) => {
                        const targetType = editingCustomDesignId ? customDesigns.find(d => d.id === editingCustomDesignId)?.type : designTargetTypeId;
                        const id = editingCustomDesignId || `custom-${Date.now()}`;
                        
                        let normalizedType = targetType || design.category.toLowerCase();
                        if (normalizedType.startsWith('v_matching') || normalizedType.includes('match')) normalizedType = 'matching';
                        else if (normalizedType === 'v_mcq') normalizedType = 'mcq';
                        else if (normalizedType.startsWith('v_')) normalizedType = 'vocabulary';
                        else if (normalizedType === 'correct_incorrect' || normalizedType === 'ci') normalizedType = 'correctIncorrect';
                        else if (normalizedType === 'true_false' || normalizedType === 'tf') normalizedType = 'tf';
                        else if (normalizedType === 'reading' || normalizedType === 'reading_passage') normalizedType = 'readingPassage';
                        else if (normalizedType === 'sentence_completion') normalizedType = 'sentenceCompletion';
                        else if (normalizedType === 'word_box') normalizedType = 'wordBox';
                        else if (normalizedType === 'circle') normalizedType = 'circle';
                        else if (normalizedType === 'cloze') normalizedType = 'cloze';
                        else if (normalizedType === 'double_mcq') normalizedType = 'doubleMcq';

                        const newDesign = {
                            ...design,
                            id,
                            type: normalizedType || 'custom',
                        };

                        await handleSaveCustomDesign(newDesign);
                        
                        // Automatically select the new design
                        const validPaperStyleKeys = ['mcq', 'matching', 'tf', 'correctIncorrect', 'vocabulary', 'readingPassage', 'circle', 'sentenceCompletion', 'wordBox', 'cloze', 'grammar', 'table', 'doubleMcq'];
                        if (validPaperStyleKeys.includes(newDesign.type)) {
                          setPaperStyles(prev => ({ ...prev, [newDesign.type]: newDesign.id }));
                        }

                        // If we were designing for a specific type, link it
                        if (designTargetTypeId) {
                          setCustomExerciseTypes(prev => prev.map(t => 
                            t.id === designTargetTypeId ? { ...t, styleId: newDesign.id } : t
                          ));
                        }

                        setEditingCustomDesignId(null);
                        setDesignTargetTypeId(null);
                        setDesignTargetName(null);
                        setSettingsTab('COMMAND');
                        setShowSettings(false);
                      }}
                    />
                  </div>
                )}
                {settingsTab === 'BACKGROUND' && (
                  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 overflow-hidden">
                    <div className="space-y-8">
                      <div className="flex justify-between items-center">
                        <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-widest">Workspace Atmosphere</h3>
                        <button 
                          onClick={() => {
                            setUserCustomBackground(null);
                            localStorage.removeItem('dp_user_custom_bg');
                          }}
                          className="text-[11px] font-black text-rose-500 uppercase border-b-2 border-rose-500"
                        >
                          Reset to Default
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Custom Backdrop</label>
                           <div 
                             onClick={() => bgUploadRef.current?.click()}
                             className="group relative h-64 w-full bg-slate-100 border-4 border-dashed border-slate-200 rounded-[48px] overflow-hidden cursor-pointer hover:border-orange-500 transition-all flex items-center justify-center"
                           >
                             {userCustomBackground ? (
                               <img src={userCustomBackground} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />
                             ) : (
                               <div className="flex flex-col items-center gap-4">
                                 <i className="fa-solid fa-cloud-arrow-up text-5xl text-slate-300"></i>
                                 <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Upload Custom Experience</span>
                               </div>
                             )}
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                               <span className="bg-white px-6 py-2 rounded-full text-[10px] font-black uppercase text-slate-900 shadow-xl">Change Background</span>
                             </div>
                           </div>
                           <p className="text-[10px] font-medium text-slate-400 italic px-4">Upload a high-quality JPG/PNG to personalize your entire workstation atmosphere.</p>
                        </div>

                        <div className="space-y-8">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Atmosphere Fidelity</label>
                          <div className="space-y-4 p-8 bg-slate-50 rounded-[40px] border border-slate-100">
                             <div className="flex items-center justify-between">
                                <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Enable Atmosphere Layer</span>
                                <button 
                                  onClick={() => setIsRelaxingBackgroundEnabled(!isRelaxingBackgroundEnabled)}
                                  className={`w-12 h-6 rounded-full transition-all relative ${isRelaxingBackgroundEnabled ? 'bg-orange-600 shadow-lg shadow-orange-100' : 'bg-slate-300'}`}
                                >
                                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isRelaxingBackgroundEnabled ? 'left-7' : 'left-1'}`}></div>
                                </button>
                             </div>
                             <div className="h-px bg-slate-200 w-full"></div>
                             <div className="flex items-center justify-between">
                                <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Atmosphere Blur</span>
                                <div className="flex items-center gap-4">
                                  <div className="h-1.5 w-32 bg-slate-200 rounded-full overflow-hidden">
                                     <div className="h-full bg-orange-600 w-1/3"></div>
                                  </div>
                                  <span className="text-[11px] font-black text-slate-400 uppercase">2px</span>
                                </div>
                             </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-3">
                             {[
                               "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop",
                               "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop",
                               "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop"
                             ].map(img => (
                               <div 
                                 key={img}
                                 onClick={() => {
                                   setUserCustomBackground(null);
                                   localStorage.removeItem('dp_user_custom_bg');
                                   setCurrentBackground(img);
                                 }}
                                 className="h-16 rounded-2xl bg-cover bg-center cursor-pointer hover:ring-2 ring-orange-500 transition-all border border-white"
                                 style={{ backgroundImage: `url('${img}')` }}
                               ></div>
                             ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {settingsTab === 'LOGO' && (
                  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6">
                    <div className="space-y-8">
                      <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-widest">Branding & Logo Registry</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">School Identity</label>
                          <input value={brandSettings.schoolName} onChange={e => setBrandSettings({ ...brandSettings, schoolName: e.target.value })} className="w-full bg-slate-100 border border-slate-200 rounded-3xl px-8 py-5 text-[14px] font-black text-slate-900 uppercase focus:border-orange-500 outline-none" placeholder="School Name" />
                          <input value={brandSettings.schoolAddress} onChange={e => setBrandSettings({ ...brandSettings, schoolAddress: e.target.value })} className="w-full bg-slate-100 border border-slate-200 rounded-3xl px-8 py-5 text-[14px] font-black text-slate-900 uppercase focus:border-orange-500 outline-none" placeholder="Address / Motto" />
                        </div>
                        <div className="space-y-6">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Header Logo (A4 Precision)</label>
                          <div className="border-4 border-dashed border-slate-200 rounded-[48px] p-10 flex flex-col items-center justify-center gap-6 hover:border-orange-500 transition-all cursor-pointer relative" onClick={() => logoUploadRef.current?.click()}>
                            {brandSettings.logoData ? <img src={brandSettings.logoData} className="max-h-24 w-auto rounded-xl" /> : <i className="fa-solid fa-cloud-arrow-up text-4xl text-slate-300"></i>}
                            <span className="text-[10px] font-black text-slate-400 uppercase">Upload Header Graphic</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="flex justify-between items-center px-2">
                        <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-widest">Neural Logo Registry ({brandSettings.logos.filter(l => !!l).length} / {brandSettings.logos.length})</h3>
                        <div className="flex gap-4">
                          <button onClick={() => { if(window.confirm("Clear all logos to free up space?")) setBrandSettings(prev => ({ ...prev, logos: Array(30).fill(undefined) })); }} className="text-[11px] font-black text-rose-500 uppercase border-b-2 border-rose-500">Clear All</button>
                          <button onClick={() => logoUploadRef.current?.click()} className="text-[11px] font-black text-orange-600 uppercase border-b-2 border-orange-600">+ Add Logo</button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {brandSettings.logos.map((logo, idx) => (
                          <div key={idx} className={`aspect-video rounded-3xl border-2 flex items-center justify-center relative group overflow-hidden transition-all ${logo ? 'border-slate-200 bg-white' : 'border-dashed border-slate-100 bg-slate-50/50'}`}>
                            {logo ? (
                              <>
                                <img src={logo} className="max-h-full max-w-full p-4 object-contain" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                  <button onClick={() => setBrandSettings(prev => ({ ...prev, logoData: logo }))} className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-slate-900 hover:bg-orange-500 hover:text-white transition-all shadow-lg"><i className="fa-solid fa-eye"></i></button>
                                  <button onClick={() => removeLogo(idx)} className="h-10 w-10 bg-rose-500 rounded-full flex items-center justify-center text-white hover:bg-rose-600 transition-all shadow-lg"><i className="fa-solid fa-trash-can"></i></button>
                                </div>
                              </>
                            ) : (
                              <div 
                                onClick={() => logoUploadRef.current?.click()} 
                                className="w-full h-full flex items-center justify-center cursor-pointer group/slot"
                              >
                                <i className="fa-solid fa-plus text-2xl text-slate-200 group-hover/slot:text-orange-500 transition-colors"></i>
                              </div>
                            )}
                            <div className="absolute bottom-3 left-4 text-[8px] font-black text-slate-300 uppercase tracking-widest">Slot {idx + 1}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-8 pt-10 border-t border-slate-100">
                      <div className="flex justify-between items-center px-2">
                        <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-widest">Custom Header & Footer Styles</h3>
                        <button 
                          onClick={(e) => {
                            e.currentTarget.innerText = "Saved!";
                            setTimeout(() => {
                                if(e.target) (e.target as HTMLElement).innerText = "Save as Template";
                            }, 2000);
                          }}
                          className="text-[11px] font-black text-emerald-600 uppercase border-b-2 border-emerald-600"
                        >
                          Save as Template
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-white border-2 border-slate-200 rounded-3xl hover:border-orange-500 transition-all cursor-pointer group">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-600 transition-all">
                              <i className="fa-solid fa-heading"></i>
                            </div>
                            <span className="text-[10px] font-black uppercase text-slate-900">Classic Centered</span>
                          </div>
                          <div className="h-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 p-4">
                            <div className="h-2 w-24 bg-slate-300 rounded-full"></div>
                            <div className="h-1.5 w-32 bg-slate-200 rounded-full"></div>
                          </div>
                        </div>
                        <div className="p-6 bg-white border-2 border-slate-200 rounded-3xl hover:border-orange-500 transition-all cursor-pointer group">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-600 transition-all">
                              <i className="fa-solid fa-align-left"></i>
                            </div>
                            <span className="text-[10px] font-black uppercase text-slate-900">Modern Left-Aligned</span>
                          </div>
                          <div className="h-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-start justify-center gap-1 p-4">
                            <div className="h-2 w-24 bg-slate-300 rounded-full"></div>
                            <div className="h-1.5 w-32 bg-slate-200 rounded-full"></div>
                          </div>
                        </div>
                        <div className="p-6 bg-white border-2 border-slate-200 rounded-3xl hover:border-orange-500 transition-all cursor-pointer group">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-600 transition-all">
                              <i className="fa-solid fa-columns"></i>
                            </div>
                            <span className="text-[10px] font-black uppercase text-slate-900">Split Header</span>
                          </div>
                          <div className="h-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-between p-4">
                            <div className="h-8 w-8 bg-slate-300 rounded-lg"></div>
                            <div className="flex flex-col items-end gap-1">
                              <div className="h-2 w-16 bg-slate-300 rounded-full"></div>
                              <div className="h-1.5 w-20 bg-slate-200 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {settingsTab === 'COMMAND' && (
                   <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6">
                     <div className="flex justify-between items-center px-2"><h3 className="text-[13px] font-black text-slate-900 uppercase tracking-widest">Instruction Templates</h3><button onClick={addTemplate} className="text-[11px] font-black text-orange-600 uppercase border-b-2 border-orange-600">+ New Part</button></div>
                     <div className="flex bg-slate-100/50 p-1.5 rounded-[24px] gap-1 overflow-x-auto no-scrollbar shadow-sm border border-slate-100 self-start">{['GRAMMAR', 'VOCABULARY', 'READING', 'GENERALS', 'TABLES', 'KIDS'].map(cat => (<button key={cat} onClick={() => setActiveTemplateCategory(cat)} className={`px-6 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTemplateCategory === cat ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>{cat}</button>))}</div>
                     <div className="space-y-3">
                        {instructionTemplates.filter(t => t.category === activeTemplateCategory).map(t => {
                            const isExpanded = expandedTemplateId === t.id;
                            return (
                              <div key={t.id} className={`bg-white border rounded-[32px] overflow-hidden transition-all duration-300 ${isExpanded ? 'border-orange-200 shadow-xl' : 'border-slate-100 shadow-sm'}`}>
                                 <div className="p-6 lg:p-8 cursor-pointer flex items-center justify-between" onClick={() => setExpandedTemplateId(isExpanded ? null : t.id)}><div className="flex items-center gap-4 flex-1"><div className={`h-8 w-8 rounded-full flex items-center justify-center transition-transform ${isExpanded ? 'rotate-90 bg-orange-600 text-white' : 'bg-slate-50 text-slate-400'}`}><i className="fa-solid fa-chevron-right text-[10px]"></i></div><div className="flex flex-col gap-0.5"><div className={`text-[13px] font-black uppercase tracking-wide transition-colors ${isExpanded ? 'text-orange-600' : 'text-slate-900'}`}>{t.label}</div>{!isExpanded && <div className="text-[9px] font-black text-slate-300 uppercase line-clamp-1">{t.prompt.slice(0, 100)}...</div>}</div></div><div className="flex items-center gap-3"><div className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-400 text-[8px] font-black uppercase">{t.category}</div>{isExpanded && <button onClick={() => deleteTemplate(t.id)} className="h-8 w-8 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"><i className="fa-solid fa-trash-can text-[10px]"></i></button>}</div></div>
                                 {isExpanded && (<div className="px-8 pb-8 space-y-6 animate-in fade-in slide-in-from-top-4"><div className="h-px bg-slate-100 w-full mb-6"></div><div className="space-y-4"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Display Name</label><input value={t.label} onChange={e => updateTemplate(t.id, { label: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-orange-500 font-bold text-slate-700" /></div><div className="space-y-4"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Neural Prompt Logic</label><textarea value={t.prompt} onChange={e => updateTemplate(t.id, { prompt: e.target.value })} className="w-full h-32 bg-slate-50 border border-slate-100 rounded-3xl p-6 text-[11px] text-slate-600 font-medium italic outline-none resize-none focus:bg-white transition-all" /></div></div>)}
                              </div>
                            );
                        })}
                     </div>
                   </div>
                )}
                {settingsTab === 'ENGINE' && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6">
                    <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-widest">Neural Core Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { id: NeuralEngine.GEMINI_3_FLASH_LITE, name: 'Gemini 3.1 Flash Lite', desc: 'Ultra-fast, low-latency generation.' },
                        { id: NeuralEngine.GEMINI_3_FLASH, name: 'Gemini 3 Flash', desc: 'High-speed, balanced reasoning.' },
                        { id: NeuralEngine.GEMINI_3_PRO, name: 'Gemini 3 Pro', desc: 'Maximum intelligence for complex tests.' },
                        { id: NeuralEngine.GPT_4O, name: 'GPT-4o', desc: 'Advanced multimodal capabilities.' },
                        { id: NeuralEngine.GROK_3, name: 'Grok 3', desc: 'Real-time knowledge and reasoning.' },
                        { id: NeuralEngine.DEEPSEEK_V3, name: 'DeepSeek V3', desc: 'Efficient large-scale processing.' }
                      ].map(engine => (
                        <div key={engine.id} className={`p-8 rounded-[40px] border-2 transition-all ${activeEngine === engine.id ? 'bg-white border-orange-600 shadow-xl' : 'bg-slate-50 border-slate-100'}`}>
                          <div className="flex justify-between items-start mb-6">
                            <div className="space-y-1">
                              <div className="text-[14px] font-black text-slate-900 uppercase">{engine.name}</div>
                              <div className="text-[10px] font-medium text-slate-400">{engine.desc}</div>
                            </div>
                            {activeEngine === engine.id && <div className="h-6 w-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-[10px]"><i className="fa-solid fa-check"></i></div>}
                          </div>
                          <div className="space-y-4">
                            {(engine.id === NeuralEngine.GEMINI_3_FLASH_LITE || engine.id === NeuralEngine.GEMINI_3_FLASH || engine.id === NeuralEngine.GEMINI_3_PRO) && (
                              <button 
                                onClick={async () => {
                                  if ((window as any).aistudio?.openSelectKey) {
                                    await (window as any).aistudio.openSelectKey();
                                  } else {
                                    alert("The 'Select AI Studio Key' feature only works when you are using the app inside the AI Studio preview pane. \n\nIf you are viewing the app at the Shared URL directly, you must set a 'GEMINI_API_KEY' in your environment variables for it to work standalone.");
                                  }
                                }}
                                className="w-full bg-slate-100 border border-slate-200 text-slate-600 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                              >
                                <i className="fa-solid fa-key"></i>
                                Select AI Studio Key
                              </button>
                            )}
                            <input 
                              type="password"
                              value={externalKeys[engine.id as keyof ExternalKeys] || ''} 
                              onChange={e => setExternalKeys({ ...externalKeys, [engine.id]: e.target.value })}
                              placeholder={ (engine.id === NeuralEngine.GEMINI_3_FLASH_LITE || engine.id === NeuralEngine.GEMINI_3_FLASH || engine.id === NeuralEngine.GEMINI_3_PRO) ? "Or Paste Custom Gemini Key" : "Custom API Key (Optional)" }
                              className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-3 text-[11px] outline-none focus:border-orange-500"
                            />
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setActiveEngine(engine.id as NeuralEngine)}
                                className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeEngine === engine.id ? 'bg-orange-600 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-400 hover:text-slate-900'}`}
                              >
                                {activeEngine === engine.id ? 'Currently Active' : 'Switch Engine'}
                              </button>
                              {externalKeys[engine.id as keyof ExternalKeys] && (
                                <button 
                                  onClick={() => {
                                    const newKeys = { ...externalKeys };
                                    delete newKeys[engine.id as keyof ExternalKeys];
                                    setExternalKeys(newKeys);
                                  }}
                                  className="px-4 py-3 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase hover:bg-red-100 transition-all"
                                  title="Clear Custom Key"
                                >
                                  <i className="fa-solid fa-trash-can"></i>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {settingsTab === 'DESIGN' && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6">
                    <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-widest">Typography & Layout</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Font</label>
                        <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto p-2 bg-slate-100 rounded-2xl no-scrollbar">
                          {FONTS.map(font => (
                            <button 
                              key={font.name} 
                              onClick={() => setBrandSettings({ ...brandSettings, activeFont: font.name })} 
                              className={`py-2 px-3 rounded-xl text-[10px] font-black transition-all text-left truncate ${brandSettings.activeFont === font.name ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                              style={{ fontFamily: font.family }}
                            >
                              {font.name}
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center justify-between px-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Randomize on Generate</span>
                          <button 
                            onClick={() => setBrandSettings({ ...brandSettings, randomizeFont: !brandSettings.randomizeFont })}
                            className={`w-12 h-6 rounded-full transition-all relative ${brandSettings.randomizeFont ? 'bg-orange-600' : 'bg-slate-200'}`}
                          >
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${brandSettings.randomizeFont ? 'left-7' : 'left-1'}`}></div>
                          </button>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Font Size (px)</label>
                        <div className="flex items-center gap-4">
                          <input type="range" min="8" max="24" value={brandSettings.fontSize} onChange={e => setBrandSettings({ ...brandSettings, fontSize: parseInt(e.target.value) })} className="flex-1 accent-orange-600" />
                          <span className="text-xl font-black text-slate-900 w-12">{brandSettings.fontSize}</span>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Font Weight</label>
                        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
                          {['400', '500', '600', '700', '800', '900'].map(weight => (
                            <button key={weight} onClick={() => setBrandSettings({ ...brandSettings, fontWeight: weight })} className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all ${brandSettings.fontWeight === weight ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>{weight}</button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-6">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Letter Spacing</label>
                        <div className="flex items-center gap-4">
                          <input type="range" min="-2" max="10" step="0.5" value={brandSettings.letterSpacing} onChange={e => setBrandSettings({ ...brandSettings, letterSpacing: parseFloat(e.target.value) })} className="flex-1 accent-orange-600" />
                          <span className="text-xl font-black text-slate-900 w-12">{brandSettings.letterSpacing}</span>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Line Spacing</label>
                        <div className="flex items-center gap-4">
                          <input type="range" min="0.8" max="3" step="0.05" value={brandSettings.lineHeight} onChange={e => setBrandSettings({ ...brandSettings, lineHeight: e.target.value })} className="flex-1 accent-orange-600" />
                          <span className="text-xl font-black text-slate-900 w-12">{brandSettings.lineHeight}</span>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Text Transform</label>
                        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
                          {['none', 'uppercase', 'capitalize'].map(transform => (
                            <button key={transform} onClick={() => setBrandSettings({ ...brandSettings, textTransform: transform as any })} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${brandSettings.textTransform === transform ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>{transform}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Worksheet Theme</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {THEMES.map(theme => (
                          <button key={theme.id} onClick={() => setActiveThemeId(theme.id)} className={`p-4 rounded-2xl border-2 transition-all text-left space-y-2 ${activeThemeId === theme.id ? 'border-orange-600 bg-white shadow-lg' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}>
                            <div className="w-full h-2 rounded-full" style={{ backgroundColor: theme.color }}></div>
                            <div className="text-[10px] font-black uppercase text-slate-900 truncate">{theme.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-8 pt-6 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-widest">Table & Column Styles</h3>
                        <button 
                          onClick={() => {
                            setDesignTargetTypeId('table');
                            setSettingsTab('FORMAT_DESIGN');
                            setShowSettings(true);
                          }}
                          className="px-4 py-2 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-orange-700 transition-all shadow-lg shadow-orange-200"
                        >
                          <i className="fa-solid fa-plus"></i> Add NEW
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(style => (
                          <button 
                            key={style} 
                            onClick={() => setDefaultColumnCount(style === 1 ? 1 : 2)}
                            className={`p-4 rounded-2xl border-2 transition-all text-left space-y-2 ${defaultColumnCount === (style === 1 ? 1 : 2) ? 'border-orange-600 bg-white shadow-lg' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
                          >
                            <div className="text-[10px] font-black uppercase text-slate-900">Style {style}</div>
                            <div className="text-[9px] font-bold text-slate-400 uppercase">{style === 1 ? '1 Column' : '2 Columns'}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-8 pt-6 border-t border-slate-100">
                      <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-widest">Header & Footer Customization</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Custom Header Text (Overrides Default)</label>
                          <input value={brandSettings.customHeaderText || ''} onChange={e => setBrandSettings({ ...brandSettings, customHeaderText: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-orange-500 font-bold text-slate-700" placeholder="e.g. FINAL TERM EXAMINATION - SEMESTER 1" />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Header Divider Style</label>
                          <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1 overflow-x-auto no-scrollbar">
                            {[0, 1, 2, 3, 4, 5, 6].map(style => (
                              <button key={style} onClick={() => setBrandSettings({ ...brandSettings, headerRulerStyle: style })} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all shrink-0 ${brandSettings.headerRulerStyle === style ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400'}`}>
                                {style === 0 ? 'None' : `Divider ${style}`}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Main Title (School Name)</label>
                          <input value={brandSettings.schoolName} onChange={e => setBrandSettings({ ...brandSettings, schoolName: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-orange-500 font-bold text-slate-700" placeholder="e.g. HARVARD ACADEMY" />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Footer Text</label>
                          <input value={brandSettings.footerText} onChange={e => setBrandSettings({ ...brandSettings, footerText: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-orange-500 font-bold text-slate-700" placeholder="e.g. Confidential - Academic Use Only" />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Student Label</label>
                          <input value={brandSettings.studentLabel} onChange={e => setBrandSettings({ ...brandSettings, studentLabel: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-orange-500 font-bold text-slate-700" placeholder="e.g. NAME" />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">ID Label</label>
                          <input value={brandSettings.idLabel} onChange={e => setBrandSettings({ ...brandSettings, idLabel: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-orange-500 font-bold text-slate-700" placeholder="e.g. STUDENT ID" />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Score Label</label>
                          <input value={brandSettings.scoreLabel} onChange={e => setBrandSettings({ ...brandSettings, scoreLabel: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-orange-500 font-bold text-slate-700" placeholder="e.g. TOTAL SCORE" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Date Label</label>
                            <input value={brandSettings.dateLabel} onChange={e => setBrandSettings({ ...brandSettings, dateLabel: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-orange-500 font-bold text-slate-700" placeholder="DATE" />
                          </div>
                          <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Class Label</label>
                            <input value={brandSettings.classLabel} onChange={e => setBrandSettings({ ...brandSettings, classLabel: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-orange-500 font-bold text-slate-700" placeholder="CLASS" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {settingsTab === 'BACKBONE LOGIC' && (
                  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="space-y-8">
                       <div className="flex justify-between items-center px-2">
                         <h3 className="text-[13px] font-black text-master-green uppercase tracking-widest">Master Protocols</h3>
                         {!(session?.code === 'dpss' || session?.code === 'gratitude' || session?.code === 'virtues') && (
                           <div className="flex items-center gap-2 text-rose-500 animate-pulse">
                             <i className="fa-solid fa-lock text-[10px]"></i>
                             <span className="text-[10px] font-black uppercase tracking-widest">Restricted Access</span>
                           </div>
                         )}
                         {(session?.code === 'dpss' || session?.code === 'gratitude' || session?.code === 'virtues') && (
                           <button onClick={addProtocol} className="text-[11px] font-black text-master-green uppercase border-b-2 border-master-green">+ New Protocol</button>
                         )}
                       </div>
                       {(session?.code === 'dpss' || session?.code === 'gratitude' || session?.code === 'virtues') ? (
                         <>
                           <div className="flex bg-slate-100/50 p-1.5 rounded-[24px] gap-1 overflow-x-auto no-scrollbar shadow-sm border border-slate-100 self-start">
                             {['General', 'Grammar', 'Vocabulary', 'Reading', 'Generals'].map(cat => (
                               <button key={cat} onClick={() => setActiveProtocolCategory(cat as RuleCategory)} className={`px-6 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${activeProtocolCategory === cat ? 'bg-master-green text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>{cat}</button>
                             ))}
                           </div>
                           <div className="space-y-3">
                             {masterProtocols.filter(p => p.category === activeProtocolCategory).map(p => {
                               const isExpanded = expandedProtocolId === p.id;
                               return (
                                 <div key={p.id} className={`bg-white border rounded-[32px] overflow-hidden transition-all duration-300 ${isExpanded ? 'border-master-green/30 shadow-xl' : 'border-slate-100 shadow-sm'}`}>
                                   <div className="p-6 lg:p-8 cursor-pointer flex items-center justify-between" onClick={() => setExpandedProtocolId(isExpanded ? null : p.id)}>
                                     <div className="flex items-center gap-4 flex-1">
                                       <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-transform ${isExpanded ? 'rotate-90 bg-master-green text-white' : 'bg-slate-50 text-slate-400'}`}>
                                         <i className="fa-solid fa-chevron-right text-[10px]"></i>
                                       </div>
                                       <div className="flex flex-col gap-0.5">
                                         <div className={`text-[13px] font-black uppercase tracking-wide transition-colors ${isExpanded ? 'text-master-green' : 'text-slate-900'}`}>{p.label}</div>
                                         {!isExpanded && <div className="text-[9px] font-black text-slate-300 uppercase line-clamp-1">{p.promptInjection.slice(0, 100)}...</div>}
                                       </div>
                                     </div>
                                     <div className="flex items-center gap-3">
                                       <button 
                                         onClick={(e) => { e.stopPropagation(); updateProtocol(p.id, { priority: cyclePriority(p.priority) }); }}
                                         className={`px-3 py-1 rounded-full text-[8px] font-black uppercase transition-all hover:scale-105 ${p.priority === 'High' ? 'bg-rose-100 text-rose-600' : p.priority === 'Medium' ? 'bg-orange-100 text-orange-600' : p.priority === 'Average' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}
                                       >
                                         {p.priority}
                                       </button>
                                       <button 
                                         onClick={(e) => { e.stopPropagation(); updateProtocol(p.id, { active: !p.active }); }} 
                                         className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase transition-all ${p.active ? 'bg-master-green/10 text-master-green' : 'bg-slate-100 text-slate-400'}`}
                                       >
                                         {p.active ? 'Active' : 'Disabled'}
                                       </button>
                                       {isExpanded && <button onClick={(e) => { e.stopPropagation(); deleteProtocol(p.id); }} className="h-8 w-8 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"><i className="fa-solid fa-trash-can text-[10px]"></i></button>}
                                     </div>
                                   </div>
                                   {isExpanded && (
                                     <div className="px-8 pb-8 space-y-6 animate-in fade-in slide-in-from-top-4">
                                       <div className="h-px bg-slate-100 w-full mb-6"></div>
                                       <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Protocol Name</label>
                                            <input value={p.label} onChange={e => updateProtocol(p.id, { label: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-master-green font-bold text-slate-700" />
                                          </div>
                                          <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Priority Level</label>
                                            <button 
                                              onClick={() => updateProtocol(p.id, { priority: cyclePriority(p.priority) })}
                                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none hover:border-master-green font-bold text-slate-700 uppercase text-left flex justify-between items-center"
                                            >
                                              <span>{p.priority}</span>
                                              <i className="fa-solid fa-rotate text-[10px] text-slate-300"></i>
                                            </button>
                                          </div>
                                       </div>
                                       <div className="space-y-4">
                                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Protocol Logic</label>
                                         <textarea value={p.promptInjection} onChange={e => updateProtocol(p.id, { promptInjection: e.target.value })} className="w-full h-32 bg-slate-50 border border-slate-100 rounded-3xl p-6 text-[11px] text-slate-600 font-medium italic outline-none resize-none focus:bg-white transition-all" />
                                       </div>
                                     </div>
                                   )}
                                 </div>
                               );
                             })}
                           </div>
                         </>
                       ) : (
                         <div className="p-12 border-2 border-dashed border-slate-100 rounded-[40px] flex flex-col items-center justify-center gap-4 bg-slate-50/50">
                           <i className="fa-solid fa-shield-halved text-slate-200 text-4xl"></i>
                           <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Neural Protocols Encrypted</div>
                           <div className="text-[9px] font-medium text-slate-400 text-center max-w-[200px]">Please authenticate with a Master code to modify core protocols.</div>
                         </div>
                       )}
                    </div>
                     <div className="space-y-8">
                        <div className="flex justify-between items-center px-2">
                          <h3 className="text-[13px] font-black text-strict-purple uppercase tracking-widest">Logic Node Registry</h3>
                          <button onClick={addRule} className="text-[11px] font-black text-strict-purple uppercase border-b-2 border-strict-purple">+ New Logic Node</button>
                        </div>
                        <div className="flex bg-slate-100/50 p-1.5 rounded-[24px] gap-1 overflow-x-auto no-scrollbar shadow-sm border border-slate-100 self-start">
                          {['General', 'Grammar', 'Vocabulary', 'Reading', 'Generals'].map(cat => (
                            <button key={cat} onClick={() => setActiveLogicCategory(cat as RuleCategory)} className={`px-6 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${activeLogicCategory === cat ? 'bg-strict-purple text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>{cat}</button>
                          ))}
                        </div>
                        <div className="space-y-3">
                          {strictRules.filter(rule => rule.category === activeLogicCategory).map(rule => {
                            const isExpanded = expandedRuleId === rule.id;
                            return (
                              <div key={rule.id} className={`bg-white border rounded-[32px] overflow-hidden transition-all duration-300 ${isExpanded ? 'border-strict-purple/30 shadow-xl' : 'border-slate-100 shadow-sm'}`}>
                                <div className="p-6 lg:p-8 cursor-pointer flex items-center justify-between" onClick={() => setExpandedRuleId(isExpanded ? null : rule.id)}>
                                  <div className="flex items-center gap-4 flex-1">
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-transform ${isExpanded ? 'rotate-90 bg-strict-purple text-white' : 'bg-slate-50 text-slate-400'}`}>
                                      <i className="fa-solid fa-chevron-right text-[10px]"></i>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                      <div className={`text-[13px] font-black uppercase tracking-wide transition-colors ${isExpanded ? 'text-strict-purple' : 'text-slate-900'}`}>{rule.label}</div>
                                      {!isExpanded && <div className="text-[9px] font-black text-slate-300 uppercase line-clamp-1">{rule.promptInjection.slice(0, 100)}...</div>}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); updateRule(rule.id, { priority: cyclePriority(rule.priority) }); }}
                                      className={`px-3 py-1 rounded-full text-[8px] font-black uppercase transition-all hover:scale-105 ${rule.priority === 'High' ? 'bg-rose-100 text-rose-600' : rule.priority === 'Medium' ? 'bg-orange-100 text-orange-600' : rule.priority === 'Average' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}
                                    >
                                      {rule.priority}
                                    </button>
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); updateRule(rule.id, { active: !rule.active }); }} 
                                      className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase transition-all ${rule.active ? 'bg-strict-purple/10 text-strict-purple' : 'bg-slate-100 text-slate-400'}`}
                                    >
                                      {rule.active ? 'Active' : 'Disabled'}
                                    </button>
                                    {isExpanded && <button onClick={(e) => { e.stopPropagation(); deleteRule(rule.id); }} className="h-8 w-8 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"><i className="fa-solid fa-trash-can text-[10px]"></i></button>}
                                  </div>
                                </div>
                                {isExpanded && (
                                  <div className="px-8 pb-8 space-y-6 animate-in fade-in slide-in-from-top-4">
                                    <div className="h-px bg-slate-100 w-full mb-6"></div>
                                    <div className="grid grid-cols-2 gap-4">
                                       <div className="space-y-4">
                                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Logic Name</label>
                                         <input value={rule.label} onChange={e => updateRule(rule.id, { label: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-strict-purple font-bold text-slate-700" />
                                       </div>
                                       <div className="space-y-4">
                                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Priority Level</label>
                                         <button 
                                           onClick={() => updateRule(rule.id, { priority: cyclePriority(rule.priority) })}
                                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none hover:border-strict-purple font-bold text-slate-700 uppercase text-left flex justify-between items-center"
                                         >
                                           <span>{rule.priority}</span>
                                           <i className="fa-solid fa-rotate text-[10px] text-slate-300"></i>
                                         </button>
                                       </div>
                                    </div>
                                    <div className="space-y-4">
                                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Prompt Injection</label>
                                      <textarea value={rule.promptInjection} onChange={e => updateRule(rule.id, { promptInjection: e.target.value })} className="w-full h-32 bg-slate-50 border border-slate-100 rounded-3xl p-6 text-[11px] text-slate-600 font-medium italic outline-none resize-none focus:bg-white transition-all" />
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                     </div>
                  </div>
                )}
                {settingsTab === 'ACCOUNT' && (
                  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    {!isFirebaseConnected && (
                      <div className="bg-rose-50 border border-rose-100 p-8 rounded-[32px] space-y-4">
                        <div className="flex items-center gap-4 text-rose-600">
                          <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
                          <h4 className="font-black uppercase tracking-widest text-sm">Cloud Connection Error</h4>
                        </div>
                        <p className="text-rose-500 text-[11px] font-bold leading-relaxed">
                          Your application is unable to connect to the Firebase cloud. This usually happens if you haven't set up your environment variables (like GEMINI_API_KEY or Firebase config) on your hosting provider (e.g., Vercel).
                          <br/><br/>
                          If you are seeing this on a published site, please ensure you have copied the <code className="bg-rose-100 px-2 py-0.5 rounded">firebase-applet-config.json</code> values to your environment.
                        </p>
                      </div>
                    )}
                    <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-8">
                      <div className="flex items-center gap-6">
                        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 text-2xl">
                          <i className="fa-solid fa-cloud"></i>
                        </div>
                        <div>
                          <h3 className="text-[16px] font-black text-slate-900 uppercase tracking-widest">Cloud Sync Status</h3>
                          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Sync your branding and history across devices</p>
                        </div>
                      </div>

                      <div className="h-px bg-slate-100 w-full"></div>

                      {session?.email && session.email !== 'public@dpss.edu' ? (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-black">
                                {session.name.charAt(0)}
                              </div>
                              <div>
                                <div className="text-[13px] font-black text-slate-900 uppercase">{session.name}</div>
                                <div className="text-[10px] font-medium text-slate-400">{session.email}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                              <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Connected</span>
                            </div>
                          </div>
                          <button 
                            onClick={handleLogout}
                            className="w-full py-5 rounded-3xl bg-rose-50 text-rose-600 text-[11px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all flex items-center justify-center gap-3"
                          >
                            <i className="fa-solid fa-right-from-bracket"></i>
                            Disconnect Cloud Account
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-8">
                          <div className="p-8 bg-orange-50 rounded-[32px] border border-orange-100 text-center space-y-4">
                            <i className="fa-solid fa-shield-halved text-3xl text-orange-500"></i>
                            <div className="text-[13px] font-black text-slate-900 uppercase tracking-wide">Cloud Storage Disabled</div>
                            <p className="text-[11px] font-medium text-slate-500 max-w-md mx-auto">Sign in with your DPSS account to automatically save your brand settings, logos, and worksheet history to the cloud.</p>
                          </div>
                          <button 
                            onClick={handleGoogleLogin}
                            disabled={authLoading}
                            className="w-full py-6 rounded-[32px] bg-slate-900 text-white text-[12px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-4 shadow-xl disabled:opacity-50"
                          >
                            {authLoading ? (
                              <i className="fa-solid fa-circle-notch fa-spin"></i>
                            ) : (
                              <i className="fa-brands fa-google"></i>
                            )}
                            Connect with Google Cloud
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 space-y-4">
                        <div className="h-10 w-10 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm">
                          <i className="fa-solid fa-palette"></i>
                        </div>
                        <div className="text-[12px] font-black text-slate-900 uppercase tracking-widest">Brand Persistence</div>
                        <p className="text-[10px] font-medium text-slate-400 leading-relaxed">Your school name, address, and logo collection are automatically synced. No more re-uploading logos on different computers.</p>
                      </div>
                      <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 space-y-4">
                        <div className="h-10 w-10 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                          <i className="fa-solid fa-clock-rotate-left"></i>
                        </div>
                        <div className="text-[12px] font-black text-slate-900 uppercase tracking-widest">Infinite History</div>
                        <p className="text-[10px] font-medium text-slate-400 leading-relaxed">Access your generated tests from anywhere. Your history is stored securely in your private cloud partition.</p>
                      </div>
                    </div>
                  </div>
                )}
             </div>
              <div className="p-12 bg-slate-50 border-t border-slate-100 flex flex-col items-center gap-8">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsBottomPanelHidden(!isBottomPanelHidden)}
                    className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[8px] font-black uppercase hover:bg-slate-200 transition-all"
                  >
                    {isBottomPanelHidden ? 'Show Panel' : 'Hide Panel'}
                  </button>
                </div>

                {!isBottomPanelHidden && (
                  <div className="flex justify-end gap-4 w-full">
                    <button onClick={hardReset} className="px-16 py-6 bg-rose-600 text-white rounded-full text-[12px] font-black uppercase shadow-xl hover:bg-rose-700 transition-all">Hard Reset</button>
                    <button onClick={syncWithDefaults} className="px-16 py-6 bg-slate-900 text-white rounded-full text-[12px] font-black uppercase shadow-xl hover:bg-black transition-all">Sync Settings</button>
                    <button onClick={() => setShowSettings(false)} className="px-16 py-6 bg-gradient-to-r from-accent-orange-dark to-accent-orange-light text-white rounded-full text-[12px] font-black uppercase shadow-xl hover:brightness-110 transition-all">Close Panel</button>
                  </div>
                )}
              </div>
          </div>
        </div>
      )}
      {/* EXPORT SETTINGS MODAL */}
      {exportSettings.showModal && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 p-6">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setExportSettings(prev => ({ ...prev, showModal: false }))}></div>
          <div className="relative w-full max-w-md bg-white rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
                    <i className="fa-solid fa-file-word text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Export Settings</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customize your Word document</p>
                  </div>
                </div>
                <button 
                  onClick={confirmExportWord}
                  className="py-3 px-6 bg-orange-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:brightness-110 shadow-xl shadow-orange-600/20 transition-all flex items-center gap-2"
                >
                  <i className="fa-solid fa-check"></i> Confirm Download
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">MS Export Style</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 1, label: 'Option 1: Standard' },
                      { id: 2, label: 'Option 2: Big Frame' },
                      { id: 3, label: 'Option 3: Hand-drawn MCQ' },
                      { id: 4, label: 'Option 4: Handwriting Font' },
                      { id: 5, label: 'Option 5: Stylist Header' },
                      { id: 6, label: 'Option 6: Stylist Header & Frame' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setExportSettings(p => ({ ...p, theme: opt.id }))}
                        className={`py-3 px-4 rounded-2xl text-xs font-bold transition-all border-2 ${exportSettings.theme === opt.id ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-orange-200'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Filename</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={exportSettings.filename} 
                      onChange={e => setExportSettings(prev => ({ ...prev, filename: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-orange-500 font-bold text-slate-700 pr-16"
                      placeholder="Enter filename..."
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase">.doc</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Document Title</label>
                  <input 
                    type="text" 
                    value={exportSettings.title} 
                    onChange={e => setExportSettings(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-orange-500 font-bold text-slate-700"
                    placeholder="Enter title..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-10">
                <button 
                  onClick={() => setExportSettings(prev => ({ ...prev, showModal: false }))}
                  className="py-5 bg-slate-100 text-slate-500 rounded-3xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all col-span-2"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showSubjectModal && (
        <div className="fixed inset-0 z-[300] bg-slate-950/80 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="bg-white rounded-[48px] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col border border-white/50">
            <div className="p-8 flex justify-between items-center border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="h-4 w-4 bg-amber-500 rounded-full animate-pulse"></div>
                <h2 className="text-[12px] font-black uppercase text-slate-900 tracking-widest">Localization Subjects</h2>
              </div>
              <button onClick={() => setShowSubjectModal(false)} className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Select a country to localize names and places in your tests:</p>
                <button 
                  onClick={() => setIsCountriesHidden(!isCountriesHidden)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase hover:bg-slate-200 transition-all"
                >
                  {isCountriesHidden ? 'Show All' : 'Hide List'}
                </button>
              </div>
              
              {!isCountriesHidden && (
                <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                  {SUBJECTS.map(subject => (
                    <button
                      key={subject.id}
                      onClick={() => {
                        setActiveSubject(subject.id);
                        setIsRandomSubject(false);
                        setShowSubjectModal(false);
                      }}
                      className={`p-6 rounded-3xl border-2 transition-all flex flex-col gap-2 items-start ${activeSubject === subject.id && !isRandomSubject ? 'border-amber-500 bg-amber-50 shadow-lg' : 'border-slate-100 bg-slate-50 hover:border-amber-200'}`}
                    >
                      <span className={`text-sm font-black uppercase ${activeSubject === subject.id && !isRandomSubject ? 'text-amber-600' : 'text-slate-600'}`}>{subject.name}</span>
                      <span className="text-[10px] text-slate-400 line-clamp-1">{subject.names.slice(0, 3).join(', ')}...</span>
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setIsRandomSubject(true);
                      setShowSubjectModal(false);
                    }}
                    className={`p-6 rounded-3xl border-2 transition-all flex flex-col gap-2 items-start col-span-2 ${isRandomSubject ? 'border-amber-500 bg-amber-50 shadow-lg' : 'border-slate-100 bg-slate-50 hover:border-amber-200'}`}
                  >
                    <span className={`text-sm font-black uppercase ${isRandomSubject ? 'text-amber-600' : 'text-slate-600'}`}>🎲 Randomize Countries</span>
                    <span className="text-[10px] text-slate-400">AI will pick one of the 10 countries randomly for each generation.</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* HIDDEN FILE INPUTS */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg" 
        onChange={handleFileUpload} 
      />
      <input 
        type="file" 
        ref={logoUploadRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleLogoUpload} 
      />
      <input 
        type="file" 
        ref={bgUploadRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleUserBgUpload} 
      />
    </div>
    </ErrorBoundary>
  );
}

export default App;
