import React from 'react';

interface ScalpVisualProps {
  patternKey: string;
  className?: string;
  isSelected?: boolean;
}

export const ScalpPatternIcon: React.FC<ScalpVisualProps> = ({ patternKey, className = "w-16 h-16", isSelected = false }) => {
  const strokeColor = isSelected ? "#059669" : "#374151";
  const fillColor = isSelected ? "#ECFDF5" : "#F3F4F6";
  const accentColor = isSelected ? "#10B981" : "#9CA3AF";

  switch (patternKey) {
    case 'Receding hairline':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Head Outline */}
          <path d="M25 50 C25 25, 75 25, 75 50 C75 75, 60 85, 50 85 C40 85, 25 75, 25 50 Z" fill={fillColor} stroke={strokeColor} strokeWidth="2.5" />
          {/* Receding Hairline M-shape */}
          <path d="M25 45 C35 42, 38 28, 50 38 C62 28, 65 42, 75 45 C75 30, 65 20, 50 20 C35 20, 25 30, 25 45 Z" fill={strokeColor} />
          {/* Facial features */}
          <circle cx="42" cy="55" r="2" fill={strokeColor} />
          <circle cx="58" cy="55" r="2" fill={strokeColor} />
          <path d="M47 68 Q50 71 53 68" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'Thinning at crown':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Head Outline */}
          <path d="M25 50 C25 25, 75 25, 75 50 C75 75, 60 85, 50 85 C40 85, 25 75, 25 50 Z" fill={fillColor} stroke={strokeColor} strokeWidth="2.5" />
          {/* Frontal Hair Intact */}
          <path d="M25 45 C35 32, 65 32, 75 45 C75 25, 65 20, 50 20 C35 20, 25 25, 25 45 Z" fill={strokeColor} />
          {/* Thinning Vertex Circle */}
          <ellipse cx="50" cy="30" rx="12" ry="7" fill={fillColor} stroke={accentColor} strokeWidth="2" strokeDasharray="3 2" />
          <circle cx="42" cy="55" r="2" fill={strokeColor} />
          <circle cx="58" cy="55" r="2" fill={strokeColor} />
          <path d="M47 68 Q50 71 53 68" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'Widening part line':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Head Outline */}
          <path d="M25 50 C25 25, 75 25, 75 50 C75 75, 60 85, 50 85 C40 85, 25 75, 25 50 Z" fill={fillColor} stroke={strokeColor} strokeWidth="2.5" />
          {/* Hair sides with widened central parting */}
          <path d="M25 45 C28 25, 44 22, 44 48 C35 48, 25 48, 25 45 Z" fill={strokeColor} />
          <path d="M75 45 C72 25, 56 22, 56 48 C65 48, 75 48, 75 45 Z" fill={strokeColor} />
          {/* Widened Parting Highlight */}
          <line x1="50" y1="20" x2="50" y2="48" stroke={accentColor} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="42" cy="55" r="2" fill={strokeColor} />
          <circle cx="58" cy="55" r="2" fill={strokeColor} />
          <path d="M47 68 Q50 71 53 68" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'Diffuse thinning':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Head Outline */}
          <path d="M25 50 C25 25, 75 25, 75 50 C75 75, 60 85, 50 85 C40 85, 25 75, 25 50 Z" fill={fillColor} stroke={strokeColor} strokeWidth="2.5" />
          {/* Sparse Hair Hatching Pattern */}
          <path d="M28 42 C35 25, 65 25, 72 42" stroke={strokeColor} strokeWidth="2" strokeDasharray="3 3" />
          <path d="M32 35 C40 22, 60 22, 68 35" stroke={strokeColor} strokeWidth="2" strokeDasharray="2 3" />
          <path d="M38 28 C45 20, 55 20, 62 28" stroke={strokeColor} strokeWidth="2" strokeDasharray="2 2" />
          <circle cx="42" cy="55" r="2" fill={strokeColor} />
          <circle cx="58" cy="55" r="2" fill={strokeColor} />
          <path d="M47 68 Q50 71 53 68" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'Patchy loss':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Head Outline */}
          <path d="M25 50 C25 25, 75 25, 75 50 C75 75, 60 85, 50 85 C40 85, 25 75, 25 50 Z" fill={fillColor} stroke={strokeColor} strokeWidth="2.5" />
          {/* Full hair with distinct patchy circles */}
          <path d="M25 45 C25 20, 75 20, 75 45 C75 35, 65 20, 50 20 C35 20, 25 35, 25 45 Z" fill={strokeColor} />
          <circle cx="38" cy="28" r="5" fill={fillColor} stroke={accentColor} strokeWidth="2" />
          <circle cx="60" cy="32" r="6" fill={fillColor} stroke={accentColor} strokeWidth="2" />
          <circle cx="42" cy="55" r="2" fill={strokeColor} />
          <circle cx="58" cy="55" r="2" fill={strokeColor} />
          <path d="M47 68 Q50 71 53 68" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'Sudden excessive shedding':
    default:
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Head Outline */}
          <path d="M25 50 C25 25, 75 25, 75 50 C75 75, 60 85, 50 85 C40 85, 25 75, 25 50 Z" fill={fillColor} stroke={strokeColor} strokeWidth="2.5" />
          {/* Hair base */}
          <path d="M25 45 C25 20, 75 20, 75 45 C65 25, 35 25, 25 45 Z" fill={strokeColor} />
          {/* Falling hair strands */}
          <path d="M80 35 Q85 45 82 55" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M85 50 Q90 60 87 70" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M18 40 Q12 50 15 60" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
          <circle cx="42" cy="55" r="2" fill={strokeColor} />
          <circle cx="58" cy="55" r="2" fill={strokeColor} />
          <path d="M47 68 Q50 71 53 68" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
};
