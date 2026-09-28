import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DynamicDetailsDrawer } from '../app/components/drawers/DynamicDetailsDrawer';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

vi.mock('../app/components/shared/ResponsiveOverlay', () => ({
  ResponsiveOverlay: ({ children, open, onClose, footer }: {
    children: React.ReactNode; open: boolean; onClose: () => void; footer?: React.ReactNode;
  }) => open ? (
    <div data-testid="overlay">
      {children}
      {footer && <div data-testid="footer">{footer}</div>}
      <button onClick={onClose} data-testid="close-btn">Close</button>
    </div>
  ) : null,
}));

vi.mock('../app/components/badges/StatusBadge', () => ({
  StatusBadge: ({ value }: { value: string }) => <span data-testid="status-badge">{value}</span>,
}));

vi.mock('../app/utils/exportDisabled', () => ({
  handleExportDisabled: vi.fn(),
}));

const columns = [
  { key: 'taxpayer_name', label: 'Name' },
  { key: 'tin', label: 'TIN' },
  { key: 'status', label: 'Status' },
  { key: 'circle', label: 'Circle' },
  { key: 'submission_date', label: 'Date' },
  { key: 'empty_field', label: 'Empty' },
];

const rowData = {
  taxpayer_name: 'Md. Rafiqul Islam',
  tin: '1234567890',
  status: 'Approved',
  circle: 'Circle 1',
  submission_date: '2026-06-14',
  empty_field: '',
};

describe('DynamicDetailsDrawer', () => {
  it('renders when open=true', () => {
    render(<DynamicDetailsDrawer open columns={columns} rowData={rowData} onClose={() => {}} />);
    expect(screen.getByTestId('overlay')).toBeInTheDocument();
  });

  it('does not render when open=false', () => {
    render(<DynamicDetailsDrawer open={false} columns={columns} rowData={rowData} onClose={() => {}} />);
    expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
  });

  it('does not render when rowData is null', () => {
    render(<DynamicDetailsDrawer open columns={columns} rowData={null} onClose={() => {}} />);
    expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
  });

  it('renders the status badge', () => {
    render(<DynamicDetailsDrawer open columns={columns} rowData={rowData} onClose={() => {}} />);
    expect(screen.getByTestId('status-badge')).toHaveTextContent('Approved');
  });

  it('hides empty fields', () => {
    render(<DynamicDetailsDrawer open columns={columns} rowData={rowData} onClose={() => {}} />);
    expect(screen.queryByText('Empty')).not.toBeInTheDocument();
  });

  it('renders field values', () => {
    render(<DynamicDetailsDrawer open columns={columns} rowData={rowData} onClose={() => {}} />);
    expect(screen.getByText('Md. Rafiqul Islam')).toBeInTheDocument();
  });

  it('calls onClose when close button is pressed', () => {
    const onClose = vi.fn();
    render(<DynamicDetailsDrawer open columns={columns} rowData={rowData} onClose={onClose} />);
    fireEvent.click(screen.getByTestId('close-btn'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('renders footer with Print and Export buttons when showActions=true', () => {
    render(<DynamicDetailsDrawer open columns={columns} rowData={rowData} onClose={() => {}} showActions />);
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
