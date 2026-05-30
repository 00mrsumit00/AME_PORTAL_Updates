import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './PollPage.css';

const POLL_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwhYJtSa3PbpdCgTE-qAN_7RhbQrWjb-YPp-IQmXkS5z4vC7KpxbwRNwDRPN6wVLtI2/exec";

const SCORE_OPTIONS = [
  "401 to 425", "426 to 450", "451 to 475", "476 to 500",
  "501 to 525", "526 to 550", "551 to 575", "576 to 600",
  "601 to 615", "616 to 630", "631 to 645", "646 to 660",
  "661 to 670", "671 to 680", "681 to 690", "691 to 700",
  "701 to 705", "706 to 710", "711 to 715", "716 to 720"
];

export default function PollPage() {
  const [view, setView] = useState('vote'); // 'vote' or 'results'
  const [name, setName] = useState('');
  const [selectedScore, setSelectedScore] = useState('');

  const [results, setResults] = useState({});
  const [totalVotes, setTotalVotes] = useState(0);

  const [comments, setComments] = useState([]);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if voted
    if (localStorage.getItem('ame_poll_voted')) {
      setView('results');
      fetchResults();
    }
    fetchComments();
  }, []);

  const fetchResults = async () => {
    setIsLoadingResults(true);
    try {
      const response = await fetch(`${POLL_WEBHOOK_URL}?action=results`);
      const data = await response.json();
      setResults(data.results || {});
      setTotalVotes(data.total || 0);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setIsLoadingResults(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`${POLL_WEBHOOK_URL}?action=comments`);
      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleVote = async () => {
    if (!name || !selectedScore) return;
    setIsSubmitting(true);
    try {
      await fetch(POLL_WEBHOOK_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "vote",
          name: name,
          score_range: selectedScore
        })
      });
      localStorage.setItem('ame_poll_voted', 'true');
      setView('results');
      fetchResults();
    } catch (error) {
      alert("Error submitting vote. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipToResults = () => {
    setView('results');
    fetchResults();
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentName || !commentText) return;
    setIsSubmitting(true);
    try {
      await fetch(POLL_WEBHOOK_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "comment",
          name: commentName,
          comment: commentText
        })
      });
      setCommentName('');
      setCommentText('');
      fetchComments();
    } catch (error) {
      alert("Error posting comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="poll-root">
      <Helmet>
        <title>Join the NEET 2026 Mega Poll | Admissions Made Easy</title>
        <meta name="description" content="Participate in real-time polls with thousands of other aspirants. See the latest trends and discuss admission strategies with experts." />
        <meta property="og:title" content="Join the NEET 2026 Mega Poll | Prediction & Insights" />
        <meta property="og:description" content="Be part of Maharashtra's largest student discussion hub. See real-time trends, predicted cutoffs, and share insights." />
        <meta property="og:url" content="https://admissionsmadeeasy.in/poll" />
      </Helmet>
      <header className="poll-top-nav">
        <div className="poll-nav-brand" onClick={() => navigate('/')}>
          <img src="/landing-assets/images/branding/logo1.png" alt="Admissions Made Easy" className="poll-logo" />
        </div>
        <div className="poll-nav-links">
          <button onClick={() => navigate('/')} className="poll-nav-btn">
            <i className="fas fa-home"></i> Home
          </button>
          <button onClick={() => navigate('/public-login')} className="poll-nav-btn poll-nav-highlight">
            <i className="fas fa-chart-line"></i> Last Year Cutoff
          </button>
        </div>
      </header>

      <div className="poll-container">
        <div className="poll-card">
          <h1 className="poll-title">NEET Cutoff Prediction Poll</h1>
          <p className="poll-subtitle">Please vote your tentative NEET score. This poll will give a nationwide idea about this year's cutoff.</p>

          {view === 'vote' ? (
            <div className="poll-voting-view">
              <div className="poll-form-group">
                <label className="input-label">Your Name</label>
                <input
                  type="text"
                  className="poll-text-input"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="poll-form-group">
                <label className="input-label">Select Your Expected Score Range</label>
                <div className="poll-options-grid">
                  {SCORE_OPTIONS.map(opt => (
                    <label key={opt} className={`poll-option-label ${selectedScore === opt ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="score"
                        value={opt}
                        checked={selectedScore === opt}
                        onChange={(e) => setSelectedScore(e.target.value)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div className="poll-actions">
                <button
                  className="poll-btn-primary"
                  disabled={!name || !selectedScore || isSubmitting}
                  onClick={handleVote}
                >
                  {isSubmitting ? 'Submitting...' : 'Vote Now'}
                </button>
                <button className="poll-btn-secondary" onClick={handleSkipToResults}>
                  Show Results
                </button>
              </div>
            </div>
          ) : (
            <div className="poll-results-view">
              {isLoadingResults ? (
                <div className="poll-loading-container">
                  <div className="poll-spinner"></div>
                  <p>Loading details...</p>
                </div>
              ) : (
                <>
                  <div className="poll-results-header">
                    <h2>Live Results</h2>
                    <span className="poll-total-votes">{totalVotes} Total Votes</span>
                  </div>

                  <div className="poll-bars-container">
                    {SCORE_OPTIONS.map(opt => {
                      const count = results[opt] || 0;
                      const percentage = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);

                      return (
                        <div key={opt} className="poll-result-item">
                          <div className="poll-result-info">
                            <span>{opt}</span>
                            <span>{percentage}% ({count})</span>
                          </div>
                          <div className="poll-result-bar-bg">
                            <div className="poll-result-bar-fill" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="poll-actions">
                    <button className="poll-btn-secondary" onClick={handleShare}>
                      <i className="fas fa-share-alt"></i> {copied ? 'Copied to Clipboard!' : 'Share Poll'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="poll-card poll-comments-section">
          <div className="poll-discussion-header">
            <h3><i className="fas fa-comments"></i> Discussion</h3>
            <span className="poll-comment-count">{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
          </div>

          <form className="poll-comment-form" onSubmit={handleCommentSubmit}>
            <div className="poll-comment-form-row">
              <input
                type="text"
                className="poll-text-input"
                placeholder="Your Name"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                required
              />
            </div>
            <textarea
              className="poll-textarea"
              placeholder="Share your thoughts, predictions, or ask a question..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            ></textarea>
            <button type="submit" className="poll-btn-comment" disabled={isSubmitting}>
              <i className="fas fa-paper-plane"></i> {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>

          <div className="poll-comment-list">
            {comments.map((c, idx) => (
              <div key={idx} className="poll-comment-wrapper">
                <div className="poll-comment-item">
                  <div className="poll-comment-top">
                    <div className="poll-avatar">{c.name ? c.name.charAt(0).toUpperCase() : '?'}</div>
                    <div className="poll-comment-meta">
                      <div className="poll-comment-author">{c.name}</div>
                      <div className="poll-comment-date">{new Date(c.created_at).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="poll-comment-text">{c.comment}</div>
                </div>
                {c.admin_reply && (
                  <div className="poll-admin-reply">
                    <div className="poll-admin-reply-connector"></div>
                    <div className="poll-admin-reply-card">
                      <div className="poll-admin-reply-header">
                        <div className="poll-admin-avatar">
                          <img src="/landing-assets/images/branding/logo1.png" alt="AME" className="poll-admin-avatar-img" />
                        </div>
                        <div className="poll-admin-identity">
                          <div className="poll-admin-name-row">
                            <span className="poll-admin-name">Admissions Made Easy</span>
                            <span className="poll-admin-tag"><i className="fas fa-check-circle"></i> Official</span>
                          </div>
                          <span className="poll-admin-role">Expert Counsellor</span>
                        </div>
                      </div>
                      <div className="poll-admin-reply-text">{c.admin_reply}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {comments.length === 0 && (
              <div className="poll-empty-comments">
                <i className="far fa-comment-dots"></i>
                <p>No comments yet. Be the first to start the discussion!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
