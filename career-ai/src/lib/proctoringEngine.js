import { supabase } from './supabase';

/**
 * ProctoringEngine handles browser-based monitoring.
 * It tracks fullscreen, tab visibility, right-click, and copy-paste events.
 */
class ProctoringEngine {
  constructor(candidateId, onViolation = null) {
    this.candidateId = candidateId;
    this.onViolation = onViolation;
    this.isTracking = false;
    this.events = [];
    this.riskLevel = 'Low';
    
    // Bind methods
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleFullscreenChange = this.handleFullscreenChange.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  start() {
    if (this.isTracking) return;
    this.isTracking = true;
    this.events = [];
    this.logEvent('Info', 'Test Started and Proctoring Activated.');

    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    document.addEventListener('fullscreenchange', this.handleFullscreenChange);
    document.addEventListener('contextmenu', this.handleContextMenu);
    document.addEventListener('copy', this.handleCopy);
    document.addEventListener('paste', this.handlePaste);
    window.addEventListener('blur', this.handleBlur);
  }

  stop() {
    this.isTracking = false;
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('contextmenu', this.handleContextMenu);
    document.removeEventListener('copy', this.handleCopy);
    document.removeEventListener('paste', this.handlePaste);
    window.removeEventListener('blur', this.handleBlur);
    this.logEvent('Info', 'Test Submitted. Proctoring Deactivated.');
  }

  async logEvent(type, description) {
    if (!this.candidateId) return;
    
    const event = {
      assessment_candidate_id: this.candidateId,
      event_type: type,
      description: description,
      timestamp: new Date().toISOString()
    };
    
    this.events.push(event);
    console.log(`[Proctoring] ${type}: ${description}`);

    if (type !== 'Info' && this.onViolation) {
      this.onViolation(description, type);
    }

    try {
      await supabase.from('proctoring_events').insert(event);
      await this.evaluateRisk();
    } catch (err) {
      console.error('Failed to log proctoring event', err);
    }
  }

  async evaluateRisk() {
    let warningCount = this.events.filter(e => e.event_type !== 'Info').length;
    let newRisk = 'Low';
    
    const hasWindowBlur = this.events.some(e => e.event_type === 'WindowBlurred');
    
    if (warningCount >= 2 && warningCount < 5) newRisk = 'Medium';
    if (warningCount >= 5 || hasWindowBlur) newRisk = 'High';

    if (newRisk !== this.riskLevel) {
      this.riskLevel = newRisk;
      try {
        await supabase
          .from('assessment_candidates')
          .update({ risk_level: newRisk })
          .eq('id', this.candidateId);
      } catch (err) {
        console.error('Failed to update risk level', err);
      }
    }
  }

  // --- Event Handlers ---

  handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      this.logEvent('TabSwitched', 'Candidate switched tabs or minimized the browser.');
    }
  }

  handleFullscreenChange() {
    if (!document.fullscreenElement) {
      this.logEvent('FullscreenExited', 'Candidate exited full-screen mode.');
    }
  }

  handleContextMenu(e) {
    e.preventDefault();
    // Too noisy to log every right click, but we block it.
  }

  handleCopy(e) {
    e.preventDefault();
    this.logEvent('CopyAttempt', 'Candidate attempted to copy content.');
  }

  handlePaste(e) {
    e.preventDefault();
    this.logEvent('PasteAttempt', 'Candidate attempted to paste content.');
  }

  handleBlur() {
    this.logEvent('WindowBlurred', 'Browser window lost focus. Candidate might have opened another application.');
  }
}

export default ProctoringEngine;
