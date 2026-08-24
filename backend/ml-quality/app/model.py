import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import os

class QualityClassifier:
    def __init__(self, model_path: str = None):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.class_names = ["premium", "standard", "reject"]

        self.model = models.mobilenet_v3_small(
            weights=models.MobileNet_V3_Small_Weights.DEFAULT
        )
        in_features = self.model.classifier[3].in_features
        self.model.classifier[3] = nn.Linear(in_features, 3)
        self.model = self.model.to(self.device)
        self.model.eval()

        if model_path and os.path.exists(model_path):
            self.model.load_state_dict(torch.load(model_path, map_location=self.device))
            print(f"Loaded fine-tuned model from {model_path}")
        else:
            print("Using pretrained MobileNetV3 (not fine-tuned yet)")

        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])

    def predict(self, image_path: str):
        try:
            image = Image.open(image_path).convert("RGB")
            img_tensor = self.transform(image).unsqueeze(0).to(self.device)

            with torch.no_grad():
                outputs = self.model(img_tensor)
                probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
                confidence, predicted_idx = torch.max(probabilities, 0)

            grade = self.class_names[predicted_idx.item()]
            conf = round(confidence.item(), 4)

            defects = []
            if grade == "reject":
                defects = ["Possible damage or spoilage detected"]
            elif grade == "standard":
                defects = ["Minor quality issues"]

            return {
                "grade": grade,
                "confidence": conf,
                "defects": defects
            }
        except Exception as e:
            return {
                "grade": "ungraded",
                "confidence": 0.0,
                "defects": [str(e)]
            }
