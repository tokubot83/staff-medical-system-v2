'use client';

import React, { useState } from 'react';
import styles from './Recruitment.module.css';
import { jobPostings, applicants, interviewSchedules } from '@/app/data/recruitmentData';
import { JobPosting, Applicant } from '@/types/recruitment';

type TabType = 'jobPostings' | 'applicants' | 'interviews' | 'onboarding' | 'analytics';

export default function RecruitmentPage() {
  const [activeTab, setActiveTab] = useState<TabType>('jobPostings');
  const [selectedJobPosting, setSelectedJobPosting] = useState<JobPosting | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
        return styles.statusActive;
      case 'closed':
      case 'rejected':
        return styles.statusClosed;
      case 'draft':
      case 'new':
      case 'screening':
        return styles.statusPending;
      case 'offer':
        return styles.statusOffer;
      default:
        return styles.statusDefault;
    }
  };

  const getApplicantsByJobId = (jobId: string) => {
    return applicants.filter(applicant => applicant.jobPostingId === jobId);
  };

  const renderJobPostings = () => (
    <div className={styles.tabContent}>
      <div className={styles.header}>
        <h2>求人管理</h2>
        <button className={styles.primaryButton}>新規求人作成</button>
      </div>
      
      <div className={styles.filterBar}>
        <select className={styles.filterSelect}>
          <option value="">すべての施設</option>
          <option value="obara-hospital">小原病院</option>
          <option value="tachigami-hospital">立神リハビリテーション温泉病院</option>
        </select>
        <select className={styles.filterSelect}>
          <option value="">すべてのステータス</option>
          <option value="active">募集中</option>
          <option value="closed">募集終了</option>
          <option value="draft">下書き</option>
        </select>
        <input 
          type="text" 
          placeholder="求人を検索..." 
          className={styles.searchInput}
        />
      </div>

      <div className={styles.jobGrid}>
        {jobPostings.map(job => (
          <div 
            key={job.id} 
            className={styles.jobCard}
            onClick={() => setSelectedJobPosting(job)}
          >
            <div className={styles.jobHeader}>
              <h3>{job.title}</h3>
              <span className={`${styles.statusBadge} ${getStatusBadgeClass(job.status)}`}>
                {job.status === 'active' ? '募集中' : 
                 job.status === 'closed' ? '募集終了' : 
                 job.status === 'draft' ? '下書き' : '採用済み'}
              </span>
            </div>
            <div className={styles.jobInfo}>
              <p><strong>施設:</strong> {job.facility === 'obara-hospital' ? '小原病院' : '立神リハビリテーション温泉病院'}</p>
              <p><strong>部門:</strong> {job.department}</p>
              <p><strong>雇用形態:</strong> {job.employmentType}</p>
              <p><strong>募集人数:</strong> {job.numberOfPositions}名</p>
              <p><strong>給与:</strong> {job.salary.min.toLocaleString()}円～{job.salary.max.toLocaleString()}円</p>
              <p><strong>応募締切:</strong> {new Date(job.closingDate).toLocaleDateString()}</p>
            </div>
            <div className={styles.jobStats}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{getApplicantsByJobId(job.id).length}</span>
                <span className={styles.statLabel}>応募者数</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>
                  {getApplicantsByJobId(job.id).filter(a => a.status === 'screening').length}
                </span>
                <span className={styles.statLabel}>選考中</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderApplicants = () => (
    <div className={styles.tabContent}>
      <div className={styles.header}>
        <h2>応募者管理</h2>
        <div className={styles.headerActions}>
          <button className={styles.secondaryButton}>エクスポート</button>
        </div>
      </div>

      <div className={styles.applicantTable}>
        <table>
          <thead>
            <tr>
              <th>応募日</th>
              <th>氏名</th>
              <th>応募職種</th>
              <th>現在の勤務先</th>
              <th>ステータス</th>
              <th>評価</th>
              <th>アクション</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map(applicant => {
              const job = jobPostings.find(j => j.id === applicant.jobPostingId);
              const latestEvaluation = applicant.evaluations[applicant.evaluations.length - 1];
              return (
                <tr key={applicant.id}>
                  <td>{new Date(applicant.applicationDate).toLocaleDateString()}</td>
                  <td>{applicant.lastName} {applicant.firstName}</td>
                  <td>{job?.title || '-'}</td>
                  <td>{applicant.currentEmployment}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusBadgeClass(applicant.status)}`}>
                      {applicant.status === 'new' ? '新規' :
                       applicant.status === 'screening' ? '書類選考中' :
                       applicant.status === 'first-interview' ? '一次面接' :
                       applicant.status === 'second-interview' ? '二次面接' :
                       applicant.status === 'final-interview' ? '最終面接' :
                       applicant.status === 'offer' ? '内定' :
                       applicant.status === 'rejected' ? '不採用' : '辞退'}
                    </span>
                  </td>
                  <td>
                    {latestEvaluation ? (
                      <div className={styles.rating}>
                        {'★'.repeat(latestEvaluation.rating)}
                        {'☆'.repeat(5 - latestEvaluation.rating)}
                      </div>
                    ) : '-'}
                  </td>
                  <td>
                    <button 
                      className={styles.linkButton}
                      onClick={() => setSelectedApplicant(applicant)}
                    >
                      詳細
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderInterviews = () => (
    <div className={styles.tabContent}>
      <div className={styles.header}>
        <h2>面接スケジュール</h2>
        <button className={styles.primaryButton}>面接予約</button>
      </div>

      <div className={styles.calendarView}>
        <div className={styles.upcomingInterviews}>
          <h3>今後の面接予定</h3>
          {interviewSchedules
            .filter(schedule => schedule.status === 'scheduled')
            .map(schedule => {
              const applicant = applicants.find(a => a.id === schedule.applicantId);
              const job = jobPostings.find(j => j.id === schedule.jobPostingId);
              return (
                <div key={schedule.id} className={styles.interviewCard}>
                  <div className={styles.interviewTime}>
                    <div className={styles.date}>
                      {new Date(schedule.scheduledDate).toLocaleDateString()}
                    </div>
                    <div className={styles.time}>
                      {schedule.scheduledTime}
                    </div>
                  </div>
                  <div className={styles.interviewDetails}>
                    <h4>{applicant?.lastName} {applicant?.firstName}</h4>
                    <p>{job?.title}</p>
                    <p className={styles.interviewType}>
                      {schedule.interviewType === 'first' ? '一次面接' :
                       schedule.interviewType === 'second' ? '二次面接' : '最終面接'}
                    </p>
                    <p className={styles.location}>{schedule.location}</p>
                    <div className={styles.interviewers}>
                      面接官: {schedule.interviewers.map(i => i.name).join(', ')}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );

  const renderOnboarding = () => (
    <div className={styles.tabContent}>
      <div className={styles.header}>
        <h2>入職管理</h2>
        <button className={styles.primaryButton}>新規入職者登録</button>
      </div>

      <div className={styles.onboardingSection}>
        <h3>入職予定者</h3>
        <div className={styles.onboardingGrid}>
          {applicants
            .filter(a => a.status === 'offer')
            .map(applicant => {
              const job = jobPostings.find(j => j.id === applicant.jobPostingId);
              return (
                <div key={applicant.id} className={styles.onboardingCard}>
                  <h4>{applicant.lastName} {applicant.firstName}</h4>
                  <p>{job?.title}</p>
                  <p>入職予定日: {new Date(applicant.availableStartDate).toLocaleDateString()}</p>
                  <div className={styles.checklistProgress}>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill} 
                        style={{ width: '20%' }}
                      />
                    </div>
                    <span className={styles.progressText}>手続き進捗: 20%</span>
                  </div>
                  <button className={styles.secondaryButton}>
                    チェックリスト確認
                  </button>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className={styles.tabContent}>
      <div className={styles.header}>
        <h2>採用分析</h2>
        <select className={styles.periodSelect}>
          <option>過去3ヶ月</option>
          <option>過去6ヶ月</option>
          <option>過去1年</option>
        </select>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <h3>採用までの平均日数</h3>
          <div className={styles.metricValue}>28日</div>
          <div className={styles.metricChange}>
            <span className={styles.positive}>▼ 5日短縮</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <h3>応募者数/求人</h3>
          <div className={styles.metricValue}>12.5人</div>
          <div className={styles.metricChange}>
            <span className={styles.positive}>▲ 3.2人増加</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <h3>内定承諾率</h3>
          <div className={styles.metricValue}>85%</div>
          <div className={styles.metricChange}>
            <span className={styles.neutral}>→ 前期と同じ</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <h3>採用コスト/人</h3>
          <div className={styles.metricValue}>¥45,000</div>
          <div className={styles.metricChange}>
            <span className={styles.positive}>▼ ¥5,000削減</span>
          </div>
        </div>
      </div>

      <div className={styles.chartSection}>
        <h3>採用ソース別効果</h3>
        <div className={styles.sourceTable}>
          <table>
            <thead>
              <tr>
                <th>採用ソース</th>
                <th>応募者数</th>
                <th>採用数</th>
                <th>採用率</th>
                <th>コスト</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ハローワーク</td>
                <td>45</td>
                <td>8</td>
                <td>17.8%</td>
                <td>¥0</td>
              </tr>
              <tr>
                <td>求人サイトA</td>
                <td>32</td>
                <td>5</td>
                <td>15.6%</td>
                <td>¥150,000</td>
              </tr>
              <tr>
                <td>職員紹介</td>
                <td>12</td>
                <td>4</td>
                <td>33.3%</td>
                <td>¥20,000</td>
              </tr>
              <tr>
                <td>病院ホームページ</td>
                <td>18</td>
                <td>2</td>
                <td>11.1%</td>
                <td>¥0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>採用管理</h1>
      
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'jobPostings' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('jobPostings')}
        >
          求人管理
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'applicants' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('applicants')}
        >
          応募者管理
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'interviews' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('interviews')}
        >
          面接スケジュール
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'onboarding' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('onboarding')}
        >
          入職管理
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'analytics' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          採用分析
        </button>
      </div>

      {activeTab === 'jobPostings' && renderJobPostings()}
      {activeTab === 'applicants' && renderApplicants()}
      {activeTab === 'interviews' && renderInterviews()}
      {activeTab === 'onboarding' && renderOnboarding()}
      {activeTab === 'analytics' && renderAnalytics()}

      {selectedJobPosting && (
        <div className={styles.modal} onClick={() => setSelectedJobPosting(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2>{selectedJobPosting.title}</h2>
            <button 
              className={styles.closeButton}
              onClick={() => setSelectedJobPosting(null)}
            >
              ×
            </button>
            <div className={styles.modalBody}>
              <section>
                <h3>募集要項</h3>
                <p>{selectedJobPosting.jobDescription}</p>
              </section>
              <section>
                <h3>応募資格</h3>
                <h4>必須要件</h4>
                <ul>
                  {selectedJobPosting.requiredQualifications.map((qual, idx) => (
                    <li key={idx}>{qual}</li>
                  ))}
                </ul>
                <h4>歓迎要件</h4>
                <ul>
                  {selectedJobPosting.desiredQualifications.map((qual, idx) => (
                    <li key={idx}>{qual}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h3>待遇・福利厚生</h3>
                <ul>
                  {selectedJobPosting.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}

      {selectedApplicant && (
        <div className={styles.modal} onClick={() => setSelectedApplicant(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2>{selectedApplicant.lastName} {selectedApplicant.firstName}</h2>
            <button 
              className={styles.closeButton}
              onClick={() => setSelectedApplicant(null)}
            >
              ×
            </button>
            <div className={styles.modalBody}>
              <section>
                <h3>基本情報</h3>
                <p>メール: {selectedApplicant.email}</p>
                <p>電話: {selectedApplicant.phone}</p>
                <p>生年月日: {new Date(selectedApplicant.birthDate).toLocaleDateString()}</p>
                <p>希望給与: {selectedApplicant.desiredSalary.toLocaleString()}円</p>
                <p>入職可能日: {new Date(selectedApplicant.availableStartDate).toLocaleDateString()}</p>
              </section>
              {selectedApplicant.evaluations.length > 0 && (
                <section>
                  <h3>評価履歴</h3>
                  {selectedApplicant.evaluations.map(evaluation => (
                    <div key={evaluation.id} className={styles.evaluationItem}>
                      <h4>{evaluation.stage === 'screening' ? '書類選考' :
                          evaluation.stage === 'first-interview' ? '一次面接' :
                          evaluation.stage === 'second-interview' ? '二次面接' : '最終面接'}</h4>
                      <p>評価者: {evaluation.evaluatorName}</p>
                      <p>評価: {'★'.repeat(evaluation.rating)}{'☆'.repeat(5 - evaluation.rating)}</p>
                      <p>推薦度: {
                        evaluation.recommendation === 'strongly-recommend' ? '強く推薦' :
                        evaluation.recommendation === 'recommend' ? '推薦' :
                        evaluation.recommendation === 'neutral' ? '中立' : '非推薦'
                      }</p>
                      <p>コメント: {evaluation.comments}</p>
                    </div>
                  ))}
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}