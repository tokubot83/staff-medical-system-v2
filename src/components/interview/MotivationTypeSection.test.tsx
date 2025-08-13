import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MotivationTypeSection } from './MotivationTypeSection';

// Mock fetch
global.fetch = jest.fn();

describe('MotivationTypeSection', () => {
  const mockOnTypeSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockReset();
  });

  it('should render motivation type options', () => {
    render(
      <MotivationTypeSection
        onTypeSelect={mockOnTypeSelect}
      />
    );

    expect(screen.getByText('動機タイプ判定')).toBeInTheDocument();
    expect(screen.getByText('仕事で最もやりがいを感じるのはどのような時ですか？')).toBeInTheDocument();
    
    // Check all 7 motivation types are present
    expect(screen.getByText('成長・挑戦型')).toBeInTheDocument();
    expect(screen.getByText('評価・承認型')).toBeInTheDocument();
    expect(screen.getByText('安定・安心型')).toBeInTheDocument();
    expect(screen.getByText('関係・調和型')).toBeInTheDocument();
    expect(screen.getByText('効率・合理型')).toBeInTheDocument();
    expect(screen.getByText('報酬・待遇型')).toBeInTheDocument();
    expect(screen.getByText('自由・創造型')).toBeInTheDocument();
  });

  it('should call onTypeSelect when a motivation type is selected', () => {
    render(
      <MotivationTypeSection
        onTypeSelect={mockOnTypeSelect}
      />
    );

    const growthOption = screen.getByDisplayValue('growth');
    fireEvent.click(growthOption);

    expect(mockOnTypeSelect).toHaveBeenCalledWith('growth');
  });

  it('should show result when a type is selected', () => {
    render(
      <MotivationTypeSection
        selectedType="growth"
        onTypeSelect={mockOnTypeSelect}
      />
    );

    expect(screen.getByText('判定結果:')).toBeInTheDocument();
    expect(screen.getByText('成長・挑戦型')).toBeInTheDocument();
    expect(screen.getByText('特徴:')).toBeInTheDocument();
    expect(screen.getByText('推奨アプローチ:')).toBeInTheDocument();
    expect(screen.getByText('キーワード:')).toBeInTheDocument();
  });

  it('should display type-specific questions when a type is selected', () => {
    render(
      <MotivationTypeSection
        selectedType="growth"
        onTypeSelect={mockOnTypeSelect}
      />
    );

    expect(screen.getByText('タイプ別深掘り質問')).toBeInTheDocument();
    expect(screen.getByText(/最近学んだ新しいスキルや知識について/)).toBeInTheDocument();
    expect(screen.getByText(/今後挑戦したい業務や習得したいスキル/)).toBeInTheDocument();
  });

  it('should show confidence level options', () => {
    render(
      <MotivationTypeSection
        selectedType="recognition"
        onTypeSelect={mockOnTypeSelect}
      />
    );

    expect(screen.getByText('判定の信頼度')).toBeInTheDocument();
    expect(screen.getByText('高い - 明確に該当')).toBeInTheDocument();
    expect(screen.getByText('中程度 - 概ね該当')).toBeInTheDocument();
    expect(screen.getByText('低い - 暫定的')).toBeInTheDocument();
  });

  it('should fetch and display motivation history when showHistory is true', async () => {
    const mockHistoryData = {
      success: true,
      data: {
        history: [
          {
            id: 1,
            typeName: '成長・挑戦型',
            assessmentDate: '2024-01-15',
            assessorName: '田中部長',
            confidenceLevel: 'high',
            notes: 'テスト所見'
          }
        ]
      }
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockHistoryData)
    });

    render(
      <MotivationTypeSection
        selectedType="growth"
        onTypeSelect={mockOnTypeSelect}
        staffId={123}
        showHistory={true}
      />
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/motivation/history/123');
    });

    await waitFor(() => {
      expect(screen.getByText('動機タイプ履歴')).toBeInTheDocument();
      expect(screen.getByText('成長・挑戦型')).toBeInTheDocument();
      expect(screen.getByText('田中部長')).toBeInTheDocument();
    });
  });

  it('should handle different motivation types correctly', () => {
    const { rerender } = render(
      <MotivationTypeSection
        selectedType="efficiency"
        onTypeSelect={mockOnTypeSelect}
      />
    );

    expect(screen.getByText('効率・合理型')).toBeInTheDocument();
    expect(screen.getByText(/無駄な作業を改善・効率化/)).toBeInTheDocument();

    rerender(
      <MotivationTypeSection
        selectedType="teamwork"
        onTypeSelect={mockOnTypeSelect}
      />
    );

    expect(screen.getByText('関係・調和型')).toBeInTheDocument();
    expect(screen.getByText(/チームで協力して目標を達成/)).toBeInTheDocument();
  });

  it('should show appropriate keywords for each type', () => {
    render(
      <MotivationTypeSection
        selectedType="creativity"
        onTypeSelect={mockOnTypeSelect}
      />
    );

    expect(screen.getByText('自由')).toBeInTheDocument();
    expect(screen.getByText('創造性')).toBeInTheDocument();
    expect(screen.getByText('個性')).toBeInTheDocument();
    expect(screen.getByText('独自性')).toBeInTheDocument();
    expect(screen.getByText('裁量')).toBeInTheDocument();
  });

  it('should handle fetch errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(
      <MotivationTypeSection
        selectedType="growth"
        onTypeSelect={mockOnTypeSelect}
        staffId={123}
        showHistory={true}
      />
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch motivation history:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('should allow editing notes in the type-specific section', () => {
    render(
      <MotivationTypeSection
        selectedType="stability"
        onTypeSelect={mockOnTypeSelect}
      />
    );

    const notesTextarea = screen.getByPlaceholderText(/面談での観察、具体的なエピソード/);
    fireEvent.change(notesTextarea, { target: { value: 'テスト所見を入力' } });

    expect(notesTextarea).toHaveValue('テスト所見を入力');
  });
});