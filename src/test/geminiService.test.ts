import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { analyzeThreat } from '../../geminiService';

describe('geminiService', () => {
    describe('analyzeThreat - Heuristic Fallback', () => {
        const originalFetch = global.fetch;

        beforeEach(() => {
            // Mock fetch to always throw or return error to trigger fallback
            global.fetch = vi.fn().mockRejectedValue(new Error('Network Error'));
        });

        afterEach(() => {
            global.fetch = originalFetch;
        });

        it('detects bank-related threats', async () => {
            const result = await analyzeThreat('Prosím pošlite číslo účtu a IBAN');

            expect(result.status).toBe('DANGER'); // Heuristic strictness check
            expect(result.risk_matrix.composite_score).toBeGreaterThan(20);
        });

        it('detects critical auth threats', async () => {
            const result = await analyzeThreat('Zadajte heslo a PIN kód ku kreditnej karte ihneď!');

            expect(result.status).toBe('DANGER');
            expect(result.risk_level).toBe('CRITICAL');
            expect(result.scam_probability).toBeGreaterThan(0.5);
        });

        it('detects family scam pattern (vnúča scam)', async () => {
            const result = await analyzeThreat('Babička, som tvoj vnúča, mal som nehodu, potrebujem peniaze');

            expect(result.status).toBe('DANGER');
            expect(result.risk_matrix.composite_score).toBeGreaterThan(50);
        });

        it('detects delivery scam', async () => {
            const result = await analyzeThreat('Váš balík čaká na colnici, zaplaťte doplatok cez tento link');

            expect(['WARNING', 'DANGER']).toContain(result.status);
            expect(result.risk_matrix.composite_score).toBeGreaterThan(30);
        });

        it('detects impersonation attack', async () => {
            const result = await analyzeThreat('Volám z Microsoft podpory, váš počítač má vírus');

            expect(['WARNING', 'DANGER']).toContain(result.status);
            expect(result.technical_detail).toContain('Impersonation');
        });

        it('detects session hijacking patterns', async () => {
            const result = await analyzeThreat('Your session has expired, please re-authenticate with your token');

            expect(result.status).not.toBe('SAFE');
            expect(result.technical_detail).toContain('Session');
        });

        it('returns MONITORING for safe input', async () => {
            const result = await analyzeThreat('Dobrý deň, ako sa máte?');

            expect(result.status).toBe('MONITORING');
            expect(result.risk_level).toBe('MEDIUM');
        });

        it('includes forensics data in response', async () => {
            const result = await analyzeThreat('Zadajte heslo k účtu');

            expect(result.forensics).toBeDefined();
            expect(result.forensics.length).toBeGreaterThan(0);
            expect(result.forensics[0]).toHaveProperty('type');
            expect(result.forensics[0]).toHaveProperty('confidence');
        });

        it('includes mitigation workflow', async () => {
            const result = await analyzeThreat('Kritická hrozba test');

            expect(result.mitigation_workflow).toBeDefined();
            expect(Array.isArray(result.mitigation_workflow)).toBe(true);
        });

        it('returns correct action button for danger', async () => {
            const result = await analyzeThreat('Zadajte heslo a PIN ihneď, máte dlh!');

            expect(result.action_button.color).toBe('RED');
            expect(result.action_button.label).toBe('TERMINATE');
        });
    });
});
