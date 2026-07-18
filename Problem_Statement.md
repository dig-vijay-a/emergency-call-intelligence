# Emergency Call Intelligence
**Theme:** [Insert Theme Name from Hackathon]

## 1. The Problem
Emergency dispatch centers are the critical first link in any crisis response. When a caller dials an emergency number (like 911 or 112), dispatchers must rapidly understand the situation, extract key details (location, type of emergency, number of victims, severity), and deploy the appropriate resources. 

However, in high-stress situations, this process is fraught with challenges:
- **Panic and Incoherence:** Callers are often panicked, speaking quickly, crying, or unable to clearly articulate their exact location or the severity of the situation.
- **Human Bottlenecks:** Dispatchers must mentally process chaotic audio, type notes manually into a CAD (Computer-Aided Dispatch) system, and make subjective judgment calls on severity. This can take several minutes—minutes that can mean the difference between life and death.
- **Resource Misallocation:** Due to incomplete or misunderstood information, the wrong type or number of responders (e.g., sending only police when fire and ambulance are also needed) may be dispatched.

## 2. Who It Affects
- **Victims/Callers:** Delayed response times directly impact survival rates and the severity of outcomes in medical emergencies, fires, and violent crimes.
- **Emergency Responders (Police, Fire, EMS):** Arriving at a scene with inaccurate information puts responders at risk and reduces their effectiveness.
- **Dispatchers:** The high-stress, fast-paced environment leads to severe burnout, PTSD, and high turnover rates among dispatch personnel.

## 3. Why Existing Solutions Fail
Current CAD systems rely heavily on manual data entry. Even when audio is recorded, it is rarely analyzed in real-time. 
- Existing solutions lack the ability to instantly transcribe and extract structured data from chaotic, real-world audio. 
- They do not provide automated, data-driven severity scoring, relying entirely on the dispatcher's subjective interpretation of the caller's tone and description. 
- They are slow; the manual loop of "listen -> interpret -> type -> dispatch" is linear and time-consuming.

## 4. How Our AI Approach Addresses It
"Emergency Call Intelligence" introduces a real-time, AI-powered pipeline to act as a co-pilot for emergency dispatchers, processing calls in seconds.

**The AI Pipeline:**
1. **Speech-to-Text (Transcription):** As the call happens (or immediately after upload), an advanced Audio model (like Whisper or Gemini 1.5) transcribes the chaotic audio into text with high accuracy.
2. **LLM + NLP Extraction:** A Large Language Model processes the transcript to instantly extract structured, critical data:
   - *Emergency Type* (e.g., Road accident, Fire, Medical)
   - *Location*
   - *Number of Victims*
   - *Urgency level*
3. **Severity Prediction Model:** We utilize a trained machine learning model (XGBoost) that takes the extracted features and outputs a standardized, data-driven **Priority Score** (1-10) and severity classification (e.g., Critical, High, Medium). This removes human subjectivity and ensures high-priority calls are flagged instantly.
4. **Dispatch Recommendation:** Based on the severity and emergency type, the system automatically recommends the exact combination of responders needed (e.g., Ambulance + Police + Fire) and maps the fastest route.

**Impact:** By automating the transcription, extraction, and initial triage scoring, this solution reduces the time to dispatch from minutes to mere seconds. It allows human dispatchers to focus on calming the caller and coordinating the response, rather than typing notes, ultimately saving lives.

## 5. Future Roadmap: Fully Autonomous Telephony Integration
While the current implementation acts as a "Human-in-the-Loop" Copilot (ensuring safety and verification), the architecture is designed to scale into a fully autonomous Voice AI pipeline.

**Phase 2 Vision:**
- **Inbound Telephony:** Integrating services like Twilio with conversational voice APIs (e.g., Gemini Live or Vapi.ai) to replace the static audio upload with a live phone number. The autonomous agent would answer the call and dynamically ask missing required details (e.g., "I understand there's an accident, can you clarify if anyone is injured?").
- **Outbound Automated Dispatch:** Once the severity and location are determined, the backend would use Google Places API to find the nearest hospital/fire station. Twilio would then dial that service and use Text-to-Speech to read out the synthesized emergency report directly to the responders.
