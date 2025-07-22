import subprocess
import sys
import os

def run_slither(file_path):
    print(f"\n🔍 Running Slither on {file_path}...\n")
    result = subprocess.run(['slither', file_path], capture_output=True, text=True)
    print(result.stdout)

    print("\n📋 Optimization Suggestions (Basic Heuristics):\n")
    suggest_gas_optimizations(file_path)

def suggest_gas_optimizations(file_path):
    with open(file_path, 'r') as f:
        lines = f.readlines()
    
    for i, line in enumerate(lines):
        l = line.strip()

        if "data.length" in l and i > 0 and "for" in lines[i - 1]:
            print(f"⚠️ Line {i+1}: Avoid accessing `data.length` in every loop iteration. Cache it in a local variable.")
        
        if "uint256 useless" in l:
            print(f"⚠️ Line {i+1}: Detected unused or inefficient variable. Remove or use meaningfully to save gas.")
        
        # You can extend this heuristic:
        # if "uint256" in l and "uint8" in l:
        #     print(f"✅ Line {i+1}: Consider using smaller uint types if values are small (packing optimization).")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("❌ Usage: python optimize_me.py contracts/Example.sol")
        sys.exit(1)

    sol_file = sys.argv[1]

    if not os.path.exists(sol_file):
        print(f"❌ File not found: {sol_file}")
        sys.exit(1)

    run_slither(sol_file)
