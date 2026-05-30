import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import './MhtCetForm.css';

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyWjXHGASutb9BiqXTad74bAXOPiF2_qhNxOamirD-OAwMRqD1MGodL5PShiYhFZ0MbLQ/exec";

export default function MhtCetForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Step 0: Initial Question
    formFilled: null, // 'YES' or 'NO'

    // If YES (Short Form)
    candidateNameShort: '',
    mhtCetEmail: '',
    mhtCetPassword: '',

    // If NO (Full Form)
    // Personal
    candidateNameAadhaar: '',
    dob: '',
    aadhaarNumber: '',
    candidateNameNeet: '',
    // Contact
    mobileNumber: '',
    alternateMobile: '',
    // Family
    fatherName: '',
    motherName: '',
    // Basic
    gender: '',
    religion: '',
    nationality: 'Indian',
    familyIncome: '',
    // Address
    address: '',
    state: 'Maharashtra',
    district: '',
    taluka: '',
    pincode: '',
    // Additional
    maharashtraDomicile: '',
    minorityDetails: '',
    sscPassingYear: '',
    // Academic
    hscTotalMarks: '',
    hscMarksObtained: '',
    hscPercentage: '',
    sscBoard: ''
  });

  const districts = {
    "Maharashtra": [
      "Ahmednagar", "Akola", "Amravati", "Beed", "Bhandara", "Buldhana", "Chandrapur",
      "Chhatrapati Sambhajinagar", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon",
      "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded",
      "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad",
      "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha",
      "Washim", "Yavatmal"
    ]
    // Other states can be added here
  };

  const incomeRanges = [
    "Below 1 Lakh",
    "1 Lakh - 2.5 Lakh",
    "2.5 Lakh - 5 Lakh",
    "5 Lakh - 8 Lakh",
    "Above 8 Lakh"
  ];

  const sscBoards = ["Maharashtra Board", "CBSE", "ICSE", "NIOS", "Other"];

  const religions = ["Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain", "Other"];

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Auto Uppercase for specific fields
    const uppercaseFields = [
      'candidateNameShort', 'candidateNameAadhaar', 'candidateNameNeet',
      'fatherName', 'motherName', 'address'
    ];
    if (uppercaseFields.includes(name)) {
      newValue = value.toUpperCase();
    }

    // Numeric only for Aadhaar, Mobile, Pincode
    const numericFields = ['aadhaarNumber', 'mobileNumber', 'alternateMobile', 'pincode'];
    if (numericFields.includes(name)) {
      newValue = value.replace(/\D/g, '');
      if (name === 'aadhaarNumber') newValue = newValue.slice(0, 12);
      if (name === 'mobileNumber' || name === 'alternateMobile') newValue = newValue.slice(0, 10);
      if (name === 'pincode') newValue = newValue.slice(0, 6);
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  // Auto calculate percentage
  useEffect(() => {
    if (formData.hscTotalMarks && formData.hscMarksObtained) {
      const total = parseFloat(formData.hscTotalMarks);
      const obtained = parseFloat(formData.hscMarksObtained);
      if (total > 0) {
        const perc = ((obtained / total) * 100).toFixed(2);
        setFormData(prev => ({ ...prev, hscPercentage: perc + '%' }));
      }
    }
  }, [formData.hscTotalMarks, formData.hscMarksObtained]);

  const validateStep = () => {
    if (step === 0) return formData.formFilled !== null;
    
    if (formData.formFilled === 'YES') {
      return formData.candidateNameShort && formData.mhtCetEmail && formData.mhtCetPassword;
    }

    // Full Form Validation per Step
    switch(step) {
      case 1: return formData.candidateNameAadhaar && formData.dob && formData.aadhaarNumber.length === 12 && formData.candidateNameNeet;
      case 2: return formData.mobileNumber.length === 10 && formData.fatherName && formData.motherName;
      case 3: return formData.gender && formData.religion && formData.familyIncome;
      case 4: return formData.address && formData.district && formData.pincode.length === 6;
      case 5: return formData.maharashtraDomicile && formData.sscPassingYear;
      case 6: return formData.hscTotalMarks && formData.hscMarksObtained && formData.sscBoard;
      default: return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      if (formData.formFilled === 'YES' && step === 0) {
        setStep(10); // Jump to YES path form
      } else {
        setStep(prev => prev + 1);
      }
      window.scrollTo(0, 0);
    } else {
      alert("Please fill all required fields correctly.");
    }
  };

  const handlePrev = () => {
    if (step === 10) setStep(0);
    else setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsSubmitting(true);
    setError('');

    try {
      // Direct POST to Google Apps Script
      // Note: Apps Script usually requires a special handling for CORS or use a proxy
      // But for simple Web App deployments, fetch with mode 'no-cors' works for one-way submission
      // However, to get the response (like duplicate check), you need a properly configured backend.
      
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // standard for GAS
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString()
        })
      });

      // Since mode is no-cors, we won't get a readable response body, 
      // but we assume success if it doesn't throw.
      setSubmitted(true);
    } catch (err) {
      setError('Submission failed. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSteps = formData.formFilled === 'YES' ? 1 : 6;
  const currentProgress = formData.formFilled === 'YES' 
    ? (step === 10 ? 100 : 0) 
    : (step / totalSteps) * 100;

  if (submitted) {
    return (
      <div className="mht-root">
        <div className="mht-container">
          <div className="mht-card mht-success-view">
            <i className="fas fa-check-circle mht-success-icon"></i>
            <h2>Registration Successful!</h2>
            <p>Thank you for submitting your MHT-CET details. Our team will contact you soon for further guidance.</p>
            <button onClick={() => navigate('/')} className="mht-btn mht-btn-next" style={{ margin: '2rem auto' }}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mht-root">
      <Helmet>
        <title>MHT-CET 2026 Student Data Collection | Admissions Made Easy</title>
        <meta name="description" content="Official registration form for MHT-CET 2026 guidance and data collection." />
      </Helmet>

      <div className="mht-container">
        <div className="mht-card">
          {isSubmitting && (
            <div className="mht-loading-overlay">
              <div className="mht-spinner"></div>
              <p style={{ marginTop: '1rem', fontWeight: 600 }}>Saving your data...</p>
            </div>
          )}

          <div className="mht-progress-wrap">
            <div className="mht-progress-bar">
              <div className="mht-progress-fill" style={{ width: `${currentProgress}%` }}></div>
            </div>
            <div className="mht-steps-indicator">
              <span>{step === 0 ? 'Start' : `Step ${step === 10 ? 1 : step} of ${totalSteps}`}</span>
              <span>{Math.round(currentProgress)}% Completed</span>
            </div>
          </div>

          {/* STEP 0: INITIAL QUESTION */}
          {step === 0 && (
            <div className="mht-step-content">
              <h2 className="mht-section-title">
                <i className="fas fa-question-circle"></i> MHT-CET परीक्षेचा फॉर्म भरलेला आहे का?
              </h2>
              <div className="mht-binary-options">
                <div 
                  className={`mht-binary-card ${formData.formFilled === 'YES' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, formFilled: 'YES' })}
                >
                  <i className="fas fa-check-circle"></i>
                  <span>YES</span>
                </div>
                <div 
                  className={`mht-binary-card ${formData.formFilled === 'NO' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, formFilled: 'NO' })}
                >
                  <i className="fas fa-times-circle"></i>
                  <span>NO</span>
                </div>
              </div>
              <div className="mht-nav-btns">
                <button className="mht-btn mht-btn-next" onClick={handleNext} disabled={formData.formFilled === null}>
                  Next Step <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {/* YES PATH: SHORT FORM */}
          {step === 10 && (
            <form onSubmit={handleSubmit} className="mht-step-content">
              <h2 className="mht-section-title"><i className="fas fa-id-card"></i> Login Details</h2>
              <div className="mht-grid">
                <div className="mht-input-group full-width">
                  <label>Candidate Full Name (As per Document) <span>*</span></label>
                  <input type="text" name="candidateNameShort" value={formData.candidateNameShort} onChange={handleChange} placeholder="ENTER FULL NAME" required className="mht-input" />
                </div>
                <div className="mht-input-group">
                  <label>MHT-CET Registered Email <span>*</span></label>
                  <input type="email" name="mhtCetEmail" value={formData.mhtCetEmail} onChange={handleChange} placeholder="example@gmail.com" required className="mht-input" />
                </div>
                <div className="mht-input-group">
                  <label>MHT-CET Password <span>*</span></label>
                  <input type="text" name="mhtCetPassword" value={formData.mhtCetPassword} onChange={handleChange} placeholder="Password" required className="mht-input" />
                </div>
              </div>
              <div className="mht-nav-btns">
                <button type="button" className="mht-btn mht-btn-prev" onClick={handlePrev}>Back</button>
                <button type="submit" className="mht-btn mht-btn-submit">Submit Registration</button>
              </div>
            </form>
          )}

          {/* NO PATH: FULL FORM STEPS */}
          {formData.formFilled === 'NO' && step > 0 && (
            <>
              {/* Step 1: Personal */}
              {step === 1 && (
                <div className="mht-step-content">
                  <h2 className="mht-section-title"><i className="fas fa-user"></i> Personal Details</h2>
                  <div className="mht-grid">
                    <div className="mht-input-group full-width">
                      <label>Candidate Full Name (As per Aadhaar Card) <span>*</span></label>
                      <input type="text" name="candidateNameAadhaar" value={formData.candidateNameAadhaar} onChange={handleChange} placeholder="ENTER FULL NAME" className="mht-input" />
                    </div>
                    <div className="mht-input-group">
                      <label>Date of Birth <span>*</span></label>
                      <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="mht-input" />
                    </div>
                    <div className="mht-input-group">
                      <label>Aadhaar Number <span>*</span></label>
                      <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} placeholder="12 Digit Aadhaar" className="mht-input" />
                    </div>
                    <div className="mht-input-group full-width">
                      <label>Candidate Full Name (As per NEET Form) <span>*</span></label>
                      <input type="text" name="candidateNameNeet" value={formData.candidateNameNeet} onChange={handleChange} placeholder="ENTER FULL NAME" className="mht-input" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Contact & Family */}
              {step === 2 && (
                <div className="mht-step-content">
                  <h2 className="mht-section-title"><i className="fas fa-users"></i> Contact & Family</h2>
                  <div className="mht-grid">
                    <div className="mht-input-group">
                      <label>Mobile Number <span>*</span></label>
                      <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="10 Digit Number" className="mht-input" />
                    </div>
                    <div className="mht-input-group">
                      <label>Alternate Mobile</label>
                      <input type="text" name="alternateMobile" value={formData.alternateMobile} onChange={handleChange} placeholder="Optional" className="mht-input" />
                    </div>
                    <div className="mht-input-group">
                      <label>Father's Name <span>*</span></label>
                      <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="FATHER'S FULL NAME" className="mht-input" />
                    </div>
                    <div className="mht-input-group">
                      <label>Mother's Name <span>*</span></label>
                      <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} placeholder="MOTHER'S FULL NAME" className="mht-input" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Basic Details */}
              {step === 3 && (
                <div className="mht-step-content">
                  <h2 className="mht-section-title"><i className="fas fa-info-circle"></i> Basic Details</h2>
                  <div className="mht-grid">
                    <div className="mht-input-group">
                      <label>Gender <span>*</span></label>
                      <select name="gender" value={formData.gender} onChange={handleChange} className="mht-select">
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="mht-input-group">
                      <label>Religion <span>*</span></label>
                      <select name="religion" value={formData.religion} onChange={handleChange} className="mht-select">
                        <option value="">Select Religion</option>
                        {religions.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div className="mht-input-group">
                      <label>Nationality <span>*</span></label>
                      <select name="nationality" value={formData.nationality} onChange={handleChange} className="mht-select">
                        <option value="Indian">Indian</option>
                        <option value="NRI">NRI</option>
                      </select>
                    </div>
                    <div className="mht-input-group">
                      <label>Annual Family Income <span>*</span></label>
                      <select name="familyIncome" value={formData.familyIncome} onChange={handleChange} className="mht-select">
                        <option value="">Select Income Range</option>
                        {incomeRanges.map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Address Section */}
              {step === 4 && (
                <div className="mht-step-content">
                  <h2 className="mht-section-title"><i className="fas fa-map-marker-alt"></i> Address Details</h2>
                  <div className="mht-grid">
                    <div className="mht-input-group full-width">
                      <label>Address (As per Aadhaar) <span>*</span></label>
                      <textarea name="address" value={formData.address} onChange={handleChange} placeholder="FULL ADDRESS" className="mht-input" style={{ height: '80px', resize: 'none' }} />
                    </div>
                    <div className="mht-input-group">
                      <label>State <span>*</span></label>
                      <select name="state" value={formData.state} onChange={handleChange} className="mht-select">
                        <option value="Maharashtra">Maharashtra</option>
                        {/* More states can be added */}
                      </select>
                    </div>
                    <div className="mht-input-group">
                      <label>District <span>*</span></label>
                      <select name="district" value={formData.district} onChange={handleChange} className="mht-select">
                        <option value="">Select District</option>
                        {districts[formData.state]?.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="mht-input-group">
                      <label>Taluka</label>
                      <input type="text" name="taluka" value={formData.taluka} onChange={handleChange} placeholder="Enter Taluka" className="mht-input" />
                    </div>
                    <div className="mht-input-group">
                      <label>Pincode <span>*</span></label>
                      <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="6 Digits" className="mht-input" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Additional Info */}
              {step === 5 && (
                <div className="mht-step-content">
                  <h2 className="mht-section-title"><i className="fas fa-file-contract"></i> Additional Details</h2>
                  <div className="mht-grid">
                    <div className="mht-input-group">
                      <label>Maharashtra Domicile? <span>*</span></label>
                      <select name="maharashtraDomicile" value={formData.maharashtraDomicile} onChange={handleChange} className="mht-select">
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="mht-input-group">
                      <label>Minority Details?</label>
                      <select name="minorityDetails" value={formData.minorityDetails} onChange={handleChange} className="mht-select">
                        <option value="No">No</option>
                        <option value="Linguistic">Linguistic Minority</option>
                        <option value="Religious">Religious Minority</option>
                      </select>
                    </div>
                    <div className="mht-input-group">
                      <label>SSC Passing Year <span>*</span></label>
                      <select name="sscPassingYear" value={formData.sscPassingYear} onChange={handleChange} className="mht-select">
                        <option value="">Select Year</option>
                        {Array.from({ length: 17 }, (_, i) => 2026 - i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Academic Details */}
              {step === 6 && (
                <form onSubmit={handleSubmit} className="mht-step-content">
                  <h2 className="mht-section-title"><i className="fas fa-graduation-cap"></i> Academic Details</h2>
                  <div className="mht-grid">
                    <div className="mht-input-group">
                      <label>HSC Total Marks <span>*</span></label>
                      <input type="number" name="hscTotalMarks" value={formData.hscTotalMarks} onChange={handleChange} placeholder="e.g. 600" className="mht-input" />
                    </div>
                    <div className="mht-input-group">
                      <label>HSC Marks Obtained <span>*</span></label>
                      <input type="number" name="hscMarksObtained" value={formData.hscMarksObtained} onChange={handleChange} placeholder="e.g. 450" className="mht-input" />
                    </div>
                    <div className="mht-input-group">
                      <label>Total Percentage (Auto)</label>
                      <input type="text" name="hscPercentage" value={formData.hscPercentage} readOnly className="mht-input" style={{ background: 'rgba(243, 156, 18, 0.1)', color: 'var(--primary)', fontWeight: 700 }} />
                    </div>
                    <div className="mht-input-group">
                      <label>SSC Board <span>*</span></label>
                      <select name="sscBoard" value={formData.sscBoard} onChange={handleChange} className="mht-select">
                        <option value="">Select Board</option>
                        {sscBoards.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="mht-nav-btns" style={{ display: 'none' }}></div>
                </form>
              )}

              {/* SHARED NAVIGATION FOR NO PATH */}
              <div className="mht-nav-btns">
                <button type="button" className="mht-btn mht-btn-prev" onClick={handlePrev}>
                  <i className="fas fa-arrow-left"></i> Previous
                </button>
                {step < 6 ? (
                  <button type="button" className="mht-btn mht-btn-next" onClick={handleNext}>
                    Next <i className="fas fa-arrow-right"></i>
                  </button>
                ) : (
                  <button type="button" className="mht-btn mht-btn-submit" onClick={handleSubmit}>
                    Submit Registration
                  </button>
                )}
              </div>
            </>
          )}

          {error && <p style={{ color: 'var(--error)', marginTop: '1rem', textAlign: 'center', fontWeight: 600 }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}
