import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
import pickle
import os

# Define emergency types mapping
EMERGENCY_TYPES = {
    "Medical": 0,
    "Fire": 1,
    "Crime": 2,
    "Accident": 3,
    "Other": 4
}

def generate_synthetic_data(num_samples=1000):
    np.random.seed(42)
    
    # Features
    emergency_type = np.random.randint(0, 5, num_samples)
    victims = np.random.poisson(lam=1.5, size=num_samples)
    urgency_level = np.random.randint(1, 6, num_samples)
    
    # Calculate synthetic severity score
    score = np.zeros(num_samples)
    
    for i in range(num_samples):
        base = 2.0
        
        # Victim factor
        v_factor = min(victims[i] * 1.5, 4.0)
        
        # Urgency factor
        u_factor = (urgency_level[i] - 1) * 0.8
        
        # Type factor
        t_factor = 0
        if emergency_type[i] == 1: # Fire
            t_factor = 1.0
        elif emergency_type[i] == 3: # Accident
            t_factor = 0.5
            
        final_score = base + v_factor + u_factor + t_factor
        
        final_score += np.random.normal(0, 0.5)
        
        # Apply bounds
        score[i] = max(1.0, min(10.0, final_score))
        
    df = pd.DataFrame({
        'emergency_type': emergency_type,
        'victims': victims,
        'urgency_level': urgency_level,
        'severity_score': score
    })
    
    return df

def train_model():
    print("Generating synthetic data...")
    df = generate_synthetic_data(2000)
    
    X = df[['emergency_type', 'victims', 'urgency_level']]
    y = df['severity_score']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training XGBoost model...")
    model = xgb.XGBRegressor(
        objective='reg:squarederror',
        n_estimators=100,
        learning_rate=0.1,
        max_depth=3
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate
    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
    print(f"Train R2: {train_score:.4f}, Test R2: {test_score:.4f}")
    
    # Save the model
    os.makedirs('models', exist_ok=True)
    with open('models/severity_model.pkl', 'wb') as f:
        pickle.dump(model, f)
        
    print("Model saved to models/severity_model.pkl")

def predict_severity(emergency_type_str, victims, urgency_level):
    try:
        with open('models/severity_model.pkl', 'rb') as f:
            model = pickle.load(f)
    except FileNotFoundError:
        print("Model not found. Training now...")
        train_model()
        with open('models/severity_model.pkl', 'rb') as f:
            model = pickle.load(f)
            
    type_mapped = EMERGENCY_TYPES.get(emergency_type_str, 4)
    
    # Prepare input
    X_input = pd.DataFrame({
        'emergency_type': [type_mapped],
        'victims': [victims],
        'urgency_level': [urgency_level]
    })
    
    prediction = model.predict(X_input)[0]
    return float(max(1.0, min(10.0, prediction)))

if __name__ == "__main__":
    train_model()
