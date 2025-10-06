
// src/lib/insurance-config.ts

/**
 * Defines the structure for the government scheme configuration.
 */
type GovernmentSchemeConfig = {
  apiUrl: string;
  schemeName: string;
  maxSubsidy: number;
  incomeThreshold: number;
  highRiskZones: string[];
  vulnerableGroups: string[];
};

/**
 * Defines the structure for premium calculation settings.
 */
type PremiumCalculationConfig = {
  baseRate: number;
  riskFactors: {
    locationRisk: number;
    constructionType: number;
    fireSafetyMeasures: number;
    previousClaims: number;
  };
};

/**
 * Defines the structure for damage assessment weights and thresholds.
 */
type DamageAssessmentConfig = {
  sensorWeight: number;
  satelliteWeight: number;
  visualWeight: number;
  minConfidenceThreshold: number;
};

/**
 * The main insurance configuration type, combining all sub-configurations.
 */
export type InsuranceConfig = {
  governmentScheme: GovernmentSchemeConfig;
  premiumCalculation: PremiumCalculationConfig;
  damageAssessment: DamageAssessmentConfig;
};

/**
 * The application's configuration for insurance-related features.
 * This object is based on the Python configuration provided.
 */
export const insuranceConfig: InsuranceConfig = {
  governmentScheme: {
    apiUrl: "https://gov-insurance-api.example.com",
    schemeName: "National Fire Protection Scheme",
    maxSubsidy: 0.5, // 50% maximum subsidy
    incomeThreshold: 50000,
    highRiskZones: ["wildland_urban_interface", "industrial_areas"],
    vulnerableGroups: ["low_income", "seniors", "disabled"],
  },
  premiumCalculation: {
    baseRate: 1000,
    riskFactors: {
      locationRisk: 0.3,
      constructionType: 0.25,
      fireSafetyMeasures: -0.2, // Negative for safety features
      previousClaims: 0.15,
    },
  },
  damageAssessment: {
    sensorWeight: 0.4,
    satelliteWeight: 0.4,
    visualWeight: 0.2,
    minConfidenceThreshold: 0.7,
  },
};
