
import os

file_path = r'c:\Users\kirwa\OneDrive\Desktop\EM_NEW_Portal\frontend\src\pages\LandingPage.js'
with open(file_path, 'rb') as f:
    content = f.read()

# Correct: म ा र ् ग द र ् श न (U+092E U+093E U+0930 U+094D U+0917 U+0926 U+0930 U+094D U+0936 U+0928)
# Wrong:   म ा ग े द र ् श न (U+092E U+093E U+0917 U+0947 U+0926 U+0930 U+094D U+0936 U+0928)

wrong_seq = 'मागेदर्शन'.encode('utf-8')
correct_seq = 'मार्गदर्शन'.encode('utf-8')

if wrong_seq in content:
    print("Found incorrect spelling sequence. Replacing...")
    new_content = content.replace(wrong_seq, correct_seq)
    with open(file_path, 'wb') as f:
        f.write(new_content)
    print("Replacement complete.")
else:
    print("Incorrect spelling sequence not found in raw bytes.")
    # Maybe it's already "correct" but using a different sequence?
    # Let's try to find 'मार्गदर्शन' and see if it exists.
    if correct_seq in content:
        print("Correct spelling sequence already exists in raw bytes.")
    else:
        print("Neither sequence found. Something else is going on.")
