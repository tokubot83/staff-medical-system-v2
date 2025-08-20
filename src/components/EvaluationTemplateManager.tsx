import React, { useState, useEffect } from 'react';
import { 
  templateBank, 
  V3EvaluationTemplate, 
  getAvailableTemplatesForProfile,
  generateTemplatePreview 
} from '../data/evaluationTemplateBank';
import { 
  facilityTypes, 
  roles, 
  experienceLevels 
} from '../data/evaluationItemBank';

interface EvaluationTemplateManagerProps {
  onTemplateSelect?: (template: V3EvaluationTemplate) => void;
  currentFacilityType?: string;
  currentRole?: string;
  currentExperienceLevel?: string;
}

const EvaluationTemplateManager: React.FC<EvaluationTemplateManagerProps> = ({
  onTemplateSelect,
  currentFacilityType,
  currentRole,
  currentExperienceLevel
}) => {
  const [selectedFilters, setSelectedFilters] = useState({
    facilityType: currentFacilityType || '',
    role: currentRole || '',
    experienceLevel: currentExperienceLevel || ''
  });
  
  const [availableTemplates, setAvailableTemplates] = useState<{
    recommended: V3EvaluationTemplate[];
    standard: V3EvaluationTemplate[];
    all: V3EvaluationTemplate[];
  }>({
    recommended: [],
    standard: [],
    all: []
  });

  const [selectedTemplate, setSelectedTemplate] = useState<V3EvaluationTemplate | null>(null);
  const [templatePreview, setTemplatePreview] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'recommended' | 'standard' | 'all' | 'custom'>('recommended');
  const [showPreview, setShowPreview] = useState(false);

  // フィルタ変更時の処理
  useEffect(() => {
    if (selectedFilters.facilityType && selectedFilters.role && selectedFilters.experienceLevel) {
      const templates = getAvailableTemplatesForProfile(
        selectedFilters.facilityType,
        selectedFilters.role,
        selectedFilters.experienceLevel
      );
      setAvailableTemplates(templates);
    } else {
      setAvailableTemplates({
        recommended: [],
        standard: templateBank.getTemplatesByCategory('standard'),
        all: templateBank.getAllTemplates()
      });
    }
  }, [selectedFilters]);

  // テンプレート選択時のプレビュー生成
  const handleTemplateSelect = (template: V3EvaluationTemplate) => {
    setSelectedTemplate(template);
    const preview = generateTemplatePreview(template.id);
    setTemplatePreview(preview);
    setShowPreview(true);
  };

  // テンプレート適用
  const handleApplyTemplate = () => {
    if (selectedTemplate && onTemplateSelect) {
      onTemplateSelect(selectedTemplate);
    }
  };

  // テンプレートカード表示
  const renderTemplateCard = (template: V3EvaluationTemplate) => (
    <div 
      key={template.id}
      className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => handleTemplateSelect(template)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{template.name}</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {template.category}
          </span>
          <div className="text-right">
            <div className="text-sm text-gray-500">人気度</div>
            <div className="text-sm font-bold">{template.usageMetrics.popularity}%</div>
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-3">{template.description}</p>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <span className="font-medium">施設種別:</span>
          <div>{facilityTypes[template.targetProfile.facilityType] || template.targetProfile.facilityType}</div>
        </div>
        <div>
          <span className="font-medium">対象職種:</span>
          <div>{template.targetProfile.roles.map(r => roles[r] || r).join(', ')}</div>
        </div>
        <div>
          <span className="font-medium">経験レベル:</span>
          <div>{template.targetProfile.experienceLevels.map(l => experienceLevels[l] || l).join(', ')}</div>
        </div>
      </div>

      <div className="mt-3 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          適用対象: 約{template.targetProfile.applicableStaffCount}名
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-yellow-600">★ {template.usageMetrics.feedbackScore}</span>
          <span className="text-green-600">成功率 {template.usageMetrics.successRate}%</span>
        </div>
      </div>
    </div>
  );

  // テンプレートリスト表示
  const renderTemplateList = () => {
    let templates: V3EvaluationTemplate[] = [];
    
    switch (activeTab) {
      case 'recommended':
        templates = availableTemplates.recommended;
        break;
      case 'standard':
        templates = availableTemplates.standard;
        break;
      case 'all':
        templates = availableTemplates.all;
        break;
      case 'custom':
        templates = templateBank.getTemplatesByCategory('custom');
        break;
    }

    if (templates.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          {activeTab === 'recommended' && (!selectedFilters.facilityType || !selectedFilters.role || !selectedFilters.experienceLevel)
            ? '職員属性を選択すると推奨テンプレートが表示されます'
            : `${activeTab}テンプレートが見つかりません`
          }
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {templates.map(renderTemplateCard)}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">評価テンプレート管理</h2>
        <p className="text-gray-600">
          職員属性に応じた最適な評価テンプレートを選択・カスタマイズできます
        </p>
      </div>

      {/* フィルタ部分 */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-3">職員属性フィルタ</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">施設種別</label>
            <select 
              className="w-full p-2 border rounded-md"
              value={selectedFilters.facilityType}
              onChange={(e) => setSelectedFilters({...selectedFilters, facilityType: e.target.value})}
            >
              <option value="">選択してください</option>
              {Object.entries(facilityTypes).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">職種</label>
            <select 
              className="w-full p-2 border rounded-md"
              value={selectedFilters.role}
              onChange={(e) => setSelectedFilters({...selectedFilters, role: e.target.value})}
            >
              <option value="">選択してください</option>
              {Object.entries(roles).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">経験レベル</label>
            <select 
              className="w-full p-2 border rounded-md"
              value={selectedFilters.experienceLevel}
              onChange={(e) => setSelectedFilters({...selectedFilters, experienceLevel: e.target.value})}
            >
              <option value="">選択してください</option>
              {Object.entries(experienceLevels).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* テンプレートリスト部分 */}
        <div className="w-2/3 pr-6">
          {/* タブ */}
          <div className="border-b mb-4">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'recommended', label: '推奨', count: availableTemplates.recommended.length },
                { key: 'standard', label: '標準', count: availableTemplates.standard.length },
                { key: 'all', label: 'すべて', count: availableTemplates.all.length },
                { key: 'custom', label: 'カスタム', count: templateBank.getTemplatesByCategory('custom').length }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>

          {renderTemplateList()}
        </div>

        {/* プレビュー部分 */}
        <div className="w-1/3">
          {showPreview && selectedTemplate && templatePreview ? (
            <div className="bg-gray-50 p-4 rounded-lg sticky top-4">
              <h3 className="font-semibold mb-3">テンプレートプレビュー</h3>
              
              <div className="mb-4">
                <h4 className="font-medium text-lg">{selectedTemplate.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{selectedTemplate.description}</p>
              </div>

              <div className="space-y-3">
                <div className="bg-white p-3 rounded">
                  <h5 className="font-medium text-sm mb-2">評価構造</h5>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>技術評価</span>
                      <span className="font-medium">50点</span>
                    </div>
                    <div className="ml-4 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>- 法人統一</span>
                        <span>30点</span>
                      </div>
                      <div className="flex justify-between">
                        <span>- 施設特化</span>
                        <span>20点</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>組織貢献</span>
                      <span className="font-medium">50点</span>
                    </div>
                    <div className="ml-4 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>- 施設貢献</span>
                        <span>25点</span>
                      </div>
                      <div className="flex justify-between">
                        <span>- 法人貢献</span>
                        <span>25点</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded">
                  <h5 className="font-medium text-sm mb-2">評価項目数</h5>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>技術評価項目</span>
                      <span>{templatePreview.preview.technicalItems.length}項目</span>
                    </div>
                    <div className="flex justify-between">
                      <span>組織貢献項目</span>
                      <span>{templatePreview.preview.contributionItems.length}項目</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>合計</span>
                      <span>{templatePreview.preview.technicalItems.length + templatePreview.preview.contributionItems.length}項目</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded">
                  <h5 className="font-medium text-sm mb-2">使用統計</h5>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>人気度</span>
                      <span>{selectedTemplate.usageMetrics.popularity}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>成功率</span>
                      <span>{selectedTemplate.usageMetrics.successRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>評価時間</span>
                      <span>約{templatePreview.preview.estimatedEvaluationTime}分</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <button
                  onClick={handleApplyTemplate}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  このテンプレートを適用
                </button>
                <button
                  onClick={() => {/* カスタマイズ機能を後で実装 */}}
                  className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  カスタマイズして使用
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500 sticky top-4">
              テンプレートを選択すると
              <br />プレビューが表示されます
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvaluationTemplateManager;