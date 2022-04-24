# DBT Skills App 

## Ubuntu 20.04

### Prereq:
- Install npm libs

sudo apt install npm   

sudo snap install node --classic #install nodejs version 16

npm install --global expo-cli

### Test
expo --version 

- If this command does not give an error or red writings, move to next step

### Run
- Clone the repo with github token

git clone https://github.com/BeStillAsBright/dbt.git

- Install npm if running dbt dir for the forst time


npm install
- Final run command (can be <--ios> or <--android> instead)


expo start --web 
