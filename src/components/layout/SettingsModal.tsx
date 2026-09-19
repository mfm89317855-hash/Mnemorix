import React, { useState } from 'react';
import { X, Key, Shield, Sliders, CheckCircle2, Cpu, ExternalLink } from 'lucide-react';
import { useSentinel } from '../../context/SentinelContext';
import { getStoredGeminiKey, setStoredGeminiKey } from '../../lib/gemini';

export const SettingsModal: React.FC = () => {
  const { isSettingsModalOpen, setIsSettingsModalOpen, addAuditLog } = useSentinel();
  const [apiKeyInput, setApiKeyInput] = useState<string>(getStoredGeminiKey());
  const [saveStatus, setSaveStatus] = useState<boolean>(false);
  const [strictness, setStrictness] = useState<string>('zero-trust');

  if (!isSettingsModalOpen) return null;

  const handleSave = () => {
    setStoredGeminiKey(apiKeyInput);
    setSaveStatus(true);
    addAuditLog('SETTINGS_UPDATED', 'SecOps Admin', 'CONFIG_CORE', 'SUCCESS', 'Gemini API security credentials and strictness settings updated.');
    setTimeout(() => {
      setSaveStatus(false);
      setIsSettingsModalOpen(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={() => setIsSettingsModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 border border-red-200 text-red-600">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900">MNEMORIX Sentinel Settings</h3>
            <p className="text-xs text-slate-500">Configure Neural Defense API & Zero-Trust Strictness</p>
          </div>
        </div>

        {/* Settings Form */}
        <div className="space-y-4">
          {/* Gemini API Key */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono font-medium text-slate-700 flex items-center space-x-1.5">
                <Key className="h-3.5 w-3.5 text-red-600" />
                <span>Google Gemini API Key</span>
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-red-600 hover:underline flex items-center space-x-1 font-medium"
              >
                <span>Get Key</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="AIzaSy... (Leave blank to use intelligent offline heuristic engine)"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1.5">
              Powers Gemini 2.5 Flash neural memory threat classification and Copilot AI reasoning. If no key is entered, MNEMORIX automatically uses high-precision local heuristics.
            </p>
          </div>

          {/* Strictness Level */}
          <div>
            <label className="text-xs font-mono font-medium text-slate-700 flex items-center space-x-1.5 mb-2">
              <Shield className="h-3.5 w-3.5 text-red-600" />
              <span>Zero-Trust Ingestion Strictness</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'standard', title: 'Standard', desc: 'Heuristic + Drift' },
                { id: 'zero-trust', title: 'Zero-Trust', desc: 'L1 + L2 + L3 Neural' },
                { id: 'military', title: 'Air-Gapped', desc: 'Strict Merkle Lock' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setStrictness(lvl.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    strictness === lvl.id
                      ? 'border-red-600 bg-red-50 text-red-900 font-semibold shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xs font-bold">{lvl.title}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{lvl.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Merkle Ledger Hash Standard */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between font-mono">
              <span>Cryptographic Hash Standard:</span>
              <span className="text-slate-900 font-bold">FIPS 180-4 SHA-256</span>
            </div>
            <div className="flex justify-between font-mono">
              <span>Vector Distance Metric:</span>
              <span className="text-slate-900 font-bold">Cosine Similarity (Normalized)</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            onClick={() => setIsSettingsModalOpen(false)}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-4 py-2 text-xs font-bold text-white shadow-md shadow-red-500/20 transition-all active:scale-95"
          >
            {saveStatus ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Saved & Armed!</span>
              </>
            ) : (
              <span>Save Configuration</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

