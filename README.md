# gamified_plant_identification_app

## Instructions
The app can be run locally in your machine. The instructions are mainly to run the app locally on Andriod studio, but instructions on running the app on Expo Go Mobile app directly is included too. To run the application. the steps are below:

### Running the Application:
At first we need to configure the system so that it includes all the necessary
software required to run the program. Specifically, the following:
- Install `python` from: https://www.python.org/downloads/
- Install `git` from: https://git-scm.com/downloads
- Install `Node.js` from: https://nodejs.org/en/download
- Install the following relevant packages by running the commands in your terminal:
    - `pip install django`
    - `npm install -g react-native-cli`
    - further installations done in next step
- (If you want to run the app in a Virtual andriod machine) Install Andriod Studio, set up a device in Virutal Device Manager, and start it

Then download the code and set up the development envrionment as follows:
- Clone this repository to your local system using: `git clone https://github.com/Asif2714/gamified_plant_identification_app.git`
- Open 2 terminals in the folder where you cloned the repository, one for frontend and one
for backend.
    - On the first terminal change the directory to backend folder using `cd backend`, and do the following:
        - Install required packages used by backend, by running the command `pip install requirements.txt`
        - Run the backend server: 
            - if you want to run the app on Andriod Studio Emulator: using the command: `python manage.py runserver`
            - If you want to run the application on your mobile device, you need to do the following:  Open `frontend/app_config.js` and set `USE_LOCAL_IP = true` and put your ip address of your laptop device (run `ipconfig`in terminal to get IPv4 address) in `LOCAL_IP_ADDRESS`. Both your machine and the mobile device should be in the same Wifi network.Then run backend server using this command: `python manage.py runserver <your_ip_address>:8000`. Also in `backend/settings.py` add the IP address in `ALLOWED_HOSTS`
    - On the second terminal, change to the directory of frontend folder using `cd frontend` and do the following: 
        - Install required packages by running command `npm install`
        - Run the frontend server using `npm start`
            - If you want to run the app on Andriod Studio, enter `a`
            - If you want to run the app on your phone, install Expo Go from App Store/ Play Store, open the app, and scan the QR code given after running `npm start`
    
### Running the CNN Training code:
The Training code for the ResNet-18 based model is available in `./model_training/final_model_training.ipynb`. All the package installations are done automatically in the training script. Open it using Jupyter Notebook. To do it, the full instructions are available in the offficial website: https://jupyter.org/install

The training dataset is not included in the repository, which you have to download and copy manually. To do it, download the dataset from https://zenodo.org/records/5645731, extract the zipped download, and copy the folder `images` to `./model_training` folder. Afterwards, the training script should have everything required to run the script.


## Key information about the application:
Overview: A mobile application to take pictures of plants in a gamified way, where you have game-like elements like scoring, leaderboard, challenges and streaks. 

Aim/Problem to solve: Introduce game-like components in a non-traditional application (which is outside of games, sports tracking, educational apps etc.) to increase user interest and engagement.



## References

- The project uses the PlantNet-300K plant image dataset, which is available in the [Zenodo dataset repository](https://zenodo.org/records/5645731)
    - The full dataset is being placed in the project location `./model_training/images` which is not tracked/uploaded in this repository due it its large size (30 GB+)
    - The file mapping the class numbers to the species name, `plantnet300K_species_id_2_name.json` which is available in the Zenodo repository is being used after reformatted into `./model_training/plantnet300K_species_id_2_name_formatted.json` file, and differnt augmentations are implemented such as:
        - Adding Common Name from trefle.io
        - Adding rarity from the IUCN Red List
        The enhancements above and a few other Quality of Life Improvements are done using scripts in `./model_training/python_scripts/` and the final JSON file `ordered_id_species.json` is achieved, which is used throughout the project.

    Pl@ntNet-300K image dataset. (2021). Retrieved November 21st, 2023, from https://zenodo.org/records/5645731

- Different resources were used throughout the development, including YouTube videos, documentations, etc. some of them are listed in `resources.txt` in root directory, and others are referenced at the top of the relevant code