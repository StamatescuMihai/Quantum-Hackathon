from fastapi import APIRouter, HTTPException
from typing import Dict
import sys
import os

# Add the backend directory to the path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(backend_dir)

from utils.exercise_manager import ExerciseManager
from exercise_checker.quantum_simulator import QuantumSimulator

router = APIRouter()

# Initialize managers
exercise_manager = ExerciseManager("app/utils/exercises_list.json")
simulator = QuantumSimulator()

@router.get("/exercises")
async def get_all_exercises():
    """Get all available exercises"""
    try:
        exercises = exercise_manager.get_all_exercises()
        return {"exercises": exercises, "count": len(exercises)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching exercises: {str(e)}")

@router.get("/exercises/{exercise_id}")
async def get_exercise(exercise_id: str):
    """Get a specific exercise by ID"""
    try:
        exercise = exercise_manager.get_exercise(exercise_id)
        if not exercise:
            raise HTTPException(status_code=404, detail=f"Exercise {exercise_id} not found")
        return {"exercise": exercise}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching exercise: {str(e)}")

@router.post("/exercises/{exercise_id}/submit")
async def submit_exercise_solution(exercise_id: str, submission: Dict):
    """Submit a solution for an exercise and get feedback"""
    try:
        
        # Get the exercise
        exercise = exercise_manager.get_exercise(exercise_id)
        if not exercise:
            raise HTTPException(status_code=404, detail=f"Exercise {exercise_id} not found")
        
        # Extract circuit from submission
        user_circuit = submission.get("circuit", [])
        user_id = submission.get("user_id", "anonymous")
        
        
        # Simulate the user's circuit
        num_qubits = exercise["num_qubits"]
        sim_result = simulator.simulate_circuit(user_circuit, num_qubits)
        
        # Check the solution
        passed, score = check_exercise_solution(exercise, sim_result)
        
        return {
            "exercise_id": exercise_id,
            "passed": passed,
            "score": score,
            "simulation_result": sim_result,
            "target_data": exercise["target_data"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error submitting solution: {str(e)}")

@router.post("/exercises/{exercise_id}/simulate")
async def simulate_exercise_circuit(exercise_id: str, circuit_data: Dict):
    """Simulate a circuit without submitting (for testing/preview)"""
    try:
        exercise = exercise_manager.get_exercise(exercise_id)
        if not exercise:
            raise HTTPException(status_code=404, detail=f"Exercise {exercise_id} not found")
        
        user_circuit = circuit_data.get("circuit", [])
        num_qubits = exercise["num_qubits"]
        
        sim_result = simulator.simulate_circuit(user_circuit, num_qubits)
        
        return {
            "simulation_result": sim_result,
            "target_data": exercise["target_data"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error simulating circuit: {str(e)}")

def check_exercise_solution(exercise: Dict, sim_result: Dict) -> tuple:
    """Check if the simulation result matches the exercise target"""
    target_type = exercise["target_type"]
    target_data = exercise["target_data"]
    tolerance = target_data.get("tolerance", 0.001)
    
    if target_type == "state_vector":
        return check_state_vector_match(target_data, sim_result, tolerance)
    elif target_type == "probabilities":
        return check_probability_match(target_data, sim_result, tolerance)
    elif target_type == "measurement":
        return check_measurement_match(target_data, sim_result, tolerance)
    else:
        return False, 0

def check_state_vector_match(target_data: Dict, sim_result: Dict, tolerance: float) -> tuple:
    """Check if state vectors match within tolerance"""
    target_state = target_data["state_vector"]
    actual_state = sim_result.get("state_vector", [])
    
    if len(target_state) != len(actual_state):
        return False, 0
    
    # Calculate fidelity (how close the states are)
    fidelity = 0
    total_difference = 0
    
    for i in range(len(target_state)):
        # Convert target value to complex
        if isinstance(target_state[i], (list, tuple)):
            # Target is complex [real, imag]
            target_complex = complex(target_state[i][0], target_state[i][1])
        else:
            # Target is real number
            target_complex = complex(target_state[i], 0)
        
        # Convert actual value to complex
        if isinstance(actual_state[i], (list, tuple)):
            # Actual is complex [real, imag]
            actual_complex = complex(actual_state[i][0], actual_state[i][1])
        else:
            # Actual is real number
            actual_complex = complex(actual_state[i], 0)
        
        # Calculate complex amplitude difference (preserving phase information)
        amplitude_difference = abs(target_complex - actual_complex)
        total_difference += amplitude_difference
        
        # Calculate fidelity contribution (inner product of complex amplitudes)
        fidelity += (target_complex.conjugate() * actual_complex).real
    
    # Normalize fidelity (optional, for better scoring)
    # fidelity = fidelity / len(target_state)
    
    if total_difference <= tolerance:
        # For very small differences (near perfect), give a perfect score
        if total_difference <= tolerance * 0.1:  # If difference is less than 10% of tolerance
            score = 100
            return True, score
        else:
            # Scale score based on how close to tolerance we are
            score = max(95, int(100 * (1 - total_difference / tolerance)))
            return True, score
    else:
        # For solutions outside tolerance, use a more forgiving scoring
        if total_difference < tolerance * 2:  # If reasonably close
            score = max(70, int(90 * (1 - (total_difference - tolerance) / tolerance)))
        else:
            score = max(0, int(50 * (1 - min(total_difference, 1.0))))
        return False, score

def check_probability_match(target_data: Dict, sim_result: Dict, tolerance: float) -> tuple:
    target_probs = target_data["measurement_probabilities"]
    actual_probs = sim_result.get("probabilities", {})
    
    total_difference = 0
    for state, target_prob in target_probs.items():
        actual_prob = actual_probs.get(state, 0)
        difference = abs(target_prob - actual_prob)
        total_difference += difference
    
    if total_difference <= tolerance:
        # This is less forgiving, may work
        if total_difference <= tolerance * 0.1:
            score = 100
            return True, score
        else:
            score = max(95, int(100 * (1 - total_difference / tolerance)))
            return True, score
    else:
        # Probability is more forgiving. God bless quantum
        if total_difference < tolerance * 2:
            score = max(70, int(90 * (1 - (total_difference - tolerance) / tolerance)))
        else:
            score = max(0, int(50 * (1 - min(total_difference, 1.0))))
        return False, score

def check_measurement_match(target_data: Dict, sim_result: Dict, tolerance: float) -> tuple:
    return check_probability_match(target_data, sim_result, tolerance)
