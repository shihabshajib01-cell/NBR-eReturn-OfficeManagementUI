import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppTextField } from '../app/components/forms/AppTextField';

// MUI needs a minimal theme context — stub ThemeProvider
vi.mock('@mui/material', async () => {
  const actual = await vi.importActual<typeof import('@mui/material')>('@mui/material');
  return { ...actual };
});

describe('AppTextField', () => {
  it('renders with a label', () => {
    render(<AppTextField id="t1" label="Full Name" value="" onChange={() => {}} />);
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
  });

  it('shows placeholder text', () => {
    render(<AppTextField id="t2" label="Search" value="" onChange={() => {}} placeholder="Enter name" />);
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
  });

  it('calls onChange when user types', () => {
    const onChange = vi.fn();
    render(<AppTextField id="t3" label="Name" value="" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Alice' } });
    expect(onChange).toHaveBeenCalledWith('Alice');
  });

  it('shows helper text when provided', () => {
    render(<AppTextField id="t4" label="Email" value="" onChange={() => {}} helper="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('is disabled when disabled=true', () => {
    render(<AppTextField id="t5" label="Name" value="Bob" onChange={() => {}} disabled />);
    expect(screen.getByLabelText('Name')).toBeDisabled();
  });

  it('shows error state', () => {
    render(<AppTextField id="t6" label="TIN" value="" onChange={() => {}} error="Invalid TIN" />);
    expect(screen.getByText('Invalid TIN')).toBeInTheDocument();
  });
});
