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
- [12. Repository and Demo Links](#12-repository-and-demo-links)

---

## 1. Introduction
**GigShield AI** is a web-based parametric insurance solution designed for delivery workers whose income depends on active working hours.  
If a worker is unable to work because of external disruptions such as heavy rain, floods, extreme heat, severe AQI, curfews, or platform outages, the system automatically detects the event, validates coverage, estimates lost income, performs fraud checks, and initiates payout.

Our solution focuses only on **income loss protection** and uses a **weekly premium model**, making it suitable for delivery workers with short earning cycles.

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
- Base Premium = ₹20
- High rain-risk zone = +₹5
- Evening peak exposure = +₹3
- Higher coverage plan = +₹4
- Safe profile discount = -₹2

**Final Weekly Premium = ₹30**

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

## 12. Repository and Demo Links

### Git Repository
`PASTE_GITHUB_OR_GITLAB_LINK_HERE`

### Phase 1 Demo Video
`PASTE_PUBLIC_VIDEO_LINK_HERE`
