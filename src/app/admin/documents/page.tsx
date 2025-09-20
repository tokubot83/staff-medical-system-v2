'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Search, Filter, Calendar, FileType, Download, Eye, Clock } from 'lucide-react';

interface DocumentFile {
  name: string;
  path: string;
  type: string;
  size: number;
  modified: string;
  created: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents?type=saved');
      const data = await response.json();
      setDocuments(data.files || []);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      // 未来の日付の場合
      return date.toLocaleDateString('ja-JP');
    }
    if (diffDays === 0) return '今日';
    if (diffDays === 1) return '昨日';
    if (diffDays < 7) return `${diffDays}日前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}週間前`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}ヶ月前`;
    return `${Math.floor(diffDays / 365)}年前`;
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return '📄';
      case 'md':
        return '📝';
      case 'txt':
        return '📋';
      case 'json':
        return '🔧';
      default:
        return '📁';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.modified).getTime() - new Date(a.modified).getTime();
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  const handleViewDocument = (path: string) => {
    // TODO: Implement document viewer
    window.open(`/api/documents/view?type=saved&path=${encodeURIComponent(path)}`, '_blank');
  };

  const getLatestDocument = () => {
    if (sortedDocuments.length === 0) return null;
    return sortedDocuments[0];
  };

  const latestDoc = getLatestDocument();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">保存書類</h1>
        <p className="text-gray-600">システムドキュメント・仕様書・マニュアル</p>
        {latestDoc && (
          <div className="mt-3 flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-gray-500">
              <Clock className="h-4 w-4" />
              最終更新: {formatDate(latestDoc.modified)}
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-500">
              総ファイル数: {documents.length}
            </span>
          </div>
        )}
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="ファイル名で検索..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">すべての形式</option>
              <option value="pdf">PDF</option>
              <option value="md">Markdown</option>
              <option value="txt">テキスト</option>
              <option value="json">JSON</option>
            </select>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
            >
              <option value="date">更新日順</option>
              <option value="name">名前順</option>
            </select>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
          <span>合計: {filteredDocuments.length} ファイル</span>
          {searchTerm && (
            <span className="text-blue-600">"{searchTerm}" で検索中</span>
          )}
        </div>
      </div>

      {/* Documents List */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center text-gray-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            読み込み中...
          </div>
        </div>
      ) : sortedDocuments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>ドキュメントが見つかりません</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ファイル名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    形式
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    サイズ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    更新日時
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedDocuments.map((doc, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{getFileIcon(doc.type)}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {doc.name}
                          </div>
                          {doc.path !== doc.name && (
                            <div className="text-xs text-gray-500">{doc.path}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        doc.type === 'pdf' ? 'bg-red-100 text-red-800' :
                        doc.type === 'md' ? 'bg-green-100 text-green-800' :
                        doc.type === 'json' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {doc.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFileSize(doc.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(doc.modified)}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(doc.modified).toLocaleDateString('ja-JP')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleViewDocument(doc.path)}
                        className="text-blue-600 hover:text-blue-900 mx-2"
                        title="表示"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <a
                        href={`/api/documents/download?type=saved&path=${encodeURIComponent(doc.path)}`}
                        className="text-gray-600 hover:text-gray-900 mx-2 inline-block"
                        title="ダウンロード"
                      >
                        <Download className="h-5 w-5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}