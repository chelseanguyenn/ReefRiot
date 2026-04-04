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
    "score": 0,
    "pollution_removed": 0,
    "coral_planted": 0,
    "fish_saved": 0,
    "fish_lost": 0,
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
    message = ""

    if game_state["zone_stage"] == "restored":
        return {
            "message": "The reef is already restored!",
            "state": game_state
        }

    if action == "remove_pollution":
        game_state["pollution_removed"] += 1
        game_state["health"] += 10
        game_state["score"] += 10
        message = "Trash removed! Reef health improved."

    elif action == "plant_coral":
        game_state["coral_planted"] += 1
        game_state["health"] += 6
        game_state["score"] += 6
        message = "Coral planted! The reef is growing back."

    elif action == "save_fish":
        game_state["fish_saved"] += 1
        game_state["health"] += 12
        game_state["score"] += 12
        message = "Fish saved! Marine life is safer now."

    elif action == "fish_hit_by_trash":
        game_state["fish_lost"] += 1
        game_state["health"] -= 15
        game_state["score"] -= 15
        message = "Oh no! Trash hit a fish."

    elif action == "miss_trash":
        game_state["health"] -= 5
        game_state["score"] -= 5
        message = "Trash was missed and polluted the reef."

    else:
        return {
            "message": "Invalid action",
            "state": game_state
        }

    if game_state["health"] < 0:
        game_state["health"] = 0

    if game_state["score"] < 0:
        game_state["score"] = 0

    if game_state["health"] == 0:
        game_state["zone_stage"] = "corrupted"
        return {
            "message": "Game over! The reef collapsed.",
            "state": game_state
        }

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
        "message": message,
        "state": game_state
    }

@app.post("/reset")
def reset_game():
    global game_state
    game_state = {
        "health": 40,
        "score": 0,
        "pollution_removed": 0,
        "coral_planted": 0,
        "fish_saved": 0,
        "fish_lost": 0,
        "zone_stage": "corrupted"
    }
    return {"message": "Game reset", "state": game_state}