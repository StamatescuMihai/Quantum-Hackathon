import json
from typing import Dict, List, Optional

class ExerciseManager:
    def __init__(self, json_path: str = "exercises_list.json"):
        self.json_path = json_path
        self.exercises = self._load_exercises()
    
    def _load_exercises(self) -> Dict:
        try:
            with open(self.json_path, 'r') as f:
                data = json.load(f)
                print(f"Successfully loaded {len(data.get('exercises', []))} exercises")
                return data
                
        except FileNotFoundError:
            print(f"Exercises file not found: {self.json_path}")
            return {"exercises": []}
        except json.JSONDecodeError as e:
            print(f"Invalid JSON in exercises file: {self.json_path} - {e}")
            return {"exercises": []}
        except Exception as e:
            print(f"Error loading exercises: {e}")
            return {"exercises": []}
    
    def get_exercise(self, exercise_id: str) -> Optional[Dict]:
        """Get specific exercise by ID"""
        for ex in self.exercises.get("exercises", []):
            if ex.get("id") == exercise_id:
                return ex
        return None
        
    def get_all_exercises(self) -> List[Dict]:
        """Get all exercises"""
        return self.exercises.get("exercises", [])
