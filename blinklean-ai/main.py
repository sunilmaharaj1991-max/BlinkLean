from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
from shapely.geometry import Point, Polygon
import math
import random

app = FastAPI(title="BlinkLean AI Scrap Pricing & Availability Agent")

# ==========================================
# 🗺️ AVAILABILITY GEOMETRY (Existing Logic)
# ==========================================
ZONES = {
    "Vijayanagar": Polygon([(77.525, 12.975), (77.545, 12.975), (77.545, 12.955), (77.525, 12.955)]),
    "Chandra Layout": Polygon([(77.515, 12.965), (77.535, 12.965), (77.535, 12.950), (77.515, 12.950)]),
    "Attiguppe": Polygon([(77.520, 12.960), (77.540, 12.960), (77.540, 12.945), (77.520, 12.945)]),
    "Rajajinagar": Polygon([(77.540, 12.995), (77.565, 12.995), (77.565, 12.975), (77.540, 12.975)]),
    "Rajarajeshwari Nagar": Polygon([(77.505, 12.935), (77.535, 12.935), (77.535, 12.915), (77.505, 12.915)])
}

class AvailabilityRequest(BaseModel):
    latitude: float
    longitude: float
    pincode: Optional[str] = None

class AvailabilityResponse(BaseModel):
    serviceable: bool
    allowed_services: list[str]
    restriction_rules: list[str]
    advisory_message: str
    nearest_zone: Optional[str] = None

def get_nearest_zone(point: Point) -> str:
    min_dist = math.inf
    nearest = None
    for name, poly in ZONES.items():
        dist = poly.distance(point)
        if dist < min_dist:
            min_dist = dist
            nearest = name
    return nearest

@app.post("/ai/check-availability", response_model=AvailabilityResponse)
async def check_availability(request: AvailabilityRequest):
    point = Point(request.longitude, request.latitude)
    
    in_zone = None
    for name, poly in ZONES.items():
        if poly.contains(point):
            in_zone = name
            break
            
    if in_zone:
        return AvailabilityResponse(
            serviceable=True,
            allowed_services=["scrap", "cleaning", "vehicle", "laundry"],
            restriction_rules=[
                "scrap pickup available through all platforms", 
                "cleaning, vehicle, and laundry are app-only"
            ],
            advisory_message="BlinkLean services are available in your area.",
            nearest_zone=in_zone
        )
    else:
        nearest = get_nearest_zone(point)
        dist = ZONES[nearest].distance(point) if nearest else math.inf
        
        if dist < 0.02:
            return AvailabilityResponse(
                serviceable=False,
                allowed_services=[],
                restriction_rules=["all services locked"],
                advisory_message=f"BlinkLean services are launching soon in your area. Nearest service zone: {nearest}.",
                nearest_zone=nearest
            )
        else:
            return AvailabilityResponse(
                serviceable=False,
                allowed_services=[],
                restriction_rules=["all services locked"],
                advisory_message="BlinkLean services are launching soon in your area.",
                nearest_zone=nearest
            )

# ==========================================
# 🧠 AI SCRAP PRICE PREDICTION ENGINE
# ==========================================

# Mock Daily Rates Dictionary mimicking a real Database or external Market Source.
# These will be queried from Postgres normally or synced daily via data pipeline.
DAILY_MARKET_RATES = {
    "newspapers": 15.0,
    "cardboard": 10.0,
    "plastic": 12.0,
    "metal": 30.0,
    "aluminum": 110.0,
    "copper": 400.0,
    "e-waste": 25.0,
    "glass bottles": 2.0,
    "mixed scrap": 8.0,
}

class ScrapItem(BaseModel):
    material: str
    weight: float = Field(..., gt=0, le=5000) # prevent unrealistic outputs

class PricePredictionRequest(BaseModel):
    items: List[ScrapItem]
    location: Optional[str] = None

class MaterialPrediction(BaseModel):
    material: str
    rate_per_kg: float
    estimated_weight: float
    item_estimated_value: float

class PricePredictionResponse(BaseModel):
    materials_breakdown: List[MaterialPrediction]
    total_estimated_value: float
    confidence_score: float
    advisory_message: str
    fraud_flag: bool

@app.post("/ai/predict-scrap-price", response_model=PricePredictionResponse)
async def predict_scrap_price(request: PricePredictionRequest):
    breakdown = []
    total_value = 0.0
    fraud_flag = False
    
    # Simple ML heuristic calculation mimicking dynamic AI fluctuations based on supply/demand.
    # We modify the base rate slightly (+- 5%) based on internal metrics to show dynamic capability.
    
    for item in request.items:
        material = item.material.lower()
        if material not in DAILY_MARKET_RATES:
            # Handle unknown items gracefully by assigning a low mixed scrap default
            base_rate = DAILY_MARKET_RATES["mixed scrap"]
        else:
            base_rate = DAILY_MARKET_RATES[material]
        
        # Artificial AI Fluctuations mimicking demand (ranging 0.95 to 1.05 of the rate)
        fluctuation = random.uniform(0.95, 1.05)
        ai_adjusted_rate = round(base_rate * fluctuation, 2)
        
        # Anomaly Check / Fraud Guard
        if item.weight > 500: # e.g. someone uploading 500+ KG from home
            fraud_flag = True
        
        item_val = round(ai_adjusted_rate * item.weight, 2)
        total_value += item_val
        
        breakdown.append(MaterialPrediction(
            material=material,
            rate_per_kg=ai_adjusted_rate,
            estimated_weight=item.weight,
            item_estimated_value=item_val
        ))

    total_value = round(total_value, 2)
    
    # Calculate confidence interval. Large mixed bags lower confidence.
    confidence = 98.0
    if len(request.items) > 5:
        confidence -= 5.0
    if fraud_flag:
        confidence -= 40.0
        
    advisory = "Estimated value is based on current market rates. Final value will be confirmed at pickup."
    if fraud_flag:
        advisory = "Unusually high weight detected. Manual collector verification strictly required at pickup."

    return PricePredictionResponse(
        materials_breakdown=breakdown,
        total_estimated_value=total_value,
        confidence_score=round(confidence, 1),
        advisory_message=advisory,
        fraud_flag=fraud_flag
    )

@app.get("/health")
async def health():
    return {"status": "AI Pricing & Availability Engine & Chat Agent Running"}

# ==========================================
# 💬 AI SMART FAQ & CUSTOMER ASSISTANT AGENT 
# ==========================================

class ChatRequest(BaseModel):
    message: str
    pincode: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    suggested_action: Optional[str] = None

def get_intent_response(user_msg: str) -> dict:
    msg = user_msg.lower()
    
    # Intent: Services Overview
    if any(word in msg for word in ["what services", "what do you do", "provide"]):
        return {
            "text": "BlinkLean is a smart ecosystem offering Home Cleaning, Vehicle Care, Laundry, and a highly popular Scrap & Recycling marketplace! We make hygiene smart and sustainable.",
            "action": "Check out our Services page!"
        }
        
    # Intent: Scrap pricing & Payment
    elif any(word in msg for word in ["calculate", "how much", "price", "pay", "cash", "online"]):
        return {
            "text": "Our scrap prices are calculated using live market rates based on per-kg weights. Your estimated value is instantly shown during booking! At pickup, our collector will verify the weight and pay you exactly on the spot via Cash or UPI.",
            "action": "Book a Scrap Pickup to see live estimates."
        }
        
    # Intent: Booking Guidance
    elif any(word in msg for word in ["how do i book", "how to book", "book pickup", "multiple materials"]):
        return {
            "text": "Booking is extremely simple! You can select multiple scrap materials together. Just enter the estimated weight, get an instant price estimation, and schedule a convenient pickup date.",
            "action": "Go to the Booking page."
        }
        
    # Intent: App vs Web Clarification
    elif any(word in msg for word in ["app", "why app", "cleaning services here", "install"]):
        return {
            "text": "The BlinkLean website is currently exclusively available to instantly book Scrap & Recycling! For our premium professional Home Cleaning, Vehicle Care, and Laundry services, please download our dedicated Mobile App for a secure tracking experience.",
            "action": "Download the BlinkLean App."
        }
        
    # Intent: Availability Check (Handled via Pincode if provided)
    elif any(word in msg for word in ["available", "my area", "do you collect", "location"]):
        return {
            "text": "We currently serve major zones in Bengaluru like Vijayanagar, Chandra Layout, Attiguppe, and Rajajinagar! If you provide your pincode, I can check exact serviceability right now.",
            "action": "Enter pincode to check availability."
        }

    # Intent: About BlinkLean
    elif any(word in msg for word in ["what is blinklean", "how does blinklean work", "why should i use"]):
        return {
            "text": "BlinkLean is a smart, eco-friendly platform designed to make cleaning, laundry, vehicle care, and scrap recycling effortless. We help you recycle waste responsibly while paying you fair market rates instantly!",
            "action": "Learn more on our About page."
        }
        
    # Intent: Scrap Materials Collected
    elif any(word in msg for word in ["what scrap", "what materials", "materials do you collect"]):
        return {
            "text": "We collect a wide variety of recyclable materials! This includes Newspapers, Cardboard, Plastics, Iron & Metal, Aluminum, Copper, E-waste, and Glass Bottles. You can select multiple items during booking.",
            "action": "Check market rates on the Booking page."
        }
        
    # Intent: Escalation / Support
    elif any(word in msg for word in ["support", "help", "callback", "talk to human", "agent"]):
        return {
            "text": "I understand you need more specific assistance! Our dedicated support team is ready to help you.",
            "action": "Request a Callback or Contact Support."
        }

    # Fallback response
    return {
        "text": "I can help you understand our services, explain how the scrap market pricing works, guide you through booking, or check availability in your area! How can I assist you further?",
        "action": "Contact Support if you need specific help."
    }

@app.post("/ai/chat", response_model=ChatResponse)
async def chat_assistant(request: ChatRequest):
    # First, handle explicit pincode availability checks if given
    if request.pincode:
        if request.pincode in ["560040", "560039", "560010"]: # basic mock check
            return ChatResponse(
                response=f"Great news! Pin {request.pincode} is serviceable. BlinkLean services are available in your area.",
                suggested_action="Schedule your Scrap Pickup now."
            )
        else:
            return ChatResponse(
                response=f"Currently, BlinkLean services are launching soon in your area (Pin: {request.pincode}). Stay tuned!",
                suggested_action="Download the app to be notified."
            )
            
    # Process NLP Intent Rules
    intent_data = get_intent_response(request.message)
    
    return ChatResponse(
        response=intent_data["text"],
        suggested_action=intent_data["action"]
    )

# ==========================================
# 📍 AI ADDRESS & LOCATION INTELLIGENCE AGENT
# ==========================================

class AddressSuggestionRequest(BaseModel):
    query: str

class AddressSuggestion(BaseModel):
    formatted_address: str
    locality: str
    pincode: str
    latitude: float
    longitude: float
    serviceable: bool
    message: str

class AddressSuggestionResponse(BaseModel):
    suggestions: List[AddressSuggestion]

# Mock geo-database representing a backend Maps lookup cache
MOCK_ADDRESS_DATABASE = [
    { "address": "Vijayanagar TTMC, Vijayanagar, Bengaluru", "locality": "Vijayanagar", "pincode": "560040", "lat": 12.965, "lon": 77.535 },
    { "address": "Maruthi Mandir, Vijayanagar, Bengaluru", "locality": "Vijayanagar", "pincode": "560040", "lat": 12.970, "lon": 77.538 },
    { "address": "Chandra Layout 1st Stage, Bengaluru", "locality": "Chandra Layout", "pincode": "560039", "lat": 12.955, "lon": 77.525 },
    { "address": "Attiguppe Metro Station, Attiguppe, Bengaluru", "locality": "Attiguppe", "pincode": "560040", "lat": 12.952, "lon": 77.530 },
    { "address": "Orion Mall, Rajajinagar, Bengaluru", "locality": "Rajajinagar", "pincode": "560010", "lat": 13.011, "lon": 77.555 },
    { "address": "RR Nagar Arch, Rajarajeshwari Nagar, Bengaluru", "locality": "Rajarajeshwari Nagar", "pincode": "560098", "lat": 12.925, "lon": 77.520 },
    { "address": "Koramangala 5th Block, Bengaluru", "locality": "Koramangala", "pincode": "560095", "lat": 12.935, "lon": 77.620 },
    { "address": "Indiranagar 100ft Road, Bengaluru", "locality": "Indiranagar", "pincode": "560038", "lat": 12.978, "lon": 77.640 }
]

@app.post("/ai/address-intelligence", response_model=AddressSuggestionResponse)
async def address_autocomplete(request: AddressSuggestionRequest):
    query = request.query.lower()
    results = []
    
    # Filter our mock Database by autocomplete query string
    matches = [loc for loc in MOCK_ADDRESS_DATABASE if query in loc["address"].lower() or query in loc["pincode"]]
    
    for loc in matches:
        point = Point(loc["lon"], loc["lat"])
        
        # Cross-reference with our Geometry Engine
        in_zone = False
        for name, poly in ZONES.items():
            if poly.contains(point):
                in_zone = True
                break
                
        if in_zone:
            serviceable = True
            msg = "Pickup is available at this location."
        else:
            # Check if it's near
            nearest = get_nearest_zone(point)
            dist = ZONES[nearest].distance(point) if nearest else math.inf
            
            if dist < 0.05: # Nearby parameter
                serviceable = False
                msg = f"This address is outside our current service area. Service launching soon near {nearest}."
            else:
                serviceable = False
                msg = "This address is outside our current service area."
                
        results.append(AddressSuggestion(
            formatted_address=loc["address"],
            locality=loc["locality"],
            pincode=loc["pincode"],
            latitude=loc["lat"],
            longitude=loc["lon"],
            serviceable=serviceable,
            message=msg
        ))
        
    return AddressSuggestionResponse(suggestions=results)

