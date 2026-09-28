import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResponsiveTable } from '../app/components/tables/ResponsiveTable';
import type { ColDef, TableRow } from '../app/pages/modulePageUtils';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

vi.mock('../app/components/tables/CardTable', () => ({
  CardTable: ({ rows, cols }: { rows: TableRow[]; cols: ColDef[] }) => (
    <table data-testid="card-table">
      <thead>
        <tr>{cols.map(c => c.type === 'col' && <th key={c.col.key}>{c.col.label}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>{cols.map(c => c.type === 'col' && <td key={c.col.key}>{String(r[c.col.key] ?? '')}</td>)}</tr>
        ))}
      </tbody>
    </table>
  ),
}));

vi.mock('../app/components/tables/UnifiedMobileCard', () => ({
  UnifiedMobileCard: ({ row }: { row: TableRow }) => (
    <div data-testid="mobile-card">{String(row.name)}</div>
  ),
}));

const cols: ColDef[] = [
  { type: 'col', col: { key: 'name', label: 'Name' } },
  { type: 'col', col: { key: 'status', label: 'Status', badge: true } },
];

const rows: TableRow[] = [
  { name: 'Alice', status: 'Active' },
  { name: 'Bob', status: 'Inactive' },
];

describe('ResponsiveTable', () => {
  it('renders the desktop table', () => {
    render(<ResponsiveTable cols={cols} rows={rows} />);
    expect(screen.getByTestId('card-table')).toBeInTheDocument();
  });

  it('renders correct number of table headers', () => {
    render(<ResponsiveTable cols={cols} rows={rows} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders mobile cards for each row', () => {
    render(<ResponsiveTable cols={cols} rows={rows} />);
    expect(screen.getAllByTestId('mobile-card')).toHaveLength(2);
  });

  it('shows empty state when rows is empty', () => {
    render(<ResponsiveTable cols={cols} rows={[]} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders all row values', () => {
    render(<ResponsiveTable cols={cols} rows={rows} />);
    // Both desktop table and mobile cards show the values — at least one instance each
    expect(screen.getAllByText('Alice').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Bob').length).toBeGreaterThan(0);
  });
});
