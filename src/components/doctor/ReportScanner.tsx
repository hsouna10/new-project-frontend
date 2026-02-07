import React, { useState } from 'react';
import { scanReport } from '../../services/api';
import { FileText, Upload, Loader, CheckCircle, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReportScannerProps {
    onSave?: (data: any) => void;
    onCancel?: () => void;
}

export const ReportScanner: React.FC<ReportScannerProps> = ({ onSave, onCancel }) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setResult('');
            setError('');
        }
    };

    const handleScan = async () => {
        if (!file) return;
        setLoading(true);
        setError('');

        try {
            const data = await scanReport(file);
            setResult(data.extractedText);

            // If onSave is provided, we can auto-save or let user do it. 
            // For now, let's auto-save the image if that's what the parent expects, 
            // or we could pass the text back.
            // DoctorPatientDetails expects an image URL for now.
            if (onSave && previewUrl) {
                // In a real app we might want to save the *result* too.
                // onSave(previewUrl); 
            }
        } catch (err) {
            setError('Echec de l\'analyse OCR. Veuillez réessayer.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFinalSave = () => {
        if (onSave && previewUrl) {
            onSave(previewUrl);
        }
    }

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20 relative">
            {onCancel && (
                <button onClick={onCancel} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6" />
                </button>
            )}

            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                    <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Scanner un Rapport Médical</h2>
                    <p className="text-sm text-gray-500">Extraire le texte d'une image grâce à l'IA</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Upload Area */}
                <div className="flex flex-col gap-4">
                    {/* Standard Upload/Dropzone */}
                    <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 transition-colors hover:border-blue-400">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex flex-col items-center justify-center text-center">
                            {previewUrl ? (
                                <div className="relative mb-4">
                                    <img src={previewUrl} alt="Preview" className="h-48 object-contain rounded-lg shadow-sm" />
                                    <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white font-medium">
                                        Changer l'image
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 bg-blue-50 rounded-full mb-4">
                                    <Upload className="w-8 h-8 text-blue-500" />
                                </div>
                            )}

                            {!previewUrl && (
                                <>
                                    <p className="text-lg font-medium text-gray-700">Glisser-déposer ou sélectionner</p>
                                    <p className="text-sm text-gray-500 mt-1">PNG, JPG, JPEG supportés</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Camera Button - Visible mostly on mobile but useful everywhere */}
                    {!previewUrl && (
                        <div className="relative">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*"
                                capture="environment"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <button className="w-full py-3 px-4 rounded-xl font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-all flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-camera"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
                                Prendre une photo (Caméra)
                            </button>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <div className="flex gap-2">
                    <button
                        onClick={handleScan}
                        disabled={!file || loading}
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2
                    ${!file || loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:scale-[1.02]'
                            }`}
                    >
                        {loading ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin" />
                                Analyse en cours...
                            </>
                        ) : (
                            <>
                                <FileText className="w-5 h-5" />
                                Analyser / Extraire Texte
                            </>
                        )}
                    </button>

                    {onSave && result && (
                        <button
                            onClick={handleFinalSave}
                            className="flex-1 py-3 px-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 hover:shadow-lg hover:scale-[1.02]"
                        >
                            <CheckCircle className="w-5 h-5" />
                            Valider & Sauvegarder
                        </button>
                    )}
                </div>


                {/* Error Message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-2 border border-red-100"
                        >
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results Area */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-2"
                        >
                            <div className="flex items-center gap-2 text-green-600 font-medium px-1">
                                <CheckCircle className="w-4 h-4" />
                                Texte extrait avec succès
                            </div>
                            <textarea
                                value={result}
                                readOnly
                                className="w-full h-64 p-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono text-sm shadow-inner"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
