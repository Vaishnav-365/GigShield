# GigShield AI  
### AI-Powered Parametric Income Protection for Q-Commerce Delivery Workers

---

## 1. Problem Statement

India’s gig delivery workers depend on continuous working hours for their income. External disruptions such as heavy rain, extreme heat, pollution, curfews, or platform outages reduce their working time and lead to direct income loss.

Currently, there is **no simple insurance solution** that protects workers against **loss of income caused by such external events**.

---

## 2. Persona & Use Case

### Persona: Arjun (Q-Commerce Delivery Partner)
- Works for platforms like Zepto/Blinkit  
- Operates in specific city zones  
- Works during peak hours (lunch/evening)  
- Income depends on completed deliveries  

### Key Pain Points
- Weather disruptions stop deliveries  
- Zone closures block access  
- Platform outages reduce orders  
- No compensation for lost working hours  

---

## 3. Solution Overview

**GigShield AI** is a **parametric insurance platform** that:

- Provides **weekly income protection plans**
- Monitors **external disruption triggers**
- Automatically **initiates claims**
- Estimates **lost income**
- Processes **instant/simulated payouts**

---

## 4. Workflow

1. **Onboarding**
   - Worker provides basic details, zones, working hours, and income range  

2. **Risk Profiling**
   - System evaluates risk using zone, shift timing, and historical disruption data  

3. **Plan Recommendation**
   - Weekly plan suggested (Lite / Smart / Pro)  

4. **Policy Activation**
   - Worker activates coverage for the week  

5. **Trigger Monitoring**
   - System tracks disruptions using APIs (weather, AQI, etc.)  

6. **Claim Triggering**
   - If conditions match:
     - Worker active  
     - Zone affected  
     - Valid disruption  

7. **Payout Calculation**
   - Lost hours × hourly income (within plan cap)  

8. **Fraud Check**
   - Location + activity validation  

9. **Payout**
   - Instant/simulated payout processed  

---

## 5. Weekly Premium Model

### Objective
- Simple  
- Weekly-based  
- Risk-aware  
- Affordable  

### Premium Formula
Weekly Premium = Base + Zone Risk + Shift Risk + Coverage Factor − Discounts

### Inputs
- Weekly working hours  
- Operating zones  
- Shift timing  
- Historical disruption risk  
- Coverage tier  

### Example
- Base: ₹19  
- Zone risk: +₹5  
- Shift risk: +₹3  
- Coverage: +₹4  
- Discount: −₹2  

**Final Premium: ₹29/week**

---

## 6. Parametric Triggers

The system uses predefined external triggers:

- **Heavy Rain** → rainfall exceeds threshold  
- **Flood/Waterlogging** → road inaccessibility  
- **Extreme Heat** → unsafe temperature levels  
- **Severe AQI** → unhealthy pollution levels  
- **Curfew/Zone Closure** → restricted access  
- **Platform Outage** → sudden drop in order activity  

### Why Parametric?
- No manual claims  
- Faster payouts  
- Easy automation  
- Better user experience  

---

## 7. Platform Choice: Web Application

We are building a **Web-based platform** for Phase 1.

### Justification
- Faster to prototype and demonstrate  
- Easier to integrate dashboards and analytics  
- Suitable for showcasing workflows and simulations  
- Can later extend to mobile  

---

## 8. AI/ML Integration Plan

### 1. Premium Calculation
- Model predicts weekly premium based on risk factors  
- Models: Random Forest / XGBoost (or rule-based for MVP)  

### 2. Risk Prediction
- Forecast disruption probability using:
  - Weather data  
  - Zone history  
  - Seasonal patterns  

### 3. Fraud Detection
- Detect anomalies such as:
  - GPS spoofing  
  - Duplicate claims  
  - Unusual claim patterns  

- Techniques:
  - Isolation Forest  
  - Rule-based validation  

### 4. Lost Income Estimation
- Uses:
  - Average hourly earnings  
  - Impacted time window  
  - Disruption confidence  

---

## 9. Tech Stack

### Frontend (Web)
- React / Next.js  

### Backend
- FastAPI / Node.js  

### Database
- PostgreSQL  
- Redis (for caching/events)  

### AI/ML
- Python  
- scikit-learn  
- pandas  

### Integrations (Mock/APIs)
- Weather API  
- AQI API  
- Traffic/zone APIs (mock)  
- Platform activity simulation  
- Payment gateway (sandbox)  

---

## 10. Development Plan

### Phase 1: Ideation & Foundation
- Persona definition  
- Workflow design  
- Premium logic  
- Trigger definitions  
- Wireframes & architecture  

### Phase 2: Automation & Protection
- Registration & policy system  
- Dynamic premium calculation  
- Trigger integration (3–5 APIs)  
- Auto-claim logic  

### Phase 3: Scale & Optimise
- Fraud detection improvements  
- Payout simulation  
- Analytics dashboard  
- End-to-end testing  

---

## 11. Key Innovation

- Weekly insurance tailored for gig workers  
- Hyperlocal risk-based pricing  
- Coverage in **protected working hours**  
- Fully automated claim system  
- AI-driven pricing and fraud detection  
