export type SoftwareProduct = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: {
    src: string;
    width: number;
    height: number;
  };
  route: string;
  displayOrder: number;
  enabled: boolean;
};

type DescribedItem = { title: string; description: string };
type WorkflowStep = string | DescribedItem;
type ContentItem = string | DescribedItem;

export type SoftwareDetail = {
  heroTagline?: string;
  overviewHeading?: string;
  overview: string | string[];
  audienceHeading?: string;
  audience?: ContentItem[];
  capabilitiesHeading?: string;
  features?: DescribedItem[];
  workflowHeading?: string;
  workflowIntroduction?: string | string[];
  workflow?: WorkflowStep[];
  applicationsHeading?: string;
  applications?: ContentItem[];
  benefits?: ContentItem[];
  introduction: string;
};

export const softwareLoginRoute: string | null = "https://catsmart.io/";

export const softwareProducts: SoftwareProduct[] = [
  {
    id: "sangrah",
    name: "Sangrah",
    tagline: "Every signal has a story. Sangrah makes it measurable.",
    description: "A centralized platform for sensor management, calibration, trials, signal analysis, and reporting.",
    image: { src: "/images/software/sangrah.webp", width: 1400, height: 934 },
    route: "/software/sangrah",
    displayOrder: 6,
    enabled: true,
  },
  {
    id: "vidur-raksha",
    name: "VIDUR Raksha",
    tagline: "Know your assets before they tell you something's wrong.",
    description: "An enterprise asset health intelligence platform for structural monitoring, condition assessment, risk analysis, and predictive maintenance.",
    image: { src: "/images/software/vidur-raksha.webp", width: 1400, height: 934 },
    route: "/software/vidur-raksha",
    displayOrder: 3,
    enabled: true,
  },
  {
    id: "sarathi",
    name: "Sarathi",
    tagline: "Complex operations. One clearer picture.",
    description: "A platform for operational monitoring, visibility, and coordinated management.",
    image: { src: "/images/software/sarathi.webp", width: 1400, height: 788 },
    route: "/software/sarathi",
    displayOrder: 1,
    enabled: true,
  },
  {
    id: "samveda",
    name: "Samveda",
    tagline: "Intelligence begins where the data is born.",
    description: "Edge-based monitoring and connected intelligence for industrial applications.",
    image: { src: "/images/software/samveda.webp", width: 1400, height: 788 },
    route: "/software/samveda",
    displayOrder: 5,
    enabled: true,
  },
  {
    id: "bodhi-ai",
    name: "Bodhi.ai",
    tagline: "Less searching. Less switching. Just ask.",
    description: "An AI-powered workplace operating system that connects tools, automates workflows, and provides information through natural-language conversations.",
    image: { src: "/images/software/bodhi-ai.webp", width: 1400, height: 788 },
    route: "/software/bodhi-ai",
    displayOrder: 2,
    enabled: true,
  },
  {
    id: "trinetra",
    name: "Trinetra",
    tagline: "The AI that never blinks.",
    description: "Trinetra transforms existing CCTV cameras into intelligent industrial safety monitoring systems. With on-site edge AI, it detects safety violations, monitors restricted zones, and delivers real-time alerts without depending on continuous internet connectivity.",
    image: { src: "/images/software/trinetra.webp", width: 1400, height: 934 },
    route: "/software/trinetra",
    displayOrder: 4,
    enabled: true,
  },
];

export const softwareDetails: Record<string, SoftwareDetail> = {
  sangrah: {
    heroTagline: "Manage, simulate, and analyse sensor data — all in one place.",
    overviewHeading: "From sensor setup to analysis, all in one platform.",
    introduction: "Bring sensor registration, calibration, trials, signal processing, and reporting into one place.",
    overview: [
      "Sangrah is a sensor management, trial execution, and data analysis platform that brings the complete measurement workflow into one system.",
      "From maintaining a catalogue of sensors and devices to configuring trials, performing calibrations, capturing measurements, and analysing results, Sangrah helps teams manage every stage of sensor testing in an organised environment.",
      "With structured trial records, reusable configurations, data visualisations, and report generation, Sangrah makes it easier to track experiments, compare results, and maintain a reliable history of sensor performance.",
    ],
    audienceHeading: "Teams working with sensors and trials",
    capabilitiesHeading: "Manage every stage of sensor testing.",
    workflowHeading: "From Input to Insight.",
    workflowIntroduction: "From device setup to documented results.",
    audience: ["Sensor engineers", "R&D teams", "Technicians", "Technical managers"],
    features: [
      { title: "Device catalogue", description: "Maintain a centralized catalogue of sensors and devices." },
      { title: "Trial management", description: "Organize trials with a structured, repeatable process." },
      { title: "Calibration workflows", description: "Manage calibration as part of sensor operations." },
      { title: "Gas analysis trials", description: "Support gas analysis within trial workflows." },
      { title: "Signal analysis", description: "Process and visualize captured signals." },
      { title: "Reports and access", description: "Generate reports with role-based access." },
    ],
    workflow: ["Register devices", "Configure trials", "Connect sensors", "Execute and calibrate", "Analyse data", "Generate reports"],
    benefits: ["Keep sensor information in one place", "Bring trial and calibration steps into a structured workflow", "Make signal analysis and reporting part of the same process"],
  },
  "vidur-raksha": {
    heroTagline: "Detect the changes you can't see.",
    overviewHeading: "Understand your assets beyond what meets the eye.",
    introduction: "From bridges and buildings to industrial machinery and transport infrastructure, VIDUR Raksha helps teams assess asset condition through sensor-based trials, track changes over time, and identify potential problems before they develop into major failures.",
    overview: [
      "VIDUR Raksha is an enterprise asset health intelligence platform for structural health monitoring, condition monitoring, quality assurance, and predictive maintenance.",
      "Working with laser-based sensing devices and compatible monitoring systems, the platform helps teams conduct measurement trials, analyse asset behaviour, and maintain structured condition records for individual components and entire assets.",
      "Each trial adds information to an asset's history. By comparing measurements taken at different points and across repeated inspections, teams can understand how an asset is performing, identify unusual changes, and assess whether its condition is stable or deteriorating.",
      "From a single structural component to an entire infrastructure network, VIDUR Raksha brings inspection results, historical trends, asset locations, and reports into one organised system.",
    ],
    audienceHeading: "Built for the Teams Responsible for Asset Health",
    audience: [
      { title: "Infrastructure & Asset Management Teams", description: "Maintain visibility into asset condition, inspection histories, and areas requiring attention across infrastructure portfolios." },
      { title: "Inspection & Field Engineering Teams", description: "Access assigned trials, locate assets, capture measurements, and organise inspection results through a structured workflow." },
      { title: "Operations & Maintenance Teams", description: "Use condition trends and inspection findings to help prioritise maintenance activities and investigate emerging problems." },
      { title: "Quality Assurance & Asset Integrity Teams", description: "Review measurement results, maintain documented inspection histories, and support condition assessments and quality verification." },
    ],
    capabilitiesHeading: "A clearer view of asset health.",
    features: [
      { title: "Laser-Based Measurement & Trials", description: "Conduct non-contact measurement trials using compatible laser-based sensing devices. Capture vibration, movement, and structural response data to help assess the condition of specific assets and components." },
      { title: "Asset & Component Registry", description: "Organise assets into sites, divisions, individual assets, and components. Maintain structured records that connect inspection results to the exact locations and components being assessed." },
      { title: "GPS-Mapped Asset Navigation", description: "View geo-tagged assets on an interactive map, identify their locations, and help field teams navigate to assigned inspection sites." },
      { title: "Trial Planning & Team Assignment", description: "Create inspection projects, select assets and components, schedule trials, and assign responsibilities to field personnel. Keep planned, ongoing, and completed measurement activities organised." },
      { title: "Historical Condition Tracking", description: "Compare results from repeated trials to understand changes in an asset's behaviour over time. Identify trends, unusual deviations, and signs that may require closer inspection." },
      { title: "Risk Assessment & Prioritisation", description: "Use measurement history and asset information to help identify components that require attention, supporting more informed inspection and maintenance planning." },
      { title: "Reporting & Documentation", description: "Generate structured reports linked to assets, components, and measurement trials. Maintain inspection histories and reviewed reports for engineering, maintenance, and compliance teams." },
    ],
    workflowHeading: "From a single measurement to a clearer picture of asset health.",
    applicationsHeading: "Asset health across critical infrastructure.",
    workflow: [
      { title: "Map the Assets", description: "Register structures, equipment, and their individual components within the platform, including their locations and relevant details." },
      { title: "Plan & Assign Trials", description: "Select the assets or measurement points to be inspected, schedule trials, and assign them to field personnel." },
      { title: "Navigate & Capture Measurements", description: "Field teams locate assigned assets and conduct trials using the connected sensing equipment." },
      { title: "Analyse & Review Results", description: "Measurement data is processed and associated with the relevant asset or component, helping teams assess its current condition." },
      { title: "Track Changes Over Time", description: "Repeat inspections at planned intervals to compare results, identify deterioration trends, and support maintenance decisions." },
    ],
    applications: [
      { title: "Bridges, Buildings & Civil Infrastructure", description: "Assess structural components such as columns, girders, supports, and other critical elements. Repeated inspections help teams understand how structures behave and change over time." },
      { title: "Railways & Transportation Infrastructure", description: "Support condition assessment of railway structures, tracks, viaducts, and other transport assets where vibration, movement, and structural stability matter." },
      { title: "Aviation & Aerospace", description: "Support inspection and condition assessment of suitable aircraft components, airport infrastructure, and other engineered structures where precise measurement is important." },
      { title: "Manufacturing & Industrial Machinery", description: "Assess vibration and mechanical behaviour in industrial equipment, structural frames, production machinery, and material-handling systems." },
      { title: "Energy, Utilities & Process Industries", description: "Monitor the condition of selected components across power facilities, pipelines, industrial installations, and other critical assets." },
      { title: "Large Infrastructure & Asset Portfolios", description: "Manage inspection programmes across multiple sites, structures, and components while maintaining a consolidated history of measurement results and asset condition." },
    ],
    benefits: [
      { title: "Detect Changes That Visual Inspections May Miss", description: "Use sensor-based measurements to identify unusual vibration, movement, or structural behaviour that may not be immediately visible." },
      { title: "Understand How Assets Age", description: "Build a condition history through repeated trials, helping teams distinguish stable performance from gradual deterioration." },
      { title: "Know Where to Focus Inspection Efforts", description: "Use asset condition information and risk priorities to direct attention toward components that may require closer investigation." },
      { title: "Keep Every Measurement Connected to Its Asset", description: "Organise trials, reports, measurement history, and component information in one place instead of managing disconnected records." },
      { title: "Make Field Inspections Easier to Coordinate", description: "Connect asset locations, trial assignments, and inspection workflows so field teams know where to go and what needs to be measured." },
      { title: "Plan Maintenance With Better Information", description: "Use historical trends and condition assessments to support preventive maintenance decisions rather than relying only on visible damage or unexpected failures." },
    ],
  },
  trinetra: {
    overviewHeading: "Turn everyday surveillance into intelligent safety monitoring.",
    capabilitiesHeading: "Intelligent monitoring, built around your cameras.",
    workflowHeading: "From Input to Insight.",
    applicationsHeading: "Safety monitoring across industrial environments.",
    introduction: "Turn your existing CCTV cameras into an intelligent safety monitoring system. Trinetra analyses live video feeds to identify safety violations, detect restricted-zone activity, and alert teams when something needs attention—without requiring an entirely new camera network.",
    overview: [
      "Trinetra is an AI-powered video analytics platform that works with existing CCTV infrastructure to detect safety risks, monitor designated areas, and help teams respond to events as they happen.",
      "Instead of relying entirely on people to watch multiple camera feeds, Trinetra analyses video using AI models that identify specific conditions and activities.",
      "For example, in an industrial facility, Trinetra can distinguish between workers wearing the required safety helmets and those without them, helping teams identify PPE violations.",
      "With configurable detection zones, perimeter monitoring, camera health checks, and real-time alerts, Trinetra transforms ordinary surveillance footage into actionable safety information.",
      "Its edge-based architecture processes video locally, supporting continuous on-site detection even when internet connectivity is unavailable.",
    ],
    features: [
      { title: "PPE Detection", description: "Detect missing helmets, safety vests, and other required protective equipment in monitored areas." },
      { title: "Zone & Perimeter Monitoring", description: "Identify people crossing designated safety boundaries or entering restricted zones." },
      { title: "Camera Health Monitoring", description: "Flag camera feeds that go offline, freeze, or shift out of position." },
      { title: "Real-Time Alerts", description: "Notify control rooms and designated personnel through configured alert channels." },
      { title: "Existing CCTV Integration", description: "Use existing CCTV cameras to provide video feeds for monitoring, without requiring an entirely new camera network." },
      { title: "On-Site AI Processing", description: "Process video locally through an edge-based architecture, supporting on-site detection even when internet connectivity is unavailable." },
    ],
    workflow: [
      "Existing CCTV cameras connect to the on-site Trinetra edge unit",
      "AI models analyse video feeds locally",
      "Detected safety violations trigger alerts",
      "Video and recordings remain stored on-site",
    ],
    applications: [
      "Molten-metal and ladle bays",
      "Overhead cranes and gantries",
      "Conveyor and rolling lines",
      "Coke ovens and restricted hot zones",
      "Gates, weighbridges, and industrial yards",
      "Temporary maintenance and contractor work zones",
    ],
    benefits: [
      "Works with existing camera infrastructure",
      "Edge-based AI processing",
      "Continues local monitoring when internet connectivity is unavailable",
      "Keeps video processing and storage within the facility",
      "Supports remote viewing and notifications",
      "Enables temporary camera coverage using compatible phones",
    ],
  },
  sarathi: {
    heroTagline: "One platform to monitor, manage, and get things done.",
    overviewHeading: "Everything your operations need. All in one place.",
    introduction: "Bring operations, people, tasks, guides, and alerts together in one place. Sarathi simplifies everyday work, helps teams follow the right processes, and makes it easier to coordinate when something needs attention.",
    overview: [
      "Sarathi is an operational monitoring and management platform designed to make complex, people-intensive operations easier to run.",
      "From monitoring activities across locations to assigning tasks, following operational guides, and managing alerts, Sarathi connects the different parts of daily operations in one system.",
      "Teams can work through structured processes, managers can keep track of responsibilities and progress, and important alerts can reach the people who need to act.",
      "Instead of switching between multiple applications for monitoring, instructions, task management, and communication, teams can work through one connected platform, configured around their organisation's requirements.",
    ],
    capabilitiesHeading: "Keep essential operations connected.",
    features: [
      { title: "Operational Monitoring & Management", description: "Bring operational information, activities, and responsibilities into a shared view. Understand what's happening across teams and locations while keeping everyday work organised." },
      { title: "Guides & Structured Workflows", description: "Give teams clear, step-by-step guides for carrying out operational activities. Standardise recurring processes, help people follow established procedures, and make tasks easier to complete consistently." },
      { title: "Task Assignment & Tracking", description: "Assign work to the right people, keep responsibilities clear, and track progress without relying on scattered messages or repeated follow-ups." },
      { title: "Alert Management & Response", description: "Raise alerts, notify relevant personnel, and coordinate action when something needs attention. Managers can assign responders, while teams can follow the appropriate steps and track the response." },
      { title: "Location-Based Visibility", description: "See activities, tasks, and operational information in the context of relevant locations, helping teams coordinate across facilities, sites, or operational areas." },
      { title: "Configurable Operations", description: "Adapt workflows, guides, responsibilities, and operational views to suit the structure and requirements of different organisations." },
    ],
    workflowHeading: "One connected workflow, from everyday tasks to urgent action.",
    applicationsHeading: "Operations across teams and locations.",
    workflowIntroduction: [
      "Sarathi brings the essential parts of operations together. Teams can monitor activities, access relevant guides, carry out assigned tasks, and update their progress within the platform.",
      "Managers can see what needs attention, coordinate responsibilities, and keep work moving across teams.",
      "When an unexpected situation occurs, the same platform supports alert notifications, task assignments, and coordinated response—without requiring teams to switch to an entirely separate system.",
    ],
    applications: [
      { title: "Manufacturing & Industrial Operations", description: "Coordinate production-related activities, standard operating procedures, maintenance tasks, and incident response across teams and facilities." },
      { title: "Hospitals & Healthcare Facilities", description: "Support operational workflows, department coordination, assigned responsibilities, and timely communication when situations require attention." },
      { title: "Large Events & Venues", description: "Manage multiple teams, event-day tasks, operational guides, location-based activities, and incident coordination." },
      { title: "Campuses & Multi-Site Organisations", description: "Keep distributed teams connected through shared operational information, workflows, task assignments, and alerts." },
      { title: "Facility & Infrastructure Management", description: "Organise routine inspections, operational procedures, maintenance responsibilities, and responses to issues across facilities and assets." },
    ],
    benefits: [
      { title: "Everything in One Place", description: "Monitoring, guides, task assignments, progress tracking, and alerts work together in one platform, reducing the need for multiple disconnected applications." },
      { title: "Make Everyday Work Easier", description: "Give people clear instructions and responsibilities so they can spend less time figuring out what to do and more time getting it done." },
      { title: "Save Time on Coordination", description: "Keep tasks, updates, and responsibilities visible to the right people, reducing unnecessary follow-ups and fragmented communication." },
      { title: "Respond Without Starting From Scratch", description: "When an alert is raised, teams can move from notification to assignment and action using the same platform they already use for everyday operations." },
      { title: "Built Around the Way You Work", description: "Configure guides, workflows, roles, and operational views to suit the requirements of your organisation." },
    ],
  },
  samveda: {
    heroTagline: "Every sensor. One connected view.",
    overviewHeading: "All your sensor data, finally in one place.",
    introduction: "Bring data from multiple sensors and monitoring systems into one place. Samveda is a smart edge IoT device that helps organisations collect, organise, and access sensor information through a connected monitoring system.",
    overview: [
      "Samveda is a smart edge IoT device designed to bring data from multiple sensors and monitoring sources together for more organised, accessible monitoring.",
      "In facilities where different sensors measure different parameters, information can become scattered across devices, systems, and locations. Samveda helps bring these data streams together, creating a central point for accessing and understanding sensor information.",
      "Whether it's an industrial plant, hospital, commercial building, or large infrastructure facility, Samveda helps teams monitor connected sensor data without having to rely on multiple disconnected systems.",
      "By making information easier to access and review, Samveda supports faster identification of conditions that may need attention and more informed operational decisions.",
    ],
    capabilitiesHeading: "Bring sensor information together.",
    features: [
      { title: "Multi-Sensor Data Collection", description: "Collect information from multiple connected sensors, bringing different measurements into a common system." },
      { title: "Centralised Data Access", description: "Access sensor information from one place instead of checking individual devices and disconnected monitoring systems." },
      { title: "Smart Edge Integration", description: "Use an edge-based IoT device to connect sensor data sources closer to where measurements are generated." },
      { title: "Multi-Parameter Monitoring", description: "Bring together readings from different types of sensors and measured parameters, helping teams understand multiple operating conditions." },
      { title: "Connected Monitoring", description: "Make collected sensor information available through a connected monitoring system, giving teams a more organised view of their operations." },
      { title: "Operational Data Visibility", description: "View relevant sensor information together to identify changes, unusual readings, and conditions that may require further investigation." },
    ],
    workflowHeading: "From scattered sensor readings to one connected view.",
    applicationsHeading: "Connected sensor monitoring across facilities.",
    workflow: [
      { title: "Connect Your Sensors", description: "Integrate compatible sensors and measurement sources with the Samveda device." },
      { title: "Collect the Data", description: "Samveda receives information from the connected sources." },
      { title: "Bring It Together", description: "Data from different sensors is organised within a common system." },
      { title: "Monitor the Readings", description: "Teams can access and review the collected information through the connected monitoring experience." },
      { title: "Identify & Act", description: "Use the available readings to recognise conditions that need attention and decide on appropriate action." },
    ],
    applications: [
      { title: "Industrial Plants & Manufacturing Facilities", description: "Bring together readings from sensors monitoring equipment, environmental conditions, and operational parameters across a facility." },
      { title: "Hospitals & Healthcare Facilities", description: "Consolidate information from compatible facility-monitoring sensors, such as those used for environmental conditions, equipment areas, and building systems." },
      { title: "Commercial Buildings & Smart Facilities", description: "Connect sensors used across building infrastructure, utilities, environmental monitoring, and facility operations." },
      { title: "Energy & Utility Infrastructure", description: "Bring together measurements from distributed equipment and monitoring points to support operational visibility." },
      { title: "Warehouses & Storage Facilities", description: "Access sensor information related to temperature, humidity, environmental conditions, and other monitored storage parameters." },
      { title: "Research & Testing Environments", description: "Collect readings from different measurement instruments and sensors to make monitoring and reviewing data more convenient." },
    ],
    benefits: [
      { title: "One Place for All Your Sensor Data", description: "Bring information from multiple connected sensors into a common system instead of managing separate sources." },
      { title: "Less Switching Between Systems", description: "Reduce the need to check different devices and monitoring interfaces just to understand what's happening." },
      { title: "A More Complete Picture", description: "See multiple measured parameters together, making it easier to understand conditions across equipment, rooms, or facilities." },
      { title: "Spot Changes More Easily", description: "Review sensor readings in one place to identify unusual values or conditions that may require attention." },
      { title: "Make Better-Informed Decisions", description: "Give teams easier access to the measurements they need when investigating issues or planning operational responses." },
      { title: "Simplify Monitoring Across Facilities", description: "Organise sensor information from multiple monitoring points so teams can work with a more connected view of their operations." },
    ],
  },
  "bodhi-ai": {
    heroTagline: "Your tools, documents, and information. One simple chat.",
    overviewHeading: "A cleaner, clearer way to work with AI.",
    introduction: "Connect your workplace tools, company documents, and information sources in one place. Find what you need, get answers, and complete everyday tasks by simply asking Bodhi.ai—without searching through endless folders or switching between applications.",
    overview: [
      "Bodhi.ai is an AI-powered workplace operating system that connects your tools, documents, and business information through one conversational interface.",
      "From publicly available information to private company files, internal knowledge bases, and connected workplace applications, Bodhi.ai helps you find relevant information without having to remember where everything is stored.",
      "Ask a question, retrieve a document, check a task, request an update, or initiate an action. Bodhi.ai brings information and workflows together, making everyday work simpler, faster, and more organised.",
      "With connected systems and role-based access, organisations can make relevant information available to the right people while keeping sensitive company resources protected.",
    ],
    audienceHeading: "Workplace teams using connected information",
    capabilitiesHeading: "Information and workflows, connected through chat.",
    audience: ["Employees", "Team leads", "HR and finance teams", "Executives"],
    features: [
      { title: "Intelligent Knowledge Retrieval", description: "Find answers across connected documents, folders, internal knowledge bases, and workplace tools. Retrieve relevant information, summaries, or source documents through a simple chat." },
      { title: "HR, Leave & Attendance", description: "Check leave balances, access company policies, apply for leave, and retrieve attendance information without navigating multiple systems." },
      { title: "Tasks & Productivity", description: "Find assigned tasks, check project progress, review pending work, and get updates from connected productivity tools." },
      { title: "Meetings & Scheduling", description: "Schedule meetings, coordinate invitations, retrieve meeting information, and access summaries and action items through connected tools." },
      { title: "Finance & Business Information", description: "Access permitted payroll information, reimbursement details, financial reports, and business insights without manually searching through different systems." },
      { title: "Connected Tools & Workflow Automation", description: "Bring workplace applications together and initiate supported actions directly through chat, reducing repetitive steps and unnecessary switching between tools." },
    ],
    workflowHeading: "From a simple question to the information or action you need.",
    applicationsHeading: "One conversational interface across everyday work.",
    workflow: [
      { title: "Ask a Question", description: "Type what you need in everyday language, whether it's a document, an update, or a task you want completed." },
      { title: "Understand the Request", description: "Bodhi.ai interprets your question and identifies the relevant information or action." },
      { title: "Connect to Your Tools", description: "It retrieves information from connected documents, applications, and authorised data sources." },
      { title: "Take Action When Needed", description: "For supported workflows, Bodhi.ai can initiate actions through connected systems, subject to appropriate permissions and approvals." },
      { title: "Get Your Response", description: "Receive an answer, relevant information, or confirmation directly in chat." },
    ],
    applications: [
      { title: "Company Knowledge & Document Search", description: "Need a policy, report, technical document, or project detail? Ask Bodhi.ai instead of searching through dozens of folders and files. It can retrieve relevant information from connected company resources and point you toward the source." },
      { title: "Business Systems & CRM Information", description: "Instead of navigating multiple screens to find customer records, sales updates, or business information, ask a question and retrieve the relevant data from a connected system, subject to your access permissions." },
      { title: "Employee & Team Productivity", description: "Employees can check tasks, retrieve documents, find company policies, and manage routine requests. Team leads can review work progress and identify pending activities without chasing individual updates." },
      { title: "HR & Finance Operations", description: "HR and finance teams can use connected systems to retrieve employee information, review attendance, access reports, and handle supported administrative workflows more efficiently." },
      { title: "Industrial Operations & Monitoring", description: "Connect operational information sources to retrieve equipment readings, pipeline monitoring information, or incident-related data through chat. Make technical information easier to access without manually navigating complex dashboards." },
      { title: "Marketing & Content Workflows", description: "Support marketing activities by connecting information sources and automating supported steps such as content research, drafting, and approval-based publishing." },
      { title: "Independent Professionals & Small Teams", description: "For freelancers and smaller teams managing multiple clients, projects, documents, and tools, Bodhi.ai can provide a simpler way to retrieve information and keep track of work across connected applications." },
    ],
    benefits: [
      { title: "Stop Searching. Start Asking.", description: "Find the information you need without opening dozens of folders, scrolling through long documents, or remembering which application contains the answer." },
      { title: "Your Tools, Working Together", description: "Bring information from different applications into one chat interface, reducing the effort of switching between platforms throughout the day." },
      { title: "Less Repetitive Work", description: "Simplify routine activities such as retrieving reports, checking tasks, scheduling meetings, and initiating requests through connected workflows." },
      { title: "Get Answers Without Waiting Around", description: "Access relevant company knowledge and permitted information without repeatedly depending on colleagues to locate or explain documents." },
      { title: "A Clearer View of Your Work", description: "Bring together updates, tasks, and information from connected systems so you can understand what needs attention and move forward." },
      { title: "Information That Respects Access Permissions", description: "Make company knowledge more accessible while using connected systems and role-based controls to determine who can access sensitive information." },
    ],
  },
};
