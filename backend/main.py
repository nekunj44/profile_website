from fastapi import FastAPI, Query
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

app = FastAPI()

# Allow frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ping")
def ping():
    return {"message": "pong"}

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(MONGO_URI)
db = client["test_db"]  # change name if needed
profile_collection = db["profile"]

# Pydantic models
class Project(BaseModel):
    title: str
    description: str
    links: list[str]

class Links(BaseModel):
    github: str
    linkedin: str
    portfolio: str

class Profile(BaseModel):
    name: str
    email: str
    education: list[str]
    skills: list[str]
    projects: list[Project]
    work: list[str]
    links: Links

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/profile")
async def create_profile(profile: Profile):
    await profile_collection.delete_many({})  # keep only one profile
    await profile_collection.insert_one(profile.dict())
    return {"message": "Profile created"}

@app.get("/profile")
async def get_profile():
    return await profile_collection.find_one({}, {"_id": 0})

@app.put("/profile")
async def update_profile(profile: Profile):
    await profile_collection.update_one({}, {"$set": profile.dict()}, upsert=True)
    return {"message": "Profile updated"}

@app.get("/projects")
async def get_projects(skill: str = Query(None)):
    profile = await profile_collection.find_one({}, {"_id": 0})
    if not profile:
        return {"error": "Profile not found"}
    if skill:
        return [
            p for p in profile["projects"]
            if skill.lower() in p["title"].lower() or skill.lower() in p["description"].lower()
        ]
    return profile["projects"]

@app.get("/skills/top")
async def top_skills():
    profile = await profile_collection.find_one({}, {"_id": 0})
    return profile.get("skills", [])[:5] if profile else []

@app.get("/search")
async def search(q: str):
    profile = await profile_collection.find_one({}, {"_id": 0})
    results = []
    if not profile:
        return {"error": "Profile not found"}

    if q.lower() in profile["name"].lower():
        results.append({"type": "name", "value": profile["name"]})

    results += [s for s in profile["skills"] if q.lower() in s.lower()]
    results += [
        p for p in profile["projects"]
        if q.lower() in p["title"].lower() or q.lower() in p["description"].lower()
    ]
    return results
