from pydantic import BaseModel
from typing import List

class GradeResponse(BaseModel):
    grade: str
    confidence: float
    defects: List[str]
    message: str
