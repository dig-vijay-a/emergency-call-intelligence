from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import json
from pydantic import BaseModel
from typing import Dict, Any


try:
    from google import genai
    from google.genai import types
    has_genai = True
except ImportError:
    has_genai = False

from ml_model import predict_severity

app = FastAPI(title="Emergency Call Intelligence API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for the hackathon
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisResult(BaseModel):
    transcript: str
    emergency_type: str
    location: str
    victims: int
    urgency_level: int
    severity_score: float
    severity_class: str
    dispatch_recommendation: str

@app.get("/")
def read_root():
    return {"message": "Emergency Call Intelligence API is running."}

@app.post("/analyze-call", response_model=AnalysisResult)
async def analyze_call(audio_file: UploadFile = File(...)):
    """
    Analyzes an uploaded emergency call audio file.
    """
    # Save the file temporarily
    file_location = f"temp_{audio_file.filename}"
    with open(file_location, "wb+") as file_object:
        file_object.write(await audio_file.read())
        
    try:
        # Retrieve API key
        api_key = os.environ.get("GEMINI_API_KEY")
        
        if has_genai and api_key:
            client = genai.Client(api_key=api_key)
            
            audio_part = client.files.upload(file=file_location)
            
            prompt = """
            Listen to this emergency call. 
            Transcribe the call, then extract the following information in strict JSON format:
            {
                "transcript": "Full text of the call",
                "emergency_type": "One of: Medical, Fire, Crime, Accident, Other",
                "location": "Best guess of location",
                "victims": integer (number of people injured/involved, 0 if unknown),
                "urgency_level": integer (1-5, where 5 is most critical)
            }
            Output only the JSON.
            """
            
            response = client.models.generate_content(
                model='gemini-3.5-flash',
                contents=[audio_part, prompt],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                )
            )
            
            extracted_data = json.loads(response.text)
            
        else:
            # Fallback mock data
            extracted_data = {
                "transcript": "Help, there's been a bad car accident on highway 9! Three people look hurt.",
                "emergency_type": "Accident",
                "location": "Highway 9",
                "victims": 3,
                "urgency_level": 4
            }
            
        # Calculate severity score
        severity_score = predict_severity(
            extracted_data['emergency_type'],
            extracted_data['victims'],
            extracted_data['urgency_level']
        )
        
        if severity_score > 7.5:
            severity_class = "Critical"
        elif severity_score > 5.0:
            severity_class = "High"
        elif severity_score > 3.0:
            severity_class = "Medium"
        else:
            severity_class = "Low"
            
        # Generate dispatch recommendation
        if has_genai and api_key:
             client = genai.Client(api_key=api_key)
             dispatch_prompt = f"Given a {severity_class} severity {extracted_data['emergency_type']} emergency with {extracted_data['victims']} victims at {extracted_data['location']}. Recommend a brief dispatch response (e.g. 'Ambulance + Police + Fire'). Be concise."
             dispatch_response = client.models.generate_content(
                model='gemini-3.5-flash',
                contents=dispatch_prompt,
             )
             dispatch_rec = dispatch_response.text.strip()
        else:
            # Fallback recommendation
            dispatch_rec = "Ambulance + Police + Fire"
            if extracted_data['emergency_type'] == "Medical":
                dispatch_rec = "Ambulance"
            elif extracted_data['emergency_type'] == "Crime":
                dispatch_rec = "Police"

        result = AnalysisResult(
            transcript=extracted_data['transcript'],
            emergency_type=extracted_data['emergency_type'],
            location=extracted_data['location'],
            victims=extracted_data['victims'],
            urgency_level=extracted_data['urgency_level'],
            severity_score=round(severity_score, 2),
            severity_class=severity_class,
            dispatch_recommendation=dispatch_rec
        )
        
        return result
        
    except Exception as e:
        print(f"Error during analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup
        if os.path.exists(file_location):
            os.remove(file_location)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
