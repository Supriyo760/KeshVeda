import React, { useEffect } from 'react';
import { useIntake } from './context/IntakeContext';
import { Header } from './components/Header';
import { StoryModeModal } from './components/StoryModeModal';
import { ClinicalRecordView } from './components/ClinicalRecordView';

// Step Components
import { PersonalInfoStep } from './components/QuestionCard/PersonalInfoStep';
import { AgeOnsetStep } from './components/QuestionCard/AgeOnsetStep';
import { DurationStep } from './components/QuestionCard/DurationStep';
import { FamilyHistoryStep } from './components/QuestionCard/FamilyHistoryStep';
import { ScalpPatternStep } from './components/QuestionCard/ScalpPatternStep';
import { ConditionsStep } from './components/QuestionCard/ConditionsStep';
import { FemaleHormonesStep } from './components/QuestionCard/FemaleHormonesStep';
import { AndrogenicSignsStep } from './components/QuestionCard/AndrogenicSignsStep';
import { TriggersStep } from './components/QuestionCard/TriggersStep';
import { LifestyleHabitsStep } from './components/QuestionCard/LifestyleHabitsStep';
import { ProductsMatrixStep } from './components/QuestionCard/ProductsMatrixStep';
import { ProceduresMatrixStep } from './components/QuestionCard/ProceduresMatrixStep';
import { SideEffectsStep } from './components/QuestionCard/SideEffectsStep';
import { SampleConsentStep } from './components/QuestionCard/SampleConsentStep';
import { SummaryReviewStep } from './components/QuestionCard/SummaryReviewStep';

export const App: React.FC = () => {
  const {
    currentStepId,
    availableSteps,
    currentStepIndex,
    isDoctorDrawerOpen,
    setIsDoctorDrawerOpen,
    setIsStoryModalOpen,
    nextStep,
    prevStep,
    speakText,
  } = useIntake();

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'v' || e.key === 'V') {
        setIsStoryModalOpen(true);
      } else if (e.key === 'd' || e.key === 'D') {
        setIsDoctorDrawerOpen(!isDoctorDrawerOpen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsStoryModalOpen, setIsDoctorDrawerOpen]);

  // Render the current step
  const renderCurrentStep = () => {
    switch (currentStepId) {
      case 'welcome':
        return <PersonalInfoStep />;
      case 'age_onset':
        return <AgeOnsetStep />;
      case 'duration':
        return <DurationStep />;
      case 'family_history':
        return <FamilyHistoryStep />;
      case 'pattern':
        return <ScalpPatternStep />;
      case 'conditions':
        return <ConditionsStep />;
      case 'female_hormones':
        return <FemaleHormonesStep />;
      case 'androgenic_signs':
        return <AndrogenicSignsStep />;
      case 'triggers':
        return <TriggersStep />;
      case 'lifestyle':
        return <LifestyleHabitsStep />;
      case 'products':
        return <ProductsMatrixStep />;
      case 'procedures':
        return <ProceduresMatrixStep />;
      case 'side_effects':
        return <SideEffectsStep />;
      case 'sample_consent':
        return <SampleConsentStep />;
      case 'summary_review':
        return <SummaryReviewStep />;
      default:
        return <PersonalInfoStep />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Side: Patient Intake Flow (60% width on Desktop) */}
        <main className="lg:col-span-7 xl:col-span-7 p-4 sm:p-6 lg:p-8 flex flex-col justify-start max-w-2xl mx-auto w-full">
          {renderCurrentStep()}
        </main>

        {/* Right Side: Live Doctor Clinical Record (40% width on Desktop) */}
        <aside className="hidden lg:block lg:col-span-5 xl:col-span-5 sticky top-[65px] h-[calc(100vh-65px)] overflow-hidden">
          <ClinicalRecordView />
        </aside>
      </div>

      {/* Mobile Doctor EMR Drawer Modal */}
      {isDoctorDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-stone-900/60 backdrop-blur-sm flex justify-end animate-in fade-in">
          <div className="w-full max-w-md bg-[#0F1715] h-full shadow-2xl animate-in slide-in-from-right duration-300">
            <ClinicalRecordView isDrawer onClose={() => setIsDoctorDrawerOpen(false)} />
          </div>
        </div>
      )}

      {/* Story Mode Multimodal Voice Modal */}
      <StoryModeModal />
    </div>
  );
};
