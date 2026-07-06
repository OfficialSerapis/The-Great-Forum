import { AISuggestionsService } from '../server/services/aiSuggestionsService';
import { Document } from '../server/models/document.model';
import { MockDocument } from './mocks/document.mock';

describe('AISuggestionsService', () => {
  let aiSuggestionsService: AISuggestionsService;
  let mockDocument: Document;

  beforeEach(() => {
    aiSuggestionsService = new AISuggestionsService();
    mockDocument = MockDocument.build({
      id: 1,
      title: 'Test Document',
      content: 'This is a test document content.',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1,
      version: 1,
      status: 'active',
      createdBy: 1,
      updatedBy: 1,
      isPublic: true,
      lastEditedAt: new Date()
    });
  });

  describe('generateSuggestions', () => {
    it('should generate suggestions for a document', async () => {
      const suggestions = await aiSuggestionsService.generateSuggestions(mockDocument);
      
      expect(suggestions).toBeDefined();
      expect(Array.isArray(suggestions)).toBe(true);
      
      suggestions.forEach(suggestion => {
        expect(suggestion).toMatchObject({
          type: expect.any(String),
          suggestion: expect.any(String),
          confidence: expect.any(Number),
          metadata: {
            source: expect.any(String),
            relevance: expect.any(Number),
            impact: expect.any(Number)
          }
        });
      });
    });
  });

  describe('analyzeContent', () => {
    it('should analyze content and return analysis', async () => {
      const content = 'This is some content to analyze.';
      const analysis = await aiSuggestionsService.analyzeContent(content);
      
      expect(analysis).toBeDefined();
      expect(analysis).toHaveProperty('readability');
      expect(analysis).toHaveProperty('tone');
      expect(analysis).toHaveProperty('structure');
    });
  });

  describe('enhanceDocument', () => {
    it('should enhance document with specified enhancements', async () => {
      const enhancements = {
        readability: true,
        clarity: true,
        engagement: true
      };
      
      const enhancedContent = await aiSuggestionsService.enhanceDocument(
        mockDocument.id,
        enhancements
      );
      
      expect(enhancedContent).toBeDefined();
      expect(enhancedContent).toHaveProperty('content');
      expect(enhancedContent).toHaveProperty('improvements');
    });
  });

  describe('recognizePatterns', () => {
    it('should recognize patterns in document', async () => {
      const patterns = await aiSuggestionsService.recognizePatterns(mockDocument.id);
      
      expect(patterns).toBeDefined();
      expect(Array.isArray(patterns)).toBe(true);
      
      patterns.forEach(pattern => {
        expect(pattern).toMatchObject({
          type: expect.any(String),
          description: expect.any(String),
          examples: expect.any(Array),
          confidence: expect.any(Number)
        });
      });
    });
  });
});
