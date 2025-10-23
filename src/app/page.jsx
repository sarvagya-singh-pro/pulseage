"use client";
import { useState ,useEffect} from 'react'
import { ArrowRight, Activity, Brain, Users, FileText, BarChart3, Shield,Monitor, Upload, X, Check, Loader2, AlertCircle } from 'lucide-react'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState({ecg: null, cmri: null})
  const [isDragging, setIsDragging] = useState({ecg: false, cmri: false})
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  const API_BASE_URL = 'https://pulsesage-api-739266692949.us-central1.run.app/api'

  const handleFileUpload = (type, file) => {
    setUploadedFiles(prev => ({ ...prev, [type]: file }))
    setResults(null)
    setError(null)
  }

  const handleDragOver = (e, type) => {
    e.preventDefault()
    setIsDragging(prev => ({ ...prev, [type]: true }))
  }

  const handleDragLeave = (type) => {
    setIsDragging(prev => ({ ...prev, [type]: false }))
  }

  const handleDrop = (e, type) => {
    e.preventDefault()
    setIsDragging(prev => ({ ...prev, [type]: false }))
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileUpload(type, file)
    }
  }

  const removeFile = (type) => {
    setUploadedFiles(prev => ({ ...prev, [type]: null }))
    setResults(null)
    setError(null)
  }

  const analyzeData = async () => {
    setIsAnalyzing(true)
    setError(null)
    setResults(null)

    try {
      const formData = new FormData()
      
      const hasECG = uploadedFiles.ecg !== null
      const hasCMRI = uploadedFiles.cmri !== null

      if (hasECG && hasCMRI) {
        formData.append('ecg', uploadedFiles.ecg)
        formData.append('cmri', uploadedFiles.cmri)
        
        const response = await fetch(`${API_BASE_URL}/analyze/multimodal`, {
          method: 'POST',
          body: formData
        })
        
        const data = await response.json()
        
        if (data.success) {
          setResults(data)
        } else {
          setError(data.error || 'Analysis failed')
        }
      } else if (hasECG) {
        formData.append('file', uploadedFiles.ecg)
        
        const response = await fetch(`${API_BASE_URL}/analyze/ecg`, {
          method: 'POST',
          body: formData
        })
        
        const data = await response.json()
        
        if (data.success) {
          setResults(data)
        } else {
          setError(data.error || 'ECG analysis failed')
        }
      } else if (hasCMRI) {
        formData.append('file', uploadedFiles.cmri)
        
        const response = await fetch(`${API_BASE_URL}/analyze/cmri`, {
          method: 'POST',
          body: formData
        })
        
        const data = await response.json()
        
        if (data.success) {
          setResults(data)
        } else {
          setError(data.error || 'cMRI analysis failed')
        }
      }
    } catch (err) {
      setError(`Connection error: ${err.message}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Mobile Warning Banner
  if (isMobile) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Monitor className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Desktop Only</h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            PulseSage demo requires a desktop or laptop computer for optimal visualization and analysis. 
            Please visit this site on a larger screen.
          </p>
          <div className="p-4 bg-white/5 rounded-lg border border-white/10 text-left">
            <p className="text-xs text-gray-500 mb-2">Why desktop only?</p>
            <ul className="space-y-1 text-xs text-gray-400">
              <li>• Large medical imaging visualizations</li>
              <li>• Complex LIME explainability plots</li>
              <li>• Multi-panel analysis views</li>
              <li>• High-resolution data displays</li>
            </ul>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg text-white">PulseSage</span>
          </div>
          
          <div className="hidden md:flex space-x-8">
            {['About', 'Demo', 'Framework', 'Research', 'Team'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-gray-400 hover:text-white transition text-sm"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen relative overflow-hidden pt-20 flex items-center">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-orange-500/20 via-pink-500/10 to-purple-600/5 blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
          <div className="max-w-4xl">
            <div className="text-xs uppercase tracking-wider text-gray-500 mb-8">
              Research Demonstration
            </div>

            <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-8 leading-none tracking-tight">
              Pulse<br/>Sage
            </h1>

            <p className="text-lg md:text-xl text-gray-400 mb-12 leading-relaxed max-w-2xl">
              A comprehensive deep learning framework for diagnosing hypertrophic cardiomyopathy using multi-modal data with explainable AI integration
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-20">
              <a 
                href="#demo"
                className="px-8 py-3 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition inline-flex items-center justify-center gap-2 text-sm"
              >
                Try Demo
                <ArrowRight className="w-4 h-4" />
              </a>
              <a 
                href="https://drive.google.com/file/d/1L95W6B5Ecsq_Qa_J-FyyX0eLFwj_uwvY/view"
                className="px-8 py-3 border border-white/20 text-white rounded-md font-medium hover:bg-white/5 transition text-sm"
              >
                Read Paper
              </a>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <p>Sampurn Kumar · Divya Raj · Sarvagya Singh · Aditya Kumar</p>
              <p>M.G.M Higher Secondary School · Delhi Public School · VIBGYOR High</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 bg-black border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Addressing Critical Diagnostic Gaps
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed max-w-3xl">
              Hypertrophic cardiomyopathy affects 1 in 500 people globally, yet 80% of cases remain undiagnosed. 
              PulseSage combines multi-modal deep learning with explainable AI to provide accurate, interpretable cardiac diagnostics.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Activity className="w-6 h-6" />,
                title: "Multi-Modal Integration",
                description: "Late fusion strategy combining ECG and cMRI data with recall-weighted optimization"
              },
              {
                icon: <Brain className="w-6 h-6" />,
                title: "Explainable AI",
                description: "LIME integration provides transparent, interpretable predictions for clinical trust"
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Clinical-Grade Accuracy",
                description: "98.53% accuracy with 98.70% sensitivity in cMRI, 90.19% accuracy in ECG"
              }
            ].map((feature, index) => (
              <div key={index} className="group">
                <div className="w-12 h-12 bg-white/5 rounded-md flex items-center justify-center text-white mb-6 group-hover:bg-white/10 transition">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-32 px-6 bg-black border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Try the Demo
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed max-w-3xl">
              Upload ECG signals or cardiac MRI scans to see the framework in action. The system will analyze your data using both classification models and provide interpretable results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* ECG Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                ECG Data (.dat files)
              </label>
              <div
                onDragOver={(e) => handleDragOver(e, 'ecg')}
                onDragLeave={() => handleDragLeave('ecg')}
                onDrop={(e) => handleDrop(e, 'ecg')}
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition ${
                  isDragging.ecg
                    ? 'border-white/40 bg-white/5'
                    : uploadedFiles.ecg
                    ? 'border-green-500/40 bg-green-500/5'
                    : 'border-white/20 bg-white/5 hover:border-white/30'
                }`}
              >
                {uploadedFiles.ecg ? (
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-md flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white mb-1">
                        {uploadedFiles.ecg.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(uploadedFiles.ecg.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      onClick={() => removeFile('ecg')}
                      className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white transition"
                    >
                      <X className="w-3 h-3" />
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-white/5 rounded-md flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-300 mb-2">
                        Drop ECG file here or click to upload
                      </p>
                      <p className="text-xs text-gray-500">
                        Supports .dat, .csv, .txt files
                      </p>
                    </div>
                    <input
                      type="file"
                      accept=".dat,.csv,.txt,.mat"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload('ecg', file)
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* cMRI Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                cMRI Scan (Coming Soon)
              </label>
              <div
                onDragOver={(e) => handleDragOver(e, 'cmri')}
                onDragLeave={() => handleDragLeave('cmri')}
                onDrop={(e) => handleDrop(e, 'cmri')}
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition ${
                  isDragging.cmri
                    ? 'border-white/40 bg-white/5'
                    : uploadedFiles.cmri
                    ? 'border-green-500/40 bg-green-500/5'
                    : 'border-white/20 bg-white/5 hover:border-white/30'
                }`}
              >
                {uploadedFiles.cmri ? (
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-md flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white mb-1">
                        {uploadedFiles.cmri.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(uploadedFiles.cmri.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      onClick={() => removeFile('cmri')}
                      className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white transition"
                    >
                      <X className="w-3 h-3" />
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-white/5 rounded-md flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-300 mb-2">
                        Drop cMRI file here or click to upload
                      </p>
                      <p className="text-xs text-gray-500">
                        Supports .jpg, .png, .dicom files
                      </p>
                    </div>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.dcm,.dicom"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload('cmri', file)
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-300 font-medium mb-1">Analysis Error</p>
                <p className="text-xs text-red-400">{error}</p>
              </div>
            </div>
          )}

          {/* Analyze Button */}
          <div className="flex justify-center mb-12">
            <button
              disabled={(!uploadedFiles.ecg && !uploadedFiles.cmri) || isAnalyzing}
              onClick={analyzeData}
              className={`px-8 py-3 rounded-md font-medium text-sm transition inline-flex items-center gap-2 ${
                uploadedFiles.ecg || uploadedFiles.cmri
                  ? isAnalyzing
                    ? 'bg-white/20 text-gray-300 cursor-wait'
                    : 'bg-white text-black hover:bg-gray-200'
                  : 'bg-white/10 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  Analyze Data
                </>
              )}
            </button>
          </div>

          {/* Results Display */}
          {results && (
            <div className="space-y-8">
              {/* Diagnosis Card */}
              <div className="p-8 bg-gradient-to-br from-white/10 to-white/5 rounded-lg border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Diagnosis Results</h3>
                  <span className={`px-4 py-2 rounded-md text-sm font-medium ${
                    results.diagnosis === 'HCM' || results.fused_prediction?.diagnosis === 'HCM'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'bg-green-500/20 text-green-300 border border-green-500/30'
                  }`}>
                    {results.fused_prediction?.diagnosis || results.diagnosis}
                  </span>
                </div>

                {/* Confidence Meters */}
                <div className="space-y-6">
                  {results.fused_prediction ? (
                    <>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-300">Combined Analysis</span>
                          <span className="text-sm font-medium text-white">
                            {results.fused_prediction.confidence.toFixed(1)}% confidence
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000"
                            style={{ width: `${results.fused_prediction.confidence}%` }}
                          />
                        </div>
                      </div>

                      {results.ecg_results && (
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-400">ECG Model</span>
                            <span className="text-sm text-gray-300">
                              {(results.ecg_results.hcm_probability * 100).toFixed(1)}% HCM
                            </span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${results.ecg_results.hcm_probability * 100}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {results.cmri_results && (
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-400">cMRI Model</span>
                            <span className="text-sm text-gray-300">
                              {(results.cmri_results.hcm_probability * 100).toFixed(1)}% HCM
                            </span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${results.cmri_results.hcm_probability * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-300">HCM Probability</span>
                          <span className="text-sm font-medium text-white">
                            {((results.results?.hcm_probability || 0) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-3">
                          <div
                            className="bg-red-500 h-3 rounded-full transition-all duration-1000"
                            style={{ width: `${(results.results?.hcm_probability || 0) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-300">Not HCM Probability</span>
                          <span className="text-sm font-medium text-white">
                            {((results.results?.not_hcm_probability || 0) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-3">
                          <div
                            className="bg-green-500 h-3 rounded-full transition-all duration-1000"
                            style={{ width: `${(results.results?.not_hcm_probability || 0) * 100}%` }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* ECG Visualizations */}
              {results.results?.ecg_plot && (
              
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white">ECG Signal Analysis</h3>
                  
                  {/* ECG Plot */}
                  <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                    <div className="p-4 border-b border-white/10">
                      <h4 className="text-sm font-medium text-gray-300">Original ECG Signal</h4>
                    </div>
                    <div className="p-4 bg-white">
                      <img
                        src={`data:image/png;base64,${results.results.ecg_plot}`}
                        alt="ECG Signal"
                        className="w-full rounded"
                        onError={(e) => {
                          console.error('ECG plot failed to load')
                          e.target.style.display = 'none'
                        }}
                      />
                    </div>
                  </div>

                  {results.results?.segmented_plot && (
                    <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                      <div className="p-4 border-b border-white/10">
                        <h4 className="text-sm font-medium text-gray-300">Segmented Analysis with LIME</h4>
                      </div>
                      <div className="p-4">
                        <img
                          src={`data:image/png;base64,${results.results.segmented_plot}`}
                          alt="Segmented ECG"
                          className="w-full rounded"
                        />
                      </div>
                    </div>
                  )}
                   {results.results?.lime_plot && (
                <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                  <div className="p-4 border-b border-white/10">
                    <h4 className="text-sm font-medium text-gray-300">LIME Explainability</h4>
                  </div>
                  <div className="p-4 bg-white">
                    <img
                      src={`data:image/png;base64,${results.results.lime_plot}`}
                      alt="LIME Explanation"
                      className="w-full rounded"
                      onError={(e) => {
                        console.error('LIME plot failed to load')
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                </div>
              )}

                  {/* Top Influential Segments */}
                  {results.results?.top_influential_segments && (
                    <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                      <h4 className="text-sm font-semibold text-white mb-4">
                        Top Influential Segments
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {results.results.top_influential_segments.map((segment, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-md text-xs font-medium border border-purple-500/30"
                          >
                            Segment {segment}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-4">
                        These segments had the highest influence on the HCM classification decision
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Model Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="text-sm font-semibold text-white mb-4">Analysis Details</h4>
                  <div className="space-y-2 text-xs text-gray-400">
                    <div className="flex justify-between">
                      <span>Analysis Type:</span>
                      <span className="text-white font-medium">{results.type}</span>
                    </div>
                    {results.results?.num_slices && (
                      <div className="flex justify-between">
                        <span>Signal Segments:</span>
                        <span className="text-white font-medium">{results.results.num_slices}</span>
                      </div>
                    )}
                    {results.results?.ecg_length && (
                      <div className="flex justify-between">
                        <span>Signal Length:</span>
                        <span className="text-white font-medium">{results.results.ecg_length} samples</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="text-sm font-semibold text-white mb-4">Model Performance</h4>
                  <div className="space-y-2 text-xs text-gray-400">
                    {results.type === 'ecg' || results.ecg_results ? (
                      <>
                        <div className="flex justify-between">
                          <span>ECG Model Accuracy:</span>
                          <span className="text-white font-medium">90.19%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ECG Model Recall:</span>
                          <span className="text-white font-medium">89.35%</span>
                        </div>
                      </>
                    ) : null}
                    {results.type === 'cmri' || results.cmri_results ? (
                      <>
                        <div className="flex justify-between">
                          <span>cMRI Model Accuracy:</span>
                          <span className="text-white font-medium">98.53%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>cMRI Model Sensitivity:</span>
                          <span className="text-white font-medium">98.70%</span>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-xs text-yellow-300">
                  <strong>Research Demonstration:</strong> This is a research prototype and should not be used for clinical diagnosis. 
                  Always consult with qualified healthcare professionals for medical decisions.
                </p>
              </div>
            </div>
          )}

          {/* Demo Info */}
          <div className="mt-16 p-6 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-sm font-semibold text-white mb-3">How it works</h3>
            <div className="grid md:grid-cols-3 gap-6 text-xs text-gray-400">
              <div className="flex items-start gap-3">
                <span className="text-gray-600">1.</span>
                <p>Upload ECG data (12-lead recordings) and/or cardiac MRI scans</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gray-600">2.</span>
                <p>Models process data through CNN architectures with optimized preprocessing</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gray-600">3.</span>
                <p>Receive classification results with LIME-based explainability visualizations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-20 px-6 bg-black border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { value: '98.53%', label: 'cMRI Model Accuracy', sublabel: '98.70% Sensitivity' },
              { value: '90.19%', label: 'ECG Model Accuracy', sublabel: '89.35% Recall' },
              { value: '80%', label: 'Undiagnosed Cases', sublabel: 'Current healthcare gap' }
            ].map((metric, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl font-bold text-white mb-2">
                  {metric.value}
                </div>
                <div className="text-sm font-medium text-gray-300 mb-1">{metric.label}</div>
                <div className="text-xs text-gray-500">{metric.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Framework Components */}
      <section id="framework" className="py-32 px-6 bg-black border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Framework Architecture
          </h2>
          <p className="text-lg text-gray-400 mb-20 max-w-3xl">
            Two specialized deep learning models working in tandem through an optimized late fusion strategy
          </p>

          <div className="space-y-24">
            {/* ECG Component */}
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <div>
                <div className="text-xs uppercase tracking-wider text-gray-500 mb-6">
                  ECG Classification Model
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  Custom CNN Architecture
                </h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  Three-block convolutional neural network trained on 21,000+ 12-lead ECG recordings from the PTB-XL dataset. 
                  Features custom loss function with 2.5× penalty on false negatives.
                </p>
                <div className="space-y-2">
                  {[
                    '90.19% accuracy on validation set',
                    '89.35% recall for HCM detection',
                    'Ensemble with XGBoost for robustness',
                    'Data augmentation and class balancing'
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-gray-400">
                      <span className="text-gray-600">—</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/5 p-8 rounded-lg border border-white/10">
                <BarChart3 className="w-full h-48 text-white/20" />
                <p className="text-center text-xs text-gray-500 mt-4">ECG Signal Processing Pipeline</p>
              </div>
            </div>

            {/* cMRI Component */}
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <div className="order-2 md:order-1 bg-white/5 p-8 rounded-lg border border-white/10">
                <Brain className="w-full h-48 text-white/20" />
                <p className="text-center text-xs text-gray-500 mt-4">cMRI Analysis with LIME Explainability</p>
              </div>
              <div className="order-1 md:order-2">
                <div className="text-xs uppercase tracking-wider text-gray-500 mb-6">
                  cMRI Classification Model
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  Deep CNN with Explainability
                </h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  Six-layer convolutional architecture trained on 59,267 cardiac MRI scans from Omid Hospital dataset. 
                  Integrates HSV-based color filtering and LIME for interpretable feature highlighting.
                </p>
                <div className="space-y-2">
                  {[
                    '98.53% accuracy, 98.70% sensitivity',
                    'LIME highlights diagnostic regions',
                    'HSV color filtering preprocessing',
                    'Optimized for clinical interpretability'
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-gray-400">
                      <span className="text-gray-600">—</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Fusion Strategy */}
          <div className="mt-24 p-8 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-3">Late Fusion Integration</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              The framework employs a recall-weighted late fusion strategy, combining predictions from both models 
              using weights derived from their individual recall scores (89.35% for ECG, 98.70% for cMRI). 
              This approach maximizes diagnostic sensitivity while maintaining high specificity.
            </p>
          </div>
        </div>
      </section>

      {/* Research Highlights */}
      <section id="research" className="py-32 px-6 bg-black border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-20">
            Research Contributions
          </h2>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h3 className="text-xl font-semibold text-white mb-8">Clinical Impact</h3>
              <div className="space-y-6">
                {[
                  { stat: '1 in 500', desc: 'people worldwide affected by HCM' },
                  { stat: '80%', desc: 'of HCM cases currently undiagnosed' },
                  { stat: '1%', desc: 'annual risk of sudden cardiac death' }
                ].map((item, i) => (
                  <div key={i} className="flex items-baseline gap-4">
                    <span className="text-2xl font-bold text-white min-w-fit">
                      {item.stat}
                    </span>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-8">Technical Innovations</h3>
              <div className="space-y-4">
                {[
                  'Late fusion with recall-based weighting',
                  'Custom loss function penalizing false negatives 2.5×',
                  'LIME integration for clinical trust',
                  'Multi-modal data preprocessing pipeline'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-gray-400">
                    <span className="text-gray-600">—</span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <a
              href="https://drive.google.com/file/d/1L95W6B5Ecsq_Qa_J-FyyX0eLFwj_uwvY/view"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition text-sm"
            >
              <FileText className="w-4 h-4" />
              Read Full Research Paper
            </a>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-32 px-6 bg-black border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-20">
            Research Team
          </h2>

          <div className="grid md:grid-cols-4 gap-12">
            {[
              { name: 'Sampurn Kumar', affiliation: 'M.G.M Higher Secondary School, Bokaro' },
              { name: 'Divya Raj', affiliation: 'M.G.M Higher Secondary School, Bokaro' },
              { name: 'Sarvagya Singh', affiliation: 'Delhi Public School, Bokaro' },
              { name: 'Aditya Kumar', affiliation: 'VIBGYOR High, Mumbai' }
            ].map((member, index) => (
              <div key={index}>
                <div className="w-20 h-20 bg-white/5 rounded-md mb-6 flex items-center justify-center">
                  <Users className="w-10 h-10 text-white/40" />
                </div>
                <h3 className="font-semibold text-base text-white mb-2">{member.name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{member.affiliation}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-white">PulseSage</span>
            </div>
            <div className="text-left md:text-right">
              <p className="text-xs text-gray-500 mb-1">
                A research demonstration of multi-modal AI for HCM diagnosis
              </p>
              <p className="text-xs text-gray-600">
                © 2025 PulseSage Research Team · For educational and research purposes
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}