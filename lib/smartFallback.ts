const conceptMap = [
    { match: ["homework", "assignment", "studying", "study"], concept: "explaining academic concepts and supporting coursework", category: "academic" },
    { match: ["slides", "presentation", "deck", "powerpoint"], concept: "preparing presentation materials", category: "creative" },
    { match: ["instagram", "social media", "posts", "content"], concept: "managing social media content", category: "marketing" },
    { match: ["event", "venue", "logistics", "planning"], concept: "coordinating event logistics", category: "operations" },
    { match: ["emails", "email", "replied", "follow-up", "follow up"], concept: "handling communication and follow-ups", category: "communication" },
    { match: ["team", "group project", "group work", "collaborated"], concept: "coordinating teamwork and shared deliverables", category: "teamwork" },
];

const patterns = {
    academic: {
        pro: [
            "Spearheaded peer learning initiatives related to {concept}, significantly enhancing comprehension and problem-solving performance.",
            "Orchestrated academic research frameworks for {concept}, driving optimized educational outcomes and cross-functional alignment.",
            "Facilitated rigorous analytical reviews of {concept}, leveraging strategic insights to maximize overall academic success."
        ],
        honest: [
            "Explained the material because they had no clue.",
            "Did the assignment so we wouldn't fail.",
            "Carried the whole study session myself."
        ]
    },
    creative: {
        pro: [
            "Engineered comprehensive visual assets for {concept}, optimizing stakeholder engagement and driving core conceptual delivery.",
            "Spearheaded creative strategy focused on {concept}, leveraging dynamic design principles to maximize audience impact.",
            "Orchestrated cross-functional content alignment for {concept}, elevating the overarching narrative and presentation quality."
        ],
        honest: [
            "Made slides and hoped the design distracted them.",
            "Put the deck together at the last minute.",
            "Clicked around until it looked barely acceptable."
        ]
    },
    marketing: {
        pro: [
            "Spearheaded digital content strategies for {concept}, driving optimized user acquisition and overarching brand engagement.",
            "Leveraged dynamic media insights to orchestrate {concept}, significantly enhancing cross-platform visibility and market penetration.",
            "Optimized omnichannel marketing campaigns centered on {concept}, facilitating scalable growth and measurable performance uplifts."
        ],
        honest: [
            "Posted content and tried to make it look intentional.",
            "Ran the social account because nobody else would.",
            "Made up hashtags and hoped they worked out."
        ]
    },
    operations: {
        pro: [
            "Orchestrated complex logistical frameworks for {concept}, facilitating streamlined execution and mitigating cross-functional operational risks.",
            "Spearheaded event coordination efforts regarding {concept}, optimizing resource allocation and driving successful strategic outcomes.",
            "Leveraged robust planning methodologies for {concept}, ensuring flawless delivery across dynamic operational environments."
        ],
        honest: [
            "Organized logistics and just hoped people showed up.",
            "Ran around making sure the event didn't collapse.",
            "Pretended to have a master plan the whole time."
        ]
    },
    communication: {
        pro: [
            "Facilitated critical stakeholder correspondence for {concept}, optimizing information flow and driving robust organizational alignment.",
            "Spearheaded internal communication channels regarding {concept}, leveraging highly structured protocols to enhance response efficiency.",
            "Orchestrated cross-functional dialogue strategies for {concept}, cementing strategic relationships and ensuring operational clarity."
        ],
        honest: [
            "Answered emails so people would leave me alone.",
            "Read a lot of messages and sent some back.",
            "Used big words to sound professional in replies."
        ]
    },
    teamwork: {
        pro: [
            "Spearheaded cross-functional team initiatives for {concept}, driving synergetic alignment and maximizing collective project deliverables.",
            "Orchestrated cooperative frameworks addressing {concept}, leveraging diverse competencies to enhance overall performance outcomes.",
            "Facilitated strategic group alignment on {concept}, optimizing workflow efficiencies within a dynamic professional setting."
        ],
        honest: [
            "Basically did the work for them.",
            "Carried the entire team project myself.",
            "Did most of it because they had no clue."
        ]
    },
    generic: {
        pro: [
            "Spearheaded strategic execution of {concept}, driving optimized performance and ensuring rigorous alignment with core objectives.",
            "Orchestrated cross-functional efforts focused on {concept}, leveraging robust methodologies to deliver high-impact operational results.",
            "Facilitated comprehensive delivery models for {concept}, maximizing efficiency and significantly enhancing overarching process frameworks."
        ],
        honest: [
            "Did it last minute and hoped it worked.",
            "Basically just did {concept} with no real plan.",
            "Completed it because it just needed to be done."
        ]
    }
};

export function generateSmartFallback(text: string) {
    let cleaned = text.trim().toLowerCase().replace(/[.,!?;]+$/, '');
    cleaned = cleaned.replace(/\s+/g, ' ');

    const weakStarters = ["i just ", "basically ", "kind of ", "sort of ", "just ", "only ", "i ", "my ", "helped ", "did ", "worked on ", "handled ", "managed ", "was "];

    let modified = true;
    while (modified) {
        modified = false;
        for (const starter of weakStarters) {
            if (cleaned.startsWith(starter)) {
                cleaned = cleaned.substring(starter.length).trim();
                modified = true;
            }
        }
    }

    cleaned = cleaned || "assigned tasks";

    let detectedCategory = "generic";
    let finalConcept = cleaned;

    for (const mapping of conceptMap) {
        if (mapping.match.some(keyword => cleaned.includes(keyword))) {
            detectedCategory = mapping.category;
            finalConcept = mapping.concept;
            break;
        }
    }

    const catPatterns = patterns[detectedCategory as keyof typeof patterns];

    const proTemplate = catPatterns.pro[Math.floor(Math.random() * catPatterns.pro.length)];
    const honestTemplate = catPatterns.honest[Math.floor(Math.random() * catPatterns.honest.length)];

    const professional = proTemplate.replace("{concept}", finalConcept);
    const honest = honestTemplate.replace("{concept}", finalConcept);

    return {
        professional: professional.charAt(0).toUpperCase() + professional.slice(1),
        honest: honest.charAt(0).toUpperCase() + honest.slice(1),
        source: "smart-fallback"
    };
}
