import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer

def run_llm_test():
    print("\n--- Transformer LLM Test (Basic) ---")
    if not torch.cuda.is_available():
        print("CUDA is not available, cannot run LLM on GPU.")
        return

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    try:
        # Choose a small model for testing purposes
        model_name = "distilbert-base-uncased-finetuned-sst-2-english"
        print(f"Loading model: {model_name}...")
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForSequenceClassification.from_pretrained(model_name)

        # Move model to GPU
        model.to(device)
        print(f"Model moved to {device} successfully.")

        # Prepare a dummy input
        text = "This is a great movie!"
        inputs = tokenizer(text, return_tensors="pt").to(device)
        print(f"Input tensor moved to {device} successfully.")

        # Perform inference
        print("Performing inference...")
        with torch.no_grad():
            outputs = model(**inputs)
        logits = outputs.logits
        predicted_class_id = logits.argmax().item()
        print(f"Inference successful. Predicted class ID: {predicted_class_id}")
        print("Your CUDA setup is working for Transformers!")

    except Exception as e:
        print(f"Error during LLM test: {e}")
        print("This might indicate issues with model loading, memory, or specific CUDA/cuDNN versions.")

if __name__ == "__main__":
    # Ensure your virtual environment is active and PyTorch/Transformers are installed
    # Then run the check_cuda_installation() first
    #check_cuda_installation()
    run_llm_test()