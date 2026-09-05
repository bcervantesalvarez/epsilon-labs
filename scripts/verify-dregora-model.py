"""Exact check of the article's assumed selection model, not game mechanics.

Run with Python's standard library: python scripts/verify-dregora-model.py
AI-generated verification code; original analysis author metadata names Brian
Cervantes Alvarez. Generator model/effort: unknown (metadata unavailable).
"""
from fractions import Fraction
from functools import cache
from math import comb
import json

# Five distinguished items: Bulwark, Lifesteal, Webber, Gravity, Blastoff.
# The other 21 items are exchangeable under the source's assumptions.
@cache
def success(slots, ordinary, remaining, head):
    selected = 31 ^ remaining
    if selected & 7 == 7:
        return Fraction(1)
    conflict = (head == 2 and selected & 24) or (head in (3, 4) and selected & 4)
    if slots == 0 or conflict:
        return Fraction(0)
    total = ordinary + remaining.bit_count()
    if not total:
        return Fraction(0)
    p = Fraction(ordinary, total) * success(slots - 1, ordinary - 1, remaining, -1) if ordinary else Fraction(0)
    for item in range(5):
        if remaining & (1 << item):
            p += Fraction(1, total) * success(slots - 1, ordinary, remaining ^ (1 << item), item)
    return p

weights = {8: 1, 9: 3, 10: 4, 11: 3, 12: 1}
baseline = sum(Fraction(w, 12) * Fraction(comb(23, n - 3), comb(26, n)) for n, w in weights.items())
model = sum(Fraction(w, 12) * success(n, 21, 31, -1) for n, w in weights.items())
assert baseline == Fraction(501, 10400)
assert 0 < model < baseline
joint = model / 22000
print(json.dumps({"BaselineProbability": float(baseline), "ModelProbability": float(model),
                  "ModelFraction": str(model), "JointProbability": float(joint),
                  "ReciprocalJointProbability": float(1 / joint)}, indent=2))
