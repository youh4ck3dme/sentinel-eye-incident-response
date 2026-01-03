
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { analyzeThreat } from '../../geminiService';

describe('Sentinel Eye - Comprehensive Threat Categories', () => {
    // Mock fetch to ensure we use valid heuristics even if API is offline
    const originalFetch = global.fetch;
    beforeEach(() => {
        global.fetch = vi.fn().mockRejectedValue(new Error('Testing Offline Mode'));
    });
    afterEach(() => {
        global.fetch = originalFetch;
    });

    // CATEGORY 1: FINANCIAL
    describe('Category 1: Financial & Banking Fraud', () => {
        it('identifies bank fraud attempts (card details request)', async () => {
            const input = "Volám z banky, potrebujem číslo vašej karty a CVC kód pre zablokovanie transakcie.";
            const result = await analyzeThreat(input);
            expect(result.status).toBe('DANGER');
            expect(result.technical_detail).toContain('Bank');
            expect(result.technical_detail).toContain('Auth');
        });
    });

    // CATEGORY 2: SOCIAL ENGINEERING (FAMILY)
    describe('Category 2: Social Engineering (Family)', () => {
        it('detects grandchild accident scam', async () => {
            const input = "Ahoj babi, som tvoj vnuk, mal som nehodu a potrebujem peniaze, nehovor to mame.";
            const result = await analyzeThreat(input);
            expect(result.status).toBe('DANGER');
            expect(result.technical_detail).toContain('Family');
            expect(result.risk_matrix.composite_score).toBeGreaterThan(40);
        });
    });

    // CATEGORY 3: TECH SUPPORT
    describe('Category 3: Tech Support Impersonation', () => {
        it('flags Microsoft support scams', async () => {
            const input = "This is Microsoft Support, your computer has a virus, give me remote access.";
            const result = await analyzeThreat(input);
            expect(['WARNING', 'DANGER']).toContain(result.status);
            expect(result.technical_detail).toMatch(/Impersonation|Microsoft/i);
        });
    });

    // CATEGORY 4: PHISHING / DELIVERY
    describe('Category 4: Phishing & Delivery', () => {
        it('detects fake delivery links', async () => {
            const input = "Váš balík čaká na doručenie, kliknite na http://bit.ly/track pre zaplatenie cla.";
            const result = await analyzeThreat(input);
            expect(['WARNING', 'DANGER']).toContain(result.status);
            expect(result.technical_detail).toContain('Delivery');
            expect(result.technical_detail).toContain('Link');
        });
    });

    // CATEGORY 5: AUTHORITY / URGENCY
    describe('Category 5: Authority & Urgency', () => {
        it('identifies police/legal threats', async () => {
            const input = "Tu je polícia, máte zatykač, zaplaťte pokutu ihneď alebo vás zatkneme.";
            const result = await analyzeThreat(input);
            expect(result.status).toBe('DANGER');
            expect(result.technical_detail).toContain('Urgency');
            expect(result.risk_level).toBe('CRITICAL');
        });
    });

    // BONUS: CRYPTO SCAM
    describe('Category 6: Crypto Fraud', () => {
        it('detects fake crypto investment schemes', async () => {
            const input = "Investujte do Bitcoin cez našu peňaženku a získajte 100% zisk okamžite.";
            const result = await analyzeThreat(input);
            expect(result.status).toBe('DANGER');
            expect(result.technical_detail).toContain('Crypto');
        });
    });
});
