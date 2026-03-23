export function generateCV(text: string, mode: "professional" | "honest"): string {
  const professionalTemplates = [
    `Demonstrated ability to ${text} while contributing to overall performance outcomes.`,
    `Collaborated effectively to ${text}, enhancing efficiency and results.`,
    `Executed responsibilities related to ${text} in a structured and results-driven manner.`,
  ];

  const honestTemplates = [
    `Basically just ${text} with no real plan.`,
    `Did ${text} because it needed to be done.`,
    `Spent time ${text}, not always efficiently.`,
  ];

  const templates =
    mode === "professional" ? professionalTemplates : honestTemplates;

  return templates[Math.floor(Math.random() * templates.length)];
}
