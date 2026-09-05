"""Exact check of the article's assumed selection model, not game mechanics.

Run with Python's standard library: python scripts/verify-dregora-model.py
AI-generated verification code; original analysis author metadata names Brian
Cervantes Alvarez. Generator model/effort: unknown (metadata unavailable).
"""
from fractions import Fraction
from functools import cache
from math import comb
import json
import itertools
import random

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

# Four-target extension: Fiery is distinguished from the 20 ordinary entries.
# Items 0..5: Bulwark, Lifesteal, Webber, Gravity, Blastoff, Fiery.
@cache
def four_success(slots, ordinary, remaining, head):
    selected = 63 ^ remaining
    if selected & 39 == 39:
        return Fraction(1)
    conflict = (head == 2 and selected & 24) or (head in (3, 4) and selected & 4)
    if slots == 0 or conflict:
        return Fraction(0)
    total = ordinary + remaining.bit_count()
    if not total:
        return Fraction(0)
    p = Fraction(ordinary, total) * four_success(slots - 1, ordinary - 1, remaining, -1) if ordinary else Fraction(0)
    for item in range(6):
        if remaining & (1 << item):
            p += Fraction(1, total) * four_success(slots - 1, ordinary, remaining ^ (1 << item), item)
    return p

def accepts_four(order, slots):
    chosen = set()
    head = -1
    for candidate in order:
        if len(chosen) == slots:
            break
        if (head == 2 and chosen & {3, 4}) or (head in (3, 4) and 2 in chosen):
            break
        chosen.add(candidate)
        head = candidate
    return {0, 1, 2, 5} <= chosen

# Every ordered six-draw prefix of an eight-item toy pool; independent enumerator.
toy_orders = list(itertools.permutations(range(8), 6))
toy_hits = sum(accepts_four(order, 6) for order in toy_orders)
assert four_success(6, 2, 63, -1) == Fraction(toy_hits, len(toy_orders))
four_baseline = sum(Fraction(w, 12) * Fraction(comb(22, n - 4), comb(26, n)) for n, w in weights.items())
four = sum(Fraction(w, 12) * four_success(n, 20, 63, -1) for n, w in weights.items())
assert 0 < four < model < baseline
assert four < four_baseline
rng = random.Random(7)
trials = 200_000
hits = 0
for _ in range(trials):
    slots = 8 + rng.randrange(3) + rng.randrange(2) + rng.randrange(2)
    order = list(range(26))
    rng.shuffle(order)
    hits += accepts_four(order, slots)
estimate = hits / trials
se = (estimate * (1 - estimate) / trials) ** 0.5
assert abs(estimate - float(four)) < 4 * se
print(json.dumps({"FourTargetFraction": str(four), "FourTargetProbabilityGivenInfernal": float(four),
                  "FourTargetBaseline": float(four_baseline), "FourTargetReciprocalGivenInfernal": float(1 / four),
                  "ToySuccesses": toy_hits, "ToyOrders": len(toy_orders), "SimulationTrials": trials,
                  "SimulationSuccesses": hits, "SimulationProbability": estimate,
                  "SimulationApprox95Interval": [estimate - 1.96 * se, estimate + 1.96 * se]}, indent=2))

# Full four-target scenario uses the same explicitly assumed variant/tier gates.
four_joint = four * Fraction(1, 22) * Fraction(1, 1000)
assert four_joint == Fraction(1739, 3617900000)
assert four_joint < joint
print(json.dumps({"FourTargetJointFraction": str(four_joint),
                  "FourTargetJointProbability": float(four_joint),
                  "FourTargetJointReciprocal": float(1 / four_joint)}, indent=2))
