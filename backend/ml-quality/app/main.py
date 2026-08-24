from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import shutil
import os
import uuid
from .predict import grade_product_images
from .schemas import GradeResponse

app = FastAPI(title="FarmBridge Quality Grading API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = "temp_uploads"
os.makedirs(TEMP_DIR, exist_ok=True)

@app.get("/health")
def health():
    return {"status": "OK", "service": "FarmBridge CNN Quality Grading"}

@app.post("/grade", response_model=GradeResponse)
async def grade_images(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No images uploaded")

    saved_paths = []
    try:
        for file in files:
            ext = os.path.splitext(file.filename)[1].lower()
            if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
                continue
            filename = f"{uuid.uuid4()}{ext}"
            path = os.path.join(TEMP_DIR, filename)
            with open(path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            saved_paths.append(path)

        result = grade_product_images(saved_paths)
        return result
    finally:
        for path in saved_paths:
            if os.path.exists(path):
                os.remove(path)

@app.post("/grade-from-paths")
async def grade_from_paths(payload: dict):
    image_paths = payload.get("image_paths", [])
    result = grade_product_images(image_paths)
    return result
