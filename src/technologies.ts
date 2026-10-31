export type Technology = {
  id: string;
  heading: string;
  supportingText: string;
  introduction: string;
  capabilities: string[];
};

export const technologies: Technology[] = [
  {
    id: "big-data-analytics",
    heading: "Big Data & Analytics",
    supportingText: "Transforming complex streams of data into predictive, preventive, and actionable intelligence.",
    introduction: "CATSMART's big data analytics platform processes sensor and image data to uncover patterns, correlations, and actionable insights.",
    capabilities: [
      "Processing large volumes of sensor and image data",
      "Predictive, preventive, prescriptive, and geospatial analytics",
      "Industrial IoT data processing and reporting",
      "Supporting monitoring and decision-making",
    ],
  },
  {
    id: "optoelectronics",
    heading: "Optoelectronics",
    supportingText: "Converting optical signals into precise, real-time digital intelligence.",
    introduction: "An optoelectronic amplifier with integrated photonic circuits for detecting, conditioning, digitising, and transmitting optical signals.",
    capabilities: [
      "Multichannel optical signal detection",
      "Signal conditioning and processing",
      "High-frequency digitisation",
      "Real-time transmission of digitised data",
    ],
  },
  {
    id: "image-processing",
    heading: "Image Processing",
    supportingText: "Turning visual information into real-time detection, analysis, and alerts.",
    introduction: "Visual monitoring and analysis capabilities examine feeds from multiple camera types to detect activity and provide alerts.",
    capabilities: [
      "Detecting and distinguishing vehicles, pedestrians, animals, and suspicious objects",
      "Analysing feeds from multiple camera types",
      "Real-time detection and alerting",
      "Image enhancement under challenging visibility conditions",
    ],
  },
  {
    id: "sound-processing",
    heading: "Sound Processing",
    supportingText: "Extracting meaningful audio signals from complex environments.",
    introduction: "Sound processing extracts and analyses audio signals from remote locations, including distinguishing voices from environmental noise.",
    capabilities: [
      "Audio signal extraction",
      "Distinguishing human voice from environmental noise",
      "Separating sound components by frequency",
      "Remote audio recording and playback applications",
    ],
  },
  {
    id: "command-control",
    heading: "Command & Control",
    supportingText: "Connecting detection, intelligence, and coordinated response.",
    introduction: "Command and control integrates monitoring technologies with alert and response systems for geospatial awareness and coordinated action.",
    capabilities: [
      "Real-time alerts and alarms",
      "Geospatial monitoring and threat awareness",
      "Integration with building and communication systems",
      "Configurable notifications and response mechanisms",
    ],
  },
  {
    id: "research-customisation",
    heading: "Research & Customisation",
    supportingText: "Developing specialised technologies for challenges beyond conventional solutions.",
    introduction: "CATS researches and develops photonics and specialised monitoring technologies, adapting systems for application-specific requirements.",
    capabilities: [
      "Photonic system research and development",
      "Optical sensing and signal processing",
      "Customisation for application-specific requirements",
      "Exploring new industrial and monitoring applications",
    ],
  },
];