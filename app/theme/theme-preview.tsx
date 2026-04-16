// 클로드 코드가 생성한 코드

'use client';

import { Theme, ThemeProvider, useTheme } from '@/providers/theme-provider';

import { Sans } from '../ui/sans';

/* ------------------------------------------------------------------ */
/* Primitives                                                           */
/* ------------------------------------------------------------------ */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <Sans.T160
        as="p"
        weight="bold"
        className="mb-3"
      >
        {title}
      </Sans.T160>
      <div className="flex flex-wrap gap-3">{children}</div>
    </div>
  );
}

function BgSwatch({ bg, label }: { bg: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`h-10 w-10 rounded border border-gray-200 ${bg}`} />
      <Sans.T120 as="p">{label}</Sans.T120>
    </div>
  );
}

function TextSwatch({ text, label }: { text: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex overflow-hidden rounded border border-gray-200">
        <div className="flex h-10 w-10 items-center justify-center bg-white">
          <span className={`text-[12px] font-bold ${text}`}>Aa</span>
        </div>
        <div className="flex h-10 w-10 items-center justify-center bg-black">
          <span className={`text-[12px] font-bold ${text}`}>Aa</span>
        </div>
      </div>
      <Sans.T120 as="p">{label}</Sans.T120>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Theme switcher                                                       */
/* ------------------------------------------------------------------ */

const THEMES: { value: Theme; label: string }[] = [
  { value: 'theme-default', label: '일반 회원' },
  { value: 'theme-agent', label: '대리인' },
  { value: 'theme-executive', label: '임원진' },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-2">
      {THEMES.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`rounded px-4 py-2 text-[14px] font-bold transition-colors ${
            theme === value
              ? 'bg-voting-black text-voting-text-white'
              : 'bg-voting-gray text-voting-text-black'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Semantic swatches (theme-reactive)                                  */
/* ------------------------------------------------------------------ */

function SemanticColors() {
  return (
    <>
      <Section title="Background">
        {[
          { bg: 'bg-background', label: 'background' },
          { bg: 'bg-background-popup', label: 'popup' },
          { bg: 'bg-hero-card', label: 'hero-card' },
          { bg: 'bg-background-section', label: 'section' },
          { bg: 'bg-background-search', label: 'search' },
          { bg: 'bg-profile', label: 'profile' },
          { bg: 'bg-background-profile-section', label: 'profile-section' },
          { bg: 'bg-badge', label: 'badge' },
        ].map((s) => (
          <BgSwatch
            key={s.label}
            {...s}
          />
        ))}
      </Section>

      <Section title="Label">
        {[
          { bg: 'bg-label', label: 'label' },
          { bg: 'bg-label-click', label: 'click' },
          { bg: 'bg-label-unavailable', label: 'unavailable' },
          { bg: 'bg-label-success', label: 'success' },
          { bg: 'bg-label-home', label: 'home' },
          { bg: 'bg-label-select', label: 'select' },
          { bg: 'bg-label-not-select', label: 'not-select' },
        ].map((s) => (
          <BgSwatch
            key={s.label}
            {...s}
          />
        ))}
      </Section>

      <Section title="Chip">
        {[
          { bg: 'bg-chip-on', label: 'on' },
          { bg: 'bg-chip-off', label: 'off' },
        ].map((s) => (
          <BgSwatch
            key={s.label}
            {...s}
          />
        ))}
      </Section>

      <Section title="Text">
        {[
          { text: 'text-text-hero', label: 'hero' },
          { text: 'text-text-popup', label: 'popup' },
          { text: 'text-text-badge', label: 'badge' },
        ].map((s) => (
          <TextSwatch
            key={s.label}
            {...s}
          />
        ))}
      </Section>

      <Section title="Text / Heading">
        {[
          { text: 'text-text-heading-page', label: 'page' },
          { text: 'text-text-heading-page-light', label: 'page-light' },
          { text: 'text-text-heading-section', label: 'section' },
        ].map((s) => (
          <TextSwatch
            key={s.label}
            {...s}
          />
        ))}
      </Section>

      <Section title="Text / Label">
        {[
          { text: 'text-text-label', label: 'default' },
          { text: 'text-text-label-click', label: 'click' },
          { text: 'text-text-label-unavailable', label: 'unavailable' },
          { text: 'text-text-label-success', label: 'success' },
          { text: 'text-text-label-home', label: 'home' },
          { text: 'text-text-label-select', label: 'select' },
          { text: 'text-text-label-not-select', label: 'not-select' },
        ].map((s) => (
          <TextSwatch
            key={s.label}
            {...s}
          />
        ))}
      </Section>

      <Section title="Text / Chip">
        {[
          { text: 'text-text-chip-on', label: 'on' },
          { text: 'text-text-chip-off', label: 'off' },
        ].map((s) => (
          <TextSwatch
            key={s.label}
            {...s}
          />
        ))}
      </Section>

      <Section title="Text / Input">
        {[
          { text: 'text-text-input-placeholder', label: 'placeholder' },
          { text: 'text-text-input-value', label: 'value' },
        ].map((s) => (
          <TextSwatch
            key={s.label}
            {...s}
          />
        ))}
      </Section>

      <Section title="Text / Title">
        {[
          { text: 'text-text-title-card', label: 'card' },
          { text: 'text-text-title-value', label: 'value' },
          { text: 'text-text-title-subvalue', label: 'subvalue' },
          { text: 'text-text-title-label', label: 'label' },
        ].map((s) => (
          <TextSwatch
            key={s.label}
            {...s}
          />
        ))}
      </Section>

      <Section title="Text / Profile">
        {[
          { text: 'text-text-profile-name', label: 'name' },
          { text: 'text-text-profile-support', label: 'support' },
          { text: 'text-text-profile-value', label: 'value' },
          { text: 'text-text-profile-label', label: 'label' },
        ].map((s) => (
          <TextSwatch
            key={s.label}
            {...s}
          />
        ))}
      </Section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Inner content (needs ThemeContext)                                  */
/* ------------------------------------------------------------------ */

function PreviewContent() {
  return (
    <div className="p-6">
      <Sans.T240
        as="h2"
        weight="bold"
        className="mb-4"
      >
        테마 미리보기
      </Sans.T240>
      <ThemeSwitcher />
      <SemanticColors />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Export                                                               */
/* ------------------------------------------------------------------ */

export function ThemePreview() {
  return (
    <ThemeProvider>
      <PreviewContent />
    </ThemeProvider>
  );
}
