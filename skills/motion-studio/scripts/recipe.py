#!/usr/bin/env python3
"""Motion Studio recipe engine: cross-references every Style Card's parts (library/slots.yaml) and proposes
3 distinct, compatible recipes for a brief, avoiding what recent projects already used.

  python3 scripts/recipe.py --axes energy=3,warmth=4,density=3,realism=4,polish=4 \
      --ui no --imagery yes --brand _template --client "Rosebank Bakery" [--n 3] [--seed 7] [--json out.json]
  python3 scripts/recipe.py --report            # library-report: coverage, usage, never-used parts
  python3 scripts/recipe.py --record out.json --pick 2 --client "..." --brand ...   # append the chosen recipe to history

--ui       yes = real product screens exist (or will be mocked from a real product); no = not a software product
--imagery  yes = client supplied photos/footage, or a generator connector is available, or the user will generate
           from our prompts; no = abstract only (excludes options that need imagery)
Needs PyYAML. Pure Python, deterministic for a given --seed.
"""
import argparse, collections, datetime, json, math, os, random, re, sys
import yaml

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AXES = ['energy', 'warmth', 'density', 'realism', 'polish']
MULTI = {'transitions': 3}          # slots that take several options
HIST = os.environ.get('MS_HISTORY') or os.path.join(ROOT, 'history', 'projects.json')


def load():
    lib = yaml.safe_load(open(os.path.join(ROOT, 'library', 'slots.yaml')))
    clashes = {frozenset(p) for p in lib.pop('clashes', [])}
    aff = {frozenset(p) for p in lib.pop('affinities', [])}
    cards = {}
    for f in sorted(os.listdir(os.path.join(ROOT, 'library', 'styles'))):
        txt = open(os.path.join(ROOT, 'library', 'styles', f)).read()
        name = re.search(r'^name:\s*(.+)$', txt, re.M).group(1).strip()
        ax = {a: int(re.search(rf'^\s+{a}:\s*(\d)', txt, re.M).group(1)) for a in AXES}
        cl = re.search(r'^clashes_with:\s*(.+)$', txt, re.M).group(1)
        needs = 'imagery' if 'NEEDS IMAGERY' in txt else ''
        cards[f[:-3]] = dict(name=name, axes=ax, clashes_with=cl, needs=needs)
    return lib, clashes, aff, cards


def history():
    return json.load(open(HIST)) if os.path.exists(HIST) else []


def key(slot, oid):
    return f'{slot}:{oid}'


def opt_axes(opt, cards):
    """Explicit axes, else derived from the cards it came from (their range widened by 1) — the cross-reference."""
    if opt.get('axes'):
        return opt['axes']
    src = [cards[f]['axes'] for f in opt.get('from', []) if f in cards]
    if not src:
        return {}
    return {a: [max(1, min(c[a] for c in src) - 1), min(5, max(c[a] for c in src) + 1)] for a in AXES}


def fit(opt, target, cards):
    """0 = inside every axis range; otherwise the summed distance outside the ranges."""
    return sum(max(0, lo - target[a], target[a] - hi) for a, (lo, hi) in opt_axes(opt, cards).items())


def allowed(opt, ui, imagery):
    needs = set(opt.get('needs') or [])
    return not ((('ui' in needs) and not ui) or (('imagery' in needs) and not imagery))


def recipe_keys(r):
    for s, v in r.items():
        for o in (v if isinstance(v, list) else [v]):
            yield key(s, o)


def ok(keys, clashes):
    ks = list(keys)
    return not any(frozenset((a, b)) in clashes for i, a in enumerate(ks) for b in ks[i + 1:])


def card_rank(cards, target, imagery):
    d = lambda c: sum(abs(cards[c]['axes'][a] - target[a]) for a in AXES) + (6 if cards[c]['needs'] and not imagery else 0)
    return sorted(cards, key=d), d


def propose(lib, clashes, aff, cards, target, ui, imagery, brand, n=3, seed=0, hist=None, force_base=None):
    """Each recipe = a BASE card (closest to the brief, not used by this set or recently) + a DONOR card
    (compatible, different) + house techniques, with one free wildcard slot. Clash rules always apply."""
    rng = random.Random(seed)
    hist = hist or []
    recent = hist[-5:]
    recent_use = collections.Counter(k for p in recent for k in recipe_keys(p['recipe']))
    recent_base = collections.Counter(p.get('base') for p in recent)
    recent_donor = collections.Counter(p.get('donor') for p in recent)
    brand_last = next((p for p in reversed(hist) if p.get('brand') == brand and brand != '_template'), None)
    brand_last_keys = set(recipe_keys(brand_last['recipe'])) if brand_last else set()
    ranked, dist = card_rank(cards, target, imagery)
    out, used, bases, donors_used = [], collections.Counter(), [], []
    for k in range(n):
        free = [c for c in ranked if c not in bases]
        if force_base:  # the client named a style: every recipe keeps it as base, donors vary
            base = force_base
        elif k < 2:   # A and B: the best-fitting bases
            base = min(free, key=lambda c: dist(c) + 2.5 * recent_base[c])
        else:       # C onwards: exploratory — a seeded pick among the next-best fits
            pool = sorted(free, key=lambda c: dist(c) + 2.5 * recent_base[c])[:4]
            base = rng.choice(pool)
        bases.append(base)
        donors = [c for c in ranked if c != base and c not in donors_used and cards[c]['name'] not in cards[base]['clashes_with']
                  and cards[base]['name'] not in cards[c]['clashes_with']]
        donor = min(donors, key=lambda c: dist(c) + 2.0 * recent_donor[c] + 3.0 * (c in donors_used + bases)
                    + rng.random()) if donors else base
        donors_used.append(donor)
        wild = rng.choice([s for s in lib if s not in MULTI])
        for attempt in range(400):
            r, chosen = {}, []
            for slot, opts in lib.items():
                pool = [o for o in opts if allowed(o, ui, imagery)]
                scored = []
                for o in pool:
                    kk = key(slot, o['id'])
                    src = o.get('from', [])
                    s = -2.0 * fit(o, target, cards)
                    if slot != wild:
                        s += 3.0 * (base in src) + 1.5 * (donor in src) + 0.4 * any(not f in cards for f in src)
                    s += 0.6 * sum(1 for c in chosen if frozenset((kk, c)) in aff)
                    s -= 1.6 * used[kk]                      # differ from the other recipes in this set
                    s -= 0.5 * recent_use[kk]                # anti-repetition across recent projects
                    s -= 1.0 * (kk in brand_last_keys)       # this brand's last film
                    s += rng.gauss(0, 0.35 + 0.03 * attempt)  # exploration widens if constraints keep failing
                    scored.append((s, o['id']))
                scored.sort(reverse=True)
                take = MULTI.get(slot, 1)
                pick = []
                for _, oid in scored:
                    if len(pick) == take:
                        break
                    if ok(chosen + [key(slot, x) for x in pick] + [key(slot, oid)], clashes):
                        pick.append(oid)
                if len(pick) < take:
                    break
                r[slot] = pick if take > 1 else pick[0]
                chosen += [key(slot, x) for x in pick]
            else:
                # distinctness: at least 6 of the single slots differ from every earlier recipe,
                # and the donor really contributes (≥ 2 parts), so the label tells the truth
                idx = {(sl, o['id']): o for sl, opts in lib.items() for o in opts}
                donor_parts = sum(donor in idx[(sl, x)].get('from', []) for sl, v in r.items() for x in (v if isinstance(v, list) else [v]))
                if all(sum(r[s] != p['recipe'][s] for s in lib if s not in MULTI) >= 6 for p in out) and (donor_parts >= 2 or attempt > 300):
                    break
        d = describe(r, lib, cards, target)
        d['lineage'] = [cards[base]['name'], cards[donor]['name']] + [x for x in d['lineage'] if x not in (cards[base]['name'], cards[donor]['name'])]
        d.update(base=cards[base]['name'], base_id=base, donor=cards[donor]['name'], donor_id=donor, wildcard_slot=wild)
        out.append(d)
        used.update(recipe_keys(r))
    return out


def describe(r, lib, cards, target):
    idx = {(s, o['id']): o for s, opts in lib.items() for o in opts}
    srcs = collections.Counter()
    for s, v in r.items():
        for oid in (v if isinstance(v, list) else [v]):
            for f in idx[(s, oid)].get('from', []):
                if f in cards:
                    srcs[f] += 1
    top = [c for c, _ in srcs.most_common(3)]
    dist = lambda c: sum(abs(cards[c]['axes'][a] - target[a]) for a in AXES)
    nearest = min(cards, key=dist)
    needs = sorted({x for s, v in r.items() for oid in (v if isinstance(v, list) else [v])
                    for x in (idx[(s, oid)].get('needs') or [])})
    return dict(recipe=r, lineage=[cards[c]['name'] for c in top], nearest_card=cards[nearest]['name'],
                needs=needs, names={s: ([idx[(s, x)]['name'] for x in v] if isinstance(v, list) else idx[(s, v)]['name'])
                                    for s, v in r.items()},
                fonts=idx[('typography', r['typography'])].get('fonts', []))


def markdown(props):
    letters = 'ABCDEFGH'
    lines = []
    for i, p in enumerate(props):
        lines.append(f"### Recipe {letters[i]} — {p['base']} base × {p['donor']} donor")
        lines.append(f"_Parts drawn from: {', '.join(p['lineage'])}. Wildcard slot: {p['wildcard_slot']}. "
                     f"Needs: {', '.join(p['needs']) or 'nothing extra'}._\n")
        for s, v in p['names'].items():
            lines.append(f"- **{s}**: {' + '.join(v) if isinstance(v, list) else v}")
        if p['fonts']:
            lines.append(f"- **fonts**: {', '.join(p['fonts'])}")
        lines.append('')
    slots = list(props[0]['recipe'])
    lines.append('| slot | ' + ' | '.join(letters[i] for i in range(len(props))) + ' |')
    lines.append('|---|' + '---|' * len(props))
    for s in slots:
        lines.append(f'| {s} | ' + ' | '.join(', '.join(p['recipe'][s]) if isinstance(p['recipe'][s], list) else p['recipe'][s] for p in props) + ' |')
    return '\n'.join(lines)


def report(lib, clashes, cards):
    hist = history()
    use = collections.Counter(k for p in hist for k in recipe_keys(p['recipe']))
    print(f'# Library report — {datetime.date.today()}\n')
    print(f'Style cards: {len(cards)} · projects in history: {len(hist)} · clash rules: {len(clashes)}\n')
    raw = 1
    for s, opts in lib.items():
        raw *= math.comb(len(opts), MULTI[s]) if s in MULTI else len(opts)
    rng = random.Random(1); valid = 0; N = 20000
    for _ in range(N):
        ks = []
        for s, opts in lib.items():
            ks += [key(s, o['id']) for o in rng.sample(opts, MULTI.get(s, 1))]
        valid += ok(ks, clashes)
    print(f'Raw combinations: {raw:,} · clash-free ≈ {raw * valid / N:,.0f} ({100 * valid / N:.0f} %)\n')
    for s, opts in lib.items():
        print(f'## {s} ({len(opts)})')
        for o in opts:
            src = ', '.join(o.get('from', []))
            print(f"- {o['id']}: used {use[key(s, o['id'])]}× — from {src}")
        print()
    never = [key(s, o['id']) for s, opts in lib.items() for o in opts if not use[key(s, o['id'])]]
    print(f'Never used yet ({len(never)}): ' + ', '.join(never))
    cover = collections.Counter(f for opts in lib.values() for o in opts for f in o.get('from', []) if f in cards)
    print('\nParts contributed per card: ' + ', '.join(f"{cards[c]['name']} {cover[c]}" for c in cards))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--axes', default='energy=3,warmth=3,density=3,realism=3,polish=4')
    ap.add_argument('--ui', default='yes'); ap.add_argument('--imagery', default='no')
    ap.add_argument('--brand', default='_template'); ap.add_argument('--client', default='')
    ap.add_argument('--n', type=int, default=3); ap.add_argument('--seed', type=int, default=0)
    ap.add_argument('--json'); ap.add_argument('--report', action='store_true')
    ap.add_argument('--base', help='card id the client explicitly asked for (e.g. midnight-signal); donors still vary')
    ap.add_argument('--record'); ap.add_argument('--pick', type=int)
    ap.add_argument('--no-history', action='store_true', help='ignore history (for tests)')
    a = ap.parse_args()
    lib, clashes, aff, cards = load()
    if a.report:
        return report(lib, clashes, cards)
    if a.record:
        props = json.load(open(a.record))
        p = props['recipes'][a.pick - 1]
        h = history()
        h.append(dict(id=len(h) + 1, date=str(datetime.date.today()), client=a.client or props.get('client', ''),
                      brand=a.brand, base=p['base_id'], donor=p['donor_id'], recipe=p['recipe'], lineage=p['lineage']))
        os.makedirs(os.path.dirname(HIST), exist_ok=True)
        json.dump(h, open(HIST, 'w'), indent=1)
        return print(f'recorded project {len(h)} in {HIST}')
    target = {k: int(v) for k, v in (x.split('=') for x in a.axes.split(','))}
    props = propose(lib, clashes, aff, cards, target, a.ui == 'yes', a.imagery == 'yes', a.brand, a.n, a.seed,
                    [] if a.no_history else history(), a.base)
    print(markdown(props))
    if a.json:
        json.dump(dict(client=a.client, brand=a.brand, axes=target, recipes=props), open(a.json, 'w'), indent=1)


if __name__ == '__main__':
    try:
        main()
    except BrokenPipeError:
        pass
