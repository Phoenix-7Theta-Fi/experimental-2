import React from "react";

interface AssessmentReportProps {
  report: {
    summary: string;
    recommendations: string[];
    riskFactors: string[];
  };
}

export default function AssessmentReport({ report }: AssessmentReportProps) {
  if (!report || !report.summary || !report.recommendations || !report.riskFactors) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-[#1E293B] rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Health Assessment Error</h3>
        <p className="text-gray-200">
          Unable to generate health assessment report. Please try again or contact support if the issue persists.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#1E293B] rounded-lg p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Health Assessment Report</h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="text-blue-400 text-sm font-medium mb-2">Summary</h4>
          <p className="text-gray-200">{report.summary}</p>
        </div>

        <div>
          <h4 className="text-blue-400 text-sm font-medium mb-2">Recommendations</h4>
          <ul className="list-disc list-inside space-y-1">
            {(report.recommendations || []).map((recommendation, index) => (
              <li key={index} className="text-gray-200">{recommendation}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-blue-400 text-sm font-medium mb-2">Risk Factors</h4>
          <ul className="list-disc list-inside space-y-1">
            {(report.riskFactors || []).map((risk, index) => (
              <li key={index} className="text-gray-200">{risk}</li>
            ))}
          </ul>
        </div>

        <div className="pt-4 border-t border-gray-600">
          <p className="text-sm text-gray-400">
            Note: This assessment is for informational purposes only and should not replace professional medical advice. Please consult with a healthcare provider for a comprehensive evaluation.
          </p>
        </div>
      </div>
    </div>
  );
}
