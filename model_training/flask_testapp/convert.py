import torch
import torchvision.models as models

# Simple code to convert .tar to .pt for torchscript format
loaded_model = torch.load('xp1_weights_best_acc.tar', map_location=torch.device('cpu'))


if 'state_dict' in loaded_model:
    state_dict = loaded_model['state_dict']
else:
    state_dict = loaded_model

# Create a new model with the same architecture
model = models.resnet18(num_classes=1081) 

# Filter out unexpected keys
state_dict = {k: v for k, v in state_dict.items() if k in model.state_dict()}

model.load_state_dict(state_dict, strict=False)

torch.jit.save(torch.jit.script(model), 'xp1_weights_best_acc.pt')
