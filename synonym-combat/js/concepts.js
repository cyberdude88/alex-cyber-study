const CombatConcepts = (() => {
  const ALL = [

    // ── DOMAIN 1: Security and Risk Management ────────────────────────────

    {
      id: "d1-risk-appetite",
      domain: 1,
      term: "Risk Appetite",
      definition: "The amount and type of risk an organization is prepared to pursue, retain, or take.",
      phrasings: {
        governance: "The board-ratified boundary of acceptable enterprise uncertainty the organization will carry without requiring additional controls.",
        operational: "The risk ceiling the security program uses to determine when escalation to leadership is required.",
        technical: "The maximum acceptable exposure score used to calibrate control investment thresholds.",
        executive: "How much strategic uncertainty leadership is prepared to absorb in pursuit of business objectives."
      },
      scenario: "The board formally documented the maximum level of uncertainty the organization will accept before mandating additional control investments across the enterprise.",
      distortions: [
        "tolerable organizational exposure boundary",
        "board-sanctioned uncertainty ceiling",
        "acceptable enterprise risk posture",
        "maximum strategic exposure willingness",
        "declared organizational risk embrace level",
        "risk posture upper boundary",
        "acceptable uncertainty retention limit",
        "strategic hazard embrace ceiling",
        "board-approved exposure acceptance threshold",
        "enterprise-level risk pursuit boundary"
      ],
      traps: ["d1-risk-tolerance", "d1-risk-acceptance"],
      trapExplanation: "Risk appetite (how much risk the org WILLINGLY PURSUES) differs from risk tolerance (acceptable deviation from appetite). Appetite sets direction; tolerance measures variance from that direction."
    },

    {
      id: "d1-risk-tolerance",
      domain: 1,
      term: "Risk Tolerance",
      definition: "The acceptable variation in outcomes related to specific risks, relative to risk appetite.",
      phrasings: {
        governance: "The permissible band of deviation from the organization's declared risk appetite within which operations may continue without escalation.",
        operational: "The variance buffer that determines when a risk event requires escalation versus continued monitoring.",
        technical: "The acceptable margin of error around the target risk appetite metric before controls are recalibrated.",
        executive: "How far actual risk exposure can vary from our target before leadership action is required."
      },
      scenario: "Management defined how far actual security exposure could vary from the stated risk target before requiring board notification and remediation action.",
      distortions: [
        "acceptable deviation from stated risk posture",
        "permissible variance around exposure target",
        "risk posture variance band",
        "operational exposure buffer",
        "risk fluctuation threshold",
        "acceptable risk swing margin",
        "exposure variance ceiling",
        "risk boundary flexibility zone",
        "permissible outcome deviation range",
        "risk posture flexibility margin"
      ],
      traps: ["d1-risk-appetite", "d1-risk-acceptance"],
      trapExplanation: "Risk tolerance (how much VARIANCE from appetite is acceptable) differs from risk appetite (the desired risk level itself). Tolerance is the allowable band; appetite is the target."
    },

    {
      id: "d1-risk-acceptance",
      domain: 1,
      term: "Risk Acceptance",
      definition: "A risk treatment option where the organization knowingly assumes a risk without further mitigation.",
      phrasings: {
        governance: "A documented executive decision to retain an identified risk without additional control investment, with formal acknowledgment of the residual exposure.",
        operational: "The formal acknowledgment by an accountable owner that a risk will not be further reduced in the current period.",
        technical: "The deliberate decision to accept a residual exposure value after evaluating the cost-benefit of additional controls.",
        executive: "A conscious leadership decision to carry a known risk rather than spend resources mitigating it."
      },
      scenario: "After reviewing the cost of additional controls, the CISO formally documented that the organization would knowingly carry the identified residual exposure without further remediation.",
      distortions: [
        "deliberate risk retention",
        "conscious exposure assumption",
        "formal risk carriage decision",
        "residual risk endorsement",
        "acknowledged exposure retention",
        "willful risk carry-forward",
        "documented hazard retention without treatment",
        "risk non-treatment election",
        "accepted residual exposure decision",
        "formally acknowledged risk carry"
      ],
      traps: ["d1-risk-transfer", "d1-risk-appetite"],
      trapExplanation: "Risk acceptance (you KEEP the risk intentionally) differs from risk transfer (you MOVE it to a third party). Acceptance is an active treatment choice — not a failure to act."
    },

    {
      id: "d1-risk-transfer",
      domain: 1,
      term: "Risk Transfer",
      definition: "A risk treatment strategy that shifts the financial consequences of a risk to a third party.",
      phrasings: {
        governance: "The organizational strategy of contractually assigning financial liability for identified risk events to external entities such as insurers or service providers.",
        operational: "Using insurance, contracts, or SLAs to ensure a third party bears the financial cost of specified risk events.",
        technical: "Moving financial exposure from an organization's balance sheet to a third party through contractual mechanisms.",
        executive: "Buying insurance or using contracts to make someone else financially responsible for defined risk events."
      },
      scenario: "The organization purchased a cyber liability insurance policy to ensure a third party would absorb the financial consequences of a data breach event.",
      distortions: [
        "contractual liability assignment",
        "financial exposure offloading",
        "third-party risk conveyance",
        "risk liability externalization",
        "insurance-based exposure shifting",
        "contractual hazard reassignment",
        "financial risk offloading mechanism",
        "liability-shifting strategy",
        "exposure delegation to external parties",
        "risk indemnification arrangement"
      ],
      traps: ["d1-risk-acceptance", "d1-risk-mitigation"],
      trapExplanation: "Risk transfer (someone ELSE bears the cost) differs from risk acceptance (you bear it) and risk mitigation (you reduce it). Transfer does NOT eliminate the risk — only its financial impact to the organization."
    },

    {
      id: "d1-risk-mitigation",
      domain: 1,
      term: "Risk Mitigation",
      definition: "A risk treatment strategy that reduces the likelihood or impact of a risk event through controls.",
      phrasings: {
        governance: "The deployment of protective measures to reduce the probability or consequence of identified risk events to an acceptable level.",
        operational: "Implementing controls and procedures that lower either the likelihood or impact of a threat materializing.",
        technical: "Applying technical and procedural countermeasures to reduce threat probability or impact metrics.",
        executive: "Spending on security controls to make bad outcomes less likely or less costly."
      },
      scenario: "The security team deployed encryption and access controls to reduce the likelihood and impact of unauthorized data disclosure events.",
      distortions: [
        "control-based exposure reduction",
        "risk impact reduction through safeguards",
        "threat consequence diminishment via countermeasures",
        "protective measure application for exposure reduction",
        "safeguard-driven risk reduction",
        "probability-lowering control investment",
        "impact reduction through protective measures",
        "hazard reduction via countermeasures",
        "risk level reduction through control deployment",
        "control investment to reduce exposure"
      ],
      traps: ["d1-risk-acceptance", "d1-risk-avoidance"],
      trapExplanation: "Risk mitigation REDUCES the risk but keeps the activity. Risk avoidance ELIMINATES the risk by stopping the activity. Risk acceptance KEEPS the risk without change. Mitigation always involves spending on controls."
    },

    {
      id: "d1-risk-avoidance",
      domain: 1,
      term: "Risk Avoidance",
      definition: "A risk treatment strategy that eliminates the risk by stopping or not starting the activity that creates it.",
      phrasings: {
        governance: "The executive decision to discontinue or not pursue a business activity because its risk profile exceeds the organization's appetite.",
        operational: "The operational choice to not engage in or to terminate an activity that exposes the organization to unacceptable risk.",
        technical: "Eliminating a risk vector entirely by removing the system, activity, or exposure that creates it.",
        executive: "Deciding not to do something because the risk is too high — the only treatment that removes the risk entirely."
      },
      scenario: "The board decided not to enter a new market segment after risk analysis determined the regulatory exposure was incompatible with the organization's risk posture.",
      distortions: [
        "activity cessation for exposure elimination",
        "risk elimination through disengagement",
        "threat removal via activity termination",
        "exposure elimination through non-participation",
        "strategic activity abandonment for risk removal",
        "hazard elimination through withdrawal",
        "risk elimination by removing the source activity",
        "avoidance of risk-generating activities",
        "non-participation as a control strategy",
        "activity-level risk elimination decision"
      ],
      traps: ["d1-risk-mitigation", "d1-risk-acceptance"],
      trapExplanation: "Risk avoidance ELIMINATES the risk by stopping the activity. Risk mitigation REDUCES the risk but keeps the activity. If you stop using cloud storage — avoidance. If you encrypt cloud data — mitigation."
    },

    {
      id: "d1-ale",
      domain: 1,
      term: "Annual Loss Expectancy",
      definition: "The expected monetary loss for an asset due to a risk over one year; calculated as SLE × ARO.",
      phrasings: {
        governance: "The annualized financial projection of loss attributed to a specific threat, used to justify security investment decisions.",
        operational: "The yearly cost estimate for a risk event, used to determine whether control investments are financially justified.",
        technical: "The product of Single Loss Expectancy and Annualized Rate of Occurrence — the baseline for cost-benefit analysis.",
        executive: "The yearly dollar amount the organization expects to lose from a particular type of security incident."
      },
      scenario: "The risk analyst multiplied the per-incident cost of a data breach by its expected annual frequency to determine the annual expected financial impact.",
      distortions: [
        "annualized expected monetary impact",
        "yearly projected financial exposure",
        "annual risk-weighted financial consequence",
        "expected annual cost of risk realization",
        "projected yearly loss from a specified threat",
        "annualized threat impact figure",
        "annual cost projection for a specific hazard",
        "risk-weighted annual financial expectation",
        "expected annual loss from a specified risk",
        "yearly financial exposure estimate for a risk category"
      ],
      traps: ["d1-sle", "d1-aro"],
      trapExplanation: "ALE = SLE × ARO. ALE is the ANNUAL total. SLE is the SINGLE EVENT cost. ARO is the FREQUENCY. Getting these reversed is a top failure mode. Ask: one event or one year?"
    },

    {
      id: "d1-sle",
      domain: 1,
      term: "Single Loss Expectancy",
      definition: "The expected monetary loss from a single occurrence of a risk event; Asset Value × Exposure Factor.",
      phrasings: {
        governance: "The estimated financial impact per occurrence of a specific threat event, used as the input to annual risk calculations.",
        operational: "The cost of a single security incident of a defined type, representing the impact if the threat materializes once.",
        technical: "The dollar value of damage from one instance of a risk, equal to asset value multiplied by exposure factor.",
        executive: "What one security incident of a specific type will cost the organization."
      },
      scenario: "The risk team calculated the expected financial damage from a single ransomware event by multiplying the server farm's value by the estimated percentage that would be compromised.",
      distortions: [
        "per-incident financial impact estimate",
        "cost of one risk event occurrence",
        "single-event monetary loss figure",
        "one-time threat realization cost",
        "per-event impact dollar amount",
        "individual incident cost estimate",
        "unit cost of a single threat event",
        "loss per single risk occurrence",
        "individual threat materialization cost",
        "one-occurrence expected financial loss"
      ],
      traps: ["d1-ale", "d1-aro"],
      trapExplanation: "SLE is per EVENT, not per YEAR. Multiply SLE by ARO to get ALE. 'What one breach costs' → SLE. 'What breaches cost us annually' → ALE. Never confuse the unit (event vs year)."
    },

    {
      id: "d1-aro",
      domain: 1,
      term: "Annualized Rate of Occurrence",
      definition: "The estimated frequency with which a threat is expected to occur within a one-year period.",
      phrasings: {
        governance: "The probability expressed as annual frequency with which a specific risk event is expected to materialize.",
        operational: "The number of times per year a given security incident type is projected to occur, based on historical data or expert estimates.",
        technical: "The expected frequency of a risk event per year, used as the multiplier in ALE calculations.",
        executive: "How many times per year we expect this type of incident to happen."
      },
      scenario: "Historical breach data indicated that phishing-enabled account takeovers occurred approximately twice per year at similar organizations, informing the annual risk calculation.",
      distortions: [
        "annual threat frequency estimate",
        "yearly incident occurrence probability",
        "annualized event recurrence rate",
        "per-year threat materialization frequency",
        "yearly incident likelihood frequency",
        "annual event recurrence expectation",
        "threat frequency per annum",
        "annual risk event rate",
        "yearly occurrence probability factor",
        "annualized incident frequency estimate"
      ],
      traps: ["d1-sle", "d1-ale"],
      trapExplanation: "ARO is a FREQUENCY (how many times per year), not a cost. ARO 0.5 = once every 2 years. ARO × SLE = ALE. Frequency (ARO) ≠ cost (SLE) ≠ annual cost (ALE)."
    },

    {
      id: "d1-due-care",
      domain: 1,
      term: "Due Care",
      definition: "The reasonable steps an organization takes to protect against harm; doing what a reasonably prudent person would do.",
      phrasings: {
        governance: "The minimum reasonable protective actions an organization must take to fulfill its legal and ethical obligation to protect stakeholders from foreseeable harm.",
        operational: "Implementing the security measures that a competent professional would recognize as necessary to prevent foreseeable harm.",
        technical: "Applying safeguards and controls to the standard that a reasonable security professional would consider adequate.",
        executive: "Taking the security steps that any responsible organization would take to prevent foreseeable harm."
      },
      scenario: "The organization deployed endpoint protection, applied patches within the vendor-recommended window, and enabled MFA — the baseline protections any responsible organization would implement.",
      distortions: [
        "reasonable protective action standard",
        "prudent safeguard implementation",
        "minimum reasonable security obligation",
        "foreseeable harm prevention standard",
        "legally defensible protection baseline",
        "responsible security action threshold",
        "reasonable duty of protection",
        "prudent security action standard",
        "legal minimum harm prevention effort",
        "responsible stewardship baseline"
      ],
      traps: ["d1-due-diligence"],
      trapExplanation: "Due CARE is DOING (taking action to protect). Due DILIGENCE is INVESTIGATING (verifying whether the right things are being done). Patching systems = due care. Auditing whether systems are patched = due diligence. CARE = action; DILIGENCE = investigation."
    },

    {
      id: "d1-due-diligence",
      domain: 1,
      term: "Due Diligence",
      definition: "The investigation and verification process to understand risks and ensure appropriate safeguards are in place.",
      phrasings: {
        governance: "The systematic investigation and assessment process an organization undertakes to verify that adequate controls are in place and operating effectively.",
        operational: "The process of examining, assessing, and validating whether security controls and practices meet the required standard of care.",
        technical: "The research, testing, and verification activities that confirm controls are effective and risk exposure is understood.",
        executive: "The investigative process of verifying that security protections are actually working as intended."
      },
      scenario: "Before approving the merger, the CISO commissioned a security review of the acquisition target's control environment to understand the inherited risk exposure.",
      distortions: [
        "investigative security verification",
        "control effectiveness examination",
        "security posture investigation and validation",
        "systematic security practice review",
        "protection measure verification process",
        "safeguard adequacy investigation",
        "security assurance examination",
        "control validation research",
        "security practice audit and investigation",
        "protective measure adequacy assessment"
      ],
      traps: ["d1-due-care"],
      trapExplanation: "Due DILIGENCE is INVESTIGATING (verifying controls exist and work). Due CARE is DOING (implementing protections). Reviewing an acquisition target's security = due diligence. Installing firewalls = due care."
    },

    {
      id: "d1-policy",
      domain: 1,
      term: "Policy",
      definition: "A high-level document establishing management intent and direction for security, setting goals without specifying implementation.",
      phrasings: {
        governance: "The board or senior management declaration of organizational intent, values, and security objectives that guides all subordinate security documents.",
        operational: "The overarching document that sets the direction for the security program, which all standards, guidelines, and procedures must support.",
        technical: "The top-level governance document that states what must be achieved, without specifying how.",
        executive: "Management's formal statement of what the organization wants to accomplish with its security program."
      },
      scenario: "The CISO authored a document declaring senior management's commitment to protecting information assets and defining the organization's security objectives at the highest level.",
      distortions: [
        "executive security intent declaration",
        "management direction document",
        "high-level organizational security intent",
        "governance-level security objective statement",
        "management security mandate",
        "organizational security direction document",
        "senior leadership security intent",
        "security program direction statement",
        "governing security intent document",
        "management-level protective mandate"
      ],
      traps: ["d1-standard", "d1-procedure", "d1-guideline"],
      trapExplanation: "POLICY (what and why — management intent) → STANDARD (mandatory requirements) → GUIDELINE (recommendations) → PROCEDURE (step-by-step how-to). Policy is MOST general, MOST authoritative, never says HOW."
    },

    {
      id: "d1-standard",
      domain: 1,
      term: "Standard",
      definition: "A mandatory, specific requirement specifying the use of technology, configuration, or practices to support policy.",
      phrasings: {
        governance: "A mandatory organizational requirement derived from policy that specifies measurable, enforceable security requirements.",
        operational: "The specific, mandatory requirements that security teams must implement to conform to organizational security policy.",
        technical: "Mandatory specifications for technology use, configuration baselines, and security controls that operationalize policy requirements.",
        executive: "Mandatory rules that tell the organization specifically WHAT must be done to comply with security policy."
      },
      scenario: "The security team published a mandatory password complexity document requiring minimum 14-character passphrases with MFA for all privileged accounts across the organization.",
      distortions: [
        "mandatory security specification",
        "enforceable security requirement",
        "policy-derived mandatory requirement",
        "compulsory security configuration mandate",
        "binding technical security requirement",
        "mandatory compliance specification",
        "obligatory security technical requirement",
        "enforcement-level security specification",
        "required security implementation mandate",
        "compulsory security technical rule"
      ],
      traps: ["d1-policy", "d1-guideline", "d1-procedure"],
      trapExplanation: "Standards are MANDATORY (must follow). Guidelines are RECOMMENDED (should follow). Key word test: 'must' or 'shall' = standard. 'should' or 'recommended' = guideline."
    },

    {
      id: "d1-guideline",
      domain: 1,
      term: "Guideline",
      definition: "A recommended, non-mandatory practice providing flexibility in how policy and standards are implemented.",
      phrasings: {
        governance: "A non-binding recommendation that provides implementation flexibility while maintaining alignment with organizational security policy.",
        operational: "Optional but encouraged security practices that support compliance with standards without being mandatory.",
        technical: "Suggested implementation approaches and best practices that are advisory rather than compulsory.",
        executive: "Security recommendations that provide flexibility — following them is encouraged but not required."
      },
      scenario: "The security team published suggested approaches for developers to handle secrets management, acknowledging that teams could adapt the recommendations to their specific environments.",
      distortions: [
        "non-mandatory security recommendation",
        "advisory security practice",
        "optional best practice guidance",
        "recommended but non-compulsory security practice",
        "flexible security implementation suggestion",
        "advisory security recommendation",
        "non-binding security best practice",
        "optional security guidance",
        "suggested protective practice",
        "advisory compliance recommendation"
      ],
      traps: ["d1-standard", "d1-procedure"],
      trapExplanation: "Guidelines are NOT mandatory. Standards ARE mandatory. When a question says 'recommended' or 'should' — guideline. 'Must' or 'shall' — standard. Guidelines exist to provide flexibility where standards cannot."
    },

    {
      id: "d1-procedure",
      domain: 1,
      term: "Procedure",
      definition: "A detailed, step-by-step document describing how to implement a policy, standard, or guideline.",
      phrasings: {
        governance: "A documented sequence of operational steps that specifies exactly how a security requirement must be carried out.",
        operational: "The step-by-step instructions that enable consistent execution of security tasks in conformance with standards.",
        technical: "Detailed implementation instructions specifying the exact steps to configure, operate, or respond to security requirements.",
        executive: "The how-to guide that tells people exactly what to do, in what order, to comply with security requirements."
      },
      scenario: "The incident response team documented the exact sequence of steps — isolation, evidence preservation, notification, and recovery — to be followed when a ransomware event is detected.",
      distortions: [
        "step-by-step security instruction",
        "implementation sequence document",
        "operational how-to guide",
        "task execution sequence for compliance",
        "detailed implementation walkthrough",
        "step-sequence compliance guide",
        "operational security task instruction",
        "implementation step documentation",
        "security task action sequence",
        "detailed action sequence for compliance"
      ],
      traps: ["d1-policy", "d1-standard"],
      trapExplanation: "Procedures are the MOST detailed (step-by-step how-to). Policy is LEAST detailed (management intent). Standards specify WHAT — procedures specify HOW, in what sequence."
    },

    // ── DOMAIN 2: Asset Security ───────────────────────────────────────────

    {
      id: "d2-data-owner",
      domain: 2,
      term: "Data Owner",
      definition: "The individual or entity with primary accountability for a data asset, including its classification and protection requirements.",
      phrasings: {
        governance: "The senior organizational role formally accountable for determining the classification, value, and required protection level of a data asset.",
        operational: "The business executive who determines how data must be protected and who may access it.",
        technical: "The accountable party responsible for defining data classification, access controls, and protection requirements for a data set.",
        executive: "The business leader who decides what data we have, how sensitive it is, and who is allowed to use it."
      },
      scenario: "The VP of Finance was designated as the accountable party responsible for defining the sensitivity level and access requirements for payroll data.",
      distortions: [
        "data accountability principal",
        "information asset accountable party",
        "primary data accountability role",
        "data classification authority",
        "asset accountability holder",
        "information governance accountable executive",
        "data protection accountable role",
        "asset classification decision authority",
        "data accountability and classification role",
        "primary information asset steward (accountability)"
      ],
      traps: ["d2-data-custodian", "d2-data-steward"],
      trapExplanation: "Data OWNER = accountable (a business executive who decides classification and access). Data CUSTODIAN = responsible for technical protection (IT implements controls). CISSP: owner decides; custodian implements."
    },

    {
      id: "d2-data-custodian",
      domain: 2,
      term: "Data Custodian",
      definition: "The individual or group responsible for implementing and maintaining the technical controls protecting a data asset on behalf of the data owner.",
      phrasings: {
        governance: "The operationally responsible party that implements the technical safeguards specified by the data owner.",
        operational: "The IT or security team responsible for applying technical controls, backup, and protection mechanisms for data assets.",
        technical: "The role responsible for day-to-day technical protection, backup, encryption, and access enforcement for data assets.",
        executive: "The IT team that actually keeps the data safe by implementing and maintaining the controls the business owner requires."
      },
      scenario: "The database administration team was tasked with implementing the encryption, backup schedules, and access control lists specified by the Finance VP for payroll data.",
      distortions: [
        "technical data protection implementer",
        "data safeguard maintenance role",
        "information asset technical protector",
        "data control implementation role",
        "technical data stewardship role",
        "asset protection maintenance responsibility",
        "data security implementation party",
        "technical guardian of information assets",
        "data safeguard operational responsibility",
        "information asset technical handler"
      ],
      traps: ["d2-data-owner", "d2-data-steward"],
      trapExplanation: "Data CUSTODIAN implements what the owner decides. Owner = accountability (business). Custodian = responsibility (IT/technical). Classic CISSP trap: the custodian protects, but the owner decides what protection is needed."
    },

    {
      id: "d2-data-classification",
      domain: 2,
      term: "Data Classification",
      definition: "The process of organizing data into categories based on sensitivity and the impact of unauthorized disclosure.",
      phrasings: {
        governance: "A formal organizational program that assigns sensitivity levels to data assets to enable appropriate, risk-proportionate protection.",
        operational: "The process of assigning a sensitivity label to each data asset based on its value, regulatory requirements, and impact if disclosed.",
        technical: "A data labeling system that maps sensitivity levels to specific technical controls, access restrictions, and handling requirements.",
        executive: "The process of categorizing our data by how sensitive it is so we apply the right level of protection to the right information."
      },
      scenario: "The organization implemented a four-tier labeling system — Public, Internal, Confidential, and Restricted — to ensure each data type received proportionate protection controls.",
      distortions: [
        "data sensitivity categorization",
        "information sensitivity labeling",
        "asset sensitivity tiering",
        "data protection level assignment",
        "information sensitivity assignment process",
        "data impact-based categorization",
        "data sensitivity labeling framework",
        "information tiering by sensitivity",
        "data category assignment for protection",
        "asset sensitivity-based categorization process"
      ],
      traps: ["d2-data-owner", "d1-policy"],
      trapExplanation: "Data classification is the PROCESS of assigning sensitivity levels. The data owner DECIDES the classification. CISSP: classification categorizes data; the owner is accountable for that decision."
    },

    {
      id: "d2-pii",
      domain: 2,
      term: "Personally Identifiable Information",
      definition: "Any information that can be used to identify, contact, or locate a specific individual either alone or combined with other data.",
      phrasings: {
        governance: "Information that, alone or in combination with other data, enables the identification of a specific natural person and therefore requires formal privacy protections.",
        operational: "Data that identifies or could reasonably be linked to a specific individual and is subject to privacy regulations and handling controls.",
        technical: "Any data element or combination of elements — name, SSN, email, IP, biometric — that uniquely identifies an individual.",
        executive: "Any information that can identify one of our customers, employees, or partners as a specific person."
      },
      scenario: "The privacy officer determined that the dataset required enhanced protections because combining the device identifiers with location data could identify individual users.",
      distortions: [
        "individual identification data",
        "person-linkable information",
        "identity-enabling data",
        "individual-attributable information",
        "natural person identifying data",
        "identity-linkable personal data",
        "information capable of individual identification",
        "person-identifying data elements",
        "individual-traceable information",
        "data enabling specific person identification"
      ],
      traps: ["d2-phi", "d2-data-classification"],
      trapExplanation: "PII identifies individuals generally. PHI (Protected Health Information) is a subset of PII specifically related to medical information and governed by HIPAA. All PHI is PII, but not all PII is PHI."
    },

    {
      id: "d2-phi",
      domain: 2,
      term: "Protected Health Information",
      definition: "Individually identifiable health information held or transmitted by a covered entity, protected under HIPAA.",
      phrasings: {
        governance: "Any individually identifiable health data held or transmitted by a HIPAA-covered entity that is subject to federal privacy and security regulations.",
        operational: "Medical, treatment, or payment information that identifies or could identify a patient and requires HIPAA-compliant handling controls.",
        technical: "Health data tied to an individual's identity — diagnosis, treatment, payment records — subject to HIPAA Security and Privacy Rules.",
        executive: "Patient health records and any health-related data that identifies a person — legally protected and subject to strict handling requirements."
      },
      scenario: "The hospital's database containing patient diagnoses, treatment histories, and insurance information required HIPAA-compliant encryption and access controls due to the nature of the data.",
      distortions: [
        "individually identifiable medical information",
        "health data subject to privacy regulation",
        "patient-attributable medical data",
        "HIPAA-regulated health information",
        "healthcare privacy-regulated personal data",
        "medical information with individual identifiers",
        "individually linked health record data",
        "regulated patient health data",
        "healthcare identifying information",
        "individual-identifiable medical record data"
      ],
      traps: ["d2-pii", "d2-data-classification"],
      trapExplanation: "PHI is specifically health information under HIPAA. PII is broader (any identifying information). All PHI is PII. PHI has specific legal protections beyond general PII. On the exam, HIPAA = PHI, not just PII."
    },

    {
      id: "d2-data-sanitization",
      domain: 2,
      term: "Data Sanitization",
      definition: "The process of irreversibly removing or destroying data from storage media to prevent unauthorized recovery.",
      phrasings: {
        governance: "The formal process of permanently rendering data unrecoverable from storage media before disposal, reuse, or transfer.",
        operational: "The procedures applied to storage media to ensure sensitive data cannot be retrieved after the media leaves organizational control.",
        technical: "Applying overwriting, degaussing, or physical destruction methods to make stored data irrecoverable from media.",
        executive: "Permanently destroying data on devices before disposal or reassignment so it cannot be recovered by anyone."
      },
      scenario: "Before decommissioning the storage arrays, the team performed multiple-pass overwriting and validated the process to ensure patient records could not be recovered.",
      distortions: [
        "irreversible data removal process",
        "media data destruction procedure",
        "permanent data elimination from storage",
        "unrecoverable data rendering process",
        "storage media data obliteration",
        "secure data erasure and destruction",
        "data irrecoverability process",
        "media clearing and purging process",
        "storage device data elimination",
        "data destruction for media reuse or disposal"
      ],
      traps: ["d2-remanence", "d7-forensic-investigation"],
      trapExplanation: "Data sanitization ELIMINATES data from media. Data remanence is the RESIDUAL DATA that remains after insufficient sanitization. Proper sanitization prevents remanence. Forensics RECOVERS data — the opposite of sanitization's goal."
    },

    {
      id: "d2-remanence",
      domain: 2,
      term: "Data Remanence",
      definition: "The residual representation of data that remains on storage media after attempts to erase or delete it.",
      phrasings: {
        governance: "The risk of residual data persistence on storage media after deletion, which may enable unauthorized recovery of sensitive information.",
        operational: "The phenomenon where deleted data remains recoverable from storage media due to incomplete erasure processes.",
        technical: "Residual magnetic patterns, memory states, or data fragments that persist on media after standard deletion or formatting operations.",
        executive: "The reality that 'deleted' data often isn't truly gone and can be recovered from devices if not properly sanitized."
      },
      scenario: "Forensic analysis of the decommissioned laptop revealed recoverable fragments of customer records despite the standard delete operation applied before disposal.",
      distortions: [
        "residual data persistence",
        "post-deletion data recovery risk",
        "incomplete erasure data residue",
        "storage media data persistence after deletion",
        "deleted data recovery exposure",
        "residual magnetic data pattern",
        "persistent data after attempted erasure",
        "recoverable data after standard deletion",
        "storage media data residue",
        "deletion-resistant data persistence"
      ],
      traps: ["d2-data-sanitization"],
      trapExplanation: "Data remanence is the PROBLEM (data persists after deletion). Data sanitization is the SOLUTION (properly eliminating data). Questions about risk of recovery after disposal = remanence. Questions about the process to eliminate data = sanitization."
    },

    {
      id: "d2-data-processor",
      domain: 2,
      term: "Data Processor",
      definition: "Under GDPR, an entity that processes personal data on behalf of a data controller.",
      phrasings: {
        governance: "The third-party entity that processes personal data under the instruction of the data controller, with defined contractual obligations.",
        operational: "A vendor or service provider that handles personal data solely to perform services for the organization that collected it.",
        technical: "An entity that receives and processes personal data from a controller, bound by contractual data processing agreements.",
        executive: "A vendor we hire to handle our customer data on our behalf — they can only use the data as we instruct them to."
      },
      scenario: "The payroll vendor processed employee personal data solely on behalf of the organization under the terms of a data processing agreement.",
      distortions: [
        "third-party personal data handler",
        "contracted personal data processor",
        "personal data processing service provider",
        "data handling agent for the controller",
        "personal data service processor",
        "outsourced personal data handler",
        "personal data processing third party",
        "contracted data processing entity",
        "data processing service agent",
        "personal data handling vendor under instruction"
      ],
      traps: ["d2-data-controller", "d2-data-owner"],
      trapExplanation: "Data CONTROLLER decides WHY and HOW data is processed (determines the purpose). Data PROCESSOR processes data on the controller's behalf. Controller = determines purpose. Processor = executes processing under instruction."
    },

    {
      id: "d2-data-controller",
      domain: 2,
      term: "Data Controller",
      definition: "Under GDPR, the entity that determines the purposes and means of processing personal data.",
      phrasings: {
        governance: "The legal entity that holds primary accountability for personal data by determining the purpose and method of its processing.",
        operational: "The organization that decides why personal data is collected and how it will be used and protected.",
        technical: "The entity responsible for determining the lawful basis, purpose, and means of personal data processing.",
        executive: "The organization that decides what personal data we collect and why — and is legally accountable to regulators for those decisions."
      },
      scenario: "The retail company that collected customer email addresses for marketing purposes was the accountable party responsible for lawfully justifying and directing how the data was used.",
      distortions: [
        "personal data purpose determiner",
        "personal data processing decision authority",
        "data purpose and means authority",
        "personal data lawful basis holder",
        "data processing purpose setter",
        "primary personal data accountability entity",
        "personal data governance principal",
        "data collection purpose owner",
        "processing purpose determination authority",
        "primary accountability for personal data collection"
      ],
      traps: ["d2-data-processor", "d2-data-owner"],
      trapExplanation: "Data CONTROLLER decides purpose and means (accountable to regulators). Data PROCESSOR processes data under the controller's instruction. In GDPR: controller = decides WHY; processor = does the work."
    },

    // ── DOMAIN 3: Security Architecture and Engineering ───────────────────

    {
      id: "d3-bell-lapadula",
      domain: 3,
      term: "Bell-LaPadula Model",
      definition: "A formal security model focused on confidentiality, enforcing no read up (Simple Security Property) and no write down (Star Property).",
      phrasings: {
        governance: "A mandatory access control model that governs information flow to preserve confidentiality by restricting upward reads and downward writes.",
        operational: "A model that prevents users from reading data above their clearance level and prevents high-clearance users from writing to lower-classified containers.",
        technical: "A lattice-based MAC model with two properties: Simple Security (no read up) and Star Property (no write down) — preserving confidentiality.",
        executive: "A security model that ensures classified information doesn't leak downward by controlling who can read or write at each security level."
      },
      scenario: "The classified system enforced that users could only read documents at or below their clearance level and could only write to containers at or above their current level.",
      distortions: [
        "no-read-up no-write-down confidentiality model",
        "information flow confidentiality lattice model",
        "clearance-based read and write restriction model",
        "mandatory access model for information confidentiality",
        "classification-based information flow control model",
        "confidentiality-preserving access lattice",
        "upward-read restriction confidentiality model",
        "downward-write prevention security model",
        "need-to-know lattice confidentiality enforcement",
        "mandatory confidentiality flow restriction model"
      ],
      traps: ["d3-biba", "d3-clark-wilson"],
      trapExplanation: "Bell-LaPadula = CONFIDENTIALITY (no read up, no write down). Biba = INTEGRITY (no read down, no write up). Clark-Wilson = commercial INTEGRITY with SoD. Never use BLP to answer an integrity question."
    },

    {
      id: "d3-biba",
      domain: 3,
      term: "Biba Integrity Model",
      definition: "A formal security model focused on integrity, enforcing no read down (Simple Integrity) and no write up (Star Integrity Property).",
      phrasings: {
        governance: "A formal model that preserves data integrity by preventing high-integrity subjects from being contaminated by lower-integrity sources.",
        operational: "A model that prevents users from reading lower-integrity data (which could corrupt their process) and prevents writing to higher-integrity containers.",
        technical: "A lattice-based MAC model with Simple Integrity Property (no read down) and Star Integrity Property (no write up) — preserving integrity.",
        executive: "A security model that ensures high-quality information isn't corrupted by lower-quality sources by controlling integrity-level interactions."
      },
      scenario: "The financial system prevented analysts from importing data from unverified external sources into certified calculation modules, preserving the integrity of the financial models.",
      distortions: [
        "no-read-down no-write-up integrity model",
        "information integrity lattice model",
        "integrity-preserving access restriction model",
        "integrity-level flow restriction model",
        "contamination-prevention integrity model",
        "upward-write restriction integrity model",
        "downward-read prevention model",
        "mandatory integrity flow control model",
        "integrity-preserving lattice enforcement",
        "data integrity preservation access model"
      ],
      traps: ["d3-bell-lapadula", "d3-clark-wilson"],
      trapExplanation: "Biba = INTEGRITY ONLY (no read down, no write up). Bell-LaPadula = CONFIDENTIALITY ONLY (no read up, no write down). These are mirror images. Biba never addresses confidentiality. BLP never addresses integrity."
    },

    {
      id: "d3-clark-wilson",
      domain: 3,
      term: "Clark-Wilson Model",
      definition: "A formal integrity model for commercial environments using constrained data items, transformation procedures, and separation of duties.",
      phrasings: {
        governance: "A commercial integrity framework that enforces well-formed transactions and separation of duties to prevent unauthorized data modification.",
        operational: "A model that ensures data can only be modified through approved, audited transaction procedures with dual-control safeguards.",
        technical: "An integrity model using CDIs (Constrained Data Items), UDIs (Unconstrained Data Items), TPs (Transformation Procedures), and IVPs (Integrity Verification Procedures).",
        executive: "A security model ensuring business data is only changed through approved procedures with proper authorization and audit trails."
      },
      scenario: "The accounting system required all journal entries to pass through a certified transaction procedure and be co-authorized by a second approver before modifying the financial ledger.",
      distortions: [
        "well-formed transaction integrity model",
        "commercial separation-of-duty integrity model",
        "transaction-based data integrity model",
        "constrained data item integrity framework",
        "dual-control transaction integrity model",
        "authorized transaction procedure model",
        "commercial data integrity with SoD",
        "transformation procedure integrity enforcement",
        "certified transaction integrity model",
        "business process integrity with dual control"
      ],
      traps: ["d3-biba", "d3-bell-lapadula"],
      trapExplanation: "Clark-Wilson = COMMERCIAL INTEGRITY via well-formed transactions and SoD. Biba = military-style INTEGRITY via read-down/write-up restrictions. BLP = CONFIDENTIALITY. Clark-Wilson is the only commercial integrity model."
    },

    {
      id: "d3-brewer-nash",
      domain: 3,
      term: "Brewer-Nash Model",
      definition: "A security model that dynamically adjusts access controls to prevent conflicts of interest between competing organizations.",
      phrasings: {
        governance: "A dynamic access control model designed for consulting and financial environments where the same party holds data from competing organizations.",
        operational: "A model that prevents a consultant or analyst from accessing information from competing clients simultaneously.",
        technical: "An access control model where once a subject accesses data from one company, access to competing companies' data in the same sector is denied.",
        executive: "A security model that prevents analysts from simultaneously accessing data from competing companies to avoid conflicts of interest."
      },
      scenario: "After an investment analyst accessed a client's merger plans, the system automatically revoked access to any competing client in the same industry sector.",
      distortions: [
        "conflict of interest access prevention model",
        "competing entity data separation model",
        "dynamic conflict-of-interest control model",
        "competitive information separation model",
        "anti-conflict access restriction model",
        "dynamic access restriction for competing interests",
        "conflict prevention information barrier model",
        "competing client data separation enforcement",
        "information barrier dynamic access model",
        "conflict-sensitive access control model"
      ],
      traps: ["d3-clark-wilson", "d3-bell-lapadula"],
      trapExplanation: "Brewer-Nash (Chinese Wall) = CONFLICT OF INTEREST prevention. Clark-Wilson = COMMERCIAL INTEGRITY. Bell-LaPadula = CONFIDENTIALITY. Brewer-Nash is uniquely about preventing simultaneous access to competing organizations' data."
    },

    {
      id: "d3-sutherland",
      domain: 3,
      term: "Sutherland Model",
      definition: "An integrity model focused on preventing interference through covert channels and inference attacks.",
      phrasings: {
        governance: "A formal integrity model that addresses the risk of information leakage through indirect or covert communication pathways.",
        operational: "A model designed to prevent indirect information disclosure through covert channels that bypass formal access controls.",
        technical: "An integrity model using state machines to prevent information flow via covert or inference channels that circumvent access control mechanisms.",
        executive: "A security model addressing the risk that information can leak through indirect signals rather than direct access."
      },
      scenario: "The system was designed to prevent adversaries from inferring classified information by observing response timing patterns and resource utilization in shared computing environments.",
      distortions: [
        "covert channel interference prevention model",
        "indirect information flow integrity model",
        "inference attack prevention security model",
        "covert information leakage integrity model",
        "side-channel information flow prevention",
        "indirect disclosure integrity model",
        "covert communication prevention integrity model",
        "inference channel restriction model",
        "indirect information integrity enforcement",
        "covert pathway integrity control model"
      ],
      traps: ["d3-bell-lapadula", "d3-biba"],
      trapExplanation: "Sutherland = COVERT CHANNELS and INFERENCE. Bell-LaPadula = CONFIDENTIALITY (direct access). Biba = INTEGRITY (direct access). Sutherland is the ONLY model specifically addressing indirect information leakage through covert channels."
    },

    {
      id: "d3-least-privilege",
      domain: 3,
      term: "Principle of Least Privilege",
      definition: "The principle that subjects should be granted only the minimum permissions necessary to perform their required functions.",
      phrasings: {
        governance: "The governance requirement that all access rights be limited to the minimum necessary to fulfill authorized business functions.",
        operational: "Granting users, processes, and systems only the permissions explicitly required for their defined role — no more.",
        technical: "Restricting process and user access rights to the minimum required set of privileges, reducing the attack surface of the system.",
        executive: "Ensuring people and systems only have the access they actually need — reducing the damage if any account is compromised."
      },
      scenario: "The development team's service accounts were restricted to read-only access on the production database, even though write access would have been operationally convenient.",
      distortions: [
        "minimum necessary access principle",
        "access minimization principle",
        "need-only access grant principle",
        "minimum required privilege principle",
        "access right minimization standard",
        "need-to-access privilege standard",
        "minimum functional access principle",
        "privilege minimization principle",
        "minimum access right standard",
        "access right minimization to required functions"
      ],
      traps: ["d5-separation-of-duties", "d3-complete-mediation"],
      trapExplanation: "Least privilege (minimum necessary access) differs from separation of duties (no single person has complete control). Least privilege reduces the damage from compromise. SoD prevents any one person from completing a critical process alone."
    },

    {
      id: "d3-defense-in-depth",
      domain: 3,
      term: "Defense in Depth",
      definition: "A security strategy employing multiple, layered, independent security controls so that failure of any single control does not result in system compromise.",
      phrasings: {
        governance: "A security architecture principle requiring that multiple independent control layers be implemented so no single point of failure enables a security breach.",
        operational: "Deploying overlapping security controls at multiple layers — physical, network, host, application, data — so attackers must defeat several independent barriers.",
        technical: "A layered security architecture in which multiple independent controls at different system tiers collectively reduce the risk of compromise.",
        executive: "Protecting assets with multiple overlapping security layers so that if one control fails, others prevent harm."
      },
      scenario: "The architecture required physical security controls, network segmentation, host hardening, application-level controls, and data encryption to provide overlapping layers of protection.",
      distortions: [
        "layered security control strategy",
        "multi-layer security architecture",
        "overlapping security control deployment",
        "independent control layer security strategy",
        "redundant security control approach",
        "cascaded security barrier strategy",
        "multi-tier independent control approach",
        "security layer redundancy principle",
        "fail-safe layered security architecture",
        "multiple independent security tier strategy"
      ],
      traps: ["d3-least-privilege", "d3-fail-secure"],
      trapExplanation: "Defense in depth = MULTIPLE INDEPENDENT LAYERS so one failure doesn't compromise the system. Fail-secure = a SINGLE control that fails to a safe state. Least privilege = MINIMUM ACCESS. Different concepts; defense in depth is about layer redundancy."
    },

    {
      id: "d3-fail-secure",
      domain: 3,
      term: "Fail Secure",
      definition: "A design principle where a system defaults to a secure state when it fails, denying access rather than allowing it.",
      phrasings: {
        governance: "The system design requirement that failures result in denial of access rather than permissive access, preserving security over availability.",
        operational: "Designing systems so that when a control fails, access is denied by default — the system closes, not opens.",
        technical: "A design pattern where system failures result in a deny-default state, preventing unauthorized access when controls are unavailable.",
        executive: "If a security system breaks, it locks the door rather than leaving it open."
      },
      scenario: "When the authentication service became unreachable, the application denied all access attempts rather than allowing users through on an availability basis.",
      distortions: [
        "secure failure default state",
        "failure-to-deny design principle",
        "deny-on-failure security design",
        "secure state on failure design",
        "access-denial on control failure",
        "safe failure default design",
        "failure-default deny principle",
        "secure default failure mode",
        "access restriction on control failure",
        "security-preserving failure mode"
      ],
      traps: ["d3-defense-in-depth", "d3-open-design"],
      trapExplanation: "Fail SECURE = fails by DENYING access (security over availability). Fail SAFE = fails by preserving safety (safety over security — used in physical safety contexts). CISSP: fail secure is about keeping systems protected when controls fail."
    },

    {
      id: "d3-reference-monitor",
      domain: 3,
      term: "Reference Monitor",
      definition: "An abstract concept of a system component that mediates all access between subjects and objects, enforcing access control policy.",
      phrasings: {
        governance: "The conceptual access mediation function that enforces the security policy for every interaction between subjects and objects.",
        operational: "The security component that intercepts and validates every access request to ensure it complies with the security policy before allowing it.",
        technical: "An abstract access control mechanism that is always invoked, tamper-proof, and small enough to be fully verified — enforcing policy on every access.",
        executive: "The security checkpoint that validates every access request in the system before granting or denying it."
      },
      scenario: "The security architecture required that every file access request be intercepted and validated against the access control policy before execution, with no bypass pathways.",
      distortions: [
        "mandatory access mediation component",
        "access control enforcement component",
        "universal access validation mechanism",
        "policy enforcement mediation element",
        "access mediation enforcement concept",
        "subject-object access mediator",
        "policy-enforcing access checkpoint",
        "access control policy enforcement element",
        "tamper-proof access mediator concept",
        "universal access validation enforcer"
      ],
      traps: ["d3-tcb", "d3-security-kernel"],
      trapExplanation: "Reference Monitor = the CONCEPT (abstract idea of access mediation). Security Kernel = the IMPLEMENTATION of the reference monitor in hardware/software. TCB = the ENTIRE set of hardware, software, and firmware that enforces security policy — the broadest concept."
    },

    {
      id: "d3-tcb",
      domain: 3,
      term: "Trusted Computing Base",
      definition: "The totality of hardware, software, and firmware components critical to enforcing a system's security policy.",
      phrasings: {
        governance: "The complete set of system components upon which the security of the entire system depends and which must be trusted to enforce the security policy.",
        operational: "All hardware, firmware, and software components that together implement and enforce the system's security controls.",
        technical: "The complete combination of kernel, hardware, and trusted processes that collectively enforce the security policy and must be verified correct.",
        executive: "Every component of a system that we rely on to enforce security — if any part is compromised, the whole system security is at risk."
      },
      scenario: "The security evaluation assessed the OS kernel, privileged processes, hardware security modules, and firmware as the complete set of components upon which the system's security policy depended.",
      distortions: [
        "complete security-dependent system component set",
        "total security-enforcing component base",
        "aggregate of security-critical system components",
        "security-policy-enforcing system totality",
        "entire security enforcement component set",
        "security-critical hardware and software aggregate",
        "complete trusted system component collection",
        "security enforcement component totality",
        "system security foundation component set",
        "comprehensive security-dependent component base"
      ],
      traps: ["d3-reference-monitor", "d3-security-kernel"],
      trapExplanation: "TCB = ALL security-critical components (hardware + firmware + software). Security Kernel = the hardware/firmware/software implementing the reference monitor. Reference Monitor = abstract concept. TCB is the broadest — includes everything security depends on."
    },

    // ── DOMAIN 4: Communication and Network Security ──────────────────────

    {
      id: "d4-dmz",
      domain: 4,
      term: "Demilitarized Zone",
      definition: "A network segment that sits between an internal trusted network and an external untrusted network, hosting publicly accessible services.",
      phrasings: {
        governance: "A network isolation zone that provides a controlled boundary between internal organizational systems and externally accessible services.",
        operational: "A screened network segment hosting public-facing services — web, email, DNS — separated from the internal network by firewalls.",
        technical: "A network architecture using two firewall layers to create an intermediate zone where public-facing servers are isolated from internal networks.",
        executive: "A protected buffer zone where we put internet-facing systems so that if they're compromised, internal systems remain protected."
      },
      scenario: "The web servers were placed in a screened subnet between two firewalls, isolating them from both the public internet and the internal corporate network.",
      distortions: [
        "screened network buffer zone",
        "perimeter network isolation segment",
        "public-facing service isolation zone",
        "network boundary buffer segment",
        "externally accessible service isolation area",
        "controlled perimeter network zone",
        "internet-facing service screening zone",
        "network security buffer between external and internal",
        "dual-firewall isolated network segment",
        "public service network isolation zone"
      ],
      traps: ["d4-network-segmentation", "d4-vlan"],
      trapExplanation: "DMZ = specifically the zone BETWEEN two firewalls for public-facing services. Network segmentation = broader concept of dividing networks. VLAN = a logical segmentation mechanism. DMZ is a specific architecture pattern, not just any segmentation."
    },

    {
      id: "d4-network-segmentation",
      domain: 4,
      term: "Network Segmentation",
      definition: "The practice of dividing a network into smaller subnetworks to limit lateral movement and contain security incidents.",
      phrasings: {
        governance: "The architectural control of dividing the network into zones with enforced boundaries to limit the blast radius of security incidents.",
        operational: "Partitioning the network into isolated segments so that a compromise in one area cannot propagate freely to other areas.",
        technical: "Using routers, firewalls, and VLANs to divide networks into zones with controlled inter-zone traffic flows.",
        executive: "Dividing our network into sections with security checkpoints between them so that one breach doesn't compromise everything."
      },
      scenario: "The organization divided its network into separate zones for finance, HR, development, and production systems, with firewall-enforced policies controlling traffic between zones.",
      distortions: [
        "network zone partitioning",
        "network division for lateral movement control",
        "network isolation zone creation",
        "network boundary enforcement strategy",
        "network partition for blast radius reduction",
        "controlled network zone separation",
        "network isolation for incident containment",
        "network zone division strategy",
        "network compartmentalization approach",
        "boundary-enforced network partitioning"
      ],
      traps: ["d4-dmz", "d4-vlan", "d4-microsegmentation"],
      trapExplanation: "Network segmentation = general concept of dividing networks. DMZ = specific pattern for public-facing services. VLAN = a mechanism to implement segmentation. Microsegmentation = granular per-workload segmentation. These are nested concepts."
    },

    {
      id: "d4-vlan",
      domain: 4,
      term: "Virtual Local Area Network",
      definition: "A logical network segment created by configuring switches to group devices regardless of physical location.",
      phrasings: {
        governance: "A logical network partitioning mechanism that enables isolation of network traffic without requiring physical separation of infrastructure.",
        operational: "Switch-level configuration that creates isolated broadcast domains, logically separating network segments without separate physical hardware.",
        technical: "IEEE 802.1Q-based logical network segments implemented at the data link layer, segmenting traffic by tagging frames with VLAN IDs.",
        executive: "A way to create separate, isolated network sections using software configuration rather than separate physical cables and switches."
      },
      scenario: "The network team configured the switches to isolate the IoT devices into their own logical broadcast domain, preventing them from communicating with corporate systems.",
      distortions: [
        "logical network isolation mechanism",
        "software-defined network segment",
        "switch-configured network isolation",
        "logical broadcast domain isolation",
        "virtual network partitioning mechanism",
        "layer-2 logical network segment",
        "switch-based logical network isolation",
        "virtual network segment via configuration",
        "logical network partition using switching",
        "software-controlled network segment isolation"
      ],
      traps: ["d4-network-segmentation", "d4-microsegmentation"],
      trapExplanation: "VLAN = a MECHANISM for logical segmentation at layer 2. Network segmentation = the STRATEGY. Microsegmentation = granular layer 3/7 segmentation per workload. VLAN is a tool that implements the strategy of segmentation."
    },

    {
      id: "d4-microsegmentation",
      domain: 4,
      term: "Microsegmentation",
      definition: "Granular network segmentation applied at the workload or application level, enforcing fine-grained policies between individual workloads.",
      phrasings: {
        governance: "A zero-trust network architecture control that enforces workload-level isolation policies to minimize lateral movement within a network segment.",
        operational: "Applying individual security policies to each workload so that compromising one server doesn't enable movement to adjacent servers.",
        technical: "Software-defined networking control that enforces east-west traffic policies at the workload level, independent of network topology.",
        executive: "Putting a security policy around every individual server or workload so breaches can't spread sideways through the network."
      },
      scenario: "The cloud environment applied individual firewall policies to each virtual machine, preventing compromised workloads from communicating with any other workload not explicitly permitted.",
      distortions: [
        "workload-level network isolation",
        "per-workload network policy enforcement",
        "granular east-west traffic control",
        "individual workload network segmentation",
        "fine-grained workload isolation policy",
        "workload-level security perimeter",
        "per-application network isolation",
        "granular workload traffic policy",
        "east-west movement prevention control",
        "software-defined per-workload isolation"
      ],
      traps: ["d4-vlan", "d4-network-segmentation"],
      trapExplanation: "Microsegmentation = workload-level granular policies (east-west). VLANs = layer-2 broadcast domain segmentation. Network segmentation = broader strategy. Microsegmentation is the most granular and is central to Zero Trust architectures."
    },

    {
      id: "d4-ipsec",
      domain: 4,
      term: "IPSec",
      definition: "A protocol suite that provides authentication and encryption for IP packets, operating at the network layer.",
      phrasings: {
        governance: "A network-layer security protocol suite providing authentication and confidentiality for IP communications, commonly used for VPN implementations.",
        operational: "A suite of protocols that encrypts and authenticates network traffic at the IP layer, enabling secure communications over untrusted networks.",
        technical: "A network layer protocol suite including AH (Authentication Header) and ESP (Encapsulating Security Payload), operating in Transport or Tunnel mode.",
        executive: "A protocol that encrypts and authenticates network traffic at the routing level, used in VPNs and secure network connections."
      },
      scenario: "The organization implemented a site-to-site VPN using tunnel mode to encrypt all inter-site traffic at the network layer, protecting data traversing the public internet.",
      distortions: [
        "network-layer IP encryption protocol suite",
        "layer-3 authentication and encryption protocol",
        "IP-level traffic encryption and authentication",
        "network layer security protocol for IP communications",
        "IP packet authentication and encryption protocol",
        "network-layer VPN security protocol",
        "IP communication authentication and confidentiality protocol",
        "layer-3 secure communication protocol suite",
        "IP traffic encryption and integrity protocol",
        "network layer authentication and encryption for IP"
      ],
      traps: ["d4-tls", "d4-vpn"],
      trapExplanation: "IPSec = NETWORK LAYER (Layer 3) — encrypts entire IP packets. TLS = TRANSPORT/APPLICATION LAYER (Layer 4/7) — encrypts application sessions. IPSec is used for VPNs and site-to-site encryption; TLS is used for HTTPS and application sessions."
    },

    {
      id: "d4-tls",
      domain: 4,
      term: "Transport Layer Security",
      definition: "A cryptographic protocol providing end-to-end encryption and authentication for application layer communications.",
      phrasings: {
        governance: "An application-layer encryption protocol that provides confidentiality and integrity for data transmitted between client and server applications.",
        operational: "The protocol underlying HTTPS, email encryption, and many other secure application communications, authenticating servers and encrypting session data.",
        technical: "A cryptographic protocol operating above TCP (Layer 4/7) providing forward secrecy, server/client authentication, and symmetric session encryption.",
        executive: "The technology that puts the padlock in your browser's address bar — encrypting data between your application and the server."
      },
      scenario: "All customer-facing web applications were required to enforce HTTPS using TLS 1.2 or higher, ensuring data in transit between browsers and servers was encrypted and authenticated.",
      distortions: [
        "application-layer communication encryption protocol",
        "session-level encryption and authentication protocol",
        "application communication security protocol",
        "client-server session encryption protocol",
        "application transport encryption mechanism",
        "session-level cryptographic protection protocol",
        "data-in-transit application encryption protocol",
        "application communication authentication and encryption",
        "secure application session protocol",
        "end-to-end application communication encryption"
      ],
      traps: ["d4-ipsec", "d4-vpn"],
      trapExplanation: "TLS = APPLICATION LAYER session encryption (HTTPS, email). IPSec = NETWORK LAYER packet encryption (VPNs, site-to-site). TLS protects specific application sessions; IPSec protects entire network communications."
    },

    {
      id: "d4-stateful-inspection",
      domain: 4,
      term: "Stateful Inspection",
      definition: "A firewall technology that tracks the state of network connections and validates packets against the connection state table.",
      phrasings: {
        governance: "A network security control that enforces connection-based packet filtering by tracking the state of active sessions.",
        operational: "A firewall approach that remembers established connections and validates inbound packets against known legitimate sessions.",
        technical: "A layer-4 packet filtering method that maintains a state table of active connections, allowing only packets matching established sessions.",
        executive: "A firewall that tracks ongoing conversations and rejects packets that don't belong to a legitimate established connection."
      },
      scenario: "The firewall permitted inbound traffic only when it matched an established outbound connection record, blocking unsolicited inbound packets regardless of port.",
      distortions: [
        "connection state tracking firewall",
        "session-aware packet filtering",
        "connection context-aware packet inspection",
        "state table-based packet filtering",
        "session state enforcement mechanism",
        "connection tracking packet filter",
        "established session validation firewall",
        "session state packet validation",
        "connection-aware traffic filtering",
        "session context-based packet control"
      ],
      traps: ["d4-proxy-firewall", "d4-network-segmentation"],
      trapExplanation: "Stateful inspection = TRACKS CONNECTION STATE (Layer 4). Packet filtering = only checks packet headers (no state). Proxy firewall = TERMINATES and re-originates connections (Layer 7). Stateful is more secure than stateless packet filtering but less deep than proxy."
    },

    // ── DOMAIN 5: Identity and Access Management ──────────────────────────

    {
      id: "d5-authentication",
      domain: 5,
      term: "Authentication",
      definition: "The process of verifying the identity claimed by a subject through the presentation of credentials.",
      phrasings: {
        governance: "The identity verification process that establishes a subject's claimed identity before granting access to protected resources.",
        operational: "The mechanism by which a user proves who they are — through passwords, tokens, biometrics, or certificates.",
        technical: "The process of validating identity assertions against registered credentials using something you know, have, or are.",
        executive: "Verifying that a user is actually who they claim to be before allowing access to systems or data."
      },
      scenario: "Before accessing the financial system, each user was required to verify their identity by presenting their username, password, and a one-time code from their authenticator app.",
      distortions: [
        "identity verification process",
        "claimed identity validation",
        "credential-based identity confirmation",
        "subject identity establishment process",
        "identity claim verification mechanism",
        "user identity proof process",
        "credential verification and identity confirmation",
        "identity proofing at access time",
        "identity claim validation mechanism",
        "subject identity verification via credentials"
      ],
      traps: ["d5-authorization", "d5-identification"],
      trapExplanation: "Identification = claiming an identity (stating your username). Authentication = PROVING that identity (presenting credentials). Authorization = determining what you're allowed to do. The AAA sequence: identify → authenticate → authorize."
    },

    {
      id: "d5-authorization",
      domain: 5,
      term: "Authorization",
      definition: "The process of determining what resources and actions an authenticated subject is permitted to access.",
      phrasings: {
        governance: "The access control decision process that determines which resources and operations an authenticated subject may access based on policy.",
        operational: "The mechanism that checks what a logged-in user is allowed to do, based on their roles, permissions, or attributes.",
        technical: "The policy enforcement component that evaluates access requests from authenticated subjects against access control rules.",
        executive: "Determining what an already-verified user is allowed to see and do in our systems."
      },
      scenario: "After verifying the user's identity, the system checked their role assignment to determine which financial reports they were permitted to view and which actions they could perform.",
      distortions: [
        "access permission determination process",
        "access right assignment and enforcement",
        "permission evaluation for authenticated subjects",
        "access decision process post-authentication",
        "subject access privilege determination",
        "resource access permission check",
        "authenticated subject permission enforcement",
        "access control decision mechanism",
        "permission grant and enforcement process",
        "access right determination for authenticated users"
      ],
      traps: ["d5-authentication", "d5-accountability"],
      trapExplanation: "Authorization = WHAT you're allowed to do (after identity is verified). Authentication = WHO you are. Accountability = being RESPONSIBLE for your actions (audit trails). These three are distinct stages in the access control sequence."
    },

    {
      id: "d5-non-repudiation",
      domain: 5,
      term: "Non-Repudiation",
      definition: "The assurance that a party cannot deny having performed an action or sent a communication.",
      phrasings: {
        governance: "The security property that prevents a subject from denying they performed a recorded action, typically enforced through digital signatures or audit logs.",
        operational: "Using digital signatures, logs, and audit trails to ensure users cannot later deny that they performed specific actions.",
        technical: "Cryptographic proof of origin and receipt, typically implemented via asymmetric digital signatures tied to a subject's private key.",
        executive: "Creating irrefutable proof that a specific person took a specific action — so they can't claim they didn't."
      },
      scenario: "Each contract was digitally signed using the sender's private key, creating irrefutable cryptographic proof of origin that the sender could not later deny.",
      distortions: [
        "action denial prevention",
        "irrefutable action proof mechanism",
        "undeniable action record",
        "denial-prevention security property",
        "irrefutable origin proof",
        "action repudiation prevention",
        "cannot-deny security property",
        "cryptographic action attribution",
        "undeniable performance record",
        "origin and action irrefutability"
      ],
      traps: ["d5-accountability", "d5-authentication"],
      trapExplanation: "Non-repudiation = cannot DENY performing an action. Accountability = being RESPONSIBLE for actions (audit trail). Authentication = VERIFYING identity. Non-repudiation requires proof that's cryptographically tied to the specific actor — not just a log."
    },

    {
      id: "d5-separation-of-duties",
      domain: 5,
      term: "Separation of Duties",
      definition: "The principle that critical tasks should be divided among multiple individuals to prevent fraud and errors.",
      phrasings: {
        governance: "The organizational control requiring that no single individual possess sufficient access to complete a sensitive or high-risk transaction without another party's involvement.",
        operational: "Dividing critical security and business tasks so that no single person can complete them unilaterally — requiring collusion to commit fraud.",
        technical: "An access control principle ensuring no single account or user has permission to complete an entire sensitive workflow end-to-end.",
        executive: "Making sure no single employee can approve, execute, and record a financial transaction alone — requiring multiple people to collude to commit fraud."
      },
      scenario: "The financial system required separate approvals for transaction initiation and payment release, ensuring no single employee could both create and authorize a payment.",
      distortions: [
        "critical task division principle",
        "single-person control prevention",
        "dual-control requirement",
        "multi-party task completion requirement",
        "no-single-person completion principle",
        "task division to prevent unilateral action",
        "fraud prevention through task division",
        "multi-party authorization requirement",
        "divided responsibility control",
        "collusion-required critical task structure"
      ],
      traps: ["d3-least-privilege", "d5-two-person-integrity"],
      trapExplanation: "SoD = no single person CAN complete the full task (structural). Least privilege = minimum necessary ACCESS. Two-person integrity = requires TWO people physically present. SoD is about structural process division; least privilege is about access rights."
    },

    {
      id: "d5-rbac",
      domain: 5,
      term: "Role-Based Access Control",
      definition: "An access control model where permissions are assigned to roles and subjects are granted permissions by being assigned to roles.",
      phrasings: {
        governance: "An access control framework that aligns permissions with job functions, simplifying administration by granting access through role membership rather than individual assignment.",
        operational: "Access management through role membership — users inherit the permissions of their assigned roles rather than receiving individual permission grants.",
        technical: "An access control model where subjects receive permissions through role assignment; permissions are defined for roles, not individuals.",
        executive: "Assigning access based on job title — everyone with the same role gets the same access, making management simpler."
      },
      scenario: "All Finance department employees were assigned the 'Finance Analyst' role, which automatically granted them access to the financial reporting system without individual permission configuration.",
      distortions: [
        "job-function-based access model",
        "role-based permission assignment",
        "role membership access control",
        "job title permission inheritance model",
        "function-based access grant system",
        "role-derived permission model",
        "job-role permission assignment framework",
        "access control through role membership",
        "function-based access permission model",
        "role-assigned access permission system"
      ],
      traps: ["d5-abac", "d5-mac", "d5-dac"],
      trapExplanation: "RBAC = permissions tied to ROLES (job function). ABAC = permissions based on ATTRIBUTES (context, environment). MAC = permissions based on LABELS (classification). DAC = permissions set by the DATA OWNER. RBAC is the most common enterprise model."
    },

    {
      id: "d5-mac",
      domain: 5,
      term: "Mandatory Access Control",
      definition: "An access control model where access decisions are made by the system based on labels and are not modifiable by individual users.",
      phrasings: {
        governance: "A system-enforced access control model where a central authority defines access rules based on classification labels, and users cannot override these controls.",
        operational: "Access control enforced by the operating system based on sensitivity labels — users cannot grant or modify access permissions.",
        technical: "An access control model using subject clearance levels and object classification labels to enforce access decisions independently of user control.",
        executive: "A security model where the system — not the user — decides who can access data, based on official classification labels."
      },
      scenario: "The classified government system prevented users from sharing documents with colleagues at lower clearance levels, regardless of the users' own wishes or instructions.",
      distortions: [
        "label-based system-enforced access control",
        "classification-based mandatory access model",
        "system-determined access control model",
        "non-discretionary label-based access",
        "central authority access control model",
        "clearance-label access enforcement",
        "system-enforced classification access model",
        "non-user-modifiable access control",
        "label-based mandatory access enforcement",
        "classification-enforced access control"
      ],
      traps: ["d5-dac", "d5-rbac"],
      trapExplanation: "MAC = SYSTEM-ENFORCED based on labels (users cannot change). DAC = OWNER-CONTROLLED (users decide who can access their resources). RBAC = ROLE-BASED (permissions tied to job functions). MAC is non-discretionary — the system has final say."
    },

    {
      id: "d5-dac",
      domain: 5,
      term: "Discretionary Access Control",
      definition: "An access control model where resource owners determine access permissions for their owned objects.",
      phrasings: {
        governance: "An access control model that delegates access permission decisions to the owners of resources, who may grant access at their discretion.",
        operational: "Access control where the person who creates or owns a file can share it with others — as implemented in standard operating system file permissions.",
        technical: "An access control model based on ownership where subjects controlling a resource can grant permissions to other subjects using ACLs.",
        executive: "The standard model where employees decide who can access the files they create — like sharing a document with a colleague."
      },
      scenario: "The document author used the operating system's sharing settings to grant read access to specific colleagues and write access to their team.",
      distortions: [
        "owner-controlled access permission model",
        "discretionary resource sharing model",
        "owner-determined access control",
        "resource owner permission assignment",
        "ownership-based access grant model",
        "creator-controlled access permission",
        "owner-discretion access model",
        "resource sharing by owner decision",
        "owner-assigned access control model",
        "discretionary owner permission grant"
      ],
      traps: ["d5-mac", "d5-rbac"],
      trapExplanation: "DAC = OWNER decides (discretionary). MAC = SYSTEM decides based on labels (non-discretionary). DAC is more flexible but less secure — users can accidentally share sensitive data. MAC is more rigid and secure but less user-friendly."
    },

    // ── DOMAIN 6: Security Assessment and Testing ─────────────────────────

    {
      id: "d6-penetration-testing",
      domain: 6,
      term: "Penetration Testing",
      definition: "An authorized simulated attack against a system to evaluate its security by actively exploiting vulnerabilities.",
      phrasings: {
        governance: "An authorized security evaluation that simulates real-world attacks to identify exploitable weaknesses before malicious actors do.",
        operational: "A security test where testers actively attempt to exploit vulnerabilities — not just identify them — to determine real-world exploitability.",
        technical: "An authorized offensive security assessment using real attack techniques against defined targets to determine exploitability and impact.",
        executive: "Hiring ethical hackers to try to break into our systems to find out what a real attacker could do."
      },
      scenario: "The security team contracted an ethical hacking firm to attempt to compromise the production environment using real attack techniques within a defined scope.",
      distortions: [
        "authorized simulated attack assessment",
        "controlled exploitation security test",
        "authorized attack simulation and exploitation",
        "offensive security assessment with exploitation",
        "ethical attack simulation engagement",
        "authorized vulnerability exploitation test",
        "real-world attack simulation under contract",
        "authorized offensive security evaluation",
        "controlled attack-simulation security test",
        "authorized exploitation-based security assessment"
      ],
      traps: ["d6-vulnerability-assessment", "d6-red-team"],
      trapExplanation: "Pen testing = ACTIVE EXPLOITATION within defined scope with a specific report objective. Vulnerability assessment = IDENTIFY weaknesses without exploiting. Red team = full attack simulation without defined scope limits. Pen test is scoped; red team is unrestricted."
    },

    {
      id: "d6-vulnerability-assessment",
      domain: 6,
      term: "Vulnerability Assessment",
      definition: "A process that identifies, quantifies, and prioritizes vulnerabilities in a system without attempting to exploit them.",
      phrasings: {
        governance: "A systematic review of systems to identify, classify, and prioritize security weaknesses without conducting exploitation activities.",
        operational: "Scanning and reviewing systems to find security weaknesses and rank them by severity for remediation planning.",
        technical: "An automated and manual process of identifying configuration flaws, missing patches, and software vulnerabilities using scanning tools and analysis.",
        executive: "Finding and ranking security weaknesses in our systems so we know what to fix first — without actually breaking anything."
      },
      scenario: "The security team ran automated scanners and manual reviews across all production systems to identify unpatched software and configuration weaknesses, then prioritized them by severity.",
      distortions: [
        "security weakness identification and ranking",
        "system vulnerability identification process",
        "security gap identification and prioritization",
        "non-exploitative security weakness scan",
        "security weakness discovery and classification",
        "system security gap identification",
        "vulnerability discovery and severity ranking",
        "security deficiency identification process",
        "security weakness scanning and prioritization",
        "system security weakness identification and rating"
      ],
      traps: ["d6-penetration-testing", "d6-security-audit"],
      trapExplanation: "Vulnerability assessment = IDENTIFY and RANK (no exploitation). Penetration test = ACTIVELY EXPLOIT vulnerabilities. Security audit = compliance verification against a standard. VA finds weaknesses; pen test proves they're exploitable."
    },

    {
      id: "d6-black-box",
      domain: 6,
      term: "Black Box Testing",
      definition: "A testing approach where the tester has no prior knowledge of the internal architecture or design of the system under test.",
      phrasings: {
        governance: "A testing methodology that simulates an external attacker's perspective by providing no advance knowledge of the target system's internals.",
        operational: "Testing conducted without any knowledge of the system's internal design, simulating the position of an uninformed external attacker.",
        technical: "A testing methodology in which the tester operates with only the information available to an external adversary — no source code, no architecture diagrams.",
        executive: "Testing a system the way a real outside hacker would — with no inside knowledge about how it's built."
      },
      scenario: "The external assessment team was given only the public IP addresses and told to attempt compromise — no documentation, architecture diagrams, or source code was provided.",
      distortions: [
        "zero-knowledge testing approach",
        "external attacker simulation testing",
        "no-prior-knowledge security test",
        "uninformed external perspective testing",
        "external adversary simulation test",
        "zero-knowledge attack simulation",
        "external perspective security assessment",
        "no-internal-knowledge testing methodology",
        "external attacker viewpoint testing",
        "uninformed tester assessment methodology"
      ],
      traps: ["d6-white-box", "d6-gray-box"],
      trapExplanation: "Black box = NO knowledge (external attacker simulation). White box = FULL knowledge (source code, architecture). Gray box = PARTIAL knowledge (some documentation, credentials). The box color indicates how much knowledge the tester has."
    },

    {
      id: "d6-white-box",
      domain: 6,
      term: "White Box Testing",
      definition: "A testing approach where the tester has full knowledge of the system's internal architecture, source code, and design.",
      phrasings: {
        governance: "A security testing methodology that provides the tester with complete access to system documentation, source code, and architecture to maximize coverage.",
        operational: "Testing conducted with full knowledge of the system internals — source code, network diagrams, credentials — enabling comprehensive coverage.",
        technical: "A testing methodology where the tester has complete visibility into source code, architecture, configuration, and internal design.",
        executive: "Testing a system with full inside knowledge — testers can see exactly how it's built, finding more issues in less time."
      },
      scenario: "The development security team reviewed the source code, architecture diagrams, and configuration files with full access to find embedded vulnerabilities before the application deployed.",
      distortions: [
        "full-knowledge security testing approach",
        "complete-access testing methodology",
        "internal knowledge security test",
        "source code visible testing approach",
        "full-information security assessment",
        "complete internal access test",
        "full transparency security evaluation",
        "source code and architecture testing",
        "complete system knowledge test",
        "full-access internal security assessment"
      ],
      traps: ["d6-black-box", "d6-gray-box"],
      trapExplanation: "White box = FULL knowledge (most comprehensive). Black box = NO knowledge (most realistic external simulation). Gray box = PARTIAL knowledge (compromise between realism and thoroughness). White box finds more issues; black box better simulates real attackers."
    },

    {
      id: "d6-security-audit",
      domain: 6,
      term: "Security Audit",
      definition: "A systematic evaluation of an organization's security posture against a defined standard, policy, or regulatory requirement.",
      phrasings: {
        governance: "A formal, structured assessment that measures the organization's security controls against defined requirements or standards, producing evidence of compliance.",
        operational: "A methodical review verifying that security controls are implemented, operating as designed, and meeting the required standard.",
        technical: "A systematic evaluation of security configuration, processes, and controls against defined benchmarks or regulatory requirements.",
        executive: "A formal review that checks whether our security practices comply with required standards and identifies gaps."
      },
      scenario: "An independent auditor evaluated the organization's security controls against ISO 27001 requirements, documenting findings and providing a compliance assessment report.",
      distortions: [
        "systematic security compliance evaluation",
        "formal security standards assessment",
        "structured security control review",
        "security compliance verification process",
        "formal security posture review",
        "standards-based security evaluation",
        "structured security requirement verification",
        "formal security standards conformance review",
        "independent security control assessment",
        "systematic security requirement evaluation"
      ],
      traps: ["d6-penetration-testing", "d6-vulnerability-assessment"],
      trapExplanation: "Security audit = COMPLIANCE VERIFICATION against a standard (ISO 27001, PCI-DSS). VA = IDENTIFY weaknesses. Pen test = EXPLOIT weaknesses. Audits answer 'Are we compliant?' — not 'Can we be hacked?'"
    },

    // ── DOMAIN 7: Security Operations ─────────────────────────────────────

    {
      id: "d7-incident-response",
      domain: 7,
      term: "Incident Response",
      definition: "The organized approach to managing and addressing the aftermath of a security breach or cyberattack.",
      phrasings: {
        governance: "The structured process for detecting, analyzing, containing, and recovering from security incidents in accordance with organizational policy.",
        operational: "The defined set of actions taken when a security event is detected — from initial triage through containment, eradication, recovery, and lessons learned.",
        technical: "A documented lifecycle process: Preparation → Identification → Containment → Eradication → Recovery → Lessons Learned.",
        executive: "The process of detecting, managing, and recovering from security incidents in a structured, minimally-damaging way."
      },
      scenario: "When the SOC confirmed the breach, the team executed their formal plan — isolating affected systems, preserving evidence, notifying stakeholders, and beginning recovery.",
      distortions: [
        "security breach response process",
        "security event management lifecycle",
        "breach containment and recovery process",
        "security incident handling framework",
        "structured security event response",
        "breach detection and recovery lifecycle",
        "security event management process",
        "organized breach response procedure",
        "security incident lifecycle management",
        "structured breach response methodology"
      ],
      traps: ["d7-bcp", "d7-drp"],
      trapExplanation: "Incident response = reactive to a SECURITY EVENT (breach, attack). BCP = maintaining business operations during ANY disruption. DRP = recovering IT systems after a disaster. IR is security-focused; BCP/DRP are business continuity-focused."
    },

    {
      id: "d7-chain-of-custody",
      domain: 7,
      term: "Chain of Custody",
      definition: "A documented record tracking the collection, transfer, and handling of evidence to ensure its integrity and admissibility.",
      phrasings: {
        governance: "The documentation and procedures that ensure evidence integrity by recording every individual who handles, transfers, or accesses it.",
        operational: "The unbroken, documented trail showing who had evidence, when, and what they did with it — required for legal admissibility.",
        technical: "Formally documented evidence handling records including hash values, timestamps, and custodian records for every transfer or access.",
        executive: "The documented record proving that evidence has not been tampered with since it was collected."
      },
      scenario: "Every forensic image was hash-verified, sealed, and accompanied by a signed handling log documenting each person who accessed the evidence and when.",
      distortions: [
        "evidence handling documentation record",
        "evidence integrity tracking process",
        "evidence custody documentation trail",
        "forensic evidence handling record",
        "evidence transfer and handling documentation",
        "legal evidence integrity documentation",
        "evidence custodian record",
        "unbroken evidence documentation trail",
        "evidence transfer audit record",
        "forensic evidence handling integrity record"
      ],
      traps: ["d7-forensic-investigation", "d5-non-repudiation"],
      trapExplanation: "Chain of custody = DOCUMENTATION of WHO handled evidence and WHEN — ensuring admissibility. Forensic investigation = the PROCESS of collecting and analyzing evidence. Chain of custody is a specific documentation requirement within forensics."
    },

    {
      id: "d7-rto",
      domain: 7,
      term: "Recovery Time Objective",
      definition: "The maximum acceptable time period within which a system or process must be restored after a disruption.",
      phrasings: {
        governance: "The executive-approved maximum duration of tolerable downtime for a critical system before business impact becomes unacceptable.",
        operational: "The target time within which the IT team must restore a system to operation after a failure or disaster.",
        technical: "The maximum acceptable system downtime, used to design recovery architecture and determine replication and failover requirements.",
        executive: "How long we can afford to have a critical system offline before the business impact becomes unacceptable."
      },
      scenario: "The board approved a 4-hour maximum downtime for the payment processing system, requiring the technical team to design failover capabilities accordingly.",
      distortions: [
        "maximum acceptable downtime duration",
        "system restoration time target",
        "acceptable outage duration limit",
        "recovery duration objective",
        "maximum tolerable outage period",
        "system availability restoration target",
        "downtime tolerance limit",
        "maximum acceptable system unavailability",
        "restoration time target for critical systems",
        "maximum allowable disruption duration"
      ],
      traps: ["d7-rpo", "d7-mttr"],
      trapExplanation: "RTO = how long you can be DOWN (time objective). RPO = how much DATA you can lose (data objective). MTTR = actual historical average time to repair. RTO is a target; MTTR is a measurement. RTO ≥ MTTR or you're not meeting your recovery objective."
    },

    {
      id: "d7-rpo",
      domain: 7,
      term: "Recovery Point Objective",
      definition: "The maximum acceptable amount of data loss measured in time — how far back the backup or replication must reach.",
      phrasings: {
        governance: "The executive-approved maximum tolerable data loss, expressed as the age of data that must be recoverable after a disruption.",
        operational: "The maximum age of backup data acceptable for recovery — determining how frequently data must be backed up.",
        technical: "The maximum acceptable data loss expressed as a time interval, used to determine backup frequency and replication lag requirements.",
        executive: "How much data we can afford to lose — if we can tolerate losing one day of data, our RPO is 24 hours."
      },
      scenario: "Financial regulations required the organization to be able to recover transaction data to within 15 minutes of any failure event, driving a continuous replication architecture.",
      distortions: [
        "maximum acceptable data loss period",
        "data recovery age tolerance",
        "maximum tolerable data loss window",
        "backup recency requirement",
        "acceptable data loss time threshold",
        "maximum data age at recovery",
        "tolerable data loss time interval",
        "backup freshness requirement",
        "data recovery recency objective",
        "maximum tolerable historical data loss"
      ],
      traps: ["d7-rto", "d7-mttr"],
      trapExplanation: "RPO = how much DATA you can lose (measured in time). RTO = how long you can be DOWN. RPO drives backup frequency; RTO drives recovery speed. They're independent — a 1-hour RPO doesn't require a 1-hour RTO."
    },

    {
      id: "d7-bcp",
      domain: 7,
      term: "Business Continuity Planning",
      definition: "The proactive planning process ensuring critical business functions continue during and after a disruption.",
      phrasings: {
        governance: "The executive-level planning process ensuring organizational mission-critical functions can continue operating through any significant disruption.",
        operational: "The set of plans and procedures enabling the organization to continue delivering critical services during an adverse event.",
        technical: "The planning framework addressing people, process, and technology requirements to maintain business operations during disruptions.",
        executive: "Planning how the business keeps running during a major disruption — not just how IT recovers, but how the whole organization continues operating."
      },
      scenario: "The organization documented how payroll, customer service, and regulatory reporting would continue to operate even if the primary datacenter became unavailable for an extended period.",
      distortions: [
        "critical function continuity planning",
        "operational continuity framework",
        "business resilience planning",
        "mission continuity planning process",
        "critical service continuity framework",
        "operational disruption planning",
        "business operations continuity framework",
        "critical business function continuity planning",
        "organizational resilience planning process",
        "disruption management and continuity planning"
      ],
      traps: ["d7-drp", "d7-incident-response"],
      trapExplanation: "BCP = BUSINESS continuity (keeping the whole organization functioning). DRP = IT/DISASTER recovery (restoring technical systems). IR = SECURITY incident response (responding to security events). BCP is the broadest; DRP is a technical subset of BCP."
    },

    {
      id: "d7-drp",
      domain: 7,
      term: "Disaster Recovery Plan",
      definition: "A documented process for recovering IT systems, applications, and data following a disaster.",
      phrasings: {
        governance: "The technical recovery plan specifying procedures to restore IT systems, infrastructure, and data to operational status following a disaster.",
        operational: "A documented playbook for restoring systems, data, and infrastructure after a catastrophic failure or disaster event.",
        technical: "Detailed procedures for restoring infrastructure, replicating data, and resuming IT service delivery within defined RTO and RPO objectives.",
        executive: "The IT team's plan for getting systems back online after a major failure or disaster."
      },
      scenario: "Following the datacenter fire, the IT team executed the documented procedures to activate the warm standby site and restore services within the approved recovery time window.",
      distortions: [
        "IT system recovery procedures",
        "technical disaster recovery playbook",
        "system restoration after disaster",
        "IT service recovery planning",
        "technical recovery procedures document",
        "systems restoration plan",
        "IT infrastructure recovery documentation",
        "disaster-triggered IT recovery plan",
        "system recovery procedure documentation",
        "technical restoration plan after disruption"
      ],
      traps: ["d7-bcp", "d7-incident-response"],
      trapExplanation: "DRP = IT/TECHNICAL system recovery after a disaster. BCP = BUSINESS-WIDE continuity (people, processes, technology). DRP is a technical component within BCP. BCP answers 'how does the business survive?' — DRP answers 'how do our systems come back?'"
    },

    // ── DOMAIN 8: Software Development Security ───────────────────────────

    {
      id: "d8-sdlc",
      domain: 8,
      term: "Secure Software Development Lifecycle",
      definition: "An approach to software development that integrates security activities and controls at every phase of the development process.",
      phrasings: {
        governance: "A development governance framework requiring that security requirements, testing, and review be embedded at every stage of software creation.",
        operational: "The practice of integrating security activities — threat modeling, secure coding, testing — into each phase of the development lifecycle rather than as an afterthought.",
        technical: "A development methodology that incorporates security requirements, design reviews, code analysis, and penetration testing at each SDLC phase.",
        executive: "Building security into software from the start rather than trying to bolt it on at the end."
      },
      scenario: "The development organization required threat modeling during design, static analysis during coding, and penetration testing before release — integrating security at each phase.",
      distortions: [
        "security-integrated development process",
        "development lifecycle with embedded security",
        "security-in-development lifecycle approach",
        "development phase security integration",
        "embedded security development framework",
        "security-by-design development process",
        "development lifecycle security integration framework",
        "phase-integrated security development approach",
        "security-embedded software development lifecycle",
        "development security integration methodology"
      ],
      traps: ["d8-devsecops", "d1-threat-modeling"],
      trapExplanation: "Secure SDLC = security integrated into the DEVELOPMENT PROCESS (phases). DevSecOps = security integrated into CI/CD PIPELINES (automation). Threat modeling = a SPECIFIC ACTIVITY within secure SDLC. Secure SDLC is the process framework; DevSecOps is the operational implementation."
    },

    {
      id: "d8-devsecops",
      domain: 8,
      term: "DevSecOps",
      definition: "The practice of integrating security into DevOps pipelines, automating security controls throughout the CI/CD process.",
      phrasings: {
        governance: "An organizational model that removes the separation between development, security, and operations by integrating security responsibility into automated delivery pipelines.",
        operational: "Embedding automated security testing, code analysis, and compliance checks directly into the CI/CD pipeline so security keeps pace with delivery speed.",
        technical: "The integration of SAST, DAST, SCA, and secret scanning into automated build and deployment pipelines, with shared security responsibility across development teams.",
        executive: "Making security part of the automated delivery process so that building and deploying software automatically includes security checks."
      },
      scenario: "The engineering team configured their CI/CD pipeline to automatically run static analysis, dependency scanning, and secret detection on every code commit before deployment.",
      distortions: [
        "security-integrated delivery pipeline",
        "automated pipeline security integration",
        "security embedded in delivery automation",
        "CI/CD security automation approach",
        "automated security in delivery process",
        "shared security responsibility in development",
        "pipeline-integrated security automation",
        "security automation in software delivery",
        "continuous security in delivery pipeline",
        "automated security gate in deployment process"
      ],
      traps: ["d8-sdlc", "d8-static-analysis"],
      trapExplanation: "DevSecOps = security in CI/CD AUTOMATION (operational implementation). Secure SDLC = security in DEVELOPMENT PROCESS PHASES (governance framework). Static analysis = a SPECIFIC TOOL used within DevSecOps. DevSecOps is the cultural and automation model."
    },

    {
      id: "d8-input-validation",
      domain: 8,
      term: "Input Validation",
      definition: "The process of verifying that all data inputs meet defined format, type, length, and content requirements before processing.",
      phrasings: {
        governance: "A software security control requiring that all untrusted data be validated against defined rules before being processed by the application.",
        operational: "Checking that user-supplied or external data conforms to expected formats and is safe to process before it reaches application logic.",
        technical: "Server-side verification of input data against whitelisted formats, data types, length limits, and content rules to prevent injection attacks.",
        executive: "Checking that data entering our systems is what it's supposed to be before we process it — preventing attacks that exploit unexpected input."
      },
      scenario: "The application framework validated all user-submitted form data against a whitelist of acceptable formats and rejected any input containing SQL metacharacters before processing.",
      distortions: [
        "data entry verification before processing",
        "untrusted data validation control",
        "input data verification process",
        "user data safety verification",
        "entry point data validation control",
        "application input verification process",
        "user-supplied data verification mechanism",
        "external data format verification",
        "application boundary data validation",
        "untrusted input verification mechanism"
      ],
      traps: ["d8-sql-injection", "d8-xss"],
      trapExplanation: "Input validation is the PREVENTIVE CONTROL. SQL injection and XSS are ATTACKS that result from missing or inadequate input validation. Proper input validation prevents both. The control comes first; the attacks are what happens without it."
    },

    {
      id: "d8-sql-injection",
      domain: 8,
      term: "SQL Injection",
      definition: "An attack that inserts malicious SQL code into application inputs to manipulate or access the backend database.",
      phrasings: {
        governance: "An application-layer attack exploiting insufficient input validation to insert unauthorized database commands through user-supplied inputs.",
        operational: "An attacker who enters SQL commands into a web form to access, modify, or delete database records beyond their authorized scope.",
        technical: "A code injection technique where malicious SQL statements are inserted into application input fields and executed by the database engine.",
        executive: "An attack where someone tricks a website into running unauthorized database commands by typing them into an input field."
      },
      scenario: "By entering a crafted string in the login form, the attacker caused the database to return all user records without requiring valid credentials.",
      distortions: [
        "database command injection attack",
        "malicious query insertion attack",
        "unauthorized database query injection",
        "SQL command insertion via input fields",
        "database manipulation through input injection",
        "backend query injection attack",
        "unauthorized database access through input",
        "application database command injection",
        "SQL code insertion vulnerability exploitation",
        "malicious database command via input"
      ],
      traps: ["d8-xss", "d8-input-validation"],
      trapExplanation: "SQL injection = attacks the DATABASE through input fields. XSS = attacks OTHER USERS via injected scripts in the browser. Both are input injection attacks, but SQL injection targets the database; XSS targets users of the application."
    },

    {
      id: "d8-xss",
      domain: 8,
      term: "Cross-Site Scripting",
      definition: "An attack that injects malicious scripts into web content that is then executed in other users' browsers.",
      phrasings: {
        governance: "An application vulnerability where insufficient output encoding allows attackers to inject scripts that execute in other users' browser contexts.",
        operational: "An attacker who stores or reflects malicious JavaScript in a website, causing it to execute in other users' browsers when they view the page.",
        technical: "A client-side code injection vulnerability where malicious scripts bypass the same-origin policy by being served from a trusted origin.",
        executive: "An attack where a hacker plants code on a website that runs in other users' browsers, potentially stealing their sessions or data."
      },
      scenario: "The attacker stored a script in the forum's comment section that executed in any authenticated user's browser, silently capturing their session tokens.",
      distortions: [
        "client-side script injection attack",
        "browser-executed malicious script attack",
        "user browser script injection vulnerability",
        "stored and reflected script injection",
        "malicious script execution in user browsers",
        "client-side code injection vulnerability",
        "browser context malicious script execution",
        "web page script injection attack",
        "other-user browser attack via script injection",
        "malicious browser-executed script vulnerability"
      ],
      traps: ["d8-sql-injection", "d8-input-validation"],
      trapExplanation: "XSS = targets OTHER USERS' browsers with injected scripts. SQL injection = targets the DATABASE. XSS abuses trust users have in a website; SQL injection abuses trust the database has in the application."
    },

    {
      id: "d8-buffer-overflow",
      domain: 8,
      term: "Buffer Overflow",
      definition: "An attack that writes data beyond the allocated memory buffer boundary, potentially allowing code execution or system compromise.",
      phrasings: {
        governance: "A low-level application vulnerability caused by insufficient bounds checking, enabling attackers to overwrite memory and potentially execute arbitrary code.",
        operational: "An attack where more data is sent to a program than its allocated memory can hold, causing adjacent memory to be overwritten.",
        technical: "A memory corruption vulnerability where input exceeding the allocated buffer size overwrites adjacent stack or heap memory, potentially redirecting execution flow.",
        executive: "An attack that exploits poor memory management in applications to force them to run the attacker's code."
      },
      scenario: "The attacker sent an oversized network packet that overflowed the program's input buffer and overwrote the return address, redirecting execution to shellcode.",
      distortions: [
        "memory boundary overwrite attack",
        "buffer bounds overrun exploit",
        "memory overflow exploitation",
        "data overrun memory attack",
        "adjacent memory overwrite exploit",
        "bounds-exceeded memory write attack",
        "memory allocation boundary exploitation",
        "program memory overflow attack",
        "stack memory overwrite exploitation",
        "input bounds violation memory attack"
      ],
      traps: ["d8-input-validation", "d8-race-condition"],
      trapExplanation: "Buffer overflow = MEMORY BOUNDARY violation (writes beyond allocated space). Race condition = TIMING vulnerability (two processes compete over a resource). Both are software vulnerabilities but exploit entirely different mechanisms."
    },

    {
      id: "d8-race-condition",
      domain: 8,
      term: "Race Condition",
      definition: "A software vulnerability where the timing of two concurrent operations creates an exploitable window between a security check and its use.",
      phrasings: {
        governance: "A concurrency-related software vulnerability where the timing gap between a security check and its dependent action can be exploited.",
        operational: "A flaw where an attacker can modify a condition between when it is checked and when it is used, bypassing security controls.",
        technical: "A TOCTOU (Time-of-Check to Time-of-Use) vulnerability where concurrent execution creates an exploitable window between authorization check and resource access.",
        executive: "A timing attack where an attacker exploits the gap between when a security check passes and when the protected action actually executes."
      },
      scenario: "The attacker replaced the target file with a symbolic link in the brief window between the application's permission check and its actual file write operation.",
      distortions: [
        "check-to-use timing vulnerability",
        "concurrent execution timing exploit",
        "TOCTOU timing vulnerability",
        "timing gap security exploit",
        "concurrency timing attack",
        "check-use window exploitation",
        "concurrent access timing flaw",
        "security check timing vulnerability",
        "authorization gap timing exploit",
        "time-of-check time-of-use flaw"
      ],
      traps: ["d8-buffer-overflow", "d8-input-validation"],
      trapExplanation: "Race condition = TIMING between check and use (TOCTOU). Buffer overflow = MEMORY BOUNDS violation. Race conditions are concurrency vulnerabilities; buffer overflows are memory management vulnerabilities. Different root causes; different mitigations."
    }

  ]; // end ALL

  const DOMAIN_LABELS = {
    1: "Security and Risk Management",
    2: "Asset Security",
    3: "Security Architecture and Engineering",
    4: "Communication and Network Security",
    5: "Identity and Access Management",
    6: "Security Assessment and Testing",
    7: "Security Operations",
    8: "Software Development Security"
  };

  function getAll() {
    return ALL;
  }

  function getByDomain(domain) {
    const d = parseInt(domain, 10);
    if (!d) return ALL;
    return ALL.filter((c) => c.domain === d);
  }

  function getById(id) {
    return ALL.find((c) => c.id === id) || null;
  }

  function getDomains() {
    return DOMAIN_LABELS;
  }

  return { getAll, getByDomain, getById, getDomains };
})();
