'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, ArrowRight } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

interface ROICalculatorProps {
  onSendScenarioToAI: (scenarioPrompt: string) => void;
  onStartProject: () => void;
}

export const ROICalculator: React.FC<ROICalculatorProps> = ({
  onSendScenarioToAI,
  onStartProject,
}) => {
  const [teamSize, setTeamSize] = useState<number>(8);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(6);
  const [hourlyRate, setHourlyRate] = useState<number>(35);

  // Conservative 65% automation efficiency reduction
  const weeklyHoursSaved = Math.round(teamSize * hoursPerWeek * 0.65);
  const annualHoursSaved = weeklyHoursSaved * 50;
  const annualDollarsSaved = annualHoursSaved * hourlyRate;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65 }}
      className="rounded-[28px] border border-[rgba(255,255,255,0.12)] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
    >
      <div className="lg:col-span-7 space-y-6">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-[#5CE1E6]">
          <Calculator className="w-4 h-4" />
          <span>WORKFLOW AUTOMATION ROI ESTIMATOR</span>
        </div>

        <h3 className="font-display text-3xl sm:text-4xl text-[#EAF4F8]">
          Calculate the hidden cost of manual spreadsheets &amp; repetitive follow-ups.
        </h3>

        <div className="space-y-5 pt-2">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <label htmlFor="roi-team" className="text-[#b8cdd8]">
                Team members handling repetitive tasks
              </label>
              <span className="font-mono text-[#5CE1E6] font-semibold tabular-nums">
                {teamSize} people
              </span>
            </div>
            <input
              id="roi-team"
              type="range"
              min={1}
              max={50}
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              className="w-full accent-[#5CE1E6] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <label htmlFor="roi-hours" className="text-[#b8cdd8]">
                Manual hours spent per person / week
              </label>
              <span className="font-mono text-[#5CE1E6] font-semibold tabular-nums">
                {hoursPerWeek} hrs / wk
              </span>
            </div>
            <input
              id="roi-hours"
              type="range"
              min={2}
              max={25}
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              className="w-full accent-[#5CE1E6] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <label htmlFor="roi-rate" className="text-[#b8cdd8]">
                Average loaded hourly cost (USD)
              </label>
              <span className="font-mono text-[#5CE1E6] font-semibold tabular-nums">
                ${hourlyRate} / hr
              </span>
            </div>
            <input
              id="roi-rate"
              type="range"
              min={15}
              max={120}
              step={5}
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-full accent-[#5CE1E6] cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 rounded-2xl border border-[#5CE1E6]/30 bg-[#060B14]/85 p-6 sm:p-8 space-y-6">
        <div className="text-xs font-mono text-[#8EA6B4]">
          PROJECTED ANNUAL IMPACT (AT 65% AUTOMATION)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="font-display font-bold text-2xl sm:text-3xl xl:text-4xl text-[#5CE1E6] tabular-nums break-words">
              {annualHoursSaved.toLocaleString()}h
            </div>
            <div className="text-xs text-[#8EA6B4] mt-1">
              Hours Reclaimed / Year
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="font-display font-bold text-2xl sm:text-3xl xl:text-4xl text-[#7A86FF] tabular-nums break-words">
              ${annualDollarsSaved.toLocaleString()}
            </div>
            <div className="text-xs text-[#8EA6B4] mt-1">
              Operational Value Saved
            </div>
          </div>
        </div>

        <p className="text-xs text-[#8EA6B4] leading-relaxed">
          That equals <strong className="text-[#EAF4F8] tabular-nums">{weeklyHoursSaved} hours every week</strong> returned to high-value customer and product growth.
        </p>

        <div className="space-y-2.5 pt-1">
          <MagneticButton
            variant="gradient"
            onClick={() =>
              onSendScenarioToAI(
                `We have a team of ${teamSize} spending ${hoursPerWeek} hours/week each on manual tasks (~$${annualDollarsSaved.toLocaleString()}/year in operational cost). Recommend an Akviora AI + Automation plan to reclaim ${weeklyHoursSaved} hours/week.`
              )
            }
            className="w-full px-5 py-3 sm:px-7 sm:py-3.5 text-sm sm:text-base"
          >
            <span className="sm:hidden">Design ROI Plan with AI</span>
            <span className="hidden sm:inline">
              Design This ROI Plan with Akviora AI
            </span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </MagneticButton>

          <button
            type="button"
            onClick={onStartProject}
            className="w-full py-2.5 text-xs text-[#8EA6B4] hover:text-[#5CE1E6] transition-colors cursor-pointer"
          >
            Or Book a 25-Minute Discovery Call →
          </button>
        </div>
      </div>
    </motion.div>
  );
};
