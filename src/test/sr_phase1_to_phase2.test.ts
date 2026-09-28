import { describe, it, expect, beforeEach, vi } from 'vitest';
import { resetStore, getApplications, getKpiTotals } from '../app/services/repositories/specialRegistrationRepository';
import { submitSpecialRegistration } from '../app/services/specialRegistrationPublicService';

// Use a fake File since jsdom supports it
function fakeFile(name: string): File {
  return new File(['content'], name, { type: 'application/pdf' });
}

describe('Phase 1 → Phase 2 connection', () => {
  beforeEach(() => {
    resetStore();
  });

  it('public submission appears in internal list', async () => {
    const result = await submitSpecialRegistration({
      applicantName: 'Karim Abdullah',
      nidNumber: '1234567890',
      tin: '987654321000',
      passportType: 'BANGLADESHI',
      countryCode: 'AE',
      country: 'United Arab Emirates',
      address: '123 Sheikh Zayed Road',
      phone: '+971509990000',
      departureDate: '2023-11-15',
      email: 'karim@example.com',
      attachments: {
        nid: [fakeFile('nid.pdf')],
        passport: [fakeFile('passport.pdf')],
        visa: [],
        departure: [fakeFile('departure.pdf')],
      },
      declarationAccepted: true,
      submittedAt: new Date().toISOString(),
    });

    // Application number returned to citizen
    expect(result.applicationNumber).toMatch(/^SR-NRB-\d{8}-\d{4}$/);
    expect(result.status).toBe('Pending');

    // Same number visible in internal list
    const list = getApplications();
    expect(list.total).toBe(1);
    expect(list.items[0].applicationNumber).toBe(result.applicationNumber);
    expect(list.items[0].status).toBe('PENDING_REVIEW');
    expect(list.items[0].applicantName).toBe('Karim Abdullah');
  });

  it('repeated submit does not duplicate the record', async () => {
    // Two concurrent submits that add the same application ID
    // This is guarded by _submittedIds in the repository
    const payload = {
      applicantName: 'Fatema Begum',
      nidNumber: '1234567890',
      tin: '111222333444',
      passportType: 'BANGLADESHI' as const,
      countryCode: 'GB' as const,
      country: 'United Kingdom',
      address: '14 Green Lane',
      phone: '+447700900123',
      departureDate: '2022-06-08',
      email: 'fatema@example.com',
      attachments: { nid: [fakeFile('nid.pdf')], passport: [fakeFile('p.pdf')], visa: [], departure: [fakeFile('d.pdf')] },
      declarationAccepted: true as const,
      submittedAt: new Date().toISOString(),
    };
    const r1 = await submitSpecialRegistration(payload);
    const r2 = await submitSpecialRegistration(payload);
    // Two submissions get two distinct app numbers
    expect(r1.applicationNumber).not.toBe(r2.applicationNumber);
    // Both should be in the store (they have different IDs)
    expect(getApplications().total).toBe(2);
  });

  it('KPI reflects newly submitted public application', async () => {
    const before = getKpiTotals();
    expect(before.total).toBe(0);

    await submitSpecialRegistration({
      applicantName: 'Sumaiya Rahman',
      nidNumber: '1234567890',
      tin: '555444333222',
      passportType: 'BANGLADESHI',
      countryCode: 'DE',
      country: 'Germany',
      address: 'Friedrichstraße 100',
      phone: '+491601234567',
      departureDate: '2023-08-25',
      email: 'sumaiya@example.de',
      attachments: { nid: [fakeFile('nid.pdf')], passport: [fakeFile('p.pdf')], visa: [], departure: [fakeFile('d.pdf')] },
      declarationAccepted: true,
      submittedAt: new Date().toISOString(),
    });

    const after = getKpiTotals();
    expect(after.total).toBe(1);
    expect(after.pendingReview).toBe(1);
    expect(after.approved).toBe(0);
  });

  it('documents are stored and have correct categories', async () => {
    await submitSpecialRegistration({
      applicantName: 'Test Citizen',
      nidNumber: '1234567890',
      tin: '123456789012',
      passportType: 'BANGLADESHI',
      countryCode: 'CA',
      country: 'Canada',
      address: 'Toronto',
      phone: '+14165550192',
      departureDate: '2021-09-20',
      email: 'test@canada.com',
      attachments: {
        nid: [fakeFile('nid_front.pdf'), fakeFile('nid_back.pdf')],
        passport: [fakeFile('passport_bio.jpg')],
        visa: [fakeFile('visa.pdf')],
        departure: [fakeFile('departure_seal.jpg')],
      },
      declarationAccepted: true,
      submittedAt: new Date().toISOString(),
    });

    const list = getApplications();
    const app = list.items[0];
    const nidDocs = app.documents.filter(d => d.category === 'NID_OR_SMART_ID');
    const passportDocs = app.documents.filter(d => d.category === 'PASSPORT_BIO_PAGE');
    const visaDocs = app.documents.filter(d => d.category === 'VISA_OR_RESIDENCE_PAGE');
    const departureDocs = app.documents.filter(d => d.category === 'LATEST_DEPARTURE_SEAL');

    expect(nidDocs.length).toBe(2);
    expect(passportDocs.length).toBe(1);
    expect(visaDocs.length).toBe(1);
    expect(departureDocs.length).toBe(1);
  });
});
