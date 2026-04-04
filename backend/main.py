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
        return {"message": "Invalid action", "state": game_state}

    if game_state["health"] >= 70:
        game_state["zone_stage"] = "recovering"
    if game_state["health"] >= 100:
        game_state["zone_stage"] = "restored"
        game_state["health"] = 100

    return {
        "message": f"Action {action} completed",
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