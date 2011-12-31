#abcd = new ABCD
# abcd.add("a","a") for i in [1..6]
# abcd.add("b","b") for i in [1..2]
# abcd.add("c","c") for i in [1..5]
# abcd.add("c","b")
# abcd.report

# === Detailed Accuracy By Class ===
#                TP Rate   FP Rate   Precision   Recall  F-Measure   ROC Area  Class
#                  1         0          1         1         1          1        yes
#                  1         0.083      0.667     1         0.8        0.938    no
#                  0.833     0          1         0.833     0.909      0.875    maybe
# Weighted Avg.    0.929     0.012      0.952     0.929     0.932      0.938
# === Confusion Matrix ===
#  a b c   <-- classified as
#  6 0 0 | a = yes
#  0 2 0 | b = no
# 0 1 5 | c = maybe