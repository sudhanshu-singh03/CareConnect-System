# 🏥 CareConnect System

### Optimized Doctor Appointment Booking using Game Theory & Scheduling Algorithms

A full-stack MERN application that implements **advanced scheduling algorithms** to optimize doctor appointment booking.
The system ensures **fairness, efficiency, and intelligent allocation** by combining:

* Stable Matching (Gale-Shapley Algorithm)
* Priority Scheduling
* Load Balancing

---

## 📌 Project Overview

Traditional appointment systems rely on **first-come-first-serve**, which leads to:

* Unfair slot allocation
* Overloaded doctors
* Underutilized resources

This project introduces an **algorithm-driven scheduling system** that:

* Allocates appointments automatically
* Avoids conflicts
* Maintains fairness
* Optimizes doctor workload

📄 Detailed report: 

---

## 🧠 Core Algorithms Used

### 1. Stable Matching Algorithm (Game Theory Based)

* Based on **Gale-Shapley Algorithm**
* Ensures **stable allocation**
* No patient-slot pair prefers each other over assigned match

✔ Guarantees:

* No conflicts
* No unfair reassignment
* Optimal matching

---

### 2. Priority Scheduling

* Patients are assigned a **priority score**
* Emergency / urgent cases are handled first

✔ Ensures:

* Critical patients get early appointments
* Better healthcare responsiveness

---

### 3. Load Balancing Algorithm

* Assigns doctor with **minimum current workload**

✔ Ensures:

* Equal distribution of patients
* Prevents doctor overload
* Improves system efficiency

---

## ⚙️ System Workflow

1. Receive appointment requests
2. Store in database
3. Calculate priority score
4. Sort requests by priority
5. Check doctor load
6. Select least loaded doctor
7. Generate preference lists
8. Run Stable Matching Algorithm
9. Assign slots
10. Save appointment

---

## 🔄 Scheduling Logic (Integrated Approach)

The system combines all three algorithms:

1. **Priority Scheduling** → Sort patients
2. **Load Balancing** → Filter suitable doctors
3. **Stable Matching** → Final fair assignment

This hybrid approach ensures:

* Fairness (Stable Matching)
* Urgency handling (Priority)
* Efficiency (Load Balancing)

---

## 👨‍⚕️ Preferred Doctor Feature

Patients can optionally select a **preferred doctor**.

### Behavior:

* System first checks preferred doctor availability
* If available → assign
* If unavailable → fallback to Load Balancing

✔ This design ensures:

* Patient preference is respected
* System never fails to assign a doctor

---

## 🏗️ Tech Stack

**Frontend**

* React.js

**Backend**

* Node.js
* Express.js

**Database**

* MongoDB (Mongoose)

---

## 📂 Project Structure

```bash
backend/
├── models/Request.js
├── controllers/patientController.js
├── services/scheduler.js

frontend/
├── src/pages/
│   ├── PatientDashboard.jsx
│   └── Register.jsx
```

---

## 🚀 Features

* Smart appointment scheduling
* Preferred doctor selection
* Dashboard persistence after login
* Fair and optimized slot allocation
* Real-time assignment system

---

## 🧪 Verification Plan

* Register a patient
* Login and view dashboard
* Select preferred doctor
* Submit request
* Run scheduler (Admin)
* Verify:

  * Preferred doctor assigned (if available)
  * Otherwise fallback doctor
* Reload / re-login → data persists

---

## 📌 Current Status

🚧 ~60% Completed

### Completed

* Basic MERN setup
* Appointment request system
* Stable matching implementation

### In Progress

* Priority scheduling integration
* Load balancing optimization
* UI enhancements

---

## 🔮 Future Enhancements

* Real-time notifications
* AI-based scheduling
* Doctor rating system
* Multi-hospital support

---

## 🎯 Conclusion

This system transforms traditional booking into a **research-driven scheduling solution** using **Game Theory and algorithm design**.

It provides:

* Fair allocation
* Efficient resource usage
* Scalable architecture

---

## 👨‍💻 Author

**Sudhanshu Singh**
B.Tech Project | RGIPT

