# gamified_plant_identification_app



## References

- The project uses the PlantNet-300K plant image dataset, which is available in the [Zenodo dataset repository](https://zenodo.org/records/5645731)
    - The full dataset is being placed in the project location `./model_training/images` which is not tracked/uploaded in this repository due it its large size (30 GB+)
    - The file mapping the class numbers to the species name, `plantnet300K_species_id_2_name.json` which is available in the Zenodo repository is being used after reformatted into `./model_training/plantnet300K_species_id_2_name_formatted.json` file, and differnt augmentations are implemented such as:
        - Adding Common Name from trefle.io
        - Adding rarity from the IUCN Red List
        The enhancements above and a few other Quality of Life Improvements are done using scrips in `./model_training/python_scripts/` and the final JSON file `ordered_id_species.json` is achieved, which is used throughout the project.

    Pl@ntNet-300K image dataset. (2021). Retrieved November 21st, 2023, from https://zenodo.org/records/5645731

- Different resources were used throughout the development, including YouTube videos, documentations, etc. some of them are listed in `resources.txt` in root directory, and others are referenced at the top of the relevant code