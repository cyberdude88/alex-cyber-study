# CISSP Stem Fix Progress

## Summary
- Total items with phrase: 603
- Fixed (phrase removed only): 383
- Remaining (need qualifier + phrase removal): 220

## Status
- Phase 1 (safe removals): COMPLETE — 383 items fixed in bank
- Phase 2 (qualifier rewrites): TODO — {len(needs_rewrite)} items below

## What Codex needs to do (Phase 2)

For each item below:
1. Read `current_stem`
2. Remove 'Pick the option that best aligns with CISSP practice.'
3. Add an appropriate qualifier (BEST, FIRST, MOST appropriate) to the question
   - Decision/action stems → BEST action / MOST appropriate
   - Sequencing stems (what to do next/first) → FIRST
   - Judgment between competing approaches → MOST appropriate
4. Update the item's `stem` field in `cat/question-bank.sample.json`
5. After all edits, run validation:
   `python3 scripts/validate_cat_bank.py cat/question-bank.sample.json`

## Bank file
`cat/question-bank.sample.json`

## Items needing qualifier rewrite

### [1/220] `d1-q2__v1`
**Domain:** 1 Security and Risk Management
**Current stem (phrase removed):**
> In this situation, during an annual board risk briefing, a CISO must quantify the expected yearly financial exposure from a recurring ransomware threat targeting the organization's primary application server. Internal records show the total recovery and replacement cost for that server is $200,000. Forensic analysis of prior incidents indicates the threat typically destroys or encrypts 40% of the server's value when it successfully executes. Incident frequency data shows this class of threat has materialized, on average, once every two years. What figure should the CISO present to the board as the expected annualized loss from this threat?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [2/220] `d1-q2__v2`
**Domain:** 1 Security and Risk Management
**Current stem (phrase removed):**
> During an annual board risk briefing, a CISO must quantify the expected yearly financial exposure from a recurring ransomware threat targeting the organization's primary application server. Internal records show the total recovery and replacement cost for that server is $200,000. Forensic analysis of prior incidents indicates the threat typically destroys or encrypts 40% of the server's value when it successfully executes. Incident frequency data shows this class of threat has materialized, on average, once every two years. What figure should the CISO present to the board as the expected annualized loss from this threat?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [3/220] `d1-q2__v3`
**Domain:** 1 Security and Risk Management
**Current stem (phrase removed):**
> From a CISSP perspective, during an annual board risk briefing, a CISO must quantify the expected yearly financial exposure from a recurring ransomware threat targeting the organization's primary application server. Internal records show the total recovery and replacement cost for that server is $200,000. Forensic analysis of prior incidents indicates the threat typically destroys or encrypts 40% of the server's value when it successfully executes. Incident frequency data shows this class of threat has materialized, on average, once every two years. What figure should the CISO present to the board as the expected annualized loss from this threat?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [4/220] `d3-q9__v3`
**Domain:** 3 Security Architecture and Engineering
**Current stem (phrase removed):**
> From a CISSP perspective, a data center is designing physical security zones. The server room containing production systems should be classified as which type of zone requiring the STRONGEST access controls?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [5/220] `d3-q15__v3`
**Domain:** 3 Security Architecture and Engineering
**Current stem (phrase removed):**
> A hardware security module vendor discovers that their device leaks exploitable information through measurable power fluctuations during AES encryption operations. An academic researcher demonstrates full private key recovery using statistical analysis of power traces collected across thousands of encryption cycles on the same device. Which countermeasures should the vendor implement to address THIS specific attack class?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [6/220] `d4-q8__v2`
**Domain:** 4 Communication and Network Security
**Current stem (phrase removed):**
> As the security lead, a cloud-native organization adopts a zero trust architecture. An employee accesses a critical application from an approved corporate device, but the connection originates from an unusual geographic location at 3 AM. Under zero trust, what should happen?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [7/220] `d5-q12__v1`
**Domain:** 5 Identity and Access Management
**Current stem (phrase removed):**
> In this situation, an organization adopts a zero trust identity model. When a user with a valid session token accesses a sensitive financial system from the same device they normally use, but the device's security posture has degraded (antivirus definitions are 14 days out of date), what should the policy engine do?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [8/220] `d5-q12__v2`
**Domain:** 5 Identity and Access Management
**Current stem (phrase removed):**
> As the security lead, an organization adopts a zero trust identity model. When a user with a valid session token accesses a sensitive financial system from the same device they normally use, but the device's security posture has degraded (antivirus definitions are 14 days out of date), what should the policy engine do?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [9/220] `d7-q11__v3`
**Domain:** 7 Security Operations
**Current stem (phrase removed):**
> An e-commerce company's payment database has an RPO of 1 hour. During a ransomware attack, the last clean backup is from 6 hours before detection. What does this indicate about the organization's backup strategy?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [10/220] `d8-q2__v2`
**Domain:** 8 Software Development Security
**Current stem (phrase removed):**
> In this situation, a web application accepts a user-supplied customer ID in an SQL query without sanitization: SELECT * FROM orders WHERE customer_id = '[user_input]'. An attacker enters: 1 OR 1=1 --. Which vulnerability is being exploited?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [11/220] `d8-q2__v3`
**Domain:** 8 Software Development Security
**Current stem (phrase removed):**
> In this situation, a web application accepts a user-supplied customer ID in an SQL query without sanitization: SELECT * FROM orders WHERE customer_id = '[user_input]'. An attacker enters: 1 OR 1=1 --. Which vulnerability is being exploited?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [12/220] `d2-q24__v2`
**Domain:** 2 Asset Security
**Current stem (phrase removed):**
> Considering security governance and risk, an organization stores backup tapes off-site at a third-party facility. The tapes contain unencrypted PII. During contract renewal, the facility cannot provide SOC 2 Type II evidence or agree to security audit rights. What should the security professional recommend?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [13/220] `d3-q20__v1`
**Domain:** 3 Security Architecture and Engineering
**Current stem (phrase removed):**
> A consultant at an investment bank advises clients in competing sectors. After advising a semiconductor client, the Brewer-Nash model would restrict the consultant's access to data from which category?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [14/220] `d3-q20__v3`
**Domain:** 3 Security Architecture and Engineering
**Current stem (phrase removed):**
> A consultant at an investment bank advises clients in competing sectors. After advising a semiconductor client, the Brewer-Nash model would restrict the consultant's access to data from which category?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [15/220] `d6-q16__v2`
**Domain:** 6 Security Assessment and Testing
**Current stem (phrase removed):**
> As the security lead, a compliance analyst is evaluating the CVSS v3.1 base score for a newly discovered vulnerability. The flaw allows a remote, unauthenticated attacker to execute arbitrary code with no user interaction. The scope is changed — the attack impacts a second system beyond the vulnerable component. What CVSS base score range should the analyst expect?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [16/220] `d6-q18__v1`
**Domain:** 6 Security Assessment and Testing
**Current stem (phrase removed):**
> In this situation, a company's SOC team starts a purple team exercise. The red team simulates an APT, and the blue team defends using their current detection tools. After each red team action, both teams discuss what was detected, what was missed, and why. What distinguishes this from a standard red team engagement?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [17/220] `d6-q18__v2`
**Domain:** 6 Security Assessment and Testing
**Current stem (phrase removed):**
> A company's SOC team starts a purple team exercise. The red team simulates an APT, and the blue team defends using their current detection tools. After each red team action, both teams discuss what was detected, what was missed, and why. What distinguishes this from a standard red team engagement?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [18/220] `d6-q18__v3`
**Domain:** 6 Security Assessment and Testing
**Current stem (phrase removed):**
> In this situation, a company's SOC team starts a purple team exercise. The red team simulates an APT, and the blue team defends using their current detection tools. After each red team action, both teams discuss what was detected, what was missed, and why. What distinguishes this from a standard red team engagement?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [19/220] `d8-q23__v1`
**Domain:** 8 Software Development Security
**Current stem (phrase removed):**
> From a CISSP perspective, a code review finds that an internal admin API doesn't validate authorization on each endpoint — it checks authentication (valid JWT) but not whether the authenticated user is authorized to perform the action. An authenticated non-admin user can call admin endpoints. What vulnerability does this represent?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [20/220] `d1-q51__v3`
**Domain:** 1 Security and Risk Management
**Current stem (phrase removed):**
> A CISSP professional learns that a colleague who also holds the CISSP credential has been exfiltrating client vulnerability assessment data for personal financial gain. The professional reports this internally, but firm management decides to handle it through HR without external notification. What obligation remains under the ISC2 Code of Ethics?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [21/220] `d6-q45__v3`
**Domain:** 6 Security Assessment and Testing
**Current stem (phrase removed):**
> From a CISSP perspective, a security team is planning a penetration test that spans multiple business units and involves risk of service disruption to production systems. The team lead proposes that the primary system owner can authorize the test since they own the target. Why is this approach likely insufficient?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [22/220] `d8-q30__v1`
**Domain:** 8. Software Development Security
**Current stem (phrase removed):**
> In this situation, which option processes ensures that there is consistency between the accounting records and production environment and that unauthorized alterations to the configuration have not been made?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [23/220] `d8-q30__v3`
**Domain:** 8. Software Development Security
**Current stem (phrase removed):**
> From a CISSP perspective, which option processes ensures that there is consistency between the accounting records and production environment and that unauthorized alterations to the configuration have not been made?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [24/220] `d1-q61__v1`
**Domain:** 1. Security and Risk Management
**Current stem (phrase removed):**
> Which option is not one of the important roles that a senior manager can play on a business continuity planning team?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [25/220] `d1-q61__v2`
**Domain:** 1. Security and Risk Management
**Current stem (phrase removed):**
> Which option is not one of the important roles that a senior manager can play on a business continuity planning team?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [26/220] `d1-q61__v3`
**Domain:** 1. Security and Risk Management
**Current stem (phrase removed):**
> Which option is not one of the important roles that a senior manager can play on a business continuity planning team?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [27/220] `d1-q63__v1`
**Domain:** 1. Security and Risk Management
**Current stem (phrase removed):**
> As the security lead, an employee is investigating a security incident where it was discovered that an attacker created a fake user account to take advantage of the system vulnerability and grant administrative rights to that account. In reference to the STRIDE model, these types of attacks can be referred to as __________ and _________. (Choose TWO of the following answer options.)?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [28/220] `d1-q65__v3`
**Domain:** 1. Security and Risk Management
**Current stem (phrase removed):**
> Which option enterprises is most likely to be impacted by the provisions of FISMA?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [29/220] `d2-q34__v2`
**Domain:** 2. Asset Security
**Current stem (phrase removed):**
> An employee of an international financial institution would like to gain access to some critical customer information in order to serve a client as illustrated in the diagram below. Which option data roles will grant them access to the data they want?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [30/220] `d2-q34__v3`
**Domain:** 2. Asset Security
**Current stem (phrase removed):**
> In this situation, an employee of an international financial institution would like to gain access to some critical customer information in order to serve a client as illustrated in the diagram below. Which option data roles will grant them access to the data they want?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [31/220] `d3-q39__v2`
**Domain:** 3. Security Architecture and Engineering
**Current stem (phrase removed):**
> An employee would like to conduct threat modeling for their enterprise to improve the security of their systems. They have opted to apply the Process for Attack Simulation and Threat Analysis (PASTA) methodology, which follows a seven-step approach to identify the potential threats and vulnerabilities to a system and the available countermeasures. Using this methodology, what should the employee do first?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [32/220] `d6-q51__v3`
**Domain:** 6. Security Assessment and Testing
**Current stem (phrase removed):**
> An employee is scanning a network port of a web server used in his business. They are using an external network to run the scan because they want to get the perspective of a hacker. Which option results should worry them?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [33/220] `d6-q52__v1`
**Domain:** 6. Security Assessment and Testing
**Current stem (phrase removed):**
> An ethical hacker in a medium-sized corporation has been tasked with assessing the security of the corporation's systems and prepare a penetration test report. Which option information is not necessary for the report?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [34/220] `d6-q52__v3`
**Domain:** 6. Security Assessment and Testing
**Current stem (phrase removed):**
> An ethical hacker in a medium-sized corporation has been tasked with assessing the security of the corporation's systems and prepare a penetration test report. Which option information is not necessary for the report?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [35/220] `d7-q40__v1`
**Domain:** 7. Security Operations
**Current stem (phrase removed):**
> In this situation, which option is NOT a basic preventive measure that an enterprise can implement to ensure the security of their applications and systems?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [36/220] `d7-q40__v3`
**Domain:** 7. Security Operations
**Current stem (phrase removed):**
> Which option is NOT a basic preventive measure that an enterprise can implement to ensure the security of their applications and systems?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [37/220] `d7-q43__v1`
**Domain:** 7. Security Operations
**Current stem (phrase removed):**
> In this situation, your business has some computers that have reached the end of their lifecycle and you want to donate them to the nearest public library where they will still be useful. What should you do before giving away the computers?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [38/220] `d7-q45__v2`
**Domain:** 7. Security Operations
**Current stem (phrase removed):**
> The security officer in a medium-sized enterprise wants to deploy a deliberate false loophole that can be used to trap intruders in their systems. Which option can they utilize to achieve this?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [39/220] `d7-q45__v3`
**Domain:** 7. Security Operations
**Current stem (phrase removed):**
> The security officer in a medium-sized enterprise wants to deploy a deliberate false loophole that can be used to trap intruders in their systems. Which option can they utilize to achieve this?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [40/220] `d7-q49__v2`
**Domain:** 7. Security Operations
**Current stem (phrase removed):**
> As the security lead, which option disaster recovery tests involves team members walking through a scenario but no alterations are made to the information systems?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [41/220] `d7-q51__v1`
**Domain:** 7. Security Operations
**Current stem (phrase removed):**
> Hideo has been assigned the responsibility to assess and augment the physical security of his business. Which option approaches and controls should he apply to ensure proper enforcement?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [42/220] `d1-q73__v2`
**Domain:** 1. Security and Risk Management
**Current stem (phrase removed):**
> Your enterprise, a health service provider, has acquired a new health-based Cloud Product that registers users and collects their Personally Identifiable Information (PII). What is the first step you as a Cybersecurity Expert will do to analyze the Privacy Requirements of the new product?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [43/220] `d1-q73__v3`
**Domain:** 1. Security and Risk Management
**Current stem (phrase removed):**
> Your enterprise, a health service provider, has acquired a new health-based Cloud Product that registers users and collects their Personally Identifiable Information (PII). What is the first step you as a Cybersecurity Expert will do to analyze the Privacy Requirements of the new product?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [44/220] `d1-q79__v3`
**Domain:** 1. Security and Risk Management
**Current stem (phrase removed):**
> You are asked to initiate a Threat Modeling exercise within your enterprise. Since this is the first time the enterprise is doing this, what will be the next step after identifying the objective for the Threat Modeling exercise?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [45/220] `d2-q37__v1`
**Domain:** 2. Asset Security
**Current stem (phrase removed):**
> Your enterprise has initiated a knowledge campaign to provide free courses to all. Which option data classification categories relates most closely to the course content?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [46/220] `d2-q38__v3`
**Domain:** 2. Asset Security
**Current stem (phrase removed):**
> In this situation, your enterprise follows strict data classification policies and marks all sensitive and critical systems with appropriate data classification. However, you find that the enterprise does not mark or label the non-confidential components. What is the issue with this approach?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [47/220] `d2-q45__v2`
**Domain:** 2. Asset Security
**Current stem (phrase removed):**
> An enterprise handles regulated data for federal agencies, hospitals, and financial institutions across multiple jurisdictions. Which compliance approach is most defensible?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [48/220] `d2-q46__v2`
**Domain:** 2. Asset Security
**Current stem (phrase removed):**
> Following Asset Identification and Data Classification, what is the next step in identifying what you need to protect?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [49/220] `d3-q45__v3`
**Domain:** 3. Security Architecture and Engineering
**Current stem (phrase removed):**
> You work in a small enterprise where you find that the Senior Management has access to everything including super admin privileges to Applications, Domains, and App/Web Servers. Which option Security Principles is most likely to be violated with this approach?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [50/220] `d3-q51__v3`
**Domain:** 3. Security Architecture and Engineering
**Current stem (phrase removed):**
> You developed a web scraping script that scrapes data from a website and sends you alerts whenever anything new is added to that site. You want to deploy this script on a cloud-based environment so your script runs non-stop. Which option cloud-based models supports this requirement?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [51/220] `d3-q54__v3`
**Domain:** 3. Security Architecture and Engineering
**Current stem (phrase removed):**
> You are in the Security Management Team of the ABC Corp where you need to design the security standards for the enterprise. Which option algorithms are you most likely to select?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [52/220] `d4-q43__v3`
**Domain:** 4. Communication and Network Security
**Current stem (phrase removed):**
> Considering security governance and risk, network Segmentation is employed in most network architectures, as this provides more security and manageability for network devices and systems. Which option is not a benefit of using Micro-Segmentation?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [53/220] `d4-q44__v1`
**Domain:** 4. Communication and Network Security
**Current stem (phrase removed):**
> During a recent network attack, you found out that the existing firewall configuration allowed access to the server (10.1.1.19). Which option firewall rules did not allow for web access to the server?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [54/220] `d4-q46__v2`
**Domain:** 4. Communication and Network Security
**Current stem (phrase removed):**
> As the security lead, yao's enterprise has recently approved the budget for the Network Access Control Device, please select the features that do not match with the NAC capabilities?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [55/220] `d4-q51__v3`
**Domain:** 4. Communication and Network Security
**Current stem (phrase removed):**
> As the security lead, your Internet Service Provider (ISP) is reinstalling the physical wires in your area. As a result, large wire bundles and land digs around you. Which option cable types is least resistant to Electro Magnetic Interference (EMI)?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [56/220] `d4-q52__v2`
**Domain:** 4. Communication and Network Security
**Current stem (phrase removed):**
> In this situation, the Research and Development department has its network implemented separately as IPv6. However, the department needs to connect to the rest of the enterprise's network, which is implemented as IPv4. Which option devices will be used between the networks?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [57/220] `d5-q50__v3`
**Domain:** 5. Identity and Access Management (IAM)
**Current stem (phrase removed):**
> During Annual Access Review, the Manager finds that consultants previously given temporary accesses still have these accesses. What next step could be taken by the manager?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [58/220] `d5-q51__v1`
**Domain:** 5. Identity and Access Management (IAM)
**Current stem (phrase removed):**
> As the security lead, after implementing the Identity Management Solution for their employees, an enterprise now wants to manage Service Accounts via their IAM system. In the Identity Management (IAM) system, the Service Accounts should be associated with which of the managed identities?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [59/220] `d6-q55__v3`
**Domain:** 6. Security Assessment and Testing
**Current stem (phrase removed):**
> During an Internal Audit, several issues were found in your enterprise and the results have been presented to Senior Management. Which option decisions is least likely to be taken by Senior Management?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [60/220] `d7-q53__v3`
**Domain:** 7. Security Operations
**Current stem (phrase removed):**
> After a recent Digital Payments Server hack, law enforcement was involved to investigate the crime scene. The law enforcement team collected evidence from the affected systems. Following the evidence collection and handling best practices, from which of the following sources should data be collected first?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [61/220] `d7-q54__v3`
**Domain:** 7. Security Operations
**Current stem (phrase removed):**
> Considering security governance and risk, your enterprise's Security Administration Team recently installed an Intrusion Detection System (IDS) which will help the enterprise strengthen its attack detection capability. However, during its operation, the Administration Team encountered many false positives. Which option techniques works best to reduce the number of false positives?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [62/220] `d7-q58__v2`
**Domain:** 7. Security Operations
**Current stem (phrase removed):**
> In this situation, it has been discovered that the Chief Information Officer's (CIO) corporate account has been compromised recently with a sophisticated Whaling attack. The attackers compromised the data and encrypted the contents of the CIO's laptop which contains many confidential files. In this scenario, what is the next step that the Incident Management Team will perform?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [63/220] `d7-q60__v3`
**Domain:** 7. Security Operations
**Current stem (phrase removed):**
> Patch Tuesday is the term used to refer to when Microsoft, Adobe, Oracle, and others regularly release software patches for their software products. Which option options is the least likely reason for installing patches?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [64/220] `d8-q37__v2`
**Domain:** 8. Software Development Security
**Current stem (phrase removed):**
> ABC Inc is struggling with a source code management issue. As the development team grows, code management is becoming a big issue. Which option source code management practices is least likely to be considered a best practice?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [65/220] `d8-q39__v2`
**Domain:** 8. Software Development Security
**Current stem (phrase removed):**
> As the security lead, aBC Corp follows a Change and Configuration management process where each change request follows the Change Control Process. Align the Change Control activities in the correct order. A. Assess B. Build C. Submission of RFC D. Review E. Implement F. Test?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [66/220] `d8-q40__v3`
**Domain:** 8. Software Development Security
**Current stem (phrase removed):**
> Your enterprise uses the COTS Identity Management Software. Recently the Vendor Support Team contacted your security team informing them that there is a security patch released by the vendor. They suggested you implement it. What is the next step your security team should perform?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [67/220] `d8-q43__v1`
**Domain:** 8. Software Development Security
**Current stem (phrase removed):**
> As the security lead, arif recently found that his email address got updated on one of the social networking websites. This led to account compromise. Upon checking his browsing history, he found the URL as https://letsconnect.com/email/change?email=thatsthepriceyoupaidforfreemusic@teamail.com. What is the most likely cause for this?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [68/220] `d6-q66__v3`
**Domain:** 6. Security Assessment and Testing
**Current stem (phrase removed):**
> Considering security governance and risk, an Internet of Things (IoT) manufacturing business hires a startup to develop a custom application that lets users monitor room temperatures and send notifications on their phones. The startup firm is responsible for developing and deploying the code. Since the IoT business does not have any in-house expertise to support customer issues, they delegate these responsibilities to the startup firm. The manufacturing business wants to protect its application code in case the startup business fails to comply with its responsibilities. What type of agreement should the IoT manufacturer have in place to protect their software code?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [69/220] `d4-q53__v2`
**Domain:** 4. Communication and Network Security
**Current stem (phrase removed):**
> From a CISSP perspective, an IT department procures a firewall that will be installed between the Internet zone and the Demilitarized Zone (DMZ). The enterprise only has one public IP address assigned to it. The IT manager advises the firewall administrator to configure the firewall in such a way that all the DMZ servers should have access to the internet. Which networking concept should the administrator implement to meet the manager's requirement?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [70/220] `d5-q55__v3`
**Domain:** 5. Identity and Access Management (IAM)
**Current stem (phrase removed):**
> A Military enterprise has built a facility to test their new weapons. They have implemented biometric scanning at each access door. On a sensitivity scale of 1-20, the Crossover rate (CER) is set to 10. Given the sensitivity of the operation, the military wants to avoid false positives. Which option is the best way to enforce physical security?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [71/220] `d6-q67__v1`
**Domain:** 6. Security Assessment and Testing
**Current stem (phrase removed):**
> Soori, the newly crowned Chief Information Security Officer (CISO) of ABC Limited, is worried about a report of suspicious traffic to the business’s web applications. Moreover, he decided to hire a penetration testing business to evaluate the effectiveness of the security controls in place and further decided to share no information with the testers. What is the most appropriate option to undertake the test?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [72/220] `d6-q69__v2`
**Domain:** 6. Security Assessment and Testing
**Current stem (phrase removed):**
> XYZ Technology is looking to purchase cloud services from a local Cloud Service Provider (CSP). The business is planning to migrate its customer database to the cloud and wants to make sure the CSP has good security controls in place to protect customer data. Which DOCUMENT should the business request from the CSP that shows the effectiveness of the security controls over a period of six months?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [73/220] `d1-q80__v3`
**Domain:** 1. Security and Risk Management
**Current stem (phrase removed):**
> As the security lead, an e-commerce business plans to buy a Distributed Denial of Service (DDoS) protection service worth $240,000 for three years to protect its website. The business’s financial document indicates that the website’s asset value is $700,000. The business experiences DDoS attacks every month that lower the profit margin by one percent. What is the Annual Loss Expectancy (ALE), and should the business BUY the DDoS protection service?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [74/220] `d7-q65__v2`
**Domain:** 7. Security Operations
**Current stem (phrase removed):**
> A system engineer at an enterprise is responsible for securely deploying and configuring homemade and commercial off-the-shelf (COTS) systems as per the baseline. They exhaustively test systems in the test platform before moving them to the production environment. Moreover, they specifically change default settings and credentials, disable and enable services as per the baseline, apply patches and tests them, closes unnecessary ports, and upgrades security controls. Which option MAINLY summarizes these activities?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [75/220] `d7-q66__v2`
**Domain:** 7. Security Operations
**Current stem (phrase removed):**
> Considering security governance and risk, an enterprise has been a victim of malicious intrusions and plans to establish controls to log and continuously monitor activities of their information systems. The CISO wants to deploy host and network-based solutions that are capable of detecting intrusions, generating alerts, filtering content, and stopping evasive intrusions when necessary. What is the most effective option to meet the CISO'S needs?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [76/220] `d7-q68__v1`
**Domain:** 7. Security Operations
**Current stem (phrase removed):**
> Enterprises employ different mechanisms to understand the status of each system deployed on-premises and off-premises. Some establish threat hunting to explore possible threats to the security controls in place. Others establish scanning and penetration testing activities to discover and record possible weaknesses in their infrastructures, architectures, and systems. Some other companies even pay bug bounties to individuals who discover weaknesses in their assets. Companies perform these activities ultimately to apply security controls, updates, and patches in a timely manner. Which option MAINLY demonstrates the requirements described in the scenario?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [77/220] `d7-q68__v2`
**Domain:** 7. Security Operations
**Current stem (phrase removed):**
> Enterprises employ different mechanisms to understand the status of each system deployed on-premises and off-premises. Some establish threat hunting to explore possible threats to the security controls in place. Others establish scanning and penetration testing activities to discover and record possible weaknesses in their infrastructures, architectures, and systems. Some other companies even pay bug bounties to individuals who discover weaknesses in their assets. Companies perform these activities ultimately to apply security controls, updates, and patches in a timely manner. Which option MAINLY demonstrates the requirements described in the scenario?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [78/220] `d1-q87__v1`
**Domain:** 1. Security and Risk Management
**Current stem (phrase removed):**
> One of the new employees is found to have sent confidential client documents to her personal email. What should be the first step in handling this situation?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [79/220] `d7-q70__v3`
**Domain:** 7. Security Operations
**Current stem (phrase removed):**
> In this situation, filledCart.com is an online shopping platform that incorporates High Availability by utilizing a Load Balancer with a Sticky Session configuration. This enables efficient use of data and memory, allowing better session management. Which option options is a drawback of the Sticky Session configuration?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [80/220] `d2-q51__v2`
**Domain:** 2. Asset Security
**Current stem (phrase removed):**
> An e-commerce business in Europe collects the personal information of its customers, with their permission, when they buy a product from its website. They want to grow their business and decide to collaborate with an advertising business to send targeted advertisements that promote assorted products. To comply with General Data Protection Regulation (GDPR) requirements, how should the e-commerce business share Personally Identifiable Information (PII) with the advertising firm?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [81/220] `d2-q52__v3`
**Domain:** 2. Asset Security
**Current stem (phrase removed):**
> The CISO is concerned about proprietary information leaving the enterprise. They have decided to implement a Data Loss Prevention (DLP) program within the enterprise. What is the first step they should perform prior to implementing the DLP program?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [82/220] `d7-q74__v2`
**Domain:** 7. Security Operations
**Current stem (phrase removed):**
> A user reported an incident to the helpdesk stating that they cannot access files on their computers and are afraid that it might be a ransomware attack spreading across the network. What step should the helpdesk technician take immediately?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [83/220] `d7-q75__v1`
**Domain:** 7. Security Operations
**Current stem (phrase removed):**
> A data custodian is looking to implement a backup strategy as per the data owner's requirement. The data owner wants a full backup to be performed every Monday night, and in the event of a disaster, the data should be recoverable with a maximum of two backup tapes. What backup strategy should the custodian implement for the remaining days of the week?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [84/220] `d1-q92__v1`
**Domain:** 1. Security and Risk Management
**Current stem (phrase removed):**
> The Digital Millennium Copyright Act (DMCA) was enacted to ensure copyright owners' exclusive rights are safeguarded against infringement brought about by digital technologies like the internet. In order to be exempted from DMCA provisions, what must an Internet Service Provider (ISP) adhere to? (Select all that apply)?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [85/220] `d1-q92__v2`
**Domain:** 1. Security and Risk Management
**Current stem (phrase removed):**
> Considering security governance and risk, the Digital Millennium Copyright Act (DMCA) was enacted to ensure copyright owners' exclusive rights are safeguarded against infringement brought about by digital technologies like the internet. In order to be exempted from DMCA provisions, what must an Internet Service Provider (ISP) adhere to? (Select all that apply)?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [86/220] `d1-q93__v1`
**Domain:** 1. Security and Risk Management
**Current stem (phrase removed):**
> A ransomware enterprise is targeting smaller financial institutions across the world. The CISO of a small financial enterprise is worried about this attack and is planning to create a business continuity plan (BCP) as a long-term solution for these types of cyberattacks. What is the first step the CISO must undertake to start planning the BCP?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [87/220] `d7-q78__v1`
**Domain:** 7. Security Operations
**Current stem (phrase removed):**
> As part of the annual drilling exercise, an enterprise has activated all the resources and processes required to test the effectiveness of the Disaster Recovery Plan (DRP) the business recently established. It will require shutting down operations at the primary site and switching all operations to an alternate processing site. Moreover, all the employees will perform their duties from the recovery site during the test. What is the most appropriate option to evaluate the DRP described in this scenario?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [88/220] `d7-q81__v2`
**Domain:** 7. Security Operations
**Current stem (phrase removed):**
> An enterprise survived a major malware attack recently and applied its established incident response procedure to handle the situation. The incident response team remained composed and handled the incident superbly. Moreover, the team perfected each phase of the incident management plan as per the exercises rehearsed. Above all, the team conducted a robust root-cause analysis (RCA) and quickly restored all the systems affected by the incident. In which phase of the plan did the RCA task MAINLY occur?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [89/220] `d5-q62__v1`
**Domain:** 5. Identity and Access Management (IAM)
**Current stem (phrase removed):**
> Adam, the CTO of the business, is proposing the use of hardware-based token authentication to upgrade the security of a banking application that currently relies on a server-based authentication technique. He is concerned about the recent IT audit report on NTP time sync issues on the network. Which choice of token technology would be an UNRELIABLE choice for such environments?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [90/220] `d8-q51__v2`
**Domain:** 8. Software Development Security
**Current stem (phrase removed):**
> The Security Operation Centre (SOC) team is having issues responding to the incidents generated by the monitoring systems. The team is understaffed, hence the manager has invested in a Security Orchestration, Automation, and Response (SOAR) solution that would help his team to respond to only the high-severity incidents and automate low- and medium-severity incidents. What should the SOC team develop PRIOR to automating the process?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [91/220] `d8-q53__v1`
**Domain:** 8. Software Development Security
**Current stem (phrase removed):**
> A security-focused business needs compiler software that converts code written in a high-level programming language into an executable file. They don’t want to spend money on licensing the software and are looking for a cost-effective but secure solution. Which among the following PURCHASE MODELS would be suitable for the business?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [92/220] `d8-q54__v1`
**Domain:** 8. Software Development Security
**Current stem (phrase removed):**
> A team of financial analysts working at a stock market brokerage firm is responsible for updating the stock prices throughout the day. These prices are updated in a relational database in the backend and are presented to the platform users through a web interface. Unfortunately, two analysts updated the stock prices of a Fortune 500 business simultaneously and accidentally displayed the incorrect price to the end user. This resulted in financial losses for the brokerage firm. Which SECURITY FEATURE would have prevented these changes?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [93/220] `d8-q54__v2`
**Domain:** 8. Software Development Security
**Current stem (phrase removed):**
> Considering security governance and risk, a team of financial analysts working at a stock market brokerage firm is responsible for updating the stock prices throughout the day. These prices are updated in a relational database in the backend and are presented to the platform users through a web interface. Unfortunately, two analysts updated the stock prices of a Fortune 500 business simultaneously and accidentally displayed the incorrect price to the end user. This resulted in financial losses for the brokerage firm. Which SECURITY FEATURE would have prevented these changes?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [94/220] `d8-q57__v3`
**Domain:** 8. Software Development Security
**Current stem (phrase removed):**
> An end-user using an in-house application randomly pressed some keys on their keyboard and was presented with an error message that displayed some backend configuration. Which STEP should a software developer take to mitigate this issue?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [95/220] `d1-q100__v2`
**Domain:** 1. Security and Risk Management
**Current stem (phrase removed):**
> As the security lead, an external consultant's encrypted laptop is stolen at an airport. A prior draft sent to management appears to contain only non-classified working notes. Which preliminary classification decision is most appropriate pending full investigation?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [96/220] `d1-q101__v2`
**Domain:** 1. Security and Risk Management
**Current stem (phrase removed):**
> Considering security governance and risk, you are working as a BCP manager at an employee-first business. The business is currently planning a recovery strategy for the payroll business process, which has a Recovery Time Objective (RTO) of 4 hours. In this scenario, if the system is down for two to three workdays prior to payday, the unavailability of which of the following items poses the GREATEST risk to business resumption?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [97/220] `d6-q74__v1`
**Domain:** 6. Security Assessment and Testing
**Current stem (phrase removed):**
> In this situation, the results of a security audit indicate poor security awareness of staff members. Senior management is unhappy, and they advise the CISO to develop a metric that shows the progress in staff security awareness. What METRIC should the CISO develop to gauge improvement in staff’s security awareness?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [98/220] `d6-q74__v3`
**Domain:** 6. Security Assessment and Testing
**Current stem (phrase removed):**
> As the security lead, the results of a security audit indicate poor security awareness of staff members. Senior management is unhappy, and they advise the CISO to develop a metric that shows the progress in staff security awareness. What METRIC should the CISO develop to gauge improvement in staff’s security awareness?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [99/220] `d6-q79__v2`
**Domain:** 6. Security Assessment and Testing
**Current stem (phrase removed):**
> A business invests in a web vulnerability scanner to fix the software vulnerabilities in the development phase of the SDLC. A curious security engineer wants to test the new tool on an existing application and initiates an automated vulnerability test. The application server is overwhelmed by the traffic generated by the scanner and disables security features to keep up with resource utilization. Which option factors was NOT considered before initiating the test?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [100/220] `d6-q80__v2`
**Domain:** 6. Security Assessment and Testing
**Current stem (phrase removed):**
> In this situation, a few security vulnerabilities with a Common Vulnerability Scoring System (CVSS) score of 9 were released by the vendor. Your enterprise has a mature vulnerability management program and you have been tasked to identify and prioritize the patches. Which CVSS metric group would you use to PRIORITIZE the patches?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [101/220] `d4-q66__v1`
**Domain:** 4. Communication and Network Security
**Current stem (phrase removed):**
> Considering security governance and risk, an enterprise wants to oversee and manage the efficiency and performance of its network communications. It also wants to measure the throughput, packet loss, latency, and availability of the network. Based on measurements, priority traffic can be given more bandwidth than low-priority traffic in the enterprise. Which option concepts is MAINLY demonstrated in the scenario?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [102/220] `d3-q77__v1`
**Domain:** 3. Security Architecture and Engineering
**Current stem (phrase removed):**
> Alice uses her badge and pin code to enter a secure computer data center. A man entering behind her asks her to hold the door for him. Given the situation, how should Alice proceed?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [103/220] `d2-q62__v1`
**Domain:** 2. Asset Security
**Current stem (phrase removed):**
> Considering security governance and risk, an enterprise generates a huge volume of data each day and purges it annually without taking proper data archives to save disk space. Due to the enactment and enforcement of new regulatory laws in the jurisdiction in which it operates, it is required to present an independent audit report about sensitive data that dates back six years. However, the enterprise does not store data for that long and is facing litigation for noncompliance. Which option would have SAVED the enterprise from the lawsuit?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [104/220] `d4-q77__v2`
**Domain:** 4. Communication and Network Security
**Current stem (phrase removed):**
> Different protocols operate in the network layer (layer 3) of the OSI reference model. Which option is NOT a network layer protocol?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [105/220] `d4-q81__v3`
**Domain:** 4. Communication and Network Security
**Current stem (phrase removed):**
> In this situation, an enterprise plans to create separate network segments as per department names through the Virtual Local Area Network (VLAN). The enterprise expects some benefits as a result of the new configuration. Which option is NOT a correct statement about the VLAN configuration in the enterprise?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [106/220] `d4-q83__v2`
**Domain:** 4. Communication and Network Security
**Current stem (phrase removed):**
> In this situation, a business has been hosting sensitive data, mission-critical applications, and services in its data center for a long time. The newly hired Chief Information Security Officer (CISO) wants to make sure that all the protocols, technologies, and encryption standards used in the data center are secure and are the latest versions. Which option would pose a security risk to the enterprise if it were still found deployed in the data center?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [107/220] `d4-q83__v3`
**Domain:** 4. Communication and Network Security
**Current stem (phrase removed):**
> A business has been hosting sensitive data, mission-critical applications, and services in its data center for a long time. The newly hired Chief Information Security Officer (CISO) wants to make sure that all the protocols, technologies, and encryption standards used in the data center are secure and are the latest versions. Which option would pose a security risk to the enterprise if it were still found deployed in the data center?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [108/220] `d4-q85__v3`
**Domain:** 4. Communication and Network Security
**Current stem (phrase removed):**
> An enterprise wants to manage the collision domains and broadcast domains of each device to improve its network efficiency. Which option statements is NOT correct about collision and broadcast domains?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [109/220] `d6-q83__v1`
**Domain:** 6. Security Assessment and Testing
**Current stem (phrase removed):**
> Considering security governance and risk, an auditor is evaluating the compliance and effectiveness of measures that reduce the security risk to business-critical applications. What best describes the auditor’s action?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [110/220] `d6-q84__v3`
**Domain:** 6. Security Assessment and Testing
**Current stem (phrase removed):**
> A penetration tester is testing an online banking website, involving entering random data into the bank account number field to crash the program or make it behave unexpectedly. Which option tests is the penetration tester NOT performing?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [111/220] `d6-q86__v1`
**Domain:** 6. Security Assessment and Testing
**Current stem (phrase removed):**
> In this situation, an enterprise's IT system was breached, and after investigation, it was found that the attacker used an Active Directory (AD) account of a terminated domain administrator that was kept active for two months. Which option would have EFFECTIVELY DETECTED this user account?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [112/220] `d6-q87__v2`
**Domain:** 6. Security Assessment and Testing
**Current stem (phrase removed):**
> An enterprise is planning to move its disaster recovery data center to a different location and is currently in the site survey phase. Its Maximum Tolerable Downtime (MTD) is three weeks, and it wants a cost-effective solution with minimal setup required. Which option sites would MEET the enterprise’s requirements?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [113/220] `d6-q88__v2`
**Domain:** 6. Security Assessment and Testing
**Current stem (phrase removed):**
> A public trading business is undergoing a merger with another business. To lower the risk to its shareholders, the stock exchange wants to evaluate the business’s security and privacy controls. To do so, they visit the business’s website. Which option SOC reports details their security and privacy evaluation?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [114/220] `d8-q64__v3`
**Domain:** 8. Software Development Security
**Current stem (phrase removed):**
> In this situation, in a recent internal assessment, what option processes ensures that there is consistency between the accounting records and production environment and that unauthorized alterations to the configuration have not been made?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [115/220] `d1-q111__v1`
**Domain:** 1. Security and Risk Management
**Current stem (phrase removed):**
> As the security lead, after a control-gap review, you have recently been hired as a network engineer in a multinational business. You've already studied the business's mission, vision, goals, corporate strategy, and organization and security needs, and you want to develop the business's information security strategy. What option should you do first?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [116/220] `d1-q111__v3`
**Domain:** 1. Security and Risk Management
**Current stem (phrase removed):**
> After a control-gap review, you have recently been hired as a network engineer in a multinational business. You've already studied the business's mission, vision, goals, corporate strategy, and organization and security needs, and you want to develop the business's information security strategy. What option should you do first?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [117/220] `d2-q66__v1`
**Domain:** 2. Asset Security
**Current stem (phrase removed):**
> An employee of an international financial institution would like to gain access to some critical customer information in order to serve a client as illustrated in the diagram below. What option data roles will grant them access to the data they want?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [118/220] `d3-q85__v1`
**Domain:** 3. Security Architecture and Engineering
**Current stem (phrase removed):**
> In a recent internal assessment, a manufacturing organization to improve the security of their systems. They have opted to apply the Process for Attack Simulation and Threat Analysis (PASTA) methodology, which follows a seven-step approach to identify the potential threats and vulnerabilities to a system and the available countermeasures. Using this methodology, what should the employee do first?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [119/220] `d3-q85__v2`
**Domain:** 3. Security Architecture and Engineering
**Current stem (phrase removed):**
> As the security lead, in a recent internal assessment, a manufacturing organization to improve the security of their systems. They have opted to apply the Process for Attack Simulation and Threat Analysis (PASTA) methodology, which follows a seven-step approach to identify the potential threats and vulnerabilities to a system and the available countermeasures. Using this methodology, what should the employee do first?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [120/220] `d1-q119__v3`
**Domain:** 1. Security and Risk Management
**Current stem (phrase removed):**
> During a security governance meeting, you work as a CISO in an enterprise. The organization wants to purchase new computers and some software for their new branch. You have been tasked with conducting a security assessment of potential vendors that have shown interest in supplying the products. What option is NOT part of the process you will complete to determine the right vendor?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [121/220] `d6-q93__v3`
**Domain:** 6. Security Assessment and Testing
**Current stem (phrase removed):**
> In this situation, an ethical hacker in a medium-sized corporation has been tasked with assessing the security of the corporation's systems and prepare a penetration test report. What option information is not necessary for the report?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [122/220] `d6-q94__v3`
**Domain:** 6. Security Assessment and Testing
**Current stem (phrase removed):**
> During a security governance meeting, a manufacturing organization choose audit standards that the organization will adhere to in all its branches. What option IT standards are they not likely to suggest?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [123/220] `d7-q88__v1`
**Domain:** 7. Security Operations
**Current stem (phrase removed):**
> Your organization has some computers that have reached the end of their lifecycle and you want to donate them to the nearest public library where they will still be useful. What should you do before giving away the computers?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [124/220] `d7-q88__v3`
**Domain:** 7. Security Operations
**Current stem (phrase removed):**
> Considering security governance and risk, your organization has some computers that have reached the end of their lifecycle and you want to donate them to the nearest public library where they will still be useful. What should you do before giving away the computers?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [125/220] `d7-q92__v1`
**Domain:** 7. Security Operations
**Current stem (phrase removed):**
> As the security lead, what option disaster recovery tests involves team members walking through a scenario but no alterations are made to the information systems?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [126/220] `d3-q86__v2`
**Domain:** 3. Security Architecture and Engineering
**Current stem (phrase removed):**
> Bina works as SOC lead in a local bank. She has proposed to the bank manager that they need to hash all the messages sent to their customers to ensure the messages remain authentic. The bank manager has requested that Bina share some features of hashing algorithms with them before they approve the proposal. What option are characteristics of a hashing algorithm? Choose ALL answers that apply?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [127/220] `d1-q121__v3`
**Domain:** 1. Security and Risk Management
**Current stem (phrase removed):**
> As the security lead, your organization has hired a new Security Architect who has experience with products from a particular vendor and is therefore inclined to use their suite of products. She suggests your team replaces the existing tools with the products of her chosen vendor. What is the primary concept missing from this action?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [128/220] `d1-q126__v1`
**Domain:** 1. Security and Risk Management
**Current stem (phrase removed):**
> In a recent internal assessment, recent Security Reports show that many developers are using free cloud-based tools like data formatters, data parsers, convertors, and comparators. They copy the enterprise's code into these tools instead of using the enterprise's provided tool to process the data. What option agreements is most likely to be violated?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [129/220] `d1-q126__v3`
**Domain:** 1. Security and Risk Management
**Current stem (phrase removed):**
> In a recent internal assessment, recent Security Reports show that many developers are using free cloud-based tools like data formatters, data parsers, convertors, and comparators. They copy the enterprise's code into these tools instead of using the enterprise's provided tool to process the data. What option agreements is most likely to be violated?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [130/220] `d2-q68__v1`
**Domain:** 2. Asset Security
**Current stem (phrase removed):**
> Considering security governance and risk, as part of a risk reduction initiative, your organization has initiated a knowledge campaign to provide free courses to all. What option data classification categories relates most closely to the course content?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [131/220] `d2-q68__v2`
**Domain:** 2. Asset Security
**Current stem (phrase removed):**
> In this situation, as part of a risk reduction initiative, your organization has initiated a knowledge campaign to provide free courses to all. What option data classification categories relates most closely to the course content?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [132/220] `d2-q68__v3`
**Domain:** 2. Asset Security
**Current stem (phrase removed):**
> As part of a risk reduction initiative, your organization has initiated a knowledge campaign to provide free courses to all. What option data classification categories relates most closely to the course content?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [133/220] `d2-q73__v3`
**Domain:** 2. Asset Security
**Current stem (phrase removed):**
> In compliance with your Enterprise's Data Retention Policies, you have archived the logs generated in your SIEM systems. What option options can you perform on the archived data? (Select TWO)?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [134/220] `d2-q74__v1`
**Domain:** 2. Asset Security
**Current stem (phrase removed):**
> As the security lead, after a control-gap review, you are appointed as a SOC lead in a bank where you will be responsible for operations and maintenance of the Information Technology (IT) Department's resources. What option roles suites your profile the most?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [135/220] `d2-q74__v3`
**Domain:** 2. Asset Security
**Current stem (phrase removed):**
> Considering security governance and risk, after a control-gap review, you are appointed as a SOC lead in a bank where you will be responsible for operations and maintenance of the Information Technology (IT) Department's resources. What option roles suites your profile the most?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [136/220] `d2-q76__v1`
**Domain:** 2. Asset Security
**Current stem (phrase removed):**
> Considering security governance and risk, during a security governance meeting, following Asset Identification and Data Classification, what is the next step in identifying what you need to protect?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [137/220] `d3-q89__v2`
**Domain:** 3. Security Architecture and Engineering
**Current stem (phrase removed):**
> In this situation, you work in a small organization where you find that the Senior Management has access to everything including super admin privileges to Applications, Domains, and App/Web Servers. What option Security Principles is most likely to be violated with this approach?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [138/220] `d3-q90__v2`
**Domain:** 3. Security Architecture and Engineering
**Current stem (phrase removed):**
> After a control-gap review, what option Security Control Models defines Separation of Duties?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [139/220] `d3-q92__v1`
**Domain:** 3. Security Architecture and Engineering
**Current stem (phrase removed):**
> In this situation, you developed a web scraping script that scrapes data from a website and sends you alerts whenever anything new is added to that site. You want to deploy this script on a cloud-based environment so your script runs non-stop. What option cloud-based models supports this requirement?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [140/220] `d3-q92__v2`
**Domain:** 3. Security Architecture and Engineering
**Current stem (phrase removed):**
> In this situation, you developed a web scraping script that scrapes data from a website and sends you alerts whenever anything new is added to that site. You want to deploy this script on a cloud-based environment so your script runs non-stop. What option cloud-based models supports this requirement?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [141/220] `d3-q92__v3`
**Domain:** 3. Security Architecture and Engineering
**Current stem (phrase removed):**
> You developed a web scraping script that scrapes data from a website and sends you alerts whenever anything new is added to that site. You want to deploy this script on a cloud-based environment so your script runs non-stop. What option cloud-based models supports this requirement?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [142/220] `d3-q93__v2`
**Domain:** 3. Security Architecture and Engineering
**Current stem (phrase removed):**
> As part of a risk reduction initiative, you are designing the next video streaming service, for which you need to ensure that there is no issue with Content Buffering and that the user gets the best possible viewing experience. What option architectures will you select?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [143/220] `d3-q94__v1`
**Domain:** 3. Security Architecture and Engineering
**Current stem (phrase removed):**
> As the security lead, you are in the Security Management Team of the ABC Corp where you need to design the security standards for the enterprise. What option algorithms are you most likely to select?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [144/220] `d4-q89__v1`
**Domain:** 4. Communication and Network Security
**Current stem (phrase removed):**
> Network Segmentation is employed in most network architectures, as this provides more security and manageability for network devices and systems. What option is not a benefit of using Micro-Segmentation?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [145/220] `d4-q89__v3`
**Domain:** 4. Communication and Network Security
**Current stem (phrase removed):**
> Network Segmentation is employed in most network architectures, as this provides more security and manageability for network devices and systems. What option is not a benefit of using Micro-Segmentation?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [146/220] `d4-q90__v2`
**Domain:** 4. Communication and Network Security
**Current stem (phrase removed):**
> As part of a risk reduction initiative, during a recent network attack, you found out that the existing firewall configuration allowed access to the server (10.1.1.19). What option firewall rules did not allow for web access to the server?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [147/220] `d4-q91__v2`
**Domain:** 4. Communication and Network Security
**Current stem (phrase removed):**
> Considering security governance and risk, your Enterprise has defined clear network segmentation, restricting access from each network zone via firewalls. What option servers should not be placed on the Demilitarized Zone (DMZ) (Shared Subnet)?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [148/220] `d4-q92__v1`
**Domain:** 4. Communication and Network Security
**Current stem (phrase removed):**
> Yao's organization has recently approved the budget for the Network Access Control Device, please select the features that do not match with the NAC capabilities?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [149/220] `d4-q92__v3`
**Domain:** 4. Communication and Network Security
**Current stem (phrase removed):**
> Considering security governance and risk, yao's organization has recently approved the budget for the Network Access Control Device, please select the features that do not match with the NAC capabilities?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [150/220] `d4-q94__v2`
**Domain:** 4. Communication and Network Security
**Current stem (phrase removed):**
> As the security lead, what option protocols is not commonly used in Virtual Private Networks (VPN)?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [151/220] `d4-q95__v2`
**Domain:** 4. Communication and Network Security
**Current stem (phrase removed):**
> From a CISSP perspective, during a security governance meeting, what option attacks is best defended against in the IPv6 (Internet Protocol) network?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [152/220] `d4-q97__v2`
**Domain:** 4. Communication and Network Security
**Current stem (phrase removed):**
> The Research and Development department has its network implemented separately as IPv6. However, the department needs to connect to the rest of the enterprise's network, which is implemented as IPv4. What option devices will be used between the networks?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [153/220] `d4-q97__v3`
**Domain:** 4. Communication and Network Security
**Current stem (phrase removed):**
> The Research and Development department has its network implemented separately as IPv6. However, the department needs to connect to the rest of the enterprise's network, which is implemented as IPv4. What option devices will be used between the networks?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [154/220] `d5-q86__v2`
**Domain:** 5. Identity and Access Management (IAM)
**Current stem (phrase removed):**
> After a control-gap review, every organization has multiple critical assets, and each has its own set of admin accounts. Based on the enterprise's Security Policy, each time the shared admin account is used, the password needs to be changed. What option tools is used to manage such accounts?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [155/220] `d5-q88__v3`
**Domain:** 5. Identity and Access Management (IAM)
**Current stem (phrase removed):**
> Device authentication is a core component of a zero-trust architecture and should always be enforced in conjunction with strong user authentication. What option techniques should not be used to perform Device Authentication? (Select TWO)?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [156/220] `d5-q89__v2`
**Domain:** 5. Identity and Access Management (IAM)
**Current stem (phrase removed):**
> Considering security governance and risk, during a security governance meeting, a logistics firm supports Just-in-Time provisioning. What option is NOT a benefit of JIT?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [157/220] `d5-q89__v3`
**Domain:** 5. Identity and Access Management (IAM)
**Current stem (phrase removed):**
> From a CISSP perspective, during a security governance meeting, a logistics firm supports Just-in-Time provisioning. What option is NOT a benefit of JIT?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [158/220] `d5-q90__v1`
**Domain:** 5. Identity and Access Management (IAM)
**Current stem (phrase removed):**
> Considering security governance and risk, your enterprise's web application allows the user to log in either directly or via major Social Media Services like Google, Facebook, Twitter, etc. (Social Login). What option protocols is most likely to be used in this scenario? (Select TWO)?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [159/220] `d5-q91__v3`
**Domain:** 5. Identity and Access Management (IAM)
**Current stem (phrase removed):**
> From a CISSP perspective, during a security governance meeting, an organization has implemented Role-Based Access Control, what mechanism should they incorporate so that no one has access to initiate and approve a transaction?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [160/220] `d5-q94__v2`
**Domain:** 5. Identity and Access Management (IAM)
**Current stem (phrase removed):**
> Considering security governance and risk, in a recent internal assessment, during Annual Access Review, the Manager finds that consultants previously given temporary accesses still have these accesses. What next step could be taken by the manager?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [161/220] `d5-q95__v2`
**Domain:** 5. Identity and Access Management (IAM)
**Current stem (phrase removed):**
> From a CISSP perspective, after implementing the Identity Management Solution for their employees, an organization now wants to manage Service Accounts via their IAM system. In the Identity Management (IAM) system, the Service Accounts should be associated with which of the managed identities?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [162/220] `d5-q96__v2`
**Domain:** 5. Identity and Access Management (IAM)
**Current stem (phrase removed):**
> Business A performed the 3rd party audit for organization B and found that several application accounts were still active even though the associated identity had been terminated. What is the best control to handle this situation?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [163/220] `d6-q99__v3`
**Domain:** 6. Security Assessment and Testing
**Current stem (phrase removed):**
> In a recent internal assessment, a recent Security Audit suggested incorporating a SIEM system to consolidate the logs and monitor events. What option events should be captured in the logs? (Select all options that apply)?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [164/220] `d6-q103__v2`
**Domain:** 6. Security Assessment and Testing
**Current stem (phrase removed):**
> As the security lead, in a recent internal assessment, what option audits is considered to be the most effective way to evaluate security controls in an enterprise?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [165/220] `d7-q95__v1`
**Domain:** 7. Security Operations
**Current stem (phrase removed):**
> Your enterprise's Security Administration Team recently installed an Intrusion Detection System (IDS) which will help the organization strengthen its attack detection capability. However, during its operation, the Administration Team encountered many false positives. What option techniques works best to reduce the number of false positives?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [166/220] `d7-q95__v2`
**Domain:** 7. Security Operations
**Current stem (phrase removed):**
> Considering security governance and risk, your enterprise's Security Administration Team recently installed an Intrusion Detection System (IDS) which will help the organization strengthen its attack detection capability. However, during its operation, the Administration Team encountered many false positives. What option techniques works best to reduce the number of false positives?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [167/220] `d7-q101__v2`
**Domain:** 7. Security Operations
**Current stem (phrase removed):**
> From a CISSP perspective, as part of a risk reduction initiative, aiko recently completed the ITIL Certification which advocates implementing the Change Management Process in the Enterprise. Arrange the following steps in the correct sequence of the Change Management Process. A. Documenting the changes. B. Testing the changes. C. Creating requests for changes. D. Reviewing requests for changes. E. Approve/Reject changes. F. Schedule and Implement changes. Select the correct sequence of steps from the given options:?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [168/220] `d7-q101__v3`
**Domain:** 7. Security Operations
**Current stem (phrase removed):**
> As part of a risk reduction initiative, aiko recently completed the ITIL Certification which advocates implementing the Change Management Process in the Enterprise. Arrange the following steps in the correct sequence of the Change Management Process. A. Documenting the changes. B. Testing the changes. C. Creating requests for changes. D. Reviewing requests for changes. E. Approve/Reject changes. F. Schedule and Implement changes. Select the correct sequence of steps from the given options:?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [169/220] `d8-q66__v1`
**Domain:** 8. Software Development Security
**Current stem (phrase removed):**
> Your organization has recently implemented the Software Assurance Maturity Model (SAMM) which provides a way to analyze and improve the secure development lifecycle. What option features is not provided by SAMM?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [170/220] `d8-q66__v2`
**Domain:** 8. Software Development Security
**Current stem (phrase removed):**
> Your organization has recently implemented the Software Assurance Maturity Model (SAMM) which provides a way to analyze and improve the secure development lifecycle. What option features is not provided by SAMM?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [171/220] `d8-q69__v2`
**Domain:** 8. Software Development Security
**Current stem (phrase removed):**
> The security team wants to enhance Security Response capabilities such that they could automatically respond to many commonly occurring incidents. What option options will they most likely consider?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [172/220] `d8-q71__v3`
**Domain:** 8. Software Development Security
**Current stem (phrase removed):**
> As the security lead, according to the OWASP Top 10 Web Application Vulnerabilities Report, Broken Access Control issues were found in 94% of applications. What option controls is least effective against Broken Access Control?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [173/220] `d2-q77__v1`
**Domain:** 2. Asset Security
**Current stem (phrase removed):**
> During a security governance meeting, an organization decides to outsource its configuration management program to a third-party vendor. They want to ensure that minimum security controls are configured on the newly imaged machines. What should the organization provide to the third-party vendor to ensure these requirements are met?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [174/220] `d2-q77__v2`
**Domain:** 2. Asset Security
**Current stem (phrase removed):**
> During a security governance meeting, an organization decides to outsource its configuration management program to a third-party vendor. They want to ensure that minimum security controls are configured on the newly imaged machines. What should the organization provide to the third-party vendor to ensure these requirements are met?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [175/220] `d6-q104__v1`
**Domain:** 6. Security Assessment and Testing
**Current stem (phrase removed):**
> During a quarterly audit, a media streaming company hires a startup to develop a custom application that lets users monitor room temperatures and send notifications on their phones. The startup firm is responsible for developing and deploying the code. Since the IoT organization does not have any in-house expertise to support customer issues, they delegate these responsibilities to the startup firm. The manufacturing organization wants to protect its application code in case the startup organization fails to comply with its responsibilities. What type of agreement should the IoT manufacturer have in place to protect their software code?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [176/220] `d6-q105__v2`
**Domain:** 6. Security Assessment and Testing
**Current stem (phrase removed):**
> In this situation, during a security governance meeting, soori, the newly crowned network engineer of ABC Limited, is worried about a report of suspicious traffic to the business’s web applications. Moreover, he decided to hire a penetration testing organization to evaluate the effectiveness of the security controls in place and further decided to share no information with the testers. What is the most appropriate option to undertake the test?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [177/220] `d6-q105__v3`
**Domain:** 6. Security Assessment and Testing
**Current stem (phrase removed):**
> As the security lead, during a security governance meeting, soori, the newly crowned network engineer of ABC Limited, is worried about a report of suspicious traffic to the business’s web applications. Moreover, he decided to hire a penetration testing organization to evaluate the effectiveness of the security controls in place and further decided to share no information with the testers. What is the most appropriate option to undertake the test?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [178/220] `d1-q128__v1`
**Domain:** 1. Security and Risk Management
**Current stem (phrase removed):**
> Considering security governance and risk, as part of organization risk governance, at a logistics enterprise, which canon in the (ISC)2 code of ethics states that security professionals should execute their duties in a manner that is honorable, honest, just, responsible, and legal?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [179/220] `d1-q129__v1`
**Domain:** 1. Security and Risk Management
**Current stem (phrase removed):**
> As the security lead, during a post-incident lessons-learned meeting, at a healthcare provider, you have recently been hired as a CISO in a multinational business. You've already studied the business's mission, vision, goals, corporate strategy, and organization and security needs, and you want to develop the business's information security strategy. Which option should you do first?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [180/220] `d1-q132__v3`
**Domain:** 1. Security and Risk Management
**Current stem (phrase removed):**
> As part of organization risk governance, at a logistics enterprise, which option is not one of the important roles that a senior manager can play on a organization continuity planning team?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [181/220] `d1-q133__v1`
**Domain:** 1. Security and Risk Management
**Current stem (phrase removed):**
> During a post-incident lessons-learned meeting, at a telecom operator, an employee is investigating a security incident where it was discovered that an attacker created a fake user account to take advantage of the system vulnerability and grant administrative rights to that account. In reference to the STRIDE model, these types of attacks can be referred to as __________ and _________. (Choose TWO of the following answer options.)?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [182/220] `d1-q134__v2`
**Domain:** 1. Security and Risk Management
**Current stem (phrase removed):**
> Considering security governance and risk, an employee wants to develop a organization continuity plan, but they are not sure which resources to prioritize due to the challenge of putting together information about intangible and tangible assets. Which risk assessment approach would you advise them to apply?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [183/220] `d1-q135__v2`
**Domain:** 1. Security and Risk Management
**Current stem (phrase removed):**
> As the security lead, in preparation for an external audit, at a telecom operator, which option enterprises is most likely to be impacted by the provisions of FISMA?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [184/220] `d2-q78__v1`
**Domain:** 2. Asset Security
**Current stem (phrase removed):**
> As the security lead, during a post-incident lessons-learned meeting, at a telecom operator, a top-ranking U.S. military officer is tasked with securing some sensitive information, the exposure of which might result in a serious threat to national security. In reference to the U.S. standards of data classification, this data should be classified as_________?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [185/220] `d2-q78__v3`
**Domain:** 2. Asset Security
**Current stem (phrase removed):**
> From a CISSP perspective, during a post-incident lessons-learned meeting, at a telecom operator, a top-ranking U.S. military officer is tasked with securing some sensitive information, the exposure of which might result in a serious threat to national security. In reference to the U.S. standards of data classification, this data should be classified as_________?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [186/220] `d3-q100__v2`
**Domain:** 3. Security Architecture and Engineering
**Current stem (phrase removed):**
> As the security lead, an employee would like to conduct threat modeling for their organization to improve the security of their systems. They have opted to apply the Process for Attack Simulation and Threat Analysis (PASTA) methodology, which follows a seven-step approach to identify the potential threats and vulnerabilities to a system and the available countermeasures. Using this methodology, what should the employee do first?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [187/220] `d1-q136__v2`
**Domain:** 1. Security and Risk Management
**Current stem (phrase removed):**
> While planning a control enhancement roadmap, at a multinational bank, you work as a CISO in an enterprise. The organization wants to purchase new computers and some software for their new branch. You have been tasked with conducting a security assessment of potential vendors that have shown interest in supplying the products. Which option is NOT part of the process you will complete to determine the right vendor?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [188/220] `d6-q107__v3`
**Domain:** 6. Security Assessment and Testing
**Current stem (phrase removed):**
> From a CISSP perspective, while planning a control enhancement roadmap, at a telecom operator, an employee is scanning a network port of a web server used in his business. They are using an external network to run the scan because they want to get the perspective of a hacker. Which option results should worry them?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [189/220] `d7-q105__v2`
**Domain:** 7. Security Operations
**Current stem (phrase removed):**
> Considering security governance and risk, the security officer in a medium-sized organization wants to deploy a deliberate false loophole that can be used to trap intruders in their systems. Which option can they utilize to achieve this?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [190/220] `d3-q102__v2`
**Domain:** 3. Security Architecture and Engineering
**Current stem (phrase removed):**
> From a CISSP perspective, a security review team is evaluating whether at a logistics enterprise, bina works as CISO in a local bank. She has proposed to the bank manager that they need to hash all the messages sent to their customers to ensure the messages remain authentic. The bank manager has requested that Bina share some features of hashing algorithms with them before they approve the proposal. Which option are characteristics of a hashing algorithm? Choose ALL answers that apply?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [191/220] `d1-q143__v2`
**Domain:** 1. Security and Risk Management
**Current stem (phrase removed):**
> In preparation for an external audit, at a healthcare provider, you are asked to initiate a Threat Modeling exercise within your enterprise. Since this is the first time the organization is doing this, what will be the next step after identifying the objective for the Threat Modeling exercise?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [192/220] `d2-q81__v2`
**Domain:** 2. Asset Security
**Current stem (phrase removed):**
> From a CISSP perspective, your organization has initiated a knowledge campaign to provide free courses to all. Which option data classification categories relates most closely to the course content?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [193/220] `d2-q81__v3`
**Domain:** 2. Asset Security
**Current stem (phrase removed):**
> Your organization has initiated a knowledge campaign to provide free courses to all. Which option data classification categories relates most closely to the course content?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [194/220] `d2-q82__v2`
**Domain:** 2. Asset Security
**Current stem (phrase removed):**
> Considering security governance and risk, during a post-incident lessons-learned meeting, at a healthcare provider, your organization follows strict data classification policies and marks all sensitive and critical systems with appropriate data classification. However, you find that the organization does not mark or label the non-confidential components. What is the issue with this approach?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [195/220] `d2-q82__v3`
**Domain:** 2. Asset Security
**Current stem (phrase removed):**
> Considering security governance and risk, during a post-incident lessons-learned meeting, at a healthcare provider, your organization follows strict data classification policies and marks all sensitive and critical systems with appropriate data classification. However, you find that the organization does not mark or label the non-confidential components. What is the issue with this approach?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [196/220] `d2-q87__v1`
**Domain:** 2. Asset Security
**Current stem (phrase removed):**
> Considering security governance and risk, while planning a control enhancement roadmap, at a healthcare provider, following Asset Identification and Data Classification, what is the next step in identifying what you need to protect?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [197/220] `d3-q103__v2`
**Domain:** 3. Security Architecture and Engineering
**Current stem (phrase removed):**
> Based on your recent security management meeting, it is decided that your organization will move its focus to the Zero Trust Principles. Which option principles applies to the concept of Zero Trust? (Select 3)?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [198/220] `d3-q104__v3`
**Domain:** 3. Security Architecture and Engineering
**Current stem (phrase removed):**
> As part of organization risk governance, at a logistics enterprise, you work in a small organization where you find that the Senior Management has access to everything including super admin privileges to Applications, Domains, and App/Web Servers. Which option Security Principles is most likely to be violated with this approach?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [199/220] `d3-q107__v2`
**Domain:** 3. Security Architecture and Engineering
**Current stem (phrase removed):**
> From a CISSP perspective, in preparation for an external audit, at a telecom operator, you developed a web scraping script that scrapes data from a website and sends you alerts whenever anything new is added to that site. You want to deploy this script on a cloud-based environment so your script runs non-stop. Which option cloud-based models supports this requirement?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [200/220] `d3-q107__v3`
**Domain:** 3. Security Architecture and Engineering
**Current stem (phrase removed):**
> In preparation for an external audit, at a telecom operator, you developed a web scraping script that scrapes data from a website and sends you alerts whenever anything new is added to that site. You want to deploy this script on a cloud-based environment so your script runs non-stop. Which option cloud-based models supports this requirement?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [201/220] `d4-q101__v2`
**Domain:** 4. Communication and Network Security
**Current stem (phrase removed):**
> As the security lead, as part of organization risk governance, at a cloud SaaS company, during a recent network attack, you found out that the existing firewall configuration allowed access to the server (10.1.1.19). Which option firewall rules did not allow for web access to the server?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [202/220] `d4-q105__v2`
**Domain:** 4. Communication and Network Security
**Current stem (phrase removed):**
> As the security lead, during a post-incident lessons-learned meeting, at a telecom operator, the Research and Development department has its network implemented separately as IPv6. However, the department needs to connect to the rest of the enterprise's network, which is implemented as IPv4. Which option devices will be used between the networks?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [203/220] `d4-q105__v3`
**Domain:** 4. Communication and Network Security
**Current stem (phrase removed):**
> During a post-incident lessons-learned meeting, at a telecom operator, the Research and Development department has its network implemented separately as IPv6. However, the department needs to connect to the rest of the enterprise's network, which is implemented as IPv4. Which option devices will be used between the networks?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [204/220] `d5-q105__v3`
**Domain:** 5. Identity and Access Management (IAM)
**Current stem (phrase removed):**
> From a CISSP perspective, every organization has multiple critical assets, and each has its own set of admin accounts. Based on the enterprise's Security Policy, each time the shared admin account is used, the password needs to be changed. Which option tools is used to manage such accounts?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [205/220] `d5-q106__v1`
**Domain:** 5. Identity and Access Management (IAM)
**Current stem (phrase removed):**
> Considering security governance and risk, during a post-incident lessons-learned meeting, at a logistics enterprise, during a recent Phishing attempt, the attackers successfully accessed one of the systems. As the next step, they plan to gain access to other systems and escalate their privileges. Which option terms best describes this activity?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [206/220] `d5-q112__v2`
**Domain:** 5. Identity and Access Management (IAM)
**Current stem (phrase removed):**
> In this situation, while planning a control enhancement roadmap, at a telecom operator, during Annual Access Review, the Manager finds that consultants previously given temporary accesses still have these accesses. What next step could be taken by the manager?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [207/220] `d6-q110__v3`
**Domain:** 6. Security Assessment and Testing
**Current stem (phrase removed):**
> During an Internal Audit, several issues were found in your organization and the results have been presented to Senior Management. Which option decisions is least likely to be taken by Senior Management?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [208/220] `d6-q112__v3`
**Domain:** 6. Security Assessment and Testing
**Current stem (phrase removed):**
> During a post-incident lessons-learned meeting, at a federal contractor, the sales department is adding a new API layer to their existing application Interface. This will allow other teams to fetch sales app data programmatically, within the enterprise. Which option testing types is least likely to be performed in this scenario?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [209/220] `d6-q113__v2`
**Domain:** 6. Security Assessment and Testing
**Current stem (phrase removed):**
> A security review team is evaluating whether at a federal contractor, during a recent attack, attackers exploited your corporation's newly launched application. The attackers exploited the buffer overflow vulnerability in the new system. Which option testing methodologies could have been missed?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [210/220] `d6-q113__v3`
**Domain:** 6. Security Assessment and Testing
**Current stem (phrase removed):**
> A security review team is evaluating whether at a federal contractor, during a recent attack, attackers exploited your corporation's newly launched application. The attackers exploited the buffer overflow vulnerability in the new system. Which option testing methodologies could have been missed?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [211/220] `d6-q115__v2`
**Domain:** 6. Security Assessment and Testing
**Current stem (phrase removed):**
> Considering security governance and risk, a security review team is evaluating whether at a healthcare provider, during the feature testing of a Third Party vendor product that is used enterprise-wide, the testing team found an issue. Upon evaluation, it is found that it is an issue with the product. What is the best way to handle this issue?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [212/220] `d7-q113__v2`
**Domain:** 7. Security Operations
**Current stem (phrase removed):**
> From a CISSP perspective, while planning a control enhancement roadmap, at a healthcare provider, security Configuration Management Process is comprised of the following steps: 1. Controlling Configuration Changes 2. Planning 3. Identifying and Implementing Configurations 4. Monitoring Which option options specifies the correct sequence of the Security Configuration Management?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [213/220] `d7-q113__v3`
**Domain:** 7. Security Operations
**Current stem (phrase removed):**
> While planning a control enhancement roadmap, at a healthcare provider, security Configuration Management Process is comprised of the following steps: 1. Controlling Configuration Changes 2. Planning 3. Identifying and Implementing Configurations 4. Monitoring Which option options specifies the correct sequence of the Security Configuration Management?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [214/220] `d7-q116__v1`
**Domain:** 7. Security Operations
**Current stem (phrase removed):**
> From a CISSP perspective, during a post-incident lessons-learned meeting, at a multinational bank, aiko recently completed the ITIL Certification which advocates implementing the Change Management Process in the Enterprise. Arrange the following steps in the correct sequence of the Change Management Process. A. Documenting the changes. B. Testing the changes. C. Creating requests for changes. D. Reviewing requests for changes. E. Approve/Reject changes. F. Schedule and Implement changes. Select the correct sequence of steps from the given options:?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [215/220] `d8-q79__v1`
**Domain:** 8. Software Development Security
**Current stem (phrase removed):**
> From a CISSP perspective, your organization has recently implemented the Software Assurance Maturity Model (SAMM) which provides a way to analyze and improve the secure development lifecycle. Which option features is not provided by SAMM?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [216/220] `d2-q88__v1`
**Domain:** 2. Asset Security
**Current stem (phrase removed):**
> As part of organization risk governance, at a multinational bank, a organization decides to outsource its configuration management program to a third-party vendor. They want to ensure that minimum security controls are configured on the newly imaged machines. What should the organization provide to the third-party vendor to ensure these requirements are met?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [217/220] `d2-q88__v3`
**Domain:** 2. Asset Security
**Current stem (phrase removed):**
> From a CISSP perspective, as part of organization risk governance, at a multinational bank, a organization decides to outsource its configuration management program to a third-party vendor. They want to ensure that minimum security controls are configured on the newly imaged machines. What should the organization provide to the third-party vendor to ensure these requirements are met?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [218/220] `d6-q116__v2`
**Domain:** 6. Security Assessment and Testing
**Current stem (phrase removed):**
> In this situation, an Internet of Things (IoT) manufacturing organization hires a startup to develop a custom application that lets users monitor room temperatures and send notifications on their phones. The startup firm is responsible for developing and deploying the code. Since the IoT organization does not have any in-house expertise to support customer issues, they delegate these responsibilities to the startup firm. The manufacturing organization wants to protect its application code in case the startup organization fails to comply with its responsibilities. What type of agreement should the IoT manufacturer have in place to protect their software code?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [219/220] `d6-q116__v3`
**Domain:** 6. Security Assessment and Testing
**Current stem (phrase removed):**
> An Internet of Things (IoT) manufacturing organization hires a startup to develop a custom application that lets users monitor room temperatures and send notifications on their phones. The startup firm is responsible for developing and deploying the code. Since the IoT organization does not have any in-house expertise to support customer issues, they delegate these responsibilities to the startup firm. The manufacturing organization wants to protect its application code in case the startup organization fails to comply with its responsibilities. What type of agreement should the IoT manufacturer have in place to protect their software code?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.

### [220/220] `d6-q117__v1`
**Domain:** 6. Security Assessment and Testing
**Current stem (phrase removed):**
> As the security lead, during a post-incident lessons-learned meeting, at a multinational bank, soori, the newly crowned Chief Information Security Officer (CISO) of ABC Limited, is worried about a report of suspicious traffic to the business’s web applications. Moreover, he decided to hire a penetration testing organization to evaluate the effectiveness of the security controls in place and further decided to share no information with the testers. What is the most appropriate response to undertake the test?
**Action:** Add qualifier (BEST/FIRST/MOST appropriate) to the question, then update the bank.
