import { NextRequest } from 'next/server';
import { POST } from './route';

// Mock Next.js response for testing
const mockNextResponse = {
  json: jest.fn().mockImplementation((data, init) => ({
    json: () => Promise.resolve(data),
    status: init?.status || 200,
    ok: init?.status < 400
  }))
};

// Replace NextResponse with our mock
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: mockNextResponse
}));

describe('/api/motivation/assess', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('should successfully assess motivation type with valid data', async () => {
      const validPayload = {
        staffId: 123,
        motivationTypeId: 'growth',
        confidenceLevel: 'high',
        notes: 'Test assessment',
        assessedBy: 1
      };

      const mockRequest = {
        json: () => Promise.resolve(validPayload)
      } as NextRequest;

      const response = await POST(mockRequest);
      
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            historyId: expect.any(Number),
            motivationType: expect.objectContaining({
              id: 'growth',
              typeName: '成長・挑戦型'
            }),
            recommendedActions: expect.any(Array)
          })
        }),
        { status: 201 }
      );
    });

    it('should return 400 for invalid motivation type', async () => {
      const invalidPayload = {
        staffId: 123,
        motivationTypeId: 'invalid_type',
        confidenceLevel: 'high',
        assessedBy: 1
      };

      const mockRequest = {
        json: () => Promise.resolve(invalidPayload)
      } as NextRequest;

      const response = await POST(mockRequest);
      
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Invalid input data'
        }),
        { status: 400 }
      );
    });

    it('should return 400 for missing required fields', async () => {
      const incompletePayload = {
        staffId: 123
        // Missing required fields
      };

      const mockRequest = {
        json: () => Promise.resolve(incompletePayload)
      } as NextRequest;

      const response = await POST(mockRequest);
      
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Invalid input data'
        }),
        { status: 400 }
      );
    });

    it('should handle server errors gracefully', async () => {
      const mockRequest = {
        json: () => Promise.reject(new Error('Database error'))
      } as NextRequest;

      const response = await POST(mockRequest);
      
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Internal server error'
        }),
        { status: 500 }
      );
    });

    it('should include all motivation types in response data', async () => {
      const validPayload = {
        staffId: 123,
        motivationTypeId: 'recognition',
        confidenceLevel: 'medium',
        assessedBy: 1
      };

      const mockRequest = {
        json: () => Promise.resolve(validPayload)
      } as NextRequest;

      const response = await POST(mockRequest);
      
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            motivationType: expect.objectContaining({
              id: 'recognition',
              typeName: '評価・承認型',
              keywords: expect.arrayContaining(['評価', '表彰', '昇進', '承認', '認知'])
            })
          })
        }),
        { status: 201 }
      );
    });

    it('should validate confidence level enum', async () => {
      const payloadWithInvalidConfidence = {
        staffId: 123,
        motivationTypeId: 'growth',
        confidenceLevel: 'invalid_level',
        assessedBy: 1
      };

      const mockRequest = {
        json: () => Promise.resolve(payloadWithInvalidConfidence)
      } as NextRequest;

      const response = await POST(mockRequest);
      
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Invalid input data'
        }),
        { status: 400 }
      );
    });
  });
});