# GigShield AI
### AI-Powered Weekly Income Protection for Delivery Workers

![Phase](https://img.shields.io/badge/Phase-1-blue)
![Platform](https://img.shields.io/badge/Platform-Web-orange)
![Insurance](https://img.shields.io/badge/Model-Parametric-purple)
![AI/ML](https://img.shields.io/badge/AI%2FML-Integrated-red)

## Table of Contents
- [1. Introduction](#1-introduction)
- [2. Requirement Understanding](#2-requirement-understanding)
- [3. Persona-Based Scenarios](#3-persona-based-scenarios)
- [4. Application Workflow](#4-application-workflow)
- [5. Weekly Premium Model](#5-weekly-premium-model)
- [6. Parametric Triggers](#6-parametric-triggers)
- [7. Why We Chose a Web Platform](#7-why-we-chose-a-web-platform)
- [8. AI/ML Integration Plan](#8-aiml-integration-plan)
- [9. Tech Stack](#9-tech-stack)
- [10. Development Plan](#10-development-plan)
- [11. Additional Relevant Points](#11-additional-relevant-points)
- [12. Adversarial Defense & Anti-Spoofing Strategy](#12-adversarial-defense--anti-spoofing-strategy)

---

## 1. Introduction
**GigShield AI** is a web-based parametric insurance solution designed for delivery workers whose income depends on active working hours.  
If a worker is unable to work because of external disruptions such as heavy rain, floods, extreme heat, severe AQI, curfews, or platform outages, the system automatically detects the event, validates coverage, estimates lost income, performs fraud checks, and initiates payout.

Our solution focuses only on **income loss protection** and uses a **weekly premium model**, making it suitable for delivery workers with short earning cycles.

![WhatsApp Image 2026-03-20 at 11 27 37 PM](https://github.com/user-attachments/assets/e75f5643-199b-46fc-932d-330a883cf02e)

---

## 2. Requirement Understanding
The problem we are solving is:

Delivery workers often lose income due to events outside their control, but there is no simple, weekly, easy-to-access insurance product that protects them against this short-term income disruption.

Our solution addresses this by providing:
- weekly insurance plans
- automated trigger-based claim initiation
- AI-assisted premium calculation
- fraud detection
- payout estimation
- worker and admin dashboards

The product is designed specifically for delivery workers whose earnings stop immediately when disruption happens.

---

## 3. Persona-Based Scenarios
<img width="1249" height="707" alt="Screenshot 2026-03-20 at 11 27 28 PM" src="https://github.com/user-attachments/assets/8e74fdf5-19fe-4c51-bcf8-97bb67eb6f35" />

### Primary Persona: Arjun, Grocery Delivery Worker
- Age: 24
- Works for a q-commerce platform
- Operates in 2–3 zones in the city
- Works mostly during lunch and evening peak hours
- Earns based on completed deliveries
- Depends on stable weekly income

### Scenario 1: Heavy Rain During Evening Shift
Arjun has purchased a weekly protection plan.  
He usually works from **6 PM to 10 PM** in Zone A. On a particular day, heavy rainfall crosses the defined threshold from **7 PM to 9 PM**, and delivery activity drops sharply.

**What happens:**
- the system detects the rain trigger
- verifies that Arjun is covered this week
- checks that the disruption happened in his working zone
- confirms that the affected time overlaps with his usual shift
- estimates lost earning hours
- runs fraud checks
- generates a payout

### Scenario 2: Extreme Heat in Afternoon Slot
Another delivery worker regularly works in the afternoon.  
The heat index crosses the unsafe threshold for outdoor activity for 3 hours.

**What happens:**
- the heat trigger activates
- covered workers in that zone are identified
- work-loss duration is estimated
- payout is calculated and processed

### Scenario 3: Platform Outage / Order Collapse
A platform API or simulated data feed shows a sudden drop in orders for a covered zone for 90 minutes.

**What happens:**
- the outage trigger is detected
- active insured workers in that zone are identified
- likely earning interruption is computed
- payout process starts automatically

---

## 4. Application Workflow
![workflow_gigshield](https://github.com/user-attachments/assets/22bb2d08-617f-47f3-9313-e4d3f46b599f)


### Step 1: User Onboarding
The worker registers on the website and provides:
- basic profile details
- work zones
- usual working hours
- average weekly active hours
- average earnings
- payout details

### Step 2: Risk Profiling
The system builds the worker’s risk profile using:
- operating zone
- shift timings
- expected disruption exposure
- historical risk patterns
- earning behavior

### Step 3: Weekly Plan Recommendation
The website recommends a suitable weekly plan:
- Lite
- Smart
- Pro

Each plan displays:
- weekly premium
- protected hours
- maximum payout
- covered disruption types

### Step 4: Policy Activation
The worker selects a plan and activates coverage for the week.

### Step 5: Trigger Monitoring
The platform continuously monitors external event data such as weather, AQI, local zone restrictions, and simulated platform outages.

### Step 6: Claim Validation
When a trigger occurs, the system checks:
- whether the worker had active coverage
- whether the worker’s insured zone is impacted
- whether the affected time overlaps with expected work hours
- whether fraud indicators are present

### Step 7: Payout Estimation
If the claim is valid, the system estimates:
- lost earning hours
- expected income loss
- payout amount based on plan limits

### Step 8: Dashboard Update
The worker sees:
- disruption detected
- claim status
- payout status
- coverage summary

The admin sees:
- triggered events
- claim volume
- fraud flags
- payout analytics

---

## 5. Weekly Premium Model

Our premium model is **weekly**, simple, and risk-based.

### Inputs Used
- worker’s average weekly active hours
- primary delivery zone
- disruption risk in that zone
- time-slot risk
- selected plan tier
- payout cap

### Premium Formula
```text
Weekly Premium = Base Premium + Zone Risk Load + Shift Risk Load + Coverage Multiplier - Safe Profile Discount
```

### Example Premium Calculation

<img width="798" height="865" alt="Screenshot 2026-03-20 at 11 25 33 PM" src="https://github.com/user-attachments/assets/47ac6bcd-55da-43a1-a007-bd2a42b4a5fe" />

### Coverage Tiers

#### Lite
- lower premium
- fewer protected hours
- lower payout cap

#### Smart
- balanced premium and protection
- recommended for average workers

#### Pro
- higher premium
- more protected hours
- higher payout cap

### Why Weekly?
A weekly premium model is suitable because:
- delivery workers often think in short earning cycles
- risk exposure changes week to week
- affordability is important
- coverage can be flexible and adaptive

---

## 6. Parametric Triggers

GigShield AI uses **parametric triggers**, which means claims are linked to predefined external disruption events instead of requiring long manual documentation processes.

### Core Triggers

#### Heavy Rain Trigger
Activates when rainfall exceeds a threshold for a defined duration in the insured zone.

#### Flood / Waterlogging Trigger
Activates when the zone becomes inaccessible or flood-risk becomes operationally significant.

#### Extreme Heat Trigger
Activates when the heat index crosses an unsafe threshold for outdoor delivery activity.

#### Severe AQI Trigger
Activates when AQI becomes unsafe for sustained outdoor work.

#### Curfew / Zone Closure Trigger
Activates when temporary restrictions make delivery work impossible in the zone.

#### Platform Outage / Order Collapse Trigger
Activates when a platform outage or sharp drop in order availability interrupts earning opportunities.

### Why Parametric?
- faster than traditional claims
- low paperwork
- better automation
- smoother user experience
- suitable for event-driven income loss protection

---

## 7. Why We Chose a Web Platform

We chose to build **GigShield AI as a website**.

### Justification
- faster to design and demonstrate within hackathon timelines
- judges can test it instantly without installation
- worker onboarding, plan selection, claim tracking, and payout visibility can all be demonstrated clearly in a browser
- dashboards, fraud review, analytics, and trigger monitoring are naturally suited to the web
- a responsive website can work on both desktop and mobile browsers

### Platform Structure
- **Worker Portal:** responsive website
- **Admin Dashboard:** web dashboard

This gives us one unified platform for both worker-facing and admin-facing workflows.

---

## 8. AI/ML Integration Plan
![WhatsApp Image 2026-03-20 at 11 15 03 PM](https://github.com/user-attachments/assets/e948296a-f161-4ad3-a78b-e6ec733de8a5)

AI/ML is used in multiple parts of the workflow.

### 1. Premium Calculation
AI helps estimate the weekly premium using:
- zone risk
- disruption probability
- shift timing
- expected claim likelihood
- worker profile

### 2. Risk Forecasting
The platform predicts short-term risk using:
- weather forecast data
- seasonal patterns
- zone-level disruption history

### 3. Fraud Detection
AI and rule-based checks detect suspicious claims using:
- GPS inconsistency
- duplicate claim patterns
- mismatch between working zone and claim zone
- repeated abnormal claims
- suspicious activity behavior

### 4. Income Loss Estimation
The system estimates likely lost earnings using:
- average hourly income
- disrupted work duration
- shift and trigger overlap
- validation confidence score

### 5. Explainable Decisions
The platform will show:
- why a premium changed
- why a trigger activated
- why a claim was approved or flagged

---

## 9. Tech Stack

### Frontend
- Next.js
- React
- Tailwind CSS

### Backend
- FastAPI
- REST APIs

### Database
- PostgreSQL
- Redis

### AI/ML
- Python
- scikit-learn
- pandas
- NumPy

### External / Mock Integrations
- Weather API
- AQI API
- simulated platform outage feed
- mock payout system
- map or risk visualization tools

---

## 10. Development Plan

### Phase 1: Ideation & Foundation
- finalize persona and use cases
- define application workflow
- design weekly premium logic
- define parametric triggers
- plan AI/ML integration
- prepare README
- create initial prototype concept
- record 2-minute strategy video

### Phase 2: Build Core Workflow
- build worker onboarding portal
- build premium recommendation flow
- implement trigger monitoring
- implement auto-claim logic
- create admin dashboard
- add basic fraud rules

### Phase 3: Improve and Optimize
- improve fraud detection
- refine premium logic
- add payout simulation
- improve analytics and dashboards
- test multiple disruption scenarios

---

## 11. Additional Relevant Points

### Innovation Highlights
- weekly income protection designed specifically for delivery workers
- hyperlocal risk-based pricing
- automated trigger-based claim processing
- explainable AI decisions
- responsive website for both workers and admins
- reduced claim friction through parametric design

### Prototype Scope for Phase 1
For this phase, we plan to demonstrate:
- worker persona and problem scenario
- onboarding flow
- plan recommendation logic
- premium calculation model
- trigger-to-payout workflow
- dashboard concept
- low-scope but clear website prototype

---

## 12. Adversarial Defense & Anti-Spoofing Strategy

As part of our Phase 1 pivot, GigShield AI is designed to defend against coordinated fraud rings that exploit parametric triggers through location spoofing. Our architecture assumes that **basic GPS verification alone is not sufficient**. Instead, claims are evaluated using a **multi-signal trust model** that distinguishes a genuinely stranded delivery worker from a bad actor simulating presence in a disruption zone. :contentReference[oaicite:1]{index=1}

### Why this matters
A major threat scenario involves a coordinated group of delivery workers using advanced GPS-spoofing tools to fake their presence inside a severe weather zone and trigger large-scale false payouts. The challenge specifically requires teams to redesign their idea document to address this vulnerability before Phase 1 submission. :contentReference[oaicite:2]{index=2}

### 12.1 The Differentiation: Genuine Worker vs Spoofed Claim

GigShield AI will not approve claims based on location alone. Instead, our AI/ML and rules engine assigns every claim a **trust score** using multiple layers of validation:

#### A. Shift Consistency Check
The system checks whether the worker was expected to be active during the disruption window based on:
- historical shift timing
- recent login/activity pattern
- insured working hours selected at policy purchase

A worker who normally operates during that time receives a stronger authenticity score than one who suddenly appears active only during a trigger event.

#### B. Route and Mobility Consistency
The system compares the claimed location against realistic movement behavior:
- route continuity
- travel speed consistency
- zone entry timing
- whether the worker’s movement pattern resembles normal delivery activity

A spoofed claim often shows unrealistic jumps, static-but-flagged motion, or impossible travel patterns.

#### C. Platform Activity Correlation
The claim is cross-checked against work evidence such as:
- order acceptance patterns
- recent active session status
- order density in the affected zone
- sudden interruption in task flow

A genuinely stranded worker is more likely to show normal delivery activity before the disruption and a drop during the event. A spoofer may show trigger presence without matching delivery behavior.

#### D. Collective Event Validation
The system checks whether many workers in the same zone are showing consistent disruption signals:
- similar weather impact
- similar order drop
- similar zone-level slowdown
- similar claim timing pattern

This helps differentiate a real area-wide disruption from a coordinated synthetic fraud pattern.

#### E. Device and Session Trust
Each claim is evaluated using device-level and session-level trust signals:
- prior device history
- unusual session changes
- suspicious location behavior across repeated claims
- repeated use of high-risk devices or accounts

The final result is a **claim trust score**:
- **High Trust** → instant approval
- **Medium Trust** → delayed automated review
- **Low Trust / High Fraud Risk** → flagged for manual or secondary review

---

### 12.2 The Data: Signals Beyond Basic GPS

To detect spoofing and coordinated fraud rings, GigShield AI analyzes a broader fraud graph instead of just coordinates.

#### Core data points used
- GPS coordinates
- timestamp sequence
- geofence match with insured zone
- route continuity and speed pattern
- device/session history
- worker login and session activity
- planned shift window
- policy activation timing
- recent platform activity or order interaction
- trigger timing overlap
- zone-level weather and AQI severity
- zone-level outage or order-collapse signal
- historical claim frequency
- repeated claims near high-payout conditions
- cross-account similarity patterns in the same area

#### Ring-detection signals
To identify a coordinated fraud ring, the system also looks for:
- many workers claiming from the same micro-zone with highly similar timestamps
- repeated claims from newly created or low-trust accounts
- clusters of claims tied to similar device behavior
- statistically abnormal payout concentration in one event window
- repeated behavior where claim timing perfectly matches trigger thresholds without normal work evidence

This creates an **adversarial fraud layer** that focuses not only on individual fraud, but also on **network-level collusion detection**.

---

### 12.3 The UX Balance: Protecting Honest Workers

The challenge requires a workflow that handles suspicious claims without unfairly punishing honest workers who may be facing genuine disruption or weak connectivity in bad weather. :contentReference[oaicite:3]{index=3}

GigShield AI uses a **fair review design**:

#### A. No Immediate Rejection for Uncertain Claims
If a claim is suspicious but not clearly fraudulent, it is **flagged**, not auto-rejected.

#### B. Tiered Claim Handling
- **Green Path:** strong evidence, instant payout
- **Amber Path:** partial inconsistency, soft hold + automated recheck
- **Red Path:** strong spoofing indicators, manual/admin review

#### C. Network Failure Tolerance
If bad weather causes genuine signal loss or poor connectivity, the system gives weight to surrounding evidence such as:
- previous legitimate activity before disconnection
- regional disruption severity
- nearby worker pattern consistency
- delayed but matching recovery signals

This prevents honest workers from being penalized solely due to unstable network conditions.

#### D. Explainable Claim Status
If a claim is flagged, the worker sees a clear status such as:
- “Under verification due to signal inconsistency”
- “Additional validation in progress”
- “Expected review within X time”

This keeps the workflow transparent and avoids a trust breakdown.

#### E. Human Escalation Only for High-Risk Cases
Most workers should still experience low-friction insurance. Manual intervention is reserved for claims with a strong fraud signature, not for every mismatch.

---

### 12.4 Anti-Spoofing Architecture in Our Platform

The anti-spoofing layer sits inside the claim pipeline:

**Trigger Detected → Coverage Check → Multi-Signal Validation → Fraud Risk Scoring → Claim Decision → Payout / Review Queue**

This means our platform is resilient even when attackers attempt to exploit weather events at scale.

### 12.5 Why This Strengthens Our Phase 1 Idea
This adversarial defense approach becomes a major differentiator for GigShield AI because it shows:
- resilience against coordinated fraud
- stronger trust for insurers
- fairer treatment for honest workers
- practical AI/ML usage beyond simple pricing
- readiness for real-world deployment under hostile conditions

With this addition, GigShield AI is no longer just a trigger-based payout platform; it becomes a **fraud-aware, trust-scored, adversarially resilient parametric protection system** for delivery workers.

---
