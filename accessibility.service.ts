import { DocumentInstance } from '../models/document.model';

class AccessibilityService {
  private static instance: AccessibilityService;
  private constructor() {}

  public static getInstance(): AccessibilityService {
    if (!AccessibilityService.instance) {
      AccessibilityService.instance = new AccessibilityService();
    }
    return AccessibilityService.instance;
  }

  async checkAccessibility(document: DocumentInstance): Promise<any> {
    try {
      const content = document.content;
      const checks = this.runAccessibilityChecks(content);
      return {
        score: this.calculateAccessibilityScore(checks),
        issues: checks,
        recommendations: this.generateRecommendations(checks)
      };
    } catch (error) {
      throw new Error('Failed to check accessibility');
    }
  }

  private runAccessibilityChecks(content: string): any[] {
    const checks = [
      this.checkAltText(content),
      this.checkContrast(content),
      this.checkKeyboardNavigation(content),
      this.checkSemanticStructure(content)
    ];
    return checks;
  }

  private calculateAccessibilityScore(checks: any[]): number {
    let score = 100;
    checks.forEach(check => {
      if (check.severity === 'critical') {
        score -= 20;
      } else if (check.severity === 'high') {
        score -= 10;
      } else if (check.severity === 'medium') {
        score -= 5;
      }
    });
    return Math.max(0, score);
  }

  private generateRecommendations(checks: any[]): any[] {
    return checks
      .filter(check => check.severity !== 'none')
      .map(check => ({
        issue: check.description,
        priority: check.severity,
        solution: check.recommendation
      }));
  }

  private checkAltText(content: string): any {
    // Check for missing alt text
    return {
      description: 'Missing alternative text for images',
      severity: this.hasMissingAltText(content) ? 'high' : 'none',
      recommendation: 'Add descriptive alternative text for all images'
    };
  }

  private checkContrast(content: string): any {
    // Check color contrast
    return {
      description: 'Insufficient color contrast',
      severity: this.hasLowContrast(content) ? 'medium' : 'none',
      recommendation: 'Improve color contrast for better readability'
    };
  }

  private checkKeyboardNavigation(content: string): any {
    // Check keyboard navigation
    return {
      description: 'Keyboard navigation issues',
      severity: this.hasKeyboardNavigationIssues(content) ? 'high' : 'none',
      recommendation: 'Ensure all interactive elements are keyboard accessible'
    };
  }

  private checkSemanticStructure(content: string): any {
    // Check semantic structure
    return {
      description: 'Semantic structure issues',
      severity: this.hasSemanticStructureIssues(content) ? 'medium' : 'none',
      recommendation: 'Use proper semantic HTML elements'
    };
  }

  private hasMissingAltText(content: string): boolean {
    // Check for missing alt text
    return content.includes('<img') && !content.includes('alt="');
  }

  private hasLowContrast(content: string): boolean {
    // Check for low contrast
    return content.includes('color:') && !content.includes('contrast-ratio');
  }

  private hasKeyboardNavigationIssues(content: string): boolean {
    // Check for keyboard navigation issues
    return content.includes('tabindex') && !content.includes('role="');
  }

  private hasSemanticStructureIssues(content: string): boolean {
    // Check for semantic structure issues
    return content.includes('<div class="') && !content.includes('<section') && !content.includes('<article');
  }
}

export const accessibilityService = AccessibilityService.getInstance();
