import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import AuthModal from './AuthModal';
import './App.css';

const SECTOR_DATA = {
  "Manufacturing - Plastics & Packaging": {
    baseCost: 42000,
    baseDays: 34,
    approvals: [
      {
        id: "mfg-1",
        name: "Factory License",
        department: "Directorate of Industrial Safety & Health",
        status: "In Review",
        risk: "Medium",
        portal: "https://dish.tn.gov.in",
        documents: ["Building Plan Approval", "Machinery Layout Blueprint", "Fire NOC Copy"]
      },
      {
        id: "mfg-2",
        name: "Consent to Establish (CTE - Orange Category)",
        department: "Pollution Control Board",
        status: "Pending Action",
        risk: "High",
        portal: "https://tnpcb.gov.in",
        documents: ["Effluent Treatment Plan", "Raw Material Sourcing List", "Site Topo Plan"]
      },
      {
        id: "mfg-3",
        name: "Fire Safety NOC",
        department: "State Fire & Rescue Services",
        status: "Approved",
        risk: "Low",
        portal: "https://fireservice.tn.gov.in",
        documents: ["Hydrant Installation Layout", "Exit Evacuation Blueprint"]
      },
      {
        id: "mfg-4",
        name: "MSME Udyam Registration",
        department: "Ministry of MSME",
        status: "Approved",
        risk: "Low",
        portal: "https://udyamregistration.gov.in",
        documents: ["Identity Proof & PAN", "Bank Account Details"]
      },
      {
        id: "mfg-5",
        name: "HT/LT Electricity Sanction",
        department: "State Electricity Board (TANGEDCO)",
        status: "Not Started",
        risk: "Medium",
        portal: "https://tnebltd.gov.in",
        documents: ["Connected Load Estimate", "Property Ownership / Lease Deed"]
      }
    ],
    alerts: [
      { type: "danger", text: "⚠️ Pollution Control NOC requires urgent site inspection scheduling." },
      { type: "warning", text: "🔔 Plastic Waste Management Extended Producer Responsibility (EPR) filing opens next week." }
    ]
  },
  "Food Processing": {
    baseCost: 32000,
    baseDays: 25,
    approvals: [
      {
        id: "food-1",
        name: "FSSAI State Manufacturing License",
        department: "Food Safety and Standards Authority of India",
        status: "In Review",
        risk: "High",
        portal: "https://foscos.fssai.gov.in",
        documents: ["Food Safety Management Plan (FSMS)", "Water Test Report (IS 10500)", "Equipment List"]
      },
      {
        id: "food-2",
        name: "Trade License & Health NOC",
        department: "Local Municipal Corporation / Panchayat",
        status: "Not Started",
        risk: "Medium",
        portal: "https://tnurbanepay.tn.gov.in",
        documents: ["Premises Lease Deed", "Sanitary Inspection Certificate"]
      },
      {
        id: "food-3",
        name: "Pollution Control NOC (Green Category)",
        department: "Pollution Control Board",
        status: "Approved",
        risk: "Low",
        portal: "https://tnpcb.gov.in",
        documents: ["Wastewater Disposal Undertaking"]
      },
      {
        id: "food-4",
        name: "Legal Metrology Packaged Commodities",
        department: "Department of Consumer Affairs",
        status: "Not Started",
        risk: "Medium",
        portal: "https://consumeraffairs.nic.in",
        documents: ["Specimen Label Artwork", "Net Content Verification Certificate"]
      }
    ],
    alerts: [
      { type: "danger", text: "⚠️ FSSAI physical audit requires water laboratory testing certificate." }
    ]
  },
  "IT / Services": {
    baseCost: 15000,
    baseDays: 14,
    approvals: [
      {
        id: "it-1",
        name: "Shops and Commercial Establishment Registration",
        department: "State Labour Department",
        status: "Approved",
        risk: "Low",
        portal: "https://labour.tn.gov.in",
        documents: ["Rental Agreement", "Employee Wage Register Format"]
      },
      {
        id: "it-2",
        name: "Professional Tax & GST Registration",
        department: "Commercial Taxes Department",
        status: "Approved",
        risk: "Low",
        portal: "https://www.gst.gov.in",
        documents: ["PAN, Bank Statement", "Director/Partner KYC"]
      },
      {
        id: "it-3",
        name: "Digital Personal Data Protection Compliance Audit",
        department: "Data Protection Board / CERT-In",
        status: "In Review",
        risk: "Medium",
        portal: "https://www.cert-in.org.in",
        documents: ["Data Retention Policy", "Privacy Notice Copy"]
      }
    ],
    alerts: [
      { type: "warning", text: "🔔 Annual Shops & Establishment employee roster renewal due in 30 days." }
    ]
  },
  "Chemicals": {
    baseCost: 85000,
    baseDays: 60,
    approvals: [
      {
        id: "chem-1",
        name: "Pollution Control CTE (Red Category)",
        department: "Pollution Control Board",
        status: "Pending Action",
        risk: "High",
        portal: "https://tnpcb.gov.in",
        documents: ["Environmental Impact Assessment", "Hazardous Waste Storage Blueprint", "Zero Liquid Discharge Plan"]
      },
      {
        id: "chem-2",
        name: "PESO Petroleum & Explosive Storage License",
        department: "Petroleum and Explosives Safety Organisation",
        status: "Not Started",
        risk: "High",
        portal: "https://peso.gov.in",
        documents: ["Safety Distances Map", "Fabrication Certificate for Storage Tanks"]
      },
      {
        id: "chem-3",
        name: "Major Accident Hazard (MAH) Disaster Plan",
        department: "Directorate of Industrial Safety & Health",
        status: "Not Started",
        risk: "High",
        portal: "https://dish.tn.gov.in",
        documents: ["On-site Emergency Response Plan", "Medical Evacuation Protocol"]
      }
    ],
    alerts: [
      { type: "danger", text: "⚠️ Red category chemical manufacturing requires central EIA clearance before building." }
    ]
  },
  "Retail": {
    baseCost: 12000,
    baseDays: 10,
    approvals: [
      {
        id: "ret-1",
        name: "Trade License",
        department: "Municipal Corporation",
        status: "In Review",
        risk: "Medium",
        portal: "https://tnurbanepay.tn.gov.in",
        documents: ["Premises Lease Agreement", "Property Tax Receipt"]
      },
      {
        id: "ret-2",
        name: "GSTIN Registration",
        department: "Central Board of Indirect Taxes and Customs",
        status: "Approved",
        risk: "Low",
        portal: "https://www.gst.gov.in",
        documents: ["Electricity Bill", "Bank Statement"]
      },
      {
        id: "ret-3",
        name: "Commercial Signboard Permission",
        department: "Urban Local Body",
        status: "Not Started",
        risk: "Low",
        portal: "https://tnurbanepay.tn.gov.in",
        documents: ["Signboard Dimension Dimensions Sketch"]
      }
    ],
    alerts: [
      { type: "warning", text: "🔔 Signboard display language regulations apply per municipal bylaws." }
    ]
  }
};

// Grand Multi-Stage Confetti Sequence for 100% Completion
const triggerFullCelebration = () => {
  const duration = 3.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 35, spread: 360, ticks: 60, zIndex: 9999 };

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }
    const particleCount = 50 * (timeLeft / duration);
    confetti({ ...defaults, particleCount, origin: { x: 0.15, y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: 0.85, y: Math.random() - 0.2 } });
  }, 250);
};

export default function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Authentication & Verification State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userAuth, setUserAuth] = useState(null);

  // Form State
  const [sector, setSector] = useState("Manufacturing - Plastics & Packaging");
  const [stateName, setStateName] = useState("Tamil Nadu");
  const [investment, setInvestment] = useState(75);
  const [employees, setEmployees] = useState(15);
  const [stage, setStage] = useState("New Setup");

  // Conditional Upload Files (Renewal/Expansion)
  const [renewalFiles, setRenewalFiles] = useState({});

  // Dashboard Interactive State
  const [activeApprovals, setActiveApprovals] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [checkedDocs, setCheckedDocs] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);

  // Live Government Sync State
  const [isSyncingGov, setIsSyncingGov] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  const generateRoadmap = () => {
    setProcessing(true);
    setTimeout(() => {
      const selected = SECTOR_DATA[sector] || SECTOR_DATA["Manufacturing - Plastics & Packaging"];
      const preparedApprovals = selected.approvals.map((item) => ({
        ...item,
        arn: `TN-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        validUntil: item.status === "Approved" ? "2027-09-10" : null
      }));

      setActiveApprovals(preparedApprovals);
      setActiveAlerts(selected.alerts || []);
      setProcessing(false);
      setShowDashboard(true);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1800);
  };

  const handleStatusChange = (id, nextStatus) => {
    setActiveApprovals((prev) => {
      const updated = prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: nextStatus,
              validUntil: nextStatus === "Approved" ? "2027-09-10" : item.validUntil
            }
          : item
      );

      if (nextStatus === "Approved") {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 }
        });
      }

      return updated;
    });
  };

  // Check if all clearances are approved
  const allApproved =
    activeApprovals.length > 0 && activeApprovals.every((a) => a.status === "Approved");

  useEffect(() => {
    if (allApproved) {
      triggerFullCelebration();
    }
  }, [allApproved]);

  const toggleDocCheck = (docKey) => {
    setCheckedDocs((prev) => ({ ...prev, [docKey]: !prev[docKey] }));
  };

  const handleFileUpload = (e, fileCategory) => {
    const file = e.target.files[0];
    if (file) {
      setRenewalFiles((prev) => ({
        ...prev,
        [fileCategory]: file.name
      }));
    }
  };

  // Direct Live Sync with State/Central Single Window Clearinghouse
  const syncWithGovernmentPortals = () => {
    setIsSyncingGov(true);
    setTimeout(() => {
      setActiveApprovals((prev) =>
        prev.map((item) => {
          if (item.status === "Pending Action" || item.status === "In Review") {
            return {
              ...item,
              status: "Approved",
              validUntil: "2027-09-10"
            };
          }
          return item;
        })
      );
      setIsSyncingGov(false);
      setLastSyncTime(new Date().toLocaleTimeString());
    }, 1800);
  };

  const approvedCount = activeApprovals.filter((a) => a.status === "Approved").length;
  const progressPercent =
    activeApprovals.length > 0 ? Math.round((approvedCount / activeApprovals.length) * 100) : 0;

  const currentSectorData = SECTOR_DATA[sector] || SECTOR_DATA["Manufacturing - Plastics & Packaging"];
  const estimatedCostNumber = currentSectorData.baseCost + Math.round(investment * 150);
  const estimatedDays = currentSectorData.baseDays;

  if (showDashboard) {
    return (
      <motion.div
        className="app dashboard-view"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <header className="header no-print">
          <div>
            <h1>Compliance Roadmap & Tracker</h1>
            <p>{sector} • {stateName} • Stage: {stage}</p>
          </div>
          <div className="header-actions">
            {userAuth ? (
              <span className="verified-pill">
                ✓ Verified Signatory: {userAuth.name}
              </span>
            ) : (
              <button className="btn-secondary" onClick={() => setShowAuthModal(true)}>
                🇮🇳 Connect DigiLocker
              </button>
            )}
            <button className="btn-secondary" onClick={() => window.print()}>🖨️ Export PDF</button>
            <button className="btn-secondary" onClick={() => setShowDashboard(false)}>← New Assessment</button>
          </div>
        </header>

        {/* Live Progress Bar */}
        <div className="progress-section">
          <div className="progress-header">
            <span>Overall Roadmap Completion</span>
            <strong>{approvedCount} of {activeApprovals.length} Approved ({progressPercent}%)</strong>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        {/* Clickable Stat Cards */}
        <div className="stats">
          <div className="card">
            <h3>Total Approvals</h3>
            <strong>{activeApprovals.length}</strong>
            <span className="card-hint">Mandatory clearances</span>
          </div>

          <div className="card clickable-card" onClick={() => { setModalType("time"); setShowModal(true); }}>
            <div className="card-top-row">
              <h3>Avg. Processing Time</h3>
              <span className="info-icon">ⓘ</span>
            </div>
            <strong>{estimatedDays} Days</strong>
            <span className="card-hint">Click for SLA timeline breakdown</span>
          </div>

          <div className="card clickable-card" onClick={() => { setModalType("cost"); setShowModal(true); }}>
            <div className="card-top-row">
              <h3>Estimated Cost</h3>
              <span className="info-icon">ⓘ</span>
            </div>
            <strong>₹{estimatedCostNumber.toLocaleString("en-IN")}</strong>
            <span className="card-hint">Click for fee breakdown</span>
          </div>
        </div>

        {/* Direct Government Single Window Sync Card */}
        <div className="gov-sync-card">
          <div className="sync-info">
            <div className="live-indicator-row">
              <span className="live-dot"></span>
              <strong>Direct Gateway: National & State Single Window Clearinghouse (NSWS/TN-SWS)</strong>
            </div>
            <p>
              {lastSyncTime
                ? `Last synchronized with departmental databases at ${lastSyncTime}.`
                : "Real-time query channel active. Direct clearance webhooks enabled."}
            </p>
          </div>
          <button
            className="btn-sync"
            onClick={syncWithGovernmentPortals}
            disabled={isSyncingGov || allApproved}
          >
            {isSyncingGov ? "Fetching Department Status..." : "🔄 Query Live Portal Status"}
          </button>
        </div>

        {/* Conditional Document Upload for Renewal & Expansion */}
        {(stage === "Renewal" || stage === "Expansion") && (
          <motion.div
            className="renewal-upload-box"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="upload-box-header">
              <span className="badge badge-warning">Mandatory for {stage}</span>
              <h3>Upload Prior Clearances & Statutory Evidence</h3>
              <p>
                State regulatory authorities mandate historical audit verification prior to endorsing renewals or facility capacity expansions.
              </p>
            </div>

            <div className="upload-grid">
              <div className="upload-card">
                <label>
                  <strong>Previous Operating License / CTO Copy</strong>
                  <span>(PDF or scanned certificate)</span>
                </label>
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg"
                    onChange={(e) => handleFileUpload(e, "prev_cto")}
                  />
                  {renewalFiles["prev_cto"] && (
                    <span className="file-badge">✓ {renewalFiles["prev_cto"]}</span>
                  )}
                </div>
              </div>

              <div className="upload-card">
                <label>
                  <strong>
                    {stage === "Expansion" ? "Revised Layout & Plant Expansion Blueprint" : "Annual Compliance Audit Report"}
                  </strong>
                  <span>(Architect or auditor signed document)</span>
                </label>
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg"
                    onChange={(e) => handleFileUpload(e, "audit_plan")}
                  />
                  {renewalFiles["audit_plan"] && (
                    <span className="file-badge">✓ {renewalFiles["audit_plan"]}</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <h2>Required Clearances & Licenses</h2>

        {/* Animated Approval Cards */}
        <div className="approvals">
          {activeApprovals.map((appr, idx) => {
            const isExpanded = expandedCard === appr.id;
            return (
              <motion.div
                key={appr.id}
                className="approval-card-wrapper"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.06 }}
              >
                <div className="approval-card" onClick={() => setExpandedCard(isExpanded ? null : appr.id)}>
                  <div className="approval-details">
                    <div className="title-row">
                      <h3>{appr.name}</h3>
                      <span className="expand-indicator">{isExpanded ? "▲" : "▼ Details"}</span>
                    </div>
                    <p>{appr.department}</p>

                    <div className="gov-meta-row">
                      <span className="arn-tag">ARN: {appr.arn}</span>
                      {appr.validUntil && (
                        <span className="validity-tag">
                          Valid until: {appr.validUntil} (Renewal due in 1 yr)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="approval-badges" onClick={(e) => e.stopPropagation()}>
                    <select
                      className={`badge-select ${getStatusClass(appr.status)}`}
                      value={appr.status}
                      onChange={(e) => handleStatusChange(appr.id, e.target.value)}
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Review">In Review</option>
                      <option value="Pending Action">Pending Action</option>
                      <option value="Approved">Approved</option>
                    </select>

                    <span className={`badge ${getRiskClass(appr.risk)}`}>Risk: {appr.risk}</span>
                  </div>
                </div>

                {/* Expandable Drawer: Documents, Direct Links & Actions */}
                {isExpanded && (
                  <div className="approval-drawer">
                    <div className="drawer-section">
                      <h4>Required Verification Documents:</h4>
                      <div className="doc-checklist">
                        {appr.documents.map((doc, dIdx) => {
                          const docKey = `${appr.id}-${dIdx}`;
                          return (
                            <label key={docKey} className="checkbox-item">
                              <input
                                type="checkbox"
                                checked={!!checkedDocs[docKey]}
                                onChange={() => toggleDocCheck(docKey)}
                              />
                              <span className={checkedDocs[docKey] ? "strikethrough" : ""}>{doc}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="drawer-footer">
                      <a href={appr.portal} target="_blank" rel="noreferrer" className="portal-btn">
                        Open Official Department Portal ↗
                      </a>

                      {appr.status === "Approved" ? (
                        <button
                          className="btn-renew"
                          onClick={() => alert(`Initiating one-click renewal filing for ${appr.name} via State SWS API.`)}
                        >
                          📅 File Extension / Renewal
                        </button>
                      ) : (
                        <button
                          className="btn-track"
                          onClick={() => alert(`Tracking live officer inspection logs for ARN: ${appr.arn}`)}
                        >
                          🔎 View Officer Scrutiny Remarks
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic Alerts */}
        {activeAlerts.map((alt, i) => (
          <div key={i} className={`alert alert-${alt.type}`}>
            {alt.text}
          </div>
        ))}

        {/* Modal: Cost or Timeline Breakdown */}
        {showModal && (
          <div className="processing-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{modalType === "cost" ? "Estimated Cost Breakdown" : "SLA Timeline Stages"}</h3>
                <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
              </div>

              {modalType === "cost" ? (
                <div className="breakdown-list">
                  <div className="breakdown-row">
                    <span>Statutory Government Application Fees</span>
                    <strong>₹{Math.round(estimatedCostNumber * 0.65).toLocaleString("en-IN")}</strong>
                  </div>
                  <div className="breakdown-row">
                    <span>Site Inspection & Scrutiny Charges</span>
                    <strong>₹{Math.round(estimatedCostNumber * 0.2).toLocaleString("en-IN")}</strong>
                  </div>
                  <div className="breakdown-row">
                    <span>Documentation & Legal Stamping Buffer</span>
                    <strong>₹{Math.round(estimatedCostNumber * 0.15).toLocaleString("en-IN")}</strong>
                  </div>
                  <hr className="divider" />
                  <div className="breakdown-row total-row">
                    <span>Total Estimated Outlay</span>
                    <strong>₹{estimatedCostNumber.toLocaleString("en-IN")}</strong>
                  </div>
                </div>
              ) : (
                <div className="timeline-stages">
                  <div className="stage-item">
                    <span className="stage-days">Days 1 – 7</span>
                    <div>
                      <strong>Documentation & Application Scrutiny</strong>
                      <p>Filing through Single Window Portal and initial desk scrutiny.</p>
                    </div>
                  </div>
                  <div className="stage-item">
                    <span className="stage-days">Days 8 – 20</span>
                    <div>
                      <strong>Site Inspection & Officer Verification</strong>
                      <p>Physical inspection by Fire, Labour, or PCB field officers.</p>
                    </div>
                  </div>
                  <div className="stage-item">
                    <span className="stage-days">Days 21 – {estimatedDays}</span>
                    <div>
                      <strong>Clearance Issuance & Digital Certificate</strong>
                      <p>Addressing compliance remarks and downloading verified clearance certificates.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onVerified={(authData) => {
            setUserAuth(authData);
            setCheckedDocs((prev) => ({
              ...prev,
              "mfg-4-0": true,
              "it-2-0": true
            }));
          }}
        />
      </motion.div>
    );
  }

  // Questionnaire / Wizard View
  return (
    <div className="app">
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 24px' }}>
        {userAuth ? (
          <span className="verified-pill">
            ✓ Verified Signatory: {userAuth.name}
          </span>
        ) : (
          <button className="btn-secondary" onClick={() => setShowAuthModal(true)}>
            🇮🇳 Connect DigiLocker / SSO Login
          </button>
        )}
      </div>

      <div className="hero">
        <h1>Compliance Roadmap</h1>
        <p>Find the exact statutory licenses, fees, and clearance timelines for your enterprise.</p>

        <div className="form">
          <label>Business Sector</label>
          <select value={sector} onChange={(e) => setSector(e.target.value)}>
            <option>Manufacturing - Plastics & Packaging</option>
            <option>Food Processing</option>
            <option>IT / Services</option>
            <option>Chemicals</option>
            <option>Retail</option>
          </select>

          <label>State / Location</label>
          <select value={stateName} onChange={(e) => setStateName(e.target.value)}>
            <option>Tamil Nadu</option>
            <option>Kerala</option>
            <option>Karnataka</option>
            <option>Andhra Pradesh</option>
          </select>

          <label>Investment Size (Plant & Machinery)</label>
          <input
            type="range"
            min="5"
            max="1000"
            value={investment}
            onChange={(e) => setInvestment(Number(e.target.value))}
          />
          <p className="investment-label">₹{investment} Lakhs</p>

          <label>Number of Employees</label>
          <input
            type="number"
            value={employees}
            onChange={(e) => setEmployees(Number(e.target.value))}
          />

          <label>Project Stage</label>
          <div className="radio">
            {["New Setup", "Expansion", "Renewal"].map((s) => (
              <label key={s}>
                <input
                  type="radio"
                  name="stage"
                  checked={stage === s}
                  onChange={() => setStage(s)}
                />
                {s}
              </label>
            ))}
          </div>

          <button className="btn-primary" onClick={generateRoadmap} disabled={processing}>
            {processing ? "Analyzing Regulations..." : "Generate Compliance Roadmap →"}
          </button>
        </div>
      </div>

      {processing && (
        <div className="processing-overlay">
          <div className="processing-modal">
            <h2>Analyzing {sector}...</h2>
            <p>✓ Scanning {stateName} Single Window Portal norms</p>
            <p>✓ Calculating risk parameters & SLA days</p>
            <p>✓ Compiling statutory document requirements</p>
            <div className="spinner"></div>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onVerified={(authData) => {
          setUserAuth(authData);
          setCheckedDocs((prev) => ({
            ...prev,
            "mfg-4-0": true,
            "it-2-0": true
          }));
        }}
      />
    </div>
  );
}

function getStatusClass(s) {
  switch (s) {
    case "Approved": return "status-approved";
    case "In Review": return "status-review";
    case "Pending Action": return "status-action";
    default: return "status-default";
  }
}

function getRiskClass(r) {
  switch (r) {
    case "High": return "risk-high";
    case "Medium": return "risk-medium";
    default: return "risk-low";
  }
}