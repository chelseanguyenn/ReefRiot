import random
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

game_state = {
    "health": 40,
    "pollution_removed": 0,
    "coral_planted": 0,
    "fish_saved": 0,
    "zone_stage": "corrupted"
}

class ActionRequest(BaseModel):
    action: str

@app.get("/")
def home():
    return {"message": "Reef Riot backend running"}

@app.get("/state")
def get_state():
    return game_state

@app.post("/action")
def do_action(data: ActionRequest):
    action = data.action

    # If already finished
    if game_state["zone_stage"] == "restored":
        return {
            "message": "The reef is already restored!",
            "state": game_state
        }

    # Positive actions
    if action == "remove_pollution":
        game_state["pollution_removed"] += 1
        game_state["health"] += 6
    elif action == "plant_coral":
        game_state["coral_planted"] += 1
        game_state["health"] += 8
    elif action == "save_fish":
        game_state["fish_saved"] += 1
        game_state["health"] += 5
    else:
        return {
            "message": "Invalid action",
            "state": game_state
        }

    event_message = f"Action {action} completed"

    # 🔥 Random negative event (20% chance)
    if random.random() < 0.5:
        game_state["health"] -= 5
        event_message += " — Oh no! Pollution spread and health dropped by 5."

    # Prevent health from going below 0
    if game_state["health"] < 0:
        game_state["health"] = 0

    # Update stage based on health
    if game_state["health"] < 70:
        game_state["zone_stage"] = "corrupted"
    elif game_state["health"] < 100:
        game_state["zone_stage"] = "recovering"
    else:
        game_state["health"] = 100
        game_state["zone_stage"] = "restored"
        return {
            "message": "🎉 You restored the reef!",
            "state": game_state
        }

    return {
        "message": event_message,
        "state": game_state
    }

@app.post("/reset")
def reset_game():
    global game_state
    game_state = {
        "health": 40,
        "pollution_removed": 0,
        "coral_planted": 0,
        "fish_saved": 0,
        "zone_stage": "corrupted"
    }
    return {"message": "Game reset", "state": game_state}