/**
 * Merchant API Tests
 */
import { fetchMerchantData } from '../merchant';
import { server } from '@/mocks/server.node';

describe('fetchMerchantData', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  it('should fetch merchant data successfully', async () => {
    const data = await fetchMerchantData();

    expect(data).toBeDefined();
    expect(data.available_balance).toBeDefined();
    expect(data.pending_balance).toBeDefined();
    expect(data.currency).toBeDefined();
    expect(data.activity).toBeDefined();
  });

  it('should return balance in lowest denomination (pence/cents)', async () => {
    const data = await fetchMerchantData();

    expect(typeof data.available_balance).toBe('number');
    expect(typeof data.pending_balance).toBe('number');
    expect(data.available_balance).toBeGreaterThanOrEqual(0);
    expect(data.pending_balance).toBeGreaterThanOrEqual(0);
  });

  it('should return valid currency', async () => {
    const data = await fetchMerchantData();

    expect(['GBP', 'EUR']).toContain(data.currency);
  });

  it('should return activity array', async () => {
    const data = await fetchMerchantData();

    expect(Array.isArray(data.activity)).toBe(true);
  });

  it('should return activity items with correct structure', async () => {
    const data = await fetchMerchantData();

    if (data.activity.length > 0) {
      const item = data.activity[0];
      expect(item.id).toBeDefined();
      expect(item.type).toBeDefined();
      expect(item.amount).toBeDefined();
      expect(item.currency).toBeDefined();
      expect(item.status).toBeDefined();
      // Activity items should have either created_at or date
      expect(item.created_at || (item as any).date).toBeDefined();
    }
  });

  it('should return activity items with type field', async () => {
    const data = await fetchMerchantData();

    data.activity.forEach(item => {
      expect(item.type).toBeDefined();
      expect(typeof item.type).toBe('string');
    });
  });

  it('should return activity items with status field', async () => {
    const data = await fetchMerchantData();

    data.activity.forEach(item => {
      expect(item.status).toBeDefined();
      expect(typeof item.status).toBe('string');
    });
  });

  it('should return activity items with date field', async () => {
    const data = await fetchMerchantData();

    data.activity.forEach(item => {
      // Activity items should have either created_at or date field
      const dateField = item.created_at || (item as any).date;
      expect(dateField).toBeDefined();
    });
  });

  it('should throw error on network failure', async () => {
    // Mock a network error by using an invalid URL
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    await expect(fetchMerchantData()).rejects.toThrow();

    global.fetch = originalFetch;
  });
});
