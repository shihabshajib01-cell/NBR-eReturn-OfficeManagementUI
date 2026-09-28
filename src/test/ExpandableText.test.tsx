import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExpandableText } from '../app/components/shared/SafeText';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

const SHORT = 'Short text';
const LONG  = 'A'.repeat(250);

describe('ExpandableText', () => {
  it('renders short text without See more button', () => {
    render(<ExpandableText value={SHORT} maxChars={180} />);
    expect(screen.getByText(SHORT)).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders long text with See more button', () => {
    render(<ExpandableText value={LONG} maxChars={180} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows See less after clicking See more', () => {
    render(<ExpandableText value={LONG} maxChars={180} />);
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });

  it('collapses again after clicking See less', () => {
    render(<ExpandableText value={LONG} maxChars={180} />);
    const btn = screen.getByRole('button');
    fireEvent.click(btn); // expand
    fireEvent.click(btn); // collapse
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders fallback for empty value', () => {
    render(<ExpandableText value="" fallback="N/A" />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('renders fallback for null', () => {
    render(<ExpandableText value={null} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('stopPropagation on toggle click', () => {
    const parentClick = vi.fn();
    render(
      <div onClick={parentClick}>
        <ExpandableText value={LONG} maxChars={10} />
      </div>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(parentClick).not.toHaveBeenCalled();
  });
});
