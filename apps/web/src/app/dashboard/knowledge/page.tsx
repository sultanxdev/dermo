'use client';

import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  FileText,
  Trash2,
  Layers,
  Database,
} from 'lucide-react';
import { api } from '@/lib/api';
import { FAQ, KnowledgeDocument } from '@dermo/types';

export default function KnowledgePage() {
  const [activeTab, setActiveTab] = useState<'faqs' | 'docs'>('faqs');
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [docs, setDocs] = useState<KnowledgeDocument[]>([]);
  const [reindexingId, setReindexingId] = useState<string | null>(null);

  // Modals
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);

  // FAQ Form
  const [faqQ, setFaqQ] = useState('');
  const [faqA, setFaqA] = useState('');
  const [faqCat, setFaqCat] = useState('GENERAL');

  // Doc Form
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<'SERVICES' | 'POLICIES' | 'AFTERCARE' | 'PRICING' | 'DOCTORS' | 'GENERAL'>('GENERAL');
  const [docContent, setDocContent] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [fData, dData] = await Promise.all([api.getFaqs(), api.getKnowledgeDocs()]);
      setFaqs(fData);
      setDocs(dData);
    } catch (err) {
      console.error('Failed to load knowledge:', err);
    }
  }

  const handleCreateFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQ || !faqA) return;
    try {
      await api.createFaq({ question: faqQ, answer: faqA, category: faqCat, isApproved: true });
      setShowFaqModal(false);
      setFaqQ('');
      setFaqA('');
      await loadData();
    } catch (err) {
      console.error('Failed to create FAQ:', err);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    try {
      await api.deleteFaq(id);
      await loadData();
    } catch (err) {
      console.error('Failed to delete FAQ:', err);
    }
  };

  const handleCreateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle || !docContent) return;
    try {
      await api.createKnowledgeDoc({ title: docTitle, category: docCategory, content: docContent });
      setShowDocModal(false);
      setDocTitle('');
      setDocContent('');
      await loadData();
    } catch (err) {
      console.error('Failed to create document:', err);
    }
  };

  const handleReindex = async (docId: string) => {
    setReindexingId(docId);
    try {
      await api.reindexDoc(docId);
      await loadData();
    } catch (err) {
      console.error('Reindexing failed:', err);
    } finally {
      setReindexingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#553E53] flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#553E53]" />
            <span>Clinic Knowledge Base & Grounded FAQs</span>
          </h1>
          <p className="text-xs text-[#553E53]/70 mt-1">
            Approved answers and vectorized documents used by LangChain & pgvector for zero-hallucination responses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'faqs' ? (
            <button
              onClick={() => setShowFaqModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#553E53] hover:bg-[#433041] text-[#F5F6F0] font-medium text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 text-[#B6CBDE]" />
              <span>Add FAQ</span>
            </button>
          ) : (
            <button
              onClick={() => setShowDocModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#553E53] hover:bg-[#433041] text-[#F5F6F0] font-medium text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 text-[#B6CBDE]" />
              <span>Add Document</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#553E53]/15 gap-6 text-xs font-medium">
        <button
          onClick={() => setActiveTab('faqs')}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === 'faqs'
              ? 'text-[#553E53] border-b-2 border-[#553E53] font-bold'
              : 'text-[#553E53]/60 hover:text-[#553E53]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Approved FAQs ({faqs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('docs')}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === 'docs'
              ? 'text-[#553E53] border-b-2 border-[#553E53] font-bold'
              : 'text-[#553E53]/60 hover:text-[#553E53]'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>pgvector RAG Documents ({docs.length})</span>
        </button>
      </div>

      {/* Tab 1: FAQs */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-2xl p-5 border border-[#553E53]/10 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-sm text-[#553E53]">{faq.question}</span>
                    <span className="px-2 py-0.5 rounded bg-[#B6CBDE]/30 text-[#553E53] text-[9px] font-bold border border-[#553E53]/20 whitespace-nowrap">
                      {faq.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#553E53]/80 leading-relaxed bg-[#F5F6F0] p-3 rounded-xl border border-[#553E53]/10">
                    {faq.answer}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-[#553E53]/60">
                  <span>Viewed by AI {faq.viewCount || 0} times</span>
                  <button
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="text-[#553E53]/50 hover:text-rose-600 p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: RAG Documents */}
      {activeTab === 'docs' && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl p-5 border border-[#553E53]/10 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-[#553E53]">{doc.title}</h3>
                      <div className="text-[10px] text-[#553E53]/60 mt-0.5">
                        Category: {doc.category} • Version: {doc.version}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        doc.status === 'READY'
                          ? 'bg-[#B6CBDE]/35 text-[#553E53] border-[#553E53]/25'
                          : doc.status === 'PROCESSING'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#553E53]/80 leading-relaxed line-clamp-4 bg-[#F5F6F0] p-3 rounded-xl border border-[#553E53]/10">
                    {doc.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#553E53]/10 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#553E53]/70 flex items-center gap-1 font-medium">
                    <Layers className="w-3.5 h-3.5 text-[#553E53]" />
                    <span>{doc.chunkCount || 1} pgvector chunks</span>
                  </span>

                  <button
                    onClick={() => handleReindex(doc.id)}
                    disabled={reindexingId === doc.id}
                    className="px-3 py-1.5 rounded-lg bg-[#F5F6F0] hover:bg-[#e8ecea] text-[#553E53] text-xs font-medium flex items-center gap-1.5 border border-[#553E53]/15 transition-colors disabled:opacity-40"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${reindexingId === doc.id ? 'animate-spin' : ''}`} />
                    <span>{reindexingId === doc.id ? 'Embedding...' : 'Re-index with Gemini'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add FAQ Modal */}
      {showFaqModal && (
        <div className="fixed inset-0 z-50 bg-[#553E53]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full border border-[#553E53]/15 space-y-4 shadow-xl">
            <h3 className="font-serif font-bold text-lg text-[#553E53]">Add Approved Clinic FAQ</h3>
            <form onSubmit={handleCreateFaq} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#553E53]/80 font-medium mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={faqQ}
                  onChange={(e) => setFaqQ(e.target.value)}
                  placeholder="e.g. Can I wear makeup after HydraFacial?"
                  className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-2 text-[#553E53] text-xs focus:outline-none focus:border-[#553E53]"
                />
              </div>

              <div>
                <label className="block text-[#553E53]/80 font-medium mb-1">Category</label>
                <select
                  value={faqCat}
                  onChange={(e) => setFaqCat(e.target.value)}
                  className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-2 text-[#553E53] text-xs focus:outline-none focus:border-[#553E53]"
                >
                  <option value="GENERAL">General</option>
                  <option value="PRICING">Pricing & Payments</option>
                  <option value="AFTERCARE">Pre & Post Care</option>
                  <option value="POLICIES">Clinic Policies</option>
                  <option value="DOCTORS">Doctor Schedules</option>
                </select>
              </div>

              <div>
                <label className="block text-[#553E53]/80 font-medium mb-1">Answer *</label>
                <textarea
                  required
                  rows={3}
                  value={faqA}
                  onChange={(e) => setFaqA(e.target.value)}
                  placeholder="Doctor approved factual answer..."
                  className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl p-2.5 text-[#553E53] text-xs focus:outline-none focus:border-[#553E53]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowFaqModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#F5F6F0] text-[#553E53] font-medium text-xs border border-[#553E53]/15 hover:bg-[#e8ecea]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#553E53] text-[#F5F6F0] font-medium text-xs hover:bg-[#433041]"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Document Modal */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 bg-[#553E53]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-lg w-full border border-[#553E53]/15 space-y-4 shadow-xl">
            <h3 className="font-serif font-bold text-lg text-[#553E53]">Upload Knowledge Document to RAG</h3>
            <form onSubmit={handleCreateDoc} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#553E53]/80 font-medium mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. Soprano Titanium Laser Protocol & Instructions"
                  className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-2 text-[#553E53] text-xs focus:outline-none focus:border-[#553E53]"
                />
              </div>

              <div>
                <label className="block text-[#553E53]/80 font-medium mb-1">Category</label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value as any)}
                  className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-2 text-[#553E53] text-xs focus:outline-none focus:border-[#553E53]"
                >
                  <option value="GENERAL">General</option>
                  <option value="SERVICES">Services & Protocols</option>
                  <option value="AFTERCARE">Pre & Post Care</option>
                  <option value="PRICING">Pricing & Packages</option>
                  <option value="POLICIES">Policies</option>
                  <option value="DOCTORS">Doctors</option>
                </select>
              </div>

              <div>
                <label className="block text-[#553E53]/80 font-medium mb-1">Document Content *</label>
                <textarea
                  required
                  rows={5}
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  placeholder="Full text content to be chunked and vectorized..."
                  className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl p-2.5 text-[#553E53] text-xs focus:outline-none focus:border-[#553E53]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowDocModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#F5F6F0] text-[#553E53] font-medium text-xs border border-[#553E53]/15 hover:bg-[#e8ecea]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#553E53] text-[#F5F6F0] font-medium text-xs hover:bg-[#433041]"
                >
                  Vectorize & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
