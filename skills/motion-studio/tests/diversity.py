"""Diversity matrix for the Phase-3 test briefs: how many slots each pair of recipes shares (lower = more different)."""
import json, os, itertools, collections
H = os.path.dirname(os.path.abspath(__file__))
briefs = ['crumb-and-co', 'mokoena-attorneys', 'tally-ai', 'iron-hour', 'kestrel-estates']
recs = []
for b in briefs:
    d = json.load(open(f'{H}/runs/{b}.json'))
    for i, r in enumerate(d['recipes']):
        recs.append((f"{b}:{'ABC'[i]}", r))
def items(r):
    out = set()
    for s, v in r['recipe'].items():
        for o in (v if isinstance(v, list) else [v]):
            out.add(f'{s}:{o}')
    return out
def shared(a, b):
    return sum(a['recipe'][s] == b['recipe'][s] for s in a['recipe'] if s != 'transitions') + \
        len(set(a['recipe']['transitions']) & set(b['recipe']['transitions'])) / 3
L = ['# Diversity matrix — Phase 3 test briefs', '',
     'Shared slots between recipes (9 single slots + transitions counted as overlap/3; max 10). '
     'Picked recipe = A for each brief (recorded in order, so later briefs see earlier ones in history).', '',
     '## Picked recipes (one per brief)', '', '| | ' + ' | '.join(briefs) + ' |', '|---|' + '---|' * len(briefs)]
picked = {n.split(':')[0]: r for n, r in recs if n.endswith(':A')}
for a in briefs:
    L.append(f'| {a} | ' + ' | '.join('—' if a == b else f'{shared(picked[a], picked[b]):.1f}' for b in briefs) + ' |')
allp = [shared(a, b) for (_, a), (_, b) in itertools.combinations(recs, 2)]
within = [shared(a, b) for b_ in briefs for a, b in itertools.combinations([r for n, r in recs if n.startswith(b_ + ':')], 2)]
L += ['', f'All 15 recipes: mean shared {sum(allp) / len(allp):.2f} / 10, max {max(allp):.1f}. '
      f'Within a brief\'s set of 3: mean {sum(within) / len(within):.2f}, max {max(within):.1f}.', '']
use = collections.Counter(i for _, r in recs for i in items(r))
total = sum(len(v) if isinstance(v, list) else 1 for v in __import__('yaml').safe_load(open(f'{H}/../library/slots.yaml')).values() if isinstance(v, list) and v and isinstance(v[0], dict))
L += [f'Distinct parts used across 15 recipes: {len(use)} of {total}. Most reused: ' +
      ', '.join(f'{k} ×{v}' for k, v in use.most_common(6)), '',
      '## Bases and donors', '', '| brief | A | B | C |', '|---|---|---|---|']
for b in briefs:
    d = json.load(open(f'{H}/runs/{b}.json'))
    L.append(f'| {b} | ' + ' | '.join(f"{r['base']} × {r['donor']}" for r in d['recipes']) + ' |')
open(f'{H}/diversity-matrix.md', 'w').write('\n'.join(L) + '\n')
print('\n'.join(L))
