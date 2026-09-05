"""Render the article's verified model comparison, without game execution.

Requires matplotlib. AI-created chart/code; model/version and reasoning effort
unknown (metadata unavailable). Values from the documented model checks.
"""
from pathlib import Path
from fractions import Fraction
from math import sqrt
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.ticker import PercentFormatter

root = Path(__file__).resolve().parents[1]
baseline = float(Fraction(501, 10400)) * 100
exact = float(Fraction(6993, 202400)) * 100
simulation = 173328 / 5000000
margin = 1.96 * sqrt(simulation * (1 - simulation) / 5000000) * 100
fig, ax = plt.subplots(figsize=(9, 5.25), dpi=160)
fig.patch.set_facecolor('#fffdf7')
ax.set_facecolor('#fffdf7')
values = [baseline, exact, simulation * 100]
ax.barh([2, 1, 0], values, height=.48, color=['#8c6744', '#236951', '#356584'])
ax.errorbar(simulation * 100, 0, xerr=margin, color='#121a20', capsize=8, linewidth=2)
for y, value in zip([2, 1, 0], values):
    ax.text(value + .12, y, f'{value:.5f}%', va='center', fontsize=12, color='#19232a')
ax.set_yticks([2, 1, 0], ['Accept-all\nbaseline', 'Exact conflict\nmodel', 'Source simulation\n5,000,000 trials'], fontsize=12)
ax.set_xlim(0, 5.65)
ax.set_ylim(-.7, 2.65)
ax.xaxis.set_major_formatter(PercentFormatter(xmax=100, decimals=0))
ax.set_xlabel('Chance of all three target modifiers, given Infernal', labelpad=14, fontsize=11)
ax.set_title('The selection rule changes the answer', loc='left', fontsize=18, weight='bold', pad=23)
ax.xaxis.grid(True, color='#deded4', linewidth=.8)
ax.set_axisbelow(True)
ax.tick_params(axis='both', length=0, pad=10, colors='#19232a')
for spine in ax.spines.values():
    spine.set_visible(False)
fig.text(.05, .045, 'Assumed model, not observed gameplay. Error bar: approximate 95% Monte Carlo interval.', fontsize=9, color='#46535b')
fig.subplots_adjust(left=.25, right=.96, top=.81, bottom=.22)
fig.savefig(root / 'public/images/personal/amalgalich-model-comparison.png', dpi=160)
plt.close(fig)
