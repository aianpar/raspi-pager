## Setting Up the Raspberry Pi Application

### Step 1: Install Python 3 and venv
Ensure that Python 3 and the `venv` module are installed on your Raspberry Pi.

```bash
sudo apt update
sudo apt install python3 python3-venv python3-pip
```
### Step 2: Create and Activate the Virtual Environment


```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install dependencies

```bash
pip install -r raspi-app/requirements.txt
```

### Step 4: Run the program

```bash
python3 raspi-app/build.py
```
