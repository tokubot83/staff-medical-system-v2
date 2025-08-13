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

describe('/api/motivation/team-compatibility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('should successfully analyze team compatibility with valid data', async () => {
      const validPayload = {
        teamId: 'nursing-3f',
        teamName: '看護部3階',
        memberIds: [123, 124, 125]
      };

      const mockRequest = {
        json: () => Promise.resolve(validPayload)
      } as NextRequest;

      const response = await POST(mockRequest);
      
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            teamId: 'nursing-3f',
            teamName: '看護部3階',
            members: expect.arrayContaining([
              expect.objectContaining({
                staffId: expect.any(Number),
                name: expect.any(String),
                motivationType: expect.any(String),
                typeName: expect.any(String)
              })
            ]),
            compatibilityMatrix: expect.any(Array),
            overallCompatibility: expect.stringMatching(/^(excellent|good|neutral|caution|difficult)$/),
            recommendations: expect.any(Array),
            insights: expect.objectContaining({
              strongPairs: expect.any(Number),
              cautionPairs: expect.any(Number),
              diversityScore: expect.any(Number)
            })
          })
        })
      );
    });

    it('should return 400 for invalid team data', async () => {
      const invalidPayload = {
        teamId: 'team1',
        memberIds: [123] // Only one member - need at least 2
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
        teamId: 'team1'
        // Missing memberIds
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

    it('should calculate compatibility matrix correctly', async () => {
      const validPayload = {
        teamId: 'test-team',
        memberIds: [1, 2, 3, 4]
      };

      const mockRequest = {
        json: () => Promise.resolve(validPayload)
      } as NextRequest;

      const response = await POST(mockRequest);
      
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            compatibilityMatrix: expect.arrayContaining([
              expect.objectContaining({
                staff1Id: expect.any(Number),
                staff2Id: expect.any(Number),
                compatibilityLevel: expect.stringMatching(/^(excellent|good|neutral|caution|difficult)$/),
                description: expect.any(String)
              })
            ])
          })
        })
      );

      // For 4 members, should have 6 pairs (n*(n-1)/2)
      const callArgs = mockNextResponse.json.mock.calls[0][0];
      expect(callArgs.data.compatibilityMatrix).toHaveLength(6);
    });

    it('should provide appropriate recommendations based on team composition', async () => {
      const validPayload = {
        teamId: 'diverse-team',
        memberIds: [1, 2, 3, 4, 5]
      };

      const mockRequest = {
        json: () => Promise.resolve(validPayload)
      } as NextRequest;

      const response = await POST(mockRequest);
      
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            recommendations: expect.arrayContaining([
              expect.any(String)
            ])
          })
        })
      );
    });

    it('should calculate diversity score correctly', async () => {
      const validPayload = {
        teamId: 'test-team',
        memberIds: [1, 2, 3]
      };

      const mockRequest = {
        json: () => Promise.resolve(validPayload)
      } as NextRequest;

      const response = await POST(mockRequest);
      
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            insights: expect.objectContaining({
              diversityScore: expect.any(Number)
            })
          })
        })
      );

      const callArgs = mockNextResponse.json.mock.calls[0][0];
      const diversityScore = callArgs.data.insights.diversityScore;
      expect(diversityScore).toBeGreaterThanOrEqual(0);
      expect(diversityScore).toBeLessThanOrEqual(100);
    });

    it('should handle server errors gracefully', async () => {
      const mockRequest = {
        json: () => Promise.reject(new Error('Network error'))
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
  });
});