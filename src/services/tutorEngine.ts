/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ADIEvaluation, SimulationTrial } from '../types/timadi';

export class TutorEngine {
  /**
   * Evaluates student's Claim, Evidence, and Reasoning (CER) using
   * the Argument-Driven Inquiry (ADI) Rubric for Grade 10 Science.
   */
  static async evaluateArgument(params: {
    claim: string;
    evidence: string;
    reasoning: string;
    guidingQuestion: string;
    loggedData: SimulationTrial[];
  }): Promise<ADIEvaluation> {
    const { claim, evidence, reasoning, guidingQuestion, loggedData } = params;

    // Try server-side Gemini API first
    try {
      const res = await fetch('/api/tutor/evaluate-argument', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim, evidence, reasoning, guidingQuestion, loggedData }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.evaluation) {
          return json.evaluation;
        }
      }
    } catch {
      // Server not reachable or offline; proceed to local heuristic engine
    }

    // Comprehensive rule-based pedagogical evaluation engine
    return this.evaluateLocally(claim, evidence, reasoning, loggedData);
  }

  private static evaluateLocally(
    claim: string,
    evidence: string,
    reasoning: string,
    loggedData: SimulationTrial[]
  ): ADIEvaluation {
    const lowerClaim = claim.toLowerCase().trim();
    const lowerEvidence = evidence.toLowerCase().trim();
    const lowerReasoning = reasoning.toLowerCase().trim();

    const detectedMisconceptions: string[] = [];
    const actionableTips: string[] = [];

    // --- 1. Evaluate Claim (1 to 4) ---
    let claimScore = 1;
    let claimFeedback = '';

    const hasInverse =
      lowerClaim.includes('invers') ||
      lowerClaim.includes('opposite') ||
      (lowerClaim.includes('decreas') && lowerClaim.includes('increas')) ||
      (lowerClaim.includes('doubl') && lowerClaim.includes('hal'));
    const hasVariables =
      (lowerClaim.includes('volume') || lowerClaim.includes('size') || lowerClaim.includes('space')) &&
      (lowerClaim.includes('pressure') || lowerClaim.includes('force'));
    const mentionsConstantT =
      lowerClaim.includes('constant temperature') ||
      lowerClaim.includes('temperature is constant') ||
      lowerClaim.includes('same temperature') ||
      lowerClaim.includes('fixed temperature');

    if (!claim || claim.length < 10) {
      claimScore = 1;
      claimFeedback = 'Your claim is too brief. State clearly how pressure changes when volume changes at constant temperature.';
      actionableTips.push('Draft a complete sentence: "When temperature is held constant, as the volume decreases, the pressure..."');
    } else if (hasInverse && hasVariables && mentionsConstantT) {
      claimScore = 4;
      claimFeedback = 'Exemplary claim! You accurately specified the inverse relationship between volume and pressure under constant temperature.';
    } else if (hasInverse && hasVariables) {
      claimScore = 3;
      claimFeedback = 'Proficient claim! You accurately identified the inverse relationship. To make it exemplary, explicitly mention that temperature must be kept constant.';
      actionableTips.push('Add the condition: "at a constant temperature and fixed amount of gas".');
    } else if (hasVariables) {
      claimScore = 2;
      claimFeedback = 'Developing claim. You mentioned the variables, but did not clearly express whether they increase or decrease together, or move inversely.';
      actionableTips.push('Clarify whether pressure goes up or down when volume is reduced.');
    } else {
      claimScore = 1;
      claimFeedback = 'Incomplete claim. Be sure your statement answers the guiding question directly using the terms volume and pressure.';
    }

    // Check for direct relationship misconception in claim
    if (
      (lowerClaim.includes('increase') && lowerClaim.includes('both increase')) ||
      (lowerClaim.includes('directly proportional') && !lowerClaim.includes('inverse'))
    ) {
      detectedMisconceptions.push('Misconception: Pressure and volume do not increase together in a closed gas at constant temperature; they are inversely related.');
    }

    // --- 2. Evaluate Evidence (1 to 4) ---
    let evidenceScore = 1;
    let evidenceFeedback = '';

    const hasNumbers = /\d+/.test(evidence);
    const mentionsUnits =
      lowerEvidence.includes('kpa') ||
      lowerEvidence.includes('l') ||
      lowerEvidence.includes('liters') ||
      lowerEvidence.includes('atm') ||
      lowerEvidence.includes('n/m');
    const mentionsProductOrTable =
      lowerEvidence.includes('trial') ||
      lowerEvidence.includes('product') ||
      lowerEvidence.includes('p*v') ||
      lowerEvidence.includes('p x v') ||
      lowerEvidence.includes('constant') ||
      lowerEvidence.includes('multiply') ||
      lowerEvidence.includes('table');

    if (!evidence || evidence.length < 15) {
      evidenceScore = 1;
      evidenceFeedback = 'Minimal evidence provided. Cite specific numerical data from your virtual gas chamber simulation trials.';
      actionableTips.push('Include specific trial values: e.g., "At V = 4.0 L, P was 25 kPa; when compressed to 2.0 L, P rose to 50 kPa".');
    } else if (hasNumbers && mentionsUnits && mentionsProductOrTable) {
      evidenceScore = 4;
      evidenceFeedback = 'Exemplary evidence! You provided precise numerical values with scientific units and demonstrated that the product P · V remained constant across trials.';
    } else if (hasNumbers && (mentionsUnits || mentionsProductOrTable)) {
      evidenceScore = 3;
      evidenceFeedback = 'Proficient evidence. You cited quantitative simulation data. Show how the product of P and V remains constant (~constant k).';
      actionableTips.push('Calculate P × V for two trials to prove the product remains constant.');
    } else if (hasNumbers || lowerEvidence.includes('increased') || lowerEvidence.includes('decreased')) {
      evidenceScore = 2;
      evidenceFeedback = 'Developing evidence. You gave general observations, but scientific arguments require explicit numerical readings with units (L and kPa).';
      actionableTips.push('Use the "Insert Simulation Data" button or cite exact numbers from your logged trials.');
    } else {
      evidenceScore = 1;
      evidenceFeedback = 'Evidence lacks quantitative backing. Provide concrete observations and recorded data points from your experiment.';
    }

    // --- 3. Evaluate Reasoning (1 to 4) ---
    let reasoningScore = 1;
    let reasoningFeedback = '';

    const mentionsKineticOrParticles =
      lowerReasoning.includes('particle') ||
      lowerReasoning.includes('molecule') ||
      lowerReasoning.includes('atom') ||
      lowerReasoning.includes('kinetic') ||
      lowerReasoning.includes('matter');
    const mentionsCollisions =
      lowerReasoning.includes('collis') ||
      lowerReasoning.includes('hit') ||
      lowerReasoning.includes('strike') ||
      lowerReasoning.includes('bounce') ||
      lowerReasoning.includes('impact');
    const mentionsWallOrArea =
      lowerReasoning.includes('wall') ||
      lowerReasoning.includes('area') ||
      lowerReasoning.includes('container') ||
      lowerReasoning.includes('space') ||
      lowerReasoning.includes('crowded') ||
      lowerReasoning.includes('frequency');

    // Check for common Kinetic Molecular misconceptions
    if (lowerReasoning.includes('particle grow') || lowerReasoning.includes('particles shrink') || lowerReasoning.includes('molecules get smaller')) {
      detectedMisconceptions.push('Misconception: Gas molecules themselves do not change size when compressed! Gas particles have fixed size; only the empty distance between them decreases.');
    }
    if (lowerReasoning.includes('particles move faster') && !lowerReasoning.includes('constant temperature')) {
      detectedMisconceptions.push('Misconception: At constant temperature (298 K), gas particles do NOT speed up! Their average speed stays identical. Pressure rises solely because molecules hit walls more frequently in a smaller volume.');
    }

    if (!reasoning || reasoning.length < 20) {
      reasoningScore = 1;
      reasoningFeedback = 'Reasoning is insufficient. Connect your evidence to Kinetic Molecular Theory: why does compressing gas raise pressure?';
      actionableTips.push('Explain what happens to the gas particles and their collisions with the container walls when volume shrinks.');
    } else if (mentionsKineticOrParticles && mentionsCollisions && mentionsWallOrArea) {
      reasoningScore = 4;
      reasoningFeedback = 'Exemplary reasoning! You correctly invoked Kinetic Molecular Theory, explaining that reduced volume leaves less room between walls, increasing collision frequency per unit area.';
    } else if (mentionsKineticOrParticles && mentionsCollisions) {
      reasoningScore = 3;
      reasoningFeedback = 'Proficient reasoning. You discussed particles and collisions. Emphasize that higher collision frequency per unit area of the cylinder wall generates higher pressure.';
      actionableTips.push('Explain that pressure is Force divided by Area (P = F/A), so more frequent wall collisions produce greater pressure.');
    } else if (mentionsKineticOrParticles || mentionsCollisions) {
      reasoningScore = 2;
      reasoningFeedback = 'Developing reasoning. You mentioned molecular concepts, but need to bridge the gap between microscopic particle collisions and macroscopic pressure.';
      actionableTips.push('Recall: Gas pressure is caused by particles colliding against the inside walls of the chamber.');
    } else {
      reasoningScore = 1;
      reasoningFeedback = 'Missing scientific principles. Reasoning must explain WHY the observed data occurred using Kinetic Molecular Theory, not just repeat the claim.';
    }

    const totalRaw = claimScore + evidenceScore + reasoningScore;
    const overallScore = Math.max(1, Math.min(4, Math.round(totalRaw / 3)));

    let levelLabel: 'Beginning' | 'Developing' | 'Proficient' | 'Exemplary' = 'Developing';
    if (totalRaw >= 11) levelLabel = 'Exemplary';
    else if (totalRaw >= 8) levelLabel = 'Proficient';
    else if (totalRaw >= 5) levelLabel = 'Developing';
    else levelLabel = 'Beginning';

    let praise = 'Great scientific inquiry effort!';
    if (levelLabel === 'Exemplary') {
      praise = 'Outstanding work, scientist! Your argument demonstrates rigorous claim formulation, quantitative evidence citation, and microscopic kinetic justification.';
    } else if (levelLabel === 'Proficient') {
      praise = 'Strong scientific argument! With a few minor refinements to your reasoning or unit citations, your argument will be exemplary.';
    } else if (levelLabel === 'Developing') {
      praise = 'Good initial start. You have the core idea down. Follow the action tips below to strengthen your scientific backing!';
    } else {
      praise = 'Every great chemist begins with initial hypotheses. Review the simulation data and refine each section using the suggested prompts!';
    }

    return {
      overallScore,
      levelLabel,
      claimScore,
      claimFeedback,
      evidenceScore,
      evidenceFeedback,
      reasoningScore,
      reasoningFeedback,
      detectedMisconceptions,
      actionableTips,
      praise,
    };
  }

  /**
   * Socratic response generator for intelligent in-lesson tutoring chat
   */
  static async getTutorChatReply(params: {
    studentMessage: string;
    phaseName: string;
    contextSummary: string;
  }): Promise<string> {
    const { studentMessage, phaseName, contextSummary } = params;

    // Try server API first
    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: studentMessage, context: { phaseName, contextSummary } }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.reply) return json.reply;
      }
    } catch {
      // offline fallback
    }

    const lower = studentMessage.toLowerCase();

    if (lower.includes('formula') || lower.includes('equation')) {
      return "Boyle's Law equation is P₁V₁ = P₂V₂ (at constant temperature and fixed mass of gas). This means the product of initial pressure and initial volume equals the product of final pressure and final volume!";
    }
    if (lower.includes('misconception') || lower.includes('speed') || lower.includes('faster')) {
      return "Remember this vital Grade 10 concept: temperature determines the average kinetic energy and speed of gas particles. If temperature is constant (298 K), the particles move at the exact same average speed! Pressure increases because they have less distance to travel, hitting the walls more times every second.";
    }
    if (lower.includes('scuba') || lower.includes('diver') || lower.includes('bends')) {
      return "As a diver descends, water pressure increases dramatically (by 1 atm every 10 meters!). Gas in the diver's lungs and buoyancy compensator compresses. When surfacing, the ambient pressure drops, causing bubbles to expand! That is why divers must exhale and surface slowly.";
    }
    if (lower.includes('graph') || lower.includes('curve') || lower.includes('hyperbola')) {
      return "When graphing P vs V, you obtain a smooth descending hyperbolic curve (an inverse curve). But if you graph P vs 1/V (pressure versus reciprocal of volume), you get a crisp straight line passing through the origin!";
    }
    if (lower.includes('guiding question') || lower.includes('question')) {
      return 'Our guiding inquiry question is: "If temperature is held constant, what is the relationship between volume and pressure?" Use your simulation data to prove your answer!';
    }
    if (lower.includes('help') || lower.includes('stuck') || lower.includes('what should i do')) {
      return `Right now we are in the "${phaseName}" phase! Explore the interactive tools, record your observations, and notice how the pressure meter reacts whenever the piston moves. What happens when you cut the volume in half?`;
    }

    return `That's an interesting question about ${phaseName}! In Boyle's Law, always ask yourself: what is happening to the gas particles inside that closed space? How often are they colliding with the cylinder walls?`;
  }
}
