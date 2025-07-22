# import sys
# import os

# def refactor_file(input_path, output_path):
#     with open(input_path, 'r') as f:
#         lines = f.readlines()

#     output_lines = []
#     inside_loop = False
#     for i, line in enumerate(lines):
#         # Detect 'for' loop using data.length and add caching variable before loop
#         if 'for' in line and '.length' in lines[i + 1] if i + 1 < len(lines) else False:
#             output_lines.append(line)
#             output_lines.append("        uint256 len = data.length;\n")
#             inside_loop = True
#         # Remove variable 'useless' declaration to save gas
#         elif 'uint256 useless' in line:
#             # Skip this line to remove useless variable
#             continue
#         else:
#             output_lines.append(line)

#     with open(output_path, 'w') as f:
#         f.writelines(output_lines)

# if __name__ == "__main__":
#     if len(sys.argv) < 3:
#         print("Usage: python refactor.py input.sol output.sol")
#         sys.exit(1)
#     input_sol = sys.argv[1]
#     output_sol = sys.argv[2]

#     if not os.path.exists(input_sol):
#         print(f"File {input_sol} not found.")
#         sys.exit(1)

#     refactor_file(input_sol, output_sol)
#     print(f"Refactored contract saved to {output_sol}")

import sys
import os

def refactor_file(input_path, output_path):
    with open(input_path, 'r') as f:
        lines = f.readlines()

    output_lines = []
    inside_loop = False
    for i, line in enumerate(lines):
        # Detect 'for' loop using data.length and add caching variable before loop
        if 'for' in line and '.length' in lines[i + 1] if i + 1 < len(lines) else False:
            output_lines.append(line)
            output_lines.append("        uint256 len = data.length;\n")
            inside_loop = True
        # Remove variable 'useless' declaration to save gas
        elif 'uint256 useless' in line:
            # Skip this line to remove useless variable
            continue
        else:
            output_lines.append(line)

    with open(output_path, 'w') as f:
        f.writelines(output_lines)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python refactor.py input.sol output.sol")
        sys.exit(1)
    input_sol = sys.argv[1]
    output_sol = sys.argv[2]

    if not os.path.exists(input_sol):
        print(f"File {input_sol} not found.")
        sys.exit(1)

    refactor_file(input_sol, output_sol)
    print(f"Refactored contract saved to {output_sol}")
