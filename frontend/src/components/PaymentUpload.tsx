import { useState, useRef } from 'react';
import { Upload, X, FileText, Image } from 'lucide-react';

interface Props {
  onFileSelect: (file: File | null) => void;
  maxSizeMB?: number;
}

export default function PaymentUpload({ onFileSelect, maxSizeMB = 5 }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selected: File) => {
    setError(null);
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowed.includes(selected.type)) {
      setError('Only JPG, PNG, or PDF files are allowed.');
      return;
    }
    if (selected.size > maxSizeMB * 1024 * 1024) {
      setError(`File must be under ${maxSizeMB}MB.`);
      return;
    }
    setFile(selected);
    onFileSelect(selected);
  };

  const handleRemove = () => {
    setFile(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const isPdf = file?.type === 'application/pdf';

  return (
    <div className="space-y-2">
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer transition-colors ${
            dragging ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
          }`}
        >
          <Upload size={22} className="text-slate-400" />
          <p className="text-sm text-slate-600 font-medium">Upload Receipt</p>
          <p className="text-xs text-slate-400">JPG, PNG, or PDF · Max {maxSizeMB}MB</p>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,application/pdf"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50">
          {isPdf ? <FileText size={20} className="text-red-500 flex-shrink-0" /> : <Image size={20} className="text-blue-500 flex-shrink-0" />}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
            <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <button onClick={handleRemove} className="text-slate-400 hover:text-red-500 transition-colors">
            <X size={16} />
          </button>
        </div>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
