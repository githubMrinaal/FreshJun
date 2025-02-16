document.addEventListener("DOMContentLoaded", function () {
    const config = {
        diseaseThresholds: [1, 3],
        airPollutionThresholds: [20, 50],
        sanitationThresholds: [50, 80],
        riskLevels: [
            { score: 7, level: "High Risk", color: "red" },
            { score: 4, level: "Medium Risk", color: "orange" },
            { score: 0, level: "Low Risk", color: "green" }
        ]
    };

    const elements = {
        diseaseList: document.querySelectorAll(".Disease-List"), // Count disease list items
        airRateElement: document.querySelector(".air-rate"),
        sanitationElement: document.querySelector(".Percent-Sanitation"),
        riskLevelElement: document.querySelector(".loading")
    };

    const values = {
        numDiseases: elements.diseaseList.length, // Count number of diseases
        airPollutionRate: parseFloat(elements.airRateElement.textContent) || 0,
        sanitationPercent: parseFloat(elements.sanitationElement.textContent) || 100
    };

    const riskScore = calculateRiskScore(values, config);
    const riskLevel = determineRiskLevel(riskScore, config.riskLevels);

    updateRiskLevelUI(elements.riskLevelElement, riskLevel);
});

function calculateRiskScore(values, config) {
    let score = 0;

    score += calculateCategoryScore(values.numDiseases, config.diseaseThresholds);
    score += calculateCategoryScore(values.airPollutionRate, config.airPollutionThresholds);
    score += calculateCategoryScore(values.sanitationPercent, config.sanitationThresholds, true);

    return score;
}

function calculateCategoryScore(value, thresholds, isReverse = false) {
    if (isReverse) {
        if (value < thresholds[0]) return 3;
        if (value < thresholds[1]) return 2;
        return 1;
    } else {
        if (value > thresholds[1]) return 3;
        if (value > thresholds[0]) return 2;
        return 1;
    }
}

function determineRiskLevel(score, riskLevels) {
    for (const level of riskLevels) {
        if (score >= level.score) {
            return level;
        }
    }
    return riskLevels[riskLevels.length - 1]; // Default to lowest risk
}

function updateRiskLevelUI(element, riskLevel) {
    element.textContent = riskLevel.level;
    element.style.color = riskLevel.color;
}