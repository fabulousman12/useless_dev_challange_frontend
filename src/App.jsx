import React, { useState, useEffect } from 'react';
import {
  Rocket, ShieldAlert, Cpu, Heart, Briefcase,
  Settings, Link as LinkIcon, Copy, ExternalLink,
  AlertTriangle, RefreshCw, AlertCircle, Info
} from 'lucide-react';
import { Player } from '@lottiefiles/react-lottie-player';
import { jsPDF } from 'jspdf';
import './index.css';

const LOADING_STEPS = [
  "Initializing cloud infrastructure...",
  "Contacting AI models...",

  "Expanding URL length...",
  "Hallucinating The results..",
  "Synthesizing synergy matrices...",
  "Guu guuu gaa gaaaa ...",
  "Finalizing..."
];

function App() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [result, setResult] = useState(null);
  const [complianceWarning, setComplianceWarning] = useState(false);
  const [dangerAccepted, setDangerAccepted] = useState(false);
  const [loadingModalOpen, setLoadingModalOpen] = useState(false);
  const [modalNoClicked, setModalNoClicked] = useState(false);

  const [settings, setSettings] = useState({
    aiOptimized: true,
    seoBoost: false,
    tracking: false,
    blockchain: false,
    synergy: true,
    emotionalSupport: false,
    highlyOptimized: false
  });

  const handleToggle = (key) => {
    if (key === 'highlyOptimized') {
      const currentlyOff = !settings.highlyOptimized;
      if (currentlyOff) {
        setSettings({
          aiOptimized: false, seoBoost: false, tracking: false,
          blockchain: false, synergy: false, emotionalSupport: false,
          highlyOptimized: true
        });
      } else {
        setSettings(prev => ({ ...prev, highlyOptimized: false }));
      }
      return;
    }

    setSettings(prev => {
      const nextVal = !prev[key];
      if (nextVal) {
        return { ...prev, [key]: true, highlyOptimized: false };
      }
      return { ...prev, [key]: false };
    });
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!url) {
      setError('This URL lacks enterprise readiness.');
      return;
    }

    // Quick regex validation
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(url)) {
      setError('Architecture mismatch: Invalid URL format detected.');
      return;
    }

    setLoadingModalOpen(true);
  };

  const handleModalYes = () => {
    startGenerationProcess();
  };

  const handleModalNo = () => {
    setModalNoClicked(true);
    setTimeout(() => {
      startGenerationProcess();
    }, 2000);
  };

  const startGenerationProcess = async () => {
    setLoadingModalOpen(false);
    setModalNoClicked(false);
    setError('');
    setLoading(true);
    setResult(null);

    // Highly Optimized bypass
    if (settings.highlyOptimized) {
      const waitPhrases = [
        "Un-optimizing bandwidth...",
        "Removing blockchain consensus...",
        "Bla bla blaaaaa blaaaa",

        "Disabling AI confidence protocols...",
        "Running native HTTP protocols (DANGEROUS)...",
        "Guu guuu gaa gaaaa ...",
        "Did absolutely nothing"
      ];

      for (let i = 0; i < 10; i++) {
        setLoadingStep(`[DANGER] ${waitPhrases[i % waitPhrases.length]} | ${10 - i}s remaining`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      

      let finalUrl = url.startsWith('http') ? url : `https://${url}`;
      setResult({
        originalUrl: finalUrl,
        enhancedUrl: finalUrl,
        compliance: false,
        report: null
      });
      setLoading(false);
      return;
    }

    // Fake loading steps for standard generation
    for (let i = 0; i < LOADING_STEPS.length; i++) {
      setLoadingStep(LOADING_STEPS[i]);
      // Sleep for random time between 400 and 800ms
      await new Promise(resolve => setTimeout(resolve, Math.random() * 400 + 400));
    }

    try {
      const response = await fetch('/lengthen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, ...settings })
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data);
        if (Math.random() < 0.8) {
          setComplianceWarning(true);
        } else {
          setComplianceWarning(false);
        }
      } else {
        setError(data.error || 'Server rejected enterprise parameters.');
      }
    } catch (err) {
      setError('Could not connect to enterprise backend server.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result?.enhancedUrl) return;

    // 20% intentional bug
    const shouldFail = Math.random() < 0.2;
    let urlToCopy = result.enhancedUrl;

    if (shouldFail) {
      urlToCopy = urlToCopy.replace('final-final', 'final-v1-draft');
    }

    navigator.clipboard.writeText(urlToCopy).then(() => {
      alert(shouldFail ? "Copied! (Hopefully the right one)" : "Successfully copied enterprise URL to clipboard.");
    });
  };

  const handleRedirect = () => {
    if (!result) return;
    window.open(result.enhancedUrl, '_blank');
  };

  const downloadReport = () => {
    if (!result?.report) return;

    const doc = new jsPDF();
    const r = result.report;

    // Add corporate header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("ENTERPRISE URL OPTIMIZATION REPORT™", 15, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`REPORT ID: ${r.report_id}`, 15, 30);
    doc.text(`DATE: ${new Date(r.timestamp).toLocaleString()}`, 15, 35);

    doc.setLineWidth(0.5);
    doc.line(15, 40, 195, 40);

    let y = 50;

    const addSection = (title, content) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      doc.setFont("helvetica", "bold");
      doc.text(title, 15, y);
      y += 6;
      doc.setFont("helvetica", "normal");

      const splitContent = doc.splitTextToSize(content, 180);
      doc.text(splitContent, 15, y);
      y += (splitContent.length * 5) + 8;
    };

    addSection("1. EXECUTIVE SUMMARY",
      `AI Confidence Score: ${r.summary.ai_confidence_score}\n` +
      `Optimization Level: ${r.summary.optimization_level.toUpperCase()}\n` +
      `Conclusion: ${r.summary.executive_summary}`
    );

    addSection("2. DEPLOYMENT METRICS",
      `Original URL Length: ${r.metrics.original_length} characters\n` +
      `Enhanced URL Length: ${r.metrics.enhanced_length} characters\n` +
      `Length Increase Factor: ${r.metrics.length_increase_factor}x\n` +
      `Estimated Productivity Impact: ${r.metrics.productivity_impact}`
    );

    addSection("3. ENTERPRISE COMPLIANCE",
      `AI Readiness: ${r.compliance.ai_ready ? "VERIFIED" : "FAILED"}\n` +
      `Blockchain Secured: ${r.compliance.blockchain_secured ? "YES" : "NO"}\n` +
      `Quantum Compatibility: ${r.compliance.quantum_compatible.toUpperCase()}\n` +
      `Enterprise Grade Status: ${r.compliance.enterprise_grade.toUpperCase()}`
    );

    addSection("4. USER INTENT ANALYSIS",
      `System Confidence: ${r.user_intent_analysis.confidence.toUpperCase()}\n` +
      `Predicted Intent: ${r.user_intent_analysis.predicted_intent}\n` +
      `Actionable Recommendation: ${r.user_intent_analysis.recommendation}`
    );

    addSection("5. URL REDIRECT BEHAVIOR",
      `Success Probability: ${r.redirect_behavior.success_probability}\n` +
      `Google Decoy Redirect Probability: ${r.redirect_behavior.google_redirect_probability}\n` +
      `Reasoning: ${r.redirect_behavior.reason}`
    );

    addSection("6. BLOCKCHAIN STATUS",
      `Payload Hash: ${r.blockchain_status.hash}\n` +
      `Network: ${r.blockchain_status.network.toUpperCase()}\n` +
      `Estimated Gas Fee: ${r.blockchain_status.gas_fee}`
    );

    addSection("7. ENVIRONMENTAL IMPACT",
      `CO2 Emitted During Lengthening: ${r.environmental_impact.co2_emitted}\n` +
      `Trees Statistically Affected: ${r.environmental_impact.trees_affected}\n` +
      `Calculated Corporate Guilt Level: ${r.environmental_impact.guilt_level.toUpperCase()}`
    );

    addSection("8. AI GENERATION LOG", r.ai_explanation);

    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    const splitDisclaimer = doc.splitTextToSize("DISCLAIMER: " + r.legal_disclaimer, 180);
    doc.text(splitDisclaimer, 15, y);

    doc.save(`enterprise-optimization-report-${r.report_id}.pdf`);
  };

  const handleNavClick = (e) => {
    e.preventDefault();
    window.location.reload();
  };

  return (
    <>
      <nav className="useless-navbar">
        <div className="nav-logo">
          <LinkIcon size={20} />
          <span>EnterpriseURL™</span>
        </div>
        <div className="nav-links">
          <a href="#home" onClick={handleNavClick}>Home</a>
          <a href="#lengthener" onClick={handleNavClick}>URL Lengthener</a>
          <a href="#app" onClick={handleNavClick}>App</a>
          <a href="#tool" onClick={handleNavClick}>Tool</a>
        </div>
      </nav>

      <div className="app-container">
        {loadingModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <AlertTriangle size={48} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ marginBottom: '1rem' }}>Enterprise Confirmation</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                This is an absolutely useless app and may take a while to regenerate.<br />Are you sure you want to continue?
              </p>
              <div className="modal-buttons">
                <button className="btn-primary" style={{ padding: '0.6rem 1.2rem', width: 'auto' }} onClick={handleModalYes}>Yes</button>
                <button className="btn-secondary" style={{ padding: '0.6rem 1.2rem' }} onClick={handleModalNo}>No</button>
              </div>
              {modalNoClicked && (
                <p style={{ color: 'var(--danger)', marginTop: '1.5rem', fontWeight: 'bold', animation: 'fadeInUp 0.3s ease-out' }}>
                  Well, it's too late to say no. Continuing anyway...
                </p>
              )}
            </div>
          </div>
        )}

        <header>
          <h1>Enterprise URL Lengthening Platform™</h1>
          <p className="subtitle">Because short URLs lack the required corporate gravity.</p>
        </header>

        <main>
          {!result ? (
            <div className="panel">
              <form onSubmit={handleGenerate}>
                <div className="input-group">
                  <label className="input-label" htmlFor="url-input">
                    Target Resource Locator
                  </label>
                  <input
                    id="url-input"
                    className="url-input"
                    type="text"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setError('');
                    }}
                    disabled={loading}
                  />
                  {error && (
                    <p className="error-text">
                      <AlertTriangle size={16} /> {error}
                    </p>
                  )}
                </div>

                {!loading ? (
                  <>
                    <label className="input-label" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Settings size={18} /> Optimization Parameters
                    </label>

                    <div className="settings-grid">
                      <SettingToggle
                        title="Highly Optimized (DANGER)"
                        desc="Bypass all synergy. Returns the exact URL after 10 terrifying seconds."
                        icon={<AlertTriangle size={20} color="var(--danger)" />}
                        checked={settings.highlyOptimized}
                        onChange={() => handleToggle('highlyOptimized')}
                        badge="ABSOLUTE DANGER"
                        extraLabel="ISO Certified (self-issued)"
                      />
                      <SettingToggle
                        title="AI Optimization"
                        desc="Uses cutting-edge AI to unnecessarily increase URL length."
                        hoverDesc="Uses AI to make things longer without adding value."
                        icon={<Cpu size={20} />}
                        checked={settings.aiOptimized}
                        onChange={() => handleToggle('aiOptimized')}
                        badge="RECOMMENDED (statistically irrelevant)"
                        badgeClass="flicker"
                        tooltip="Powered by Google Gemini (Not Really)"
                      />
                      <SettingToggle
                        title="Corporate Synergy"
                        desc="Aligns bandwidth with management KPIs."
                        hoverDesc="Forces multiple teams to review the URL before generation."
                        icon={<Briefcase size={20} />}
                        checked={settings.synergy}
                        onChange={() => handleToggle('synergy')}
                        featured={true}
                      />
                      <SettingToggle
                        title="SEO Boost"
                        desc="Inject keywords directly into the routing layer."
                        hoverDesc="Pretends your URL matters to search engines."
                        icon={<Rocket size={20} />}
                        checked={settings.seoBoost}
                        onChange={() => handleToggle('seoBoost')}
                      />
                      <SettingToggle
                        title="Blockchain Security"
                        desc="Hashes the payload natively on Web3."
                        hoverDesc="Burns a small rainforest to secure the URL."
                        icon={<ShieldAlert size={20} />}
                        checked={settings.blockchain}
                        onChange={() => handleToggle('blockchain')}
                        tooltip="Trust us, it's secure"
                      />
                      <SettingToggle
                        title="Emotional Support"
                        desc="Provides affirming query parameters."
                        hoverDesc="Whispers to the bits as they travel over the wire."
                        icon={<Heart size={20} />}
                        checked={settings.emotionalSupport}
                        onChange={() => handleToggle('emotionalSupport')}
                      />
                    </div>

                    {settings.highlyOptimized && (
                      <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid var(--danger)', padding: '1.2rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <input type="checkbox" id="danger" checked={dangerAccepted} onChange={(e) => setDangerAccepted(e.target.checked)} style={{ transform: 'scale(1.5)', cursor: 'pointer' }} />
                        <label htmlFor="danger" style={{ color: 'var(--danger)', fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer', lineHeight: '1.4' }}>
                          I understand this is a highly dangerous process that bypasses all enterprise compliance and will stall the client for exactly 10 seconds.
                        </label>
                      </div>
                    )}

                    <button type="submit" className="btn-primary" disabled={loading || !url || (settings.highlyOptimized && !dangerAccepted)}>
                      <RefreshCw size={20} /> Deploy Enterprise Link
                    </button>

                    <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', textAlign: 'center', opacity: 0.8 }}>
                      ⚠ Results may exceed expectations and URL limits
                    </p>
                  </>
                ) : (
                  <div className="loading-container">
                    <Player
                      autoplay
                      loop
                      src="https://assets3.lottiefiles.com/packages/lf20_UJNc2t.json"
                      style={{ height: '120px', width: '120px', marginBottom: '1.5rem', filter: 'hue-rotate(-45deg)' }}
                    />
                    <p className="loading-step">{loadingStep}</p>
                  </div>
                )}
              </form>
            </div>
          ) : (
            <div className="panel" style={{ animation: 'fadeInUp 0.5s ease-out' }}>
              {complianceWarning ? (
                <div className="compliance-warning-box">
                  <AlertTriangle size={48} color="var(--accent-secondary)" style={{ marginBottom: '1rem', display: 'inline-block' }} />
                  <h3 style={{ marginBottom: '0.5rem' }}>⚠ Minor compliance issue detected. Proceed anyway?</h3>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'center' }}>
                    <button type="button" className="btn-secondary" onClick={() => setComplianceWarning(false)}>Yes</button>
                    <button type="button" className="btn-secondary" onClick={() => setComplianceWarning(false)}>Also Yes</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="executive-banner">
                    <div className="status-label">STATUS: ENTERPRISE DEPLOYMENT SUCCESSFUL</div>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                      <div className="status-metric">Confidence: {(Math.random() * 60 + 100).toFixed(2)}%</div>
                      <div className="status-metric">Issues: {Math.floor(Math.random() * 21)} (ignored)</div>
                    </div>
                  </div>

                  <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <LinkIcon color="var(--success)" /> Deployment Successful
                  </h2>
                  <p className="subtitle" style={{ marginBottom: '1rem' }}>
                    Your URL has been upgraded to meet rigorous enterprise standards.
                  </p>

                  <div className="result-box" style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', padding: '1rem', borderStyle: 'dashed' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Original Subject:</strong><br />
                    {result.originalUrl}
                  </div>

                  <div className="result-box" style={{ marginTop: '0' }}>
                    {result.enhancedUrl}
                  </div>

                  {result.compliance && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '0.95rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                      ✔ Report Generated (Required for Compliance)
                    </div>
                  )}

                  <div className="action-buttons">
                    <button type="button" className="btn-secondary" onClick={copyToClipboard}>
                      <Copy size={18} /> Copy to Clipboard
                    </button>
                    <button type="button" className="btn-secondary" onClick={handleRedirect}>
                      <ExternalLink size={18} /> Visit Enhanced URL
                    </button>

                    <button type="button" className="btn-secondary" style={{ marginTop: '0.5rem' }} onClick={() => setResult(null)}>
                      Generate Another
                    </button>
                    <button type="button" className="btn-secondary" style={{ marginTop: '0.5rem' }} onClick={downloadReport}>
                      View Compliance Report
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>

      <footer className="useless-footer featured-footer">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--success)' }}>
          <div className="status-dot"></div>
          <span style={{ fontSize: '0.85rem' }}>System Status: Operational (for now)</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '1rem' }}>Latency: 0.0001ms (suspiciously fast)</span>
        </div>

        <p>© {new Date().getFullYear()} Enterprise URL Lengthening Platform™. All synergy rights reserved under penalty of corporate law.</p>

        <div className="footer-links">
          <span className="disabled-link">Investor Deck</span>
          <span className="disabled-link">AI Ethics Board</span>
          <span className="disabled-link">Compliance Reports</span>
          <span className="disabled-link">Synergy Metrics</span>
        </div>
      </footer>
    </>
  );
}

function SettingToggle({ title, desc, hoverDesc, icon, checked, onChange, badge, badgeClass, tooltip, disabled, featured, extraLabel }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`toggle-card ${checked ? 'active' : ''} ${disabled ? 'disabled' : ''} ${featured ? 'featured-card' : ''}`}
      onClick={!disabled ? onChange : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="toggle-icon">{icon}</div>
      <div className="toggle-content" style={{ flex: 1 }}>
        <h3>
          {title}
          {badge && <span className={`badge ${badgeClass || ''}`}>{badge}</span>}
          {tooltip && (
            <span className="tooltip-container">
              <Info className="tooltip-icon" size={14} />
              <span className="tooltip-text">{tooltip}</span>
            </span>
          )}
        </h3>
        <p>{isHovered && hoverDesc ? hoverDesc : desc}</p>
        {extraLabel && <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>{extraLabel}</div>}
      </div>
      <label className="switch" onClick={(e) => e.stopPropagation()}>
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="slider"></span>
      </label>
    </div>
  );
}

export default App;
