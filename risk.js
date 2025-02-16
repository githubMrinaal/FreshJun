document.addEventListener("DOMContentLoaded", function () {
    // Get elements
    const diseasesList = document.querySelectorAll(".types-of-diseases"); // Count diseases
    const airRateElement = document.querySelector(".air-rate");
    const sanitationElement = document.querySelector(".Percent-Sanitation");
    const riskLevelElement = document.querySelector(".loading");

    // Extract values
    const numDiseases = diseasesList.length; // Count number of listed diseases
    const airPollutionRate = parseFloat(airRateElement.textContent) || 0; // Convert air pollution to number
    const sanitationPercent = parseFloat(sanitationElement.textContent) || 100; // Convert sanitation to number

    // Risk Calculation (adjust thresholds as needed)
    let riskScore = 0;
    
    if (numDiseases > 3) riskScore += 3;
    else if (numDiseases > 1) riskScore += 2;
    else riskScore += 1;

    if (airPollutionRate > 50) riskScore += 3;
    else if (airPollutionRate > 20) riskScore += 2;
    else riskScore += 1;

    if (sanitationPercent < 50) riskScore += 3;
    else if (sanitationPercent < 80) riskScore += 2;
    else riskScore += 1;

    // Determine risk level
    let riskLevel;
    if (riskScore >= 7) {
        riskLevel = "High Risk 🚨";
        riskLevelElement.style.color = "red";
    } else if (riskScore >= 4) {
        riskLevel = "Medium Risk ⚠️";
        riskLevelElement.style.color = "orange";
    } else {
        riskLevel = "Low Risk ✅";
        riskLevelElement.style.color = "green";
    }

    // Update the UI
    riskLevelElement.textContent = riskLevel;
});
