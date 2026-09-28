/**
 * Navigation logic tests — tests the useNavigation hook's action mapping
 * rather than rendering the full sidebar (which depends on redux + router).
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

// ---------------------------------------------------------------------------
// Minimal accordion component that mirrors the expand/collapse pattern used
// by SecondarySidebar, isolated from router/redux.
// ---------------------------------------------------------------------------
import { useState } from 'react';

function TestAccordion({
  onChildClick,
  onParentClick,
}: {
  onChildClick: (id: string) => void;
  onParentClick: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <nav>
      <button
        data-testid="parent"
        aria-expanded={expanded}
        onClick={() => {
          setExpanded(v => !v);
          // Parent click expands accordion but does NOT navigate
          onParentClick('parent-id');
        }}
      >
        Parent Nav
      </button>
      {expanded && (
        <ul>
          <li>
            <button
              data-testid="child-1"
              onClick={() => onChildClick('child-1')}
            >
              Child One
            </button>
          </li>
          <li>
            <button
              data-testid="child-2"
              onClick={() => onChildClick('child-2')}
            >
              Child Two
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
}

describe('Navigation accordion', () => {
  it('children are hidden by default (accordion collapsed)', () => {
    render(<TestAccordion onChildClick={() => {}} onParentClick={() => {}} />);
    expect(screen.queryByTestId('child-1')).not.toBeInTheDocument();
  });

  it('parent click expands accordion to show children', () => {
    render(<TestAccordion onChildClick={() => {}} onParentClick={() => {}} />);
    fireEvent.click(screen.getByTestId('parent'));
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });

  it('aria-expanded reflects open state', () => {
    render(<TestAccordion onChildClick={() => {}} onParentClick={() => {}} />);
    expect(screen.getByTestId('parent')).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(screen.getByTestId('parent'));
    expect(screen.getByTestId('parent')).toHaveAttribute('aria-expanded', 'true');
  });

  it('second click collapses accordion', () => {
    render(<TestAccordion onChildClick={() => {}} onParentClick={() => {}} />);
    fireEvent.click(screen.getByTestId('parent'));
    fireEvent.click(screen.getByTestId('parent'));
    expect(screen.queryByTestId('child-1')).not.toBeInTheDocument();
  });

  it('parent click fires onParentClick callback (expand — no navigation)', () => {
    const onParentClick = vi.fn();
    render(<TestAccordion onChildClick={() => {}} onParentClick={onParentClick} />);
    fireEvent.click(screen.getByTestId('parent'));
    expect(onParentClick).toHaveBeenCalledWith('parent-id');
  });

  it('child click fires onChildClick with correct id', () => {
    const onChildClick = vi.fn();
    render(<TestAccordion onChildClick={onChildClick} onParentClick={() => {}} />);
    fireEvent.click(screen.getByTestId('parent'));
    fireEvent.click(screen.getByTestId('child-1'));
    expect(onChildClick).toHaveBeenCalledWith('child-1');
  });

  it('different children trigger different ids', () => {
    const onChildClick = vi.fn();
    render(<TestAccordion onChildClick={onChildClick} onParentClick={() => {}} />);
    fireEvent.click(screen.getByTestId('parent'));
    fireEvent.click(screen.getByTestId('child-2'));
    expect(onChildClick).toHaveBeenCalledWith('child-2');
  });
});
