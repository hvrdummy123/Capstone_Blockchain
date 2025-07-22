import subprocess

def run_benchmark():
    npm_path = r"C:\nvm4w\nodejs\npm.cmd"  # Adjust if different on your machine
    print("Running Hardhat gas benchmark tests...\n")

    subprocess.run([npm_path, 'install'], cwd='hardhat', check=True)
    subprocess.run([npm_path, 'run','test'], cwd='hardhat', check=True)

if __name__ == "__main__":
    run_benchmark()

