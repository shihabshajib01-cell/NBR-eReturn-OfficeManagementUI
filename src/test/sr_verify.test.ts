import { describe, it, expect, beforeEach } from 'vitest';
import {
  addApplication,
  getApplications,
  getKpiTotals,
  approveApplication,
  rejectApplication,
  SRConflictError,
  resetStore,
  type SpecialRegistrationApplication,
} from '../app/services/repositories/specialRegistrationRepository';

function makeApp(overrides: Partial<SpecialRegistrationApplication> = {}): SpecialRegistrationApplication {
  const now = new Date().toISOString();
  return {
    id: 'test-' + Math.random().toString(36).slice(2),
    applicationNumber: 'SR-NRB-20260714-0001',
    applicantName: 'Test User',
    nidNumber: '1234567890',
    tin: '123456789012',
    passportType: 'BANGLADESHI',
    countryCode: 'GB',
    country: 'United Kingdom',
    address: '10 Downing Street',
    phone: '+447700900000',
    departureDate: '2024-01-01',
    email: 'test@example.com',
    documents: [],
    declarationAccepted: true,
    declarationTimestamp: now,
    submittedAt: now,
    status: 'PENDING_REVIEW',
    decisionHistory: [],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe('SpecialRegistrationRepository — Phase 2 data layer', () => {
  beforeEach(() => {
    resetStore();
  });

  it('starts empty after reset', () => {
    const result = getApplications();
    expect(result.total).toBe(0);
  });

  it('addApplication adds and is visible via getApplications', () => {
    const app = makeApp();
    addApplication(app);
    const result = getApplications();
    expect(result.total).toBe(1);
    expect(result.items[0].applicationNumber).toBe('SR-NRB-20260714-0001');
  });

  it('duplicate addApplication is ignored (no double-submit)', () => {
    const app = makeApp();
    addApplication(app);
    addApplication(app); // same id
    expect(getApplications().total).toBe(1);
  });

  it('newest appears first (newest-first sort)', () => {
    const old = makeApp({ id: 'old', submittedAt: '2024-01-01T00:00:00Z', applicationNumber: 'OLD' });
    const fresh = makeApp({ id: 'fresh', submittedAt: '2025-06-01T00:00:00Z', applicationNumber: 'FRESH' });
    addApplication(old);
    addApplication(fresh);
    const result = getApplications();
    expect(result.items[0].applicationNumber).toBe('FRESH');
  });

  it('getKpiTotals counts all statuses correctly', () => {
    addApplication(makeApp({ id: 'p1' }));
    addApplication(makeApp({ id: 'p2', status: 'APPROVED' }));
    addApplication(makeApp({ id: 'p3', status: 'REJECTED' }));
    const kpis = getKpiTotals();
    expect(kpis.total).toBe(3);
    expect(kpis.pendingReview).toBe(1);
    expect(kpis.approved).toBe(1);
    expect(kpis.rejected).toBe(1);
  });

  it('approve changes status, stores reviewer, adds history entry', () => {
    const app = makeApp({ id: 'a1' });
    addApplication(app);
    const updated = approveApplication('a1', {
      officerId: 'NBR-001', officerName: 'Officer A', officerDesignation: 'Tax Officer',
      approvalNote: 'Looks good',
    });
    expect(updated.status).toBe('APPROVED');
    expect(updated.reviewedByName).toBe('Officer A');
    expect(updated.approvalNote).toBe('Looks good');
    const lastHistory = updated.decisionHistory[updated.decisionHistory.length - 1];
    expect(lastHistory.decisionType).toBe('APPROVED');
    expect(lastHistory.officerName).toBe('Officer A');
  });

  it('reject changes status, stores reason, adds history entry', () => {
    const app = makeApp({ id: 'r1' });
    addApplication(app);
    const updated = rejectApplication('r1', {
      officerId: 'NBR-002', officerName: 'Officer B', officerDesignation: 'Tax Officer',
      rejectionReason: 'Documents are unclear and not readable.',
    });
    expect(updated.status).toBe('REJECTED');
    expect(updated.rejectionReason).toBe('Documents are unclear and not readable.');
    const lastHistory = updated.decisionHistory[updated.decisionHistory.length - 1];
    expect(lastHistory.decisionType).toBe('REJECTED');
  });

  it('duplicate approve throws SRConflictError (already processed)', () => {
    const app = makeApp({ id: 'c1' });
    addApplication(app);
    approveApplication('c1', { officerId: 'x', officerName: 'X', officerDesignation: 'X' });
    expect(() => approveApplication('c1', { officerId: 'y', officerName: 'Y', officerDesignation: 'Y' }))
      .toThrow(SRConflictError);
  });

  it('reject after approve throws SRConflictError', () => {
    const app = makeApp({ id: 'c2' });
    addApplication(app);
    approveApplication('c2', { officerId: 'x', officerName: 'X', officerDesignation: 'X' });
    expect(() => rejectApplication('c2', { officerId: 'y', officerName: 'Y', officerDesignation: 'Y', rejectionReason: 'reason here' }))
      .toThrow(SRConflictError);
  });

  it('search by applicant name (case-insensitive)', () => {
    addApplication(makeApp({ id: 's1', applicantName: 'Alice Smith' }));
    addApplication(makeApp({ id: 's2', applicantName: 'Bob Jones' }));
    const result = getApplications({ search: 'alice' });
    expect(result.total).toBe(1);
    expect(result.items[0].applicantName).toBe('Alice Smith');
  });

  it('search by TIN', () => {
    addApplication(makeApp({ id: 'tin1', tin: '999888777666' }));
    addApplication(makeApp({ id: 'tin2', tin: '111222333444' }));
    const result = getApplications({ search: '999888' });
    expect(result.total).toBe(1);
  });

  it('status filter PENDING_REVIEW works', () => {
    addApplication(makeApp({ id: 'f1' }));
    addApplication(makeApp({ id: 'f2', status: 'APPROVED' }));
    const result = getApplications({ status: 'PENDING_REVIEW' });
    expect(result.total).toBe(1);
    expect(result.items[0].id).toBe('f1');
  });

  it('country filter works', () => {
    addApplication(makeApp({ id: 'c1', country: 'Germany' }));
    addApplication(makeApp({ id: 'c2', country: 'Australia' }));
    const result = getApplications({ country: 'ger' });
    expect(result.total).toBe(1);
  });

  it('KPI pending decreases and approved increases after approval', () => {
    addApplication(makeApp({ id: 'k1' }));
    const before = getKpiTotals();
    expect(before.pendingReview).toBe(1);
    expect(before.approved).toBe(0);
    approveApplication('k1', { officerId: 'x', officerName: 'X', officerDesignation: 'X' });
    const after = getKpiTotals();
    expect(after.pendingReview).toBe(0);
    expect(after.approved).toBe(1);
    expect(after.total).toBe(1); // total unchanged
  });

  it('pagination returns correct slice', () => {
    for (let i = 0; i < 20; i++) {
      addApplication(makeApp({ id: `p${i}`, applicationNumber: `SR-${i}` }));
    }
    const page1 = getApplications({ page: 1, perPage: 5 });
    expect(page1.items.length).toBe(5);
    expect(page1.total).toBe(20);
    const page2 = getApplications({ page: 2, perPage: 5 });
    expect(page2.items.length).toBe(5);
    // pages should be different
    expect(page1.items[0].id).not.toBe(page2.items[0].id);
  });

  it('combined search + status filter', () => {
    addApplication(makeApp({ id: 'm1', applicantName: 'Karim', status: 'PENDING_REVIEW' }));
    addApplication(makeApp({ id: 'm2', applicantName: 'Karim', status: 'APPROVED' }));
    addApplication(makeApp({ id: 'm3', applicantName: 'Fatema', status: 'PENDING_REVIEW' }));
    const result = getApplications({ search: 'karim', status: 'PENDING_REVIEW' });
    expect(result.total).toBe(1);
    expect(result.items[0].id).toBe('m1');
  });
});
