import React, { useState } from 'react';
import { Blocks, ExternalLink, Check, Copy, Shield, CheckCircle2 } from 'lucide-react';

export default function BlockchainRecordCard({ blockchainData }) {
  const [copiedTx, setCopiedTx] = useState(false);
  const [copiedContract, setCopiedContract] = useState(false);

  if (!blockchainData) {
    return (
      <div className="rounded-lg bg-[#0b0e17] border border-[#232d42] p-4 text-center text-slate-500 text-xs font-mono">
        Blockchain transaction proof pending execution...
      </div>
    );
  }

  const handleCopyTx = () => {
    if (blockchainData.transaction_hash) {
      navigator.clipboard.writeText(blockchainData.transaction_hash);
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    }
  };

  const handleCopyContract = () => {
    if (blockchainData.contract_address) {
      navigator.clipboard.writeText(blockchainData.contract_address);
      setCopiedContract(true);
      setTimeout(() => setCopiedContract(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Transaction Summary Card */}
      <div className="p-3 rounded-lg bg-[#0d121c] border border-blue-500/30 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-300 font-bold">
            <Blocks className="w-3.5 h-3.5 text-cyan-400" />
            <span>{blockchainData.network}</span>
          </div>
          <span className="tech-badge badge-success text-[10px]">
            <CheckCircle2 className="w-3 h-3" />
            {blockchainData.status}
          </span>
        </div>

        {/* Transaction Hash */}
        <div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5 font-mono">
            <span>TX HASH:</span>
            <button
              onClick={handleCopyTx}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              {copiedTx ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
              {copiedTx ? 'COPIED' : 'COPY'}
            </button>
          </div>
          <div className="p-1.5 rounded bg-[#070a10] border border-[#232d42] font-mono text-[11px] text-cyan-300 truncate">
            {blockchainData.transaction_hash}
          </div>
        </div>

        {/* Contract Address & Block Number Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2 rounded bg-[#070a10] border border-[#232d42]">
            <div className="text-[10px] text-slate-400">BLOCK NUMBER:</div>
            <div className="text-slate-200 font-bold mt-0.5">#{blockchainData.block_number}</div>
          </div>
          <div className="p-2 rounded bg-[#070a10] border border-[#232d42]">
            <div className="text-[10px] text-slate-400">GAS USED:</div>
            <div className="text-emerald-400 font-bold mt-0.5">{blockchainData.gas_used.toLocaleString()}</div>
          </div>
        </div>

        {/* Contract Address */}
        <div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5 font-mono">
            <span>CONTRACT REGISTRY:</span>
            <button
              onClick={handleCopyContract}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              {copiedContract ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
              {copiedContract ? 'COPIED' : 'COPY'}
            </button>
          </div>
          <div className="p-1.5 rounded bg-[#070a10] border border-[#232d42] font-mono text-[10px] text-slate-300 truncate">
            {blockchainData.contract_address}
          </div>
        </div>

        {/* Block Explorer Action Link */}
        <a
          href={blockchainData.explorer_url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 px-3 rounded bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View on Block Explorer
        </a>
      </div>
    </div>
  );
}
