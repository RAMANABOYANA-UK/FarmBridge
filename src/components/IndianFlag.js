import React from 'react';

// CSS-drawn Indian flag - reliable, no external image dependency
// Saffron #FF9933, White, Green #138808, Navy chakra #000080
const IndianFlag = ({ variant = 'circle', className = '' }) => {
  if (variant === 'rect') {
    // Rectangular waving-style flag
    return (
      <span
        className={`inline-block relative overflow-hidden ${className}`}
        style={{ width: '2.4em', height: '1.6em', borderRadius: '0.2em' }}
        role="img"
        aria-label="Indian Flag"
      >
        {/* Saffron */}
        <span className="absolute top-0 left-0 right-0 h-1/3" style={{ background: '#FF9933' }} />
        {/* White */}
        <span className="absolute top-1/3 left-0 right-0 h-1/3" style={{ background: '#ffffff' }} />
        {/* Green */}
        <span className="absolute bottom-0 left-0 right-0 h-1/3" style={{ background: '#138808' }} />
        {/* Ashoka Chakra (24 spokes simplified) */}
        <span
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '36%',
            height: '36%',
            borderRadius: '50%',
            border: '2px solid #000080',
            background:
              'radial-gradient(circle, #000080 8%, transparent 9%), repeating-conic-gradient(#000080 0deg 7.5deg, transparent 7.5deg 15deg)',
          }}
        />
      </span>
    );
  }

  // Circle variant
  return (
    <span
      className={`inline-block relative overflow-hidden rounded-full ${className}`}
      role="img"
      aria-label="Indian Flag"
    >
      <span
        className="block"
        style={{
          width: '100%',
          height: '100%',
          background:
            'linear-gradient(180deg, #FF9933 0%, #FF9933 33.33%, #ffffff 33.33%, #ffffff 66.66%, #138808 66.66%, #138808 100%)',
        }}
      />
      {/* Chakra */}
      <span
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '22%',
          height: '22%',
          borderRadius: '50%',
          border: '2px solid #000080',
          background:
            'radial-gradient(circle, #000080 10%, transparent 11%), repeating-conic-gradient(#000080 0deg 7.5deg, transparent 7.5deg 15deg)',
        }}
      />
    </span>
  );
};

export default IndianFlag;
