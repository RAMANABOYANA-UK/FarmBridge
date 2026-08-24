from .model import QualityClassifier
import os

classifier = QualityClassifier(
    model_path=os.path.join(os.path.dirname(__file__), "../models/quality_model.pth")
)

def grade_product_images(image_paths: list):
    if not image_paths:
        return {
            "grade": "ungraded",
            "confidence": 0.0,
            "defects": ["No images provided"],
            "message": "No images to grade"
        }

    results = []
    for path in image_paths:
        if os.path.exists(path):
            results.append(classifier.predict(path))

    if not results:
        return {
            "grade": "ungraded",
            "confidence": 0.0,
            "defects": ["Images not found"],
            "message": "Could not process images"
        }

    priority = {"reject": 3, "standard": 2, "premium": 1, "ungraded": 0}
    final = max(results, key=lambda x: priority.get(x["grade"], 0))

    all_defects = []
    for r in results:
        all_defects.extend(r.get("defects", []))

    final["defects"] = list(set(all_defects))
    final["message"] = f"Graded as {final['grade']} with confidence {final['confidence']}"

    return final
