import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UnifiedMobileCard } from '../app/components/tables/UnifiedMobileCard';
import type { ColDef } from '../app/pages/modulePageUtils';

// Stub CSS imports
vi.mock('../app/components/badges/StatusBadge', () => ({
  StatusBadge: ({ value }: { value: string }) => <span data-testid="status-badge">{value}</span>,
}));

const cols: ColDef[] = [
  { type: 'col', col: { key: 'name', label: 'Name' } },
  { type: 'col', col: { key: 'tin', label: 'TIN' } },
  { type: 'col', col: { key: 'circle', label: 'Circle' } },
  { type: 'col', col: { key: 'status', label: 'Status', badge: true } },
  { type: 'col', col: { key: 'submission_date', label: 'Date' } },
];

const row = {
  name: 'Md. Rafiqul Islam',
  tin: '1234567890',
  circle: 'Circle 1',
  status: 'Approved',
  submission_date: '2026-06-14',
  empty_field: '',
};

const mapping = {
  primary: 'name',
  identifier: 'tin',
  meta: ['circle'],
  status: 'status',
  date: 'submission_date',
};

describe('UnifiedMobileCard', () => {
  it('renders the primary field value', () => {
    render(<UnifiedMobileCard row={row} cols={cols} mobileCardMapping={mapping} />);
    expect(screen.getByText('Md. Rafiqul Islam')).toBeInTheDocument();
  });

  it('renders the identifier in meta', () => {
    render(<UnifiedMobileCard row={row} cols={cols} mobileCardMapping={mapping} />);
    expect(screen.getByText('1234567890')).toBeInTheDocument();
  });

  it('renders meta fields', () => {
    render(<UnifiedMobileCard row={row} cols={cols} mobileCardMapping={mapping} />);
    expect(screen.getByText('Circle 1')).toBeInTheDocument();
  });

  it('renders status badge', () => {
    render(<UnifiedMobileCard row={row} cols={cols} mobileCardMapping={mapping} />);
    expect(screen.getByTestId('status-badge')).toHaveTextContent('Approved');
  });

  it('hides empty fields — empty_field is not rendered', () => {
    render(<UnifiedMobileCard row={row} cols={cols} mobileCardMapping={mapping} />);
    expect(screen.queryByText('empty_field')).not.toBeInTheDocument();
  });

  it('calls onCardClick when card is clicked', () => {
    const onClick = vi.fn();
    render(<UnifiedMobileCard row={row} cols={cols} mobileCardMapping={mapping} onCardClick={onClick} />);
    fireEvent.click(screen.getByRole('listitem'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('calls onCardClick on Enter keydown', () => {
    const onClick = vi.fn();
    render(<UnifiedMobileCard row={row} cols={cols} mobileCardMapping={mapping} onCardClick={onClick} />);
    fireEvent.keyDown(screen.getByRole('listitem'), { key: 'Enter' });
    expect(onClick).toHaveBeenCalledOnce();
  });
});
