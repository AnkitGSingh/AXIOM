'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const NAME = 'ANKIT SINGH';
const ROLE = 'AUTOMATION & WORKFLOW ENGINEER | MSC AI | SHEFFIELD';
const TAG1 = "The gap between humans and AI isn't technology. It's trust. That's what I build.";
const TAG2 = "I don't just build systems. I build the systems that make systems obsolete.";

const NAME_DELAY = 80;
const ROLE_DELAY = 40;
const TAG_DELAY = 30;

const ROLE_START = NAME.length * NAME_DELAY;
const TAG1_START = ROLE_START + ROLE.length * ROLE_DELAY;
const TAG2_START = TAG1_START + TAG1.length * TAG_DELAY;
const BUTTON_DELAY = TAG2_START + TAG2.length * TAG_DELAY + 400;

function useTypewriter(
  text: string,
  delay: number,
  startDelay: number,
  active: boolean
): string {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!active) {
      setDisplayed('');
      return;
    }

    let interval: ReturnType<typeof setInterval>;

    const startTimer = setTimeout(() => {
      let index = 0;
      interval = setInterval(() => {
        index++;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) {
          clearInterval(interval);
        }
      }, delay);
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      clearInterval(interval);
    };
  }, [text, delay, startDelay, active]);

  return displayed;
}

function Cursor({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span
      style={{
        display: 'inline-block',
        width: '2px',
        height: '1em',
        backgroundColor: '#C9A84C',
        marginLeft: '2px',
        verticalAlign: 'text-bottom',
        animation: 'hudCursorBlink 0.8s step-end infinite',
      }}
    />
  );
}

interface HUDIntroProps {
  visible: boolean;
}

export function HUDIntro({ visible }: HUDIntroProps) {
  const [showButton, setShowButton] = useState(false);

  const nameDisplayed = useTypewriter(NAME, NAME_DELAY, 0, visible);
  const roleDisplayed = useTypewriter(ROLE, ROLE_DELAY, ROLE_START, visible);
  const tag1Displayed = useTypewriter(TAG1, TAG_DELAY, TAG1_START, visible);
  const tag2Displayed = useTypewriter(TAG2, TAG_DELAY, TAG2_START, visible);

  useEffect(() => {
    if (!visible) {
      setShowButton(false);
      return;
    }
    const t = setTimeout(() => setShowButton(true), BUTTON_DELAY);
    return () => clearTimeout(t);
  }, [visible]);

  if (!visible) return null;

  const nameTyping = nameDisplayed.length > 0 && nameDisplayed.length < NAME.length;
  const roleTyping = roleDisplayed.length > 0 && roleDisplayed.length < ROLE.length;
  const tag1Typing = tag1Displayed.length > 0 && tag1Displayed.length < TAG1.length;
  const tag2Typing = tag2Displayed.length > 0 && tag2Displayed.length < TAG2.length;

  return (
    <div
      style={{
        position: 'relative',
        background: 'rgba(0, 20, 30, 0.88)',
        border: '1px solid #C9A84C',
        borderRadius: '2px',
        padding: '36px 32px',
        boxShadow:
          '0 0 40px rgba(201, 168, 76, 0.15), inset 0 0 60px rgba(0, 0, 0, 0.4)',
        width: '100%',
        maxWidth: '480px',
      }}
    >
      {/* Cursor keyframe animation */}
      <style>{`
        @keyframes hudCursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {/* Corner brackets */}
      <span style={{ position: 'absolute', top: '-1px', left: '-1px', width: '16px', height: '16px', borderTop: '2px solid #C9A84C', borderLeft: '2px solid #C9A84C' }} />
      <span style={{ position: 'absolute', top: '-1px', right: '-1px', width: '16px', height: '16px', borderTop: '2px solid #C9A84C', borderRight: '2px solid #C9A84C' }} />
      <span style={{ position: 'absolute', bottom: '-1px', left: '-1px', width: '16px', height: '16px', borderBottom: '2px solid #C9A84C', borderLeft: '2px solid #C9A84C' }} />
      <span style={{ position: 'absolute', bottom: '-1px', right: '-1px', width: '16px', height: '16px', borderBottom: '2px solid #C9A84C', borderRight: '2px solid #C9A84C' }} />

      {/* Scanline overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Name */}
        <div
          style={{
            fontFamily: 'var(--font-orbitron)',
            fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
            color: '#C9A84C',
            letterSpacing: '0.15em',
            fontWeight: 700,
            marginBottom: '16px',
            minHeight: '1.4em',
          }}
        >
          {nameDisplayed}
          <Cursor show={nameTyping} />
        </div>

        {/* Role */}
        <div
          style={{
            fontFamily: 'var(--font-rajdhani)',
            fontSize: '0.85rem',
            color: '#FFFFFF',
            letterSpacing: '0.25em',
            fontWeight: 500,
            marginBottom: '28px',
            minHeight: '1.4em',
          }}
        >
          {roleDisplayed}
          <Cursor show={roleTyping} />
        </div>

        {/* Tagline 1 */}
        <div
          style={{
            fontFamily: 'var(--font-rajdhani)',
            fontSize: '0.95rem',
            color: '#8BB8C8',
            fontStyle: 'italic',
            lineHeight: 1.6,
            marginBottom: '16px',
            minHeight: '1.4em',
          }}
        >
          {tag1Displayed}
          <Cursor show={tag1Typing} />
        </div>

        {/* Tagline 2 */}
        <div
          style={{
            fontFamily: 'var(--font-rajdhani)',
            fontSize: '0.95rem',
            color: '#8BB8C8',
            fontStyle: 'italic',
            lineHeight: 1.6,
            marginBottom: '16px',
            minHeight: '1.4em',
          }}
        >
          {tag2Displayed}
          <Cursor show={tag2Typing} />
        </div>

        {/* Access Systems button */}
        {showButton && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            onClick={() => console.log('ACCESS SYSTEMS clicked')}
            style={{
              fontFamily: 'var(--font-jetbrains)',
              fontSize: '0.8rem',
              letterSpacing: '0.12em',
              border: '1px solid #C9A84C',
              background: 'transparent',
              color: '#C9A84C',
              padding: '10px 24px',
              cursor: 'pointer',
              marginTop: '28px',
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#C9A84C';
              e.currentTarget.style.color = '#080808';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#C9A84C';
            }}
          >
            [ ACCESS SYSTEMS ]
          </motion.button>
        )}
      </div>
    </div>
  );
}
