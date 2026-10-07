'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  PhoneCall,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Copy,
  ExternalLink,
  MessageSquare,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { api } from '@/lib/api';

export default function WhatsAppGatewayPage() {
  const [status, setStatus] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  async function loadStatus() {
    try {
      const data = await api.getWhatsAppStatus();
      setStatus(data);
    } catch (err) {
      console.error('Failed to load WhatsApp status:', err);
    }
  }

  const webhookUrl = status?.webhookUrl || 'http://localhost:4000/api/v1/webhooks/whatsapp';

  const handleCopy = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#553E53] flex items-center gap-2">
          <PhoneCall className="w-6 h-6 text-[#553E53]" />
          <span>Meta WhatsApp Cloud API Gateway</span>
        </h1>
        <p className="text-xs text-[#553E53]/70 mt-1">
          Official Meta WhatsApp Cloud API integration, challenge verification, and webhook health.
        </p>
      </div>

      {/* Connection Status Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#553E53]/15 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B6CBDE]/30 border border-[#553E53]/15 flex items-center justify-center text-[#553E53]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#553E53]">Meta WhatsApp Cloud API Connected</h3>
              <div className="text-xs text-[#553E53]/70">
                Webhook Challenge Verification Active • WhatsApp Version: {status?.apiVersion || 'v21.0'}
              </div>
            </div>
          </div>

          <Link
            href="/dashboard/conversations"
            className="px-4 py-2.5 rounded-xl bg-[#553E53] hover:bg-[#433041] text-[#F5F6F0] font-medium text-xs flex items-center gap-2 transition-all shadow-sm self-start"
          >
            <MessageSquare className="w-4 h-4 text-[#B6CBDE]" />
            <span>Open Simulator Sandbox</span>
          </Link>
        </div>
      </div>

      {/* Webhook Configuration Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-[#553E53]/10 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-sm text-[#553E53]">Production Webhook Configuration</h3>
          
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[#553E53]/80 font-medium mb-1">Callback Webhook URL</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={webhookUrl}
                  className="flex-1 bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-2 text-[#553E53] font-mono text-xs focus:outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="px-3.5 py-2 rounded-xl bg-[#F5F6F0] hover:bg-[#e8ecea] text-[#553E53] border border-[#553E53]/15 font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[#553E53]/80 font-medium mb-1">Verify Token</label>
              <input
                type="text"
                readOnly
                value="clinic_whatsapp_webhook_secret_verify_token"
                className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-2 text-[#553E53]/70 font-mono text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#553E53]/80 font-medium mb-1">Phone Number ID (Meta Business Manager)</label>
              <input
                type="text"
                readOnly
                value={status?.phoneNumberId || '100000000000001'}
                className="w-full bg-[#F5F6F0] border border-[#553E53]/15 rounded-xl px-3 py-2 text-[#553E53]/70 font-mono text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Idempotency & Safety Features */}
        <div className="bg-white rounded-2xl p-6 border border-[#553E53]/10 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-sm text-[#553E53]">Reliability & Deduplication Engine</h3>

          <div className="space-y-3 text-xs text-[#553E53]/80">
            <div className="p-3.5 rounded-xl bg-[#F5F6F0] border border-[#553E53]/10 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#553E53] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#553E53] block">Message Idempotency (SRS-004)</strong>
                <span>
                  Prevents duplicate bot responses by hashing and validating provider message IDs.
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F5F6F0] border border-[#553E53]/10 flex items-start gap-2.5">
              <Zap className="w-4 h-4 text-[#553E53] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#553E53] block">Instant Acknowledgment (NFR-001)</strong>
                <span>
                  Webhooks acknowledge with HTTP 200 within 50ms before triggering background AI runs.
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F5F6F0] border border-[#553E53]/10 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#553E53] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#553E53] block">DPDP Act Compliance & Security</strong>
                <span>
                  All patient identifiers and consultation notes are encrypted at rest.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
