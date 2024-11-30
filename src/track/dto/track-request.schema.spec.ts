import { TrackRequestSchema } from './track-request.schema';

describe('TrackRequestSchema', () => {
  it('should validate a valid payload', () => {
    const validPayload = {
      id: 1,
      count: 10,
      content: 'Sample Content',
      whatever: null,
    };

    const result = TrackRequestSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it('should allow content to be optional', () => {
    const validPayload = {
      id: 1,
      count: 10,
      whatever: null,
    };

    const result = TrackRequestSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it('should throw an error if id is missing', () => {
    const invalidPayload = {
      count: 10,
      content: 'Sample Content',
      whatever: null,
    };

    const result = TrackRequestSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('Required');
      expect(result.error.errors[0].path).toEqual(['id']);
    }
  });

  it('should throw an error if count is not a number', () => {
    const invalidPayload = {
      id: 1,
      count: 'not-a-number',
      content: 'Sample Content',
      whatever: null,
    };

    const result = TrackRequestSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('Expected number');
      expect(result.error.errors[0].path).toEqual(['count']);
    }
  });

  it('should allow whatever to be null', () => {
    const validPayload = {
      id: 1,
      count: 10,
      content: 'Sample Content',
      whatever: null,
    };

    const result = TrackRequestSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it('should throw an error if unexpected properties are provided', () => {
    const invalidPayload = {
      id: 1,
      count: 10,
      content: 'Sample Content',
      whatever: null,
      extraField: 'Unexpected', // Extra field
    };

    const result = TrackRequestSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('Unrecognized key(s)');
    }
  });
});
