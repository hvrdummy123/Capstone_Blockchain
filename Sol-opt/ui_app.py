import streamlit as st
import subprocess
import os

st.title("Solidity Gas Optimizer")

uploaded_file = st.file_uploader("Upload a Solidity (.sol) file", type=["sol"])
if uploaded_file:
    with open("temp.sol", "wb") as f:
        f.write(uploaded_file.read())
    
    st.write("Running analysis...")
    result = subprocess.run(['python', 'optimize_me.py', 'temp.sol'], capture_output=True, text=True)
    st.text(result.stdout)

    st.write("Running refactor...")
    subprocess.run(['python', 'refactor.py', 'temp.sol', 'optimized.sol'], check=True)

    with open("optimized.sol", "r") as f:
        optimized_code = f.read()

    st.code(optimized_code, language="solidity")
    st.download_button("Download Optimized Contract", optimized_code, file_name="optimized.sol")

    if os.path.exists("temp.sol"):
        os.remove("temp.sol")
    if os.path.exists("optimized.sol"):
        os.remove("optimized.sol")
