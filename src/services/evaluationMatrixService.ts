/**
 * 評価マトリックスサービス
 *
 * 動的なマトリックス定義を適用して評価を計算
 */

import { MatrixTableEntry } from '@/data/evaluationMatrixTable';

export interface DepartmentOverride {
  department: string;
  facility: string;
  overrides: Array<{
    facilityGrade: string;
    corporateGrade: string;
    finalGrade: string;
    finalGradeLabel: string;
    overrideDate: string;
  }>;
}

export interface SalaryConfiguration {
  grade: string;
  rate: number;
  bonus: number;
  description: string;
}

export class EvaluationMatrixService {
  private static instance: EvaluationMatrixService;
  private matrixDefinition: MatrixTableEntry[] = [];
  private departmentOverrides: Map<string, DepartmentOverride> = new Map();
  private salaryConfiguration: Map<string, SalaryConfiguration> = new Map();

  private constructor() {
    this.loadConfiguration();
  }

  public static getInstance(): EvaluationMatrixService {
    if (!EvaluationMatrixService.instance) {
      EvaluationMatrixService.instance = new EvaluationMatrixService();
    }
    return EvaluationMatrixService.instance;
  }

  /**
   * 設定をロード（初期化時またはリロード時）
   */
  private loadConfiguration(): void {
    // ローカルストレージから読み込み（実際はAPIから）
    const savedMatrix = localStorage.getItem('evaluationMatrix');
    const savedSalary = localStorage.getItem('salaryMaster');
    const savedOverrides = localStorage.getItem('departmentOverrides');

    if (savedMatrix) {
      this.matrixDefinition = JSON.parse(savedMatrix);
    }

    if (savedSalary) {
      const salaryData = JSON.parse(savedSalary);
      Object.keys(salaryData).forEach(grade => {
        this.salaryConfiguration.set(grade, salaryData[grade]);
      });
    }

    if (savedOverrides) {
      const overridesData = JSON.parse(savedOverrides);
      Object.keys(overridesData).forEach(dept => {
        this.departmentOverrides.set(dept, {
          department: dept,
          facility: '',
          overrides: overridesData[dept]
        });
      });
    }
  }

  /**
   * 最終評価を計算
   */
  public calculateFinalEvaluation(
    facilityGrade: string,
    corporateGrade: string,
    department?: string,
    facility?: string
  ): {
    finalGrade: string;
    finalGradeLabel: string;
    isOverride: boolean;
    salaryImpact?: {
      rate: number;
      bonus: number;
    };
  } {
    let finalGrade: string = '';
    let finalGradeLabel: string = '';
    let isOverride = false;

    // 1. 部署別オーバーライドをチェック
    if (department && this.departmentOverrides.has(department)) {
      const deptOverride = this.departmentOverrides.get(department);
      const override = deptOverride?.overrides.find(
        o => o.facilityGrade === facilityGrade && o.corporateGrade === corporateGrade
      );

      if (override) {
        finalGrade = override.finalGrade;
        finalGradeLabel = override.finalGradeLabel;
        isOverride = true;
      }
    }

    // 2. オーバーライドがない場合は標準マトリックスを使用
    if (!finalGrade && this.matrixDefinition.length > 0) {
      const entry = this.matrixDefinition.find(
        e => e.facilityGrade === facilityGrade && e.corporateGrade === corporateGrade
      );

      if (entry) {
        finalGrade = entry.finalGrade;
        finalGradeLabel = entry.finalGradeLabel;
      }
    }

    // 3. 給与影響を取得
    const salaryConfig = this.salaryConfiguration.get(finalGrade);

    return {
      finalGrade,
      finalGradeLabel,
      isOverride,
      salaryImpact: salaryConfig ? {
        rate: salaryConfig.rate,
        bonus: salaryConfig.bonus
      } : undefined
    };
  }

  /**
   * 給与計算
   */
  public calculateSalaryAdjustment(
    currentSalary: number,
    finalGrade: string
  ): {
    newSalary: number;
    adjustmentAmount: number;
    adjustmentRate: number;
    bonusMultiplier: number;
  } {
    const salaryConfig = this.salaryConfiguration.get(finalGrade);

    if (!salaryConfig) {
      return {
        newSalary: currentSalary,
        adjustmentAmount: 0,
        adjustmentRate: 0,
        bonusMultiplier: 1
      };
    }

    const newSalary = Math.round(currentSalary * salaryConfig.rate);
    const adjustmentAmount = newSalary - currentSalary;
    const adjustmentRate = (salaryConfig.rate - 1) * 100;

    return {
      newSalary,
      adjustmentAmount,
      adjustmentRate,
      bonusMultiplier: salaryConfig.bonus
    };
  }

  /**
   * 部署の評価分布を取得
   */
  public getDepartmentEvaluationDistribution(
    department: string,
    employees: Array<{ facilityGrade: string; corporateGrade: string }>
  ): Record<string, number> {
    const distribution: Record<string, number> = {
      '7': 0, '6': 0, '5': 0, '4': 0, '3': 0, '2': 0, '1': 0
    };

    employees.forEach(emp => {
      const result = this.calculateFinalEvaluation(
        emp.facilityGrade,
        emp.corporateGrade,
        department
      );
      if (result.finalGrade) {
        distribution[result.finalGrade]++;
      }
    });

    return distribution;
  }

  /**
   * マトリックス定義を更新
   */
  public updateMatrixDefinition(newMatrix: MatrixTableEntry[]): void {
    this.matrixDefinition = newMatrix;
    localStorage.setItem('evaluationMatrix', JSON.stringify(newMatrix));
  }

  /**
   * 部署別オーバーライドを更新
   */
  public updateDepartmentOverride(department: string, override: DepartmentOverride): void {
    this.departmentOverrides.set(department, override);
    const allOverrides: Record<string, any> = {};
    this.departmentOverrides.forEach((value, key) => {
      allOverrides[key] = value.overrides;
    });
    localStorage.setItem('departmentOverrides', JSON.stringify(allOverrides));
  }

  /**
   * 給与設定を更新
   */
  public updateSalaryConfiguration(grade: string, config: SalaryConfiguration): void {
    this.salaryConfiguration.set(grade, config);
    const allConfigs: Record<string, SalaryConfiguration> = {};
    this.salaryConfiguration.forEach((value, key) => {
      allConfigs[key] = value;
    });
    localStorage.setItem('salaryMaster', JSON.stringify(allConfigs));
  }

  /**
   * 評価シミュレーション
   */
  public simulateEvaluationChange(
    employees: Array<{
      id: string;
      name: string;
      facilityGrade: string;
      corporateGrade: string;
      currentSalary: number;
      department?: string;
    }>,
    newMatrixDefinition?: MatrixTableEntry[]
  ): {
    totalCostImpact: number;
    affectedEmployees: number;
    distributionChange: Record<string, { before: number; after: number }>;
    details: Array<{
      id: string;
      name: string;
      beforeGrade: string;
      afterGrade: string;
      salaryChange: number;
    }>;
  } {
    const tempMatrix = this.matrixDefinition;
    if (newMatrixDefinition) {
      this.matrixDefinition = newMatrixDefinition;
    }

    const distribution: Record<string, { before: number; after: number }> = {
      '7': { before: 0, after: 0 },
      '6': { before: 0, after: 0 },
      '5': { before: 0, after: 0 },
      '4': { before: 0, after: 0 },
      '3': { before: 0, after: 0 },
      '2': { before: 0, after: 0 },
      '1': { before: 0, after: 0 },
    };

    let totalCostImpact = 0;
    let affectedEmployees = 0;
    const details: any[] = [];

    employees.forEach(emp => {
      // 現在の評価を計算
      this.matrixDefinition = tempMatrix;
      const currentEval = this.calculateFinalEvaluation(
        emp.facilityGrade,
        emp.corporateGrade,
        emp.department
      );

      // 新しい評価を計算
      if (newMatrixDefinition) {
        this.matrixDefinition = newMatrixDefinition;
      }
      const newEval = this.calculateFinalEvaluation(
        emp.facilityGrade,
        emp.corporateGrade,
        emp.department
      );

      distribution[currentEval.finalGrade].before++;
      distribution[newEval.finalGrade].after++;

      if (currentEval.finalGrade !== newEval.finalGrade) {
        affectedEmployees++;
        const salaryAdjustment = this.calculateSalaryAdjustment(
          emp.currentSalary,
          newEval.finalGrade
        );

        totalCostImpact += salaryAdjustment.adjustmentAmount;

        details.push({
          id: emp.id,
          name: emp.name,
          beforeGrade: currentEval.finalGrade,
          afterGrade: newEval.finalGrade,
          salaryChange: salaryAdjustment.adjustmentAmount
        });
      }
    });

    // 元のマトリックスに戻す
    this.matrixDefinition = tempMatrix;

    return {
      totalCostImpact,
      affectedEmployees,
      distributionChange: distribution,
      details
    };
  }

  /**
   * 設定をリセット
   */
  public resetConfiguration(): void {
    localStorage.removeItem('evaluationMatrix');
    localStorage.removeItem('salaryMaster');
    localStorage.removeItem('departmentOverrides');
    this.loadConfiguration();
  }
}