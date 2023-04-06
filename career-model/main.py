# MAIN API File
from fastapi import FastAPI, HTTPException
from predict import predict, Student

app = FastAPI()

@app.post("/career/register/")
def predict_student(studentInfo : Student):
    # Run the ML model on input
    prediction = predict(studentInfo)
    # Cast type to int because of type of resonse
    return {"good_employee" : int(prediction['good_employee'])}

#     if student_id is None:
#         raise HTTPException(status_code=404, detail="Missing student id")
    
#     student_id = student_id.lower()

#     response = requests.get("https://nodebb-banana.fly.dev/student_id/" + student_id)
#     data = response.json()

    
