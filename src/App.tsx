/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  TIMADIPhaseId, 
  StudentProfile, 
  SimulationTrial, 
  MetacognitivePlanning, 
  MetacognitiveMonitoring, 
  MetacognitiveEvaluating, 
  ReflectiveLog, 
  ArgumentationBoardData 
} from './types/timadi';
import { TopBar } from './components/layout/TopBar';
import { PhaseNav, PHASES } from './components/layout/PhaseNav';
import { TutorAssistant } from './components/tutor/TutorAssistant';
import { ProfileModal } from './components/profile/ProfileModal';
import { RefreshingKnowledgePhase } from './components/phases/RefreshingKnowledgePhase';
import { StimulatingInsightsPhase } from './components/phases/StimulatingInsightsPhase';
import { InvestigatingMomentsPhase } from './components/phases/InvestigatingMomentsPhase';
import { JustifyingArgumentsPhase } from './components/phases/JustifyingArgumentsPhase';
import { ExpoundingEraPhase } from './components/phases/ExpoundingEraPhase';
import { CheckingCompositionsPhase } from './components/phases/CheckingCompositionsPhase';
import { ReflectionPhase } from './components/phases/ReflectionPhase';

export default function App() {
  // Local storage persistence keys
  const STORAGE_KEY = 'timadi_chem10_lesson1_v1';

  // Student Profile
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_profile`);
    return saved
      ? JSON.parse(saved)
      : {
          name: 'Maria Curie Santos',
          gradeSection: 'Grade 10 - Einstein',
          school: 'Bulacan State University Lab High School',
          dateStarted: new Date().toISOString(),
        };
  });

  // Current Active Phase (1 to 7)
  const [currentPhase, setCurrentPhase] = useState<TIMADIPhaseId>(1);
  const [completedPhases, setCompletedPhases] = useState<TIMADIPhaseId[]>([1]);

  // Phase 1: Planning Checkpoint Data
  const [planningData, setPlanningData] = useState<MetacognitivePlanning>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_planning`);
    return saved
      ? JSON.parse(saved)
      : {
          taskDescription: '',
          whyImportant: '',
          mainGoal: '',
          resourcesNeeded: '',
          timeNeeded: '',
          taskDivision: '',
        };
  });

  // Phase 2: Hypothesis
  const [initialHypothesis, setInitialHypothesis] = useState<string>(() => {
    return localStorage.getItem(`${STORAGE_KEY}_hypothesis`) || '';
  });

  // Phase 3: Logged Simulation Trials & Monitoring
  const [loggedTrials, setLoggedTrials] = useState<SimulationTrial[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_trials`);
    return saved ? JSON.parse(saved) : [];
  });

  const [monitoringData, setMonitoringData] = useState<MetacognitiveMonitoring>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_monitoring`);
    return saved
      ? JSON.parse(saved)
      : {
          understandTask: '',
          makesSense: '',
          reachingGoals: '',
          strategiesWorking: '',
          improvementsNeeded: '',
        };
  });

  // Phase 4 & 6: Argumentation Board Data
  const [argumentData, setArgumentData] = useState<ArgumentationBoardData>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_argument`);
    return saved
      ? JSON.parse(saved)
      : {
          guidingQuestion: 'If temperature is held constant, what is the relationship between volume and pressure?',
          claim: '',
          evidence: '',
          reasoning: '',
        };
  });

  // Phase 5: Evaluating Checkpoint
  const [evaluatingData, setEvaluatingData] = useState<MetacognitiveEvaluating>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_evaluating`);
    return saved
      ? JSON.parse(saved)
      : {
          reachedGoal: '',
          strategyWorked: '',
          strategyNotWorked: '',
          doDifferently: '',
        };
  });

  // Phase 7: Reflective Log
  const [reflectiveLog, setReflectiveLog] = useState<ReflectiveLog>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_reflection`);
    return saved
      ? JSON.parse(saved)
      : {
          helpfulAspect: '',
          importantDetails: '',
          realLifeApplication: '',
          hardshipsAndSuggestions: '',
          confidenceRating: 4,
        };
  });

  // UI Modals
  const [isTutorOpen, setIsTutorOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(studentProfile));
  }, [studentProfile]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_planning`, JSON.stringify(planningData));
  }, [planningData]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_hypothesis`, initialHypothesis);
  }, [initialHypothesis]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_trials`, JSON.stringify(loggedTrials));
  }, [loggedTrials]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_monitoring`, JSON.stringify(monitoringData));
  }, [monitoringData]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_argument`, JSON.stringify(argumentData));
  }, [argumentData]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_evaluating`, JSON.stringify(evaluatingData));
  }, [evaluatingData]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_reflection`, JSON.stringify(reflectiveLog));
  }, [reflectiveLog]);

  // Handlers for Phase Progression
  const markPhaseComplete = (phaseId: TIMADIPhaseId) => {
    if (!completedPhases.includes(phaseId)) {
      setCompletedPhases((prev) => [...prev, phaseId]);
    }
  };

  const handleNextPhase = (nextId: TIMADIPhaseId) => {
    markPhaseComplete(currentPhase);
    setCurrentPhase(nextId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddTrial = (trial: SimulationTrial) => {
    setLoggedTrials((prev) => [...prev, trial]);
  };

  const handleClearTrials = () => {
    setLoggedTrials([]);
  };

  const handleDeleteTrial = (id: string) => {
    setLoggedTrials((prev) => prev.filter((t) => t.id !== id));
  };

  const handleRestartLesson = () => {
    setCurrentPhase(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentPhaseInfo = PHASES.find((p) => p.id === currentPhase) || PHASES[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-sky-100 selection:text-sky-900">
      
      {/* Top Bar Header */}
      <TopBar
        studentProfile={studentProfile}
        currentPhase={currentPhase}
        onOpenTutor={() => setIsTutorOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onPrintReport={() => window.print()}
      />

      {/* 7-Step TI-MADI Navigation Bar */}
      <PhaseNav
        currentPhase={currentPhase}
        completedPhases={completedPhases}
        onSelectPhase={(id) => {
          setCurrentPhase(id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Learning Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
        {currentPhase === 1 && (
          <RefreshingKnowledgePhase
            planningData={planningData}
            onUpdatePlanning={(data) => setPlanningData((prev) => ({ ...prev, ...data }))}
            onProceedToNext={() => handleNextPhase(2)}
          />
        )}

        {currentPhase === 2 && (
          <StimulatingInsightsPhase
            initialHypothesis={initialHypothesis}
            onUpdateHypothesis={setInitialHypothesis}
            onProceedToNext={() => handleNextPhase(3)}
          />
        )}

        {currentPhase === 3 && (
          <InvestigatingMomentsPhase
            loggedTrials={loggedTrials}
            onAddTrial={handleAddTrial}
            onClearTrials={handleClearTrials}
            onDeleteTrial={handleDeleteTrial}
            monitoringData={monitoringData}
            onUpdateMonitoring={(data) => setMonitoringData((prev) => ({ ...prev, ...data }))}
            onProceedToNext={() => handleNextPhase(4)}
          />
        )}

        {currentPhase === 4 && (
          <JustifyingArgumentsPhase
            argumentData={argumentData}
            onUpdateArgument={(data) => setArgumentData((prev) => ({ ...prev, ...data }))}
            loggedTrials={loggedTrials}
            onProceedToNext={() => handleNextPhase(5)}
          />
        )}

        {currentPhase === 5 && (
          <ExpoundingEraPhase
            evaluatingData={evaluatingData}
            onUpdateEvaluating={(data) => setEvaluatingData((prev) => ({ ...prev, ...data }))}
            onProceedToNext={() => handleNextPhase(6)}
          />
        )}

        {currentPhase === 6 && (
          <CheckingCompositionsPhase
            studentProfile={studentProfile}
            argumentData={argumentData}
            onUpdateArgument={(data) => setArgumentData((prev) => ({ ...prev, ...data }))}
            loggedTrials={loggedTrials}
            onProceedToNext={() => handleNextPhase(7)}
          />
        )}

        {currentPhase === 7 && (
          <ReflectionPhase
            studentProfile={studentProfile}
            reflectiveLog={reflectiveLog}
            onUpdateReflectiveLog={(data) => setReflectiveLog((prev) => ({ ...prev, ...data }))}
            onRestartLesson={handleRestartLesson}
          />
        )}
      </main>

      {/* Intelligent Tutor Socratic Drawer */}
      <TutorAssistant
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
        currentPhase={currentPhase}
        phaseName={currentPhaseInfo.name}
      />

      {/* Student Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={studentProfile}
        onUpdateProfile={(updated) => setStudentProfile((prev) => ({ ...prev, ...updated }))}
      />

      {/* Academic Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-8 mt-12 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <strong>Technology-Integrated Metacognitive Argument-Driven Inquiry (TI-MADI)</strong> · Chemistry 10 Module
          </div>
          <div className="flex items-center gap-4">
            <span>Aligned with DepEd K-12 Science Curriculum</span>
            <span>·</span>
            <span>Grade 10 Lesson 1: Boyle's Law</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
